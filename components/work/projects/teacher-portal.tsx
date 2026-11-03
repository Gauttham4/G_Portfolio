'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

/* ------------------------------------------------------------------ */
/* Tokens                                                              */
/* ------------------------------------------------------------------ */
const CHALK = '#F1EEDF';
const DIM = '#BCCBBD';
const YELLOW = '#F2D675';
const PINK = '#F6A9B1';
const BURGUNDY = '#722F37';
const INK = '#1F1A14';
const hand = { fontFamily: 'var(--font-caveat), "Comic Sans MS", cursive' } as const;

const ROLES = [
  { id: 'CLASS_ADVISOR', scope: 'Department-scoped read and write', fwd: 'HOD', reports: 'Reports link hidden from the sidebar' },
  { id: 'HOD', scope: 'The whole department', fwd: 'DEAN', reports: 'Batch-wise approval percentages' },
  { id: 'DEAN', scope: 'Institution-wide read', fwd: 'Top of the chain, nothing above', reports: 'Department-wise drill-down' },
  { id: 'STUDENT_COUNSELOR', scope: 'Institution-wide read for counselling work', fwd: 'No forwarding', reports: 'No report page, search the same data with filters instead' },
  { id: 'PLACEMENT_OFFICER', scope: 'Institution-wide read for the placement pipeline', fwd: 'No forwarding', reports: 'No report page, a scoped read of the same data' },
] as const;

