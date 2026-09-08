import { sameAsLinks, siteConfig } from "./site-config";

type JsonLdObject = Record<string, unknown>;

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
