'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

/* ------------------------------------------------------------------ */
/* Static content (all sourced from the project's own notes)           */
/* ------------------------------------------------------------------ */

const NAVY500 = '#22356B';
const GOLD_HI = '#F4D77A';
const PAPER = '#F1E9D2';
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
const WORDS = ['EXCELLENCE', 'GUIDANCE', 'KNOWLEDGE', 'SUCCESS', 'ACHIEVEMENT', 'RESULTS'];

const ROUND_TRIP = [
  { t: 'Parent’s phone', d: 'Registration form, filled inline' },
  { t: 'Branded PDF', d: 'Rendered and stamped on submit' },
  { t: 'Drive vault', d: 'Per-class 10th / 11th / 12th folder' },
  { t: 'Firestore record', d: 'Linked to the file, in one round trip' },
];

const PLATES = [
  { src: '/work/dhanoos-excellence/gallery-1.jpg', alt: 'A tiered lecture hall with a speaker beside a projected slide', cap: 'Plate I', sub: 'The lecture hall', pos: '50% 50%' },
  { src: '/work/dhanoos-excellence/gallery-2.jpg', alt: 'A teacher at a chalkboard while a student raises a hand', cap: 'Plate II', sub: 'The classroom', pos: '50% 40%' },
  { src: '/work/dhanoos-excellence/gallery-3.jpg', alt: 'Students in uniform seated at wooden desks, looking ahead', cap: 'Plate III', sub: 'The back benches', pos: '50% 40%' },
  { src: '/work/dhanoos-excellence/gallery-4.jpg', alt: 'A hall of seated attendees listening to two speakers on a stage', cap: 'Plate IV', sub: 'The assembly', pos: '50% 60%' },
  { src: '/work/dhanoos-excellence/gallery-5.jpg', alt: 'A woman exercising on a mat beside a bright window', cap: 'Plate V', sub: 'The gymnasium', pos: '50% 55%' },
  { src: '/work/dhanoos-excellence/gallery-6.jpg', alt: 'An open book floating between towering stacks of old volumes', cap: 'Plate VI', sub: 'The archive', pos: '50% 50%' },
];

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

function useInView<T extends HTMLElement>(margin = '0px 0px -12% 0px') {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, seen] as const;
}

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Counter({ value, run }: { value: string; run: boolean }) {
  const target = parseInt(value, 10);
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (reduce || Number.isNaN(target)) {
      setN(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1100;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, reduce]);
  if (Number.isNaN(target)) return <>{value}</>;
  return <>{run ? n : 0}</>;
}

function SectionHead({ numeral, kicker, title }: { numeral: string; kicker: string; title: string }) {
  return (
    <Reveal className="mb-10 text-center md:mb-14">
      <div className="dex-mono mx-auto flex items-center justify-center gap-3 text-[12px] uppercase tracking-[0.28em] text-[color:var(--dx-gold)]">
        <span className="h-px w-8 bg-[color:var(--dx-gold)]/60" aria-hidden />
        <span>{numeral} · {kicker}</span>
        <span className="h-px w-8 bg-[color:var(--dx-gold)]/60" aria-hidden />
      </div>
      <h2 className="dex-serif mt-4 text-[1.9rem] leading-tight text-[color:var(--dx-text)] sm:text-4xl md:text-5xl">{title}</h2>
    </Reveal>
  );
}

/** Certificate-style double border. */
function Frame({ children, className = '', paper = false }: { children: ReactNode; className?: string; paper?: boolean }) {
  return (
    <div className={`dex-frame ${paper ? 'dex-frame-paper' : ''} ${className}`}>
      <span className="dex-corner dex-c1" aria-hidden />
      <span className="dex-corner dex-c2" aria-hidden />
      <span className="dex-corner dex-c3" aria-hidden />
      <span className="dex-corner dex-c4" aria-hidden />
      {children}
    </div>
  );
}

