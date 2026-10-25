// Shared, mutable motion state read inside animation loops.
// Plain object on purpose: writing to React state every frame would re-render the tree.
const isBrowser = typeof window !== "undefined";

export const motionStore = {
  scroll: 0,
  velocity: 0,
  pointer: { x: 0, y: 0, nx: 0.5, ny: 0.5, moved: false },
  /** True while the home hero is mounted: shows the silk, phoenix and sparks. */
  hero: false,
  reducedMotion:
    isBrowser && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  /** Touch screens: no cursor effects. */
  touch: isBrowser && window.matchMedia("(pointer: coarse)").matches,
  lowPower:
    isBrowser &&
    (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768),
};
