import styles from "./section-stub.module.css";

/**
 * Scroll-order placeholder for a section owned by another issue (Music:
 * SIB-26, Remakes: SIB-27/33, About & Contact: SIB-31) — holds the id/anchor
 * and pacing slot in the single-scroll shell so those issues have a section
 * to build into, without this issue reaching into their content scope.
 */
export function SectionStub({
  id,
  heading,
}: {
  id: string;
  heading: string;
}) {
  return (
    <section id={id} className={styles.section} aria-label={heading}>
      <h2 className={styles.heading}>{heading}</h2>
    </section>
  );
}
