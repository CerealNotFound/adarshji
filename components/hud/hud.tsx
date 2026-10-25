"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { motionStore } from "@/lib/motion-store";

const NAV = [
  { title: "Work", href: "/projects" },
  { title: "Experience", href: "/experience" },
  { title: "Open source", href: "/contributions" },
  { title: "Work with me", href: "/work-with-me" },
  { title: "Contact", href: "/contact" },
];

function useIstClock() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/** Grid lines, crosshairs and the fixed frame around every page. */
export function Hud() {
  const time = useIstClock();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const coords = useRef<HTMLSpanElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  // Readouts update straight in the DOM; no React re-render per frame.
  useEffect(() => {
    let raf = 0;
    const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");
    let lastCoords = "";
    let lastPct = -1;
    let max = 1;
    const measure = () => (max = document.documentElement.scrollHeight - window.innerHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!motionStore.touch) {
        const p = motionStore.pointer;
        const c = `${pad(p.x)} X ${pad(p.y)} Y`;
        if (c !== lastCoords && coords.current) coords.current.textContent = lastCoords = c;
      }
      const pct = max > 0 ? Math.min(1, motionStore.scroll / max) : 0;
      const whole = Math.round(pct * 100);
      if (whole !== lastPct) {
        lastPct = whole;
        if (progress.current) progress.current.textContent = String(whole).padStart(3, "0");
        if (bar.current) bar.current.style.transform = `scaleX(${pct})`;
      }
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <>
      {/* Grid */}
      <div aria-hidden className="hud-grid pointer-events-none fixed inset-0 z-[1]">
        <div className="hud-cols">
          <span />
          <span />
          <span />
        </div>
        <div className="hud-row" style={{ top: "33.333%" }} />
        <div className="hud-row" style={{ top: "66.666%" }} />
        {[0, 1, 2, 3].map((c) =>
          [1, 2].map((r) => (
            <i
              key={`${c}-${r}`}
              className="hud-cross"
              style={{
                left: `calc(var(--hud-m) + (100% - 2 * var(--hud-m)) * ${c / 3})`,
                top: `${(r / 3) * 100}%`,
              }}
            />
          ))
        )}
      </div>

      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-ash via-ash/70 to-transparent px-[var(--hud-m)] pb-10 pt-6 md:pt-9">
        <div className="flex items-start justify-between">
          <Link
            href="/"
            className="font-display text-[13px] uppercase tracking-[0.02em] text-ink md:text-[15px]"
            aria-label="Adarsh Pandey, home"
          >
            Adarsh<span className="text-ember">.</span>Pandey
          </Link>
          <nav className="hidden items-center gap-8 md:flex lg:gap-12" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "hud-link font-mono text-[12px] uppercase tracking-[0.08em] text-ink/80 transition-colors hover:text-ink",
                  pathname.startsWith(item.href) && "text-ember"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
          <button
            className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? "[Close]" : "[Menu]"}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-center gap-6 bg-ash/95 px-[var(--hud-m)] backdrop-blur-sm transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        {NAV.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-display text-4xl uppercase text-ink"
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            {item.title}
          </Link>
        ))}
      </div>

      {/* Bottom readouts */}
      <footer
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 items-end bg-gradient-to-t from-ash/90 to-transparent px-[var(--hud-m)] pb-5 pt-10 md:bg-none md:pt-0 font-mono text-[11px] uppercase tracking-[0.08em] text-ink/70 md:pb-8 md:text-[12px]"
      >
        <span>IST {time} · IN</span>
        <span ref={coords} className="hidden text-center md:block">
          0000 X 0000 Y
        </span>
        <span className="col-start-3 flex items-center justify-end gap-3">
          <span className="relative hidden h-px w-16 bg-ink/20 md:block">
            <span ref={bar} className="absolute inset-0 origin-left bg-ember" style={{ transform: "scaleX(0)" }} />
          </span>
          <span ref={progress}>000</span>%
        </span>
      </footer>
    </>
  );
}
