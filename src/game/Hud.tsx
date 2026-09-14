import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Check,
  Droplets,
  Eye,
  Gauge,
  RotateCcw,
  Shield,
  Volume2,
  VolumeX,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GREEN_MAX, GREEN_MIN, STEPS, TARGET_FLOW, TARGET_PSI } from "./steps";
import { useGame } from "./store";
import { unlockAudio } from "./audio";
import { ValveHud, SoapHud } from "./ValveHud";
import { Codex } from "./Codex";
import { t } from "./i18n";

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function LangToggle() {
  const lang = useGame((s) => s.lang);
  const setLang = useGame((s) => s.setLang);
  return (
    <div className="flex overflow-hidden rounded-md border border-border bg-surface/90">
      <button
        type="button"
        className={cn(
          "px-2.5 py-1.5 text-xs font-semibold",
          lang === "ko" ? "bg-raised text-fg" : "text-muted",
        )}
        onClick={() => setLang("ko")}
      >
        한
      </button>
      <button
        type="button"
        className={cn(
          "px-2.5 py-1.5 text-xs font-semibold tracking-wide",
          lang === "en" ? "bg-raised text-fg" : "text-muted",
        )}
        onClick={() => setLang("en")}
      >
        EN
      </button>
    </div>
  );
}

export function Hud() {
  const screen = useGame((s) => s.screen);
  const lang = useGame((s) => s.lang);
  const codex = useGame((s) => s.codexOpen);
  const openCodex = useGame((s) => s.openCodex);
  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "ko";
    document.title = t(lang, "app.name");
  }, [lang]);
  if (codex) return <Codex />;
  return (
    <>
      {screen === "title" ? <Title onCodex={openCodex} /> : null}
      {screen === "fail" ? <Fail onCodex={openCodex} /> : null}
      {screen === "pass" ? <Pass onCodex={openCodex} /> : null}
      {screen === "admire" ? <AdmireHud /> : null}
      {screen === "play" ? <PlayHud onCodex={openCodex} /> : null}
    </>
  );
}

function Title({ onCodex }: { onCodex: () => void }) {
  const start = useGame((s) => s.start);
  const lang = useGame((s) => s.lang);
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end p-4 sm:justify-center sm:p-6">
      <div className="pointer-events-auto mx-auto w-full max-w-md rounded-xl border border-border bg-surface/92 p-5 shadow-lg sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <p className="font-mono text-xs tracking-[0.22em] text-primary">{t(lang, "app.tag")}</p>
          <LangToggle />
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{t(lang, "app.name")}</h1>
        <p className="mt-2 hidden text-sm leading-relaxed text-muted sm:block">{t(lang, "app.desc")}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted sm:hidden">{t(lang, "app.short")}</p>
        <ol className="mt-4 hidden space-y-2 text-sm text-fg sm:block">
          {(["outline.1", "outline.2", "outline.3", "outline.4", "outline.5", "outline.6", "outline.7"] as const).map(
            (key, i) => (
              <li key={key} className="flex gap-3">
                <span className="font-mono text-xs text-primary tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span>{t(lang, key)}</span>
              </li>
            ),
          )}
        </ol>
        <Button
          size="xl"
          className="mt-6 w-full"
          onClick={() => {
            unlockAudio();
            start();
          }}
        >
          {t(lang, "app.start")}
        </Button>
        <Button size="lg" variant="secondary" className="mt-2 w-full" onClick={onCodex}>
          <BookOpen className="size-4" />
          {t(lang, "app.codex")}
        </Button>
        <p className="mt-3 text-center text-xs text-subtle">{t(lang, "app.howto")}</p>
      </div>
    </div>
  );
}

