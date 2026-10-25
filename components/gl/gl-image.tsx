"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { type GLImageEntry, glImages } from "./gl-images";

/**
 * An image the WebGL layer draws (curl on scroll, inverted-to-normal reveal,
 * halftone hover, cursor lens). The <img> stays in the DOM for SEO, alt text
 * and the no-WebGL fallback; it's hidden once WebGL is on.
 */
export function GLImage({
  src,
  alt,
  className,
  priority,
  fit = "cover",
  matte,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  /** "contain" shows the whole image on a matte instead of cropping it. */
  fit?: "cover" | "contain";
  matte?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useRef<GLImageEntry | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    entry.current = glImages.register(ref.current, src, fit, matte);
    return () => {
      if (entry.current) glImages.unregister(entry.current.id);
    };
  }, [src, fit, matte]);

  const local = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height };
  };

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", fit === "contain" && "gl-matte", className)}
      style={fit === "contain" ? ({ "--matte": matte ?? "#0b0908" } as React.CSSProperties) : undefined}
      onPointerEnter={(e) => {
        if (!entry.current) return;
        entry.current.hover = 1;
        entry.current.hoverPoint = local(e);
      }}
      onPointerLeave={() => {
        if (entry.current) entry.current.hover = 0;
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className={cn("gl-img absolute inset-0 h-full w-full", fit === "contain" ? "object-contain" : "object-cover")}
      />
    </div>
  );
}
