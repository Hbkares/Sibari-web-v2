"use client";

import {
  Component,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Canvas } from "@react-three/fiber";
import { useDeviceProfile } from "@/lib/device/device-tier-provider";
import { supportsWebGL } from "@/lib/webgl-support";

const LAYER_STYLE: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: -1,
  pointerEvents: "none",
};

/** Decorative stand-in for the WebGL layer when it's unavailable or fails to mount. */
function SceneFallback() {
  return (
    <div
      style={{
        ...LAYER_STYLE,
        background: "radial-gradient(circle at 50% 30%, #1a1a2e, #05050a 70%)",
      }}
      aria-hidden
    />
  );
}

interface SceneErrorBoundaryState {
  hasError: boolean;
}

/**
 * Guards against renderer-creation failures a supportsWebGL() probe can't
 * catch up front (e.g. a GPU-blocklisted driver that creates a context but
 * fails three.js's WebGLRenderer init), so a failed mount can't take down
 * the DOM content sections mounted alongside it in the root layout.
 */
class SceneErrorBoundary extends Component<
  { children: ReactNode },
  SceneErrorBoundaryState
> {
  state: SceneErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("SceneCanvas failed to mount, falling back:", error);
  }

  render() {
    return this.state.hasError ? <SceneFallback /> : this.props.children;
  }
}

/**
 * Mount point for the WebGL experience layer. This component is the
 * integration boundary with the Creative Technologist's work: the scene
 * graph, shaders, and audio-reactive systems live under
 * src/components/experience/scene/** and get composed as `children` here.
 * Do not add scene content in this file.
 *
 * Renderer config (dpr/antialias/powerPreference) comes from the device
 * tier's render budget so phone GPUs never pay for desktop-tier settings —
 * scene code should read `useDeviceProfile().budget` for its own particle/
 * shader complexity scaling rather than hardcoding quality checks.
 *
 * WebGL availability is checked before mount (old browsers, GPU-blocklisted
 * drivers, some in-app/webview browsers, battery-saver modes can all fail
 * context creation), and the mount itself is wrapped in an error boundary as
 * a second line of defense — either path renders SceneFallback instead of
 * leaving a blank layer or crashing the DOM content below it.
 */
export function SceneCanvas({ children }: { children?: ReactNode }) {
  const { budget } = useDeviceProfile();
  const [webglSupported] = useState(supportsWebGL);

  if (!webglSupported) {
    return <SceneFallback />;
  }

  return (
    <div style={LAYER_STYLE} aria-hidden>
      <SceneErrorBoundary>
        <Canvas
          dpr={budget.dpr}
          shadows={budget.shadows}
          gl={{ antialias: budget.antialias, powerPreference: budget.powerPreference }}
        >
          {children}
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