function Crest({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 140" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path className="dex-draw" pathLength={1} d="M60 6 L108 22 V70 C108 100 88 122 60 134 C32 122 12 100 12 70 V22 Z" />
      <path className="dex-draw dex-d2" pathLength={1} d="M60 15 L99 28 V69 C99 94 83 112 60 123 C37 112 21 94 21 69 V28 Z" strokeWidth="0.9" />
      <path className="dex-draw dex-d3" pathLength={1} d="M60 92 C48 84 36 84 28 88 V58 C36 54 48 54 60 62 C72 54 84 54 92 58 V88 C84 84 72 84 60 92 Z M60 62 V92" />
      <path className="dex-draw dex-d4" pathLength={1} d="M60 26 L64 36 L75 37 L67 44 L69 55 L60 49 L51 55 L53 44 L45 37 L56 36 Z" strokeWidth="1.2" />
      <path className="dex-draw dex-d4" pathLength={1} d="M30 100 C34 108 42 114 50 117 M90 100 C86 108 78 114 70 117" strokeWidth="1.2" />
    </svg>
  );
}

function Spark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Page({ theme }: { theme: ProjectTheme }) {
  const p = theme.palette;
  const vars = {
    '--dx-bg': p.bg,
    '--dx-mid': p.bgMid,
    '--dx-card': NAVY500,
    '--dx-text': p.text,
    '--dx-dim': p.dim,
    '--dx-gold': p.accent,
    '--dx-gold-hi': GOLD_HI,
    '--dx-ink': p.accent2 ?? '#A1331E',
    '--dx-paper': PAPER,
  } as CSSProperties;

  const [qi, setQi] = useState(0);
  const [li, setLi] = useState(0);
  const quotes = theme.story.quotes;
  const layer = theme.architecture[li];

  // Rank board: ordered by value, biggest first.
  const ranked = [...theme.bigNumbers].sort((a, b) => parseInt(b.value, 10) - parseInt(a.value, 10));
  const [boardRef, boardSeen] = useInView<HTMLOListElement>();
  const [stampRef, stampSeen] = useInView<HTMLDivElement>('0px 0px -20% 0px');

  return (
    <main className="dex-root relative overflow-x-clip" style={{ ...vars, background: 'var(--dx-bg)', color: 'var(--dx-text)' }}>
      <style>{CSS}</style>

      {/* ============================ HERO ============================ */}
      <section className="relative px-4 pb-14 pt-24 sm:px-6 md:pb-20 md:pt-36">
        <div className="dex-hero-glow" aria-hidden />
        <div className="relative mx-auto max-w-6xl">
          <Frame className="dex-hero-frame">
            <div className="grid items-center gap-8 px-5 py-9 sm:px-8 md:grid-cols-[1.15fr_0.85fr] md:gap-12 md:px-14 md:py-16 min-h-[68svh]">
              <div className="text-center md:text-left">
                <div className="mx-auto flex w-fit items-center gap-4 text-[color:var(--dx-gold)] md:mx-0">
                  <Crest className="h-20 w-[4.4rem] md:h-24 md:w-[5.2rem]" />
                  <div className="dex-mono text-left text-[11px] uppercase leading-relaxed tracking-[0.22em] text-[color:var(--dx-dim)]">
                    Admissions<br />Toppers · Vault
                  </div>
                </div>
                <p className="dex-mono mt-6 text-[11px] uppercase leading-relaxed tracking-[0.2em] text-[color:var(--dx-dim)] sm:text-xs">{theme.kicker}</p>
                <h1 className="dex-serif dex-shimmer mt-3 text-[2.6rem] font-semibold leading-[1.04] sm:text-6xl lg:text-7xl">
                  {theme.title}
                </h1>
                <p className="dex-serif mt-4 text-xl italic text-[color:var(--dx-text)] sm:text-2xl">{theme.subtitle}</p>
                <div className="mx-auto my-6 flex w-fit items-center gap-3 text-[color:var(--dx-gold)] md:mx-0" aria-hidden>
                  <span className="h-px w-12 bg-current opacity-60" />
                  <Spark className="dex-twinkle h-3 w-3" />
                  <span className="h-px w-12 bg-current opacity-60" />
                </div>
                <p className="mx-auto max-w-md text-base leading-relaxed text-[color:var(--dx-dim)] md:mx-0">
                  <span className="dex-serif text-lg text-[color:var(--dx-text)]">Excellence, archived.</span>{' '}
                  Every admission begins on a phone, ends as a stamped PDF in the vault, and lives forever in a folder the academy can find.
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-[19rem] md:max-w-none">
                <div className="dex-arch relative aspect-[4/5] w-full">
                  <Image
                    src="/work/dhanoos-excellence/gallery-6.jpg"
                    alt="An open book hovering in a library of stacked volumes"
                    fill
                    priority
                    sizes="(min-width: 768px) 38vw, 80vw"
                    className="object-cover"
                    style={{ objectPosition: '50% 48%' }}
                  />
                  <div className="dex-arch-shade" aria-hidden />
                </div>
                <div className="dex-seal" aria-hidden>
                  <Spark className="h-4 w-4" />
                  <span className="dex-mono text-[9px] uppercase tracking-[0.2em]">Navy<br />&amp; Gold</span>
                </div>
              </div>
            </div>
          </Frame>
        </div>
      </section>

      {/* =========================== MARQUEE ========================== */}
      <div className="dex-band" aria-hidden>
        <div className="dex-marquee">
          {[0, 1].map((k) => (
            <div key={k} className="dex-track">
              {WORDS.map((w) => (
                <span key={w + k} className="dex-serif">
                  {w}
                  <Spark className="mx-5 inline-block h-2.5 w-2.5 align-middle text-[color:var(--dx-gold)]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============================ STORY =========================== */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-4xl">
          <SectionHead numeral="§ I" kicker="From the story" title="Three lines from the cupboard" />
          <Reveal>
            <Frame>
              <div className="px-5 py-8 sm:px-10 md:px-14 md:py-12">
                <div role="tablist" aria-label="Story quotes" className="mb-6 flex justify-center gap-3">
                  {quotes.map((q, i) => (
                    <button
                      key={q.kicker}
                      role="tab"
                      type="button"
                      id={`dex-q-tab-${i}`}
                      aria-selected={qi === i}
                      aria-controls="dex-q-panel"
                      onClick={() => setQi(i)}
                      className={`dex-tab dex-serif ${qi === i ? 'is-on' : ''}`}
                    >
                      {ROMAN[i]}
                    </button>
                  ))}
                </div>
                <div key={qi} id="dex-q-panel" role="tabpanel" aria-labelledby={`dex-q-tab-${qi}`} className="dex-swap min-h-[15rem] text-center sm:min-h-[13rem]">
                  <span className="dex-serif block text-6xl leading-none text-[color:var(--dx-gold)]" aria-hidden>“</span>
                  <blockquote className="dex-serif -mt-3 text-[1.35rem] italic leading-snug text-[color:var(--dx-text)] sm:text-3xl md:text-[2rem]">
                    {quotes[qi].quote}
                  </blockquote>
                  <p className="dex-mono mx-auto mt-6 max-w-lg text-xs leading-relaxed tracking-wide text-[color:var(--dx-dim)] sm:text-[13px]">
                    {quotes[qi].kicker} — {quotes[qi].context}
                  </p>
                </div>
              </div>
            </Frame>
          </Reveal>
        </div>
      </section>

      {/* ========================== RANK BOARD ======================== */}
      <section className="px-4 py-16 sm:px-6 md:py-24" style={{ background: 'var(--dx-mid)' }}>
        <div className="mx-auto max-w-4xl">
          <SectionHead numeral="§ II" kicker="By the numbers" title="The Rank Board" />
          <ol ref={boardRef} className="space-y-3 md:space-y-4">
            {ranked.map((n, i) => {
              const top = i < 3;
              return (
                <li key={n.label} className={`dex-row ${top ? 'dex-row-top' : ''} ${boardSeen ? 'is-in' : ''}`} style={{ ['--i' as string]: i } as CSSProperties}>
                  <span className={`dex-rank dex-serif ${top ? 'dex-rank-top' : ''}`}>
                    {i + 1}
                    {top && <Spark className="dex-spark h-3 w-3" />}
                  </span>
                  <span className="dex-serif dex-val text-4xl font-semibold leading-none text-[color:var(--dx-gold)] sm:text-5xl md:text-6xl">
                    <Counter value={n.value} run={boardSeen} />
                  </span>
                  <span className="dex-mono text-xs uppercase leading-snug tracking-[0.16em] text-[color:var(--dx-text)] sm:text-[13px]">{n.label}</span>
                  <span className="dex-rule" aria-hidden />
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ============================ SYLLABUS ======================== */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead numeral="§ III" kicker="What it does, in production" title="The Syllabus" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {theme.features.map((f, i) => {
              const stamp = /stamp/i.test(f.title);
              return (
                <Reveal key={f.title} delay={(i % 3) * 0.08}>
                  <article className={`dex-card h-full ${stamp ? 'dex-card-paper' : ''}`}>
                    <div className="flex items-start justify-between">
                      <span className="dex-serif text-3xl leading-none text-[color:var(--dx-gold)]">{ROMAN[i]}</span>
                      {stamp && (
                        <svg viewBox="0 0 80 80" className="dex-stamp-mini h-14 w-14" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="40" cy="40" r="34" />
                          <circle cx="40" cy="40" r="27" strokeWidth="1" />
                          <path d="M40 22 L44 34 L57 35 L47 43 L50 56 L40 49 L30 56 L33 43 L23 35 L36 34 Z" fill="currentColor" stroke="none" />
                        </svg>
                      )}
                    </div>
                    <h3 className="dex-serif mt-4 text-xl font-semibold leading-snug sm:text-[1.4rem]">{f.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed opacity-90">{f.desc}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================== ARCHITECTURE ====================== */}
      <section className="px-4 py-16 sm:px-6 md:py-24" style={{ background: 'var(--dx-mid)' }}>
        <div className="mx-auto max-w-5xl">
          <SectionHead numeral="§ IV" kicker="The part that does the actual work" title="Three codebases, one product" />

          <Reveal>
            <div className="grid gap-4 md:grid-cols-[15rem_1fr] md:gap-6">
              <div role="tablist" aria-label="Architecture layers" className="grid grid-cols-2 gap-3 md:grid-cols-1">
                {theme.architecture.map((a, i) => (
                  <button
                    key={a.layer}
                    role="tab"
                    type="button"
                    id={`dex-l-tab-${i}`}
                    aria-selected={li === i}
                    aria-controls="dex-l-panel"
                    onClick={() => setLi(i)}
                    className={`dex-layer ${li === i ? 'is-on' : ''}`}
                  >
                    <span className="dex-mono text-[11px] tracking-[0.2em] opacity-80">0{i + 1}</span>
                    <span className="dex-serif text-lg font-semibold">{a.layer}</span>
                  </button>
                ))}
              </div>
              <Frame>
                <div key={li} id="dex-l-panel" role="tabpanel" aria-labelledby={`dex-l-tab-${li}`} className="dex-swap flex min-h-[13rem] flex-col justify-center px-5 py-8 sm:px-10">
                  <p className="dex-mono text-[11px] uppercase tracking-[0.26em] text-[color:var(--dx-gold)]">
                    Layer {li + 1} of {theme.architecture.length}
                  </p>
                  <h3 className="dex-serif mt-2 text-3xl text-[color:var(--dx-text)] sm:text-4xl">{layer.layer}</h3>
                  <p className="dex-mono mt-4 text-[13px] leading-relaxed text-[color:var(--dx-dim)] sm:text-sm">{layer.details}</p>
                </div>
              </Frame>
            </div>
          </Reveal>

          <Reveal className="mt-12 md:mt-16">
            <h3 className="dex-mono mb-6 text-center text-[12px] uppercase tracking-[0.26em] text-[color:var(--dx-gold)]">One round trip, from the parent’s phone</h3>
            <ol className="flex flex-col items-stretch gap-0 md:flex-row md:items-stretch">
              {ROUND_TRIP.map((s, i) => (
                <li key={s.t} className="flex flex-col items-stretch md:flex-1 md:flex-row">
                  <div className="dex-node flex-1">
                    <span className="dex-serif text-2xl leading-none text-[color:var(--dx-gold)]">{ROMAN[i]}</span>
                    <h4 className="dex-serif mt-2 text-lg font-semibold">{s.t}</h4>
                    <p className="mt-1 text-sm leading-snug text-[color:var(--dx-dim)]">{s.d}</p>
                  </div>
                  {i < ROUND_TRIP.length - 1 && (
                    <span className="dex-link" aria-hidden>
                      <i />
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ============================ ARCHIVE ========================= */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead numeral="§ V" kicker="Plates" title="The Archive" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {PLATES.map((pl, i) => (
              <Reveal key={pl.src} delay={i * 0.1} className="h-full">
                <figure className="dex-plate group h-full">
                  <div className="dex-plate-img relative aspect-[4/3] w-full">
                    <Image src={pl.src} alt={pl.alt} fill loading="lazy" sizes="(min-width: 1024px) 32vw, (min-width: 640px) 46vw, 92vw" className="object-cover" style={{ objectPosition: pl.pos }} />
                  </div>
                  <figcaption className="dex-cap dex-mono">
                    <span>{pl.cap}</span>
                    <span className="text-[color:var(--dx-gold)]">{pl.sub}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ OUTCOME ========================= */}
      <section className="px-4 pb-24 pt-6 sm:px-6 md:pb-32">
        <div ref={stampRef} className="mx-auto max-w-4xl">
          <Frame paper>
            <div className="relative px-6 py-12 text-center sm:px-12 md:px-16 md:py-16" style={{ color: p.bg }}>
              <p className="dex-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: '#6B5410' }}>
                Certificate of Outcome
              </p>
              <h2 className="dex-serif mt-3 text-3xl font-semibold sm:text-4xl">Excellence, archived.</h2>
              <div className="mx-auto my-6 h-px w-24" style={{ background: '#8A6D12' }} aria-hidden />
              <p className="dex-serif mx-auto max-w-2xl text-[1.3rem] italic leading-snug sm:text-[1.65rem]">{theme.outcomeQuote}</p>
              <div className={`dex-stamp ${stampSeen ? 'is-in' : ''}`} aria-hidden>
                <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="3">
                  <circle cx="60" cy="60" r="54" />
                  <circle cx="60" cy="60" r="46" strokeWidth="1.2" />
                  <path d="M60 28 L67 48 L88 49 L72 62 L77 83 L60 71 L43 83 L48 62 L32 49 L53 48 Z" fill="currentColor" stroke="none" />
                </svg>
              </div>
            </div>
          </Frame>
        </div>
      </section>

      <NextChapter currentSlug={theme.slug} accent={p.accent} />
      <SiteFooter />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const CSS = `
.dex-root{font-family:var(--font-inter),Inter,system-ui,sans-serif}
.dex-serif{font-family:var(--font-playfair),'Playfair Display',Georgia,serif;font-variant-numeric:lining-nums}
.dex-mono{font-family:var(--font-plex),'IBM Plex Mono',ui-monospace,monospace}
.dex-root button:focus-visible{outline:2px solid var(--dx-gold-hi);outline-offset:3px}

/* hero */
.dex-hero-glow{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(60% 50% at 70% 30%,rgba(212,175,55,.14),transparent 70%),radial-gradient(50% 40% at 10% 90%,rgba(34,53,107,.7),transparent 70%)}
.dex-shimmer{color:var(--dx-gold);
  background-image:linear-gradient(100deg,var(--dx-gold) 0%,var(--dx-gold) 38%,var(--dx-gold-hi) 50%,var(--dx-gold) 62%,var(--dx-gold) 100%);
  background-size:250% 100%;background-position:120% 0;
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  animation:dex-shimmer 5.5s ease-in-out infinite}
@keyframes dex-shimmer{0%{background-position:120% 0}60%,100%{background-position:-60% 0}}

/* certificate frame */
.dex-frame{position:relative;border:2px solid var(--dx-gold);padding:7px;background:linear-gradient(180deg,rgba(20,37,82,.55),rgba(11,23,54,.4))}
.dex-frame::before{content:'';position:absolute;inset:7px;border:1px solid var(--dx-gold);opacity:.55;pointer-events:none}
.dex-frame > *:not(.dex-corner){position:relative}
.dex-frame-paper{background:var(--dx-paper);border-color:#8A6D12}
.dex-frame-paper::before{border-color:#8A6D12;opacity:.7}
.dex-corner{position:absolute;width:11px;height:11px;background:var(--dx-gold);transform:rotate(45deg);z-index:2}
.dex-frame-paper .dex-corner{background:#8A6D12}
.dex-c1{top:-7px;left:-7px}.dex-c2{top:-7px;right:-7px}.dex-c3{bottom:-7px;left:-7px}.dex-c4{bottom:-7px;right:-7px}

/* crest draw */
.dex-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:dex-draw 1.8s cubic-bezier(.7,0,.3,1) .2s forwards}
.dex-d2{animation-delay:.5s}.dex-d3{animation-delay:.9s}.dex-d4{animation-delay:1.3s}
@keyframes dex-draw{to{stroke-dashoffset:0}}
.dex-twinkle{animation:dex-twinkle 2.8s ease-in-out infinite}
@keyframes dex-twinkle{0%,100%{transform:scale(1) rotate(0);opacity:1}50%{transform:scale(1.5) rotate(45deg);opacity:.6}}

/* arch image */
.dex-arch{border-radius:999px 999px 6px 6px;overflow:hidden;border:2px solid var(--dx-gold);box-shadow:0 0 0 6px var(--dx-bg),0 0 0 7px rgba(212,175,55,.6)}
.dex-arch-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,23,54,.1),rgba(11,23,54,.55))}
.dex-seal{position:absolute;right:-6px;bottom:-14px;width:5.6rem;height:5.6rem;border-radius:999px;background:var(--dx-gold);color:var(--dx-bg);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;text-align:center;line-height:1.25;border:3px double var(--dx-bg);
  box-shadow:0 0 0 2px var(--dx-gold);animation:dex-bob 6s ease-in-out infinite}
@keyframes dex-bob{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-6px) rotate(-2deg)}}
@media(min-width:768px){.dex-seal{right:-14px;width:6.4rem;height:6.4rem}}

/* marquee */
.dex-band{border-block:1px solid rgba(212,175,55,.45);background:var(--dx-bg);overflow:hidden;padding:1rem 0}
.dex-marquee{display:flex;width:max-content;animation:dex-marq 38s linear infinite}
.dex-track{display:flex;flex-shrink:0;white-space:nowrap;font-size:1.35rem;letter-spacing:.22em;color:var(--dx-dim)}
@media(min-width:768px){.dex-track{font-size:1.7rem}}
@keyframes dex-marq{to{transform:translateX(-50%)}}

/* tabs */
.dex-tab{min-width:3rem;height:3rem;border:1px solid rgba(212,175,55,.6);color:var(--dx-gold);font-size:1.1rem;transition:background .25s,color .25s,transform .25s}
.dex-tab:hover{transform:translateY(-2px)}
.dex-tab.is-on{background:var(--dx-gold);color:var(--dx-bg)}
.dex-swap{animation:dex-swap .5s cubic-bezier(.16,1,.3,1)}
@keyframes dex-swap{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

/* rank board */
.dex-row{position:relative;display:grid;grid-template-columns:3rem 1fr;grid-template-areas:'rank val' 'rank label';column-gap:1rem;row-gap:.35rem;align-items:center;
  padding:1rem 1rem 1.15rem;background:var(--dx-bg);border:1px solid rgba(212,175,55,.35);
  opacity:0;transform:translateY(14px);transition:opacity .6s ease,transform .6s cubic-bezier(.16,1,.3,1),border-color .3s;transition-delay:calc(var(--i) * 110ms)}
.dex-row.is-in{opacity:1;transform:none}
.dex-row-top{border-color:var(--dx-gold);box-shadow:inset 0 0 0 3px var(--dx-bg),inset 0 0 0 4px rgba(212,175,55,.45)}
.dex-row:hover{border-color:var(--dx-gold-hi)}
.dex-rank{grid-area:rank;position:relative;display:flex;align-items:center;justify-content:center;width:3rem;height:3rem;border-radius:999px;border:1px solid rgba(212,175,55,.6);color:var(--dx-gold);font-size:1.25rem}
.dex-rank-top{background:var(--dx-gold);color:var(--dx-bg);font-weight:700}
.dex-spark{position:absolute;top:-4px;right:-4px;color:var(--dx-gold-hi);animation:dex-twinkle 2.4s ease-in-out infinite}
.dex-val{grid-area:val}
.dex-row > .dex-mono{grid-area:label}
.dex-rule{position:absolute;left:0;bottom:0;height:2px;width:100%;background:linear-gradient(90deg,var(--dx-gold),transparent);transform:scaleX(0);transform-origin:left;transition:transform 1.1s cubic-bezier(.7,0,.3,1) .3s}
.dex-row.is-in .dex-rule{transform:scaleX(1)}
@media(min-width:768px){
  .dex-row{grid-template-columns:4rem 11rem 1fr;grid-template-areas:'rank val label';column-gap:1.5rem;padding:1.25rem 1.75rem 1.4rem}
  .dex-rank{width:3.4rem;height:3.4rem}
}

/* feature cards */
.dex-card{position:relative;padding:1.5rem;background:var(--dx-mid);border:1px solid rgba(212,175,55,.4);transition:transform .3s cubic-bezier(.16,1,.3,1),border-color .3s,box-shadow .3s}
.dex-card::before{content:'';position:absolute;inset:5px;border:1px solid rgba(212,175,55,.25);pointer-events:none}
.dex-card:hover{transform:translateY(-4px);border-color:var(--dx-gold);box-shadow:0 14px 28px -14px rgba(0,0,0,.6)}
.dex-card-paper{background:var(--dx-paper);color:var(--dx-bg);border-color:#8A6D12}
.dex-card-paper::before{border-color:rgba(138,109,18,.5)}
.dex-card-paper .dex-serif:first-child,.dex-card-paper span.dex-serif{color:#6B5410}
.dex-stamp-mini{color:var(--dx-ink);transform:rotate(-10deg);opacity:.9}

/* architecture */
.dex-layer{display:flex;flex-direction:column;gap:2px;align-items:flex-start;text-align:left;min-height:3.5rem;padding:.7rem 1rem;color:var(--dx-text);background:var(--dx-bg);border:1px solid rgba(212,175,55,.35);transition:background .25s,color .25s,border-color .25s}
.dex-layer:hover{border-color:var(--dx-gold)}
.dex-layer.is-on{background:var(--dx-gold);color:var(--dx-bg);border-color:var(--dx-gold)}
.dex-node{padding:1.1rem 1.2rem;background:var(--dx-bg);border:1px solid rgba(212,175,55,.45)}
.dex-link{position:relative;display:block;flex:none;width:2px;height:2.2rem;margin:0 auto;background:rgba(212,175,55,.45)}
.dex-link i{position:absolute;left:50%;top:0;width:8px;height:8px;margin-left:-4px;border-radius:99px;background:var(--dx-gold-hi);animation:dex-dot-y 2.2s ease-in-out infinite}
@keyframes dex-dot-y{0%{transform:translateY(0);opacity:0}15%,85%{opacity:1}100%{transform:translateY(2.2rem);opacity:0}}
@keyframes dex-dot-x{0%{transform:translateX(0);opacity:0}15%,85%{opacity:1}100%{transform:translateX(2.4rem);opacity:0}}
@media(min-width:768px){
  .dex-link{width:2.4rem;height:2px;margin:auto 0}
  .dex-link i{left:0;top:50%;margin:-4px 0 0;animation-name:dex-dot-x}
}

/* archive */
.dex-plate{position:relative;display:flex;flex-direction:column;border:2px solid var(--dx-gold);padding:6px;background:var(--dx-mid);margin:0}
.dex-plate-img{overflow:hidden;flex:none}
.dex-plate-img img{transition:transform .8s cubic-bezier(.16,1,.3,1)}
.dex-plate:hover .dex-plate-img img{transform:scale(1.05)}
.dex-cap{display:flex;flex-wrap:wrap;justify-content:space-between;gap:1rem;padding:.7rem .4rem .35rem;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--dx-dim)}

/* outcome stamp */
.dex-stamp{position:relative;margin:1.75rem auto 0;width:4.8rem;height:4.8rem;color:var(--dx-ink);opacity:0;transform:scale(1.5) rotate(-14deg)}
.dex-stamp.is-in{animation:dex-stamp .7s cubic-bezier(.34,1.56,.64,1) .35s forwards}
@keyframes dex-stamp{to{opacity:.85;transform:scale(1) rotate(-8deg)}}
@media(min-width:768px){.dex-stamp{width:6rem;height:6rem}}

@media (prefers-reduced-motion:reduce){
  .dex-shimmer,.dex-marquee,.dex-seal,.dex-twinkle,.dex-spark,.dex-link i{animation:none!important}
  .dex-shimmer{background-position:50% 0}
  .dex-draw{animation:none!important;stroke-dashoffset:0}
  .dex-swap{animation:none}
  .dex-row{opacity:1;transform:none;transition:none}
  .dex-rule{transform:scaleX(1);transition:none}
  .dex-stamp,.dex-stamp.is-in{animation:none;opacity:.85;transform:rotate(-8deg)}
  .dex-card,.dex-plate-img img{transition:none}
}
`;
