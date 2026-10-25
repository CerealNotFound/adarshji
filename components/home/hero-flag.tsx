"use client";

import { useEffect } from "react";

import { motionStore } from "@/lib/motion-store";

/** Tells the WebGL layer the home hero is on this page. */
export function HeroFlag() {
  useEffect(() => {
    motionStore.hero = true;
    return () => {
      motionStore.hero = false;
    };
  }, []);
  return null;
}
