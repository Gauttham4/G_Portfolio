'use client';

// VKMG ReportLog: FIELD REPORT CLIPBOARD microsite.
// Safety orange + charcoal, a clipboard form that files itself, an OFFLINE/SYNCED switch,
// self-ticking inspection checklists and hazard-stripe dividers.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

const ORANGE = '#FF6B1A';
const AMBER = '#F2A93B';
const INK = '#1F1F1F';
const INK2 = '#2C2C2C';
const PAPER = '#F4EFE7';
const TAN = '#A89070';
const STEEL = '#3D6A8F';
const STEEL_LIGHT = '#8DB4D6';
const PAPER_DIM = '#5B4E3C';
const OSWALD = "var(--font-oswald), Oswald, 'Arial Narrow', Impact, sans-serif";
const MONO = "var(--font-plex), 'IBM Plex Mono', ui-monospace, monospace";
const LORA = "var(--font-lora), Lora, Georgia, serif";
const HAZARD = `repeating-linear-gradient(-45deg, ${ORANGE} 0 14px, ${INK} 14px 28px)`;

const FIELDS = ['Project', 'Date', 'Work done', 'Manpower', 'Materials', 'Issues', 'Photos & files'];
const MARQUEE = ['OFFLINE FIRST', 'SAVE LOCALLY', 'SYNC LATER', 'HIVE', 'FLUTTER', 'ZERO PAPER REPORTS', 'FILE IT ON SITE'];
// Illustrative month, Mon-first. 0 = no dot. Day 17 is the gap the Owner spots.
const DOTS = [2, 3, 2, 1, 2, 0, 0, 3, 2, 2, 3, 1, 0, 0, 2, 3, 0, 2, 2, 0, 0, 3, 2, 1, 2, 3, 0, 0, 2, 2, 1];
const STATUS = ['FILING', 'SAVED LOCALLY · QUEUED', 'SYNCING', 'SYNCED'];

// ---- hooks ---------------------------------------------------------------------
function useSeen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

