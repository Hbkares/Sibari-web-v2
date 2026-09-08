"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, type RefObject } from "react";
import { useDeviceProfile } from "@/lib/device/device-tier-provider";
import { TRANSITION_EASE } from "./scroll-provider";

gsap.registerPlugin(ScrollTrigger);

/**
 * Locked reveal contract for editorial content grids (SIB-27 §4): cards fade
 * + rise in on scroll together, staggered. Shared by the Remakes grid and the
 * Music grid (SIB-26) so both content sections read as one hand, not two.
 */
export const SCROLL_REVEAL = {
  distance: 24,
  duration: 0.6,
  stagger: 0.08,
  ease: TRANSITION_EASE.soft,
} as const;

/**
 * Animates each `[data-reveal]` child of `containerRef` in, staggered, once
 * the container scrolls into view. No-ops (items render in their resting
 * state) under `prefers-reduced-motion`, matching ScrollProvider's site-wide
 * reduced-motion contract. `itemCount` re-runs the effect when the revealed
 * set changes (e.g. content arriving after a client-side fetch).
 */
export function useScrollReveal(
  containerRef: RefObject<HTMLElement | null>,
  itemCount: number,
) {
  const { prefersReducedMotion } = useDeviceProfile();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || itemCount === 0) return;

    const items = container.querySelectorAll<HTMLElement>("[data-reveal]");
    if (items.length === 0) return;

    if (prefersReducedMotion) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(items, { opacity: 0, y: SCROLL_REVEAL.distance });
    const tween = gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: SCROLL_REVEAL.duration,
      stagger: SCROLL_REVEAL.stagger,
      ease: SCROLL_REVEAL.ease,
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [containerRef, itemCount, prefersReducedMotion]);
}
