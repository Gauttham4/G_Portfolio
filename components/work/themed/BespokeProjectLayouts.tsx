'use client';

// Bespoke per-slug layouts for projects that needed full visual differentiation.
// Each layout consumes the same ProjectTheme shape but renders a unique page
// shell. Routed from ThemedProjectPage by slug.

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '../NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = { theme: ProjectTheme };

// ============================================================
// TVK — Political Poster
// ============================================================
export function TvkPoliticalLayout({ theme }: Props) {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const portraitY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 80]);
  const titleY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -60]);

  const RED = theme.palette.accent2 ?? '#C8102E';
  const YELLOW = theme.palette.accent ?? '#FFC23C';

  return (
    <main className="relative min-h-screen" style={{ background: '#1A0A0A', color: '#FFFAF0' }}>
      {/* HERO — full-bleed Vijay portrait + over-print headline */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: portraitY }}>
          <Image
            src="/work/tvk/gallery-2.jpg"
            alt="Vijay — TVK"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
            style={{ filter: 'contrast(1.05) saturate(1.1)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${RED}DD 0%, transparent 40%, ${RED}CC 100%)`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, ${YELLOW}10 0, ${YELLOW}10 2px, transparent 2px, transparent 6px)`,
              mixBlendMode: 'overlay',
            }}
          />
        </motion.div>

        {/* Hammered headline */}
        <motion.div
          style={{ y: titleY }}
          className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-6 pb-20 pt-40 md:px-12 md:pb-32"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: YELLOW }}>
            § Tamilaga Vettri Kazhagam · Election Console
          </p>
          <h1
            className="mt-6 font-display uppercase leading-[0.85] tracking-tight"
            style={{
              fontSize: 'clamp(3rem, 14vw, 12rem)',
              color: YELLOW,
              textShadow: `6px 6px 0 ${RED}, 12px 12px 0 #1A0A0A`,
              fontWeight: 800,
            }}
          >
            TVK<br />Connect
          </h1>
          <p
            className="mt-8 max-w-3xl font-display italic"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#FFFAF0', lineHeight: 1.1 }}
          >
            {theme.subtitle}
          </p>

          {/* Flag strip */}
          <div className="mt-10 flex h-3 w-full max-w-md overflow-hidden border border-amber/40">
            <div className="flex-1" style={{ background: RED }} />
            <div className="flex-1" style={{ background: YELLOW }} />
            <div className="flex-1" style={{ background: RED }} />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#manifesto"
              className="inline-flex items-center gap-3 px-6 py-3 font-mono text-xs uppercase tracking-[0.3em]"
              style={{ background: YELLOW, color: '#1A0A0A' }}
            >
              Read the manifesto →
            </a>
            <Link
              href="/work"
              className="font-mono text-xs uppercase tracking-[0.3em]"
              style={{ color: '#FFFAF0' }}
            >
              All projects
            </Link>
          </div>
        </motion.div>
      </section>

      {/* MANIFESTO — political poster style numbered planks */}
      <section id="manifesto" className="px-6 py-32 md:px-12 md:py-48" style={{ background: RED, color: YELLOW }}>
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: '#FFFAF0' }}>
            § Planks of the platform
          </p>
          <h2
            className="mt-4 font-display uppercase"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', lineHeight: 0.95, letterSpacing: '-0.02em' }}
          >
            Six promises.<br />Phone-grade polish.
          </h2>

          <ol className="mt-16 space-y-12 border-t-2 pt-12" style={{ borderColor: YELLOW }}>
            {theme.features.map((f, i) => (
              <motion.li
                key={f.title}
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 md:grid-cols-[auto_1fr_2fr] md:gap-x-10"
              >
                <span
                  className="font-display"
                  style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 0.9, color: '#FFFAF0' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3
                  className="font-display uppercase col-span-1 md:col-span-1"
                  style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', lineHeight: 1.05, color: YELLOW }}
                >
                  {f.title}
                </h3>
                <p
                  className="font-sans text-base md:text-lg col-span-2 md:col-span-1"
                  style={{ color: '#FFFAF0' }}
                >
                  {f.desc}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* BALLOT BIG NUMBERS — poster stat panels */}
      <section className="px-6 py-24 md:px-12 md:py-32" style={{ background: YELLOW, color: RED }}>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
          {theme.bigNumbers.map((n, i) => (
            <motion.div
              key={n.label}
              initial={reduce ? false : { opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="border-4 border-current p-6 text-center md:p-8"
            >
              <p className="font-display" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1, fontWeight: 700 }}>
                {n.value}
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em]">{n.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GALLERY — campaign poster wall */}
      <section className="px-6 py-24 md:px-12 md:py-32" style={{ background: '#1A0A0A' }}>
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: YELLOW }}>
            § Campaign wall
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {(theme.gallery ?? []).map((g, i) => (
              <motion.div
                key={g.src}
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                className="relative aspect-[3/4] overflow-hidden border-2"
                style={{ borderColor: i % 2 === 0 ? YELLOW : RED }}
              >
                <Image src={g.src} alt={g.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
                <div
                  className="absolute inset-x-0 bottom-0 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.3em]"
                  style={{ background: `linear-gradient(to top, ${RED}EE, transparent)`, color: YELLOW }}
                >
                  {g.caption}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUTCOME stamp */}
      <section className="px-6 py-32 md:px-12 md:py-44" style={{ background: RED }}>
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: YELLOW }}>
            § Verdict
          </p>
          <p
            className="mt-8 font-display italic"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 4rem)', lineHeight: 1.1, color: '#FFFAF0' }}
          >
            &ldquo;{theme.outcomeQuote}&rdquo;
          </p>
        </div>
      </section>

      <NextChapter currentSlug={theme.slug} accent={YELLOW} />
      <SiteFooter />
    </main>
  );
}

