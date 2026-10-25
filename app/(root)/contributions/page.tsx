import { Metadata } from "next";

import { FadeIn, RevealLines } from "@/components/motion/reveal";
import { OpenSourceLedger } from "@/components/sections/open-source";
import { pagesConfig } from "@/config/pages";

export const metadata: Metadata = {
  title: "Open source",
  description: pagesConfig.contributions.metadata.description,
};

export default function ContributionsPage() {
  return (
    <div className="pb-[14vh]">
      <header className="px-[var(--hud-m)] pb-14 pt-36 md:pb-24 md:pt-[22vh]">
        <span className="mb-4 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink/60 md:pl-2">
          (Open source) · zulip/zulip
        </span>
        <RevealLines
          as="h1"
          className="font-display text-[clamp(56px,12vw,210px)] uppercase leading-[0.82] md:pl-2"
          lines={["Open", "source"]}
          delay={0.1}
        />
        <FadeIn delay={0.3} className="mt-10 grid grid-cols-1 md:grid-cols-3">
          <p className="max-w-[40rem] text-[clamp(18px,1.6vw,22px)] leading-[1.45] text-ink/65 md:col-span-2 md:col-start-2 md:pl-2">
            Every pull request I opened on Zulip, deduplicated. Where someone else carried my work forward, both PRs
            are listed together once, with credit as it appears on GitHub.
          </p>
        </FadeIn>
      </header>
      <OpenSourceLedger />
    </div>
  );
}
