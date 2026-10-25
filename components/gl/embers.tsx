"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { motionStore } from "@/lib/motion-store";

const vert = /* glsl */ `
  attribute float aSpeed;
  attribute float aPhase;
  attribute float aSize;
  uniform float uTime;
  uniform float uHeight;
  uniform float uScrollY;
  uniform float uPixelRatio;
  varying float vLife;
  void main() {
    vec3 p = position;
    float life = fract(aPhase + uTime * aSpeed);
    p.y = -uHeight * 0.55 + life * uHeight * 1.1 + uScrollY;
    p.x += sin(uTime * 0.7 + aPhase * 20.0) * 0.12 * life
         + sin(life * 6.2831 + aPhase * 5.0) * 0.06;
    vLife = life;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPixelRatio * (60.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const frag = /* glsl */ `
  varying float vLife;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    float fade = smoothstep(0.0, 0.12, vLife) * smoothstep(1.0, 0.5, vLife);
    vec3 col = mix(vec3(1.0, 0.86, 0.6), vec3(1.0, 0.28, 0.05), vLife);
    gl_FragColor = vec4(pow(col, vec3(2.2)) * a * fade * 1.5, a * fade);
  }
`;

/** Sparks drifting up through the hero, clustered around the phoenix. */
export function Embers() {
  const { viewport, gl } = useThree();
  const count = motionStore.lowPower ? 160 : 380;
  const points = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const speed = new Float32Array(count);
    const phase = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Sum of randoms gives a soft centre cluster.
      const spread = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
      pos[i * 3] = spread * viewport.width * 0.6;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2.4;
      speed[i] = 0.025 + Math.random() * 0.06;
      phase[i] = Math.random();
      sizes[i] = 0.4 + Math.pow(Math.random(), 4) * 1.8;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uTime: { value: 0 },
        uHeight: { value: viewport.height },
        uScrollY: { value: 0 },
        uPixelRatio: { value: gl.getPixelRatio() },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry, material };
  }, [count, viewport.width, viewport.height, gl]);

  useFrame((state) => {
    if (points.current) points.current.visible = motionStore.hero && motionStore.scroll < window.innerHeight * 1.4;
    const vh = window.innerHeight;
    const u = material.uniforms;
    u.uTime.value = motionStore.reducedMotion ? 0 : state.clock.elapsedTime;
    u.uHeight.value = viewport.height;
    u.uScrollY.value = motionStore.scroll * (viewport.height / vh) * 0.9;
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