function Rise({ children, delay = 0, className = '', style }: { children: ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  return (
    <div ref={ref} className={`vk-rise ${className}`} style={{ ...style, opacity: seen ? 1 : 0, transform: seen ? 'none' : 'translateY(18px)', transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Count({ to }: { to: number }) {
  const [ref, seen] = useSeen<HTMLSpanElement>();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || to === 0) { setV(to); return; }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 1400);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <span ref={ref}>{v}</span>;
}

// ---- small parts ---------------------------------------------------------------
function Tick({ on, size = 24, dark = false, delay = 0 }: { on: boolean; size?: number; dark?: boolean; delay?: number }) {
  return (
    <span
      aria-hidden="true"
      className="vk-box inline-flex shrink-0 items-center justify-center rounded-[5px]"
      style={{ width: size, height: size, border: `2px solid ${on ? ORANGE : dark ? INK : TAN}`, background: on ? ORANGE : 'transparent', transition: `background .25s ease ${delay}ms, border-color .25s ease ${delay}ms` }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.75} height={size * 0.75} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="square">
        <path d="M4.5 12.5l5 5L19.5 6.5" pathLength={1} strokeDasharray={1} strokeDashoffset={on ? 0 : 1} style={{ transition: `stroke-dashoffset .35s ease ${delay + 80}ms` }} />
      </svg>
    </span>
  );
}

function Hazard({ h = 12, className = '' }: { h?: number; className?: string }) {
  return <div aria-hidden="true" className={className} style={{ height: h, background: HAZARD }} />;
}

function Head({ no, title, sub }: { no: string; title: string; sub?: string }) {
  return (
    <Rise className="mb-12 md:mb-14">
      <div className="flex items-center gap-3">
        <span className="px-2.5 py-1 text-xs font-bold tracking-[0.18em]" style={{ background: ORANGE, color: INK, fontFamily: MONO }}>FORM {no}</span>
        <span aria-hidden="true" className="h-[3px] flex-1" style={{ background: `repeating-linear-gradient(90deg, ${TAN} 0 8px, transparent 8px 14px)`, opacity: 0.5 }} />
      </div>
      <h2 className="mt-5 text-4xl uppercase leading-[0.95] md:text-6xl" style={{ fontFamily: OSWALD, fontWeight: 700, color: PAPER }}>{title}</h2>
      {sub && <p className="mt-3 max-w-xl text-base md:text-lg" style={{ color: TAN }}>{sub}</p>}
    </Rise>
  );
}

function CloudIcon({ online }: { online: boolean }) {
  const cloud = 'M7 18.5a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 10a4.2 4.2 0 0 1-.5 8.5z';
  return (
    <span className="relative inline-block h-9 w-9 shrink-0" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full" fill="none" stroke={TAN} strokeWidth={1.6} strokeLinecap="round" style={{ opacity: online ? 0 : 1, transition: 'opacity .36s ease' }}>
        <path d={cloud} /><path d="M4 4l16 16" stroke={ORANGE} strokeWidth={2.2} />
      </svg>
      <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full" fill="none" stroke={STEEL_LIGHT} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: online ? 1 : 0, transition: 'opacity .36s ease' }}>
        <path d={cloud} /><path d="M12 17v-5M9.8 14l2.2-2.4 2.2 2.4" className={online ? 'vk-up' : ''} />
      </svg>
    </span>
  );
}

// ---- hero clipboard ------------------------------------------------------------
function Clipboard({ image }: { image: string }) {
  const [phase, setPhase] = useState(0);
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const r = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduce(r);
    if (r) { setPhase(10); return; }
    const id = setInterval(() => setPhase((p) => (p + 1) % 14), 1000);
    return () => clearInterval(id);
  }, []);
  const online = phase >= 9;
  const ticked = phase >= 8 ? FIELDS.length : Math.max(0, phase - 1);
  const st = phase < 8 ? 0 : phase < 9 ? 1 : phase < 10 ? 2 : 3;
  const flip = () => setPhase((p) => (p >= 9 ? (reduce ? 8 : 0) : reduce ? 10 : 9));
  const stBg = [INK2, AMBER, STEEL, '#2D5878'][st];
  return (
    <div className="vk-board relative mx-auto w-full max-w-[460px] rounded-2xl px-3 pb-3 pt-9 sm:px-4 sm:pb-4" style={{ background: ORANGE, boxShadow: `0 28px 60px -24px rgba(0,0,0,.7), inset 0 0 0 3px ${INK}` }}>
      <div aria-hidden="true" className="absolute left-1/2 top-0 z-10 h-11 w-28 -translate-x-1/2 -translate-y-3 rounded-lg" style={{ background: `linear-gradient(#5b5b5b, #2c2c2c)`, boxShadow: '0 6px 0 rgba(0,0,0,.25)' }}>
        <span className="absolute left-1/2 top-2.5 h-3 w-14 -translate-x-1/2 rounded-full" style={{ background: INK }} />
      </div>
      <div className="relative rounded-md p-4 sm:p-5" style={{ background: PAPER, color: INK }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: PAPER_DIM }}>VKMG · Daily site report</p>
            <p className="mt-1 text-2xl uppercase leading-none" style={{ fontFamily: OSWALD, fontWeight: 700 }}>Report log</p>
          </div>
          <span key={st} className="vk-pop mt-0.5 shrink-0 rounded-sm px-2 py-1 text-[11px] font-bold tracking-[0.12em]" style={{ background: stBg, color: st === 1 ? INK : PAPER, fontFamily: MONO }} role="status" aria-live="polite">
            {STATUS[st]}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-md px-3 py-2" style={{ background: INK, color: PAPER }}>
          <CloudIcon online={online} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold uppercase tracking-[0.14em]" style={{ fontFamily: OSWALD, color: online ? STEEL_LIGHT : ORANGE }}>{online ? 'Synced' : 'Offline'}</p>
            <p className="truncate text-xs" style={{ color: TAN, fontFamily: MONO }}>{online ? 'queue drained' : 'saving to Hive'}</p>
          </div>
          <button type="button" role="switch" aria-checked={online} aria-label="Toggle offline or online" onClick={flip} className="vk-switch relative h-10 w-[4.5rem] shrink-0 rounded-full" style={{ background: online ? STEEL : '#444', border: `2px solid ${online ? STEEL_LIGHT : TAN}`, transition: 'background .3s ease' }}>
            <span className="absolute left-[3px] top-[3px] h-8 w-8 rounded-full" style={{ background: online ? PAPER : ORANGE, transform: `translateX(${online ? 32 : 0}px)`, transition: 'transform .3s cubic-bezier(.65,0,.35,1), background .3s ease' }} />
          </button>
        </div>

        <ul className="mt-3 divide-y" style={{ borderColor: 'rgba(31,31,31,.12)' }}>
          {FIELDS.slice(0, 6).map((f, i) => (
            <li key={f} className="flex min-h-[40px] items-center gap-3 py-1.5" style={{ borderColor: 'rgba(31,31,31,.12)' }}>
              <Tick on={ticked > i} dark size={22} />
              <span className="w-24 shrink-0 text-[13px] font-semibold sm:w-28" style={{ fontFamily: MONO }}>{f}</span>
              <span className="relative block h-2.5 flex-1 rounded-full" style={{ background: 'rgba(31,31,31,.1)' }}>
                <span className="absolute inset-0 origin-left rounded-full" style={{ background: INK, transform: `scaleX(${ticked > i ? [0.62, 0.38, 0.9, 0.2, 0.7, 0.5][i] : 0})`, transition: 'transform .5s cubic-bezier(.32,.72,.3,1)' }} />
              </span>
            </li>
          ))}
          <li className="flex min-h-[40px] items-center gap-3 py-2" style={{ borderColor: 'rgba(31,31,31,.12)' }}>
            <Tick on={ticked > 6} dark size={22} />
            <span className="w-24 shrink-0 text-[13px] font-semibold sm:w-28" style={{ fontFamily: MONO }}>{FIELDS[6]}</span>
            <span className="relative block h-12 flex-1 overflow-hidden rounded-sm" style={{ background: 'rgba(31,31,31,.1)', opacity: ticked > 6 ? 1 : 0.35, transition: 'opacity .4s ease' }}>
              <Image src={image} alt="Site plan sketch attached to the report" fill priority sizes="(min-width:640px) 220px, 160px" className="object-cover" />
            </span>
          </li>
        </ul>
        <p className="mt-2 text-[11px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: PAPER_DIM }}>Images downscaled to 1600 px on capture</p>
      </div>
    </div>
  );
}

