/**
 * Device tiering for the WebGL layer. Tier is derived from input capability
 * (pointer/hover media queries), not viewport width or user-agent string —
 * a touchscreen laptop or a foldable shouldn't get downgraded, and a UA
 * string shouldn't be trusted to predict GPU headroom.
 */

export type DeviceTier = "mobile" | "tablet" | "desktop";
export type QualityTier = "low" | "medium" | "high";
/** How much shader branching/sampling a material may spend. Signature effects (fluid/audio-reactive material, atmospheric passes, kinetic-type distortion) read this to skip expensive branches, not `quality` directly, so the shader-cost lever stays independent of dpr/particle tuning. */
export type ShaderQuality = "minimal" | "reduced" | "full";

export interface RenderBudget {
  dpr: [number, number];
  antialias: boolean;
  powerPreference: "default" | "high-performance" | "low-power";
  /** Scalar for scene code to multiply particle/instance counts by. */
  particleMultiplier: number;
  shadows: boolean;
  shaderQuality: ShaderQuality;
  /** Max long-edge px a streamed texture should request at this tier (see src/lib/assets/tiered-image.ts). */
  textureResolutionCap: number;
  /** LOD/subdivision level scene geometry should request at this tier (e.g. icosahedronGeometry's detail arg, or which pre-baked glTF LOD to fetch once real models land). */
  geometryDetail: number;
}

export interface DeviceProfile {
  tier: DeviceTier;
  quality: QualityTier;
  isTouch: boolean;
  prefersReducedMotion: boolean;
  budget: RenderBudget;
}

const BUDGETS: Record<QualityTier, RenderBudget> = {
  low: {
    dpr: [1, 1],
    antialias: false,
    powerPreference: "low-power",
    particleMultiplier: 0.25,
    shadows: false,
    shaderQuality: "minimal",
    textureResolutionCap: 512,
    geometryDetail: 0,
  },
  medium: {
    dpr: [1, 1.5],
    antialias: false,
    powerPreference: "default",
    particleMultiplier: 0.6,
    shadows: false,
    shaderQuality: "reduced",
    textureResolutionCap: 1024,
    geometryDetail: 1,
  },
  high: {
    dpr: [1, 2],
    antialias: true,
    powerPreference: "high-performance",
    particleMultiplier: 1,
    shadows: true,
    shaderQuality: "full",
    textureResolutionCap: 2048,
    geometryDetail: 2,
  },
};

const QUALITY_BY_TIER: Record<DeviceTier, QualityTier> = {
  mobile: "low",
  tablet: "medium",
  desktop: "high",
};

/**
 * Used as the initial render/scroll state on every device, before client
 * signals are available. Deliberately the cheapest budget: understating a
 * capable device for one frame is invisible, overstating a phone GPU is not.
 */
export const SAFE_DEFAULT_PROFILE: DeviceProfile = {
  tier: "mobile",
  quality: "low",
  isTouch: true,
  prefersReducedMotion: false,
  budget: BUDGETS.low,
};

// Renderer strings that identify a GPU/driver combo known to struggle with
// shader-heavy WebGL regardless of what cores/memory/pointer type report —
// software rasterizers (headless/blocklisted-driver fallback) and mobile
// GPU families several generations behind current mid-tier phones. Matching
// here can only ever move quality *down*, never up: WEBGL_debug_renderer_info
// is masked by several browsers by default, so a non-match means "unknown",
// not "capable".
const LOW_END_GPU_PATTERN =
  /swiftshader|software rasterizer|llvmpipe|microsoft basic render|mali-4|mali-3|powervr sgx|adreno (2|3)0[0-9]/i;

/**
 * Best-effort GPU capability read via WEBGL_debug_renderer_info. Deliberately
 * separate from supportsWebGL() (src/lib/webgl-support.ts), which only checks
 * whether a context can be created at all — this checks how capable it is.
 */
function detectLowEndGpu(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ??
      canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return true;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    if (!info) return false;
    const renderer = String(
      gl.getParameter(info.UNMASKED_RENDERER_WEBGL),
    ).toLowerCase();
    return LOW_END_GPU_PATTERN.test(renderer);
  } catch {
    return false;
  }
}

/** Client-only — reads matchMedia/navigator, call from an effect after mount. */
export function detectDeviceProfile(): DeviceProfile {
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const tier: DeviceTier = !isCoarsePointer
    ? "desktop"
    : window.matchMedia("(min-width: 768px)").matches
      ? "tablet"
      : "mobile";

  let quality = QUALITY_BY_TIER[tier];

  // UA/form-factor only proves input type, not headroom — downgrade further
  // for hardware that reports low concurrency/memory regardless of tier.
  const lowConcurrency = (navigator.hardwareConcurrency ?? 8) <= 4;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const lowMemory = typeof deviceMemory === "number" && deviceMemory <= 4;
  if (quality === "high" && (lowConcurrency || lowMemory)) quality = "medium";
  if (quality !== "low" && lowConcurrency && lowMemory) quality = "low";

  // A confirmed low-end/software GPU overrides everything above — cores and
  // RAM can be generous on a machine whose GPU still can't afford full-tier
  // shaders (e.g. a blocklisted driver, or a budget phone with a capable CPU).
  if (quality !== "low" && detectLowEndGpu()) quality = "low";

  return {
    tier,
    quality,
    isTouch: isCoarsePointer,
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
    budget: BUDGETS[quality],
  };
}
