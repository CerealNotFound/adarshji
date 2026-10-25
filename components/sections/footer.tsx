import Link from "next/link";

import { SocialLinks } from "@/config/socials";

export function Footer() {
  return (
    <footer className="relative overflow-hidden px-[var(--hud-m)] pb-24 pt-24">
      <div className="grid grid-cols-1 gap-8 font-mono text-[12px] uppercase tracking-[0.08em] text-ink/60 md:grid-cols-3 md:gap-0">
        <span className="md:pl-2">Adarsh Pandey © {new Date().getFullYear()}</span>
        <ul className="flex flex-col gap-2 md:pl-2">
          {SocialLinks.map((s) => (
            <li key={s.name}>
              <Link href={s.link} target="_blank" className="hover:text-ember">
                {s.name} <span className="text-ink/35">{s.username}</span> ↗
              </Link>
            </li>
          ))}
        </ul>
        <span className="md:pl-2 md:text-right">Made with Next.js, three.js and GLSL</span>
      </div>
      <div aria-hidden className="footer-mark mt-16 select-none font-display text-[18.5vw] uppercase leading-[0.8]">
        Adarsh
      </div>
    </footer>
  );
}
