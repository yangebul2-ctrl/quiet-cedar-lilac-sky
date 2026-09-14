import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useGame } from "./store";
import type { InteractId } from "./steps";
import { STEPS } from "./steps";
import { FittedGltf, GhostHit, Highlight, MODEL } from "./Models";
import { CameraDirector } from "./Valves";
import { CODEX_ENTRIES } from "./model-urls";

const CYL_H = 1.28;
const REG_SIZE = 0.5;
const HOSE_SIZE = 0.82;
const WRENCH_SIZE = 0.52;

type Combo = "parts" | "reg" | "hose" | "kit" | "silence";

function useCombo(): Combo {
  return useGame((s) => {
    if (s.revealed) return "silence";
    if (s.outletFitted && s.outletProgress > 0.88) return "kit";
    if (s.hoseFitted && s.hoseProgress > 0.88) return "hose";
    if (s.regulatorFitted && s.regulatorProgress > 0.88) return "reg";
    return "parts";
  });
}

function pulse(mat: THREE.MeshStandardMaterial | null, active: boolean, t: number, color: string) {
  if (!mat) return;
  mat.emissive.set(active ? color : "#000000");
  mat.emissiveIntensity = active ? 0.28 + Math.sin(t * 4.2) * 0.22 : 0;
}

function Clickable({
  id,
  children,
  position,
  rotation,
}: {
  id: InteractId;
  children: ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const highlights = useGame((s) => STEPS.find((x) => x.id === s.stepId)!.highlights);
  const active = highlights.includes(id);
  return (
    <group
      position={position}
      rotation={rotation}
      onClick={
        active
          ? (e) => {
              e.stopPropagation();
              useGame.getState().interact(id);
            }
          : undefined
      }
      onPointerOver={
        active
          ? (e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }
          : undefined
      }
      onPointerOut={
        active
          ? () => {
              document.body.style.cursor = "default";
            }
          : undefined
      }
    >
      {children}
    </group>
  );
}

function Floor() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#1a2228" roughness={0.92} metalness={0.05} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
        <ringGeometry args={[0.78, 0.88, 48]} />
        <meshStandardMaterial color="#c47b48" roughness={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <ringGeometry args={[0.88, 0.96, 48]} />
        <meshStandardMaterial color="#1a1612" roughness={0.8} />
      </mesh>
      <gridHelper args={[14, 28, "#243038", "#1c262c"]} position={[0, 0.004, 0]} />
    </>
  );
}

function Room() {
  return (
    <group>
      <mesh position={[0, 1.6, -3.4]} receiveShadow>
        <boxGeometry args={[10, 3.2, 0.12]} />
        <meshStandardMaterial color="#151c22" roughness={0.9} />
      </mesh>
      <mesh position={[-3.6, 1.6, 0]} receiveShadow>
        <boxGeometry args={[0.12, 3.2, 8]} />
        <meshStandardMaterial color="#12181d" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.15, 0]}>
        <boxGeometry args={[10, 0.08, 8]} />
        <meshStandardMaterial color="#0e1418" roughness={1} />
      </mesh>
      <mesh position={[-1.6, 1.35, -3.28]}>
        <planeGeometry args={[1.1, 0.7]} />
        <meshStandardMaterial color="#1e2a30" roughness={0.5} />
      </mesh>
      <mesh position={[0.2, 1.35, -3.28]}>
        <planeGeometry args={[1.1, 0.7]} />
        <meshStandardMaterial color="#243036" roughness={0.5} />
      </mesh>
      <mesh position={[1.85, 1.55, -3.32]}>
        <planeGeometry args={[0.7, 0.38]} />
        <meshStandardMaterial color="#4aa3b0" roughness={0.45} metalness={0.1} />
      </mesh>
    </group>
  );
}

function Bench() {
  return (
    <group position={[1.5, 0, 0.12]}>
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.55, 0.08, 1.1]} />
        <meshStandardMaterial color="#3a2a1c" roughness={0.75} />
      </mesh>
      {[
        [-0.68, -0.46],
        [0.68, -0.46],
        [-0.68, 0.46],
        [0.68, 0.46],
      ].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, 0.2, z]} castShadow>
          <boxGeometry args={[0.08, 0.4, 0.08]} />
          <meshStandardMaterial color="#2a2118" />
        </mesh>
      ))}
    </group>
  );
}

