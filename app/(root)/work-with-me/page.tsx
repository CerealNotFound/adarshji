import { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/forms/contact-form";
import { FadeIn, RevealLines } from "@/components/motion/reveal";
import { SectionHead } from "@/components/sections/section-head";
import { WorkGrid } from "@/components/sections/work-grid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Projects } from "@/config/projects";

export const metadata: Metadata = {
  title: "Work with me",
  description:
    "Hire Adarsh Pandey: a full-stack engineer who takes hard product and systems problems from first sketch to production, working inside your team.",
};

const PROBLEMS = [
  {
    problem: "Your AI feature works in a demo, not in production.",
    answer:
      "Agent pipelines with real hand-offs, guardrails and human review steps. Model choices you can defend, and costs you can predict.",
    proof: [
      { name: "Agentic Ads Factory", id: "agentic-ads-factory" },
      { name: "Thnkrr moderation", id: "thnkrr" },
    ],
  },
  {
    problem: "You need a product built, and built to last.",
    answer:
      "From the first schema to the last pixel: APIs, data models, auth, frontends, deploys. The parts that usually fall between people.",
    proof: [
      { name: "Thnkrr", id: "thnkrr" },
      { name: "OneTap", id: "onetap" },
    ],
  },
  {
    problem: "Your team is buried in work a machine should do.",
    answer:
      "Internal tools and agents that live where your team already works, like chat, Notion and Drive, and that show their work before they act.",
    proof: [
      { name: "Pico", id: "pico" },
      { name: "Orbit", id: "orbit" },
    ],
  },
  {
    problem: "Your users are minors, or your data is sensitive.",
    answer:
      "Privacy, consent and moderation designed into the architecture, with every decision written down and sourced.",
    proof: [{ name: "Thnkrr", id: "thnkrr" }],
  },
  {
    problem: "Your backend can't keep up.",
    answer:
      "Benchmarks before opinions. Query plans, load tests, the right instance size, and moving off what no longer fits.",
    proof: [
      { name: "Thnkrr search at pilot scale", id: "thnkrr" },
      { name: "Multibrain's FastAPI move", id: "multibrain" },
    ],
  },
  {
    problem: "Your site has to make people stop scrolling.",
    answer:
      "Interfaces with craft: motion, WebGL and shaders where they earn their place, and fast pages everywhere else. You're looking at one.",
    proof: [{ name: "Spiral Studios", id: "spiral-studios" }],
  },
];

const MODELS = [
  {
    name: "Sprint",
    span: "1–2 weeks",
    body: "One sharp problem: a prototype to test an idea, a performance fire, an AI feature that keeps falling over. You get the fix and a write-up.",
  },
  {
    name: "Build",
    span: "4–12 weeks",
    body: "A product or a major feature, end to end. Scoped in writing, shipped in weekly loops you can see and steer.",
  },
  {
    name: "Embedded",
    span: "Ongoing",
    body: "I join your standups, repo and chat as part of the team. Same rituals, same reviews, no vendor wall.",
  },
];

const PROCESS = [
  { n: "01", t: "A call", d: "You tell me what's in the way. I ask annoying questions until the real problem shows up." },
  { n: "02", t: "A written plan", d: "Scope, risks, trade-offs and what I'd cut. You know what you're getting before I write a line." },
  { n: "03", t: "Small loops", d: "Working software every week, in PRs your team can review. No big reveal at the end." },
  { n: "04", t: "A clean handover", d: "Docs, runbooks and decision records, so the system doesn't need me to keep running." },
];

const FAQ = [
  {
    q: "Can you work in our existing codebase?",
    a: "Yes, that's most of the job. Open source is good practice for it: in Zulip I worked across its web app, emails and API docs, inside a large codebase with strict review.",
  },
  {
    q: "Do you use AI to write code?",
    a: "Heavily, and carefully. Claude Code is part of how I build (I wrote Aulora to run it across projects). Every change is still reviewed, tested and understood before it ships.",
  },
  {
    q: "Which time zone are you in?",
    a: "IST (UTC+5:30). I keep a few hours of overlap with your team's day for calls and reviews.",
  },
  {
    q: "What does it cost?",
    a: "It depends on the shape of the work. Tell me about the project and I'll send a written proposal with scope and price, usually after one call.",
  },
  {
    q: "What if the project is small?",
    a: "Small and sharp is great. A sprint is often the fastest way to find out whether we work well together.",
  },
];

const featured = ["thnkrr", "aulora", "agentic-ads-factory", "spiral-studios"]
  .map((id) => Projects.find((p) => p.id === id)!)
  .filter(Boolean);

export default function WorkWithMePage() {
  return (
    <>
      {/* Pitch */}
      <section className="relative flex min-h-[100svh] flex-col justify-end px-[var(--hud-m)] pb-[14vh] pt-32">
        <span className="mb-6 font-mono text-[12px] uppercase tracking-[0.08em] text-ink/60 md:pl-2">
          (Work with me) · Freelance
        </span>
        <RevealLines
          as="h1"
          className="font-display text-[clamp(44px,8.4vw,150px)] uppercase leading-[0.88] md:pl-2"
          lines={["An engineer", "on your team,", <span key="v" className="text-ember">not a vendor.</span>]}
          delay={0.15}
        />
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-0">
          <FadeIn delay={0.4} className="max-w-[34rem] text-[clamp(18px,1.6vw,22px)] leading-[1.4] text-ink/70 md:col-span-2 md:pl-2">
            I take hard product and systems problems from the first sketch to production, and I work inside your
            tools and rhythm while I do it. Lead Engineer at SingleBit, taking on a small number of freelance
            projects.
          </FadeIn>
          <FadeIn delay={0.5} className="flex items-end md:justify-end md:pl-2">
            <Link
              href="#start"
              className="bg-ember px-6 py-4 font-mono text-[13px] uppercase tracking-[0.08em] text-ash transition-colors hover:bg-ink"
            >
              Start a project ↓
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Problems */}
      <section className="pb-[16vh]">
        <SectionHead index="01" title={["What I", "solve"]} meta="Problems first, then tools" className="mb-14 md:mb-20" />
        <ul className="grid grid-cols-1 px-[var(--hud-m)] md:grid-cols-3">
          {PROBLEMS.map((p, i) => (
            <FadeIn key={p.problem} delay={(i % 3) * 0.06} className="border-t border-ink/10 md:px-2">
              <li className="flex h-full flex-col py-8 md:min-h-[340px] md:pr-8">
                <span className="font-mono text-[12px] text-ink/40">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-[clamp(22px,2vw,28px)] font-medium leading-[1.15]">{p.problem}</h3>
                <p className="mt-4 text-[16px] leading-relaxed text-ink/60">{p.answer}</p>
                <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-6 font-mono text-[11px] uppercase tracking-[0.08em]">
                  <span className="text-ink/35">Proof:</span>
                  {p.proof.map((x) => (
                    <Link key={x.name} href={`/projects/${x.id}`} className="text-ink/75 hover:text-ember">
                      {x.name} ↗
                    </Link>
                  ))}
                </div>
              </li>
            </FadeIn>
          ))}
        </ul>
      </section>

      {/* Engagement models */}
      <section className="pb-[16vh]">
        <SectionHead index="02" title={["How we", "work"]} meta="Pick a shape; we can change it later" className="mb-14 md:mb-20" />
        <div className="grid grid-cols-1 gap-px px-[var(--hud-m)] md:grid-cols-3">
          {MODELS.map((m, i) => (
            <FadeIn key={m.name} delay={i * 0.08} className="group relative border border-ink/10 p-8 transition-colors duration-500 hover:border-ember/60 md:min-h-[420px]">
              <div className="flex h-full flex-col">
                <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink/50">{m.span}</span>
                <span className="mt-6 font-display text-[clamp(40px,4.4vw,72px)] uppercase leading-none transition-colors group-hover:text-ember">
                  {m.name}
                </span>
                <p className="mt-auto pt-10 text-[17px] leading-relaxed text-ink/65">{m.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="pb-[16vh]">
        <SectionHead index="03" title={["Process"]} meta="Boring on purpose" className="mb-12 md:mb-16" />
        <ol className="px-[var(--hud-m)]">
          {PROCESS.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.05}>
              <li className="grid grid-cols-1 gap-2 border-t border-ink/10 py-8 last:border-b md:grid-cols-3 md:gap-0">
                <span className="font-display text-[clamp(40px,4vw,64px)] leading-none text-ink/20 md:pl-2">{s.n}</span>
                <span className="text-[clamp(22px,2.2vw,32px)] font-medium md:pl-2">{s.t}</span>
                <span className="max-w-[40ch] text-[16px] leading-relaxed text-ink/60 md:pl-2">{s.d}</span>
              </li>
            </FadeIn>
          ))}
        </ol>
      </section>

      {/* Proof */}
      <section className="pb-[16vh]">
        <SectionHead index="04" title={["Recent", "work"]} meta={<Link href="/projects" className="hover:text-ember">[All projects ↗]</Link>} className="mb-16 md:mb-24" />
        <WorkGrid projects={featured} />
      </section>

      {/* FAQ */}
      <section className="pb-[16vh]">
        <SectionHead index="05" title={["Questions"]} className="mb-10 md:mb-14" />
        <div className="grid grid-cols-1 px-[var(--hud-m)] md:grid-cols-3">
          <Accordion type="single" collapsible className="md:col-span-2 md:col-start-2 md:pl-2">
            {FAQ.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-ink/10">
                <AccordionTrigger className="py-6 text-left text-[clamp(18px,1.7vw,24px)] font-medium hover:text-ember hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-[60ch] pb-6 text-[16px] leading-relaxed text-ink/60">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact */}
      <section id="start" className="scroll-mt-24 pb-[12vh]">
        <SectionHead index="06" title={["Tell me what", "you're building"]} className="mb-12 md:mb-16" />
        <div className="grid grid-cols-1 gap-10 px-[var(--hud-m)] md:grid-cols-3 md:gap-0">
          <div className="space-y-4 font-mono text-[12px] uppercase leading-relaxed tracking-[0.08em] text-ink/55 md:pl-2 md:pr-10">
            <p>A few lines is enough: what you're building, what's in the way, and when you need it.</p>
            <p className="text-ink/35">I reply to every message personally.</p>
          </div>
          <div className="md:col-span-2 md:pl-2">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
