'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { Act } from '@/lib/projects-manifest';
import { easing } from '@/lib/motion-tokens';

type Props = {
  act: Act;
};

/**
 * Pinned 100vh act-intro card — pure typography on ink.
 * Uses sticky inside a 180vh wrapper for a soft "linger" without GSAP.
 */
export default function ActIntro({ act }: Props) {
  const reduce = useReducedMotion();
  const projectCount = act.projects.length;
  const labelLine = `${act.label}  ·  ${projectCount} ENTRIES`;

  return (
    <section
      aria-label={`Act ${act.numeral} — ${act.name}`}
      data-act={act.id}
      className="relative h-[180vh] w-full bg-ink"
    >
      <div className="sticky top-0 flex h-[100vh] w-full items-center justify-center overflow-hidden bg-ink">
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center md:px-8">
          {/* Numeral — gigantic, paper-soft */}
          <motion.span
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reduce ? 0 : 0.7, ease: easing.suitEject }}
            className="font-display font-light leading-none text-paper-soft"
            style={{ fontSize: 'clamp(10rem, 22vw, 22rem)' }}
          >
            {act.numeral}
          </motion.span>

          {/* Act name — overlaps, stacks tight */}
          <motion.h2
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: reduce ? 0 : 0.7,
              ease: easing.suitEject,
              delay: reduce ? 0 : 0.1,
            }}
            className="-mt-6 font-display font-light tracking-tight text-paper md:-mt-10"
            style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', lineHeight: 0.9 }}
          >
            {act.name}
          </motion.h2>

          {/* Caption */}
          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: reduce ? 0 : 0.6,
              ease: easing.suitEject,
              delay: reduce ? 0 : 0.25,
            }}
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-amber/80"
          >
            {labelLine}
          </motion.p>

          {/* Pull-quote */}
          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: reduce ? 0 : 0.7,
              ease: easing.suitEject,
              delay: reduce ? 0 : 0.35,
            }}
            className="mt-12 max-w-2xl font-display italic leading-snug text-paper-dim text-2xl md:text-4xl"
          >
            “{act.pullQuote}”
          </motion.p>
        </div>

        {/* Bottom hairline rule */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-paper-soft" />
      </div>
    </section>
  );
}