// ---- sections ------------------------------------------------------------------
function Hero({ theme }: { theme: ProjectTheme }) {
  const [brand, ...rest] = theme.title.split(' ');
  return (
    <section className="relative px-5 pb-24 pt-24 md:px-10 md:pb-10 md:pt-36 lg:pb-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <p className="vk-stampin text-xs font-bold uppercase tracking-[0.22em] md:text-[13px]" style={{ fontFamily: MONO, color: AMBER }}>{theme.kicker}</p>
          <div className="mt-6 inline-block px-3 py-1 text-sm font-bold uppercase tracking-[0.3em]" style={{ background: ORANGE, color: INK, fontFamily: OSWALD }}>{brand}</div>
          <h1 className="mt-3 text-[clamp(3.4rem,17vw,7rem)] uppercase leading-[0.88] lg:text-[clamp(4rem,8.2vw,8.5rem)]" style={{ fontFamily: OSWALD, fontWeight: 700, color: PAPER }}>{rest.join(' ')}</h1>
          <Hazard h={14} className="mt-6 max-w-md" />
          <p className="mt-6 max-w-md text-xl md:text-2xl" style={{ color: PAPER, fontFamily: LORA }}>{theme.subtitle}</p>
          <ul className="mt-7 flex flex-wrap gap-2.5" style={{ fontFamily: MONO }}>
            {['Flutter', 'Hive', 'Offline-first', 'Developer files', 'Owner reviews'].map((t) => (
              <li key={t} className="rounded-sm border px-2.5 py-1.5 text-xs uppercase tracking-[0.1em]" style={{ borderColor: TAN, color: PAPER }}>{t}</li>
            ))}
          </ul>
        </div>
        <Clipboard image={theme.heroImage} />
      </div>
    </section>
  );
}

