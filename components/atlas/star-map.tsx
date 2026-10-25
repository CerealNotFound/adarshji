"use client";

import { useEffect, useRef } from "react";

export interface MapLink {
  name: string;
  href: string;
}

/**
 * A night sky where the phoenix is a constellation. Stars are sampled from
 * the phoenix outline, joined by a minimum spanning tree (which is what makes
 * it read as a constellation), and the brightest few are labelled with links.
 *
 * Plain 2D canvas: a few hundred dots, so it stays smooth on phones. Pauses
 * when hidden; draws one still frame when motion is reduced.
 */

type P = { x: number; y: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number };

const EMBER = "255,90,31";
const GOLD = "255,184,108";

/**
 * Traces the phoenix outline (outer edge, the gaps between wing and body,
 * the eye) into ordered contours, then places stars at even steps along
 * them. Joining consecutive stars draws the bird's silhouette.
 */
async function phoenixShape(): Promise<{ pts: P[]; edges: [number, number][] }> {
  const S = 240;
  const img = new Image();
  img.src = "/brand/phoenix.svg";
  await img.decode();
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, S, S);
  const a = ctx.getImageData(0, 0, S, S).data;
  const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < S && y < S && a[(y * S + x) * 4 + 3] > 128;

  // Boundary pixels
  const isEdge = new Uint8Array(S * S);
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++)
      if (inside(x, y) && (!inside(x + 1, y) || !inside(x - 1, y) || !inside(x, y + 1) || !inside(x, y - 1)))
        isEdge[y * S + x] = 1;

  // Chain boundary pixels into contours by walking to an unvisited neighbour.
  const seen = new Uint8Array(S * S);
  const contours: P[][] = [];
  const N8 = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  for (let i = 0; i < S * S; i++) {
    if (!isEdge[i] || seen[i]) continue;
    const line: P[] = [];
    let x = i % S;
    let y = (i / S) | 0;
    for (;;) {
      seen[y * S + x] = 1;
      line.push({ x, y });
      let moved = false;
      for (const [dx, dy] of N8) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < S && ny < S && isEdge[ny * S + nx] && !seen[ny * S + nx]) {
          x = nx;
          y = ny;
          moved = true;
          break;
        }
      }
      if (!moved) break;
    }
    if (line.length > 24) contours.push(line);
  }

  // Even steps along each contour
  const pts: P[] = [];
  const edges: [number, number][] = [];
  const stepPx = S * 0.05;
  for (const line of contours) {
    const startIdx = pts.length;
    let acc = stepPx;
    for (let i = 1; i < line.length; i++) {
      acc += Math.hypot(line[i].x - line[i - 1].x, line[i].y - line[i - 1].y);
      if (acc >= stepPx) {
        pts.push({ x: line[i].x / S - 0.5, y: line[i].y / S - 0.5 });
        acc = 0;
      }
    }
    if (pts.length - startIdx < 3) {
      pts.length = startIdx;
      continue;
    }
    for (let k = startIdx; k < pts.length - 1; k++) edges.push([k, k + 1]);
    const first = line[0];
    const last = line[line.length - 1];
    if (Math.hypot(first.x - last.x, first.y - last.y) < stepPx * 1.5) edges.push([pts.length - 1, startIdx]);
  }
  return { pts, edges };
}

// Farthest-point sampling: k well-spread stars to carry the link labels.
function spread(pts: P[], k: number) {
  const chosen: number[] = [0];
  pts.forEach((p, i) => p.y < pts[chosen[0]].y && (chosen[0] = i));
  while (chosen.length < Math.min(k, pts.length)) {
    let bi = 0;
    let bd = -1;
    pts.forEach((p, i) => {
      const d = Math.min(...chosen.map((c) => (p.x - pts[c].x) ** 2 + (p.y - pts[c].y) ** 2));
      if (d > bd) {
        bd = d;
        bi = i;
      }
    });
    chosen.push(bi);
  }
  return chosen;
}

