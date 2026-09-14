import { create } from "zustand";
import {
  GREEN_MAX,
  GREEN_MIN,
  OVER_TIGHT,
  PSI_MAX,
  PSI_MIN,
  STEP_IDS,
  STEPS,
  TARGET_FLOW,
  TARGET_PSI,
  type InteractId,
  type Minigame,
  type StepId,
} from "./steps";
import { setMuted, sfxPlay, unlockAudio } from "./audio";
import { persistLang, readSavedLang, t, type Lang } from "./i18n";

export type Screen = "title" | "play" | "fail" | "pass" | "admire";

export type Toast = { id: number; text: string; kind: "info" | "ok" | "warn" | "danger" };

type Joint = "reg" | "hose";

type GameState = {
  screen: Screen;
  stepId: StepId;
  minigame: Minigame;
  lives: number;
  mistakes: number;
  startedAt: number;
  elapsed: number;
  muted: boolean;
  lang: Lang;
  toasts: Toast[];
  trauma: number;
  failReason: string;
  failTitle: string;

  capOff: boolean;
  capProgress: number;
  regulatorFitted: boolean;
  regulatorProgress: number;
  hoseFitted: boolean;
  hoseProgress: number;
  outletFitted: boolean;
  outletProgress: number;
  revealed: boolean;
  tightnessReg: number;
  tightnessHose: number;
  soap: Record<Joint, boolean>;
  leak: Record<Joint, boolean>;
  cylOpen: number;
  flowOpen: number;
  psi: number;
  flowLpm: number;
  wrenchSwing: number;
  gasLeak: number;
  bubbles: number;
  valveGrab: null | "cyl" | "flow" | "nut";
  codexOpen: boolean;
  codexId: string;
  codexYaw: number;
  codexPitch: number;
  codexDist: number;

  start: () => void;
  reset: () => void;
  tick: (dt: number) => void;
  interact: (id: InteractId) => void;
  primary: () => void;
  commitTighten: (value: number) => void;
  holdValve: (dt: number, pumping: boolean) => void;
  turnCylHandle: (ccwRad: number) => void;
  finishValve: () => void;
  grabCyl: () => void;
  releaseCyl: () => void;
  grabNut: () => void;
  grabFlow: () => void;
  turnFlowKnob: (dx: number) => void;
  releaseFlowKnob: () => void;
  setFlow: (v: number) => void;
  confirmFlow: () => void;
  closeMinigame: () => void;
  addTrauma: (v: number) => void;
  toggleMute: () => void;
  openCodex: () => void;
  closeCodex: () => void;
  pickCodex: (id: string) => void;
  turnCodex: (dx: number, dy: number) => void;
  zoomCodex: (delta: number) => void;
  openAdmire: () => void;
  closeAdmire: () => void;
  setLang: (lang: Lang) => void;
};

let toastSeq = 1;

const initialAssembly = {
  capOff: false,
  capProgress: 0,
  regulatorFitted: false,
  regulatorProgress: 0,
  hoseFitted: false,
  hoseProgress: 0,
  outletFitted: false,
  outletProgress: 0,
  revealed: false,
  tightnessReg: 0,
  tightnessHose: 0,
  soap: { reg: false, hose: false } as Record<Joint, boolean>,
  leak: { reg: false, hose: false } as Record<Joint, boolean>,
  cylOpen: 0,
  flowOpen: 0,
  psi: 0,
  flowLpm: 0,
  wrenchSwing: 0,
  gasLeak: 0,
  bubbles: 0,
  valveGrab: null as null | "cyl" | "flow" | "nut",
};

function toast(
  get: () => GameState,
  set: (p: Partial<GameState>) => void,
  key: string,
  kind: Toast["kind"] = "info",
  vars?: Record<string, string | number>,
) {
  const item: Toast = { id: toastSeq++, text: t(get().lang, key, vars), kind };
  set({ toasts: [...get().toasts.slice(-3), item] });
  window.setTimeout(() => {
    const cur = get();
    set({ toasts: cur.toasts.filter((t) => t.id !== item.id) });
  }, 2800);
}

