import type { Metadata } from "next";
import { Room } from "@/components/rooms/room";
import { RoomFooterNav } from "@/components/rooms/room-footer-nav";
import { RichText } from "@/components/rooms/rich-text";
import { getStoryContent } from "@/lib/sanity/content";

export const metadata: Metadata = {
  title: "Story — SIBARI",
  description: "The biography and press behind SIBARI.",
};

export default async function StoryPage() {
  const { longBio, press } = await getStoryContent();

  return (
    <>
      <Room id="story" eyebrow="Story" title="Biography">
        {longBio ? (
          <RichText value={longBio.body} />
        ) : (
          <p>The story is being written.</p>
        )}

        {press.length > 0 ? (
          <section aria-labelledby="press-heading">
            <h2 id="press-heading">Press</h2>
            <ul>
              {press.map((mention) => (
                <li key={mention._id}>
                  <blockquote>{mention.quote}</blockquote>
                  <p>
                    — <a href={mention.link}>{mention.outlet}</a>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Room>
      <RoomFooterNav currentSlug="/story" />
    </>
  );
}
