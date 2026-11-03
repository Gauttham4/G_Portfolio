'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

// helpers
const PLAYFAIR = { fontFamily: 'var(--font-playfair), Georgia, "Times New Roman", serif' } as const;
const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

function useSeen<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
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
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Hairline({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={`h-px w-full origin-left gp-line-bg ${className}`}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, ease: EASE }}
    />
  );
}

function Heading({ no, kicker, title, sub }: { no: string; kicker: string; title: ReactNode; sub?: string }) {
  return (
    <Reveal className="mb-10 md:mb-14 max-w-3xl">
      <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.3em] gp-gold flex items-center gap-3">
        <span className="gp-stamp">{no}</span>
        {kicker}
      </p>
      <h2 className="mt-5 text-4xl sm:text-5xl md:text-6xl leading-[1.05] gp-cream" style={{ ...PLAYFAIR, textWrap: 'balance' }}>
        {title}
      </h2>
      {sub && <p className="mt-4 text-base md:text-lg gp-dim font-sans max-w-xl leading-relaxed">{sub}</p>}
    </Reveal>
  );
}

function Barcode({ className = '', pattern }: { className?: string; pattern?: number[] }) {
  const w = pattern ?? [3, 1, 2, 1, 1, 3, 2, 2, 1, 1, 3, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2];
  let x = 0;
  const bars: ReactNode[] = [];
  w.forEach((n, i) => {
    if (i % 2 === 0) bars.push(<rect key={i} x={x} y={0} width={n} height={40} fill="currentColor" />);
    x += n;
  });
  return (
    <svg viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" className={className} aria-hidden>
      {bars}
    </svg>
  );
}

// the gemstone
const DARK = [46, 30, 8];
const LIGHT = [255, 238, 188];
const mix = (t: number) => `rgb(${DARK.map((d, i) => Math.round(d + (LIGHT[i] - d) * t)).join(',')})`;
const pt = (r: number, deg: number): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [200 + r * Math.cos(a), 200 + r * Math.sin(a)];
};

type Facet = { pts: string; fill: string; tw: boolean; d: number };

function buildFacets(): Facet[] {
  const T = (k: number) => pt(80, 45 * k + 22.5);
  const G = (k: number) => pt(172, 45 * k + 22.5);
  const S = (k: number) => pt(122, 45 * k);
  const out: Facet[] = [];
  const add = (poly: [number, number][], deg: number, boost = 0) => {
    const b = 0.5 + 0.5 * Math.cos(((deg - 315) * Math.PI) / 180);
    const idx = out.length;
    out.push({
      pts: poly.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' '),
      fill: mix(Math.min(1, Math.max(0.04, Math.pow(b, 1.35) * 1.05 + boost))),
      tw: idx % 3 === 0,
      d: (idx * 0.43) % 5,
    });
  };
  for (let k = 0; k < 8; k++) {
    add([T(k - 1), T(k), S(k)], 45 * k, 0.1);
    add([T(k), S(k), G(k), S(k + 1)], 45 * k + 22.5, 0);
    add([S(k), G(k - 1), G(k)], 45 * k, -0.05);
  }
  return out;
}

function Gem() {
  const facets = useMemo(buildFacets, []);
  const table = useMemo(
    () => Array.from({ length: 8 }, (_, k) => pt(80, 45 * k + 22.5).map((n) => n.toFixed(1)).join(',')).join(' '),
    [],
  );
  return (
    <svg viewBox="0 0 400 400" className="gp-spin h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="gp-table" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#FFF4D6" />
          <stop offset="0.6" stopColor="#E7C792" />
          <stop offset="1" stopColor="#8F6B2E" />
        </radialGradient>
      </defs>
      {facets.map((f, i) => (
        <polygon
          key={i}
          points={f.pts}
          fill={f.fill}
          stroke="#F6E3B8"
          strokeOpacity="0.55"
          strokeWidth="0.8"
          strokeLinejoin="round"
          className={f.tw ? 'gp-tw' : undefined}
          style={f.tw ? ({ animationDelay: `${f.d}s` } as CSSProperties) : undefined}
        />
      ))}
      <polygon points={table} fill="url(#gp-table)" stroke="#FFF4D6" strokeOpacity="0.8" strokeWidth="1" />
    </svg>
  );
}

function Glint({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="-24 -24 48 48" className={`gp-glint ${className}`} aria-hidden>
      <path d="M0 -22 L3 -3 L22 0 L3 3 L0 22 L-3 3 L-22 0 L-3 -3Z" fill="#FFF8E6" />
    </svg>
  );
}

