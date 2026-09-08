import { sanityFetch } from "./fetch";
import {
  FEATURED_RELEASE_WITH_TRACKS_QUERY,
  HOME_QUERY,
  RELEASES_QUERY,
  SHOWS_QUERY,
  STORY_QUERY,
  VISUALS_QUERY,
} from "./queries";
import type {
  HomeContent,
  Release,
  ReleaseWithTracks,
  ShowsContent,
  StoryContent,
  VisualPiece,
} from "./types";

const EMPTY_HOME: HomeContent = {
  featuredRelease: null,
  featuredVisual: null,
  shortBio: null,
};

export async function getHomeContent(): Promise<HomeContent> {
  return (await sanityFetch<HomeContent>(HOME_QUERY)) ?? EMPTY_HOME;
}

export async function getReleases(): Promise<Release[]> {
  return (await sanityFetch<Release[]>(RELEASES_QUERY)) ?? [];
}

export async function getFeaturedReleaseWithTracks(): Promise<ReleaseWithTracks | null> {
  const result = await sanityFetch<{
    release: Release | null;
    tracks: ReleaseWithTracks["tracks"];
  }>(FEATURED_RELEASE_WITH_TRACKS_QUERY);

  if (!result?.release) return null;
  return { ...result.release, tracks: result.tracks ?? [] };
}

export async function getVisuals(): Promise<VisualPiece[]> {
  return (await sanityFetch<VisualPiece[]>(VISUALS_QUERY)) ?? [];
}

const EMPTY_STORY: StoryContent = { longBio: null, press: [] };

export async function getStoryContent(): Promise<StoryContent> {
  return (await sanityFetch<StoryContent>(STORY_QUERY)) ?? EMPTY_STORY;
}

const EMPTY_SHOWS: ShowsContent = { upcoming: [], past: [] };

export async function getShows(): Promise<ShowsContent> {
  return (await sanityFetch<ShowsContent>(SHOWS_QUERY)) ?? EMPTY_SHOWS;
}
