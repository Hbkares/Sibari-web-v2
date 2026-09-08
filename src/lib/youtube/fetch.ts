import {
  YOUTUBE_API_KEY,
  YOUTUBE_REMAKES_PLAYLIST_ID,
  isYouTubeConfigured,
} from "./env";
import {
  formatDurationLabel,
  parseIsoDurationSeconds,
  parseRemakeTitle,
} from "./parse-video";
import type { RemakeVideo } from "./types";

const API_BASE = "https://www.googleapis.com/youtube/v3";

// Curated by the artist (SIB-27 §1), not a live upload feed — a few hours of
// staleness is a non-issue, so this favors fewer origin requests over
// near-real-time freshness. Matches the fetch-and-ISR shape `src/lib/sanity/
// fetch.ts` used: plain `fetch` + `next.revalidate`, no client-side fetching.
const REVALIDATE_SECONDS = 60 * 60 * 6;
const REVALIDATE_TAG = "remakes";

// A playlist this size fits in one page; add pagination if the curated list
// ever grows past the API's 50-per-page max.
const MAX_RESULTS = "50";

interface PlaylistItemsResponse {
  items?: Array<{
    snippet: {
      position: number;
      publishedAt: string;
      resourceId: { videoId: string };
    };
  }>;
}

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

interface VideosResponse {
  items?: Array<{
    id: string;
    snippet: {
      title: string;
      thumbnails: Partial<Record<string, Thumbnail>>;
    };
    contentDetails: { duration: string };
  }>;
}

async function youtubeGet<T>(
  path: string,
  params: Record<string, string>,
): Promise<T | null> {
  const url = new URL(`${API_BASE}/${path}`);
  url.searchParams.set("key", YOUTUBE_API_KEY!);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS, tags: [REVALIDATE_TAG] },
  });
  if (!response.ok) return null;
  return (await response.json()) as T;
}

const FALLBACK_THUMBNAIL: Thumbnail = { url: "", width: 480, height: 360 };

/** Highest-resolution thumbnail available; playlist-curated uploads vary in source quality (SIB-27 §3). */
function pickThumbnail(thumbnails: Partial<Record<string, Thumbnail>>): Thumbnail {
  return (
    thumbnails.maxres ??
    thumbnails.standard ??
    thumbnails.high ??
    thumbnails.medium ??
    thumbnails.default ??
    FALLBACK_THUMBNAIL
  );
}

/**
 * Server-side fetch of the "FL Studio Remakes" playlist, ISR-cached like the
 * rest of the app's content sources. Gated by `isYouTubeConfigured` so the
 * section renders its empty state instead of failing the build when
 * `YOUTUBE_API_KEY` isn't set yet — same contract as `isSpotifyConfigured`.
 */
export async function getRemakes(): Promise<RemakeVideo[]> {
  if (!isYouTubeConfigured) return [];

  try {
    const playlistItems = await youtubeGet<PlaylistItemsResponse>(
      "playlistItems",
      {
        part: "snippet",
        playlistId: YOUTUBE_REMAKES_PLAYLIST_ID,
        maxResults: MAX_RESULTS,
      },
    );
    const items = playlistItems?.items ?? [];
    if (items.length === 0) return [];

    const videoIds = items
      .map((item) => item.snippet.resourceId.videoId)
      .filter(Boolean);
    const videos = await youtubeGet<VideosResponse>("videos", {
      part: "contentDetails,snippet",
      id: videoIds.join(","),
    });
    const videosById = new Map(
      (videos?.items ?? []).map((video) => [video.id, video]),
    );

    const remakes: RemakeVideo[] = [];
    for (const item of items) {
      const videoId = item.snippet.resourceId.videoId;
      const video = videosById.get(videoId);
      // A video pulled from the playlist can be private/deleted upstream —
      // skip it rather than rendering a broken card.
      if (!video) continue;

      const { originalArtist, track, hasFlp } = parseRemakeTitle(
        video.snippet.title,
      );
      const thumbnail = pickThumbnail(video.snippet.thumbnails);
      const durationSeconds = parseIsoDurationSeconds(
        video.contentDetails.duration,
      );

      remakes.push({
        id: videoId,
        position: item.snippet.position,
        rawTitle: video.snippet.title,
        originalArtist,
        track,
        hasFlp,
        thumbnailUrl: thumbnail.url,
        thumbnailWidth: thumbnail.width,
        thumbnailHeight: thumbnail.height,
        durationSeconds,
        durationLabel: formatDurationLabel(durationSeconds),
        publishedAt: item.snippet.publishedAt,
      });
    }

    return remakes.sort((a, b) => a.position - b.position);
  } catch (error) {
    console.error("[youtube] failed to fetch Remakes playlist", error);
    return [];
  }
}
