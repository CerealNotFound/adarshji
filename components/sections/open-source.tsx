import Link from "next/link";

import { FadeIn, RevealLines } from "@/components/motion/reveal";
import { type Contribution, openSource, openSourceStats, prUrl } from "@/config/open-source";
import { cn } from "@/lib/utils";

const STATUS: Record<Contribution["status"], { label: string; className: string }> = {
  merged: { label: "Merged", className: "bg-acid text-ash" },
  "co-authored": { label: "Co-authored", className: "bg-ember text-ash" },
  continued: { label: "Continued · merged", className: "bg-flame text-ash" },
  open: { label: "Open", className: "border border-ink/30 text-ink/70" },
  closed: { label: "Closed", className: "border border-ink/15 text-ink/40" },
};

function Row({ c }: { c: Contribution }) {
  const s = STATUS[c.status];
  return (
    <li className="group border-t border-ink/10">
      <a href={prUrl(c.pr)} target="_blank" rel="noreferrer" className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 py-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/45">
          {c.area} · #{c.pr}
        </span>
        <span className={cn("row-span-2 self-center whitespace-nowrap px-1.5 py-[3px] font-mono text-[10px] uppercase leading-none tracking-[0.06em]", s.className)}>
          {s.label}
        </span>
        <span className={cn("text-[17px] leading-snug transition-colors group-hover:text-ember", c.status === "closed" && "text-ink/45")}>
          {c.title}
          <span className="ml-1 opacity-0 transition-opacity group-hover:opacity-100">↗</span>
        </span>
        {c.followUp && (
          <span className="col-span-2 font-mono text-[11px] uppercase tracking-[0.06em] text-ink/45">
            → carried forward in #{c.followUp.pr} by {c.followUp.author}
            {c.followUp.merged ? " · merged" : " · in review"}
          </span>
        )}
      </a>
    </li>
  );
}

export function OpenSourceLedger({ limit }: { limit?: number }) {
  const list = limit ? openSource.contributions.slice(0, limit) : openSource.contributions;
  const stats = [
    { n: openSourceStats.merged, label: "Merged" },
    { n: openSourceStats.carried, label: "Carried forward" },
    { n: openSourceStats.open, label: "Open" },
  ];
  return (
    <div className="grid grid-cols-1 gap-12 px-[var(--hud-m)] md:grid-cols-3 md:gap-0">
      <div className="md:pl-2 md:pr-10">
        <div className="md:sticky md:top-32">
          <ul className="space-y-6">
            {stats.map((s) => (
              <li key={s.label} className="flex items-baseline gap-4">
                <span className="font-display text-[clamp(64px,8vw,128px)] leading-[0.8] text-ink">
                  {String(s.n).padStart(2, "0")}
                </span>
                <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink/55">{s.label}</span>
              </li>
            ))}
          </ul>
          <FadeIn className="mt-10 max-w-[34ch] text-[15px] leading-relaxed text-ink/60">{openSource.summary}</FadeIn>
          <Link
            href={openSource.repoUrl}
            target="_blank"
            className="mt-6 inline-block font-mono text-[12px] uppercase tracking-[0.08em] text-ink/70 hover:text-ember"
          >
            [{openSource.repo} ↗]
          </Link>
        </div>
      </div>
      <div className="md:col-span-2 md:pl-2">
        <RevealLines
          className="mb-8 max-w-[40rem] text-[clamp(22px,2.4vw,34px)] font-medium leading-[1.15]"
          lines={["Zulip is open-source team chat.", "I worked on its web app, emails and API docs."]}
        />
        <ul className="border-b border-ink/10">
          {list.map((c) => (
            <Row key={c.pr} c={c} />
          ))}
        </ul>
      </div>
    </div>
  );
}