function Marquee() {
  const row = (aria: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={aria || undefined}>
      {MARQUEE.map((m) => (
        <span key={m} className="flex items-center whitespace-nowrap px-5 text-2xl uppercase md:text-3xl" style={{ fontFamily: OSWALD, fontWeight: 700, color: INK }}>
          {m}<span aria-hidden="true" className="ml-10 inline-block h-3 w-3 rotate-45" style={{ background: INK }} />
        </span>
      ))}
    </div>
  );
  return (
    <div>
      <Hazard h={14} />
      <div className="overflow-hidden py-2.5" style={{ background: ORANGE }}>
        <div className="vk-marquee flex w-max">{row(false)}{row(true)}</div>
      </div>
      <Hazard h={14} />
    </div>
  );
}

function FieldNotes({ quotes }: { quotes: ProjectTheme['story']['quotes'] }) {
  const tilt = ['md:-rotate-1', 'md:rotate-1'];
  return (
    <section className="px-5 py-16 md:px-10 md:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <Head no="01" title="Field notes" sub="What the first pilot taught me, in two lines." />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          {quotes.slice(0, 2).map((q, i) => (
            <Rise key={q.kicker} delay={i * 120}>
              <figure className={`vk-slip relative px-6 pb-12 pt-6 md:px-8 ${tilt[i]}`} style={{ background: PAPER, color: INK }}>
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: PAPER_DIM }}>
                  <span>Report nº {String(i + 1).padStart(2, '0')}</span><span>{q.kicker}</span>
                </div>
                <Hazard h={8} className="mt-3" />
                <blockquote className="mt-5 text-3xl leading-[1.1] md:text-4xl" style={{ fontFamily: OSWALD, fontWeight: 700, textTransform: 'uppercase' }}>&ldquo;{q.quote}&rdquo;</blockquote>
                <figcaption className="mt-5 border-t border-dashed pt-4 text-[15px] leading-relaxed" style={{ borderColor: 'rgba(31,31,31,.35)', fontFamily: LORA, color: INK }}>{q.context}</figcaption>
              </figure>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

function SignalPath() {
  return (
    <svg viewBox="0 0 320 130" role="img" aria-label="Signal path: the phone saves to Hive first, connectivity_plus gates the queue, and the Owner side receives it" className="h-auto w-full">
      <rect x="10" y="18" width="62" height="94" rx="10" fill={INK2} stroke={ORANGE} strokeWidth="3" />
      <rect x="18" y="30" width="46" height="8" rx="2" fill={ORANGE} /><rect x="18" y="44" width="34" height="6" rx="2" fill={TAN} /><rect x="18" y="56" width="40" height="6" rx="2" fill={TAN} />
      <text x="41" y="96" textAnchor="middle" fontSize="13" fontWeight="700" fill={PAPER} style={{ fontFamily: MONO }}>HIVE</text>
      <path d="M72 65H132M188 65H248" fill="none" stroke={AMBER} strokeWidth="3" strokeDasharray="7 7" className="vk-ants" />
      <circle cx="160" cy="65" r="28" fill={INK} stroke={STEEL_LIGHT} strokeWidth="3" />
      <path d="M148 72a6 6 0 0 1-.6-11.9A8 8 0 0 1 163 58a5.6 5.6 0 0 1-.7 11.2z" transform="translate(4 2) scale(.95)" fill="none" stroke={STEEL_LIGHT} strokeWidth="2.2" />
      <text x="160" y="122" textAnchor="middle" fontSize="12" fill={TAN} style={{ fontFamily: MONO }}>connectivity_plus</text>
      <rect x="248" y="18" width="62" height="94" rx="6" fill={PAPER} />
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={i} cx={258 + (i % 4) * 14} cy={52 + Math.floor(i / 4) * 16} r="3" fill={[0, 1, 2, 4, 5, 7, 8, 9, 11].includes(i) ? ORANGE : 'rgba(31,31,31,.2)'} />
      ))}
      <rect x="256" y="28" width="46" height="8" rx="2" fill={INK} />
      <text x="279" y="104" textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} style={{ fontFamily: MONO }}>OWNER</text>
    </svg>
  );
}

