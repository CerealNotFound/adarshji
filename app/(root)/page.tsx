import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

import { Hero } from "@/components/home/hero";
import { Manifesto } from "@/components/home/manifesto";
import { ExperienceList } from "@/components/sections/experience-list";
import { Finale } from "@/components/sections/finale";
import { OpenSourceLedger } from "@/components/sections/open-source";
import { SectionHead } from "@/components/sections/section-head";
import { StackMarquee } from "@/components/sections/stack-marquee";
import { WorkGrid } from "@/components/sections/work-grid";
import { experiences } from "@/config/experience";
import { pagesConfig } from "@/config/pages";
import { Projects } from "@/config/projects";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${pagesConfig.home.metadata.title} | Software Engineer Portfolio`,
  description: `${pagesConfig.home.metadata.description} Building production-grade software, AI-powered systems, and scalable full-stack applications.`,
  alternates: {
    canonical: siteConfig.url,
  },
};

// Strongest eight for the home page, mostly ones with real screenshots.
// Every project is on /projects.
const HOME_IDS = ["thnkrr", "aulora", "agentic-ads-factory", "pico", "spiral-studios", "multibrain", "onetap", "erwins-hire-ai"];
const homeProjects = HOME_IDS.map((id) => Projects.find((p) => p.id === id)!).filter(Boolean);

export default function IndexPage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.authorName,
    url: siteConfig.url,
    image: siteConfig.ogImage,
    jobTitle: "Lead Engineer",
    worksFor: { "@type": "Organization", name: "SingleBit", url: "https://singlebit.xyz" },
    sameAs: [siteConfig.links.github, siteConfig.links.twitter],
  };

  return (
    <>
      <Script
        id="schema-person"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <Hero />
      <Manifesto />

      <section id="work" className="pb-[16vh]">
        <SectionHead
          index="01"
          title={["Selected", "work"]}
          meta={<>Ranked by how hard it was · {Projects.length} projects</>}
          className="mb-16 md:mb-24"
        />
        <WorkGrid projects={homeProjects} />
        <div className="mt-20 px-[var(--hud-m)] text-center">
          <Link
            href="/projects"
            className="inline-block border border-ink/25 px-6 py-4 font-mono text-[13px] uppercase tracking-[0.08em] transition-colors hover:border-ember hover:text-ember"
          >
            All {Projects.length} projects →
          </Link>
        </div>
      </section>

      <section id="experience" className="pb-[16vh]">
        <SectionHead index="02" title={["Experience"]} meta="Where I've shipped" className="mb-12 md:mb-16" />
        <ExperienceList items={experiences} />
      </section>

      <section id="stack" className="pb-[16vh]">
        <SectionHead index="03" title={["Stack"]} meta="Tools, not religion" className="mb-10 md:mb-14" />
        <StackMarquee />
      </section>

      <section id="open-source" className="pb-[16vh]">
        <SectionHead index="04" title={["Open", "source"]} meta="Zulip · deduplicated, credit where due" className="mb-12 md:mb-20" />
        <OpenSourceLedger limit={8} />
        <div className="mt-10 px-[var(--hud-m)] text-right md:pr-[calc(var(--hud-m)+8px)]">
          <Link href="/contributions" className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink/70 hover:text-ember">
            [Every PR ↗]
          </Link>
        </div>
      </section>

      <Finale />
    </>
  );
}
