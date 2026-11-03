'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

/* ------------------------------------------------------------------ */
/* Static sample data (UI demo only, clearly labelled "sample" on page) */
/* ------------------------------------------------------------------ */

type View = 'marks' | 'records' | 'transcripts';

const TABS: { id: View; label: string; nav: string; icon: string }[] = [
  { id: 'marks', label: 'Marks', nav: 'Semester records', icon: 'chart' },
  { id: 'records', label: 'Records', nav: 'Profile book', icon: 'book' },
  { id: 'transcripts', label: 'Transcripts', nav: 'Transcript', icon: 'file' },
];

const GPAS: (number | null)[] = [7.8, 8.1, 7.6, 8.4, 8.7, 8.9, null, null];

const ENUMS: { key: string; label: string; values: string[] }[] = [
  { key: 'admission_category', label: 'Admission category', values: ['CENTAC', 'PIO', 'NRI', 'CIGW', 'FN', 'JOSAA', 'CSAB', 'CSAB-NEUT', 'OTHER'] },
  { key: 'entry_type', label: 'Entry type', values: ['Regular', 'Lateral Entry'] },
  { key: 'region', label: 'Region', values: ['PY', 'KA', 'MA', 'YA', 'OS'] },
  { key: 'community', label: 'Community', values: ['GE', 'OBC', 'BCM', 'EBC', 'EWS', 'MBC', 'SC', 'ST'] },
  { key: 'accommodation', label: 'Accommodation', values: ['Hosteller', 'Day Scholar'] },
];

const STEPS = [
  { t: 'Roll number', d: 'Ten digits, the only credential the student types. Checked against ^\\d{10}$ before anything else happens.' },
  { t: 'Email lookup', d: 'The registered @ptuniv.edu.in address is pulled from students.email. Any other domain is refused.' },
  { t: 'Six-digit code', d: 'Mailed with PHPMailer. On screen the address stays partly masked, so the student can confirm without exposing it.' },
  { t: '15 minutes', d: 'The code is good for 900 seconds. The first build used 5 minutes, then university Wi-Fi had its say. Resend: once every 60 seconds.' },
  { t: 'Dashboard', d: 'Profile Book, Semester Records, Generate Transcript, Update Photo. Logout destroys the session and overwrites the cookie.' },
];

const FEATURE_ICONS = ['key', 'book', 'chart', 'file', 'users', 'link'];

const ICONS: Record<string, string> = {
  key: 'M15 7a4 4 0 1 1-3.5 5.9L4 20.4V17h3v-2h2v-2h2.1A4 4 0 0 1 15 7Zm1.5 2.5h.01',
  book: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Zm0 13a3 3 0 0 1 3-3h11M9 8h6',
  chart: 'M4 20V10m6 10V4m6 16v-7m5 7H3',
  file: 'M7 3h7l5 5v13H7V3Zm7 0v5h5M10 13h6m-6 4h6',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9a6 6 0 0 1 12 0M17 4.5a3 3 0 0 1 0 5.8M21 20a5 5 0 0 0-3-4.6',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
};

function Icon({ name, className = 'h-5 w-5' }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name] ?? ICONS.file} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || to === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    setN(0);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / 1100);
          setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return <span ref={ref}>{n}</span>;
}

