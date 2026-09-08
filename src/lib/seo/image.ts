import { urlForImage } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";

/** Returns `undefined` (rather than `null`) so callers can spread it straight into Metadata/JSON-LD fields. */
export function resolveImageUrl(
  image: SanityImage | null | undefined,
  dimensions?: { width?: number; height?: number },
): string | undefined {
  const builder = urlForImage(image);
  if (!builder) return undefined;

  let sized = builder;
  if (dimensions?.width) sized = sized.width(dimensions.width);
  if (dimensions?.height) sized = sized.height(dimensions.height);

  return sized.url();
}
