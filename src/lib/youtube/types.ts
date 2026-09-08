export interface RemakeVideo {
  id: string;
  /** Curated playlist order (SIB-27 §1: pre-selected by the artist) — index 0 is the featured card. */
  position: number;
  /** Raw YouTube title, kept for fallback display when parsing can't split it. */
  rawTitle: string;
  originalArtist: string;
  track: string;
  /** A downloadable FLP project file is called out in the source title (SIB-27 §3 card anatomy). */
  hasFlp: boolean;
  thumbnailUrl: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  durationSeconds: number;
  durationLabel: string;
  publishedAt: string;
}
