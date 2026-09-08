import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Spotify's cover-art CDN, consumed by the Music section (SIB-26).
      { protocol: "https", hostname: "i.scdn.co" },
      // YouTube's thumbnail CDN, consumed by the Remakes section (SIB-27/33).
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  experimental: {
    // Single-route site: no cross-page cache to lose, and every visit is a
    // first load, so eliminating the render-blocking CSS request(s) before
    // first paint (SIB-35) outweighs the "returning visitor" cache trade-off.
    inlineCss: true,
  },
};

export default nextConfig;
