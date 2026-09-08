"use client";

import { useRef } from "react";
import { LazySceneCanvas } from "@/components/experience/lazy-scene-canvas";
import {
  TracksRoom,
  TrackPlayer,
  type TracksRoomHandle,
} from "@/components/experience/scene/tracks-room";

/**
 * Dev-only harness for SIB-10 (audio-reactive listening room). Not part of
 * the room sequence — SIB-8/SIB-9 own wiring TracksRoom into the real scroll
 * flow and CMS-driven track list. Uses a synthesized test tone
 * (public/dev/test-tone.wav, scripts/gen-dev-test-tone.mjs) since no real
 * SIBARI track audio file has been delivered yet.
 */
export default function TracksRoomPreview() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const roomHandleRef = useRef<TracksRoomHandle | null>(null);

  return (
    <main style={{ height: "100vh", background: "#050208" }}>
      <div style={{ position: "fixed", bottom: 16, left: 16, zIndex: 1, color: "#fff" }}>
        <TrackPlayer
          src="/dev/test-tone.wav"
          title="Dev Test Tone"
          audioRef={audioRef}
          roomHandle={roomHandleRef}
        />
      </div>
      <LazySceneCanvas>
        <TracksRoom audioRef={audioRef} ref={roomHandleRef} />
      </LazySceneCanvas>
    </main>
  );
}
