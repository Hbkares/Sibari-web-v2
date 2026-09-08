"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { useDeviceProfile } from "@/lib/device/device-tier-provider";
import { ROOM_WAYPOINTS } from "./room-waypoints";

const MAX_INDEX = ROOM_WAYPOINTS.length - 1;

/**
 * Drives one continuous camera fly-through across rooms. Rooms are real
 * routes (SIB-8), not sections of one page, so "continuous movement between
 * rooms" is two layered motions here:
 *  - route changes tween a shared progress value from the previous room's
 *    index to the next room's index (GSAP), so navigating Home -> Universe
 *    reads as flying through the space instead of a hard cut;
 *  - Lenis/ScrollTrigger on the *current* room's page nudges the camera
 *    within that room's segment of the curve, so scrolling a room's own
 *    content still moves the camera, not just route changes.
 * Position comes off a Catmull-Rom curve through the room waypoints; the
 * look target comes from the curve's tangent at the same point, so the
 * camera orients toward where it's flying.
 */
export function CameraRig() {
  const { camera } = useThree();
  const pathname = usePathname();
  const progress = useRef(0);
  const scrollOffset = useRef(0);

  const { prefersReducedMotion } = useDeviceProfile();

  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(ROOM_WAYPOINTS.map((room) => room.position)),
    [],
  );

  const roomIndex = useMemo(() => {
    const index = ROOM_WAYPOINTS.findIndex((room) => room.slug === pathname);
    return index === -1 ? 0 : index;
  }, [pathname]);

  useEffect(() => {
    const tween = gsap.to(progress, {
      current: roomIndex,
      duration: prefersReducedMotion ? 0 : 1.4,
      ease: "power3.inOut",
    });
    return () => {
      tween.kill();
    };
  }, [roomIndex, prefersReducedMotion]);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollOffset.current = self.progress - 0.5;
      },
    });
    return () => {
      scrollOffset.current = 0;
      trigger.kill();
    };
  }, [pathname]);

  useFrame(() => {
    const scrollNudge = prefersReducedMotion ? 0 : scrollOffset.current * 0.6;
    const t = THREE.MathUtils.clamp(
      (progress.current + scrollNudge) / MAX_INDEX,
      0,
      1,
    );
    camera.position.copy(curve.getPointAt(t));
    const tangent = curve.getTangentAt(t);
    camera.lookAt(camera.position.clone().add(tangent));
  });

  return null;
}
