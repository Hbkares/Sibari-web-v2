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

gsap.registerPlugin(ScrollTrigger);

const ScrollContext = createContext<RefObject<Lenis | null> | null>(null);

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

  useEffect(() => {
    const instance = new Lenis({
      autoRaf: false,
    });
    lenisRef.current = instance;

    instance.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      instance.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <ScrollContext.Provider value={lenisRef}>{children}</ScrollContext.Provider>
  );
}

export function useLenis() {
  return useContext(ScrollContext);
}
