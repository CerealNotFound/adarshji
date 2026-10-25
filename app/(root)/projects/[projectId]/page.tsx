import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GLImage } from "@/components/gl/gl-image";
import { FadeIn, RevealLines } from "@/components/motion/reveal";
import { years } from "@/components/sections/work-grid";
import { Projects } from "@/config/projects";

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export function generateStaticParams() {
  return Projects.map((p) => ({ projectId: p.id }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { projectId } = await params;
  const p = Projects.find((x) => x.id === projectId);
  if (!p) return {};
  return { title: p.companyName, description: p.tagline ?? p.shortDescription };
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-ink/10 py-4">
      <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/45">{label}</dt>
      <dd className="mt-1.5 text-[15px] text-ink/85">{children}</dd>
    </div>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const index = Projects.findIndex((val) => val.id === projectId);
  if (index < 0) notFound();
  const p = Projects[index];
  const next = Projects[(index + 1) % Projects.length];
  const [lead, ...rest] = p.descriptionDetails.paragraphs;

  return (
    <article className="pb-[10vh]">
      {/* Title */}
      <header className="px-[var(--hud-m)] pb-12 pt-36 md:pt-[20vh]">
        <div className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[12px] uppercase tracking-[0.08em] text-ink/60 md:pl-2">
          <Link href="/projects" className="hover:text-ember">
            ← Work
          </Link>
          <span className="text-ink/30">/</span>
          <span>
            {String(index + 1).padStart(2, "0")} of {String(Projects.length).padStart(2, "0")}
          </span>
          {p.label && (
            <span className="bg-acid px-1.5 py-[3px] text-[10px] leading-none text-ash">{p.label}</span>
          )}
        </div>
        <RevealLines
          as="h1"
          className="font-display text-[clamp(52px,10vw,180px)] uppercase leading-[0.84] md:pl-2"
          lines={[p.companyName]}
          delay={0.1}
        />
        {p.tagline && (
          <FadeIn delay={0.3} className="mt-8 max-w-[38rem] text-[clamp(20px,2.2vw,30px)] font-medium leading-[1.2] text-ink/75 md:pl-2">
            {p.tagline}
          </FadeIn>
        )}
      </header>

      {/* Cover */}
      {p.coverImg && (
        <div className="px-[var(--hud-m)] md:px-[calc(var(--hud-m)+8px)]">
          <GLImage
            src={p.coverImg}
            alt={`${p.companyName} screenshot`}
            className="aspect-[16/9] w-full"
            priority
            fit={p.coverFit}
            matte={p.coverMatte}
          />
        </div>
      )}

      {/* Overview */}
      <section className="grid grid-cols-1 gap-12 px-[var(--hud-m)] py-[12vh] md:grid-cols-3 md:gap-0">
        <dl className="md:sticky md:top-28 md:self-start md:pl-2 md:pr-10">
          <Meta label="Years">{years(p)}</Meta>
          <Meta label="Type">{p.type}</Meta>
          <Meta label="Discipline">{p.category.join(", ")}</Meta>
          <Meta label="Stack">{p.techStack.join(", ")}</Meta>
          {(p.websiteLink || p.githubLink) && (
            <Meta label="Links">
              <span className="flex flex-col gap-1 font-mono text-[12px] uppercase tracking-[0.08em]">
                {p.websiteLink && (
                  <Link href={p.websiteLink} target="_blank" className="hover:text-ember">
                    Visit ↗
                  </Link>
                )}
                {p.githubLink && (
                  <Link href={p.githubLink} target="_blank" className="hover:text-ember">
                    Source ↗
                  </Link>
                )}
              </span>
            </Meta>
          )}
        </dl>

        <div className="md:col-span-2 md:pl-2">
          {lead && (
            <FadeIn className="max-w-[44rem] text-[clamp(22px,2.2vw,32px)] font-medium leading-[1.25]">{lead}</FadeIn>
          )}
          {rest.map((para, i) => (
            <FadeIn key={i} className="mt-6 max-w-[40rem] text-[17px] leading-relaxed text-ink/65">
              {para}
            </FadeIn>
          ))}

          <h2 className="mb-2 mt-16 font-mono text-[12px] uppercase tracking-[0.08em] text-ink/50">What I did</h2>
          <ol className="max-w-[44rem]">
            {p.descriptionDetails.bullets.map((b, i) => (
              <FadeIn key={i} delay={i * 0.03}>
                <li className="grid grid-cols-[3rem_1fr] border-t border-ink/10 py-4 text-[17px] leading-snug text-ink/80">
                  <span className="font-mono text-[12px] text-ember">{String(i + 1).padStart(2, "0")}</span>
                  {b}
                </li>
              </FadeIn>
            ))}
          </ol>
        </div>
      </section>

      {/* Inside */}
      {p.pagesInfoArr.length > 0 && (
        <section className="px-[var(--hud-m)] pb-[12vh]">
          <h2 className="mb-10 font-mono text-[12px] uppercase tracking-[0.08em] text-ink/60 md:pl-2">(Inside)</h2>
          {p.pagesInfoArr.map((page, i) => (
            <div key={page.title} className="grid grid-cols-1 gap-6 border-t border-ink/10 py-12 md:grid-cols-3 md:gap-0">
              <span className="font-display text-[clamp(40px,4vw,64px)] leading-none text-ink/15 md:pl-2">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="md:col-span-2 md:pl-2">
                <h3 className="text-[clamp(22px,2.2vw,32px)] font-medium">{page.title}</h3>
                {page.description && (
                  <p className="mt-3 max-w-[44rem] text-[17px] leading-relaxed text-ink/60">{page.description}</p>
                )}
                {page.imgArr.length > 0 && (
                  <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {page.imgArr.map((img) => (
                      <GLImage key={img} src={img} alt={`${p.companyName}: ${page.title}`} className="aspect-[16/10]" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Next */}
      <Link href={`/projects/${next.id}`} className="group block border-t border-ink/10 px-[var(--hud-m)] pt-12">
        <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink/55 md:pl-2">Next project →</span>
        <span className="mt-4 block font-display text-[clamp(48px,9vw,160px)] uppercase leading-[0.85] text-ink/30 transition-colors duration-500 group-hover:text-ember md:pl-2">
          {next.companyName}
        </span>
      </Link>
    </article>
  );
}