function PopIn({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const born = useRef<number | null>(null);
  useFrame(({ clock }) => {
    if (born.current == null) born.current = clock.elapsedTime;
    const t = Math.min(1, (clock.elapsedTime - born.current) * 4.8);
    const k = 1 - (1 - t) * (1 - t) * (1 - t);
    if (ref.current) ref.current.scale.setScalar(0.94 + 0.06 * k);
  });
  return <group ref={ref}>{children}</group>;
}

function CombinedAssembly({ url, hose }: { url: string; hose: boolean }) {
  const stepId = useGame((s) => s.stepId);
  const highlights = STEPS.find((x) => x.id === stepId)!.highlights;
  const meshActive = highlights.some((h) =>
    ["regulator", "hose", "joint_reg", "joint_hose", "valve_cyl", "valve_flow", "hp_gauge", "flowmeter", "outlet"].includes(h),
  );
  const redirect = (highlights.find((h) => h !== "wrench" && h !== "soap") ?? null) as InteractId | null;

  return (
    <PopIn>
      <group
        onClick={
          redirect
            ? (e) => {
                e.stopPropagation();
                useGame.getState().interact(redirect);
              }
            : undefined
        }
        onPointerOver={
          redirect
            ? (e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }
            : undefined
        }
        onPointerOut={
          redirect
            ? () => {
                document.body.style.cursor = "default";
              }
            : undefined
        }
      >
        <Highlight active={meshActive}>
          <FittedGltf url={url} size={CYL_H} />
        </Highlight>
      </group>
      {highlights.includes("hose") && hose ? (
        <Clickable id="hose" position={[0.28, 0.72, 0.12]}>
          <GhostHit radius={0.18} />
        </Clickable>
      ) : null}
    </PopIn>
  );
}

function CylinderRig() {
  const combo = useCombo();
  const capOff = useGame((s) => s.capOff);
  if (combo !== "parts") return null;
  return (
    <group>
      <FittedGltf url={MODEL.cylinder} size={CYL_H} />
      <Cap />
      {capOff ? (
        <Clickable id="valve_cyl" position={[0, CYL_H - 0.08, 0]}>
          <GhostHit radius={0.14} />
        </Clickable>
      ) : null}
    </group>
  );
}

function Cap() {
  const capOff = useGame((s) => s.capOff);
  const p = useGame((s) => s.capProgress);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const highlights = useGame((s) => STEPS.find((x) => x.id === s.stepId)!.highlights);
  const active = highlights.includes("cap");
  useFrame(({ clock }) => pulse(mat.current, active && !capOff, clock.elapsedTime, "#4aa3b0"));
  if (p >= 1) return null;
  const y = CYL_H - 0.16 + p * 0.55;
  const rot = p * Math.PI * 4;
  return (
    <Clickable id="cap" position={[0, y, 0]} rotation={[0, rot, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.112, 0.26, 20]} />
        <meshStandardMaterial ref={mat} color="#2a3c38" metalness={0.35} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.05, 12]} />
        <meshStandardMaterial color="#1a2826" />
      </mesh>
      <GhostHit radius={0.2} />
    </Clickable>
  );
}

function Regulator() {
  const combo = useCombo();
  const fitted = useGame((s) => s.regulatorFitted);
  const p = useGame((s) => s.regulatorProgress);
  const highlights = useGame((s) => STEPS.find((x) => x.id === s.stepId)!.highlights);
  const active =
    highlights.includes("regulator") ||
    highlights.includes("hp_gauge") ||
    highlights.includes("valve_flow") ||
    highlights.includes("flowmeter");

  if (fitted && combo !== "parts") return null;

  const bench: [number, number, number] = [1.32, 0.46, -0.12];
  const seated: [number, number, number] = [0.012, CYL_H - 0.14, 0.0];
  const pos: [number, number, number] = fitted
    ? [
        bench[0] + (seated[0] - bench[0]) * p,
        bench[1] + (seated[1] - bench[1]) * p,
        bench[2] + (seated[2] - bench[2]) * p,
      ]
    : bench;
  const yaw = fitted ? 0.55 * p + 0.35 * (1 - p) : 0.55;

  return (
    <group position={pos} rotation={[0, yaw, 0]}>
      <Clickable id="regulator">
        <Highlight active={active}>
          <FittedGltf url={MODEL.regulator} size={REG_SIZE} />
        </Highlight>
        <GhostHit radius={0.22} />
      </Clickable>
    </group>
  );
}

