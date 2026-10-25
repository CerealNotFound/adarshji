import Link from "next/link";

import { GLImage } from "@/components/gl/gl-image";
import { FadeIn } from "@/components/motion/reveal";
import { ProjectInterface } from "@/config/projects";
import { cn } from "@/lib/utils";

export function years(p: ProjectInterface) {
  const a = p.startDate.getFullYear();
  const b = p.endDate.getFullYear();
  return a === b ? String(a) : `${a}–${b}`;
}

const num = (i: number) => String(i + 1).padStart(2, "0");

/** Projects without a screenshot get a typographic cover. */
function TypeCover({ project, className }: { project: ProjectInterface; className?: string }) {
  return (
    <div
      className={cn(
        "type-cover relative flex flex-col justify-between overflow-hidden border border-ink/10 p-5 transition-colors duration-500 group-hover:border-ember/60",
        className
      )}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/50">
        {project.category.join(" · ")}
      </span>
      <span className="font-display text-[clamp(26px,2.6vw,44px)] uppercase leading-[0.9] text-ink transition-transform duration-700 group-hover:-translate-y-1">
        {project.companyName}
      </span>
      <span className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink/45">
        {project.techStack.slice(0, 4).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </span>
    </div>
  );
}

function Cover({ project, className, priority }: { project: ProjectInterface; className: string; priority?: boolean }) {
  return (
    <div className="relative">
      {project.coverImg ? (
        <GLImage
          src={project.coverImg}
          alt={`${project.companyName} screenshot`}
          className={className}
          priority={priority}
          fit={project.coverFit}
          matte={project.coverMatte}
        />
      ) : (
        <TypeCover project={project} className={className} />
      )}
      {project.label && (
        <span className="absolute right-0 top-0 bg-acid px-1.5 py-[3px] font-mono text-[10px] uppercase leading-none tracking-[0.06em] text-ash">
          {project.label}
        </span>
      )}
    </div>
  );
}

/** One project per grid column: same image shape, same caption rhythm. */
export function ProjectTile({ project, index }: { project: ProjectInterface; index: number }) {
  return (
    <FadeIn className="md:px-2">
      <Link
        href={`/projects/${project.id}`}
        className="group block"
        aria-label={`${project.companyName}: ${project.tagline ?? project.shortDescription}`}
      >
        <Cover project={project} className="aspect-[4/3]" />
        <div className="mt-3 flex items-baseline justify-between gap-4 border-b border-ink/10 pb-3 font-mono text-[12px] uppercase tracking-[0.06em] text-ink/85">
          <span>
            <span className="mr-3 text-ink/35">{num(index)}</span>
            {project.companyName}
            <span className="ml-2 inline-block text-ember opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">↗</span>
          </span>
          <span className="shrink-0 text-ink/50">{years(project)}</span>
        </div>
        {project.tagline && <p className="mt-3 max-w-[40ch] text-[15px] leading-snug text-ink/55">{project.tagline}</p>}
      </Link>
    </FadeIn>
  );
}

/** Wide image across two columns, details in the third. Alternates sides. */
function FeatureRow({ project, index, flip }: { project: ProjectInterface; index: number; flip: boolean }) {
  return (
    <FadeIn>
      <Link
        href={`/projects/${project.id}`}
        className="group grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-0"
        aria-label={`${project.companyName}: ${project.tagline ?? project.shortDescription}`}
      >
        <div className={cn("md:col-span-2 md:px-2", flip ? "md:order-1" : "md:order-2")}>
          <Cover project={project} className="aspect-[16/10]" priority={index === 0} />
        </div>
        <div className={cn("flex flex-col md:px-2", flip ? "md:order-2 md:pl-8" : "md:order-1 md:pr-8")}>
          <div className="flex items-baseline justify-between border-b border-ink/10 pb-3 font-mono text-[12px] uppercase tracking-[0.06em] text-ink/50">
            <span>({num(index)})</span>
            <span>{years(project)}</span>
          </div>
          <h3 className="mt-6 font-display text-[clamp(36px,3.6vw,64px)] uppercase leading-[0.9] transition-colors duration-500 group-hover:text-ember">
            {project.companyName}
          </h3>
          {project.tagline && (
            <p className="mt-4 text-[clamp(18px,1.5vw,22px)] font-medium leading-[1.25] text-ink/80">{project.tagline}</p>
          )}
          <p className="mt-4 text-[15px] leading-relaxed text-ink/55">{project.shortDescription}</p>
          <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink/45">
            {project.techStack.slice(0, 6).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <span className="mt-auto pt-8 font-mono text-[12px] uppercase tracking-[0.08em] text-ink/70 transition-colors group-hover:text-ember">
            [View project ↗]
          </span>
        </div>
      </Link>
    </FadeIn>
  );
}

/**
 * Lines up with the HUD's three columns. The first few projects get feature
 * rows; the rest fill an even three-up grid. The feature count is chosen so
 * the grid never ends on a half-empty row.
 */
export function WorkGrid({ projects, features }: { projects: ProjectInterface[]; features?: number }) {
  const n = projects.length;
  const f = features ?? ([2, 1, 3].find((k) => k <= n && (n - k) % 3 === 0) ?? Math.min(2, n));
  const lead = projects.slice(0, f);
  const rest = projects.slice(f);

  return (
    <div className="px-[var(--hud-m)]">
      <div className="space-y-20 md:space-y-28">
        {lead.map((p, i) => (
          <FeatureRow key={p.id} project={p} index={i} flip={i % 2 === 1} />
        ))}
      </div>
      {rest.length > 0 && (
        <div className="mt-20 grid grid-cols-1 gap-y-16 md:mt-28 md:grid-cols-3 md:gap-y-20">
          {rest.map((p, i) => (
            <ProjectTile key={p.id} project={p} index={f + i} />
          ))}
        </div>
      )}
    </div>
  );
}
