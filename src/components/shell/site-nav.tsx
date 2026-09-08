import Link from "next/link";
import { siteConfig } from "@/lib/seo/site-config";
import styles from "./site-nav.module.css";

/**
 * App-shell nav placeholder. The room-sequence nav it used to render was
 * removed with the 3D rooms experience (SIB-24) — the follow-up single-
 * scroll shell/landing task defines what replaces it.
 */
export function SiteNav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <Link href="/" className={styles.link}>
        {siteConfig.name}
      </Link>
    </nav>
  );
}
