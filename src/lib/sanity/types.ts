/**
 * Mirrors the field-level schema from SIB-4 ("SIBARI — CMS Content Schema
 * & Information Architecture"). Keep in sync with that document, not the
 * other way around — this repo doesn't own the schema.
 */

export interface PortableTextBlock {
  _type: string;
  _key: string;
  [key: string]: unknown;
}

export interface SanityImage {
  asset?: { _ref?: string; _id?: string; url?: string } | null;
  hotspot?: { x: number; y: number };
}

export type ReleaseType = "album" | "ep" | "single" | "remix";

export interface ReleaseLink {
  platform:
    | "spotify"
    | "apple_music"
    | "bandcamp"
    | "youtube"
    | "soundcloud"
    | "other";
  url: string;
}

export interface Release {
  _id: string;
  title: string;
  slug: string;
  releaseType: ReleaseType;
  releaseDate: string;
  coverArt?: SanityImage | null;
  coverArtAlt?: string;
  links?: ReleaseLink[];
  synopsis?: PortableTextBlock[] | null;
  featured?: boolean;
}

export interface TrackCredit {
  role: string;
  name: string;
}

export interface Track {
  _id: string;
  title: string;
  slug: string;
  trackNumber: number;
  duration: number;
  explicit?: boolean;
  credits?: TrackCredit[];
  lyrics?: PortableTextBlock[] | null;
}

export type ShowStatus =
  | "announced"
  | "on_sale"
  | "sold_out"
  | "cancelled"
  | "past";

export interface Show {
  _id: string;
  title?: string;
  date: string;
  venue: { name: string; city: string; country: string };
  ticketLink?: string;
  status: ShowStatus;
  relatedRelease?: { title: string; slug: string } | null;
}

export type VisualMediaType = "video" | "image";
export type VisualCategory =
  | "music_video"
  | "behind_the_scenes"
  | "live"
  | "visualizer"
  | "campaign";

export interface VisualPiece {
  _id: string;
  title: string;
  slug: string;
  mediaType: VisualMediaType;
  category: VisualCategory;
  date: string;
  imageAsset?: SanityImage | null;
  thumbnail?: SanityImage | null;
  linkedRelease?: { title: string; slug: string } | null;
}

export interface PressMention {
  _id: string;
  outlet: string;
  quote: string;
  link: string;
  date: string;
  logo?: SanityImage | null;
}

export interface BioBlock {
  _id: string;
  label: string;
  body: PortableTextBlock[];
  publishedAt: string;
}

export interface HomeContent {
  featuredRelease: Release | null;
  featuredVisual: VisualPiece | null;
  shortBio: BioBlock | null;
}

export interface ReleaseWithTracks extends Release {
  tracks: Track[];
}

export interface StoryContent {
  longBio: BioBlock | null;
  press: PressMention[];
}

export interface ShowsContent {
  upcoming: Show[];
  past: Show[];
}
