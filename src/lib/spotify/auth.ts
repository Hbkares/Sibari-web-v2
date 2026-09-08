import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "./env";

const TOKEN_URL = "https://accounts.spotify.com/api/token";

/**
 * Module-scope cache, not Next's `fetch` cache — this is a POST with
 * Basic-auth credentials, which must never be written to a shared HTTP
 * cache. Worst case on a cold serverless start is one extra token request;
 * that's cheaper than plumbing a distributed cache for a token that's
 * useless to any other request anyway.
 */
let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getAccessToken(): Promise<string | null> {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) return null;

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  try {
    const credentials = Buffer.from(
      `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
    ).toString("base64");

    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Spotify token request failed with status ${res.status}`);
    }

    const data = (await res.json()) as {
      access_token: string;
      expires_in: number;
    };

    // Shave 60s off the real TTL so a request never races an edge-of-expiry token.
    cachedToken = {
      value: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };
    return cachedToken.value;
  } catch (error) {
    console.error("[spotify] auth failed:", error);
    return null;
  }
}
