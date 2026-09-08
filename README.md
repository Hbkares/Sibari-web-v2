# SIBARI — Web

Next.js (App Router) app shell for the SIBARI artist site. Next.js owns
structure/SEO/routing; pages hydrate into a custom WebGL layer built on
Three.js / React Three Fiber. Lenis (smooth scroll) + GSAP ScrollTrigger are
the single source of truth for scroll/timeline state across both the DOM and
the 3D scene.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Three.js** via `@react-three/fiber` — mounted through
  `src/components/experience/lazy-scene-canvas.tsx`, which code-splits the
  WebGL bundle out of the critical path (`next/dynamic`, `ssr: false`).
  The scene graph itself is the Creative Technologist's ownership boundary —
  don't add scene content to `scene-canvas.tsx` directly.
- **Lenis + GSAP ScrollTrigger** — `src/lib/motion/scroll-provider.tsx`
  exposes the shared Lenis instance via a ref-based context so both DOM
  sections and the 3D layer read the same scroll source.
- **CMS**: not yet wired — pending the Content Architect's schema.

## Getting started

```bash
npm install
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
