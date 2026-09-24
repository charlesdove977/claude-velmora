/** @type {import('tailwindcss').Config} */
// Every color and font here points at a CSS custom property declared in
// src/styles/tokens.css, so tokens.css stays the single source of truth.
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1440px" },
    container: { center: true, padding: { DEFAULT: "1rem", md: "2rem", xl: "3rem" }, screens: { "2xl": "1440px" } },
    extend: {
      colors: {
        bone: "var(--c-bone)",
        "bone-deep": "var(--c-bone-deep)",
        sand: "var(--c-sand)",
        stone: "var(--c-stone)",
        espresso: "var(--c-espresso)",
        "espresso-soft": "var(--c-espresso-soft)",
        ink: "var(--c-ink)",
        "ink-soft": "var(--c-ink-soft)",
        "ink-muted": "var(--c-ink-muted)",
        champagne: "var(--c-champagne)",
        "gold-text": "var(--c-gold-text)",
        sage: "var(--c-sage)",
        "sage-deep": "var(--c-sage-deep)",
        "sage-mist": "var(--c-sage-mist)",
        error: "var(--c-error)",
        success: "var(--c-success)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      fontSize: {
        "fluid-xs": "var(--fs-xs)",
        "fluid-sm": "var(--fs-sm)",
        "fluid-base": "var(--fs-base)",
        "fluid-md": "var(--fs-md)",
        "fluid-lg": "var(--fs-lg)",
        "fluid-xl": "var(--fs-xl)",
        "fluid-2xl": "var(--fs-2xl)",
        "fluid-3xl": "var(--fs-3xl)",
        "fluid-4xl": "var(--fs-4xl)",
        "fluid-5xl": "var(--fs-5xl)",
      },
      letterSpacing: { eyebrow: "0.18em", tight: "-0.02em", tighter: "-0.035em" },
      borderRadius: { sm: "var(--r-sm)", md: "var(--r-md)", lg: "var(--r-lg)", pill: "999px" },
      boxShadow: {
        soft: "var(--shadow-soft)",
        lift: "var(--shadow-lift)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        "out-expo": "var(--ease-out-expo)",
      },
      transitionDuration: { slow: "700ms", slower: "1100ms" },
      maxWidth: { content: "1440px", prose: "68ch" },
      spacing: { section: "var(--space-section)", "section-sm": "var(--space-section-sm)" },
    },
  },
  plugins: [],
};
