import type { Metadata } from "next";
import { Room } from "@/components/rooms/room";
import { RoomFooterNav } from "@/components/rooms/room-footer-nav";
import { getVisuals } from "@/lib/sanity/content";

export const metadata: Metadata = {
  title: "Visuals — SIBARI",
  description: "The audiovisual reel — music videos, live footage, and behind-the-scenes visuals.",
};

const CATEGORY_LABEL: Record<string, string> = {
  music_video: "Music Video",
  behind_the_scenes: "Behind the Scenes",
  live: "Live",
  visualizer: "Visualizer",
  campaign: "Campaign",
};

export default async function VisualsPage() {
  const visuals = await getVisuals();

  return (
    <>
      <Room
        id="visuals"
        eyebrow="Visuals"
        title="The reel"
        lead="Music videos, live footage, and the visual world around each release."
      >
        {visuals.length === 0 ? (
          <p>The reel is being prepared.</p>
        ) : (
          <ol>
            {visuals.map((piece) => (
              <li key={piece._id}>
                <article>
                  <h2>{piece.title}</h2>
                  <p>
                    {CATEGORY_LABEL[piece.category] ?? piece.category}
                    {piece.linkedRelease ? (
                      <>
                        {" · "}
                        {piece.linkedRelease.title}
                      </>
                    ) : null}
                  </p>
                </article>
              </li>
            ))}
          </ol>
        )}
      </Room>
      <RoomFooterNav currentSlug="/visuals" />
    </>
  );
}
