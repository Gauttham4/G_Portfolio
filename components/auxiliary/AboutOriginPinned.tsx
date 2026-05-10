'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Reveal from '@/components/motion/Reveal';

const paragraphs = [
  "I grew up in Puducherry. Did my 12th at Sri Sankara Vidyalaya Hr. Sec. School, Lawspet. Then engineering at Puducherry Technological University.",
  "Hometown roots run through everything I build — half my projects exist because someone I know had a problem nobody else was going to solve.",
  "It's not nostalgia. It's specificity. When you know the people you're building for, the brief writes itself.",
];

export default function AboutOriginPinned() {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -40]);

  return (
    <section
      ref={ref}
      className="relative mx-auto max-w-7xl px-6 py-24 md:py-32"
    >
      <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-20">
        {/* Sticky left column */}
        <div className="md:sticky md:top-32 md:self-start">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
            Act I · Puducherry
          </p>
          <motion.p
            className="mt-6 font-display text-3xl italic leading-[1.1] text-paper md:text-5xl lg:text-6xl"
            style={{ y }}
          >
            &ldquo;Built for the people I see every day.&rdquo;
          </motion.p>
          <p className="mt-8 max-w-md font-sans text-sm text-paper-dim md:text-base">
            Where I&apos;m from is not a footnote. It&apos;s the brief.
          </p>
        </div>

        {/* Right column scrolling content */}
        <div className="space-y-14 md:space-y-20">
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <p className="font-sans text-lg leading-relaxed text-paper md:text-2xl">
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
