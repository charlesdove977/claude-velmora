// Hero 3D: a liquid-glass serum form. Loaded only when the wrapper decides the
// device can handle it (WebGL present, no reduced-motion). The Astro wrapper
// shows an AVIF poster first and fades it out once `onReady` fires.
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, Float } from "@react-three/drei";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";

const noise = new SimplexNoise();

function Droplet({ pointer, scroll }: { pointer: React.RefObject<{ x: number; y: number }>; scroll: React.RefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const group = useRef<THREE.Group>(null!);
  const geometry = useMemo(() => {
    const g = new THREE.SphereGeometry(1.15, 96, 96);
    g.userData.base = (g.attributes.position as THREE.BufferAttribute).array.slice();
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const base = geometry.userData.base as Float32Array;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.set(base[i * 3], base[i * 3 + 1], base[i * 3 + 2]);
      const n = noise.noise3d(v.x * 0.9 + t * 0.18, v.y * 0.9 + t * 0.12, v.z * 0.9);
      const n2 = noise.noise3d(v.x * 2.4 - t * 0.1, v.y * 2.4, v.z * 2.4 + t * 0.15);
      // Droplet bias: stretch slightly along Y so the form reads as a falling drop.
      const stretch = 1 + Math.max(0, v.y) * 0.12;
      const d = 1 + n * 0.07 + n2 * 0.018;
      v.multiplyScalar(d);
      v.y *= stretch;
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    // Pointer parallax + slow scroll-linked rotation and shrink as the hero exits.
    const s = scroll.current;
    const g = group.current;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.current.x * 0.35 + t * 0.08 + s * 1.6, 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -pointer.current.y * 0.25 + s * 0.6, 0.05);
    const scale = 1 - s * 0.45;
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, scale, 0.08));
    g.position.y = THREE.MathUtils.lerp(g.position.y, s * 1.2, 0.08);
  });

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
        <mesh ref={mesh} geometry={geometry}>
          <MeshTransmissionMaterial
            samples={8}
            resolution={512}
            thickness={0.9}
            roughness={0.04}
            ior={1.35}
            chromaticAberration={0.04}
            anisotropicBlur={0.15}
            distortion={0.18}
            distortionScale={0.3}
            temporalDistortion={0.08}
            attenuationDistance={2.2}
            attenuationColor="#efdcc0"
            color="#fbf7f0"
            transmission={1}
            backside
            backsideThickness={0.4}
          />
        </mesh>
      </Float>
    </group>
  );
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer intensity={2.2} color="#fff6e6" position={[0, 4, -6]} scale={[10, 4, 1]} form="rect" />
      <Lightformer intensity={1.4} color="#e9d2ad" position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} form="rect" />
      <Lightformer intensity={0.9} color="#d6ddd0" position={[6, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} form="rect" />
      <Lightformer intensity={0.6} color="#b8946a" position={[0, -5, 3]} scale={[8, 2, 1]} form="ring" />
    </Environment>
  );
}

function Scene({ onReady, pointer, scroll }: { onReady: () => void; pointer: React.RefObject<{ x: number; y: number }>; scroll: React.RefObject<number> }) {
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;
    const id = requestAnimationFrame(() => requestAnimationFrame(onReady));
    return () => cancelAnimationFrame(id);
  }, [gl, onReady]);
  return (
    <>
      <color attach="background" args={["#f5f0e8"]} />
      <Studio />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} color="#fff2df" />
      <Droplet pointer={pointer} scroll={scroll} />
    </>
  );
}

export default function HeroScene({ onReady }: { onReady?: () => void }) {
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      pointer.current.x = THREE.MathUtils.clamp(e.gamma / 30, -1, 1);
      pointer.current.y = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1);
    };
    const onScroll = () => {
      scroll.current = Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 0.9));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("deviceorientation", onOrient, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0 });
    if (wrap.current) io.observe(wrap.current);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onOrient);
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 5.2], fov: 32 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene onReady={onReady ?? (() => {})} pointer={pointer} scroll={scroll} />
        </Suspense>
      </Canvas>
    </div>
  );
}

