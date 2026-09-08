"use client";

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTrackAnalyser } from "@/lib/audio/use-track-analyser";
import { useDeviceProfile } from "@/lib/device/device-tier-provider";
import { AudioParticleMaterial } from "./audio-particle-material";

export interface TracksRoomHandle {
  resume: () => Promise<void>;
}

interface TracksRoomProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  /** Room is inactive (out of scroll view) — analyser still updates, render stays cheap. */
  active?: boolean;
}

// Particle count at budget.particleMultiplier === 1 (SIB-14's "high" tier);
// scaled down per the shared device-tier budget from there.
const BASE_PARTICLE_COUNT = 10000;

function randomSpherePositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Uniform-in-volume sphere sample, not uniform-on-surface — gives a
    // denser core that thins toward the edges, closer to a "room" feel.
    const r = 2.2 * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

/**
 * The Selected Tracks room: a particle field whose displacement, size, and
 * color respond to the currently playing track's bass/mid/treble bands.
 * Consumers wire an <audio> element (eventually the CMS Track's audio URL)
 * and pass its ref here plus a `resume()` call from their play button's
 * click handler — the AudioContext can only start from a user gesture.
 */
export const TracksRoom = forwardRef<TracksRoomHandle, TracksRoomProps>(
  function TracksRoom({ audioRef, active = true }, ref) {
    const materialRef = useRef<InstanceType<typeof AudioParticleMaterial>>(null);
    const { analyserRef, resume } = useTrackAnalyser(audioRef);
    const { gl } = useThree();

    useImperativeHandle(ref, () => ({ resume }), [resume]);

    const { prefersReducedMotion, budget } = useDeviceProfile();
    const particleCount = Math.round(BASE_PARTICLE_COUNT * budget.particleMultiplier);
    // Curl-noise displacement is the priciest branch in the shader (3 extra
    // simplex samples/vertex/frame) — only "full" can afford it.
    const enableDisplacement =
      budget.shaderQuality === "full" && !prefersReducedMotion;
    const positions = useMemo(
      () => randomSpherePositions(particleCount),
      [particleCount],
    );

    useFrame((state) => {
      const material = materialRef.current;
      if (!material) return;

      material.uPixelRatio = gl.getPixelRatio();
      material.uDisplacement = enableDisplacement ? 1 : 0;

      if (!active) return;

      material.uTime = state.clock.elapsedTime;

      const analyser = analyserRef.current;
      if (!analyser) return;
      analyser.update();
      material.uBass = analyser.bands.bass;
      material.uMid = analyser.bands.mid;
      material.uTreble = analyser.bands.treble;
    });

    return (
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <audioParticleMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    );
  },
);
