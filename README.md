# Velmora Aesthetics (Claude-Velmora)

Ultra-premium, 3D-driven, fully functional website for a physician-led luxury medical spa in Scottsdale. Demo brand; every brand fact lives in one file so a real client swaps in without touching pages.

Stack: Astro 5 (static pages + node adapter in middleware mode for `/api/*`, served by Express with compression), Tailwind, React islands only where interactive (booking flow, quiz, 3D), three.js via @react-three/fiber + drei, GSAP ScrollTrigger, Lenis, zod, Resend.

## Run locally

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # dist/ (static pages + server entry)
npm run preview      # node server.mjs: Express + compression in front of the Astro SSR handler
# or, exactly what Railway runs:
PORT=4322 HOST=127.0.0.1 node server.mjs
```

Node 22 or newer.

## Environment variables

Copy `.env.example` to `.env`. Nothing is required for a local demo: without `RESEND_API_KEY`, every form logs its payload to the server console and still returns success, so the booking flow, contact, support, gift card and newsletter forms all work end to end.

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Enables real email delivery through Resend. |
| `SPA_INBOX_EMAIL` | Where spa-side notifications go (booking requests, contact, support, gift cards). Defaults to the email in `site.ts`. |
| `EMAIL_FROM` | Verified Resend sender, e.g. `Velmora Aesthetics <hello@your-domain.com>`. |
| `RESEND_AUDIENCE_ID` | Optional. Newsletter sign-ups are added to this audience; without it they are emailed to the inbox. |
| `PUBLIC_SITE_URL` | Canonical site URL for links, sitemap and `.ics` files. Also set `site` in `astro.config.mjs`. |

No secrets are committed. `.env` is ignored by the workspace's pre-existing rules.

## Swap the brand: `src/config/site.ts`

One file holds the name, legal name, tagline, phone, email, address, coordinates, hours (which drive booking time slots), socials, medical director, consultation offers, financing partners, trust stats and the three brand colors used in emails and JSON-LD. Change it and every page, email, schema block and the `.ics` file follow.

Then:

1. Replace `src/data/treatments.ts`, `team.ts`, `memberships.ts`, `testimonials.ts`, `faq.ts`, `aftercare.ts`, `policies.ts`, `quiz.ts` with the client's real content. Field shapes are typed; the pages need no changes.
2. Replace stock imagery: drop the client's photos into `stock-raw/` using the same file names (see `CREDITS.md` for the list), then run `node scripts/optimize-images.mjs` to regenerate AVIF/WebP at three widths with the shared color grade.
3. Update colors in `src/styles/tokens.css` (and the three mirrors in `site.ts`). Tailwind reads the tokens, so utilities update automatically. Re-check contrast; the current pairs are documented at the top of `tokens.css` and on `/styleguide`.
4. Replace the typographic wordmark in `src/components/Logo.astro` and `public/logo.svg`, `favicon.svg`, `apple-touch-icon.png`.
5. Update `public/llms.txt` and `robots.txt` with the real domain.
6. If the client uses Boulevard, Zenoti or Vagaro, embed their widget on `/book` in place of `BookingFlow` or keep the flow and forward `/api/book` to their API.

## Where things live

```
src/config/site.ts          brand data (single source of truth)
src/data/*.ts               treatments, concerns, team, memberships, testimonials, FAQ, aftercare, policies, quiz
src/content/journal/*.md    journal articles (Astro content collection)
src/styles/tokens.css       design tokens (colors, type scale, motion, layout)
src/layouts/BaseLayout.astro  head, JSON-LD, nav, footer, sticky mobile book bar, motion init
src/components/ui/*         design-system components (Button, Picture, SpecStrip, Accordion, BeforeAfter, ...)
src/components/sections/*   home-page sections
src/components/islands/*    React islands: BookingFlow, Quiz
src/components/three/*      HeroScene (liquid-glass droplet), MethodScene (scroll-scrubbed morph)
src/pages/api/*.ts          book, contact, support, gift-card, newsletter (zod + honeypot + rate limit + Resend)
src/lib/*                   api helpers, schemas, slots, ics, seo (JSON-LD), images
scripts/optimize-images.mjs stock -> AVIF/WebP at 640/1200/1920 + warm grade
research/                   competitor teardown (never shipped; nothing here is referenced by src/ or public/)
verification/               QA screenshots, e2e results, Lighthouse reports
.paul/                      PAUL project state
```

## Deploy to Railway

The build outputs an Astro SSR handler (`dist/server/entry.mjs`) that `server.mjs` mounts in Express with gzip compression, long-cache static assets and the designed 404. Astro pages are prerendered; only `/api/*` runs on the server.

1. Create a Railway project from this folder (or connect the repo and set the root directory to `websites/Claude-Velmora`).
2. Build command: `npm ci && npm run build`. Start command: `node server.mjs`.
3. Variables: `HOST=0.0.0.0`, `PORT` (Railway injects it), plus the `.env` values above. Set `PUBLIC_SITE_URL` to the Railway or custom domain and update `site` in `astro.config.mjs` before building so the sitemap and canonicals are correct.
4. Add a custom domain in Railway and point DNS at it. Verify the sending domain in Resend and set `EMAIL_FROM` to match.
5. After the first deploy, submit `https://your-domain/sitemap-index.xml` in Google Search Console.

Not deployed in this pass by design; the prompt asked for a local build and review first.

## Quality gates and proof

See `verification/` for full-route screenshots at 1440 and 390, `verification/e2e/results.txt` for the functional proof (booking flow, every form valid and invalid, quiz, reduced motion, mobile menu, rate limit, honeypot), and `verification/lighthouse/` for the mobile reports. The acceptance checklist with proof paths is in `.paul/ACCEPTANCE.md`.

## Compliance posture

Medical copy never guarantees outcomes. Before/after images are stock and carry "Illustrative imagery. Not actual patient results." Testimonials are labeled illustrative. No PHI is stored on the server; form submissions are emailed and not written to disk. Minimum age 18. Medical disclaimer, privacy, terms and accessibility pages are linked from every footer.
