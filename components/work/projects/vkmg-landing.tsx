'use client';

// VKMG landing: SWISS CONSULTANCY microsite. Visible 12-col grid, Archivo Black headlines,
// red / black / paper. Numbered services, index numerals, wireframe-to-polished reveal.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

const PAPER = '#F4F4F0';
const INK = '#0A0A0A';
const RED = '#D90012';
const RED_ON_INK = '#FF4D55';
const GREY = '#4A4A4A';
const ARCH = "var(--font-archivo), 'Archivo Black', Impact, 'Arial Black', sans-serif";

const MARQUEE = [
  'Wireframe workstation',
  'Blueprint grid 0.2x',
  'One palette source',
  'Three colors',
  'No bounce',
  'Public face + operator face',
];

const PLATES: { src: string; alt: string; label: string; cls: string; ratio: string; w: number; h: number; zoom?: boolean }[] = [
  { src: '/work/vkmg-landing/gallery-1.jpg', alt: 'Open-plan office corridor with glass partitions', label: 'Workspace', cls: 'md:col-span-7', ratio: '3 / 2', w: 900, h: 601 },
  { src: '/work/vkmg-landing/gallery-5.jpg', alt: 'Monitor, tablet and phone showing landing page designs', label: 'Devices', cls: 'md:col-span-5 md:mt-16', ratio: '1 / 1', w: 900, h: 1125 },
  { src: '/work/vkmg-landing/gallery-2.jpg', alt: 'Widescreen monitor showing landing page design work', label: 'Design', cls: 'md:col-span-5', ratio: '4 / 3', w: 900, h: 710 },
  { src: '/work/vkmg-landing/gallery-3.jpg', alt: 'Laptop showing source code on a white desk', label: 'Code', cls: 'md:col-span-7 md:mt-10', ratio: '3 / 2', w: 900, h: 600 },
  { src: '/work/vkmg-landing/gallery-6.jpg', alt: 'Browsing a website template marketplace on a laptop', label: 'Marketplace', cls: 'md:col-span-7', ratio: '16 / 9', w: 900, h: 600 },
  { src: '/work/vkmg-landing/gallery-4.jpg', alt: 'Close detail of source code on a laptop screen', label: 'Code, detail', cls: 'md:col-span-5 md:mt-10', ratio: '4 / 3', w: 900, h: 600, zoom: true },
];

// ---------------------------------------------------------------- hooks
function useInView<T extends HTMLElement>(margin = '0px 0px -12% 0px') {
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
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, seen] as const;
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`vk-rev ${seen ? 'vk-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Counter({ value, run }: { value: string; run: boolean }) {
  const target = parseFloat(value);
  const decimals = value.includes('.') ? value.split('.')[1].length : 0;
  const [n, setN] = useState(target);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const t0 = performance.now();
    setN(0);
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1100);
      setN(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);
  return <>{n.toFixed(decimals)}</>;
}

// ---------------------------------------------------------------- layout primitive
function Sec({ id, dark, bg, children, className = '' }: { id?: string; dark?: boolean; bg?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative ${className}`} style={{ background: bg ?? (dark ? INK : PAPER), color: dark ? PAPER : INK }}>
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-[1360px] px-4 md:px-8" aria-hidden="true">
        <div className={`vk-cols h-full ${dark ? 'vk-cols-dark' : ''}`} />
      </div>
      <div className="relative mx-auto max-w-[1360px] px-4 md:px-8">{children}</div>
    </section>
  );
}

function Label({ n, children, dark }: { n: string; children: ReactNode; dark?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.16em]" style={{ color: dark ? RED_ON_INK : RED }}>
      <span className="inline-block h-3 w-3" style={{ background: 'currentColor' }} aria-hidden="true" />
      <span>{n}</span>
      <span style={{ color: dark ? '#C9C9C4' : GREY }}>/ {children}</span>
    </div>
  );
}

