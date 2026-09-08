import { ImageResponse } from "next/og";
import { siteConfig } from "./site-config";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

/**
 * Shared renderer for the default site-wide OG/Twitter card. Real brand
 * imagery (cover art, press photo) supersedes this per-route once those
 * assets land in the repo and per-entity pages exist (SIB-8).
 */
export function renderOgImage(subtitle: string = siteConfig.tagline) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: siteConfig.palette.black,
        }}
      >
        <div
          style={{
            fontSize: 140,
            fontWeight: 700,
            letterSpacing: 12,
            color: siteConfig.palette.gold,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 36,
            letterSpacing: 4,
            color: siteConfig.palette.offWhite,
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    ogImageSize,
  );
}
