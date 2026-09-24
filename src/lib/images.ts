// Responsive image helper. Every stock image is exported by scripts/optimize-images.mjs
// to /images/{name}-{w}.avif and .webp at WIDTHS, plus {name}-poster.jpg for OG use.
export const WIDTHS = [640, 1200, 1920] as const;

export function srcset(name: string, ext: "avif" | "webp"): string {
  return WIDTHS.map((w) => `/images/${name}-${w}.${ext} ${w}w`).join(", ");
}

export function fallback(name: string, w: (typeof WIDTHS)[number] = 1200): string {
  return `/images/${name}-${w}.webp`;
}

export const ogImage = (name = "space-01") => `/images/${name}-1200.webp`;
