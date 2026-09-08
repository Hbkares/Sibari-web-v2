/**
 * The room sequence from the concept (SIB-1 plan §2): Home → Universe →
 * Releases → Selected Tracks → Visuals → Story → Contact. Each room is a
 * real route so it server-renders on its own and stays deep-linkable/
 * crawlable independently of the WebGL layer (plan §3.1).
 */
export interface RoomDefinition {
  slug: string;
  label: string;
  description: string;
}

export const ROOMS: RoomDefinition[] = [
  { slug: "/", label: "Home", description: "Enter the world." },
  {
    slug: "/universe",
    label: "Universe",
    description: "The visual and sonic identity behind the work.",
  },
  {
    slug: "/releases",
    label: "Releases",
    description: "The spatial gallery of releases.",
  },
  {
    slug: "/tracks",
    label: "Selected Tracks",
    description: "An interactive listening room.",
  },
  {
    slug: "/visuals",
    label: "Visuals",
    description: "The audiovisual reel.",
  },
  { slug: "/story", label: "Story", description: "Biography and press." },
  {
    slug: "/contact",
    label: "Contact",
    description: "Shows and booking.",
  },
];

export function getAdjacentRooms(currentSlug: string): {
  previous: RoomDefinition | null;
  next: RoomDefinition | null;
} {
  const index = ROOMS.findIndex((room) => room.slug === currentSlug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: index > 0 ? ROOMS[index - 1] : null,
    next: index < ROOMS.length - 1 ? ROOMS[index + 1] : null,
  };
}
