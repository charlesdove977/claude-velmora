// Liquid-metal CTA link. A champagne "metal" ring rendered by the Paper
// liquid-metal shader wraps a solid pill core in the brand palette. Renders a
// static, correctly styled pill on the server and under reduced motion; the
// shader mounts after idle so it never sits on the critical path.
import { useEffect, useRef, useState } from "react";
import type React from "react";

type Variant = "primary" | "ghost" | "gold" | "ghost-light";
type Size = "sm" | "md" | "lg";

interface Props {
  href: string;
  label: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  arrow?: boolean;
}

// Brand palette as normalized RGBA for the shader.
const CHAMPAGNE: [number, number, number, number] = [0.722, 0.58, 0.416, 1];
const BONE: [number, number, number, number] = [0.961, 0.941, 0.91, 1];
const ESPRESSO: [number, number, number, number] = [0.133, 0.106, 0.09, 1];

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-[0.8125rem]",
  md: "h-12 px-7 text-fluid-sm",
  lg: "h-14 px-9 text-fluid-base",
};

const cores: Record<Variant, { core: string; text: string; ringFallback: string; back: typeof CHAMPAGNE; tint: typeof CHAMPAGNE }> = {
  primary: { core: "linear-gradient(180deg, #2e2521 0%, #221b17 100%)", text: "text-bone", ringFallback: "linear-gradient(135deg, #e6cfae, #b8946a 45%, #7a5c36)", back: CHAMPAGNE, tint: BONE },
  ghost: { core: "linear-gradient(180deg, #f8f4ee 0%, #ede6da 100%)", text: "text-ink", ringFallback: "linear-gradient(135deg, #e6cfae, #b8946a 45%, #7a5c36)", back: CHAMPAGNE, tint: BONE },
  gold: { core: "linear-gradient(180deg, #d4b98f 0%, #b8946a 100%)", text: "text-espresso", ringFallback: "linear-gradient(135deg, #fbf3e6, #e6cfae 45%, #b8946a)", back: BONE, tint: CHAMPAGNE },
  "ghost-light": { core: "linear-gradient(180deg, #3a2f2a 0%, #2e2521 100%)", text: "text-bone", ringFallback: "linear-gradient(135deg, #e6cfae, #b8946a 45%, #7a5c36)", back: CHAMPAGNE, tint: ESPRESSO },
};

export default function LiquidMetalLink({ href, label, variant = "primary", size = "md", className = "", arrow = true }: Props) {
  const ring = useRef<HTMLSpanElement>(null);
  const mount = useRef<{ setSpeed: (s?: number) => void; dispose: () => void } | null>(null);
  const [pressed, setPressed] = useState(false);
  const [hover, setHover] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const rippleId = useRef(0);
  const c = cores[variant];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    const start = async () => {
      try {
        const { ShaderMount, liquidMetalFragmentShader } = await import("@paper-design/shaders");
        if (cancelled || !ring.current) return;
        mount.current = new ShaderMount(
          ring.current,
          liquidMetalFragmentShader,
          {
            u_colorBack: c.back,
            u_colorTint: c.tint,
            u_repetition: 4,
            u_softness: 0.55,
            u_shiftRed: 0.25,
            u_shiftBlue: 0.2,
            u_distortion: 0.05,
            u_contour: 0,
            u_angle: 45,
            u_scale: 8,
            u_shape: 1,
            u_offsetX: 0.1,
            u_offsetY: -0.1,
          } as unknown as Record<string, unknown>,
          { alpha: true, antialias: false, powerPreference: "low-power" },
          0.5,
          0,
          1,
          600 * 600,
        ) as unknown as { setSpeed: (s?: number) => void; dispose: () => void };
        ring.current.classList.add("is-live");
      } catch {
        // Fallback ring gradient stays visible.
      }
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 1500 });
    else window.setTimeout(start, 400);
    return () => {
      cancelled = true;
      mount.current?.dispose();
      mount.current = null;
    };
  }, [c]);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    mount.current?.setSpeed(2.4);
    window.setTimeout(() => mount.current?.setSpeed(hover ? 1 : 0.5), 300);
    const rect = e.currentTarget.getBoundingClientRect();
    const r = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: rippleId.current++ };
    setRipples((p) => [...p, r]);
    window.setTimeout(() => setRipples((p) => p.filter((x) => x.id !== r.id)), 600);
  };

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => { setHover(true); mount.current?.setSpeed(1); }}
      onMouseLeave={() => { setHover(false); setPressed(false); mount.current?.setSpeed(0.5); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className={`lm-link group relative inline-flex select-none items-center justify-center rounded-pill font-body font-semibold tracking-wide transition-transform duration-200 ${sizes[size]} ${c.text} ${className}`}
      style={{
        transform: pressed ? "translateY(1px) scale(0.985)" : "none",
        boxShadow: hover
          ? "0 0 0 1px rgba(34,27,23,0.25), 0 12px 24px -10px rgba(34,27,23,0.35)"
          : "0 0 0 1px rgba(34,27,23,0.18), 0 18px 32px -16px rgba(34,27,23,0.3)",
      }}
    >
      {/* Metal ring: shader canvas mounts here; the gradient is the static fallback. */}
      <span ref={ring} aria-hidden="true" className="lm-ring pointer-events-none absolute inset-0 overflow-hidden rounded-pill" style={{ background: c.ringFallback }} />
      {/* Core */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-[2px] rounded-pill" style={{ background: c.core, boxShadow: pressed ? "inset 0 2px 4px rgba(0,0,0,0.35)" : "inset 0 1px 0 rgba(255,255,255,0.08)" }} />
      {/* Ripples */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-pill">
        {ripples.map((r) => (
          <span key={r.id} className="lm-ripple absolute h-5 w-5 rounded-full" style={{ left: r.x, top: r.y }} />
        ))}
      </span>
      <span className="relative z-10 inline-flex items-center gap-2">
        {label}
        {arrow && (
          <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
        )}
      </span>
    </a>
  );
}
