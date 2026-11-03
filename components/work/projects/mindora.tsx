'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function useInView<T extends HTMLElement>(threshold = 0.25): [React.RefObject<T | null>, boolean] {
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
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

const splitLines = (q: string) =>
  (q.match(/[^.!?]+[.!?]+/g) ?? [q]).map((s) => s.trim());

/** Lines that arrive one at a time, slowly. */
function Lines({
  lines,
  seen,
  step = 0.8,
  base = 0.1,
  className = '',
}: {
  lines: string[];
  seen: boolean;
  step?: number;
  base?: number;
  className?: string;
}) {
  return (
    <>
      {lines.map((l, i) => (
        <span
          key={i}
          className={`mnd-rv ${seen ? 'mnd-in' : ''} block ${className}`}
          style={{ ['--d' as string]: `${base + i * step}s` }}
        >
          {l}
        </span>
      ))}
    </>
  );
}

function Count({ to, run }: { to: number; run: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || to === 0) {
      setV(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1600);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return <>{v}</>;
}

/* Smooth path through points (catmull-rom -> cubic bezier) */
function smooth(pts: [number, number][]) {
  const r = (n: number) => Math.round(n * 10) / 10;
  let d = `M${r(pts[0][0])},${r(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${r(p2[0])},${r(p2[1])}`;
  }
  return d;
}

/* Illustrative shapes only (not real user data) */
const CURVES: Record<string, number[]> = {
  Mood: [38, 42, 40, 49, 55, 52, 58, 61, 57, 64, 68, 66, 72, 76],
  Sleep: [60, 52, 55, 48, 50, 58, 63, 60, 66, 64, 70, 69, 73, 74],
  Stress: [70, 72, 66, 68, 60, 62, 55, 58, 50, 47, 49, 44, 41, 38],
  Focus: [45, 50, 48, 54, 50, 57, 55, 60, 62, 59, 66, 70, 68, 71],
  Social: [30, 34, 33, 40, 38, 46, 50, 47, 55, 58, 56, 63, 62, 67],
};

const ROLES = [
  {
    key: 'General student',
    line: 'Quick check-ins, trends you can read at a glance.',
    blocks: ["Today's prompt", 'Start an assessment', 'Last 14 days of wellness'],
    note: 'Greeting card, a quick tile to begin, and a small trend line.',
  },
  {
    key: 'Special needs + guardian',
    line: 'Bigger targets, simpler words, a guardian beside you.',
    blocks: ['Larger touch targets', 'Simplified copy', 'Guardian adds a student'],
    note: 'Caretaker-assist mode lets the guardian answer together with the student.',
  },
  {
    key: 'Doctor / counsellor',
    line: 'Read-only view across assigned students.',
    blocks: ['Assigned students', 'Last assessment + trend arrow', 'Full history on click'],
    note: 'Designed to be understood in 30 seconds.',
  },
];

const NOT_HERE = ['Streaks', 'Badges', 'Mascots', 'Default notifications'];

