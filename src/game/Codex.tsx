import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CODEX_ENTRIES } from "./model-urls";
import { useGame } from "./store";
import { t } from "./i18n";

function LangMini() {
  const lang = useGame((s) => s.lang);
  const setLang = useGame((s) => s.setLang);
  return (
    <div className="flex overflow-hidden rounded-md border border-border">
      <button
        type="button"
        className={cn("px-2 py-1 text-xs font-semibold", lang === "ko" ? "bg-raised text-fg" : "text-muted")}
        onClick={() => setLang("ko")}
      >
        한
      </button>
      <button
        type="button"
        className={cn(
          "px-2 py-1 text-xs font-semibold tracking-wide",
          lang === "en" ? "bg-raised text-fg" : "text-muted",
        )}
        onClick={() => setLang("en")}
      >
        EN
      </button>
    </div>
  );
}

export function Codex() {
  const id = useGame((s) => s.codexId);
  const lang = useGame((s) => s.lang);
  const close = useGame((s) => s.closeCodex);
  const pick = useGame((s) => s.pickCodex);
  const turn = useGame((s) => s.turnCodex);
  const zoom = useGame((s) => s.zoomCodex);
  const entry = CODEX_ENTRIES.find((e) => e.id === id) ?? CODEX_ENTRIES[0];
  const drag = useRef<{ x: number; y: number; id: number } | null>(null);
  const pad = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pad.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoom(e.deltaY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoom]);

  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex flex-col">
      <header className="pointer-events-auto flex shrink-0 items-center justify-between gap-3 border-b border-border bg-surface/95 px-3 py-2 sm:px-4">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-primary">CODEX</p>
          <h2 className="text-base font-semibold text-fg">{t(lang, "codex.title")}</h2>
        </div>
        <div className="flex items-center gap-1">
          <LangMini />
          <Button variant="secondary" size="icon" aria-label={t(lang, "codex.close")} onClick={close}>
            <X className="size-4" />
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
        <nav className="pointer-events-auto flex shrink-0 gap-2 overflow-x-auto border-b border-border bg-surface/95 p-2 sm:w-56 sm:flex-col sm:overflow-y-auto sm:border-b-0 sm:border-r sm:p-3">
          {CODEX_ENTRIES.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => pick(e.id)}
              className={cn(
                "shrink-0 rounded-md border px-3 py-2 text-left text-sm",
                e.id === entry.id ? "border-primary bg-raised text-fg" : "border-border bg-surface text-muted",
              )}
            >
              {t(lang, `codex.${e.id}.title`)}
            </button>
          ))}
        </nav>
        <div className="relative min-h-0 min-w-0 flex-1">
          <div
            className="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"
            ref={pad}
            style={{ pointerEvents: "auto", touchAction: "none" }}
            onPointerDown={(e) => {
              (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
              drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
            }}
            onPointerMove={(e) => {
              const d = drag.current;
              if (!d || d.id !== e.pointerId) return;
              turn(e.clientX - d.x, e.clientY - d.y);
              d.x = e.clientX;
              d.y = e.clientY;
            }}
            onPointerUp={(e) => {
              if (drag.current?.id === e.pointerId) drag.current = null;
            }}
            onPointerCancel={() => {
              drag.current = null;
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
            <div className="rounded-md border border-border bg-surface/90 px-3 py-2">
              <p className="text-sm font-medium text-fg">{t(lang, `codex.${entry.id}.title`)}</p>
              <p className="mt-0.5 text-xs text-muted">{t(lang, `codex.${entry.id}.blurb`)}</p>
              <p className="mt-1 text-[11px] text-subtle">{t(lang, "codex.orbit")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
