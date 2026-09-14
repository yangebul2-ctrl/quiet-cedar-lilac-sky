import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TARGET_FLOW } from "./steps";
import { useGame } from "./store";
import { t } from "./i18n";

export function ValveHud() {
  const stepId = useGame((s) => s.stepId);
  if (stepId === "open_cyl") return <HandlePad />;
  if (stepId === "check_psi") return <GaugePad />;
  if (stepId === "open_flow" || stepId === "check_flow") return <KnobPad />;
  return null;
}

function Pad({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <div className="pointer-events-auto flex w-full flex-col gap-2 rounded-lg border border-border bg-surface/94 p-2.5">
      <div className="flex items-center gap-3">
        {children}
        <p className="min-w-0 text-sm font-medium text-fg">{title}</p>
      </div>
      <p className="text-xs leading-snug text-muted">{hint}</p>
    </div>
  );
}

function HandlePad() {
  const open = useGame((s) => s.cylOpen);
  const grab = useGame((s) => s.valveGrab);
  const lang = useGame((s) => s.lang);
  const dragging = useRef(false);
  const lastAng = useRef(0);
  const host = useRef<HTMLButtonElement>(null);

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
      // Screen Y is down, so CCW is negative atan2 delta.
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

  return (
    <Pad title={t(lang, "valve.cylTitle")} hint={t(lang, "valve.cylHint")}>
      <button
        ref={host}
        type="button"
        aria-label={t(lang, "valve.cylAria")}
        className={cn(
          "relative grid size-28 shrink-0 place-items-center rounded-md border border-border bg-raised touch-none",
          grab === "cyl" && "border-primary",
        )}
        onPointerDown={(e) => {
          e.preventDefault();
          const r = e.currentTarget.getBoundingClientRect();
          lastAng.current = Math.atan2(
            e.clientY - (r.top + r.height / 2),
            e.clientX - (r.left + r.width / 2),
          );
          dragging.current = true;
          useGame.getState().grabCyl();
        }}
      >
        <svg viewBox="0 0 96 96" className="size-24" aria-hidden>
          <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" className="text-border" strokeWidth="3" />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="currentColor"
            className="text-primary"
            strokeWidth="3"
            strokeDasharray={`${open * 251} 251`}
            strokeLinecap="round"
            transform="rotate(-90 48 48)"
          />
          <path
            d="M68 22 A 30 30 0 0 0 28 22"
            fill="none"
            stroke="currentColor"
            className="text-primary/70"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <polygon points="24,22 32,18 32,26" className="fill-primary/80" />
          <g transform={`rotate(${-open * 220} 48 52)`}>
            <rect x="44" y="38" width="8" height="28" rx="2" fill="#6d757c" />
            <rect x="18" y="48" width="60" height="10" rx="5" fill="#8b9399" />
            <circle cx="20" cy="53" r="7" fill="#9aa2a8" />
            <circle cx="76" cy="53" r="7" fill="#9aa2a8" />
          </g>
        </svg>
        <span className="absolute bottom-1 font-mono text-xs tabular-nums text-muted">{Math.round(open * 100)}%</span>
      </button>
    </Pad>
  );
}

function KnobPad() {
  const flow = useGame((s) => s.flowLpm);
  const stepId = useGame((s) => s.stepId);
  const grab = useGame((s) => s.valveGrab);
  const lang = useGame((s) => s.lang);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const turn = -(flow / 25) * 260;
  const inRange = Math.abs(flow - TARGET_FLOW) <= 1.5;

  useEffect(() => {
    const move = (e: PointerEvent) => {
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

  return (
    <Pad
      title={t(lang, "valve.knobTitle")}
      hint={stepId === "open_flow" ? t(lang, "valve.knobOpen") : t(lang, "valve.knobSet")}
    >
      <button
        type="button"
        aria-label={t(lang, "valve.knobAria")}
        className={cn(
          "relative grid size-28 shrink-0 place-items-center rounded-md border border-border bg-raised touch-none",
          grab === "flow" && "border-primary",
          inRange && stepId === "check_flow" && "border-ok",
        )}
        onPointerDown={(e) => {
          e.preventDefault();
          dragging.current = true;
          lastX.current = e.clientX;
          useGame.getState().grabFlow();
        }}
      >
        <svg viewBox="0 0 96 96" className="size-24" aria-hidden>
          <g transform={`rotate(${turn} 48 48)`}>
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (i / 16) * Math.PI * 2;
              const x1 = 48 + Math.cos(a) * 28;
              const y1 = 48 + Math.sin(a) * 28;
              const x2 = 48 + Math.cos(a) * 36;
              const y2 = 48 + Math.sin(a) * 36;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d7b45c" strokeWidth="4" strokeLinecap="round" />;
            })}
            <circle cx="48" cy="48" r="26" fill="#c4a15a" />
            <circle cx="48" cy="48" r="16" fill="#e0c36a" />
            <rect x="46" y="18" width="4" height="14" rx="1" fill="#f3e0a8" />
          </g>
        </svg>
        <span className="absolute bottom-1 font-mono text-xs tabular-nums text-muted">{flow.toFixed(0)} L</span>
      </button>
    </Pad>
  );
}

