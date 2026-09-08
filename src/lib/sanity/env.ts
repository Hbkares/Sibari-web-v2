/**
 * Sanity project isn't provisioned yet (SIB-4 chose the platform, but no
 * project/dataset exists in the org). Every consumer of this module must
 * degrade gracefully when these are unset — see `isSanityConfigured` and
 * `sanityFetch` in `./fetch`.
 */
export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const SANITY_API_VERSION = process.env.SANITY_API_VERSION ?? "2025-01-01";

export const isSanityConfigured = Boolean(SANITY_PROJECT_ID);
