import { getAccessToken } from "./auth";
import { isSpotifyConfigured, SPOTIFY_ARTIST_ID } from "./env";
import type { SpotifyAlbum, SpotifyAlbumWithTracks, SpotifyTrack } from "./types";

const API_BASE = "https://api.spotify.com/v1";
/** Re-fetched at most once an hour — a release/single doesn't land often
 * enough to justify hitting Spotify on every request. */
const CATALOG_REVALIDATE_SECONDS = 60 * 60;
/** `/v1/albums` (the batch/full-tracklist endpoint) caps `ids` at 20. */
const ALBUM_BATCH_SIZE = 20;

async function spotifyFetch<T>(path: string): Promise<T | null> {
  if (!isSpotifyConfigured) return null;

  try {
    const token = await getAccessToken();
    if (!token) return null;

    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: CATALOG_REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      throw new Error(`Spotify request to ${path} failed with status ${res.status}`);
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error("[spotify] request failed:", error);
    return null;
  }
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/**
 * The artist albums endpoint can list the same title more than once
 * (regional re-release, deluxe/anniversary reissue under one name) — keep
 * the earliest entry per name so the gallery shows one cover per release
 * rather than visual duplicates.
 */
function dedupeByName(albums: SpotifyAlbum[]): SpotifyAlbum[] {
  const byName = new Map<string, SpotifyAlbum>();
  for (const album of albums) {
    const key = album.name.trim().toLowerCase();
    const existing = byName.get(key);
    if (!existing || album.release_date < existing.release_date) {
      byName.set(key, album);
    }
  }
  return [...byName.values()];
}

/**
 * Full discography (albums + singles, no "appears on" compilations) for the
 * artist, cover art and tracklists included, newest first — everything the
 * cover-forward Music section (SIB-26) needs in one call site. Empty array
 * when Spotify isn't configured or the request fails; every caller treats
 * that as "catalog not loaded yet" rather than an error.
 */
export async function getArtistDiscography(): Promise<SpotifyAlbumWithTracks[]> {
  const albumsPage = await spotifyFetch<{ items: SpotifyAlbum[] }>(
    `/artists/${SPOTIFY_ARTIST_ID}/albums?include_groups=album,single&market=US&limit=50`,
  );
  if (!albumsPage?.items?.length) return [];

  const albums = dedupeByName(albumsPage.items);

  const fullAlbums = await Promise.all(
    chunk(albums, ALBUM_BATCH_SIZE).map((batch) =>
      spotifyFetch<{ albums: (SpotifyAlbumWithTracksRaw | null)[] }>(
        `/albums?ids=${batch.map((album) => album.id).join(",")}&market=US`,
      ),
    ),
  );

  const withTracks: SpotifyAlbumWithTracks[] = fullAlbums
    .flatMap((page) => page?.albums ?? [])
    .filter((album): album is SpotifyAlbumWithTracksRaw => album !== null)
    .map((album) => ({
      ...album,
      tracks: album.tracks.items,
    }));

  return withTracks.sort((a, b) => (a.release_date < b.release_date ? 1 : -1));
}

/** Shape of `/v1/albums` items before flattening `tracks.items`. */
type SpotifyAlbumWithTracksRaw = SpotifyAlbum & {
  tracks: { items: SpotifyTrack[] };
};