function strike(get: () => GameState, set: (p: Partial<GameState>) => void, key: string, fatal = false) {
  const lives = get().lives - 1;
  sfxPlay.alarm();
  set({ lives, mistakes: get().mistakes + 1, trauma: Math.min(1, get().trauma + (fatal ? 0.85 : 0.45)) });
  if (fatal || lives <= 0) {
    sfxPlay.hiss(1.4);
    set({
      screen: "fail",
      failTitle: "fail.safety",
      failReason: key,
      gasLeak: 1,
      minigame: null,
    });
    return true;
  }
  toast(get, set, key, "danger");
  return false;
}

function advance(set: (p: Partial<GameState>) => void, get: () => GameState) {
  const i = STEP_IDS.indexOf(get().stepId);
  sfxPlay.ok();
  if (i >= STEP_IDS.length - 1) {
    set({ screen: "pass", minigame: null });
    sfxPlay.win();
    return;
  }
  const next = STEP_IDS[i + 1];
  set({ stepId: next, minigame: null });
  toast(get, set, `step.${next}.title`, "ok");
}

export const useGame = create<GameState>((set, get) => ({
  screen: "title",
  stepId: "remove_cap",
  minigame: null,
  lives: 3,
  mistakes: 0,
  startedAt: 0,
  elapsed: 0,
  muted: false,
  lang: readSavedLang(),
  toasts: [],
  trauma: 0,
  failReason: "",
  failTitle: "",
  codexOpen: false,
  codexId: "cylinder",
  codexYaw: 0.35,
  codexPitch: 0.12,
  codexDist: 2.35,
  ...initialAssembly,

  start() {
    unlockAudio();
    sfxPlay.click();
    set({
      screen: "play",
      stepId: "remove_cap",
      minigame: null,
      lives: 3,
      mistakes: 0,
      startedAt: performance.now(),
      elapsed: 0,
      toasts: [],
      trauma: 0,
      failReason: "",
      failTitle: "",
      codexOpen: false,
      ...initialAssembly,
    });
    toast(get, set, "toast.start", "info");
  },

  reset() {
    set({
      screen: "title",
      stepId: "remove_cap",
      minigame: null,
      toasts: [],
      trauma: 0,
      ...initialAssembly,
      codexOpen: false,
    });
  },

  tick(dt) {
    const s = get();
    if (s.screen !== "play") {
      if (s.trauma > 0) set({ trauma: Math.max(0, s.trauma - dt * 1.4) });
      return;
    }
    const elapsed = (performance.now() - s.startedAt) / 1000;
    let capProgress = s.capProgress;
    let regulatorProgress = s.regulatorProgress;
    let hoseProgress = s.hoseProgress;
    let outletProgress = s.outletProgress;
    let wrenchSwing = s.wrenchSwing;
    let psi = s.psi;
    let gasLeak = s.gasLeak;
    let bubbles = s.bubbles;
    const trauma = Math.max(0, s.trauma - dt * 1.6);

    if (s.capOff) capProgress = Math.min(1, capProgress + dt * 2.2);
    if (s.regulatorFitted) regulatorProgress = Math.min(1, regulatorProgress + dt * 2.0);
    if (s.hoseFitted) hoseProgress = Math.min(1, hoseProgress + dt * 2.0);
    if (s.outletFitted) outletProgress = Math.min(1, outletProgress + dt * 2.0);
    wrenchSwing = Math.max(0, wrenchSwing - dt * 2.2);
    gasLeak = Math.max(0, gasLeak - dt * 0.35);
    bubbles = Math.max(0, bubbles - dt * 0.5);

    const targetPsi = s.cylOpen > 0.8 ? TARGET_PSI : s.cylOpen * TARGET_PSI * 0.7;
    psi += (targetPsi - psi) * (1 - Math.exp(-3.2 * dt));

    set({ elapsed, capProgress, regulatorProgress, hoseProgress, outletProgress, wrenchSwing, psi, trauma, gasLeak, bubbles });
  },

  interact(id) {
    const s = get();
    if (s.screen !== "play" || s.minigame) return;
    const step = s.stepId;
    const highlights = STEPS.find((x) => x.id === step)!.highlights;
    if (!highlights.includes(id)) {
      toast(get, set, "toast.wrongPart", "warn");
      sfxPlay.click();
      return;
    }
    get().primary();
  },

  primary() {
    const s = get();
    if (s.screen !== "play") return;
    unlockAudio();
    switch (s.stepId) {
      case "remove_cap": {
        if (s.capOff) return;
        sfxPlay.cap();
        set({ capOff: true });
        window.setTimeout(() => {
          if (get().stepId === "remove_cap" && get().capOff) advance(set, get);
        }, 700);
        break;
      }
      case "hand_fit": {
        if (!s.capOff) {
          toast(get, set, "toast.capFirst", "warn");
          return;
        }
        if (s.regulatorFitted) return;
        sfxPlay.metal();
        set({ regulatorFitted: true });
        window.setTimeout(() => {
          if (get().stepId === "hand_fit") advance(set, get);
        }, 800);
        break;
      }
      case "wrench_reg": {
        if (!s.regulatorFitted) return;
        sfxPlay.wrench();
        set({ minigame: "tighten_reg", wrenchSwing: 1 });
        break;
      }
      case "fit_hose": {
        if (s.hoseFitted) return;
        sfxPlay.metal();
        set({ hoseFitted: true });
        window.setTimeout(() => {
          if (get().stepId === "fit_hose") advance(set, get);
        }, 750);
        break;
      }
      case "wrench_hose": {
        if (!s.hoseFitted) return;
        sfxPlay.wrench();
        set({ minigame: "tighten_hose", wrenchSwing: 1 });
        break;
      }
      case "soap_n2": {
        if (s.cylOpen < 0.8 || s.flowOpen < 0.8) {
          toast(get, set, "toast.valvesFirst", "warn");
          return;
        }
        sfxPlay.soap();
        const leakReg = s.tightnessReg < GREEN_MIN;
        set({
          soap: { ...s.soap, reg: true },
          leak: { ...s.leak, reg: leakReg },
          bubbles: leakReg ? 1 : 0.35,
        });
        if (leakReg) {
          strike(get, set, "toast.n2Leak");
          if (get().screen === "play") {
            set({ stepId: "wrench_reg", soap: { reg: false, hose: false }, tightnessReg: 0, minigame: null });
          }
        } else {
          toast(get, set, "toast.n2Ok", "ok");
          window.setTimeout(() => {
            if (get().stepId === "soap_n2") advance(set, get);
          }, 550);
        }
        break;
      }
      case "soap_hose": {
        if (!s.soap.reg) {
          toast(get, set, "toast.n2SoapFirst", "warn");
          return;
        }
        sfxPlay.soap();
        const leakHose = s.tightnessHose < GREEN_MIN;
        set({
          soap: { ...s.soap, hose: true },
          leak: { ...s.leak, hose: leakHose },
          bubbles: leakHose ? 1 : 0.35,
        });
        if (leakHose) {
          strike(get, set, "toast.hoseLeak");
          if (get().screen === "play") {
            set({
              stepId: "wrench_hose",
              soap: { ...get().soap, hose: false },
              tightnessHose: 0,
              minigame: null,
            });
          }
        } else {
          toast(get, set, "toast.soapDone", "ok");
          window.setTimeout(() => {
            if (get().stepId === "soap_hose") advance(set, get);
          }, 650);
        }
        break;
      }
      case "fit_outlet": {
        if (!s.soap.hose) {
          toast(get, set, "toast.soapFirst", "warn");
          return;
        }
        if (s.outletFitted) return;
        sfxPlay.metal();
        set({ outletFitted: true });
        toast(get, set, "toast.bagOn", "ok");
        window.setTimeout(() => {
          if (get().stepId === "fit_outlet") advance(set, get);
        }, 800);
        break;
      }
      case "press_chair": {
        if (!s.outletFitted) {
          toast(get, set, "toast.bagFirst", "warn");
          return;
        }
        if (s.revealed) return;
        sfxPlay.ok();
        set({ revealed: true });
        toast(get, set, "toast.goOut", "ok");
        window.setTimeout(() => {
          if (get().stepId === "press_chair") advance(set, get);
        }, 900);
        break;
      }
      case "open_cyl": {
        toast(get, set, "toast.cylHint", "info");
        break;
      }
      case "check_psi": {
        if (s.psi < PSI_MIN) {
          toast(get, set, "toast.psiLow", "warn");
          return;
        }
        if (s.psi > PSI_MAX) {
          strike(get, set, "toast.psiRange", false);
          return;
        }
        toast(get, set, "toast.psiOk", "ok", { psi: Math.round(s.psi).toLocaleString(get().lang === "en" ? "en-US" : "ko-KR") });
        advance(set, get);
        break;
      }
      case "open_flow": {
        if (s.cylOpen < 0.8) {
          toast(get, set, "toast.cylThenFlow", "warn");
          return;
        }
        toast(get, set, "toast.knobLeft", "info");
        break;
      }
      case "check_flow": {
        toast(get, set, "toast.knobSet", "info");
        break;
      }
    }
  },

  commitTighten(value) {
    const s = get();
    if (s.minigame !== "tighten_reg" && s.minigame !== "tighten_hose") return;
    const which = s.minigame === "tighten_hose" ? "hose" : "reg";
    sfxPlay.wrench();
    set({ wrenchSwing: 1, valveGrab: null });
    if (value > OVER_TIGHT) {
      strike(get, set, "toast.overTight");
      set({ minigame: null });
      return;
    }
    if (value < GREEN_MIN) {
      toast(get, set, "toast.tooLoose", "warn");
      sfxPlay.click();
      return;
    }
    if (value > GREEN_MAX && value <= OVER_TIGHT) {
      toast(get, set, "toast.aBitOver", "warn");
    } else {
      toast(get, set, "toast.tightOk", "ok");
    }
    if (which === "reg") set({ tightnessReg: value, minigame: null, valveGrab: null });
    else set({ tightnessHose: value, minigame: null, valveGrab: null });
    const after = get();
    if (after.cylOpen > 0.8 && after.flowOpen > 0.8) {
      set({ stepId: "soap_n2" });
      toast(get, set, "toast.soapAgain", "info");
    } else {
      advance(set, get);
    }
  },

  turnCylHandle(ccwRad) {
    const s = get();
    if (s.screen !== "play" || s.stepId !== "open_cyl") return;
    if (s.valveGrab !== "cyl") return;
    if (ccwRad < 0.004) return;
    if (ccwRad > 0.62) {
      strike(get, set, "toast.fastCyl", true);
      set({ gasLeak: 1, cylOpen: 1, valveGrab: null });
      return;
    }
    const cylOpen = Math.min(1, s.cylOpen + ccwRad * 0.52);
    set({ cylOpen });
    if (Math.random() < 0.14) sfxPlay.valve();
  },

  holdValve(dt, pumping) {
    const s = get();
    if (s.screen !== "play" || s.stepId !== "open_cyl") return;
    if (pumping) {
      strike(get, set, "toast.fastFlow", true);
      set({ gasLeak: 1, cylOpen: 1, valveGrab: null });
      return;
    }
    const cylOpen = Math.min(1, s.cylOpen + dt * 0.34);
    set({ cylOpen });
    if (Math.random() < 0.1) sfxPlay.valve();
  },

  grabCyl() {
    const s = get();
    if (s.screen !== "play") return;
    if (s.stepId !== "open_cyl") {
      toast(get, set, "toast.wrongHandle", "warn");
      return;
    }
    unlockAudio();
    set({ valveGrab: "cyl" });
  },

  grabNut() {
    const s = get();
    if (s.minigame !== "tighten_reg" && s.minigame !== "tighten_hose") return;
    unlockAudio();
    set({ valveGrab: "nut" });
  },

  releaseCyl() {
    const s = get();
    set({ valveGrab: null });
    if (s.stepId !== "open_cyl") return;
    get().finishValve();
  },

  finishValve() {
    const s = get();
    if (s.stepId !== "open_cyl") return;
    if (s.cylOpen < 0.85) {
      toast(get, set, "toast.cylMore", "warn");
      return;
    }
    sfxPlay.hiss(0.35);
    set({ cylOpen: 1, minigame: null, valveGrab: null });
    toast(get, set, "toast.cylOpen", "ok");
    advance(set, get);
  },

  grabFlow() {
    const s = get();
    if (s.screen !== "play") return;
    if (s.stepId !== "open_flow" && s.stepId !== "check_flow") {
      toast(get, set, "toast.wrongKnob", "warn");
      return;
    }
    if (s.cylOpen < 0.8) {
      toast(get, set, "toast.cylBeforeKnob", "warn");
      return;
    }
    unlockAudio();
    set({ valveGrab: "flow" });
  },

  turnFlowKnob(dx) {
    const s = get();
    if (s.valveGrab !== "flow") return;
    if (s.stepId !== "open_flow" && s.stepId !== "check_flow") return;
    // Right drag / clockwise = decrease; left drag = increase (open).
    const next = Math.max(0, Math.min(25, s.flowLpm - dx * 0.055));
    set({ flowLpm: next, flowOpen: next > 0.6 ? 1 : s.flowOpen });
    if (Math.abs(dx) > 2 && Math.random() < 0.18) sfxPlay.valve();
  },

  releaseFlowKnob() {
    const s = get();
    set({ valveGrab: null });
    if (s.stepId === "open_flow") {
      if (s.flowOpen > 0.8 && s.flowLpm > 2.2) {
        sfxPlay.ok();
        toast(get, set, "toast.flowOpen", "ok");
        advance(set, get);
      } else {
        toast(get, set, "toast.knobMore", "warn");
      }
      return;
    }
    if (s.stepId === "check_flow") get().confirmFlow();
  },

  setFlow(v) {
    set({ flowLpm: v });
  },

  confirmFlow() {
    const s = get();
    const v = s.flowLpm;
    if (Math.abs(v - TARGET_FLOW) > 1.5) {
      toast(get, set, "toast.flowOff", "warn", { target: TARGET_FLOW, v: v.toFixed(0) });
      return;
    }
    set({ flowLpm: TARGET_FLOW, minigame: null });
    toast(get, set, "toast.flowOk", "ok");
    advance(set, get);
  },

  closeMinigame() {
    set({ minigame: null, valveGrab: null });
  },

  addTrauma(v) {
    set({ trauma: Math.min(1, get().trauma + v) });
  },

  toggleMute() {
    const muted = !get().muted;
    set({ muted });
    setMuted(muted);
  },

  openCodex() {
    set({ codexOpen: true, valveGrab: null, codexYaw: 0.35, codexPitch: 0.12, codexDist: 2.35 });
  },

  closeCodex() {
    set({ codexOpen: false });
  },

  pickCodex(id) {
    set({ codexId: id, codexYaw: 0.35, codexPitch: 0.12, codexDist: 2.35 });
  },

  turnCodex(dx, dy) {
    if (!get().codexOpen) return;
    set({
      codexYaw: get().codexYaw + dx * 0.008,
      codexPitch: get().codexPitch + dy * 0.006,
    });
  },

  zoomCodex(delta) {
    if (!get().codexOpen) return;
    const next = Math.min(4.8, Math.max(0.52, get().codexDist * (1 + delta * 0.00115)));
    set({ codexDist: next });
  },

  openAdmire() {
    if (get().screen !== "pass" && get().screen !== "admire") return;
    set({ screen: "admire", codexOpen: false });
  },

  closeAdmire() {
    if (get().screen !== "admire") return;
    set({ screen: "pass" });
  },

  setLang(lang) {
    persistLang(lang);
    set({ lang });
  },
}));

