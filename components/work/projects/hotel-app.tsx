'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';
import type { ProjectTheme } from '@/lib/project-themes';

const SERIF: CSSProperties = { fontFamily: "var(--font-dmserif), 'DM Serif Display', Georgia, serif" };

/* Own captions: the shared theme captions do not match these photos. */
const ROOMS = [
  { src: '/work/hotel-app/gallery-1.jpg', cap: 'Garden-view room', alt: 'Double bed with floral linen beside a window onto trees' },
  { src: '/work/hotel-app/gallery-2.jpg', cap: 'Window-side room', alt: 'Hotel room with a wide window, bed and a vase of red flowers' },
  { src: '/work/hotel-app/gallery-3.jpg', cap: 'Mirrored room', alt: 'Carved wooden headboard, curtains and a mirror in a hotel room' },
  { src: '/work/hotel-app/gallery-4.jpg', cap: 'Warm-lit room', alt: 'Hotel room with orange bedspread and wooden furniture' },
  { src: '/work/hotel-app/gallery-5.jpg', cap: 'Sunflower room', alt: 'Hotel room with sunflowers on a wooden side table' },
  { src: '/work/hotel-app/gallery-6.jpg', cap: 'Marble lobby', alt: 'Marble-floored hotel lobby under chandeliers' },
];

const STEPS = [
  { name: 'Confirmed', room: 'Available', note: 'A booking lands from the website, a walk-in or an agent. Every one carries a source field, so reports stratify cleanly.', event: 'Toast at the front desk within seconds', feat: 0 },
  { name: 'Checked in', room: 'Occupied', note: 'One quick action on the reservation manager. Every status change is an event, so two managers cannot silently overwrite each other.', event: 'Fan-out to every staff device', feat: 1 },
  { name: 'Checked out', room: 'Cleaning', note: 'The invoice builds itself from the booking: room nights, rate, taxes, extras, total. One function, PDF export.', event: 'computeInvoice runs once', feat: 2 },
  { name: 'Turned over', room: 'Available', note: 'The room flips back and the receptionist phone buzzes. Nothing to reconcile at midnight, so nothing gets oversold.', event: 'Room turnover, in real time', feat: 1 },
];

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI'];

/* ---------- small helpers ---------- */

