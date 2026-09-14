import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { m as require_jsx_runtime, p as create } from "../_libs/@react-three/drei+[...].mjs";
import { a as TriangleAlert, c as Gauge, d as BookOpen, i as Volume2, l as Droplets, n as Wrench, o as Shield, r as VolumeX, s as RotateCcw, t as X, u as Check } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CrhU_R2-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var STEP_IDS = [
	"remove_cap",
	"hand_fit",
	"wrench_reg",
	"fit_hose",
	"wrench_hose",
	"open_cyl",
	"check_psi",
	"open_flow",
	"check_flow",
	"soap_n2",
	"soap_hose"
];
var STEPS = [
	{
		id: "remove_cap",
		index: 0,
		title: "보호캡 제거",
		hint: "실린더 상단 보호캡을 반시계 방향으로 풀어 제거하세요.",
		action: "캡 제거",
		highlights: ["cap"]
	},
	{
		id: "hand_fit",
		index: 1,
		title: "레귤레이터 수체결",
		hint: "레귤레이터·플로우미터 일체형을 밸브에 맞추고 시계 방향으로 손으로 끼우세요.",
		action: "손으로 체결",
		highlights: ["regulator"]
	},
	{
		id: "wrench_reg",
		index: 2,
		title: "레귤레이터 조이기",
		hint: "레귤레이터 너트를 시계 방향(오른쪽)으로 돌려 적당히 조이세요. 너무 세게 조이면 나사선이 손상됩니다.",
		action: "너트 오른쪽으로 조이기",
		highlights: ["wrench", "regulator"]
	},
	{
		id: "fit_hose",
		index: 3,
		title: "호스 연결",
		hint: "고압 호스를 플로우미터 출력구에 연결하세요.",
		action: "호스 연결",
		highlights: ["hose"]
	},
	{
		id: "wrench_hose",
		index: 4,
		title: "호스 조이기",
		hint: "호스 너트도 시계 방향(오른쪽)으로 돌려 적당히 조이세요.",
		action: "호스 너트 오른쪽으로",
		highlights: ["wrench", "hose"]
	},
	{
		id: "open_cyl",
		index: 5,
		title: "실린더 밸브 개방",
		hint: "회색 손잡이를 반시계 방향으로 천천히 꺾어 여세요. 급하게 돌리면 고압이 분출합니다.",
		action: "손잡이 반시계로 꺾기",
		highlights: ["valve_cyl"]
	},
	{
		id: "check_psi",
		index: 6,
		title: "압력 확인",
		hint: "고압 게이지 바늘이 약 2,000 PSI인지 확인한 뒤 게이지를 누르세요.",
		action: "게이지 확인",
		highlights: ["hp_gauge"]
	},
	{
		id: "open_flow",
		index: 7,
		title: "유량 밸브 개방",
		hint: "레귤레이터 옆 황동 부품 맨 위 금색 톱니 노브를 왼쪽으로 돌려 여세요.",
		action: "금색 노브 왼쪽으로",
		highlights: ["valve_flow"]
	},
	{
		id: "check_flow",
		index: 8,
		title: "유량 확인",
		hint: "금색 노브: 왼쪽이면 유량 증가, 오른쪽이면 감소. 15 L/min에 맞추고 손을 떼세요.",
		action: "노브로 15 L/min",
		highlights: ["flowmeter"]
	},
	{
		id: "soap_n2",
		index: 9,
		title: "비눗물 · 질소·레귤레이터",
		hint: "질소 실린더와 레귤레이터가 맞닿은 연결부에 비눗물을 바르세요.",
		action: "질소·레귤레이터에 바르기",
		highlights: ["soap", "joint_reg"]
	},
	{
		id: "soap_hose",
		index: 10,
		title: "비눗물 · 플로우미터·호스",
		hint: "플로우미터 출력구와 호스가 맞닿은 연결부에 비눗물을 바르세요. 기포가 없으면 통과입니다.",
		action: "플로우미터·호스에 바르기",
		highlights: ["soap", "joint_hose"]
	}
];
var TARGET_PSI = 2040;
var ctx = null;
var master = null;
var sfx = null;
var muted = false;
function ensure() {
	if (ctx) return ctx;
	ctx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: "interactive" });
	master = ctx.createGain();
	sfx = ctx.createGain();
	sfx.gain.value = .7;
	sfx.connect(master);
	master.connect(ctx.destination);
	master.gain.value = muted ? 0 : .85;
	return ctx;
}
function unlockAudio() {
	const ac = ensure();
	if (ac.state === "suspended") ac.resume();
}
function setMuted(next) {
	muted = next;
	if (master && ctx) master.gain.setTargetAtTime(next ? 0 : .85, ctx.currentTime, .02);
}
function noiseBuffer(ac, seconds) {
	const n = Math.floor(ac.sampleRate * seconds);
	const buf = ac.createBuffer(1, n, ac.sampleRate);
	const data = buf.getChannelData(0);
	for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
	return buf;
}
function beep(freq, dur, type, gain = .12, slide = 0) {
	const ac = ensure();
	if (ac.state === "suspended") return;
	const t = ac.currentTime;
	const osc = ac.createOscillator();
	const g = ac.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, t);
	if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
	g.gain.setValueAtTime(1e-4, t);
	g.gain.exponentialRampToValueAtTime(gain, t + .012);
	g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
	osc.connect(g);
	g.connect(sfx);
	osc.start(t);
	osc.stop(t + dur + .02);
}
var sfxPlay = {
	click() {
		beep(420, .06, "square", .05);
	},
	metal() {
		beep(180 + Math.random() * 40, .09, "sawtooth", .07, -80);
		beep(740, .05, "square", .03);
	},
	cap() {
		beep(220, .16, "triangle", .08, -90);
		beep(880, .08, "square", .04);
	},
	wrench() {
		beep(140, .05, "square", .06);
		beep(90, .08, "sawtooth", .05);
	},
	soap() {
		beep(920, .07, "sine", .05);
		beep(1240, .1, "sine", .03);
	},
	hiss(seconds = .8) {
		const ac = ensure();
		if (ac.state === "suspended") return;
		const t = ac.currentTime;
		const src = ac.createBufferSource();
		src.buffer = noiseBuffer(ac, seconds);
		const bp = ac.createBiquadFilter();
		bp.type = "bandpass";
		bp.frequency.value = 1800;
		const g = ac.createGain();
		g.gain.setValueAtTime(1e-4, t);
		g.gain.exponentialRampToValueAtTime(.22, t + .04);
		g.gain.exponentialRampToValueAtTime(1e-4, t + seconds);
		src.connect(bp);
		bp.connect(g);
		g.connect(sfx);
		src.start(t);
		src.stop(t + seconds);
	},
	alarm() {
		beep(880, .18, "square", .09);
		beep(660, .22, "square", .08);
	},
	ok() {
		beep(523, .1, "sine", .08);
		beep(784, .16, "sine", .07);
	},
	win() {
		beep(523, .12, "sine", .08);
		beep(659, .14, "sine", .08);
		beep(784, .22, "sine", .09);
	},
	valve() {
		beep(160, .12, "triangle", .06, -40);
	}
};
var toastSeq = 1;
var initialAssembly = {
	capOff: false,
	capProgress: 0,
	regulatorFitted: false,
	regulatorProgress: 0,
	hoseFitted: false,
	hoseProgress: 0,
	tightnessReg: 0,
	tightnessHose: 0,
	soap: {
		reg: false,
		hose: false
	},
	leak: {
		reg: false,
		hose: false
	},
	cylOpen: 0,
	flowOpen: 0,
	psi: 0,
	flowLpm: 0,
	wrenchSwing: 0,
	gasLeak: 0,
	bubbles: 0,
	valveGrab: null
};
function toast(get, set, text, kind = "info") {
	const item = {
		id: toastSeq++,
		text,
		kind
	};
	set({ toasts: [...get().toasts.slice(-3), item] });
	window.setTimeout(() => {
		set({ toasts: get().toasts.filter((t) => t.id !== item.id) });
	}, 2800);
}
function strike(get, set, reason, fatal = false) {
	const lives = get().lives - 1;
	sfxPlay.alarm();
	set({
		lives,
		mistakes: get().mistakes + 1,
		trauma: Math.min(1, get().trauma + (fatal ? .85 : .45))
	});
	if (fatal || lives <= 0) {
		sfxPlay.hiss(1.4);
		set({
			screen: "fail",
			failTitle: "안전 절차 위반",
			failReason: reason,
			gasLeak: 1,
			minigame: null
		});
		return true;
	}
	toast(get, set, reason, "danger");
	return false;
}
function advance(set, get) {
	const i = STEP_IDS.indexOf(get().stepId);
	sfxPlay.ok();
	if (i >= STEP_IDS.length - 1) {
		set({
			screen: "pass",
			minigame: null
		});
		sfxPlay.win();
		return;
	}
	const next = STEP_IDS[i + 1];
	set({
		stepId: next,
		minigame: null
	});
	toast(get, set, STEPS[i + 1].title, "ok");
}
var useGame = create((set, get) => ({
	screen: "title",
	stepId: "remove_cap",
	minigame: null,
	lives: 3,
	mistakes: 0,
	startedAt: 0,
	elapsed: 0,
	muted: false,
	toasts: [],
	trauma: 0,
	failReason: "",
	failTitle: "",
	codexOpen: false,
	codexId: "cylinder",
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
			...initialAssembly
		});
		toast(get, set, "보호캡부터 제거하세요.", "info");
	},
	reset() {
		set({
			screen: "title",
			stepId: "remove_cap",
			minigame: null,
			toasts: [],
			trauma: 0,
			...initialAssembly,
			codexOpen: false
		});
	},
	tick(dt) {
		const s = get();
		if (s.screen !== "play") {
			if (s.trauma > 0) set({ trauma: Math.max(0, s.trauma - dt * 1.4) });
			return;
		}
		const elapsed = (performance.now() - s.startedAt) / 1e3;
		let capProgress = s.capProgress;
		let regulatorProgress = s.regulatorProgress;
		let hoseProgress = s.hoseProgress;
		let wrenchSwing = s.wrenchSwing;
		let psi = s.psi;
		let gasLeak = s.gasLeak;
		let bubbles = s.bubbles;
		const trauma = Math.max(0, s.trauma - dt * 1.6);
		if (s.capOff) capProgress = Math.min(1, capProgress + dt * 2.2);
		if (s.regulatorFitted) regulatorProgress = Math.min(1, regulatorProgress + dt * 2);
		if (s.hoseFitted) hoseProgress = Math.min(1, hoseProgress + dt * 2);
		wrenchSwing = Math.max(0, wrenchSwing - dt * 2.2);
		gasLeak = Math.max(0, gasLeak - dt * .35);
		bubbles = Math.max(0, bubbles - dt * .5);
		const targetPsi = s.cylOpen > .8 ? TARGET_PSI : s.cylOpen * TARGET_PSI * .7;
		psi += (targetPsi - psi) * (1 - Math.exp(-3.2 * dt));
		set({
			elapsed,
			capProgress,
			regulatorProgress,
			hoseProgress,
			wrenchSwing,
			psi,
			trauma,
			gasLeak,
			bubbles
		});
	},
	interact(id) {
		const s = get();
		if (s.screen !== "play" || s.minigame) return;
		const step = s.stepId;
		if (!STEPS.find((x) => x.id === step).highlights.includes(id)) {
			toast(get, set, "지금은 이 부품을 조작할 단계가 아닙니다.", "warn");
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
			case "remove_cap":
				if (s.capOff) return;
				sfxPlay.cap();
				set({ capOff: true });
				window.setTimeout(() => {
					if (get().stepId === "remove_cap" && get().capOff) advance(set, get);
				}, 700);
				break;
			case "hand_fit":
				if (!s.capOff) {
					toast(get, set, "먼저 보호캡을 제거하세요.", "warn");
					return;
				}
				if (s.regulatorFitted) return;
				sfxPlay.metal();
				set({ regulatorFitted: true });
				window.setTimeout(() => {
					if (get().stepId === "hand_fit") advance(set, get);
				}, 800);
				break;
			case "wrench_reg":
				if (!s.regulatorFitted) return;
				sfxPlay.wrench();
				set({
					minigame: "tighten_reg",
					wrenchSwing: 1
				});
				break;
			case "fit_hose":
				if (s.hoseFitted) return;
				sfxPlay.metal();
				set({ hoseFitted: true });
				window.setTimeout(() => {
					if (get().stepId === "fit_hose") advance(set, get);
				}, 750);
				break;
			case "wrench_hose":
				if (!s.hoseFitted) return;
				sfxPlay.wrench();
				set({
					minigame: "tighten_hose",
					wrenchSwing: 1
				});
				break;
			case "soap_n2": {
				if (s.cylOpen < .8 || s.flowOpen < .8) {
					toast(get, set, "먼저 실린더 밸브와 유량 밸브를 여세요.", "warn");
					return;
				}
				sfxPlay.soap();
				const leakReg = s.tightnessReg < 68;
				set({
					soap: {
						...s.soap,
						reg: true
					},
					leak: {
						...s.leak,
						reg: leakReg
					},
					bubbles: leakReg ? 1 : .35
				});
				if (leakReg) {
					strike(get, set, "질소·레귤레이터 연결부에서 기포가 발생했습니다. 레귤레이터 너트를 다시 조이세요.");
					if (get().screen === "play") set({
						stepId: "wrench_reg",
						soap: {
							reg: false,
							hose: false
						},
						tightnessReg: 0,
						minigame: null
					});
				} else {
					toast(get, set, "질소·레귤레이터 쪽 기포 없음. 다음은 플로우미터·호스입니다.", "ok");
					window.setTimeout(() => {
						if (get().stepId === "soap_n2") advance(set, get);
					}, 550);
				}
				break;
			}
			case "soap_hose": {
				if (!s.soap.reg) {
					toast(get, set, "먼저 질소·레귤레이터 연결부에 비눗물을 바르세요.", "warn");
					return;
				}
				sfxPlay.soap();
				const leakHose = s.tightnessHose < 68;
				set({
					soap: {
						...s.soap,
						hose: true
					},
					leak: {
						...s.leak,
						hose: leakHose
					},
					bubbles: leakHose ? 1 : .35
				});
				if (leakHose) {
					strike(get, set, "플로우미터·호스 연결부에서 기포가 발생했습니다. 호스 너트를 다시 조이세요.");
					if (get().screen === "play") set({
						stepId: "wrench_hose",
						soap: {
							...get().soap,
							hose: false
						},
						tightnessHose: 0,
						minigame: null
					});
				} else {
					toast(get, set, "양쪽 모두 기포 없음. 누출이 없습니다. 통과합니다.", "ok");
					window.setTimeout(() => {
						if (get().stepId === "soap_hose") advance(set, get);
					}, 650);
				}
				break;
			}
			case "open_cyl":
				toast(get, set, "회색 손잡이를 반시계 방향으로 꺾어 여세요.", "info");
				break;
			case "check_psi":
				if (s.psi < 1800) {
					toast(get, set, "아직 압력이 충분히 오르지 않았습니다. 회색 손잡이를 끝까지 누르세요.", "warn");
					return;
				}
				if (s.psi > 2200) {
					strike(get, set, "압력 범위가 비정상입니다.", false);
					return;
				}
				toast(get, set, `고압 게이지 ${Math.round(s.psi).toLocaleString("ko-KR")} PSI — 2천 내외 정상.`, "ok");
				advance(set, get);
				break;
			case "open_flow":
				if (s.cylOpen < .8) {
					toast(get, set, "먼저 실린더 회색 손잡이를 여세요. 밸브는 2개입니다.", "warn");
					return;
				}
				toast(get, set, "금색 톱니 노브를 왼쪽으로 돌려 여세요.", "info");
				break;
			case "check_flow": toast(get, set, "노브를 돌려 15 L/min에 맞추세요. 왼쪽 증가 · 오른쪽 감소.", "info");
		}
	},
	commitTighten(value) {
		const s = get();
		if (s.minigame !== "tighten_reg" && s.minigame !== "tighten_hose") return;
		const which = s.minigame === "tighten_hose" ? "hose" : "reg";
		sfxPlay.wrench();
		set({
			wrenchSwing: 1,
			valveGrab: null
		});
		if (value > 92) {
			strike(get, set, "과도하게 조였습니다. 나사선이 손상될 수 있습니다. 적당히 조이세요.");
			set({ minigame: null });
			return;
		}
		if (value < 68) {
			toast(get, set, "헐겁습니다. 녹색 구간까지 더 조이세요.", "warn");
			sfxPlay.click();
			return;
		}
		if (value > 86 && value <= 92) toast(get, set, "조금 과하지만 허용 범위입니다.", "warn");
		else toast(get, set, "적당히 체결되었습니다.", "ok");
		if (which === "reg") set({
			tightnessReg: value,
			minigame: null,
			valveGrab: null
		});
		else set({
			tightnessHose: value,
			minigame: null,
			valveGrab: null
		});
		const after = get();
		if (after.cylOpen > .8 && after.flowOpen > .8) {
			set({ stepId: "soap_n2" });
			toast(get, set, "다시 비눗물을 바르세요. 질소·레귤레이터부터입니다.", "info");
		} else advance(set, get);
	},
	turnCylHandle(ccwRad) {
		const s = get();
		if (s.screen !== "play" || s.stepId !== "open_cyl") return;
		if (s.valveGrab !== "cyl") return;
		if (ccwRad < .004) return;
		if (ccwRad > .62) {
			strike(get, set, "밸브를 급하게 꺾었습니다. 고압 질소가 순간 분출합니다.", true);
			set({
				gasLeak: 1,
				cylOpen: 1,
				valveGrab: null
			});
			return;
		}
		set({ cylOpen: Math.min(1, s.cylOpen + ccwRad * .52) });
		if (Math.random() < .14) sfxPlay.valve();
	},
	holdValve(dt, pumping) {
		const s = get();
		if (s.screen !== "play" || s.stepId !== "open_cyl") return;
		if (pumping) {
			strike(get, set, "밸브를 급하게 열었습니다. 고압 질소가 순간 분출합니다.", true);
			set({
				gasLeak: 1,
				cylOpen: 1,
				valveGrab: null
			});
			return;
		}
		set({ cylOpen: Math.min(1, s.cylOpen + dt * .34) });
		if (Math.random() < .1) sfxPlay.valve();
	},
	grabCyl() {
		const s = get();
		if (s.screen !== "play") return;
		if (s.stepId !== "open_cyl") {
			toast(get, set, "지금은 이 손잡이를 조작할 단계가 아닙니다.", "warn");
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
		if (s.cylOpen < .85) {
			toast(get, set, "아직 부족합니다. 손잡이를 반시계 방향으로 끝까지 꺾으세요.", "warn");
			return;
		}
		sfxPlay.hiss(.35);
		set({
			cylOpen: 1,
			minigame: null,
			valveGrab: null
		});
		toast(get, set, "실린더 밸브 개방 완료. 고압 게이지를 확인하세요.", "ok");
		advance(set, get);
	},
	grabFlow() {
		const s = get();
		if (s.screen !== "play") return;
		if (s.stepId !== "open_flow" && s.stepId !== "check_flow") {
			toast(get, set, "지금은 이 노브를 조작할 단계가 아닙니다.", "warn");
			return;
		}
		if (s.cylOpen < .8) {
			toast(get, set, "먼저 실린더 회색 손잡이를 여세요.", "warn");
			return;
		}
		unlockAudio();
		set({ valveGrab: "flow" });
	},
	turnFlowKnob(dx) {
		const s = get();
		if (s.valveGrab !== "flow") return;
		if (s.stepId !== "open_flow" && s.stepId !== "check_flow") return;
		const next = Math.max(0, Math.min(25, s.flowLpm - dx * .055));
		set({
			flowLpm: next,
			flowOpen: next > .6 ? 1 : s.flowOpen
		});
		if (Math.abs(dx) > 2 && Math.random() < .18) sfxPlay.valve();
	},
	releaseFlowKnob() {
		const s = get();
		set({ valveGrab: null });
		if (s.stepId === "open_flow") {
			if (s.flowOpen > .8 && s.flowLpm > 2.2) {
				sfxPlay.ok();
				toast(get, set, "유량 밸브 개방. 15 L/min으로 맞추세요.", "ok");
				advance(set, get);
			} else toast(get, set, "금색 노브를 왼쪽으로 더 돌려 여세요.", "warn");
			return;
		}
		if (s.stepId === "check_flow") get().confirmFlow();
	},
	setFlow(v) {
		set({ flowLpm: v });
	},
	confirmFlow() {
		const v = get().flowLpm;
		if (Math.abs(v - 15) > 1.5) {
			toast(get, set, `목표 유량은 15 L/min 입니다. 현재 ${v.toFixed(0)} L/min.`, "warn");
			return;
		}
		set({
			flowLpm: 15,
			minigame: null
		});
		toast(get, set, "유량 15 L/min, 호스 흐름 안정.", "ok");
		advance(set, get);
	},
	closeMinigame() {
		set({
			minigame: null,
			valveGrab: null
		});
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
		set({
			codexOpen: true,
			valveGrab: null
		});
	},
	closeCodex() {
		set({ codexOpen: false });
	},
	pickCodex(id) {
		set({ codexId: id });
	}
}));
if (typeof window !== "undefined") window.__gameTest = {
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
			combo: s.hoseFitted && s.hoseProgress > .88 ? "hose" : s.regulatorFitted && s.regulatorProgress > .88 ? "reg" : "parts",
			cylOpen: +s.cylOpen.toFixed(2),
			flow: +s.flowLpm.toFixed(1),
			psi: Math.round(s.psi),
			grab: s.valveGrab
		};
	},
	snap: () => {
		useGame.setState({
			capProgress: 1,
			regulatorProgress: 1,
			hoseProgress: 1,
			wrenchSwing: 0
		});
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
			startedAt: performance.now()
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
			soap: {
				reg: false,
				hose: false
			},
			leak: {
				reg: false,
				hose: false
			},
			cylOpen: 0,
			flowOpen: 0,
			psi: 0,
			flowLpm: 0,
			valveGrab: null,
			lives: 3,
			startedAt: performance.now()
		});
	},
	completeCurrent() {
		const g = useGame.getState();
		switch (g.stepId) {
			case "remove_cap":
			case "hand_fit":
			case "fit_hose":
				g.primary();
				break;
			case "open_flow":
				useGame.setState({
					flowOpen: 1,
					flowLpm: 8,
					valveGrab: "flow"
				});
				useGame.getState().releaseFlowKnob();
				break;
			case "check_psi":
				useGame.setState({
					psi: TARGET_PSI,
					cylOpen: 1
				});
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
				useGame.setState({
					cylOpen: 1,
					psi: TARGET_PSI,
					valveGrab: null
				});
				useGame.getState().finishValve();
				break;
			case "check_flow":
				useGame.setState({
					flowLpm: 15,
					flowOpen: 1,
					valveGrab: "flow"
				});
				useGame.getState().releaseFlowKnob();
		}
	}
};
var MODEL = {
	cylinder: "/models/cylinder.glb",
	regulator: "/models/regulator.glb",
	wrench: "/models/wrench.glb",
	hose: "/models/hose.glb",
	n2Reg: "/models/n2-reg.glb",
	n2RegHose: "/models/n2-reg-hose.glb"
};
var CODEX_ENTRIES = [
	{
		id: "cylinder",
		url: MODEL.cylinder,
		title: "질소 실린더",
		blurb: "40 cu ft 질소 탱크. 상단 목에 메인 밸브가 있습니다."
	},
	{
		id: "regulator",
		url: MODEL.regulator,
		title: "레귤레이터·플로우미터",
		blurb: "질소용 일체형. 고압 게이지와 유량 노브가 붙어 있습니다."
	},
	{
		id: "wrench",
		url: MODEL.wrench,
		title: "몽키스패너",
		blurb: "레귤레이터·호스 너트를 적당히 조일 때 사용합니다."
	},
	{
		id: "hose",
		url: MODEL.hose,
		title: "고압 호스",
		blurb: "플로우미터 출력구에 연결하는 질소 배출 호스입니다."
	},
	{
		id: "n2reg",
		url: MODEL.n2Reg,
		title: "질소 + 레귤레이터",
		blurb: "실린더에 레귤레이터를 체결한 상태입니다."
	},
	{
		id: "full",
		url: MODEL.n2RegHose,
		title: "질소 + 레귤레이터 + 호스",
		blurb: "호스까지 모두 연결한 완성 조립입니다."
	}
];
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] select-none", {
	variants: {
		variant: {
			primary: "bg-primary text-primary-fg hover:opacity-90",
			secondary: "bg-raised text-fg border border-border hover:bg-surface",
			ghost: "bg-transparent text-fg hover:bg-raised",
			danger: "bg-danger text-fg hover:opacity-90"
		},
		size: {
			md: "h-11 rounded-md px-4 text-sm",
			lg: "h-12 rounded-lg px-5 text-base",
			xl: "h-14 rounded-lg px-6 text-base",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function ValveHud() {
	const stepId = useGame((s) => s.stepId);
	if (stepId === "open_cyl") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandlePad, {});
	if (stepId === "check_psi") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GaugePad, {});
	if (stepId === "open_flow" || stepId === "check_flow") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KnobPad, {});
	return null;
}
function Pad({ title, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-auto mx-auto flex w-full max-w-md items-center gap-4 rounded-lg border border-border bg-surface/94 p-3",
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-fg",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs leading-snug text-muted",
				children: hint
			})]
		})]
	});
}
function HandlePad() {
	const open = useGame((s) => s.cylOpen);
	const grab = useGame((s) => s.valveGrab);
	const dragging = (0, import_react.useRef)(false);
	const lastAng = (0, import_react.useRef)(0);
	const host = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const angleOf = (e) => {
			const el = host.current;
			if (!el) return 0;
			const r = el.getBoundingClientRect();
			return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
		};
		const move = (e) => {
			if (!dragging.current) return;
			const a = angleOf(e);
			let d = a - lastAng.current;
			if (d > Math.PI) d -= Math.PI * 2;
			if (d < -Math.PI) d += Math.PI * 2;
			lastAng.current = a;
			useGame.getState().turnCylHandle(-d);
		};
		const end = () => {
			if (!dragging.current) return;
			dragging.current = false;
			useGame.getState().releaseCyl();
		};
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", end);
		window.addEventListener("pointercancel", end);
		return () => {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", end);
			window.removeEventListener("pointercancel", end);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pad, {
		title: "실린더 밸브",
		hint: "손잡이를 반시계 방향으로 꺾으세요. 급하게 돌리면 고압이 분출합니다.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			ref: host,
			type: "button",
			"aria-label": "실린더 밸브 손잡이 반시계로 돌리기",
			className: cn("relative grid size-28 shrink-0 place-items-center rounded-md border border-border bg-raised touch-none", grab === "cyl" && "border-primary"),
			onPointerDown: (e) => {
				e.preventDefault();
				const r = e.currentTarget.getBoundingClientRect();
				lastAng.current = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
				dragging.current = true;
				useGame.getState().grabCyl();
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 96 96",
				className: "size-24",
				"aria-hidden": true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "48",
						cy: "48",
						r: "40",
						fill: "none",
						stroke: "currentColor",
						className: "text-border",
						strokeWidth: "3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "48",
						cy: "48",
						r: "40",
						fill: "none",
						stroke: "currentColor",
						className: "text-primary",
						strokeWidth: "3",
						strokeDasharray: `${open * 251} 251`,
						strokeLinecap: "round",
						transform: "rotate(-90 48 48)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M68 22 A 30 30 0 0 0 28 22",
						fill: "none",
						stroke: "currentColor",
						className: "text-primary/70",
						strokeWidth: "2",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
						points: "24,22 32,18 32,26",
						className: "fill-primary/80"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						transform: `rotate(${-open * 220} 48 52)`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "44",
								y: "38",
								width: "8",
								height: "28",
								rx: "2",
								fill: "#6d757c"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "18",
								y: "48",
								width: "60",
								height: "10",
								rx: "5",
								fill: "#8b9399"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "20",
								cy: "53",
								r: "7",
								fill: "#9aa2a8"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "76",
								cy: "53",
								r: "7",
								fill: "#9aa2a8"
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute bottom-1 font-mono text-xs tabular-nums text-muted",
				children: [Math.round(open * 100), "%"]
			})]
		})
	});
}
function KnobPad() {
	const flow = useGame((s) => s.flowLpm);
	const stepId = useGame((s) => s.stepId);
	const grab = useGame((s) => s.valveGrab);
	const dragging = (0, import_react.useRef)(false);
	const lastX = (0, import_react.useRef)(0);
	const turn = -(flow / 25) * 260;
	const inRange = Math.abs(flow - 15) <= 1.5;
	(0, import_react.useEffect)(() => {
		const move = (e) => {
			if (!dragging.current) return;
			const dx = e.clientX - lastX.current;
			lastX.current = e.clientX;
			useGame.getState().turnFlowKnob(dx);
		};
		const end = () => {
			if (!dragging.current) return;
			dragging.current = false;
			useGame.getState().releaseFlowKnob();
		};
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", end);
		window.addEventListener("pointercancel", end);
		return () => {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", end);
			window.removeEventListener("pointercancel", end);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pad, {
		title: "유량 노브",
		hint: stepId === "open_flow" ? "금색 톱니를 왼쪽으로 밀어 여세요. 오른쪽은 잠금입니다." : "왼쪽 증가 · 오른쪽 감소. 15 L/min에서 손을 떼세요.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			"aria-label": "유량 노브 돌리기",
			className: cn("relative grid size-28 shrink-0 place-items-center rounded-md border border-border bg-raised touch-none", grab === "flow" && "border-primary", inRange && stepId === "check_flow" && "border-ok"),
			onPointerDown: (e) => {
				e.preventDefault();
				dragging.current = true;
				lastX.current = e.clientX;
				useGame.getState().grabFlow();
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 96 96",
				className: "size-24",
				"aria-hidden": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					transform: `rotate(${turn} 48 48)`,
					children: [
						Array.from({ length: 16 }).map((_, i) => {
							const a = i / 16 * Math.PI * 2;
							const x1 = 48 + Math.cos(a) * 28;
							const y1 = 48 + Math.sin(a) * 28;
							const x2 = 48 + Math.cos(a) * 36;
							const y2 = 48 + Math.sin(a) * 36;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1,
								y1,
								x2,
								y2,
								stroke: "#d7b45c",
								strokeWidth: "4",
								strokeLinecap: "round"
							}, i);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "48",
							cy: "48",
							r: "26",
							fill: "#c4a15a"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "48",
							cy: "48",
							r: "16",
							fill: "#e0c36a"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "46",
							y: "18",
							width: "4",
							height: "14",
							rx: "1",
							fill: "#f3e0a8"
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute bottom-1 font-mono text-xs tabular-nums text-muted",
				children: [flow.toFixed(0), " L"]
			})]
		})
	});
}
function GaugePad() {
	const psi = useGame((s) => s.psi);
	const needle = -135 + Math.min(1, psi / 3e3) * 270;
	const ok = psi >= 1800 && psi <= 2200;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pad, {
		title: "고압 게이지",
		hint: "바늘이 2,000 PSI 근처인지 확인한 뒤 게이지를 누르세요.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			"aria-label": "고압 게이지 확인",
			className: "relative grid size-28 shrink-0 place-items-center rounded-md border border-border bg-raised",
			onClick: () => useGame.getState().interact("hp_gauge"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 96 96",
				className: "size-24",
				"aria-hidden": true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "48",
						cy: "52",
						r: "34",
						fill: "#efe6d6"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "48",
						cy: "52",
						r: "34",
						fill: "none",
						stroke: "#c9c2b4",
						strokeWidth: "4"
					}),
					Array.from({ length: 11 }).map((_, i) => {
						const a = (-135 + i * 27) * Math.PI / 180;
						const x1 = 48 + Math.cos(a) * 26;
						const y1 = 52 + Math.sin(a) * 26;
						const x2 = 48 + Math.cos(a) * 32;
						const y2 = 52 + Math.sin(a) * 32;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1,
							y1,
							x2,
							y2,
							stroke: "#5c5348",
							strokeWidth: i === 7 ? 2.4 : 1.4
						}, i);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
						transform: `rotate(${needle} 48 52)`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "48",
							y1: "52",
							x2: "48",
							y2: "26",
							stroke: ok ? "#4a9a78" : "#b23a32",
							strokeWidth: "2.2",
							strokeLinecap: "round"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "48",
						cy: "52",
						r: "3.5",
						fill: "#2a2420"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute bottom-1 font-mono text-xs tabular-nums text-muted",
				children: psi < 40 ? "—" : Math.round(psi).toLocaleString("ko-KR")
			})]
		})
	});
}
function SoapHud() {
	const stepId = useGame((s) => s.stepId);
	const soap = useGame((s) => s.soap);
	const leak = useGame((s) => s.leak);
	const primary = useGame((s) => s.primary);
	const n2 = stepId === "soap_n2";
	const hose = stepId === "soap_hose";
	if (!n2 && !hose) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-auto mx-auto w-full max-w-md rounded-lg border border-border bg-surface/94 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm font-medium text-fg",
				children: ["비눗물 누출 테스트 · ", n2 ? "1 / 2" : "2 / 2"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: n2 ? "질소 실린더와 레귤레이터가 맞닿은 이음새를 바르세요." : "플로우미터 출력구와 호스가 맞닿은 이음새를 바르세요."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JointCard, {
					k: "n2",
					title: "질소 + 레귤레이터",
					caption: "실린더 밸브 이음",
					done: soap.reg,
					current: n2,
					leak: leak.reg
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JointCard, {
					k: "hose",
					title: "플로우미터 + 호스",
					caption: "출력구 이음",
					done: soap.hose,
					current: hose,
					leak: leak.hose
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "lg",
				className: "mt-3 w-full",
				onClick: primary,
				children: n2 ? "질소·레귤레이터에 바르기" : "플로우미터·호스에 바르기"
			})
		]
	});
}
function JointCard({ k, title, caption, done, current, leak }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-md border bg-raised p-2", current && "border-primary", done && !leak && "border-ok", leak && "border-danger", !current && !done && "border-border opacity-55"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 120 44",
				className: "h-10 w-full",
				"aria-hidden": true,
				children: k === "n2" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "6",
						y: "10",
						width: "28",
						height: "24",
						rx: "3",
						fill: "#6a7b84"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "30",
						y: "16",
						width: "14",
						height: "12",
						rx: "2",
						fill: "#8b9399"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "52",
						cy: "22",
						r: "7",
						fill: current ? "#4aa3b0" : done ? "#4a9a78" : "#c4a15a"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "62",
						y: "12",
						width: "50",
						height: "20",
						rx: "3",
						fill: "#2a333a"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "70",
						y: "16",
						width: "18",
						height: "12",
						rx: "2",
						fill: "#c4a15a"
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "6",
						y: "12",
						width: "40",
						height: "20",
						rx: "3",
						fill: "#c4a15a"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "18",
						y: "16",
						width: "16",
						height: "12",
						rx: "2",
						fill: "#e0c36a"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "56",
						cy: "22",
						r: "7",
						fill: current ? "#4aa3b0" : done ? "#4a9a78" : "#8a9096"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "66",
						y: "18",
						width: "48",
						height: "8",
						rx: "4",
						fill: "#1f2428"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "66",
						y: "16",
						width: "10",
						height: "12",
						rx: "2",
						fill: "#8a9096"
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs font-medium text-fg",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-subtle",
				children: leak ? "기포 발생" : done ? "기포 없음" : current ? caption : "대기"
			})
		]
	});
}
function Codex() {
	const id = useGame((s) => s.codexId);
	const close = useGame((s) => s.closeCodex);
	const pick = useGame((s) => s.pickCodex);
	const entry = CODEX_ENTRIES.find((e) => e.id === id) ?? CODEX_ENTRIES[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-40 flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "pointer-events-auto flex shrink-0 items-center justify-between gap-3 border-b border-border bg-surface/95 px-3 py-2 sm:px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-[0.2em] text-primary",
				children: "CODEX"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base font-semibold text-fg",
				children: "장비 도감"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "icon",
				"aria-label": "도감 닫기",
				onClick: close,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 flex-1 flex-col sm:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "pointer-events-auto flex shrink-0 gap-2 overflow-x-auto border-b border-border bg-surface/95 p-2 sm:w-56 sm:flex-col sm:overflow-y-auto sm:border-b-0 sm:border-r sm:p-3",
				children: CODEX_ENTRIES.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => pick(e.id),
					className: cn("shrink-0 rounded-md border px-3 py-2 text-left text-sm", e.id === entry.id ? "border-primary bg-raised text-fg" : "border-border bg-surface text-muted"),
					children: e.title
				}, e.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative min-h-0 min-w-0 flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-x-0 bottom-0 p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border bg-surface/90 px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-fg",
								children: entry.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-muted",
								children: entry.blurb
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-subtle",
								children: "드래그로 회전 · 스크롤·핀치로 확대"
							})
						]
					})
				})
			})]
		})]
	});
}
function formatTime(s) {
	return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}
