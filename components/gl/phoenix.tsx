"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { motionStore } from "@/lib/motion-store";

import { inflateCanvas } from "./inflate";

const UNITS = 32; // output size of the inflated phoenix

// Phoenix from Microsoft Fluent Emoji (MIT License), the same file as the
// favicon, so every device shows the same bird whatever its emoji font.
export const PHOENIX_SRC = "/brand/phoenix.svg";

/** Returns a clean canvas for the shape and a colour-bled one for the texture. */
async function drawPhoenix(size: number) {
  const img = new Image();
  img.src = PHOENIX_SRC;
  await img.decode();
  const pad = size * 0.06;
  const draw = (filter: string) => {
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d")!;
    if (filter) {
      // Bleed colours past the outline so the rim never samples transparent black.
      ctx.filter = filter;
      ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);
      ctx.filter = "none";
    }
    ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);
    return c;
  };
  return { shape: draw(""), color: draw(`blur(${Math.round(size / 100)}px)`) };
}

function usePhoenix() {
  const [asset, setAsset] = useState<{ geometry: THREE.BufferGeometry; texture: THREE.Texture } | null>(null);
  useEffect(() => {
    let alive = true;
    const size = motionStore.lowPower ? 320 : 512;
    drawPhoenix(size).then(({ shape, color }) => {
      if (!alive) return;
      const geometry = inflateCanvas(shape, size / UNITS, {
        edgeRadius: 2.6,
        thickness: 1.9,
        dome: 0.55,
        grow: 0.15,
      });
      const texture = new THREE.CanvasTexture(color);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      setAsset({ geometry, texture });
    });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(
    () => () => {
      asset?.geometry.dispose();
      asset?.texture.dispose();
    },
    [asset]
  );
  return asset;
}

export function Phoenix() {
  const asset = usePhoenix();
  const group = useRef<THREE.Group>(null);
  const { viewport, size } = useThree();

  const mobile = size.width < 768;
  const scale = Math.min((viewport.height * 0.6) / UNITS, (viewport.width * 0.8) / UNITS);
  const baseY = viewport.height * (mobile ? 0.1 : 0.07);
  const baseX = mobile ? 0 : viewport.width * 0.03;

  const material = useMemo(() => {
    if (!asset) return null;
    if (motionStore.lowPower) {
      // Phones: no clearcoat/sheen/iridescence, which are costly per pixel.
      return new THREE.MeshStandardMaterial({
        map: asset.texture,
        emissiveMap: asset.texture,
        emissive: new THREE.Color("#ffffff"),
        emissiveIntensity: 0.4,
        roughness: 0.35,
        metalness: 0,
        envMapIntensity: 0.9,
      });
    }
    return new THREE.MeshPhysicalMaterial({
      map: asset.texture,
      emissiveMap: asset.texture,
      emissive: new THREE.Color("#ffffff"),
      emissiveIntensity: 0.38,
      bumpMap: asset.texture,
      bumpScale: 0.6,
      roughness: 0.4,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      sheen: 0.4,
      sheenColor: new THREE.Color("#ffb070"),
      iridescence: 0.15,
      envMapIntensity: 0.8,
    });
  }, [asset]);
  useEffect(() => () => material?.dispose(), [material]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const vh = window.innerHeight;
    const scroll = motionStore.scroll;

    const visible = motionStore.hero && scroll < vh * 1.3;
    g.visible = visible;
    if (!visible) return;

    const px = motionStore.pointer.nx - 0.5;
    const py = motionStore.pointer.ny - 0.5;
    const k = 1 - Math.pow(0.001, delta);
    const still = motionStore.reducedMotion ? 0 : 1;
    g.rotation.y += (px * 0.45 + Math.sin(t * 0.35) * 0.12 * still - g.rotation.y) * k;
    g.rotation.x += (py * 0.25 + Math.sin(t * 0.5) * 0.04 * still - g.rotation.x) * k;

    const worldPerPx = viewport.height / vh;
    g.position.y = baseY + Math.sin(t * 0.8) * 0.05 * still + scroll * worldPerPx * 0.75;
  });

  if (!asset || !material) return null;
  return (
    <group ref={group} position={[baseX, baseY, 0]}>
      <mesh geometry={asset.geometry} material={material} scale={scale} />
    </group>
  );
}
