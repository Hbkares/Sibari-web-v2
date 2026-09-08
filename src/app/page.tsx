"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./page.module.css";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = ["Home", "Universe", "Releases", "Tracks", "Visuals", "Story"];

/**
 * Stack scaffold smoke test: proves Lenis + GSAP ScrollTrigger drive DOM
 * timeline state through one shared scroll source. Content/visual design
 * belongs to the Creative Director; this page is replaced during build-out.
 */
export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(
      `.${styles.section}`,
      rootRef.current ?? undefined,
    );

    const triggers = sections.map((section) =>
      gsap.fromTo(
        section,
        { autoAlpha: 0.2, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 30%",
            scrub: true,
          },
        },
      ),
    );

    return () => {
      triggers.forEach((tween) => tween.scrollTrigger?.kill());
    };
  }, []);

  return (
    <main ref={rootRef} className={styles.page}>
      {SECTIONS.map((title) => (
        <section key={title} className={styles.section}>
          <h2>{title}</h2>
        </section>
      ))}
    </main>
  );
}
