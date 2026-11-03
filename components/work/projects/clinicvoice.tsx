'use client';

// ClinicVoice: VOICE microsite. Waveform hero, a call that plays out in Tamil + English,
// a mock calendar that fills when the call books, a signal-path diagram and a README-style limits card.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

const SKY = '#5AC8FA';
const VIOLET = '#8E9BFF';
const INK = '#0b1d33';
const TEXT = '#EAF2FF';
const DIM = '#9DB2D0';
const SORA = "var(--font-sora), 'Sora', system-ui, sans-serif";
const MONO = "var(--font-plex), 'IBM Plex Mono', ui-monospace, monospace";
const TAMIL = "var(--font-sora), 'Noto Sans Tamil', 'Nirmala UI', 'Latha', system-ui, sans-serif";
const GRAD = `linear-gradient(100deg, ${SKY} 0%, ${VIOLET} 100%)`;

// ---- illustrative call (not a real transcript) --------------------------------
type Msg = { who: 'a' | 'c' | 'sys'; lang?: string; text: string; gloss?: string; chip?: string };
const MSGS: Msg[] = [
  { who: 'a', lang: 'EN', text: 'Hello, ClinicVoice here. How can I help?', chip: 'cached greeting, no dead air' },
  { who: 'c', lang: 'TA + EN', text: 'வணக்கம், நாளைக்கு doctor appointment வேணும்.', gloss: 'Hello, I need a doctor appointment tomorrow.' },
  { who: 'a', lang: 'TA', text: 'நாளை காலை 11:30-க்கு நேரம் இருக்கிறது. பதிவு செய்—', gloss: "There's a slot tomorrow at 11:30. Shall I bo—" },
  { who: 'c', lang: 'TA + EN', text: 'ஆமா, book பண்ணுங்க.', gloss: 'Yes, book it.', chip: 'barge-in, about 50 ms' },
  { who: 'sys', text: 'Calendar write succeeded' },
  { who: 'a', lang: 'TA + EN', text: 'பதிவு confirmed. நாளை காலை 11:30. நன்றி!', gloss: 'Booked. Tomorrow 11:30 AM. Thank you!' },
];
const DELAYS = [800, 1700, 1900, 1700, 1500, 0];
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const TIMES = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30'];
const BUSY = new Set(['0-1', '1-3', '2-0', '2-4', '3-2', '4-1', '4-4', '1-0', '3-5']);
const SLIDE_HEADS = ["Answers the clinic's phone.", 'Confirmed means confirmed.', 'One live path, two fallbacks.', 'Guardrails, evals, tests.', 'One codebase, many clinics.', "What it can't do yet."];
const PATH = ['Caller', 'WebSocket server', 'Pipecat frames', 'Gemini Live session', 'Nine call tools', 'Google Calendar'];

