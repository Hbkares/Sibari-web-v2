import Link from "next/link";
import { siteConfig } from "@/lib/seo/site-config";
import styles from "./site-nav.module.css";

/**
 * Sticky wordmark for the single-scroll shell (SIB-25). The room-sequence
 * nav this used to render was removed with the 3D rooms experience
 * (SIB-24); social links now live in the fixed `SiteSidebar` instead.
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
