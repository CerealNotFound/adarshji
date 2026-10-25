// Registry of DOM boxes whose image the WebGL layer draws.
// DOM keeps layout, links and alt text; WebGL draws the pixels.

export interface GLImageEntry {
  id: number;
  el: HTMLElement;
  src: string;
  fit: "cover" | "contain";
  matte?: string;
  /** Hover target (0 or 1) and the local point it started from (0..1, y up). */
  hover: number;
  hoverPoint: { x: number; y: number };
}

let nextId = 1;
const items = new Map<number, GLImageEntry>();
const listeners = new Set<() => void>();
let snapshot: GLImageEntry[] = [];

function emit() {
  snapshot = Array.from(items.values());
  listeners.forEach((l) => l());
}

export const glImages = {
  register(el: HTMLElement, src: string, fit: "cover" | "contain" = "cover", matte?: string) {
    const entry: GLImageEntry = { id: nextId++, el, src, fit, matte, hover: 0, hoverPoint: { x: 0.5, y: 0.5 } };
    items.set(entry.id, entry);
    emit();
    return entry;
  },
  unregister(id: number) {
    items.delete(id);
    emit();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  getSnapshot: () => snapshot,
};
