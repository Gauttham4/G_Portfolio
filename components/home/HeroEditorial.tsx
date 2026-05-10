'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { easing } from '@/lib/motion-tokens';

const HEADLINE = ['I', 'build', 'products', 'people', 'actually', 'use.'];

export default function HeroEditorial() {
  const reduce = useReducedMotion();

  const wordVariants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 0.6,
        ease: easing.suitEject,
        delay: reduce ? 0 : i * 0.05,
      },
    }),
  };

  return (
    <section
      aria-label="Introduction"
      className="relative flex min-h-[100vh] w-full flex-col overflow-hidden bg-ink"
    >
      {/* ambient background reel — distant stage lighting bleeding in */}
      {!reduce && (
        <video
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-screen"
          style={{ filter: 'blur(2px) saturate(1.1)' }}
          src="/reels/hero-ambient.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />
      )}
      {/* vignette stack to keep type legible */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, var(--color-ink) 75%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />

      {/* Top-left signature */}
      <div className="absolute left-8 top-8 z-10">
        <span className="border-b border-amber/30 pb-1 font-mono text-[11px] uppercase tracking-[0.3em] text-amber">
          Gauttham R
        </span>
      </div>

      {/* Center stack */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-8 py-32 md:px-20">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.6, ease: easing.suitEject }}
          className="mb-10 font-mono text-[11px] uppercase tracking-[0.3em] text-amber/70 md:text-xs"
        >
          Engineer  ·  28 shipped projects  ·  Incoming MS · Portsmouth
        </motion.p>

        <h1
          className="font-display text-paper"
          style={{
            fontSize: 'clamp(3.5rem, 10vw, 12rem)',
            lineHeight: 0.92,
            letterSpacing: '-0.02em',
            fontWeight: 400,
            textShadow: '0 2px 24px rgba(0,0,0,0.55)',
          }}
        >
          {HEADLINE.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              custom={i}
              initial="hidden"
              animate="show"
              variants={wordVariants}
              className="inline-block"
            >
              {word}
              {i < HEADLINE.length - 1 && ' '}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.7,
            ease: easing.suitEject,
            delay: reduce ? 0 : 0.4 + HEADLINE.length * 0.05,
          }}
          className="mt-8 max-w-2xl font-sans text-lg text-paper-dim md:text-xl"
        >
          Engineer at THEELABS. Twenty-eight projects across AI, edtech,
          finance, safety, and field operations. One rule — pick the smallest
          tool that solves the real problem, and ship it.
        </motion.p>
      </div>

      {/* Bottom-left scroll cue */}
      <div className="absolute bottom-8 left-8 z-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper-dim">
          <motion.span
            aria-hidden
            className="text-amber"
            animate={reduce ? {} : { opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            ↓
          </motion.span>{' '}
          Scroll
        </span>
      </div>

      {/* Bottom-right dateline */}
      <div className="absolute bottom-8 right-8 z-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper-dim">
          Puducherry · IN · 2026
        </span>
      </div>
    </section>
  );
}
