import { RevealLines } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/** "(01)  SELECTED WORK ........ 12 PROJECTS" */
export function SectionHead({
  index,
  title,
  meta,
  className,
}: {
  index: string;
  title: string[];
  meta?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 items-end gap-4 px-[var(--hud-m)] md:grid-cols-3 md:gap-0", className)}>
      <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink/60 md:pl-2">({index})</span>
      <RevealLines
        as="h2"
        className="font-display text-[clamp(44px,7.4vw,124px)] uppercase leading-[0.88] md:col-span-2 md:pl-2"
        lines={title}
      />
      {meta && (
        <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink/60 md:col-span-3 md:mt-6 md:pl-2 md:text-right">
          {meta}
        </div>
      )}
    </div>
  );
}
