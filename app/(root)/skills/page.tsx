import { Metadata } from "next";

import { FadeIn, RevealLines } from "@/components/motion/reveal";
import { StackMarquee } from "@/components/sections/stack-marquee";
import { pagesConfig } from "@/config/pages";
import { skills } from "@/config/skills";

export const metadata: Metadata = {
  title: pagesConfig.skills.metadata.title,
  description: pagesConfig.skills.metadata.description,
};

function Meter({ value }: { value: number }) {
  return (
    <span className="flex gap-1" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= value ? "h-2 w-5 bg-ember" : "h-2 w-5 bg-ink/10"} />
      ))}
    </span>
  );
}

export default function SkillsPage() {
  const sorted = [...skills].sort((a, b) => b.rating - a.rating);
  return (
    <div className="pb-[14vh]">
      <header className="px-[var(--hud-m)] pb-14 pt-36 md:pb-20 md:pt-[22vh]">
        <span className="mb-4 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink/60 md:pl-2">
          (Skills) · {skills.length} tools · rated honestly
        </span>
        <RevealLines
          as="h1"
          className="font-display text-[clamp(56px,13vw,230px)] uppercase leading-[0.82] md:pl-2"
          lines={["Skills"]}
          delay={0.1}
        />
      </header>

      <div className="mb-[12vh]">
        <StackMarquee />
      </div>

      <ul className="px-[var(--hud-m)]">
        {sorted.map((s, i) => (
          <FadeIn key={s.name} delay={(i % 6) * 0.03}>
            <li className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-t border-ink/10 py-5 last:border-b md:grid-cols-3 md:gap-0">
              <span className="flex items-center gap-4 md:pl-2">
                <s.icon className="h-6 w-6 text-ink/60 transition-colors group-hover:text-ember" />
                <span className="hidden text-[clamp(20px,1.8vw,26px)] font-medium md:inline">{s.name}</span>
              </span>
              <span className="md:pl-2">
                <span className="block text-[18px] font-medium md:hidden">{s.name}</span>
                <span className="block max-w-[44ch] text-[15px] leading-snug text-ink/55">{s.description}</span>
              </span>
              <span className="flex justify-end md:pl-2 md:pr-2">
                <Meter value={s.rating} />
              </span>
            </li>
          </FadeIn>
        ))}
      </ul>
    </div>
  );
}