function SectionHead({ kicker, title, lead, id }: { kicker: string; title: string; lead?: string; id: string }) {
  return (
    <Reveal className="mb-8 max-w-2xl md:mb-12">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--sp-blue)' }}>{kicker}</p>
      <h2 id={id} className="mt-3 text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl">{title}</h2>
      {lead && <p className="mt-4 text-base leading-relaxed sm:text-lg" style={{ color: 'var(--sp-mute)' }}>{lead}</p>}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Interactive app window                                              */
/* ------------------------------------------------------------------ */

function MarksPanel() {
  const [sel, setSel] = useState(5);
  const filled = GPAS.filter((g): g is number => g !== null);
  const delta = filled[filled.length - 1] - filled[0];
  const g = GPAS[sel];
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-xl font-extrabold">Eight-semester GPA</h3>
          <p className="mt-1 text-sm" style={{ color: 'var(--sp-mute)' }}>CHECK constraint keeps every score between 0 and 10.</p>
        </div>
        <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: 'var(--sp-tint)', color: 'var(--sp-blue-d)' }}>
          Trajectory +{delta.toFixed(1)}
        </span>
      </div>
      <div className="mt-5 grid h-48 grid-cols-8 gap-0.5 sm:h-56 sm:gap-2" role="group" aria-label="Semester GPA bars">
        {GPAS.map((v, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSel(i)}
            aria-pressed={sel === i}
            aria-label={v === null ? `Semester ${i + 1}, not recorded` : `Semester ${i + 1}, GPA ${v}`}
            className="sp-col flex min-w-0 flex-col items-center justify-end gap-1.5 rounded-lg px-0.5 pb-1 pt-2"
            data-on={sel === i}
          >
            <span className="flex w-full flex-1 items-end">
              {v === null ? (
                <span className="w-full rounded-t-md border-2 border-dashed" style={{ height: '22%', borderColor: 'var(--sp-line)' }} />
              ) : (
                <span
                  className="sp-bar flex w-full items-start justify-center rounded-t-md pt-1 text-xs font-bold text-white"
                  style={{ height: `${v * 10}%`, animationDelay: `${i * 70}ms` }}
                >
                  {v}
                </span>
              )}
            </span>
            <span className="font-mono text-xs font-semibold" style={{ color: 'var(--sp-mute)' }}>S{i + 1}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 rounded-xl px-4 py-3 text-sm" style={{ background: 'var(--sp-tint)' }} aria-live="polite">
        {g === null ? `Semester ${sel + 1} has no row yet. Greyed out until the grades land.` : `Semester ${sel + 1} · GPA ${g.toFixed(2)} · stored as DECIMAL(3,2).`}
      </p>
    </div>
  );
}

