import type { Metadata } from "next";
import { Room } from "@/components/rooms/room";
import { RoomFooterNav } from "@/components/rooms/room-footer-nav";

export const metadata: Metadata = {
  title: "Universe — SIBARI",
  description:
    "The visual and sonic identity behind SIBARI — the palette, mood, and atmosphere that carries through every room.",
};

/**
 * Per SIB-4 §4, this room isn't backed by any of the six content types —
 * it's flagged there as pending a `SiteSettings` singleton (global
 * palette/mood config) that doesn't exist yet. Renders as a static room
 * shell until that lands; the atmosphere itself is the Creative
 * Technologist/Director's layer (SIB-9, SIB-11) on top of this route.
 */
export default function UniversePage() {
  return (
    <>
      <Room
        id="universe"
        eyebrow="Universe"
        title="The world behind the sound"
        lead="Palette, mood, and atmosphere — the identity every other room is built from."
      />
      <RoomFooterNav currentSlug="/universe" />
    </>
  );
}