function PreStart({ layers }: { layers: ProjectTheme['architecture'] }) {
  return (
    <section className="px-5 py-16 md:px-10 md:py-24 lg:py-28" style={{ background: INK2 }}>
      <div className="mx-auto max-w-6xl">
        <Head no="02" title="Pre-start checklist" sub="From the phone to the Owner, four layers." />
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Rise><div className="rounded-xl p-5 md:p-6" style={{ background: INK, border: `2px solid ${TAN}` }}><SignalPath /></div></Rise>
          <ol>
            {layers.map((l, i) => <Layer key={l.layer} l={l} i={i} last={i === layers.length - 1} />)}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Layer({ l, i, last }: { l: ProjectTheme['architecture'][number]; i: number; last: boolean }) {
  const [ref, seen] = useSeen<HTMLLIElement>();
  return (
    <li ref={ref} className="relative flex gap-4 pb-8 last:pb-0 md:gap-5">
      {!last && <span aria-hidden="true" className="absolute left-[15px] top-9 h-[calc(100%-2rem)] w-[3px] origin-top" style={{ background: ORANGE, transform: `scaleY(${seen ? 1 : 0})`, transition: `transform .6s ease ${i * 120 + 250}ms` }} />}
      <Tick on={seen} size={32} delay={i * 120} />
      <div className="min-w-0 pt-0.5" style={{ opacity: seen ? 1 : 0.35, transition: `opacity .5s ease ${i * 120}ms` }}>
        <p className="text-xs tracking-[0.18em]" style={{ fontFamily: MONO, color: AMBER }}>LAYER 0{i + 1}</p>
        <h3 className="text-3xl uppercase leading-tight" style={{ fontFamily: OSWALD, fontWeight: 700, color: PAPER }}>{l.layer}</h3>
        <p className="mt-1 text-[15px] leading-relaxed" style={{ color: '#CFC6B8', fontFamily: MONO }}>{l.details}</p>
      </div>
    </li>
  );
}

function Viz({ i }: { i: number }) {
  const chip = (t: string) => <span className="inline-block rounded-sm px-2 py-1 text-xs font-bold tracking-[0.08em]" style={{ background: INK, color: AMBER, fontFamily: MONO }}>{t}</span>;
  if (i === 0) return <div className="flex flex-wrap items-center gap-2">{chip('LOCAL FIRST')}<span aria-hidden="true" style={{ color: INK }}>&rarr;</span>{chip('NETWORK LATER')}</div>;
  if (i === 1) return <div>{chip('connectivity_plus')}</div>;
  if (i === 2) {
    return (
      <div className="space-y-1.5 text-xs font-bold" style={{ fontFamily: MONO }}>
        <div className="flex items-center gap-2"><span className="w-14">BEFORE</span><span className="h-3 flex-1 rounded-sm" style={{ background: INK }} /><span className="w-12 text-right">8 s</span></div>
        <div className="flex items-center gap-2"><span className="w-14">AFTER</span><span className="h-3 w-[9%] rounded-sm" style={{ background: ORANGE, border: `1px solid ${INK}` }} /><span className="ml-auto w-14 text-right">700 ms</span></div>
      </div>
    );
  }
  if (i === 3) {
    return (
      <div className="flex items-center gap-2" aria-hidden="true">
        {[1, 1, 1, 0, 1, 1, 1].map((d, k) => <span key={k} className="h-3.5 w-3.5 rounded-full" style={d ? { background: INK } : { border: `2px dashed ${ORANGE}`, background: PAPER }} />)}
        <span className="ml-2 text-xs font-bold" style={{ fontFamily: MONO }}>?</span>
      </div>
    );
  }
  if (i === 4) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {['5:00 PM', '7:30 PM', '9:00 AM'].map((t) => chip(t)).map((c, k) => <span key={k}>{c}</span>)}
        <span className="text-sm font-bold" style={{ fontFamily: OSWALD }}>60% &rarr; 92%</span>
      </div>
    );
  }
  return (
    <div className="flex gap-1.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((k) => <span key={k} className="vk-hex h-7 w-8" style={{ background: ORANGE, animationDelay: `${k * 0.35}s`, clipPath: 'polygon(25% 5%,75% 5%,100% 50%,75% 95%,25% 95%,0 50%)' }} />)}
    </div>
  );
}

