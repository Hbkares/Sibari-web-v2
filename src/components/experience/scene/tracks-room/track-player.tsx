"use client";

import { useRef, useState, type RefObject } from "react";
import type { TracksRoomHandle } from "./tracks-room";

interface TrackPlayerProps {
  src: string;
  title: string;
  audioRef: RefObject<HTMLAudioElement | null>;
  roomHandle: RefObject<TracksRoomHandle | null>;
}

/**
 * Minimal DOM playback control for the listening room. This stands in for
 * the CMS-driven track list (Track content type, section 4 of the concept
 * plan) — swap `src`/`title` for real release data once that's wired up.
 * Owns the play-button gesture required to start the AudioContext.
 */
export function TrackPlayer({ src, title, audioRef, roomHandle }: TrackPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const hasResumed = useRef(false);

  const toggle = async () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    if (!hasResumed.current) {
      await roomHandle.current?.resume();
      hasResumed.current = true;
    }

    if (audioEl.paused) {
      await audioEl.play();
      setIsPlaying(true);
    } else {
      audioEl.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div>
      <audio ref={audioRef} src={src} loop crossOrigin="anonymous" />
      <button type="button" onClick={toggle}>
        {isPlaying ? "Pause" : "Play"} — {title}
      </button>
    </div>
  );
}
