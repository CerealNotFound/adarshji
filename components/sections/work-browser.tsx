"use client";

import Link from "next/link";
import { useState } from "react";

import { ProjectInterface } from "@/config/projects";
import { cn } from "@/lib/utils";

import { WorkGrid, years } from "./work-grid";

const FILTERS = ["All", "Professional", "Personal"] as const;

/** Filter toggles + the staggered grid + a dense index of everything. */
export function WorkBrowser({ projects }: { projects: ProjectInterface[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const shown = filter === "All" ? projects : projects.filter((p) => p.type === filter);

  return (
    <>
      <div className="mb-14 flex flex-wrap gap-2 px-[var(--hud-m)] md:mb-20 md:pl-[calc(var(--hud-m)+8px)]" role="tablist">
        {FILTERS.map((f) => {
          const n = f === "All" ? projects.length : projects.filter((p) => p.type === f).length;
          return (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "border px-3 py-2 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors",
                filter === f ? "border-ember bg-ember text-ash" : "border-ink/20 text-ink/70 hover:border-ink/60"
              )}
            >
              {f} <span className="opacity-60">({n})</span>
            </button>
          );
        })}
      </div>

      <WorkGrid key={filter} projects={shown} />

      <div className="mt-[18vh] px-[var(--hud-m)]">
        <h2 className="mb-6 font-mono text-[12px] uppercase tracking-[0.08em] text-ink/60 md:pl-2">(Index)</h2>
        <ul>
          {shown.map((p, i) => (
            <li key={p.id} className="border-t border-ink/10 last:border-b">
              <Link
                href={`/projects/${p.id}`}
                className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-4 font-mono text-[12px] uppercase tracking-[0.06em] md:grid-cols-[4rem_1.2fr_1fr_1.4fr_6rem] md:pl-2"
              >
                <span className="text-ink/35">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[15px] normal-case tracking-normal text-ink transition-colors group-hover:text-ember md:text-[17px]">
                  {p.companyName}
                </span>
                <span className="hidden text-ink/50 md:block">{p.category.join(" · ")}</span>
                <span className="hidden truncate text-ink/40 md:block">{p.techStack.slice(0, 4).join(", ")}</span>
                <span className="text-right text-ink/50">{years(p)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
