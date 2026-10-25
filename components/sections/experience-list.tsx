import Link from "next/link";

import { FadeIn } from "@/components/motion/reveal";
import { ExperienceInterface } from "@/config/experience";

const fmt = (d: Date | "Present") =>
  d === "Present" ? "Now" : d.toLocaleDateString("en-US", { month: "short", year: "numeric" });

/** A ledger of roles. The company name slides and glows on hover. */
export function ExperienceList({ items }: { items: ExperienceInterface[] }) {
  return (
    <ul className="px-[var(--hud-m)]">
      {items.map((x, i) => (
        <FadeIn key={x.id} delay={i * 0.05}>
          <li className="border-t border-ink/10 last:border-b">
            <Link
              href={`/experience/${x.id}`}
              className="group grid grid-cols-1 gap-2 py-7 md:grid-cols-3 md:gap-0 md:py-10"
            >
              <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink/55 md:pl-2">
                {fmt(x.startDate)} — {fmt(x.endDate)}
                <span className="mt-1 block text-ink/35">{x.location}</span>
              </span>
              <span className="font-display text-[clamp(30px,3.3vw,58px)] uppercase leading-[0.92] md:pr-8 [overflow-wrap:anywhere] transition-[transform,color] duration-500 ease-out group-hover:translate-x-3 group-hover:text-ember md:pl-2">
                {x.company}
              </span>
              <span className="md:pl-2">
                <span className="block text-[18px] font-medium">{x.position}</span>
                <span className="mt-2 block max-w-[38ch] text-[15px] leading-snug text-ink/55">{x.description[0]}</span>
                <span className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.08em] text-ink/45 transition-colors group-hover:text-ink">
                  [Read more ↗]
                </span>
              </span>
            </Link>
          </li>
        </FadeIn>
      ))}
    </ul>
  );
}
