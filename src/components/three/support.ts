// Decides whether a device gets WebGL scenes or the static poster.
// Poster-only when: reduced motion, no WebGL, narrow viewport (the 3D bundle
// is too heavy for the mobile performance budget), or data-saver.
export function canRender3D(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function wantsHeavy3D(): boolean {
  // Cheap gates first. Creating a WebGL context can cost seconds of main
  // thread on devices without GPU acceleration, so it is probed last.
  if (typeof window === "undefined") return false;
  if (!window.matchMedia("(min-width: 1024px)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  return canRender3D();
}

export function whenIdle(cb: () => void, timeout = 1200) {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout });
  else window.setTimeout(cb, 300);
}