function PlayHud({ onCodex }: { onCodex: () => void }) {
  const stepId = useGame((s) => s.stepId);
  const lang = useGame((s) => s.lang);
  const lives = useGame((s) => s.lives);
  const elapsed = useGame((s) => s.elapsed);
  const psi = useGame((s) => s.psi);
  const flow = useGame((s) => s.flowLpm);
  const muted = useGame((s) => s.muted);
  const toasts = useGame((s) => s.toasts);
  const minigame = useGame((s) => s.minigame);
  const cylOpen = useGame((s) => s.cylOpen);
  const flowOpen = useGame((s) => s.flowOpen);
  const step = STEPS.find((s) => s.id === stepId)!;
  const primary = useGame((s) => s.primary);
  const toggleMute = useGame((s) => s.toggleMute);
  const reset = useGame((s) => s.reset);
  const hideAction =
    stepId === "open_cyl" || stepId === "check_psi" || stepId === "open_flow" || stepId === "check_flow";
  const soapStep = stepId === "soap_n2" || stepId === "soap_hose";
  const loc = lang === "en" ? "en-US" : "ko-KR";

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      <div className="flex items-start justify-between gap-2 p-3 sm:p-4">
        <div className="min-w-0 max-w-[min(22rem,calc(100%-9rem))] rounded-lg border border-border bg-surface/90 px-3 py-2">
          <p className="font-mono text-xs tracking-widest text-primary tabular-nums">
            STEP {String(step.index + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
            <span className="ml-2 text-subtle">{formatTime(elapsed)}</span>
          </p>
          <h2 className="text-sm font-semibold text-fg">{t(lang, `step.${stepId}.title`)}</h2>
          <p className="mt-1 hidden text-xs leading-snug text-muted sm:block">{t(lang, `step.${stepId}.hint`)}</p>
        </div>
        <div className="pointer-events-auto flex shrink-0 items-center gap-1">
          <LangToggle />
          <div className="flex items-center gap-1 rounded-lg border border-border bg-surface/90 px-2 py-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Shield
                key={i}
                className={cn("size-4", i < lives ? "text-primary" : "text-border")}
                strokeWidth={2}
              />
            ))}
          </div>
          <Button variant="secondary" size="icon" aria-label={t(lang, "app.codex")} onClick={onCodex}>
            <BookOpen className="size-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            aria-label={muted ? t(lang, "app.muteOn") : t(lang, "app.muteOff")}
            onClick={toggleMute}
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </Button>
          <Button variant="ghost" size="icon" aria-label={t(lang, "app.home")} onClick={reset}>
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1" />

      <div className="flex flex-col items-stretch gap-2 p-3 sm:items-center sm:p-4">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={cn(
              "mx-auto w-full max-w-md rounded-md border px-3 py-2 text-sm",
              item.kind === "ok" && "border-ok/40 bg-ok/15 text-fg",
              item.kind === "warn" && "border-warn/40 bg-warn/15 text-fg",
              item.kind === "danger" && "border-danger/40 bg-danger/15 text-fg",
              item.kind === "info" && "border-border bg-raised text-fg",
            )}
          >
            {item.text}
          </div>
        ))}
        <div className="mx-auto flex w-full max-w-md gap-2">
          <Readout icon={Gauge} label="PSI" value={psi < 40 ? "—" : Math.round(psi).toLocaleString(loc)} />
          <Readout icon={Droplets} label="L/min" value={flow < 0.2 ? "—" : flow.toFixed(0)} />
          <Readout
            icon={Wrench}
            label={t(lang, "hud.valve")}
            value={`${(cylOpen > 0.8 ? 1 : 0) + (flowOpen > 0.8 ? 1 : 0)}/2`}
          />
        </div>
        {minigame === "tighten_reg" || minigame === "tighten_hose" ? (
          <Tighten />
        ) : hideAction ? (
          <ValveHud />
        ) : soapStep ? (
          <SoapHud />
        ) : (
          <Button size="xl" className="pointer-events-auto mx-auto w-full max-w-md" onClick={primary}>
            {t(lang, `step.${stepId}.action`)}
          </Button>
        )}
      </div>
    </div>
  );
}

function Readout({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-surface/90 px-2 py-2">
      <Icon className="size-3.5 text-primary" />
      <div className="min-w-0">
        <p className="text-xs text-subtle">{label}</p>
        <p className="font-mono text-sm tabular-nums text-fg">{value}</p>
      </div>
    </div>
  );
}

function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = ((30 + i * 60) * Math.PI) / 180;
    return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }).join(" ");
}

