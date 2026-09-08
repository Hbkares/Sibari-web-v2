/**
 * GROQ per room, following the room-mapping table in SIB-4 §4: content
 * reaches a room by type + relation + status/date, never a manual "which
 * room" field. Adding an entry in the Studio is enough — no query changes.
 */

const RELEASE_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  releaseType,
  releaseDate,
  coverArt,
  coverArtAlt,
  links,
  synopsis,
  featured,
}`;

const TRACK_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  trackNumber,
  duration,
  explicit,
  credits,
  lyrics,
}`;

const VISUAL_PIECE_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  mediaType,
  category,
  date,
  imageAsset,
  thumbnail,
  "linkedRelease": linkedRelease->{ title, "slug": slug.current },
}`;

const SHOW_PROJECTION = `{
  _id,
  title,
  date,
  venue,
  ticketLink,
  status,
  "relatedRelease": relatedRelease->{ title, "slug": slug.current },
}`;

const PRESS_MENTION_PROJECTION = `{
  _id,
  outlet,
  quote,
  link,
  date,
  logo,
}`;

const BIO_BLOCK_PROJECTION = `{
  _id,
  label,
  body,
  publishedAt,
}`;

/** Home: featured Release + featured VisualPiece + active short BioBlock. */
export const HOME_QUERY = `{
  "featuredRelease": *[_type == "release" && status == "published" && featured == true] | order(sortOrder asc, releaseDate desc)[0] ${RELEASE_PROJECTION},
  "featuredVisual": *[_type == "visualPiece" && status == "published" && featured == true] | order(sortOrder asc, date desc)[0] ${VISUAL_PIECE_PROJECTION},
  "shortBio": *[_type == "bioBlock" && label == "short" && isActive == true] | order(publishedAt desc)[0] ${BIO_BLOCK_PROJECTION}
}`;

/** Releases: all published Release, sortOrder then releaseDate desc. */
export const RELEASES_QUERY = `*[_type == "release" && status == "published"] | order(sortOrder asc, releaseDate desc) ${RELEASE_PROJECTION}`;

/**
 * Selected Tracks (listening room): the featured Release with its tracklist,
 * falling back to the most recent published Release when nothing is
 * featured. `Track.release` is the authoritative edge per SIB-4 §5 — the
 * tracklist query filters on it rather than trusting `Release.tracks`
 * ordering, then sorts by `trackNumber`.
 */
export const FEATURED_RELEASE_WITH_TRACKS_QUERY = `{
  "release": *[_type == "release" && status == "published"] | order(featured desc, sortOrder asc, releaseDate desc)[0] ${RELEASE_PROJECTION},
  "tracks": *[
    _type == "track" &&
    release._ref == *[_type == "release" && status == "published"] | order(featured desc, sortOrder asc, releaseDate desc)[0]._id
  ] | order(trackNumber asc) ${TRACK_PROJECTION}
}`;

/** Visuals: all published VisualPiece, sortOrder then date desc. */
export const VISUALS_QUERY = `*[_type == "visualPiece" && status == "published"] | order(sortOrder asc, date desc) ${VISUAL_PIECE_PROJECTION}`;

/** Story: active long BioBlock + PressMention feed, date desc. */
export const STORY_QUERY = `{
  "longBio": *[_type == "bioBlock" && label == "long" && isActive == true] | order(publishedAt desc)[0] ${BIO_BLOCK_PROJECTION},
  "press": *[_type == "pressMention" && status == "published"] | order(date desc) ${PRESS_MENTION_PROJECTION}
}`;

/** Contact: upcoming Shows (asc) and past Shows (desc), status-driven split. */
export const SHOWS_QUERY = `{
  "upcoming": *[_type == "show" && status != "past" && status != "cancelled"] | order(date asc) ${SHOW_PROJECTION},
  "past": *[_type == "show" && status == "past"] | order(date desc)[0...5] ${SHOW_PROJECTION}
}`;
