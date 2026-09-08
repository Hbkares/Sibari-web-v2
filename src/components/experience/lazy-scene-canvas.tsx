"use client";

import dynamic from "next/dynamic";

/**
 * Code-splits the Three.js/R3F bundle out of the critical path. The WebGL
 * layer is not needed for first paint/LCP, so it loads after hydration
 * instead of blocking initial JS — required by the performance budget.
 */
export const LazySceneCanvas = dynamic(
  () => import("./scene-canvas").then((mod) => mod.SceneCanvas),
  { ssr: false },
);
