const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sibari.example";

export const siteConfig = {
  name: "SIBARI",
  artistName: "Sibari",
  tagline: "Paris · Progressive House",
  // Set NEXT_PUBLIC_SITE_URL before launch — this placeholder only satisfies
  // the absolute-URL requirement for metadataBase/sitemap/robots in dev.
  url: rawSiteUrl.replace(/\/+$/, ""),
  description:
    "Sibari is a Paris-based electronic music producer and DJ, active since 2011, known for a progressive house sound influenced by Avicii and Swedish House Mafia.",
  // Fuller narrative for the About section and JSON-LD `description` — kept
  // separate from `description` above, which stays short for the <meta
  // name="description"> tag (SIB-29). Single source of truth so the two
  // never drift apart.
  bio: "Sibari is a producer and DJ based in Paris, active since 2011 — formerly performing as Hbkares. His sound is melodic, energetic progressive house, built in the festival lineage of Avicii and Swedish House Mafia and sharpened across more than a decade of releases, collaborations, and sets.",
  foundingDate: "2011",
  genre: "Progressive House",
  palette: {
    black: "#0A0A0A",
    gold: "#C9A227",
    goldHighlight: "#F0D98B",
    goldShadow: "#8B6914",
    offWhite: "#E8E6E1",
  },
  socials: {
    spotify: "https://open.spotify.com/artist/5BSUZoXPBUMHc0URd1L1xQ",
    soundcloud: "https://soundcloud.com/sibari",
    youtube: "https://www.youtube.com/@SibariMusic",
    instagram: "https://instagram.com/hbkares",
    facebook: "https://www.facebook.com/itsSibari",
    twitter: "https://x.com/hbkares",
  },
} as const;

export const sameAsLinks: string[] = Object.values(siteConfig.socials);

/**
 * SIB-25 fixed sidebar shows only these four (per issue spec) even though
 * `siteConfig.socials` carries more — order matches the spec's listing.
 */
export const sidebarSocials = [
  { key: "instagram", label: "Instagram", href: siteConfig.socials.instagram },
  { key: "spotify", label: "Spotify", href: siteConfig.socials.spotify },
  { key: "soundcloud", label: "SoundCloud", href: siteConfig.socials.soundcloud },
  { key: "youtube", label: "YouTube", href: siteConfig.socials.youtube },
] as const;
