'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

/* ---------- small hooks / helpers ---------- */

function useInView<T extends HTMLElement>(margin = '0px 0px -8% 0px') {
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
      { rootMargin: margin, threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, seen] as const;
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} data-in={seen ? 1 : 0} className={`eat-rv ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Count({ to, run }: { to: number; run: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
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
  }, [run, to]);
  return <>{v}</>;
}

/** Hand-drawn circle / underline around a phrase inside a string. */
function Marked({ text, phrase, kind }: { text: string; phrase: string; kind: 'circle' | 'underline' }) {
  const i = text.indexOf(phrase);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="eat-mk">
        {phrase}
        {kind === 'circle' ? (
          <svg className="eat-mk-svg" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
            <path className="eat-draw" pathLength={1} d="M14 20 C10 8 40 3 66 4 C92 6 99 24 76 34 C52 42 12 40 5 24 C1 13 20 6 44 5" />
          </svg>
        ) : (
          <svg className="eat-mk-ul" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
            <path className="eat-draw" pathLength={1} d="M2 6 C25 1 50 8 98 3" />
          </svg>
        )}
      </span>
      {text.slice(i + phrase.length)}
    </>
  );
}

function Stamp({ on, size = '2.2rem', delay = '0s' }: { on: boolean; size?: string; delay?: string }) {
  return (
    <span className="eat-stamp" data-on={on ? 1 : 0} style={{ ['--s' as string]: size, ['--d' as string]: delay } as CSSProperties} aria-hidden="true">
      PAID
    </span>
  );
}

function ViewStamp({ size, delay }: { size: string; delay?: string }) {
  const [ref, seen] = useInView<HTMLSpanElement>();
  return (
    <span ref={ref} className="inline-flex">
      <Stamp on={seen} size={size} delay={delay} />
    </span>
  );
}

function Scribble({ w = 64 }: { w?: number }) {
  return (
    <svg width={w} height="12" viewBox="0 0 80 12" fill="none" aria-hidden="true" className="eat-pencil">
      <path d="M2 8 Q8 1 14 8 T26 7 T38 8 T50 6 T62 8 T78 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Head({ no, eyebrow, title, note }: { no: string; eyebrow: string; title: string; note?: string }) {
  return (
    <Reveal className="mb-8 md:mb-12">
      <p className="font-mono text-xs tracking-[0.22em] uppercase eat-muted">
        {no} / {eyebrow}
      </p>
      <h2 className="eat-lora mt-2 text-[clamp(1.9rem,5.2vw,3.2rem)] leading-[1.1] font-bold">{title}</h2>
      {note && <p className="eat-hand eat-red mt-2 text-2xl md:text-3xl leading-tight">{note}</p>}
    </Reveal>
  );
}

const SCRAP = [
  { n: 1, alt: 'A teacher at the blackboard while a student raises a hand in a busy classroom', cap: 'the classroom, mid-lesson' },
  { n: 3, alt: 'Four smiling children standing close together outdoors', cap: 'the kids behind every entry' },
  { n: 4, alt: 'A crowded hall with a presenter on stage and students seated at tables', cap: 'event day, full house' },
  { n: 5, alt: 'A large wood-panelled lecture hall with students seated facing a projector screen', cap: 'the big hall, full term' },
];

/* ---------- Before / After ---------- */

function Ledger() {
  const rows = ['Maths', 'Both', 'Science', 'Maths', 'Both'];
  return (
    <div className="eat-book relative p-4 pb-6 md:p-6">
      <span className="eat-tape" style={{ left: '12%', transform: 'rotate(-4deg)' }} aria-hidden="true" />
      <p className="font-mono text-[11px] tracking-[0.2em] uppercase eat-muted">Before / the fee register</p>
      <div className="mt-3 grid grid-cols-[3.4rem_1fr_5rem] gap-x-3 border-b-2 border-[color:var(--ink)]/50 pb-1 font-mono text-[11px] uppercase tracking-wider eat-muted">
        <span>Date</span>
        <span>Student</span>
        <span>Subject</span>
      </div>
      <ul>
        {rows.map((r, i) => (
          <li key={i} className="grid grid-cols-[3.4rem_1fr_5rem] items-center gap-x-3 border-b border-[color:var(--ink)]/25 py-1.5 min-h-10">
            <Scribble w={34} />
            <Scribble w={70 + (i % 3) * 18} />
            <span className="eat-hand text-xl leading-none eat-pencil">{r}</span>
          </li>
        ))}
      </ul>
      <div className="eat-smudge" aria-hidden="true" />
      <p className="eat-hand eat-pencil mt-4 text-2xl leading-snug">did Karthik pay for September yet?</p>
      <p className="eat-hand eat-red mt-2 text-2xl leading-snug md:text-[1.7rem]">
        15 min to find one entry, and the carbon copy smudged before the gate.
      </p>
    </div>
  );
}

function Phone({ paid, run, onPay, big }: { paid: boolean; run: number; onPay: () => void; big: { value: string; label: string } }) {
  return (
    <div className="eat-phone mx-auto w-full max-w-[320px]" data-paid={paid ? 1 : 0}>
      <div className="eat-phone-bar flex items-center justify-between px-4 py-3">
        <span className="eat-lora text-lg font-bold">EA Fees</span>
        <span className="font-mono text-[11px] tracking-widest uppercase opacity-90">{big.value} {big.label}</span>
      </div>
      <div className="p-4">
        <div className="flex gap-1.5" role="presentation">
          {['10th', '11th', '12th'].map((s, i) => (
            <span key={s} className={`eat-chip ${i === 0 ? 'eat-chip-on' : ''}`}>{s}</span>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-md border border-[color:var(--ink)]/30 bg-white px-3 py-2 text-sm">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" /><path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          <span className="font-sans">Karthik</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-md bg-[#F1E9D2] px-3 py-3">
          <div>
            <p className="font-sans text-sm font-semibold">Karthik</p>
            <p className="font-sans text-xs eat-muted">10th · CBSE · Both</p>
          </div>
          <span className="eat-status" data-paid={paid ? 1 : 0}>{paid ? 'Paid' : 'Pending'}</span>
        </div>
        <button type="button" onClick={onPay} className="eat-btn mt-3 w-full">
          {paid ? 'Replay the receipt' : 'Collect & print'}
        </button>
        <div className="eat-recwrap mt-3" key={run}>
          <div className="eat-rec relative px-4 pb-6 pt-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] eat-muted">Receipt</p>
            {['Application fee', 'Maths', 'Science', 'Discount, per row'].map((l) => (
              <div key={l} className="mt-2 flex items-center gap-2 font-sans text-xs">
                <span className="shrink-0">{l}</span>
                <span className="eat-leader" />
                <span className="eat-bar" />
              </div>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-dashed border-[color:var(--ink)]/50 pt-2 font-sans text-sm font-bold">
              <span>Total</span>
              <span className="eat-bar eat-bar-lg" />
            </div>
            <div className="mt-3 flex justify-end pr-2 pb-1">
              <Stamp on={paid} size="1.4rem" delay="0.6s" />
            </div>
          </div>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{paid ? 'Receipt printed and marked paid' : ''}</p>
    </div>
  );
}

function BeforeAfter({ theme }: { theme: ProjectTheme }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const [paid, setPaid] = useState(false);
  const [run, setRun] = useState(0);
  const big = theme.bigNumbers[0];

  useEffect(() => {
    if (!seen) return;
    const id = setTimeout(() => setPaid(true), 900);
    return () => clearTimeout(id);
  }, [seen]);

  const onPay = () => {
    if (paid) {
      setPaid(false);
      setRun((r) => r + 1);
      setTimeout(() => setPaid(true), 450);
    } else setPaid(true);
  };

  return (
    <section aria-labelledby="eat-ba" className="mt-24 md:mt-36">
      <Head no="01" eyebrow="before / after" title="From the fee-book to the phone." note="same office, same parents, no smudge" />
      <h3 id="eat-ba" className="sr-only">Before and after</h3>
      <div ref={ref} className="grid items-start gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
        <Reveal><div className="eat-tilt-l"><Ledger /></div></Reveal>
        <Reveal className="flex flex-col items-center justify-center gap-2 text-center lg:pt-32">
          <span aria-hidden="true" className="eat-hand eat-red text-3xl leading-none">{big.value} {big.label}</span>
          <div className="grid h-[100px] w-[40px] place-items-center lg:h-auto lg:w-auto" aria-hidden="true"><svg className="eat-arrow rotate-90 lg:rotate-0" width="90" height="30" viewBox="0 0 90 30" fill="none">
            <path className="eat-draw" pathLength={1} d="M3 18 C25 6 50 26 84 14 M72 6 L85 14 L74 24" stroke="#B3261E" strokeWidth="2.4" strokeLinecap="round" />
          </svg></div>
        </Reveal>
        <Reveal delay={120}><Phone paid={paid} run={run} onPay={onPay} big={big} /></Reveal>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */

export default function Page({ theme }: { theme: ProjectTheme }) {
  const { palette, story, features, architecture, bigNumbers } = theme;
  const [active, setActive] = useState(-1);
  const [tracing, setTracing] = useState(false);
  const n = architecture.length;
  const [numsRef, numsSeen] = useInView<HTMLDivElement>();

  useEffect(() => {
    if (!tracing) return;
    if (active >= n - 1) {
      setTracing(false);
      return;
    }
    const id = setTimeout(() => setActive((a) => a + 1), 950);
    return () => clearTimeout(id);
  }, [tracing, active, n]);

  const phrases: { phrase: string; kind: 'circle' | 'underline' }[] = [
    { phrase: 'phone', kind: 'circle' },
    { phrase: 'Two seconds', kind: 'underline' },
    { phrase: 'small object', kind: 'underline' },
  ];

  const rootVars = {
    ['--ink' as string]: palette.bg,
    ['--ink2' as string]: palette.bgMid,
    ['--paper' as string]: palette.text,
    ['--gold' as string]: palette.accent,
    ['--shade' as string]: palette.accent2 ?? '#F1E9D2',
  } as CSSProperties;

  return (
    <div className="eat-root" style={rootVars}>
      <style>{CSS}</style>
      <div className="eat-desk">
        <main className="eat-sheet">
          <span className="eat-holes" aria-hidden="true" />

          {/* HERO */}
          <header data-in="1" className="relative pb-6 md:pb-10">
            <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
              <div>
                <p className="font-mono text-xs tracking-[0.2em] uppercase eat-muted eat-fade" style={{ animationDelay: '0.05s' }}>{theme.kicker}</p>
                <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-2">
                  <h1 className="eat-lora eat-fade text-[clamp(3.4rem,15vw,8.5rem)] leading-[0.95] font-bold tracking-tight" style={{ animationDelay: '0.15s' }}>
                    EA Fees
                  </h1>
                  <div className="eat-stamp-slot"><Stamp on size="clamp(1.5rem,5vw,2.6rem)" delay="1.1s" /></div>
                </div>
                <p className="eat-lora eat-fade mt-5 max-w-xl text-xl italic leading-snug md:text-3xl" style={{ animationDelay: '0.3s' }}>
                  A coaching center&rsquo;s <span className="eat-hl">pocket</span> fee manager.
                </p>
                <p className="eat-hand eat-red eat-fade mt-4 flex items-center gap-2 text-2xl md:text-3xl" style={{ animationDelay: '0.5s' }}>
                  <svg width="30" height="30" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <path className="eat-draw" pathLength={1} style={{ animationDelay: '1.2s' }} d="M3 15 L11 23 L25 5" stroke="#B3261E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  a phone, not a ledger. Good work!
                </p>
                <dl className="eat-cover eat-fade mt-8 max-w-md text-sm" style={{ animationDelay: '0.7s' }}>
                  {[
                    ['Subject', 'Fee register, now a phone'],
                    ['Class', '10th · 11th · 12th'],
                    ['Boards', 'CBSE · State Board · ICSE'],
                    ['Where', 'Puducherry coaching center'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline gap-3 border-b border-[color:var(--ink)]/30 py-1.5">
                      <dt className="w-16 shrink-0 font-mono text-[11px] uppercase tracking-widest eat-muted">{k}</dt>
                      <dd className="eat-hand text-xl leading-tight">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <figure className="eat-fade w-full max-w-[22rem] lg:mx-auto lg:max-w-none" style={{ animationDelay: '0.45s' }}>
                <div className="eat-polaroid eat-tilt-r relative">
                  <span className="eat-tape" style={{ left: '38%', transform: 'rotate(3deg)' }} aria-hidden="true" />
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e6e1d3]">
                    <Image src="/work/ea-tuition-app/gallery-2.jpg" alt="An apple on a stack of books beside colored pencils and alphabet blocks" fill sizes="(min-width:1024px) 380px, 80vw" priority className="object-cover" />
                  </div>
                  <figcaption className="eat-hand pt-3 text-2xl leading-none">where the lesson starts</figcaption>
                </div>
              </figure>
            </div>
          </header>

          <BeforeAfter theme={theme} />

          {/* STORY */}
          <section aria-labelledby="eat-story" className="mt-24 md:mt-36">
            <Head no="02" eyebrow="margin notes" title="Three lines from the brief." note="underlined in red, for the record" />
            <h3 id="eat-story" className="sr-only">Quotes</h3>
            <ol className="grid gap-8 lg:grid-cols-3 lg:gap-6">
              {story.quotes.map((q, i) => (
                <li key={q.kicker}>
                  <Reveal delay={i * 110}>
                    <article className={`eat-page ${i % 2 ? 'eat-tilt-r' : 'eat-tilt-l'} relative h-full p-5 pt-7 md:p-6 md:pt-8`}>
                      <span className="eat-tape" style={{ left: '40%', transform: `rotate(${i % 2 ? 3 : -3}deg)` }} aria-hidden="true" />
                      <p className="font-mono text-[11px] tracking-[0.22em] uppercase eat-muted">Page {String(i + 1).padStart(2, '0')} / {q.kicker}</p>
                      <blockquote className="eat-lora mt-3 text-[1.3rem] italic leading-[1.4] md:text-[1.45rem]">
                        &ldquo;<Marked text={q.quote} phrase={phrases[i]?.phrase ?? ''} kind={phrases[i]?.kind ?? 'underline'} />&rdquo;
                      </blockquote>
                      <p className="eat-hand eat-red mt-5 border-t border-dashed border-[color:var(--ink)]/30 pt-3 text-[1.45rem] leading-snug">
                        {q.context}
                      </p>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ol>
          </section>

          {/* FEATURES */}
          <section aria-labelledby="eat-feat" className="mt-24 md:mt-36">
            <Head no="03" eyebrow="the register" title="Six things the new fee-book does." note="every row checked by the teacher" />
            <h3 id="eat-feat" className="sr-only">Features</h3>
            <ol className="eat-ledger">
              {features.map((f, i) => (
                <li key={f.title}>
                  <Reveal className="eat-row" delay={Math.min(i, 3) * 60}>
                    <div className="eat-row-in grid grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] items-start gap-x-3 gap-y-1 px-3 py-4 md:grid-cols-[3.5rem_minmax(0,0.9fr)_minmax(0,1.4fr)_3rem] md:items-center md:gap-x-6 md:px-5 md:py-5">
                      <span className="eat-hand eat-red row-span-2 pt-0.5 text-3xl leading-none md:row-span-1 md:text-4xl">{String(i + 1).padStart(2, '0')}</span>
                      <h4 className="eat-lora col-start-2 text-lg font-bold leading-snug md:text-xl">{f.title}</h4>
                      <p className="col-start-2 font-sans text-[0.95rem] leading-relaxed md:col-start-3 md:row-start-1 md:text-base">{f.desc}</p>
                      <svg className="col-start-3 row-span-2 row-start-1 self-center md:col-start-4 md:row-span-1" width="30" height="30" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                        <path className="eat-draw" pathLength={1} style={{ animationDelay: `${500 + i * 90}ms` }} d="M3 15 L11 23 L25 5" stroke="#B3261E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
            <p className="eat-hand eat-red mt-5 text-right text-3xl">{features.length} / {features.length} ✓</p>
          </section>

          {/* ARCHITECTURE */}
          <section aria-labelledby="eat-arch" className="mt-24 md:mt-36">
            <Head no="04" eyebrow="under the cover" title="What happens to one payment." note="follow the receipt, layer by layer" />
            <h3 id="eat-arch" className="sr-only">Architecture</h3>
            <button type="button" className="eat-btn mb-6" onClick={() => { setActive(0); setTracing(true); }} disabled={tracing}>
              {tracing ? 'Tracing…' : active >= n - 1 ? 'Trace it again' : 'Trace a payment'}
            </button>
            <ol className="eat-trace">
              {architecture.map((a, i) => {
                const state = i < active ? 'done' : i === active ? 'now' : 'idle';
                return (
                  <li key={a.layer} data-state={state} className="eat-step relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 pb-5 md:grid-cols-[3rem_9rem_minmax(0,1fr)] md:gap-x-6">
                    <button type="button" className="eat-dot" onClick={() => setActive(i)} aria-label={`Highlight layer ${a.layer}`} aria-pressed={i === active}>{i + 1}</button>
                    <div className="eat-card col-start-2 px-4 py-3 md:contents">
                      <h4 className="eat-lora self-center text-xl font-bold md:col-start-2 md:px-0">{a.layer}</h4>
                      <p className="eat-card-p mt-1 font-sans text-[0.95rem] leading-relaxed md:col-start-3 md:mt-0 md:self-center md:px-5 md:py-3">{a.details}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* MARKS */}
          <section aria-labelledby="eat-marks" className="mt-24 md:mt-36">
            <Head no="05" eyebrow="report card" title="The marks." note="circled in red pen" />
            <h3 id="eat-marks" className="sr-only">Big numbers</h3>
            <div ref={numsRef} data-in={numsSeen ? 1 : 0} className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {bigNumbers.map((b, i) => (
                <div key={b.label} className="eat-slip px-3 pb-5 pt-6 text-center md:px-5">
                  <div className="eat-lora relative mx-auto inline-block px-5 text-[clamp(3.6rem,11vw,6rem)] font-bold leading-none tabular-nums">
                    <Count to={parseInt(b.value, 10) || 0} run={numsSeen} />
                    <svg className="eat-mk-svg" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true" >
                      <path className="eat-draw" style={{ animationDelay: `${700 + i * 160}ms` }} pathLength={1} d="M14 20 C10 8 40 3 66 4 C92 6 99 24 76 34 C52 42 12 40 5 24 C1 13 20 6 44 5" />
                    </svg>
                  </div>
                  <p className="eat-hand mt-3 text-2xl leading-tight md:text-[1.7rem]">{b.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SCRAPBOOK */}
          <section aria-labelledby="eat-scrap" className="mt-24 md:mt-36">
            <Head no="06" eyebrow="pinned to the desk" title="Taped in the margins." note="the rooms and faces behind the fee-book" />
            <h3 id="eat-scrap" className="sr-only">Photos</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 lg:grid-cols-4 lg:gap-x-6">
              {SCRAP.map((s, i) => (
                <li key={s.n} className={i % 2 ? 'pt-4 md:pt-0' : ''}>
                  <Reveal delay={i * 90}>
                    <figure className={`eat-polaroid eat-sc-${i} relative`}>
                      <span className="eat-tape eat-tape-sm" style={{ left: `${30 + (i % 3) * 8}%`, transform: `rotate(${i % 2 ? 4 : -3}deg)` }} aria-hidden="true" />
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e6e1d3]">
                        <Image src={`/work/ea-tuition-app/gallery-${s.n}.jpg`} alt={s.alt} fill sizes="(min-width:1024px) 240px, (min-width:768px) 300px, 45vw" loading="lazy" className="object-cover" />
                      </div>
                      <figcaption className="eat-hand pt-2 text-xl leading-tight md:text-2xl">{s.cap}</figcaption>
                    </figure>
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>

          {/* OUTCOME */}
          <section aria-labelledby="eat-out" className="mt-24 md:mt-36 pb-28 md:pb-32">
            <Head no="07" eyebrow="teacher's remark" title="Last page." />
            <h3 id="eat-out" className="sr-only">Outcome</h3>
            <Reveal>
              <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12">
                <div className="eat-page relative p-6 md:p-10">
                  <span className="eat-tape" style={{ left: '8%', transform: 'rotate(-5deg)' }} aria-hidden="true" />
                  <p className="eat-hand eat-red text-3xl">Remark:</p>
                  <blockquote className="eat-lora mt-3 text-[1.5rem] italic leading-snug md:text-[2.1rem] md:leading-[1.25]">
                    &ldquo;{theme.outcomeQuote}&rdquo;
                  </blockquote>
                  <div className="mt-8 flex items-center justify-between gap-4">
                    <span className="eat-hand text-3xl">Good work ✓</span>
                    <ViewStamp size="clamp(1.6rem,6vw,2.6rem)" delay="0.5s" />
                  </div>
                </div>
                <figure className="eat-polaroid eat-tilt-r relative mx-auto w-full max-w-[15rem]">
                  <span className="eat-tape" style={{ left: '34%', transform: 'rotate(-3deg)' }} aria-hidden="true" />
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#2b2622]">
                    <Image src="/work/ea-tuition-app/gallery-6.jpg" alt="An open book floating between tall shelves of old books" fill sizes="240px" loading="lazy" className="object-cover" />
                  </div>
                  <figcaption className="eat-hand pt-3 text-2xl leading-none">the receipt book, retired</figcaption>
                </figure>
              </div>
            </Reveal>
          </section>
        </main>
      </div>
      <div style={{ color: palette.text }}>
        <NextChapter currentSlug="ea-tuition-app" accent={palette.accent} />
        <SiteFooter />
      </div>
    </div>
  );
}

/* ---------- styles ---------- */

const CSS = `
.eat-root{--red:#B3261E;--rule:rgba(47,86,135,.2);--muted:#5B4E2C;color:var(--ink);background:var(--ink)}
.eat-root *{box-sizing:border-box}
.eat-lora{font-family:var(--font-lora),Georgia,'Times New Roman',serif}
.eat-hand{font-family:var(--font-caveat),'Segoe Print','Comic Sans MS',cursive;font-weight:600}
.eat-red{color:var(--red)}
.eat-muted{color:var(--muted)}
.eat-pencil{color:#3d4a63}
.eat-desk{background:var(--ink);padding:0}
@media (min-width:768px){.eat-desk{padding:2.5rem 1.5rem 0}}
.eat-sheet{position:relative;max-width:1180px;margin:0 auto;background-color:var(--paper);
  background-image:repeating-linear-gradient(to bottom,transparent 0 31px,var(--rule) 31px 32px);
  padding:6rem 1rem 0 3.4rem;overflow-x:clip;box-shadow:0 18px 40px rgba(0,0,0,.28);font-family:var(--font-inter),system-ui,sans-serif}
.eat-sheet::before{content:'';position:absolute;top:0;bottom:0;left:2.4rem;width:5px;border-left:1.5px solid rgba(179,38,30,.6);border-right:1.5px solid rgba(179,38,30,.6)}
@media (min-width:768px){
  .eat-sheet{padding:9rem 3rem 0 8.5rem;border-radius:3px}
  .eat-sheet::before{left:6.5rem}
}
.eat-holes{display:none}
@media (min-width:768px){
  .eat-holes{display:block;position:absolute;left:1.1rem;top:0;bottom:0;width:30px;
    background:radial-gradient(circle at 15px 50%,var(--ink) 0 10px,rgba(0,0,0,.35) 11px,transparent 12px) 0 0/30px 360px repeat-y}
}
/* reveal */
.eat-rv{opacity:0;transform:translateY(18px);transition:opacity .65s ease,transform .65s ease}
.eat-rv[data-in='1']{opacity:1;transform:none}
@keyframes eat-fade{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.eat-fade{opacity:0;animation:eat-fade .7s ease forwards}
/* line drawing */
.eat-draw{stroke:var(--red);fill:none;stroke-dasharray:1.05;stroke-dashoffset:1.05}
@keyframes eat-dash{to{stroke-dashoffset:0}}
[data-in='1'] .eat-draw{animation:eat-dash 1s .35s ease forwards}
.eat-arrow .eat-draw{stroke:#B3261E}
/* marks */
.eat-mk{position:relative;display:inline-block;white-space:nowrap}
.eat-mk-svg{position:absolute;inset:-14% -10%;width:120%;height:128%;pointer-events:none;overflow:visible}
.eat-mk-svg path{stroke-width:2.4;stroke-linecap:round;vector-effect:non-scaling-stroke}
.eat-mk-ul{position:absolute;left:0;right:0;bottom:-.18em;width:100%;height:.35em;pointer-events:none;overflow:visible}
.eat-mk-ul path{stroke-width:3;stroke-linecap:round;vector-effect:non-scaling-stroke}
.eat-hl{background:linear-gradient(transparent 55%,color-mix(in srgb,var(--gold) 75%,transparent) 55%);padding:0 .1em}
/* paper objects */
.eat-tape{position:absolute;top:-12px;width:88px;height:24px;background:color-mix(in srgb,var(--gold) 55%,#fff);opacity:.9;z-index:2}
.eat-tape-sm{width:64px;height:20px;top:-10px}
.eat-sc-0{transform:rotate(-2.2deg)}.eat-sc-1{transform:rotate(1.8deg)}.eat-sc-2{transform:rotate(1.2deg)}.eat-sc-3{transform:rotate(-1.6deg)}
.eat-tilt-l{transform:rotate(-1deg)}
.eat-tilt-r{transform:rotate(1.2deg)}
.eat-book{background:#FFFDF5;border:1px solid rgba(30,58,95,.25);box-shadow:3px 5px 0 rgba(30,58,95,.12);border-left:6px double rgba(179,38,30,.55);overflow:hidden}
.eat-page{background:#FFFDF5;border:1px solid rgba(30,58,95,.2);box-shadow:3px 5px 0 rgba(30,58,95,.1)}
.eat-polaroid{background:#fff;padding:10px 10px 14px;box-shadow:2px 6px 0 rgba(30,58,95,.14),0 0 0 1px rgba(30,58,95,.12)}
.eat-smudge{position:absolute;right:-50px;top:-24px;width:170px;height:70px;background:radial-gradient(ellipse at 50% 50%,rgba(30,58,95,.2),transparent 68%);transform:rotate(-14deg);pointer-events:none}
.eat-slip{background:#FFFDF5;border:1px solid rgba(30,58,95,.2);box-shadow:2px 4px 0 rgba(30,58,95,.1)}
/* stamp */
.eat-stamp{display:inline-flex;font-family:var(--font-archivo),Impact,sans-serif;font-size:var(--s,2.2rem);line-height:1;letter-spacing:.12em;color:#B3261E;
  border:4px double #B3261E;border-radius:10px;padding:.22em .5em .16em;opacity:0;transform:rotate(-12deg) scale(2.3);transform-origin:center}
.eat-stamp[data-on='1']{animation:eat-slam .55s cubic-bezier(.2,1.3,.4,1) var(--d,0s) forwards}
@keyframes eat-slam{0%{opacity:0;transform:rotate(-3deg) scale(2.4)}55%{opacity:.95;transform:rotate(-13deg) scale(.93)}100%{opacity:.92;transform:rotate(-12deg) scale(1)}}
.eat-stamp-slot{padding:0 .5rem .4rem 0}
/* phone */
.eat-phone{background:#FFFDF5;border:8px solid var(--ink);border-radius:30px;overflow:hidden;box-shadow:4px 8px 0 rgba(30,58,95,.18)}
.eat-phone-bar{background:var(--ink);color:var(--paper)}
.eat-chip{flex:1;text-align:center;border:1px solid rgba(30,58,95,.4);border-radius:999px;padding:.4rem 0;font-size:.8rem;font-weight:600;min-height:36px;display:inline-flex;align-items:center;justify-content:center}
.eat-chip-on{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.eat-status{font-size:.75rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border-radius:999px;padding:.3rem .7rem;background:var(--gold);color:var(--ink);transition:background .3s,color .3s;min-width:4.6rem;text-align:center}
.eat-status[data-paid='1']{background:var(--ink);color:var(--paper)}
.eat-btn{min-height:44px;padding:.6rem 1.2rem;border-radius:8px;background:var(--gold);color:var(--ink);font-weight:700;font-size:.95rem;border:2px solid var(--ink);box-shadow:2px 3px 0 var(--ink);cursor:pointer;transition:transform .15s,box-shadow .15s}
.eat-btn:hover:not(:disabled){transform:translate(-1px,-1px);box-shadow:3px 4px 0 var(--ink)}
.eat-btn:active:not(:disabled){transform:translate(1px,1px);box-shadow:1px 1px 0 var(--ink)}
.eat-btn:disabled{opacity:.7;cursor:default}
.eat-recwrap{overflow:hidden;min-height:15.5rem;background:repeating-linear-gradient(135deg,rgba(30,58,95,.06) 0 6px,transparent 6px 12px);border-radius:4px}
.eat-rec{background:#fff;box-shadow:0 2px 0 rgba(30,58,95,.2);transform:translateY(-102%);transition:transform .95s cubic-bezier(.3,.8,.3,1);
  clip-path:polygon(0 0,100% 0,100% 96%,96% 100%,92% 96%,88% 100%,84% 96%,80% 100%,76% 96%,72% 100%,68% 96%,64% 100%,60% 96%,56% 100%,52% 96%,48% 100%,44% 96%,40% 100%,36% 96%,32% 100%,28% 96%,24% 100%,20% 96%,16% 100%,12% 96%,8% 100%,4% 96%,0 100%)}
.eat-phone[data-paid='1'] .eat-rec{transform:none}
.eat-leader{flex:1;border-bottom:1.5px dotted rgba(30,58,95,.5);min-width:8px;transform:translateY(3px)}
.eat-bar{display:inline-block;width:3.2rem;height:.6rem;border-radius:3px;background:rgba(30,58,95,.25)}
.eat-bar-lg{width:4.4rem;height:.8rem;background:rgba(30,58,95,.45)}
/* ledger rows */
.eat-ledger{background:#FFFDF5;border:1px solid rgba(30,58,95,.25);border-top:3px double rgba(30,58,95,.6);box-shadow:3px 5px 0 rgba(30,58,95,.1)}
.eat-row{position:relative;border-bottom:1px dashed rgba(30,58,95,.3)}
li:last-child>.eat-row{border-bottom:0}
.eat-row::before{content:'';position:absolute;inset:0;background:color-mix(in srgb,var(--gold) 28%,transparent);transform:scaleX(0);transform-origin:left;transition:transform .4s ease;pointer-events:none}
.eat-row:hover::before{transform:scaleX(1)}
.eat-row-in{position:relative}
/* trace */
.eat-step::after{content:'';position:absolute;left:1.3rem;top:2.75rem;bottom:0;width:0;border-left:2px dashed rgba(30,58,95,.45)}
.eat-step:last-child::after{display:none}
.eat-step[data-state='done']::after{border-left-style:solid;border-left-color:var(--red)}
.eat-dot{width:2.75rem;height:2.75rem;border-radius:50%;border:2px solid var(--ink);background:#FFFDF5;font-family:var(--font-lora),serif;font-weight:700;font-size:1.1rem;cursor:pointer;z-index:1;transition:background .3s,color .3s,transform .3s}
.eat-step[data-state='done'] .eat-dot{background:var(--red);border-color:var(--red);color:#fff}
.eat-step[data-state='now'] .eat-dot{background:var(--gold);transform:scale(1.12)}
.eat-card{background:#FFFDF5;border:1px solid rgba(30,58,95,.22);transition:background .3s,border-color .3s}
.eat-step[data-state='now'] .eat-card{background:color-mix(in srgb,var(--gold) 38%,#FFFDF5);border-color:var(--ink)}
@media (min-width:768px){
  .eat-card{display:contents;background:none;border:0}
  .eat-step{background:#FFFDF5;border:1px solid rgba(30,58,95,.22);padding:.8rem 1rem .8rem 0;margin-bottom:1rem;align-items:center;transition:background .3s,border-color .3s;grid-template-columns:3.25rem 9rem minmax(0,1fr)}
  .eat-step::after{left:calc(1.625rem - 1px);top:auto;bottom:-1rem;height:1rem}
  .eat-step{padding-left:0;padding-bottom:.8rem}
  .eat-step .eat-dot{margin-left:.5rem}
  .eat-step[data-state='now']{background:color-mix(in srgb,var(--gold) 38%,#FFFDF5);border-color:var(--ink)}
}
/* focus */
.eat-root a:focus-visible,.eat-root button:focus-visible{outline:3px solid #B3261E;outline-offset:3px}
/* reduced motion */
@media (prefers-reduced-motion:reduce){
  .eat-rv,.eat-fade{opacity:1;transform:none;animation:none;transition:none}
  .eat-draw{stroke-dashoffset:0;animation:none!important}
  .eat-stamp,.eat-stamp[data-on='1']{animation:none;opacity:.92;transform:rotate(-12deg)}
  .eat-rec{transition:none}
  .eat-row::before,.eat-dot,.eat-btn{transition:none}
}
`;