// (Zyntra layout retired — slug now routes to ProductLaunchLayout.)

// ============================================================
// VKMG — Wireframe / Blueprint
// ============================================================
export function VkmgWireframeLayout({ theme }: Props) {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const gridY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -120]);

  const CYAN = '#00C8FF';
  const INK = '#0A1018';
  const WHITE = '#E8F1FB';

  // Typewriter sub-tagline
  const [typed, setTyped] = useState('');
  const tag = theme.subtitle;
  useEffect(() => {
    if (reduce) {
      setTyped(tag);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(tag.slice(0, i));
      if (i >= tag.length) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [tag, reduce]);

  return (
    <main className="relative min-h-screen" style={{ background: INK, color: WHITE }}>
      {/* Blueprint grid background — fixed */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          y: gridY,
          backgroundImage: `
            linear-gradient(${CYAN}22 1px, transparent 1px),
            linear-gradient(90deg, ${CYAN}22 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen px-6 pt-40 pb-20 md:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
            § Blueprint · Rev 03 · 2024
          </p>

          <h1
            className="mt-10 font-display tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 10rem)', lineHeight: 0.95, fontWeight: 300, letterSpacing: '-0.03em' }}
          >
            VKMG<br />
            <span style={{ color: CYAN, fontStyle: 'italic' }}>Consultancy</span>
          </h1>

          <p
            className="mt-8 max-w-3xl font-mono text-lg md:text-2xl"
            style={{ color: WHITE, minHeight: '3em' }}
          >
            {typed}
            <span className="ml-1 inline-block h-5 w-2 align-middle" style={{ background: CYAN, animation: 'blink 1s steps(2) infinite' }} />
          </p>

          {/* Wireframe spec frame */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-16 relative max-w-2xl"
            style={{ border: `1px solid ${CYAN}55` }}
          >
            <div className="grid grid-cols-2 divide-x" style={{ borderColor: `${CYAN}44` }}>
              {theme.bigNumbers.map((n, i) => (
                <div key={i} className="border-b p-5 md:p-7" style={{ borderColor: `${CYAN}22` }}>
                  <p
                    className="font-display"
                    style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: CYAN, lineHeight: 1, fontWeight: 300 }}
                  >
                    {n.value}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] opacity-70">{n.label}</p>
                </div>
              ))}
            </div>
            {/* corner ticks */}
            <span className="absolute -left-2 -top-2 h-4 w-4 border-l border-t" style={{ borderColor: CYAN }} />
            <span className="absolute -right-2 -top-2 h-4 w-4 border-r border-t" style={{ borderColor: CYAN }} />
            <span className="absolute -bottom-2 -left-2 h-4 w-4 border-b border-l" style={{ borderColor: CYAN }} />
            <span className="absolute -bottom-2 -right-2 h-4 w-4 border-b border-r" style={{ borderColor: CYAN }} />
          </motion.div>
        </div>

        <style jsx>{`
          @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        `}</style>
      </section>

      {/* SCHEMATIC — features as drafted boxes */}
      <section className="relative px-6 py-32 md:px-12 md:py-44">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
            § Schematic
          </p>
          <h2
            className="mt-3 font-display tracking-tight"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', lineHeight: 1.0, fontWeight: 300 }}
          >
            Components of the build.
          </h2>

          <div className="mt-16 grid grid-cols-1 gap-px md:grid-cols-2" style={{ background: `${CYAN}22` }}>
            {theme.features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative p-8 md:p-10"
                style={{ background: INK }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
                  COMP-{String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 font-display text-2xl md:text-3xl" style={{ fontWeight: 300 }}>
                  {f.title}
                </h3>
                <p className="mt-3 font-sans text-sm md:text-base" style={{ color: `${WHITE}AA` }}>
                  {f.desc}
                </p>
                {/* dimension label */}
                <span className="absolute right-4 top-4 font-mono text-[9px] uppercase tracking-[0.4em]" style={{ color: `${CYAN}66` }}>
                  ⌀ {((i + 1) * 2.4).toFixed(1)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ARCHITECTURE TABLE — drafting style */}
      <section className="relative px-6 py-32 md:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
            § Layer stack
          </p>
          <div className="mt-10 divide-y" style={{ borderColor: `${CYAN}33` }}>
            {theme.architecture.map((a, i) => (
              <motion.div
                key={a.layer}
                initial={reduce ? false : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="grid grid-cols-[120px_1fr] gap-6 py-6 md:grid-cols-[200px_1fr] md:py-8"
                style={{ borderColor: `${CYAN}33` }}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: CYAN }}>
                  {a.layer}
                </span>
                <span className="font-sans text-base md:text-lg" style={{ color: WHITE }}>
                  {a.details}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY — drafting-table contact sheet */}
      <section className="relative px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
            § Contact sheet
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
            {(theme.gallery ?? []).map((g, i) => (
              <motion.div
                key={g.src}
                initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative aspect-video overflow-hidden"
                style={{ border: `1px solid ${CYAN}44` }}
              >
                <Image src={g.src} alt={g.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.4em]" style={{ background: `${INK}E6`, color: CYAN }}>
                  PLATE-{String(i + 1).padStart(2, '0')} · {g.caption}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUTCOME */}
      <section className="relative px-6 py-32 md:px-12 md:py-44">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
            § Sign-off
          </p>
          <p
            className="mt-8 font-display italic"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 4rem)', lineHeight: 1.1, color: WHITE, fontWeight: 300 }}
          >
            &ldquo;{theme.outcomeQuote}&rdquo;
          </p>
        </div>
      </section>

      <NextChapter currentSlug={theme.slug} accent={CYAN} />
      <SiteFooter />
    </main>
  );
}

// ============================================================
// DivyaDrishti — Command Center
// ============================================================
export function DivyaCommandLayout({ theme }: Props) {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);

  const CYAN = '#22D3EE';
  const RED = '#FF2D4F';
  const INK = '#0A0F1F';
  const PANEL = '#10172E';
  const TEXT = '#E2EAFF';

  // Live clock for HUD
  const [clock, setClock] = useState('00:00:00');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      setClock(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // 90s countdown gauge (fake "lookahead")
  const [lookahead, setLookahead] = useState(90);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setLookahead((v) => (v <= 1 ? 90 : v - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [reduce]);

  // Heatmap grid (animated cells)
  const cells = useMemo(() => Array.from({ length: 96 }), []);

  return (
    <main className="relative min-h-screen" style={{ background: INK, color: TEXT }}>
      {/* HERO — mission control split */}
      <section ref={heroRef} className="relative min-h-screen px-6 pt-32 pb-20 md:px-12 md:pt-40">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[3fr_2fr] md:gap-12">
          {/* LEFT — title block */}
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
              <span className="inline-block h-2 w-2 animate-pulse rounded-full" style={{ background: RED }} />
              § Live · Ops Console · {clock}
            </p>

            <h1
              className="mt-8 font-display tracking-tight"
              style={{ fontSize: 'clamp(3rem, 11vw, 9rem)', lineHeight: 0.95, fontWeight: 700 }}
            >
              Divya<br />
              <span style={{ color: CYAN }}>Drishti</span>
            </h1>

            <p
              className="mt-6 max-w-2xl font-sans"
              style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)', color: `${TEXT}DD`, lineHeight: 1.4 }}
            >
              {theme.subtitle}
            </p>

            <div className="mt-12 flex flex-wrap gap-3">
              <a
                href="#features"
                className="inline-flex items-center gap-3 rounded-sm px-6 py-3 font-mono text-xs uppercase tracking-[0.3em]"
                style={{ background: CYAN, color: INK }}
              >
                Open the console →
              </a>
              <Link
                href="/work"
                className="inline-flex items-center rounded-sm border px-6 py-3 font-mono text-xs uppercase tracking-[0.3em]"
                style={{ borderColor: `${CYAN}55`, color: TEXT }}
              >
                All projects
              </Link>
            </div>
          </div>

          {/* RIGHT — live HUD card stack */}
          <div className="grid grid-rows-[auto_auto_1fr] gap-4">
            {/* Lookahead gauge */}
            <div className="rounded-md p-5 md:p-6" style={{ background: PANEL, border: `1px solid ${CYAN}33` }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: CYAN }}>
                Predictive lookahead
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display tabular-nums" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: TEXT, lineHeight: 1, fontWeight: 700 }}>
                  {lookahead}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: `${TEXT}AA` }}>s</span>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full" style={{ background: `${CYAN}22` }}>
                <motion.div
                  animate={{ width: `${(lookahead / 90) * 100}%` }}
                  transition={{ duration: 0.4, ease: 'linear' }}
                  className="h-full"
                  style={{ background: lookahead < 15 ? RED : CYAN }}
                />
              </div>
            </div>

            {/* Heatmap mini */}
            <div className="rounded-md p-5 md:p-6" style={{ background: PANEL, border: `1px solid ${CYAN}33` }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: CYAN }}>
                Live density · sector 7
              </p>
              <div className="mt-4 grid grid-cols-12 gap-px">
                {cells.map((_, i) => {
                  const seed = (i * 17 + 31) % 100;
                  const density = seed / 100;
                  const color = density > 0.85 ? RED : density > 0.6 ? '#F5A623' : density > 0.35 ? CYAN : `${CYAN}33`;
                  return (
                    <motion.span
                      key={i}
                      animate={{ opacity: reduce ? 1 : [0.6, 1, 0.6] }}
                      transition={{ duration: 2 + (i % 4) * 0.5, repeat: Infinity, ease: 'easeInOut', delay: (i % 8) * 0.1 }}
                      className="aspect-square"
                      style={{ background: color }}
                    />
                  );
                })}
              </div>
            </div>

            {/* SOS readouts */}
            <div className="rounded-md p-5 md:p-6" style={{ background: PANEL, border: `1px solid ${RED}55` }}>
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: RED }}>
                <span className="inline-block h-2 w-2 animate-pulse rounded-full" style={{ background: RED }} />
                SOS pipeline · armed
              </p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {theme.bigNumbers.slice(0, 3).map((n) => (
                  <div key={n.label}>
                    <p className="font-display tabular-nums" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', color: TEXT, lineHeight: 1, fontWeight: 700 }}>
                      {n.value}
                    </p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: `${TEXT}99` }}>
                      {n.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPLIT-VIEW — customer & officer */}
      <section className="px-6 py-32 md:px-12 md:py-44" style={{ background: PANEL }}>
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
            § Two audiences · one signal
          </p>
          <h2
            className="mt-4 font-display tracking-tight"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', lineHeight: 1, fontWeight: 700 }}
          >
            The crowd sees an exit.<br />
            <span style={{ color: CYAN }}>The officer sees a wave.</span>
          </h2>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {[
              {
                kicker: 'Customer view',
                title: 'Safe-exit nudge',
                body: 'A quiet "least-dense gate, 30s away" card slides up before the surge becomes visible from inside the crowd. No alarm, no panic vector.',
                tag: 'BLE-mesh · GPS opt-in',
                accent: CYAN,
              },
              {
                kicker: 'Officer view',
                title: 'Density wave + predicted hotspot',
                body: 'Live heatmap per sector with a 90-second predicted hotspot. One-tap broadcast to redirect ushers and on-foot units.',
                tag: 'Mapbox GL · PostGIS density tiles',
                accent: RED,
              },
            ].map((c, i) => (
              <motion.article
                key={c.title}
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-md p-6 md:p-10"
                style={{ background: INK, border: `1px solid ${c.accent}55` }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: c.accent }}>
                  {c.kicker}
                </p>
                <h3 className="mt-3 font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: 1.05, fontWeight: 700 }}>
                  {c.title}
                </h3>
                <p className="mt-4 font-sans text-base md:text-lg" style={{ color: `${TEXT}CC` }}>
                  {c.body}
                </p>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: `${c.accent}AA` }}>
                  {c.tag}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES — telemetry strip */}
      <section id="features" className="px-6 py-32 md:px-12 md:py-44">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
            § Telemetry feed
          </p>
          <div className="mt-10 divide-y" style={{ borderColor: `${CYAN}22` }}>
            {theme.features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={reduce ? false : { opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 py-6 md:grid-cols-[120px_1fr_2fr] md:gap-x-10 md:py-8"
                style={{ borderColor: `${CYAN}22` }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: CYAN }}>
                  EVT-{String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-xl md:text-2xl" style={{ fontWeight: 700 }}>
                  {f.title}
                </h3>
                <p className="col-span-2 mt-2 font-sans text-sm md:col-span-1 md:mt-0 md:text-base" style={{ color: `${TEXT}BB` }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ARCHITECTURE diagram */}
      <section className="px-6 py-32 md:px-12 md:py-44" style={{ background: PANEL }}>
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
            § Stack
          </p>
          <div className="mt-10 grid gap-px md:grid-cols-2" style={{ background: `${CYAN}22` }}>
            {theme.architecture.map((a, i) => (
              <motion.div
                key={a.layer}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="p-6 md:p-8"
                style={{ background: INK }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: CYAN }}>
                  {a.layer}
                </p>
                <p className="mt-3 font-sans text-base md:text-lg" style={{ color: TEXT }}>
                  {a.details}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY — surveillance grid */}
      <section className="px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
            § Camera grid
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
            {(theme.gallery ?? []).map((g, i) => (
              <motion.div
                key={g.src}
                initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative aspect-video overflow-hidden"
                style={{ border: `1px solid ${CYAN}55` }}
              >
                <Image src={g.src} alt={g.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
                <div
                  className="absolute inset-x-0 top-0 flex items-center justify-between px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.3em]"
                  style={{ background: `${INK}DD`, color: CYAN }}
                >
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: RED }} />
                    CAM-{String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ color: `${TEXT}AA` }}>{g.caption}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUTCOME */}
      <section className="px-6 py-32 md:px-12 md:py-44">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: CYAN }}>
            § Field verdict
          </p>
          <p
            className="mt-8 font-display italic"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 4rem)', lineHeight: 1.1, color: TEXT, fontWeight: 700 }}
          >
            &ldquo;{theme.outcomeQuote}&rdquo;
          </p>
        </div>
      </section>

      <NextChapter currentSlug={theme.slug} accent={CYAN} />
      <SiteFooter />
    </main>
  );
}
