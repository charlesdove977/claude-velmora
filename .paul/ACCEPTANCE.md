# Acceptance checklist (BUILD-SPEC section 6)

Verified 2026-09-24 against the production build served by `node server.mjs` on http://127.0.0.1:4322. Paths are relative to `websites/Claude-Velmora/`.

| # | Criterion | Result | Proof |
|---|-----------|--------|-------|
| 1 | `research/` holds 10 site folders with all artifacts, SITES.md, ELEMENTS.md with 10+ adopted elements | PASS with one gap | `research/sites/01..10-*/` each have desktop-full, mobile-full, hero, nav-open, page.html, styles.json, network.txt, images/ (7 each), notes.md. Inner page (desktop, mobile, html) present for 9 of 10; SkinSpirit's inner page timed out on four attempts (Cloudflare-slow service pages), so `01-skinspirit/inner.html` holds only the error line. `research/SITES.md`, `research/ELEMENTS.md` (10 rows + positioning). |
| 2 | `npm run build` exits 0, zero TypeScript errors | PASS | `npx astro check`: 0 errors, 0 warnings, 0 hints (76 files). `npm run build`: `[build] Complete!` |
| 3 | Every sitemap route returns 200 in preview; unknown route shows the designed 404 | PASS | `verification/status.txt` (29 routes 200, `/this-route-does-not-exist` 404); curl sweep of 29 routes plus sitemap-index.xml, robots.txt, llms.txt all 200; `verification/screens/this-route-does-not-exist-*.png` shows the designed page. |
| 4 | Booking flow completes end to end at 1440 and 390; confirmation shows ref ID; .ics downloads | PASS | `verification/e2e/results.txt` lines 1 and 2 (refs VA-…, ics=blob). Screens `verification/e2e/book-step1..4-{desktop,mobile}.png`, `book-confirmed-{desktop,mobile}.png`. |
| 5 | Contact, support, gift card, newsletter forms submit and show success; invalid input shows inline errors | PASS | `verification/e2e/results.txt` (contact errors=3, support errors=4, gift errors=3, newsletter invalid + valid). Screens `verification/e2e/form-*-invalid.png`, `form-*-success.png`. |
| 6 | Quiz produces recommendations and deep-links into `/book?treatment=` | PASS | `verification/e2e/results.txt` quiz line (`/book?treatment=hydrafacial`), `verification/e2e/quiz-results.png`. |
| 7 | Hero 3D renders on desktop; poster fallback with reduced motion | PASS | `verification/e2e/results.txt` hero 3D (canvas=1, poster hidden) and reduced motion (canvas=0, poster visible). Screens `verification/e2e/hero-3d.png`, `hero-reduced-motion.png`. Phones also get the poster by design (see decisions). |
| 8 | Lighthouse mobile on `/` and one treatment page: Perf 85+, A11y 95+, BP 95+, SEO 100 | PASS | `verification/lighthouse/home.report.html`: 90 / 100 / 100 / 100 (LCP 3.5 s, TBT 0 ms, CLS 0). `verification/lighthouse/treatment.report.html`: 98 / 100 / 100 / 100 (LCP 2.3 s). |
| 9 | No horizontal scroll at 390 / 768 / 1440; mobile menu and sticky book bar work | PASS | scrollWidth vs clientWidth on `/` after full scroll: 390 vs 390, 768 vs 768, 1440 vs 1440 (`verification/overflow.txt` for all routes; the one HSCROLL hit on the mobile home page was fixed and re-measured). Mobile menu + sticky bar: `verification/e2e/results.txt`, `verification/e2e/mobile-menu.png`, `mobile-sticky-bar.png`. |
| 10 | Screenshots of every page at 1440 and 390 saved to `verification/` and reviewed; visual bugs fixed | PASS | `verification/screens/` 60 files (30 routes x 2). Bugs found by review and fixed: hero poster rendering black (transmission material needs an opaque scene background), wordmark clipped, invalid `calc()` spacing hiding breadcrumbs under the nav on every inner page and breaking the mobile menu height, footer contrast, tap targets, concern-label overflow. Sweep runs under reduced-motion emulation for deterministic full-page stitching. |
| 11 | `grep -riE "lorem|todo|placeholder|tbd" src` returns nothing | PASS | Exit code 1, no matches. Input placeholders were removed site-wide; labels and hints carry the guidance. |
| 12 | `CREDITS.md` lists every stock image; no competitor asset in `public/` | PASS | 34 files in `stock-raw/`, 34 credited rows (loop check found no missing file). `grep -rlE "skinspirit|everbody|heyday|alchemy43|facefoundrie|lovebeautify|dermaprecision|admire|yrfb|glowbar" src public` returns nothing. |
| 13 | Browser console has zero errors on every page | PASS | `verification/console.txt`: only entry is the expected 404 resource error on `/this-route-does-not-exist`. |
| 14 | `README.md`: run, env vars, swap brand via `site.ts`, deploy to Railway | PASS | `README.md` sections Run locally, Environment variables, Swap the brand, Where things live, Deploy to Railway. |

## Beyond the checklist

- Endpoint hardening proven: rate limit returns 429 after 5 requests per minute, honeypot submissions are silently accepted (`verification/e2e/results.txt` last two lines).
- Console fallback proven: without `RESEND_API_KEY`, every endpoint logs the payload and returns `ok:true` (server log `[mail:newsletter] RESEND_API_KEY not set…`).
- Gzip and caching proven: `Content-Encoding: gzip` on HTML and assets, `Cache-Control: public, max-age=31536000, immutable` on `/_astro/*`.
- 3D bundle: 257 KB gzipped (target ~250 KB), loaded only on desktop after idle.

## Known capture artifact

In `verification/screens/*.png` the fixed nav sometimes appears drawn 40 to 100 px below the top of tall full-page captures, overlapping the first line of content. This is Playwright's full-page stitching of `position: fixed` elements, not the page: a viewport screenshot at 390 (`verification/e2e/membership-viewport-390.png`) and measured positions (nav bottom 76 px, breadcrumbs 130 px, eyebrow 175 px, scrollY 0) show the real layout is clear of the nav on every inner page.
