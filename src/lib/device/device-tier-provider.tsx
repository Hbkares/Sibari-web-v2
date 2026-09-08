"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  SAFE_DEFAULT_PROFILE,
  detectDeviceProfile,
  type DeviceProfile,
} from "./device-tier";

const WATCHED_QUERIES = [
  "(pointer: coarse)",
  "(min-width: 768px)",
  "(prefers-reduced-motion: reduce)",
] as const;

// Module-level, not per-provider: useSyncExternalStore requires getSnapshot
// to return a stable reference until something actually changes, so the
// profile is computed once and only invalidated by a real matchMedia event.
let cachedProfile: DeviceProfile | null = null;

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQueryLists = WATCHED_QUERIES.map((query) =>
    window.matchMedia(query),
  );
  const handleChange = () => {
    cachedProfile = null;
    onChange();
  };
  mediaQueryLists.forEach((list) =>
    list.addEventListener("change", handleChange),
  );
  return () => {
    mediaQueryLists.forEach((list) =>
      list.removeEventListener("change", handleChange),
    );
  };
}

function getSnapshot(): DeviceProfile {
  if (!cachedProfile) {
    cachedProfile = detectDeviceProfile();
  }
  return cachedProfile;
}

function getServerSnapshot(): DeviceProfile {
  return SAFE_DEFAULT_PROFILE;
}

const DeviceProfileContext = createContext<DeviceProfile>(SAFE_DEFAULT_PROFILE);

/**
 * Single source of truth for device tier, read by the scene layer (render
 * budget) and by the scroll layer (touch vs. pointer behavior). Backed by
 * useSyncExternalStore, matching usePrefersReducedMotion's pattern: safe on
 * the server, refines from real matchMedia/navigator signals post-mount, and
 * reacts live to tier-relevant changes (rotation, external pointer plugged
 * in, reduced-motion toggled) rather than only detecting once.
 */
export function DeviceTierProvider({ children }: { children: ReactNode }) {
  const profile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <DeviceProfileContext.Provider value={profile}>
      {children}
    </DeviceProfileContext.Provider>
  );
}

export function useDeviceProfile(): DeviceProfile {
  return useContext(DeviceProfileContext);
}
