import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { ScrollProvider } from "@/lib/motion/scroll-provider";
import { SiteNav } from "@/components/shell/site-nav";
import { SiteSidebar } from "@/components/shell/site-sidebar";
import { DeviceTierProvider } from "@/lib/device/device-tier-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { musicGroupJsonLd } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/seo/site-config";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [siteConfig.name, siteConfig.artistName, siteConfig.genre, "DJ", "music producer", "Paris"],
  applicationName: siteConfig.name,
  alternates: { canonical: siteConfig.url },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@hbkares",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Fills notch/home-indicator safe areas on iOS instead of letterboxing —
  // paired with the safe-area padding in globals.css.
  viewportFit: "cover",
  themeColor: siteConfig.palette.black,
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <JsonLd data={musicGroupJsonLd()} />
        <DeviceTierProvider>
          <ScrollProvider>
            <SiteNav />
            <SiteSidebar />
            {children}
          </ScrollProvider>
        </DeviceTierProvider>
      </body>
    </html>
  );
}