function RecordsPanel() {
  const [pick, setPick] = useState<Record<string, string>>({
    admission_category: 'JOSAA',
    entry_type: 'Regular',
    region: 'PY',
    community: 'GE',
    accommodation: 'Hosteller',
  });
  return (
    <div>
      <h3 className="text-xl font-extrabold">Profile book</h3>
      <p className="mt-1 text-sm" style={{ color: 'var(--sp-mute)' }}>Every paper-form checkbox, now a MySQL ENUM. Pick one.</p>
      <div className="mt-4 space-y-4">
        {ENUMS.map((grp) => (
          <div key={grp.key} role="radiogroup" aria-label={grp.label}>
            <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--sp-mute)' }}>{grp.label}</p>
            <div className="flex flex-wrap gap-2">
              {grp.values.map((v) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={pick[grp.key] === v}
                  onClick={() => setPick((p) => ({ ...p, [grp.key]: v }))}
                  className="sp-chip min-h-10 rounded-full px-3.5 text-sm font-semibold"
                  data-on={pick[grp.key] === v}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <pre className="mt-5 overflow-x-auto rounded-xl p-3 font-mono text-xs leading-relaxed sm:text-[13px]" style={{ background: 'var(--sp-navy)', color: '#CFE0FF' }}>
        {`admission_category = '${pick.admission_category}'\ncommunity          = '${pick.community}'\nform_submitted     = 1`}
      </pre>
    </div>
  );
}

function TranscriptPanel() {
  const [state, setState] = useState<'idle' | 'working' | 'done'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const run = () => {
    if (state === 'working') return;
    setState('working');
    timer.current = setTimeout(() => setState('done'), 1500);
  };
  return (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-center">
      <div className="sp-paper mx-auto w-full max-w-[15rem] rounded-md bg-white p-4" aria-label="Transcript preview" role="img">
        <p className="text-center font-mono text-xs font-bold uppercase leading-snug tracking-[0.1em]" style={{ color: 'var(--sp-blue-d)' }}>
          Puducherry Technological University
        </p>
        <div className="mx-auto mt-2 h-px w-3/4" style={{ background: 'var(--sp-gold)' }} />
        <p className="mt-3 text-center text-sm font-extrabold">Student Profile</p>
        <div className="mt-3 space-y-1.5">
          {[90, 70, 82, 55, 76].map((w, i) => (
            <div key={i} className="h-2 rounded-full" style={{ width: `${w}%`, background: 'var(--sp-tint)' }} />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-4 gap-1">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="h-3 rounded-sm" style={{ background: i < 4 ? 'var(--sp-blue)' : 'var(--sp-tint)', opacity: i < 4 ? 0.85 : 1 }} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-extrabold">Pixel-perfect PDF</h3>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--sp-mute)' }}>
          TCPDF letterhead scripted to match the printed original. A4 portrait, 15 mm margins, streamed as an attachment.
        </p>
        <p className="mt-3 break-all rounded-lg px-3 py-2 font-mono text-xs" style={{ background: 'var(--sp-tint)', color: 'var(--sp-blue-d)' }}>
          Profile_&lt;roll_number&gt;_&lt;timestamp&gt;.pdf
        </p>
        <button
          type="button"
          onClick={run}
          className="sp-cta relative mt-4 inline-flex min-h-11 w-full items-center justify-center overflow-hidden rounded-xl px-5 text-sm font-bold text-white sm:w-auto"
        >
          {state === 'working' && <span className="sp-fill absolute inset-0" aria-hidden="true" />}
          <span className="relative">{state === 'idle' ? 'Generate transcript' : state === 'working' ? 'Building PDF…' : 'Ready. Generate again'}</span>
        </button>
        <p className="mt-2 text-sm" style={{ color: 'var(--sp-mute)' }} aria-live="polite">
          {state === 'done' ? 'Demo only, no file is created. The real PDF earned a tester’s "this looks like the real thing."' : ' '}
        </p>
      </div>
    </div>
  );
}

function AppWindow() {
  const [view, setView] = useState<View>('marks');
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = TABS.findIndex((t) => t.id === view);
    if (e.key === 'ArrowRight') setView(TABS[(i + 1) % TABS.length].id);
    else if (e.key === 'ArrowLeft') setView(TABS[(i + TABS.length - 1) % TABS.length].id);
    else return;
    e.preventDefault();
    requestAnimationFrame(() => document.getElementById(`sp-tab-${TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length].id}`)?.focus());
  };
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-[0_24px_60px_-28px_rgba(20,50,120,0.45)]" style={{ borderColor: 'var(--sp-line)' }}>
      <div className="flex items-center gap-3 border-b px-3 py-2.5 sm:px-4" style={{ borderColor: 'var(--sp-line)', background: 'var(--sp-bg)' }}>
        <span className="flex gap-1.5" aria-hidden="true">
          {['#FF6B6B', '#F5C04A', '#4CC38A'].map((c) => <i key={c} className="block h-2.5 w-2.5 rounded-full" style={{ background: c }} />)}
        </span>
        <span className="min-w-0 flex-1 truncate rounded-full bg-white px-3 py-1 font-mono text-xs" style={{ color: 'var(--sp-mute)' }}>
          my-campus / {view}
        </span>
      </div>
      <div className="flex">
        <nav aria-label="Portal sections" className="hidden w-56 shrink-0 flex-col gap-1 border-r p-3 md:flex" style={{ borderColor: 'var(--sp-line)', background: 'var(--sp-bg)' }}>
          <p className="px-3 pb-2 pt-1 text-base font-extrabold" style={{ color: 'var(--sp-blue-d)' }}>My Campus</p>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setView(t.id)}
              aria-current={view === t.id ? 'page' : undefined}
              className="sp-nav flex min-h-11 items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold"
              data-on={view === t.id}
            >
              <Icon name={t.icon} className="h-[18px] w-[18px]" />
              {t.nav}
            </button>
          ))}
          <div className="mt-auto rounded-xl bg-white p-3 text-xs leading-relaxed" style={{ color: 'var(--sp-mute)' }}>
            <span className="font-bold" style={{ color: 'var(--sp-ink)' }}>OTP session</span><br />
            No password stored. Window closes after 15 minutes.
          </div>
        </nav>
        <div className="min-w-0 flex-1 p-2.5 sm:p-6">
          <div role="tablist" aria-label="Portal views" onKeyDown={onKey} className="flex gap-1 rounded-xl p-1" style={{ background: 'var(--sp-tint)' }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                id={`sp-tab-${t.id}`}
                type="button"
                role="tab"
                aria-selected={view === t.id}
                aria-controls="sp-panel"
                tabIndex={view === t.id ? 0 : -1}
                onClick={() => setView(t.id)}
                className="sp-tab min-h-11 flex-1 rounded-lg px-1 text-sm font-bold"
                data-on={view === t.id}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div id="sp-panel" role="tabpanel" aria-labelledby={`sp-tab-${view}`} key={view} className="sp-panel mt-5 px-1 pb-1 sm:px-0">
            {view === 'marks' && <MarksPanel />}
            {view === 'records' && <RecordsPanel />}
            {view === 'transcripts' && <TranscriptPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Page({ theme }: { theme: ProjectTheme }) {
  const [step, setStep] = useState(0);
  const quotes = theme.story.quotes;
  const gallery = theme.gallery ?? [];
  const marquee = ENUMS[0].values.concat(ENUMS[3].values);

  return (
    <main className="sp-root relative w-full" style={{ fontFamily: 'var(--font-manrope), ui-sans-serif, system-ui, sans-serif' }}>
      <style>{CSS}</style>

      {/* ---------------- HERO ---------------- */}
      <section className="relative px-4 pb-16 pt-24 sm:px-8 md:pt-36 lg:pb-20" aria-labelledby="sp-h1">
        <div className="sp-grid-bg pointer-events-none absolute inset-x-0 top-0 h-full" aria-hidden="true" />
        <div className="relative mx-auto grid min-h-[70svh] max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_1fr] lg:gap-16">
          <div>
            <p className="sp-rise inline-block rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold tracking-[0.08em]" style={{ background: 'var(--sp-tint)', color: 'var(--sp-blue-d)', animationDelay: '0ms' }}>
              {theme.kicker}
            </p>
            <h1 id="sp-h1" className="sp-rise mt-5 text-[3.4rem] font-extrabold leading-[0.95] tracking-tight sm:text-7xl lg:text-[6.2rem]" style={{ animationDelay: '90ms' }}>
              My <span className="sp-ink-blue">Campus</span>
            </h1>
            <p className="sp-rise mt-5 max-w-xl text-xl font-semibold leading-snug sm:text-2xl" style={{ animationDelay: '180ms' }}>
              {theme.subtitle}
            </p>
            <p className="sp-rise mt-4 max-w-xl text-base leading-relaxed" style={{ color: 'var(--sp-mute)', animationDelay: '260ms' }}>
              The student half of a paired portal for Puducherry Technological University. Roll number in, OTP by email, and one calm window onto everything they used to chase across notice-boards.
            </p>
            <div className="sp-rise mt-7 flex flex-wrap gap-3" style={{ animationDelay: '340ms' }}>
              <a href="#sp-app" className="sp-cta inline-flex min-h-12 items-center rounded-xl px-6 text-sm font-bold text-white">Open the portal</a>
              <a href="#sp-story" className="sp-ghost inline-flex min-h-12 items-center rounded-xl border px-6 text-sm font-bold">Read the story</a>
            </div>
          </div>

          <div className="sp-rise relative mb-10 sm:mb-8" style={{ animationDelay: '200ms' }}>
            <div className="overflow-hidden rounded-2xl border bg-white shadow-[0_30px_70px_-30px_rgba(20,50,120,0.55)]" style={{ borderColor: 'var(--sp-line)' }}>
              <div className="flex items-center gap-3 border-b px-3 py-2.5" style={{ borderColor: 'var(--sp-line)', background: 'var(--sp-bg)' }}>
                <span className="flex gap-1.5" aria-hidden="true">
                  {['#FF6B6B', '#F5C04A', '#4CC38A'].map((c) => <i key={c} className="block h-2.5 w-2.5 rounded-full" style={{ background: c }} />)}
                </span>
                <span className="min-w-0 flex-1 truncate rounded-full bg-white px-3 py-1 font-mono text-xs" style={{ color: 'var(--sp-mute)' }}>my-campus / sign-in</span>
              </div>
              <div className="relative aspect-[4/3] w-full">
                <Image src={theme.heroImage} alt="A tiered university lecture hall, students facing a projector screen" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(14,34,67,0) 45%, rgba(14,34,67,0.55) 100%)' }} aria-hidden="true" />
              </div>
            </div>

            <div className="sp-float absolute -bottom-7 left-3 w-[15.5rem] rounded-2xl border bg-white p-3.5 shadow-[0_18px_40px_-18px_rgba(20,50,120,0.6)] sm:-left-4 sm:w-64 lg:-left-8" style={{ borderColor: 'var(--sp-line)' }}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-extrabold">One-time code</p>
                <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90" aria-label="15 minute window" role="img">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="var(--sp-tint)" strokeWidth="4" />
                  <circle className="sp-ring" cx="18" cy="18" r="14" fill="none" stroke="var(--sp-blue)" strokeWidth="4" strokeLinecap="round" pathLength={100} />
                </svg>
              </div>
              <div className="mt-2 flex gap-1.5" aria-hidden="true">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="sp-digit flex h-9 flex-1 items-center justify-center rounded-lg text-lg font-extrabold" style={{ background: 'var(--sp-tint)', color: 'var(--sp-blue-d)', animationDelay: `${i * 260}ms` }}>•</span>
                ))}
              </div>
              <p className="mt-2 text-xs" style={{ color: 'var(--sp-mute)' }}>Sent to ••••••@ptuniv.edu.in</p>
            </div>

            <div className="sp-float2 absolute -right-1 top-14 hidden w-40 rounded-2xl border bg-white p-3.5 shadow-[0_18px_40px_-18px_rgba(20,50,120,0.6)] sm:block md:-right-4 lg:-right-6" style={{ borderColor: 'var(--sp-line)' }}>
              <p className="text-xs font-bold" style={{ color: 'var(--sp-mute)' }}>GPA, 8 semesters</p>
              <svg viewBox="0 0 120 44" className="mt-1 h-11 w-full" aria-hidden="true">
                <polyline className="sp-draw" points="4,34 22,30 40,36 58,22 76,16 94,12 112,8" fill="none" stroke="var(--sp-blue)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength={100} />
                <circle cx="112" cy="8" r="4" fill="var(--sp-gold)" />
              </svg>
              <p className="text-xs font-bold" style={{ color: 'var(--sp-blue-d)' }}>Scale 0 to 10</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="px-4 sm:px-8" aria-label="Key numbers">
        <Reveal className="mx-auto grid max-w-7xl grid-cols-2 overflow-hidden rounded-2xl border border-[#D3DFF4] bg-white lg:grid-cols-4">
          {theme.bigNumbers.map((b, i) => (
            <div key={b.label} className={`px-5 py-6 sm:px-8 sm:py-8 ${i % 2 === 1 ? 'border-l' : ''} ${i > 1 ? 'border-t lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`} style={{ borderColor: 'var(--sp-line)' }}>
              <p className="text-5xl font-extrabold leading-none tracking-tight sm:text-6xl" style={{ color: i === 3 ? 'var(--sp-gold-d)' : 'var(--sp-blue)' }}>
                <Counter to={parseInt(b.value, 10)} />
              </p>
              <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--sp-mute)' }}>{b.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ---------------- MARQUEE ---------------- */}
      <div className="mt-14 border-y py-3" style={{ borderColor: 'var(--sp-line)' }} aria-hidden="true">
        <div className="sp-marquee flex w-max gap-3">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 gap-3">
              {marquee.map((m) => (
                <span key={`${k}-${m}`} className="rounded-full border bg-white px-4 py-1.5 font-mono text-xs font-semibold" style={{ borderColor: 'var(--sp-line)', color: 'var(--sp-blue-d)' }}>{m}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- APP WINDOW ---------------- */}
      <section id="sp-app" className="scroll-mt-24 px-3 py-20 sm:px-8 md:py-28" aria-labelledby="sp-h-app">
        <div className="mx-auto max-w-7xl">
          <div className="px-1 sm:px-0">
            <SectionHead id="sp-h-app" kicker="Try the window" title="Marks, records, transcripts. Click through." lead="A faux portal built from the real screens. All values below are sample data, nothing here touches a student record." />
          </div>
          <Reveal><AppWindow /></Reveal>
        </div>
      </section>

      {/* ---------------- STORY ---------------- */}
      <section id="sp-story" className="scroll-mt-24 px-4 py-16 sm:px-8 md:py-24" style={{ background: 'var(--sp-tint)' }} aria-labelledby="sp-h-story">
        <div className="mx-auto max-w-7xl">
          <SectionHead id="sp-h-story" kicker="The story" title="Built the week a form got lost for the third time." lead="She had filled the same paper booklet at admission, again when she changed sections, and once more because the photocopy in the HOD's drawer had faded." />
          <div className="grid gap-5 lg:grid-cols-3">
            {quotes.map((q, i) => {
              const dark = i === 1;
              return (
                <Reveal key={q.kicker} delay={i * 0.08}>
                  <figure className="sp-card flex h-full flex-col rounded-2xl border p-6 sm:p-7" style={{ background: dark ? 'var(--sp-navy)' : '#fff', color: dark ? '#fff' : 'var(--sp-ink)', borderColor: dark ? 'var(--sp-navy)' : 'var(--sp-line)' }}>
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: dark ? '#8FB4FF' : 'var(--sp-blue)' }}>{q.kicker}</p>
                    <span className="mt-3 block text-6xl font-extrabold leading-none" style={{ color: 'var(--sp-gold)' }} aria-hidden="true">&ldquo;</span>
                    <blockquote className="-mt-2 text-xl font-bold leading-snug">{q.quote}</blockquote>
                    <figcaption className="mt-auto pt-5 text-sm leading-relaxed" style={{ color: dark ? '#C3D3F2' : 'var(--sp-mute)' }}>{q.context}</figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- FEATURES ---------------- */}
      <section className="px-4 py-20 sm:px-8 md:py-28" aria-labelledby="sp-h-feat">
        <div className="mx-auto max-w-7xl">
          <SectionHead id="sp-h-feat" kicker="What it does" title="Six things, no chat, no streaks." lead="A portal should feel like a window. You look through it, you do not live inside it." />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {theme.features.map((f, i) => (
              <li key={f.title}>
                <Reveal delay={(i % 3) * 0.07} className="h-full">
                  <article className="sp-card group h-full rounded-2xl border bg-white p-6" style={{ borderColor: 'var(--sp-line)' }}>
                    <div className="flex items-center justify-between">
                      <span className="sp-ico flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'var(--sp-tint)', color: 'var(--sp-blue)' }}>
                        <Icon name={FEATURE_ICONS[i % FEATURE_ICONS.length]} />
                      </span>
                      <span className="font-mono text-xs font-semibold" style={{ color: 'var(--sp-mute)' }}>{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="mt-5 text-lg font-extrabold">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed sm:text-[15px]" style={{ color: 'var(--sp-mute)' }}>{f.desc}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- ARCHITECTURE ---------------- */}
      <section className="px-4 py-16 sm:px-8 md:py-24" style={{ background: 'var(--sp-tint)' }} aria-labelledby="sp-h-arch">
        <div className="mx-auto max-w-7xl">
          <SectionHead id="sp-h-arch" kicker="Under the window" title="Sign-in flow and the four layers." lead="Pick a step to see what the server does. Boring tools, chosen because they run on every shared-hosting plan a college actually buys." />
          <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
            <Reveal>
              <div className="h-full rounded-2xl border bg-white p-5 sm:p-7" style={{ borderColor: 'var(--sp-line)' }}>
                <h3 className="text-lg font-extrabold">OTP-only authentication</h3>
                <div role="group" aria-label="Sign-in steps" className="relative mt-6 flex justify-between">
                  <span className="absolute left-5 right-5 top-5 h-1 -translate-y-1/2 rounded" style={{ background: 'var(--sp-tint)' }} aria-hidden="true" />
                  <span className="sp-prog absolute left-5 right-5 top-5 h-1 -translate-y-1/2 rounded" style={{ background: 'var(--sp-blue)', transform: `translateY(-50%) scaleX(${step / (STEPS.length - 1)})` }} aria-hidden="true" />
                  {STEPS.map((s, i) => (
                    <button
                      key={s.t}
                      type="button"
                      onClick={() => setStep(i)}
                      aria-pressed={step === i}
                      aria-label={`Step ${i + 1}: ${s.t}`}
                      className="sp-step relative flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-extrabold"
                      data-on={i <= step}
                      data-cur={step === i}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <div key={step} className="sp-panel mt-6 rounded-xl p-5" style={{ background: 'var(--sp-bg)' }} aria-live="polite">
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--sp-blue)' }}>Step {step + 1} of {STEPS.length}</p>
                  <p className="mt-1 text-xl font-extrabold">{STEPS[step].t}</p>
                  <p className="mt-2 text-[15px] leading-relaxed" style={{ color: 'var(--sp-mute)' }}>{STEPS[step].d}</p>
                </div>
              </div>
            </Reveal>

            <ol className="relative space-y-3">
              {theme.architecture.map((a, i) => (
                <li key={a.layer}>
                  <Reveal delay={i * 0.08}>
                    <div className="sp-card flex gap-4 rounded-2xl border bg-white p-5" style={{ borderColor: 'var(--sp-line)' }}>
                      <div className="flex flex-col items-center">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold text-white" style={{ background: i % 2 ? 'var(--sp-blue-d)' : 'var(--sp-blue)' }}>{i + 1}</span>
                        {i < theme.architecture.length - 1 && (
                          <svg viewBox="0 0 4 40" className="mt-1 h-10 w-1" aria-hidden="true" preserveAspectRatio="none">
                            <line className="sp-draw-v" x1="2" y1="0" x2="2" y2="40" stroke="var(--sp-gold)" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 7" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-extrabold">{a.layer}</h3>
                        <p className="mt-1 text-sm leading-relaxed sm:text-[15px]" style={{ color: 'var(--sp-mute)' }}>{a.details}</p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------- GALLERY ---------------- */}
      {gallery.length > 0 && (
        <section className="px-4 py-20 sm:px-8 md:py-28" aria-labelledby="sp-h-gal">
          <div className="mx-auto max-w-7xl">
            <SectionHead id="sp-h-gal" kicker="Around campus" title="The places this portal replaces." lead="Lecture halls, desks, notice-boards. Every screen above stands in for one of these." />
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {gallery.map((g, i) => (
                <li key={g.src} className={i === 0 ? 'col-span-2 md:row-span-2' : i === gallery.length - 1 && gallery.length % 2 === 0 ? 'col-span-2 md:col-span-1' : ''}>
                  <Reveal delay={(i % 3) * 0.06} className="h-full">
                    <figure className="sp-card sp-shot group relative h-full overflow-hidden rounded-2xl border bg-white" style={{ borderColor: 'var(--sp-line)' }}>
                      <div className={`relative w-full ${i === 0 ? 'aspect-[16/10] md:aspect-auto md:h-full md:min-h-[26rem]' : 'aspect-[4/3]'} ${i === gallery.length - 1 ? 'max-md:aspect-[16/9]' : ''}`} style={{ background: 'var(--sp-tint)' }}>
                        <Image
                          src={g.src}
                          alt={`Campus photograph: ${g.caption.replace(/\s*·\s*/g, ' ').toLowerCase()}`}
                          fill
                          sizes={i === 0 ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 50vw'}
                          className="object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: 'linear-gradient(180deg, rgba(14,34,67,0), rgba(14,34,67,0.78))' }} aria-hidden="true" />
                        <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-2 px-3 pb-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-white sm:px-4 sm:pb-3 sm:text-xs">
                          <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--sp-gold)' }} aria-hidden="true" />
                          <span className="min-w-0 truncate">{g.caption}</span>
                        </figcaption>
                      </div>
                    </figure>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------------- OUTCOME + NEXT ---------------- */}
      <div style={{ background: 'var(--sp-navy)', color: '#fff' }}>
        <section className="px-4 pb-6 pt-20 sm:px-8 md:pt-28" aria-labelledby="sp-h-out">
          <div className="mx-auto max-w-5xl text-center">
            <Reveal>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: '#8FB4FF' }}>Outcome</p>
              <h2 id="sp-h-out" className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">{theme.outcomeQuote}</h2>
              <div className="mt-10 flex flex-col items-center justify-center gap-2 font-mono text-sm font-semibold sm:flex-row sm:gap-3" aria-hidden="true">
                <span className="rounded-full border px-4 py-2" style={{ borderColor: '#3E5C98' }}>roll number</span>
                <span className="sp-nudge rotate-90 sm:rotate-0" style={{ color: 'var(--sp-gold)' }}>→</span>
                <span className="rounded-full border px-4 py-2" style={{ borderColor: '#3E5C98' }}>OTP</span>
                <span className="sp-nudge rotate-90 sm:rotate-0" style={{ color: 'var(--sp-gold)', animationDelay: '300ms' }}>→</span>
                <span className="rounded-full px-4 py-2" style={{ background: 'var(--sp-gold)', color: '#1A1203' }}>transcript.pdf</span>
              </div>
            </Reveal>
          </div>
        </section>
        <NextChapter currentSlug={theme.slug} accent="#8FB4FF" />
      </div>
      <SiteFooter />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Scoped CSS                                                          */
/* ------------------------------------------------------------------ */

const CSS = `
.sp-root{
  --sp-bg:#F2F6FD; --sp-tint:#E4EDFC; --sp-line:#D3DFF4; --sp-ink:#0E2243; --sp-mute:#44577A;
  --sp-blue:#2358D8; --sp-blue-d:#173FA6; --sp-navy:#0B1B3A; --sp-gold:#C9962B; --sp-gold-d:#7A560A;
  background:var(--sp-bg); color:var(--sp-ink); min-height:100svh;
}
.sp-root button{cursor:pointer;font-family:inherit}
.sp-root a:focus-visible,.sp-root button:focus-visible{outline:3px solid var(--sp-blue);outline-offset:2px}
.sp-root [style*="--sp-navy"] a:focus-visible,.sp-root [style*="--sp-navy"] button:focus-visible{outline-color:#fff}
.sp-grid-bg{background-image:linear-gradient(var(--sp-line) 1px,transparent 1px),linear-gradient(90deg,var(--sp-line) 1px,transparent 1px);background-size:44px 44px;opacity:.45;
  -webkit-mask-image:linear-gradient(180deg,#000 0%,transparent 85%);mask-image:linear-gradient(180deg,#000 0%,transparent 85%)}
.sp-ink-blue{color:var(--sp-blue)}
.sp-cta{background:var(--sp-blue);transition:transform .2s,background .2s,box-shadow .2s;box-shadow:0 10px 24px -12px rgba(35,88,216,.8)}
.sp-cta:hover{background:var(--sp-blue-d);transform:translateY(-2px)}
.sp-ghost{border-color:var(--sp-line);background:#fff;color:var(--sp-blue-d);transition:transform .2s,border-color .2s}
.sp-ghost:hover{border-color:var(--sp-blue);transform:translateY(-2px)}
.sp-card{transition:transform .25s,box-shadow .25s,border-color .25s}
.sp-card:hover{transform:translateY(-4px);box-shadow:0 18px 36px -22px rgba(20,50,120,.5)}
.sp-ico{transition:transform .25s,background .25s,color .25s}
.sp-card:hover .sp-ico{transform:rotate(-6deg) scale(1.06);background:var(--sp-blue)!important;color:#fff!important}
.sp-tab{color:var(--sp-mute);background:transparent;transition:background .2s,color .2s}
.sp-tab[data-on=true]{background:#fff;color:var(--sp-blue-d);box-shadow:0 2px 8px -3px rgba(20,50,120,.35)}
.sp-nav{color:var(--sp-mute);transition:background .2s,color .2s;position:relative}
.sp-nav:hover{background:#fff}
.sp-nav[data-on=true]{background:#fff;color:var(--sp-blue-d);box-shadow:inset 3px 0 0 var(--sp-blue)}
.sp-chip{border:1.5px solid var(--sp-line);background:#fff;color:var(--sp-ink);transition:transform .15s,background .2s,color .2s,border-color .2s}
.sp-chip:hover{border-color:var(--sp-blue)}
.sp-chip[data-on=true]{background:var(--sp-blue);border-color:var(--sp-blue);color:#fff;transform:translateY(-1px)}
.sp-col{background:transparent;border:0;transition:background .2s}
.sp-col:hover,.sp-col[data-on=true]{background:var(--sp-tint)}
.sp-bar{background:linear-gradient(180deg,#3B73F0,var(--sp-blue-d));transform-origin:bottom;animation:sp-grow .7s cubic-bezier(.22,.61,.36,1) both}
.sp-col[data-on=true] .sp-bar{background:linear-gradient(180deg,#E0B65A,var(--sp-gold));color:#2A1D03}
.sp-paper{box-shadow:0 14px 30px -16px rgba(20,50,120,.55),0 0 0 1px var(--sp-line)}
.sp-fill{background:var(--sp-blue-d);transform-origin:left;animation:sp-fillx 1.5s linear both}
.sp-panel{animation:sp-panel .38s cubic-bezier(.22,.61,.36,1) both}
.sp-prog{transform-origin:left;transition:transform .45s cubic-bezier(.22,.61,.36,1)}
.sp-step{background:#fff;border-color:var(--sp-line);color:var(--sp-mute);transition:background .25s,border-color .25s,color .25s,transform .2s}
.sp-step[data-on=true]{background:var(--sp-blue);border-color:var(--sp-blue);color:#fff}
.sp-step[data-cur=true]{transform:scale(1.14);box-shadow:0 0 0 5px rgba(35,88,216,.2)}
.sp-ring{stroke-dasharray:100;animation:sp-ring 9s linear infinite}
.sp-draw{stroke-dasharray:100;stroke-dashoffset:100;animation:sp-draw 1.6s .6s ease forwards}
.sp-draw-v{animation:sp-dash 1.2s linear infinite}
.sp-digit{animation:sp-digit 2.6s ease infinite}
.sp-float{animation:sp-float 6s ease-in-out infinite}
.sp-float2{animation:sp-float 7s ease-in-out -2s infinite}
.sp-rise{animation:sp-rise .7s cubic-bezier(.22,.61,.36,1) both}
.sp-marquee{animation:sp-marq 38s linear infinite}
.sp-nudge{display:inline-block;animation:sp-nudge 1.6s ease-in-out infinite}
@keyframes sp-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes sp-fillx{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes sp-panel{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes sp-ring{from{stroke-dashoffset:0}to{stroke-dashoffset:100}}
@keyframes sp-draw{to{stroke-dashoffset:0}}
@keyframes sp-dash{to{stroke-dashoffset:-8}}
@keyframes sp-digit{0%,15%{opacity:.25;transform:scale(.92)}35%,100%{opacity:1;transform:scale(1)}}
@keyframes sp-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes sp-rise{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes sp-marq{to{transform:translateX(-50%)}}
@keyframes sp-nudge{0%,100%{transform:translateX(0)}50%{transform:translateX(6px)}}
@media (prefers-reduced-motion: reduce){
  .sp-ring,.sp-digit,.sp-float,.sp-float2,.sp-marquee,.sp-nudge,.sp-draw-v,.sp-fill{animation:none!important}
  .sp-rise,.sp-panel,.sp-bar{animation:none!important;opacity:1;transform:none}
  .sp-draw{animation:none!important;stroke-dashoffset:0}
  .sp-card,.sp-cta,.sp-ghost,.sp-prog,.sp-chip{transition:none}
}
`;
