import { FadeIn, RevealLines } from "@/components/motion/reveal";

import { HeroFlag } from "./hero-flag";

/**
 * Full-screen hero. Text lives in the DOM and lines up with the HUD columns;
 * the glass phoenix and the ember fluid are drawn by the WebGL layer behind it.
 */
export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[620px] px-[var(--hud-m)]">
      <HeroFlag />
      {/* Flat phoenix, shown only when WebGL is unavailable */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        aria-hidden
        alt=""
        src="/brand/phoenix.svg"
        className="gl-fallback absolute left-1/2 top-[44%] h-[50vh] -translate-x-1/2 -translate-y-1/2"
      />

      <div className="grid grid-cols-1 gap-6 pt-24 md:grid-cols-3 md:gap-0 md:pt-[118px]">
        <RevealLines
          as="h1"
          className="text-[22px] font-medium leading-[1.15] tracking-[-0.01em] md:pl-2 md:text-[28px]"
          lines={["Adarsh Pandey", <span key="r" className="text-ink/60">Lead Engineer</span>]}
          delay={0.2}
        />
        <FadeIn delay={0.4} className="hidden font-mono text-[13px] leading-[1.7] text-ink/80 md:block md:pl-2">
          Systems first.
          <br />
          Shipped, not demoed.
        </FadeIn>
        <FadeIn delay={0.5} className="hidden max-w-[30rem] font-mono text-[13px] leading-[1.7] text-ink/80 md:block md:pl-2">
          Full-stack engineer building AI products, agent pipelines, and the
          infrastructure that keeps them up. Lead Engineer at SingleBit.
          Open-source contributor to Zulip.
        </FadeIn>
      </div>

      <RevealLines
        as="h2"
        className="font-display absolute bottom-[96px] left-[var(--hud-m)] right-[var(--hud-m)] text-[clamp(38px,6.4vw,96px)] uppercase leading-[0.92] md:bottom-[112px] md:pl-2"
        lines={["I turn hard", "problems into", "shipped software"]}
        delay={0.35}
      />
    </section>
  );
}
