import type { Metadata } from "next";
import { Room } from "@/components/rooms/room";
import { RoomFooterNav } from "@/components/rooms/room-footer-nav";
import { getFeaturedReleaseWithTracks } from "@/lib/sanity/content";

export const metadata: Metadata = {
  title: "Selected Tracks — SIBARI",
  description:
    "An interactive listening room — the current release's tracklist, with visuals that respond live to the audio.",
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60);
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

/**
 * Server-rendered fallback for the listening room: the featured release's
 * tracklist as real semantic HTML. The audio-reactive listening
 * experience itself — Web Audio frequency analysis driving the shader/
 * particle layer — is SIB-10's signature moment, layered on top of this
 * markup client-side.
 */
export default async function TracksPage() {
  const release = await getFeaturedReleaseWithTracks();

  return (
    <>
      <Room
        id="tracks"
        eyebrow="Selected Tracks"
        title={release ? release.title : "The listening room"}
        lead="Press play and the room responds to the frequency of the track."
      >
        {!release || release.tracks.length === 0 ? (
          <p>The tracklist is being prepared.</p>
        ) : (
          <ol>
            {release.tracks.map((track) => (
              <li key={track._id}>
                {track.title}
                {" — "}
                <span>{formatDuration(track.duration)}</span>
                {track.explicit ? <span aria-label="explicit"> (E)</span> : null}
              </li>
            ))}
          </ol>
        )}
      </Room>
      <RoomFooterNav currentSlug="/tracks" />
    </>
  );
}
