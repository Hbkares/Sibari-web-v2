import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/site-config";
import { LandingHero } from "@/components/sections/landing-hero";
import { RemakesSection } from "@/components/remakes/remakes-section";
import { SectionStub } from "@/components/sections/section-stub";

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
 * Single continuous-scroll shell (SIB-25): Landing → Music → Remakes →
 * About → Contact. Landing and Remakes are fully built here; Music/About/
 * Contact are anchor/pacing stubs for their owning issues (SIB-26, SIB-31)
 * to fill in.
 */
export default function HomePage() {
  return (
    <main>
      <LandingHero />
      <SectionStub id="music" heading="Music" />
      <RemakesSection />
      <SectionStub id="about" heading="About" />
      <SectionStub id="contact" heading="Contact" />
    </main>
  );
}
