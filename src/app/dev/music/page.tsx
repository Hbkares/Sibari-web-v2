import type { Metadata } from "next";
import { MusicSection } from "@/components/music/music-section";

export const metadata: Metadata = {
  title: "Music (preview)",
  robots: { index: false, follow: false },
};

/**
 * Isolated preview of the Music section (SIB-26) ahead of the single-scroll
 * shell (SIB-25, currently blocked) assembling it with the other 3 sections.
 * Same role the old `/dev/tracks-room` played for the listening room before
 * it was wired into the room sequence — not a real site route.
 */
export default function DevMusicPage() {
  return <MusicSection />;
}