// ---------------------------------------------------------------- glyphs (wireframe -> filled on active)
function Glyph({ i }: { i: number }) {
  const paths = [
    <g key="0"><rect className="vk-gf" x="12" y="12" width="40" height="26" /><rect x="12" y="12" width="40" height="26" /><path d="M32 38v8M22 46h20M6 54h52" /></g>,
    <g key="1"><rect className="vk-gf" x="24" y="24" width="16" height="16" /><path d="M8 8h48v48H8zM24 8v48M40 8v48M8 24h48M8 40h48" /></g>,
    <g key="2"><circle className="vk-gf" cx="32" cy="32" r="8" /><circle cx="32" cy="32" r="26" strokeDasharray="2 4.2" /><circle cx="32" cy="32" r="17" /><path d="M32 6v10" /></g>,
    <g key="3"><rect className="vk-gf" x="38" y="38" width="8" height="14" /><path d="M10 14h44M10 26h30M10 38h22M10 50h12" /></g>,
    <g key="4"><rect className="vk-gf" x="10" y="10" width="28" height="28" /><rect x="10" y="10" width="28" height="28" /><rect x="26" y="26" width="28" height="28" /></g>,
    <g key="5"><circle className="vk-gf" cx="20" cy="32" r="12" /><circle cx="20" cy="32" r="12" /><circle cx="44" cy="32" r="12" /><path d="M32 32h0" /></g>,
  ];
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true" className="vk-glyph shrink-0">
      {paths[i % paths.length]}
    </svg>
  );
}

