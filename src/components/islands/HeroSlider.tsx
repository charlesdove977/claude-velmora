// Full-bleed hero slider. Desktop with WebGL: a glass-refraction transition
// between stock images (three.js, lazy-loaded after idle). Phones, reduced
// motion or no WebGL: CSS crossfade. Same copy, nav list, counter and
// letter-staggered headline animation in both paths.
import { useEffect, useRef, useState, type ReactNode } from "react";

export interface HeroSlide { image: string; title: string; description: string; nav: string; alt: string }

interface Props { slides: HeroSlide[]; eyebrow: string; note: string; children?: ReactNode }

const SLIDE_MS = 6000;
const TRANSITION_S = 2.2;
const TICK = 50;

const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const fragmentShader = `
  uniform sampler2D uTexture1, uTexture2;
  uniform float uProgress;
  uniform vec2 uResolution, uTexture1Size, uTexture2Size;
  varying vec2 vUv;
  vec2 cover(vec2 uv, vec2 size) {
    vec2 s = uResolution / size; float sc = max(s.x, s.y);
    vec2 scaled = size * sc; vec2 off = (uResolution - scaled) * 0.5;
    return (uv * uResolution - off) / scaled;
  }
  void main() {
    float t = uProgress * 5.0;
    vec2 uv1 = cover(vUv, uTexture1Size); vec2 uv2 = cover(vUv, uTexture2Size);
    float maxR = length(uResolution) * 0.85; float br = uProgress * maxR;
    vec2 p = vUv * uResolution; vec2 c = uResolution * 0.5;
    float d = length(p - c); float nd = d / max(br, 0.001);
    float inside = smoothstep(br + 3.0, br - 3.0, d);
    vec4 img;
    if (inside > 0.0) {
      float ro = 0.05 * pow(smoothstep(0.3, 1.0, nd), 1.5);
      vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
      vec2 duv = uv2 - dir * ro;
      duv += vec2(sin(t + nd * 10.0), cos(t * 0.8 + nd * 8.0)) * 0.015 * nd * inside;
      float ca = 0.006 * pow(smoothstep(0.3, 1.0, nd), 1.2);
      img = vec4(texture2D(uTexture2, duv + dir * ca * 1.2).r, texture2D(uTexture2, duv + dir * ca * 0.2).g, texture2D(uTexture2, duv - dir * ca * 0.8).b, 1.0);
      float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
      img.rgb += rim * vec3(0.10, 0.08, 0.05);
    } else { img = texture2D(uTexture2, uv2); }
    vec4 old = texture2D(uTexture1, uv1);
    if (uProgress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (uProgress - 0.95) / 0.05);
    gl_FragColor = mix(old, img, inside);
  }
`;

const split = (text: string) => {
  const words = text.split(" ");
  return words.map((word, wi) => (
    <span key={wi} className="inline-block whitespace-nowrap">
      {word.split("").map((ch, ci) => <span key={ci} className="lm-char inline-block" style={{ opacity: 0 }}>{ch}</span>)}
      {wi < words.length - 1 ? " " : ""}
    </span>
  ));
};

