'use client';

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import Image from 'next/image';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

const SP = "var(--font-space), 'Space Grotesk', system-ui, sans-serif";

const STAGES: { name: string; note: string }[] = [
  { name: 'Open', note: 'The job is born. From here on, only the API is allowed to change its status.' },
  { name: 'Assigned', note: 'A crew is put on the job. The customer’s tracker now reads “With the crew”.' },
  { name: 'Survey', note: 'Survey photos go to the company’s own Google Drive and come back only through the API.' },
  { name: 'Quoted', note: 'The quote is sent. It appears in the customer’s tasks as “Quote sent”.' },
  { name: 'Accepted', note: 'The customer accepts the quote from their phone. No paper, no phone tag.' },
  { name: 'In progress', note: 'The crew punch in at the site. An office geofence and late flags keep attendance honest.' },
  { name: 'Work done', note: 'Work photos, materials and invoices are logged against the job.' },
  { name: 'Satisfied', note: 'The customer signs the work off with one question: “Satisfied?”' },
  { name: 'Submitted for pay', note: 'Money rules live on the server. Firestore rules refuse direct writes to money and status.' },
  { name: 'Completed', note: 'Finished and closed. Invoices and warranty stay in one place for the customer.' },
];

type Role = { key: string; label: string; target: string; src: string; alt: string; head: string; points: string[]; cap: string };
const ROLES: Role[] = [
  {
    key: 'office', label: 'Office', target: 'Web console', src: '/work/src-task/gallery-2.jpg',
    alt: 'Sign-in screen: mobile number plus password, with a note that the office adds every number',
    head: 'The office creates every account.',
    points: ['Nobody self-registers. People sign in with a mobile number and a password the office gave them.', 'A live workers map, late flags, leave requests and attendance reports.', 'Photos stay in the company’s own Google Drive, shown only to people allowed to see the job.'],
    cap: 'One sign-in, three roles',
  },
  {
    key: 'crew', label: 'Crew', target: 'Android app', src: '/work/src-task/gallery-4.jpg',
    alt: 'Crew attendance screen with a green Punched in button, a late flag and a 30 day summary',
    head: 'Punch in at the site.',
    points: ['An office geofence decides whether you are at the site, and late arrivals are flagged.', 'Survey photos, materials and invoices attach to the job.', 'Leave requests and a 30-day attendance summary live in the same app.'],
    cap: 'Attendance and punch-in',
  },
  {
    key: 'customer', label: 'Customer', target: 'iPhone-friendly web app', src: '/work/src-task/gallery-3.jpg',
    alt: 'Customer My tasks screen with job counts and a booking timeline from Booked to Quote accepted',
    head: 'Follow the job, sign it off.',
    points: ['Accept the quote and follow the crew as the job moves along.', 'Sign off the work with “Satisfied?” when it is done.', 'Invoices, quotes and warranty for finished jobs are kept in one place.'],
    cap: 'My tasks and the job timeline',
  },
];