export function StarMap({ links }: { links: MapLink[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const box = wrap.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    const resize = () => {
      W = box.clientWidth;
      H = box.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(box);

    const bg = Array.from({ length: 150 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.1 + 0.2,
      ph: Math.random() * 6.28,
      depth: Math.random(),
    }));
    const sparks: Spark[] = [];
    const sprite = (rgb: string) => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g = c.getContext("2d")!;
      const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, `rgba(${rgb},1)`);
      gr.addColorStop(1, `rgba(${EMBER},0)`);
      g.fillStyle = gr;
      g.fillRect(0, 0, 64, 64);
      return c;
    };
    const glowEmber = sprite(EMBER);
    const glowGold = sprite(GOLD);
    const ghost = new Image();
    ghost.src = "/brand/phoenix.svg";
    let pts: P[] = [];
    let edges: [number, number][] = [];
    let rank: number[] = []; // appearance order per star
    let labels: number[] = [];
    let highlight = -1;
    let hlT = 0;
    const drag = { x: 0, y: 0, tx: 0, ty: 0, last: null as P | null };
    const t0 = performance.now();
    let raf = 0;
    let alive = true;

    const layout = () => {
      const size = Math.min(W * 0.74, H * 0.84);
      return { cx: W / 2, cy: H * 0.5, size };
    };
    const toScreen = (p: P, L: ReturnType<typeof layout>, par: number) => ({
      x: L.cx + p.x * L.size + drag.x * par,
      y: L.cy + p.y * L.size + drag.y * par,
    });

    phoenixShape().then((shape) => {
      if (!alive) return;
      pts = shape.pts;
      edges = shape.edges;
      // Stars appear in outline order, so the bird draws itself.
      rank = pts.map((_, i) => i);
      labels = spread(pts, links.length);
      if (reduce) draw(performance.now() + 1e5);
    });

    const onHl = (e: Event) => {
      highlight = (e as CustomEvent<number>).detail;
      hlT = performance.now();
    };
    window.addEventListener("atlas:hl", onHl);

    // Touch: drift the sky, shed sparks; tap a labelled star to open it.
    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    let downAt: P | null = null;
    const burst = (p: P, n: number) => {
      for (let i = 0; i < n && sparks.length < 180; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = Math.random() * 1.6 + 0.4;
        sparks.push({ x: p.x, y: p.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.8, life: 1 });
      }
    };
    const onDown = (e: PointerEvent) => {
      downAt = local(e);
      drag.last = downAt;
      burst(downAt, 14);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.last) return;
      const p = local(e);
      drag.tx = Math.max(-40, Math.min(40, drag.tx + (p.x - drag.last.x) * 0.35));
      drag.ty = Math.max(-30, Math.min(30, drag.ty + (p.y - drag.last.y) * 0.35));
      drag.last = p;
      burst(p, 3);
    };
    const onUp = (e: PointerEvent) => {
      const p = local(e);
      drag.last = null;
      if (downAt && Math.hypot(p.x - downAt.x, p.y - downAt.y) < 10 && pts.length) {
        const L = layout();
        let hit = -1;
        let hd = 26 * 26;
        labels.forEach((si, li) => {
          const s = toScreen(pts[si], L, 1);
          const d = (s.x - p.x) ** 2 + (s.y - p.y) ** 2;
          if (d < hd) {
            hd = d;
            hit = li;
          }
        });
        if (hit >= 0) {
          const href = links[hit].href;
          if (href.startsWith("http")) window.open(href, "_blank", "noopener,noreferrer");
          else window.location.href = href;
        }
      }
      downAt = null;
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const L = layout();

      // Idle sway + touch drift, eased
      const sway = reduce ? 0 : 1;
      drag.tx *= 0.96;
      drag.ty *= 0.96;
      drag.x += (drag.tx + Math.sin(t * 0.4) * 6 * sway - drag.x) * 0.08;
      drag.y += (drag.ty + Math.cos(t * 0.33) * 4 * sway - drag.y) * 0.08;

      // Background stars (parallax by depth)
      for (const s of bg) {
        const tw = 0.45 + 0.55 * Math.sin(t * (0.8 + s.depth) + s.ph) * sway;
        ctx.globalAlpha = Math.min(1, t * 1.5) * (0.25 + 0.5 * Math.abs(tw));
        ctx.fillStyle = "#f3ede6";
        ctx.beginPath();
        ctx.arc(s.x * W + drag.x * s.depth * 0.5, s.y * H + drag.y * s.depth * 0.5, s.r, 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!pts.length) return;

      const step = 1.6 / Math.max(1, pts.length); // whole bird in ~1.6s
      const start = 0.35;
      const seen = (i: number) => Math.max(0, Math.min(1, (t - start - rank[i] * step) / 0.3));

      // A faint ghost of the bird once the lines are in, to help it read.
      if (ghost.complete && ghost.naturalWidth) {
        const gk = Math.max(0, Math.min(1, (t - 2.0) / 1.2));
        if (gk > 0) {
          ctx.globalAlpha = 0.1 * gk;
          ctx.drawImage(ghost, L.cx - L.size / 2 + drag.x, L.cy - L.size / 2 + drag.y, L.size, L.size);
          ctx.globalAlpha = 1;
        }
      }

      // Constellation lines, drawn in outline order
      ctx.lineWidth = 1;
      for (const [a, b] of edges) {
        const k = Math.max(0, Math.min(1, (t - start - rank[b] * step) / 0.35));
        if (k <= 0) continue;
        const pa = toScreen(pts[a], L, 1);
        const pb = toScreen(pts[b], L, 1);
        ctx.strokeStyle = `rgba(${EMBER},${0.55 * k})`;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pa.x + (pb.x - pa.x) * k, pa.y + (pb.y - pa.y) * k);
        ctx.stroke();
      }

      // Stars
      const labelSet = new Map(labels.map((si, li) => [si, li]));
      pts.forEach((p, i) => {
        const k = seen(i);
        if (k <= 0) return;
        const s = toScreen(p, L, 1);
        const li = labelSet.get(i);
        const major = li !== undefined;
        const tw = 0.75 + 0.25 * Math.sin(t * 2.2 + i) * sway;
        const r = (major ? 2.6 : 1.4) * k * tw;
        // Pre-rendered glow sprite: cheaper than a gradient per star per frame
        const R = r * 5;
        ctx.globalAlpha = 0.55 * k;
        ctx.drawImage(major ? glowGold : glowEmber, s.x - R, s.y - R, R * 2, R * 2);
        ctx.globalAlpha = 1;
        ctx.fillStyle = `rgba(255,244,230,${k})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, 6.283);
        ctx.fill();

        if (major) {
          const lk = Math.max(0, Math.min(1, (t - 1.9 - li * 0.08) / 0.5));
          const hot = li === highlight ? Math.max(0, 1 - (now - hlT) / 1400) : 0;
          if (hot > 0 || li === highlight) {
            const pr = 8 + ((now - hlT) / 1000) * 26;
            ctx.strokeStyle = `rgba(${GOLD},${Math.max(0.25, hot)})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(s.x, s.y, li === highlight && hot <= 0 ? 9 : pr % 34, 0, 6.283);
            ctx.stroke();
          }
          if (lk > 0) {
            ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
            ctx.fillStyle = `rgba(243,237,230,${0.8 * lk})`;
            const text = links[li].name.toUpperCase();
            const w = ctx.measureText(text).width;
            // Outward from the bird, flipped if it would leave the screen
            let right = s.x > L.cx;
            if (right && s.x + 9 + w > W - 6) right = false;
            if (!right && s.x - 9 - w < 6) right = true;
            ctx.textAlign = right ? "left" : "right";
            ctx.fillText(text, s.x + (right ? 9 : -9), s.y + 3);
          }
        }
      });

      // Sparks (additive)
      ctx.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy = p.vy * 0.96 - 0.03; // heat rises
        p.life -= 0.022;
        if (p.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(${p.life > 0.5 ? GOLD : EMBER},${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6 * p.life + 0.4, 0, 6.283);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      draw(now);
    };
    if (!reduce) raf = requestAnimationFrame(loop);
    else draw(t0 + 1e5);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("atlas:hl", onHl);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [links]);

  return (
    <div ref={wrap} className="absolute inset-0">
      <canvas ref={canvasRef} aria-hidden className="block touch-pan-y" />
    </div>
  );
}

/** Rows call this so their star pulses in the sky. */
export function highlightStar(i: number) {
  window.dispatchEvent(new CustomEvent("atlas:hl", { detail: i }));
}
