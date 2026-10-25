import { Metadata } from "next";

import { LinkList, type AtlasLink } from "@/components/atlas/link-list";
import { LiveClock } from "@/components/atlas/live-clock";
import { StarMap } from "@/components/atlas/star-map";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Atlas",
  description: "Adarsh Pandey: every link in one place.",
  alternates: { canonical: `${siteConfig.url}/atlas` },
};

const resumeLink = process.env.NEXT_PUBLIC_RESUME_LINK || "/resume";

// Order = order in the list = the labelled stars in the sky.
const LINKS: AtlasLink[] = [
  { name: "Portfolio", handle: "Work, experience, open source", href: "/", icon: "sparkles", primary: true },
  { name: "Work with me", handle: "Freelance projects", href: "/work-with-me", icon: "contact", primary: true },
  { name: "LinkedIn", handle: "in/adarshji", href: "https://www.linkedin.com/in/adarshji", icon: "linkedin" },
  { name: "WhatsApp", handle: "Message me", href: "https://wa.me/919810896646", icon: "whatsapp" },
  {
    name: "Email",
    handle: "theadarshpandey17@gmail.com",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=theadarshpandey17@gmail.com",
    icon: "gmail",
  },
  { name: "X", handle: "@CerealFound", href: "https://x.com/CerealFound", icon: "twitter" },
  { name: "Instagram", handle: "@cerealnotfound", href: "https://www.instagram.com/cerealnotfound", icon: "instagram" },
  { name: "GitHub", handle: "@CerealNotFound", href: "https://github.com/CerealNotFound", icon: "gitHub" },
  { name: "Resume", handle: "PDF", href: resumeLink, icon: "paper" },
];

export default function AtlasPage() {
  const mapLinks = LINKS.map(({ name, href }) => ({ name, href }));
  return (
    <main className="atlas relative mx-auto min-h-[100svh] max-w-[480px] overflow-hidden pb-24">
      <div aria-hidden className="atlas-grain" />

      {/* The sky: the phoenix as a constellation */}
      <section className="relative h-[46svh] min-h-[330px]">
        <div aria-hidden className="atlas-glow" />
        <StarMap links={mapLinks} />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-[max(18px,env(safe-area-inset-top))] font-mono text-[11px] uppercase tracking-[0.08em] text-ink/60">
          <span>
            Atlas<span className="text-ember">.</span>
          </span>
          <span>
            IST <LiveClock />
          </span>
        </div>
        <span className="atlas-hint pointer-events-none absolute bottom-3 right-5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink/40">
          Tap a star ✦
        </span>
      </section>

      <div className="relative px-5">
        <h1 className="atlas-name font-display text-[clamp(52px,16vw,80px)] uppercase leading-[0.84]">
          <span className="block">Adarsh</span>
          <span className="atlas-outline block">Pandey</span>
        </h1>
        <p className="atlas-in mt-4 max-w-[34ch] text-[15px] leading-snug text-ink/70" style={{ animationDelay: "420ms" }}>
          Lead Engineer at SingleBit. I turn hard problems into shipped software.
        </p>

        <nav aria-label="Links" className="mt-7">
          <LinkList links={LINKS} />
        </nav>
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-6 overflow-hidden whitespace-nowrap">
        <div className="atlas-marquee inline-block font-display text-[40px] uppercase leading-none text-ink/[0.07]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="mx-4">
              Cereal not found <span className="text-ember/40">✦</span>
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
