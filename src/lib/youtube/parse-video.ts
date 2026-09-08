const FLP_PATTERN = /\bflp\b/i;
const REMAKE_PREFIX_PATTERN = /^\s*fl\s*studio\s*remake\s*[:\-–—]?\s*/i;
const BRACKETED_TAG_PATTERN = /\s*[[(][^\])]*[\])]\s*/g;
const TRAILING_FLP_PATTERN = /\s*\+\s*flp\s*$/i;
const SEPARATOR_PATTERN = /\s+[-–—]\s+/;

/**
 * Source titles look like "FL Studio Remake: Avicii - EDOM [HBKARES] + FLP"
 * (SIB-27 §1). There's no structured API field for original artist/track, so
 * this recovers the card anatomy's "[Original Artist] — [Track]" (§3) from
 * the free-text title heuristically rather than re-authoring metadata by hand
 * for every upload.
 */
export function parseRemakeTitle(rawTitle: string): {
  originalArtist: string;
  track: string;
  hasFlp: boolean;
} {
  const hasFlp = FLP_PATTERN.test(rawTitle);

  const cleaned = rawTitle
    .replace(REMAKE_PREFIX_PATTERN, "")
    .replace(TRAILING_FLP_PATTERN, "")
    .replace(BRACKETED_TAG_PATTERN, " ")
    .replace(/\s+/g, " ")
    .trim();

  const separatorMatch = cleaned.match(SEPARATOR_PATTERN);
  if (!separatorMatch || separatorMatch.index === undefined) {
    return { originalArtist: "", track: cleaned, hasFlp };
  }

  return {
    originalArtist: cleaned.slice(0, separatorMatch.index).trim(),
    track: cleaned.slice(separatorMatch.index + separatorMatch[0].length).trim(),
    hasFlp,
  };
}

const ISO_8601_DURATION_PATTERN =
  /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;

/** Parses YouTube's `contentDetails.duration` (ISO 8601, e.g. `PT4M13S`) into seconds. */
export function parseIsoDurationSeconds(iso: string): number {
  const match = ISO_8601_DURATION_PATTERN.exec(iso);
  if (!match) return 0;
  const [, hours, minutes, seconds] = match;
  return (
    Number(hours || 0) * 3600 + Number(minutes || 0) * 60 + Number(seconds || 0)
  );
}

/** `4:13` / `1:04:13` — matches the duration badge in SIB-27 §3 card anatomy. */
export function formatDurationLabel(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${paddedSeconds}`;
  }
  return `${minutes}:${paddedSeconds}`;
}
