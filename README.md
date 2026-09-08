# SIBARI — Web

Next.js (App Router) app shell for the SIBARI artist site.

The 3D WebGL rooms experience and the Sanity-driven room content layer
(SIB-8/SIB-9/SIB-4) have been removed (SIB-24) — this repo is now the
foundation for a new single-scroll site, landed in a follow-up task. What's
kept from that earlier iteration:

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Lenis + GSAP ScrollTrigger** — `src/lib/motion/scroll-provider.tsx`
  exposes a shared Lenis instance via a ref-based context, the scroll/
  timeline source of truth for whatever DOM sections land next.
- **Device tiering** — `src/lib/device/` derives a render/motion budget
  (`mobile`/`tablet`/`desktop` × `low`/`medium`/`high`) from input
  capability and GPU signals, exposed via `DeviceTierProvider`. No WebGL
  layer currently consumes it, but the scroll layer already does
  (`prefersReducedMotion`, `isTouch`).

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Quality gates

```bash
npm run lint          # eslint
npm run build          # next build (also runs typecheck)
npm run perf-budget    # Lighthouse CI against a production build
```

`npm run perf-budget` builds nothing itself — run `npm run build` first, or
let CI do it (`.github/workflows/ci.yml` runs lint → build → perf-budget on
every push/PR). Thresholds live in `lighthouserc.json`: performance,
accessibility, best-practices, and SEO categories must score >= 0.9, plus
hard caps on LCP, TBT, CLS, and JS/total byte weight. These gate every PR
from day one — do not loosen them to unblock a merge without discussing the
tradeoff with the Frontend Engineer.
