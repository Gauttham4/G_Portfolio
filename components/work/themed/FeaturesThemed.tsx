'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ProjectTheme } from '@/lib/project-themes';

const EASE = [0.22, 0.61, 0.36, 1] as const;

export default function FeaturesThemed({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <section
      className="relative px-6 md:px-12 py-28 md:py-36"
      style={{
        background: theme.palette.bgMid,
        color: theme.palette.text,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p
            className="font-mono uppercase text-xs tracking-[0.3em] mb-4"
            style={{ color: theme.palette.accent, opacity: 0.85 }}
          >
            § Feature manifest
          </p>
          <h2
            className="font-display italic leading-[0.95] tracking-tight mb-14 md:mb-20"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}
          >
            What it actually does.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {theme.features.map((f, i) => (
            <motion.article
              key={i}
              className="border rounded-sm p-6 md:p-7"
              style={{
                borderColor: `${theme.palette.accent}33`,
                background: theme.palette.bg,
              }}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: EASE }}
              whileHover={reduce ? undefined : { y: -4 }}
            >
              <div
                className="font-mono text-[10px] tracking-[0.3em] mb-3 opacity-70"
                style={{ color: theme.palette.accent }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3
                className="font-display leading-[1.05] mb-3"
                style={{
                  fontSize: 'clamp(1.15rem, 1.5vw, 1.5rem)',
                  color: theme.palette.text,
                }}
              >
                {f.title}
              </h3>
              <p
                className="font-sans text-sm leading-relaxed"
                style={{ color: theme.palette.dim }}
              >
                {f.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