// wireframe overlay that mirrors the hallway perspective of the hero photo
function Wireframe() {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" fill="none" stroke={INK} strokeWidth="1.2" aria-hidden="true">
      <rect width="400" height="500" fill={PAPER} stroke="none" />
      <g className="vk-draw" pathLength={1}>
        <path d="M0 0L196 190M400 0L204 190M0 500L196 250M400 500L204 250" pathLength={1} />
        <path d="M160 175h80v90h-80zM120 150h160v140H120zM60 110h280v220H60z" pathLength={1} />
        <path d="M0 310h400M0 380h400M0 440h400" pathLength={1} stroke={GREY} strokeDasharray="3 5" />
        <path d="M30 360h110v60H30z" pathLength={1} />
        <path d="M270 190h110v160H270z" pathLength={1} />
      </g>
      <g stroke={RED} strokeWidth="1.6">
        <path d="M200 20v60M170 50h60" />
        <circle cx="200" cy="215" r="6" />
      </g>
      <g fill={INK} stroke="none" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="1.5">
        <text x="24" y="478">WIREFRAME / R3F LINE GEOMETRY</text>
        <text x="24" y="30">VP 50.0 / 42.5</text>
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------- page
export default function Page({ theme }: { theme: ProjectTheme }) {
  const quotes = theme.story.quotes;
  const features = theme.features;
  const arch = theme.architecture;

  // typewriter
  const full = theme.subtitle;
  const [typed, setTyped] = useState(full.length);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setTyped(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= full.length) window.clearInterval(id);
    }, 38);
    return () => window.clearInterval(id);
  }, [full]);

  // wireframe -> polished
  const [polished, setPolished] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setPolished(true), 1400);
    return () => window.clearTimeout(t);
  }, []);

  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [layer, setLayer] = useState(0);
  const [archRef, archSeen] = useInView<HTMLDivElement>();
  const [numRef, numSeen] = useInView<HTMLDivElement>();

  return (
    <main style={{ background: PAPER, color: INK }} className="vk-root font-sans">
      <style>{`
        .vk-root *:focus-visible{outline:3px solid ${RED};outline-offset:3px}
        .vk-dark *:focus-visible{outline-color:${RED_ON_INK}}
        .vk-cols{background-image:linear-gradient(to right,rgba(10,10,10,.13) 1px,transparent 1px);background-size:25% 100%;border-right:1px solid rgba(10,10,10,.13)}
        .vk-cols-dark{background-image:linear-gradient(to right,rgba(244,244,240,.14) 1px,transparent 1px);border-right-color:rgba(244,244,240,.14)}
        @media(min-width:768px){.vk-cols{background-size:calc(100% / 12) 100%}}
        .vk-title{font-size:min(23vw,6.6rem)}
        @media(min-width:768px){.vk-title{font-size:min(20vw,11.2rem)}}
        @media(min-width:1024px){.vk-title{font-size:min(12.4vw,11.2rem)}}
        .vk-fig{aspect-ratio:4/5}
        @media(min-width:768px){.vk-fig{aspect-ratio:16/10}}
        @media(min-width:1024px){.vk-fig{aspect-ratio:1/1}}
        .vk-rev{opacity:0;transform:translateY(18px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)}
        .vk-rev.vk-in{opacity:1;transform:none}
        .vk-marq{display:flex;width:max-content;animation:vk-marq 38s linear infinite}
        @keyframes vk-marq{to{transform:translateX(-50%)}}
        .vk-caret{animation:vk-blink 1s steps(1) infinite}
        @keyframes vk-blink{50%{opacity:0}}
        .vk-wipe{transition:clip-path 1.1s cubic-bezier(.7,0,.2,1);clip-path:inset(0 0 0 0)}
        .vk-wipe.vk-off{clip-path:inset(0 0 0 100%)}
        .vk-draw path{stroke-dasharray:1;stroke-dashoffset:1;animation:vk-dash 2.4s .2s cubic-bezier(.6,0,.2,1) forwards}
        @keyframes vk-dash{to{stroke-dashoffset:0}}
        .vk-bar{position:absolute;inset:0;background:${RED};transform:scaleX(0);transform-origin:left;transition:transform .9s cubic-bezier(.7,0,.2,1)}
        .vk-row{position:relative;overflow:hidden;transition:color .4s}
        .vk-row::before{content:"";position:absolute;inset:0;background:${INK};transform:scaleY(0);transform-origin:bottom;transition:transform .45s cubic-bezier(.7,0,.2,1)}
        .vk-row>*{position:relative}
        .vk-row:hover,.vk-row:focus-within{color:${PAPER}}
        .vk-row:hover::before,.vk-row:focus-within::before{transform:scaleY(1)}
        .vk-row:hover .vk-num,.vk-row:focus-within .vk-num{color:${RED_ON_INK}}
        .vk-card{position:relative;overflow:hidden;transition:color .4s}
        .vk-card::before{content:"";position:absolute;inset:0;background:${INK};transform:translateY(101%);transition:transform .5s cubic-bezier(.7,0,.2,1)}
        .vk-card>*{position:relative}
        .vk-card.vk-on,.vk-card:hover{color:${PAPER}}
        .vk-card.vk-on::before,.vk-card:hover::before{transform:none}
        .vk-card.vk-on .vk-num,.vk-card:hover .vk-num{color:${RED_ON_INK}}
        .vk-gf{fill:currentColor;fill-opacity:0;transition:fill-opacity .4s}
        .vk-card.vk-on .vk-gf,.vk-card:hover .vk-gf{fill:${RED_ON_INK};fill-opacity:1;stroke:${RED_ON_INK}}
        .vk-card.vk-on .vk-glyph,.vk-card:hover .vk-glyph{color:${PAPER}}
        .vk-plate img{filter:grayscale(1) contrast(1.05);transition:filter .5s}
        .vk-plate:hover img{filter:none}
        @media(hover:none){.vk-plate img{filter:none}}
        .vk-slab{transition:fill .35s,stroke .35s;cursor:pointer}
        .vk-slabdraw{stroke-dasharray:700;stroke-dashoffset:700;transition:stroke-dashoffset 1.3s cubic-bezier(.6,0,.2,1)}
        .vk-seen .vk-slabdraw{stroke-dashoffset:0}
        .vk-link{transition:transform .3s}
        .vk-link:hover{transform:translateX(6px)}
        @media(prefers-reduced-motion:reduce){
          .vk-marq,.vk-caret{animation:none}
          .vk-rev{opacity:1;transform:none;transition:none}
          .vk-draw path{animation:none;stroke-dashoffset:0}
          .vk-wipe{transition:none}
          .vk-slabdraw{stroke-dashoffset:0;transition:none}
          .vk-row::before,.vk-card::before,.vk-bar{transition:none}
        }
      `}</style>

      {/* ============================ HERO ============================ */}
      <Sec className="pb-12 pt-24 md:pb-20 md:pt-36">
        <div className="grid grid-cols-2 gap-y-2 border-t-[3px] pt-3 font-mono text-[11px] uppercase tracking-[0.18em] lg:grid-cols-12 md:text-xs" style={{ borderColor: INK }}>
          <span className="lg:col-span-3" style={{ color: RED }}>VKMG / 00</span>
          <span className="text-right lg:col-span-3 lg:text-left">IT consultancy</span>
          <span className="lg:col-span-3" style={{ color: GREY }}>Landing page</span>
          <span className="text-right lg:col-span-3" style={{ color: GREY }}>{theme.kicker}</span>
        </div>

        <div className="mt-6 grid gap-8 md:mt-10 lg:grid-cols-12 lg:gap-0">
          <div className="lg:col-span-7">
            <h1 className="vk-title leading-[0.82]" style={{ fontFamily: ARCH, letterSpacing: '-0.04em' }}>
              VKMG<span style={{ color: RED }}>.</span>
            </h1>
            <div className="mt-8 grid gap-6 md:mt-12 lg:grid-cols-7 lg:gap-0">
              <div className="lg:col-span-6">
                <div className="relative">
                  <p aria-hidden="true" className="invisible text-2xl font-semibold leading-tight md:text-4xl" style={{ fontFamily: ARCH }}>{full}</p>
                  <p aria-hidden="true" className="absolute inset-0 text-2xl leading-tight md:text-4xl" style={{ fontFamily: ARCH }}>
                    {full.slice(0, typed)}
                    <span className="vk-caret ml-1 inline-block h-[0.8em] w-[0.12em] translate-y-[0.08em]" style={{ background: RED }} />
                  </p>
                  <p className="sr-only">{full}</p>
                </div>
                <p className="mt-6 max-w-md text-base leading-relaxed" style={{ color: GREY }}>
                  {quotes[1].context}
                </p>
                <a href="#services" className="vk-link mt-8 inline-flex min-h-11 items-center gap-3 px-5 font-mono text-xs uppercase tracking-[0.2em]" style={{ background: INK, color: PAPER }}>
                  Index of services <span style={{ color: RED_ON_INK }} aria-hidden="true">↓</span>
                </a>
              </div>
            </div>
          </div>

          <figure className="lg:col-span-5 lg:pl-8">
            <div
              className="vk-fig relative w-full overflow-hidden"
              style={{ border: `3px solid ${INK}` }}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setPolished(true)}
            >
              <Image src={theme.heroImage} alt="Open-plan office corridor stretching to a vanishing point" fill priority sizes="(min-width: 768px) 38vw, 92vw" className="object-cover" />
              <div className={`vk-wipe absolute inset-0 ${polished ? 'vk-off' : ''}`}>
                <Wireframe />
              </div>
              <span className="absolute left-3 top-3 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.15em]" style={{ background: polished ? INK : RED, color: PAPER }}>
                {polished ? 'Polished' : 'Wireframe'}
              </span>
            </div>
            <figcaption className="mt-3 flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.15em]">
              <span style={{ color: GREY }}>Fig. 01 / Wireframe to polished</span>
              <button type="button" aria-pressed={polished} onClick={() => setPolished((v) => !v)} className="min-h-11 border-2 px-4" style={{ borderColor: INK, background: polished ? INK : 'transparent', color: polished ? PAPER : INK }}>
                {polished ? 'Show wireframe' : 'Reveal'}
              </button>
            </figcaption>
          </figure>
        </div>
      </Sec>

      {/* marquee */}
      <div className="overflow-hidden py-3" style={{ background: RED, color: '#fff' }} aria-hidden="true">
        <div className="vk-marq whitespace-nowrap font-mono text-sm uppercase tracking-[0.2em]">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {MARQUEE.map((m) => (
                <span key={m + k} className="flex items-center">
                  <span className="px-6">{m}</span>
                  <span className="inline-block h-2 w-2 bg-white" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============================ STORY ============================ */}
      <Sec className="py-16 md:py-28">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-3"><Label n="01">Story</Label></div>
          <h2 className="lg:col-span-9" style={{ fontFamily: ARCH, fontSize: 'clamp(2rem, 6vw, 5rem)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            Cinematic, not theatrical.
          </h2>
        </div>
        <ol className="mt-12 border-t-[3px] md:mt-20" style={{ borderColor: INK }}>
          {quotes.map((q, i) => (
            <li key={q.kicker} className="border-b" style={{ borderColor: INK }}>
              <Reveal>
                <div className="vk-row grid gap-4 py-8 md:grid-cols-12 md:gap-0 md:py-10" tabIndex={0}>
                  <div className="vk-num md:col-span-3" style={{ fontFamily: ARCH, fontSize: 'clamp(4rem, 11vw, 9rem)', lineHeight: 0.85, color: RED, transition: 'color .4s' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <blockquote className="md:col-span-5 md:pr-8" style={{ fontFamily: ARCH, fontSize: 'clamp(1.35rem, 2.6vw, 2.3rem)', lineHeight: 1.08, letterSpacing: '-0.01em' }}>
                    {q.quote}
                  </blockquote>
                  <div className="md:col-span-4 md:pl-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">{q.kicker}</p>
                    <p className="mt-3 text-base leading-relaxed opacity-90">{q.context}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Sec>

      {/* ============================ SERVICES ============================ */}
      <Sec id="services" className="pb-16 md:pb-28">
        <div className="grid gap-4 border-t-[3px] pt-10 md:pt-16 lg:grid-cols-12" style={{ borderColor: INK }}>
          <div className="lg:col-span-3"><Label n="02">Services</Label></div>
          <h2 className="lg:col-span-9" style={{ fontFamily: ARCH, fontSize: 'clamp(2rem, 6vw, 5rem)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            Six parts. One console.
          </h2>
        </div>
        <ul className="mt-10 grid gap-px border-2 sm:grid-cols-2 lg:grid-cols-3 md:mt-16" style={{ background: INK, borderColor: INK }}>
          {features.map((f, i) => (
            <li key={f.title} style={{ background: PAPER }}>
              <Reveal delay={(i % 3) * 80}>
                <button
                  type="button"
                  aria-pressed={activeCard === i}
                  onClick={() => setActiveCard((c) => (c === i ? null : i))}
                  className={`vk-card flex min-h-[18rem] w-full flex-col justify-between p-5 text-left md:min-h-[21rem] md:p-6 ${activeCard === i ? 'vk-on' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="vk-num" style={{ fontFamily: ARCH, fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', lineHeight: 0.85, color: RED, transition: 'color .4s' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <Glyph i={i} />
                  </div>
                  <div className="mt-10">
                    <h3 style={{ fontFamily: ARCH, fontSize: 'clamp(1.25rem, 2vw, 1.6rem)', lineHeight: 1.05 }}>{f.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed opacity-90">{f.desc}</p>
                  </div>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: GREY }}>Hover or tap a card: wireframe to polished.</p>
      </Sec>

      {/* ============================ NUMBERS ============================ */}
      <Sec dark className="vk-dark py-16 md:py-28">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-3"><Label n="03" dark>By the numbers</Label></div>
          <h2 className="lg:col-span-9" style={{ fontFamily: ARCH, fontSize: 'clamp(2rem, 6vw, 5rem)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            Restraint, counted.
          </h2>
        </div>
        <div ref={numRef} className="mt-12 grid grid-cols-2 border-t-2 md:mt-20 md:grid-cols-4" style={{ borderColor: PAPER }}>
          {theme.bigNumbers.map((b, i) => (
            <div key={b.label} className={`border-b p-4 md:p-6 ${i % 2 === 1 ? 'border-l' : ''} ${i > 0 ? 'md:border-l' : ''}`} style={{ borderColor: 'rgba(244,244,240,.3)' }}>
              <div style={{ fontFamily: ARCH, fontSize: 'clamp(3.5rem, 9vw, 8rem)', lineHeight: 0.9, letterSpacing: '-0.04em', color: i === 2 ? RED_ON_INK : PAPER }}>
                <Counter value={b.value} run={numSeen} />
              </div>
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em]" style={{ color: '#C9C9C4' }}>{b.label}</p>
            </div>
          ))}
        </div>
      </Sec>

      {/* ============================ ARCHITECTURE ============================ */}
      <Sec className="py-16 md:py-28">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-3"><Label n="04">Architecture</Label></div>
          <h2 className="lg:col-span-9" style={{ fontFamily: ARCH, fontSize: 'clamp(2rem, 6vw, 5rem)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            Four layers, one theme file.
          </h2>
        </div>
        <div ref={archRef} className={`mt-12 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-0 ${archSeen ? 'vk-seen' : ''}`}>
          <div className="md:col-span-5 md:pr-8">
            <svg viewBox="0 0 320 290" className="mx-auto w-full max-w-[420px]" role="img" aria-label="Isometric stack of the four architecture layers">
              {arch.map((a, i) => {
                const y = i * 60;
                const on = layer === i;
                return (
                  <g key={a.layer} className="vk-slab" onClick={() => setLayer(i)}>
                    <path className="vk-slabdraw" style={{ transitionDelay: `${i * 160}ms` }} d={`M160 ${y + 4}L300 ${y + 38}L160 ${y + 72}L20 ${y + 38}Z`} fill={on ? RED : PAPER} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
                    <path d={`M20 ${y + 38}v14l140 34l140-34v-14`} fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" opacity={archSeen ? 1 : 0} style={{ transition: 'opacity .6s 1s' }} />
                    <text x="160" y={y + 43} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="13" letterSpacing="2" fill={on ? '#fff' : INK}>{String(i + 1).padStart(2, '0')} {a.layer.toUpperCase()}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="md:col-span-7 md:pl-8">
            <div role="tablist" aria-label="Architecture layers" className="grid grid-cols-2 border-2 sm:grid-cols-4" style={{ borderColor: INK }}>
              {arch.map((a, i) => (
                <button key={a.layer} role="tab" aria-selected={layer === i} onClick={() => setLayer(i)} className="min-h-12 px-3 py-3 text-left font-mono text-xs uppercase tracking-[0.14em]" style={{ background: layer === i ? INK : PAPER, color: layer === i ? PAPER : INK, borderRight: i < arch.length - 1 ? `1px solid ${INK}` : undefined }}>
                  <span style={{ color: layer === i ? RED_ON_INK : RED }}>{String(i + 1).padStart(2, '0')}</span> {a.layer}
                </button>
              ))}
            </div>
            <div role="tabpanel" className="relative mt-6 overflow-hidden border-2 p-6 md:p-8" style={{ borderColor: INK, minHeight: '13rem' }} key={layer}>
              <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: RED }}>Layer {String(layer + 1).padStart(2, '0')}</p>
              <h3 className="mt-3" style={{ fontFamily: ARCH, fontSize: 'clamp(2rem, 4.5vw, 3.6rem)', lineHeight: 0.95 }}>{arch[layer].layer}</h3>
              <p className="mt-5 max-w-lg text-lg leading-relaxed">{arch[layer].details}</p>
              <div className="vk-bar" style={{ transform: 'scaleX(1)', top: 'auto', height: 6 }} />
            </div>
            <ul className="mt-6 border-t-2" style={{ borderColor: INK }}>
              {arch.map((a, i) => (
                <li key={a.layer} className="grid grid-cols-12 gap-2 border-b py-3 text-sm" style={{ borderColor: 'rgba(10,10,10,.25)', color: layer === i ? INK : GREY }}>
                  <span className="col-span-2 font-mono sm:col-span-1" style={{ color: RED }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="col-span-10 font-semibold sm:col-span-3">{a.layer}</span>
                  <span className="col-span-12 sm:col-span-8">{a.details}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Sec>

      {/* ============================ GALLERY ============================ */}
      <Sec className="pb-16 md:pb-28">
        <div className="grid gap-4 border-t-[3px] pt-10 md:pt-16 lg:grid-cols-12" style={{ borderColor: INK }}>
          <div className="lg:col-span-3"><Label n="05">Plates</Label></div>
          <h2 className="lg:col-span-9" style={{ fontFamily: ARCH, fontSize: 'clamp(2rem, 6vw, 5rem)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            Reference plates.
          </h2>
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-10 md:mt-16 md:grid-cols-12">
          {PLATES.map((p, i) => (
            <Reveal key={p.src} className={p.cls} delay={(i % 2) * 90}>
              <figure className="vk-plate">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: p.ratio, border: `2px solid ${INK}` }}>
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 768px) 55vw, 92vw"
                    className="object-cover"
                    style={p.zoom ? { transform: 'scale(2.1)', transformOrigin: '36% 44%' } : undefined}
                    loading="lazy"
                  />
                </div>
                <figcaption className="mt-3 flex justify-between font-mono text-[11px] uppercase tracking-[0.16em]">
                  <span style={{ color: RED }}>PL.{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ color: GREY }}>{p.label}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Sec>

      {/* ============================ OUTCOME ============================ */}
      <Sec bg={RED} dark className="py-20 md:py-32">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3"><span className="font-mono text-xs uppercase tracking-[0.2em] text-white">06 / Outcome</span></div>
          <Reveal className="lg:col-span-9">
            <p className="text-white" style={{ fontFamily: ARCH, fontSize: 'clamp(2rem, 6.4vw, 5.6rem)', lineHeight: 0.98, letterSpacing: '-0.025em' }}>
              {theme.outcomeQuote}
            </p>
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-white">VKMG / Landing page</p>
          </Reveal>
        </div>
      </Sec>

      {/* ============================ NEXT + FOOTER ============================ */}
      <div className="vk-dark pb-24" style={{ background: INK, color: PAPER }}>
        <NextChapter currentSlug={theme.slug} accent="#FF9096" />
      </div>
      <SiteFooter />
    </main>
  );
}
