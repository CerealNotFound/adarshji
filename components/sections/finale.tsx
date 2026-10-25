"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Lightspeed } from "@/components/gl/lightspeed";
import { motionStore } from "@/lib/motion-store";

const LINES = [
  ["I ship like", "a team of one"],
  ["and work like", "part of yours"],
  ["Let's build", "something real"],
];

/**
 * A pinned hyperspace tunnel. The headline swaps as you scroll through it,
 * then the call to action lands.
 */
export function Finale() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setStep(v < 0.33 ? 0 : v < 0.66 ? 1 : 2)
  );
  const speed = useTransform(scrollYProgress, [0, 1], [0.7, 2.2]);
  // Stepped so React re-renders a handful of times per scroll, not every frame.
  const [s, setS] = useState(0.7);
  useMotionValueEvent(speed, "change", (v) => setS(Math.round(v * 5) / 5));
  const [quality, setQuality] = useState<"low" | "medium">("medium");
  useEffect(() => setQuality(motionStore.lowPower ? "low" : "medium"), []);

  return (
    <section ref={ref} className="relative h-[280vh]" aria-label="Work with me">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-ash">
        <Lightspeed
          primaryColor="#ff5a1f"
          secondaryColor="#ffa24a"
          tertiaryColor="#f3ede6"
          speed={s}
          quality={quality}
          interactionEnabled={false}
        >
          <div className="flex h-full flex-col items-center justify-center px-[var(--hud-m)] text-center">
            <span className="mb-6 font-mono text-[12px] uppercase tracking-[0.08em] text-ink/60">
              (05) Work with me
            </span>
            <div className="relative h-[2.1em] w-full font-display text-[clamp(40px,7.6vw,128px)] uppercase leading-[0.92]">
              {LINES.map((l, i) => (
                <motion.h2
                  key={i}
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    opacity: step === i ? 1 : 0,
                    y: step === i ? "0%" : step > i ? "-18%" : "18%",
                    filter: step === i ? "blur(0px)" : "blur(10px)",
                  }}
                  transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                  aria-hidden={step !== i}
                >
                  {l[0]}
                  <br />
                  {l[1]}
                </motion.h2>
              ))}
            </div>
            <motion.div
              className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
              animate={{ opacity: step === 2 ? 1 : 0, y: step === 2 ? 0 : 16 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/work-with-me"
                className="bg-ember px-6 py-4 font-mono text-[13px] uppercase tracking-[0.08em] text-ash transition-colors hover:bg-ink"
                tabIndex={step === 2 ? 0 : -1}
              >
                Work with me →
              </Link>
              <Link
                href="/contact"
                className="border border-ink/30 px-6 py-4 font-mono text-[13px] uppercase tracking-[0.08em] text-ink transition-colors hover:border-ink"
                tabIndex={step === 2 ? 0 : -1}
              >
                Say hello
              </Link>
            </motion.div>
          </div>
        </Lightspeed>
      </div>
    </section>
  );
}
