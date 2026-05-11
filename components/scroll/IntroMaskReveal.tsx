'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';

const PARA_1 =
  "Twenty-eight projects across AI, edtech, finance, safety, and field operations. From a paper-and-pen tuition fee book turned into a four-role finance approval pipeline, to a self-evolving multi-agent AI that teaches itself new skills, to a crowd-safety platform with 90-second predictive surge alerts and SOS pipelines for first responders. Each one started the same way — somebody I knew had a problem nobody else was going to solve.";

const PARA_2 =
  "CrimeIntellX got published in IJIRE before I'd graduated. Today I'm engineering at THEELABS, with a confirmed offer for an MS in Cybersecurity with Forensic IT from the University of Portsmouth. The same rule runs through everything I ship — pick the smallest tool that solves the real problem, and take it all the way to a working product.";

function Char({
  char,
  progress,
  start,
  end,
}: {
  char: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="text-paper">
      {char}
    </motion.span>
  );
}

function MaskedParagraph({
  text,
  progress,
  rangeStart,
  rangeEnd,
  className,
}: {
  text: string;
  progress: MotionValue<number>;
  rangeStart: number;
  rangeEnd: number;
  className?: string;
}) {
  const chars = text.split('');
  const total = chars.length;
  const span = rangeEnd - rangeStart;
  const window = 0.08; // each character's transition window (in normalized progress)

  return (
    <p className={className}>
      {chars.map((c, i) => {
        const t = i / Math.max(total - 1, 1);
        const charStart = rangeStart + t * (span - window);
        const charEnd = charStart + window;
        return (
          <Char
            key={i}
            char={c === ' ' ? ' ' : c}
            progress={progress}
            start={charStart}
            end={charEnd}
          />
        );
      })}
    </p>
  );
}

export default function IntroMaskReveal() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Tagline reveal hooks (always called for hooks rules)
  const taglineOpacity = useTransform(scrollYProgress, [0.78, 0.92], [0, 1]);
  const taglineScale = useTransform(scrollYProgress, [0.78, 0.92], [0.96, 1]);

  if (reduce) {
    return (
      <section ref={ref} aria-label="Intro" className="relative w-full bg-ink py-32 md:py-48">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-amber">
            §  INTRO — WHO I AM
          </p>
          <h2
            className="mb-12 max-w-4xl font-display text-paper text-3xl md:text-5xl lg:text-6xl"
            style={{ lineHeight: 1.1, letterSpacing: '-0.02em', fontWeight: 400 }}
          >
            A builder who <span className="italic text-amber">finishes</span> what he starts.
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-paper md:text-2xl">{PARA_1}</p>
          <p className="mb-12 text-lg leading-relaxed text-paper md:text-2xl">{PARA_2}</p>
          <p className="mt-12 font-display italic text-amber text-2xl md:text-4xl">
            Range. Ship rate. Real problems. — That&apos;s the work.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      aria-label="Intro"
      className="relative w-full bg-ink py-32 md:py-48"
      style={{ minHeight: '160vh' }}
    >
      <div className="mx-auto max-w-5xl px-6 md:px-12">
        <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-amber">
          §  INTRO — WHO I AM
        </p>
        <h2
          className="mb-12 max-w-4xl font-display text-paper text-3xl md:text-5xl lg:text-6xl"
          style={{ lineHeight: 1.1, letterSpacing: '-0.02em', fontWeight: 400 }}
        >
          A builder who <span className="italic text-amber">finishes</span> what he starts.
        </h2>

        <MaskedParagraph
          text={PARA_1}
          progress={scrollYProgress}
          rangeStart={0.10}
          rangeEnd={0.45}
          className="mb-8 text-lg leading-relaxed md:text-2xl"
        />
        <MaskedParagraph
          text={PARA_2}
          progress={scrollYProgress}
          rangeStart={0.42}
          rangeEnd={0.78}
          className="mb-12 text-lg leading-relaxed md:text-2xl"
        />

        <motion.p
          style={{ opacity: taglineOpacity, scale: taglineScale }}
          className="mt-12 font-display italic text-amber text-2xl md:text-4xl"
        >
          Range. Ship rate. Real problems. — That&apos;s the work.
        </motion.p>
      </div>
    </section>
  );
}
