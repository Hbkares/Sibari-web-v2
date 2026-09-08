import type { ReactNode } from "react";
import styles from "./room.module.css";

/**
 * Semantic shell shared by every room route: one <section>/<h1> pair per
 * page. Visual treatment is intentionally bare — art direction (SIB-11)
 * applies the palette/typography system on top of this structure.
 */
export function Room({
  id,
  eyebrow,
  title,
  lead,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={styles.room}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 id={headingId} className={styles.title}>
          {title}
        </h1>
        {lead ? <p className={styles.lead}>{lead}</p> : null}
      </header>
      {children}
    </section>
  );
}
