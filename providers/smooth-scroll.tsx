"use client";

import "lenis/dist/lenis.css";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { motionStore } from "@/lib/motion-store";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduce = motionStore.reducedMotion;

    const onPointer = (e: PointerEvent) => {
      const p = motionStore.pointer;
      p.x = e.clientX;
      p.y = e.clientY;
      p.nx = e.clientX / window.innerWidth;
      p.ny = e.clientY / window.innerHeight;
      p.moved = true;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    if (reduce) {
      const onScroll = () => (motionStore.scroll = window.scrollY);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointermove", onPointer);
      };
    }

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: { offset: -80 } });
    lenisRef.current = lenis;
    lenis.on("scroll", (l: Lenis) => {
      motionStore.scroll = l.scroll;
      motionStore.velocity = l.velocity;
    });

    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  // New page starts at the top.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <>{children}</>;
}
