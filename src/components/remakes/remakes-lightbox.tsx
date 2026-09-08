"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "@/lib/motion/scroll-provider";
import type { RemakeVideo } from "@/lib/youtube/types";
import styles from "./remakes-lightbox.module.css";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

/**
 * Focus-trapped dialog (SIB-27 §5): `role="dialog"`/`aria-modal`, Esc/scrim/
 * close all exit, focus never escapes while open. Mounted only while a video
 * is selected, so its `youtube-nocookie.com` iframe is created on open and
 * torn down on close — never more than one live at a time (§3), the decision
 * that keeps this section inside the locked Lighthouse CI gates (SIB-14).
 */
export function RemakesLightbox({
  remake,
  onClose,
}: {
  remake: RemakeVideo;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lenisRef = useLenis();

  useEffect(() => {
    // Pauses the shared Lenis instance instead of toggling body overflow —
    // Lenis owns scroll physics for the whole page (ScrollProvider), so
    // fighting it with a CSS override would desync the two. Captured up
    // front: `lenisRef.current` is a plain mutable ref (not a DOM node),
    // safe to read once and reuse in the cleanup closure below.
    const lenis = lenisRef?.current;
    lenis?.stop();
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable =
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      lenis?.start();
    };
  }, [lenisRef, onClose]);

  const title = remake.originalArtist
    ? `${remake.originalArtist} — ${remake.track}`
    : remake.track || remake.rawTitle;

  return (
    <div
      className={styles.scrim}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={styles.dialog}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className={styles.player}>
          <iframe
            key={remake.id}
            src={`https://www.youtube-nocookie.com/embed/${remake.id}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.iframe}
          />
        </div>
      </div>
    </div>
  );
}
