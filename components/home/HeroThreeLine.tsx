'use client';

import { motion, useReducedMotion } from 'framer-motion';
import OutlinedSVGText from '@/components/decoration/OutlinedSVGText';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function HeroThreeLine() {
  const reduce = useReducedMotion();

  const baseTransition = (delay: number) => ({
    duration: reduce ? 0 : 0.9,
    ease: EASE,
    delay: reduce ? 0 : delay,
  });

  const slide = (px: number) => (reduce ? 0 : px);

  return (
    <section
      aria-label="Introduction"
      className="relative w-full bg-ink pb-24 pt-40 md:pb-40 md:pt-56"
    >
      {/* Decorative outlined word above the headline */}
      <div className="pointer-events-none absolute inset-x-0 top-24 z-0 px-6 opacity-60 md:top-32 md:px-12">
        <OutlinedSVGText text="PORTFOLIO" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 md:px-12">
        {/* Pre-headline meta */}
        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={baseTransition(0)}
          className="mb-12 font-mono text-[11px] uppercase tracking-[0.35em] text-amber/80 md:mb-16"
        >
          Engineer  ·  Puducherry IN  ·  28 ships shipped
        </motion.p>

        <h2
          className="font-display text-paper"
          style={{
            fontSize: 'clamp(2.75rem, 7.5vw, 8.5rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.015em',
            fontWeight: 400,
          }}
        >
          {/* Line i — slide-left */}
          <motion.span
            className="block"
            initial={{ opacity: 0, x: slide(-120) }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={baseTransition(0.05)}
          >
            I build digital products
          </motion.span>

          {/* Line ii — slide-right, with amber accent span */}
          <motion.span
            className="block"
            initial={{ opacity: 0, x: slide(120) }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={baseTransition(0.18)}
          >
            that solve <span className="text-amber italic">real, named problems</span> —
          </motion.span>

          {/* Line iii — slide-left */}
          <motion.span
            className="block"
            initial={{ opacity: 0, x: slide(-120) }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={baseTransition(0.32)}
          >
            across 28 ships and counting.
          </motion.span>
        </h2>

        {/* Bottom-right scroll cue */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={baseTransition(0.55)}
          className="mt-16 flex items-center justify-between md:mt-24"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper-dim">
            <motion.span
              aria-hidden
              className="text-amber"
              animate={reduce ? {} : { opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↓
            </motion.span>{' '}
            Scroll for evidence
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper-dim">
            ©2026 · Studio
          </span>
        </motion.div>
      </div>
    </section>
  );
}
