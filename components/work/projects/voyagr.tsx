'use client';

// Voyagr: BOARDING PASS microsite. Sunset gradient, ticket hero with perforation + barcode,
// animated flight path on a route map, itinerary-style feature list.
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

const INK = '#101A3B';
const CREAM = '#F2E7D3';
const GOLD = '#E9B872';
const TEAL = '#2DB6B0';
const CORAL = '#F4795B';
const MUTED = '#B4BCDD';
const SPACE = "var(--font-space), 'Space Grotesk', system-ui, sans-serif";
const MONO = "var(--font-jetbrains), ui-monospace, monospace";

// ---- decorative + sourced data ------------------------------------------------
const TICKER = ['DEPARTURE 18:42', 'GATE 7B', 'VOYAGR', 'ALL SYSTEMS REAL-DATA'];
const PIPELINE = ['fetch_flights', 'fetch_roads', 'fetch_weather', 'build_graph', 'optimize', 'predict_risk', 'return'];
const TIMES = ['06:10', '07:45', '09:20', '11:05', '13:30', '15:00'];

const MODES = [
  { k: 'Flights', src: 'Amadeus API', note: 'Flight legs come from Amadeus, with real fares.' },
  { k: 'Trains', src: 'IRCTC fares via Tavily', note: 'Class breakdown: Sleeper, AC 3-Tier, AC 2-Tier, Chair Car, General.' },
  { k: 'Buses', src: 'RedBus, NueGo, IntrCity via Tavily', note: 'Segmented as Non-AC, Volvo AC and NueGo.' },
  { k: 'Cabs', src: 'Uber and Ola fares', note: 'Operator-specific pricing, side by side.' },
  { k: 'Autos', src: 'Rapido', note: 'Auto rides priced from Rapido.' },
  { k: 'Bikes', src: 'Rapido', note: 'Bike taxis priced from Rapido.' },
];

const FALLBACK_GALLERY = ['PASSPORT · GATE', 'WINDOW · SEAT', 'AIRPORT · HALL', 'LUGGAGE · HOLD', 'MAP · PLAN', 'BOARDING · STAMP'].map(
  (caption, i) => ({ src: `/work/voyagr/gallery-${i + 1}.jpg`, caption, alt: `Voyagr travel reference ${i + 1}` }),
);

// route curve (cubic bezier in a 300x200 box) + pin positions along it
const P = [
  [50, 165],
  [40, 60],
  [260, 170],
  [250, 35],
] as const;
const PATH_D = `M${P[0][0]} ${P[0][1]} C${P[1][0]} ${P[1][1]} ${P[2][0]} ${P[2][1]} ${P[3][0]} ${P[3][1]}`;
function bez(t: number) {
  const u = 1 - t;
  const f = (i: 0 | 1) =>
    u * u * u * P[0][i] + 3 * u * u * t * P[1][i] + 3 * u * t * t * P[2][i] + t * t * t * P[3][i];
  return { x: f(0), y: f(1) };
}
const PINS = MODES.map((_, i) => bez((i + 1) / (MODES.length + 1)));

// deterministic barcode
const BARS = (() => {
  const out: { x: number; w: number }[] = [];
  let s = 7;
  let x = 0;
  for (let i = 0; i < 46; i++) {
    s = (s * 37 + 11) % 97;
    const w = 1 + (s % 4);
    out.push({ x, w });
    x += w + 1 + (s % 3);
  }
  return { bars: out, total: x };
})();

