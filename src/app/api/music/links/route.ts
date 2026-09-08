import { NextResponse, type NextRequest } from "next/server";
import { getCrossPlatformLinks } from "@/lib/odesli/client";

/**
 * Thin proxy in front of Odesli so the "more ways to listen" disclosure
 * (TrackServiceLinks, SIB-26) can defer that lookup to a client-side
 * fetch-on-interaction instead of blocking the Music section's initial
 * server render on N third-party calls (perf-budget priority #1).
 *
 * Only ever forwards `open.spotify.com` URLs sourced from our own catalog
 * data — this is a public endpoint, so it must not become an open proxy for
 * arbitrary outbound requests.
 */
export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let spotifyUrl: URL;
  try {
    spotifyUrl = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const isSpotifyTrackOrAlbum =
    spotifyUrl.protocol === "https:" &&
    spotifyUrl.hostname === "open.spotify.com" &&
    /^\/(track|album)\//.test(spotifyUrl.pathname);

  if (!isSpotifyTrackOrAlbum) {
    return NextResponse.json({ error: "Unsupported url" }, { status: 400 });
  }

  const links = await getCrossPlatformLinks(spotifyUrl.toString());
  return NextResponse.json(
    { links: links ?? {} },
    { headers: { "Cache-Control": "public, max-age=86400" } },
  );
}
