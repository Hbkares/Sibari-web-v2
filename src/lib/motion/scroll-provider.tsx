"use client";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { useDeviceProfile } from "@/lib/device/device-tier-provider";

gsap.registerPlugin(ScrollTrigger);

/**
 * Locked easing set for room-transition and kinetic-type motion (art
 * direction system v1, §3): expo.out for settle-to-legible resolves, power3.out
 * as the softer alternate. No elastic/bounce — those read playful/pop, which
 * contradicts the nocturnal/precise/luxe tone.
 */
export const TRANSITION_EASE = {
  settle: "expo.out",
  soft: "power3.out",
} as const;

const ScrollContext = createContext<RefObject<Lenis | null> | null>(null);
const ScrollVelocityContext = createContext<RefObject<number> | null>(null);

/**
 * Single source of truth for scroll state, shared by DOM sections and the
 * WebGL layer. Lenis drives smooth-scroll physics; GSAP ScrollTrigger reads
 * from the same tick so both layers stay in sync with one scroll position.
 *
 * Exposes a ref (not reactive state) — the instance is read imperatively by
 * consumers inside their own effects/handlers, since scroll position is a
 * per-frame external value, not something that should trigger re-renders.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const velocityRef = useRef(0);
  const { prefersReducedMotion } = useDeviceProfile();

  useEffect(() => {
    const instance = new Lenis({
      autoRaf: false,
      // Touch devices scroll natively; Lenis only smooths `wheel` input by
      // default (`syncTouch` is opt-in), kept explicit here so it's a
      // deliberate contract, not an artifact of the library default. Do not
      // flip this on to make touch "feel like" desktop scroll-jacking —
      // SIB-12 requires touch-native gestures. Section-level effects (e.g.
      // GSAP ScrollTrigger `pin: true`) must branch on
      // `useDeviceProfile().isTouch` and fall back to a non-pinned,
      // scrub-only treatment on touch — pinning fights native scroll/
      // momentum and is the "desktop behavior ported down" this issue
      // exists to avoid.
      syncTouch: false,
      // SIB-18: `smoothWheel` is what lerps wheel scroll away from the raw
      // input device. Under prefers-reduced-motion, turning it off lets wheel
      // scroll pass straight through as native/instant instead of eased
      // motion. `useDeviceProfile().prefersReducedMotion` is the app-wide
      // reduced-motion source of truth (also read by camera-rig.tsx on the
      // WebGL side) so both layers honor one live-updating signal.
      smoothWheel: !prefersReducedMotion,
    });
    lenisRef.current = instance;

    instance.on("scroll", (lenis: Lenis) => {
      ScrollTrigger.update();
      velocityRef.current = lenis.velocity;
    });

    const onTick = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      instance.destroy();
      lenisRef.current = null;
      velocityRef.current = 0;
    };
  }, [prefersReducedMotion]);

  return (
    <ScrollContext.Provider value={lenisRef}>
      <ScrollVelocityContext.Provider value={velocityRef}>
        {children}
      </ScrollVelocityContext.Provider>
    </ScrollContext.Provider>
  );
}

export function useLenis() {
  return useContext(ScrollContext);
}

/**
 * Ref to the current Lenis scroll velocity, for kinetic-type/room-transition
 * distortion drivers (art direction system v1, §3): distortion amount must
 * track this value per frame, not run on a fixed autonomous loop, so motion
 * stays tied to the visitor's own movement through the space.
 */
export function useScrollVelocity() {
  return useContext(ScrollVelocityContext);
}
