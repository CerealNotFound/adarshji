import Link from "next/link";

import { skills } from "@/config/skills";

// What I reach for most, from the newest work.
const NOW = ["TypeScript", "Fastify", "PostgreSQL", "React 19", "Next.js", "Rust", "Claude Code", "AWS Bedrock", "Remotion", "three.js"];

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee overflow-hidden whitespace-nowrap py-2">
      <div className={reverse ? "marquee-track marquee-reverse" : "marquee-track"}>
        {loop.map((t, i) => (
          <span key={i} className="mx-6 inline-flex items-center gap-12 font-display text-[clamp(40px,6vw,96px)] uppercase leading-none text-ink/90 md:mx-10">
            {t}
            <span aria-hidden className="text-ember">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Two rows of tech running in opposite directions; they pause on hover. */
export function StackMarquee() {
  const all = skills.map((s) => s.name);
  return (
    <div>
      <Row items={NOW} />
      <Row items={all} reverse />
      <div className="mt-8 px-[var(--hud-m)] text-right md:pr-[calc(var(--hud-m)+8px)]">
        <Link href="/skills" className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink/70 hover:text-ember">
          [All {all.length} skills, rated honestly ↗]
        </Link>
      </div>
    </div>
  );
}
