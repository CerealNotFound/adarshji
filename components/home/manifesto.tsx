import Image from "next/image";
import Link from "next/link";

import { FadeIn, RevealLines } from "@/components/motion/reveal";
import profileImg from "@/public/profile-img.jpg";

export function Manifesto() {
  return (
    <section className="relative grid grid-cols-1 gap-10 px-[var(--hud-m)] py-[18vh] md:grid-cols-3 md:gap-0">
      <FadeIn className="md:pl-2 md:pr-10">
        <figure className="relative w-[min(100%,240px)]">
          <div className="relative overflow-hidden">
            <Image
              src={profileImg}
              alt="Adarsh Pandey"
              className="aspect-square w-full object-cover grayscale contrast-125"
              sizes="240px"
            />
            {/* Ember duotone */}
            <span aria-hidden className="absolute inset-0 bg-ember mix-blend-multiply" />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ash/70 to-transparent" />
          </div>
          <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink/60">
            India · IST (UTC+5:30)
          </figcaption>
        </figure>
      </FadeIn>

      <div className="md:col-span-2 md:pl-2">
        <RevealLines
          className="max-w-[46rem] text-[clamp(22px,3.1vw,44px)] font-medium leading-[1.12] tracking-[-0.015em]"
          lines={[
            "I build AI products, agent",
            "pipelines and the unglamorous",
            "systems that keep them alive.",
          ]}
        />
        <FadeIn delay={0.2} className="mt-8 max-w-[46rem] text-[clamp(18px,1.7vw,24px)] leading-[1.35] text-ink/55">
          Lead engineer at{" "}
          <Link href="/experience/singlebit" className="text-ink underline decoration-ember/60 underline-offset-4 hover:decoration-ember">
            SingleBit
          </Link>
          , rebuilding{" "}
          <Link href="/projects/thnkrr" className="text-ink underline decoration-ember/60 underline-offset-4 hover:decoration-ember">
            Thnkrr
          </Link>{" "}
          for scale, and contributor to{" "}
          <Link href="/contributions" className="text-ink underline decoration-ember/60 underline-offset-4 hover:decoration-ember">
            Zulip
          </Link>
          . I work like part of your team, not a vendor on the side.
        </FadeIn>
      </div>
    </section>
  );
}