const CSS = `
.cv-bar{flex:1 1 0;min-width:2px;max-width:16px;border-radius:999px;transform-origin:50% 50%;animation:cv-bar var(--d,1.6s) ease-in-out infinite;animation-delay:var(--dl,0s);background:linear-gradient(180deg,${SKY},${VIOLET})}
@keyframes cv-bar{0%,100%{transform:scaleY(var(--lo,.2))}50%{transform:scaleY(var(--hi,1))}}
.cv-rv{opacity:0;transform:translateY(16px);transition:opacity .6s ease,transform .7s cubic-bezier(.2,.7,.2,1)}
.cv-in{opacity:1;transform:none}
.cv-msg{opacity:0;visibility:hidden;transform:translateY(12px) scale(.98);transition:opacity .4s ease,transform .5s cubic-bezier(.2,.7,.2,1),visibility 0s .5s}
.cv-msg.on{opacity:1;visibility:visible;transform:none;transition-delay:0s}
.cv-ring{position:absolute;inset:0;border-radius:999px;border:2px solid ${SKY};animation:cv-ring 2s ease-out infinite}
@keyframes cv-ring{0%{transform:scale(.7);opacity:.7}100%{transform:scale(2.2);opacity:0}}
.cv-pulse{animation:cv-pulse 1.1s ease-in-out infinite}
@keyframes cv-pulse{0%,100%{box-shadow:0 0 0 0 rgba(90,200,250,.55)}50%{box-shadow:0 0 0 6px rgba(90,200,250,0)}}
.cv-hop::after{content:'';position:absolute;inset:0;border-radius:inherit;background:${SKY};opacity:0;animation:cv-hop 4.8s ease-in-out infinite;animation-delay:var(--dl,0s);pointer-events:none}
@keyframes cv-hop{0%,18%,100%{opacity:0}6%{opacity:.28}}
.cv-meter{transform-origin:50% 100%;animation:cv-meter var(--d,1.4s) ease-in-out infinite;animation-delay:var(--dl,0s)}
@keyframes cv-meter{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
.cv-card{transition:transform .25s ease,border-color .25s ease,background-color .25s ease}
.cv-card:hover{transform:translateY(-4px);border-color:rgba(90,200,250,.55)}
.cv-btn{min-height:44px;transition:background-color .2s ease,border-color .2s ease,transform .15s ease}
.cv-btn:hover:not(:disabled){border-color:${SKY};background:rgba(90,200,250,.12)}
.cv-btn:active:not(:disabled){transform:scale(.97)}
.cv-btn:focus-visible,.cv-tab:focus-visible{outline:2px solid ${SKY};outline-offset:3px}
.cv-btn:disabled{opacity:.4;cursor:not-allowed}
.cv-slot{transition:background-color .45s ease,border-color .45s ease}
.cv-pop{animation:cv-pop .5s cubic-bezier(.2,.9,.3,1.3) both}
@keyframes cv-pop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
.cv-rail{transform-origin:50% 0;transform:scaleY(0);transition:transform 1.4s cubic-bezier(.3,.6,.2,1)}
.cv-in .cv-rail,.cv-rail.cv-in{transform:scaleY(1)}
@media (prefers-reduced-motion: reduce){
  .cv-bar{animation:none;transform:scaleY(var(--mid,.6))}
  .cv-ring,.cv-pulse,.cv-meter,.cv-pop{animation:none}
  .cv-hop::after{animation:none;opacity:0}
  .cv-meter{transform:scaleY(.7)}
  .cv-rv{opacity:1;transform:none;transition:none}
  .cv-msg{opacity:1;visibility:visible;transform:none;transition:none}
  .cv-rail{transform:scaleY(1);transition:none}
  .cv-card{transition:none}
}
`;

