import * as THREE from "three";
import { ROOMS, type RoomDefinition } from "@/lib/rooms";

/**
 * 3D camera waypoint per room, keyed to the canonical room/route list in
 * src/lib/rooms.ts (SIB-8's room-per-route structure — each room server-
 * renders on its own route for SEO, the WebGL layer just choreographs the
 * camera between them). Positions are placeholder staging — stand-ins until
 * the Creative Director's moodboard defines real spatial layout per room;
 * swap the offsets (or the room meshes in scene/index.tsx) freely without
 * touching camera-rig.tsx, which only ever reads this array by slug.
 */
export type RoomWaypoint = RoomDefinition & { position: THREE.Vector3 };

const OFFSETS: THREE.Vector3[] = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(4, -1, -14),
  new THREE.Vector3(-4, 1.5, -28),
  new THREE.Vector3(3, -2, -42),
  new THREE.Vector3(-3, 2, -56),
  new THREE.Vector3(0, 0, -70),
  new THREE.Vector3(2, -1, -84),
];

export const ROOM_WAYPOINTS: RoomWaypoint[] = ROOMS.map((room, i) => ({
  ...room,
  position: OFFSETS[i] ?? new THREE.Vector3(0, 0, -14 * i),
}));
