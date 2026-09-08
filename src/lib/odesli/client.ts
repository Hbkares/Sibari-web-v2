import type { CrossPlatformLinks } from "./types";

const ODESLI_API = "https://api.song.link/v1-alpha.0/links";
/** Cross-platform matches for a given recording don't change day to day —
 * cache aggressively so the (rate-limited, keyless) Odesli API is only hit
 * once per track per day across all visitors. */
const LINKS_REVALIDATE_SECONDS = 60 * 60 * 24;

interface OdesliResponse {
  linksByPlatform?: Record<string, { url: string } | undefined>;
}

/**
 * Resolves a Spotify track/album URL to its equivalents on other listening
 * services via Odesli (no API key required at this volume). Returns `null`
 * on any failure — callers always have the guaranteed Spotify link to fall
 * back to, so a flaky third-party lookup should never break the page.
 */
export async function getCrossPlatformLinks(
  spotifyUrl: string,
): Promise<CrossPlatformLinks | null> {
  try {
    const url = new URL(ODESLI_API);
    url.searchParams.set("url", spotifyUrl);
    url.searchParams.set("userCountry", "US");

    const res = await fetch(url, { next: { revalidate: LINKS_REVALIDATE_SECONDS } });
    if (!res.ok) return null;

    const data = (await res.json()) as OdesliResponse;
    const byPlatform = data.linksByPlatform ?? {};

    return {
      spotify: byPlatform.spotify?.url,
      appleMusic: byPlatform.appleMusic?.url,
      youtubeMusic: byPlatform.youtubeMusic?.url,
      youtube: byPlatform.youtube?.url,
      soundcloud: byPlatform.soundcloud?.url,
      deezer: byPlatform.deezer?.url,
      tidal: byPlatform.tidal?.url,
      amazonMusic: byPlatform.amazonMusic?.url,
    };
  } catch (error) {
    console.error("[odesli] lookup failed:", error);
    return null;
  }
}
