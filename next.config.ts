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
};

export default nextConfig;
