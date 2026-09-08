import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/site-config";
import { ROOMS } from "@/lib/rooms";

/** Generated from the room sequence (`@/lib/rooms`) — the single source of truth for the site's routes. */
export default function sitemap(): MetadataRoute.Sitemap {
  return ROOMS.map(
    (room): MetadataRoute.Sitemap[number] => ({
      url: `${siteConfig.url}${room.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: room.slug === "/" ? 1 : 0.7,
    }),
  );
}