const CHAIN = ['CLASS_ADVISOR', 'HOD', 'DEAN'] as const;
const GALLERY_ALT = [
  'A teacher at a chalkboard while pupils in a classroom raise their hands',
  'A book hovering open between tall stacks of old books',
  'Schoolchildren seated at wooden desks, listening to a lesson',
  'A seminar crowd seated at tables listening to two speakers on a stage',
  'A tiered lecture hall facing a projector screen',
  'An apple on a stack of books beside coloured pencils and ABC blocks',
];
const GALLERY_POS = ['50% 40%', '50% 46%', '50% 35%', '50% 60%', '50% 55%', '50% 60%'];
const GALLERY_ROT = [-2.2, 1.8, -1.4, 2.4, -1.8, 1.4];
const TILES = 36;

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

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`tp-rv ${seen ? 'tp-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Tick({ on, size = 26, color = YELLOW, delay = 0, anim = false }: { on?: boolean; size?: number; color?: string; delay?: number; anim?: boolean }) {
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true" className="shrink-0">
      <path
        d="M4 15.5 L11 22 L24.5 5.5"
        pathLength={1}
        fill="none"
        stroke={color}
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={anim ? 'tp-tick tp-tick-a' : `tp-tick ${on ? 'tp-on' : ''}`}
        style={{ transitionDelay: `${delay}ms`, animationDelay: `${delay}ms` }}
      />
    </svg>
  );
}

function Ruler({ label }: { label?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="mx-auto w-full max-w-6xl px-4 md:px-8 my-14 md:my-20" aria-hidden="true">
      <div className={`tp-ruler ${seen ? 'tp-in' : ''}`}>
        {label && <span className="tp-ruler-label">{label}</span>}
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <Reveal className="mb-8 md:mb-12 max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.22em]" style={{ color: DIM }}>{eyebrow}</p>
      <h2 className="mt-2 leading-[0.95]" style={{ ...hand, color: YELLOW, fontSize: 'clamp(2.6rem, 8vw, 4.8rem)', fontWeight: 700 }}>{title}</h2>
      {note && <p className="mt-3 text-[15px] md:text-base leading-relaxed" style={{ color: DIM }}>{note}</p>}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function Page({ theme }: { theme: ProjectTheme }) {
  const [roleIdx, setRoleIdx] = useState(0);
  const [excluded, setExcluded] = useState<number[]>([]);
  const [stage, setStage] = useState(0);
  const [msg, setMsg] = useState('');
  const [gridRef, gridSeen] = useInView<HTMLDivElement>();
  const [regRef, regSeen] = useInView<HTMLOListElement>();

  const role = ROLES[roleIdx];
  const included = TILES - excluded.length;
  const quotes = theme.story.quotes;
  const gallery = theme.gallery ?? [];

  const toggleTile = (n: number) => {
    setExcluded((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));
    setMsg('');
  };
  const forward = () => {
    if (stage < 2) {
      setStage(stage + 1);
      setMsg(`${included} profiles forwarded to ${CHAIN[stage + 1]}.`);
    } else {
      setMsg('Your role cannot perform batch forwarding');
    }
  };
  const reset = () => {
    setStage(0);
    setMsg('');
    setExcluded([]);
  };

  return (
    <main className="tp text-[color:var(--tp-chalk)] overflow-x-clip" style={{ ['--tp-chalk' as string]: CHALK }}>
      <style>{CSS}</style>

      {/* ============================ HERO ============================ */}
      <section className="px-4 md:px-8 pt-24 md:pt-36 pb-6 min-h-[88svh] flex flex-col">
        <div className="mx-auto w-full max-w-6xl flex-1 flex flex-col">
          <div className="tp-frame flex-1 flex">
            <div className="tp-board relative flex-1 overflow-hidden px-5 py-8 md:px-12 md:py-14 grid gap-8 md:gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-center">
              {[8, 22, 38, 55, 71, 86].map((l, i) => (
                <span key={l} className="tp-dust" style={{ left: `${l}%`, animationDelay: `${i * 1.1}s` }} aria-hidden="true" />
              ))}
              <div className="relative">
                <p className="font-mono text-xs md:text-[13px] uppercase tracking-[0.2em] tp-up" style={{ color: DIM, animationDelay: '.1s' }}>{theme.kicker}</p>
                <h1 className="mt-3 leading-[0.82] whitespace-nowrap" style={{ ...hand, fontWeight: 700, fontSize: 'var(--tp-h1)' }}>
                  <span className="tp-up inline-block" style={{ animationDelay: '.25s' }}>Teach</span>
                  <span className="tp-up inline-block" style={{ animationDelay: '.45s', color: YELLOW }}>Desk</span>
                </h1>
                <svg viewBox="0 0 400 24" className="w-full max-w-[24rem] -mt-1" aria-hidden="true">
                  <path d="M4 14 C 70 3, 150 22, 240 9 S 360 14, 396 6" pathLength={1} fill="none" stroke={PINK} strokeWidth={4} strokeLinecap="round" className="tp-line" />
                </svg>
                <p className="mt-5 max-w-md tp-up" style={{ ...hand, fontSize: 'clamp(1.7rem, 5vw, 2.4rem)', lineHeight: 1.1, animationDelay: '.7s' }}>{theme.subtitle}</p>
                <p className="mt-5 text-sm md:text-[15px] max-w-md tp-up" style={{ color: DIM, animationDelay: '.9s' }}>
                  The faculty half of a student portal pair. Same MySQL, five roles, one desk.
                </p>
              </div>

              {/* paper slip with stamp */}
              <div className="relative mx-auto w-full max-w-sm lg:max-w-none tp-slip-wrap">
                <div className="tp-paper p-5 md:p-6 pb-12 md:pb-14 rotate-[1.5deg]">
                  <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: '#5C5042' }}>Profile review</p>
                  <h2 className="mt-1 text-[1.9rem] leading-none" style={{ ...hand, color: INK, fontWeight: 700 }}>Roll call</h2>
                  <ul className="mt-3">
                    {ROLES.map((r, i) => (
                      <li key={r.id} className="flex items-center justify-between gap-3 border-b border-dashed py-1.5" style={{ borderColor: 'rgba(31,26,20,.25)' }}>
                        <span className="font-mono text-[12px] md:text-[13px] tracking-wide" style={{ color: INK }}>{r.id}</span>
                        <Tick anim size={22} color={BURGUNDY} delay={900 + i * 180} />
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[13px]" style={{ color: '#4A3F33' }}>Approve, reject or return, with a free-text remark.</p>
                </div>
                <div className="tp-stamp" aria-hidden="true">APPROVED</div>
              </div>
            </div>
          </div>
          {/* chalk tray */}
          <div className="tp-tray" aria-hidden="true">
            <i className="tp-chalk" style={{ left: '12%', background: CHALK }} />
            <i className="tp-chalk" style={{ left: '19%', background: YELLOW, transform: 'rotate(-6deg)' }} />
            <i className="tp-chalk" style={{ left: '25%', background: PINK, width: 22 }} />
            <i className="tp-eraser" style={{ right: '10%' }} />
          </div>
        </div>
      </section>

      <Ruler label="cm" />

      {/* ============================ LESSONS ============================ */}
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <SectionHead eyebrow="Notes from the margin" title="Today's lessons" note="Three lines from the build story, written up where the teacher can see them." />
        <div className="space-y-10 md:space-y-14">
          {quotes.map((q, i) => (
            <Reveal key={q.kicker} className={`max-w-3xl ${i === 1 ? 'md:ml-auto md:text-right' : i === 2 ? 'md:ml-16' : ''}`}>
              <p className="font-mono text-xs uppercase tracking-[0.22em]" style={{ color: DIM }}>{q.kicker.replace('Quote', 'Lesson')}</p>
              <blockquote className="mt-2 leading-[1.02]" style={{ ...hand, fontWeight: 600, fontSize: 'clamp(2rem, 6vw, 3.6rem)', color: [CHALK, PINK, YELLOW][i % 3] }}>
                {'“'}{q.quote}{'”'}
              </blockquote>
              <p className="mt-3 text-[15px] leading-relaxed" style={{ color: DIM }}>{q.context}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Ruler />

      {/* ============================ ROLES ============================ */}
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <SectionHead eyebrow="Who sits at the desk" title="Five roles, one schema" note="Role is a session column. It decides which slice of data you see and who you may forward to." />
        <Reveal>
          <div className="tp-board rounded-2xl border border-white/15 p-4 md:p-8">
            <div role="tablist" aria-label="Faculty roles" className="flex flex-wrap gap-2">
              {ROLES.map((r, i) => (
                <button
                  key={r.id}
                  role="tab"
                  id={`tp-tab-${i}`}
                  aria-selected={roleIdx === i}
                  aria-controls="tp-panel"
                  onClick={() => setRoleIdx(i)}
                  className={`tp-tab ${roleIdx === i ? 'tp-tab-on' : ''}`}
                >
                  {r.id}
                </button>
              ))}
            </div>
            <div id="tp-panel" role="tabpanel" aria-labelledby={`tp-tab-${roleIdx}`} key={role.id} className="tp-swap mt-6 grid gap-5 md:grid-cols-3">
              {[['Sees', role.scope], ['Forwards to', role.fwd], ['Reports', role.reports]].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-dashed border-white/25 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: DIM }}>{k}</p>
                  <p className="mt-2 leading-tight" style={{ ...hand, fontSize: '1.9rem', fontWeight: 600, color: CHALK }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <Ruler />

      {/* ============================ REGISTER ============================ */}
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <SectionHead eyebrow="The class register" title="What TeachDesk does" note="Every feature, marked present." />
        <div className="tp-paper tp-notebook overflow-hidden">
          <div className="hidden md:grid grid-cols-[4.5rem_16rem_1fr_5rem] gap-4 px-8 py-3 font-mono text-xs uppercase tracking-[0.2em] border-b-2" style={{ color: '#5C5042', borderColor: BURGUNDY }}>
            <span>Roll</span><span>Feature</span><span>Remarks</span><span className="text-center">Present</span>
          </div>
          <ol ref={regRef}>
            {theme.features.map((f, i) => (
              <li key={f.title} className="tp-row grid grid-cols-[2.6rem_1fr_2.2rem] md:grid-cols-[4.5rem_16rem_1fr_5rem] items-center gap-x-3 md:gap-x-4 px-4 md:px-8 py-4">
                <span className="font-mono text-sm" style={{ color: BURGUNDY }}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="leading-none" style={{ ...hand, color: INK, fontWeight: 700, fontSize: 'clamp(1.6rem, 4.5vw, 2rem)' }}>{f.title}</h3>
                <span className="md:order-4 md:justify-self-center"><Tick on={regSeen} color={BURGUNDY} delay={i * 160} /></span>
                <p className="col-start-2 col-span-2 md:col-span-1 md:col-start-3 md:row-start-1 mt-2 md:mt-0 text-[15px] leading-snug" style={{ color: '#3E352B' }}>{f.desc}</p>
              </li>
            ))}
          </ol>
          <div className="flex items-center justify-between px-4 md:px-8 py-3 border-t-2 font-mono text-xs uppercase tracking-[0.2em]" style={{ borderColor: BURGUNDY, color: '#5C5042' }}>
            <span>Total present</span>
            <span style={{ color: BURGUNDY, fontWeight: 700 }}>{theme.features.length} / {theme.features.length}</span>
          </div>
        </div>
      </section>

      <Ruler />

      {/* ============================ BATCH ============================ */}
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <SectionHead
          eyebrow="Batch operations"
          title="The friction is the feature"
          note="Every name about to move is on the page, with an exclude toggle per row. Tap a tile to exclude it, then forward the batch up the chain. An illustration, no real student data."
        />
        <div
          role="status"
          aria-live="polite"
          className={`tp-banner mb-5 ${msg.startsWith('Your') ? 'tp-banner-err' : ''}`}
        >
          <span className="font-mono text-xs uppercase tracking-[0.18em] shrink-0">{msg.startsWith('Your') ? 'Error' : 'Status'}</span>
          <span className="tp-banner-msg" style={{ ...hand, fontSize: '1.7rem', fontWeight: 600, lineHeight: 1.05 }}>
            {msg || (stage === 2 ? 'Top of the chain. Forward once more to see the real error.' : `${included} profiles ready. Forward them to ${CHAIN[stage + 1]}.`)}
          </span>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_21rem]">
          <Reveal>
            <div className="tp-board rounded-2xl border border-white/15 p-4 md:p-6">
              <div ref={gridRef} className="grid grid-cols-6 md:grid-cols-12 gap-2">
                {Array.from({ length: TILES }, (_, k) => {
                  const n = k + 1;
                  const out = excluded.includes(n);
                  return (
                    <button
                      key={n}
                      type="button"
                      aria-pressed={out}
                      aria-label={`Roll ${n}, ${out ? 'excluded' : 'included'}`}
                      onClick={() => toggleTile(n)}
                      className={`tp-tile ${out ? 'tp-tile-out' : ''}`}
                    >
                      <span className="font-mono text-[13px] leading-none" style={{ color: out ? DIM : CHALK, textDecoration: out ? 'line-through' : 'none' }}>{String(n).padStart(2, '0')}</span>
                      {out ? (
                        <svg viewBox="0 0 28 28" width={20} height={20} aria-hidden="true"><path d="M6 6 L22 22 M22 6 L6 22" stroke={PINK} strokeWidth={3.2} strokeLinecap="round" fill="none" /></svg>
                      ) : (
                        <Tick on={gridSeen} size={20} delay={k * 38} />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em]" style={{ color: DIM }}>
                {included} will move · {excluded.length} excluded
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="tp-paper p-5 md:p-6 h-full">
              <h3 style={{ ...hand, color: INK, fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>Forwarding chain</h3>
              <p className="mt-1 text-[13px]" style={{ color: '#4A3F33' }}>Enforced in PHP, so the error is human.</p>
              <ol className="mt-4">
                {CHAIN.map((c, i) => (
                  <li key={c}>
                    <div className={`tp-node ${stage === i ? 'tp-node-on' : ''}`}>
                      <span className="font-mono text-[13px] tracking-wide">{c}</span>
                      {stage > i ? <Tick anim size={20} color={BURGUNDY} /> : stage === i ? <span className="font-mono text-xs uppercase">here</span> : null}
                    </div>
                    {i < 2 && <div className={`tp-link ${stage > i ? 'tp-link-on' : ''}`} aria-hidden="true" />}
                  </li>
                ))}
              </ol>
              <button type="button" onClick={forward} disabled={included === 0} className="tp-btn mt-5 w-full">
                {included === 0 ? 'Nothing selected' : stage < 2 ? `Forward ${included} to ${CHAIN[stage + 1]}` : 'Forward again'}
              </button>
              <button type="button" onClick={reset} className="mt-2 w-full min-h-11 font-mono text-xs uppercase tracking-[0.18em] underline underline-offset-4" style={{ color: BURGUNDY }}>Reset the batch</button>
            </div>
          </Reveal>
        </div>
      </section>

      <Ruler />

      {/* ============================ TIMETABLE ============================ */}
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <SectionHead eyebrow="The timetable" title="Four periods, one stack" />
        <ol className="tp-board rounded-2xl border border-white/15 divide-y divide-dashed divide-white/25">
          {theme.architecture.map((a, i) => (
            <li key={a.layer}>
              <Reveal delay={i * 80} className="grid grid-cols-[3.6rem_1fr] md:grid-cols-[6rem_14rem_1fr] gap-x-4 gap-y-1 items-baseline p-4 md:p-6">
                <span style={{ ...hand, color: PINK, fontSize: '2.4rem', fontWeight: 700, lineHeight: 1 }}>P{i + 1}</span>
                <h3 className="font-mono text-sm md:text-[15px] uppercase tracking-[0.16em]" style={{ color: YELLOW }}>{a.layer}</h3>
                <p className="col-start-2 md:col-start-3 text-[15px] md:text-base leading-relaxed">{a.details}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <Ruler />

      {/* ============================ SCOREBOARD ============================ */}
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <SectionHead eyebrow="Marks on the board" title="The scoreboard" />
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {theme.bigNumbers.map((b, i) => (
            <li key={b.label} className="h-full">
              <Score value={b.value} label={b.label} delay={i * 120} />
            </li>
          ))}
        </ul>
      </section>

      <Ruler />

      {/* ============================ PINBOARD ============================ */}
      {gallery.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionHead eyebrow="Pinned to the board" title="Around the school" />
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((g, i) => (
              <li key={g.src}>
                <Reveal delay={i * 90}>
                  <figure className="tp-polaroid" style={{ ['--tp-rot' as string]: `${GALLERY_ROT[i % GALLERY_ROT.length]}deg` } as CSSProperties}>
                    <span className="tp-tape" aria-hidden="true" />
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/10">
                      <Image
                        src={g.src}
                        alt={GALLERY_ALT[i] ?? g.alt}
                        fill
                        sizes="(min-width:1024px) 22vw, (min-width:640px) 44vw, 88vw"
                        className="object-cover"
                        style={{ objectPosition: GALLERY_POS[i] ?? '50% 50%' }}
                      />
                    </div>
                    <figcaption className="mt-2 font-mono text-xs uppercase tracking-[0.16em]" style={{ color: '#4A3F33' }}>{g.caption}</figcaption>
                  </figure>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Ruler />

      {/* ============================ OUTCOME ============================ */}
      <section className="mx-auto max-w-4xl px-4 md:px-8 pb-24 md:pb-28 text-center">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em]" style={{ color: DIM }}>Last line on the board</p>
          <blockquote className="mt-4 leading-[1.05]" style={{ ...hand, fontWeight: 600, fontSize: 'clamp(2.1rem, 6.4vw, 4rem)', color: CHALK }}>
            {'“'}{theme.outcomeQuote}{'”'}
          </blockquote>
          <svg viewBox="0 0 300 20" className="mx-auto mt-4 w-56" aria-hidden="true">
            <path d="M4 12 C 60 2, 120 18, 180 8 S 270 12, 296 6" pathLength={1} fill="none" stroke={YELLOW} strokeWidth={4} strokeLinecap="round" className="tp-line tp-line-view" />
          </svg>
        </Reveal>
      </section>

      <NextChapter currentSlug="teacher-portal" accent={YELLOW} />
      <SiteFooter />
    </main>
  );
}

function Score({ value, label, delay }: { value: string; label: string; delay: number }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="tp-board rounded-2xl border border-white/15 px-3 py-6 md:py-8 text-center h-full flex flex-col items-center justify-between gap-3">
      <div className="relative flex items-center justify-center w-28 h-24 md:w-36 md:h-28">
        <svg viewBox="0 0 120 90" className="absolute inset-0 w-full h-full" aria-hidden="true" preserveAspectRatio="none">
          <ellipse cx="60" cy="45" rx="55" ry="39" pathLength={1} fill="none" stroke={PINK} strokeWidth={2.4} strokeLinecap="round" className={`tp-ring ${seen ? 'tp-on' : ''}`} style={{ transitionDelay: `${delay + 200}ms` }} />
        </svg>
        <p className={`tp-pop ${seen ? 'tp-on' : ''} relative`} style={{ ...hand, fontWeight: 700, fontSize: 'clamp(3.4rem, 11vw, 5rem)', lineHeight: 1, color: YELLOW, transitionDelay: `${delay}ms` }}>{value}</p>
      </div>
      <p className="font-mono text-xs md:text-[13px] uppercase tracking-[0.18em]" style={{ color: CHALK }}>{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */
const CSS = `
.tp{background:#172B23;background-image:radial-gradient(70% 40% at 15% 6%,rgba(255,255,255,.05),transparent 70%),radial-gradient(60% 40% at 90% 60%,rgba(255,255,255,.04),transparent 70%);min-height:100svh}
.tp *{box-sizing:border-box}
.tp{--tp-h1:clamp(3.9rem,18vw,9rem)}
@media(min-width:1024px){.tp{--tp-h1:clamp(5rem,10vw,9rem)}}
.tp a:focus-visible,.tp button:focus-visible{outline:2px solid ${YELLOW};outline-offset:3px;border-radius:6px}
.tp-paper a:focus-visible,.tp-paper button:focus-visible{outline-color:${BURGUNDY}}
.tp-board{background:radial-gradient(110% 70% at 18% 8%,rgba(255,255,255,.07),transparent 60%),radial-gradient(90% 60% at 88% 92%,rgba(255,255,255,.05),transparent 60%),#1F3D32}
.tp-frame{padding:10px;border-radius:14px;background:linear-gradient(135deg,#9A6A3A,#6B4423 45%,#8A5A2E);box-shadow:0 14px 28px rgba(0,0,0,.35)}
@media(min-width:768px){.tp-frame{padding:16px}}
.tp-frame .tp-board{border-radius:6px;box-shadow:inset 0 0 0 2px rgba(0,0,0,.35),inset 0 8px 24px rgba(0,0,0,.35)}
.tp-tray{position:relative;height:16px;margin:0 2%;border-radius:0 0 8px 8px;background:linear-gradient(#8A5A2E,#5A3A1F);box-shadow:0 8px 14px rgba(0,0,0,.35)}
.tp-chalk{position:absolute;top:-8px;width:34px;height:9px;border-radius:3px}
.tp-eraser{position:absolute;top:-14px;width:54px;height:15px;border-radius:3px;background:linear-gradient(#3b3b3b 0 60%,#C9A46B 60%)}
.tp-paper{background:#F4ECD8;color:${INK};border-radius:10px;box-shadow:0 10px 24px rgba(0,0,0,.35)}
.tp-notebook{background:#F4ECD8 repeating-linear-gradient(transparent 0 33px,rgba(60,90,140,.07) 33px 34px)}
.tp-row{border-bottom:1px solid rgba(92,80,66,.22);transition:background-color .2s}
.tp-row:hover{background-color:rgba(114,47,55,.07)}
.tp-row:last-child{border-bottom:0}
.tp-tab{min-height:44px;padding:0 14px;border-radius:999px;border:1.5px dashed rgba(241,238,223,.45);font-family:var(--font-jetbrains),ui-monospace,monospace;font-size:12px;letter-spacing:.08em;color:${CHALK};background:transparent;transition:transform .2s,background-color .2s}
.tp-tab:hover{transform:translateY(-2px)}
.tp-tab-on{background:${YELLOW};color:${INK};border-style:solid;border-color:${YELLOW};font-weight:700}
.tp-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-height:56px;border-radius:8px;border:1.5px solid rgba(241,238,223,.3);background:rgba(0,0,0,.12);transition:transform .15s,background-color .2s}
.tp-tile:hover{transform:translateY(-2px);background:rgba(241,238,223,.08)}
.tp-tile-out{border-style:dashed;border-color:${PINK};background:transparent}
.tp-node{display:flex;align-items:center;justify-content:space-between;min-height:44px;padding:0 14px;border-radius:8px;border:1.5px dashed rgba(31,26,20,.4);color:${INK};transition:background-color .3s}
.tp-node-on{background:${YELLOW};border-style:solid;border-color:${INK}}
.tp-link{width:2px;height:22px;margin-left:24px;background:repeating-linear-gradient(${INK} 0 4px,transparent 4px 8px)}
.tp-link-on{background:${BURGUNDY}}
.tp-banner{display:flex;align-items:center;gap:14px;min-height:64px;padding:10px 16px;border-radius:10px;border:1.5px dashed rgba(241,238,223,.4);color:${CHALK};background:rgba(0,0,0,.14)}
.tp-banner .font-mono{color:${DIM}}
.tp-banner-err{background:${BURGUNDY};border:1.5px solid ${PINK};color:#FFF6E6}
.tp-banner-err .font-mono{color:${PINK}}
.tp-btn{min-height:48px;border-radius:8px;background:${BURGUNDY};color:#FFF6E6;font-family:var(--font-jetbrains),ui-monospace,monospace;font-size:13px;letter-spacing:.06em;font-weight:700;transition:transform .15s,background-color .2s}
.tp-btn:hover:not(:disabled){background:#8E4047;transform:translateY(-2px)}
.tp-btn:disabled{opacity:.55}
.tp-ruler{position:relative;height:38px;border-radius:4px;transform-origin:left center;transform:scaleX(.001);transition:transform 1s cubic-bezier(.2,.7,.2,1);
 background:repeating-linear-gradient(90deg,#3A2410 0 1.5px,transparent 1.5px 40px) 0 100%/100% 17px no-repeat,repeating-linear-gradient(90deg,#3A2410 0 1px,transparent 1px 8px) 0 100%/100% 9px no-repeat,linear-gradient(180deg,#E0B570,#C28F45);box-shadow:0 4px 10px rgba(0,0,0,.35)}
.tp-ruler.tp-in{transform:none}
.tp-ruler-label{position:absolute;left:12px;top:5px;font:700 12px var(--font-jetbrains),monospace;color:#3A2410}
.tp-polaroid{position:relative;background:#F4ECD8;padding:10px 10px 14px;border-radius:3px;box-shadow:0 10px 20px rgba(0,0,0,.4);transform:rotate(var(--tp-rot,0deg));transition:transform .3s}
.tp-polaroid:hover{transform:rotate(0deg) translateY(-4px)}
.tp-tape{position:absolute;top:-10px;left:50%;width:70px;height:20px;margin-left:-35px;background:rgba(242,214,117,.85);transform:rotate(-3deg)}
.tp-rv{opacity:0;transform:translateY(20px);transition:opacity .7s ease-out,transform .7s ease-out}
.tp-rv.tp-in{opacity:1;transform:none}
.tp-tick{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .55s ease-out}
.tp-tick.tp-on{stroke-dashoffset:0}
.tp-tick-a{animation:tp-draw .55s ease-out both}
.tp-line{stroke-dasharray:1;stroke-dashoffset:1;animation:tp-draw 1.1s .7s ease-out forwards}
.tp-line-view{animation:none;stroke-dashoffset:0}
.tp-ring{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1s ease-out}
.tp-ring.tp-on{stroke-dashoffset:0}
.tp-pop{opacity:0;transform:scale(.6) rotate(-6deg);transition:opacity .5s,transform .6s cubic-bezier(.3,1.5,.5,1)}
.tp-pop.tp-on{opacity:1;transform:none}
.tp-up{opacity:0;animation:tp-up .8s ease-out forwards}
.tp-swap{animation:tp-up .4s ease-out both}
.tp-stamp{position:absolute;right:-4px;bottom:-14px;padding:6px 14px;border:3px double ${BURGUNDY};border-radius:6px;background:rgba(244,236,216,.92);color:${BURGUNDY};font:800 1.35rem var(--font-archivo),Impact,sans-serif;letter-spacing:.12em;transform:rotate(-9deg);opacity:0;animation:tp-stamp .45s 1.3s cubic-bezier(.3,1.4,.5,1) forwards}
.tp-dust{position:absolute;bottom:8%;width:5px;height:5px;border-radius:50%;background:${CHALK};opacity:0;animation:tp-dust 7s linear infinite}
@keyframes tp-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes tp-up{from{opacity:0;transform:translateY(22px) rotate(-2deg)}to{opacity:1;transform:none}}
@keyframes tp-stamp{from{opacity:0;transform:rotate(-9deg) scale(1.8)}to{opacity:1;transform:rotate(-9deg) scale(1)}}
@keyframes tp-dust{0%{opacity:0;transform:translateY(0)}20%{opacity:.5}100%{opacity:0;transform:translateY(-160px)}}
@media(prefers-reduced-motion:reduce){
 .tp *{animation:none!important;transition:none!important}
 .tp-rv,.tp-up,.tp-pop,.tp-stamp{opacity:1!important;transform:none!important}
 .tp-stamp{transform:rotate(-9deg)!important}
 .tp-ruler{transform:none!important}
 .tp-tick,.tp-ring,.tp-line{stroke-dashoffset:0!important}
 .tp-dust{display:none}
}
`;
