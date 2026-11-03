'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

/* ------------------------------------------------------------------ */
/* Tokens + data                                                       */
/* ------------------------------------------------------------------ */

const RED = '#FF003C';
const RED_T = '#FF4D6D'; // lighter red for small text (contrast on panels)
const AMBER = '#FFB020';
const GREEN = '#00FF66';
const PANEL = '#111317';
const LINE = 'rgba(255,255,255,0.12)';
const MONO = "var(--font-plex), 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

type Sev = 'high' | 'medium' | 'low';
const SEV: Record<Sev, { c: string; label: string; sym: string; dur: string }> = {
  high: { c: RED, label: 'HIGH', sym: '▲', dur: '2.4s' },
  medium: { c: AMBER, label: 'MEDIUM', sym: '◆', dur: '4.2s' },
  low: { c: GREEN, label: 'LOW', sym: '●', dur: '7s' },
};

// The five mock fixtures that ship in BreachDetector (positions are decorative).
const BREACHES = [
  { id: 'B-01', name: 'LinkedIn', year: '2021', x: 68, y: 28 },
  { id: 'B-02', name: 'Facebook', year: '2019', x: 31, y: 34 },
  { id: 'B-03', name: 'Adobe', year: '2013', x: 76, y: 66 },
  { id: 'B-04', name: 'Dropbox', year: '2012', x: 42, y: 74 },
  { id: 'B-05', name: 'MySpace', year: '2013', x: 21, y: 58 },
];

const REDACTIONS: string[][] = [
  ['least likely to ever find out'],
  ['cool hacker scene from a movie', 'working for him'],
  ['SHA-1, take the first 5 chars', 'never send the full hash'],
];

const EVIDENCE = [
  { src: '/work/darkwatch/gallery-1.jpg', cap: 'Card details typed at a laptop', alt: 'Hand holding a bank card above an open laptop keyboard' },
  { src: '/work/darkwatch/gallery-2.jpg', cap: 'Backlit circuit schematic', alt: 'Backlit circuit board schematic glowing on a dark surface' },
  { src: '/work/darkwatch/gallery-3.jpg', cap: 'Padlock resting on bank cards', alt: 'Brass combination padlock on a keyboard next to chip bank cards' },
  { src: '/work/darkwatch/gallery-4.jpg', cap: 'Lock and chip cards, second angle', alt: 'Brass padlock and gold chip cards resting on a white keyboard' },
  { src: '/work/darkwatch/gallery-5.jpg', cap: 'Source code on a screen', alt: 'Close-up of colourful source code on a monitor' },
  { src: '/work/darkwatch/gallery-6.jpg', cap: 'Checkout session, exposed card', alt: 'Person entering bank card details on a laptop' },
];

const PIPE = [
  { t: 'Email input', d: 'Inline validation and a blinking-cursor field.' },
  { t: 'SHA-1 prefix hash', d: 'First 5 chars only. The full hash never leaves the device.' },
  { t: 'Mock or live lookup', d: 'Fixture set, or the HIBP range API behind a feature flag.' },
  { t: 'Severity class', d: 'Low, medium or high, rolled up across every match.' },
  { t: 'Next actions', d: 'Change password, enable 2FA, revoke sessions, mark resolved.' },
];

const CHIPS = ['Email', 'Password', 'Phone', 'Geo', 'Payment'];
const ACTIONS = ['Change password', 'Enable 2FA', 'Revoke sessions'];
const BOOT = ['> initializing dark_watch v1.0.0...', '[OK] firebase connected', '[OK] threat feeds online', '[OK] crypto module loaded'];

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

