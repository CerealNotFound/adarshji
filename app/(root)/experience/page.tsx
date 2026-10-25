import { Metadata } from "next";
import Link from "next/link";

import { RevealLines } from "@/components/motion/reveal";
import { ExperienceList } from "@/components/sections/experience-list";
import { experiences } from "@/config/experience";
import { pagesConfig } from "@/config/pages";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${pagesConfig.experience.metadata.title} | Professional Experience Timeline`,
  description: `${pagesConfig.experience.metadata.description} Explore my professional journey and career milestones in software development.`,
  alternates: { canonical: `${siteConfig.url}/experience` },
};

export default function ExperiencePage() {
  const first = Math.min(...experiences.map((e) => e.startDate.getFullYear()));
  return (
    <div className="pb-[14vh]">
      <header className="px-[var(--hud-m)] pb-14 pt-36 md:pb-20 md:pt-[22vh]">
        <span className="mb-4 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink/60 md:pl-2">
          (Experience) · shipping since {first}
        </span>
        <RevealLines
          as="h1"
          className="font-display text-[clamp(56px,12.5vw,220px)] uppercase leading-[0.82] md:pl-2"
          lines={["Experience"]}
          delay={0.1}
        />
      </header>
      <ExperienceList items={experiences} />
      <div className="mt-16 px-[var(--hud-m)] md:pl-[calc(var(--hud-m)+8px)]">
        <Link href="/contributions" className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink/70 hover:text-ember">
          [Plus open source: Zulip ↗]
        </Link>
      </div>
    </div>
  );
}
