import type { Metadata } from "next";
import { resolveImageUrl } from "./image";
import { portableTextToPlainText } from "./structured-data";
import { siteConfig } from "./site-config";
import type { Release, Show, Track } from "@/lib/sanity/types";

/**
 * Per-entity Metadata builders, fed by the real Sanity document shapes
 * (`@/lib/sanity/types`, SIB-4 schema). Call from `generateMetadata()` once
 * per-release/track/show routes exist — `/releases` today is a list page,
 * so nothing here is wired into a route yet except via the list-level JSON-LD.
 */

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export function releaseMetadata(release: Release): Metadata {
  const url = `${siteConfig.url}/releases#${release.slug}`;
  const synopsis = portableTextToPlainText(release.synopsis);
  const description = truncate(
    synopsis || `${release.title} — ${release.releaseType} by ${siteConfig.artistName}.`,
    160,
  );
  const image = resolveImageUrl(release.coverArt, { width: 1200, height: 630 });
  const images = image ? [{ url: image, alt: release.coverArtAlt ?? release.title }] : undefined;

  return {
    title: release.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: release.title,
      description,
      url,
      type: "music.album",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: release.title,
      description,
      images: images?.map((img) => img.url),
    },
  };
}

export function trackMetadata(track: Track, release: Release): Metadata {
  const url = `${siteConfig.url}/releases#${release.slug}-${track.slug}`;
  const description = `${track.title} from ${release.title} by ${siteConfig.artistName}.`;
  const image = resolveImageUrl(release.coverArt, { width: 1200, height: 630 });
  const images = image ? [{ url: image, alt: release.coverArtAlt ?? release.title }] : undefined;

  return {
    title: track.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${track.title} — ${release.title}`,
      description,
      url,
      type: "music.song",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: track.title,
      description,
      images: images?.map((img) => img.url),
    },
  };
}

export function showMetadata(show: Show): Metadata {
  const title = show.title ?? `${siteConfig.artistName} at ${show.venue.name}`;
  const formattedDate = new Date(show.date).toLocaleDateString("en-US", {
    dateStyle: "medium",
  });
  const description = `${siteConfig.artistName} live at ${show.venue.name}, ${show.venue.city} — ${formattedDate}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
