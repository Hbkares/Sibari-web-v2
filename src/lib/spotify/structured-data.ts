import { siteConfig } from "@/lib/seo/site-config";
import type { SpotifyAlbumWithTracks } from "./types";

type JsonLdObject = Record<string, unknown>;

/**
 * Minimal MusicAlbum/MusicRecording structured data sourced straight from
 * Spotify catalog data. Kept local to the Spotify lib rather than added to
 * `src/lib/seo/structured-data.ts` — that file is mid-rewrite under SIB-29
 * (SEO pass for the new section structure); this is additive and safe to
 * fold in there later without touching this call site.
 */
export function spotifyAlbumJsonLd(album: SpotifyAlbumWithTracks): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: album.name,
    url: album.external_urls.spotify,
    datePublished: album.release_date,
    numTracks: album.total_tracks,
    image: album.images[0]?.url,
    byArtist: {
      "@type": "MusicGroup",
      name: siteConfig.artistName,
      url: siteConfig.url,
    },
    track: album.tracks.map((track) => ({
      "@type": "MusicRecording",
      name: track.name,
      url: track.external_urls.spotify,
      duration: `PT${Math.round(track.duration_ms / 1000)}S`,
    })),
  };
}
