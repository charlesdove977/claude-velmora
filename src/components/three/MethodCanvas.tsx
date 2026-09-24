// Heavy chunk: the morphing form for "The Velmora Method". Loaded lazily by
// MethodScene only on capable desktop devices.
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";

const noise = new SimplexNoise();

function Morph({ progress }: { progress: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null!);
  const geometry = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1.2, 48);
    g.userData.base = (g.attributes.position as THREE.BufferAttribute).array.slice();
    return g;
  }, []);
  const mat = useRef<THREE.MeshPhysicalMaterial>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = progress.current; // 0..1 across 4 states
    const seg = p * 3;
    const s0 = THREE.MathUtils.clamp(1 - Math.abs(seg - 0), 0, 1);
    const s1 = THREE.MathUtils.clamp(1 - Math.abs(seg - 1), 0, 1);
    const s2 = THREE.MathUtils.clamp(1 - Math.abs(seg - 2), 0, 1);
    const s3 = THREE.MathUtils.clamp(1 - Math.abs(seg - 3), 0, 1);
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const base = geometry.userData.base as Float32Array;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.set(base[i * 3], base[i * 3 + 1], base[i * 3 + 2]);
      const n = noise.noise3d(v.x * 0.9 + t * 0.15, v.y * 0.9, v.z * 0.9 + t * 0.1);
      // state 0: soft droplet
      const drop = 1 + n * 0.12 + Math.max(0, v.y) * 0.1;
      // state 1: layered strata (horizontal bands like skin layers)
      const strata = 1 + Math.sin(v.y * 9 + t * 0.4) * 0.06 + n * 0.03;
      // state 2: faceted / crystalline (sharp noise)
      const facet = 1 + Math.abs(noise.noise3d(v.x * 3, v.y * 3, v.z * 3)) * 0.14;
      // state 3: smooth sphere
      const smooth = 1 + n * 0.015;
      const d = drop * s0 + strata * s1 + facet * s2 + smooth * s3;
      v.multiplyScalar(d);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
    group.current.rotation.y = t * 0.12 + p * Math.PI * 1.5;
    group.current.rotation.x = Math.sin(t * 0.2) * 0.1 + p * 0.4;
    if (mat.current) {
      mat.current.roughness = THREE.MathUtils.lerp(0.35, 0.08, s3 + s0 * 0.5);
      mat.current.color.lerpColors(new THREE.Color("#8e9a86"), new THREE.Color("#b8946a"), s2 + s3);
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial ref={mat} color="#8e9a86" roughness={0.3} metalness={0.05} clearcoat={0.8} clearcoatRoughness={0.15} sheen={0.6} sheenColor="#f5f0e8" />
      </mesh>
    </group>
  );
}


export default function MethodCanvas({ progress, active }: { progress: React.RefObject<number>; active: boolean }) {
  return (
    <Canvas dpr={[1, 1.5]} frameloop={active ? "always" : "never"} camera={{ position: [0, 0, 5], fov: 30 }} gl={{ antialias: true, alpha: true }}>
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={1.6} color="#fff3df" position={[0, 4, -5]} scale={[8, 3, 1]} form="rect" />
        <Lightformer intensity={0.8} color="#b8946a" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[5, 3, 1]} form="rect" />
        <Lightformer intensity={0.5} color="#8e9a86" position={[5, -2, 2]} rotation-y={-Math.PI / 2} scale={[5, 3, 1]} form="rect" />
      </Environment>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#fff2df" />
      <Morph progress={progress} />
    </Canvas>
  );
}