const CSS = `
.srct-root{--bg:#0B1620;--mid:#122533;--tx:#EAF3F8;--dim:#8FB0C4;--blue:#2BB5E8;--amber:#F2B84B;--paper:#F3F6F9;--ink:#0B1620;--ink2:#41596B;--royal:#1D5FC0;--line:rgba(143,176,196,.22);
 background:var(--bg);color:var(--tx);font-family:${SP};overflow-x:clip}
.srct-root *{box-sizing:border-box}
.srct-grid{background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:44px 44px;background-position:-1px -1px}
.srct-tape{height:12px;background:repeating-linear-gradient(-45deg,var(--amber) 0 14px,var(--ink) 14px 28px)}
.srct-barcode{height:34px;background:repeating-linear-gradient(90deg,var(--ink) 0 2px,transparent 2px 5px,var(--ink) 5px 6px,transparent 6px 9px,var(--ink) 9px 12px,transparent 12px 14px,var(--ink) 14px 15px,transparent 15px 19px)}
.srct-rv{opacity:0;transform:translateY(18px);transition:opacity .6s ease var(--d,0s),transform .6s ease var(--d,0s)}
.srct-rv.srct-in{opacity:1;transform:none}
.srct-swap{animation:srct-swap .45s ease both}
.srct-stamp{animation:srct-stamp .5s cubic-bezier(.2,1.4,.4,1) both}
.srct-pulse{animation:srct-pulse 1.8s ease-in-out infinite}
.srct-tick{animation:srct-tick 15s linear infinite}
.srct-float{animation:srct-float 6s ease-in-out infinite}
.srct-march{animation:srct-march 38s linear infinite;width:max-content}
.srct-fill{transition:transform .5s ease}
.srct-line{transform:scaleY(0);transform-origin:top;transition:transform 1.3s ease .2s}
.srct-in .srct-line{transform:none}
.srct-check path{stroke-dasharray:26;stroke-dashoffset:26;transition:stroke-dashoffset .55s ease calc(var(--d,0s) + .3s)}
.srct-in .srct-check path{stroke-dashoffset:0}
.srct-shot{-webkit-mask-image:linear-gradient(to right,transparent,#000 18%,#000 82%,transparent),linear-gradient(to bottom,#000 70%,transparent);-webkit-mask-composite:source-in;mask-image:linear-gradient(to right,transparent,#000 18%,#000 82%,transparent),linear-gradient(to bottom,#000 70%,transparent);mask-composite:intersect}
.srct-outstamp{transform:rotate(-6deg);opacity:0}
.srct-in .srct-outstamp{animation:srct-ostamp .5s cubic-bezier(.2,1.4,.4,1) .5s both}
.srct-btn{transition:transform .2s ease,background-color .2s ease,border-color .2s ease}
.srct-btn:hover{transform:translateY(-2px)}
.srct-btn:active{transform:translateY(0)}
.srct-card{transition:transform .25s ease,border-color .25s ease}
.srct-card:hover{transform:translateY(-4px);border-color:var(--amber)}
.srct-root :focus-visible{outline:3px solid var(--amber);outline-offset:3px;border-radius:6px}
@keyframes srct-swap{from{opacity:0;transform:translateY(10px)}}
@keyframes srct-stamp{from{opacity:0;transform:scale(1.7) rotate(-16deg)}}
@keyframes srct-ostamp{from{opacity:0;transform:rotate(-16deg) scale(1.7)}to{opacity:1;transform:rotate(-6deg)}}
@keyframes srct-pulse{50%{transform:scale(1.7);opacity:.25}}
@keyframes srct-tick{to{transform:rotate(360deg)}}
@keyframes srct-float{50%{transform:translateY(-10px)}}
@keyframes srct-march{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){
 .srct-root *{animation:none!important;transition:none!important}
 .srct-rv{opacity:1;transform:none}
 .srct-outstamp{opacity:1}
 .srct-line{transform:none}
 .srct-check path{stroke-dashoffset:0}
}`;

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} style={{ '--d': `${delay}s` } as CSSProperties} className={`srct-rv ${on ? 'srct-in' : ''} ${className}`}>{children}</div>;
}

function Count({ value }: { value: string }) {
  const m = value.match(/^(\d[\d,]*)(.*)$/);
  const target = m ? parseInt(m[1].replace(/,/g, ''), 10) : 0;
  const [v, setV] = useState(m ? 0 : -1);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!m || !el) return;
    if (reduced() || typeof IntersectionObserver === 'undefined') { setV(target); return; }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1300);
        setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return <span ref={ref}>{v < 0 ? value : `${v.toLocaleString('en-US')}${m ? m[2] : ''}`}</span>;
}

