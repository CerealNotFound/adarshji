"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Stage = dynamic(() => import("./stage"), { ssr: false });

function hasWebGL2() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

/**
 * Loads the WebGL layer on the client only. Without WebGL2, the page keeps a
 * static ember backdrop and the hero shows a flat SVG phoenix instead
 * (see `.gl-fallback` in globals.css).
 */
export function StageLoader() {
  const [gl, setGl] = useState<"on" | "off" | null>(null);

  useEffect(() => {
    const ok = hasWebGL2() ? "on" : "off";
    document.documentElement.dataset.gl = ok;
    setGl(ok);
  }, []);

  return (
    <>
      <div aria-hidden className="ember-backdrop" />
      {gl === "on" && <Stage />}
    </>
  );
}
