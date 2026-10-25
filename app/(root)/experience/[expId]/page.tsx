import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FadeIn, RevealLines } from "@/components/motion/reveal";
import { WorkGrid } from "@/components/sections/work-grid";
import { experiences } from "@/config/experience";
import { Projects } from "@/config/projects";
import { siteConfig } from "@/config/site";

interface ExperienceDetailPageProps {
  params: Promise<{ expId: string }>;
}

// Projects built during each role.
const RELATED: Record<string, string[]> = {
  singlebit: ["thnkrr", "agentic-ads-factory", "onetap", "hospihealth"],
  "problem-solvers": ["multibrain"],
  agentprod: [],
};

const fmt = (d: Date | "Present") =>
  d === "Present" ? "Now" : d.toLocaleDateString("en-US", { month: "short", year: "numeric" });

export function generateStaticParams() {
  return experiences.map((e) => ({ expId: e.id }));
}

export async function generateMetadata({ params }: ExperienceDetailPageProps): Promise<Metadata> {
  const { expId } = await params;
  const x = experiences.find((c) => c.id === expId);
  if (!x) return { title: "Experience Not Found" };
  return {
    title: `${x.position} at ${x.company} | Experience`,
    description: x.description[0],
    alternates: { canonical: `${siteConfig.url}/experience/${expId}` },
  };
}

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { expId } = await params;
  const index = experiences.findIndex((c) => c.id === expId);
  if (index < 0) notFound();
  const x = experiences[index];
  const next = experiences[(index + 1) % experiences.length];
  const related = (RELATED[x.id] ?? []).map((id) => Projects.find((p) => p.id === id)!).filter(Boolean);

  return (
    <article className="pb-[10vh]">
      <header className="px-[var(--hud-m)] pb-[10vh] pt-36 md:pt-[20vh]">
        <div className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[12px] uppercase tracking-[0.08em] text-ink/60 md:pl-2">
          <Link href="/experience" className="hover:text-ember">
            ← Experience
          </Link>
          <span className="text-ink/30">/</span>
          <span>
            {fmt(x.startDate)} — {fmt(x.endDate)}
          </span>
          <span className="text-ink/30">/</span>
          <span>{x.location}</span>
        </div>
        <div className="flex items-end gap-6 md:pl-2">
          {x.logo && (
            <Image src={x.logo} alt={`${x.company} logo`} width={88} height={88} className="mb-2 hidden h-[clamp(48px,6vw,88px)] w-auto rounded-sm bg-ink/5 object-contain md:block" />
          )}
          <RevealLines
            as="h1"
            className="font-display text-[clamp(48px,9vw,160px)] uppercase leading-[0.84]"
            lines={[x.company]}
            delay={0.1}
          />
        </div>
        <FadeIn delay={0.3} className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 md:pl-2">
          <span className="text-[clamp(22px,2.4vw,34px)] font-medium text-ember">{x.position}</span>
          {x.companyUrl && (
            <Link href={x.companyUrl} target="_blank" className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink/60 hover:text-ember">
              {x.companyUrl.replace(/^https?:\/\//, "")} ↗
            </Link>
          )}
        </FadeIn>
      </header>

      <section className="grid grid-cols-1 gap-12 px-[var(--hud-m)] pb-[12vh] md:grid-cols-3 md:gap-0">
        <div className="md:sticky md:top-28 md:self-start md:pl-2 md:pr-10">
          <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink/45">Stack</h2>
          <ul className="flex flex-wrap gap-2">
            {x.skills.map((s) => (
              <li key={s} className="border border-ink/15 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink/75">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2 md:pl-2">
          {x.description.map((d, i) => (
            <FadeIn
              key={i}
              className={i === 0 ? "max-w-[44rem] text-[clamp(22px,2.2vw,32px)] font-medium leading-[1.25]" : "mt-6 max-w-[40rem] text-[17px] leading-relaxed text-ink/65"}
            >
              {d}
            </FadeIn>
          ))}
          <h2 className="mb-2 mt-16 font-mono text-[12px] uppercase tracking-[0.08em] text-ink/50">What I shipped</h2>
          <ol className="max-w-[46rem]">
            {x.achievements.map((a, i) => (
              <FadeIn key={i} delay={i * 0.03}>
                <li className="grid grid-cols-[3rem_1fr] border-t border-ink/10 py-4 text-[17px] leading-snug text-ink/80">
                  <span className="font-mono text-[12px] text-ember">{String(i + 1).padStart(2, "0")}</span>
                  {a}
                </li>
              </FadeIn>
            ))}
          </ol>
        </div>
      </section>

      {related.length > 0 && (
        <section className="pb-[12vh]">
          <h2 className="mb-10 px-[var(--hud-m)] font-mono text-[12px] uppercase tracking-[0.08em] text-ink/60 md:pl-[calc(var(--hud-m)+8px)]">
            (Built here)
          </h2>
          <WorkGrid projects={related} />
        </section>
      )}

      <Link href={`/experience/${next.id}`} className="group block border-t border-ink/10 px-[var(--hud-m)] pt-12">
        <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink/55 md:pl-2">Next role →</span>
        <span className="mt-4 block font-display text-[clamp(44px,8vw,140px)] uppercase leading-[0.85] text-ink/30 transition-colors duration-500 group-hover:text-ember md:pl-2">
          {next.company}
        </span>
      </Link>
    </article>
  );
}
