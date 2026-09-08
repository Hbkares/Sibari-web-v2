import type { Metadata } from "next";
import Link from "next/link";
import { Room } from "@/components/rooms/room";
import { RoomFooterNav } from "@/components/rooms/room-footer-nav";
import { RichText } from "@/components/rooms/rich-text";
import { JsonLd } from "@/components/seo/json-ld";
import { musicAlbumJsonLd } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/seo/site-config";
import { getHomeContent } from "@/lib/sanity/content";

const PAGE_DESCRIPTION =
  "SIBARI — sonic architecture. Enter a spatial world built from the music, moving from release to release, room by room.";

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

export default async function HomePage() {
  const { featuredRelease, featuredVisual, shortBio } = await getHomeContent();

  return (
    <>
      {featuredRelease ? <JsonLd data={musicAlbumJsonLd(featuredRelease)} /> : null}
      <Room
        id="home"
        eyebrow="SIBARI"
        title="A world built from the music"
        lead="Move through it — each room is a release, a mood, a moment."
      >
        <RichText value={shortBio?.body} />

        {featuredRelease ? (
          <p>
            Now featured:{" "}
            <Link href="/releases">{featuredRelease.title}</Link>
          </p>
        ) : null}

        {featuredVisual ? (
          <p>
            Latest visual: <Link href="/visuals">{featuredVisual.title}</Link>
          </p>
        ) : null}
      </Room>
      <RoomFooterNav currentSlug="/" />
    </>
  );
}
