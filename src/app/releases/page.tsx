import type { Metadata } from "next";
import { Room } from "@/components/rooms/room";
import { RoomFooterNav } from "@/components/rooms/room-footer-nav";
import { RichText } from "@/components/rooms/rich-text";
import { JsonLd } from "@/components/seo/json-ld";
import { musicAlbumJsonLd } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/seo/site-config";
import { getReleases } from "@/lib/sanity/content";

const PAGE_DESCRIPTION =
  "The spatial gallery of SIBARI releases — albums, EPs, singles, and remixes.";

export const metadata: Metadata = {
  title: "Releases",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${siteConfig.url}/releases` },
  openGraph: {
    title: `Releases | ${siteConfig.name}`,
    description: PAGE_DESCRIPTION,
    url: `${siteConfig.url}/releases`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Releases | ${siteConfig.name}`,
    description: PAGE_DESCRIPTION,
  },
};

const RELEASE_TYPE_LABEL: Record<string, string> = {
  album: "Album",
  ep: "EP",
  single: "Single",
  remix: "Remix",
};

export default async function ReleasesPage() {
  const releases = await getReleases();

  return (
    <>
      {releases.length > 0 ? <JsonLd data={releases.map(musicAlbumJsonLd)} /> : null}
      <Room
        id="releases"
        eyebrow="Releases"
        title="The gallery"
        lead="Every release, in order — a spatial card, not a grid row."
      >
        {releases.length === 0 ? (
          <p>Releases are being prepared for the gallery.</p>
        ) : (
          <ol>
            {releases.map((release) => (
              <li key={release._id}>
                <article>
                  <h2>{release.title}</h2>
                  <p>
                    {RELEASE_TYPE_LABEL[release.releaseType] ?? release.releaseType}
                    {" · "}
                    <time dateTime={release.releaseDate}>
                      {new Date(release.releaseDate).getFullYear()}
                    </time>
                  </p>
                  <RichText value={release.synopsis} />
                  {release.links && release.links.length > 0 ? (
                    <ul>
                      {release.links.map((link) => (
                        <li key={link.url}>
                          <a href={link.url}>{link.platform}</a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              </li>
            ))}
          </ol>
        )}
      </Room>
      <RoomFooterNav currentSlug="/releases" />
    </>
  );
}
