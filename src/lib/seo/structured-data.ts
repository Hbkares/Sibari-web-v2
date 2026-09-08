import type { RemakeVideo } from "@/lib/youtube/types";
import { sameAsLinks, siteConfig } from "./site-config";

type JsonLdObject = Record<string, unknown>;

/**
 * Site-wide identity block (rendered once in the root layout). `description`
 * uses the fuller `bio` copy — same text as the About section — rather than
 * the short meta-description string, since JSON-LD isn't length-constrained
 * the way a search snippet is. `contactPoint` mirrors the Contact section's
 * actual booking channel (Instagram DM); update both together if that ever
 * changes to an email/phone.
 */
export function musicGroupJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: siteConfig.artistName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    genre: siteConfig.genre,
    description: siteConfig.bio,
    foundingDate: siteConfig.foundingDate,
    sameAs: sameAsLinks,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "booking",
        url: siteConfig.socials.instagram,
      },
    ],
  };
}

/**
 * ItemList of VideoObject for the Remakes section's curated YouTube
 * playlist (SIB-27/SIB-29). `contentUrl` points at the public watch page
 * (crawlable regardless of embed host); `embedUrl` matches the
 * youtube-nocookie.com host the lightbox actually iframes (remakes-lightbox.tsx).
 */
export function remakesJsonLd(remakes: RemakeVideo[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteConfig.artistName} — FL Studio Remakes`,
    itemListElement: remakes.map((remake, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        name: remake.rawTitle,
        description: remake.originalArtist
          ? `${siteConfig.artistName}'s FL Studio remake of "${remake.track}" by ${remake.originalArtist}.`
          : remake.rawTitle,
        thumbnailUrl: remake.thumbnailUrl,
        uploadDate: remake.publishedAt,
        duration: `PT${remake.durationSeconds}S`,
        contentUrl: `https://www.youtube.com/watch?v=${remake.id}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${remake.id}`,
      },
    })),
  };
}
