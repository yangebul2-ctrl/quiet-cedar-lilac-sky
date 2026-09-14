import { Canvas } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import { World } from "./World";

function Loader3D() {
  const { progress } = useProgress();
  return (
    <Html center wrapperClass="pointer-events-none" style={{ pointerEvents: "none" }}>
      <div className="pointer-events-none rounded-md border border-border bg-surface/90 px-3 py-2 font-mono text-xs text-muted">
        장비 {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

export default function GameCanvas() {
  return (
    <Canvas
      camera={{ position: [1.95, 1.48, 2.35], fov: 40, near: 0.1, far: 40 }}
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFShadowMap;
        gl.toneMappingExposure = 1.28;
      }}
      className="h-full w-full touch-none"
      style={{ touchAction: "none" }}
    >
      <Suspense fallback={<Loader3D />}>
        <World />
      </Suspense>
    </Canvas>
  );
}
