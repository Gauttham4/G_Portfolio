'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

const LIVE_URL = 'https://alzheimeric-webapp.onrender.com';
const EASE = [0.22, 0.61, 0.36, 1] as const;

const PERIODS = ['Early morning', 'Mid-morning', 'Midday', 'Afternoon', 'Evening', 'Night'];
const DAY_ORDER = ['Medication reminders', 'Memory album', 'Cognitive quiz module', 'Patient-query inbox', 'Three-role data wall', 'Render-deployed'];

const ROLES = [
  {
    key: 'Patient',
    tone: 'The calm one',
    line: 'A photo-rich, unhurried screen. Nothing clinical, nothing to decode.',
    sees: ['The album', 'The gentle quiz', "The day's reminder"],
  },
  {
    key: 'Caregiver',
    tone: 'The one holding it together',
    line: 'The log, the questions for the doctor, and only the alerts that need action.',
    sees: ['The log', 'The query form', 'The alerts'],
  },
  {
    key: 'Doctor',
    tone: 'The one who needs the picture',
    line: 'Only what they need between visits, already in order.',
    sees: ['The queries', 'The quiz scores', 'Nothing extra'],
  },
];

const STEPS = [
  { n: '1', t: 'Fill in the Patient Query Form', d: 'Complete every required field, then press Submit to save the details.' },
  { n: '2', t: 'Take the Quiz', d: 'Answer every question as best you can, then press Submit.' },
  { n: '3', t: 'Log out from Profile', d: 'The Profile button sits top right. Choose Logout when you are done.' },
];

const CSS = `
.alz-root{--cream:#FBF1E8;--rose:#F4D9D7;--grey:#E8E2DA;--sky:#CFE3EE;--ink:#3F322D;--mute:#65554E;--coral:#E8837A;--deep:#A83F36;
  background:var(--cream);color:var(--ink);font-family:var(--font-manrope),system-ui,sans-serif;overflow-x:clip;font-size:18px;line-height:1.65}
.alz-root *{box-sizing:border-box}
.alz-serif{font-family:var(--font-lora),Georgia,'Times New Roman',serif}
.alz-hand{font-family:var(--font-caveat),'Segoe Script',cursive}
.alz-wrap{width:100%;max-width:1180px;margin:0 auto;padding-left:20px;padding-right:20px}
.alz-pol{background:#fff;padding:10px 10px 0;border-radius:8px;box-shadow:0 14px 28px -14px rgba(63,50,45,.45);
  transform:rotate(var(--r,0deg));transition:transform .5s cubic-bezier(.22,.61,.36,1),box-shadow .5s;outline-offset:4px}
.alz-pol:hover,.alz-pol:focus-visible{transform:rotate(0deg) translateY(-8px) scale(1.03);box-shadow:0 26px 40px -18px rgba(63,50,45,.5)}
.alz-pol:focus-visible,.alz-btn:focus-visible,.alz-tab:focus-visible,.alz-card:focus-visible{outline:3px solid var(--deep)}
.alz-float{animation:alz-float 7s ease-in-out infinite;animation-delay:var(--d,0s)}
@keyframes alz-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.alz-sun{animation:alz-sun 9s ease-in-out infinite}
@keyframes alz-sun{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(1.08);opacity:1}}
.alz-marq{display:flex;gap:2.5rem;width:max-content;animation:alz-marq 38s linear infinite}
@keyframes alz-marq{to{transform:translateX(-50%)}}
.alz-btn{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 22px;border-radius:999px;font-weight:700;font-size:1rem;
  transition:transform .3s ease,background-color .3s ease;text-decoration:none}
.alz-btn:hover{transform:translateY(-3px)}
.alz-tab{min-height:52px;padding:0 22px;border-radius:999px;font-weight:700;font-size:1.05rem;border:2px solid var(--deep);color:var(--deep);background:transparent;cursor:pointer;
  transition:background-color .25s,color .25s,transform .25s}
.alz-tab[aria-selected=true]{background:var(--deep);color:#fff}
.alz-tab:hover{transform:translateY(-2px)}
.alz-card{background:#fff;border-radius:28px;box-shadow:0 18px 36px -24px rgba(63,50,45,.4);transition:transform .4s cubic-bezier(.22,.61,.36,1),box-shadow .4s}
.alz-card:hover{transform:translateY(-5px);box-shadow:0 26px 40px -24px rgba(63,50,45,.45)}
.alz-ruled{background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 33px,rgba(168,63,54,.14) 33px,rgba(168,63,54,.14) 34px)}
.alz-dash{stroke-dasharray:6 8;animation:alz-dash 3s linear infinite}
@keyframes alz-dash{to{stroke-dashoffset:-56}}
@media (prefers-reduced-motion: reduce){
  .alz-float,.alz-sun,.alz-marq,.alz-dash{animation:none!important}
  .alz-pol,.alz-card,.alz-btn,.alz-tab{transition:none!important}
}
`;

