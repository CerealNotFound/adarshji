/**
 * Shaders for the render pipeline:
 * 1. backdrop: ember "silk" built from a gradient warped by sine folds, a swirl
 *    and a voronoi shatter (same stack of effects as the reference site's hero)
 * 2. bokeh: golden-angle lens blur that turns it into soft fabric
 * 3. post: fluid displacement with RGB split and glitch tears
 */

export const fullscreenVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const common = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  mat2 rot(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }
  vec2 random2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
  }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
`;

export const backdropFrag = common + /* glsl */ `
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;

  void main() {
    float ar = uRes.x / uRes.y;
    float t = uTime * 0.25;
    vec2 uv = vUv;

    // Sine folds: big diagonal waves, like cloth.
    vec2 w = uv * 2.0 - 1.0;
    float freq = 7.0;
    float amp = 0.2;
    w.x += sin((w.y + 0.15) * freq + t) * amp;
    w.y += sin((w.x - 0.1) * freq * 0.55 - t * 0.8) * amp * 0.45;
    uv = w * 0.5 + 0.5;

    // Swirl around a point that drifts toward the pointer.
    vec2 c = mix(vec2(0.5, 0.55), uMouse, 0.25);
    vec2 d = (uv - c) * vec2(ar, 1.0);
    float r = length(d);
    d = rot(0.9 * smoothstep(0.55, 0.0, r) * sin(t * 0.6 + 1.0)) * d;
    uv = c + d / vec2(ar, 1.0);

    // Voronoi shatter: shifts each cell a little, like cracked glass.
    vec2 st = (uv - 0.5) * vec2(ar, 1.0) * 4.0;
    vec2 ist = floor(st), fst = fract(st);
    float m1 = 15.0, m2 = 15.0;
    vec2 mp = vec2(0.0);
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 n = vec2(float(i), float(j));
        vec2 p = 0.5 + 0.5 * sin(5.0 + uTime * 0.05 + 6.2831 * random2(ist + n));
        float dist = length(n + p - fst);
        if (dist < m1) { m2 = m1; m1 = dist; mp = p; }
        else if (dist < m2) { m2 = dist; }
      }
    }
    float edge = smoothstep(0.0, 0.08, m2 - m1);
    uv += ((mp * 0.08) - 0.04) * edge;

    // Fold shading: a stripe ramp along the warped coordinate.
    float f = uv.x * 1.1 + uv.y * 0.45;
    float band = 0.5 + 0.5 * sin(f * 6.2831 * 1.6 + t * 0.4);
    vec3 deep = vec3(0.10, 0.012, 0.006);
    vec3 mid = vec3(0.42, 0.04, 0.012);
    vec3 hot = vec3(0.85, 0.22, 0.05);
    vec3 col = mix(deep, mid, smoothstep(0.15, 0.75, band));
    col = mix(col, hot, smoothstep(0.78, 1.0, band) * 0.85);
    // Slow large-scale light and shade
    col *= 0.45 + 0.75 * vnoise(uv * 1.6 + vec2(t * 0.15, -t * 0.1));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const bokehFrag = common + /* glsl */ `
  uniform sampler2D tInput;
  uniform vec2 uRes;
  uniform float uAmount;
  #ifndef ITER
  #define ITER 24.0
  #endif
  #define GOLDEN 2.39996323
  void main() {
    float ar = uRes.x / uRes.y;
    vec2 px = vec2(1.0 / ar, 1.0) * 0.04 * 0.075;
    // Tilt-shift: blur grows away from the centre band.
    float tilt = 0.55 + 0.9 * abs(vUv.y - 0.5);
    float radius = uAmount * tilt;
    float a0 = hash(vUv * uRes) * 6.2831;
    vec3 acc = vec3(0.0);
    vec3 wsum = vec3(0.0);
    float r = 1.0;
    for (float j = 0.0; j < GOLDEN * ITER; j += GOLDEN) {
      r += 1.0 / r;
      vec2 off = (r - 1.0) * vec2(cos(j + a0), sin(j + a0)) * px * radius;
      vec3 s = texture2D(tInput, vUv + off).rgb;
      vec3 wgt = vec3(5.0) + pow(s, vec3(9.0)) * 150.0;
      acc += s * wgt;
      wsum += wgt;
    }
    gl_FragColor = vec4(acc / wsum, 1.0);
  }
`;

// Background plane inside the 3D scene (so the glass refracts it).
export const backgroundVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

export const backgroundFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D tBackdrop;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uIntensity;
  uniform vec3 uBg;
  void main() {
    float ar = uRes.x / uRes.y;
    vec3 silk = texture2D(tBackdrop, vUv).rgb;
    // Elliptical vignette whose centre leans toward the pointer.
    vec2 c = mix(vec2(0.5), uMouse, 0.3);
    vec2 q = (vUv - c) * vec2(ar * 0.54, 0.46);
    float v = smoothstep(0.62, 0.12, length(q));
    vec3 col = mix(uBg, silk, v * uIntensity);
    gl_FragColor = vec4(pow(col, vec3(2.2)), 1.0); // authored in sRGB, scene is linear
  }
`;

export const postFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D tDiffuse;
  uniform sampler2D uVelocity;
  uniform vec2 uSimSize;
  uniform float uDisplacement;
  uniform float uChroma;
  uniform float uGlitch;
  uniform float uTime;
  uniform vec2 uResolution;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  vec3 spectrum(float x) { return cos((x - vec3(0.0, 0.5, 1.0)) * vec3(0.6, 1.0, 0.5) * 3.14); }

  void main() {
    vec2 uv = vUv;
    vec2 vel = texture2D(uVelocity, uv).xy;
    vec2 disp = vel / uSimSize * uDisplacement;
    float mag = length(disp);

    // Glitch tears: on fast strokes, horizontal bands jump sideways.
    float band = floor(uv.y * 48.0);
    float tear = step(0.82, hash(vec2(band, floor(uTime * 18.0)))) * smoothstep(0.18, 0.4, mag);
    uv.x += (hash(vec2(band, floor(uTime * 24.0))) - 0.5) * 0.035 * tear * uGlitch;

    // Smeared, RGB-split samples along the flow.
    vec3 col = vec3(0.0);
    vec3 wsum = vec3(0.0);
    for (int i = 0; i < 4; i++) {
      float t = float(i) / 3.0;
      vec3 w = max(vec3(0.0), cos((t - vec3(0.0, 0.5, 1.0)) * 3.14159 * 0.5));
      col += texture2D(tDiffuse, clamp(uv - disp * 0.3 * (t + 0.3) * (1.0 + mag * 6.0), 0.0, 1.0)).rgb * w;
      wsum += w;
    }
    col /= max(wsum, vec3(0.0001));
    // Thin rainbow fringes only where the lens is strongest
    float edge = smoothstep(0.06, 0.16, mag) * (1.0 - smoothstep(0.16, 0.4, mag));
    col += max(spectrum(fract(mag * 9.0)), 0.0) * edge * 0.22 * uChroma;

    // Film grain
    col += (hash(vUv * uResolution + fract(uTime) * 100.0) - 0.5) * 0.012;
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
