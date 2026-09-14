import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGame } from "./store";

const CAM = {
  wide: { pos: [1.95, 1.48, 2.35] as [number, number, number], target: [0.18, 0.9, 0] as [number, number, number] },
  cyl: { pos: [0.52, 1.38, 0.78] as [number, number, number], target: [0.07, 1.18, 0.03] as [number, number, number] },
  flow: { pos: [0.64, 1.42, 0.68] as [number, number, number], target: [0.18, 1.22, 0.02] as [number, number, number] },
  inspect: { pos: [1.65, 1.15, 2.05] as [number, number, number], target: [0, 0.62, 0] as [number, number, number] },
};

function shotFor(step: string, inspect: boolean) {
  if (inspect) return CAM.inspect;
  if (step === "open_cyl" || step === "check_psi") return CAM.cyl;
  if (step === "open_flow" || step === "check_flow") return CAM.flow;
  return CAM.wide;
}

export function isValveStep(step: string) {
  return step === "open_cyl" || step === "check_psi" || step === "open_flow" || step === "check_flow";
}

export function CameraDirector() {
  const stepId = useGame((s) => s.stepId);
  const grab = useGame((s) => s.valveGrab);
  const inspect = useGame((s) => s.codexOpen);
  const codexId = useGame((s) => s.codexId);
  const { camera, controls } = useThree();
  const focus = useRef({ key: "", t: 0 });

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.1);
    const key = inspect ? `codex:${codexId}` : stepId;
    if (focus.current.key !== key) focus.current = { key, t: 0 };
    focus.current.t += d;
    const shot = shotFor(stepId, inspect);
    const k = 1 - Math.exp(-3.4 * d);
    if (focus.current.t < 1.25) {
      camera.position.x += (shot.pos[0] - camera.position.x) * k;
      camera.position.y += (shot.pos[1] - camera.position.y) * k;
      camera.position.z += (shot.pos[2] - camera.position.z) * k;
      const c = controls as unknown as { target: THREE.Vector3; update?: () => void } | undefined;
      if (c?.target) {
        c.target.x += (shot.target[0] - c.target.x) * k;
        c.target.y += (shot.target[1] - c.target.y) * k;
        c.target.z += (shot.target[2] - c.target.z) * k;
        c.update?.();
      }
    }
    const c = controls as unknown as { enabled?: boolean } | undefined;
    if (c) c.enabled = inspect || !grab;
  });
  return null;
}
