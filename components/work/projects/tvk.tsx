'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import Image from 'next/image';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

/* ------------------------------------------------------------------ */
/* Tokens                                                              */
/* ------------------------------------------------------------------ */
const NAVY = '#0F1A2E';
const NAVY2 = '#1A2A4A';
const BLUE = '#1763E5';
const YELLOW = '#FFC23C';
const GREEN = '#2BB673';
const PAPER = '#F4F7FE';
const INK = '#EAF1FB';
const FONT: CSSProperties = { fontFamily: 'var(--font-manrope), Inter, system-ui, sans-serif' };
const MONO: CSSProperties = { fontFamily: 'var(--font-plex), "JetBrains Mono", ui-monospace, monospace' };

const PHONE = '9000012345'; // placeholder digits, not a real number
const OTP = '481592';
const CYCLE = 30;
const STEP_START = [0, 12, 20];
const STEP_STILL = [10, 18, 24];
const STEP_NAMES = ['Number', 'OTP', 'Signed in'];

const CSS = `
.tvk-root{--tvk-ph:300px}
@media (min-width:768px){.tvk-root{--tvk-ph:330px}}
.tvk-rv{opacity:0;transform:translateY(18px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)}
.tvk-rv.tvk-in{opacity:1;transform:none}
.tvk-float{animation:tvk-float 6s ease-in-out infinite}
@keyframes tvk-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.tvk-ring{animation:tvk-ring 9s linear infinite}
@keyframes tvk-ring{to{transform:rotate(360deg)}}
.tvk-marq{animation:tvk-marq 32s linear infinite;will-change:transform}
@keyframes tvk-marq{to{transform:translateX(-50%)}}
.tvk-caret{animation:tvk-blink 1s steps(1) infinite}
@keyframes tvk-blink{50%{opacity:0}}
.tvk-spin{animation:tvk-ring .8s linear infinite}
.tvk-punch{animation:tvk-punch .32s cubic-bezier(.22,1.6,.36,1) both}
@keyframes tvk-punch{from{transform:scale(.5);opacity:0}to{transform:scale(1);opacity:1}}
.tvk-pop{animation:tvk-pop .5s cubic-bezier(.34,1.56,.64,1) both}
@keyframes tvk-pop{from{transform:scale(.3);opacity:0}to{transform:scale(1);opacity:1}}
.tvk-tick{stroke-dasharray:1;stroke-dashoffset:1;animation:tvk-draw .6s .15s ease-out forwards}
@keyframes tvk-draw{to{stroke-dashoffset:0}}
.tvk-countdown{stroke-dasharray:1;stroke-dashoffset:0;animation:tvk-cd 30s linear infinite}
@keyframes tvk-cd{to{stroke-dashoffset:1}}
.tvk-line{transform:scaleY(0);transform-origin:top;transition:transform 1.4s cubic-bezier(.16,1,.3,1)}
.tvk-line.tvk-in{transform:scaleY(1)}
.tvk-lift{transition:transform .25s ease,box-shadow .25s ease}
.tvk-lift:hover{transform:translateY(-4px);box-shadow:0 14px 30px -14px rgba(15,26,46,.45)}
.tvk-btn:focus-visible,.tvk-lift:focus-visible{outline:3px solid ${YELLOW};outline-offset:3px}
.tvk-light .tvk-btn:focus-visible{outline-color:${BLUE}}
@media (prefers-reduced-motion:reduce){
  .tvk-float,.tvk-ring,.tvk-marq,.tvk-caret,.tvk-spin,.tvk-countdown{animation:none!important}
  .tvk-rv{opacity:1;transform:none;transition:none}
  .tvk-punch,.tvk-pop{animation:none!important}
  .tvk-tick{animation:none!important;stroke-dashoffset:0}
  .tvk-line{transition:none;transform:none}
  .tvk-lift:hover{transform:none}
}
`;

