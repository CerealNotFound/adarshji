import * as THREE from "three";

/**
 * Turns a flat SVG path into a puffy, pillow-like mesh ("inflated" glass).
 *
 * A flat extrusion has a planar front face, which reflects one colour and
 * looks like a cookie cutter. Here the shape is rasterised, a signed distance
 * field is computed, and a grid mesh is lifted by a rounded profile of that
 * distance, so the surface curves everywhere and catches highlights.
 */

const INF = 1e20;

// Felzenszwalb & Huttenlocher 1D squared distance transform.
function edt1d(f: Float64Array, d: Float64Array, v: Int32Array, z: Float64Array, n: number) {
  let k = 0;
  v[0] = 0;
  z[0] = -INF;
  z[1] = INF;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = INF;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
}

// Squared distance from each cell to the nearest cell where grid == 0.
function edt2d(grid: Float64Array, w: number, h: number) {
  const n = Math.max(w, h);
  const f = new Float64Array(n);
  const d = new Float64Array(n);
  const v = new Int32Array(n);
  const z = new Float64Array(n + 1);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = grid[y * w + x];
    edt1d(f, d, v, z, h);
    for (let y = 0; y < h; y++) grid[y * w + x] = d[y];
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = grid[y * w + x];
    edt1d(f, d, v, z, w);
    for (let x = 0; x < w; x++) grid[y * w + x] = d[x];
  }
  return grid;
}

export interface InflateOptions {
  /** Grid cells per path unit. Higher is smoother and heavier. */
  res?: number;
  /** Radius (path units) over which the edge rounds up. */
  edgeRadius?: number;
  /** Height of the rounded edge (path units). */
  thickness?: number;
  /** Extra dome on wide areas, as a fraction of thickness. */
  dome?: number;
  /** Grow the outline outward by this many path units (rounds and thickens). */
  grow?: number;
}

// Separable box blur, run a few times (≈ gaussian). Removes the stepped
// look that integer distance transforms leave in the normals.
function blur(src: Float32Array, w: number, h: number, passes: number) {
  const tmp = new Float32Array(src.length);
  for (let p = 0; p < passes; p++) {
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const l = src[y * w + Math.max(0, x - 1)];
        const r = src[y * w + Math.min(w - 1, x + 1)];
        tmp[y * w + x] = (l + src[y * w + x] + r) / 3;
      }
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const t = tmp[Math.max(0, y - 1) * w + x];
        const b = tmp[Math.min(h - 1, y + 1) * w + x];
        src[y * w + x] = (t + tmp[y * w + x] + b) / 3;
      }
  }
}

export function inflatePath(
  pathD: string,
  vbW: number,
  vbH: number,
  opts: InflateOptions = {}
) {
  const res = opts.res ?? 1.5;
  const pad = Math.ceil(4 + (opts.grow ?? 0) * res);
  const W = Math.round(vbW * res) + pad * 2;
  const H = Math.round(vbH * res) + pad * 2;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.translate(pad, pad);
  ctx.scale(res, res);
  ctx.fillStyle = "#fff";
  ctx.fill(new Path2D(pathD));
  return inflateCanvas(canvas, res, opts);
}

/**
 * Inflates whatever is drawn on a canvas (alpha > 0.5 counts as inside).
 * `res` is canvas pixels per output unit. Adds UVs that map back onto the
 * canvas, so the canvas can also be used as the surface texture.
 */
