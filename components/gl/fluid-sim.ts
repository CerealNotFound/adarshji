import * as THREE from "three";

/**
 * Velocity-only GPU fluid (stable fluids, after Pavel Dobryakov's MIT-licensed
 * WebGL-Fluid-Simulation). Nothing is drawn from it directly: its velocity
 * texture displaces the rendered scene in the final pass, which is what makes
 * the cursor "push" the image around.
 */

const vert = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const head = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
`;

const FRAG = {
  splat: head + /* glsl */ `
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;
    void main() {
      vec2 p = vUv - point;
      p.x *= aspectRatio;
      vec3 splat = exp(-dot(p, p) / radius) * color;
      gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + splat, 1.0);
    }`,
  advect: head + /* glsl */ `
    uniform sampler2D uVelocity;
    uniform vec2 texelSize;
    uniform float dt;
    uniform float dissipation;
    void main() {
      vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
      gl_FragColor = texture2D(uVelocity, coord) / (1.0 + dissipation * dt);
    }`,
  divergence: head + /* glsl */ `
    uniform sampler2D uVelocity;
    void main() {
      float L = texture2D(uVelocity, vL).x;
      float R = texture2D(uVelocity, vR).x;
      float T = texture2D(uVelocity, vT).y;
      float B = texture2D(uVelocity, vB).y;
      vec2 C = texture2D(uVelocity, vUv).xy;
      if (vL.x < 0.0) { L = -C.x; }
      if (vR.x > 1.0) { R = -C.x; }
      if (vT.y > 1.0) { T = -C.y; }
      if (vB.y < 0.0) { B = -C.y; }
      gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
    }`,
  curl: head + /* glsl */ `
    uniform sampler2D uVelocity;
    void main() {
      float L = texture2D(uVelocity, vL).y;
      float R = texture2D(uVelocity, vR).y;
      float T = texture2D(uVelocity, vT).x;
      float B = texture2D(uVelocity, vB).x;
      gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
    }`,
  vorticity: head + /* glsl */ `
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;
    void main() {
      float L = texture2D(uCurl, vL).x;
      float R = texture2D(uCurl, vR).x;
      float T = texture2D(uCurl, vT).x;
      float B = texture2D(uCurl, vB).x;
      float C = texture2D(uCurl, vUv).x;
      vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
      force /= length(force) + 0.0001;
      force *= curl * C;
      force.y *= -1.0;
      vec2 v = texture2D(uVelocity, vUv).xy + force * dt;
      gl_FragColor = vec4(clamp(v, -1000.0, 1000.0), 0.0, 1.0);
    }`,
  pressure: head + /* glsl */ `
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    void main() {
      float L = texture2D(uPressure, vL).x;
      float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x;
      float B = texture2D(uPressure, vB).x;
      float div = texture2D(uDivergence, vUv).x;
      gl_FragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
    }`,
  gradient: head + /* glsl */ `
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    void main() {
      float L = texture2D(uPressure, vL).x;
      float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x;
      float B = texture2D(uPressure, vB).x;
      vec2 v = texture2D(uVelocity, vUv).xy - vec2(R - L, T - B);
      gl_FragColor = vec4(v, 0.0, 1.0);
    }`,
  fade: head + /* glsl */ `
    uniform sampler2D uTexture;
    uniform float value;
    void main() { gl_FragColor = value * texture2D(uTexture, vUv); }`,
};

type Double = { read: THREE.WebGLRenderTarget; write: THREE.WebGLRenderTarget; swap(): void };

function target(w: number, h: number, filter: THREE.MagnificationTextureFilter) {
  return new THREE.WebGLRenderTarget(w, h, {
    type: THREE.HalfFloatType,
    minFilter: filter,
    magFilter: filter,
    depthBuffer: false,
  });
}

function double(w: number, h: number, filter: THREE.MagnificationTextureFilter): Double {
  const d: Double = {
    read: target(w, h, filter),
    write: target(w, h, filter),
    swap() {
      [d.read, d.write] = [d.write, d.read];
    },
  };
  return d;
}

export class FluidSim {
  readonly size: THREE.Vector2;
  private velocity: Double;
  private pressure: Double;
  private divergence: THREE.WebGLRenderTarget;
  private curlRT: THREE.WebGLRenderTarget;
  private mats: Record<keyof typeof FRAG, THREE.ShaderMaterial>;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private quad: THREE.Mesh;
  private aspect = 1;

  constructor(
    private gl: THREE.WebGLRenderer,
    base: number,
    private iterations: number
  ) {
    const w = base * 2;
    const h = base;
    this.size = new THREE.Vector2(w, h);
    this.velocity = double(w, h, THREE.LinearFilter);
    this.pressure = double(w, h, THREE.NearestFilter);
    this.divergence = target(w, h, THREE.NearestFilter);
    this.curlRT = target(w, h, THREE.NearestFilter);
    const texel = new THREE.Vector2(1 / w, 1 / h);
    const mk = (frag: string) =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
          texelSize: { value: texel },
          uTarget: { value: null },
          uVelocity: { value: null },
          uPressure: { value: null },
          uDivergence: { value: null },
          uCurl: { value: null },
          uTexture: { value: null },
          aspectRatio: { value: 1 },
          color: { value: new THREE.Vector3() },
          point: { value: new THREE.Vector2() },
          radius: { value: 0.002 },
          dt: { value: 0.016 },
          dissipation: { value: 0.9 },
          curl: { value: 18 },
          value: { value: 0.8 },
        },
        depthTest: false,
        depthWrite: false,
      });
    this.mats = Object.fromEntries(
      Object.entries(FRAG).map(([k, f]) => [k, mk(f)])
    ) as Record<keyof typeof FRAG, THREE.ShaderMaterial>;
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mats.splat);
    this.quad.frustumCulled = false;
    this.scene.add(this.quad);
  }

  get texture() {
    return this.velocity.read.texture;
  }

  setAspect(a: number) {
    this.aspect = a;
  }

  private run(mat: THREE.ShaderMaterial, out: THREE.WebGLRenderTarget) {
    this.quad.material = mat;
    this.gl.setRenderTarget(out);
    this.gl.render(this.scene, this.camera);
  }

  /** x, y in 0..1 (y up); dx, dy in velocity units. */
  splat(x: number, y: number, dx: number, dy: number, radius = 0.18) {
    const m = this.mats.splat;
    m.uniforms.aspectRatio.value = this.aspect;
    m.uniforms.radius.value = (radius / 100) * Math.max(1, this.aspect);
    m.uniforms.point.value.set(x, y);
    m.uniforms.color.value.set(dx, dy, 0);
    m.uniforms.uTarget.value = this.velocity.read.texture;
    this.run(m, this.velocity.write);
    this.velocity.swap();
  }

  step(dt: number) {
    const M = this.mats;
    M.curl.uniforms.uVelocity.value = this.velocity.read.texture;
    this.run(M.curl, this.curlRT);

    M.vorticity.uniforms.uVelocity.value = this.velocity.read.texture;
    M.vorticity.uniforms.uCurl.value = this.curlRT.texture;
    M.vorticity.uniforms.dt.value = dt;
    this.run(M.vorticity, this.velocity.write);
    this.velocity.swap();

    M.divergence.uniforms.uVelocity.value = this.velocity.read.texture;
    this.run(M.divergence, this.divergence);

    M.fade.uniforms.uTexture.value = this.pressure.read.texture;
    this.run(M.fade, this.pressure.write);
    this.pressure.swap();

    M.pressure.uniforms.uDivergence.value = this.divergence.texture;
    for (let i = 0; i < this.iterations; i++) {
      M.pressure.uniforms.uPressure.value = this.pressure.read.texture;
      this.run(M.pressure, this.pressure.write);
      this.pressure.swap();
    }

    M.gradient.uniforms.uPressure.value = this.pressure.read.texture;
    M.gradient.uniforms.uVelocity.value = this.velocity.read.texture;
    this.run(M.gradient, this.velocity.write);
    this.velocity.swap();

    M.advect.uniforms.uVelocity.value = this.velocity.read.texture;
    M.advect.uniforms.dt.value = dt;
    M.advect.uniforms.dissipation.value = 3.2;
    this.run(M.advect, this.velocity.write);
    this.velocity.swap();
  }

  dispose() {
    [this.velocity, this.pressure].forEach((d) => {
      d.read.dispose();
      d.write.dispose();
    });
    this.divergence.dispose();
    this.curlRT.dispose();
    Object.values(this.mats).forEach((m) => m.dispose());
    this.quad.geometry.dispose();
  }
}
