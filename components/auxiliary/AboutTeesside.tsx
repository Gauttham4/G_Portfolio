'use client';

import { motion } from 'framer-motion';

export default function AboutTeesside() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28 md:py-36">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[auto,1fr] md:items-center md:gap-16">
        {/* Stamp */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -28 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -10 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: 'spring', stiffness: 220, damping: 14 }}
          className="mx-auto flex h-44 w-44 items-center justify-center rounded-sm border-[3px] border-amber bg-amber/5 md:h-56 md:w-56"
          style={{ boxShadow: '0 0 0 4px rgba(232,184,99,0.08) inset' }}
        >
          <div className="text-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-amber">
              UK · Campus
            </p>
            <p className="mt-2 font-display text-2xl italic leading-tight text-amber md:text-3xl">
              Teesside
            </p>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-amber">
              MSc · 2026
            </p>
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.4em] text-amber">
              ✓ Enrolled
            </p>
          </div>
        </motion.div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
            Act IV · Next chapter
          </p>
          <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-paper md:text-6xl lg:text-7xl">
            Teesside, <span className="italic text-amber">now.</span>
          </h2>
          <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-paper-dim md:text-lg">
            <strong className="text-paper">
              MSc in Digital Forensics and Cyber Investigation
            </strong>{' '}
            — Teesside University, Middlesbrough. Semester one is underway. The detective&apos;s co-pilot becomes the detective.
          </p>
        </div>
      </div>
    </section>
  );
}