export default function HeroSlider({ slides, eyebrow, note, children }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<"static" | "css" | "gl">("static");
  const state = useRef({ index: 0, busy: false, timer: 0 as number, prog: 0, reduce: false });
  const gl = useRef<{ go: (from: number, to: number, done: () => void) => void; dispose: () => void } | null>(null);
  const gsapRef = useRef<typeof import("gsap")["gsap"] | null>(null);

  // Headline entrance for a slide (index picks one of three variants).
  const animateIn = (i: number) => {
    const g = gsapRef.current; const t = titleRef.current; const d = descRef.current;
    if (!t || !d) return;
    const chars = Array.from(t.querySelectorAll<HTMLElement>(".lm-char"));
    if (!g || state.current.reduce) { chars.forEach((c) => (c.style.opacity = "1")); d.style.opacity = "1"; return; }
    g.killTweensOf(chars); g.killTweensOf(d);
    const v = i % 3;
    if (v === 0) { g.set(chars, { y: 22, opacity: 0 }); g.to(chars, { y: 0, opacity: 1, duration: 0.9, stagger: 0.025, ease: "power3.out" }); }
    else if (v === 1) { g.set(chars, { filter: "blur(10px)", scale: 1.3, opacity: 0 }); g.to(chars, { filter: "blur(0px)", scale: 1, opacity: 1, duration: 1, stagger: { amount: 0.5, from: "random" }, ease: "power2.out" }); }
    else { g.set(chars, { rotationX: 90, opacity: 0, transformOrigin: "50% 50%" }); g.to(chars, { rotationX: 0, opacity: 1, duration: 0.9, stagger: 0.03, ease: "power2.out" }); }
    g.fromTo(d, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: 0.25, ease: "power3.out" });
  };
  const animateOut = (cb: () => void) => {
    const g = gsapRef.current; const t = titleRef.current; const d = descRef.current;
    if (!g || !t || !d || state.current.reduce) { cb(); return; }
    g.to(Array.from(t.querySelectorAll(".lm-char")), { y: -18, opacity: 0, duration: 0.45, stagger: 0.015, ease: "power2.in" });
    g.to(d, { y: -10, opacity: 0, duration: 0.4, ease: "power2.in", onComplete: cb });
  };

  const goTo = (target: number) => {
    const s = state.current;
    if (s.busy || target === s.index) return;
    s.busy = true; window.clearInterval(s.timer); s.prog = 0; setProgress(0);
    const from = s.index; s.index = target;
    animateOut(() => { setIndex(target); requestAnimationFrame(() => animateIn(target)); });
    const finish = () => { s.busy = false; startTimer(); };
    if (mode === "gl" && gl.current) gl.current.go(from, target, finish);
    else window.setTimeout(finish, s.reduce ? 50 : TRANSITION_S * 1000);
  };

  const startTimer = () => {
    const s = state.current; window.clearInterval(s.timer);
    if (s.reduce) return;
    s.timer = window.setInterval(() => {
      if (document.hidden) return;
      s.prog += (100 / SLIDE_MS) * TICK; setProgress(Math.min(100, s.prog));
      if (s.prog >= 100) { window.clearInterval(s.timer); goTo((s.index + 1) % slides.length); }
    }, TICK);
  };

  useEffect(() => {
    const s = state.current;
    s.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wantsGl = !s.reduce && window.matchMedia("(min-width: 1024px)").matches;
    setMode(wantsGl ? "gl" : "css");
    let disposed = false;
    (async () => {
      try {
        const { gsap } = await import("gsap"); gsapRef.current = gsap;
      } catch {}
      if (!disposed) requestAnimationFrame(() => animateIn(0));
      if (wantsGl && canvasRef.current && root.current) {
        try {
          const THREE = await import("three");
          const canvas = canvasRef.current; const box = root.current;
          const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          const scene = new THREE.Scene(); const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
          const size = () => { const r = box.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); mat.uniforms.uResolution.value.set(r.width, r.height); };
          const mat = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms: {
            uTexture1: { value: null }, uTexture2: { value: null }, uProgress: { value: 0 },
            uResolution: { value: new THREE.Vector2(1, 1) }, uTexture1Size: { value: new THREE.Vector2(1, 1) }, uTexture2Size: { value: new THREE.Vector2(1, 1) },
          } });
          scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
          const loader = new THREE.TextureLoader();
          const textures = await Promise.all(slides.map((sl) => new Promise<InstanceType<typeof THREE.Texture>>((res, rej) => loader.load(`/images/${sl.image}-1920.webp`, (t) => { t.minFilter = t.magFilter = THREE.LinearFilter; t.colorSpace = THREE.SRGBColorSpace; res(t); }, undefined, rej))));
          if (disposed) return;
          const sz = (t: InstanceType<typeof THREE.Texture>) => new THREE.Vector2((t.image as HTMLImageElement).width, (t.image as HTMLImageElement).height);
          mat.uniforms.uTexture1.value = textures[0]; mat.uniforms.uTexture1Size.value = sz(textures[0]);
          mat.uniforms.uTexture2.value = textures[1 % textures.length]; mat.uniforms.uTexture2Size.value = sz(textures[1 % textures.length]);
          size(); renderer.render(scene, camera);
          const ro = new ResizeObserver(() => { size(); renderer.render(scene, camera); }); ro.observe(box);
          let raf = 0; const loop = () => { renderer.render(scene, camera); raf = requestAnimationFrame(loop); };
          gl.current = {
            go: (from, to, done) => {
              mat.uniforms.uTexture1.value = textures[from]; mat.uniforms.uTexture1Size.value = sz(textures[from]);
              mat.uniforms.uTexture2.value = textures[to]; mat.uniforms.uTexture2Size.value = sz(textures[to]);
              const g = gsapRef.current; raf = requestAnimationFrame(loop);
              const end = () => { cancelAnimationFrame(raf); mat.uniforms.uProgress.value = 0; mat.uniforms.uTexture1.value = textures[to]; mat.uniforms.uTexture1Size.value = sz(textures[to]); renderer.render(scene, camera); done(); };
              if (g) g.fromTo(mat.uniforms.uProgress, { value: 0 }, { value: 1, duration: TRANSITION_S, ease: "power2.inOut", onComplete: end });
              else { mat.uniforms.uProgress.value = 1; end(); }
            },
            dispose: () => { cancelAnimationFrame(raf); ro.disconnect(); textures.forEach((t) => t.dispose()); mat.dispose(); renderer.dispose(); },
          };
          canvas.classList.add("is-live");
        } catch { setMode("css"); }
      }
      if (!disposed) startTimer();
    })();
    const vis = () => { if (document.hidden) window.clearInterval(state.current.timer); else if (!state.current.busy) startTimer(); };
    document.addEventListener("visibilitychange", vis);
    return () => { disposed = true; window.clearInterval(state.current.timer); document.removeEventListener("visibilitychange", vis); gl.current?.dispose(); gl.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slide = slides[index];
  return (
    <div ref={root} className="hero-slider absolute inset-0">
      {/* Backgrounds: CSS crossfade layers always present (poster + fallback); canvas on top when live. */}
      {slides.map((s, i) => (
        <picture key={s.image} className="absolute inset-0 transition-opacity duration-[1400ms] ease-out" style={{ opacity: mode === "gl" ? (i === 0 ? 1 : 0) : i === index ? 1 : 0 }} aria-hidden={i !== index}>
          <source type="image/avif" srcSet={`/images/${s.image}-640.avif 640w, /images/${s.image}-1200.avif 1200w, /images/${s.image}-1920.avif 1920w`} sizes="100vw" />
          <img src={`/images/${s.image}-1200.webp`} srcSet={`/images/${s.image}-640.webp 640w, /images/${s.image}-1200.webp 1200w, /images/${s.image}-1920.webp 1920w`} sizes="100vw" alt={i === index ? s.alt : ""} width={1920} height={1280} loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "auto"} decoding="async" className="h-full w-full object-cover" />
        </picture>
      ))}
      <canvas ref={canvasRef} className="hero-canvas absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700 [&.is-live]:opacity-100" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-espresso/35" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/40 to-espresso/30" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-espresso/90 via-espresso/55 to-transparent lg:w-3/5" aria-hidden="true" />

      {/* Counter */}
      <div className="absolute right-4 top-[calc(var(--nav-h)+1.25rem)] z-10 font-body text-[0.6875rem] uppercase tracking-eyebrow text-bone/70 md:right-8 xl:right-12">
        <span className="text-bone">{String(index + 1).padStart(2, "0")}</span> <span className="mx-1 opacity-50">/</span> {String(slides.length).padStart(2, "0")}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-content flex-col justify-start px-4 pb-24 pt-[calc(var(--nav-h)_+_3rem)] md:px-8 lg:flex-row lg:items-start lg:justify-between lg:pb-16 lg:pt-[calc(var(--nav-h)_+_4.5rem)] xl:px-12">
        <div className="max-w-2xl">
          <p className="eyebrow text-champagne">{eyebrow}</p>
          <h1 ref={titleRef} key={index} className="mt-5 min-h-[3.15em] max-w-[13ch] text-fluid-4xl text-bone [perspective:800px]" aria-label={slide.title}>{split(slide.title)}</h1>
          <p ref={descRef} className="mt-6 min-h-[4.9em] max-w-lg text-fluid-md text-bone" style={{ opacity: 0 }}>{slide.description}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">{children}</div>
          <p className="mt-5 text-fluid-xs text-bone/75">{note}</p>
        </div>

        {/* Slide navigation */}
        <nav className="mt-10 w-full lg:mt-[calc(3.15em+9rem)] lg:w-64 lg:self-end lg:pb-2" aria-label="Hero slides">
          <ul className="flex gap-3 overflow-x-auto lg:flex-col lg:gap-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {slides.map((s, i) => (
              <li key={s.image} className="shrink-0 lg:shrink">
                <button type="button" onClick={() => goTo(i)} aria-current={i === index ? "true" : undefined} className={`group flex w-full flex-col gap-2 py-2 text-left transition-colors lg:py-3 ${i === index ? "text-bone" : "text-bone/50 hover:text-bone/80"}`}>
                  <span className="relative block h-px w-16 overflow-hidden bg-bone/20 lg:w-full">
                    <span className="absolute inset-y-0 left-0 bg-champagne transition-[width] duration-100" style={{ width: i === index ? `${progress}%` : "0%" }} />
                  </span>
                  <span className="whitespace-nowrap font-body text-[0.75rem] uppercase tracking-eyebrow">{s.nav}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
