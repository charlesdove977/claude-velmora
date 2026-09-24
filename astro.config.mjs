import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// Velmora Aesthetics. Static-first Astro 5 with the node adapter so the
// /api/* endpoints run server-side (booking, contact, support, gift card,
// newsletter). Every page is prerendered unless it opts out.
export default defineConfig({
  site: "https://velmora-aesthetics.com",
  output: "static",
  adapter: node({ mode: "middleware" }),
  trailingSlash: "never",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/styleguide") && !page.includes("/book/confirmed"),
    }),
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  vite: {
    resolve: { dedupe: ["react", "react-dom", "three"] },
    // Pre-bundle everything the islands and page scripts import so the dev
    // server never re-optimizes mid-session (which 504s in-flight modules).
    optimizeDeps: { include: ["react", "react-dom", "react/jsx-runtime", "zod", "gsap", "gsap/ScrollTrigger", "lenis", "three", "@react-three/fiber", "@react-three/drei"] },
  },
});