function Reveal({ children, delay = 0, y = 26, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) { if (inView) setV(to); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1400);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);
  return <span ref={ref}>{v}</span>;
}

function Polaroid({ src, alt, caption, rot, ratio, sizes, className = '', priority = false }: {
  src: string; alt: string; caption: string; rot: number; ratio: string; sizes: string; className?: string; priority?: boolean;
}) {
  return (
    <figure className={`alz-pol m-0 ${className}`} style={{ ['--r' as string]: `${rot}deg` }} tabIndex={0}>
      <div className="relative w-full overflow-hidden rounded-[3px]" style={{ aspectRatio: ratio }}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} loading={priority ? undefined : 'lazy'} className="object-cover" />
      </div>
      <figcaption className="alz-hand text-center" style={{ fontSize: '1.65rem', lineHeight: 1.1, padding: '12px 4px 14px', color: '#3F322D' }}>
        {caption}
      </figcaption>
    </figure>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="alz-hand mb-2" style={{ fontSize: '1.9rem', color: 'var(--deep)', lineHeight: 1.1 }}>{children}</p>;
}

function H2({ children }: { children: ReactNode }) {
  return <h2 className="alz-serif" style={{ fontSize: 'clamp(2.1rem,6vw,3.6rem)', lineHeight: 1.1, fontWeight: 600, letterSpacing: '-0.01em' }}>{children}</h2>;
}

function Piece({ size = 44, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" fill={color}>
      <path d="M8 12h12a6 6 0 1 1 12 0h8v10a6 6 0 1 1 0 12v10H28a6 6 0 1 0-12 0H8V34a6 6 0 1 0 0-12z" />
    </svg>
  );
}

