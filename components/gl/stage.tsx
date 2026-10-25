"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { motionStore } from "@/lib/motion-store";

import { DomPlanes } from "./dom-planes";
import { Embers } from "./embers";
import { Phoenix } from "./phoenix";
import { Pipeline } from "./pipeline";

/** The single fixed WebGL layer behind the whole site. */
export default function Stage() {
  return (
    <Canvas
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      dpr={motionStore.lowPower ? 1 : [1, 1.5]}
      flat
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 35 }}
    >
      <Suspense fallback={null}>
        <Pipeline />
        <Embers />
        <Phoenix />
        <DomPlanes />
        {/* Local light shapes for reflections, so there's no HDR download. */}
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={3} color="#fff1e6" position={[0, 4, 2]} scale={[8, 1.2, 1]} />
          <Lightformer form="rect" intensity={1.4} color="#ff6a2b" position={[-5, 0, 1]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
          <Lightformer form="rect" intensity={1.4} color="#ffb070" position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
          <Lightformer form="rect" intensity={4} color="#ffffff" position={[0, -4, 3]} scale={[10, 0.4, 1]} />
          <Lightformer form="ring" intensity={2} color="#ffffff" position={[0, 0, 6]} scale={3} />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
