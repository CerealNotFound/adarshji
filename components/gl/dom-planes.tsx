"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";

import { motionStore } from "@/lib/motion-store";

import { type GLImageEntry, glImages } from "./gl-images";

const vert = /* glsl */ `
  uniform vec4 uRect;      // left, bottom, width, height in screen 0..1
  uniform float uCurl;
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    vec2 s = uRect.xy + vUv * uRect.zw;
    // Cylinder: near the top and bottom of the screen the page flares outward.
    float c = 2.0 * s.y - 1.0;
    float profile = 1.0 - sqrt(max(0.0, 1.0 - c * c));
    s.x = (s.x - 0.5) * (1.0 + profile * uCurl) + 0.5;
    gl_Position = vec4(s * 2.0 - 1.0, 0.0, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform sampler2D map;
  uniform float uImgAspect;
  uniform float uRectAspect;
  uniform vec2 uRectPx;
  uniform float uPolarity;
  uniform float uOpacity;
  uniform float uHover;
  uniform vec2 uHoverPoint;
  uniform float uDot;
  uniform vec3 uDotColor;
  uniform float uContain;   // 1: show the whole image on a matte, never crop
  uniform vec3 uMatte;
  uniform vec2 uTexel;      // half a texel, keeps samples off the edge
  varying vec2 vUv;

  vec2 fit(vec2 uv) {
    float r = uRectAspect / uImgAspect;
    vec2 cover = r > 1.0 ? vec2(1.0, 1.0 / r) : vec2(r, 1.0);
    vec2 contain = r > 1.0 ? vec2(r, 1.0) : vec2(1.0, 1.0 / r);
    return (uv - 0.5) * mix(cover, contain, uContain) + 0.5;
  }

  // Inside the image? (Only false in contain mode, in the matte.)
  float inImage(vec2 uv) {
    vec2 e = step(vec2(0.0), uv) * step(uv, vec2(1.0));
    return e.x * e.y;
  }

  vec3 sampleImage(vec2 uv) {
    vec3 c = texture2D(map, clamp(uv, uTexel, 1.0 - uTexel)).rgb;
    return mix(uMatte, c, inImage(uv));
  }

  void main() {
    vec3 col = sampleImage(fit(vUv));

    // Arrives colour-inverted, then flips to normal.
    col = mix(vec3(1.0) - col, col, uPolarity);
    col = mix(uMatte, col, inImage(fit(vUv))); // the matte never inverts

    // Halftone on hover, spreading out from where the pointer came in.
    vec2 px = vUv * uRectPx;
    vec2 cid = floor(px / uDot);
    vec2 f = fract(px / uDot) - 0.5;
    vec3 cellCol = sampleImage(fit((cid + 0.5) * uDot / uRectPx));
    float lum = dot(cellCol, vec3(0.299, 0.587, 0.114));
    float r = 0.12 + sqrt(lum) * 0.5;
    float dotm = smoothstep(r, r - 0.08, length(f));
    vec3 ht = mix(vec3(0.004, 0.003, 0.002), uDotColor, dotm);
    // One wave of dots sweeps out from the pointer, then clears, so the
    // screenshot stays readable while hovered.
    vec2 a = vec2(uRectAspect, 1.0);
    float d = distance(vUv * a, uHoverPoint * a);
    float band = 0.22;
    float wave = uHover * (length(a) * 1.1 + band * 2.0);
    float ring = 1.0 - smoothstep(0.0, band, abs(d - wave + band));
    float passed = step(d, wave - band);
    col = mix(col, ht, ring * 0.9);
    col = mix(col, col * vec3(1.06, 0.97, 0.92), passed * uHover * 0.6); // faint ember warmth

    gl_FragColor = vec4(col, uOpacity);
  }
`;

const loader = new THREE.TextureLoader();
const cache = new Map<string, Promise<THREE.Texture>>();
function loadTexture(src: string) {
  let p = cache.get(src);
  if (!p) {
    p = loader.loadAsync(src).then((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      return t;
    });
    cache.set(src, p);
  }
  return p;
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Scroll speed → how strongly the page curls, shared by every plane.
const curl = { value: 0 };

function DomPlane({ entry }: { entry: GLImageEntry }) {
  const mesh = useRef<THREE.Mesh>(null);
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const anim = useRef({ reveal: 0, hover: 0, seen: false });

  useEffect(() => {
    let alive = true;
    loadTexture(entry.src).then((t) => alive && setTex(t));
    return () => {
      alive = false;
    };
  }, [entry.src]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
          map: { value: null },
          uRect: { value: new THREE.Vector4() },
          uCurl: { value: 0 },
          uImgAspect: { value: 1 },
          uRectAspect: { value: 1 },
          uRectPx: { value: new THREE.Vector2(1, 1) },
          uPolarity: { value: 0 },
          uOpacity: { value: 0 },
          uHover: { value: 0 },
          uHoverPoint: { value: new THREE.Vector2(0.5, 0.5) },
          uDot: { value: 9 },
          uDotColor: { value: new THREE.Color("#ff6a2b") },
          uContain: { value: entry.fit === "contain" ? 1 : 0 },
          uMatte: { value: new THREE.Color(entry.matte ?? "#0b0908") },
          uTexel: { value: new THREE.Vector2(0.001, 0.001) },
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useEffect(() => () => material.dispose(), [material]);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m || !tex) return;
    const r = entry.el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const onScreen = r.bottom > -vh * 0.2 && r.top < vh * 1.2 && r.width > 0;
    m.visible = onScreen;
    const A = anim.current;
    if (!onScreen) {
      // Replay the reveal next time it comes back into view.
      if (r.bottom < -vh || r.top > vh * 2) {
        A.reveal = 0;
        A.seen = false;
      }
      return;
    }
    const inView = r.top < vh * 0.92 && r.bottom > vh * 0.08;
    if (inView) A.seen = true;
    if (A.seen) A.reveal = Math.min(1, A.reveal + delta / (motionStore.reducedMotion ? 0.01 : 0.9));
    // Linear so the wave sweeps at a steady speed (~0.7s across).
    A.hover += Math.sign(entry.hover - A.hover) * Math.min(Math.abs(entry.hover - A.hover), delta / 0.7);

    const u = material.uniforms;
    u.map.value = tex;
    const img = tex.image as { width: number; height: number };
    u.uImgAspect.value = img.width / img.height;
    u.uTexel.value.set(0.5 / img.width, 0.5 / img.height);
    u.uRect.value.set(r.left / vw, 1 - r.bottom / vh, r.width / vw, r.height / vh);
    u.uRectAspect.value = r.width / r.height;
    u.uRectPx.value.set(r.width, r.height);
    u.uCurl.value = curl.value;
    u.uPolarity.value = easeInOutCubic(A.reveal);
    u.uOpacity.value = Math.min(1, A.reveal * 4);
    u.uHover.value = A.hover;
    u.uHoverPoint.value.set(entry.hoverPoint.x, entry.hoverPoint.y);
  });

  return (
    <mesh ref={mesh} frustumCulled={false} renderOrder={10} material={material}>
      <planeGeometry args={[2, 2, 1, 32]} />
    </mesh>
  );
}

export function DomPlanes() {
  const entries = useSyncExternalStore(glImages.subscribe, glImages.getSnapshot, () => []);
  useFrame((_, delta) => {
    const target = Math.min(0.5, Math.abs(motionStore.velocity) * 0.012);
    curl.value += (target - curl.value) * (1 - Math.pow(0.002, delta));
  });
  return (
    <>
      {entries.map((e) => (
        <DomPlane key={e.id} entry={e} />
      ))}
    </>
  );
}