function useInView<T extends HTMLElement>() {
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
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`dw-rv ${seen ? 'dw-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Count({ to }: { to: number }) {
  const [ref, seen] = useInView<HTMLSpanElement>();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen || to === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1100);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <span ref={ref}>{v}</span>;
}

function Badge({ sev, text }: { sev: Sev; text?: string }) {
  const s = SEV[sev];
  return (
    <span
      className="inline-flex items-center gap-1.5 border px-2 py-1 text-xs font-bold tracking-widest"
      style={{ color: s.c, borderColor: s.c, background: 'rgba(0,0,0,0.45)' }}
    >
      <span aria-hidden>{s.sym}</span>
      {text ?? s.label}
    </span>
  );
}

function SecHead({ no, label, title, sub }: { no: string; label: string; title: string; sub?: string }) {
  return (
    <Reveal className="mb-8 md:mb-12 max-w-3xl">
      <p className="text-xs md:text-sm tracking-[0.22em] font-semibold" style={{ color: RED_T }}>
        SEC.{no} <span className="text-[#8A8F98]">{'//'}</span> {label}
      </p>
      <h2 className="mt-3 text-3xl md:text-5xl font-bold uppercase leading-[1.05] tracking-tight">{title}</h2>
      {sub && <p className="mt-4 text-sm md:text-base leading-relaxed text-[#8A8F98]">{sub}</p>}
    </Reveal>
  );
}

const wrap = 'mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-10';

/* ------------------------------------------------------------------ */
/* Radar                                                               */
/* ------------------------------------------------------------------ */

const TICKS = Array.from({ length: 36 }, (_, i) => {
  const a = (i * 10 * Math.PI) / 180;
  const r1 = i % 3 === 0 ? 186 : 192;
  const f = (n: number) => n.toFixed(2);
  return `M${f(200 + Math.sin(a) * r1)} ${f(200 - Math.cos(a) * r1)}L${f(200 + Math.sin(a) * 198)} ${f(200 - Math.cos(a) * 198)}`;
}).join('');

function Radar({
  resolved,
  sel,
  onSel,
  sev,
}: {
  resolved: string[];
  sel: string;
  onSel: (id: string) => void;
  sev: Sev;
}) {
  const s = SEV[sev];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]" style={{ ['--c' as string]: s.c } as CSSProperties}>
      <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04), rgba(0,0,0,0) 70%)' }} />
      <div className="dw-sweep absolute inset-0" style={{ animationDuration: s.dur }} aria-hidden>
        <div className="absolute inset-0 rounded-full opacity-30" style={{ background: 'conic-gradient(from 0deg, transparent 0deg 240deg, var(--c) 360deg)' }} />
        <div className="absolute left-1/2 top-0 h-1/2 w-0.5 -translate-x-1/2" style={{ background: 'var(--c)' }} />
      </div>
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden>
        <g fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1">
          <circle cx="200" cy="200" r="66" />
          <circle cx="200" cy="200" r="133" />
          <circle cx="200" cy="200" r="198" stroke="rgba(255,255,255,0.28)" />
          <path d="M200 2V398M2 200H398" strokeDasharray="3 5" />
          <path d={TICKS} stroke="rgba(255,255,255,0.35)" />
        </g>
        <g fill="#8A8F98" fontSize="14" textAnchor="middle" style={{ fontFamily: MONO }}>
          <text x="200" y="30">000</text>
          <text x="372" y="205">090</text>
          <text x="200" y="382">180</text>
          <text x="28" y="205">270</text>
        </g>
      </svg>
      {BREACHES.map((b) => {
        const done = resolved.includes(b.id);
        const on = sel === b.id;
        return (
          <button
            key={b.id}
            type="button"
            onClick={() => onSel(b.id)}
            aria-pressed={on}
            aria-label={`${b.name} ${b.year}, ${done ? 'resolved' : 'open threat'}`}
            className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
          >
            {!done && <span className="dw-ping absolute h-8 w-8 rounded-full border-2" style={{ borderColor: 'var(--c)', animationDuration: s.dur }} />}
            <span
              className="relative block rounded-full"
              style={{
                width: done ? 8 : 12,
                height: done ? 8 : 12,
                background: done ? GREEN : 'var(--c)',
                opacity: done ? 0.7 : 1,
                outline: on ? '2px solid #fff' : 'none',
                outlineOffset: 3,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Redacted quote card                                                 */
/* ------------------------------------------------------------------ */

function esc(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function Redacted({ n, quote, context, phrases }: { n: number; quote: string; context: string; phrases: string[] }) {
  const parts = phrases.length ? quote.split(new RegExp(`(${phrases.map(esc).join('|')})`)) : [quote];
  const [open, setOpen] = useState<number[]>([]);
  const total = parts.filter((_, i) => i % 2 === 1).length;
  const all = total > 0 && open.length >= total;
  const toggle = (i: number) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  return (
    <article className="flex h-full flex-col border p-5 md:p-6" style={{ borderColor: LINE, background: PANEL }}>
      <header className="mb-5 flex items-center justify-between gap-3 text-xs font-semibold tracking-widest">
        <span className="text-[#8A8F98]">DOC-0{n}</span>
        <span className="border px-2 py-1" style={{ color: all ? GREEN : RED_T, borderColor: all ? GREEN : RED_T }}>
          {all ? 'DECLASSIFIED' : 'CLASSIFIED'}
        </span>
      </header>
      <h3 className="sr-only">Briefing document {n}</h3>
      <blockquote className="flex-1 text-lg leading-[1.95] md:text-xl md:leading-[2]">
        {'“'}
        {parts.map((p, i) =>
          i % 2 === 1 ? (
            <span
              key={i}
              role="button"
              tabIndex={0}
              onClick={() => toggle(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggle(i);
                }
              }}
              aria-pressed={open.includes(i)}
              aria-label={open.includes(i) ? undefined : 'Redacted passage, press to reveal'}
              className="dw-redact"
              data-open={open.includes(i)}
            >
              {p}
            </span>
          ) : (
            <span key={i}>{p}</span>
          ),
        )}
        {'”'}
      </blockquote>
      <p className="mt-5 border-t pt-4 text-sm leading-relaxed text-[#8A8F98]" style={{ borderColor: LINE }}>
        <span style={{ color: RED_T }}>NOTE </span>
        {context}
      </p>
      {total > 0 && (
        <button
          type="button"
          onClick={() => setOpen(all ? [] : parts.map((_, i) => i).filter((i) => i % 2 === 1))}
          className="mt-4 min-h-11 border px-4 text-xs font-bold tracking-widest transition-colors hover:bg-white/5"
          style={{ borderColor: LINE }}
        >
          {all ? 'RE-REDACT' : 'DECLASSIFY ALL'}
        </button>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Feature visuals                                                     */
/* ------------------------------------------------------------------ */

function Viz({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="space-y-1.5 text-[13px] md:text-sm" aria-hidden>
        {BOOT.map((l, k) => (
          <span key={l} className="dw-line" style={{ animationDelay: `${k * 0.55}s`, color: l.startsWith('[OK]') ? GREEN : '#E0E5EC' }}>
            {l}
          </span>
        ))}
        <span className="dw-blink inline-block h-4 w-2 align-middle" style={{ background: GREEN }} />
      </div>
    );
  if (i === 1)
    return (
      <div className="flex items-center justify-around gap-4" aria-hidden>
        {[
          { c: GREEN, d: '6s', t: 'CLEAN: CALM' },
          { c: RED, d: '1.6s', t: 'BREACH: URGENT' },
        ].map((r) => (
          <div key={r.t} className="text-center">
            <div className="relative mx-auto h-24 w-24">
              {[0, 1, 2].map((k) => (
                <span key={k} className="dw-ping absolute inset-0 rounded-full border-2" style={{ borderColor: r.c, animationDuration: r.d, animationDelay: `${(k * parseFloat(r.d)) / 3}s` }} />
              ))}
              <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: r.c }} />
            </div>
            <p className="mt-3 text-xs font-bold tracking-widest" style={{ color: r.c }}>{r.t}</p>
          </div>
        ))}
      </div>
    );
  if (i === 2)
    return (
      <div className="flex flex-col items-start gap-3">
        <div className="flex flex-wrap gap-2.5">
          {(['high', 'medium', 'low'] as Sev[]).map((s) => (
            <span key={s} className="text-sm md:text-base"><Badge sev={s} /></span>
          ))}
        </div>
        <p className="text-sm text-[#8A8F98]">Every badge pairs a colour with a shape and a word, so no one has to rely on colour alone.</p>
      </div>
    );
  if (i === 3)
    return (
      <svg viewBox="0 0 300 110" className="h-auto w-full" role="img" aria-label="Line graph drawing from left to right">
        <g stroke="rgba(255,255,255,0.12)">
          {[20, 55, 90].map((y) => <line key={y} x1="0" x2="300" y1={y} y2={y} />)}
        </g>
        <path d="M0 92L30 72L60 80L90 50L120 62L150 36L180 54L210 30L240 42L270 20L300 28" pathLength={1} fill="none" stroke={RED} strokeWidth="2.5" strokeLinejoin="round" className="dw-draw" />
      </svg>
    );
  if (i === 4)
    return (
      <div className="text-[13px] md:text-sm" aria-hidden>
        <p className="mb-2 text-xs tracking-widest text-[#8A8F98]">EXAMPLE SHA-1</p>
        <div className="flex flex-wrap items-stretch gap-2 break-all">
          <span className="border px-2 py-2 font-bold" style={{ borderColor: RED, color: RED_T }}>5BAA6</span>
          <span className="flex min-h-9 flex-1 items-center bg-black px-3 text-xs text-[#8A8F98]" style={{ border: `1px solid ${LINE}`, minWidth: 150 }}>
            35 chars stay on device
          </span>
        </div>
        <p className="mt-3 text-[#8A8F98]">
          <span style={{ color: RED_T }}>sent</span> prefix only &middot; <span style={{ color: GREEN }}>kept</span> the rest
        </p>
      </div>
    );
  return (
    <div className="flex flex-wrap gap-2.5">
      {BREACHES.map((b, k) => (
        <span key={b.id} className="dw-chip border px-3 py-2 text-sm" style={{ borderColor: LINE, animationDelay: `${k * 0.08}s` }}>
          {b.name} <span className="text-[#8A8F98]">{b.year}</span>
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Page({ theme }: { theme: ProjectTheme }) {
  const [resolved, setResolved] = useState<string[]>([]);
  const [sel, setSel] = useState<string>(BREACHES[0].id);
  const [done, setDone] = useState<string[]>([]);
  const [fi, setFi] = useState(0);
  const [tr, setTr] = useState(-1);
  const [stackRef, stackSeen] = useInView<HTMLOListElement>();

  const open = BREACHES.length - resolved.length;
  const sev: Sev = open === 0 ? 'low' : open <= 2 ? 'medium' : 'high';
  const cur = BREACHES.find((b) => b.id === sel) ?? BREACHES[0];
  const curDone = resolved.includes(cur.id);
  const toggleResolved = (id: string) => setResolved((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));
  const toggleAction = (k: string) => setDone((d) => (d.includes(k) ? d.filter((x) => x !== k) : [...d, k]));

  useEffect(() => {
    if (tr < 0 || tr >= PIPE.length) return;
    const t = setTimeout(() => setTr((v) => v + 1), 750);
    return () => clearTimeout(t);
  }, [tr]);

  return (
    <main className="dw-root relative overflow-x-clip" style={{ background: theme.palette.bg, color: theme.palette.text, fontFamily: MONO }}>
      <style>{CSS}</style>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b" style={{ borderColor: LINE }}>
        <div className="absolute inset-0" aria-hidden>
          <Image src={theme.heroImage} alt="" fill priority sizes="100vw" className="object-cover opacity-[0.16] grayscale" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(10,10,11,0.55), ${theme.palette.bg} 96%)` }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
          <div className="dw-scan absolute inset-0 overflow-hidden"><i /></div>
        </div>

        <div className={`${wrap} relative grid min-h-[88svh] items-center gap-10 pb-14 pt-24 md:pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14`}>
          <div>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold tracking-[0.2em] text-[#8A8F98] md:text-sm">
              <span className="inline-flex items-center gap-2" style={{ color: RED_T }}>
                <span className="dw-blink inline-block h-2.5 w-2.5 rounded-full" style={{ background: RED }} />
                LIVE CONSOLE
              </span>
              <span>{theme.kicker}</span>
            </p>
            <h1 className="dw-title mt-5 font-bold uppercase leading-[0.95] tracking-tighter">
              {theme.title}
              <span style={{ color: RED }}>_</span>
            </h1>
            <p className="mt-5 max-w-xl text-xl font-semibold leading-snug md:text-2xl">{theme.subtitle}</p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#8A8F98] md:text-base">
              Your email is on a list. We&apos;ll show you which one. Scan once, see every site that leaked you, then fix it.
            </p>

            <div className="mt-7 max-w-md border p-4 text-[13px] leading-6 md:text-sm" style={{ borderColor: LINE, background: 'rgba(0,0,0,0.6)' }} aria-label="Terminal output">
              {BOOT.slice(1).map((l, k) => (
                <span key={l} className="dw-line" style={{ animationDelay: `${0.3 + k * 0.5}s`, color: GREEN }}>{l}</span>
              ))}
              <span className="dw-line" style={{ animationDelay: '1.9s' }}>&gt; dark_watch --scan you@example.com</span>
              <span className="dw-line" style={{ animationDelay: '2.7s', color: open ? RED_T : GREEN }}>
                &gt; {open ? `${open} open threats. Decrypting...` : 'all clear. Nothing open.'}
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#feed" className="inline-flex min-h-12 items-center px-5 text-sm font-bold tracking-widest text-black transition-transform hover:-translate-y-0.5" style={{ background: RED }}>
                OPEN ALERT FEED
              </a>
              <a href="#briefing" className="inline-flex min-h-12 items-center border px-5 text-sm font-bold tracking-widest transition-colors hover:bg-white/5" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                READ BRIEFING
              </a>
            </div>
          </div>

          <div className="border p-4 md:p-5" style={{ borderColor: LINE, background: 'rgba(17,19,23,0.88)', ['--c' as string]: SEV[sev].c } as CSSProperties}>
            <div className="mb-4 flex items-center justify-between gap-3 text-xs font-semibold tracking-widest">
              <span className="text-[#8A8F98]">RADAR {'//'} SWEEP ACTIVE</span>
              <Badge sev={sev} text={`THREAT ${SEV[sev].label}`} />
            </div>
            <Radar resolved={resolved} sel={sel} onSel={setSel} sev={sev} />
            <div className="mt-4 border p-3 text-sm" style={{ borderColor: LINE }} aria-live="polite">
              <p className="text-xs tracking-widest text-[#8A8F98]">TARGET LOCK</p>
              <p className="mt-1 text-base font-bold">
                {cur.name} <span className="text-[#8A8F98]">{cur.year}</span>{' '}
                <span className="text-xs tracking-widest" style={{ color: curDone ? GREEN : RED_T }}>{curDone ? 'RESOLVED' : 'OPEN'}</span>
              </p>
              <button
                type="button"
                onClick={() => toggleResolved(cur.id)}
                className="mt-3 min-h-11 w-full border px-4 text-xs font-bold tracking-widest transition-colors hover:bg-white/5"
                style={{ borderColor: curDone ? LINE : GREEN, color: curDone ? '#8A8F98' : GREEN }}
              >
                {curDone ? 'REOPEN THREAT' : 'MARK RESOLVED'}
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[#8A8F98]">Simulation: resolve breaches and the sweep calms down, like the real dashboard.</p>
          </div>
        </div>
      </section>

      {/* ticker */}
      <div className="overflow-hidden border-b py-3" style={{ borderColor: LINE, background: '#000' }} aria-hidden>
        <div className="dw-marq flex w-max text-xs font-semibold tracking-[0.25em] md:text-sm" style={{ color: RED_T }}>
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0">
              {[...BREACHES.map((b) => `${b.name.toUpperCase()} ${b.year}`), 'SHA-1 PREFIX ONLY', '0 FULL HASHES LEAKED'].map((t) => (
                <span key={t} className="px-5">{'▲'} {t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============ TELEMETRY ============ */}
      <section className={`${wrap} py-12 md:py-16`}>
        <div className="grid grid-cols-2 gap-px lg:grid-cols-4" style={{ background: LINE }}>
          {theme.bigNumbers.map((n, k) => (
            <Reveal key={n.label} delay={k * 80} className="h-full">
              <div style={{ background: theme.palette.bg }} className="h-full p-5 md:p-7">
                <p className="text-5xl font-bold tabular-nums md:text-7xl" style={{ color: n.value === '0' ? GREEN : RED }}><Count to={parseInt(n.value, 10) || 0} /></p>
                <p className="mt-2 text-xs uppercase tracking-widest text-[#8A8F98] md:text-sm">{n.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ BRIEFING ============ */}
      <section id="briefing" className={`${wrap} py-12 md:py-20`}>
        <SecHead no="02" label="CLASSIFIED BRIEFING" title="Why it got built" sub="Three lines from the build story. Tap a black bar to declassify it." />
        <div className="grid gap-5 lg:grid-cols-3">
          {theme.story.quotes.map((q, k) => (
            <Reveal key={q.kicker} delay={k * 100}>
              <Redacted n={k + 1} quote={q.quote} context={q.context} phrases={REDACTIONS[k] ?? []} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ FEED ============ */}
      <section id="feed" className={`${wrap} py-12 md:py-20`}>
        <SecHead no="03" label="BREACH ALERT FEED" title="Triage the leaks" sub="The five mock fixtures that ship with the app. Open one, work through the actions, mark it resolved." />
        <div className="mb-5 grid grid-cols-3 gap-px text-center" style={{ background: LINE }}>
          {[
            { k: 'OPEN', v: open, c: open ? RED_T : GREEN },
            { k: 'RESOLVED', v: resolved.length, c: GREEN },
            { k: 'LEVEL', v: SEV[sev].label, c: SEV[sev].c },
          ].map((s) => (
            <div key={s.k} className="py-3" style={{ background: PANEL }}>
              <p className="text-xl font-bold md:text-3xl" style={{ color: s.c }}>{s.v}</p>
              <p className="text-xs tracking-widest text-[#8A8F98]">{s.k}</p>
            </div>
          ))}
        </div>
        <div className="mb-6 h-1 w-full overflow-hidden" style={{ background: '#1d2026' }}>
          <div className="h-full origin-left transition-transform duration-500" style={{ background: GREEN, transform: `scaleX(${resolved.length / BREACHES.length})` }} />
        </div>
        {open === 0 && (
          <p className="mb-5 border p-4 text-sm font-bold tracking-widest" style={{ borderColor: GREEN, color: GREEN }} role="status">
            {'●'} ALL CLEAR. Scan once, sleep better.
          </p>
        )}
        <ul className="space-y-3">
          {BREACHES.map((b, k) => {
            const r = resolved.includes(b.id);
            const on = sel === b.id;
            return (
              <li key={b.id}>
                <Reveal delay={k * 60}>
                  <div className="border-l-[3px] transition-opacity" style={{ borderColor: r ? 'rgba(0,255,102,0.4)' : RED, background: PANEL, opacity: r ? 0.6 : 1 }}>
                    <button
                      type="button"
                      onClick={() => setSel(on ? '' : b.id)}
                      aria-expanded={on}
                      className="flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left md:gap-5 md:px-6"
                    >
                      <span className="hidden text-xs tracking-widest text-[#8A8F98] sm:block">{b.id}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-bold tracking-widest" style={{ color: r ? GREEN : RED_T }}>{r ? '[CLEARED]' : '[ALERT]'}</span>
                        <span className="block truncate text-lg font-bold md:text-xl">{b.name} <span className="font-normal text-[#8A8F98]">{b.year}</span></span>
                      </span>
                      <span className="text-xs font-bold tracking-widest" style={{ color: r ? GREEN : RED_T }}>{r ? 'RESOLVED' : 'OPEN'}</span>
                      <span aria-hidden className="text-lg text-[#8A8F98] transition-transform" style={{ transform: on ? 'rotate(90deg)' : 'none' }}>{'›'}</span>
                    </button>
                    {on && (
                      <div className="dw-fade border-t px-4 pb-5 pt-4 md:px-6" style={{ borderColor: LINE }}>
                        <p className="text-sm leading-relaxed text-[#8A8F98]">Mock fixture bundled for offline iteration. The live lookup runs the same path behind a feature flag.</p>
                        <p className="mb-2 mt-4 text-xs tracking-widest text-[#8A8F98]">DATA CLASSES REPORTED</p>
                        <div className="flex flex-wrap gap-2">
                          {CHIPS.map((c) => <span key={c} className="border px-2.5 py-1.5 text-xs" style={{ borderColor: LINE }}>{c}</span>)}
                        </div>
                        <p className="mb-2 mt-4 text-xs tracking-widest text-[#8A8F98]">ACTIONS PANEL</p>
                        <div className="flex flex-wrap gap-2">
                          {ACTIONS.map((a) => {
                            const key = `${b.id}:${a}`;
                            const d = done.includes(key);
                            return (
                              <button key={a} type="button" aria-pressed={d} onClick={() => toggleAction(key)} className="min-h-11 border px-3 text-xs font-bold tracking-wider transition-colors hover:bg-white/5" style={{ borderColor: d ? GREEN : LINE, color: d ? GREEN : undefined }}>
                                {d ? '✓ ' : ''}{a}
                              </button>
                            );
                          })}
                          <button type="button" onClick={() => toggleResolved(b.id)} className="min-h-11 px-4 text-xs font-bold tracking-wider" style={{ background: r ? 'transparent' : GREEN, color: r ? '#8A8F98' : '#000', border: `1px solid ${r ? LINE : GREEN}` }}>
                            {r ? 'REOPEN' : 'MARK RESOLVED'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
        {resolved.length > 0 && (
          <button type="button" onClick={() => { setResolved([]); setDone([]); }} className="mt-5 min-h-11 border px-4 text-xs font-bold tracking-widest hover:bg-white/5" style={{ borderColor: LINE }}>
            RESET FEED
          </button>
        )}
      </section>

      {/* ============ MODULES ============ */}
      <section className={`${wrap} py-12 md:py-20`}>
        <SecHead no="04" label="MODULES" title="What is inside" sub="Six pieces of the build. Pick one to run it." />
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {theme.features.map((f, k) => (
              <button
                key={f.title}
                type="button"
                onClick={() => setFi(k)}
                aria-pressed={fi === k}
                className="flex min-h-14 items-center gap-3 border px-3 py-3 text-left text-sm font-semibold transition-colors hover:bg-white/5 md:px-4 md:text-base"
                style={{ borderColor: fi === k ? RED : LINE, background: fi === k ? 'rgba(255,0,60,0.1)' : PANEL }}
              >
                <span className="text-xs tracking-widest" style={{ color: fi === k ? RED_T : '#8A8F98' }}>0{k + 1}</span>
                <span>{f.title}</span>
              </button>
            ))}
          </div>
          <div className="border p-5 md:p-7" style={{ borderColor: LINE, background: PANEL }}>
            <div key={fi} className="dw-fade">
              <h3 className="text-xl font-bold md:text-2xl">{theme.features[fi].title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8A8F98] md:text-base">{theme.features[fi].desc}</p>
              <div className="mt-6 flex min-h-[150px] items-center border p-4" style={{ borderColor: LINE, background: '#000' }}>
                <div className="w-full"><Viz i={fi} /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ DATA PATH ============ */}
      <section className={`${wrap} py-12 md:py-20`}>
        <SecHead no="05" label="DATA PATH" title="From email to action" sub="Run a trace to follow one scan through the app." />
        <ol className="grid gap-3 lg:grid-cols-5">
          {PIPE.map((p, k) => {
            const on = tr >= k;
            return (
              <li key={p.t} className="border p-4 transition-colors duration-300" style={{ borderColor: on ? RED : LINE, background: on ? 'rgba(255,0,60,0.1)' : PANEL }}>
                <p className="flex items-center justify-between text-xs font-bold tracking-widest" style={{ color: on ? RED_T : '#8A8F98' }}>
                  STEP 0{k + 1}
                  <span aria-hidden className={`text-base lg:-rotate-90 ${k < PIPE.length - 1 ? '' : 'invisible'}`}>{'↓'}</span>
                </p>
                <h3 className="mt-2 text-base font-bold">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8A8F98]">{p.d}</p>
              </li>
            );
          })}
        </ol>
        <button type="button" onClick={() => setTr(0)} className="mt-4 min-h-12 px-5 text-sm font-bold tracking-widest text-black" style={{ background: RED }}>
          {tr < 0 ? 'RUN TRACE' : tr >= PIPE.length ? 'REPLAY TRACE' : 'TRACING...'}
        </button>

        <h3 className="mb-6 mt-14 text-xs font-bold tracking-[0.22em] text-[#8A8F98]">STACK LAYERS</h3>
        <ol ref={stackRef} className="relative pl-9">
          <div className="absolute bottom-3 left-[11px] top-3 w-px origin-top transition-transform duration-[1400ms] ease-out" style={{ background: RED, transform: stackSeen ? 'scaleY(1)' : 'scaleY(0)' }} aria-hidden />
          {theme.architecture.map((a, k) => (
            <li key={a.layer} className="relative pb-6 last:pb-0">
              <span className="absolute -left-9 top-1 flex h-6 w-6 items-center justify-center border text-xs font-bold" style={{ borderColor: RED, background: '#000', color: RED_T }}>{k + 1}</span>
              <h4 className="text-lg font-bold uppercase tracking-wide md:text-xl">{a.layer}</h4>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#8A8F98] md:text-base">{a.details}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ============ EVIDENCE ============ */}
      <section className={`${wrap} py-12 md:py-20`}>
        <SecHead no="06" label="EVIDENCE LOCKER" title="Exhibits" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EVIDENCE.map((e, k) => (
            <Reveal key={e.src} delay={(k % 3) * 100} className={k % 3 === 1 ? 'lg:mt-10' : ''}>
              <figure>
                <div className="dw-evd relative aspect-[3/2] w-full">
                  <Image src={e.src} alt={e.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" loading="lazy" className="object-cover" />
                  {['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((c) => (
                    <span key={c} aria-hidden className={`absolute h-5 w-5 ${c}`} style={{ borderColor: RED }} />
                  ))}
                </div>
                <figcaption className="mt-3 text-xs tracking-widest text-[#8A8F98]">
                  <span style={{ color: RED_T }}>EVD-0{k + 1}</span> {'//'} {e.cap}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ OUTCOME ============ */}
      <section className={`${wrap} pb-24 pt-12 md:pb-28 md:pt-20`}>
        <SecHead no="07" label="VERDICT" title="Case closed" />
        <Reveal>
          <p className="max-w-4xl text-3xl font-bold leading-tight md:text-5xl" style={{ color: theme.palette.text }}>
            <span style={{ color: GREEN }}>&gt; </span>
            {theme.outcomeQuote}
            <span className="dw-blink ml-1 inline-block h-[0.85em] w-[0.5em] translate-y-[0.1em]" style={{ background: GREEN }} aria-hidden />
          </p>
        </Reveal>
        <Reveal delay={120} className="mt-10 max-w-2xl">
          <div className="space-y-2 border p-4 text-[13px] leading-6 md:p-5 md:text-sm" style={{ borderColor: LINE, background: 'rgba(0,0,0,0.6)' }}>
            <p><span style={{ color: GREEN }}>[OK]</span> first real user has resolved seven breaches, two he did not know were public</p>
            <p><span style={{ color: GREEN }}>[OK]</span> cold start to first scan result: about 4 seconds on a mid-range Android phone</p>
            <p><span style={{ color: GREEN }}>[OK]</span> one Flutter codebase: Android, iOS and Web</p>
          </div>
        </Reveal>
      </section>

      <NextChapter currentSlug="darkwatch" accent={RED} />
      <SiteFooter />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* CSS (unique dw- prefix)                                             */
/* ------------------------------------------------------------------ */

const CSS = `
.dw-root :focus-visible{outline:2px solid #fff;outline-offset:2px}
.dw-root ::selection{background:${RED};color:#000}
.dw-title{font-size:clamp(2.5rem,14vw,4.5rem)}
@media (min-width:768px){.dw-title{font-size:clamp(4rem,10vw,6.5rem)}}
@media (min-width:1024px){.dw-title{font-size:clamp(4rem,6.6vw,6.5rem)}}
.dw-rv{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}
.dw-rv.dw-in{opacity:1;transform:none}
.dw-sweep{transform-origin:50% 50%;animation:dw-rot 4s linear infinite;will-change:transform}
@keyframes dw-rot{to{transform:rotate(360deg)}}
.dw-ping{animation:dw-ping 2.4s ease-out infinite}
@keyframes dw-ping{0%{transform:scale(.25);opacity:.9}100%{transform:scale(1.5);opacity:0}}
.dw-scan i{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 0,transparent 80%,rgba(255,0,60,.10) 99%,rgba(255,0,60,.75) 100%);animation:dw-scan 7s linear infinite}
@keyframes dw-scan{from{transform:translateY(-100%)}to{transform:translateY(0)}}
.dw-marq{animation:dw-marq 38s linear infinite}
@keyframes dw-marq{to{transform:translateX(-50%)}}
.dw-blink{animation:dw-blink 1.1s steps(2,start) infinite}
@keyframes dw-blink{to{opacity:0}}
.dw-line{display:block;white-space:nowrap;clip-path:inset(0 100% 0 0);animation:dw-type .6s steps(24,end) forwards}
@keyframes dw-type{to{clip-path:inset(0 0 0 0)}}
.dw-fade{animation:dw-fade .45s ease both}
@keyframes dw-fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.dw-chip{animation:dw-fade .45s ease both}
.dw-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:dw-draw 1.8s ease forwards}
@keyframes dw-draw{to{stroke-dashoffset:0}}
.dw-redact{display:inline;padding:.28em .3em;margin:0 .05em;cursor:pointer;font:inherit;line-height:inherit;text-align:left;border:1px solid #2a2d33;background:#000;color:transparent;-webkit-box-decoration-break:clone;box-decoration-break:clone;transition:background-color .3s ease,color .3s ease,border-color .3s ease}
.dw-redact:hover{border-color:${RED}}
.dw-redact[data-open='true']{background:rgba(255,0,60,.14);color:#E0E5EC;border-color:${RED}}
.dw-evd{overflow:hidden;background:#000}
.dw-evd img{filter:grayscale(1) contrast(1.1) brightness(.8);transition:filter .4s ease}
.dw-evd:hover img{filter:none}
@media (prefers-reduced-motion:reduce){
  .dw-sweep,.dw-ping,.dw-scan i,.dw-marq,.dw-blink,.dw-fade,.dw-chip{animation:none}
  .dw-line{animation:none;clip-path:none}
  .dw-draw{animation:none;stroke-dashoffset:0}
  .dw-rv{opacity:1;transform:none;transition:none}
  .dw-scan{display:none}
}
`;