function Item({ f, i }: { f: ProjectTheme['features'][number]; i: number }) {
  const [ref, seen] = useSeen<HTMLLIElement>();
  return (
    <li ref={ref} className="vk-item flex flex-col rounded-lg p-5 md:p-6" style={{ background: PAPER, color: INK, opacity: seen ? 1 : 0, transform: seen ? 'none' : 'translateY(18px)', transition: `opacity .5s ease ${(i % 3) * 110}ms, transform .5s ease ${(i % 3) * 110}ms` }}>
      <div className="flex items-center justify-between">
        <Tick on={seen} dark size={30} delay={350 + (i % 3) * 110} />
        <span className="text-xs font-bold tracking-[0.18em]" style={{ fontFamily: MONO, color: PAPER_DIM }}>ITEM {String(i + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="mt-4 text-2xl uppercase leading-tight md:text-[1.7rem]" style={{ fontFamily: OSWALD, fontWeight: 700 }}>{f.title}</h3>
      <p className="mt-2 flex-1 text-[15px] leading-relaxed" style={{ color: '#3A3128' }}>{f.desc}</p>
      <div className="mt-5 border-t border-dashed pt-4" style={{ borderColor: 'rgba(31,31,31,.35)' }}><Viz i={i} /></div>
    </li>
  );
}

function Inspection({ features }: { features: ProjectTheme['features'] }) {
  return (
    <section className="px-5 py-16 md:px-10 md:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <Head no="03" title="Inspection checklist" sub="Six items, ticked." />
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => <Item key={f.title} f={f} i={i} />)}
        </ul>
      </div>
    </section>
  );
}

function Board({ nums }: { nums: ProjectTheme['bigNumbers'] }) {
  return (
    <section className="px-5 pb-16 md:px-10 md:pb-24 lg:pb-28">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-xl" style={{ background: INK2, border: `3px solid ${ORANGE}` }}>
        <Hazard h={18} />
        <div className="px-5 py-10 md:px-10 md:py-14">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] md:text-sm" style={{ fontFamily: MONO, color: AMBER }}>Site status board</p>
          <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {nums.map((n) => (
              <div key={n.label} className="flex flex-col-reverse text-center">
                <dt className="mt-2 text-xs uppercase tracking-[0.16em] md:text-sm" style={{ fontFamily: MONO, color: PAPER }}>{n.label}</dt>
                <dd className="text-[clamp(3.6rem,16vw,7rem)] font-bold leading-none tabular-nums" style={{ fontFamily: OSWALD, color: ORANGE }}><Count to={Number(n.value)} /></dd>
              </div>
            ))}
          </dl>
        </div>
        <Hazard h={18} />
      </div>
    </section>
  );
}