export default function Page({ theme }: { theme: ProjectTheme }) {
  const [role, setRole] = useState(0);
  const r = ROLES[role];
  const q = theme.story.quotes;
  const marquee = ['Tender', 'Slow', 'Photographic', 'Shared', 'Readable', 'Kind'];

  return (
    <main className="alz-root">
      <style>{CSS}</style>

      {/* HERO */}
      <section className="relative" style={{ background: 'linear-gradient(180deg,#F4D9D7 0%,#FBF1E8 100%)' }}>
        <div className="alz-sun absolute pointer-events-none" aria-hidden="true"
          style={{ right: '-90px', top: '-90px', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,#FBD9B8 0%,rgba(251,217,184,0) 70%)' }} />
        <div className="alz-wrap grid items-center gap-10 pt-24 pb-16 md:pt-36 md:pb-24 lg:grid-cols-[1.05fr_1fr]" style={{ minHeight: '88svh' }}>
          <div className="relative z-10">
            <Reveal>
              <p className="inline-block rounded-full px-4 py-2 text-[0.8rem] font-bold uppercase tracking-[0.12em]" style={{ background: '#fff', color: 'var(--deep)' }}>
                {theme.kicker}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="alz-serif mt-6" style={{ fontSize: 'clamp(3.2rem,15vw,8.5rem)', lineHeight: 0.95, fontWeight: 600, letterSpacing: '-0.025em' }}>
                Alzh<span style={{ color: 'var(--deep)', fontStyle: 'italic' }}>meric</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="alz-serif mt-6 max-w-[30ch]" style={{ fontSize: 'clamp(1.5rem,4.2vw,2.3rem)', lineHeight: 1.3 }}>
                {theme.subtitle}
              </p>
              <p className="mt-4 max-w-[46ch]" style={{ color: 'var(--mute)', fontSize: '1.15rem' }}>
                One soft, shared place for the patient, the family caregiver and the doctor. It is not a clinical system. It is a notebook the whole family can write in.
              </p>
            </Reveal>
            <Reveal delay={0.3} className="mt-8 flex flex-wrap gap-3">
              <a className="alz-btn" href={LIVE_URL} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--deep)', color: '#fff' }}>
                Open the live app
              </a>
              <a className="alz-btn" href="#alz-story" style={{ background: '#fff', color: 'var(--ink)', border: '2px solid var(--ink)' }}>
                Read the story
              </a>
            </Reveal>
          </div>

          <div className="relative mx-auto w-full max-w-[520px]" style={{ height: 'clamp(380px,100vw,560px)' }}>
            <div className="alz-float absolute left-0 top-[6%] w-[64%]" style={{ ['--d' as string]: '0s' }}>
              <Polaroid src="/work/alzhmeric/gallery-2.jpg" alt="Two hands held together in a moment of reassurance" caption="Hold on" rot={-5} ratio="3/2" sizes="(min-width:1024px) 330px, 62vw" priority />
            </div>
            <div className="alz-float absolute right-0 bottom-[2%] w-[52%]" style={{ ['--d' as string]: '-3s' }}>
              <Polaroid src="/work/alzhmeric/gallery-6.jpg" alt="A model of the human brain in cross-section" caption="The memory" rot={6} ratio="16/10" sizes="(min-width:1024px) 270px, 50vw" />
            </div>
            <div className="absolute flex flex-col items-center justify-center text-center" aria-hidden="true"
              style={{ left: '4%', bottom: '4%', width: 112, height: 112, borderRadius: '50%', background: 'var(--coral)', color: '#3F322D', transform: 'rotate(-8deg)' }}>
              <span className="alz-serif" style={{ fontSize: '2.2rem', lineHeight: 1, fontWeight: 700 }}>3</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.15 }}>roles,<br />one truth</span>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden py-5" style={{ background: 'var(--deep)', color: '#fff' }} aria-hidden="true">
        <div className="alz-marq">
          {[...marquee, ...marquee, ...marquee, ...marquee].map((w, i) => (
            <span key={i} className="alz-serif inline-flex items-center gap-10" style={{ fontSize: '1.6rem', fontStyle: 'italic' }}>
              {w} <Piece size={22} color="#F4D9D7" />
            </span>
          ))}
        </div>
      </div>

      {/* STORY */}
      <section id="alz-story" className="py-20 md:py-28">
        <div className="alz-wrap">
          <Reveal><Eyebrow>Why it looks like this</Eyebrow><H2>It should feel like an old photo album.</H2></Reveal>
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-start">
            <Reveal>
              <blockquote className="m-0 rounded-[32px] p-7 md:p-12" style={{ borderLeft: '10px solid var(--coral)', background: '#fff', boxShadow: '0 22px 44px -28px rgba(63,50,45,.5)' }}>
                <p className="alz-hand" style={{ color: 'var(--deep)', fontSize: '1.7rem' }}>{q[0].kicker}</p>
                <p className="alz-serif mt-2" style={{ fontSize: 'clamp(1.45rem,3.6vw,2.15rem)', lineHeight: 1.4 }}>&ldquo;{q[0].quote}&rdquo;</p>
                <footer className="mt-5" style={{ color: 'var(--mute)', fontSize: '1.05rem' }}>{q[0].context}</footer>
              </blockquote>
            </Reveal>
            <div className="grid gap-6">
              <Reveal delay={0.1}>
                <blockquote className="m-0 rounded-[28px] p-7" style={{ background: 'var(--sky)', transform: 'rotate(1.2deg)' }}>
                  <div style={{ color: 'var(--deep)' }}><Piece size={40} /></div>
                  <p className="alz-serif mt-3" style={{ fontSize: '1.5rem', lineHeight: 1.4 }}>&ldquo;{q[1].quote}&rdquo;</p>
                  <footer className="mt-3" style={{ fontSize: '1rem', color: '#4a4540' }}>{q[1].context}</footer>
                </blockquote>
              </Reveal>
              <Reveal delay={0.2}>
                <blockquote className="m-0 rounded-[28px] p-7" style={{ background: 'var(--rose)', transform: 'rotate(-1.2deg)' }}>
                  <p className="alz-serif" style={{ fontSize: '1.5rem', lineHeight: 1.4 }}>&ldquo;{q[2].quote}&rdquo;</p>
                  <footer className="mt-3" style={{ fontSize: '1rem', color: '#5a4a44' }}>{q[2].context}</footer>
                </blockquote>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="py-20 md:py-28" style={{ background: 'var(--grey)' }}>
        <div className="alz-wrap">
          <Reveal><Eyebrow>Three apps, one codebase</Eyebrow><H2>Who sees what</H2></Reveal>
          <div role="tablist" aria-label="Roles" className="mt-8 flex flex-wrap gap-3">
            {ROLES.map((x, i) => (
              <button key={x.key} role="tab" id={`alz-tab-${i}`} aria-selected={role === i} aria-controls="alz-panel" className="alz-tab" onClick={() => setRole(i)}>
                {x.key}
              </button>
            ))}
          </div>
          <div id="alz-panel" role="tabpanel" aria-labelledby={`alz-tab-${role}`} className="mt-8 grid gap-6 rounded-[32px] p-6 md:grid-cols-[1fr_1.1fr] md:p-10" style={{ background: '#fff' }}>
            <div key={role} style={{ animation: 'alz-in .6s cubic-bezier(.22,.61,.36,1) both' }}>
              <p className="alz-hand" style={{ fontSize: '1.9rem', color: 'var(--deep)' }}>{r.tone}</p>
              <h3 className="alz-serif" style={{ fontSize: 'clamp(1.8rem,5vw,2.6rem)', lineHeight: 1.15, fontWeight: 600 }}>{r.key}</h3>
              <p className="mt-3" style={{ color: 'var(--mute)', fontSize: '1.15rem' }}>{r.line}</p>
            </div>
            <ul className="m-0 grid list-none gap-3 p-0">
              {r.sees.map((s) => (
                <li key={r.key + s} className="flex items-center gap-4 rounded-[20px] px-5 py-4" style={{ background: 'var(--cream)', fontSize: '1.2rem', fontWeight: 600, minHeight: 64 }}>
                  <span style={{ color: 'var(--deep)' }}><Piece size={28} /></span>{s}
                </li>
              ))}
            </ul>
          </div>
          <style>{`@keyframes alz-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@media (prefers-reduced-motion: reduce){#alz-panel *{animation:none!important}}`}</style>
        </div>
      </section>

      {/* DAY TIMELINE */}
      <section className="py-20 md:py-28">
        <div className="alz-wrap lg:grid lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start lg:pt-2">
            <Reveal>
              <Eyebrow>A gentle day</Eyebrow>
              <H2>What it does, from sunrise to bedtime</H2>
              <p className="mt-5 max-w-[34ch]" style={{ color: 'var(--mute)', fontSize: '1.15rem' }}>
                Six small jobs, each one placed where it would fall in a real day. Nothing asks for attention before it is needed.
              </p>
              <p className="alz-hand mt-6 hidden lg:block" style={{ fontSize: '2.2rem', color: 'var(--deep)', lineHeight: 1.1, transform: 'rotate(-3deg)' }}>
                slow down, we are not in a hurry
              </p>
            </Reveal>
          </div>
          <ol className="relative m-0 mt-12 list-none p-0 lg:mt-0">
            <motion.span aria-hidden="true" className="absolute block"
              initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: 0.05 }} transition={{ duration: 1.8, ease: EASE }}
              style={{ left: 15, top: 8, bottom: 8, width: 4, borderRadius: 4, transformOrigin: 'top', background: 'linear-gradient(180deg,#E8837A,#A6C5D6,#B9AFA3)' }} />
            {[...theme.features].sort((a, b) => (DAY_ORDER.indexOf(a.title) + 99) % 99 - (DAY_ORDER.indexOf(b.title) + 99) % 99).map((f, i) => (
              <li key={f.title} className="relative pb-8 last:pb-0" style={{ paddingLeft: 52 }}>
                <span aria-hidden="true" className="absolute flex items-center justify-center" style={{ left: 4, top: 8, width: 26, height: 26, borderRadius: '50%', background: '#fff', border: '5px solid var(--coral)' }} />
                <Reveal delay={0.05}>
                  <p className="alz-hand" style={{ fontSize: '1.75rem', color: 'var(--deep)', lineHeight: 1.1 }}>{PERIODS[i] ?? ''}</p>
                  <div className="alz-card mt-2 p-6 md:p-8">
                    <h3 className="alz-serif" style={{ fontSize: 'clamp(1.4rem,3.6vw,1.9rem)', lineHeight: 1.2, fontWeight: 600 }}>{f.title}</h3>
                    <p className="mt-2" style={{ color: 'var(--mute)', fontSize: '1.15rem' }}>{f.desc}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ALBUM + STEPS */}
      <section className="py-20 md:py-28" style={{ background: 'var(--rose)' }}>
        <div className="alz-wrap">
          <Reveal><Eyebrow>The album</Eyebrow><H2>Three small steps for a family</H2></Reveal>
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <ol className="m-0 grid list-none gap-5 p-0">
              {STEPS.map((s, i) => (
                <li key={s.n}>
                  <Reveal delay={i * 0.08}>
                    <div className="flex gap-5 rounded-[28px] bg-white p-6" style={{ transform: `rotate(${[-0.8, 0.6, -0.4][i]}deg)` }}>
                      <span className="alz-serif flex shrink-0 items-center justify-center" style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--coral)', fontSize: '1.7rem', fontWeight: 700, color: '#3F322D' }}>{s.n}</span>
                      <div>
                        <h3 className="alz-serif" style={{ fontSize: '1.45rem', fontWeight: 600, lineHeight: 1.25 }}>{s.t}</h3>
                        <p className="mt-1" style={{ color: 'var(--mute)', fontSize: '1.1rem' }}>{s.d}</p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
            <div className="mx-auto grid w-full max-w-[520px] grid-cols-2 gap-6">
              <Reveal><Polaroid src="/work/alzhmeric/gallery-3.jpg" alt="A plate of colourful pasta with basil leaves" caption="Mealtimes" rot={-4} ratio="1/1" sizes="(min-width:1024px) 240px, 44vw" /></Reveal>
              <Reveal delay={0.12} className="pt-8"><Polaroid src="/work/alzhmeric/gallery-5.jpg" alt="A person resting their head in their hand on a leather armchair" caption="The hard days" rot={5} ratio="1/1" sizes="(min-width:1024px) 240px, 44vw" /></Reveal>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-[900px] items-center gap-8 md:grid-cols-[1fr_1.9fr] md:gap-10">
            <Reveal className="mx-auto w-full max-w-[300px]">
              <Polaroid src="/work/alzhmeric/gallery-4.jpg" alt="A smiling woman in a blue dress and glasses, seated with her hands resting on a chair" caption="The one who cares" rot={-3} ratio="3/4" sizes="(min-width:768px) 300px, 80vw" />
            </Reveal>
            <Reveal delay={0.1}>
              <Polaroid src="/work/alzhmeric/gallery-1.jpg" alt="The app's own three-step guide: fill in the Patient Query Form, take the Quiz, then log out from Profile" caption="The guide the family actually gets" rot={2} ratio="1280/670" sizes="(min-width:768px) 560px, 92vw" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section className="py-20 md:py-28">
        <div className="alz-wrap">
          <Reveal><Eyebrow>Under the album</Eyebrow><H2>Unromantic on purpose</H2></Reveal>
          <p className="mt-4 max-w-[52ch]" style={{ color: 'var(--mute)', fontSize: '1.15rem' }}>The choices that get out of the way, so the family only ever sees the pictures.</p>
          <div className="relative mt-12 grid gap-5 md:grid-cols-2">
            {theme.architecture.map((a, i) => (
              <Reveal key={a.layer} delay={(i % 2) * 0.1}>
                <div className="alz-card h-full p-7" style={{ borderRadius: 24, borderLeft: '8px solid var(--coral)' }}>
                  <p className="alz-hand" style={{ fontSize: '1.5rem', color: 'var(--deep)' }}>Layer {i + 1}</p>
                  <h3 className="alz-serif" style={{ fontSize: '1.9rem', fontWeight: 600, lineHeight: 1.15 }}>{a.layer}</h3>
                  <p className="mt-2" style={{ fontSize: '1.12rem', color: 'var(--mute)' }}>{a.details}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <svg className="mt-8 block w-full" viewBox="0 0 600 40" height="40" preserveAspectRatio="none" aria-hidden="true">
            <path className="alz-dash" d="M4 20 C 150 2, 300 38, 596 20" fill="none" stroke="#E8837A" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      {/* BIG NUMBERS */}
      <section className="py-20 md:py-28" style={{ background: 'var(--sky)' }}>
        <div className="alz-wrap">
          <Reveal><Eyebrow>In numbers</Eyebrow><H2>Small count, big difference</H2></Reveal>
          <ul className="m-0 mt-12 grid list-none grid-cols-2 gap-4 p-0 md:gap-6 lg:grid-cols-4">
            {theme.bigNumbers.map((n, i) => (
              <li key={n.label}>
                <Reveal delay={i * 0.08} className="h-full">
                  <div className="flex h-full flex-col items-center justify-center rounded-[28px] bg-white px-4 py-8 text-center">
                    <span className="alz-serif" style={{ fontSize: 'clamp(3.6rem,13vw,6rem)', lineHeight: 1, fontWeight: 600, color: 'var(--deep)' }}>
                      <Count to={parseInt(n.value, 10) || 0} />
                    </span>
                    <span className="mt-2" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{n.label}</span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* OUTCOME */}
      <section className="py-20 md:py-28">
        <div className="alz-wrap">
          <Reveal>
            <figure className="m-0 rounded-[36px] px-6 py-14 text-center md:px-16 md:py-20" style={{ background: 'var(--deep)', color: '#fff' }}>
              <div className="flex justify-center" style={{ color: '#F4D9D7' }}><Piece size={52} /></div>
              <blockquote className="alz-serif m-0 mx-auto mt-6 max-w-[28ch]" style={{ fontSize: 'clamp(1.7rem,5vw,3.1rem)', lineHeight: 1.3, fontStyle: 'italic' }}>
                &ldquo;{theme.outcomeQuote}&rdquo;
              </blockquote>
              <figcaption className="alz-hand mt-6" style={{ fontSize: '1.8rem', color: '#F4D9D7' }}>after the neurologist took one look</figcaption>
              <a className="alz-btn mt-8" href={LIVE_URL} target="_blank" rel="noopener noreferrer" style={{ background: '#fff', color: 'var(--deep)' }}>
                Visit alzheimeric-webapp
              </a>
            </figure>
          </Reveal>
        </div>
      </section>

      <div style={{ paddingBottom: '6rem', background: '#2A1F1B', color: '#fff' }}>
        <NextChapter currentSlug={theme.slug} accent={theme.palette.accent} />
      </div>
      <SiteFooter />
    </main>
  );
}
