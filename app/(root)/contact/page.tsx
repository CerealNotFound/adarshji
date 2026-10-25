import { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/forms/contact-form";
import { FadeIn, RevealLines } from "@/components/motion/reveal";
import { pagesConfig } from "@/config/pages";
import { SocialLinks } from "@/config/socials";

export const metadata: Metadata = {
  title: pagesConfig.contact.metadata.title,
  description: pagesConfig.contact.metadata.description,
};

export default function ContactPage() {
  return (
    <div className="pb-[12vh]">
      <header className="px-[var(--hud-m)] pb-14 pt-36 md:pb-20 md:pt-[22vh]">
        <span className="mb-4 block font-mono text-[12px] uppercase tracking-[0.08em] text-ink/60 md:pl-2">
          (Contact)
        </span>
        <RevealLines
          as="h1"
          className="font-display text-[clamp(56px,12vw,210px)] uppercase leading-[0.82] md:pl-2"
          lines={["Say", "hello"]}
          delay={0.1}
        />
      </header>
      <section className="grid grid-cols-1 gap-12 px-[var(--hud-m)] md:grid-cols-3 md:gap-0">
        <FadeIn className="md:pl-2 md:pr-10">
          <p className="max-w-[30ch] text-[18px] leading-relaxed text-ink/65">
            A project, a role, or a question about something I built. Write as much or as little as you like.
          </p>
          <ul className="mt-10 space-y-3 font-mono text-[12px] uppercase tracking-[0.08em]">
            {SocialLinks.map((s) => (
              <li key={s.name}>
                <Link href={s.link} target="_blank" className="text-ink/75 hover:text-ember">
                  {s.name} <span className="text-ink/35">{s.username}</span> ↗
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/work-with-me"
            className="mt-10 inline-block border border-ink/25 px-5 py-3 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors hover:border-ember hover:text-ember"
          >
            Hiring me for a project? →
          </Link>
        </FadeIn>
        <div className="md:col-span-2 md:pl-2">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
