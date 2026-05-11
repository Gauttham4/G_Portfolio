'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '../NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = { theme: ProjectTheme };

// SpaceForge — Dense single-screen-first layout. No wasted vertical space.
export default function SpaceForgeDenseLayout({ theme }: Props) {
  const reduce = useReducedMotion();

  const PURPLE = '#6E00FF';
  const CYAN = '#00FFE0';
  const INK = '#0B0F1A';
  const PANEL = '#13182A';
  const TEXT = '#E8EAF2';
  const DIM = '#A7A9BE';

  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => {
        const seed = (i * 37 + 11) % 1000;
        return {
          left: (seed * 113) % 100,
          top: (seed * 71) % 100,
          size: 1 + (seed % 3),
          opacity: 0.3 + ((seed % 7) / 10),
          delay: (seed % 30) / 10,
        };
      }),
    [],
  );

  const gallery = theme.gallery ?? [];

  return (
    <main className="relative min-h-screen" style={{ background: INK, color: TEXT }}>
      {/* HERO — single fold */}
      <section className="relative overflow-hidden" style={{ minHeight: '100vh' }}>
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {stars.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: s.size,
                height: s.size,
                background: '#FFFFFF',
                opacity: reduce ? s.opacity : undefined,
                animation: reduce
                  ? undefined
                  : `sf-twinkle ${3 + s.delay}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 70% 30%, ${PURPLE}33 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 80%, ${CYAN}22 0%, transparent 65%)`,
          }}
        />

        <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-8 px-6 pt-24 pb-12 md:grid-cols-12 md:gap-10 md:px-12 md:pt-28 md:pb-16">
          {/* LEFT — title + meta + CTAs */}
          <div className="flex flex-col justify-center md:col-span-7">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="font-mono text-[10px] uppercase tracking-[0.5em]"
              style={{ color: CYAN }}
            >
              {String.fromCharCode(167)} Cinematic 3D · Vite · R3F
            </motion.p>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="mt-4 font-display tracking-tight"
              style={{
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                lineHeight: 0.92,
                fontWeight: 800,
                letterSpacing: '-0.025em',
              }}
            >
              Space
              <span style={{ color: PURPLE, fontStyle: 'italic' }}>Forge</span>
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="mt-5 max-w-xl font-display italic"
              style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.5rem)', lineHeight: 1.25, color: DIM }}
            >
              {theme.subtitle}
            </motion.p>

            <div
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.3em]"
              style={{ color: DIM }}
            >
              <span>
                <span style={{ color: CYAN }}>STACK</span> · React 19 + Vite
              </span>
              <span>
                <span style={{ color: CYAN }}>3D</span> · R3F + Spline
              </span>
              <span>
                <span style={{ color: CYAN }}>MOTION</span> · Framer 12
              </span>
              <span>
                <span style={{ color: CYAN }}>YEAR</span> · 2025
              </span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {theme.bigNumbers.slice(0, 4).map((n) => (
                <div
                  key={n.label}
                  className="rounded-sm border px-3 py-3"
                  style={{ borderColor: `${PURPLE}55`, background: `${PANEL}88` }}
                >
                  <p
                    className="font-display tabular-nums"
                    style={{
                      fontSize: 'clamp(1.2rem, 2.4vw, 2rem)',
                      lineHeight: 1,
                      color: CYAN,
                      fontWeight: 700,
                    }}
                  >
                    {n.value}
                  </p>
                  <p
                    className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.25em]"
                    style={{ color: DIM }}
                  >
                    {n.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-sm px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em]"
                style={{ background: PURPLE, color: '#FFFFFF' }}
              >
                Open the case
              </a>
              <Link
                href="/work"
                className="inline-flex items-center rounded-sm border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em]"
                style={{ borderColor: `${CYAN}55`, color: TEXT }}
              >
                All projects
              </Link>
            </div>
          </div>

          {/* RIGHT — hero plate */}
          <div className="relative md:col-span-5">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: EASE }}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-md"
              style={{ border: `1px solid ${PURPLE}55` }}
            >
              <Image
                src={theme.heroImage}
                alt="SpaceForge"
                fill
                priority
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
                style={{ filter: 'contrast(1.05) saturate(1.1)' }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, transparent 40%, ${INK}DD 100%)`,
                }}
              />
              <span className="absolute left-2 top-2 h-3 w-3 border-l border-t" style={{ borderColor: CYAN }} />
              <span className="absolute right-2 top-2 h-3 w-3 border-r border-t" style={{ borderColor: CYAN }} />
              <span className="absolute bottom-2 left-2 h-3 w-3 border-b border-l" style={{ borderColor: CYAN }} />
              <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r" style={{ borderColor: CYAN }} />
              <span
                className="absolute right-3 top-3 rounded-sm bg-black/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.3em]"
                style={{ color: CYAN }}
              >
                ACT IV · 03/28
              </span>
            </motion.div>
          </div>
        </div>

        <style jsx>{`
          @keyframes sf-twinkle {
            0%, 100% { opacity: 0.25; }
            50% { opacity: 0.9; }
          }
        `}</style>
      </section>

      {/* STORY — three compact quote cards */}
      <section className="px-6 py-16 md:px-12 md:py-24" style={{ background: PANEL }}>
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
            {String.fromCharCode(167)} Field notes
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {theme.story.quotes.map((q, i) => (
              <motion.div
                key={i}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rounded-md p-5 md:p-6"
                style={{ background: INK, border: `1px solid ${PURPLE}33` }}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: CYAN }}>
                  {q.kicker}
                </p>
                <p
                  className="mt-3 font-display italic"
                  style={{ fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)', lineHeight: 1.2, color: TEXT }}
                >
                  &ldquo;{q.quote}&rdquo;
                </p>
                <p className="mt-3 font-sans text-sm" style={{ color: DIM, lineHeight: 1.5 }}>
                  {q.context}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES — dense 3-col */}
      <section id="features" className="px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-baseline justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
              {String.fromCharCode(167)} The build
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: DIM }}>
              {theme.features.length} components
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {theme.features.map((f, i) => (
              <motion.article
                key={f.title}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="rounded-md p-5"
                style={{ background: PANEL, border: `1px solid ${PURPLE}33` }}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: CYAN }}>
                  C-{String(i + 1).padStart(2, '0')}
                </p>
                <h3
                  className="mt-2 font-display text-lg md:text-xl"
                  style={{ color: TEXT, fontWeight: 700 }}
                >
                  {f.title}
                </h3>
                <p className="mt-2 font-sans text-sm" style={{ color: DIM, lineHeight: 1.5 }}>
                  {f.desc}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ARCHITECTURE — tight strip */}
      <section className="px-6 py-16 md:px-12 md:py-20" style={{ background: PANEL }}>
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
            {String.fromCharCode(167)} Stack
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {theme.architecture.map((a, i) => (
              <motion.div
                key={a.layer}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="rounded-sm border-l-2 px-4 py-3"
                style={{ borderColor: PURPLE, background: `${INK}80` }}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: CYAN }}>
                  {a.layer}
                </p>
                <p className="mt-1.5 font-sans text-sm" style={{ color: TEXT, lineHeight: 1.4 }}>
                  {a.details}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY — dense mosaic */}
      {gallery.length > 0 && (
        <section className="px-6 py-16 md:px-12 md:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
              {String.fromCharCode(167)} Plates
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
              {gallery.map((g, i) => (
                <motion.div
                  key={g.src}
                  initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="relative aspect-video overflow-hidden rounded-sm"
                  style={{ border: `1px solid ${PURPLE}44` }}
                >
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.3em]"
                    style={{ background: `${INK}DD`, color: CYAN }}
                  >
                    {String(i + 1).padStart(2, '0')} · {g.caption}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* OUTCOME — compact pull quote */}
      <section
        className="px-6 py-20 md:px-12 md:py-28"
        style={{ background: `radial-gradient(ellipse at center, ${PURPLE}22 0%, ${INK} 70%)` }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
            {String.fromCharCode(167)} Outcome
          </p>
          <p
            className="mt-5 font-display italic"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              lineHeight: 1.15,
              color: TEXT,
              fontWeight: 600,
            }}
          >
            &ldquo;{theme.outcomeQuote}&rdquo;
          </p>
        </div>
      </section>

      <NextChapter currentSlug={theme.slug} accent={PURPLE} />
      <SiteFooter />
    </main>
  );
}
