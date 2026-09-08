import Image from "next/image";
import type { RemakeVideo } from "@/lib/youtube/types";
import styles from "./remake-card.module.css";

interface RemakeCardProps {
  remake: RemakeVideo;
  featured: boolean;
  onOpen: (remake: RemakeVideo, trigger: HTMLButtonElement) => void;
}

/**
 * Real button, not a click-handler on a bare div (SIB-27 §5 a11y) — keyboard
 * reachable, visible gold focus ring, opens the lightbox rather than
 * navigating. Thumbnail renders graded/desaturated at rest; full color plus
 * the site's own gold ring-and-triangle mark is a hover/focus-only payoff
 * (§3) — never YouTube's red play badge.
 */
export function RemakeCard({ remake, featured, onOpen }: RemakeCardProps) {
  const index = String(remake.position + 1).padStart(2, "0");
  const title = remake.originalArtist
    ? `${remake.originalArtist} — ${remake.track}`
    : remake.track || remake.rawTitle;

  return (
    <button
      type="button"
      data-reveal
      className={`${styles.card} ${featured ? styles.featured : ""}`}
      onClick={(event) => onOpen(remake, event.currentTarget)}
      aria-label={`Play ${title} remake`}
    >
      <span className={styles.thumbWrap}>
        {remake.thumbnailUrl && (
          // `fill` + the wrapper's `aspect-ratio` (not literal width/height)
          // reserves layout space up front, because card width itself is
          // responsive (1/2/3-column grid, featured spans wider) — a fixed
          // intrinsic size wouldn't track that. Same CLS guarantee, sized to
          // the container instead of the source image.
          <Image
            src={remake.thumbnailUrl}
            alt=""
            fill
            sizes={
              featured
                ? "(min-width: 1024px) 66vw, 100vw"
                : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            }
            loading="lazy"
            className={styles.thumb}
          />
        )}
        <span className={styles.playMark} aria-hidden="true">
          <svg viewBox="0 0 48 48" className={styles.playRing}>
            <circle cx="24" cy="24" r="21" />
            <path d="M19 15L34 24L19 33Z" />
          </svg>
        </span>
        <span className={styles.duration}>{remake.durationLabel}</span>
      </span>
      <span className={styles.meta}>
        <span className={styles.index}>{index}</span>
        <span className={styles.title}>{title}</span>
        {remake.hasFlp && <span className={styles.flpTag}>FLP</span>}
      </span>
    </button>
  );
}
