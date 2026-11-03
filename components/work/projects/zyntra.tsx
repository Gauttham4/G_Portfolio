'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

/* ------------------------------------------------------------------ */
/* Tokens: three colours + paper. No fourth.                           */
/* ------------------------------------------------------------------ */
const PINK = '#FF0099';
const YEL = '#FFEE00';
const JET = '#0A0A0A';
const PAPER = '#FFFFFF';

const BEBAS: CSSProperties = {
  fontFamily: "var(--font-bebas), 'Bebas Neue', Impact, 'Arial Narrow', sans-serif",
  fontWeight: 400,
};
const GROT: CSSProperties = {
  fontFamily: "var(--font-space), 'Space Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif",
};
const MONO: CSSProperties = {
  fontFamily: "var(--font-plex), 'IBM Plex Mono', ui-monospace, Menlo, monospace",
};

const CSS = `
.zy-root{overflow-x:clip}
.zy-root a:focus-visible,.zy-root button:focus-visible{outline:3px solid currentColor;outline-offset:3px}
@keyframes zy-marq{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}
@keyframes zy-marq-r{from{transform:translate3d(-50%,0,0)}to{transform:translate3d(0,0,0)}}
@keyframes zy-rise{from{opacity:0;transform:translate3d(0,38%,0)}to{opacity:1;transform:translate3d(0,0,0)}}
@keyframes zy-wob{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
.zy-marq{display:flex;width:max-content;animation:zy-marq 34s linear infinite;will-change:transform}
.zy-marq-r{animation-name:zy-marq-r;animation-duration:42s}
.zy-letter{display:inline-block;opacity:0;animation:zy-rise .75s cubic-bezier(.16,1,.3,1) forwards;animation-delay:calc(var(--i) * .11s + .08s)}
.zy-rise{animation:zy-rise .6s cubic-bezier(.16,1,.3,1) both}
.zy-wob{animation:zy-wob 5s ease-in-out infinite}
.zy-tilt{transform:rotate(calc(var(--r,0deg) * .5));transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s cubic-bezier(.16,1,.3,1)}
@media (min-width:768px){.zy-tilt{transform:rotate(var(--r,0deg))}}
.zy-tilt:hover{transform:translate3d(4px,4px,0) rotate(0deg)}
.zy-press{transition:transform .2s cubic-bezier(.16,1,.3,1),box-shadow .2s cubic-bezier(.16,1,.3,1)}
.zy-press:hover{transform:translate3d(3px,3px,0)}
.zy-press:active{transform:translate3d(6px,6px,0)}
.zy-scene{transition:opacity .6s cubic-bezier(.16,1,.3,1)}
@media (prefers-reduced-motion:reduce){
  .zy-marq,.zy-wob{animation:none!important}
  .zy-letter,.zy-rise{animation:none!important;opacity:1!important;transform:none!important}
  .zy-scene,.zy-tilt,.zy-press{transition:none!important}
}
`;

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */
function Reveal({ children, delay = 0, className, style }: { children: ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} style={style}>{children}</div>;
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setV(to);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      (es) => {
        if (!es.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / 1100);
          setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
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
  return <span ref={ref}>{v}</span>;
}

function Eyebrow({ children, color }: { children: ReactNode; color: string }) {
  return (
    <p className="text-[13px] md:text-sm uppercase tracking-[0.2em] font-medium" style={{ ...MONO, color }}>
      {children}
    </p>
  );
}

function H2({ children, color, shadow }: { children: ReactNode; color: string; shadow?: string }) {
  return (
    <h2
      className="mt-3 leading-[0.86] uppercase"
      style={{ ...BEBAS, color, fontSize: 'clamp(3.25rem, 12vw, 9rem)', textShadow: shadow ? `0.04em 0.04em 0 ${shadow}` : undefined }}
    >
      {children}
    </h2>
  );
}

function Sticker({ children, bg, fg, rot, className = '' }: { children: ReactNode; bg: string; fg: string; rot: number; className?: string }) {
  return (
    <span
      className={`inline-block px-3 py-2 text-[13px] md:text-sm font-bold uppercase tracking-wider border-[3px] ${className}`}
      style={{ ...GROT, background: bg, color: fg, borderColor: JET, boxShadow: `4px 4px 0 ${JET}`, transform: `rotate(${rot}deg)` }}
    >
      {children}
    </span>
  );
}

function Band({ words, bg, fg, rot, reverse }: { words: string[]; bg: string; fg: string; rot: number; reverse?: boolean }) {
  const items = [...words, ...words];
  const group = (k: number) => (
    <div key={k} className="flex shrink-0 items-center" aria-hidden={k > 0 ? true : undefined}>
      {items.map((w, i) => (
        <span key={i} className="flex items-center gap-5 px-3 md:gap-8 md:px-4 whitespace-nowrap">
          {w}
          <span className="inline-block h-3 w-3 md:h-4 md:w-4" style={{ background: fg }} />
        </span>
      ))}
    </div>
  );
  return (
    <div
      className="relative border-y-[4px]"
      style={{ background: bg, color: fg, borderColor: JET, width: '106%', marginLeft: '-3%', transform: `rotate(${rot}deg)` }}
    >
      <div className={`zy-marq ${reverse ? 'zy-marq-r' : ''} py-2 md:py-3 uppercase leading-none`} style={{ ...BEBAS, fontSize: 'clamp(2.25rem, 6vw, 4.75rem)' }}>
        {group(0)}
        {group(1)}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */
const BAND_A = ['Marquee letters at 14vw', 'Scene swaps in 0.6s', 'Zero frameworks', 'No build step', 'PHP + MySQL'];
const BAND_B = ['Magenta', 'Yellow', 'Jet black', 'Three colours only', 'GSAP + ScrollTrigger', 'Vanilla JS'];

const SCENES = [
  { id: '#services', name: 'Services', bg: PINK, fg: JET, accent: YEL, note: 'Hot magenta and jet black.' },
  { id: '#process', name: 'Process', bg: YEL, fg: JET, accent: PINK, note: 'Neon-yellow accents. The timeline lives here.' },
  { id: '#testimonials', name: 'Testimonials', bg: PINK, fg: JET, accent: YEL, note: 'Back to magenta.' },
  { id: '#contact', name: 'Contact', bg: JET, fg: PAPER, accent: PINK, note: 'Jet black, magenta CTAs. PHP + MySQL behind the form.' },
];

const STILLS = [
  { src: '/work/zyntra/gallery-1.jpg', alt: 'Deep-blue planet and moon drifting in space', pos: '50% 50%', rot: -2, bg: YEL },
  { src: '/work/zyntra/gallery-2.jpg', alt: 'Smiling farmer in an orange turban crouching in a green crop field at sunset', pos: '70% 50%', rot: 2.5, bg: PINK },
  { src: '/work/zyntra/gallery-3.jpg', alt: 'Illustrated e-commerce landing page mockup with a phone and shopping bags', pos: '50% 50%', rot: -2.5, bg: PINK },
  { src: '/work/zyntra/gallery-4.jpg', alt: 'Animated blue cat in a garden scene, smiling', pos: '72% 50%', rot: 2, bg: YEL },
  { src: '/work/zyntra/gallery-5.jpg', alt: 'Animated blue cat pointing along a railing at night with a city behind', pos: '70% 50%', rot: -1.5, bg: YEL },
  { src: '/work/zyntra/gallery-6.jpg', alt: 'Laptop screen showing a marketplace of website themes', pos: '40% 50%', rot: 3, bg: PINK },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function Page({ theme }: { theme: ProjectTheme }) {
  const [run, setRun] = useState(0);
  const [scene, setScene] = useState(0);
  const [layer, setLayer] = useState(0);
  const letters = 'ZYNTRA'.split('');
  const quoteBlocks = [
    { bg: PINK, fg: JET, shadow: YEL, rot: -1.2 },
    { bg: YEL, fg: JET, shadow: PINK, rot: 1.2 },
    { bg: PAPER, fg: JET, shadow: PINK, rot: -0.8 },
  ];
  const cardBg = [PAPER, YEL, PAPER, YEL, PAPER, YEL];
  const numColors = [YEL, PINK, PAPER, YEL];
  const arch = theme.architecture;
  const cur = arch[layer] ?? arch[0];

  return (
    <div className="zy-root" style={{ ...GROT, background: JET, color: PAPER }}>
      <style>{CSS}</style>

      {/* ============================ HERO ============================ */}
      <section className="relative px-4 pt-24 pb-16 md:px-10 md:pt-36 md:pb-24 min-h-[88svh]" style={{ background: YEL, color: JET }}>
        <div className="mx-auto max-w-[88rem]">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
            <Sticker bg={JET} fg={YEL} rot={-2}>{theme.kicker}</Sticker>
            <Sticker bg={PINK} fg={JET} rot={2}>PHP · MySQL · GSAP</Sticker>
          </div>

          <h1
            key={run}
            aria-label={theme.title}
            className="mt-6 md:mt-8 uppercase select-none"
            style={{ ...BEBAS, fontSize: 'min(36vw, 34rem)', lineHeight: 0.82, textShadow: `0.05em 0.05em 0 ${PINK}`, color: JET }}
          >
            {letters.map((l, i) => (
              <span key={i} aria-hidden className="zy-letter" style={{ ['--i' as string]: i } as CSSProperties}>
                {l}
              </span>
            ))}
          </h1>

          <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-16">
            <div>
              <p className="uppercase leading-[0.92]" style={{ ...BEBAS, fontSize: 'clamp(2.25rem, 6.4vw, 5rem)' }}>
                {theme.subtitle}
              </p>
              <p className="mt-6 max-w-xl text-base md:text-lg font-medium leading-relaxed">
                A digital-agency landing page built to be the work it advertises. Massive marquee type, palette swaps like scene changes, and a loading screen that spells the name out one letter at a time.
              </p>
              <button
                type="button"
                onClick={() => setRun((n) => n + 1)}
                className="zy-press mt-8 inline-flex min-h-12 items-center gap-3 border-[3px] px-6 py-2 uppercase"
                style={{ ...BEBAS, fontSize: '1.6rem', letterSpacing: '0.04em', background: JET, color: YEL, borderColor: JET, boxShadow: `6px 6px 0 ${PINK}` }}
              >
                <span aria-hidden>↻</span> Replay Z-Y-N-T-R-A
              </button>
            </div>

            <div className="relative pt-6 pr-2">
              <div className="relative aspect-[16/10] w-full overflow-hidden border-[4px]" style={{ borderColor: JET, boxShadow: `10px 10px 0 ${JET}`, background: JET }}>
                <Image src={theme.heroImage} alt="Deep-blue planet and moon drifting in space" fill priority sizes="(min-width:1024px) 45vw, 92vw" className="object-cover" />
              </div>
              <div
                className="zy-wob absolute -top-1 right-0 flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-full border-[4px] text-center uppercase leading-[0.9]"
                style={{ ...BEBAS, background: PINK, color: JET, borderColor: JET, boxShadow: `4px 4px 0 ${JET}`, fontSize: 'clamp(1.35rem, 3vw, 1.9rem)' }}
              >
                0<br />frame&shy;works
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ BANDS ============================ */}
      <section aria-hidden className="overflow-hidden py-10 md:py-14" style={{ background: JET }}>
        <Band words={BAND_A} bg={PINK} fg={JET} rot={-2} />
        <div className="-mt-3 md:-mt-4">
          <Band words={BAND_B} bg={YEL} fg={JET} rot={1.5} reverse />
        </div>
      </section>

      {/* ============================ QUOTES ============================ */}
      <section className="px-4 py-20 md:px-10 md:py-32" style={{ background: JET, color: PAPER }}>
        <div className="mx-auto max-w-[88rem]">
          <Reveal>
            <Eyebrow color={YEL}>The brief, in three lines</Eyebrow>
            <H2 color={PAPER} shadow={PINK}>Say it loud</H2>
          </Reveal>
          <div className="mt-12 flex flex-col gap-10 md:mt-16 md:gap-14">
            {theme.story.quotes.map((q, i) => {
              const b = quoteBlocks[i % quoteBlocks.length];
              return (
                <Reveal key={q.kicker} className={i % 2 === 1 ? 'md:ml-auto md:w-[88%]' : 'md:w-[88%]'}>
                  <figure
                    className="zy-tilt border-[4px] p-6 md:p-10"
                    style={{ ['--r' as string]: `${b.rot}deg`, background: b.bg, color: b.fg, borderColor: JET, boxShadow: `10px 10px 0 ${b.shadow}` } as CSSProperties}
                  >
                    <figcaption className="flex items-center gap-3 text-[13px] md:text-sm uppercase tracking-[0.2em] font-semibold" style={MONO}>
                      <span className="inline-block px-2 py-1" style={{ background: JET, color: b.bg === PAPER ? PAPER : b.bg }}>{String(i + 1).padStart(2, '0')}</span>
                      {q.kicker}
                    </figcaption>
                    <blockquote className="mt-5 uppercase leading-[0.95]" style={{ ...BEBAS, fontSize: 'clamp(2rem, 5.4vw, 4.5rem)' }}>
                      {q.quote}
                    </blockquote>
                    <p className="mt-5 max-w-2xl text-base md:text-lg font-medium leading-relaxed">{q.context}</p>
                  </figure>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ SCENE SWAP ============================ */}
      <section className="px-4 py-20 md:px-10 md:py-32" style={{ background: PAPER, color: JET }}>
        <div className="mx-auto max-w-[88rem]">
          <Reveal>
            <Eyebrow color={JET}>Interactive · four scenes, 0.6s ease-out-cubic</Eyebrow>
            <H2 color={JET} shadow={PINK}>Scene swap</H2>
            <p className="mt-5 max-w-2xl text-base md:text-lg font-medium leading-relaxed">
              The palette swap is the rhythm of the page: magenta, yellow, magenta, black. Pick a scene and watch the whole block change.
            </p>
          </Reveal>

          <div role="tablist" aria-label="Zyntra scenes" className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {SCENES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                id={`zy-tab-${i}`}
                aria-selected={scene === i}
                aria-controls={`zy-scene-${i}`}
                onClick={() => setScene(i)}
                className="zy-press flex min-h-14 items-center gap-3 border-[3px] px-3 py-2 text-left uppercase"
                style={{
                  ...BEBAS,
                  fontSize: '1.5rem',
                  letterSpacing: '0.03em',
                  borderColor: JET,
                  background: scene === i ? JET : PAPER,
                  color: scene === i ? YEL : JET,
                  boxShadow: scene === i ? `0 0 0 ${JET}` : `5px 5px 0 ${JET}`,
                  transform: scene === i ? 'translate3d(5px,5px,0)' : undefined,
                }}
              >
                <span aria-hidden className="inline-block h-5 w-5 shrink-0 border-2" style={{ background: s.bg, borderColor: scene === i ? YEL : JET }} />
                {s.name}
              </button>
            ))}
          </div>

          <div className="mt-8 grid border-[4px]" style={{ borderColor: JET, boxShadow: `10px 10px 0 ${JET}` }}>
            {SCENES.map((s, i) => (
              <div
                key={s.id}
                id={`zy-scene-${i}`}
                role="tabpanel"
                aria-labelledby={`zy-tab-${i}`}
                aria-hidden={scene !== i}
                className="zy-scene flex min-h-[22rem] flex-col justify-between gap-8 p-5 md:min-h-[30rem] md:p-10"
                style={{ gridArea: '1 / 1', background: s.bg, color: s.fg, opacity: scene === i ? 1 : 0, pointerEvents: scene === i ? 'auto' : 'none' }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <span className="text-[13px] md:text-sm uppercase tracking-[0.2em] font-semibold" style={MONO}>
                    Scene {String(i + 1).padStart(2, '0')} / 04 · {s.id}
                  </span>
                  <Sticker bg={s.accent} fg={JET} rot={i % 2 ? 2 : -2}>{s.bg === JET ? 'magenta CTAs' : 'bg tween 0.6s'}</Sticker>
                </div>
                <div>
                  <p className="max-w-md text-base md:text-xl font-semibold">{s.note}</p>
                  <p
                    className="mt-3 uppercase leading-[0.82]"
                    style={{ ...BEBAS, fontSize: 'clamp(3.25rem, 14vw, 11rem)', textShadow: `0.04em 0.04em 0 ${s.accent}` }}
                  >
                    {s.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ FEATURES ============================ */}
      <section className="px-4 py-20 md:px-10 md:py-32" style={{ background: PINK, color: JET }}>
        <div className="mx-auto max-w-[88rem]">
          <Reveal>
            <Eyebrow color={JET}>What shipped</Eyebrow>
            <H2 color={JET} shadow={PAPER}>Six loud moves</H2>
          </Reveal>
          <ul className="mt-12 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
            {theme.features.map((f, i) => (
              <li key={f.title}>
                <Reveal delay={(i % 3) * 0.08} className="h-full">
                  <article
                    className="zy-tilt h-full border-[4px] p-6 md:p-7"
                    style={{ ['--r' as string]: `${i % 2 ? 1.4 : -1.4}deg`, background: cardBg[i % cardBg.length], borderColor: JET, boxShadow: `8px 8px 0 ${JET}` } as CSSProperties}
                  >
                    <span aria-hidden className="block leading-none" style={{ ...BEBAS, fontSize: '4.5rem', color: JET, WebkitTextStroke: '0', textShadow: `0.05em 0.05em 0 ${PINK}` }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-3 uppercase leading-[0.95]" style={{ ...BEBAS, fontSize: 'clamp(2rem, 3.4vw, 2.6rem)' }}>
                      {f.title}
                    </h3>
                    <p className="mt-3 text-base font-medium leading-relaxed">{f.desc}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================ NUMBERS ============================ */}
      <section className="px-4 py-20 md:px-10 md:py-32" style={{ background: JET, color: PAPER }}>
        <div className="mx-auto max-w-[88rem]">
          <Reveal>
            <Eyebrow color={YEL}>By the numbers</Eyebrow>
            <H2 color={PAPER} shadow={PINK}>Loud, but lean</H2>
          </Reveal>
          <dl className="mt-12 grid grid-cols-2 gap-4 md:mt-16 md:gap-6 lg:grid-cols-4">
            {theme.bigNumbers.map((n, i) => {
              const num = Number(n.value);
              return (
                <Reveal key={n.label} delay={i * 0.07}>
                  <div className="border-[4px] p-4 md:p-6" style={{ borderColor: numColors[i % 4], boxShadow: `6px 6px 0 ${numColors[(i + 1) % 4] === PAPER ? PINK : numColors[(i + 1) % 4]}` }}>
                    <dd className="m-0 leading-[0.85]" style={{ ...BEBAS, fontSize: 'clamp(4.5rem, 14vw, 10rem)', color: numColors[i % 4] }}>
                      {Number.isNaN(num) ? n.value : <Counter to={num} />}
                    </dd>
                    <dt className="mt-3 text-[13px] md:text-sm uppercase tracking-[0.16em] font-semibold" style={{ ...MONO, color: PAPER }}>
                      {n.label}
                    </dt>
                  </div>
                </Reveal>
              );
            })}
          </dl>
        </div>
      </section>

      {/* ============================ ARCHITECTURE ============================ */}
      <section className="px-4 py-20 md:px-10 md:py-32" style={{ background: YEL, color: JET }}>
        <div className="mx-auto max-w-[88rem]">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <Eyebrow color={JET}>Under the poster</Eyebrow>
                <H2 color={JET} shadow={PINK}>The stack</H2>
              </div>
              <Sticker bg={JET} fg={YEL} rot={-3}>No build step</Sticker>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-[18rem_1fr] lg:gap-10">
            <div role="tablist" aria-label="Architecture layers" className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-4">
              {arch.map((a, i) => (
                <button
                  key={a.layer}
                  type="button"
                  role="tab"
                  aria-selected={layer === i}
                  aria-controls="zy-layer-panel"
                  onClick={() => setLayer(i)}
                  className="zy-press flex min-h-14 items-center gap-3 border-[3px] px-3 py-2 text-left uppercase"
                  style={{
                    ...BEBAS,
                    fontSize: '1.7rem',
                    borderColor: JET,
                    background: layer === i ? JET : PAPER,
                    color: layer === i ? YEL : JET,
                    boxShadow: layer === i ? `0 0 0 ${JET}` : `5px 5px 0 ${JET}`,
                    transform: layer === i ? 'translate3d(5px,5px,0)' : undefined,
                  }}
                >
                  <span aria-hidden className="text-base" style={MONO}>{String(i + 1).padStart(2, '0')}</span>
                  {a.layer}
                </button>
              ))}
            </div>

            <div id="zy-layer-panel" role="tabpanel" className="border-[4px] p-6 md:p-10" style={{ background: JET, color: PAPER, borderColor: JET, boxShadow: `10px 10px 0 ${PINK}` }}>
              <div key={layer} className="zy-rise">
                <span className="text-[13px] md:text-sm uppercase tracking-[0.2em] font-semibold" style={{ ...MONO, color: YEL }}>
                  Layer {String(layer + 1).padStart(2, '0')} / {String(arch.length).padStart(2, '0')}
                </span>
                <p className="mt-3 uppercase leading-[0.85]" style={{ ...BEBAS, fontSize: 'clamp(4rem, 13vw, 9rem)', color: PINK, textShadow: `0.04em 0.04em 0 ${YEL}` }}>
                  {cur.layer}
                </p>
                <p className="mt-5 max-w-2xl text-lg md:text-2xl font-medium leading-snug">{cur.details}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ STILLS ============================ */}
      <section className="px-4 py-20 md:px-10 md:py-32" style={{ background: PAPER, color: JET }}>
        <div className="mx-auto max-w-[88rem]">
          <Reveal>
            <Eyebrow color={JET}>The reel</Eyebrow>
            <H2 color={JET} shadow={PINK}>Stills</H2>
          </Reveal>
          <ul className="mt-12 grid grid-cols-2 gap-5 md:mt-16 md:gap-8 lg:grid-cols-3">
            {STILLS.map((s, i) => (
              <li key={s.src} className={i % 3 === 1 ? 'lg:mt-12' : ''}>
                <Reveal delay={i * 0.07}>
                  <figure
                    className="zy-tilt m-0 border-[4px] p-2 md:p-3"
                    style={{ ['--r' as string]: `${s.rot}deg`, background: s.bg, borderColor: JET, boxShadow: `7px 7px 0 ${JET}` } as CSSProperties}
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden border-[3px]" style={{ borderColor: JET, background: JET }}>
                      <Image src={s.src} alt={s.alt} fill loading="lazy" sizes="(min-width:1024px) 30vw, 46vw" className="object-cover" style={{ objectPosition: s.pos }} />
                    </div>
                    <figcaption className="mt-2 text-[13px] md:text-sm uppercase tracking-[0.18em] font-semibold" style={MONO}>
                      Frame {String(i + 1).padStart(2, '0')}
                    </figcaption>
                  </figure>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================ OUTCOME ============================ */}
      <section className="px-4 pt-20 pb-28 md:px-10 md:pt-32 md:pb-36" style={{ background: JET, color: PAPER }}>
        <div className="mx-auto max-w-[88rem]">
          <Reveal>
            <Eyebrow color={YEL}>The one thing that stays still</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <blockquote
              className="mt-6 uppercase leading-[0.9]"
              style={{ ...BEBAS, fontSize: 'clamp(2.6rem, 8.4vw, 7.5rem)', color: YEL, textShadow: `0.04em 0.04em 0 ${PINK}` }}
            >
              {theme.outcomeQuote}
            </blockquote>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12 flex gap-2 md:gap-4" aria-label="Z Y N T R A">
              {letters.map((l, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="zy-tilt flex aspect-square min-w-0 max-w-24 flex-1 md:max-w-36 items-center justify-center border-[3px] md:border-[4px]"
                  style={{
                    ...BEBAS,
                    ['--r' as string]: `${i % 2 ? 4 : -4}deg`,
                    fontSize: 'clamp(2rem, 7vw, 6rem)',
                    background: [PINK, YEL, PAPER][i % 3],
                    color: JET,
                    borderColor: PAPER,
                    boxShadow: `5px 5px 0 ${[YEL, PINK, PINK][i % 3]}`,
                  } as CSSProperties}
                >
                  {l}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <NextChapter currentSlug={theme.slug} accent={PINK} />
      <SiteFooter />
    </div>
  );
}