// ---- hooks + tiny parts --------------------------------------------------------
function useSeen<T extends HTMLElement>(threshold = 0.1) {
  const ref = useRef<T>(null);
  const [seen, set] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { set(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { set(true); io.disconnect(); } }, { threshold, rootMargin: '0px 0px -6% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

function useReduce() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setR(m.matches);
    const f = () => setR(m.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return r;
}

function Rv({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const [ref, seen] = useSeen<HTMLDivElement>(0.08);
  return <div ref={ref} className={`cv-rv ${seen ? 'cv-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function Count({ value }: { value: string }) {
  const m = value.match(/^(\d+)(.*)$/);
  const [ref, seen] = useSeen<HTMLSpanElement>(0.3);
  const reduce = useReduce();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!m || !seen) return;
    const target = +m[1];
    if (reduce) { setN(target); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1300);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, reduce]);
  return <span ref={ref}>{m ? `${n}${m[2]}` : value}</span>;
}

function Wave({ n, className, seed = 0 }: { n: number; className: string; seed?: number }) {
  return (
    <div className={`flex items-center justify-center gap-[3px] md:gap-[5px] ${className}`} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const env = 0.55 + 0.45 * Math.sin((i / n) * Math.PI);
        const a = Math.abs(Math.sin(i * 1.7 + seed)) * 0.55 + 0.35;
        const hi = +(Math.min(1, a * env + 0.12)).toFixed(3);
        const lo = +(hi * 0.18 + 0.04).toFixed(3);
        const st = { '--hi': hi, '--lo': lo, '--mid': +((hi + lo) / 2).toFixed(3), '--d': `${(1.15 + ((i * 7 + seed) % 11) * 0.11).toFixed(2)}s`, '--dl': `${(-((i * 5) % 13) * 0.17).toFixed(2)}s`, height: '100%' } as CSSProperties;
        return <span key={i} className="cv-bar" style={st} />;
      })}
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs md:text-sm uppercase tracking-[0.22em]" style={{ fontFamily: MONO, color: SKY }}>{children}</p>;
}

function H2({ children, id }: { children: ReactNode; id?: string }) {
  return <h2 id={id} className="mt-3 text-[1.9rem] leading-[1.1] md:text-5xl font-semibold tracking-tight" style={{ fontFamily: SORA }}>{children}</h2>;
}

// ---- call console: chat + calendar --------------------------------------------
function Console() {
  const [ref, seen] = useSeen<HTMLDivElement>(0.08);
  const reduce = useReduce();
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(false);
  const [slot, setSlot] = useState<{ c: number; r: number } | null>(null);
  const total = MSGS.length;
  const eff = reduce ? total : step;
  const done = eff >= 5;

  useEffect(() => { if (seen) setRun(true); }, [seen]);
  useEffect(() => {
    if (!run || reduce || step >= total) return;
    const t = setTimeout(() => setStep((s) => s + 1), DELAYS[step]);
    return () => clearTimeout(t);
  }, [run, reduce, step, total]);
  useEffect(() => { setSlot(done ? { c: 2, r: 3 } : null); }, [done]);

  const next = MSGS[eff];
  const status = eff >= total ? 'Call complete' : next?.who === 'sys' ? 'Writing to the calendar' : next?.who === 'c' ? 'Caller is speaking' : 'Agent is speaking';
  const live = run && eff < total;
  const writing = eff === 4;

  return (
    <div ref={ref} className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-7">
      {/* chat */}
      <div className="rounded-3xl border p-4 md:p-6" style={{ borderColor: 'rgba(142,155,255,.28)', background: 'linear-gradient(160deg, rgba(20,34,74,.85), rgba(11,29,51,.9))' }}>
        <div className="flex items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'rgba(255,255,255,.1)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: GRAD, color: INK }}>
              {live && <span className="cv-ring" aria-hidden="true" />}
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 10v4M10 6v12M14 8v8M18 11v2" /></svg>
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold" style={{ fontFamily: SORA }}>Incoming call</p>
              <p className="text-xs" style={{ fontFamily: MONO, color: DIM }} aria-live="polite">{status}</p>
            </div>
          </div>
          <button type="button" className="cv-btn shrink-0 rounded-full border px-4 text-sm" style={{ borderColor: 'rgba(255,255,255,.25)', fontFamily: MONO }} onClick={() => { setStep(0); setRun(true); }}>
            Replay
          </button>
        </div>
        <ol className="mt-2 flex flex-col" aria-label="Illustrative call transcript">
          {MSGS.map((m, i) => {
            const on = eff > i;
            if (m.who === 'sys') {
              return (
                <li key={i} aria-hidden={!on} className={`cv-msg ${on ? 'on' : ''} self-center`}>
                  <div><p className="mt-3.5 rounded-full border px-4 py-2 text-xs md:text-sm" style={{ fontFamily: MONO, borderColor: 'rgba(90,200,250,.5)', color: SKY, background: 'rgba(90,200,250,.08)' }}><span aria-hidden="true">✓ </span>{m.text}{slot ? `: Wed ${TIMES[slot.r]}` : ''}</p></div>
                </li>
              );
            }
            const agent = m.who === 'a';
            return (
              <li key={i} aria-hidden={!on} className={`cv-msg ${on ? 'on' : ''} max-w-[88%] ${agent ? 'self-start' : 'self-end'}`}>
                <div><div className={`mt-3.5 mb-1 flex items-center gap-2 text-xs ${agent ? '' : 'justify-end'}`} style={{ fontFamily: MONO, color: DIM }}>
                  <span>{agent ? 'AGENT' : 'CALLER'}</span>
                  <span className="rounded px-1.5 py-0.5" style={{ background: 'rgba(255,255,255,.08)', color: agent ? SKY : VIOLET }}>{m.lang}</span>
                </div>
                <div className="rounded-2xl border px-4 py-3" style={{ borderColor: agent ? 'rgba(90,200,250,.4)' : 'rgba(142,155,255,.5)', background: agent ? 'rgba(90,200,250,.12)' : 'rgba(142,155,255,.18)', borderTopLeftRadius: agent ? 4 : undefined, borderTopRightRadius: agent ? undefined : 4 }}>
                  <p className="text-[1.02rem] leading-relaxed" style={{ fontFamily: TAMIL }}>{m.text}</p>
                  {m.gloss && <p className="mt-1 text-sm italic" style={{ color: DIM }}>{m.gloss}</p>}
                </div>
                {m.chip && <p className={`mt-1.5 text-xs ${agent ? '' : 'text-right'}`} style={{ fontFamily: MONO, color: SKY }}>{'// '}{m.chip}</p>}
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-5 text-xs" style={{ color: DIM, fontFamily: MONO }}>Illustrative call, written for this page. Not a real transcript.</p>
      </div>

      {/* calendar */}
      <div className="rounded-3xl border p-4 md:p-6 self-start" style={{ borderColor: 'rgba(90,200,250,.28)', background: 'rgba(11,29,51,.7)' }}>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-base font-semibold" style={{ fontFamily: SORA }}>Doctor&apos;s calendar</p>
          <p className="text-xs" style={{ fontFamily: MONO, color: DIM }}>mock</p>
        </div>
        <div className="mt-4 grid gap-1.5" style={{ gridTemplateColumns: '44px repeat(5, minmax(0, 1fr))' }} role="group" aria-label="Mock booking calendar">
          <span aria-hidden="true" />
          {DAYS.map((d, c) => (
            <span key={d} className="pb-1 text-center text-xs" style={{ fontFamily: MONO, color: c === 2 ? SKY : DIM, fontWeight: c === 2 ? 700 : 400 }}>{d}</span>
          ))}
          {TIMES.map((t, r) => (
            <div key={t} className="contents">
              <span className="flex h-10 items-center text-xs" style={{ fontFamily: MONO, color: DIM }}>{t}</span>
              {DAYS.map((d, c) => {
                const mine = slot && slot.c === c && slot.r === r;
                const target = c === 2 && r === 3 && writing;
                const busy = BUSY.has(`${c}-${r}`);
                return (
                  <span
                    key={d}
                    aria-hidden="true"
                    className={`cv-slot flex h-10 items-center justify-center rounded-lg border text-sm font-bold ${target ? 'cv-pulse' : ''}`}
                    style={{
                      borderColor: mine ? SKY : target ? SKY : 'rgba(255,255,255,.1)',
                      background: mine ? GRAD : busy ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.03)',
                      color: INK,
                    }}
                  >
                    {mine && <span className="cv-pop">✓</span>}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs" style={{ fontFamily: MONO, color: DIM }}>
          <span className="flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded" style={{ background: 'rgba(255,255,255,.1)' }} /> busy</span>
          <span className="flex items-center gap-1.5"><i className="inline-block h-3 w-3 rounded" style={{ background: GRAD }} /> booked by the call</span>
        </div>
        <p className="mt-4 min-h-[3rem] text-sm leading-relaxed" aria-live="polite" style={{ color: slot ? TEXT : DIM }}>
          {slot ? `Confirmed on the doctor's calendar: Wed ${TIMES[slot.r]}.` : writing ? 'Writing to the calendar…' : 'Nothing is shown as confirmed until the write succeeds.'}
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <button type="button" className="cv-btn rounded-full border px-5 text-sm" style={{ borderColor: 'rgba(255,255,255,.25)' }} disabled={!slot} onClick={() => setSlot((s) => (s ? { c: s.c, r: s.r === 3 ? 5 : 3 } : s))}>Reschedule</button>
          <button type="button" className="cv-btn rounded-full border px-5 text-sm" style={{ borderColor: 'rgba(255,255,255,.25)' }} disabled={!slot} onClick={() => setSlot(null)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ---- gallery tabs --------------------------------------------------------------
function Slides({ theme }: { theme: ProjectTheme }) {
  const items = theme.gallery ?? [];
  const [i, setI] = useState(0);
  if (!items.length) return null;
  const cur = items[i];
  return (
    <div>
      <div role="tablist" aria-label="Project deck slides" className="flex flex-wrap gap-2">
        {items.map((g, k) => (
          <button key={g.src} role="tab" aria-selected={k === i} type="button" onClick={() => setI(k)} className="cv-tab cv-btn rounded-full border px-4 text-xs md:text-sm" style={{ fontFamily: MONO, borderColor: k === i ? SKY : 'rgba(255,255,255,.2)', background: k === i ? 'rgba(90,200,250,.16)' : 'transparent', color: k === i ? SKY : TEXT }}>
            {String(k + 1).padStart(2, '0')} {g.caption}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="relative mt-5 aspect-[16/10] w-full overflow-hidden rounded-2xl border" style={{ borderColor: 'rgba(142,155,255,.3)', background: '#0f2140' }}>
        <Image key={cur.src} src={cur.src} alt={`Project slide, ${cur.caption.toLowerCase()}: ${SLIDE_HEADS[i] ?? ''}`} fill sizes="(min-width: 1024px) 1000px, 100vw" loading="lazy" className="object-cover" />
      </div>
      <p className="mt-3 text-base md:hidden" style={{ fontFamily: SORA, color: DIM }}>{cur.caption.toLowerCase()}: <span style={{ color: TEXT }}>{SLIDE_HEADS[i]}</span></p>
    </div>
  );
}

// ---- page ----------------------------------------------------------------------
export default function Page({ theme }: { theme: ProjectTheme }) {
  const [q1, q2, q3] = theme.story.quotes;
  const live = theme.architecture[1];

  return (
    <div className="min-h-svh w-full overflow-x-clip" style={{ color: TEXT, fontFamily: "var(--font-manrope), Inter, system-ui, sans-serif", background: `radial-gradient(1000px 520px at 82% -4%, rgba(142,155,255,.22), transparent 70%), radial-gradient(800px 480px at 4% 28%, rgba(90,200,250,.12), transparent 70%), linear-gradient(180deg, ${INK} 0%, #12204a 52%, ${INK} 100%)` }}>
      <style>{CSS}</style>
      <main className="mx-auto w-full max-w-7xl px-4 pt-24 pb-24 md:px-8 lg:pb-28 md:pt-36">
        {/* HERO */}
        <header className="flex min-h-[72svh] flex-col justify-between gap-10">
          <div>
            <p className="text-xs md:text-sm uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: SKY }}>{theme.kicker}</p>
            <h1 className="mt-4 font-bold leading-[0.95] tracking-tight" style={{ fontFamily: SORA, fontSize: 'clamp(2.9rem, 14vw, 9.5rem)' }}>
              Clinic<span style={{ background: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Voice</span>
            </h1>
            <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1fr_26rem] lg:gap-12">
              <div>
                <p className="max-w-xl text-lg leading-relaxed md:text-2xl" style={{ color: DIM }}>{theme.subtitle}</p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Languages">
                  {['தமிழ்', 'English', 'Both, mid-sentence'].map((t) => (
                    <li key={t} className="rounded-full border px-4 py-2 text-sm" style={{ borderColor: 'rgba(142,155,255,.45)', background: 'rgba(142,155,255,.12)', fontFamily: TAMIL }}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="relative w-full max-w-md lg:max-w-none">
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border" style={{ borderColor: 'rgba(90,200,250,.4)', boxShadow: '0 24px 60px rgba(5,10,30,.5)' }}>
                  <Image src={theme.heroImage} alt="ClinicVoice project deck cover: answers the clinic's phone" fill priority sizes="(min-width: 1024px) 420px, 90vw" className="object-cover" />
                </div>
                <div className="absolute -top-3 left-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: INK, border: `1px solid ${SKY}`, fontFamily: MONO, color: SKY }}>
                  <span className="relative inline-block h-2.5 w-2.5 rounded-full" style={{ background: SKY }}><span className="cv-ring" aria-hidden="true" /></span>
                  LIVE LINE
                </div>
              </div>
            </div>
          </div>
          <div>
            <Wave n={64} seed={1} className="h-28 md:h-32 lg:h-44" />
            <p className="mt-4 text-center text-xs uppercase tracking-[0.3em]" style={{ fontFamily: MONO, color: DIM }}>a missed call is a missed appointment</p>
          </div>
        </header>

        {/* CALL */}
        <section className="mt-20 md:mt-20 lg:mt-24" aria-labelledby="cv-call">
          <Rv>
            <Eyebrow>01 / The call</Eyebrow>
            <H2 id="cv-call">Listen in. Watch the slot fill.</H2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: DIM }}>The agent answers in Tamil, English or both, lets the caller interrupt, and only says confirmed once the calendar write has gone through.</p>
          </Rv>
          <div className="mt-8"><Console /></div>
        </section>

        {/* QUOTES */}
        <section className="mt-24 md:mt-20 lg:mt-24" aria-label="Pull quotes">
          <Rv>
            <figure className="rounded-3xl border p-6 md:p-12" style={{ borderColor: 'rgba(90,200,250,.3)', background: 'linear-gradient(135deg, rgba(90,200,250,.1), rgba(142,155,255,.12))' }}>
              <Eyebrow>{q1.kicker}</Eyebrow>
              <blockquote className="mt-4 text-[1.9rem] font-semibold leading-[1.1] md:text-6xl" style={{ fontFamily: SORA }}>&ldquo;{q1.quote}&rdquo;</blockquote>
              <figcaption className="mt-5 max-w-2xl text-base md:text-lg" style={{ color: DIM }}>{q1.context}</figcaption>
            </figure>
          </Rv>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {[q2, q3].map((q, k) => (
              <Rv key={q.kicker} delay={k * 120}>
                <figure className="h-full rounded-3xl border p-6 md:p-8" style={{ borderColor: 'rgba(255,255,255,.14)', background: 'rgba(255,255,255,.04)' }}>
                  <Eyebrow>{q.kicker}</Eyebrow>
                  <blockquote className="mt-3 text-xl font-semibold leading-snug md:text-2xl" style={{ fontFamily: SORA }}>&ldquo;{q.quote}&rdquo;</blockquote>
                  <figcaption className="mt-4 text-base" style={{ color: DIM }}>{q.context}</figcaption>
                </figure>
              </Rv>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="mt-20 md:mt-20 lg:mt-24" aria-labelledby="cv-feat">
          <Rv>
            <Eyebrow>02 / The mixing desk</Eyebrow>
            <H2 id="cv-feat">Six channels, all live.</H2>
          </Rv>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {theme.features.map((f, i) => (
              <li key={f.title}>
                <Rv delay={(i % 3) * 90} className="h-full">
                  <div className="cv-card flex h-full gap-4 rounded-2xl border p-5" style={{ borderColor: 'rgba(255,255,255,.14)', background: 'rgba(255,255,255,.04)' }}>
                    <div className="flex h-16 w-3 shrink-0 items-end gap-0.5" aria-hidden="true">
                      {[0, 1].map((k) => (
                        <span key={k} className="cv-meter h-full w-1 rounded-full" style={{ background: k ? VIOLET : SKY, ['--d' as string]: `${1.1 + ((i + k) % 4) * 0.25}s`, ['--dl' as string]: `${-(i * 0.3 + k * 0.5)}s` } as CSSProperties} />
                      ))}
                    </div>
                    <div>
                      <p className="text-xs" style={{ fontFamily: MONO, color: SKY }}>CH {String(i + 1).padStart(2, '0')}</p>
                      <h3 className="mt-1 text-lg font-semibold leading-snug" style={{ fontFamily: SORA }}>{f.title}</h3>
                      <p className="mt-2 text-[0.95rem] leading-relaxed" style={{ color: DIM }}>{f.desc}</p>
                    </div>
                  </div>
                </Rv>
              </li>
            ))}
          </ul>
        </section>

        {/* SIGNAL PATH */}
        <section className="mt-20 md:mt-20 lg:mt-24" aria-labelledby="cv-arch">
          <Rv>
            <Eyebrow>03 / Signal path</Eyebrow>
            <H2 id="cv-arch">From ringing phone to booked slot.</H2>
          </Rv>
          <Rv className="mt-8">
            <ol className="flex flex-wrap items-center gap-2 md:gap-3" aria-label="Signal path">
              {PATH.map((p, i) => (
                <li key={p} className="flex items-center gap-2 md:gap-3">
                  <span className="cv-hop relative rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: 'rgba(90,200,250,.4)', background: 'rgba(11,29,51,.8)', fontFamily: MONO, ['--dl' as string]: `${i * 0.7}s` } as CSSProperties}>{p}</span>
                  {i < PATH.length - 1 && <span aria-hidden="true" style={{ color: VIOLET }}>→</span>}
                </li>
              ))}
            </ol>
          </Rv>
          <Rv className="mt-10">
            <ol className="relative ml-1 md:ml-2">
              <span className="cv-rail absolute left-[15px] top-2 bottom-2 w-0.5" style={{ background: GRAD }} aria-hidden="true" />
              {theme.architecture.map((a, i) => (
                <li key={a.layer} className="relative flex gap-5 pb-8 last:pb-0 md:gap-7">
                  <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: i === 1 ? GRAD : INK, color: i === 1 ? INK : SKY, border: `2px solid ${SKY}`, fontFamily: MONO }}>
                    {i === 1 && <span className="cv-ring" aria-hidden="true" />}{i + 1}
                  </span>
                  <div className="min-w-0 flex-1 rounded-2xl border p-5" style={{ borderColor: i === 1 ? 'rgba(90,200,250,.55)' : 'rgba(255,255,255,.14)', background: i === 1 ? 'rgba(90,200,250,.08)' : 'rgba(255,255,255,.04)' }}>
                    <h3 className="text-xl font-semibold" style={{ fontFamily: SORA }}>{a.layer}{i === 1 && <span className="ml-3 rounded-full px-2.5 py-1 align-middle text-xs" style={{ background: SKY, color: INK, fontFamily: MONO }}>LIVE</span>}</h3>
                    <p className="mt-2 text-base leading-relaxed" style={{ color: DIM }}>{a.details}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm" style={{ fontFamily: MONO, color: DIM }}>{live ? `${live.layer}: ` : ''}a single speech-to-speech session carries the whole conversation.</p>
          </Rv>
        </section>

        {/* NUMBERS */}
        <section className="mt-20 md:mt-20 lg:mt-24" aria-label="By the numbers">
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {theme.bigNumbers.map((b, i) => (
              <li key={b.label}>
                <Rv delay={i * 90} className="h-full">
                  <div className="h-full rounded-2xl border p-5 md:p-6" style={{ borderColor: 'rgba(142,155,255,.35)', background: 'rgba(20,34,74,.6)' }}>
                    <p className="font-bold leading-none" style={{ fontFamily: SORA, fontSize: 'clamp(1.9rem, 7vw, 3.4rem)', background: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}><Count value={b.value} /></p>
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] md:text-sm" style={{ fontFamily: MONO, color: DIM }}>{b.label}</p>
                  </div>
                </Rv>
              </li>
            ))}
          </ul>
        </section>

        {/* OPS */}
        <section className="mt-20 md:mt-20 lg:mt-24" aria-labelledby="cv-ops">
          <Rv>
            <Eyebrow>04 / Behind the line</Eyebrow>
            <H2 id="cv-ops">Guardrails and a fleet.</H2>
          </Rv>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[
              { t: 'Safety net', rows: [['guards', 'price, scope and phone-number'], ['tests', 'about 190 test files'], ['evals', 'an automated bot replays scenarios and opens pull requests'], ['cost', 'per call in rupees, with a spend cap']] },
              { t: 'The fleet', rows: [['config', 'name, hours and treatments'], ['tenants', 'tenant folders, one codebase'], ['console', 'a fleet console for owners'], ['live', 'a dermatology clinic in Puducherry']] },
            ].map((c, k) => (
              <Rv key={c.t} delay={k * 120} className="h-full">
                <div className="h-full rounded-2xl border p-5 md:p-6" style={{ borderColor: 'rgba(255,255,255,.14)', background: 'rgba(255,255,255,.04)' }}>
                  <h3 className="text-xl font-semibold" style={{ fontFamily: SORA }}>{c.t}</h3>
                  <dl className="mt-4 divide-y" style={{ borderColor: 'rgba(255,255,255,.1)' }}>
                    {c.rows.map(([key, v]) => (
                      <div key={key} className="grid grid-cols-[5.5rem_1fr] gap-3 py-3" style={{ borderColor: 'rgba(255,255,255,.1)' }}>
                        <dt className="text-sm" style={{ fontFamily: MONO, color: SKY }}>{key}</dt>
                        <dd className="text-base leading-snug">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Rv>
            ))}
          </div>
        </section>

        {/* SLIDES */}
        <section className="mt-24 md:mt-20 lg:mt-24" aria-labelledby="cv-slides">
          <Rv>
            <Eyebrow>05 / The deck</Eyebrow>
            <H2 id="cv-slides">Six slides, one call.</H2>
          </Rv>
          <Rv className="mt-8"><Slides theme={theme} /></Rv>
        </section>

        {/* README */}
        <section className="mt-24 md:mt-20 lg:mt-24" aria-labelledby="cv-readme">
          <Rv>
            <Eyebrow>06 / The honest part</Eyebrow>
            <H2 id="cv-readme">What it can&apos;t do yet.</H2>
          </Rv>
          <Rv className="mt-8">
            <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'rgba(255,255,255,.2)', background: '#0a1629' }}>
              <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: 'rgba(255,255,255,.12)', background: 'rgba(255,255,255,.05)' }}>
                {['#5b6b88', '#5b6b88', '#5b6b88'].map((c, i) => <span key={i} className="h-3 w-3 rounded-full" style={{ background: c }} aria-hidden="true" />)}
                <span className="ml-2 text-sm" style={{ fontFamily: MONO, color: DIM }}>README.md</span>
              </div>
              <div className="space-y-5 p-5 text-[0.95rem] leading-relaxed md:p-8 md:text-base" style={{ fontFamily: MONO }}>
                <p className="text-xl font-bold md:text-2xl" style={{ color: TEXT }}><span style={{ color: VIOLET }}># </span>Known limits</p>
                <p style={{ color: DIM }}><span style={{ color: VIOLET }}>&gt; </span>Written by the author. Nothing here is hidden in the fine print.</p>
                <div>
                  <p className="mb-2 font-bold" style={{ color: SKY }}>## Not done yet</p>
                  <ul className="space-y-2">
                    {['The WhatsApp bridge is unofficial, with ban risk', 'Warm transfer is switched off for now', 'No OTP or identity check yet'].map((t) => (
                      <li key={t} className="flex gap-3"><span className="shrink-0 whitespace-nowrap" style={{ color: VIOLET }} aria-hidden="true">- [ ]</span><span>{t}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 font-bold" style={{ color: SKY }}>## What does work</p>
                  <ul className="space-y-2" style={{ color: DIM }}>
                    <li className="flex gap-3"><span className="shrink-0 whitespace-nowrap" style={{ color: SKY }} aria-hidden="true">- [x]</span><span>Running live at a dermatology clinic in Puducherry</span></li>
                    <li className="flex gap-3"><span className="shrink-0 whitespace-nowrap" style={{ color: SKY }} aria-hidden="true">- [x]</span><span>Bookings land on the real Google Calendar before the agent says confirmed</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </Rv>
        </section>

        {/* OUTCOME */}
        <section className="mt-24 text-center md:mt-20 lg:mt-24" aria-label="Outcome">
          <Rv>
            <Wave n={30} seed={4} className="mx-auto h-14 max-w-md md:h-20" />
            <p className="mx-auto mt-8 max-w-4xl text-[1.7rem] font-semibold leading-[1.15] md:text-5xl" style={{ fontFamily: SORA }}>&ldquo;{theme.outcomeQuote}&rdquo;</p>
          </Rv>
        </section>
      </main>
      <NextChapter currentSlug={theme.slug} accent={theme.palette.accent} />
      <SiteFooter />
    </div>
  );
}
