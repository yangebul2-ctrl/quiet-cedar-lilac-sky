import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGame } from "./store";

const CAM = {
  wide: { pos: [1.95, 1.48, 2.35] as [number, number, number], target: [0.18, 0.9, 0] as [number, number, number] },
  cyl: { pos: [0.52, 1.38, 0.78] as [number, number, number], target: [0.07, 1.18, 0.03] as [number, number, number] },
  flow: { pos: [0.64, 1.42, 0.68] as [number, number, number], target: [0.18, 1.22, 0.02] as [number, number, number] },
  inspect: { pos: [1.65, 1.15, 2.05] as [number, number, number], target: [0, 0.62, 0] as [number, number, number] },
  admire: { pos: [2.15, 1.42, 2.55] as [number, number, number], target: [0.08, 0.72, 0.04] as [number, number, number] },
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
  const admire = useGame((s) => s.screen === "admire");
  const dist = useGame((s) => s.codexDist);
  const { camera, controls } = useThree();
  const focus = useRef({ key: "", t: 0 });
  const from = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.1);
    const key = inspect ? "codex" : admire ? "admire" : stepId;
    if (focus.current.key !== key) focus.current = { key, t: 0 };
    focus.current.t += d;
    const k = 1 - Math.exp(-3.4 * d);
    const c = controls as unknown as { target: THREE.Vector3; enabled?: boolean; update?: () => void } | undefined;

    if (inspect) {
      const shot = CAM.inspect;
      look.current.set(shot.target[0], shot.target[1], shot.target[2]);
      from.current.set(shot.pos[0], shot.pos[1], shot.pos[2]).sub(look.current).setLength(dist).add(look.current);
      camera.position.lerp(from.current, k);
      if (c?.target) {
        c.target.lerp(look.current, k);
        c.update?.();
      }
      if (c) c.enabled = false;
      return;
    }

    if (admire) {
      const shot = CAM.admire;
      if (focus.current.t < 1.15) {
        camera.position.x += (shot.pos[0] - camera.position.x) * k;
        camera.position.y += (shot.pos[1] - camera.position.y) * k;
        camera.position.z += (shot.pos[2] - camera.position.z) * k;
        if (c?.target) {
          c.target.x += (shot.target[0] - c.target.x) * k;
          c.target.y += (shot.target[1] - c.target.y) * k;
          c.target.z += (shot.target[2] - c.target.z) * k;
          c.update?.();
        }
      }
      if (c) c.enabled = true;
      return;
    }

    const shot = shotFor(stepId, false);
    if (focus.current.t < 1.25) {
      camera.position.x += (shot.pos[0] - camera.position.x) * k;
      camera.position.y += (shot.pos[1] - camera.position.y) * k;
      camera.position.z += (shot.pos[2] - camera.position.z) * k;
      if (c?.target) {
        c.target.x += (shot.target[0] - c.target.x) * k;
        c.target.y += (shot.target[1] - c.target.y) * k;
        c.target.z += (shot.target[2] - c.target.z) * k;
        c.update?.();
      }
    }
    if (c) c.enabled = !grab;
  });
  return null;
}
