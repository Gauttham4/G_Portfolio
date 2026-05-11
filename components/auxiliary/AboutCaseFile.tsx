'use client';

import { motion } from 'framer-motion';

export default function AboutCaseFile() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-28 md:py-36">
      <motion.div
        initial={{ opacity: 0, x: -80, rotate: -1.5 }}
        whileInView={{ opacity: 1, x: 0, rotate: 1.5 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl glass-strong px-8 py-12 shadow-2xl shadow-ink/60 md:px-14 md:py-16"
      >
        {/* Torn top edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-3 h-4"
          style={{
            background:
              'repeating-linear-gradient(90deg, var(--color-ink) 0 14px, transparent 14px 28px)',
            maskImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 12' preserveAspectRatio='none'><path d='M0,6 Q15,0 30,6 T60,6 T90,6 T120,6 T150,6 T180,6 T210,6 T240,6 T270,6 T300,6 T330,6 T360,6 T390,6 T420,6 T450,6 T480,6 T510,6 T540,6 T570,6 T600,6 L600,12 L0,12 Z' fill='black'/></svg>\")",
            WebkitMaskImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 12' preserveAspectRatio='none'><path d='M0,6 Q15,0 30,6 T60,6 T90,6 T120,6 T150,6 T180,6 T210,6 T240,6 T270,6 T300,6 T330,6 T360,6 T390,6 T420,6 T450,6 T480,6 T510,6 T540,6 T570,6 T600,6 L600,12 L0,12 Z' fill='black'/></svg>\")",
          }}
        />

        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
          Cold open · The case file
        </p>

        <p className="mt-6 font-display text-2xl italic leading-[1.2] text-paper md:text-4xl lg:text-5xl">
          &ldquo;It started with a final-year project nobody asked me to build.&rdquo;
        </p>

        <div className="mt-10 max-w-2xl space-y-5 font-sans text-base leading-relaxed text-paper-dim md:text-lg">
          <p>
            I&apos;d been reading about how investigators drown in evidence — call records,
            statements, photographs, timelines that never line up — and I thought,{' '}
            <em>what if a detective had a co-pilot?</em>
          </p>
          <p>
            That became <strong className="text-paper">CrimeIntellX</strong> (working name CrimeLens AI).
            It got published in IJIRE. It also taught me the only thing that&apos;s mattered since:{' '}
            <strong className="text-paper">
              find a real problem, then ship the smallest tool that actually solves it.
            </strong>
          </p>
        </div>

        {/* Stamp */}
        <div className="absolute -right-2 top-8 hidden rotate-12 rounded-sm border-2 border-amber/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.35em] text-amber md:block">
          Case · Open
        </div>
      </motion.div>
    </section>
  );
}
