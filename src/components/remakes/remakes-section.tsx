import { getRemakes } from "@/lib/youtube/fetch";
import { remakesJsonLd } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { RemakesGrid } from "./remakes-grid";
import styles from "./remakes-section.module.css";

/**
 * Section 3 of the single-scroll site (SIB-27 remakes-treatment): curated
 * grid of graded YouTube thumbnails + on-demand lightbox playback, sourced
 * server-side from the "FL Studio Remakes" playlist. Standalone for now —
 * SIB-25 builds the shell this slots into; wiring it into the page happens
 * once that lands (issue's sequencing note).
 */
export async function RemakesSection() {
  const remakes = await getRemakes();

  return (
    <section
      id="remakes"
      className={styles.section}
      aria-labelledby="remakes-heading"
    >
      <div className={styles.header}>
        <p className={styles.eyebrow}>Archive</p>
        <h2 id="remakes-heading" className={styles.heading}>
          Remakes
        </h2>
      </div>
      {remakes.length > 0 ? (
        <>
          <JsonLd data={remakesJsonLd(remakes)} />
          <RemakesGrid remakes={remakes} />
        </>
      ) : (
        // Renders instead of failing the build when YOUTUBE_API_KEY isn't
        // set yet, or the playlist is temporarily empty — same contract as
        // the Spotify/Sanity data sources.
        <p className={styles.empty}>Remakes are being catalogued — check back soon.</p>
      )}
    </section>
  );
}
