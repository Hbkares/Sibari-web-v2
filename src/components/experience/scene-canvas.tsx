"use client";

import { Canvas } from "@react-three/fiber";

/**
 * Mount point for the WebGL experience layer. This component is the
 * integration boundary with the Creative Technologist's work: the scene
 * graph, shaders, and audio-reactive systems live under
 * src/components/experience/scene/** and get composed as `children` here.
 * Do not add scene content in this file.
 */
export function SceneCanvas({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
        {children}
      </Canvas>
    </div>
  );
}
