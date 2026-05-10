'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ProjectTheme } from '@/lib/project-themes';

const EASE = [0.22, 0.61, 0.36, 1] as const;

export default function StoryQuotesThemed({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <section
      className="relative px-6 md:px-12 py-28 md:py-40"
      style={{
        background: theme.palette.bg,
        color: theme.palette.text,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.p
          className="font-mono uppercase text-xs tracking-[0.3em] mb-12 md:mb-16"
          style={{ color: theme.palette.accent }}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={reduce ? undefined : { opacity: 0.85, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          § In their own words
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {theme.story.quotes.map((q, i) => (
            <motion.figure
              key={i}
              className="relative border rounded-sm p-7 md:p-9"
              style={{
                borderColor: `${theme.palette.accent}33`,
                background: `${theme.palette.bgMid}80`,
              }}
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.75, delay: i * 0.12, ease: EASE }}
            >
              <figcaption
                className="font-mono uppercase text-[10px] tracking-[0.35em] mb-5"
                style={{ color: theme.palette.accent, opacity: 0.85 }}
              >
                {q.kicker}
              </figcaption>
              <blockquote
                className="font-display italic leading-[1.08] tracking-tight"
                style={{ fontSize: 'clamp(1.25rem, 1.85vw, 1.85rem)' }}
              >
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <p
                className="mt-6 font-sans text-sm leading-relaxed"
                style={{ color: theme.palette.dim }}
              >
                {q.context}
              </p>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
