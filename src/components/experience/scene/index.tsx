"use client";

import { ROOM_WAYPOINTS } from "./room-waypoints";
import { CameraRig } from "./camera-rig";
import { useDeviceProfile } from "@/lib/device/device-tier-provider";

/**
 * Root of the WebGL scene graph, mounted as children of SceneCanvas. Room
 * meshes here are placeholder markers only — proof that the camera
 * choreography (SIB-9) works end to end across the real room routes
 * (SIB-8). Swap each room's content for real staging once the Creative
 * Director's moodboard lands; camera-rig.tsx only reads positions from
 * room-waypoints.ts, so room visuals can change without touching the
 * choreography.
 *
 * Geometry subdivision reads `budget.geometryDetail` (SIB-17) so this stays
 * a real, live proof that tier-driven LOD works end to end, not just a
 * budget field nothing consumes — once real room geometry lands, the same
 * field should pick which pre-baked LOD/glTF to fetch per tier.
 */
export function Scene() {
  const { budget } = useDeviceProfile();

  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1} />
      {ROOM_WAYPOINTS.map((room) => (
        <mesh key={room.slug} position={room.position}>
          <icosahedronGeometry args={[1.2, budget.geometryDetail]} />
          <meshStandardMaterial color="#8888ff" wireframe />
        </mesh>
      ))}
    </>
  );
}
