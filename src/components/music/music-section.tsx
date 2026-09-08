import Image from "next/image";
import { getArtistDiscography } from "@/lib/spotify/client";
import { spotifyAlbumJsonLd } from "@/lib/spotify/structured-data";
import type { SpotifyAlbumType } from "@/lib/spotify/types";
import { JsonLd } from "@/components/seo/json-ld";
import { TrackServiceLinks } from "./track-service-links";
import styles from "./music-section.module.css";

const TYPE_LABEL: Record<SpotifyAlbumType, string> = {
  album: "Album",
  single: "Single",
  compilation: "Compilation",
};

function releaseYear(releaseDate: string): string {
  return releaseDate.slice(0, 4);
}

function formatDuration(durationMs: number): string {
  const totalSeconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Cover-forward Music section (SIB-26): full catalog pulled live from
 * Spotify rather than hand-curated in the CMS, so a new release shows up
 * here the moment it's on Spotify. Built as a standalone, importable
 * section (not a page) so the eventual single-scroll shell (SIB-25) can
 * drop it in directly — `src/app/dev/music` previews it in isolation until
 * then, the same way `/dev/tracks-room` previewed the old listening room.
 *
 * Each cover is a native `<details>` disclosure — the tracklist and outbound
 * listening links are real content in the HTML from first paint, no JS
 * required to reach them; `TrackServiceLinks` is the one client island, and
 * it only fetches on interaction.
 */
export async function MusicSection() {
  const discography = await getArtistDiscography();

  return (
    <section id="music" aria-labelledby="music-heading" className={styles.section}>
      {discography.length > 0 ? (
        <JsonLd data={discography.map(spotifyAlbumJsonLd)} />
      ) : null}
      <header className={styles.header}>
        <p className={styles.eyebrow}>Music</p>
        <h2 id="music-heading" className={styles.title}>
          The catalog, straight from the source
        </h2>
        <p className={styles.lead}>
          Every release, live from Spotify — open any cover for the tracklist
          and ways to listen elsewhere.
        </p>
      </header>

      {discography.length === 0 ? (
        <p className={styles.empty}>The catalog is loading — check back shortly.</p>
      ) : (
        <ol className={styles.gallery}>
          {discography.map((album, index) => {
            const cover = album.images[0];
            return (
              <li key={album.id} className={index === 0 ? styles.featured : styles.card}>
                <details className={styles.details}>
                  <summary className={styles.summary}>
                    <span className={styles.coverWrap}>
                      {cover ? (
                        <Image
                          src={cover.url}
                          alt={`${album.name} cover art`}
                          fill
                          sizes={index === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                          className={styles.cover}
                          priority={index === 0}
                        />
                      ) : null}
                    </span>
                    <span className={styles.meta}>
                      <span className={styles.albumTitle}>{album.name}</span>
                      <span className={styles.albumSub}>
                        {TYPE_LABEL[album.album_type]} · {releaseYear(album.release_date)}
                      </span>
                    </span>
                  </summary>

                  <div className={styles.panel}>
                    <a
                      href={album.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.albumLink}
                    >
                      Play {TYPE_LABEL[album.album_type].toLowerCase()} on Spotify ↗
                    </a>
                    <ol className={styles.tracklist}>
                      {album.tracks.map((track) => (
                        <li key={track.id} className={styles.track}>
                          <div className={styles.trackRow}>
                            <span className={styles.trackNumber}>
                              {String(track.track_number).padStart(2, "0")}
                            </span>
                            <span className={styles.trackName}>
                              {track.name}
                              {track.explicit ? (
                                <span aria-label="explicit" className={styles.explicit}>
                                  {" "}
                                  E
                                </span>
                              ) : null}
                            </span>
                            <span className={styles.trackDuration}>
                              {formatDuration(track.duration_ms)}
                            </span>
                            <a
                              href={track.external_urls.spotify}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.spotifyLink}
                            >
                              Spotify ↗
                            </a>
                          </div>
                          <TrackServiceLinks
                            spotifyUrl={track.external_urls.spotify}
                            trackName={track.name}
                          />
                        </li>
                      ))}
                    </ol>
                  </div>
                </details>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
