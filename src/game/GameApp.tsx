import { type ComponentType, Suspense, useEffect, useState } from "react";
import { Hud } from "./Hud";

export function GameApp() {
  const [Canvas, setCanvas] = useState<ComponentType | null>(null);
  useEffect(() => {
    let live = true;
    void import("./GameCanvas").then((m) => {
      if (live) setCanvas(() => m.default);
    });
    return () => {
      live = false;
    };
  }, []);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-bg">
      <div className="absolute inset-0">
        {Canvas ? (
          <Suspense fallback={<div className="h-full w-full bg-bg" />}>
            <Canvas />
          </Suspense>
        ) : (
          <div className="h-full w-full bg-bg" />
        )}
      </div>
      <Hud />
    </main>
  );
}
