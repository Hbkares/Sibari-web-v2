import type { ImageUrlBuilder } from "@sanity/image-url";
import type { RenderBudget } from "@/lib/device/device-tier";

/**
 * Caps a Sanity-sourced image to the current tier's texture budget so a
 * low/mid-tier device never pulls full-res source art just to use it as a
 * WebGL texture (cover art on a release mesh, a visuals-room plane, etc.).
 * No such texture consumer exists yet — rooms are still placeholder
 * geometry pending the Creative Director's moodboard — but the CMS image
 * pipeline (src/lib/sanity/image.ts) is already live, so this is the
 * contract scene code should call `urlForImage(...)` through once a room
 * actually renders one as a texture, the same way tracks-room already reads
 * `budget.particleMultiplier`/`shaderQuality`.
 *
 * Quality is capped alongside width: once a texture is GPU-mipmapped and
 * likely blurred by distance or motion in-scene, extra JPEG/AVIF fidelity
 * costs bytes without a visible payoff at the low tier.
 */
export function resolveTieredTextureUrl(
  builder: ImageUrlBuilder,
  budget: Pick<RenderBudget, "textureResolutionCap">,
): string {
  return builder
    .width(budget.textureResolutionCap)
    .quality(budget.textureResolutionCap <= 512 ? 60 : 75)
    .auto("format")
    .url();
}
