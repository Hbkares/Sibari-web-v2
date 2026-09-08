/** Trimmed to the fields the Music section actually renders — see the
 * full objects at https://developer.spotify.com/documentation/web-api. */

export interface SpotifyImage {
  url: string;
  width: number | null;
  height: number | null;
}

export type SpotifyAlbumType = "album" | "single" | "compilation";

export interface SpotifyAlbum {
  id: string;
  name: string;
  album_type: SpotifyAlbumType;
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  total_tracks: number;
  images: SpotifyImage[];
  external_urls: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  track_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: { spotify: string };
}

export interface SpotifyAlbumWithTracks extends SpotifyAlbum {
  tracks: SpotifyTrack[];
}