export function inflateCanvas(
  canvas: HTMLCanvasElement,
  res: number,
  { edgeRadius = 9, thickness = 8, dome = 0.6, grow = 0 }: InflateOptions = {}
) {
  const W = canvas.width;
  const H = canvas.height;
  const vbW = W / res;
  const vbH = H / res;
  const alpha = canvas.getContext("2d")!.getImageData(0, 0, W, H).data;
  const N = W * H;
  const inside = new Uint8Array(N);
  for (let i = 0; i < N; i++) inside[i] = alpha[i * 4 + 3] > 127 ? 1 : 0;

  // Signed distance in cells: positive inside, negative outside.
  const toOutside = new Float64Array(N);
  const toInside = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    toOutside[i] = inside[i] ? INF : 0;
    toInside[i] = inside[i] ? 0 : INF;
  }
  edt2d(toOutside, W, H);
  edt2d(toInside, W, H);
  const sdf = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    sdf[i] =
      (inside[i] ? Math.sqrt(toOutside[i]) - 0.5 : -(Math.sqrt(toInside[i]) - 0.5)) +
      grow * res;
  }
  blur(sdf, W, H, 3);
  let maxD = 0;
  for (let i = 0; i < N; i++) if (sdf[i] > maxD) maxD = sdf[i];
  const maxDUnits = maxD / res;

  // Vertices: grid points near or inside the shape.
  const index = new Int32Array(N).fill(-1);
  const pos: number[] = [];
  const uvs: number[] = [];
  const heights: number[] = [];
  const at = (x: number, y: number) => sdf[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))];

  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      const s = sdf[i];
      if (s < -1.5) continue;
      let px = x + 0.5;
      let py = y + 0.5;
      // Snap outside points onto the outline so the edge is smooth, not stepped.
      if (s < 0) {
        let gx = (at(x + 1, y) - at(x - 1, y)) * 0.5;
        let gy = (at(x, y + 1) - at(x, y - 1)) * 0.5;
        const gl = Math.hypot(gx, gy) || 1;
        gx /= gl;
        gy /= gl;
        px -= gx * s;
        py -= gy * s;
      }
      const d = Math.max(0, s) / res; // path units
      const e = Math.min(d / edgeRadius, 1);
      const h =
        thickness * Math.sqrt(1 - (1 - e) * (1 - e)) +
        thickness * dome * Math.pow(d / maxDUnits, 0.7);
      index[i] = pos.length / 3;
      pos.push(px / res - vbW / 2, -(py / res - vbH / 2), 0);
      uvs.push(px / W, 1 - py / H);
      heights.push(h);
    }
  }

  // Triangles: cells whose four corners exist and that touch the inside.
  const tris: number[] = [];
  for (let y = 1; y < H - 2; y++) {
    for (let x = 1; x < W - 2; x++) {
      const a = index[y * W + x];
      const b = index[y * W + x + 1];
      const c = index[(y + 1) * W + x];
      const d = index[(y + 1) * W + x + 1];
      if (a < 0 || b < 0 || c < 0 || d < 0) continue;
      if (
        sdf[y * W + x] <= 0 &&
        sdf[y * W + x + 1] <= 0 &&
        sdf[(y + 1) * W + x] <= 0 &&
        sdf[(y + 1) * W + x + 1] <= 0
      )
        continue;
      // y is flipped, so this winding faces +z.
      tris.push(a, c, b, b, c, d);
    }
  }

  // Front (+z) and back (-z) shells sharing the outline at z = 0.
  const count = pos.length / 3;
  const positions = new Float32Array(count * 6);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = pos[i * 3];
    positions[i * 3 + 1] = pos[i * 3 + 1];
    positions[i * 3 + 2] = heights[i];
    const j = (i + count) * 3;
    positions[j] = pos[i * 3];
    positions[j + 1] = pos[i * 3 + 1];
    positions[j + 2] = -heights[i];
  }
  const uv = new Float32Array(count * 4);
  uv.set(uvs, 0);
  uv.set(uvs, count * 2);
  const indices = new Uint32Array(tris.length * 2);
  for (let t = 0; t < tris.length; t += 3) {
    indices[t] = tris[t];
    indices[t + 1] = tris[t + 1];
    indices[t + 2] = tris[t + 2];
    // Back: reversed winding
    indices[tris.length + t] = tris[t] + count;
    indices[tris.length + t + 1] = tris[t + 2] + count;
    indices[tris.length + t + 2] = tris[t + 1] + count;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geo.setIndex(new THREE.BufferAttribute(indices, 1));
  geo.computeVertexNormals();
  return geo;
}
