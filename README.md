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
- **CMS**: [Sanity](https://www.sanity.io/), per the Content Architect's
  schema (SIB-4) — `src/lib/sanity/` holds the query layer. `sanityFetch`
  (`src/lib/sanity/fetch.ts`) hits the Sanity Query API directly with
  `fetch` so Next's request memoization/ISR apply, and returns `null`
  when the project isn't configured, which every room treats as an
  empty state rather than a build failure. **No Sanity project exists
  yet** — copy `.env.example` to `.env.local` and fill in
  `NEXT_PUBLIC_SANITY_PROJECT_ID` once one is provisioned.

## Room structure

The site is routed as the room sequence from the concept (`src/lib/rooms.ts`):
Home (`/`) → Universe (`/universe`) → Releases (`/releases`) → Selected
Tracks (`/tracks`) → Visuals (`/visuals`) → Story (`/story`) → Contact
(`/contact`). Each room is a real route under `src/app/`, server-rendered
with semantic HTML per room per plan §3.1 — this exists independently of
whether the WebGL layer loads, so search engines and no-JS visitors still
get real content. `src/components/rooms/room.tsx` is the shared
`<section>`/`<h1>` shell every room uses; `RoomFooterNav` links each room
to its neighbors. The 3D layer's continuous camera movement between rooms
(SIB-9) is a progressive enhancement on top of this route graph, not a
replacement for it.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Sanity credentials once provisioned
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
