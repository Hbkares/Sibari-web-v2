"use client";

import { useRef, useState } from "react";
import { useScrollReveal } from "@/lib/motion/reveal";
import type { RemakeVideo } from "@/lib/youtube/types";
import { RemakeCard } from "./remake-card";
import { RemakesLightbox } from "./remakes-lightbox";
import styles from "./remakes-grid.module.css";

/**
 * Editorial asymmetric grid + single-lightbox playback (SIB-27 §3). Owns the
 * "which video is open" state so at most one `youtube-nocookie.com` iframe
 * ever exists — the load-bearing perf decision that keeps this compatible
 * with the locked Lighthouse CI gates (SIB-14).
 */
export function RemakesGrid({ remakes }: { remakes: RemakeVideo[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [activeRemake, setActiveRemake] = useState<RemakeVideo | null>(null);

  useScrollReveal(gridRef, remakes.length);

  function handleOpen(remake: RemakeVideo, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setActiveRemake(remake);
  }

  function handleClose() {
    setActiveRemake(null);
    // Returns focus to the card that opened the dialog (SIB-27 §3/§5 a11y).
    triggerRef.current?.focus();
  }

  return (
    <>
      <div ref={gridRef} className={styles.grid}>
        {remakes.map((remake) => (
          <RemakeCard
            key={remake.id}
            remake={remake}
            featured={remake.position === 0}
            onOpen={handleOpen}
          />
        ))}
      </div>
      {activeRemake && (
        <RemakesLightbox remake={activeRemake} onClose={handleClose} />
      )}
    </>
  );
}
