'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ProjectTheme } from '@/lib/project-themes';

const EASE = [0.22, 0.61, 0.36, 1] as const;

export default function OutcomeQuoteThemed({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <section
      className="relative px-6 md:px-12 py-32 md:py-48"
      style={{
        background: theme.palette.bgMid,
        color: theme.palette.text,
      }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.p
          className="font-mono uppercase text-xs tracking-[0.3em] mb-10"
          style={{ color: theme.palette.accent }}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={reduce ? undefined : { opacity: 0.85, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          § The thesis
        </motion.p>
        <motion.blockquote
          className="font-display italic leading-[1.05] tracking-tight"
          style={{
            fontSize: 'clamp(1.8rem, 5vw, 4.2rem)',
            color: theme.palette.text,
          }}
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          &ldquo;{theme.outcomeQuote}&rdquo;
        </motion.blockquote>
      </div>
    </section>
  );
}
