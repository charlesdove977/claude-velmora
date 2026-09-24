// Site-wide motion: Lenis smooth scroll, GSAP ScrollTrigger reveals, nav
// state on scroll, magnetic CTA. Everything degrades to static under
// prefers-reduced-motion, and the CSS fallback is fully visible without JS.
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

export function initMotion() {
  const reduce = reducedMotion();
  gsap.registerPlugin(ScrollTrigger);

  if (!reduce) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("lenis");
    // Lenis starts its target at 0, which would undo a deep link. Sync it to
    // the current position, then honor any hash the page loaded with.
    lenis.scrollTo(window.scrollY, { immediate: true });
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) window.setTimeout(() => lenis?.scrollTo(target as HTMLElement, { offset: -80, immediate: true }), 50);
    }
    // Anchor links go through Lenis so smooth scroll and offsets stay consistent.
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis?.scrollTo(target as HTMLElement, { offset: -80 });
      });
    });
  }

  // Reveals
  const targets = document.querySelectorAll<HTMLElement>(".reveal, .reveal-clip, .reveal-line");
  if (reduce) {
    targets.forEach((el) => el.classList.add("is-in"));
  } else {
    targets.forEach((el) => {
      const delay = Number(el.dataset.delay ?? 0);
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => {
          window.setTimeout(() => el.classList.add("is-in"), delay);
        },
      });
      if (el.classList.contains("reveal-line")) {
        Array.from(el.children).forEach((c, j) => {
          (c as HTMLElement).style.transitionDelay = `${j * 90}ms`;
        });
      }
    });
    // Elements already above the fold on load reveal immediately.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  // Nav solid-on-scroll
  const nav = document.getElementById("site-nav");
  if (nav) {
    const update = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  // Magnetic primary CTAs (pointer devices only)
  if (!reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
      const strength = 0.25;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * strength;
        const y = (e.clientY - r.top - r.height / 2) * strength;
        gsap.to(el, { x, y, duration: 0.5, ease: "power3.out" });
      });
      el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" }));
    });
  }

  // Sticky mobile book bar shows after the hero
  const bar = document.getElementById("sticky-book");
  if (bar) {
    const show = () => bar.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.6);
    show();
    window.addEventListener("scroll", show, { passive: true });
  }
}

export function toast(message: string, tone: "success" | "error" = "success") {
  const root = document.getElementById("toast-root");
  if (!root) return;
  const el = document.createElement("div");
  el.setAttribute("role", "status");
  el.className = `pointer-events-auto max-w-md rounded-md border px-5 py-3 text-fluid-sm shadow-lift transition-all duration-500 ${
    tone === "success" ? "border-champagne/50 bg-espresso text-bone" : "border-error/40 bg-bone text-error"
  }`;
  el.style.opacity = "0";
  el.style.transform = "translateY(12px)";
  el.textContent = message;
  root.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
  window.setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    window.setTimeout(() => el.remove(), 500);
  }, 4200);
}
