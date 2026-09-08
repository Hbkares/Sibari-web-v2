import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/site-config";
import { LandingHero } from "@/components/sections/landing-hero";
import { MusicSection } from "@/components/music/music-section";
import { RemakesSection } from "@/components/remakes/remakes-section";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";

const PAGE_DESCRIPTION =
  "Sibari — Paris-based progressive house producer and DJ. Stream the full catalog, watch FL Studio remakes, and get in touch for bookings.";

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
 * Single continuous-scroll shell (SIB-25): Landing → Music → Remakes →
 * About → Contact. All five sections are built and wired in.
 */
export default function HomePage() {
  return (
    <main>
      <LandingHero />
      <MusicSection />
      <RemakesSection />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