function CalendarPanel({ quote }: { quote: ProjectTheme['story']['quotes'][number] }) {
  const [sel, setSel] = useState(17);
  const n = DOTS[sel - 1];
  return (
    <section className="px-5 py-16 md:px-10 md:py-24 lg:py-28" style={{ background: INK2 }}>
      <div className="mx-auto max-w-6xl">
        <Head no="04" title="The Owner's calendar" sub="Make the absence of work visible, not just the presence of it." />
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Rise>
            <figure>
              <blockquote className="text-3xl uppercase leading-[1.08] md:text-5xl" style={{ fontFamily: OSWALD, fontWeight: 700, color: PAPER }}>&ldquo;{quote.quote}&rdquo;</blockquote>
              <figcaption className="mt-5 flex gap-3 text-base leading-relaxed md:text-lg" style={{ color: '#CFC6B8', fontFamily: LORA }}>
                <span aria-hidden="true" className="mt-1 h-auto w-1.5 shrink-0" style={{ background: ORANGE }} />{quote.context}
              </figcaption>
            </figure>
          </Rise>
          <Rise delay={120}>
            <div className="rounded-xl p-4 md:p-6" style={{ background: PAPER, color: INK }}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="whitespace-nowrap text-2xl uppercase" style={{ fontFamily: OSWALD, fontWeight: 700 }}>Reports by day</p>
                <p className="text-[11px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: PAPER_DIM }}>Illustrative month</p>
              </div>
              <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-bold" style={{ fontFamily: MONO, color: PAPER_DIM }}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {DOTS.map((c, i) => {
                  const d = i + 1, on = d === sel;
                  return (
                    <button key={d} type="button" onClick={() => setSel(d)} aria-pressed={on} aria-label={`Day ${d}, ${c ? c + ' reports' : 'no reports'}`} className="vk-day flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-md text-[13px] font-semibold" style={{ background: on ? INK : 'rgba(31,31,31,.07)', color: on ? PAPER : INK, fontFamily: MONO, outline: d === 17 && !on ? `2px dashed ${ORANGE}` : undefined, outlineOffset: -2 }}>
                      {d}
                      <span className="flex h-1.5 gap-0.5" aria-hidden="true">{Array.from({ length: c }).map((_, k) => <i key={k} className="block h-1.5 w-1.5 rounded-full" style={{ background: on ? ORANGE : INK }} />)}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex min-h-[3.5rem] items-center gap-3 rounded-md px-4 py-3" style={{ background: n ? 'rgba(31,31,31,.07)' : ORANGE }} aria-live="polite">
                <span aria-hidden="true" className="text-3xl leading-none" style={{ fontFamily: OSWALD, fontWeight: 700 }}>{n ? n : '?'}</span>
                <p className="text-[15px] font-semibold leading-snug">{n ? `${n} report${n > 1 ? 's' : ''} filed on day ${sel}.` : `Day ${sel}: Why is there no dot here?`}</p>
              </div>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}

function Photos({ theme }: { theme: ProjectTheme }) {
  const base = theme.gallery && theme.gallery.length ? theme.gallery : [];
  // gallery-4 and gallery-6 are byte-identical copies of gallery-1 and gallery-5, so the four unique frames are shown.
  const shots = [0, 1, 2, 4].map((k) => base[k]).filter(Boolean);
  const pos = ['object-[50%_60%]', 'object-[50%_40%]', 'object-center', 'object-center'];
  const alts = ['Site plan sketched on paper beside two laptops', 'Four people working on laptops around a wooden table', 'Hands typing a report on a laptop', 'Line chart of a day of activity on a laptop screen'];
  const tilt = ['md:-rotate-1', 'md:rotate-1', 'md:-rotate-[0.5deg]', 'md:rotate-[0.8deg]'];
  return (
    <section className="px-5 py-16 md:px-10 md:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <Head no="05" title="Attachments" sub="Photographs and documents ride along with the report, small enough to save in a blink." />
        <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-6">
          {shots.map((g, i) => (
            <li key={g.src}>
              <Rise delay={i * 120}>
                <figure className={`relative rounded-sm p-3 pb-4 ${tilt[i]}`} style={{ background: PAPER }}>
                  <span aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-2" style={{ background: AMBER, opacity: 0.85 }} />
                  <div className="relative aspect-[16/9] w-full overflow-hidden lg:aspect-[4/3]" style={{ background: INK2 }}>
                    <Image src={g.src} alt={alts[i]} fill loading="lazy" sizes="(min-width:1024px) 22vw, (min-width:640px) 44vw, 90vw" className={`object-cover ${pos[i]}`} />
                  </div>
                  <figcaption className="mt-3 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: INK }}>
                    <span>{g.caption}</span><span style={{ color: PAPER_DIM }}>IMG {String(i + 1).padStart(2, '0')}</span>
                  </figcaption>
                </figure>
              </Rise>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SignOff({ quote }: { quote: string }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  return (
    <section className="px-5 pb-[7.5rem] pt-16 md:px-10 md:pb-24 md:pt-10 lg:pb-[calc(6rem+53px)]">
      <div ref={ref} className="relative mx-auto max-w-5xl rounded-md px-6 pb-8 pt-14 md:p-12" style={{ background: PAPER, color: INK }}>
        <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ fontFamily: MONO, color: PAPER_DIM }}>Sign-off · PDF export, signature block</p>
        <Hazard h={10} className="mt-3" />
        <blockquote className="mt-6 text-3xl uppercase leading-[1.08] md:text-6xl" style={{ fontFamily: OSWALD, fontWeight: 700 }}>&ldquo;{quote}&rdquo;</blockquote>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {['Developer', 'Owner'].map((r) => (
            <div key={r}>
              <div className="h-10 border-b-2" style={{ borderColor: INK }} />
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: PAPER_DIM }}>{r}</p>
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="absolute -top-5 right-4 rounded-md px-4 py-1.5 text-2xl uppercase md:-top-7 md:right-10 md:text-4xl" style={{ fontFamily: OSWALD, fontWeight: 700, color: ORANGE, border: `4px solid ${ORANGE}`, background: INK, opacity: seen ? 1 : 0, transform: seen ? 'rotate(-6deg) scale(1)' : 'rotate(-6deg) scale(1.5)', transition: 'transform .45s cubic-bezier(.32,.72,.3,1) .3s, opacity .2s ease .3s' }}>
          Filed · Synced
        </div>
      </div>
    </section>
  );
}

// ---- page ----------------------------------------------------------------------
export default function Page({ theme }: { theme: ProjectTheme }) {
  return (
    <main className="vk-root relative overflow-x-clip" style={{ background: INK, color: PAPER, fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}>
      <style>{`
        .vk-root{background-image:linear-gradient(rgba(244,239,231,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(244,239,231,.035) 1px,transparent 1px);background-size:32px 32px}
        .vk-root :focus-visible{outline:3px solid ${AMBER};outline-offset:3px}
        .vk-rise{transition:opacity .65s cubic-bezier(.32,.72,.3,1),transform .65s cubic-bezier(.32,.72,.3,1)}
        .vk-marquee{animation:vk-marq 32s linear infinite}
        @keyframes vk-marq{to{transform:translateX(-50%)}}
        .vk-ants{animation:vk-ants 1.2s linear infinite}
        @keyframes vk-ants{to{stroke-dashoffset:-28}}
        .vk-up{animation:vk-up 1.1s ease-in-out infinite}
        @keyframes vk-up{0%,100%{opacity:1}50%{opacity:.25}}
        .vk-hex{opacity:.15;animation:vk-hex 2.2s ease-in-out infinite}
        @keyframes vk-hex{0%,100%{opacity:.15}35%,70%{opacity:1}}
        .vk-pop{animation:vk-pop .35s cubic-bezier(.32,.72,.3,1)}
        @keyframes vk-pop{from{opacity:.2;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
        .vk-stampin{animation:vk-stamp .6s cubic-bezier(.32,.72,.3,1) both}
        @keyframes vk-stamp{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:none}}
        .vk-board{transform:rotate(1.2deg)}
        .vk-slip{clip-path:polygon(0 0,100% 0,100% calc(100% - 14px),96% 100%,92% calc(100% - 14px),88% 100%,84% calc(100% - 14px),80% 100%,76% calc(100% - 14px),72% 100%,68% calc(100% - 14px),64% 100%,60% calc(100% - 14px),56% 100%,52% calc(100% - 14px),48% 100%,44% calc(100% - 14px),40% 100%,36% calc(100% - 14px),32% 100%,28% calc(100% - 14px),24% 100%,20% calc(100% - 14px),16% 100%,12% calc(100% - 14px),8% 100%,4% calc(100% - 14px),0 100%)}
        .vk-item,.vk-day,.vk-switch{transition:transform .2s ease,background .2s ease}
        @media (hover:hover){.vk-item:hover{transform:translateY(-4px) rotate(-.4deg)!important}.vk-day:hover{transform:scale(1.06)}}
        @media (max-width:420px){.vk-board{transform:none}}
        @media (prefers-reduced-motion:reduce){
          .vk-marquee,.vk-ants,.vk-up,.vk-hex,.vk-pop,.vk-stampin{animation:none!important}
          .vk-hex{opacity:1}
          .vk-rise,.vk-item,.vk-box *,.vk-box{transition:none!important}
          .vk-rise,.vk-item{opacity:1!important;transform:none!important}
        }
      `}</style>
      <Hero theme={theme} />
      <Marquee />
      <FieldNotes quotes={theme.story.quotes} />
      <PreStart layers={theme.architecture} />
      <Inspection features={theme.features} />
      <Board nums={theme.bigNumbers} />
      <CalendarPanel quote={theme.story.quotes[2]} />
      <Photos theme={theme} />
      <SignOff quote={theme.outcomeQuote} />
      <NextChapter currentSlug={theme.slug} accent={AMBER} />
      <SiteFooter />
    </main>
  );
}
