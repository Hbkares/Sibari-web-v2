/**
 * One-time, synchronous check for whether a WebGL context can be created at
 * all (old browsers, GPU-blocklisted drivers, some in-app/webview browsers,
 * battery-saver/low-power modes). Deliberately separate from device-tier.ts,
 * which assumes WebGL already works and only scores *how capable* it is.
 */
export function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    return gl !== null;
  } catch {
    return false;
  }
}
