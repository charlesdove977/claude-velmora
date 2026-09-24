# Claude-Velmora (Velmora Aesthetics)

## What This Is

An ultra-premium, 3D-driven, fully functional multi-page website for Velmora Aesthetics, a fictional physician-led luxury medical spa in Scottsdale, Arizona. Built from licensed stock imagery, informed by a 10-site competitor teardown, with a real booking flow, quiz, support hub, pricing, membership, team, journal, and legal pages. All brand data is centralized so a real client can be swapped in one file.

## Core Value

A time-poor, research-heavy woman in Scottsdale can understand a treatment, see transparent pricing, trust the medical team, and book a consultation in under three minutes on her phone.

## Current State

| Attribute | Value |
|-----------|-------|
| Type | Application (client website) |
| Version | 0.0.0 |
| Status | Initializing |
| Last Updated | 2026-09-24 |

## Requirements

### Core Features

- Home with 3D hero (liquid-glass serum form) and a scroll-scrubbed "Velmora Method" 3D interlude
- Data-driven treatment index + detail pages (10 to 13 treatments) with SpecStrip, pricing, FAQ, JSON-LD
- 4-step booking flow (React island) posting to /api/book with Resend email + .ics
- Treatment Match quiz (6 questions) deep-linking into /book?treatment=
- Support hub with client-side fuzzy search, aftercare guides, policies, FAQ
- Pricing, membership (3 tiers), results gallery, team (5 providers), journal (3 articles), legal, 404, styleguide
- Contact, support, gift card, newsletter endpoints with zod validation, honeypot, rate limit, Resend fallback to console

### Validated (Shipped)
None yet.

### Active (In Progress)
- [ ] Phase 1: competitor due diligence

### Planned (Next)
- [ ] Phase 2: design system + 3D + stock imagery
- [ ] Phase 3: build every route, fully functional
- [ ] Phase 4: QA, Lighthouse, README

### Out of Scope
- Railway deploy (after review)
- Real booking system embed (Boulevard / Zenoti), CMS, domain/DNS
- Generated likeness imagery; all imagery is licensed stock

## Target Users

**Primary:** Women 30 to 58, household income $150k+, time-poor, research-heavy, mobile-first.
**Secondary:** Men 35 to 55 (Botox, hair, body).

## Constraints

### Technical Constraints
- Astro 5 + Tailwind + React islands only where interactive + three.js via @react-three/fiber and drei + GSAP/ScrollTrigger + Lenis + zod + Resend. Nothing else without a logged reason.
- @astrojs/node adapter (standalone), matches websites/charlie-automates
- 3D JS under ~250KB gzipped, dpr [1, 1.75], poster fallback, reduced-motion path
- Lighthouse mobile: Perf 85+, A11y 95+, BP 95+, SEO 100

### Business Constraints
- One autonomous pass, no human intervention; self-approve plans
- No competitor copy, images, logos, or code ever ships; research/ never enters public/ or src/

### Compliance Constraints
- Medical copy never guarantees outcomes; "Illustrative imagery. Not actual patient results." on stock before/after
- No PHI persisted to disk

## Key Decisions

| Decision | Rationale | Date | Status |
|----------|-----------|------|--------|
| Build root is websites/Claude-Velmora (not websites/velmora-medspa) | Charles's /goal instruction names the folder Claude-Velmora; goal text overrides the prompt file | 2026-09-24 | Active |
| Astro 5 over Next.js | Every site in websites/ is Astro; static-first gives perf budget room for 3D | 2026-09-24 | Active |
| 3D concentrated in hero + one interlude | Keeps mobile fast | 2026-09-24 | Active |

## Success Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Research folders | 10 complete + SITES.md + ELEMENTS.md | 0 | Not started |
| npm run build | exit 0, zero TS errors | - | Not started |
| Lighthouse mobile / and treatment page | Perf 85+, A11y 95+, BP 95+, SEO 100 | - | Not started |
| Forms | booking, contact, support, gift card, newsletter submit end to end | - | Not started |
| Content | grep lorem/todo/placeholder/tbd in src returns nothing | - | Not started |

## Tech Stack / Tools

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Astro 5, @astrojs/node standalone | matches workspace |
| UI | Tailwind CSS 3, React 19 islands | islands only where interactive |
| 3D | three, @react-three/fiber, @react-three/drei | lazy loaded, poster fallback |
| Motion | GSAP + ScrollTrigger, Lenis | reduced-motion aware |
| Forms | zod, Resend | console fallback without key |
| Fonts | @fontsource (Fraunces + Manrope) | self-hosted |
| Research | playwright-cli | competitor capture + self QA |

## Links

| Resource | URL |
|----------|-----|
| Planning | projects/velmora-medspa/PLANNING.md |
| Build spec | projects/velmora-medspa/BUILD-SPEC.md |

---
*PROJECT.md — Updated when requirements or context change*
*Last updated: 2026-09-24*