const ARCHES = [
  { src: '/work/mindora/gallery-1.jpg', alt: 'A person standing in tree pose on a rock above a misty green valley', cap: 'Find your balance', pos: '50% 50%' },
  { src: '/work/mindora/gallery-2.jpg', alt: 'Silhouette with open arms against a rising sun over foggy hills', cap: 'Open up', pos: '50% 50%' },
  { src: '/work/mindora/gallery-3.jpg', alt: 'Two women stretching on pink yoga mats in a bright brick-walled studio', cap: 'Move a little', pos: '66% 50%' },
  { src: '/work/mindora/gallery-4.jpg', alt: 'A woman in orange leggings resting on a mat beside a sunlit window', cap: 'Rest between sets', pos: '82% 50%' },
  { src: '/work/mindora/gallery-5.jpg', alt: 'A group stretching together in an open-air yoga class', cap: 'Practice together', pos: '42% 50%' },
  { src: '/work/mindora/gallery-6.jpg', alt: 'Silhouette seated in meditation, backlit by the morning sun through palm trees', cap: 'Sit with it', pos: '50% 40%' },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Page({ theme }: { theme: ProjectTheme }) {
  const p = theme.palette;
  const [role, setRole] = useState(0);
  const [cat, setCat] = useState('Mood');

  const [qRefs0, qSeen0] = useInView<HTMLElement>(0.35);
  const [qRefs1, qSeen1] = useInView<HTMLElement>(0.35);
  const [qRefs2, qSeen2] = useInView<HTMLElement>(0.35);
  const quoteRefs = [qRefs0, qRefs1, qRefs2];
  const quoteSeen = [qSeen0, qSeen1, qSeen2];

  const [notRef, notSeen] = useInView<HTMLDivElement>(0.3);
  const [featRef, featSeen] = useInView<HTMLUListElement>(0.12);
  const [chartRef, chartSeen] = useInView<HTMLDivElement>(0.25);
  const [numRef, numSeen] = useInView<HTMLUListElement>(0.3);
  const [galRef, galSeen] = useInView<HTMLDivElement>(0.12);
  const [archRef, archSeen] = useInView<HTMLOListElement>(0.2);
  const [outRef, outSeen] = useInView<HTMLElement>(0.35);

  const series = CURVES[cat];
  const pts: [number, number][] = series.map((v, i) => [20 + i * (560 / 13), 210 - v * 1.7]);
  const line = smooth(pts);
  const area = `${line} L580,225 L20,225 Z`;
  const ghost = smooth(series.map((v, i) => [20 + i * (560 / 13), 214 - (v * 0.8 + 8 + Math.sin(i * 0.9) * 4) * 1.7]));
  const last = pts[pts.length - 1].map((n) => Math.round(n * 10) / 10);

  const tints = ['#EFEAFF', '#E6F0E6', '#FBEBDD', '#F2EDE5', '#E9E4FA', '#E3EEE3'];
  const quoteLines = theme.story.quotes.map((q) => splitLines(q.quote));
  const outLines = theme.outcomeQuote.split(/,\s*/).map((s, i, a) => (i < a.length - 1 ? s + ',' : s));

  return (
    <main
      className="mnd-root relative w-full overflow-x-clip"
      style={{
        background: p.bg,
        color: p.text,
        ['--ink' as string]: p.text,
        ['--soft' as string]: p.dim,
        ['--acc' as string]: p.accent,
        ['--sage' as string]: p.accent2 ?? '#4F7B4F',
        ['--cream2' as string]: p.bgMid,
      }}
    >
      <style>{`
        .mnd-root { font-family: var(--font-sora), ui-sans-serif, system-ui, sans-serif; }
        .mnd-root h1, .mnd-root h2, .mnd-root h3 { font-family: var(--font-sora), ui-sans-serif, system-ui, sans-serif; }
        .mnd-root a:focus-visible, .mnd-root button:focus-visible { outline: 2px solid var(--acc); outline-offset: 3px; border-radius: 9999px; }

        /* 4-7-8 breathing: 19s loop = 4s in, 7s hold, 8s out */
        @keyframes mnd-breathe { 0%{transform:scale(var(--lo))} 21%{transform:scale(var(--hi))} 58%{transform:scale(var(--hi))} 100%{transform:scale(var(--lo))} }
        @keyframes mnd-l1 { 0%{opacity:1} 14%{opacity:1} 18%{opacity:0} 97%{opacity:0} 100%{opacity:1} }
        @keyframes mnd-l2 { 0%,20%{opacity:0} 25%{opacity:1} 51%{opacity:1} 55%{opacity:0} 100%{opacity:0} }
        @keyframes mnd-l3 { 0%,57%{opacity:0} 62%{opacity:1} 89%{opacity:1} 93%{opacity:0} 100%{opacity:0} }
        @keyframes mnd-drift { from{transform:translate3d(-6%,0,0)} to{transform:translate3d(6%,0,0)} }
        @keyframes mnd-bob { 0%,100%{transform:translateY(0);opacity:.35} 50%{transform:translateY(10px);opacity:.9} }
        @keyframes mnd-soft { 0%,100%{transform:scale(.92);opacity:.7} 50%{transform:scale(1.06);opacity:1} }
        @keyframes mnd-draw { from{stroke-dashoffset:1} to{stroke-dashoffset:0} }
        @keyframes mnd-fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        .mnd-ring { position:absolute; border-radius:9999px; animation: mnd-breathe 19s ease-in-out infinite; will-change: transform; }
        .mnd-lab { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; text-align:center; opacity:0; }
        .mnd-l1 { animation: mnd-l1 19s linear infinite; }
        .mnd-l2 { animation: mnd-l2 19s linear infinite; }
        .mnd-l3 { animation: mnd-l3 19s linear infinite; }
        .mnd-cloud { animation: mnd-drift 38s ease-in-out infinite alternate; }
        .mnd-bob { animation: mnd-bob 5.5s ease-in-out infinite; }
        .mnd-pulse { animation: mnd-soft 7s ease-in-out infinite; }
        .mnd-static-lab { display:none; }

        .mnd-rv { opacity:0; transform:translateY(12px); transition: opacity 1.1s cubic-bezier(.22,1,.36,1), transform 1.1s cubic-bezier(.22,1,.36,1); transition-delay: var(--d, 0s); }
        .mnd-in.mnd-rv, .mnd-in .mnd-rv { opacity:1; transform:none; }

        .mnd-draw { stroke-dasharray:1; stroke-dashoffset:1; }
        .mnd-in .mnd-draw { animation: mnd-draw 2.2s cubic-bezier(.45,0,.55,1) .1s forwards; }
        .mnd-thread { transform: scaleY(0); transform-origin: top; transition: transform 2.4s cubic-bezier(.45,0,.55,1) .1s; }
        .mnd-in .mnd-thread { transform: scaleY(1); }
        .mnd-fade { animation: mnd-fadein .8s cubic-bezier(.22,1,.36,1) both; }

        .mnd-card { transition: transform .8s cubic-bezier(.22,1,.36,1), background-color .8s ease; }
        .mnd-card:hover { transform: translateY(-4px); }
        .mnd-chip { transition: background-color .5s ease, color .5s ease, transform .5s ease; }

        @media (prefers-reduced-motion: reduce) {
          .mnd-ring, .mnd-cloud, .mnd-bob, .mnd-pulse, .mnd-l1, .mnd-l2, .mnd-l3 { animation: none !important; }
          .mnd-ring { transform: scale(var(--hi)); }
          .mnd-lab { display:none; }
          .mnd-static-lab { display:flex; position:absolute; inset:0; align-items:center; justify-content:center; text-align:center; }
          .mnd-rv { opacity:1; transform:none; transition:none; }
          .mnd-draw { stroke-dashoffset:0; animation:none !important; }
          .mnd-fade { animation:none; }
          .mnd-thread { transform:none; transition:none; }
          .mnd-card:hover { transform:none; }
        }
      `}</style>

      {/* ============================ HERO ============================ */}
      <section
        className="relative flex min-h-[88svh] flex-col items-center justify-center px-5 pb-16 pt-24 text-center md:pt-36"
        style={{ background: 'linear-gradient(180deg, #E4DBFF 0%, #F1E6F4 34%, #E6F0E6 62%, #FAF7F2 100%)' }}
      >
        <div
          aria-hidden
          className="mnd-cloud pointer-events-none absolute left-[-10%] top-[12%] h-[38%] w-[70%]"
          style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,.7), rgba(255,255,255,0))' }}
        />
        <div
          aria-hidden
          className="mnd-cloud pointer-events-none absolute right-[-12%] top-[40%] h-[34%] w-[64%]"
          style={{ background: 'radial-gradient(closest-side, rgba(250,222,205,.55), rgba(250,222,205,0))', animationDirection: 'alternate-reverse', animationDuration: '46s' }}
        />

        <p className="relative mb-8 text-[11px] font-light uppercase tracking-[0.3em]" style={{ color: 'var(--soft)' }}>
          {theme.kicker}
        </p>

        <div className="relative aspect-square" style={{ width: 'min(72vw, 400px)' }}>
          <div className="mnd-ring inset-0" style={{ ['--lo' as string]: 0.78, ['--hi' as string]: 1, background: 'radial-gradient(circle, rgba(184,166,255,.38), rgba(184,166,255,.16) 70%, rgba(184,166,255,.0) 100%)' }} />
          <div className="mnd-ring" style={{ inset: '12%', ['--lo' as string]: 0.74, ['--hi' as string]: 1, animationDelay: '-0.35s', background: 'radial-gradient(circle, rgba(207,229,207,.8), rgba(210,198,255,.5) 100%)' }} />
          <div className="mnd-ring" style={{ inset: '26%', ['--lo' as string]: 0.7, ['--hi' as string]: 1, animationDelay: '-0.7s', background: 'radial-gradient(circle at 35% 30%, #FFFFFF, #E4DBFF 55%, #CFE5CF 100%)', boxShadow: '0 20px 60px rgba(87,66,196,.16)' }} />
          <div className="absolute inset-[26%]" aria-hidden>
            <div className="mnd-lab mnd-l1 text-sm font-light tracking-wide md:text-base" style={{ color: 'var(--ink)' }}>Breathe in<br />4</div>
            <div className="mnd-lab mnd-l2 text-sm font-light tracking-wide md:text-base" style={{ color: 'var(--ink)' }}>Hold<br />7</div>
            <div className="mnd-lab mnd-l3 text-sm font-light tracking-wide md:text-base" style={{ color: 'var(--ink)' }}>Breathe out<br />8</div>
            <div className="mnd-static-lab text-sm font-light" style={{ color: 'var(--ink)' }}>4 · 7 · 8</div>
          </div>
        </div>

        <h1 className="relative mt-10 text-[clamp(2.75rem,10vw,6.25rem)] font-extralight leading-none tracking-[-0.02em]">
          {theme.title}
        </h1>
        <p className="relative mt-5 max-w-xl text-lg font-light leading-relaxed md:text-xl" style={{ color: 'var(--soft)' }}>
          {theme.subtitle}
        </p>
        <p className="relative mt-3 max-w-md text-sm font-light" style={{ color: 'var(--soft)' }}>
          A quieter way to check in with yourself.
        </p>
        <div aria-hidden className="mnd-bob relative mt-10 h-10 w-px" style={{ background: 'var(--acc)' }} />
      </section>

      {/* ============================ QUOTES ============================ */}
      <div className="mx-auto w-full max-w-4xl px-5 md:px-10">
        {theme.story.quotes.map((q, i) => (
          <figure
            key={i}
            ref={quoteRefs[i] as React.RefObject<HTMLElement>}
            className={`flex min-h-[34svh] flex-col justify-center py-12 md:min-h-[44svh] md:py-20 ${i % 2 ? 'items-end text-right' : 'items-start text-left'}`}
          >
            <figcaption className={`mnd-rv ${quoteSeen[i] ? 'mnd-in' : ''} mb-6 text-[11px] font-light uppercase tracking-[0.3em]`} style={{ color: 'var(--acc)' }}>
              {q.kicker}
            </figcaption>
            <blockquote className="max-w-2xl text-[clamp(1.6rem,4.6vw,2.9rem)] font-light leading-[1.25] tracking-[-0.01em]">
              <Lines lines={quoteLines[i]} seen={quoteSeen[i]} step={0.8} base={0.3} />
            </blockquote>
            <p
              className={`mnd-rv ${quoteSeen[i] ? 'mnd-in' : ''} mt-8 max-w-md text-sm font-light leading-relaxed`}
              style={{ color: 'var(--soft)', ['--d' as string]: `${0.3 + quoteLines[i].length * 0.8 + 0.1}s` }}
            >
              {q.context}
            </p>
          </figure>
        ))}
      </div>

      {/* ============================ NOT HERE ============================ */}
      <section className="px-5 py-[4.8rem] md:py-[5.5rem]">
        <div ref={notRef} className={`mx-auto max-w-3xl text-center ${notSeen ? 'mnd-in' : ''}`}>
          <h2 className="mnd-rv text-[11px] font-light uppercase tracking-[0.3em]" style={{ color: 'var(--soft)' }}>
            What you will not find here
          </h2>
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {NOT_HERE.map((t, i) => (
              <li
                key={t}
                className="mnd-rv rounded-full px-6 py-3 text-base font-light line-through decoration-1"
                style={{ background: ['#EFEAFF', '#E6F0E6', '#FBEBDD', '#F2EDE5'][i], color: 'var(--soft)', ['--d' as string]: `${0.2 + i * 0.4}s` }}
              >
                {t}
              </li>
            ))}
          </ul>
          <p className="mnd-rv mt-8 text-lg font-light" style={{ ['--d' as string]: '2s' }}>
            A wellness app should not punish the worst weeks.
          </p>
        </div>
      </section>

      {/* ============================ ROLES ============================ */}
      <section className="mx-auto w-full max-w-5xl px-5 py-[4.8rem] md:px-10 md:py-[5.5rem]">
        <h2 className="text-[clamp(1.9rem,5vw,3.25rem)] font-extralight leading-tight tracking-[-0.01em]">
          Three roles. <span style={{ color: 'var(--acc)' }}>One room.</span>
        </h2>
        <p className="mt-4 max-w-xl text-base font-light leading-relaxed md:text-lg" style={{ color: 'var(--soft)' }}>
          The information hierarchy changes. The lavender, the sage and the cream do not.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-8">
          <div role="tablist" aria-label="Choose a role" className="flex flex-col gap-3">
            {ROLES.map((r, i) => (
              <button
                key={r.key}
                role="tab"
                id={`mnd-tab-${i}`}
                aria-selected={role === i}
                aria-controls="mnd-panel"
                onClick={() => setRole(i)}
                className="mnd-card min-h-[56px] rounded-[1.75rem] px-6 py-4 text-left"
                style={{
                  background: role === i ? '#EFEAFF' : '#F2EDE5',
                  boxShadow: role === i ? 'inset 0 0 0 1.5px #B8A6FF' : 'none',
                }}
              >
                <span className="block text-lg font-light">{r.key}</span>
                <span className="mt-1 block text-sm font-light" style={{ color: 'var(--soft)' }}>{r.line}</span>
              </button>
            ))}
          </div>

          <div
            id="mnd-panel"
            role="tabpanel"
            aria-labelledby={`mnd-tab-${role}`}
            className="rounded-[2rem] p-6 md:p-8"
            style={{ background: 'linear-gradient(160deg, #F4EFFF 0%, #EAF3EA 100%)' }}
          >
            <div key={role} className="mnd-fade">
              <p className="text-[11px] font-light uppercase tracking-[0.28em]" style={{ color: 'var(--acc)' }}>
                {ROLES[role].key}
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {ROLES[role].blocks.map((b, i) => (
                  <li
                    key={b}
                    className="rounded-[1.5rem] bg-white/70 px-5"
                    style={{ paddingTop: i === 0 ? 28 : 16, paddingBottom: i === 0 ? 28 : 16 }}
                  >
                    <span className={`${i === 0 ? 'text-xl md:text-2xl' : 'text-base'} font-light`}>{b}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm font-light leading-relaxed" style={{ color: 'var(--soft)' }}>{ROLES[role].note}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ FEATURES ============================ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-[4.8rem] md:px-10 md:py-[5.5rem]">
        <h2 className="text-[clamp(1.9rem,5vw,3.25rem)] font-extralight leading-tight tracking-[-0.01em]">
          Quiet by default.
        </h2>
        <ul ref={featRef} className={`mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${featSeen ? 'mnd-in' : ''}`}>
          {theme.features.map((f, i) => (
            <li
              key={f.title}
              className="mnd-rv mnd-card flex flex-col rounded-[2rem] p-7"
              style={{ background: tints[i % tints.length], ['--d' as string]: `${i * 0.2}s` }}
            >
              <span
                aria-hidden
                className="mnd-pulse mb-6 block h-10 w-10 rounded-full"
                style={{
                  background: i % 2 ? 'radial-gradient(circle at 35% 30%, #fff, #B8D5B8)' : 'radial-gradient(circle at 35% 30%, #fff, #B8A6FF)',
                  animationDelay: `${-i * 1.3}s`,
                }}
              />
              <h3 className="text-xl font-light leading-snug">{f.title}</h3>
              <p className="mt-3 text-[15px] font-light leading-relaxed" style={{ color: 'var(--soft)' }}>{f.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ============================ CHART ============================ */}
      <section className="mx-auto w-full max-w-5xl px-5 py-[4.8rem] md:px-10 md:py-[5.5rem]">
        <h2 className="text-[clamp(1.9rem,5vw,3.25rem)] font-extralight leading-tight tracking-[-0.01em]">
          Honest charts, <span style={{ color: 'var(--sage)' }}>watercolor washes.</span>
        </h2>
        <p className="mt-4 max-w-xl text-base font-light leading-relaxed md:text-lg" style={{ color: 'var(--soft)' }}>
          Recharts with linearGradient fills, never geometric. Pick a category and watch the line draw itself.
        </p>

        <div ref={chartRef} className={`mt-8 rounded-[2rem] p-4 sm:p-8 ${chartSeen ? 'mnd-in' : ''}`} style={{ background: '#F2EDE5' }}>
          <div role="group" aria-label="Category" className="mb-4 flex flex-wrap gap-2">
            {Object.keys(CURVES).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                aria-pressed={cat === c}
                className="mnd-chip min-h-[44px] rounded-full px-5 text-sm font-light"
                style={{ background: cat === c ? '#5742C4' : '#FAF7F2', color: cat === c ? '#FFFFFF' : 'var(--ink)' }}
              >
                {c}
              </button>
            ))}
          </div>
          <svg viewBox="0 0 600 240" className="block h-auto w-full" role="img" aria-label={`Illustrative ${cat} trend over fourteen days`}>
            <defs>
              <linearGradient id="mnd-g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B8A6FF" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#B8A6FF" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="mnd-g2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B8D5B8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#B8D5B8" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[60, 110, 160, 210].map((y) => (
              <line key={y} x1="20" x2="580" y1={y} y2={y} stroke="#E0D8CA" strokeWidth="1" strokeDasharray="2 8" strokeLinecap="round" />
            ))}
            <g key={cat} className="mnd-fade">
              <path d={`${ghost} L580,225 L20,225 Z`} fill="url(#mnd-g2)" />
              <path d={area} fill="url(#mnd-g1)" />
            </g>
            <path key={`l-${cat}`} d={line} pathLength={1} className="mnd-draw" fill="none" stroke="#5742C4" strokeWidth="2.5" strokeLinecap="round" />
            <circle key={`c-${cat}`} cx={last[0]} cy={last[1]} r="6" fill="#5742C4" className="mnd-pulse" style={{ transformOrigin: `${last[0]}px ${last[1]}px` }} />
          </svg>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm font-light" style={{ color: 'var(--soft)' }}>
            <span>7d · 30d · 90d · all</span>
            <span>Illustrative curve, not real user data.</span>
          </div>
        </div>
      </section>

      {/* ============================ NUMBERS ============================ */}
      <section className="px-5 py-[4.8rem] md:py-[5.5rem]">
        <ul ref={numRef} className={`mx-auto grid max-w-5xl grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 ${numSeen ? 'mnd-in' : ''}`}>
          {theme.bigNumbers.map((n, i) => (
            <li key={n.label} className="mnd-rv flex flex-col items-center text-center" style={{ ['--d' as string]: `${i * 0.3}s` }}>
              <div
                className="mnd-pulse flex aspect-square w-full max-w-[170px] items-center justify-center rounded-full"
                style={{
                  background: ['radial-gradient(circle at 35% 30%, #fff, #DCD2FF)', 'radial-gradient(circle at 35% 30%, #fff, #CFE5CF)', 'radial-gradient(circle at 35% 30%, #fff, #F8DFCB)', 'radial-gradient(circle at 35% 30%, #fff, #E9E2D5)'][i % 4],
                  animationDelay: `${-i * 1.8}s`,
                }}
              >
                <span className="text-6xl font-extralight md:text-7xl">
                  <Count to={parseInt(n.value, 10) || 0} run={numSeen} />
                </span>
              </div>
              <p className="mt-5 max-w-[12rem] text-base font-light" style={{ color: 'var(--soft)' }}>{n.label}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ============================ GALLERY ============================ */}
      <section className="mx-auto w-full max-w-5xl px-5 py-[4.8rem] md:px-10 md:py-[5.5rem]">
        <div ref={galRef} className={galSeen ? 'mnd-in' : ''}>
          <h2 className="mnd-rv text-[clamp(1.9rem,5vw,3.25rem)] font-extralight leading-tight tracking-[-0.01em]">
            Room to exhale.
          </h2>
        </div>
        <ol ref={archRef} className={`mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-8 md:gap-y-12 ${archSeen ? 'mnd-in' : ''}`}>
          {ARCHES.map((a, i) => (
            <li
              key={a.src}
              className={`mnd-rv ${i % 2 ? 'mt-8 md:mt-0' : ''} ${i % 3 === 1 ? 'md:mt-14' : ''}`}
              style={{ ['--d' as string]: `${(i % 3) * 0.25}s` }}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-[999px] rounded-b-[2rem]" style={{ background: '#E9E2D5' }}>
                <Image
                  src={a.src}
                  alt={a.alt}
                  fill
                  sizes="(min-width: 1024px) 320px, (min-width: 768px) 30vw, 46vw"
                  className="object-cover"
                  style={{ objectPosition: a.pos }}
                />
                <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(184,166,255,.2), rgba(184,213,184,.12))' }} />
              </div>
              <p className="mt-4 text-center text-sm font-light" style={{ color: 'var(--soft)' }}>{a.cap}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ============================ ARCHITECTURE ============================ */}
      <ArchitectureSection layers={theme.architecture} />

      {/* ============================ OUTCOME ============================ */}
      <section
        ref={outRef}
        className="relative px-5 py-24 text-center md:py-36"
        style={{ background: 'linear-gradient(180deg, #FAF7F2 0%, #EFEAFF 55%, #E6F0E6 100%)' }}
      >
        <div className="mx-auto max-w-3xl">
          <p className={`mnd-rv ${outSeen ? 'mnd-in' : ''} mb-8 text-[11px] font-light uppercase tracking-[0.3em]`} style={{ color: 'var(--acc)' }}>
            The result
          </p>
          <blockquote className="text-[clamp(1.6rem,4.8vw,3rem)] font-extralight leading-[1.3] tracking-[-0.01em]">
            <Lines lines={outLines} seen={outSeen} step={1.0} base={0.3} />
          </blockquote>
          <div aria-hidden className="mnd-pulse mx-auto mt-14 h-14 w-14 rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, #fff, #B8A6FF)' }} />
        </div>
      </section>

      <div className="pb-24" style={{ color: 'var(--ink)' }}>
        <NextChapter currentSlug={theme.slug} accent={p.accent} />
      </div>
      <SiteFooter />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Architecture: a vertical thread that draws itself                   */
/* ------------------------------------------------------------------ */

function ArchitectureSection({ layers }: { layers: { layer: string; details: string }[] }) {
  const [ref, seen] = useInView<HTMLOListElement>(0.15);
  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-[4.8rem] md:px-10 md:py-[5.5rem]">
      <h2 className="text-[clamp(1.9rem,5vw,3.25rem)] font-extralight leading-tight tracking-[-0.01em]">
        Under the quiet.
      </h2>
      <ol ref={ref} className={`relative mt-12 ${seen ? 'mnd-in' : ''}`}>
        <span aria-hidden className="mnd-thread absolute bottom-3 left-[11px] top-3 w-[2px] rounded-full" style={{ background: 'linear-gradient(180deg, #B8A6FF, #B8D5B8)' }} />
        {layers.map((l, i) => (
          <li key={l.layer} className="mnd-rv relative pb-10 pl-12 last:pb-0" style={{ ['--d' as string]: `${0.2 + i * 0.45}s` }}>
            <span aria-hidden className="mnd-pulse absolute left-0 top-1 h-6 w-6 rounded-full" style={{ background: i % 2 ? 'radial-gradient(circle at 35% 30%, #fff, #9CC09C)' : 'radial-gradient(circle at 35% 30%, #fff, #B8A6FF)', animationDelay: `${-i * 1.5}s` }} />
            <h3 className="text-xl font-light">{l.layer}</h3>
            <p className="mt-2 max-w-lg text-[15px] font-light leading-relaxed" style={{ color: 'var(--soft)' }}>{l.details}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
