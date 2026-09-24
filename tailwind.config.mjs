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
        bone: "rgb(var(--c-bone-rgb) / <alpha-value>)",
        "bone-deep": "rgb(var(--c-bone-deep-rgb) / <alpha-value>)",
        sand: "rgb(var(--c-sand-rgb) / <alpha-value>)",
        stone: "rgb(var(--c-stone-rgb) / <alpha-value>)",
        espresso: "rgb(var(--c-espresso-rgb) / <alpha-value>)",
        "espresso-soft": "rgb(var(--c-espresso-soft-rgb) / <alpha-value>)",
        ink: "rgb(var(--c-ink-rgb) / <alpha-value>)",
        "ink-soft": "rgb(var(--c-ink-soft-rgb) / <alpha-value>)",
        "ink-muted": "rgb(var(--c-ink-muted-rgb) / <alpha-value>)",
        champagne: "rgb(var(--c-champagne-rgb) / <alpha-value>)",
        "gold-text": "rgb(var(--c-gold-text-rgb) / <alpha-value>)",
        sage: "rgb(var(--c-sage-rgb) / <alpha-value>)",
        "sage-deep": "rgb(var(--c-sage-deep-rgb) / <alpha-value>)",
        "sage-mist": "rgb(var(--c-sage-mist-rgb) / <alpha-value>)",
        error: "rgb(var(--c-error-rgb) / <alpha-value>)",
        success: "rgb(var(--c-success-rgb) / <alpha-value>)",
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