function useSeen<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver(
      (es) => { if (es.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); } },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  return (
    <div ref={ref} className={`ha-rv ${seen ? 'ha-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
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

function Bell({ ringKey }: { ringKey: number }) {
  return (
    <svg viewBox="0 0 64 56" width="56" height="49" aria-hidden="true" className="shrink-0">
      <g key={ringKey} className={ringKey ? 'ha-bell-ring' : ''} style={{ transformOrigin: '32px 42px', transformBox: 'view-box' }}>
        <path d="M10 42c0-13 9-22 22-22s22 9 22 22z" fill="currentColor" />
        <rect x="29" y="12" width="6" height="8" rx="2" fill="currentColor" />
        <circle cx="32" cy="10" r="4" fill="currentColor" />
        <path d="M17 36c1-6 5-10 10-11" stroke="var(--ha-cream)" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".6" />
      </g>
      <rect x="6" y="42" width="52" height="5" rx="2.5" fill="currentColor" />
      <rect x="14" y="48" width="36" height="3" rx="1.5" fill="currentColor" opacity=".55" />
    </svg>
  );
}

function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`font-mono text-[12px] uppercase tracking-[0.24em] flex items-center gap-3 ${dark ? 'text-[var(--ha-brass-hi)]' : 'text-[#8A5F26]'}`}>
      <span className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}

/* ---------- page ---------- */

export default function Page({ theme }: { theme: ProjectTheme }) {
  const p = theme.palette;
  const vars = {
    '--ha-teal-deep': p.bg,
    '--ha-teal': p.bgMid,
    '--ha-cream': p.text,
    '--ha-brass-hi': p.accent,
    '--ha-brass': p.accent2 ?? p.dim,
    '--ha-paper': '#FFFAF0',
    '--ha-sand': '#F1E6D2',
    '--ha-ink': '#1A1410',
    '--ha-ink-dim': '#5A5048',
    '--ha-brass-ink': '#8A5F26',
  } as CSSProperties;

  const [rings, setRings] = useState(0);
  const [step, setStep] = useState(0);
  const [floor, setFloor] = useState(0);
  const [slide, setSlide] = useState(0);
  const track = useRef<HTMLUListElement | null>(null);

  const onTrack = useCallback(() => {
    const el = track.current;
    if (!el || !el.firstElementChild) return;
    const w = (el.firstElementChild as HTMLElement).offsetWidth + 16;
    setSlide(Math.max(0, Math.min(ROOMS.length - 1, Math.round(el.scrollLeft / w))));
  }, []);
  const go = (dir: number) => {
    const el = track.current;
    if (!el || !el.firstElementChild) return;
    const w = (el.firstElementChild as HTMLElement).offsetWidth + 16;
    el.scrollBy({ left: dir * w, behavior: 'smooth' });
  };

  const ringBell = () => setRings((n) => n + 1);
  const st = STEPS[step];
  const floors = [...theme.architecture].sort((a, b) => {
    const order = ['Guest site', 'Staff app', 'Backend', 'Database'];
    return order.indexOf(a.layer) - order.indexOf(b.layer);
  });

  return (
    <main className="ha-root bg-[var(--ha-cream)] text-[var(--ha-ink)] font-sans overflow-x-clip" style={vars}>
      <style>{CSS}</style>

      {/* ============ HERO ============ */}
      <section className="relative px-5 md:px-12 pt-24 md:pt-36 pb-16 md:pb-24 min-h-[88svh]">
        <div className="mx-auto max-w-6xl grid gap-14 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <p className="ha-hero-in font-mono text-[12px] uppercase tracking-[0.22em] text-[#8A5F26]" style={{ animationDelay: '.05s' }}>
              {theme.kicker}
            </p>
            <h1
              className="ha-hero-in mt-5 leading-[0.92] text-[var(--ha-teal)] text-[clamp(3.6rem,15vw,9.5rem)]"
              style={{ ...SERIF, animationDelay: '.15s' }}
            >
              {theme.title}
            </h1>
            <div className="ha-hero-in mt-6 flex items-center gap-4" style={{ animationDelay: '.25s' }}>
              <span className="h-px flex-1 max-w-[7rem] bg-[var(--ha-brass)]" />
              <span className="text-[12px] font-mono uppercase tracking-[0.24em] text-[#8A5F26]">front desk edition</span>
            </div>
            <h2 className="ha-hero-in mt-6 text-3xl md:text-5xl leading-[1.1] text-[var(--ha-ink)]" style={{ ...SERIF, fontStyle: 'italic', animationDelay: '.3s' }}>
              Three booking channels. One front desk.
            </h2>
            <p className="ha-hero-in mt-5 max-w-xl text-base md:text-lg leading-relaxed text-[var(--ha-ink-dim)]" style={{ animationDelay: '.4s' }}>
              {theme.subtitle} StayEasy folds your website, your walk-ins and your travel-agent reservations into a single live screen. Rooms reconcile themselves. Invoices print themselves.
            </p>
            <div className="ha-hero-in mt-8 flex flex-wrap items-center gap-4" style={{ animationDelay: '.5s' }}>
              <button
                type="button"
                onClick={ringBell}
                className="ha-btn group inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--ha-teal)] pl-4 pr-6 text-[var(--ha-cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ha-teal)]"
                aria-label="Ring the front desk bell"
              >
                <span className="text-[var(--ha-brass-hi)]"><Bell ringKey={rings} /></span>
                <span className="font-mono text-[12px] uppercase tracking-[0.18em]">Ring for service</span>
              </button>
              <span key={rings} aria-live="polite" className={`font-mono text-sm text-[#8A5F26] ${rings ? 'ha-ding' : 'opacity-0'}`}>
                {rings ? 'ding!' : ''}
              </span>
              <a href="#ha-notes" className="min-h-12 inline-flex items-center font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--ha-teal)] underline decoration-[var(--ha-brass)] decoration-2 underline-offset-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ha-teal)]">
                Read the stay
              </a>
            </div>
          </div>

          {/* key card scene */}
          <div className="ha-hero-in mx-auto w-full max-w-[300px]" style={{ animationDelay: '.35s' }}>
            <div className="relative pb-6 pt-4">
              <div className="absolute inset-x-6 top-8 bottom-4 rotate-[7deg] rounded-[22px] border border-[var(--ha-brass)] bg-[var(--ha-sand)]" aria-hidden="true" />
              <div className="ha-card relative aspect-[5/8] w-full overflow-hidden rounded-[22px] bg-[var(--ha-teal-deep)] shadow-[0_26px_44px_-22px_rgba(10,55,68,.65)]">
                <div className="absolute inset-[7px] rounded-[16px] border border-[var(--ha-brass-hi)]/60" aria-hidden="true" />
                <div className="absolute left-1/2 top-[14px] h-2 w-9 -translate-x-1/2 rounded-full bg-[var(--ha-cream)]/90" aria-hidden="true" />
                <div className="absolute inset-x-[18px] top-[34px] bottom-[30%] overflow-hidden rounded-[10px]">
                  <Image src={theme.heroImage} alt="Hotel room window at sunset over the city" fill priority sizes="(min-width:768px) 300px, 70vw" className="object-cover" />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-[30%] px-5 pt-4 text-center">
                  <p className="text-[2rem] leading-none text-[var(--ha-brass-hi)]" style={SERIF}>StayEasy</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--ha-cream)]/85">Key card · Front desk</p>
                  <div className="mx-auto mt-3 h-[6px] w-[76%] rounded-full bg-black/50" aria-hidden="true" />
                </div>
              </div>
              {/* reader */}
              <div className="relative z-10 mx-auto -mt-1 flex h-11 w-[88%] items-center justify-between rounded-b-2xl bg-[var(--ha-ink)] px-4" aria-hidden="true">
                <span className="relative inline-block h-3 w-3">
                  <span className="absolute inset-0 rounded-full bg-[var(--ha-brass)]" />
                  <span className="ha-led absolute inset-0 rounded-full bg-[#59d38c]" />
                </span>
                <span className="relative whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ha-cream)]/80">
                  <span className="ha-idle whitespace-nowrap">Swipe to enter</span>
                  <span className="ha-ok absolute left-0 top-0 whitespace-nowrap text-[#8be8b0]">Welcome in</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <section className="bg-[var(--ha-teal)] py-5 overflow-hidden border-y border-[var(--ha-brass-hi)]/40" aria-label="Booking channels">
        <div className="ha-marquee flex w-max">
          {[0, 1].map((k) => (
            <ul key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
              {['Website', 'Walk-in', 'Agent', 'One inbox', 'Website', 'Walk-in', 'Agent', 'One inbox'].map((t, i) => (
                <li key={i} className="flex items-center text-[1.6rem] md:text-3xl text-[var(--ha-cream)]" style={SERIF}>
                  <span className="px-6 md:px-10 italic">{t}</span>
                  <span className="text-[var(--ha-brass-hi)] text-lg" aria-hidden="true">&#9670;</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* ============ NOTES FROM THE FRONT DESK ============ */}
      <section id="ha-notes" className="px-5 md:px-12 py-20 md:py-28 scroll-mt-4">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Notes from the front desk</Eyebrow>
            <h2 className="mt-4 text-4xl md:text-6xl leading-[1.02] text-[var(--ha-teal)]" style={SERIF}>
              A single source of truth, written between <span className="whitespace-nowrap">check-ins.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-6">
            {theme.story.quotes.map((q, i) => (
              <Reveal key={q.kicker} delay={i * 90} className={i === 0 ? 'md:col-span-6' : 'md:col-span-3'}>
                <figure className="ha-note relative h-full rounded-sm border border-[var(--ha-brass)]/60 bg-[var(--ha-paper)] p-7 md:p-10 shadow-[0_10px_24px_-16px_rgba(26,20,16,.35)]">
                  <span className="absolute left-0 top-0 h-full w-[3px] bg-[var(--ha-brass)]" aria-hidden="true" />
                  <figcaption className="flex items-center justify-between font-mono text-[12px] uppercase tracking-[0.2em] text-[#8A5F26]">
                    <span>{q.kicker}</span>
                    <span aria-hidden="true">{NUMERALS[i]}</span>
                  </figcaption>
                  <blockquote
                    className={`mt-5 text-[var(--ha-teal-deep)] ${i === 0 ? 'text-[1.7rem] md:text-[2.6rem] leading-[1.15] md:max-w-4xl' : 'text-2xl md:text-[1.9rem] leading-[1.2]'}`}
                    style={SERIF}
                  >
                    &ldquo;{q.quote}&rdquo;
                  </blockquote>
                  <p className="mt-6 border-t border-[var(--ha-brass)]/40 pt-4 text-[15px] leading-relaxed text-[var(--ha-ink-dim)] md:max-w-2xl">{q.context}</p>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CHECK-IN TIMELINE ============ */}
      <section className="bg-[var(--ha-teal-deep)] text-[var(--ha-cream)] px-5 md:px-12 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow dark>The stay, step by step</Eyebrow>
            <h2 className="mt-4 text-4xl md:text-6xl leading-[1.02]" style={SERIF}>From confirmed to turned over.</h2>
          </Reveal>

          <Reveal className="mt-12">
            <div role="tablist" aria-label="Booking status" className="relative grid grid-cols-4">
              <span className="absolute left-[12.5%] right-[12.5%] top-[27px] h-px bg-[var(--ha-cream)]/25" aria-hidden="true" />
              <span
                className="ha-fill absolute left-[12.5%] right-[12.5%] top-[26px] h-[3px] origin-left bg-[var(--ha-brass-hi)]"
                style={{ transform: `scaleX(${step / 3})` }}
                aria-hidden="true"
              />
              {STEPS.map((s, i) => (
                <button
                  key={s.name}
                  role="tab"
                  id={`ha-tab-${i}`}
                  aria-selected={i === step}
                  aria-controls="ha-panel"
                  onClick={() => setStep(i)}
                  className="group relative flex min-h-[44px] flex-col items-center gap-3 px-1 focus-visible:outline-none"
                >
                  <span
                    className={`relative z-10 flex h-[54px] w-[54px] items-center justify-center rounded-full border-2 font-mono text-base transition-[transform,background-color,color] duration-300 group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-[var(--ha-brass-hi)] ${
                      i <= step ? 'border-[var(--ha-brass-hi)] bg-[var(--ha-brass-hi)] text-[var(--ha-teal-deep)]' : 'border-[var(--ha-cream)]/40 bg-[var(--ha-teal-deep)] text-[var(--ha-cream)]'
                    } ${i === step ? 'scale-110' : 'group-hover:scale-105'}`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`text-center text-[13px] sm:text-base leading-tight ${i === step ? 'text-[var(--ha-brass-hi)]' : 'text-[var(--ha-cream)]/85'}`} style={SERIF}>
                    {s.name}
                  </span>
                </button>
              ))}
            </div>

            <div id="ha-panel" role="tabpanel" aria-labelledby={`ha-tab-${step}`} key={step} className="ha-swap mt-10 grid gap-6 md:grid-cols-[1.4fr_1fr]">
              <div className="rounded-sm border border-[var(--ha-cream)]/20 p-6 md:p-9">
                <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[var(--ha-brass-hi)]">Step {step + 1} of 4</p>
                <h3 className="mt-3 text-3xl md:text-4xl" style={SERIF}>{st.name}</h3>
                <p className="mt-4 text-base md:text-lg leading-relaxed text-[var(--ha-cream)]/90">{st.note}</p>
                <p className="mt-5 border-t border-[var(--ha-cream)]/20 pt-4 text-[15px] text-[var(--ha-cream)]/80">
                  <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--ha-brass-hi)]">Behind it </span>
                  {theme.features[st.feat].title}. {theme.features[st.feat].desc}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-sm bg-[var(--ha-cream)] p-6 text-center text-[var(--ha-ink)]">
                <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#8A5F26]">Room status</p>
                <p className="mt-2 text-4xl md:text-5xl text-[var(--ha-teal)]" style={SERIF}>{st.room}</p>
                <span className="my-4 h-px w-16 bg-[var(--ha-brass)]" />
                <p className="text-[15px] text-[var(--ha-ink-dim)]">{st.event}</p>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="ha-pill" aria-label="Previous step">&larr;</button>
                  <button onClick={() => setStep((s) => Math.min(3, s + 1))} disabled={step === 3} className="ha-pill" aria-label="Next step">&rarr;</button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ SERVICES MENU ============ */}
      <section className="px-5 md:px-12 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>The house menu</Eyebrow>
            <h2 className="mt-4 text-4xl md:text-6xl leading-[1.02] text-[var(--ha-teal)]" style={SERIF}>Six services, all on one screen.</h2>
          </Reveal>
          <ol className="mt-12 grid gap-x-16 md:grid-cols-2 border-t border-[var(--ha-brass)]">
            {theme.features.map((f, i) => (
              <li key={f.title}>
                <Reveal delay={(i % 2) * 80}>
                  <div className="ha-menu group relative flex gap-5 border-b border-[var(--ha-brass)]/60 py-7">
                    <span className="w-9 shrink-0 pt-1 text-xl text-[#8A5F26]" style={SERIF}>{NUMERALS[i]}</span>
                    <div>
                      <h3 className="text-2xl md:text-[1.7rem] leading-tight text-[var(--ha-teal-deep)]" style={SERIF}>{f.title}</h3>
                      <p className="mt-2 text-base leading-relaxed text-[var(--ha-ink-dim)]">{f.desc}</p>
                    </div>
                    <span className="ha-menu-bar absolute bottom-[-1px] left-0 h-[3px] w-full origin-left bg-[var(--ha-teal)]" aria-hidden="true" />
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ ROOM GALLERY ============ */}
      <section className="bg-[var(--ha-sand)] py-20 md:py-28" aria-roledescription="carousel" aria-label="Room gallery">
        <div className="px-5 md:px-12">
         <div className="mx-auto max-w-6xl">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>Rooms &amp; lobby</Eyebrow>
              <h2 className="mt-4 text-4xl md:text-6xl leading-[1.02] text-[var(--ha-teal)]" style={SERIF}>Soft, never sharp.</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="mr-2 font-mono text-sm text-[var(--ha-ink-dim)]">{String(slide + 1).padStart(2, '0')} / {String(ROOMS.length).padStart(2, '0')}</span>
              <button className="ha-pill ha-pill-dark" onClick={() => go(-1)} disabled={slide === 0} aria-label="Previous room">&larr;</button>
              <button className="ha-pill ha-pill-dark" onClick={() => go(1)} disabled={slide === ROOMS.length - 1} aria-label="Next room">&rarr;</button>
            </div>
          </Reveal>
         </div>
        </div>
        <ul
          ref={track}
          onScroll={onTrack}
          tabIndex={0}
          aria-label="Scrollable room photos"
          className="ha-track mt-10 flex gap-4 overflow-x-auto snap-x snap-mandatory focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ha-teal)]"
          style={{ overscrollBehaviorX: 'contain' }}
        >
          {ROOMS.map((r, i) => (
            <li key={r.src} className="ha-slide w-[78vw] max-w-[400px] shrink-0 snap-start">
              <figure className="rounded-sm bg-[var(--ha-paper)] p-3 pb-4 shadow-[0_14px_28px_-18px_rgba(26,20,16,.45)]">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image src={r.src} alt={r.alt} fill sizes="(min-width:768px) 400px, 78vw" className="ha-photo object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between gap-3 border-t border-[var(--ha-brass)]/60 pt-3">
                  <span className="text-xl text-[var(--ha-teal-deep)]" style={SERIF}>{r.cap}</span>
                  <span className="font-mono text-[12px] tracking-[0.18em] text-[#8A5F26]">No. {String(i + 1).padStart(2, '0')}</span>
                </figcaption>
              </figure>
            </li>
          ))}
          <li aria-hidden="true" className="w-px shrink-0" />
        </ul>
        <div className="px-5 md:px-12"><p className="mx-auto mt-6 max-w-6xl font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--ha-ink-dim)]">Swipe or use the arrows</p></div>
      </section>

      {/* ============ ARCHITECTURE: THE BUILDING ============ */}
      <section className="bg-[var(--ha-teal-deep)] text-[var(--ha-cream)] px-5 md:px-12 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow dark>How the building stands</Eyebrow>
            <h2 className="mt-4 text-4xl md:text-6xl leading-[1.02]" style={SERIF}>Four floors, one lift shaft.</h2>
          </Reveal>
          <div className="mt-12 border-t border-[var(--ha-brass-hi)]/70">
            {floors.map((a, i) => {
              const n = floors.length - i;
              const on = floor === i;
              return (
                <Reveal key={a.layer} delay={i * 70}>
                  <button
                    type="button"
                    onClick={() => setFloor(i)}
                    aria-pressed={on}
                    className={`ha-floor relative flex w-full items-center gap-4 md:gap-8 border-b border-[var(--ha-cream)]/25 px-1 py-6 md:py-8 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--ha-brass-hi)] ${on ? 'bg-[var(--ha-teal)]' : 'hover:bg-[var(--ha-teal)]/60'}`}
                  >
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-mono text-lg transition-colors duration-300 ${
                        on ? 'border-[var(--ha-brass-hi)] bg-[var(--ha-brass-hi)] text-[var(--ha-teal-deep)] ha-glow' : 'border-[var(--ha-cream)]/50'
                      }`}
                    >
                      {n}
                    </span>
                    <span className="min-w-0 flex-1 md:grid md:grid-cols-[14rem_1fr] md:items-center md:gap-8">
                      <span className="block text-3xl md:text-4xl leading-none" style={SERIF}>{a.layer}</span>
                      <span className="mt-2 block text-base md:mt-0 leading-relaxed text-[var(--ha-cream)]/85">{a.details}</span>
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ FOLIO (BIG NUMBERS) ============ */}
      <section className="px-5 md:px-12 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="ha-folio relative rounded-sm border border-[var(--ha-brass)] bg-[var(--ha-paper)] px-6 py-10 md:px-14 md:py-14 shadow-[0_18px_36px_-22px_rgba(26,20,16,.4)]">
              <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-[var(--ha-brass)] pb-5">
                <h2 className="text-3xl md:text-5xl text-[var(--ha-teal)]" style={SERIF}>Guest folio</h2>
                <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[#8A5F26]">StayEasy</p>
              </div>
              <dl>
                {theme.bigNumbers.map((b) => (
                  <div key={b.label} className="flex items-end gap-3 border-b border-[var(--ha-brass)]/30 py-5">
                    <dt className="text-lg md:text-2xl text-[var(--ha-ink)]" style={SERIF}>{b.label}</dt>
                    <span className="mb-2 flex-1 border-b border-dotted border-[var(--ha-ink-dim)]/60" aria-hidden="true" />
                    <dd className="text-5xl md:text-7xl leading-none text-[var(--ha-teal)]" style={SERIF}>
                      <Count to={Number(b.value)} />
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-right font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--ha-ink-dim)]">Settled &middot; nothing to reconcile</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ OUTCOME + CLOSING ============ */}
      <section className="bg-[var(--ha-teal-deep)] text-[var(--ha-cream)] px-5 md:px-12 pt-20 md:pt-28 pb-8">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="mx-auto block w-fit text-[var(--ha-brass-hi)]"><Bell ringKey={0} /></span>
            <blockquote className="mt-8 text-3xl md:text-5xl leading-[1.15]" style={{ ...SERIF, fontStyle: 'italic' }}>
              &ldquo;{theme.outcomeQuote}&rdquo;
            </blockquote>
            <span className="mx-auto mt-10 block h-px w-24 bg-[var(--ha-brass-hi)]" />
            <p className="mt-5 font-mono text-[12px] uppercase tracking-[0.24em] text-[var(--ha-brass-hi)]">Thank you for staying</p>
          </Reveal>
        </div>
        <div className="mt-16 pb-24">
          <NextChapter currentSlug="hotel-app" accent={p.accent} />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

const CSS = `
.ha-rv{opacity:0;transform:translateY(22px);transition:opacity .8s cubic-bezier(.22,.61,.36,1),transform .8s cubic-bezier(.22,.61,.36,1)}
.ha-rv.ha-in{opacity:1;transform:none}
.ha-hero-in{opacity:0;animation:ha-up .9s cubic-bezier(.22,.61,.36,1) forwards}
@keyframes ha-up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
.ha-card{transform:rotate(-4deg);animation:ha-swipe 7s ease-in-out infinite;transition:transform .5s}
@keyframes ha-swipe{0%,68%{transform:translateY(0) rotate(-4deg)}76%{transform:translateY(20px) rotate(-1deg)}86%,100%{transform:translateY(0) rotate(-4deg)}}
.ha-led{opacity:0;animation:ha-led 7s ease-in-out infinite}
.ha-ok{opacity:0;animation:ha-led 7s ease-in-out infinite}
.ha-idle{animation:ha-idle 7s ease-in-out infinite}
@keyframes ha-led{0%,73%{opacity:0}78%,90%{opacity:1}96%,100%{opacity:0}}
@keyframes ha-idle{0%,73%{opacity:1}78%,90%{opacity:0}96%,100%{opacity:1}}
.ha-marquee{animation:ha-slide 38s linear infinite}
@keyframes ha-slide{to{transform:translateX(-50%)}}
.ha-bell-ring{animation:ha-bell .9s ease-in-out}
@keyframes ha-bell{0%{transform:rotate(0)}15%{transform:rotate(-16deg)}30%{transform:rotate(14deg)}45%{transform:rotate(-10deg)}60%{transform:rotate(7deg)}80%{transform:rotate(-3deg)}100%{transform:rotate(0)}}
.ha-ding{animation:ha-dingy 1.4s ease-out forwards}
@keyframes ha-dingy{0%{opacity:0;transform:translateY(8px) scale(.9)}20%{opacity:1;transform:none}80%{opacity:1}100%{opacity:0;transform:translateY(-6px)}}
.ha-btn{transition:transform .25s}
.ha-btn:hover{transform:translateY(-2px)}
.ha-btn:active{transform:scale(.97)}
.ha-swap{animation:ha-up .5s cubic-bezier(.22,.61,.36,1) both}
.ha-fill{transition:transform .6s cubic-bezier(.65,0,.35,1)}
.ha-pill{display:inline-flex;height:44px;width:44px;align-items:center;justify-content:center;border-radius:9999px;border:1.5px solid var(--ha-brass);color:var(--ha-teal);background:transparent;font-size:18px;transition:transform .2s,background-color .2s,color .2s}
.ha-pill:hover:not(:disabled){background:var(--ha-teal);color:var(--ha-cream);transform:translateY(-1px)}
.ha-pill:focus-visible{outline:2px solid var(--ha-teal);outline-offset:3px}
.ha-pill:disabled{opacity:.35;cursor:default}
.ha-menu-bar{transform:scaleX(0);transition:transform .5s cubic-bezier(.65,0,.35,1)}
@media (hover:hover){.ha-menu:hover .ha-menu-bar{transform:scaleX(1)}}
.ha-track{scrollbar-width:none;-webkit-overflow-scrolling:touch;padding:0 1.25rem 6px;scroll-padding-inline:1.25rem}
@media (min-width:768px){.ha-track{padding-inline:max(3rem,calc((100vw - 72rem) / 2));scroll-padding-inline:max(3rem,calc((100vw - 72rem) / 2))}}
.ha-track::-webkit-scrollbar{display:none}
.ha-photo{transition:transform .8s cubic-bezier(.22,.61,.36,1)}
.ha-slide:hover .ha-photo{transform:scale(1.04)}
.ha-glow{animation:ha-pulse 2.4s ease-in-out infinite}
@keyframes ha-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@media (min-width:768px){.ha-card:hover{animation-play-state:paused}}
@media (prefers-reduced-motion:reduce){
.ha-card,.ha-led,.ha-ok,.ha-idle,.ha-marquee,.ha-glow,.ha-bell-ring,.ha-swap{animation:none!important}
.ha-hero-in{animation:none!important;opacity:1}
.ha-rv{opacity:1;transform:none;transition:none}
.ha-led,.ha-ok{opacity:0}
.ha-fill,.ha-menu-bar,.ha-photo,.ha-btn{transition:none}
}
`;
