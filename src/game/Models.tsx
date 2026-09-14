import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MODEL } from "./model-urls";

export { MODEL };

if (typeof window !== "undefined") {
  useGLTF.preload(MODEL.cylinder);
  useGLTF.preload(MODEL.regulator);
  useGLTF.preload(MODEL.wrench);
  useGLTF.preload(MODEL.hose);
  useGLTF.preload(MODEL.n2Reg);
  useGLTF.preload(MODEL.n2RegHose);
  useGLTF.preload(MODEL.outlet);
  useGLTF.preload(MODEL.chair);
  useGLTF.preload(MODEL.silence);
}

function geometryBounds(root: THREE.Object3D) {
  const box = new THREE.Box3();
  let first = true;
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    mesh.geometry.computeBoundingBox();
    const b = mesh.geometry.boundingBox;
    if (!b || b.isEmpty()) return;
    if (first) {
      box.copy(b);
      first = false;
    } else {
      box.union(b);
    }
  });
  return first ? null : box;
}

function cloneScene(src: THREE.Object3D) {
  const scene = src.clone(true);
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    const apply = (mat: THREE.Material) => {
      const m = mat.clone() as THREE.MeshStandardMaterial;
      // Meshy GLBs ship metalness=1. Without an envmap they render pitch black;
      // keep some metal so brass/chrome read, but let the albedo show.
      if (m.metalness !== undefined) m.metalness = Math.min(0.28, m.metalness || 0.25);
      if (m.roughness !== undefined) m.roughness = Math.max(0.36, m.roughness || 0.48);
      m.envMapIntensity = 1.15;
      m.needsUpdate = true;
      return m;
    };
    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map(apply);
    } else if (mesh.material) {
      mesh.material = apply(mesh.material);
    }
  });
  return scene;
}

const LONG: Record<string, number> = {
  "/models/cylinder.glb": 1.903,
  "/models/regulator.glb": 1.902,
  "/models/wrench.glb": 1.885,
  "/models/hose.glb": 1.903,
  "/models/n2-reg.glb": 1.903,
  "/models/n2-reg-hose.glb": 1.903,
  "/models/outlet.glb": 1.901,
  "/models/chair.glb": 1.902,
  "/models/silence.glb": 1.902,
};

/** Sit the model on y=0 of this group and scale so its longest side equals `size`. */
export function FittedGltf({ url, size }: { url: string; size: number }) {
  const { scene } = useGLTF(url);
  const obj = useMemo(() => cloneScene(scene), [scene]);
  const box = useMemo(() => geometryBounds(obj), [obj]);
  const { s, pos } = useMemo(() => {
    const dim = box?.getSize(new THREE.Vector3());
    const measured = dim ? Math.max(dim.x, dim.y, dim.z) : 0;
    const longest = measured > 0.4 && measured < 4 ? measured : (LONG[url] ?? 1.9);
    const scale = size / longest;
    const p: [number, number, number] = box
      ? [-(box.min.x + box.max.x) * 0.5 * scale, -box.min.y * scale, -(box.min.z + box.max.z) * 0.5 * scale]
      : [0, 0, 0];
    return { s: scale, pos: p };
  }, [box, url, size]);
  return (
    <group scale={s} position={pos}>
      <primitive object={obj} />
    </group>
  );
}

export function Highlight({ active, children }: { active: boolean; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const em = active ? 0.32 + Math.sin(clock.elapsedTime * 4.2) * 0.22 : 0;
    g.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of mats) {
        const m = mat as THREE.MeshStandardMaterial;
        if (!m?.emissive) continue;
        m.emissive.set(active ? "#4aa3b0" : "#000000");
        m.emissiveIntensity = em;
      }
    });
  });
  return <group ref={ref}>{children}</group>;
}

export function GhostHit({ radius = 0.1 }: { radius?: number }) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 10, 10]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
