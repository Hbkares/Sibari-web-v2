/**
 * YouTube Data API v3 uses a simple API key for public, read-only endpoints
 * (playlistItems/videos) — no OAuth needed since nothing here is written or
 * scoped to a user. Mirrors the Spotify/Sanity env pattern: `isYouTubeConfigured`
 * gates every call so the Remakes section renders an empty state instead of
 * failing the build when a key isn't set yet.
 */
export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

/**
 * "FL Studio Remakes" on youtube.com/@Hbkares (SIB-27 remakes-treatment §1) —
 * pre-rebrand production channel, scoped to this curated playlist rather than
 * full channel uploads so the section stays "established artist," not a raw
 * upload feed. playlistItems.list takes a playlist ID directly, so resolving
 * @Hbkares's channel ID (flagged as a non-blocking open item on SIB-27) turned
 * out to be unnecessary for this fetch path.
 */
export const YOUTUBE_REMAKES_PLAYLIST_ID =
  process.env.YOUTUBE_REMAKES_PLAYLIST_ID || "PLfofkk7lDOSta6WROCGuuXmrA-59uIU73";

export const isYouTubeConfigured = Boolean(YOUTUBE_API_KEY);
