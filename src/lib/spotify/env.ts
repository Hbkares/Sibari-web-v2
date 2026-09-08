/**
 * Spotify Web API uses the Client Credentials flow for catalog-only reads
 * (no user auth, no scopes) — https://developer.spotify.com/dashboard for
 * `SPOTIFY_CLIENT_ID`/`SPOTIFY_CLIENT_SECRET`. Mirrors the Sanity env
 * pattern: `isSpotifyConfigured` gates every call so the Music section
 * renders an empty state instead of failing the build when credentials
 * aren't set yet (SIB-26).
 */
export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
export const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

/** https://open.spotify.com/artist/5BSUZoXPBUMHc0URd1L1xQ */
export const SPOTIFY_ARTIST_ID =
  process.env.SPOTIFY_ARTIST_ID || "5BSUZoXPBUMHc0URd1L1xQ";

export const isSpotifyConfigured = Boolean(
  SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET,
);
