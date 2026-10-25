"use client";

import { useEffect, useState } from "react";

export function LiveClock() {
  const [t, setT] = useState("--:--");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    const tick = () => setT(f.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return <>{t}</>;
}
