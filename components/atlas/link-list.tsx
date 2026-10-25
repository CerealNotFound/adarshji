"use client";

import Link from "next/link";

import { Icons } from "@/components/common/icons";

import { highlightStar } from "./star-map";

export interface AtlasLink {
  name: string;
  handle: string;
  href: string;
  icon: keyof typeof Icons;
  primary?: boolean;
}

/** The real navigation. Touching a row makes its star pulse in the sky. */
export function LinkList({ links }: { links: AtlasLink[] }) {
  return (
    <ul>
      {links.map((l, i) => {
        const external = l.href.startsWith("http");
        const Icon = Icons[l.icon] as React.ComponentType<{ className?: string }>;
        return (
          <li key={l.name} className="atlas-in" style={{ animationDelay: `${520 + i * 45}ms` }}>
            <Link
              href={l.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              onPointerEnter={() => highlightStar(i)}
              onTouchStart={() => highlightStar(i)}
              onFocus={() => highlightStar(i)}
              className={
                l.primary
                  ? "atlas-row atlas-row--primary group relative mb-2 flex h-[72px] items-center gap-4 bg-ember px-4 text-ash"
                  : "atlas-row group relative flex h-16 items-center gap-4 border-t border-ink/10 px-1"
              }
            >
              <Icon className={l.primary ? "relative h-5 w-5" : "relative h-5 w-5 text-ink/80"} />
              <span className="relative flex-1">
                <span className={l.primary ? "block font-display text-[22px] uppercase leading-none" : "block text-[18px] font-medium leading-tight"}>
                  {l.name}
                </span>
                <span className={l.primary ? "mt-1 block font-mono text-[10px] uppercase tracking-[0.08em] text-ash/70" : "block font-mono text-[10px] uppercase tracking-[0.08em] text-ink/45"}>
                  {l.handle}
                </span>
              </span>
              <span aria-hidden className="relative text-[18px]">
                {external ? "↗" : "→"}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
