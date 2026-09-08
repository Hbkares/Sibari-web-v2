import Link from "next/link";
import { ROOMS } from "@/lib/rooms";
import styles from "./site-nav.module.css";

/**
 * Persistent, real `<nav>` across every room — the app-shell-level
 * counterpart to the WebGL layer's continuous camera movement (SIB-9).
 * Server-rendered so crawlers and no-JS visitors get the full room graph.
 */
export function SiteNav() {
  return (
    <nav className={styles.nav} aria-label="Rooms">
      {ROOMS.map((room) => (
        <Link key={room.slug} href={room.slug} className={styles.link}>
          {room.label}
        </Link>
      ))}
    </nav>
  );
}
