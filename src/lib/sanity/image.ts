import { createImageUrlBuilder } from "@sanity/image-url";
import type { ImageUrlBuilder } from "@sanity/image-url";
import { SANITY_DATASET, SANITY_PROJECT_ID, isSanityConfigured } from "./env";

const builder = isSanityConfigured
  ? createImageUrlBuilder({
      projectId: SANITY_PROJECT_ID as string,
      dataset: SANITY_DATASET,
    })
  : null;

export interface SanityImageRef {
  asset?: { _ref?: string; _id?: string } | null;
}

/** Returns `null` when the project isn't configured or the image has no asset. */
export function urlForImage(source: SanityImageRef | null | undefined): ImageUrlBuilder | null {
  if (!builder || !source?.asset) return null;
  return builder.image(source);
}
