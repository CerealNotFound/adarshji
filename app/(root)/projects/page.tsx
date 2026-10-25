import { Metadata } from "next";

import { RevealLines } from "@/components/motion/reveal";
import { WorkBrowser } from "@/components/sections/work-browser";
import { pagesConfig } from "@/config/pages";
import { Projects } from "@/config/projects";

export const metadata: Metadata = {
  title: pagesConfig.projects.metadata.title,
  description: pagesConfig.projects.metadata.description,
};

export default function ProjectsPage() {
  return (
    <div className="pb-[14vh]">
      <header className="px-[var(--hud-m)] pb-14 pt-36 md:pb-20 md:pt-[22vh]">
        <span className="mb-4 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink/60 md:pl-2">
          (Work) · {Projects.length} projects · ranked by how hard it was
        </span>
        <RevealLines
          as="h1"
          className="font-display text-[clamp(64px,15vw,260px)] uppercase leading-[0.82] md:pl-2"
          lines={["Work"]}
          delay={0.1}
        />
      </header>
      <WorkBrowser projects={Projects} />
    </div>
  );
}