const RING_TEXT = 'GEMPOINT · SCAN IT · WEIGH IT · BILL IT · 22K · 18K · HUID · GEMPOINT · SCAN IT · WEIGH IT · BILL IT · 22K · 18K · HUID · ';

function Hero({ theme }: { theme: ProjectTheme }) {
  return (
    <section className="relative px-5 sm:px-8 md:px-12 pt-24 md:pt-36 pb-16 md:pb-24 min-h-[88svh] flex items-center">
      <div className="gp-spot" aria-hidden />
      <div className="relative mx-auto w-full max-w-7xl grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-8 items-center">
        <div className="order-2 lg:order-1">
          <p className="gp-rise font-mono text-[11px] sm:text-xs uppercase tracking-[0.28em] gp-gold" style={{ animationDelay: '0.05s' }}>
            {theme.kicker}
          </p>
          <h1
            className="gp-rise gp-gold-text mt-5 text-[3.6rem] min-[400px]:text-7xl sm:text-8xl lg:text-[7.5rem] leading-[0.95] tracking-tight"
            style={{ ...PLAYFAIR, animationDelay: '0.2s' }}
          >
            {theme.title}
          </h1>
          <div className="gp-rise mt-5 flex items-center gap-4" style={{ animationDelay: '0.35s' }}>
            <span className="gp-stamp">22K</span>
            <span className="gp-stamp">HUID</span>
            <span className="h-px flex-1 gp-line-bg max-w-[8rem]" aria-hidden />
          </div>
          <p className="gp-rise mt-6 font-display italic text-2xl md:text-3xl gp-cream leading-snug max-w-xl" style={{ animationDelay: '0.45s' }}>
            {theme.subtitle}
          </p>
          <p className="gp-rise mt-5 font-sans text-base md:text-lg gp-dim leading-relaxed max-w-xl" style={{ animationDelay: '0.55s' }}>
            Gold catches the light. So should your billing counter. Scan it. Weigh it. Bill it. Barcoded ornaments, validated
            forms, today&rsquo;s rate locked in, and a printable invoice in the time it takes a customer to fasten the clasp.
          </p>
          <ul className="gp-rise mt-7 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] gp-gold" style={{ animationDelay: '0.7s' }}>
            {['React 19', 'Vite', 'Tailwind 4', 'Zod'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rotate-45 bg-current" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 lg:order-2 mx-auto lg:ml-auto">
          <div className="relative aspect-square w-[min(78vw,330px)] sm:w-[400px] lg:w-[500px]">
            <svg viewBox="0 0 500 500" className="gp-spin-rev absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <path id="gp-ring" d="M250,250 m-228,0 a228,228 0 1,1 456,0 a228,228 0 1,1 -456,0" />
              </defs>
              <circle cx="250" cy="250" r="246" fill="none" stroke="var(--gp-gold)" strokeOpacity="0.35" strokeWidth="1" />
              <circle cx="250" cy="250" r="208" fill="none" stroke="var(--gp-gold)" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 6" />
              <text fill="var(--gp-gold)" fontSize="17" letterSpacing="2" style={{ fontFamily: 'var(--font-plex), ui-monospace, monospace' }}>
                <textPath href="#gp-ring" textLength="1415" lengthAdjust="spacing">
                  {RING_TEXT}
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-[9%]">
              <Gem />
            </div>
            <Glint className="absolute left-[27%] top-[24%] h-10 w-10 sm:h-14 sm:w-14" />
            <Glint className="gp-glint-b absolute right-[24%] bottom-[28%] h-7 w-7 sm:h-9 sm:w-9" />
          </div>
        </div>
      </div>
    </section>
  );
}

// 01  at the counter (stepper)
const STEPS = [
  { id: 'scan', label: 'Scan', n: '01' },
  { id: 'weigh', label: 'Weigh', n: '02' },
  { id: 'bill', label: 'Bill', n: '03' },
] as const;

function Counter() {
  const [step, setStep] = useState(0);
  const panel = (i: number) => `col-start-1 row-start-1 transition-opacity duration-300 ${step === i ? 'opacity-100 gp-on' : 'opacity-0 invisible'}`;
  return (
    <section className="px-5 sm:px-8 md:px-12 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Heading
          no="I"
          kicker="At the counter"
          title={
            <>
              <span className="inline-block">Scan it.</span> <span className="inline-block">Weigh it.</span> <span className="inline-block">Bill it.</span>
            </>
          }
          sub="The brief was one sentence: let me scan, let me bill, let me see what sold today. Tap through the three beats of a sale."
        />
        <Reveal>
          <div className="gp-frame">
            <div role="tablist" aria-label="Sale steps" className="grid grid-cols-3 border-b gp-border">
              {STEPS.map((s, i) => (
                <button
                  key={s.id}
                  role="tab"
                  id={`gp-tab-${s.id}`}
                  aria-selected={step === i}
                  aria-controls={`gp-panel-${s.id}`}
                  onClick={() => setStep(i)}
                  className={`min-h-[52px] px-2 font-mono text-[11px] sm:text-sm uppercase tracking-[0.18em] sm:tracking-[0.25em] transition-colors ${
                    step === i ? 'gp-tab-on' : 'gp-dim hover:text-[var(--gp-gold)]'
                  }`}
                >
                  <span className="opacity-70 mr-2">{s.n}</span>
                  {s.label}
                </button>
              ))}
            </div>

            <div className="grid p-5 sm:p-8 md:p-10">
              {/* SCAN */}
              <div role="tabpanel" id="gp-panel-scan" aria-labelledby="gp-tab-scan" aria-hidden={step !== 0} className={`${panel(0)} grid md:grid-cols-2 gap-8 items-center`}>
                <div className="gp-viewfinder relative h-44 sm:h-56 overflow-hidden">
                  <i className="gp-corner tl" /><i className="gp-corner tr" /><i className="gp-corner bl" /><i className="gp-corner br" />
                  <Barcode className="absolute inset-x-[12%] top-[22%] h-[56%] w-[76%] gp-cream" />
                  <div className="gp-beam" aria-hidden />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl gp-cream" style={PLAYFAIR}>A tag becomes a line item</h3>
                  <p className="mt-3 gp-dim leading-relaxed">
                    Quagga2 decodes Code-128 and EAN tags from the laptop camera. QR tags from html5-qrcode carry SKU, weight, purity and
                    goldsmith code in one square. A misread? Manual entry, same Zod validator, one keystroke away.
                  </p>
                  <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: 'var(--gp-emerald)' }}>
                    <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-current" /> Customer name auto-fills
                  </p>
                </div>
              </div>

              {/* WEIGH */}
              <div role="tabpanel" id="gp-panel-weigh" aria-labelledby="gp-tab-weigh" aria-hidden={step !== 1} className={`${panel(1)} grid md:grid-cols-2 gap-8 items-center`}>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] gp-dim mb-3">Gross weight</p>
                  <div className="flex h-12 w-full overflow-hidden border gp-border">
                    <div className="gp-grow flex-[78] flex items-center px-3 font-mono text-xs uppercase tracking-[0.15em]" style={{ background: 'linear-gradient(90deg,#C9A25E,#E7C792)', color: '#17120A' }}>
                      Net
                    </div>
                    <div className="gp-hatch flex-[22] flex items-center justify-center px-1 font-mono text-[10px] sm:text-xs uppercase gp-cream">Stone</div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.14em]">
                    {['Making: per gram or flat', 'Wastage %', 'Rate of the day'].map((c) => (
                      <span key={c} className="gp-chip">{c}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl gp-cream" style={PLAYFAIR}>Twelve fields that agree with each other</h3>
                  <p className="mt-3 gp-dim leading-relaxed">
                    Gross, stone and net weight, making mode, wastage and the day&rsquo;s rate. Get one wrong and the customer overpays or the
                    shop loses a thousand rupees, so Zod owns the truth and errors show inline.
                  </p>
                </div>
              </div>

              {/* BILL */}
              <div role="tabpanel" id="gp-panel-bill" aria-labelledby="gp-tab-bill" aria-hidden={step !== 2} className={`${panel(2)} grid md:grid-cols-2 gap-8 items-center`}>
                <ul className="font-mono text-xs sm:text-sm">
                  {[
                    ['Gold value', 'net weight × today’s rate'],
                    ['Making charge', 'per gram or flat'],
                    ['Wastage', 'percentage of net'],
                    ['GST', 'CGST + SGST'],
                  ].map(([a, b], i) => (
                    <li key={a} className="gp-bill-row flex items-baseline gap-3 border-b border-dashed gp-border py-3" style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
                      <span className="gp-cream uppercase tracking-[0.12em]">{a}</span>
                      <span className="flex-1" />
                      <span className="gp-dim text-right">{b}</span>
                    </li>
                  ))}
                  <li className="gp-bill-row flex items-baseline gap-3 py-4 gp-gold" style={{ animationDelay: '0.7s' }}>
                    <span className="uppercase tracking-[0.12em] font-semibold">Amount payable</span>
                    <span className="flex-1 border-b border-dotted border-current opacity-40" />
                    <span>live total</span>
                  </li>
                </ul>
                <div>
                  <h3 className="text-2xl sm:text-3xl gp-cream" style={PLAYFAIR}>Print. Forty seconds, start to finish.</h3>
                  <p className="mt-3 gp-dim leading-relaxed">
                    The total recomputes on every keystroke. A clean A5 invoice lists the item, HUID, weight, rate and charges, tuned dozens of
                    times against a real thermal printer in the back office.
                  </p>
                  <button
                    onClick={() => setStep(0)}
                    className="mt-5 min-h-[44px] px-5 font-mono text-xs uppercase tracking-[0.22em] border gp-border gp-gold hover:bg-[color:var(--gp-gold)] hover:text-black transition-colors"
                  >
                    Next customer ↺
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// 02  words (quotes)
function Words({ theme }: { theme: ProjectTheme }) {
  const [q1, q2, q3] = theme.story.quotes;
  return (
    <section className="px-5 sm:px-8 md:px-12 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Heading no="II" kicker="The brief, engraved" title="Three lines that shaped the build" />
        <Reveal className="text-center max-w-4xl mx-auto">
          <span className="gp-gold text-6xl leading-none block h-10" style={PLAYFAIR} aria-hidden>&ldquo;</span>
          <blockquote className="mt-4 text-3xl sm:text-5xl md:text-6xl leading-[1.12] gp-cream" style={PLAYFAIR}>
            {q1.quote}
          </blockquote>
          <p className="mt-6 font-display italic text-lg md:text-xl gp-gold">{q1.context}</p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] gp-dim">{q1.kicker}</p>
        </Reveal>

        <div className="mt-14 md:mt-20 grid md:grid-cols-5 gap-5 md:gap-6">
          <Reveal className="md:col-span-3 gp-frame p-6 sm:p-8 relative">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] gp-gold">{q2.kicker}</p>
            <blockquote className="mt-4 font-display text-xl sm:text-2xl leading-snug gp-cream">&ldquo;{q2.quote}&rdquo;</blockquote>
            <p className="mt-5 text-sm sm:text-base gp-dim leading-relaxed">{q2.context}</p>
          </Reveal>
          <Reveal delay={0.12} className="md:col-span-2 gp-frame p-6 sm:p-8 flex flex-col justify-between gap-6 relative">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] gp-gold">{q3.kicker}</p>
            <blockquote className="text-3xl sm:text-4xl leading-tight gp-gold-text" style={PLAYFAIR}>&ldquo;{q3.quote}&rdquo;</blockquote>
            <p className="text-sm sm:text-base gp-dim leading-relaxed">{q3.context}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// 03  price-tag receipt (features)
function Receipt({ theme }: { theme: ProjectTheme }) {
  const [ref, seen] = useSeen<HTMLDivElement>(0.12);
  return (
    <section className="px-5 sm:px-8 md:px-12 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Heading no="III" kicker="The itemised bill" title="Six things, priced in craft" sub="Every feature on one price tag. Nothing here was bolted on after the fact." />
        <div className="mx-auto max-w-2xl">
          <div className="relative pt-14">
            <svg viewBox="0 0 200 70" className="absolute left-1/2 top-0 h-14 w-40 -translate-x-1/2" aria-hidden>
              <path d="M100 66 C 60 40, 150 30, 100 4 M100 66 C 140 40, 50 30, 100 4" fill="none" stroke="var(--gp-gold)" strokeWidth="1.5" />
            </svg>
            <div ref={ref} className="gp-paper relative">
              <span className="gp-hole" aria-hidden />
              <div className="px-5 sm:px-9 pt-12 pb-3">
                <div className="flex items-start justify-between gap-4 border-b-2 border-dashed pb-4" style={{ borderColor: 'rgba(23,18,10,.35)' }}>
                  <div>
                    <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.25em] gp-ink-soft">Tax invoice · A5</p>
                    <p className="text-2xl sm:text-3xl gp-ink" style={PLAYFAIR}>{theme.title}</p>
                  </div>
                  <span className={`gp-paid ${seen ? 'gp-paid-in' : ''}`}>Hallmarked</span>
                </div>
                <ol>
                  {theme.features.map((f, i) => (
                    <li
                      key={f.title}
                      className={`gp-item ${seen ? 'gp-item-in' : ''} flex gap-3 sm:gap-4 py-4 border-b border-dotted`}
                      style={{ transitionDelay: `${i * 90}ms`, borderColor: 'rgba(23,18,10,.3)' }}
                    >
                      <span className="font-mono text-xs sm:text-sm gp-ink-soft pt-1 w-9 shrink-0">No.{String(i + 1).padStart(2, '0')}</span>
                      <div className="min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold gp-ink leading-snug" style={PLAYFAIR}>{f.title}</h3>
                        <p className="mt-1 text-sm sm:text-base gp-ink-soft leading-relaxed">{f.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="flex items-baseline gap-3 pt-5 font-mono text-xs sm:text-sm uppercase tracking-[0.15em] gp-ink">
                  <span className="font-semibold">Time at counter</span>
                  <span className="flex-1 border-b border-dotted" style={{ borderColor: 'rgba(23,18,10,.5)' }} />
                  <span className="font-semibold">40 sec</span>
                </div>
                <Barcode className="mt-5 h-10 w-full gp-ink" />
                <p className="mt-2 mb-3 text-center font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] gp-ink-soft">Scan · Weigh · Bill</p>
              </div>
              <div className="gp-zig" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 04  hallmark stamps (big numbers)
function Stamp({ value, label, i }: { value: string; label: string; i: number }) {
  const reduce = useReducedMotion();
  const [ref, seen] = useSeen<HTMLDivElement>(0.4);
  const target = parseInt(value, 10);
  const [n, setN] = useState(reduce ? target : 0);
  useEffect(() => {
    if (!seen || reduce) {
      if (reduce) setN(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1200);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, reduce, target]);
  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <div className="gp-medal relative aspect-square w-[min(40vw,170px)] sm:w-44 lg:w-52">
        <svg viewBox="0 0 200 200" className={`absolute inset-0 h-full w-full ${i % 2 ? 'gp-spin-rev' : 'gp-spin'}`} aria-hidden>
          <circle cx="100" cy="100" r="97" fill="none" stroke="var(--gp-gold)" strokeWidth="1" strokeDasharray="1 5" strokeLinecap="round" />
          <circle cx="100" cy="100" r="88" fill="none" stroke="var(--gp-gold)" strokeOpacity="0.55" strokeWidth="1" />
        </svg>
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
          <polygon points="100,22 156,44 178,100 156,156 100,178 44,156 22,100 44,44" fill="rgba(231,199,146,0.06)" stroke="var(--gp-gold)" strokeOpacity="0.8" strokeWidth="1" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-5xl sm:text-6xl gp-gold-text" style={PLAYFAIR}>
          {n}
        </span>
      </div>
      <p className="mt-4 font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] gp-cream">{label}</p>
    </div>
  );
}

function Numbers({ theme }: { theme: ProjectTheme }) {
  return (
    <section className="px-5 sm:px-8 md:px-12 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Heading no="IV" kicker="Hallmarks" title="The assay" sub="Four marks struck into the build." />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-4">
          {theme.bigNumbers.map((b, i) => (
            <Reveal key={b.label} delay={i * 0.08}>
              <Stamp value={b.value} label={b.label} i={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// 05  the setting (architecture)
const BANDS = [
  '90,40 210,40 240,72 60,72',
  '60,72 240,72 272,104 28,104',
  '28,104 272,104 212,178 88,178',
  '88,178 212,178 150,252',
];

function Setting({ theme }: { theme: ProjectTheme }) {
  const [active, setActive] = useState(0);
  return (
    <section className="px-5 sm:px-8 md:px-12 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Heading no="V" kicker="The setting" title="Four layers, cut to hold the stone" sub="Tap a layer, or a facet of the gem, to see what sits there." />
        <div className="grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-8 md:gap-12 items-center">
          <Reveal className="mx-auto w-full max-w-[320px]">
            <svg viewBox="0 0 300 270" className="h-auto w-full" role="img" aria-label="Gem profile with four layers">
              {BANDS.map((p, i) => (
                <polygon
                  key={i}
                  points={p}
                  onClick={() => setActive(i)}
                  className={`gp-band ${active === i ? 'gp-band-on' : ''}`}
                  strokeLinejoin="round"
                />
              ))}
              <g className="gp-facets" aria-hidden>
                <path d="M120,40 L105,104 M180,40 L195,104 M150,40 L150,72 M60,72 L105,104 M240,72 L195,104 M105,104 L150,252 M195,104 L150,252 M150,104 L150,252 M60,104 L120,178 M240,104 L180,178" />
              </g>
            </svg>
          </Reveal>
          <ol className="space-y-3">
            {theme.architecture.map((a, i) => (
              <li key={a.layer}>
                <button
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  aria-pressed={active === i}
                  className={`gp-layer w-full text-left min-h-[64px] p-4 sm:p-5 border transition-colors ${active === i ? 'gp-layer-on' : ''}`}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-xs gp-gold">0{i + 1}</span>
                    <span className="text-xl sm:text-2xl gp-cream" style={PLAYFAIR}>{a.layer}</span>
                  </span>
                  <span className="mt-1.5 block pl-9 sm:pl-10 text-sm sm:text-base gp-dim leading-relaxed">{a.details}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// 06  showcase (gallery)
const LOTS = [
  { cap: 'Pearl strand', alt: 'Pearl necklace with a rose-shaped diamond clasp in an open red gift box', ar: 'md:aspect-[3/2]' },
  { cap: 'Diamond cuff', alt: 'Diamond-set silver bracelet glittering against black', ar: 'md:aspect-[5/2]' },
  { cap: 'Halo ring', alt: 'Halo diamond ring resting on a black stone block', ar: 'md:aspect-square' },
  { cap: 'Gold chain', alt: 'Gold chain bracelet lying on a fashion magazine', ar: 'md:aspect-[3/4]' },
  { cap: 'Layered light', alt: 'Layered gold necklaces with a teal gem and a crescent pendant', ar: 'md:aspect-[2/3]' },
  { cap: 'Crystal drops', alt: 'Crystal drop earrings in green, clear and red on a pink backdrop', ar: 'md:aspect-square' },
];
const COLS = [[0, 3], [4, 1], [2, 5]];

function Showcase({ theme }: { theme: ProjectTheme }) {
  const src = (i: number) => theme.gallery?.[i]?.src ?? `/work/${theme.slug}/gallery-${i + 1}.jpg`;
  return (
    <section className="px-5 sm:px-8 md:px-12 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Heading no="VI" kicker="Showcase cabinet" title="What the counter sells" sub="The trade the software was built for, laid out lot by lot." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {COLS.map((col, c) => (
            <div key={c} className={`flex flex-col gap-3 md:gap-4 ${c === 1 ? 'md:pt-[10%]' : ''}`}>
              {col.map((idx) => (
                <Reveal key={idx} delay={c * 0.08}>
                  <figure className={`gp-lot group relative aspect-[4/3] ${LOTS[idx].ar} overflow-hidden`}>
                    <Image
                      src={src(idx)}
                      alt={LOTS[idx].alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 92vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <figcaption className="gp-tag absolute left-3 bottom-3 font-mono text-[10px] sm:text-[11px] md:text-[10px] lg:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.1em] lg:tracking-[0.2em]">
                      Lot {String(idx + 1).padStart(2, '0')} · {LOTS[idx].cap}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 07  outcome
function Outcome({ theme }: { theme: ProjectTheme }) {
  return (
    <section className="px-5 sm:px-8 md:px-12 pt-16 md:pt-24 pb-8">
      <div className="mx-auto max-w-4xl text-center">
        <Hairline />
        <Reveal className="py-14 md:py-20">
          <svg viewBox="0 0 40 34" className="mx-auto h-9 w-10" aria-hidden>
            <polygon points="10,2 30,2 38,12 20,32 2,12" fill="none" stroke="var(--gp-gold)" strokeWidth="1.2" />
            <polyline points="2,12 38,12 14,12 20,32 26,12 20,2 14,12 20,2" fill="none" stroke="var(--gp-gold)" strokeWidth="0.8" strokeOpacity="0.7" />
          </svg>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] gp-gold">The finished piece</p>
          <blockquote className="mt-6 text-2xl sm:text-4xl md:text-5xl leading-[1.2] gp-cream" style={PLAYFAIR}>
            {theme.outcomeQuote}
          </blockquote>
        </Reveal>
        <Hairline />
      </div>
    </section>
  );
}

// page
export default function Page({ theme }: { theme: ProjectTheme }) {
  const rootStyle = { ['--gp-gold' as string]: theme.palette.accent, ['--gp-emerald' as string]: theme.palette.accent2 ?? '#2DBF8F' } as CSSProperties;
  return (
    <div className="gp-root relative overflow-x-clip" style={rootStyle}>
      <style>{CSS}</style>
      <main>
        <Hero theme={theme} />
        <Counter />
        <Words theme={theme} />
        <Receipt theme={theme} />
        <Numbers theme={theme} />
        <Setting theme={theme} />
        <Showcase theme={theme} />
        <Outcome theme={theme} />
      </main>
      <div className="gp-cream">
        <NextChapter currentSlug={theme.slug} accent={theme.palette.accent} />
      </div>
      <SiteFooter />
      <div aria-hidden className="gp-clear bg-ink" />
    </div>
  );
}

const CSS = `
.gp-root{--gp-bg:#080706;--gp-cream:#F4EBD7;--gp-dim:#B8AA90;--gp-paper:#F4EBD7;--gp-ink:#17120A;background:var(--gp-bg);color:var(--gp-cream);min-height:100svh}
.gp-root .gp-gold{color:var(--gp-gold)}
.gp-root .gp-cream{color:var(--gp-cream)}
.gp-root .gp-dim{color:var(--gp-dim)}
.gp-root .gp-ink{color:var(--gp-ink)}
.gp-root .gp-ink-soft{color:#4A3F2C}
.gp-root .gp-border{border-color:rgba(231,199,146,.28)}
.gp-root .gp-line-bg{background:linear-gradient(90deg,transparent,var(--gp-gold) 18%,var(--gp-gold) 82%,transparent)}
.gp-root .gp-gold-text{background:linear-gradient(180deg,#FFF4D6 0%,var(--gp-gold) 48%,#B98A45 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}
.gp-root :focus-visible{outline:2px solid var(--gp-gold);outline-offset:3px}
.gp-root .gp-stamp{display:inline-flex;align-items:center;justify-content:center;min-width:2.4rem;padding:.2rem .55rem;border:1px solid var(--gp-gold);box-shadow:inset 0 0 0 2px var(--gp-bg),inset 0 0 0 3px rgba(231,199,146,.5);font-family:var(--font-plex),ui-monospace,monospace;font-size:.7rem;letter-spacing:.15em;color:var(--gp-gold);clip-path:polygon(8px 0,calc(100% - 8px) 0,100% 8px,100% calc(100% - 8px),calc(100% - 8px) 100%,8px 100%,0 calc(100% - 8px),0 8px)}
.gp-root .gp-spot{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 55% 60% at 72% 42%,rgba(231,199,146,.17),transparent 70%),radial-gradient(ellipse 40% 30% at 6% 68%,rgba(45,191,143,.09),transparent 70%)}
.gp-root .gp-frame{position:relative;border:1px solid rgba(231,199,146,.3);background:linear-gradient(180deg,rgba(231,199,146,.05),rgba(231,199,146,.01))}
.gp-root .gp-frame::before,.gp-root .gp-frame::after{content:"";position:absolute;width:14px;height:14px;border:1px solid var(--gp-gold);pointer-events:none}
.gp-root .gp-frame::before{top:-1px;left:-1px;border-right:0;border-bottom:0}
.gp-root .gp-frame::after{bottom:-1px;right:-1px;border-left:0;border-top:0}
.gp-root .gp-tab-on{color:#17120A;background:linear-gradient(90deg,#C9A25E,var(--gp-gold))}
.gp-root .gp-spin{animation:gp-spin 90s linear infinite}
.gp-root .gp-spin-rev{animation:gp-spin 120s linear infinite reverse}
.gp-root .gp-tw{animation:gp-tw 5s ease-in-out infinite}
.gp-root .gp-glint{transform-origin:center;animation:gp-glint 4.6s ease-in-out infinite}
.gp-root .gp-glint-b{animation-delay:2.2s}
.gp-root .gp-rise{opacity:0;animation:gp-rise .9s cubic-bezier(.22,.61,.36,1) forwards}
.gp-root .gp-viewfinder{border:1px solid rgba(231,199,146,.25);background:radial-gradient(ellipse at 50% 50%,#17120A,#0B0906)}
.gp-root .gp-corner{position:absolute;width:22px;height:22px;border:2px solid var(--gp-gold)}
.gp-root .gp-corner.tl{top:10px;left:10px;border-right:0;border-bottom:0}
.gp-root .gp-corner.tr{top:10px;right:10px;border-left:0;border-bottom:0}
.gp-root .gp-corner.bl{bottom:10px;left:10px;border-right:0;border-top:0}
.gp-root .gp-corner.br{bottom:10px;right:10px;border-left:0;border-top:0}
.gp-root .gp-beam{position:absolute;inset:0;border-right:2px solid var(--gp-emerald);background:linear-gradient(90deg,transparent 70%,rgba(45,191,143,.22));transform:translateX(-100%);animation:gp-beam 2.6s ease-in-out infinite alternate;will-change:transform}
.gp-root .gp-hatch{background:repeating-linear-gradient(135deg,rgba(231,199,146,.35) 0 2px,transparent 2px 7px)}
.gp-root .gp-chip{border:1px solid rgba(231,199,146,.3);padding:.6rem .4rem;text-align:center;color:var(--gp-cream);line-height:1.3}
.gp-root .gp-grow{transform-origin:left;transform:scaleX(0)}
.gp-root .gp-on .gp-grow{animation:gp-grow .9s cubic-bezier(.22,.61,.36,1) .1s forwards}
.gp-root .gp-bill-row{opacity:0}
.gp-root .gp-on .gp-bill-row{animation:gp-rise .6s cubic-bezier(.22,.61,.36,1) forwards}
.gp-root .gp-paper{background:var(--gp-paper);clip-path:polygon(0 26px,26px 0,calc(100% - 26px) 0,100% 26px,100% 100%,0 100%);box-shadow:0 0 0 1px rgba(231,199,146,.5)}
.gp-root .gp-hole{position:absolute;top:14px;left:50%;width:16px;height:16px;margin-left:-8px;border-radius:50%;background:var(--gp-bg);box-shadow:inset 0 0 0 2px #B98A45}
.gp-root .gp-zig{height:14px;background:linear-gradient(135deg,var(--gp-bg) 25%,transparent 25%) -7px 0,linear-gradient(225deg,var(--gp-bg) 25%,transparent 25%) -7px 0;background-size:14px 14px;background-color:var(--gp-paper);margin-top:-1px}
.gp-root .gp-item{position:relative;opacity:0;transform:translateY(12px);transition:opacity .6s ease,transform .6s cubic-bezier(.22,.61,.36,1),background-color .25s ease,box-shadow .25s ease}
.gp-root .gp-item-in{opacity:1;transform:none}
.gp-root .gp-item:hover{background:rgba(185,138,69,.16);box-shadow:inset 3px 0 0 #B98A45}
.gp-root .gp-paid{flex:none;align-self:flex-start;transform:rotate(-8deg) scale(1.6);opacity:0;border:2px solid #8F5A12;color:#8F5A12;padding:.3rem .55rem;font-family:var(--font-plex),ui-monospace,monospace;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;box-shadow:inset 0 0 0 2px var(--gp-paper),inset 0 0 0 3px #8F5A12;transition:transform .5s cubic-bezier(.3,1.4,.5,1) .5s,opacity .3s ease .5s}
.gp-root .gp-paid-in{transform:rotate(-8deg) scale(1);opacity:1}
.gp-root .gp-medal::before{content:"";position:absolute;inset:14%;border-radius:50%;background:radial-gradient(circle,rgba(231,199,146,.16),transparent 70%)}
.gp-root .gp-facets{fill:none;stroke:var(--gp-gold);stroke-opacity:.35;stroke-width:.8;pointer-events:none}
.gp-root .gp-band{fill:#1B140A;stroke:var(--gp-gold);stroke-width:1.2;cursor:pointer;transition:fill .35s ease}
.gp-root .gp-band-on{fill:#C9A25E}
.gp-root .gp-layer{border-color:rgba(231,199,146,.22);background:transparent;cursor:pointer}
.gp-root .gp-layer:hover{border-color:rgba(231,199,146,.6)}
.gp-root .gp-layer-on{border-color:var(--gp-gold);background:rgba(231,199,146,.07)}
.gp-root .gp-clear{height:4.5rem}
.gp-root .gp-lot{border:1px solid rgba(231,199,146,.3);background:#100d09}
.gp-root .gp-tag{background:#080706;color:var(--gp-gold);padding:.35rem .6rem;border:1px solid rgba(231,199,146,.5);max-width:calc(100% - 1.5rem)}
@keyframes gp-spin{to{transform:rotate(360deg)}}
@keyframes gp-tw{0%,100%{opacity:1}50%{opacity:.55}}
@keyframes gp-glint{0%,100%{opacity:0;transform:scale(.4) rotate(0)}45%,55%{opacity:1;transform:scale(1) rotate(20deg)}}
@keyframes gp-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes gp-beam{to{transform:translateX(0)}}
@keyframes gp-grow{to{transform:scaleX(1)}}
@media (prefers-reduced-motion:reduce){
  .gp-root .gp-spin,.gp-root .gp-spin-rev,.gp-root .gp-tw,.gp-root .gp-glint,.gp-root .gp-beam{animation:none!important}
  .gp-root .gp-beam{transform:translateX(-30%)}
  .gp-root .gp-glint{opacity:.8}
  .gp-root .gp-rise,.gp-root .gp-on .gp-bill-row,.gp-root .gp-bill-row{animation:none!important;opacity:1;transform:none}
  .gp-root .gp-grow,.gp-root .gp-on .gp-grow{animation:none!important;transform:none}
  .gp-root .gp-item,.gp-root .gp-paid{transition:none;opacity:1;transform:none}
  .gp-root .gp-paid{transform:rotate(-8deg)}
}
`;