function GaugePad() {
  const psi = useGame((s) => s.psi);
  const lang = useGame((s) => s.lang);
  const tPsi = Math.min(1, psi / 3000);
  const needle = -135 + tPsi * 270;
  const ok = psi >= 1800 && psi <= 2200;

  return (
    <Pad title={t(lang, "valve.gaugeTitle")} hint={t(lang, "valve.gaugeHint")}>
      <button
        type="button"
        aria-label={t(lang, "valve.gaugeAria")}
        className="relative grid size-28 shrink-0 place-items-center rounded-md border border-border bg-raised"
        onClick={() => useGame.getState().interact("hp_gauge")}
      >
        <svg viewBox="0 0 96 96" className="size-24" aria-hidden>
          <circle cx="48" cy="52" r="34" fill="#efe6d6" />
          <circle cx="48" cy="52" r="34" fill="none" stroke="#c9c2b4" strokeWidth="4" />
          {Array.from({ length: 11 }).map((_, i) => {
            const a = ((-135 + i * 27) * Math.PI) / 180;
            const x1 = 48 + Math.cos(a) * 26;
            const y1 = 52 + Math.sin(a) * 26;
            const x2 = 48 + Math.cos(a) * 32;
            const y2 = 52 + Math.sin(a) * 32;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5c5348" strokeWidth={i === 7 ? 2.4 : 1.4} />;
          })}
          <g transform={`rotate(${needle} 48 52)`}>
            <line x1="48" y1="52" x2="48" y2="26" stroke={ok ? "#4a9a78" : "#b23a32"} strokeWidth="2.2" strokeLinecap="round" />
          </g>
          <circle cx="48" cy="52" r="3.5" fill="#2a2420" />
        </svg>
        <span className="absolute bottom-1 font-mono text-xs tabular-nums text-muted">
          {psi < 40 ? "—" : Math.round(psi).toLocaleString(lang === "en" ? "en-US" : "ko-KR")}
        </span>
      </button>
    </Pad>
  );
}

export function SoapHud() {
  const stepId = useGame((s) => s.stepId);
  const soap = useGame((s) => s.soap);
  const leak = useGame((s) => s.leak);
  const primary = useGame((s) => s.primary);
  const lang = useGame((s) => s.lang);
  const n2 = stepId === "soap_n2";
  const hose = stepId === "soap_hose";
  if (!n2 && !hose) return null;

  return (
    <div className="pointer-events-auto w-full rounded-lg border border-border bg-surface/94 p-2.5">
      <p className="text-sm font-medium text-fg">{t(lang, "soap.title", { n: n2 ? 1 : 2 })}</p>
      <p className="mt-1 text-xs text-muted">{n2 ? t(lang, "soap.n2Hint") : t(lang, "soap.hoseHint")}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <JointCard
          k="n2"
          title={t(lang, "soap.n2Title")}
          caption={t(lang, "soap.n2Cap")}
          done={soap.reg}
          current={n2}
          leak={leak.reg}
          lang={lang}
        />
        <JointCard
          k="hose"
          title={t(lang, "soap.hoseTitle")}
          caption={t(lang, "soap.hoseCap")}
          done={soap.hose}
          current={hose}
          leak={leak.hose}
          lang={lang}
        />
      </div>
      <Button size="lg" className="mt-3 w-full" onClick={primary}>
        {n2 ? t(lang, "soap.n2Btn") : t(lang, "soap.hoseBtn")}
      </Button>
    </div>
  );
}

function JointCard({
  k,
  title,
  caption,
  done,
  current,
  leak,
  lang,
}: {
  k: "n2" | "hose";
  title: string;
  caption: string;
  done: boolean;
  current: boolean;
  leak: boolean;
  lang: "ko" | "en";
}) {
  return (
    <div
      className={cn(
        "rounded-md border bg-raised p-2",
        current && "border-primary",
        done && !leak && "border-ok",
        leak && "border-danger",
        !current && !done && "border-border opacity-55",
      )}
    >
      <svg viewBox="0 0 120 44" className="h-10 w-full" aria-hidden>
        {k === "n2" ? (
          <>
            <rect x="6" y="10" width="28" height="24" rx="3" fill="#6a7b84" />
            <rect x="30" y="16" width="14" height="12" rx="2" fill="#8b9399" />
            <circle cx="52" cy="22" r="7" fill={current ? "#4aa3b0" : done ? "#4a9a78" : "#c4a15a"} />
            <rect x="62" y="12" width="50" height="20" rx="3" fill="#2a333a" />
            <rect x="70" y="16" width="18" height="12" rx="2" fill="#c4a15a" />
          </>
        ) : (
          <>
            <rect x="6" y="12" width="40" height="20" rx="3" fill="#c4a15a" />
            <rect x="18" y="16" width="16" height="12" rx="2" fill="#e0c36a" />
            <circle cx="56" cy="22" r="7" fill={current ? "#4aa3b0" : done ? "#4a9a78" : "#8a9096"} />
            <rect x="66" y="18" width="48" height="8" rx="4" fill="#1f2428" />
            <rect x="66" y="16" width="10" height="12" rx="2" fill="#8a9096" />
          </>
        )}
      </svg>
      <p className="mt-1 text-xs font-medium text-fg">{title}</p>
      <p className="text-[11px] text-subtle">
        {leak ? t(lang, "soap.leak") : done ? t(lang, "soap.ok") : current ? caption : t(lang, "soap.wait")}
      </p>
    </div>
  );
}

