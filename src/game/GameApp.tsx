import { lazy, Suspense, useEffect, useState } from "react";
import { Hud } from "./Hud";

const GameCanvas = lazy(() => import("./GameCanvas"));

export function GameApp() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-bg">
      <div className="absolute inset-0">
        {ready ? (
          <Suspense fallback={<div className="h-full w-full bg-bg" />}>
            <GameCanvas />
          </Suspense>
        ) : (
          <div className="h-full w-full bg-bg" />
        )}
      </div>
      <Hud />
    </main>
  );
}
