import Link from "next/link";
import { getAdjacentRooms } from "@/lib/rooms";
import styles from "./room-footer-nav.module.css";

/**
 * Real `<a>` links between rooms, present without JS. The 3D layer's
 * continuous camera movement (SIB-9) is a progressive enhancement on top of
 * this, not a replacement for it — crawlers and no-JS visitors still get a
 * navigable site.
 */
export function RoomFooterNav({ currentSlug }: { currentSlug: string }) {
  const { previous, next } = getAdjacentRooms(currentSlug);

  return (
    <nav className={styles.nav} aria-label="Room navigation">
      {previous ? (
        <Link href={previous.slug} className={styles.link}>
          <span className={styles.direction}>Previous room</span>
          <span className={styles.label}>{previous.label}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.slug} className={styles.link}>
          <span className={styles.direction}>Next room</span>
          <span className={styles.label}>{next.label}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
