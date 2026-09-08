"use client";

import { useState } from "react";
import { SERVICE_LABELS, type CrossPlatformLinks } from "@/lib/odesli/types";
import styles from "./track-service-links.module.css";

type LoadState = "idle" | "loading" | "loaded" | "error";

/**
 * Per-track "more ways to listen" disclosure. Deliberately does nothing
 * until clicked: the cross-platform lookup (Odesli, via /api/music/links)
 * only fires on interaction, so the Music section's server render never
 * blocks on N third-party calls (perf-budget priority #1, SIB-26).
 */
export function TrackServiceLinks({
  spotifyUrl,
  trackName,
}: {
  spotifyUrl: string;
  trackName: string;
}) {
  const [state, setState] = useState<LoadState>("idle");
  const [links, setLinks] = useState<CrossPlatformLinks>({});

  async function handleToggle() {
    if (state === "loaded") {
      setState("idle");
      return;
    }
    if (state === "loading") return;

    setState("loading");
    try {
      const res = await fetch(`/api/music/links?url=${encodeURIComponent(spotifyUrl)}`);
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = (await res.json()) as { links: CrossPlatformLinks };
      setLinks(data.links ?? {});
      setState("loaded");
    } catch {
      setState("error");
    }
  }

  const otherServices = (Object.keys(links) as (keyof CrossPlatformLinks)[]).filter(
    (platform) => platform !== "spotify" && links[platform],
  );

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        onClick={handleToggle}
        className={styles.toggle}
        aria-expanded={state === "loaded"}
      >
        {state === "loading" ? "Finding links…" : "More ways to listen"}
      </button>
      {state === "loaded" ? (
        otherServices.length > 0 ? (
          <ul className={styles.list} aria-label={`Listen to ${trackName} on other services`}>
            {otherServices.map((platform) => (
              <li key={platform}>
                <a href={links[platform]} target="_blank" rel="noopener noreferrer">
                  {SERVICE_LABELS[platform]}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>No other services found for this track.</p>
        )
      ) : null}
      {state === "error" ? (
        <p className={styles.empty}>Couldn&apos;t load other services — try Spotify above.</p>
      ) : null}
    </div>
  );
}
