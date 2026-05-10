'use client';

// 4 layout strategies for themed project pages.
//
// A · "Product Launch"  — alternating image-text rows, big bento stat tiles, manifesto.
// B · "Case Study"      — pinned 3-step (Challenge / Approach / Outcome) + film-strip gallery.
// C · "Editorial"       — drop-cap, pull-quotes, image-text rhythm, sidebar metadata.
// D · "Hacker Dossier"  — terminal hero, spec table, feature checklist tick, logs panel.
//
// Each variant renders an entire themed project page (hero -> outro). They all consume
// the same ProjectTheme shape so dispatch from ThemedProjectPage is trivial.

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect, useMemo, type CSSProperties } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '../NextChapter';
import SiteFooter from '@/components/global/SiteFooter';
import HeroSlideshow from './HeroSlideshow';
import AnimatedHeading from '@/components/motion/AnimatedHeading';

const EASE = [0.22, 1, 0.36, 1] as const;

// Round helper to avoid hydration mismatches on Math.* output.
const r3 = (n: number) => Math.round(n * 1000) / 1000;

type Props = { theme: ProjectTheme };

// --------------------------------------------------------------------------
// A · PRODUCT LAUNCH
// --------------------------------------------------------------------------

export function ProductLaunchLayout({ theme }: Props) {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroProg } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroProg, [0, 1], reduce ? [0, 0] : [0, 160]);
  const heroScale = useTransform(heroProg, [0, 1], reduce ? [1, 1] : [1.05, 1.18]);

  const galleryImgs = (theme.gallery ?? []).slice(0, 6);
  const altRows = galleryImgs.slice(0, 3);

  return (
    <main
      className="relative min-h-screen"
      style={{
        background: theme.palette.bg,
        color: theme.palette.text,
      }}
    >
      {/* HERO — full-bleed with parallax + spec pills */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ minHeight: '100vh' }}
      >
        <HeroSlideshow slug={theme.slug} />
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <Image
            src={theme.heroImage}
            alt={theme.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, ${theme.palette.bg}55 0%, ${theme.palette.bg}80 60%, ${theme.palette.bg} 100%)`,
            }}
          />
        </motion.div>

        <div className="relative z-10 mx-auto flex min-h-[100vh] max-w-7xl flex-col justify-end px-6 pb-20 pt-32 md:px-12 md:pb-28">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-mono text-[10px] uppercase tracking-[0.4em]"
            style={{ color: theme.palette.accent }}
          >
            {theme.kicker}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="mt-6 font-display tracking-tight"
            style={{
              fontSize: 'clamp(2.25rem, 9vw, 8rem)',
              lineHeight: 0.92,
              color: theme.palette.text,
            }}
          >
            {theme.title}
            <span style={{ color: theme.palette.accent }}>.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22, ease: EASE }}
            className="mt-8 max-w-3xl font-display text-2xl italic md:text-3xl"
            style={{ color: theme.palette.dim }}
          >
            {theme.subtitle}
          </motion.p>

          {/* spec pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            className="mt-12 flex flex-wrap gap-2"
          >
            {theme.bigNumbers.slice(0, 4).map((n) => (
              <span
                key={n.label}
                className="inline-flex items-center gap-2 rounded-sm px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{
                  border: `1px solid ${theme.palette.accent}55`,
                  color: theme.palette.text,
                  background: `${theme.palette.accent}10`,
                }}
              >
                <span style={{ color: theme.palette.dim }}>{n.label}</span>
                <span style={{ color: theme.palette.accent }}>·</span>
                <span style={{ color: theme.palette.accent }}>{n.value}</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SIGNATURE — careervisionx gets a unique path-branch SVG hero accent
          so the page doesn't feel like a generic ProductLaunch swap. */}
      {theme.slug === 'careervisionx' ? (
        <section
          className="relative overflow-hidden"
          style={{
            background: theme.palette.bgMid,
            borderTop: `1px solid ${theme.palette.accent}22`,
            borderBottom: `1px solid ${theme.palette.accent}22`,
          }}
        >
          <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-5">
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.4em]"
                  style={{ color: theme.palette.accent }}
                >
                  § The fork
                </p>
                <h2
                  className="mt-5 font-display tracking-tight"
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    color: theme.palette.text,
                    lineHeight: 1.02,
                  }}
                >
                  Three honest paths&nbsp;<span style={{ color: theme.palette.accent }}>—</span>{' '}
                  not the same five jobs for everyone.
                </h2>
                <p
                  className="mt-6 max-w-md font-sans text-base md:text-lg"
                  style={{ color: theme.palette.dim }}
                >
                  Engineering, research, founder. The mentor scores categorically, then sketches
                  a path you can actually walk.
                </p>
              </div>
              <div className="relative md:col-span-7">
                <CareerVisionXPathBranchSignature theme={theme} />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ALT ROWS — image / text pairs */}
      <section className="px-6 py-24 md:px-12 md:py-36">
        <div className="mx-auto max-w-7xl space-y-28 md:space-y-40">
          {theme.story.quotes.map((q, i) => {
            const img = altRows[i % Math.max(1, altRows.length)];
            const isEven = i % 2 === 0;
            return (
              <div
                key={q.kicker}
                className={`grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-16 ${
                  isEven ? '' : 'md:[&>*:first-child]:order-2'
                }`}
              >
                <motion.div
                  className="md:col-span-6"
                  initial={{ opacity: 0, x: isEven ? -80 : 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-15% 0px' }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  {img ? (
                    <div
                      className="relative aspect-[4/3] w-full overflow-hidden rounded-md"
                      style={{ border: `1px solid ${theme.palette.accent}33` }}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="aspect-[4/3] w-full rounded-md"
                      style={{ background: `${theme.palette.accent}15` }}
                    />
                  )}
                </motion.div>

                <motion.div
                  className="md:col-span-6"
                  initial={{ opacity: 0, x: isEven ? 80 : -80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-15% 0px' }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  <p
                    className="font-mono text-[10px] uppercase tracking-[0.4em]"
                    style={{ color: theme.palette.accent }}
                  >
                    {q.kicker}
                  </p>
                  <p
                    className="mt-5 font-display text-2xl leading-tight md:text-4xl"
                    style={{ color: theme.palette.text }}
                  >
                    {q.quote}
                  </p>
                  <p
                    className="mt-6 max-w-prose font-sans text-sm md:text-base"
                    style={{ color: theme.palette.dim }}
                  >
                    {q.context}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* BENTO BIG STATS */}
      <section
        className="px-6 py-24 md:px-12 md:py-36"
        style={{
          background: theme.palette.bgMid,
          borderTop: `1px solid ${theme.palette.accent}22`,
          borderBottom: `1px solid ${theme.palette.accent}22`,
        }}
      >
        <div className="mx-auto max-w-7xl">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.4em]"
            style={{ color: theme.palette.accent }}
          >
            By the numbers
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-6 md:grid-rows-2">
            {theme.bigNumbers.slice(0, 4).map((n, i) => {
              // bento sizing: 0 -> 3x2, 1 -> 3x1, 2 -> 2x1, 3 -> 4x1 (degrades on mobile)
              const span = ['md:col-span-3 md:row-span-2', 'md:col-span-3', 'md:col-span-2', 'md:col-span-4'][i] || 'md:col-span-3';
              return (
                <motion.div
                  key={i}
                  className={`flex flex-col justify-end rounded-md p-6 md:p-10 ${span}`}
                  style={{
                    background: `${theme.palette.accent}10`,
                    border: `1px solid ${theme.palette.accent}33`,
                    minHeight: i === 0 ? 280 : 160,
                  }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                >
                  <div
                    className="font-display leading-[0.85] tracking-tight"
                    style={{
                      color: theme.palette.accent,
                      fontSize: i === 0 ? 'clamp(2.5rem, 9vw, 7rem)' : 'clamp(2rem, 5vw, 4rem)',
                    }}
                  >
                    {n.value}
                  </div>
                  <div
                    className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em]"
                    style={{ color: theme.palette.dim }}
                  >
                    {n.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="px-6 py-24 md:px-12 md:py-36">
        <div className="mx-auto max-w-7xl">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.4em]"
            style={{ color: theme.palette.accent }}
          >
            Highlights
          </p>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {theme.features.slice(0, 6).map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                className="rounded-md p-6"
                style={{
                  border: `1px solid ${theme.palette.accent}25`,
                  background: `${theme.palette.accent}07`,
                }}
              >
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: theme.palette.accent }}
                >
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 font-display text-xl md:text-2xl">{f.title}</h3>
                <p
                  className="mt-3 font-sans text-sm md:text-base"
                  style={{ color: theme.palette.dim }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section
        className="px-6 py-32 md:px-12 md:py-44"
        style={{ background: theme.palette.bgMid }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.9, ease: EASE }}
            className="font-display italic leading-[1.1]"
            style={{
              fontSize: 'clamp(2rem, 6vw, 5rem)',
              color: theme.palette.text,
            }}
          >
            &ldquo;{theme.outcomeQuote}&rdquo;
          </motion.p>
        </div>
      </section>

      <NextChapter currentSlug={theme.slug} accent={theme.palette.accent} />
      <SiteFooter />
    </main>
  );
}

// --------------------------------------------------------------------------
// B · CASE STUDY
// --------------------------------------------------------------------------

export function CaseStudyLayout({ theme }: Props) {
  const reduce = useReducedMotion();
  const stepsRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: stepsProg } = useScroll({
    target: stepsRef,
    offset: ['start start', 'end end'],
  });

  // Sharp, non-overlapping opacity windows per step. Each step holds for ~28%
  // of scroll, with a tight 4% cross-fade so two steps are never both visible.
  // Step 1: 0.00 -> 0.30 visible, fades out by 0.34
  // Step 2: 0.34 -> 0.64 visible (in 0.34-0.38, out 0.64-0.68)
  // Step 3: 0.68 -> 1.00 visible
  const step1Op = useTransform(stepsProg, [0.00, 0.02, 0.30, 0.34], [1, 1, 1, 0]);
  const step2Op = useTransform(stepsProg, [0.30, 0.34, 0.64, 0.68], [0, 1, 1, 0]);
  const step3Op = useTransform(stepsProg, [0.64, 0.68, 1.00, 1.00], [0, 1, 1, 1]);

  const step1Tab = useTransform(step1Op, (v) => 0.35 + v * 0.65);
  const step2Tab = useTransform(step2Op, (v) => 0.35 + v * 0.65);
  const step3Tab = useTransform(step3Op, (v) => 0.35 + v * 0.65);

  const stepKeys = [
    { kicker: 'Challenge', src: theme.story.quotes[0] },
    { kicker: 'Approach', src: theme.story.quotes[1] },
    { kicker: 'Outcome', src: theme.story.quotes[2] },
  ];
  const stepOps = [step1Op, step2Op, step3Op] as const;
  const stepTabs = [step1Tab, step2Tab, step3Tab] as const;

  // Filmstrip — horizontal scroll-driven
  const stripRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: stripProg } = useScroll({
    target: stripRef,
    offset: ['start end', 'end start'],
  });
  const stripX = useTransform(stripProg, [0, 1], reduce ? ['0%', '0%'] : ['10%', '-50%']);

  return (
    <main
      className="relative min-h-screen"
      style={{ background: theme.palette.bg, color: theme.palette.text }}
    >
      {/* HERO — kicker + thesis + CTA */}
      <section className="relative overflow-hidden px-6 py-32 md:px-12 md:py-48">
        <HeroSlideshow slug={theme.slug} />
        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] uppercase tracking-[0.4em]"
            style={{ color: theme.palette.accent }}
          >
            {theme.kicker}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="mt-6 font-display tracking-tight"
            style={{
              fontSize: 'clamp(2rem, 7vw, 6.5rem)',
              lineHeight: 1,
            }}
          >
            {theme.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="mt-8 max-w-3xl font-display text-2xl italic md:text-3xl"
            style={{ color: theme.palette.dim }}
          >
            {theme.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex flex-wrap gap-4"
          >
            <a
              href="#case"
              className="inline-flex items-center justify-center rounded-md px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors"
              style={{
                background: theme.palette.accent,
                color: theme.palette.bg,
              }}
            >
              Read the case →
            </a>
            <Link
              href="/work"
              className="inline-flex items-center justify-center rounded-md px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em]"
              style={{
                border: `1px solid ${theme.palette.accent}55`,
                color: theme.palette.text,
              }}
            >
              All projects
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PINNED 3-STEP */}
      <div id="case" ref={stepsRef} className="relative" style={{ height: '300vh' }}>
        <div className="sticky top-0 flex h-screen w-full items-center justify-center px-6 md:px-12">
          <div className="relative mx-auto w-full max-w-6xl">
            <div className="mb-10 flex gap-4 font-mono text-[10px] uppercase tracking-[0.3em]">
              {stepKeys.map((s, i) => (
                <motion.span
                  key={s.kicker}
                  style={{
                    opacity: stepTabs[i],
                    color: theme.palette.accent,
                  }}
                >
                  {String(i + 1).padStart(2, '0')} · {s.kicker}
                </motion.span>
              ))}
            </div>
            {stepKeys.map((s, i) => (
              <motion.div
                key={s.kicker}
                style={{ opacity: stepOps[i] }}
                className="absolute inset-x-0 top-12"
              >
                {/* Opaque card so a step never bleeds through underneath */}
                <div
                  className="rounded-sm p-8 md:p-12 backdrop-blur-sm"
                  style={{
                    background: `${theme.palette.bg}F2`,
                    border: `1px solid ${theme.palette.accent}1F`,
                  }}
                >
                  <p
                    className="font-mono text-[10px] uppercase tracking-[0.4em]"
                    style={{ color: theme.palette.accent }}
                  >
                    Step {String(i + 1).padStart(2, '0')} — {s.kicker}
                  </p>
                  <p
                    className="mt-6 font-display leading-[1.05] tracking-tight"
                    style={{
                      fontSize: 'clamp(2rem, 6vw, 5rem)',
                      color: theme.palette.text,
                    }}
                  >
                    {s.src?.quote ?? ''}
                  </p>
                  <p
                    className="mt-6 max-w-3xl font-sans text-base md:text-lg"
                    style={{ color: theme.palette.dim }}
                  >
                    {s.src?.context ?? ''}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FILM STRIP gallery */}
      {theme.gallery && theme.gallery.length > 0 ? (
        <section ref={stripRef} className="overflow-hidden py-24 md:py-32">
          <p
            className="px-6 font-mono text-[10px] uppercase tracking-[0.4em] md:px-12"
            style={{ color: theme.palette.accent }}
          >
            Field
          </p>
          <motion.div className="mt-10 flex gap-6 will-change-transform" style={{ x: stripX }}>
            {theme.gallery.map((g, i) => (
              <div
                key={g.src}
                className="relative h-[60vh] flex-shrink-0 overflow-hidden rounded-md"
                style={{
                  width: 'min(70vw, 540px)',
                  border: `1px solid ${theme.palette.accent}33`,
                }}
              >
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="540px"
                  className="object-cover"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{
                    background: `linear-gradient(to top, ${theme.palette.bg} 0%, transparent 100%)`,
                    color: theme.palette.dim,
                  }}
                >
                  {String(i + 1).padStart(2, '0')} · {g.caption}
                </div>
              </div>
            ))}
          </motion.div>
        </section>
      ) : null}

      {/* KEY FINDINGS list */}
      <section className="px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-5xl">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.4em]"
            style={{ color: theme.palette.accent }}
          >
            Key findings
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight md:text-5xl">
            What the case file shows.
          </h2>
          <ol
            className="mt-12 space-y-8 border-t pt-10"
            style={{ borderColor: `${theme.palette.accent}33` }}
          >
            {theme.features.slice(0, 5).map((f, i) => (
              <motion.li
                key={f.title}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className="grid grid-cols-[auto_1fr] gap-x-8 md:grid-cols-[auto_auto_1fr] md:gap-x-10"
              >
                <span
                  className="font-mono text-2xl md:text-4xl"
                  style={{ color: theme.palette.accent }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="font-display text-xl md:text-3xl"
                  style={{ color: theme.palette.text }}
                >
                  {f.title}
                </span>
                <p
                  className="col-span-2 mt-2 font-sans text-sm md:col-span-1 md:mt-0 md:text-base"
                  style={{ color: theme.palette.dim }}
                >
                  {f.desc}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* OUTCOME */}
      <section
        className="px-6 py-32 md:px-12 md:py-44"
        style={{ background: theme.palette.bgMid }}
      >
        <div className="mx-auto max-w-4xl">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.4em]"
            style={{ color: theme.palette.accent }}
          >
            Outcome
          </p>
          <p
            className="mt-6 font-display italic leading-[1.1]"
            style={{
              fontSize: 'clamp(1.8rem, 5vw, 4rem)',
              color: theme.palette.text,
            }}
          >
            &ldquo;{theme.outcomeQuote}&rdquo;
          </p>
        </div>
      </section>

      <NextChapter currentSlug={theme.slug} accent={theme.palette.accent} />
      <SiteFooter />
    </main>
  );
}

// --------------------------------------------------------------------------
// C · EDITORIAL
// --------------------------------------------------------------------------

export function EditorialLayout({ theme }: Props) {
  const galleryImgs = theme.gallery ?? [];

  // Drop-cap reveal on first paragraph by character.
  const firstQuote = theme.story.quotes[0]?.quote ?? '';

  return (
    <main
      className="relative min-h-screen"
      style={{ background: theme.palette.bg, color: theme.palette.text }}
    >
      {/* MASTHEAD */}
      <section className="relative overflow-hidden px-6 pt-40 pb-12 md:px-12" style={{ minHeight: '100vh' }}>
        <HeroSlideshow slug={theme.slug} />
        <div className="relative z-10 mx-auto max-w-5xl">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.5em]"
            style={{ color: theme.palette.accent }}
          >
            {theme.kicker}
          </p>
          <AnimatedHeading
            as="h1"
            mode="letters"
            text={theme.title}
            delay={0.15}
            className="mt-8 font-display tracking-tight"
            style={{
              fontSize: 'clamp(2rem, 8vw, 7rem)',
              lineHeight: 0.95,
            }}
          />
          <p
            className="mt-8 max-w-3xl font-display text-xl italic md:text-3xl"
            style={{ color: theme.palette.dim }}
          >
            {theme.subtitle}
          </p>
          <div
            className="mt-10 flex items-center gap-3 border-y py-3 font-mono text-[10px] uppercase tracking-[0.3em]"
            style={{
              borderColor: `${theme.palette.accent}33`,
              color: theme.palette.dim,
            }}
          >
            <span style={{ color: theme.palette.accent }}>By Gauttham R</span>
            <span>·</span>
            <span>{theme.bigNumbers[0]?.value} {theme.bigNumbers[0]?.label}</span>
            <span>·</span>
            <span>FEATURE</span>
          </div>
        </div>
      </section>

      {/* BODY w/ SIDEBAR */}
      <section className="px-6 py-12 md:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-12">
          {/* SIDEBAR meta */}
          <aside
            className="md:col-span-3"
            style={{ borderTop: `1px solid ${theme.palette.accent}33` }}
          >
            <div className="space-y-6 pt-6">
              <div>
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: theme.palette.accent }}
                >
                  Stack
                </p>
                <ul
                  className="mt-3 space-y-1 font-sans text-sm"
                  style={{ color: theme.palette.dim }}
                >
                  {theme.architecture.slice(0, 4).map((a) => (
                    <li key={a.layer}>
                      <span style={{ color: theme.palette.text }}>{a.layer}</span> — {a.details}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: theme.palette.accent }}
                >
                  By the numbers
                </p>
                <ul
                  className="mt-3 space-y-2 font-mono text-xs"
                  style={{ color: theme.palette.dim }}
                >
                  {theme.bigNumbers.map((n) => (
                    <li key={n.label} className="flex items-baseline justify-between gap-3">
                      <span style={{ color: theme.palette.text }}>{n.label}</span>
                      <span style={{ color: theme.palette.accent }}>{n.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* BODY */}
          <article className="md:col-span-9">
            {/* Drop-cap opener */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="font-display text-xl leading-relaxed md:text-2xl"
              style={{ color: theme.palette.text }}
            >
              <span
                className="float-left mr-3 mt-1 font-display leading-[0.85]"
                style={{
                  fontSize: 'clamp(2.75rem, 9vw, 7rem)',
                  color: theme.palette.accent,
                }}
              >
                {firstQuote.charAt(0)}
              </span>
              {firstQuote.slice(1)}
            </motion.p>

            {/* Image break 1 */}
            {galleryImgs[0] ? (
              <motion.figure
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 0.9, ease: EASE }}
                className="my-14"
              >
                <div
                  className="relative aspect-[16/10] w-full overflow-hidden rounded-md"
                  style={{ border: `1px solid ${theme.palette.accent}33` }}
                >
                  <Image
                    src={galleryImgs[0].src}
                    alt={galleryImgs[0].alt}
                    fill
                    sizes="(min-width: 768px) 70vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption
                  className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: theme.palette.dim }}
                >
                  {galleryImgs[0].caption}
                </figcaption>
              </motion.figure>
            ) : null}

            {/* Pull-quote 1 */}
            <motion.blockquote
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="my-14 border-l-4 pl-6 font-display italic leading-tight"
              style={{
                borderColor: theme.palette.accent,
                fontSize: 'clamp(1.6rem, 4vw, 3rem)',
                color: theme.palette.text,
              }}
            >
              &ldquo;{theme.story.quotes[1]?.quote ?? ''}&rdquo;
            </motion.blockquote>

            {/* Body para */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="mt-8 font-sans text-base leading-relaxed md:text-lg"
              style={{ color: theme.palette.dim }}
            >
              {theme.story.quotes[1]?.context ?? ''}
            </motion.p>

            {/* Image break 2 */}
            {galleryImgs[1] ? (
              <motion.figure
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 0.9, ease: EASE }}
                className="my-14"
              >
                <div
                  className="relative aspect-[3/2] w-full overflow-hidden rounded-md"
                  style={{ border: `1px solid ${theme.palette.accent}33` }}
                >
                  <Image
                    src={galleryImgs[1].src}
                    alt={galleryImgs[1].alt}
                    fill
                    sizes="(min-width: 768px) 70vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption
                  className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: theme.palette.dim }}
                >
                  {galleryImgs[1].caption}
                </figcaption>
              </motion.figure>
            ) : null}

            {/* Pull-quote 2 */}
            <motion.blockquote
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="my-14 border-r-4 pr-6 text-right font-display italic leading-tight"
              style={{
                borderColor: theme.palette.accent,
                fontSize: 'clamp(1.6rem, 4vw, 3rem)',
                color: theme.palette.text,
              }}
            >
              &ldquo;{theme.story.quotes[2]?.quote ?? ''}&rdquo;
            </motion.blockquote>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="mt-8 font-sans text-base leading-relaxed md:text-lg"
              style={{ color: theme.palette.dim }}
            >
              {theme.story.quotes[2]?.context ?? ''}
            </motion.p>

            {/* Highlights */}
            <div
              className="mt-16 border-t pt-10"
              style={{ borderColor: `${theme.palette.accent}33` }}
            >
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: theme.palette.accent }}
              >
                Highlights
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                {theme.features.slice(0, 6).map((f, i) => (
                  <motion.li
                    key={f.title}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                    className="rounded-md p-4"
                    style={{
                      border: `1px solid ${theme.palette.accent}25`,
                      background: `${theme.palette.accent}05`,
                    }}
                  >
                    <p className="font-display text-lg" style={{ color: theme.palette.text }}>
                      {f.title}
                    </p>
                    <p
                      className="mt-1 font-sans text-sm"
                      style={{ color: theme.palette.dim }}
                    >
                      {f.desc}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>

      {/* CLOSER */}
      <section className="px-6 py-32 md:px-12 md:py-44">
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="font-display italic leading-[1.1]"
            style={{
              fontSize: 'clamp(1.8rem, 5vw, 4rem)',
              color: theme.palette.text,
            }}
          >
            &ldquo;{theme.outcomeQuote}&rdquo;
          </p>
        </div>
      </section>

      <NextChapter currentSlug={theme.slug} accent={theme.palette.accent} />
      <SiteFooter />
    </main>
  );
}

// --------------------------------------------------------------------------
// D · HACKER DOSSIER
// --------------------------------------------------------------------------

const TERMINAL_LINES_FOR = (theme: ProjectTheme) => [
  `$ open ./${theme.slug}/`,
  `> loading dossier...`,
  `> palette ${theme.palette.accent} confirmed`,
  `> ${theme.bigNumbers[0]?.label ?? 'metric'}: ${theme.bigNumbers[0]?.value ?? '0'}`,
  `$ deploy --target ${theme.slug}`,
  `> [ok] ${theme.title} online`,
];

function TerminalHero({ theme }: Props) {
  const lines = TERMINAL_LINES_FOR(theme);
  const [shown, setShown] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    let i = 0;
    setShown([]);
    const tick = () => {
      if (cancelled) return;
      setShown((s) => [...s, lines[i] || '']);
      i += 1;
      if (i < lines.length) setTimeout(tick, 320);
    };
    setTimeout(tick, 250);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.slug]);

  return (
    <section
      className="relative w-full overflow-hidden px-6 pt-32 pb-20 md:px-12 md:pt-48 md:pb-28"
      style={{ minHeight: '92vh' }}
    >
      <HeroSlideshow slug={theme.slug} />
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.4em]"
            style={{ color: theme.palette.accent }}
          >
            {theme.kicker}
          </p>
          <h1
            className="mt-6 font-mono tracking-tight"
            style={{
              fontSize: 'clamp(2.6rem, 7vw, 6rem)',
              lineHeight: 1,
              color: theme.palette.text,
            }}
          >
            <AnimatedHeading
              as="span"
              mode="letters"
              text={theme.title}
              delay={0.1}
              className="inline-block"
            />
            <span style={{ color: theme.palette.accent }}>_</span>
          </h1>
          <p
            className="mt-8 max-w-2xl font-display text-2xl italic md:text-3xl"
            style={{ color: theme.palette.dim }}
          >
            {theme.subtitle}
          </p>
        </div>

        <div className="md:col-span-5">
          <div
            className="rounded-md p-5 font-mono text-[12px] leading-[1.7] md:text-sm"
            style={{
              background: `${theme.palette.bgMid}`,
              border: `1px solid ${theme.palette.accent}55`,
              color: theme.palette.text,
              boxShadow: `0 0 0 1px ${theme.palette.accent}22, 0 30px 60px -20px ${theme.palette.accent}33`,
            }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: '#FF5F56' }}
              />
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: '#FFBD2E' }}
              />
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: '#27C93F' }}
              />
              <span
                className="ml-3 text-[10px] uppercase tracking-[0.3em]"
                style={{ color: theme.palette.dim }}
              >
                {theme.slug}@dossier — zsh
              </span>
            </div>
            {shown.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                style={{
                  color: line.startsWith('>')
                    ? theme.palette.dim
                    : theme.palette.accent,
                }}
              >
                {line}
              </motion.div>
            ))}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
              style={{ color: theme.palette.accent }}
            >
              ▍
            </motion.span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HackerDossierLayout({ theme }: Props) {
  return (
    <main
      className="relative min-h-screen"
      style={{ background: theme.palette.bg, color: theme.palette.text }}
    >
      <TerminalHero theme={theme} />

      {/* SPEC TABLE — pinned-ish via sticky */}
      <section className="px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <p
                className="font-mono text-[10px] uppercase tracking-[0.4em]"
                style={{ color: theme.palette.accent }}
              >
                Spec sheet
              </p>
              <h2 className="mt-4 font-display text-3xl tracking-tight md:text-5xl">
                Architecture, in plain text.
              </h2>
              <p
                className="mt-4 max-w-md font-sans text-sm"
                style={{ color: theme.palette.dim }}
              >
                Every layer that runs in production. No hand-waving.
              </p>
            </div>
          </div>
          <div className="md:col-span-8">
            <div
              className="rounded-md font-mono text-sm"
              style={{
                background: `${theme.palette.bgMid}`,
                border: `1px solid ${theme.palette.accent}33`,
              }}
            >
              {theme.architecture.map((a, i) => (
                <motion.div
                  key={a.layer}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                  className="grid grid-cols-1 gap-2 p-5 md:grid-cols-[160px_1fr] md:gap-6"
                  style={{
                    borderTop: i === 0 ? 'none' : `1px solid ${theme.palette.accent}22`,
                  }}
                >
                  <div
                    className="text-[10px] uppercase tracking-[0.3em]"
                    style={{ color: theme.palette.accent }}
                  >
                    {String(i + 1).padStart(2, '0')} · {a.layer}
                  </div>
                  <div style={{ color: theme.palette.text }}>{a.details}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CHECKLIST */}
      <section
        className="px-6 py-24 md:px-12 md:py-32"
        style={{ background: theme.palette.bgMid }}
      >
        <div className="mx-auto max-w-6xl">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.4em]"
            style={{ color: theme.palette.accent }}
          >
            Feature checklist
          </p>
          <ul className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2">
            {theme.features.map((f, i) => (
              <motion.li
                key={f.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
                className="flex items-start gap-4 rounded-md p-4 font-mono text-sm"
                style={{
                  background: `${theme.palette.accent}07`,
                  border: `1px solid ${theme.palette.accent}25`,
                }}
              >
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: EASE }}
                  className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm"
                  style={{
                    background: theme.palette.accent,
                    color: theme.palette.bg,
                  }}
                >
                  ✓
                </motion.span>
                <div>
                  <div
                    className="font-display text-base md:text-lg"
                    style={{ color: theme.palette.text }}
                  >
                    {f.title}
                  </div>
                  <div
                    className="mt-1 font-sans text-sm"
                    style={{ color: theme.palette.dim }}
                  >
                    {f.desc}
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* LOGS + OUTCOMES */}
      <section className="px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.4em]"
              style={{ color: theme.palette.accent }}
            >
              Logs
            </p>
            <div
              className="mt-6 rounded-md p-5 font-mono text-[12px] leading-[1.85] md:text-sm"
              style={{
                background: `${theme.palette.bgMid}`,
                border: `1px solid ${theme.palette.accent}33`,
              }}
            >
              {theme.story.quotes.map((q, i) => (
                <motion.div
                  key={q.kicker}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <span style={{ color: theme.palette.accent }}>
                    [{String(i + 1).padStart(2, '0')}:{r3(12 + i * 4.7)}s]
                  </span>{' '}
                  <span style={{ color: theme.palette.text }}>{q.quote}</span>
                  <div
                    className="ml-6 mt-1 italic"
                    style={{ color: theme.palette.dim }}
                  >
                    -- {q.context}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.4em]"
              style={{ color: theme.palette.accent }}
            >
              Outcomes
            </p>
            <div className="mt-6 space-y-3">
              {theme.bigNumbers.map((n) => (
                <motion.div
                  key={n.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex items-baseline justify-between rounded-md p-4 font-mono"
                  style={{
                    background: `${theme.palette.accent}10`,
                    border: `1px solid ${theme.palette.accent}33`,
                  }}
                >
                  <span
                    className="text-[10px] uppercase tracking-[0.3em]"
                    style={{ color: theme.palette.dim }}
                  >
                    {n.label}
                  </span>
                  <span
                    className="font-display text-2xl md:text-3xl"
                    style={{ color: theme.palette.accent }}
                  >
                    {n.value}
                  </span>
                </motion.div>
              ))}
            </div>
            <div
              className="mt-6 rounded-md p-5 font-mono text-xs"
              style={{
                background: `${theme.palette.accent}10`,
                border: `1px dashed ${theme.palette.accent}55`,
                color: theme.palette.text,
              }}
            >
              <span style={{ color: theme.palette.accent }}>echo &gt;</span>{' '}
              {theme.outcomeQuote}
            </div>
          </div>
        </div>
      </section>

      <NextChapter currentSlug={theme.slug} accent={theme.palette.accent} />
      <SiteFooter />
    </main>
  );
}

// --------------------------------------------------------------------------
// Dispatcher
// --------------------------------------------------------------------------

export type LayoutKey = 'A' | 'B' | 'C' | 'D';

// --------------------------------------------------------------------------
// CareerVisionX signature — three-fork path branch SVG. Lines draw on as the
// section enters viewport via Framer Motion's `pathLength` 0 -> 1.
// --------------------------------------------------------------------------

function CareerVisionXPathBranchSignature({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  // Three forks fanning from a single trunk: left = Engineering, center = Research, right = Founder.
  const labelStyle: CSSProperties = {
    fontFamily: 'ui-monospace, monospace',
    fontSize: 3,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    fill: theme.palette.dim,
  };
  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-md"
      style={{
        border: `1px solid ${theme.palette.accent}33`,
        background: `linear-gradient(160deg, ${theme.palette.bg} 0%, ${theme.palette.bgMid} 100%)`,
      }}
    >
      <svg
        viewBox="0 0 100 75"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {/* Trunk */}
        <motion.line
          x1="50" y1="72" x2="50" y2="42"
          stroke={theme.palette.accent}
          strokeWidth="0.6"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={reduce ? undefined : { pathLength: 1 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
        />
        {/* Left branch — Engineering */}
        <motion.path
          d="M 50 42 C 38 36 26 30 14 18"
          stroke={theme.palette.accent}
          strokeWidth="0.5"
          fill="none"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={reduce ? undefined : { pathLength: 1 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 1.2, delay: 0.6, ease: EASE }}
        />
        {/* Center branch — Research */}
        <motion.path
          d="M 50 42 L 50 10"
          stroke={theme.palette.accent}
          strokeWidth="0.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="1.2 1.2"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={reduce ? undefined : { pathLength: 1 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 1.2, delay: 0.85, ease: EASE }}
        />
        {/* Right branch — Founder */}
        <motion.path
          d="M 50 42 C 62 36 74 30 86 18"
          stroke={theme.palette.accent}
          strokeWidth="0.5"
          fill="none"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={reduce ? undefined : { pathLength: 1 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 1.2, delay: 1.1, ease: EASE }}
        />

        {/* Endpoints */}
        {[
          { cx: 14, cy: 18, label: 'ENGINEERING' },
          { cx: 50, cy: 10, label: 'RESEARCH' },
          { cx: 86, cy: 18, label: 'FOUNDER' },
        ].map((n, i) => (
          <motion.g
            key={n.label}
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.5, delay: 1.6 + i * 0.12, ease: EASE }}
          >
            <circle
              cx={n.cx}
              cy={n.cy}
              r={1.4}
              fill={theme.palette.accent}
            />
            <text
              x={n.cx}
              y={n.cy - 3}
              textAnchor="middle"
              style={labelStyle}
            >
              {n.label}
            </text>
          </motion.g>
        ))}

        {/* Trunk root marker */}
        <motion.circle
          cx="50" cy="72" r="1"
          fill={theme.palette.accent}
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        />
        <text
          x="50" y="74.5"
          textAnchor="middle"
          style={{ ...labelStyle, fontSize: 2.6 }}
        >
          STUDENT
        </text>
      </svg>
    </div>
  );
}

export function LayoutByKey({ theme, layout }: { theme: ProjectTheme; layout: LayoutKey }) {
  // SpaceForge gets a bespoke cinematic layout regardless of assigned variant.
  if (theme.slug === 'spaceforge') return <SpaceForgeLayout theme={theme} />;
  if (layout === 'A') return <ProductLaunchLayout theme={theme} />;
  if (layout === 'B') return <CaseStudyLayout theme={theme} />;
  if (layout === 'C') return <EditorialLayout theme={theme} />;
  if (layout === 'D') return <HackerDossierLayout theme={theme} />;
  return <ProductLaunchLayout theme={theme} />;
}

// --------------------------------------------------------------------------
// SPACEFORGE — bespoke cinematic layout (Framer Motion only, no GSAP)
// --------------------------------------------------------------------------
// 7 sections:
//   1. Cosmic Hero       — starfield + nebula bloom + slideshow + letter reveal
//   2. Cosmic Manifesto  — pinned 200vh, 3 phrases cross-fade, parallax stars
//   3. Constellation Stats — 4-up bento, SVG lines draw between cells
//   4. Story Quotes      — 3 nebula-glow pull-quote cards
//   5. Tech Stack Bento  — 6 tiles with 3D cursor-tilt
//   6. Outcome Quote     — giant Fraunces italic
//   7. NextChapter
// --------------------------------------------------------------------------

const SF_NEBULA = '#6E00FF';
const SF_CYAN = '#00FFE0';
const SF_BG = '#0A0F1F';

type StarSeed = { x: number; y: number; r: number; delay: number; dur: number };

function useStarSeeds(count: number): StarSeed[] {
  return useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const x = r3(((i * 9301 + 49297) % 233280) / 2332.8); // 0-100
      const y = r3(((i * 71839 + 31415) % 233280) / 2332.8); // 0-100
      const r = r3(0.15 + (((i * 17) % 100) / 100) * 0.55);
      const delay = r3(((i * 37) % 40) / 10); // 0-4
      const dur = r3(2.6 + (((i * 53) % 100) / 100) * 2.4);
      return { x, y, r, delay, dur };
    });
  }, [count]);
}

function Starfield({
  seeds,
  reduce,
  driftX,
}: {
  seeds: StarSeed[];
  reduce: boolean | null;
  driftX?: ReturnType<typeof useTransform<number, string>>;
}) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={driftX ? { x: driftX } : undefined}
      aria-hidden
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {seeds.map((s, i) => (
          <motion.circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#FFFFFF"
            initial={{ opacity: reduce ? 0.7 : 0.3 }}
            animate={
              reduce
                ? { opacity: 0.7 }
                : { opacity: [0.3, 1, 0.3] }
            }
            transition={
              reduce
                ? { duration: 0 }
                : { duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }
            }
          />
        ))}
      </svg>
    </motion.div>
  );
}

function NebulaBloom({ reduce }: { reduce: boolean | null }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ scale: 1, opacity: 0.6 }}
      animate={reduce ? { scale: 1 } : { scale: [1, 1.4, 1], opacity: [0.55, 0.85, 0.55] }}
      transition={reduce ? { duration: 0 } : { duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '120vmax',
          height: '120vmax',
          background: `radial-gradient(circle, ${SF_NEBULA}55 0%, ${SF_NEBULA}22 30%, transparent 60%)`,
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute left-[20%] top-[60%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '60vmax',
          height: '60vmax',
          background: `radial-gradient(circle, ${SF_CYAN}22 0%, transparent 60%)`,
          filter: 'blur(50px)',
        }}
      />
    </motion.div>
  );
}

function LetterReveal({
  text,
  className,
  style,
  delay = 0,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const chars = Array.from(text);
  return (
    <span
      className={className}
      style={{ ...style, display: 'inline-block', overflow: 'hidden' }}
      aria-label={text}
    >
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ whiteSpace: ch === ' ' ? 'pre' : undefined }}
          initial={reduce ? false : { y: '110%', opacity: 0 }}
          animate={reduce ? undefined : { y: '0%', opacity: 1 }}
          transition={{
            duration: 0.7,
            delay: delay + i * 0.035,
            ease: EASE,
          }}
          aria-hidden
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

function TiltTile({
  children,
  reduce,
}: {
  children: React.ReactNode;
  reduce: boolean | null;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });
  const [hovered, setHovered] = useState(false);

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(px);
    my.set(py);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{
        rotateX: reduce ? 0 : rx,
        rotateY: reduce ? 0 : ry,
        transformStyle: 'preserve-3d',
        transformPerspective: 800,
        border: `1px solid ${hovered ? SF_CYAN : `${SF_NEBULA}66`}`,
        background: `linear-gradient(140deg, ${SF_NEBULA}10 0%, ${SF_BG} 50%, ${SF_CYAN}08 100%)`,
        boxShadow: hovered
          ? `0 0 40px ${SF_CYAN}33, 0 0 0 1px ${SF_CYAN}55 inset`
          : `0 0 20px ${SF_NEBULA}22`,
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      className="relative rounded-lg p-6 md:p-8"
    >
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </motion.div>
  );
}

export function SpaceForgeLayout({ theme }: Props) {
  const reduce = useReducedMotion();

  // Hero refs
  const heroRef = useRef<HTMLElement | null>(null);

  // Manifesto refs / progress
  const manifestoRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: manifestoProg } = useScroll({
    target: manifestoRef,
    offset: ['start start', 'end end'],
  });
  const phrase1Op = useTransform(manifestoProg, [0.0, 0.06, 0.28, 0.34], [0, 1, 1, 0]);
  const phrase2Op = useTransform(manifestoProg, [0.32, 0.4, 0.58, 0.66], [0, 1, 1, 0]);
  const phrase3Op = useTransform(manifestoProg, [0.64, 0.72, 0.94, 1.0], [0, 1, 1, 1]);
  const phrase1Y = useTransform(manifestoProg, [0.0, 0.34], reduce ? [0, 0] : [40, -40]);
  const phrase2Y = useTransform(manifestoProg, [0.32, 0.66], reduce ? [0, 0] : [40, -40]);
  const phrase3Y = useTransform(manifestoProg, [0.64, 1.0], reduce ? [0, 0] : [40, -40]);
  const starDriftRaw = useTransform(manifestoProg, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-15%']);

  // Constellation
  const constellationRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: constProg } = useScroll({
    target: constellationRef,
    offset: ['start 80%', 'end 60%'],
  });
  const linePathLen = useTransform(constProg, [0, 1], reduce ? [1, 1] : [0, 1]);

  const heroSeeds = useStarSeeds(28);
  const manifestoSeeds = useStarSeeds(36);

  const stats = [
    { value: '60', unit: 'FPS', label: 'Performance target' },
    { value: '<200', unit: 'KB', label: 'First paint budget' },
    { value: '01', unit: 'SPLINE', label: '3D scene' },
    { value: '100', unit: '/100', label: 'Lighthouse perf' },
  ];

  const techStack = [
    { name: 'Spline', tag: '3D scene' },
    { name: 'Three.js', tag: 'WebGL' },
    { name: 'Framer Motion', tag: 'Animation' },
    { name: 'Lenis', tag: 'Smooth scroll' },
    { name: 'Custom easings', tag: 'Cinematic' },
    { name: 'Next.js', tag: 'App Router' },
  ];

  const galleryImgs = (theme.gallery ?? []).slice(0, 6);

  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background: SF_BG,
        color: theme.palette.text,
      }}
    >
      {/* ==================================================================
          1 · COSMIC HERO
          ================================================================== */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ minHeight: '100vh' }}
      >
        {/* nebula bloom */}
        <NebulaBloom reduce={reduce} />
        {/* starfield */}
        <Starfield seeds={heroSeeds} reduce={reduce} />

        {/* foreground slideshow with cosmic gradient */}
        <div className="absolute inset-0">
          <HeroSlideshow slug={theme.slug} />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, ${SF_BG}66 0%, ${SF_BG}99 60%, ${SF_BG} 100%)`,
            }}
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100vh] max-w-7xl flex-col justify-end px-6 pb-24 pt-32 md:px-12 md:pb-32">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-mono text-[10px] uppercase tracking-[0.45em]"
            style={{ color: SF_NEBULA }}
          >
            § ACT IV · CINEMATIC · 03 / 28
          </motion.p>

          <h1
            className="mt-6 font-display tracking-tight"
            style={{
              fontSize: 'clamp(3.5rem, 10vw, 9rem)',
              lineHeight: 0.9,
              color: '#FFFFFF',
            }}
          >
            <LetterReveal text="SpaceForge" delay={0.15} />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="italic"
              style={{ color: SF_NEBULA }}
            >
              .
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
            className="mt-8 max-w-3xl font-display text-2xl italic md:text-3xl"
            style={{ color: 'rgba(232,234,242,0.75)' }}
          >
            A cinematic 3D landing for a tech startup that needed to look the part.
          </motion.p>
        </div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="absolute bottom-8 left-6 z-10 flex items-center gap-3 md:left-12"
        >
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden>
            <motion.path
              d="M7 1 L7 18 M3 14 L7 18 L11 14"
              stroke={SF_CYAN}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={reduce ? undefined : { opacity: [0.4, 1, 0.4], y: [0, 4, 0] }}
              transition={reduce ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
          <span
            className="font-mono text-[10px] uppercase tracking-[0.4em]"
            style={{ color: 'rgba(232,234,242,0.55)' }}
          >
            Scroll · enter the void
          </span>
        </motion.div>
      </section>

      {/* ==================================================================
          2 · COSMIC MANIFESTO (200vh pinned)
          ================================================================== */}
      <div ref={manifestoRef} className="relative" style={{ height: '200vh' }}>
        <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
          {/* drifting starfield */}
          <Starfield seeds={manifestoSeeds} reduce={reduce} driftX={starDriftRaw} />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${SF_NEBULA}18 0%, transparent 70%)`,
            }}
          />

          <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-12">
            {reduce ? (
              <div className="space-y-10 text-center">
                {[
                  "We don't build websites.",
                  'We build first impressions.',
                  'Every pixel earns its place.',
                ].map((p) => (
                  <p
                    key={p}
                    className="font-display italic"
                    style={{
                      fontSize: 'clamp(2rem, 6vw, 5rem)',
                      lineHeight: 1.05,
                      color: '#FFFFFF',
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            ) : (
              <div className="relative h-[40vh]">
                {[
                  { text: "We don't build websites.", op: phrase1Op, y: phrase1Y },
                  { text: 'We build first impressions.', op: phrase2Op, y: phrase2Y },
                  { text: 'Every pixel earns its place.', op: phrase3Op, y: phrase3Y },
                ].map((p, i) => (
                  <motion.p
                    key={i}
                    style={{ opacity: p.op, y: p.y }}
                    className="absolute inset-0 flex items-center justify-center text-center font-display italic"
                  >
                    <span
                      style={{
                        fontSize: 'clamp(2rem, 7vw, 6rem)',
                        lineHeight: 1.05,
                        color: '#FFFFFF',
                        textShadow: `0 0 40px ${SF_NEBULA}55`,
                      }}
                    >
                      {p.text.split(' ').map((w, wi) => (
                        <span key={wi} className="mr-3 inline-block">
                          {w}
                        </span>
                      ))}
                    </span>
                  </motion.p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================================
          3 · CONSTELLATION STATS
          ================================================================== */}
      <section
        ref={constellationRef}
        className="relative px-6 py-32 md:px-12 md:py-44"
        style={{ background: SF_BG }}
      >
        <div className="mx-auto max-w-6xl">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.45em]"
            style={{ color: SF_NEBULA }}
          >
            § Constellation · by the numbers
          </p>
          <h2
            className="mt-4 font-display tracking-tight"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              color: '#FFFFFF',
              lineHeight: 1.02,
            }}
          >
            Four points. One trajectory.
          </h2>

          <div className="relative mt-16">
            {/* connecting lines (constellation) */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              {/* 0->1 (top), 1->3 (right diagonal), 0->2 (left vertical), 2->3 (bottom) */}
              {[
                'M 25 25 L 75 25',
                'M 75 25 L 75 75',
                'M 25 25 L 25 75',
                'M 25 75 L 75 75',
                'M 25 25 L 75 75',
              ].map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  stroke={`${SF_NEBULA}88`}
                  strokeWidth="0.2"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  style={{ pathLength: linePathLen }}
                />
              ))}
            </svg>

            <div className="relative grid grid-cols-2 gap-6 md:grid-cols-2 md:gap-10">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-15% 0px' }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
                  className="relative rounded-lg p-8 md:p-10"
                  style={{
                    background: `${SF_NEBULA}0F`,
                    border: `1px solid ${SF_NEBULA}44`,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    whileInView={reduce ? undefined : { scale: [0.8, 1.05, 1] }}
                    viewport={{ once: true, margin: '-15% 0px' }}
                    transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: EASE }}
                    className="font-display leading-[0.85] tracking-tight"
                    style={{
                      fontSize: 'clamp(3rem, 7vw, 6rem)',
                      color: '#FFFFFF',
                    }}
                  >
                    {s.value}
                    <span style={{ color: SF_CYAN, fontSize: '0.5em', marginLeft: '0.15em' }}>
                      {s.unit}
                    </span>
                  </motion.div>
                  <p
                    className="mt-4 font-mono text-[10px] uppercase tracking-[0.35em]"
                    style={{ color: 'rgba(232,234,242,0.6)' }}
                  >
                    {s.label}
                  </p>
                  {/* node marker */}
                  <span
                    className="absolute h-2 w-2 rounded-full"
                    style={{
                      background: SF_CYAN,
                      boxShadow: `0 0 12px ${SF_CYAN}`,
                      top: i < 2 ? -4 : 'auto',
                      bottom: i >= 2 ? -4 : 'auto',
                      left: i % 2 === 0 ? -4 : 'auto',
                      right: i % 2 === 1 ? -4 : 'auto',
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          4 · STORY QUOTES — nebula-glow cards
          ================================================================== */}
      <section className="relative px-6 py-28 md:px-12 md:py-40">
        <div className="mx-auto max-w-6xl">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.45em]"
            style={{ color: SF_NEBULA }}
          >
            § Field notes
          </p>
          <div className="mt-12 space-y-10">
            {theme.story.quotes.map((q, i) => (
              <motion.div
                key={q.kicker}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
                className="relative rounded-lg p-8 md:p-12"
                style={{
                  background: `linear-gradient(135deg, ${SF_NEBULA}10 0%, ${SF_BG} 100%)`,
                  border: `1px solid ${SF_NEBULA}44`,
                  boxShadow: `0 0 60px -20px ${SF_NEBULA}88, inset 0 0 80px -40px ${SF_CYAN}22`,
                }}
              >
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.4em]"
                  style={{ color: SF_CYAN }}
                >
                  {q.kicker}
                </p>
                <p
                  className="mt-5 font-display italic leading-tight"
                  style={{
                    fontSize: 'clamp(1.5rem, 3.5vw, 2.6rem)',
                    color: '#FFFFFF',
                  }}
                >
                  &ldquo;{q.quote}&rdquo;
                </p>
                <p
                  className="mt-5 max-w-3xl font-sans text-base md:text-lg"
                  style={{ color: 'rgba(232,234,242,0.65)' }}
                >
                  {q.context}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================
          5 · TECH STACK BENTO with 3D cursor tilt
          ================================================================== */}
      <section
        className="relative px-6 py-32 md:px-12 md:py-44"
        style={{
          background: `linear-gradient(180deg, ${SF_BG} 0%, #0D1226 50%, ${SF_BG} 100%)`,
          borderTop: `1px solid ${SF_NEBULA}22`,
          borderBottom: `1px solid ${SF_NEBULA}22`,
        }}
      >
        <div className="mx-auto max-w-6xl">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.45em]"
            style={{ color: SF_NEBULA }}
          >
            § Stack · forged in motion
          </p>
          <h2
            className="mt-4 font-display tracking-tight"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              color: '#FFFFFF',
              lineHeight: 1.02,
            }}
          >
            Six tools. One choreography.
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {techStack.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
              >
                <TiltTile reduce={reduce}>
                  <p
                    className="font-mono text-[10px] uppercase tracking-[0.4em]"
                    style={{ color: SF_CYAN }}
                  >
                    {String(i + 1).padStart(2, '0')} · {t.tag}
                  </p>
                  <h3
                    className="mt-3 font-display"
                    style={{
                      fontSize: 'clamp(1.4rem, 2.4vw, 2rem)',
                      color: '#FFFFFF',
                    }}
                  >
                    {t.name}
                  </h3>
                </TiltTile>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================
          5b · GALLERY (lightweight strip, only if images exist)
          ================================================================== */}
      {galleryImgs.length > 0 ? (
        <section className="relative px-6 py-24 md:px-12">
          <div className="mx-auto max-w-7xl">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.45em]"
              style={{ color: SF_NEBULA }}
            >
              § Frames
            </p>
            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
              {galleryImgs.map((g, i) => (
                <motion.div
                  key={g.src}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
                  className="relative aspect-[4/3] overflow-hidden rounded-md"
                  style={{ border: `1px solid ${SF_NEBULA}33` }}
                >
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ==================================================================
          6 · OUTCOME QUOTE
          ================================================================== */}
      <section
        className="relative px-6 py-36 md:px-12 md:py-52"
        style={{
          background: `radial-gradient(ellipse at center, ${SF_NEBULA}22 0%, ${SF_BG} 70%)`,
        }}
      >
        <div className="mx-auto max-w-5xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 1.0, ease: EASE }}
            className="font-display italic leading-[1.05]"
            style={{
              fontSize: 'clamp(2.2rem, 6.5vw, 5.5rem)',
              color: '#FFFFFF',
              textShadow: `0 0 40px ${SF_NEBULA}66`,
            }}
          >
            &ldquo;Built for the visual ceiling. Hit it.&rdquo;
          </motion.p>
        </div>
      </section>

      {/* ==================================================================
          7 · NEXT CHAPTER
          ================================================================== */}
      <NextChapter currentSlug={theme.slug} accent={SF_NEBULA} />
      <SiteFooter />
    </main>
  );
}