/** Crops the phone out of a 1600x1000 deck slide and fades it into the page. */
function Shot({ src, alt, sizes = '1200px' }: { src: string; alt: string; sizes?: string }) {
  return (
    <div className="srct-shot relative w-full overflow-hidden" style={{ aspectRatio: '530 / 786' }}>
      <div className="absolute" style={{ width: '301.89%', left: '-188.68%', top: '-5.09%', aspectRatio: '16 / 10' }}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}

function Check({ className = '' }: { className?: string }) {
  return (
    <svg className={`srct-check ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

function Kicker({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'amber' }) {
  return <p className="font-mono text-[12px] uppercase tracking-[0.22em]" style={{ color: tone === 'blue' ? 'var(--blue)' : 'var(--amber)' }}>{children}</p>;
}

function Head({ n, label, title, sub }: { n: string; label: string; title: string; sub?: string }) {
  return (
    <Reveal className="mb-10 max-w-3xl md:mb-14">
      <Kicker>{`§ ${n} · ${label}`}</Kicker>
      <h2 className="mt-3 text-[2rem] font-bold leading-[1.05] tracking-tight sm:text-5xl" style={{ fontFamily: SP }}>{title}</h2>
      {sub && <p className="mt-4 text-base leading-relaxed md:text-lg" style={{ color: 'var(--dim)' }}>{sub}</p>}
    </Reveal>
  );
}

/* ---------------- HERO ---------------- */
function HeroTicket() {
  const [i, setI] = useState(3);
  useEffect(() => {
    if (reduced()) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % STAGES.length), 1700);
    return () => window.clearInterval(id);
  }, []);
  const done = i === STAGES.length - 1;
  return (
    <div className="relative flex-1 overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,.45)]" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <div className="flex items-center justify-between px-5 py-3 text-white" style={{ background: 'var(--royal)' }}>
        <span className="font-mono text-[12px] font-bold uppercase tracking-[0.2em]">Job card</span>
        <span className="flex items-center gap-2 font-mono text-[12px] tracking-widest">
          <span className="relative inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'var(--amber)' }}>
            <span className="srct-pulse absolute inset-0 rounded-full" style={{ background: 'var(--amber)' }} />
          </span>
          LIVE
        </span>
      </div>
      <div className="px-5 pb-5 pt-5 sm:px-6">
        <div className="flex items-baseline justify-between font-mono text-[12px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink2)' }}>
          <span>Status</span>
          <span>Stage {String(i + 1).padStart(2, '0')} / 10</span>
        </div>
        <div key={i} className="srct-swap mt-2 min-h-[3.5rem] text-[2rem] font-bold leading-tight tracking-tight sm:text-4xl" style={{ fontFamily: SP }}>
          {STAGES[i].name}
        </div>
        <div className="mt-4 grid grid-cols-10 gap-1" aria-hidden="true">
          {STAGES.map((_, k) => (
            <span key={k} className="h-2 rounded-full transition-colors duration-300" style={{ background: k <= i ? (done ? '#16845F' : 'var(--royal)') : '#CBD6DF' }} />
          ))}
        </div>
        <p className="mt-4 text-[13px] leading-snug" style={{ color: 'var(--ink2)' }}>Open, assigned, survey, quoted, accepted, in progress, work done, satisfied, submitted for pay, completed.</p>
      </div>
      <div className="relative">
        <div className="mx-5 border-t-2 border-dashed" style={{ borderColor: '#B7C4CF' }} />
        <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full" style={{ background: 'var(--bg)' }} />
        <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full" style={{ background: 'var(--bg)' }} />
      </div>
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <div className="srct-barcode w-28 sm:w-36" aria-hidden="true" />
        <span className="font-mono text-[12px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink2)' }}>Office {'·'} Crew {'·'} Customer</span>
      </div>
    </div>
  );
}

function Hero({ theme }: { theme: ProjectTheme }) {
  const [first, ...rest] = theme.title.split(' ');
  const shot = ROLES[2];
  return (
    <section className="srct-grid relative px-5 pb-16 pt-24 md:px-10 md:pb-24 md:pt-36">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
        <div>
          <Kicker tone="amber">{theme.kicker}</Kicker>
          <h1 className="mt-5 font-bold leading-[.9] tracking-[-0.045em]" style={{ fontFamily: SP, fontSize: 'clamp(4.25rem, 16vw, 9.5rem)' }}>
            <span className="block">{first}</span>
            <span className="block" style={{ color: 'var(--blue)' }}>{rest.join(' ')}<span style={{ color: 'var(--amber)' }}>.</span></span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed md:text-xl" style={{ color: 'var(--dim)' }}>{theme.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#pipeline" className="srct-btn inline-flex min-h-[48px] items-center rounded-full px-6 text-[15px] font-bold" style={{ background: 'var(--amber)', color: 'var(--ink)' }}>Advance a job</a>
            <a href="#roles" className="srct-btn inline-flex min-h-[48px] items-center rounded-full border px-6 text-[15px] font-semibold" style={{ borderColor: 'var(--dim)', color: 'var(--tx)' }}>Meet the three roles</a>
          </div>
        </div>
        <div className="relative flex items-end gap-5 md:gap-8">
          <HeroTicket />
          <div className="srct-float hidden w-[40%] max-w-[300px] shrink-0 md:block" aria-hidden="false">
            <Shot src={shot.src} alt={shot.alt} sizes="900px" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- PIPELINE ---------------- */
function Pipeline() {
  const [i, setI] = useState(0);
  const touched = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === 'undefined' || reduced()) return;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let n = 0;
      timer = window.setInterval(() => {
        if (touched.current) { window.clearInterval(timer); return; }
        n += 1; setI(n);
        if (n >= STAGES.length - 1) window.clearInterval(timer);
      }, 1100);
    }, { threshold: 0.7 });
    io.observe(el);
    return () => { io.disconnect(); window.clearInterval(timer); };
  }, []);
  const go = (n: number) => { touched.current = true; setI(Math.max(0, Math.min(STAGES.length - 1, n))); };
  const last = i === STAGES.length - 1;
  const p = i / (STAGES.length - 1);
  return (
    <section id="pipeline" className="px-5 py-20 md:px-10 md:py-28" style={{ background: 'var(--mid)' }}>
      <div className="mx-auto max-w-6xl">
        <Head n="01" label="The pipeline" title="Ten stages, open to completed." sub="Press advance, tap a stage, or just keep scrolling. This is the lifecycle every job travels, and the server enforces each step." />
        <div ref={cardRef} className="grid overflow-hidden rounded-2xl md:grid-cols-[auto_1fr]" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
          <div className="flex items-center gap-4 px-6 py-4 font-mono text-white md:flex-col md:justify-center md:px-10" style={{ background: 'var(--royal)' }}>
            <span className="text-[12px] uppercase tracking-[0.2em]">Stage</span>
            <span key={i} className="srct-swap text-6xl font-bold leading-none md:text-8xl" style={{ fontFamily: SP }}>{String(i + 1).padStart(2, '0')}</span>
            <span className="text-[12px] tracking-widest opacity-90">of 10</span>
          </div>
          <div className="relative p-6 md:p-10">
            <div key={i} className="srct-swap min-h-[8.5rem] md:min-h-[9.5rem]" aria-live="polite">
              <h3 className={`text-3xl font-bold leading-tight tracking-tight md:text-5xl ${last ? 'pr-32 md:pr-0' : ''}`} style={{ fontFamily: SP }}>{STAGES[i].name}</h3>
              <p className="mt-3 max-w-xl text-base leading-relaxed md:text-lg" style={{ color: 'var(--ink2)' }}>{STAGES[i].note}</p>
            </div>
            {last && (
              <span className="srct-stamp absolute right-5 top-5 rotate-[-8deg] rounded-md border-[3px] px-3 py-1 font-mono text-sm font-bold uppercase tracking-[0.2em] md:right-10 md:top-8 md:text-base" style={{ color: '#16845F', borderColor: '#16845F' }}>Completed</span>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => go(i - 1)} disabled={i === 0} className="srct-btn min-h-[48px] rounded-full border-2 px-6 text-[15px] font-semibold disabled:opacity-40" style={{ borderColor: 'var(--ink)' }}>Back</button>
              <button type="button" onClick={() => go(last ? 0 : i + 1)} className="srct-btn min-h-[48px] rounded-full px-7 text-[15px] font-bold" style={{ background: 'var(--amber)', color: 'var(--ink)' }}>{last ? 'Restart job' : 'Advance stage'}</button>
            </div>
          </div>
        </div>

        <ol className="relative mt-8 flex flex-col gap-1 md:mt-10 md:flex-row md:gap-0">
          <span className="absolute bottom-6 left-5 top-6 w-[2px] md:hidden" style={{ background: 'var(--line)' }} aria-hidden="true" />
          <span className="srct-fill absolute bottom-6 left-5 top-6 w-[2px] origin-top md:hidden" style={{ background: 'var(--amber)', transform: `scaleY(${p})` }} aria-hidden="true" />
          <span className="absolute left-[5%] right-[5%] top-5 hidden h-[2px] md:block" style={{ background: 'var(--line)' }} aria-hidden="true" />
          <span className="srct-fill absolute left-[5%] right-[5%] top-5 hidden h-[2px] origin-left md:block" style={{ background: 'var(--amber)', transform: `scaleX(${p})` }} aria-hidden="true" />
          {STAGES.map((s, k) => {
            const state = k < i ? 'done' : k === i ? 'now' : 'todo';
            return (
              <li key={s.name} className="relative md:flex-1">
                <button type="button" onClick={() => go(k)} aria-current={k === i ? 'step' : undefined} className="flex min-h-[48px] w-full items-center gap-4 text-left md:min-h-[88px] md:flex-col md:items-center md:gap-2 md:text-center">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 font-mono text-sm font-bold transition-colors duration-300"
                    style={{ background: state === 'todo' ? 'var(--bg)' : 'var(--amber)', borderColor: state === 'todo' ? 'var(--dim)' : 'var(--amber)', color: state === 'todo' ? 'var(--dim)' : 'var(--ink)', boxShadow: state === 'now' ? '0 0 0 5px rgba(242,184,75,.28)' : 'none' }}>
                    {state === 'done' ? <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5" /></svg> : k + 1}
                  </span>
                  <span className="text-[15px] font-semibold md:px-1 md:text-[13px] md:leading-tight" style={{ color: state === 'todo' ? 'var(--dim)' : 'var(--tx)' }}>{s.name}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- ROLES ---------------- */
function Roles() {
  const [k, setK] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (k + d + ROLES.length) % ROLES.length;
    setK(n);
    refs.current[n]?.focus();
  };
  return (
    <section id="roles" className="srct-grid px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Head n="02" label="Three roles, one app" title="Same job. Three different views." sub="Nobody self-registers. The office creates every account, and each person sees only what they need." />
        <div role="tablist" aria-label="Role" onKeyDown={onKey} className="mb-8 grid grid-cols-3 gap-2 rounded-full p-1.5 sm:inline-grid sm:w-[26rem]" style={{ background: 'var(--mid)', border: '1px solid var(--line)' }}>
          {ROLES.map((r, n) => (
            <button key={r.key} ref={(el) => { refs.current[n] = el; }} role="tab" id={`srct-tab-${r.key}`} aria-selected={n === k} aria-controls={`srct-panel-${r.key}`} tabIndex={n === k ? 0 : -1} onClick={() => setK(n)}
              className="min-h-[46px] rounded-full px-2 text-[15px] font-bold transition-colors duration-300"
              style={{ background: n === k ? 'var(--amber)' : 'transparent', color: n === k ? 'var(--ink)' : 'var(--tx)' }}>{r.label}</button>
          ))}
        </div>
        <div className="grid gap-8 md:grid-cols-[minmax(0,300px)_1fr] md:items-center md:gap-14">
          <div className="mx-auto grid w-full max-w-[260px] md:max-w-none">
            {ROLES.map((r, n) => (
              <div key={r.key} className="col-start-1 row-start-1 transition-opacity duration-500" style={{ opacity: n === k ? 1 : 0, visibility: n === k ? 'visible' : 'hidden' }}>
                <Shot src={r.src} alt={r.alt} />
              </div>
            ))}
          </div>
          <div className="grid">
            {ROLES.map((r, n) => (
              <div key={r.key} role="tabpanel" id={`srct-panel-${r.key}`} aria-labelledby={`srct-tab-${r.key}`} className="col-start-1 row-start-1 transition-opacity duration-500"
                style={{ opacity: n === k ? 1 : 0, visibility: n === k ? 'visible' : 'hidden' }}>
                <span className="inline-block rounded-full border px-3 py-1 font-mono text-[12px] uppercase tracking-[0.16em]" style={{ borderColor: 'var(--blue)', color: 'var(--blue)' }}>{r.target}</span>
                <h3 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl" style={{ fontFamily: SP }}>{r.head}</h3>
                <ul className="mt-6 space-y-3">
                  {r.points.map((t) => (
                    <li key={t} className="flex gap-3 text-base leading-relaxed md:text-lg" style={{ color: 'var(--dim)' }}>
                      <span className="mt-2.5 h-2 w-2 shrink-0 rounded-sm" style={{ background: 'var(--amber)' }} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.18em]" style={{ color: 'var(--amber)' }}>Screen: {r.cap}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- RULES (quotes) ---------------- */
function Rules({ theme }: { theme: ProjectTheme }) {
  return (
    <section className="px-5 py-20 md:px-10 md:py-28" style={{ background: 'var(--mid)' }}>
      <div className="mx-auto max-w-6xl">
        <Head n="03" label="Rules of the job" title="Three lines written on every card." />
        <div className="grid gap-5 lg:grid-cols-3">
          {theme.story.quotes.map((q, n) => (
            <Reveal key={q.kicker} delay={n * 0.12}>
              <figure className="srct-card relative flex h-full flex-col overflow-hidden rounded-2xl border-2 p-6 pl-9 md:p-8 md:pl-11" style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}>
                <span className="absolute inset-y-0 left-0 w-3 srct-tape" style={{ height: 'auto', backgroundSize: 'auto' }} aria-hidden="true" />
                <figcaption className="font-mono text-[12px] uppercase tracking-[0.2em]" style={{ color: 'var(--amber)' }}>{`Rule ${String(n + 1).padStart(2, '0')} · ${q.kicker}`}</figcaption>
                <blockquote className="mt-4 text-[1.5rem] font-bold leading-[1.15] tracking-tight md:text-[1.75rem]" style={{ fontFamily: SP }}>&ldquo;{q.quote}&rdquo;</blockquote>
                <p className="mt-5 border-t border-dashed pt-4 text-[15px] leading-relaxed" style={{ borderColor: 'var(--line)', color: 'var(--dim)' }}>{q.context}</p>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FEATURES checklist ---------------- */
function Checklist({ theme }: { theme: ProjectTheme }) {
  return (
    <section className="srct-grid px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Head n="04" label="The checklist" title="Everything on the work order, ticked." />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {theme.features.map((f, n) => (
            <li key={f.title}>
              <Reveal delay={(n % 3) * 0.1} className="h-full">
                <div className="srct-card flex h-full gap-4 rounded-2xl border-2 p-5 md:p-6" style={{ background: 'var(--paper)', color: 'var(--ink)', borderColor: 'var(--paper)' }}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-white" style={{ background: 'var(--royal)' }}>
                    <Check className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-mono text-[12px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink2)' }}>Item {String(n + 1).padStart(2, '0')}</p>
                    <h3 className="mt-1 text-xl font-bold leading-snug" style={{ fontFamily: SP }}>{f.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed" style={{ color: 'var(--ink2)' }}>{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- NUMBERS ---------------- */
function Totals({ theme }: { theme: ProjectTheme }) {
  const loop = [...STAGES, ...STAGES];
  return (
    <section className="overflow-hidden py-16 md:py-24" style={{ background: 'var(--royal)' }}>
      <div className="px-5 md:px-10">
       <div className="mx-auto max-w-6xl">
        <Kicker tone="amber">{'§ 05 · Job totals'}</Kicker>
        <dl className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {theme.bigNumbers.map((b, n) => (
            <Reveal key={b.label} delay={n * 0.1} className="flex flex-col-reverse justify-end">
              <dt className="mt-3 border-t-2 pt-3 font-mono text-[12px] uppercase tracking-[0.16em] text-white/90 sm:text-[13px]" style={{ borderColor: 'var(--amber)' }}>{b.label}</dt>
              <dd className="text-[3.5rem] font-bold leading-none tracking-tight text-white sm:text-7xl" style={{ fontFamily: SP }}><Count value={b.value} /></dd>
            </Reveal>
          ))}
        </dl>
       </div>
      </div>
      <div className="mt-14 overflow-hidden border-y-2 py-4" style={{ borderColor: 'rgba(255,255,255,.3)' }} aria-hidden="true">
        <div className="srct-march flex gap-10 font-mono text-lg font-bold uppercase tracking-[0.2em] text-white/90 md:text-2xl">
          {loop.map((s, n) => <span key={n} className="whitespace-nowrap">{String((n % 10) + 1).padStart(2, '0')} {s.name} <span style={{ color: 'var(--amber)' }}>{'▸'}</span></span>)}
        </div>
      </div>
    </section>
  );
}

/* ---------------- ARCHITECTURE ---------------- */
const TARGETS = [
  { who: 'Crew', what: 'Android app' },
  { who: 'Office', what: 'Web console' },
  { who: 'Customer', what: 'iPhone-friendly web app' },
];

function Stack({ theme }: { theme: ProjectTheme }) {
  return (
    <section className="px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Head n="06" label="Under the hood" title="One codebase. Three apps." sub="The same Flutter code ships to every role, and the server owns the rules." />
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <div className="space-y-3">
            {TARGETS.map((t, n) => (
              <Reveal key={t.who} delay={n * 0.1}>
                <div className="flex items-center gap-4 rounded-2xl border-2 p-4" style={{ borderColor: 'var(--line)', background: 'var(--mid)' }}>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl font-mono text-lg font-bold" style={{ background: 'var(--amber)', color: 'var(--ink)' }}>{n + 1}</span>
                  <div>
                    <p className="font-mono text-[12px] uppercase tracking-[0.18em]" style={{ color: 'var(--amber)' }}>{t.who}</p>
                    <p className="text-lg font-bold" style={{ fontFamily: SP }}>{t.what}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.3}>
              <div className="flex items-center gap-5 rounded-2xl border-2 p-5" style={{ borderColor: 'var(--blue)', background: 'var(--bg)' }}>
                <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0" aria-hidden="true">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="var(--line)" strokeWidth="4" />
                  <g className="srct-tick" style={{ transformOrigin: '40px 40px' }}>
                    <circle cx="40" cy="6" r="6" fill="var(--amber)" />
                  </g>
                  <text x="40" y="46" textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--tx)" fontFamily="monospace">15m</text>
                </svg>
                <div>
                  <p className="font-mono text-[12px] uppercase tracking-[0.18em]" style={{ color: 'var(--amber)' }}>Every 15 minutes</p>
                  <p className="mt-1 text-[15px] leading-relaxed" style={{ color: 'var(--dim)' }}>A scheduler tick handles punch-out, reminders and housekeeping.</p>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal>
            <ol className="relative space-y-4 pl-12 md:pl-14">
              <span className="srct-line absolute bottom-6 left-[19px] top-6 w-[3px] rounded-full md:left-[23px]" style={{ background: 'var(--blue)' }} aria-hidden="true" />
              {theme.architecture.map((a, n) => (
                <li key={a.layer} className="relative rounded-2xl border-2 p-5" style={{ background: 'var(--mid)', borderColor: 'var(--line)' }}>
                  <span className="absolute -left-12 top-5 grid h-10 w-10 place-items-center rounded-full border-2 font-mono text-sm font-bold md:-left-14 md:h-12 md:w-12" style={{ background: 'var(--bg)', borderColor: 'var(--blue)', color: 'var(--blue)' }}>{n + 1}</span>
                  <h3 className="font-mono text-sm font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--blue)' }}>{a.layer}</h3>
                  <p className="mt-2 text-base leading-relaxed md:text-lg" style={{ color: 'var(--tx)' }}>{a.details}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- SLIDES ---------------- */
function Slides({ theme }: { theme: ProjectTheme }) {
  const picks = [0, 4, 5].map((n) => theme.gallery?.[n]).filter(Boolean) as NonNullable<ProjectTheme['gallery']>;
  if (!picks.length) return null;
  return (
    <section className="px-5 pb-20 md:px-10 md:pb-28">
      <div className="mx-auto max-w-6xl">
        <Kicker>{'§ 07 · From the case-study deck'}</Kicker>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {picks.map((g, n) => (
            <Reveal key={g.src} delay={n * 0.1}>
              <figure className="srct-card overflow-hidden rounded-xl border-2" style={{ borderColor: 'var(--line)' }}>
                <div className="relative w-full" style={{ aspectRatio: '16 / 10' }}>
                  <Image src={g.src} alt={`${theme.title} slide: ${g.caption.toLowerCase()}`} fill sizes="(min-width: 768px) 33vw, 92vw" className="object-cover" />
                </div>
                <figcaption className="px-4 py-3 font-mono text-[12px] uppercase tracking-[0.18em]" style={{ background: 'var(--mid)', color: 'var(--dim)' }}>{g.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- OUTCOME ---------------- */
function Outcome({ theme }: { theme: ProjectTheme }) {
  return (
    <section className="px-5 pb-28 pt-4 md:px-10 md:pb-36">
      <Reveal className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl p-7 pt-14 md:p-14 md:pt-16" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
          <span className="absolute left-0 right-0 top-0 srct-tape" aria-hidden="true" />
          <p className="font-mono text-[12px] uppercase tracking-[0.22em]" style={{ color: 'var(--ink2)' }}>Outcome {'·'} stage 10 of 10</p>
          <p className="mt-4 text-[1.9rem] font-bold leading-[1.1] tracking-tight md:text-5xl" style={{ fontFamily: SP }}>&ldquo;{theme.outcomeQuote}&rdquo;</p>
          <span className="srct-outstamp mt-8 inline-block rounded-md border-[3px] px-4 py-1.5 font-mono text-base font-bold uppercase tracking-[0.22em] md:text-xl" style={{ color: '#16845F', borderColor: '#16845F' }}>Completed</span>
        </div>
      </Reveal>
    </section>
  );
}

export default function Page({ theme }: { theme: ProjectTheme }) {
  const pal = theme.palette;
  const vars = { '--bg': pal.bg, '--mid': pal.bgMid, '--tx': pal.text, '--dim': pal.dim, '--blue': pal.accent, '--amber': pal.accent2 ?? '#F2B84B' } as CSSProperties;
  return (
    <div className="srct-root min-h-[100svh]" style={vars}>
      <style>{CSS}</style>
      <main>
        <Hero theme={theme} />
        <div className="srct-tape" aria-hidden="true" />
        <Pipeline />
        <Roles />
        <Rules theme={theme} />
        <Checklist theme={theme} />
        <Totals theme={theme} />
        <Stack theme={theme} />
        <Slides theme={theme} />
        <Outcome theme={theme} />
      </main>
      <NextChapter currentSlug={theme.slug} accent={pal.accent2 ?? pal.accent} />
      <SiteFooter />
    </div>
  );
}