function Hose() {
  const combo = useCombo();
  const fitted = useGame((s) => s.hoseFitted);
  const p = useGame((s) => s.hoseProgress);
  const flow = useGame((s) => s.flowLpm);
  const highlights = useGame((s) => STEPS.find((x) => x.id === s.stepId)!.highlights);
  const active = highlights.includes("hose") || highlights.includes("joint_hose");

  if (fitted && (combo === "hose" || combo === "kit" || combo === "silence")) return null;

  const bench: [number, number, number] = [1.46, 0.46, 0.36];
  const seated: [number, number, number] = [0.17, 1.04, 0.03];
  const pos: [number, number, number] = fitted
    ? [
        bench[0] + (seated[0] - bench[0]) * p,
        bench[1] + (seated[1] - bench[1]) * p,
        bench[2] + (seated[2] - bench[2]) * p,
      ]
    : bench;
  const rot: [number, number, number] = fitted
    ? [(-Math.PI / 2) * p, 0.15 - 0.4 * p, 0]
    : [0, 0.28, 0];

  return (
    <group>
      <Clickable id="hose" position={pos} rotation={rot}>
        <Highlight active={active}>
          <FittedGltf url={MODEL.hose} size={HOSE_SIZE} />
        </Highlight>
        <GhostHit radius={0.2} />
      </Clickable>
      {flow > 2 ? (
        <mesh position={[0.42, 0.72, 0.18]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#9fd2dc" transparent opacity={0.35} />
        </mesh>
      ) : null}
    </group>
  );
}

function Outlet() {
  const fitted = useGame((s) => s.outletFitted);
  const p = useGame((s) => s.outletProgress);
  const combo = useCombo();
  const highlights = useGame((s) => STEPS.find((x) => x.id === s.stepId)!.highlights);
  const active = highlights.includes("outlet");
  if (combo === "kit" || combo === "silence") return null;
  const bench: [number, number, number] = [1.28, 0.46, 0.62];
  const seated: [number, number, number] = [0.52, 0.42, 0.32];
  const pos: [number, number, number] = fitted
    ? [
        bench[0] + (seated[0] - bench[0]) * p,
        bench[1] + (seated[1] - bench[1]) * p,
        bench[2] + (seated[2] - bench[2]) * p,
      ]
    : bench;
  const rot: [number, number, number] = fitted ? [0.2 * p, -0.55 * p, 0.08 * p] : [0, 0.45, 0];
  return (
    <Clickable id="outlet" position={pos} rotation={rot}>
      <Highlight active={active}>
        <FittedGltf url={MODEL.tangled} size={0.48} />
      </Highlight>
      <GhostHit radius={0.2} />
    </Clickable>
  );
}

function Wrench() {
  const swing = useGame((s) => s.wrenchSwing);
  const fitted = useGame((s) => s.regulatorFitted);
  const hoseFitted = useGame((s) => s.hoseFitted);
  const combo = useCombo();
  const highlights = useGame((s) => STEPS.find((x) => x.id === s.stepId)!.highlights);
  const active = highlights.includes("wrench");
  const using = swing > 0 && fitted;
  const onHose = using && hoseFitted && highlights.includes("hose");
  const pos: [number, number, number] = using
    ? onHose
      ? combo === "hose"
        ? [0.26, 1.06, 0.12]
        : [0.22, 1.24, 0.1]
      : combo !== "parts"
        ? [0.16, 1.12, 0.08]
        : [0.16, CYL_H - 0.06, 0.1]
    : [1.62, 0.46, -0.4];
  const rot: [number, number, number] = using
    ? [0.2, 0.7, Math.sin(swing * Math.PI) * 0.55]
    : [0, 0.85, 0];
  return (
    <Clickable id="wrench" position={pos} rotation={rot}>
      <Highlight active={active}>
        <FittedGltf url={MODEL.wrench} size={WRENCH_SIZE} />
      </Highlight>
      <GhostHit radius={0.18} />
    </Clickable>
  );
}

function SoapBottle() {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const highlights = useGame((s) => STEPS.find((x) => x.id === s.stepId)!.highlights);
  const active = highlights.includes("soap");
  useFrame(({ clock }) => pulse(mat.current, active, clock.elapsedTime, "#4aa3b0"));
  return (
    <Clickable id="soap" position={[0.92, 0.55, 0.22]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.035, 0.04, 0.12, 12]} />
        <meshStandardMaterial ref={mat} color="#d5e4ea" transparent opacity={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.075, 0]}>
        <cylinderGeometry args={[0.018, 0.022, 0.04, 8]} />
        <meshStandardMaterial color="#2a333a" />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <coneGeometry args={[0.012, 0.03, 8]} />
        <meshStandardMaterial color="#4aa3b0" />
      </mesh>
      <GhostHit radius={0.1} />
    </Clickable>
  );
}

