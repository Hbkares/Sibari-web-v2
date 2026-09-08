import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";

// Ashima Arts / Stefan Gustavson simplex noise (MIT). Compact 3D variant used
// to displace particles along a smooth curl-like field rather than jittering
// them randomly — reads as atmospheric drift, not noise-demo sparkle.
const SIMPLEX_3D = /* glsl */ `
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const AudioParticleMaterial = shaderMaterial(
  {
    uTime: 0,
    uBass: 0,
    uMid: 0,
    uTreble: 0,
    uSize: 34,
    uPixelRatio: 1,
    uDisplacement: 1,
    uColorLow: new THREE.Color("#2a1a4a"),
    uColorHigh: new THREE.Color("#ff5ecb"),
  },
  /* glsl vertex */ `
    uniform float uTime;
    uniform float uBass;
    uniform float uMid;
    uniform float uTreble;
    uniform float uSize;
    uniform float uPixelRatio;
    uniform float uDisplacement;

    varying float vEnergy;

    ${SIMPLEX_3D}

    void main() {
      vec3 pos = position;

      // Bass: slow radial pulse outward from center.
      float radius = length(pos);
      pos += normalize(pos) * uBass * 0.6;

      // Mid: curl-ish drift via offset noise samples per axis.
      if (uDisplacement > 0.5) {
        float n = snoise(pos * 0.6 + uTime * 0.15);
        float nx = snoise(pos * 0.6 + vec3(5.2, 1.3, 0.0) + uTime * 0.15);
        float ny = snoise(pos * 0.6 + vec3(0.0, 4.1, 2.7) + uTime * 0.15);
        pos += vec3(nx, ny, n) * (0.25 + uMid * 0.9);
      }

      // Treble: fine per-vertex jitter for a sparkle feel.
      float jitter = snoise(pos * 4.0 + uTime * 2.0) * uTreble * 0.15;
      pos += jitter;

      vEnergy = clamp(uBass * 0.5 + uMid * 0.35 + uTreble * 0.5, 0.0, 1.0);

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = uSize * uPixelRatio * (0.6 + uTreble * 1.4) / -mvPosition.z;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  /* glsl fragment */ `
    uniform vec3 uColorLow;
    uniform vec3 uColorHigh;
    varying float vEnergy;

    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv);
      float alpha = 1.0 - smoothstep(0.0, 0.5, d);
      if (alpha < 0.02) discard;

      vec3 color = mix(uColorLow, uColorHigh, vEnergy);
      gl_FragColor = vec4(color, alpha * (0.35 + vEnergy * 0.65));
    }
  `,
);

extend({ AudioParticleMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    audioParticleMaterial: ThreeElement<typeof AudioParticleMaterial>;
  }
}
