'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

/* ---------- tokens ---------- */
const C = {
  bg: '#F6FBF9',
  white: '#FFFFFF',
  ink: '#12302A',
  mute: '#3F5F57',
  teal: '#0FBF9F',
  tealDeep: '#086B58',
  mint: '#DDF4ED',
  line: '#CFE6DF',
  amber: '#F4A93C',
  night: '#0F2A23',
};
const SERIF = 'var(--font-lora), Georgia, "Times New Roman", serif';
const SANS = 'var(--font-manrope), system-ui, -apple-system, "Segoe UI", sans-serif';

const MEDS = ['Ibuprofen', 'Paracetamol', 'Aspirin', 'Amoxicillin', 'Metformin', 'Cetirizine', 'Omeprazole', 'Loratadine'];
const QUICK = ['Ibuprofen', 'Paracetamol', 'Aspirin'];

const SLOTS = [
  { k: 'Description', icon: 'pill', text: 'A short paragraph describing the drug lands here, parsed from the first section of the reply.' },
  { k: 'Dosage', icon: 'clock', text: 'Recommended dosing guidelines arrive as plain, readable text in their own slot.' },
  { k: 'Precautions', icon: 'alert', text: 'Things to watch for, rendered as a bullet list so the card is easy to scan.' },
  { k: 'Side effects', icon: 'tri', text: 'Common adverse reactions, also a bullet list. Same shape on every search.' },
] as const;

const STEPS = [
  {
    k: 'Prompt',
    d: 'A numbered four-section spec, without insisting on literal headings. Strict about the shape, relaxed about the wording.',
    code: [
      { t: 'Return exactly four numbered sections:' },
      { t: '1. Brief description', c: 'hl' },
      { t: '2. Dosage', c: 'hl' },
      { t: '3. Precautions', c: 'hl' },
      { t: '4. Side effects', c: 'hl' },
    ],
  },
  {
    k: 'Split',
    d: 'The reply is split on double newlines. Each block maps to one positional slot.',
    code: [
      { t: '1. Brief description: …', c: 'hl' },
      { t: '' },
      { t: '2. Dosage: …', c: 'hl' },
      { t: '' },
      { t: '3. Precautions: …', c: 'hl' },
      { t: '' },
      { t: '4. Side effects: …', c: 'hl' },
    ],
  },
  {
    k: 'Strip',
    d: 'A tolerant regex per section strips preambles such as "1. Brief description:" before the text is stored.',
    code: [
      { t: '− 1. Brief description: …', c: 'rm' },
      { t: '+ …', c: 'add' },
      { t: '' },
      { t: '(same for the other three sections)', c: 'dim' },
    ],
  },
  {
    k: 'Render',
    d: 'A missing section shows a fallback string, so a partial reply still renders something useful.',
    code: [
      { t: 'description  → "…"', c: 'add' },
      { t: 'dosage       → "…"', c: 'add' },
      { t: 'description missing', c: 'rm' },
      { t: '  → "No description available"', c: 'add' },
    ],
  },
] as const;

/* ---------- hooks / helpers ---------- */
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
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`ms-rv ${seen ? 'ms-in' : ''} ${className}`} style={{ '--d': `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

function Count({ value, run }: { value: string; run: boolean }) {
  const target = parseInt(value, 10) || 0;
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1100);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);
  return <>{n}</>;
}

/* ---------- icons ---------- */
function Cross({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true" fill="currentColor">
      <path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z" />
    </svg>
  );
}
function Ico({ name, className = 'h-5 w-5' }: { name: string; className?: string }) {
  const p: Record<string, ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    x: <path d="M6 6l12 12M18 6 6 18" />,
    pill: <><path d="M10.5 20.5a5 5 0 0 1-7-7l9-9a5 5 0 0 1 7 7z" /><path d="m8.5 8.5 7 7" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    alert: <><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 16.5v.5" /></>,
    tri: <><path d="M12 3 2.5 20h19z" /><path d="M12 10v5M12 17.5v.5" /></>,
  };
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {p[name]}
    </svg>
  );
}
function Capsule({ className = '', a = C.teal, b = C.white, style }: { className?: string; a?: string; b?: string; style?: CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-full ${className}`}
      style={{ background: `linear-gradient(90deg, ${a} 50%, ${b} 50%)`, border: `2px solid ${C.ink}`, boxShadow: `inset -6px -6px 0 rgba(18,48,42,0.08)`, ...style }}
    />
  );
}