function Bubbles() {
  const amount = useGame((s) => s.bubbles);
  const leak = useGame((s) => s.leak);
  const fitted = useGame((s) => s.regulatorFitted);
  const hoseFitted = useGame((s) => s.hoseFitted);
  const pts = useMemo(() => {
    return Array.from({ length: 14 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 0.02 + Math.random() * 0.05,
      s: 0.6 + Math.random() * 0.8,
    }));
  }, []);
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.children.forEach((c, i) => {
      const p = pts[i];
      c.position.y = (clock.elapsedTime * p.s * 0.12 + i * 0.03) % 0.28;
      const sc = 0.6 + Math.sin(clock.elapsedTime * 3 + i) * 0.2;
      c.scale.setScalar(sc);
    });
  });
  if (amount < 0.05 || !fitted) return null;
  const positions: [number, number, number][] = [];
  if (leak.reg) positions.push([0.08, 1.16, 0]);
  if (leak.hose && hoseFitted) positions.push([0.22, 1.06, 0.08]);
  if (positions.length === 0 && amount > 0) positions.push([0.08, 1.14, 0.04]);
  return (
    <>
      {positions.map((pos, i) => (
        <group key={i} position={pos} ref={i === 0 ? ref : undefined}>
          {pts.map((p, n) => (
            <mesh key={n} position={[Math.cos(p.a) * p.r, 0, Math.sin(p.a) * p.r]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshPhysicalMaterial color="#dbeff2" transparent opacity={0.55} roughness={0.1} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

function GasJet() {
  const gas = useGame((s) => s.gasLeak);
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 80;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.1;
      arr[i * 3 + 1] = Math.random() * 0.4;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i) + dt * (0.6 + (i % 5) * 0.15);
      if (y > 0.5) y = 0;
      pos.setY(i, y);
      pos.setX(i, pos.getX(i) * 0.98 + (Math.random() - 0.5) * 0.01);
    }
    pos.needsUpdate = true;
  });
  if (gas < 0.05) return null;
  return (
    <points ref={ref} position={[0.02, CYL_H, 0]} geometry={geo}>
      <pointsMaterial color="#cfe8ec" size={0.025} transparent opacity={0.55 * gas} depthWrite={false} />
    </points>
  );
}

function Rig() {
  const trauma = useGame((s) => s.trauma);
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1);
    useGame.getState().tick(d);
    const shake = trauma * trauma;
    if (shake > 0.002) {
      state.camera.position.x += (Math.random() - 0.5) * shake * 0.08;
      state.camera.position.y += (Math.random() - 0.5) * shake * 0.05;
    }
  });
  return null;
}

function Lights() {
  return (
    <>
      <hemisphereLight args={["#d7e2e8", "#3a3228", 0.85]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        castShadow
        position={[3.4, 6.2, 2.8]}
        intensity={1.65}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={16}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <spotLight position={[-1.6, 4.4, 3.2]} intensity={0.95} angle={0.55} penumbra={0.7} color="#e7eef2" />
      <pointLight position={[0.6, 2.1, 1.4]} intensity={0.55} color="#f3efe6" distance={6} />
      <Environment frames={1} resolution={256} environmentIntensity={0.55}>
        <Lightformer intensity={2.2} rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]} scale={[12, 12, 1]} color="#eef3f6" />
        <Lightformer intensity={1.3} position={[4, 2, 3]} scale={[4, 7, 1]} color="#d5e4ec" />
        <Lightformer intensity={0.7} position={[-3.5, 1.6, 2]} scale={[3, 5, 1]} color="#f0e4d4" />
        <Lightformer intensity={0.45} position={[0, 1.2, -4]} scale={[8, 3, 1]} color="#8a9aa6" />
      </Environment>
    </>
  );
}

