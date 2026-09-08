/** Platform keys as returned by Odesli's `linksByPlatform` map —
 * https://odesli.co/ (formerly song.link). Only the services worth
 * surfacing as an outbound link per track (SIB-26) are kept. */
export interface CrossPlatformLinks {
  spotify?: string;
  appleMusic?: string;
  youtubeMusic?: string;
  youtube?: string;
  soundcloud?: string;
  deezer?: string;
  tidal?: string;
  amazonMusic?: string;
}

export const SERVICE_LABELS: Record<keyof CrossPlatformLinks, string> = {
  spotify: "Spotify",
  appleMusic: "Apple Music",
  youtubeMusic: "YouTube Music",
  youtube: "YouTube",
  soundcloud: "SoundCloud",
  deezer: "Deezer",
  tidal: "Tidal",
  amazonMusic: "Amazon Music",
};