/* ------------------------------------------------------------------ */
/* Hooks and small parts                                               */
/* ------------------------------------------------------------------ */
function useInView(ref: RefObject<HTMLElement | null>, once: boolean, margin = '0px 0px -8% 0px') {
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
        for (const e of es) {
          if (e.isIntersecting) {
            setSeen(true);
            if (once) io.disconnect();
          } else if (!once) setSeen(false);
        }
      },
      { rootMargin: margin, threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, margin]);
  return seen;
}

function Rv({ children, delay = 0, className = '', style }: { children: ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, true);
  return (
    <div ref={ref} className={`tvk-rv ${seen ? 'tvk-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

function Count({ to, reduced }: { to: number; reduced: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, true);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (reduced || to === 0) {
      setN(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 1400);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, reduced]);
  return <span ref={ref}>{n}</span>;
}

function Eyebrow({ children, color }: { children: ReactNode; color: string }) {
  return (
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] md:text-sm" style={{ ...MONO, color }}>
      {children}
    </p>
  );
}

const wrap = 'mx-auto w-full max-w-6xl px-4 md:px-8';

/* ------------------------------------------------------------------ */
/* Phone mockup                                                        */
/* ------------------------------------------------------------------ */
function PhoneDemo({ t, step }: { t: number; step: number }) {
  const typed = Math.min(10, t);
  const shown = PHONE.slice(0, typed);
  const num = shown.length > 5 ? `${shown.slice(0, 5)} ${shown.slice(5)}` : shown;
  const filled = Math.min(6, Math.max(0, t - 12));
  const secs = Math.max(0, 30 - Math.max(0, t - 12) * 2);
  const pressed = t === 10;
  const sending = t === 11;
  const verifying = t >= 18 && t < 20;
  const notif = t >= 12 && t <= 16;

  const screen: CSSProperties = { flex: '0 0 100%', padding: '3.4em 1.3em 1.3em', display: 'flex', flexDirection: 'column', color: NAVY, minWidth: 0 };

  return (
    <div
      className="relative mx-auto"
      style={{ ...FONT, width: 'var(--tvk-ph)', height: 'calc(var(--tvk-ph) * 2.05)', fontSize: 'calc(var(--tvk-ph) / 20)' }}
      role="img"
      aria-label="Animated phone mockup: entering a phone number, filling the six digit code, then a success tick"
    >
      <div className="absolute inset-0 rounded-[2.6em] p-[0.55em]" style={{ background: '#050A14', boxShadow: `0 40px 80px -30px rgba(23,99,229,.7), 0 0 0 2px #26365A inset` }}>
        <div className="relative h-full w-full overflow-hidden rounded-[2.1em]" style={{ background: '#fff' }}>
          {/* status bar */}
          <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-[1.6em] pt-[0.7em] text-[0.7em] font-bold" style={{ color: NAVY }}>
            <span>9:41</span>
            <span className="absolute left-1/2 top-[0.6em] h-[1.5em] w-[5em] -translate-x-1/2 rounded-full" style={{ background: '#050A14' }} />
            <span aria-hidden>LTE</span>
          </div>

          {/* notification banner */}
          <div
            className="absolute left-[0.8em] right-[0.8em] top-[2.6em] z-20 rounded-[1em] px-[0.9em] py-[0.7em] text-[0.78em]"
            style={{ background: NAVY, color: '#fff', transform: notif ? 'translateY(0)' : 'translateY(-160%)', opacity: notif ? 1 : 0, transition: 'transform .45s cubic-bezier(.22,1.2,.36,1), opacity .3s' }}
          >
            <span style={{ color: YELLOW }} className="font-bold">Messages</span> · now
            <div className="font-semibold">Your code is {OTP}</div>
          </div>

          <div className="flex h-full" style={{ transform: `translateX(-${step * 100}%)`, transition: 'transform .6s cubic-bezier(.16,1,.3,1)' }}>
            {/* Screen 1 */}
            <div style={screen}>
              <div className="mb-[1.4em] flex items-center gap-[0.6em]">
                <span className="grid h-[2.2em] w-[2.2em] place-items-center rounded-full text-[0.9em] font-extrabold" style={{ background: YELLOW }}>T</span>
                <span className="text-[1em] font-extrabold">TVK Connect</span>
              </div>
              <h3 className="text-[1.7em] font-extrabold leading-[1.1]">Enter your phone number</h3>
              <p className="mt-[0.5em] text-[0.85em]" style={{ color: '#4A5A78' }}>We will text you a 6-digit code.</p>
              <div className="mt-[1.4em] flex items-center gap-[0.6em] rounded-[0.9em] border-2 px-[0.8em] py-[0.8em]" style={{ borderColor: BLUE }}>
                <span className="rounded-md px-[0.5em] py-[0.15em] text-[0.8em] font-bold" style={{ background: '#E6EEFD', color: BLUE }}>IN +91</span>
                <span className="text-[1.15em] font-bold tracking-wider" style={{ minHeight: '1.4em' }}>
                  {num}
                  {typed < 10 && <span className="tvk-caret" style={{ color: BLUE }}>|</span>}
                </span>
              </div>
              <p className="mt-[0.6em] text-[0.7em]" style={{ color: '#4A5A78' }}>Standard SMS rates apply.</p>
              <div className="mt-auto">
                <div
                  className="flex items-center justify-center gap-2 rounded-[0.9em] py-[0.95em] text-[1em] font-extrabold"
                  style={{ background: YELLOW, opacity: typed === 10 ? 1 : 0.45, transform: pressed ? 'scale(.96)' : 'scale(1)', transition: 'transform .15s, opacity .3s' }}
                >
                  {sending && <span className="tvk-spin inline-block h-[1em] w-[1em] rounded-full border-2 border-t-transparent" style={{ borderColor: NAVY, borderTopColor: 'transparent' }} />}
                  {sending ? 'Sending' : 'Send OTP'}
                </div>
              </div>
            </div>

            {/* Screen 2 */}
            <div style={screen}>
              <div className="mb-[1.4em] flex items-center gap-[0.6em]">
                <span className="grid h-[2.2em] w-[2.2em] place-items-center rounded-full text-[0.9em] font-extrabold" style={{ background: YELLOW }}>T</span>
                <span className="text-[1em] font-extrabold">Verify</span>
              </div>
              <h3 className="text-[1.7em] font-extrabold leading-[1.1]">Enter the code</h3>
              <p className="mt-[0.5em] text-[0.85em]" style={{ color: '#4A5A78' }}>Sent to +91 {PHONE.slice(0, 5)} {PHONE.slice(5)}</p>
              <div className="mt-[1.4em] grid grid-cols-6 gap-[0.4em]">
                {OTP.split('').map((d, i) => (
                  <div
                    key={i}
                    className="grid aspect-[3/4] place-items-center rounded-[0.7em] border-2 text-[1.35em] font-extrabold"
                    style={{ borderColor: i < filled ? BLUE : '#C9D5EC', background: i < filled ? '#E6EEFD' : '#fff', color: NAVY }}
                  >
                    {i < filled && step === 1 ? <span key={`d${i}`} className="tvk-punch">{d}</span> : i < filled ? d : ''}
                  </div>
                ))}
              </div>
              <p className="mt-[1em] text-[0.8em] font-semibold" style={{ color: '#4A5A78' }}>
                {t < 12 ? 'Resend OTP in 0:30' : `Resend OTP in 0:${String(secs).padStart(2, '0')}`}
              </p>
              <div className="mt-auto">
                <div className="flex items-center justify-center gap-2 rounded-[0.9em] py-[0.95em] text-[1em] font-extrabold" style={{ background: filled === 6 ? YELLOW : '#E6EEFD', color: NAVY, transition: 'background .3s' }}>
                  {verifying && <span className="tvk-spin inline-block h-[1em] w-[1em] rounded-full border-2" style={{ borderColor: NAVY, borderTopColor: 'transparent' }} />}
                  {verifying ? 'Verifying' : 'Verify'}
                </div>
              </div>
            </div>

            {/* Screen 3 */}
            <div style={{ ...screen, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div className="relative grid h-[7em] w-[7em] place-items-center">
                <span className="absolute inset-0 rounded-full" style={{ background: GREEN, opacity: 0.15 }} />
                {step === 2 && (
                  <svg key="tick" viewBox="0 0 64 64" className="tvk-pop relative h-[5.2em] w-[5.2em]" aria-hidden>
                    <circle cx="32" cy="32" r="28" fill={GREEN} />
                    <path className="tvk-tick" pathLength={1} d="M19 33 L28 42 L45 23" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <h3 className="mt-[1.2em] text-[1.6em] font-extrabold leading-tight">OTP verified</h3>
              <p className="mt-[0.4em] text-[0.85em]" style={{ color: '#4A5A78' }}>Signed in. Routing to your dashboard.</p>
              <div className="mt-[1.2em] rounded-full px-[1em] py-[0.5em] text-[0.8em] font-extrabold" style={{ background: YELLOW }}>Candidate dashboard</div>
            </div>
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
  const [reduced, setReduced] = useState(false);
  const [t, setT] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const phoneVisible = useInView(heroRef, false, '0px');
  const [role, setRole] = useState<'candidate' | 'volunteer'>('candidate');
  const [rows, setRows] = useState<number[]>([0, 1, 2]);
  const archRef = useRef<HTMLDivElement>(null);
  const archSeen = useInView(archRef, true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      setReduced(mq.matches);
      if (mq.matches) setT(STEP_STILL[2]);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (reduced || !phoneVisible) return;
    const id = window.setInterval(() => setT((v) => (v + 1) % CYCLE), 420);
    return () => window.clearInterval(id);
  }, [reduced, phoneVisible]);

  const step = t < 12 ? 0 : t < 20 ? 1 : 2;
  const goStep = (i: number) => setT(reduced ? STEP_STILL[i] : STEP_START[i]);

  const quotes = theme.story.quotes;
  const gallery = theme.gallery ?? [];
  const marq = ['Country code', 'OTP', 'Done', '+91', '6 digits', '30s resend', 'Two roles', 'Zero passwords'];
  const statusNames = ['Accept', 'In progress', 'Resolved'];

  return (
    <main className="tvk-root" style={{ ...FONT, background: NAVY, color: INK }}>
      <style>{CSS}</style>

      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden pb-16 pt-24 md:pb-24 md:pt-36" style={{ background: NAVY, minHeight: '88svh' }}>
        <div aria-hidden className="pointer-events-none absolute -right-24 top-[22%] h-[26rem] w-[26rem] rounded-full md:right-[4%] md:top-[8%] md:h-[44rem] md:w-[44rem]" style={{ background: BLUE, opacity: 0.9 }} />
        <div aria-hidden className="tvk-ring pointer-events-none absolute -bottom-16 -left-24 h-56 w-56 rounded-full border-[18px] md:-bottom-24 md:-left-32 md:h-80 md:w-80" style={{ borderColor: YELLOW, borderStyle: 'dashed', opacity: 0.55 }} />
        <div className={`${wrap} relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]`}>
          <div>
            <Rv>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] md:text-sm" style={{ ...MONO, background: YELLOW, color: NAVY }}>
                {theme.kicker}
              </p>
            </Rv>
            <Rv delay={80}>
              <h1 className="font-extrabold leading-[0.92] tracking-tight" style={{ fontSize: 'clamp(3.25rem, 12vw, 7rem)' }}>
                TVK
                <br />
                <span style={{ color: YELLOW }}>Connect</span>
              </h1>
            </Rv>
            <Rv delay={160}>
              <p className="mt-4 max-w-md text-xl font-semibold md:mt-6 leading-snug md:text-2xl" style={{ color: INK }}>
                {theme.subtitle}
              </p>
              <p className="mt-3 hidden max-w-md text-base leading-relaxed md:block" style={{ color: '#B4C2DA' }}>
                Flutter app with Firebase phone auth. Country code, OTP, done. The whole authentication flow is the product.
              </p>
            </Rv>
            <Rv delay={240}>
              <div className="mt-8 flex flex-wrap gap-3" role="group" aria-label="Choose a step of the login flow">
                {STEP_NAMES.map((n, i) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => goStep(i)}
                    aria-pressed={step === i}
                    className="tvk-btn inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-bold"
                    style={{ background: step === i ? YELLOW : 'rgba(234,241,251,0.1)', color: step === i ? NAVY : INK, border: `2px solid ${step === i ? YELLOW : 'rgba(234,241,251,0.3)'}`, transition: 'background .25s, color .25s' }}
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full text-xs" style={{ background: step === i ? NAVY : 'rgba(234,241,251,0.2)', color: step === i ? YELLOW : INK }}>{i + 1}</span>
                    {n}
                  </button>
                ))}
              </div>
            </Rv>
          </div>
          <div ref={heroRef} className="tvk-float justify-self-center">
            <PhoneDemo t={t} step={step} />
          </div>
        </div>
      </section>

      {/* ============================ MARQUEE ============================ */}
      <div className="overflow-hidden py-4" style={{ background: YELLOW, color: NAVY }} aria-hidden>
        <div className="tvk-marq flex w-max gap-8 whitespace-nowrap text-xl font-extrabold md:text-2xl">
          {[0, 1].map((k) => (
            <div key={k} className="flex gap-8">
              {marq.map((m) => (
                <span key={`${k}-${m}`} className="flex items-center gap-8">
                  {m}
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: BLUE }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============================ STORY (SMS thread) ============================ */}
      <section className="tvk-light py-20 md:py-28" style={{ background: PAPER, color: NAVY }}>
        <div className={wrap}>
          <Rv>
            <Eyebrow color={BLUE}>The honest story</Eyebrow>
            <h2 className="max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">Three messages about a small project.</h2>
          </Rv>
          <div className="mt-12 flex max-w-3xl flex-col gap-6">
            {quotes.map((q, i) => (
              <Rv key={q.kicker} delay={i * 80} className={i % 2 ? 'self-end' : 'self-start'} style={{ maxWidth: '100%' }}>
                <div className="max-w-full md:max-w-[34rem]">
                  <p className="mb-2 px-2 text-xs font-bold uppercase tracking-widest" style={{ ...MONO, color: '#3C4B6B', textAlign: i % 2 ? 'right' : 'left' }}>
                    {q.kicker}
                  </p>
                  <blockquote
                    className="px-5 py-4 text-lg font-bold leading-snug md:px-6 md:py-5 md:text-2xl"
                    style={{
                      background: i % 2 ? BLUE : '#fff',
                      color: i % 2 ? '#fff' : NAVY,
                      borderRadius: i % 2 ? '1.5rem 1.5rem 0.4rem 1.5rem' : '1.5rem 1.5rem 1.5rem 0.4rem',
                      boxShadow: '0 12px 30px -18px rgba(15,26,46,.4)',
                    }}
                  >
                    {q.quote}
                  </blockquote>
                  <p className="mt-2 px-2 text-sm leading-relaxed" style={{ color: '#3C4B6B', textAlign: i % 2 ? 'right' : 'left' }}>{q.context}</p>
                </div>
              </Rv>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ FEATURES ============================ */}
      <section className="tvk-light py-20 md:py-28" style={{ background: BLUE, color: '#fff' }}>
        <div className={wrap}>
          <Rv>
            <Eyebrow color="#fff">What it does</Eyebrow>
            <h2 className="max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">Six small decisions, each on purpose.</h2>
          </Rv>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {theme.features.map((f, i) => (
              <li key={f.title}>
                <Rv delay={(i % 3) * 70} className="h-full">
                  <div tabIndex={0} className="tvk-lift relative flex h-full flex-col rounded-3xl p-6" style={{ background: '#fff', color: NAVY }}>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="grid h-11 w-11 place-items-center rounded-full text-base font-extrabold" style={{ background: YELLOW }}>{String(i + 1).padStart(2, '0')}</span>
                      {i === 2 && (
                        <svg viewBox="0 0 44 44" className="h-11 w-11" aria-hidden>
                          <circle cx="22" cy="22" r="18" fill="none" stroke="#DCE6FA" strokeWidth="5" />
                          <g transform="rotate(-90 22 22)">
                            <circle className="tvk-countdown" pathLength={1} cx="22" cy="22" r="18" fill="none" stroke={BLUE} strokeWidth="5" strokeLinecap="round" />
                          </g>
                          <text x="22" y="26" textAnchor="middle" fontSize="12" fontWeight="800" fill={NAVY}>30</text>
                        </svg>
                      )}
                      {i === 3 && (
                        <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ ...MONO, background: '#E6EEFD', color: BLUE }}>240 flags</span>
                      )}
                      {i === 4 && (
                        <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ ...MONO, background: '#E6EEFD', color: BLUE }}>2 roles</span>
                      )}
                    </div>
                    <h3 className="text-xl font-extrabold leading-tight">{f.title}</h3>
                    <p className="mt-2 text-base leading-relaxed" style={{ color: '#34425F' }}>{f.desc}</p>
                  </div>
                </Rv>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================ ROLE GATE ============================ */}
      <section className="py-20 md:py-28" style={{ background: NAVY2, color: INK }}>
        <div className={wrap}>
          <Rv>
            <Eyebrow color={YELLOW}>One auth, two dashboards</Eyebrow>
            <h2 className="max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">After the tick, the role decides where you land.</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: '#B4C2DA' }}>
              Once the OTP is verified, the user is looked up in Firestore. New users get a minimal record with a candidate default. Existing users are routed by the role on their document.
            </p>
          </Rv>

          <div className="mt-10 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-xs font-bold md:gap-2 md:text-base" style={MONO}>
            {['OTP verified', 'Firestore lookup', 'Role'].map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                <span className="whitespace-nowrap rounded-full px-3 py-2 md:px-4" style={{ background: i === 2 ? YELLOW : 'rgba(234,241,251,0.12)', color: i === 2 ? NAVY : INK }}>{s}</span>
                {i < 2 && <span aria-hidden style={{ color: YELLOW }}>&rarr;</span>}
              </span>
            ))}
          </div>

          <div className="mt-8 flex gap-2" role="tablist" aria-label="Choose a role">
            {(['candidate', 'volunteer'] as const).map((r) => (
              <button
                key={r}
                role="tab"
                aria-selected={role === r}
                type="button"
                onClick={() => setRole(r)}
                className="tvk-btn min-h-11 rounded-full px-6 text-base font-extrabold capitalize"
                style={{ background: role === r ? YELLOW : 'transparent', color: role === r ? NAVY : INK, border: `2px solid ${role === r ? YELLOW : 'rgba(234,241,251,0.4)'}` }}
              >
                {r}
              </button>
            ))}
          </div>

          <div role="tabpanel" className="mt-6 grid items-start gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] p-5 md:p-7" style={{ background: '#fff', color: NAVY }}>
              <div className="mb-5 flex items-center justify-between">
                <span className="text-lg font-extrabold">{role === 'candidate' ? 'Candidate' : 'Volunteer'}</span>
                <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: '#E6EEFD', color: BLUE }}>Profile &middot; Logout</span>
              </div>
              {role === 'candidate' ? (
                <div key="c">
                  <div className="rounded-2xl p-5" style={{ background: BLUE, color: '#fff' }}>
                    <p className="text-sm font-semibold" style={{ opacity: 0.9 }}>Hello</p>
                    <p className="mt-1 text-xl font-extrabold">File a new grievance</p>
                    <span className="mt-4 inline-flex min-h-11 items-center rounded-full px-5 text-sm font-extrabold" style={{ background: YELLOW, color: NAVY }}>Start +</span>
                  </div>
                  <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-widest" style={{ ...MONO, color: '#3C4B6B' }}>Your grievances</p>
                  {['Open', 'In progress', 'Resolved'].map((s, i) => (
                    <div key={s} className="mb-2 flex items-center gap-3 rounded-xl p-3" style={{ background: PAPER }}>
                      <div className="flex-1 space-y-2">
                        <div className="h-2.5 rounded-full" style={{ background: '#C9D5EC', width: `${86 - i * 16}%` }} />
                        <div className="h-2.5 w-1/2 rounded-full" style={{ background: '#DCE6FA' }} />
                      </div>
                      <span className="rounded-full px-3 py-1 text-xs font-extrabold" style={{ background: i === 2 ? GREEN : i === 1 ? YELLOW : '#DCE6FA', color: i === 2 ? '#04210F' : NAVY }}>{s}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div key="v">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ ...MONO, color: '#3C4B6B' }}>Queue &middot; your assigned area</p>
                  {rows.map((s, ri) => (
                    <div key={ri} className="mb-3 rounded-xl p-3" style={{ background: PAPER }}>
                      <div className="mb-3 space-y-2">
                        <div className="h-2.5 rounded-full" style={{ background: '#C9D5EC', width: `${88 - ri * 14}%` }} />
                        <div className="h-2.5 w-1/2 rounded-full" style={{ background: '#DCE6FA' }} />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {statusNames.map((n, si) => (
                          <button
                            key={n}
                            type="button"
                            aria-pressed={s === si}
                            onClick={() => setRows((r) => r.map((v, k) => (k === ri ? si : v)))}
                            className="tvk-btn min-h-10 rounded-full px-4 text-sm font-bold"
                            style={{ background: s === si ? (si === 2 ? GREEN : si === 1 ? YELLOW : BLUE) : '#fff', color: s === si ? (si === 0 ? '#fff' : NAVY) : '#34425F', border: `2px solid ${s === si ? 'transparent' : '#C9D5EC'}`, transition: 'background .2s' }}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <ul className="space-y-3 text-base leading-relaxed md:text-lg">
              {(role === 'candidate'
                ? ['Greeting with the user’s number and display name, if set.', 'A primary action card to file a new grievance.', 'A list of existing grievances with status badges.', 'Profile and logout in the app bar.']
                : ['A queue of grievances filtered to the volunteer’s assignment area.', 'Status controls: accept, in progress, resolved.', 'Read-only profile view.', 'Logout.']
              ).map((li) => (
                <li key={li} className="flex gap-3 rounded-2xl p-4" style={{ background: 'rgba(234,241,251,0.08)' }}>
                  <span aria-hidden className="mt-2 h-2.5 w-2.5 flex-none rounded-full" style={{ background: YELLOW }} />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============================ ARCHITECTURE ============================ */}
      <section className="tvk-light py-20 md:py-28" style={{ background: PAPER, color: NAVY }}>
        <div className={wrap}>
          <Rv>
            <Eyebrow color={BLUE}>Under the hood</Eyebrow>
            <h2 className="max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">A thin wire, four layers.</h2>
          </Rv>
          <div ref={archRef} className="relative mt-12 max-w-3xl">
            <div aria-hidden className={`tvk-line absolute bottom-6 left-[calc(1.375rem-1.5px)] top-6 w-[3px] rounded-full ${archSeen ? 'tvk-in' : ''}`} style={{ background: BLUE }} />
            <ol className="relative space-y-5">
              {theme.architecture.map((a, i) => (
                <li key={a.layer}>
                  <Rv delay={i * 90} className="flex items-start gap-4 md:gap-6">
                    <span className="relative z-10 grid h-11 w-11 flex-none place-items-center rounded-full text-base font-extrabold" style={{ background: i === 0 ? YELLOW : BLUE, color: i === 0 ? NAVY : '#fff', boxShadow: `0 0 0 6px ${PAPER}` }}>{i + 1}</span>
                    <div className="min-w-0 flex-1 rounded-2xl bg-white p-5" style={{ boxShadow: '0 10px 28px -20px rgba(15,26,46,.5)' }}>
                      <h3 className="text-lg font-extrabold md:text-xl">{a.layer}</h3>
                      <p className="mt-1 text-base leading-relaxed" style={{ color: '#34425F' }}>{a.details}</p>
                    </div>
                  </Rv>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ============================ GALLERY ============================ */}
      {gallery.length > 0 && (
        <section className="py-20 md:py-28" style={{ background: NAVY2, color: INK }}>
          <div className={wrap}>
            <Rv>
              <Eyebrow color={YELLOW}>Who it is for</Eyebrow>
              <h2 className="max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">The people on the other side of the OTP.</h2>
            </Rv>
            <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
              {gallery.map((g, i) => (
                <li key={g.src}>
                  <Rv delay={(i % 3) * 70} className="h-full">
                    <figure className="relative aspect-[4/5] overflow-hidden rounded-3xl" style={{ background: NAVY }}>
                      <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1024px) 380px, (min-width: 768px) 30vw, 46vw" className="object-cover" />
                      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: 'linear-gradient(180deg, rgba(15,26,46,0), rgba(15,26,46,.92))' }} />
                      <figcaption className="absolute bottom-0 left-0 right-0 p-4 text-[0.7rem] font-bold uppercase tracking-[0.16em] md:p-5 md:text-xs" style={{ ...MONO, color: YELLOW }}>
                        {g.caption}
                      </figcaption>
                    </figure>
                  </Rv>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ============================ NUMBERS ============================ */}
      <section className="tvk-light py-16 md:py-24" style={{ background: YELLOW, color: NAVY }}>
        <div className={wrap}>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {theme.bigNumbers.map((b, i) => (
              <Rv key={b.label} delay={i * 80}>
                <dd className="font-extrabold leading-none" style={{ fontSize: 'clamp(3.5rem, 12vw, 7rem)' }}>
                  <Count to={parseInt(b.value, 10) || 0} reduced={reduced} />
                </dd>
                <dt className="mt-3 border-t-4 pt-3 text-base font-bold md:text-lg" style={{ borderColor: NAVY }}>{b.label}</dt>
              </Rv>
            ))}
          </dl>
        </div>
      </section>

      {/* ============================ OUTCOME ============================ */}
      <section className="relative overflow-hidden px-4 pb-28 pt-20 md:px-8 md:pb-32 md:pt-28" style={{ background: NAVY }}>
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full" style={{ background: BLUE, opacity: 0.5 }} />
        <Rv className="relative mx-auto max-w-4xl text-center">
          <span className="tvk-pop mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full" style={{ background: GREEN }} aria-hidden>
            <svg viewBox="0 0 64 64" className="h-8 w-8"><path d="M16 33 L27 44 L48 21" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <blockquote className="text-3xl font-extrabold leading-tight md:text-5xl">
            <span style={{ color: YELLOW }}>{theme.outcomeQuote.split('. ')[0]}.</span>{' '}
            {theme.outcomeQuote.split('. ').slice(1).join('. ')}
          </blockquote>
        </Rv>
      </section>

      <NextChapter currentSlug="tvk" accent={YELLOW} />
      <SiteFooter />
    </main>
  );
}