function Tighten() {
  const [v, setV] = useState(0);
  const minigame = useGame((s) => s.minigame);
  const grab = useGame((s) => s.valveGrab);
  const commit = useGame((s) => s.commitTighten);
  const close = useGame((s) => s.closeMinigame);
  const hose = minigame === "tighten_hose";
  const lang = useGame((s) => s.lang);
  const dragging = useRef(false);
  const lastAng = useRef(0);
  const value = useRef(0);
  const host = useRef<HTMLButtonElement>(null);
  const inGreen = v >= GREEN_MIN && v <= GREEN_MAX;
  const over = v > GREEN_MAX;

  useEffect(() => {
    value.current = 0;
    setV(0);
  }, [minigame]);

  useEffect(() => {
    const angleOf = (e: PointerEvent) => {
      const el = host.current;
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
    };
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const a = angleOf(e);
      let d = a - lastAng.current;
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      lastAng.current = a;
      // Screen Y is down: clockwise is +atan2 delta.
      if (d <= 0.004) return;
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

  return (
    <div className="pointer-events-auto mx-auto flex w-full max-w-md items-center gap-4 rounded-lg border border-border bg-surface/94 p-3">
      <button
        ref={host}
        type="button"
        aria-label={hose ? t(lang, "nut.ariaHose") : t(lang, "nut.ariaReg")}
        className={cn(
          "relative grid size-28 shrink-0 place-items-center rounded-md border border-border bg-raised touch-none",
          grab === "nut" && "border-primary",
          inGreen && "border-ok",
          over && "border-danger",
        )}
        onPointerDown={(e) => {
          e.preventDefault();
          const r = e.currentTarget.getBoundingClientRect();
          lastAng.current = Math.atan2(
            e.clientY - (r.top + r.height / 2),
            e.clientX - (r.left + r.width / 2),
          );
          dragging.current = true;
          useGame.getState().grabNut();
        }}
      >
        <svg viewBox="0 0 96 96" className="size-24" aria-hidden>
          <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" className="text-border" strokeWidth="3" />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            className="text-ok/50"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${((GREEN_MAX - GREEN_MIN) / 100) * 251} 251`}
            strokeDashoffset={-((GREEN_MIN / 100) * 251)}
            transform="rotate(-90 48 48)"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="currentColor"
            className={over ? "text-danger" : "text-primary"}
            strokeWidth="3"
            strokeDasharray={`${(v / 100) * 251} 251`}
            strokeLinecap="round"
            transform="rotate(-90 48 48)"
          />
          <path
            d="M28 22 A 30 30 0 0 1 68 22"
            fill="none"
            stroke="currentColor"
            className="text-primary/70"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <polygon points="72,22 64,18 64,26" className="fill-primary/80" />
          <g transform={`rotate(${(v / 100) * 220} 48 48)`}>
            <polygon points={hexPoints(48, 48, 26)} fill={fill} stroke={stroke} strokeWidth="2" />
            <polygon points={hexPoints(48, 48, 18)} fill={inner} />
            <circle cx="48" cy="48" r="7" fill="#1c1f22" />
          </g>
        </svg>
        <span className="absolute bottom-1 font-mono text-xs tabular-nums text-muted">{v.toFixed(0)}%</span>
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-fg">{hose ? t(lang, "nut.hose") : t(lang, "nut.reg")}</p>
        <p className="mt-1 text-xs leading-snug text-muted">
          {inGreen ? t(lang, "nut.green") : over ? t(lang, "nut.over") : t(lang, "nut.hint")}
        </p>
        <Button variant="secondary" size="md" className="mt-2" onClick={close}>
          {t(lang, "app.cancel")}
        </Button>
      </div>
    </div>
  );
}

function Fail({ onCodex }: { onCodex: () => void }) {
  const reason = useGame((s) => s.failReason);
  const title = useGame((s) => s.failTitle);
  const start = useGame((s) => s.start);
  const reset = useGame((s) => s.reset);
  const lang = useGame((s) => s.lang);
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center bg-bg/55 p-4 sm:items-center">
      <div className="pointer-events-auto w-full max-w-md rounded-xl border border-danger/40 bg-surface p-6">
        <div className="flex items-start justify-between gap-3">
          <AlertTriangle className="size-8 text-danger" />
          <LangToggle />
        </div>
        <h2 className="mt-3 text-2xl font-semibold text-fg">{t(lang, title || "fail.safety")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{t(lang, reason)}</p>
        <div className="mt-6 flex gap-2">
          <Button size="lg" className="flex-1" onClick={start}>
            {t(lang, "app.retry")}
          </Button>
          <Button size="lg" variant="secondary" onClick={reset}>
            {t(lang, "app.home")}
          </Button>
          <Button size="icon" variant="ghost" aria-label={t(lang, "app.codex")} onClick={onCodex}>
            <BookOpen className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function Pass({ onCodex }: { onCodex: () => void }) {
  const elapsed = useGame((s) => s.elapsed);
  const mistakes = useGame((s) => s.mistakes);
  const psi = useGame((s) => s.psi);
  const flow = useGame((s) => s.flowLpm);
  const start = useGame((s) => s.start);
  const reset = useGame((s) => s.reset);
  const admire = useGame((s) => s.openAdmire);
  const lang = useGame((s) => s.lang);
  const loc = lang === "en" ? "en-US" : "ko-KR";
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center bg-bg/55 p-4 sm:items-center">
      <div className="pointer-events-auto w-full max-w-md rounded-xl border border-ok/40 bg-surface p-6">
        <div className="flex items-start justify-between gap-3">
          <Check className="size-8 text-ok" />
          <LangToggle />
        </div>
        <h2 className="mt-3 text-2xl font-semibold text-fg">{t(lang, "pass.title")}</h2>
        <p className="mt-2 text-sm text-muted">{t(lang, "pass.body")}</p>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md border border-border bg-raised p-3">
            <dt className="text-xs text-subtle">{t(lang, "pass.psi")}</dt>
            <dd className="font-mono tabular-nums text-fg">{Math.round(psi || TARGET_PSI).toLocaleString(loc)} PSI</dd>
          </div>
          <div className="rounded-md border border-border bg-raised p-3">
            <dt className="text-xs text-subtle">{t(lang, "pass.flow")}</dt>
            <dd className="font-mono tabular-nums text-fg">{(flow || TARGET_FLOW).toFixed(0)} L/min</dd>
          </div>
          <div className="rounded-md border border-border bg-raised p-3">
            <dt className="text-xs text-subtle">{t(lang, "pass.time")}</dt>
            <dd className="font-mono tabular-nums text-fg">{formatTime(elapsed)}</dd>
          </div>
          <div className="rounded-md border border-border bg-raised p-3">
            <dt className="text-xs text-subtle">{t(lang, "pass.mistakes")}</dt>
            <dd className="font-mono tabular-nums text-fg">{mistakes}</dd>
          </div>
        </dl>
        <Button size="xl" className="mt-6 w-full" onClick={admire}>
          <Eye className="size-4" />
          {t(lang, "pass.admire")}
        </Button>
        <div className="mt-2 flex gap-2">
          <Button size="lg" variant="secondary" className="flex-1" onClick={start}>
            {t(lang, "app.again")}
          </Button>
          <Button size="lg" variant="secondary" onClick={reset}>
            {t(lang, "app.home")}
          </Button>
          <Button size="icon" variant="ghost" aria-label={t(lang, "app.codex")} onClick={onCodex}>
            <BookOpen className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function AdmireHud() {
  const close = useGame((s) => s.closeAdmire);
  const start = useGame((s) => s.start);
  const reset = useGame((s) => s.reset);
  const lang = useGame((s) => s.lang);
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      <header className="pointer-events-auto flex shrink-0 items-center justify-between gap-3 border-b border-border bg-surface/90 px-3 py-2 sm:px-4">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-primary">GALLERY</p>
          <h2 className="text-sm font-semibold text-fg">{t(lang, "admire.title")}</h2>
        </div>
        <div className="flex items-center gap-1">
          <LangToggle />
          <Button size="md" variant="secondary" onClick={close}>
            {t(lang, "app.result")}
          </Button>
          <Button size="md" variant="secondary" onClick={start}>
            {t(lang, "app.againShort")}
          </Button>
          <Button size="icon" variant="ghost" aria-label={t(lang, "app.home")} onClick={reset}>
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </header>
      <div className="flex-1" />
      <p className="pointer-events-none p-3 text-center text-[11px] text-subtle">{t(lang, "admire.hint")}</p>
    </div>
  );
}