declare global {
  interface Window {
    __gameTest?: {
      getStep: () => StepId;
      getScreen: () => Screen;
      start: () => void;
      primary: () => void;
      completeCurrent: () => void;
      getPsi: () => number;
      getFlow: () => number;
      dump: () => {
        screen: Screen;
        step: StepId;
        capOff: boolean;
        capP: number;
        reg: boolean;
        regP: number;
        hose: boolean;
        hoseP: number;
        combo: "parts" | "reg" | "hose" | "kit" | "silence";
      };
      snap: () => void;
      jumpValves: () => void;
      jumpTighten: (kind: "reg" | "hose") => void;
    };
  }
}

if (typeof window !== "undefined") {
  window.__gameTest = {
    getStep: () => useGame.getState().stepId,
    getScreen: () => useGame.getState().screen,
    start: () => useGame.getState().start(),
    primary: () => useGame.getState().primary(),
    getPsi: () => useGame.getState().psi,
    getFlow: () => useGame.getState().flowLpm,
    dump: () => {
      const s = useGame.getState();
      return {
        screen: s.screen,
        step: s.stepId,
        capOff: s.capOff,
        capP: +s.capProgress.toFixed(2),
        reg: s.regulatorFitted,
        regP: +s.regulatorProgress.toFixed(2),
        hose: s.hoseFitted,
        hoseP: +s.hoseProgress.toFixed(2),
        combo:
          s.revealed
            ? "silence"
            : s.outletFitted && s.outletProgress > 0.88
              ? "kit"
              : s.hoseFitted && s.hoseProgress > 0.88
                ? "hose"
                : s.regulatorFitted && s.regulatorProgress > 0.88
                  ? "reg"
                  : "parts",
        cylOpen: +s.cylOpen.toFixed(2),
        flow: +s.flowLpm.toFixed(1),
        psi: Math.round(s.psi),
        grab: s.valveGrab,
      };
    },
    snap: () => {
      useGame.setState({ capProgress: 1, regulatorProgress: 1, hoseProgress: 1, wrenchSwing: 0 });
    },
    jumpTighten(kind) {
      useGame.setState({
        screen: "play",
        stepId: kind === "hose" ? "wrench_hose" : "wrench_reg",
        minigame: kind === "hose" ? "tighten_hose" : "tighten_reg",
        capOff: true,
        capProgress: 1,
        regulatorFitted: true,
        regulatorProgress: 1,
        hoseFitted: kind === "hose",
        hoseProgress: kind === "hose" ? 1 : 0,
        tightnessReg: kind === "hose" ? 78 : 0,
        tightnessHose: 0,
        valveGrab: null,
        lives: 3,
        startedAt: performance.now(),
      });
    },
    jumpValves() {
      useGame.setState({
        screen: "play",
        stepId: "open_cyl",
        minigame: null,
        capOff: true,
        capProgress: 1,
        regulatorFitted: true,
        regulatorProgress: 1,
        hoseFitted: true,
        hoseProgress: 1,
        tightnessReg: 78,
        tightnessHose: 78,
        soap: { reg: false, hose: false },
        leak: { reg: false, hose: false },
        cylOpen: 0,
        flowOpen: 0,
        psi: 0,
        flowLpm: 0,
        valveGrab: null,
        lives: 3,
        startedAt: performance.now(),
      });
    },
    completeCurrent() {
      const g = useGame.getState();
      switch (g.stepId) {
        case "remove_cap":
        case "hand_fit":
        case "fit_hose":
        case "fit_outlet":
        case "press_chair":
          g.primary();
          break;
        case "open_flow":
          useGame.setState({ flowOpen: 1, flowLpm: 8, valveGrab: "flow" });
          useGame.getState().releaseFlowKnob();
          break;
        case "check_psi":
          useGame.setState({ psi: TARGET_PSI, cylOpen: 1 });
          g.primary();
          break;
        case "wrench_reg":
        case "wrench_hose":
          g.primary();
          window.setTimeout(() => useGame.getState().commitTighten(78), 40);
          break;
        case "soap_n2":
        case "soap_hose":
          g.primary();
          break;
        case "open_cyl":
          useGame.setState({ cylOpen: 1, psi: TARGET_PSI, valveGrab: null });
          useGame.getState().finishValve();
          break;
        case "check_flow":
          useGame.setState({ flowLpm: 15, flowOpen: 1, valveGrab: "flow" });
          useGame.getState().releaseFlowKnob();
          break;
      }
    },
  };
}