// ---- small parts -------------------------------------------------------------
function Barcode({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${BARS.total} 40`}
      preserveAspectRatio="none"
      className={className}
      role="img"
      aria-label="Decorative barcode"
    >
      {BARS.bars.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height="40" fill={INK} />
      ))}
    </svg>
  );
}

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      setN(to);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / 1300);
          setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
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
  }, [to, reduce]);
  return <span ref={ref}>{n}</span>;
}

function Head({ n, label, title, sub }: { n: string; label: string; title: string; sub?: string }) {
  return (
    <header className="vg-rv mb-10 md:mb-14 max-w-3xl">
      <p className="font-mono text-[13px] tracking-[0.18em] uppercase" style={{ color: GOLD }}>
        <span style={{ color: TEAL }}>{n}</span> &nbsp;/&nbsp; {label}
      </p>
      <h2
        className="mt-3 text-[34px] leading-[1.05] sm:text-5xl md:text-6xl font-bold tracking-tight"
        style={{ fontFamily: SPACE }}
      >
        {title}
      </h2>
      {sub && (
        <p className="mt-4 text-base md:text-lg leading-relaxed" style={{ color: MUTED }}>
          {sub}
        </p>
      )}
    </header>
  );
}

// ---- page --------------------------------------------------------------------
export default function Page({ theme }: { theme: ProjectTheme }) {
  const rootRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [mode, setMode] = useState(0);

  // one shared IntersectionObserver for all scroll reveals
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add('vg-ready');
    const els = Array.from(root.querySelectorAll<HTMLElement>('.vg-rv'));
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((e) => e.classList.add('vg-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('vg-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  const gallery = theme.gallery && theme.gallery.length ? theme.gallery : FALLBACK_GALLERY;
  const outcome = theme.outcomeQuote.split(/(?<=\.)\s+/);
  const active = MODES[mode];

  return (
    <main
      ref={rootRef}
      className="vg-root relative overflow-x-clip"
      style={{ background: INK, color: CREAM, fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      <style>{CSS}</style>

      {/* ============ HERO: the boarding pass ============ */}
      <section className="vg-hero relative px-4 sm:px-6 pt-24 md:pt-36 pb-20 md:pb-28">
        <div className="vg-sun" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="vg-ticker mb-6 md:mb-8" aria-hidden="true">
            <div className="vg-ticker-track font-mono text-[12px] sm:text-[13px] tracking-[0.2em]">
              {[0, 1].map((k) => (
                <div key={k} className="flex shrink-0">
                  {[...TICKER, ...TICKER].map((t, i) => (
                    <span key={i} className="px-4 whitespace-nowrap" style={{ color: i % 4 === 3 ? TEAL : GOLD }}>
                      {t} <span style={{ color: MUTED }}>{'//'}</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <p className="font-mono text-[12px] sm:text-[13px] tracking-[0.18em] uppercase mb-4" style={{ color: MUTED }}>
            {theme.kicker}
          </p>

          <div className="vg-ticket vg-rv" style={{ color: INK }}>
            {/* main */}
            <div className="p-5 sm:p-8 lg:p-10 grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-3 font-mono text-[12px] sm:text-[13px] tracking-[0.16em] uppercase">
                  <span className="flex items-center gap-2 font-bold">
                    <span className="inline-block h-3 w-3 rounded-full" style={{ background: `linear-gradient(135deg, ${CORAL}, ${GOLD})` }} />
                    Boarding pass
                  </span>
                  <span style={{ color: '#0B6B66' }}>Class: real-data</span>
                </div>
                <h1
                  className="mt-5 font-bold leading-[0.9] tracking-tight text-[68px] sm:text-[104px] lg:text-[124px]"
                  style={{ fontFamily: SPACE }}
                >
                  Voyagr<span style={{ color: '#B8452B' }}>.</span>
                </h1>
                <p className="mt-3 text-lg sm:text-xl leading-snug max-w-md font-medium">{theme.subtitle}</p>

                <div className="mt-7 flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-4">
                  <div className="min-w-0">
                    <p className="font-mono text-[12px] tracking-[0.16em] uppercase opacity-70">From</p>
                    <p className="text-[28px] sm:text-4xl lg:text-[27px] xl:text-[29px] 2xl:text-4xl font-bold leading-none" style={{ fontFamily: SPACE }}>Pondicherry</p>
                  </div>
                  <div className="vg-fly flex-1 min-w-[80px] h-9 my-3 sm:my-0 sm:mx-1 relative" aria-hidden="true">
                    <svg className="absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full h-2" preserveAspectRatio="none" viewBox="0 0 100 2">
                      <line className="vg-dash" x1="0" y1="1" x2="100" y2="1" stroke={INK} strokeWidth="2" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />
                    </svg>
                    <svg className="vg-plane absolute left-0 top-1/2 -mt-[13px]" width="26" height="26" viewBox="0 0 24 24" fill="#B8452B">
                      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" transform="rotate(90 12 12)" />
                    </svg>
                  </div>
                  <div className="min-w-0 sm:text-right text-right">
                    <p className="font-mono text-[12px] tracking-[0.16em] uppercase opacity-70">To</p>
                    <p className="text-[28px] sm:text-4xl lg:text-[27px] xl:text-[29px] 2xl:text-4xl font-bold leading-none" style={{ fontFamily: SPACE }}>Jaunpur</p>
                  </div>
                </div>

                <dl className="mt-7 grid grid-cols-4 gap-2 border-t border-dashed pt-4" style={{ borderColor: 'rgba(16,26,59,.35)' }}>
                  {[
                    ['Departs', '18:42'],
                    ['Gate', '7B'],
                    ['Modes', '6'],
                    ['Mocked', '0'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="font-mono text-[11px] sm:text-[12px] tracking-[0.12em] uppercase opacity-70">{k}</dt>
                      <dd className="text-xl sm:text-2xl font-bold" style={{ fontFamily: SPACE }}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="relative w-full aspect-[16/9] lg:aspect-auto lg:min-h-[300px] rounded-2xl overflow-hidden">
                <Image
                  src={theme.heroImage}
                  alt="Mountain ridge above a sea of cloud at sunset"
                  fill
                  priority
                  sizes="(min-width:1024px) 40vw, 92vw"
                  className="object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(16,26,59,0) 55%, rgba(16,26,59,.55))' }} />
                <span className="absolute left-3 bottom-3 font-mono text-[12px] tracking-[0.16em] px-2 py-1 rounded" style={{ background: INK, color: GOLD }}>
                  WINDOW · SEAT
                </span>
              </div>
            </div>

            {/* stub */}
            <div className="vg-stub relative flex items-stretch gap-4 p-5 sm:px-8 lg:flex-col lg:justify-between lg:p-7">
              <div className="flex flex-col justify-between shrink-0">
                <p className="font-mono text-[12px] tracking-[0.18em] uppercase font-bold">Boarding</p>
                <div>
                  <p className="font-mono text-[12px] tracking-[0.12em] uppercase opacity-70">Gate</p>
                  <p className="text-5xl font-bold leading-none" style={{ fontFamily: SPACE }}>7B</p>
                </div>
                <p className="font-mono text-[13px] font-bold">18:42</p>
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="vg-scan relative h-16 lg:h-20">
                  <Barcode className="absolute inset-0 h-full w-full" />
                  <span className="vg-scanline" />
                </div>
                <p className="mt-2 font-mono text-[11px] sm:text-[12px] tracking-[0.14em] uppercase text-center">All systems real-data</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
            <a
              href="#vg-route"
              className="vg-cta inline-flex items-center min-h-[48px] px-6 rounded-full font-mono text-sm font-bold tracking-wide"
              style={{ background: GOLD, color: INK }}
            >
              {'> Plan my journey'}
            </a>
            <a href="#vg-arch" className="vg-link inline-flex items-center min-h-[44px] font-mono text-sm tracking-wide" style={{ color: CREAM }}>
              <span>see the architecture</span>
            </a>
          </div>
          <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed" style={{ color: MUTED }}>
            One conversation. Real prices, real weather, real routes. Across every transport mode in India.
          </p>
        </div>
      </section>

      {/* ============ 01 DELAY NOTICES (quotes) ============ */}
      <section className="px-4 sm:px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Head n="01" label="Departures board" title="Why it exists" sub="Three lines from the story behind the build." />
          <div className="rounded-2xl overflow-hidden border" style={{ background: '#0A1230', borderColor: 'rgba(233,184,114,.25)' }}>
            {theme.story.quotes.map((q, i) => (
              <article
                key={q.kicker}
                className="vg-rv grid gap-3 md:grid-cols-[150px_1fr] lg:grid-cols-[150px_1fr_300px] md:gap-x-8 md:gap-y-3 p-5 sm:p-7 md:p-8 border-b last:border-b-0"
                style={{ borderColor: 'rgba(233,184,114,.18)', transitionDelay: `${i * 90}ms` }}
              >
                <div>
                  <span className="vg-flap inline-block font-mono text-[13px] font-bold tracking-[0.14em] uppercase px-3 py-2 rounded" style={{ background: '#16224A', color: GOLD, animationDelay: `${i * 120}ms` }}>
                    {q.kicker}
                  </span>
                </div>
                <blockquote className="text-[21px] sm:text-2xl md:text-[28px] leading-[1.25] font-medium" style={{ fontFamily: SPACE }}>
                  {'“'}{q.quote}{'”'}
                </blockquote>
                <p className="font-mono text-[13px] leading-relaxed md:col-start-2 lg:col-start-auto" style={{ color: TEAL }}>
                  <span style={{ color: GOLD }}>STATUS ▸ </span>
                  {q.context}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 02 ROUTE MAP ============ */}
      <section id="vg-route" className="px-4 sm:px-6 py-16 md:py-24 scroll-mt-20">
        <div className="mx-auto max-w-6xl">
          <Head
            n="02"
            label="Route map"
            title="Pondicherry to Jaunpur, leg by leg"
            sub="Pick a mode. Every edge in the graph carries the API it came from and when it was retrieved."
          />
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12 items-start">
            <div className="vg-rv relative w-full aspect-[3/2] rounded-2xl overflow-hidden border" style={{ background: 'linear-gradient(160deg,#16224A,#0B1330)', borderColor: 'rgba(233,184,114,.25)' }}>
              <svg viewBox="0 0 300 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                  <pattern id="vg-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M20 0H0V20" fill="none" stroke="rgba(180,188,221,.14)" strokeWidth="0.6" />
                  </pattern>
                  <linearGradient id="vg-route-g" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0" stopColor={CORAL} />
                    <stop offset="1" stopColor={GOLD} />
                  </linearGradient>
                </defs>
                <rect width="300" height="200" fill="url(#vg-grid)" />
                <circle cx={P[3][0]} cy={P[3][1]} r="26" fill="none" stroke="rgba(45,182,176,.35)" strokeWidth="0.8" />
                <circle cx={P[3][0]} cy={P[3][1]} r="14" fill="none" stroke="rgba(45,182,176,.5)" strokeWidth="0.8" />
                <path id="vg-path" d={PATH_D} fill="none" stroke="rgba(242,231,211,.35)" strokeWidth="1.4" strokeDasharray="3 4" />
                <path className="vg-draw" d={PATH_D} pathLength="100" fill="none" stroke="url(#vg-route-g)" strokeWidth="2.4" strokeLinecap="round" />
                {!reduce && (
                  <g fill={CREAM}>
                    <path d="M-8 -5 L9 0 L-8 5 L-4 0 Z" />
                    <animateMotion dur="8s" repeatCount="indefinite" rotate="auto">
                      <mpath href="#vg-path" />
                    </animateMotion>
                  </g>
                )}
              </svg>
              {/* origin + destination */}
              <div className="absolute" style={{ left: `${(P[0][0] / 300) * 100}%`, top: `${(P[0][1] / 200) * 100}%` }}>
                <span className="vg-pulse absolute -left-2 -top-2 h-4 w-4 rounded-full" style={{ background: CORAL }} />
                <span className="absolute left-4 -top-3 font-mono text-[12px] sm:text-[13px] font-bold px-2 py-1 rounded whitespace-nowrap" style={{ background: CORAL, color: INK }}>
                  Pondicherry
                </span>
              </div>
              <div className="absolute" style={{ left: `${(P[3][0] / 300) * 100}%`, top: `${(P[3][1] / 200) * 100}%` }}>
                <span className="vg-pulse absolute -left-2 -top-2 h-4 w-4 rounded-full" style={{ background: TEAL }} />
                <span className="absolute right-4 -top-3 font-mono text-[12px] sm:text-[13px] font-bold px-2 py-1 rounded whitespace-nowrap" style={{ background: TEAL, color: INK }}>
                  Jaunpur
                </span>
              </div>
              {PINS.map((p, i) => (
                <button
                  key={MODES[i].k}
                  type="button"
                  onClick={() => setMode(i)}
                  aria-label={`${MODES[i].k} leg`}
                  aria-pressed={mode === i}
                  className="vg-pin absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
                  style={{ left: `${(p.x / 300) * 100}%`, top: `${(p.y / 200) * 100}%` }}
                >
                  <span
                    className="grid h-7 w-7 place-items-center rounded-full font-mono text-[12px] font-bold transition-transform duration-200"
                    style={{
                      background: mode === i ? GOLD : INK,
                      color: mode === i ? INK : GOLD,
                      border: `2px solid ${GOLD}`,
                      transform: mode === i ? 'scale(1.2)' : 'scale(1)',
                    }}
                  >
                    {i + 1}
                  </span>
                </button>
              ))}
            </div>

            <div className="vg-rv">
              <div role="tablist" aria-label="Transport modes" className="grid grid-cols-3 gap-2">
                {MODES.map((m, i) => (
                  <button
                    key={m.k}
                    type="button"
                    role="tab"
                    aria-selected={mode === i}
                    onClick={() => setMode(i)}
                    className="vg-tab min-h-[46px] rounded-lg font-mono text-[13px] font-bold tracking-wide border"
                    style={{
                      background: mode === i ? GOLD : 'transparent',
                      color: mode === i ? INK : CREAM,
                      borderColor: mode === i ? GOLD : 'rgba(242,231,211,.3)',
                    }}
                  >
                    {i + 1} · {m.k}
                  </button>
                ))}
              </div>
              <div key={mode} role="tabpanel" className="vg-fade mt-4 rounded-xl p-5 border" style={{ background: '#0A1230', borderColor: 'rgba(45,182,176,.45)' }}>
                <p className="font-mono text-[12px] tracking-[0.16em] uppercase" style={{ color: TEAL }}>Leg {mode + 1} of {MODES.length}</p>
                <p className="mt-1 text-2xl font-bold" style={{ fontFamily: SPACE }}>{active.k}</p>
                <p className="mt-2 leading-relaxed" style={{ color: MUTED }}>{active.note}</p>
                <p className="mt-4 font-mono text-[13px] leading-relaxed break-words" style={{ color: CREAM }}>
                  <span style={{ color: GOLD }}>source_api</span> ← {active.src}
                  <br />
                  <span style={{ color: GOLD }}>retrieved_at</span> ← {'<timestamp>'}
                </p>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed" style={{ color: MUTED }}>
                Road legs use real geometry, distance and duration from OpenRouteService. OpenWeather feeds risk into every transit edge.
              </p>
            </div>
          </div>

          {/* the miss that started it */}
          <div className="vg-rv mt-10 md:mt-14 rounded-2xl p-5 sm:p-7 border" style={{ background: 'linear-gradient(120deg,#1F2D5C,#2A2155)', borderColor: 'rgba(244,121,91,.5)' }}>
            <p className="font-mono text-[13px] tracking-[0.16em] uppercase" style={{ color: CORAL }}>The miss that started it</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2 md:gap-8">
              {[
                ['Buffer between connections', 35, TEAL],
                ['Delay on the bus before it', 40, CORAL],
              ].map(([label, v, c]) => (
                <div key={label as string}>
                  <div className="flex justify-between font-mono text-[13px]">
                    <span>{label}</span>
                    <span className="font-bold">{v} min</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(242,231,211,.12)' }}>
                    <div className="vg-bar h-full w-full rounded-full" style={{ background: c as string, ['--w' as string]: `${((v as number) / 40) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 leading-relaxed" style={{ color: MUTED }}>
              Five minutes short is a missed train. The predict_risk node compares the buffer against the likely delay and flags every connection red or green.
            </p>
          </div>
        </div>
      </section>

      {/* ============ 03 ITINERARY (features) ============ */}
      <section className="px-4 sm:px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Head n="03" label="Itinerary" title="Everything on the day sheet" sub="Six things Voyagr does between the first message and the gate." />
          <ol className="max-w-4xl">
            {theme.features.map((f, i) => (
              <li key={f.title} className="vg-it vg-rv grid grid-cols-[58px_22px_1fr] sm:grid-cols-[84px_28px_1fr] gap-x-2 sm:gap-x-4" style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
                <p className="pt-1 font-mono text-[15px] sm:text-lg font-bold" style={{ color: GOLD }}>{TIMES[i] ?? `${String(6 + i).padStart(2, '0')}:00`}</p>
                <div className="relative">
                  <span className="vg-rail absolute left-1/2 top-4 bottom-0 w-[2px] -translate-x-1/2" style={{ background: `linear-gradient(${GOLD}, ${CORAL})`, opacity: i === theme.features.length - 1 ? 0 : 0.7 }} />
                  <span className="vg-dot absolute left-1/2 top-2 h-4 w-4 -translate-x-1/2 rounded-full border-[3px]" style={{ background: INK, borderColor: i % 2 ? TEAL : CORAL }} />
                </div>
                <div className="vg-it-body pb-9 sm:pb-11">
                  <p className="font-mono text-[12px] tracking-[0.16em] uppercase" style={{ color: TEAL }}>Segment {String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-1 text-[22px] sm:text-3xl font-bold leading-tight" style={{ fontFamily: SPACE }}>{f.title}</h3>
                  <p className="mt-2 text-base sm:text-lg leading-relaxed" style={{ color: MUTED }}>{f.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ 04 BAGGAGE TAGS (numbers) ============ */}
      <section className="px-4 sm:px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Head n="04" label="Baggage tags" title="The count, checked in" />
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {theme.bigNumbers.map((b, i) => (
              <div key={b.label} className="vg-tag vg-rv" style={{ ['--r' as string]: `${i % 2 ? 2 : -2}deg`, transitionDelay: `${i * 80}ms` }}>
                <div className="vg-tag-in relative rounded-2xl px-4 pt-12 pb-6 sm:px-6 text-center" style={{ color: INK, background: `linear-gradient(160deg, ${[GOLD, '#F4A261', CREAM, '#7FD6D1'][i % 4]}, ${[CORAL, GOLD, GOLD, TEAL][i % 4]})` }}>
                  <span className="absolute left-1/2 top-4 h-5 w-5 -translate-x-1/2 rounded-full" style={{ background: INK }} />
                  <p className="text-6xl sm:text-7xl font-bold leading-none" style={{ fontFamily: SPACE }}>
                    <Counter to={parseInt(b.value, 10) || 0} />
                  </p>
                  <p className="mt-3 font-mono text-[13px] font-bold tracking-[0.12em] uppercase">{b.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 05 FLIGHT DECK (architecture) ============ */}
      <section id="vg-arch" className="px-4 sm:px-6 py-16 md:py-24 scroll-mt-20">
        <div className="mx-auto max-w-6xl">
          <Head n="05" label="Flight deck" title="Seven nodes between hello and the gate" sub="The LangGraph flow, then the layers it runs on." />
          <ol className="vg-rv flex flex-wrap items-center gap-x-1 gap-y-3 mb-10 md:mb-14" aria-label="Graph pipeline">
            {PIPELINE.map((n, i) => (
              <li key={n} className="flex items-center">
                <span className="vg-node relative inline-flex min-h-[40px] items-center rounded-full px-4 font-mono text-[13px] font-bold border" style={{ borderColor: 'rgba(233,184,114,.5)', background: '#0A1230', color: CREAM }}>
                  <span className="vg-node-glow absolute inset-0 rounded-full" style={{ ['--d' as string]: `${i * 1.1}s`, boxShadow: `0 0 0 2px ${GOLD}` }} />
                  {n}
                </span>
                {i < PIPELINE.length - 1 && <span className="px-1 font-mono" style={{ color: GOLD }} aria-hidden="true">→</span>}
              </li>
            ))}
          </ol>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {theme.architecture.map((a, i) => (
              <article key={a.layer} className="vg-card vg-rv relative rounded-2xl p-6 sm:p-7 border overflow-hidden" style={{ background: 'linear-gradient(160deg,#16224A,#0E1738)', borderColor: 'rgba(233,184,114,.28)', transitionDelay: `${(i % 2) * 90}ms` }}>
                <span className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: [CORAL, GOLD, TEAL, '#C94F7C'][i % 4] }} />
                <p className="font-mono text-[12px] tracking-[0.18em] uppercase" style={{ color: GOLD }}>Layer {String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 text-3xl font-bold" style={{ fontFamily: SPACE }}>{a.layer}</h3>
                <p className="mt-3 leading-relaxed" style={{ color: MUTED }}>{a.details}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 06 POSTCARDS (gallery) ============ */}
      <section className="px-4 sm:px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Head n="06" label="Destinations" title="Postcards from the route" />
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
            {gallery.map((g, i) => (
              <figure key={g.src} className="vg-post vg-rv rounded-xl p-2 sm:p-3" style={{ background: CREAM, color: INK, ['--r' as string]: `${[-1.6, 1.2, -0.8, 1.4, -1.2, 0.9][i % 6]}deg`, transitionDelay: `${(i % 3) * 70}ms` }}>
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-md">
                  <Image src={g.src} alt={g.alt} fill loading="lazy" sizes="(min-width:768px) 30vw, 46vw" className="vg-img object-cover" />
                </div>
                <figcaption className="mt-2 sm:mt-3 flex items-start justify-between gap-2 font-mono text-[12px] sm:text-[13px] font-bold tracking-[0.04em] leading-tight">
                  <span className="min-w-0 pt-0.5">{g.caption}</span>
                  <span className="shrink-0 rounded border px-1.5 py-0.5 text-[11px]" style={{ borderColor: '#B8452B', color: '#B8452B' }}>{String(i + 1).padStart(2, '0')}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ OUTCOME ============ */}
      <section className="px-4 sm:px-6 pt-16 md:pt-24 pb-28 md:pb-32">
        <div className="vg-rv mx-auto max-w-5xl rounded-3xl px-5 py-12 sm:px-12 sm:py-16 text-center border relative" style={{ background: 'linear-gradient(180deg,#2A2155,#6B2F66 55%,#C0507A)', borderColor: 'rgba(233,184,114,.4)' }}>
          <span className="vg-stamp inline-block rotate-[-6deg] rounded-lg border-[3px] px-4 py-2 font-mono text-sm font-bold tracking-[0.2em] uppercase" style={{ borderColor: GOLD, color: GOLD }}>
            Boarded · real data
          </span>
          <blockquote className="mt-8 flex flex-col gap-2 sm:gap-3">
            {outcome.map((line, i) => (
              <p key={i} className="vg-line text-[28px] sm:text-5xl md:text-6xl font-bold leading-[1.08]" style={{ fontFamily: SPACE, animationDelay: `${i * 160}ms`, color: i === 1 ? GOLD : CREAM }}>
                {line}
              </p>
            ))}
          </blockquote>
        </div>
      </section>

      <NextChapter currentSlug="voyagr" accent={GOLD} />
      <SiteFooter />
    </main>
  );
}

// ---- styles ------------------------------------------------------------------
const CSS = `
.vg-root :focus-visible{outline:2px solid ${GOLD};outline-offset:3px;border-radius:6px}
.vg-root h1,.vg-root h2,.vg-root h3{text-wrap:balance}
.vg-root a{text-decoration:none}

/* reveals (only hidden once JS is ready, so no-JS still shows everything) */
.vg-ready .vg-rv{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.7,.2,1)}
.vg-ready .vg-rv.vg-in{opacity:1;transform:none}

/* hero */
.vg-hero{overflow:hidden;background:radial-gradient(ellipse 80% 55% at 50% 42%,rgba(244,121,91,.5),transparent 70%),linear-gradient(180deg,${INK} 0%,#2A2155 48%,#5A2B63 72%,${INK} 100%)}
.vg-hero::after{content:"";position:absolute;left:0;right:0;bottom:0;height:140px;background:linear-gradient(180deg,transparent,${INK});pointer-events:none}
.vg-sun{position:absolute;left:50%;top:230px;width:min(560px,120vw);aspect-ratio:1;margin-left:calc(min(560px,120vw)/-2);border-radius:50%;
  background:linear-gradient(180deg,${GOLD} 10%,${CORAL} 55%,#C94F7C 100%);
  -webkit-mask-image:linear-gradient(to bottom,#000 52%,transparent 52% 57%,#000 57% 67%,transparent 67% 73%,#000 73% 82%,transparent 82% 89%,#000 89% 95%,transparent 95%);
  mask-image:linear-gradient(to bottom,#000 52%,transparent 52% 57%,#000 57% 67%,transparent 67% 73%,#000 73% 82%,transparent 82% 89%,#000 89% 95%,transparent 95%);
  opacity:.85;animation:vg-bob 9s ease-in-out infinite}
@media(min-width:1024px){.vg-sun{top:auto;bottom:-170px;left:auto;right:6%;margin-left:0;width:520px;opacity:.9}}
.vg-ticker{overflow:hidden;border-top:1px solid rgba(233,184,114,.35);border-bottom:1px solid rgba(233,184,114,.35);padding:8px 0}
.vg-ticker-track{display:flex;width:max-content;animation:vg-marq 38s linear infinite}

/* ticket + perforation */
.vg-ticket{--cut:calc(100% - 190px);position:relative;display:grid;grid-template-rows:auto 190px;background:${CREAM};border-radius:24px;
  -webkit-mask-image:radial-gradient(circle 13px at 0 var(--cut),#0000 97%,#000),radial-gradient(circle 13px at 100% var(--cut),#0000 97%,#000);
  -webkit-mask-composite:source-in;
  mask-image:radial-gradient(circle 13px at 0 var(--cut),#0000 97%,#000),radial-gradient(circle 13px at 100% var(--cut),#0000 97%,#000);
  mask-composite:intersect}
.vg-stub{border-top:2px dashed rgba(16,26,59,.4);background:linear-gradient(90deg,#E9DCC2,${CREAM})}
@media(min-width:1024px){
  .vg-ticket{--cut:calc(100% - 270px);grid-template-rows:none;grid-template-columns:1fr 270px;
    -webkit-mask-image:radial-gradient(circle 13px at var(--cut) 0,#0000 97%,#000),radial-gradient(circle 13px at var(--cut) 100%,#0000 97%,#000);
    mask-image:radial-gradient(circle 13px at var(--cut) 0,#0000 97%,#000),radial-gradient(circle 13px at var(--cut) 100%,#0000 97%,#000)}
  .vg-stub{border-top:0;border-left:2px dashed rgba(16,26,59,.4);background:linear-gradient(180deg,#E9DCC2,${CREAM})}
}
.vg-ticket.vg-rv{transform:translateY(30px) rotate(-.6deg)}
.vg-ready .vg-ticket.vg-rv.vg-in{transform:none}
.vg-fly{container-type:inline-size}
.vg-dash{animation:vg-dash 1.2s linear infinite}
.vg-plane{animation:vg-flight 6s ease-in-out infinite}
.vg-scan{container-type:inline-size;overflow:hidden}
.vg-scanline{position:absolute;left:0;top:-4px;bottom:-4px;width:3px;background:${TEAL};box-shadow:0 0 8px ${TEAL};animation:vg-scanx 3.2s ease-in-out infinite}

/* cta */
.vg-cta{transition:transform .2s ease}
.vg-cta:hover{transform:translateY(-2px) rotate(-1deg)}
.vg-link span{background:linear-gradient(${TEAL},${TEAL}) 0 100%/0 2px no-repeat;padding-bottom:3px;transition:background-size .4s ease}
.vg-link:hover span,.vg-link:focus-visible span{background-size:100% 2px}

/* board flap */
.vg-ready .vg-in .vg-flap{animation:vg-flap .6s ease backwards}

/* map */
.vg-draw{stroke-dasharray:100;stroke-dashoffset:100}
.vg-in .vg-draw{animation:vg-draw 2.4s .2s ease forwards}
.vg-pulse{animation:vg-pulse 2s ease-out infinite}
.vg-pin:hover span{transform:scale(1.15)}
.vg-tab{transition:background .2s,color .2s,transform .15s}
.vg-tab:hover{transform:translateY(-1px)}
.vg-fade{animation:vg-fade .35s ease}
.vg-bar{transform-origin:left;transform:scaleX(0)}
.vg-in .vg-bar,.vg-in.vg-bar{animation:vg-grow 1.2s .2s ease forwards}

/* itinerary */
.vg-rail{transform-origin:top;transform:scaleY(0)}
.vg-in .vg-rail{animation:vg-rail 1s .15s ease forwards}
.vg-it-body{transition:transform .25s ease}
.vg-it:hover .vg-it-body{transform:translateX(6px)}
.vg-it:hover .vg-dot{background:${GOLD}!important}
.vg-dot{transition:background .2s}

/* tags */
.vg-tag{transform-origin:50% 0}
.vg-tag-in{transform:rotate(var(--r));transform-origin:50% 0;transition:transform .35s ease}
.vg-tag:hover .vg-tag-in{transform:rotate(0) translateY(-4px)}

/* pipeline + cards */
.vg-node-glow{opacity:0;animation:vg-node 7.7s ease-in-out infinite;animation-delay:var(--d)}
.vg-ready .vg-card.vg-rv.vg-in{transition:transform .25s ease}
.vg-ready .vg-card.vg-rv.vg-in:hover{transform:translateY(-4px)}

/* postcards */
.vg-ready .vg-post.vg-rv.vg-in{transform:rotate(var(--r));transition:transform .3s ease}
.vg-ready .vg-post.vg-rv.vg-in:hover{transform:rotate(0) scale(1.02)}
.vg-img{transition:transform .6s ease}
.vg-post:hover .vg-img{transform:scale(1.05)}

/* outcome */
.vg-line{opacity:1;text-wrap:balance}
.vg-ready .vg-rv:not(.vg-in) .vg-line{opacity:0}
.vg-in .vg-line{animation:vg-up .8s ease backwards}
.vg-in .vg-stamp{animation:vg-stamp .6s .3s cubic-bezier(.3,1.6,.5,1) backwards}

@keyframes vg-marq{to{transform:translateX(-50%)}}
@keyframes vg-bob{50%{transform:translateY(-14px)}}
@keyframes vg-dash{to{stroke-dashoffset:-10}}
@keyframes vg-flight{0%{transform:translateX(0)}100%{transform:translateX(calc(100cqw - 26px))}}
@keyframes vg-scanx{0%,100%{transform:translateX(0)}50%{transform:translateX(calc(100cqw - 3px))}}
@keyframes vg-flap{0%{transform:rotateX(-90deg);opacity:0}100%{transform:none;opacity:1}}
@keyframes vg-draw{to{stroke-dashoffset:0}}
@keyframes vg-pulse{0%{transform:scale(.8);opacity:.9}100%{transform:scale(3);opacity:0}}
@keyframes vg-fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes vg-grow{to{transform:scaleX(1)}}
@keyframes vg-rail{to{transform:scaleY(1)}}
@keyframes vg-node{0%,12%,100%{opacity:0}4%,8%{opacity:1}}
@keyframes vg-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes vg-stamp{from{opacity:0;transform:scale(2.2) rotate(-6deg)}to{opacity:1;transform:rotate(-6deg)}}

/* bars use their own width via custom property */
.vg-bar{width:100%;max-width:100%}
.vg-in .vg-bar{width:var(--w)}

@media (prefers-reduced-motion:reduce){
  .vg-sun,.vg-ticker-track,.vg-dash,.vg-plane,.vg-scanline,.vg-pulse,.vg-node-glow{animation:none!important}
  .vg-ticker{overflow-x:auto}
  .vg-ready .vg-rv,.vg-ticket.vg-rv{opacity:1!important;transform:none!important;transition:none!important}
  .vg-draw{stroke-dashoffset:0!important;animation:none!important}
  .vg-bar,.vg-rail{transform:none!important;animation:none!important}
  .vg-flap,.vg-line,.vg-stamp,.vg-fade{animation:none!important}
  .vg-ready .vg-rv:not(.vg-in) .vg-line{opacity:1}
}
`;