function Hud() {
	const screen = useGame((s) => s.screen);
	const codex = useGame((s) => s.codexOpen);
	const openCodex = useGame((s) => s.openCodex);
	if (codex) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Codex, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		screen === "title" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title, { onCodex: openCodex }) : null,
		screen === "fail" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fail, { onCodex: openCodex }) : null,
		screen === "pass" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pass, { onCodex: openCodex }) : null,
		screen === "play" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayHud, { onCodex: openCodex }) : null
	] });
}
function Title({ onCodex }) {
	const start = useGame((s) => s.start);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 z-10 flex flex-col justify-end p-4 sm:justify-center sm:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto mx-auto w-full max-w-md rounded-xl border border-border bg-surface/92 p-5 shadow-lg sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs tracking-[0.22em] text-primary",
					children: "N2 PROTOCOL"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-3xl font-semibold tracking-tight text-fg sm:text-4xl",
					children: "N2 SAFE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 hidden text-sm leading-relaxed text-muted sm:block",
					children: "질소 실린더 안전 조립 훈련. 캡을 제거하고, 레귤레이터를 시계 방향으로 체결한 뒤 밸브를 반시계로 천천히 엽니다."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted sm:hidden",
					children: "캡 제거 → 레귤레이터·호스 체결 → 밸브 2개 개방 → 비눗물 테스트"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-4 hidden space-y-2 text-sm text-fg sm:block",
					children: [
						"보호캡 제거",
						"레귤레이터 수체결 → 너트 조임",
						"호스 연결 → 너트 조임",
						"밸브 2개 개방 · 2,000 PSI · 유량 확인",
						"비눗물: 질소·레귤레이터 → 플로우미터·호스"
					].map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-primary tabular-nums",
							children: String(i + 1).padStart(2, "0")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: line })]
					}, line))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "xl",
					className: "mt-6 w-full",
					onClick: () => {
						unlockAudio();
						start();
					},
					children: "훈련 시작"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "lg",
					variant: "secondary",
					className: "mt-2 w-full",
					onClick: onCodex,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }), "장비 도감"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-center text-xs text-subtle",
					children: "하단 버튼으로 진행 · 드래그로 시점 이동"
				})
			]
		})
	});
}
function PlayHud({ onCodex }) {
	const stepId = useGame((s) => s.stepId);
	const lives = useGame((s) => s.lives);
	const elapsed = useGame((s) => s.elapsed);
	const psi = useGame((s) => s.psi);
	const flow = useGame((s) => s.flowLpm);
	const muted = useGame((s) => s.muted);
	const toasts = useGame((s) => s.toasts);
	const minigame = useGame((s) => s.minigame);
	const cylOpen = useGame((s) => s.cylOpen);
	const flowOpen = useGame((s) => s.flowOpen);
	const step = STEPS.find((s) => s.id === stepId);
	const primary = useGame((s) => s.primary);
	const toggleMute = useGame((s) => s.toggleMute);
	const reset = useGame((s) => s.reset);
	const hideAction = stepId === "open_cyl" || stepId === "check_psi" || stepId === "open_flow" || stepId === "check_flow";
	const soapStep = stepId === "soap_n2" || stepId === "soap_hose";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-10 flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2 p-3 sm:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 max-w-[min(22rem,calc(100%-6.5rem))] rounded-lg border border-border bg-surface/90 px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-xs tracking-widest text-primary tabular-nums",
							children: [
								"STEP ",
								String(step.index + 1).padStart(2, "0"),
								" / ",
								String(STEPS.length).padStart(2, "0"),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-subtle",
									children: formatTime(elapsed)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold text-fg",
							children: step.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 hidden text-xs leading-snug text-muted sm:block",
							children: step.hint
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto flex shrink-0 items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1 rounded-lg border border-border bg-surface/90 px-2 py-2",
							children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
								className: cn("size-4", i < lives ? "text-primary" : "text-border"),
								strokeWidth: 2
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "icon",
							"aria-label": "장비 도감",
							onClick: onCodex,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "icon",
							"aria-label": muted ? "소리 켜기" : "소리 끄기",
							onClick: toggleMute,
							children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "처음으로",
							onClick: reset,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-0 flex-1" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-stretch gap-2 p-3 sm:items-center sm:p-4",
				children: [
					toasts.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("mx-auto w-full max-w-md rounded-md border px-3 py-2 text-sm", t.kind === "ok" && "border-ok/40 bg-ok/15 text-fg", t.kind === "warn" && "border-warn/40 bg-warn/15 text-fg", t.kind === "danger" && "border-danger/40 bg-danger/15 text-fg", t.kind === "info" && "border-border bg-raised text-fg"),
						children: t.text
					}, t.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex w-full max-w-md gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {
								icon: Gauge,
								label: "PSI",
								value: psi < 40 ? "—" : Math.round(psi).toLocaleString("ko-KR")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {
								icon: Droplets,
								label: "L/min",
								value: flow < .2 ? "—" : flow.toFixed(0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {
								icon: Wrench,
								label: "밸브",
								value: `${(cylOpen > .8 ? 1 : 0) + (flowOpen > .8 ? 1 : 0)}/2`
							})
						]
					}),
					minigame === "tighten_reg" || minigame === "tighten_hose" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tighten, {}) : hideAction ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValveHud, {}) : soapStep ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoapHud, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "xl",
						className: "pointer-events-auto mx-auto w-full max-w-md",
						onClick: primary,
						children: step.action
					})
				]
			})
		]
	});
}
function Readout({ icon: Icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 items-center gap-2 rounded-md border border-border bg-surface/90 px-2 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-sm tabular-nums text-fg",
				children: value
			})]
		})]
	});
}
function hexPoints(cx, cy, r) {
	return Array.from({ length: 6 }, (_, i) => {
		const a = (30 + i * 60) * Math.PI / 180;
		return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
	}).join(" ");
}
function Tighten() {
	const [v, setV] = (0, import_react.useState)(0);
	const minigame = useGame((s) => s.minigame);
	const grab = useGame((s) => s.valveGrab);
	const commit = useGame((s) => s.commitTighten);
	const close = useGame((s) => s.closeMinigame);
	const hose = minigame === "tighten_hose";
	const dragging = (0, import_react.useRef)(false);
	const lastAng = (0, import_react.useRef)(0);
	const value = (0, import_react.useRef)(0);
	const host = (0, import_react.useRef)(null);
	const inGreen = v >= 68 && v <= 86;
	const over = v > 86;
	(0, import_react.useEffect)(() => {
		value.current = 0;
		setV(0);
	}, [minigame]);
	(0, import_react.useEffect)(() => {
		const angleOf = (e) => {
			const el = host.current;
			if (!el) return 0;
			const r = el.getBoundingClientRect();
			return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
		};
		const move = (e) => {
			if (!dragging.current) return;
			const a = angleOf(e);
			let d = a - lastAng.current;
			if (d > Math.PI) d -= Math.PI * 2;
			if (d < -Math.PI) d += Math.PI * 2;
			lastAng.current = a;
			if (d <= .004) return;
			value.current = Math.min(100, value.current + d * 16);
			setV(value.current);
		};
		const end = () => {
			if (!dragging.current) return;
			dragging.current = false;
			commit(value.current);
		};
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", end);
		window.addEventListener("pointercancel", end);
		return () => {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", end);
			window.removeEventListener("pointercancel", end);
		};
	}, [commit]);
	const fill = hose ? "#8a9096" : "#c4a15a";
	const stroke = hose ? "#5e646a" : "#9a7a3a";
	const inner = hose ? "#3d4248" : "#6b5224";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-auto mx-auto flex w-full max-w-md items-center gap-4 rounded-lg border border-border bg-surface/94 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			ref: host,
			type: "button",
			"aria-label": hose ? "호스 너트 오른쪽으로 조이기" : "레귤레이터 너트 오른쪽으로 조이기",
			className: cn("relative grid size-28 shrink-0 place-items-center rounded-md border border-border bg-raised touch-none", grab === "nut" && "border-primary", inGreen && "border-ok", over && "border-danger"),
			onPointerDown: (e) => {
				e.preventDefault();
				const r = e.currentTarget.getBoundingClientRect();
				lastAng.current = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
				dragging.current = true;
				useGame.getState().grabNut();
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 96 96",
				className: "size-24",
				"aria-hidden": true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "48",
						cy: "48",
						r: "40",
						fill: "none",
						stroke: "currentColor",
						className: "text-border",
						strokeWidth: "3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "48",
						cy: "48",
						r: "40",
						fill: "none",
						className: "text-ok/50",
						stroke: "currentColor",
						strokeWidth: "3",
						strokeDasharray: `45.18 251`,
						strokeDashoffset: -170.68,
						transform: "rotate(-90 48 48)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "48",
						cy: "48",
						r: "40",
						fill: "none",
						stroke: "currentColor",
						className: over ? "text-danger" : "text-primary",
						strokeWidth: "3",
						strokeDasharray: `${v / 100 * 251} 251`,
						strokeLinecap: "round",
						transform: "rotate(-90 48 48)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M28 22 A 30 30 0 0 1 68 22",
						fill: "none",
						stroke: "currentColor",
						className: "text-primary/70",
						strokeWidth: "2",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
						points: "72,22 64,18 64,26",
						className: "fill-primary/80"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						transform: `rotate(${v / 100 * 220} 48 48)`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
								points: hexPoints(48, 48, 26),
								fill,
								stroke,
								strokeWidth: "2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
								points: hexPoints(48, 48, 18),
								fill: inner
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "48",
								cy: "48",
								r: "7",
								fill: "#1c1f22"
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute bottom-1 font-mono text-xs tabular-nums text-muted",
				children: [v.toFixed(0), "%"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-fg",
					children: hose ? "호스 너트" : "레귤레이터 너트"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs leading-snug text-muted",
					children: inGreen ? "녹색 구간입니다. 여기서 손을 떼세요." : over ? "너무 셉니다. 더 조이면 나사선이 손상됩니다." : "시계 방향(오른쪽)으로 돌려 조이세요. 녹색에서 손을 떼세요."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "md",
					className: "mt-2",
					onClick: close,
					children: "취소"
				})
			]
		})]
	});
}
function Fail({ onCodex }) {
	const reason = useGame((s) => s.failReason);
	const title = useGame((s) => s.failTitle);
	const start = useGame((s) => s.start);
	const reset = useGame((s) => s.reset);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 z-20 flex items-end justify-center bg-bg/55 p-4 sm:items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto w-full max-w-md rounded-xl border border-danger/40 bg-surface p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-8 text-danger" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-2xl font-semibold text-fg",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: reason
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							className: "flex-1",
							onClick: start,
							children: "다시 훈련"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							variant: "secondary",
							onClick: reset,
							children: "처음으로"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							"aria-label": "장비 도감",
							onClick: onCodex,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" })
						})
					]
				})
			]
		})
	});
}
function Pass({ onCodex }) {
	const elapsed = useGame((s) => s.elapsed);
	const mistakes = useGame((s) => s.mistakes);
	const psi = useGame((s) => s.psi);
	const flow = useGame((s) => s.flowLpm);
	const start = useGame((s) => s.start);
	const reset = useGame((s) => s.reset);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 z-20 flex items-end justify-center bg-bg/55 p-4 sm:items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto w-full max-w-md rounded-xl border border-ok/40 bg-surface p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-8 text-ok" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-2xl font-semibold text-fg",
					children: "조립 완료"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "누출 없음. 고압·유량 정상. 질소 공급 준비됐습니다."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-5 grid grid-cols-2 gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-border bg-raised p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-subtle",
								children: "압력"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "font-mono tabular-nums text-fg",
								children: [Math.round(psi || 2040).toLocaleString("ko-KR"), " PSI"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-border bg-raised p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-subtle",
								children: "유량"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "font-mono tabular-nums text-fg",
								children: [(flow || 15).toFixed(0), " L/min"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-border bg-raised p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-subtle",
								children: "시간"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono tabular-nums text-fg",
								children: formatTime(elapsed)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-border bg-raised p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-subtle",
								children: "실수"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-mono tabular-nums text-fg",
								children: mistakes
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							className: "flex-1",
							onClick: start,
							children: "다시 하기"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							variant: "secondary",
							onClick: reset,
							children: "처음으로"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							"aria-label": "장비 도감",
							onClick: onCodex,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" })
						})
					]
				})
			]
		})
	});
}
var GameCanvas = (0, import_react.lazy)(() => import("./GameCanvas-DxzCMJR7.mjs"));
function GameApp() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0",
			children: ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-bg" }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameCanvas, {})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-bg" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {})]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameApp, {});
}
//#endregion
export { STEPS as a, useGame as i, CODEX_ENTRIES as n, MODEL as r, routes_exports as t };
