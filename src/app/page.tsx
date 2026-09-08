import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/site-config";

const PAGE_DESCRIPTION =
  "Sibari — Paris-based progressive house producer and DJ.";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title: siteConfig.name,
    description: PAGE_DESCRIPTION,
    url: siteConfig.url,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: PAGE_DESCRIPTION,
  },
};

/**
 * Placeholder shell — the single-scroll landing page lands in the follow-up
 * task on top of this. Kept intentionally bare so the app shell/CI/device-
 * tiering scaffolding stays exercisable in the meantime.
 */
export default function HomePage() {
  return (
    <main>
      <h1>{siteConfig.name}</h1>
      <p>{siteConfig.tagline}</p>
    </main>
  );
}