function SideChair() {
  const revealed = useGame((s) => s.revealed);
  const stepId = useGame((s) => s.stepId);
  const active = stepId === "press_chair";
  if (revealed) return null;
  return (
    <group position={[-0.95, 0, 0.22]} rotation={[0, 0.85, 0]}>
      {active ? (
        <Clickable id="chair">
          <Highlight active>
            <FittedGltf url={MODEL.chair} size={1.08} />
          </Highlight>
          <GhostHit radius={0.38} />
        </Clickable>
      ) : (
        <FittedGltf url={MODEL.chair} size={1.08} />
      )}
    </group>
  );
}

function Assembly() {
  const combo = useCombo();
  return (
    <>
      <CylinderRig />
      {combo === "reg" ? <CombinedAssembly url={MODEL.n2Reg} hose={false} /> : null}
      {combo === "hose" ? <CombinedAssembly url={MODEL.n2RegHose} hose /> : null}
      {combo === "kit" ? <CombinedAssembly url={MODEL.outlet} hose /> : null}
      {combo === "silence" ? <CombinedAssembly url={MODEL.silence} hose /> : null}
      <Regulator />
      <Hose />
      <Outlet />
    </>
  );
}

export function World() {
  const grab = useGame((s) => s.valveGrab);
  const inspect = useGame((s) => s.codexOpen);
  const admire = useGame((s) => s.screen === "admire");
  return (
    <>
      <color attach="background" args={["#0b0f12"]} />
      <fog attach="fog" args={["#0b0f12", admire ? 10 : 8, admire ? 18 : 16]} />
      <Lights />
      <OrbitControls
        makeDefault
        enabled={!inspect && !grab}
        enablePan={false}
        autoRotate={admire}
        autoRotateSpeed={0.55}
        minPolarAngle={admire ? 0.12 : 0.2}
        maxPolarAngle={admire ? Math.PI / 1.45 : Math.PI / 1.9}
        minDistance={admire ? 1.05 : 1.5}
        maxDistance={admire ? 6.8 : 5.5}
        target={admire ? [0.08, 0.72, 0.04] : [0.18, 0.9, 0]}
      />
      <CameraDirector />
      <Rig />
      {inspect ? (
        <CodexStage />
      ) : (
        <>
          <Floor />
          <Room />
          <Bench />
          <SideChair />
          <Assembly />
          <Wrench />
          <SoapBottle />
          <Bubbles />
          <GasJet />
        </>
      )}
      <ContactShadows position={[0, 0.01, 0]} opacity={0.42} scale={8} blur={2.4} far={4} />
    </>
  );
}

function CodexStage() {
  const id = useGame((s) => s.codexId);
  const yaw = useGame((s) => s.codexYaw);
  const pitch = useGame((s) => s.codexPitch);
  const entry = CODEX_ENTRIES.find((e) => e.id === id) ?? CODEX_ENTRIES[0];
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[2.4, 48]} />
        <meshStandardMaterial color="#161c20" roughness={0.92} />
      </mesh>
      <group position={[0, 0.71, 0]} rotation={[pitch, yaw, 0]}>
        <group position={[0, -0.71, 0]}>
          <FittedGltf key={entry.url} url={entry.url} size={1.42} />
        </group>
      </group>
    </group>
  );
}
