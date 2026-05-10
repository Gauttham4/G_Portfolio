'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ProjectTheme } from '@/lib/project-themes';

const EASE = [0.22, 0.61, 0.36, 1] as const;

export default function BigNumbersThemed({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <section
      className="relative px-6 md:px-12 py-28 md:py-36"
      style={{
        background: theme.palette.bg,
        color: theme.palette.text,
        borderTop: `1px solid ${theme.palette.accent}22`,
        borderBottom: `1px solid ${theme.palette.accent}22`,
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
        {theme.bigNumbers.map((n, i) => (
          <motion.div
            key={i}
            className="px-3 md:px-4 py-2 md:py-3"
            style={{ borderLeft: `1px solid ${theme.palette.accent}40` }}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
          >
            <div
              className="font-display leading-[0.85] tracking-tight"
              style={{
                color: theme.palette.accent,
                fontSize: 'clamp(2.6rem, 7.5vw, 5.6rem)',
              }}
            >
              {n.value}
            </div>
            <div
              className="mt-3 font-mono uppercase tracking-[0.25em] text-[10px] md:text-xs"
              style={{ color: theme.palette.dim }}
            >
              {n.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
