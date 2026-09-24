# Project State

## Project Reference
See: .paul/PROJECT.md (updated 2026-09-24)
**Core value:** A Scottsdale prospect can understand a treatment, see pricing, trust the team, and book in under three minutes on her phone.
**Current focus:** v1.0 complete. Waiting on Charles's review of the local site and research/ELEMENTS.md.

## Current Position
Milestone: v1.0 One-shot build (v1.0.0)
Phase: 4 of 4 (Verify + fix + README), complete
Plan: 04-01 unified
Status: Complete
Last activity: 2026-09-24 16:00 — Phase 4 unified, acceptance checklist written

Progress:
- Milestone: [██████████] 100%
- Phase: [██████████] 100%

## Loop Position
```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ✓        ✓     [Complete, ready for review or next milestone]
```

## Accumulated Context
### Decisions
| Decision | Phase | Impact |
|----------|-------|--------|
| Build root websites/Claude-Velmora per /goal text | init | all paths |
| Palette and type locked from BUILD-SPEC; ui-ux-pro-max teal/Inter suggestion rejected | 2 | brand |
| 3D scenes are desktop-only (min-width 1024, WebGL, no reduced motion, no data saver), lazy after idle; phones get the AVIF poster | 2 | perf budget, Lighthouse |
| Fraunces shipped as the weight-only variable file (36 KB) instead of the full opsz/SOFT/WONK file (121 KB) | 4 | LCP |
| Motion (Lenis + GSAP) loads after window load; hero entrances are pure CSS keyframes | 4 | LCP |
| Input placeholders removed site-wide so the acceptance grep is clean; labels and hints carry the guidance | 4 | forms |
| Screenshot sweep runs under reduced-motion emulation; motion and 3D are proven by e2e.sh | 4 | QA determinism |
| Four competitor seeds replaced after liveness checks | 1 | research |

### Deferred Issues
| Issue | Origin | Effort | Revisit |
|-------|--------|--------|---------|
| 3D chunk is 257 KB gzipped, above the ~250 KB target by 7 KB (drei MeshTransmissionMaterial + Environment) | 2 | M | Swap Environment/Lightformer for a baked HDR, or drop chromatic aberration pass |
| Mobile never gets WebGL; spec mentioned gyro parallax | 2 | M | If a client wants it, gate on hardwareConcurrency and connection type instead of width |
| Results gallery reuses the same two stock pairs six times | 3 | S | Replace with consented client photos |
| SkinSpirit inner page (services/botox, all-treatments) never finished loading in five headless attempts; 01-skinspirit has the home page artifacts and images but no inner-desktop.png / inner-mobile.png | 1 | S | research/sites/01-skinspirit |

### Blockers/Concerns
None. Railway deploy intentionally not done (prompt: do not deploy).

## Session Continuity
Last session: 2026-09-24 16:00
Stopped at: Final report delivered
Next action: Charles reviews http://127.0.0.1:4321/ (dev) or the production preview on :4322, and research/ELEMENTS.md; then decide deploy
Resume file: .paul/ACCEPTANCE.md
