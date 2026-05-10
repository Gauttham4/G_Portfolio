'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import type { ProjectTheme } from '@/lib/project-themes';

const EASE = [0.22, 0.61, 0.36, 1] as const;

export default function ArchitectureThemed({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(true);
  return (
    <section
      className="relative px-6 md:px-12 py-28 md:py-36"
      style={{
        background: theme.palette.bg,
        color: theme.palette.text,
      }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-baseline gap-4 text-left mb-10"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span
            className="font-mono uppercase text-xs tracking-[0.3em]"
            style={{ color: theme.palette.accent }}
          >
            § The stack
          </span>
          <span
            className="ml-auto font-mono text-[10px] tracking-[0.25em] opacity-60"
            style={{ color: theme.palette.dim }}
          >
            {open ? '— collapse' : '+ expand'}
          </span>
        </motion.button>

        <h2
          className="font-display italic leading-[0.95] tracking-tight mb-12"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)' }}
        >
          How it is built.
        </h2>

        {open && (
          <ol className="border-t" style={{ borderColor: `${theme.palette.accent}33` }}>
            {theme.architecture.map((a, i) => (
              <motion.li
                key={i}
                className="grid grid-cols-12 gap-4 md:gap-8 py-6 md:py-8 border-b"
                style={{ borderColor: `${theme.palette.accent}33` }}
                initial={reduce ? false : { opacity: 0, x: -16 }}
                whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
              >
                <div
                  className="col-span-12 md:col-span-3 font-mono uppercase text-[10px] md:text-xs tracking-[0.3em]"
                  style={{ color: theme.palette.accent }}
                >
                  {String(i + 1).padStart(2, '0')} · {a.layer}
                </div>
                <div
                  className="col-span-12 md:col-span-9 font-sans text-base md:text-lg leading-relaxed"
                  style={{ color: theme.palette.text, opacity: 0.92 }}
                >
                  {a.details}
                </div>
              </motion.li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
