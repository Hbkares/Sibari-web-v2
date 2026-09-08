import { resolveImageUrl } from "./image";
import { sameAsLinks, siteConfig } from "./site-config";
import type { PortableTextBlock, Release, Show, Track } from "@/lib/sanity/types";

/**
 * Builders take the real Sanity document shapes from `@/lib/sanity/types`
 * (SIB-4 schema) directly — no separate CMS shape to keep in sync.
 */

type JsonLdObject = Record<string, unknown>;

export function portableTextToPlainText(blocks?: PortableTextBlock[] | null): string {
  if (!blocks) return "";
  return blocks
    .map((block) => {
      const children = block.children;
      if (!Array.isArray(children)) return "";
      return children
        .map((child) =>
          typeof child === "object" && child !== null && typeof (child as { text?: unknown }).text === "string"
            ? (child as { text: string }).text
            : "",
        )
        .join("");
    })
    .join(" ")
    .trim();
}

function secondsToIsoDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `PT${minutes}M${seconds}S`;
}

const EVENT_STATUS: Record<Show["status"], string> = {
  announced: "https://schema.org/EventScheduled",
  on_sale: "https://schema.org/EventScheduled",
  sold_out: "https://schema.org/EventScheduled",
  cancelled: "https://schema.org/EventCancelled",
  past: "https://schema.org/EventScheduled",
};

const OFFER_AVAILABILITY: Record<Show["status"], string> = {
  announced: "https://schema.org/PreOrder",
  on_sale: "https://schema.org/InStock",
  sold_out: "https://schema.org/SoldOut",
  cancelled: "https://schema.org/Discontinued",
  past: "https://schema.org/SoldOut",
};

export function musicGroupJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: siteConfig.artistName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    genre: siteConfig.genre,
    description: siteConfig.description,
    sameAs: sameAsLinks,
  };
}

export function musicAlbumJsonLd(release: Release): JsonLdObject {
  const url = `${siteConfig.url}/releases#${release.slug}`;
  const image = resolveImageUrl(release.coverArt, { width: 1200 });

  return {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: release.title,
    url,
    datePublished: release.releaseDate,
    byArtist: {
      "@type": "MusicGroup",
      name: siteConfig.artistName,
      url: siteConfig.url,
    },
    ...(image ? { image } : {}),
  };
}

export function musicRecordingJsonLd(
  track: Track,
  release: Pick<Release, "title" | "slug">,
): JsonLdObject {
  const releaseUrl = `${siteConfig.url}/releases#${release.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: track.title,
    url: `${releaseUrl}-${track.slug}`,
    duration: secondsToIsoDuration(track.duration),
    isFamilyFriendly: !track.explicit,
    byArtist: {
      "@type": "MusicGroup",
      name: siteConfig.artistName,
      url: siteConfig.url,
    },
    inAlbum: {
      "@type": "MusicAlbum",
      name: release.title,
      url: releaseUrl,
    },
  };
}

export function musicEventJsonLd(show: Show): JsonLdObject {
  const name = show.title ?? `${siteConfig.artistName} at ${show.venue.name}`;
  const offers = show.ticketLink
    ? {
        "@type": "Offer",
        url: show.ticketLink,
        availability: OFFER_AVAILABILITY[show.status],
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name,
    startDate: show.date,
    eventStatus: EVENT_STATUS[show.status],
    location: {
      "@type": "Place",
      name: show.venue.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: show.venue.city,
        addressCountry: show.venue.country,
      },
    },
    performer: {
      "@type": "MusicGroup",
      name: siteConfig.artistName,
      url: siteConfig.url,
    },
    ...(offers ? { offers } : {}),
  };
}
