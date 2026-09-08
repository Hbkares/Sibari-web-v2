"use client";

import { useEffect, useRef, type RefObject } from "react";
import { TrackAnalyser } from "./track-analyser";

/**
 * Lazily creates a TrackAnalyser bound to `audioRef.current` and tears it
 * down on unmount. Returns a ref (read imperatively in the R3F frame loop)
 * plus `resume`, which must be invoked from the same user-gesture handler
 * that starts playback — MediaElementAudioSourceNode + AudioContext both
 * require it under browser autoplay policy.
 */
export function useTrackAnalyser(audioRef: RefObject<HTMLAudioElement | null>) {
  const analyserRef = useRef<TrackAnalyser | null>(null);

  useEffect(() => {
    return () => {
      analyserRef.current?.dispose();
      analyserRef.current = null;
    };
  }, []);

  const resume = async () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    if (!analyserRef.current) {
      analyserRef.current = new TrackAnalyser(audioEl);
    }
    await analyserRef.current.resume();
  };

  return { analyserRef, resume };
}
