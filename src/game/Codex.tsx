import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CODEX_ENTRIES } from "./model-urls";
import { useGame } from "./store";

export function Codex() {
  const id = useGame((s) => s.codexId);
  const close = useGame((s) => s.closeCodex);
  const pick = useGame((s) => s.pickCodex);
  const entry = CODEX_ENTRIES.find((e) => e.id === id) ?? CODEX_ENTRIES[0];

  return (
    <div className="absolute inset-0 z-40 flex flex-col">
      <header className="pointer-events-auto flex shrink-0 items-center justify-between gap-3 border-b border-border bg-surface/95 px-3 py-2 sm:px-4">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-primary">CODEX</p>
          <h2 className="text-base font-semibold text-fg">장비 도감</h2>
        </div>
        <Button variant="secondary" size="icon" aria-label="도감 닫기" onClick={close}>
          <X className="size-4" />
        </Button>
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
              {e.title}
            </button>
          ))}
        </nav>
        <div className="relative min-h-0 min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
            <div className="rounded-md border border-border bg-surface/90 px-3 py-2">
              <p className="text-sm font-medium text-fg">{entry.title}</p>
              <p className="mt-0.5 text-xs text-muted">{entry.blurb}</p>
              <p className="mt-1 text-[11px] text-subtle">드래그로 회전 · 스크롤·핀치로 확대</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
