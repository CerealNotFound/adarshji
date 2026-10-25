"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { motionStore } from "@/lib/motion-store";

import { FluidSim } from "./fluid-sim";
import {
  backdropFrag,
  backgroundFrag,
  backgroundVert,
  bokehFrag,
  fullscreenVert,
  postFrag,
} from "./shaders";

/**
 * Owns rendering (useFrame priority 1). Every frame:
 * 1. ember silk backdrop → lens blur (half resolution, hero only)
 * 2. the 3D scene (background plane, phoenix, embers) → sceneRT
 * 3. cursor fluid step
 * 4. post: fluid displacement + RGB split + glitch → screen
 */
export function Pipeline() {
  const { gl, scene, camera, size, viewport } = useThree();
  const lowPower = motionStore.lowPower;
  const dpr = viewport.dpr;

  const targets = useMemo(() => {
    const w = Math.max(1, Math.floor(size.width * dpr));
    const h = Math.max(1, Math.floor(size.height * dpr));
    const k = lowPower ? 0.35 : 0.5;
    const bw = Math.max(1, Math.floor(size.width * k));
    const bh = Math.max(1, Math.floor(size.height * k));
    const opts = { type: THREE.HalfFloatType, depthBuffer: false };
    return {
      w,
      h,
      bw,
      bh,
      scene: new THREE.WebGLRenderTarget(w, h, {
        type: THREE.HalfFloatType,
        samples: lowPower ? 0 : 4,
      }),
      back: new THREE.WebGLRenderTarget(bw, bh, opts),
      blur: new THREE.WebGLRenderTarget(bw, bh, opts),
    };
  }, [size.width, size.height, dpr, lowPower]);

  useEffect(
    () => () => {
      targets.scene.dispose();
      targets.back.dispose();
      targets.blur.dispose();
    },
    [targets]
  );

  // The cursor effect is desktop-only: on touch screens the fluid isn't created.
  const cursorFx = !motionStore.touch && !motionStore.reducedMotion;
  const sim = useMemo(() => (cursorFx ? new FluidSim(gl, 128, 20) : null), [gl, cursorFx]);
  useEffect(() => () => sim?.dispose(), [sim]);
  const still = useMemo(() => new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1), []);
  useEffect(() => () => still.dispose(), [still]);

  const fs = useMemo(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    quad.frustumCulled = false;
    scene.add(quad);
    const mk = (fragmentShader: string, uniforms: Record<string, THREE.IUniform>) =>
      new THREE.ShaderMaterial({ vertexShader: fullscreenVert, fragmentShader, uniforms, depthTest: false, depthWrite: false });
    return {
      scene,
      camera,
      quad,
      backdrop: mk(backdropFrag, {
        uTime: { value: 0 },
        uRes: { value: new THREE.Vector2() },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      }),
      bokeh: (() => {
        const m = mk(bokehFrag, {
          tInput: { value: null },
          uRes: { value: new THREE.Vector2() },
          uAmount: { value: lowPower ? 0.8 : 1.1 },
        });
        m.defines = { ITER: lowPower ? "10.0" : "24.0" };
        return m;
      })(),
      post: (() => {
        const m = mk(postFrag, {
          tDiffuse: { value: null },
          uVelocity: { value: null },
          uSimSize: { value: sim ? sim.size : new THREE.Vector2(1, 1) },
          uDisplacement: { value: sim ? 0.55 : 0 },
          uChroma: { value: sim ? 0.6 : 0 },
          uGlitch: { value: sim ? 1 : 0 },
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2() },
        });
        m.toneMapped = true;
        return m;
      })(),
    };
  }, [sim, lowPower]);

  const background = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: backgroundVert,
        fragmentShader: backgroundFrag,
        uniforms: {
          tBackdrop: { value: null },
          uRes: { value: new THREE.Vector2() },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uIntensity: { value: 1 },
          uBg: { value: new THREE.Vector3(0.043, 0.035, 0.031) },
        },
        depthTest: false,
        depthWrite: false,
      }),
    []
  );

  const state = useRef({
    last: { x: -1, y: -1 },
    mouse: new THREE.Vector2(0.5, 0.5),
    frame: 0,
  });

  const run = (mat: THREE.ShaderMaterial, out: THREE.WebGLRenderTarget | null) => {
    fs.quad.material = mat;
    gl.setRenderTarget(out);
    gl.render(fs.scene, fs.camera);
  };

  useFrame((frame, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const t = frame.clock.elapsedTime;
    const S = state.current;
    const p = motionStore.pointer;
    const reduce = motionStore.reducedMotion;
    sim?.setAspect(size.width / size.height);

    // Pointer → fluid splats
    if (p.moved) {
      const x = p.nx;
      const y = 1 - p.ny;
      if (sim && S.last.x >= 0) {
        const dx = (x - S.last.x) * 4200;
        const dy = (y - S.last.y) * 4200;
        if (Math.abs(dx) + Math.abs(dy) > 0.5) sim.splat(x, y, dx, dy, 0.045);
      }
      S.last = { x, y };
      p.moved = false;
    }
    S.mouse.lerp(new THREE.Vector2(p.nx, 1 - p.ny), 1 - Math.pow(0.02, dt));

    sim?.step(dt);
    S.frame++;

    // Backdrop: only while the hero is on screen.
    const heroFade = motionStore.hero ? 1 - Math.min(1, motionStore.scroll / (window.innerHeight * 1.05)) : 0;
    // On phones the slow silk only needs redrawing every other frame.
    if (heroFade > 0.001 && (!lowPower || S.frame % 2 === 0)) {
      fs.backdrop.uniforms.uTime.value = reduce ? 0 : t;
      fs.backdrop.uniforms.uRes.value.set(targets.bw, targets.bh);
      fs.backdrop.uniforms.uMouse.value.copy(S.mouse);
      run(fs.backdrop, targets.back);
      fs.bokeh.uniforms.tInput.value = targets.back.texture;
      fs.bokeh.uniforms.uRes.value.set(targets.bw, targets.bh);
      run(fs.bokeh, targets.blur);
    }
    background.uniforms.tBackdrop.value = targets.blur.texture;
    background.uniforms.uRes.value.set(size.width, size.height);
    background.uniforms.uMouse.value.copy(S.mouse);
    background.uniforms.uIntensity.value = heroFade;

    // Scene
    gl.setRenderTarget(targets.scene);
    gl.render(scene, camera);

    // Post to screen
    const u = fs.post.uniforms;
    u.tDiffuse.value = targets.scene.texture;
    u.uVelocity.value = sim ? sim.texture : still;
    u.uTime.value = t;
    u.uResolution.value.set(targets.w, targets.h);
    run(fs.post, null);
  }, 1);

  return (
    <mesh frustumCulled={false} renderOrder={-1000} material={background}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}