function Eyebrow({ n, children }: { n: string; children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em]" style={{ borderColor: C.line, background: C.white, color: C.tealDeep }}>
      <Cross className="h-3.5 w-3.5" style={{ color: C.teal }} />
      <span>Rx {n}</span>
      <span aria-hidden="true" style={{ color: C.line }}>|</span>
      <span>{children}</span>
    </p>
  );
}

/* ---------- page ---------- */
export default function Page({ theme }: { theme: ProjectTheme }) {
  const { story, features, architecture, bigNumbers, outcomeQuote } = theme;
  const gallery = theme.gallery ?? [1, 2, 3, 4, 5, 6].map((i) => ({ src: `/work/medicine-search/gallery-${i}.jpg`, caption: `Reference ${i}`, alt: `Pharmacy reference ${i}` }));

  /* search demo state */
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [phase, setPhase] = useState<'idle' | 'loading' | 'done'>('idle');
  const [res, setRes] = useState<{ name: string; known: boolean } | null>(null);
  const [runId, setRunId] = useState(0);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const needle = q.trim().toLowerCase();
  const matches = (needle ? [...MEDS.filter((m) => m.toLowerCase().startsWith(needle)), ...MEDS.filter((m) => !m.toLowerCase().startsWith(needle) && m.toLowerCase().includes(needle))] : MEDS).slice(0, 5);
  const showList = open && phase !== 'loading' && matches.length > 0;

  function search(raw: string) {
    const name = raw.trim();
    if (!name || phase === 'loading') return;
    setQ(name);
    setOpen(false);
    setActive(-1);
    setPhase('loading');
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const hit = MEDS.find((m) => m.toLowerCase() === name.toLowerCase());
      setRes({ name: hit ?? name, known: !!hit });
      setRunId((r) => r + 1);
      setPhase('done');
    }, 1400);
  }
  function clear() {
    if (timer.current) window.clearTimeout(timer.current);
    setQ('');
    setRes(null);
    setPhase('idle');
    setActive(-1);
  }
  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a + 1) % matches.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a <= 0 ? matches.length - 1 : a - 1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      search(showList && active >= 0 ? matches[active] : q);
    }
  }

  /* stepper */
  const [step, setStep] = useState(0);
  const st = STEPS[step];

  /* counters + architecture draw */
  const [numRef, numSeen] = useInView<HTMLDivElement>();
  const [archRef, archSeen] = useInView<HTMLOListElement>();

  return (
    <main className="ms-root min-h-svh overflow-x-clip" style={{ background: C.bg, color: C.ink, fontFamily: SANS }}>
      <style>{`
        .ms-root *{box-sizing:border-box}
        .ms-f:focus-visible{outline:3px solid ${C.tealDeep};outline-offset:3px}
        .ms-rv{opacity:0;transform:translateY(18px);transition:opacity .6s ease var(--d,0ms),transform .6s cubic-bezier(.16,1,.3,1) var(--d,0ms)}
        .ms-rv.ms-in{opacity:1;transform:none}
        .ms-float{animation:ms-float 7s ease-in-out infinite}
        .ms-float2{animation:ms-float 9s ease-in-out -3s infinite}
        @keyframes ms-float{0%,100%{transform:translateY(0) rotate(var(--r,0deg))}50%{transform:translateY(-14px) rotate(calc(var(--r,0deg) + 6deg))}}
        .ms-ring{animation:ms-ring 3.2s ease-out infinite}
        @keyframes ms-ring{0%{transform:scale(.9);opacity:.5}100%{transform:scale(1.7);opacity:0}}
        .ms-root input:focus,.ms-root input:focus-visible{outline:none;box-shadow:none}
        .ms-form:focus-within{outline:3px solid ${C.tealDeep};outline-offset:3px}
        .ms-spin{animation:ms-spin 1s linear infinite}
        @keyframes ms-spin{to{transform:rotate(360deg)}}
        .ms-fall{animation:ms-fall .7s cubic-bezier(.34,1.56,.64,1) both;animation-delay:var(--d,0ms)}
        @keyframes ms-fall{0%{transform:translateY(-44px);opacity:0}60%{opacity:1}100%{transform:none;opacity:1}}
        .ms-pop{animation:ms-pop .45s cubic-bezier(.16,1,.3,1) both}
        @keyframes ms-pop{from{transform:translateY(8px);opacity:0}to{transform:none;opacity:1}}
        .ms-marq{display:flex;width:max-content;animation:ms-marq 38s linear infinite}
        @keyframes ms-marq{to{transform:translateX(-50%)}}
        .ms-card{transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s ease,border-color .3s ease}
        .ms-card:hover{transform:translateY(-4px);box-shadow:0 14px 30px -14px rgba(8,107,88,.35);border-color:${C.teal}}
        .ms-card:hover .ms-cap{transform:rotate(-28deg) scale(1.08)}
        .ms-cap{transition:transform .4s cubic-bezier(.34,1.56,.64,1)}
        .ms-line{transition:transform 1.6s cubic-bezier(.65,0,.35,1)}
        .ms-lv{transform:scaleY(0);transform-origin:top}
        .ms-lh{transform:scaleX(0);transform-origin:left}
        .ms-line.ms-in{transform:none}
        .ms-shelf img{transition:transform .8s cubic-bezier(.16,1,.3,1)}
        .ms-shelf:hover img{transform:scale(1.06)}
        @media (prefers-reduced-motion: reduce){
          .ms-float,.ms-float2,.ms-ring,.ms-marq,.ms-spin{animation:none}
          .ms-rv{opacity:1;transform:none;transition:none}
          .ms-fall,.ms-pop{animation:none}
          .ms-line{transform:none;transition:none}
          .ms-card,.ms-cap,.ms-shelf img{transition:none}
        }
      `}</style>

      {/* ================= HERO ================= */}
      <header className="relative px-4 pt-24 pb-16 md:min-h-[64svh] md:px-10 md:pt-36 md:pb-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${C.line} 1.5px, transparent 1.5px)`, backgroundSize: '28px 28px', opacity: 0.7 }} />
          <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: `linear-gradient(to top, ${C.bg}, transparent)` }} />
          <Capsule className="ms-float absolute h-9 w-20 xl:hidden" style={{ right: -22, top: 70, ['--r' as string]: '-28deg' }} />
          <Capsule className="ms-float2 absolute h-7 w-16 xl:hidden" a={C.amber} style={{ right: 30, top: 128, ['--r' as string]: '35deg' }} />
          <Capsule className="ms-float absolute hidden h-24 w-56 xl:block" style={{ right: '7%', top: 150, ['--r' as string]: '-32deg' }} />
          <Capsule className="ms-float2 absolute hidden h-16 w-36 xl:block" a={C.amber} style={{ right: '22%', top: 300, ['--r' as string]: '24deg' }} />
          <Capsule className="ms-float absolute hidden h-12 w-28 xl:block" a={C.tealDeep} style={{ right: '4%', top: 340, ['--r' as string]: '58deg' }} />
          <Cross className="ms-float2 absolute hidden h-20 w-20 xl:block" style={{ right: '30%', top: 150, color: C.mint, ['--r' as string]: '0deg' }} />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <p className="inline-flex max-w-full items-center rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em]" style={{ borderColor: C.line, background: C.white, color: C.tealDeep }}>
            <span className="truncate">{theme.kicker}</span>
          </p>

          <div className="mt-7 flex items-center gap-4 md:gap-6">
            <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl md:h-20 md:w-20 md:rounded-3xl" style={{ background: C.teal, color: C.white, boxShadow: `0 10px 24px -10px ${C.tealDeep}` }}>
              <span className="ms-ring absolute inset-0 rounded-2xl md:rounded-3xl" style={{ border: `2px solid ${C.teal}` }} aria-hidden="true" />
              <Cross className="h-8 w-8 md:h-12 md:w-12" />
            </div>
            <h1 className="font-semibold leading-[0.95] tracking-tight" style={{ fontFamily: SERIF, fontSize: 'clamp(2.9rem, 12vw, 7.5rem)' }}>
              Medi<span style={{ color: C.tealDeep }}>Find</span>
            </h1>
          </div>

          <p className="mt-5 max-w-xl text-xl italic leading-snug md:mt-7 md:text-3xl" style={{ fontFamily: SERIF, color: C.mute }}>
            {theme.subtitle}
          </p>

          {/* search */}
          <div
            className="relative mt-8 md:mt-10"
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false); }}
          >
            <form
              role="search"
              onSubmit={(e) => { e.preventDefault(); search(showList && active >= 0 ? matches[active] : q); }}
              className="ms-form flex h-16 items-center gap-1 rounded-full border-2 bg-white pl-4 pr-1.5 md:h-[4.5rem] md:pl-6 md:pr-2"
              style={{ borderColor: C.teal, boxShadow: `0 18px 40px -22px ${C.tealDeep}` }}
            >
              <Ico name="search" className="h-5 w-5 shrink-0 md:h-6 md:w-6" />
              <input
                type="text"
                role="combobox"
                aria-label="Medicine name"
                aria-expanded={showList}
                aria-controls="ms-list"
                aria-autocomplete="list"
                aria-activedescendant={showList && active >= 0 ? `ms-opt-${active}` : undefined}
                autoComplete="off"
                spellCheck={false}
                value={q}
                disabled={phase === 'loading'}
                placeholder="Enter medicine name..."
                onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); }}
                onFocus={() => setOpen(true)}
                onKeyDown={onKey}
                className="h-full min-w-0 flex-1 bg-transparent px-2 text-base outline-none placeholder:text-[#5E7F76] disabled:opacity-60 md:px-3 md:text-xl"
                style={{ color: C.ink, fontFamily: SANS }}
              />
              {q && phase !== 'loading' && (
                <button type="button" onClick={clear} aria-label="Clear search" className="ms-f grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-[#DDF4ED]">
                  <Ico name="x" className="h-5 w-5" />
                </button>
              )}
              <button
                type="submit"
                disabled={phase === 'loading'}
                className="ms-f inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-base font-extrabold transition-transform enabled:hover:scale-[1.03] disabled:opacity-60 md:h-14 md:px-8 md:text-lg"
                style={{ background: C.teal, color: C.ink }}
                aria-label="Search"
              >
                {phase === 'loading' ? (
                  <svg viewBox="0 0 24 24" className="ms-spin h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9" /></svg>
                ) : (
                  <span>Search</span>
                )}
              </button>
            </form>

            {showList && (
              <ul id="ms-list" role="listbox" aria-label="Suggested medicines" className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-3xl border bg-white py-2" style={{ borderColor: C.line, boxShadow: `0 24px 40px -20px ${C.tealDeep}` }}>
                {matches.map((m, i) => {
                  const at = needle ? m.toLowerCase().indexOf(needle) : -1;
                  return (
                    <li
                      key={m}
                      id={`ms-opt-${i}`}
                      role="option"
                      aria-selected={i === active}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => search(m)}
                      onMouseEnter={() => setActive(i)}
                      className="flex min-h-12 cursor-pointer items-center gap-3 px-4 text-base md:px-5"
                      style={{ background: i === active ? C.mint : 'transparent' }}
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: C.mint, color: C.tealDeep }}><Ico name="pill" className="h-4 w-4" /></span>
                      <span>
                        {at >= 0 ? (<>{m.slice(0, at)}<strong style={{ color: C.tealDeep }}>{m.slice(at, at + needle.length)}</strong>{m.slice(at + needle.length)}</>) : m}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="mt-4 flex min-h-11 flex-wrap items-center gap-2" aria-live="polite">
            {phase === 'loading' ? (
              <p className="px-2 text-sm font-semibold" style={{ color: C.tealDeep }}>This can take a moment…</p>
            ) : (
              <>
                <span className="px-2 text-sm font-semibold" style={{ color: C.mute }}>Try</span>
                {QUICK.map((m) => (
                  <button key={m} type="button" onClick={() => search(m)} className="ms-f inline-flex min-h-11 items-center rounded-full border bg-white px-4 text-sm font-bold transition-colors hover:bg-[#DDF4ED]" style={{ borderColor: C.line }}>
                    {m}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* results */}
          {phase === 'done' && res && (
            <section key={runId} aria-label={`Result for ${res.name}`} className="mt-8">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-semibold md:text-4xl" style={{ fontFamily: SERIF }}>{res.name}</h2>
                <span className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider" style={{ background: C.mint, color: C.tealDeep }}>Layout preview</span>
              </div>
              {res.known ? (
                <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                  {SLOTS.map((s, i) => (
                    <article key={s.k} className="ms-fall relative overflow-hidden rounded-2xl border bg-white py-5 pl-7 pr-5" style={{ '--d': `${i * 150}ms`, borderColor: C.line } as CSSProperties}>
                      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-2" style={{ background: C.amber }} />
                      <h3 className="flex items-center gap-2 text-lg font-extrabold" style={{ color: C.tealDeep }}>
                        <Ico name={s.icon} className="h-5 w-5" />
                        {s.k}
                      </h3>
                      <p className="mt-2 text-base leading-relaxed" style={{ color: C.mute }}>{s.text}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <article className="ms-fall relative overflow-hidden rounded-2xl border bg-white py-5 pl-7 pr-5" style={{ borderColor: C.line }}>
                  <span aria-hidden="true" className="absolute inset-y-0 left-0 w-2" style={{ background: C.amber }} />
                  <p className="text-lg leading-relaxed" style={{ fontFamily: SERIF }}>
                    I don&rsquo;t have reliable information about &ldquo;{res.name}&rdquo;. The card still renders gracefully, and tells you to ask a pharmacist.
                  </p>
                </article>
              )}
              <p className="mt-4 flex items-start gap-2 text-sm font-semibold leading-snug" style={{ color: C.mute }}>
                <Ico name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                Information from AI · verify with a pharmacist or physician. This is a layout demo, no medical content is shown.
              </p>
            </section>
          )}
        </div>
      </header>

      {/* ================= MARQUEE ================= */}
      <div className="overflow-hidden border-y py-4" style={{ borderColor: C.line, background: C.white }} aria-hidden="true">
        <div className="ms-marq">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0">
              {[...MEDS, ...MEDS].map((m, i) => (
                <span key={`${k}-${i}`} className="mr-3 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold" style={{ borderColor: C.line, background: i % 3 === 0 ? C.mint : C.white, color: C.tealDeep }}>
                  <Cross className="h-3 w-3" style={{ color: C.teal }} />
                  {m}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ================= QUOTES ================= */}
      <section className="px-4 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow n="01">The prompt was the product</Eyebrow>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl" style={{ fontFamily: SERIF }}>
              One question, asked <em style={{ color: C.tealDeep }}>the same way</em> every time.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-3 lg:gap-6">
            {story.quotes.map((qt, i) => (
              <Reveal key={qt.kicker} delay={i * 120} className={i === 1 ? 'lg:mt-10' : ''}>
                <figure className="relative h-full overflow-hidden rounded-3xl border bg-white py-7 pl-9 pr-6 md:py-9" style={{ borderColor: C.line }}>
                  <span aria-hidden="true" className="absolute inset-y-0 left-0 w-3" style={{ background: C.amber }} />
                  <figcaption className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em]" style={{ color: C.tealDeep }}>
                    <span className="grid h-6 w-6 place-items-center rounded-full" style={{ background: C.teal, color: C.white }}><Cross className="h-3 w-3" /></span>
                    {qt.kicker}
                  </figcaption>
                  <blockquote className="mt-4 text-2xl font-medium leading-snug" style={{ fontFamily: SERIF }}>
                    &ldquo;{qt.quote}&rdquo;
                  </blockquote>
                  <p className="mt-4 border-t pt-4 text-base leading-relaxed" style={{ borderColor: C.line, color: C.mute }}>{qt.context}</p>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PARSER STEPPER ================= */}
      <section className="px-4 py-16 md:px-10 md:py-24" style={{ background: C.mint }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow n="02">From free text to four slots</Eyebrow>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl" style={{ fontFamily: SERIF }}>
              The parser got forgiving where the prompt stayed strict.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
              <div>
                <div role="tablist" aria-label="Parsing steps" className="grid grid-cols-2 gap-2">
                  {STEPS.map((s, i) => (
                    <button
                      key={s.k}
                      role="tab"
                      id={`ms-tab-${i}`}
                      aria-selected={i === step}
                      aria-controls="ms-panel"
                      onClick={() => setStep(i)}
                      className="ms-f flex min-h-12 items-center justify-center gap-2 rounded-full border-2 px-4 text-base font-extrabold transition-colors"
                      style={{ borderColor: C.teal, background: i === step ? C.teal : C.white, color: C.ink }}
                    >
                      <span className="grid h-6 w-6 place-items-center rounded-full text-xs" style={{ background: i === step ? C.ink : C.mint, color: i === step ? C.white : C.tealDeep }}>{i + 1}</span>
                      {s.k}
                    </button>
                  ))}
                </div>
                <p key={step} className="ms-pop mt-5 text-lg leading-relaxed" style={{ color: C.ink }}>{st.d}</p>
              </div>
              <div id="ms-panel" role="tabpanel" aria-labelledby={`ms-tab-${step}`} className="overflow-hidden rounded-3xl" style={{ background: C.night }}>
                <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: '1px solid rgba(232,245,240,0.15)' }}>
                  <span className="h-3 w-3 rounded-full" style={{ background: C.amber }} />
                  <span className="h-3 w-3 rounded-full" style={{ background: C.teal }} />
                  <span className="h-3 w-3 rounded-full" style={{ background: '#E8F5F0' }} />
                  <span className="ml-2 text-xs font-semibold" style={{ color: '#B9D8CF', fontFamily: 'var(--font-plex), ui-monospace, monospace' }}>step {step + 1} of 4 · illustrative</span>
                </div>
                <pre key={step} className="ms-pop min-h-[15rem] overflow-x-auto whitespace-pre-wrap break-words px-5 py-5 text-sm leading-7 md:text-[15px]" style={{ fontFamily: 'var(--font-plex), ui-monospace, monospace', color: '#E8F5F0' }}>
                  {st.code.map((l, i) => {
                    const c = 'c' in l ? l.c : undefined;
                    const color = c === 'hl' ? '#5BD6B6' : c === 'rm' ? '#FFB4A8' : c === 'add' ? '#9BE8C9' : c === 'dim' ? '#9DBFB5' : '#E8F5F0';
                    return <span key={i} style={{ display: 'block', minHeight: '1.75rem', color }}>{l.t}</span>;
                  })}
                </pre>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="px-4 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow n="03">What is on the card</Eyebrow>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl" style={{ fontFamily: SERIF }}>
              Six small decisions, one calm screen.
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <li key={f.title}>
                <Reveal delay={(i % 3) * 100} className="h-full">
                  <article className="ms-card h-full rounded-[28px] border bg-white p-6" style={{ borderColor: C.line }}>
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex h-9 min-w-[3.25rem] items-center justify-center rounded-full px-3 text-sm font-extrabold" style={{ background: C.mint, color: C.tealDeep }}>{String(i + 1).padStart(2, '0')}</span>
                      <Capsule className="ms-cap h-6 w-14 shrink-0" a={i % 2 ? C.amber : C.teal} />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold leading-snug" style={{ fontFamily: SERIF }}>{f.title}</h3>
                    <p className="mt-2 text-base leading-relaxed" style={{ color: C.mute }}>{f.desc}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= ARCHITECTURE ================= */}
      <section className="px-4 pb-20 md:px-10 md:pb-28">
        <div className="mx-auto max-w-6xl rounded-[2rem] border px-5 py-10 md:px-10 md:py-14" style={{ borderColor: C.line, background: C.white }}>
          <Reveal>
            <Eyebrow n="04">Four layers</Eyebrow>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl" style={{ fontFamily: SERIF }}>
              A blister pack of a stack.
            </h2>
          </Reveal>
          <ol ref={archRef} className="relative mt-10 grid gap-5 pl-14 lg:mt-14 lg:grid-cols-4 lg:gap-4 lg:pl-0 lg:pt-16">
            <span aria-hidden="true" className={`ms-line ms-lv absolute left-[21px] top-3 bottom-3 w-0.5 lg:hidden ${archSeen ? 'ms-in' : ''}`} style={{ background: C.teal }} />
            <span aria-hidden="true" className={`ms-line ms-lh absolute left-[12.5%] top-5 hidden h-0.5 w-[75%] lg:block ${archSeen ? 'ms-in' : ''}`} style={{ background: C.teal }} />
            {architecture.map((a, i) => (
              <li key={a.layer} className="relative">
                <span className="absolute -left-14 top-0 grid h-11 w-11 place-items-center rounded-full border-2 text-base font-extrabold lg:-top-16 lg:left-1/2 lg:-translate-x-1/2" style={{ background: C.white, borderColor: C.teal, color: C.tealDeep }}>
                  {i + 1}
                </span>
                <Reveal delay={i * 120} className="h-full">
                  <div className="h-full rounded-[1.75rem] border p-5" style={{ borderColor: C.line, background: C.bg }}>
                    <h3 className="text-xl font-semibold" style={{ fontFamily: SERIF, color: C.tealDeep }}>{a.layer}</h3>
                    <p className="mt-2 text-base leading-relaxed" style={{ color: C.mute }}>{a.details}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= NUMBERS ================= */}
      <section className="px-4 pb-20 md:px-10 md:pb-28">
        <div ref={numRef} className="mx-auto grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {bigNumbers.map((b, i) => (
            <Reveal key={b.label} delay={i * 90}>
              <div className="flex h-full min-h-[10rem] flex-col items-center justify-center rounded-[2.5rem] px-3 py-7 text-center md:min-h-[12rem]" style={{ background: i % 2 ? C.teal : C.night, color: i % 2 ? C.ink : '#E8F5F0' }}>
                <p className="text-6xl font-semibold leading-none md:text-7xl" style={{ fontFamily: SERIF, color: i % 2 ? C.ink : '#5BD6B6' }}>
                  <Count value={b.value} run={numSeen} />
                  {/^s\s/.test(b.label) && <span className="ml-0.5 text-4xl md:text-5xl">s</span>}
                </p>
                <p className="mt-3 text-sm font-bold uppercase tracking-[0.1em] md:text-base">{b.label.replace(/^s\s/, '')}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="px-4 pb-20 md:px-10 md:pb-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow n="05">The pharmacy shelf</Eyebrow>
          </Reveal>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-8 md:gap-y-12">
            {gallery.slice(0, 6).map((g, i) => (
              <li key={g.src} className={i % 3 === 1 ? 'md:mt-12' : ''}>
                <Reveal delay={(i % 3) * 100}>
                  <figure>
                    <div className="ms-shelf relative aspect-[2/3] w-full overflow-hidden rounded-full border-4 bg-white" style={{ borderColor: C.white, boxShadow: `0 16px 30px -18px ${C.tealDeep}` }}>
                      <Image src={g.src} alt={g.alt && !/reference image/i.test(g.alt) ? g.alt : `${g.caption.toLowerCase()} (stock photo)`} fill sizes="(min-width: 768px) 30vw, 46vw" className="object-cover" loading="eager" />
                    </div>
                    <figcaption className="mt-3 text-center text-sm font-bold uppercase tracking-[0.1em]" style={{ color: C.tealDeep }}>{g.caption}</figcaption>
                  </figure>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= OUTCOME + END ================= */}
      <div style={{ background: C.night, color: '#E8F5F0' }}>
        <section className="relative overflow-hidden px-4 pt-20 pb-16 md:px-10 md:pt-28 md:pb-24">
          <Cross className="absolute -right-10 -top-10 h-56 w-56 md:h-80 md:w-80" style={{ color: 'rgba(15,191,159,0.12)' }} />
          <Reveal>
            <div className="relative mx-auto max-w-4xl text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl" style={{ background: C.teal, color: C.ink }}><Cross className="h-8 w-8" /></span>
              <h2 className="sr-only">Outcome</h2>
              <p className="mt-8 text-3xl font-medium leading-snug md:text-5xl md:leading-tight" style={{ fontFamily: SERIF }}>
                &ldquo;{outcomeQuote}&rdquo;
              </p>
              <p className="mx-auto mt-8 inline-flex max-w-full items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold" style={{ borderColor: 'rgba(232,245,240,0.3)', color: '#B9E8DA' }}>
                <Ico name="alert" className="h-4 w-4 shrink-0" />
                <span>Information from AI. Not legal cover, honesty.</span>
              </p>
            </div>
          </Reveal>
        </section>
        <NextChapter currentSlug={theme.slug} accent={C.teal} />
      </div>
      <SiteFooter />
    </main>
  );
}
