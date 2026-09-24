# Competitor set: the 10 sites and why

Selection date: 2026-09-24. Verified live with curl (browser UA) and playwright-cli (Chrome channel) before capture. Seed list from `projects/velmora-medspa/PLANNING.md`; dead or off-market seeds replaced.

## National design leaders (6)

| # | Site | Why it is in | Notes on selection |
|---|------|--------------|--------------------|
| 01 | [SkinSpirit](https://www.skinspirit.com) | Largest premium injectables chain; editorial serif plus dark green system, scheduler in-house, treatment-tile IA. | Seed. Live. |
| 02 | [Ever/Body](https://everbody.com) | Cosmetic dermatology positioning, provider-led proof, financing strip, mega-menu treatment taxonomy. | Seed. Live. Two on-load popups noted as a weakness, hero re-shot with them dismissed. |
| 03 | [Heyday](https://www.heydayskincare.com) | Facial-bar category leader; press marquee, membership-first, custom type. | Seed. Live. |
| 04 | [Alchemy 43](https://alchemy43.com) | Strong copy positioning on subtlety, before-and-after in primary nav, membership pricing on home. | Seed. Live. |
| 05 | [Glowbar](https://glowbar.com) | Time-promise headline, How-it-works nav, membership model. | Replacement. Seeds `ject.com` (parked GoDaddy page) and `idealimage.com` (NameBright "coming soon") are dead. |
| 06 | [Face Foundrié](https://facefoundrie.com) | Quiz as a primary nav item, floating pill nav, rounded-container section rhythm. | Replacement for `thethingswedo.com`, which returns a blank "OK" body. |

## Scottsdale, AZ rivals (4)

| # | Site | Why it is in | Notes on selection |
|---|------|--------------|--------------------|
| 07 | [Beautify Spa](https://lovebeautify.com) | Highest-volume Scottsdale med spa by review count; proof line under the hero CTA. | From "best med spa Scottsdale" search results. Live. |
| 08 | [DermaPrecision](https://dermaprecision.com) | Physician-associate-led, Conditions as a nav item, memberships. | From "Scottsdale med spa physician-led" search. Live. |
| 09 | [AdmireMD Skin + Wellness](https://www.admireplasticsurgery.com/med-spa/) | Surgeon-founded med spa, membership tiers priced on home, dark editorial video hero. | Search result. Live. |
| 10 | [Youth Renewal Face & Body](https://www.yrfb-scottsdale.com) | Physician-led positioning with the doctor as the first section after the hero. | Replacement for `glomedspa.com`, which turned out to be Glo Medspa of Wilmington, NC, not Scottsdale. |

## Capture method

`research/capture.sh` (playwright-cli, Chrome channel, isolated session per site): desktop 1440x900 full page after a scripted scroll to trigger lazy content, hero viewport shot, mobile 390x844 full page, mobile nav-open attempt, `page.html` from `document.documentElement.outerHTML`, `styles.json` computed styles for h1/h2/body/nav link/primary button, `network.txt` with three.js/Spline/GSAP/Lenis/video flags, one inner treatment page at both widths, and 7 to 8 reference images. Notes were written after looking at the screenshots.

Hard rule honored: nothing under `research/` is referenced by `src/` or `public/`.
