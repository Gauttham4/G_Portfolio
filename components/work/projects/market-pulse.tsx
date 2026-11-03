'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

/* ------------------------------------------------------------------ */
/* tokens                                                              */
/* ------------------------------------------------------------------ */
const BULL = '#22C55E';
const BEAR = '#EF4444';
const BEAR_TXT = '#F87171';
const INK = '#E5EDF7';
const DIM = '#7C8AA0';
const BG = '#0B0E12';
const BG2 = '#11161D';
const GRID = '#1B2330';
const OSW: CSSProperties = { fontFamily: "var(--font-oswald), 'Arial Narrow', Impact, sans-serif" };
const MONO: CSSProperties = { fontFamily: "var(--font-plex), 'JetBrains Mono', ui-monospace, monospace" };

const INTERVALS = ['1m', '5m', '15m', '1h', '1d', '1w'] as const;
const VOL: Record<string, number> = { '1m': 1.2, '5m': 1.8, '15m': 2.4, '1h': 3.2, '1d': 4.6, '1w': 6.4 };

const TAPE: { s: string; v: string; d: 'up' | 'down' | 'flat' }[] = [
  { s: 'TICK·FLASH', v: '220ms', d: 'up' },
  { s: 'PAYWALLED·CANDLES', v: '0', d: 'down' },
  { s: 'HTTP+DIO', v: '2 clients', d: 'up' },
  { s: 'INTERVALS', v: '1m 5m 15m 1h 1d 1w', d: 'flat' },
  { s: 'FLUTTER', v: '3.6', d: 'up' },
  { s: 'ALERTS', v: 'LOCAL', d: 'up' },
  { s: 'ACCOUNTS', v: '0', d: 'down' },
  { s: 'SCREENS', v: '6', d: 'up' },
  { s: 'CURRENCY', v: 'INR / USD', d: 'flat' },
];

/* ------------------------------------------------------------------ */
/* data helpers                                                        */
/* ------------------------------------------------------------------ */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Candle = { o: number; h: number; l: number; c: number; v: number };

function genCandles(seed: number, vol: number, n = 36): Candle[] {
  const r = rng(seed * 977 + 13);
  const out: Candle[] = [];
  let prev = 100;
  for (let i = 0; i < n; i++) {
    const o = prev;
    const c = o + (r() - 0.46) * vol;
    const h = Math.max(o, c) + r() * vol * 0.6;
    const l = Math.min(o, c) - r() * vol * 0.6;
    out.push({ o, h, l, c, v: 0.25 + r() * 0.75 });
    prev = c;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* small parts                                                         */
/* ------------------------------------------------------------------ */
function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const target = parseInt(value, 10);
  const [n, setN] = useState(target);
  useEffect(() => {
    if (!inView || reduce || !Number.isFinite(target)) return;
    let raf = 0;
    const t0 = performance.now();
    const dur = 1000;
    setN(0);
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target]);
  return <span ref={ref}>{Number.isFinite(target) ? n : value}</span>;
}

function SectionHead({ idx, label, title }: { idx: string; label: string; title: string }) {
  return (
    <div className="mb-8 md:mb-12">
      <p className="text-[12px] md:text-[13px] tracking-[0.18em] uppercase" style={{ ...MONO, color: BULL }}>
        {'// '}{idx} · {label}
      </p>
      <h2
        className="mt-2 uppercase leading-[0.95] text-[2.4rem] sm:text-5xl md:text-6xl"
        style={{ ...OSW, fontWeight: 600, color: INK }}
      >
        {title}
      </h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* hero chart                                                          */
/* ------------------------------------------------------------------ */
function LiveChart() {
  const [iv, setIv] = useState<(typeof INTERVALS)[number]>('1h');
  const idx = INTERVALS.indexOf(iv);
  const candles = useMemo(() => genCandles(idx + 3, VOL[iv]), [idx, iv]);
  const W = 600;
  const PX0 = 8;
  const PX1 = 592;
  const PY0 = 14;
  const PY1 = 206;
  const VY0 = 224;
  const VY1 = 292;
  const lo = Math.min(...candles.map((c) => c.l));
  const hi = Math.max(...candles.map((c) => c.h));
  const y = (p: number) => PY1 - ((p - lo) / (hi - lo)) * (PY1 - PY0);
  const step = (PX1 - PX0) / candles.length;
  const bw = step * 0.58;
  const first = candles[0].o;
  const lastClose = candles[candles.length - 1].c;
  const closePath = candles.map((c, i) => `${i ? 'L' : 'M'}${(PX0 + step * (i + 0.5)).toFixed(1)} ${y(c.c).toFixed(1)}`).join(' ');

  const [tick, setTick] = useState({ price: lastClose, dir: 0, n: 0 });
  useEffect(() => {
    setTick({ price: lastClose, dir: 0, n: 0 });
    const r = typeof window !== 'undefined' ? Math.random : () => 0.5;
    const id = window.setInterval(() => {
      setTick((t) => {
        const d = (r() - 0.5) * VOL[iv] * 0.5;
        return { price: t.price + d, dir: d >= 0 ? 1 : -1, n: t.n + 1 };
      });
    }, 1600);
    return () => window.clearInterval(id);
  }, [lastClose, iv]);

  const diff = tick.price - first;
  const up = diff >= 0;
  const tagTop = Math.min(94, Math.max(6, (y(tick.price) / 300) * 100));

  return (
    <div className="relative border" style={{ borderColor: GRID, background: BG2 }}>
      <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: GRID }}>
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: BEAR }} aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: DIM }} aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: BULL }} aria-hidden />
        <span className="ml-2 text-[11px] sm:text-xs tracking-widest uppercase truncate" style={{ ...MONO, color: DIM }}>
          mp://chart · simulated feed
        </span>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 px-3 pt-4 sm:px-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em]" style={{ ...MONO, color: DIM }}>
            MARKETPULSE · {iv}
          </p>
          <div className="relative mt-1 inline-block px-2 -mx-2 overflow-hidden">
            <span
              key={tick.n}
              aria-hidden
              className={tick.n ? (tick.dir > 0 ? 'mp-flash mp-up' : 'mp-flash mp-dn') : ''}
              style={{ position: 'absolute', inset: 0, opacity: 0, background: tick.dir >= 0 ? BULL : BEAR }}
            />
            <span
              className="relative text-4xl sm:text-5xl tabular-nums"
              style={{ ...OSW, fontWeight: 500, color: tick.dir < 0 ? BEAR_TXT : INK }}
              aria-live="off"
            >
              {tick.price.toFixed(2)}
            </span>
          </div>
        </div>
        <p className="text-sm sm:text-base tabular-nums pb-1" style={{ ...MONO, color: up ? BULL : BEAR_TXT }}>
          {up ? '▲ +' : '▼ '}
          {diff.toFixed(2)} ({up ? '+' : ''}
          {((diff / first) * 100).toFixed(2)}%)
        </p>
      </div>

      <div role="group" aria-label="Candle interval" className="flex flex-wrap gap-1.5 px-3 pt-3 sm:px-5">
        {INTERVALS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setIv(k)}
            aria-pressed={iv === k}
            className="mp-chip min-h-[40px] min-w-[44px] px-3 text-sm border"
            style={{
              ...MONO,
              borderColor: iv === k ? BULL : GRID,
              color: iv === k ? BG : INK,
              background: iv === k ? BULL : 'transparent',
              fontWeight: iv === k ? 600 : 400,
            }}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="relative mt-3 px-1 sm:px-3 pb-3" style={{ aspectRatio: '600 / 300' }}>
        <svg
          key={iv}
          viewBox={`0 0 ${W} 300`}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={`Illustrative candlestick chart at the ${iv} interval, simulated data`}
          preserveAspectRatio="none"
        >
          {[0, 1, 2, 3, 4].map((g) => (
            <line key={g} x1={PX0} x2={PX1} y1={PY0 + ((PY1 - PY0) / 4) * g} y2={PY0 + ((PY1 - PY0) / 4) * g} stroke={GRID} strokeWidth="1" />
          ))}
          {candles.map((c, i) => {
            const cx = PX0 + step * (i + 0.5);
            const col = c.c >= c.o ? BULL : BEAR;
            const top = y(Math.max(c.o, c.c));
            const bot = y(Math.min(c.o, c.c));
            return (
              <g key={i} className="mp-c" style={{ animationDelay: `${i * 30}ms` }}>
                <line x1={cx} x2={cx} y1={y(c.h)} y2={y(c.l)} stroke={col} strokeWidth="1.6" />
                <rect x={cx - bw / 2} y={top} width={bw} height={Math.max(2, bot - top)} fill={col} />
                <rect x={cx - bw / 2} y={VY1 - c.v * (VY1 - VY0)} width={bw} height={c.v * (VY1 - VY0)} fill={col} opacity="0.35" />
              </g>
            );
          })}
          <path d={closePath} pathLength={1} className="mp-draw" fill="none" stroke={INK} strokeOpacity="0.6" strokeWidth="1.4" strokeLinejoin="round" />
          <line x1={PX0} x2={PX1} y1={y(lastClose)} y2={y(lastClose)} stroke={up ? BULL : BEAR} strokeDasharray="4 4" strokeOpacity="0.7" />
        </svg>
        <span
          className="absolute right-1 sm:right-3 px-1.5 py-0.5 text-[11px] sm:text-xs tabular-nums"
          style={{ ...MONO, top: `${tagTop}%`, transform: 'translateY(-50%)', background: up ? BULL : BEAR, color: up ? BG : '#fff', transition: 'top .5s' }}
        >
          {tick.price.toFixed(2)}
        </span>
      </div>
      <p className="px-3 pb-3 sm:px-5 text-[11px] tracking-wider uppercase" style={{ ...MONO, color: DIM }}>
        Illustrative data · generated in the browser · not market quotes
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* page                                                                */
/* ------------------------------------------------------------------ */
export default function Page({ theme }: { theme: ProjectTheme }) {
  const [q, setQ] = useState(0);
  const quote = theme.story.quotes[q];
  const gal = theme.gallery ?? [];
  const shots = [
    { src: '/work/market-pulse/gallery-1.jpg', cap: gal[0]?.caption ?? 'CHART · CANDLE', alt: 'Red and green candlesticks with moving averages on a dark chart', cls: 'md:col-span-7 aspect-[16/10]' },
    { src: '/work/market-pulse/gallery-3.jpg', cap: gal[2]?.caption ?? 'DATA · GREEN-RED', alt: 'Angled screen with candlesticks, volume bars and an order list', cls: 'md:col-span-5 md:row-span-2 aspect-[4/5] md:aspect-auto md:min-h-full' },
    { src: '/work/market-pulse/gallery-2.jpg', cap: gal[1]?.caption ?? 'TRADING · DESK', alt: 'Trading screen with a candle chart and a price panel', cls: 'md:col-span-7 aspect-[16/10]' },
  ];
  const more = [
    { src: '/work/market-pulse/gallery-4.jpg', cap: gal[3]?.caption ?? 'GRAPH · LINE', alt: 'Hand on a laptop showing a revenue dashboard' },
    { src: '/work/market-pulse/gallery-5.jpg', cap: gal[4]?.caption ?? 'PATTERN · CHART', alt: 'Chart pattern on a trading screen' },
    { src: '/work/market-pulse/gallery-6.jpg', cap: gal[5]?.caption ?? 'MOBILE · TRADE', alt: 'Code on a laptop screen, lit in blue and violet' },
  ];
  const asks = theme.features.slice(0, 3);
  const bids = theme.features.slice(3);
  const flow1 = ['Tick endpoint (http)', 'Poll', 'Chart controller', 'Candles redraw'];
  const flow2 = ['Poll', 'Thresholds checked', 'Local notification', 'Last-fired stamp'];

  const featureRow = (f: { title: string; desc: string }, i: number, side: 'ask' | 'bid') => {
    const col = side === 'ask' ? BEAR : BULL;
    const txt = side === 'ask' ? BEAR_TXT : BULL;
    const w = [92, 74, 58, 66, 80, 96][i] ?? 70;
    return (
      <Reveal key={f.title} delay={(i % 3) * 0.05}>
        <div className="mp-row relative grid items-start gap-x-4 gap-y-1 px-3 py-4 sm:px-5 border-b md:grid-cols-[4rem_15rem_1fr] md:items-center" style={{ borderColor: GRID }}>
          <motion.div
            aria-hidden
            className="absolute inset-y-0 right-0"
            style={{ width: `${w}%`, background: col, opacity: 0.1, transformOrigin: 'right center' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
          <span className="relative text-sm tabular-nums" style={{ ...MONO, color: txt }}>
            F{String(theme.features.indexOf(f) + 1).padStart(2, '0')} {side === 'ask' ? '▼' : '▲'}
          </span>
          <h3 className="relative text-2xl uppercase leading-none" style={{ ...OSW, fontWeight: 500, color: INK }}>
            {f.title}
          </h3>
          <p className="relative text-sm sm:text-[15px] leading-relaxed" style={{ ...MONO, color: '#B6C2D4' }}>
            {f.desc}
          </p>
        </div>
      </Reveal>
    );
  };

  return (
    <div className="mp-root relative overflow-x-clip" style={{ background: BG, color: INK }}>
      <style>{`
        .mp-root *:focus-visible{outline:2px solid ${BULL};outline-offset:3px}
        .mp-tapewrap:hover .mp-tape{animation-play-state:paused}
        .mp-tape{display:flex;width:max-content;animation:mp-tape 48s linear infinite;will-change:transform}
        @keyframes mp-tape{to{transform:translateX(-50%)}}
        .mp-blink{animation:mp-blink 1.06s steps(1) infinite}
        @keyframes mp-blink{50%{opacity:0}}
        .mp-c{opacity:0;transform:translateY(10px);transform-box:fill-box;animation:mp-in .5s cubic-bezier(.16,1,.3,1) forwards}
        @keyframes mp-in{to{opacity:1;transform:none}}
        .mp-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:mp-draw 1.8s .3s ease-out forwards}
        @keyframes mp-draw{to{stroke-dashoffset:0}}
        .mp-flash{animation:mp-flash .44s ease-out}
        @keyframes mp-flash{0%{opacity:0}50%{opacity:.34}100%{opacity:0}}
        .mp-boot{opacity:0;animation:mp-in .4s ease-out forwards}
        .mp-pane{animation:mp-in .45s cubic-bezier(.16,1,.3,1) both;opacity:0}
        .mp-chip{transition:transform .15s,background .15s}
        .mp-chip:active{transform:scale(.96)}
        .mp-row{transition:background .2s}
        .mp-row:hover{background:rgba(229,237,247,.04)}
        .mp-img img{transition:transform .6s cubic-bezier(.16,1,.3,1)}
        .mp-img:hover img{transform:scale(1.04)}
        .mp-pipe{position:relative;height:2px;background:${GRID};overflow:hidden}
        .mp-pipe i{position:absolute;top:0;left:0;height:2px;width:18%;background:${BULL};animation:mp-run 2.8s linear infinite}
        @keyframes mp-run{from{transform:translateX(-100%)}to{transform:translateX(560%)}}
        .mp-rail{transform-origin:top;animation:mp-rail 1.4s .2s ease-out both}
        @keyframes mp-rail{from{transform:scaleY(0)}to{transform:scaleY(1)}}
        @media (prefers-reduced-motion: reduce){
          .mp-tape,.mp-blink,.mp-flash,.mp-pipe i,.mp-rail{animation:none}
          .mp-c,.mp-boot,.mp-pane{animation:none;opacity:1;transform:none}
          .mp-draw{animation:none;stroke-dashoffset:0}
          .mp-img img{transition:none}
        }
      `}</style>

      <div className="pt-24 md:pt-36 pb-24">
        {/* ticker */}
        <div className="mp-tapewrap border-y overflow-hidden" style={{ borderColor: GRID, background: BG2 }} aria-label="Project facts ticker" role="marquee">
          <div className="mp-tape">
            {[0, 1].map((half) => (
              <div key={half} className="flex shrink-0" aria-hidden={half === 1}>
                {[...TAPE, ...TAPE].map((t, i) => (
                  <span key={i} className="flex items-center gap-2 px-5 py-3 text-[13px] whitespace-nowrap" style={MONO}>
                    <b style={{ color: INK, fontWeight: 500 }}>{t.s}</b>
                    <span style={{ color: t.d === 'down' ? BEAR_TXT : t.d === 'up' ? BULL : DIM }}>
                      {t.d === 'up' ? '▲' : t.d === 'down' ? '▼' : '■'} {t.v}
                    </span>
                    <span style={{ color: GRID }} aria-hidden>|</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10">
          {/* hero */}
          <header className="grid gap-10 lg:gap-12 lg:grid-cols-[1.05fr_1fr] items-center pt-10 md:pt-14 pb-16 md:pb-24 min-h-[70svh]">
            <div>
              <p className="text-[12px] md:text-[13px] tracking-[0.16em] uppercase" style={{ ...MONO, color: DIM }}>
                {theme.kicker}
              </p>
              <h1 className="mt-4 uppercase leading-[0.86]" style={{ ...OSW, fontWeight: 700, fontSize: 'clamp(3.6rem, 15vw, 9.5rem)' }}>
                <span style={{ color: INK }}>Market</span>
                <br />
                <span style={{ color: BULL }}>Pulse</span>
                <span className="mp-blink inline-block" style={{ background: BULL, width: '0.4em', height: '0.78em', marginLeft: '0.08em' }} aria-hidden />
              </h1>
              <p className="mt-6 max-w-[34rem] text-lg md:text-xl leading-snug" style={{ ...MONO, color: INK }}>
                <span style={{ color: BULL }}>$ </span>
                {theme.subtitle}
              </p>
              <ul className="mt-6 space-y-1.5 text-[13px] sm:text-sm" style={MONO} aria-label="Boot log">
                {[
                  ['flutter 3.6', 'android + ios, one codebase', BULL],
                  ['alerts', 'local, no account system', BULL],
                  ['paywall', 'none on candle intervals', BULL],
                ].map(([k, v, c], i) => (
                  <li key={k} className="mp-boot flex gap-2" style={{ animationDelay: `${0.5 + i * 0.35}s` }}>
                    <span style={{ color: DIM }}>&gt;</span>
                    <span style={{ color: INK }}>{k}</span>
                    <span style={{ color: GRID }} className="hidden sm:inline" aria-hidden>.........</span>
                    <span style={{ color: c }}>{v}</span>
                  </li>
                ))}
              </ul>
              <div className="relative mt-6 aspect-[16/5] max-w-[34rem] overflow-hidden border" style={{ borderColor: GRID }}>
                <Image src={theme.heroImage} alt="Red and green candlesticks on a dark trading chart" fill priority sizes="(min-width: 1024px) 34rem, 92vw" className="object-cover" />
                <span className="absolute left-0 bottom-0 px-2 py-1 text-[11px] tracking-widest uppercase" style={{ ...MONO, background: BG, color: BEAR_TXT }}>
                  Feed 01 ▼
                </span>
              </div>
            </div>
            <div className="relative">
              <LiveChart />
            </div>
          </header>

          {/* big numbers */}
          <Reveal>
            <section aria-label="Key numbers" className="grid grid-cols-2 lg:grid-cols-4 border" style={{ borderColor: GRID, background: BG2 }}>
              {theme.bigNumbers.map((b, i) => (
                <div
                  key={b.label}
                  className="p-5 sm:p-7 border-b lg:border-b-0 even:border-l lg:border-l"
                  style={{ borderColor: GRID }}
                >
                  <p className="text-[11px] uppercase tracking-[0.2em]" style={{ ...MONO, color: DIM }}>
                    {b.label}
                  </p>
                  <p className="mt-2 text-6xl sm:text-7xl leading-none tabular-nums" style={{ ...OSW, fontWeight: 600, color: i % 2 ? BEAR_TXT : BULL }}>
                    <Counter value={b.value} />
                  </p>
                </div>
              ))}
            </section>
          </Reveal>

          {/* story */}
          <section className="pt-24 md:pt-32" aria-labelledby="mp-story">
            <SectionHead idx="02" label="TRADE LOG" title="Why it exists" />
            <h3 id="mp-story" className="sr-only">Story quotes</h3>
            <div className="grid gap-6 md:grid-cols-[14rem_1fr]">
              <div role="tablist" aria-label="Story quotes" className="flex md:flex-col gap-2">
                {theme.story.quotes.map((s, i) => (
                  <button
                    key={s.kicker}
                    role="tab"
                    id={`mp-tab-${i}`}
                    aria-selected={q === i}
                    aria-controls="mp-pane"
                    type="button"
                    onClick={() => setQ(i)}
                    className="mp-chip flex-1 md:flex-none min-h-[48px] px-4 text-left text-sm border flex items-center justify-between gap-2"
                    style={{ ...MONO, borderColor: q === i ? BULL : GRID, background: q === i ? 'rgba(34,197,94,.1)' : BG2, color: q === i ? BULL : INK }}
                  >
                    <span>{s.kicker.replace('Quote ', 'LOG ')}</span>
                    <span aria-hidden>{q === i ? '●' : '○'}</span>
                  </button>
                ))}
              </div>
              <div id="mp-pane" role="tabpanel" aria-labelledby={`mp-tab-${q}`} className="border p-5 sm:p-8 md:p-10 min-h-[18rem]" style={{ borderColor: GRID, background: BG2 }}>
                <div key={q} className="mp-pane">
                  <p className="text-[12px] tracking-widest uppercase" style={{ ...MONO, color: DIM }}>
                    {quote.kicker} · logged
                  </p>
                  <blockquote className="mt-4 text-[1.7rem] sm:text-4xl lg:text-5xl leading-[1.08] uppercase" style={{ ...OSW, fontWeight: 500 }}>
                    &ldquo;{quote.quote}&rdquo;
                  </blockquote>
                  <p className="mt-6 max-w-2xl text-sm sm:text-[15px] leading-relaxed" style={{ ...MONO, color: '#B6C2D4' }}>
                    <span style={{ color: BULL }}>{'// '}</span>
                    {quote.context}
                    <span className="mp-blink" style={{ color: BULL }} aria-hidden> ▌</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* features: order book */}
          <section className="pt-24 md:pt-32" aria-labelledby="mp-feat">
            <SectionHead idx="03" label="ORDER BOOK" title="What it does" />
            <h3 id="mp-feat" className="sr-only">Features</h3>
            <div className="border" style={{ borderColor: GRID, background: BG2 }}>
              <div className="hidden md:grid grid-cols-[4rem_15rem_1fr] gap-x-4 px-5 py-2 border-b text-[11px] uppercase tracking-[0.2em]" style={{ ...MONO, color: DIM, borderColor: GRID }}>
                <span>ID</span>
                <span>Feature</span>
                <span>Spec</span>
              </div>
              {asks.map((f, i) => featureRow(f, i, 'ask'))}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 sm:px-5 py-3 border-b" style={{ borderColor: GRID, background: BG }}>
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em]" style={{ ...MONO, color: DIM }}>Last</span>
                <span className="text-3xl sm:text-4xl tabular-nums" style={{ ...OSW, fontWeight: 600, color: BULL }}>
                  220<span className="text-lg" style={{ color: DIM }}>ms</span> ▲
                </span>
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-right" style={{ ...MONO, color: DIM }}>Tick flash</span>
              </div>
              {bids.map((f, i) => featureRow(f, i + 3, 'bid'))}
            </div>
          </section>

          {/* architecture */}
          <section className="pt-24 md:pt-32" aria-labelledby="mp-arch">
            <SectionHead idx="04" label="DEPTH OF STACK" title="How it is built" />
            <h3 id="mp-arch" className="sr-only">Architecture layers</h3>
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
              <ol className="relative pl-8 sm:pl-10">
                <span aria-hidden className="mp-rail absolute left-[9px] sm:left-[11px] top-2 bottom-2 w-px" style={{ background: BULL }} />
                {theme.architecture.map((a, i) => (
                  <Reveal key={a.layer} delay={i * 0.07} className="relative pb-7 last:pb-0">
                    <span aria-hidden className="absolute -left-8 sm:-left-10 top-1.5 h-5 w-5 sm:h-6 sm:w-6 border-2 flex items-center justify-center" style={{ borderColor: BULL, background: BG }}>
                      <span className="h-1.5 w-1.5" style={{ background: i % 2 ? BEAR : BULL }} />
                    </span>
                    <h4 className="text-3xl uppercase leading-none" style={{ ...OSW, fontWeight: 500 }}>
                      {a.layer}
                    </h4>
                    <p className="mt-2 text-sm sm:text-[15px] leading-relaxed" style={{ ...MONO, color: '#B6C2D4' }}>
                      {a.details}
                    </p>
                  </Reveal>
                ))}
              </ol>
              <Reveal>
                <div className="border p-5 sm:p-7" style={{ borderColor: GRID, background: BG2 }}>
                  <p className="text-[11px] uppercase tracking-[0.2em]" style={{ ...MONO, color: DIM }}>
                    Data flow · two pipes
                  </p>
                  {[
                    { name: 'Hot path', steps: flow1 },
                    { name: 'Alert path', steps: flow2 },
                  ].map((p) => (
                    <div key={p.name} className="mt-6">
                      <p className="text-xl uppercase" style={{ ...OSW, fontWeight: 500, color: p.name === 'Hot path' ? BULL : BEAR_TXT }}>
                        {p.name}
                      </p>
                      <div className="mp-pipe mt-2" aria-hidden><i /></div>
                      <ol className="mt-3 flex flex-col items-start gap-y-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-2 text-[13px]" style={MONO}>
                        {p.steps.map((s, i) => (
                          <li key={s} className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
                            <span className="border px-2 py-1" style={{ borderColor: GRID, color: INK }}>{s}</span>
                            {i < p.steps.length - 1 && (
                              <span aria-hidden style={{ color: DIM }}>
                                <span className="sm:hidden pl-3">↓</span>
                                <span className="hidden sm:inline">→</span>
                              </span>
                            )}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                  <p className="mt-6 text-xs leading-relaxed" style={{ ...MONO, color: DIM }}>
                    http carries the hot tick path. dio handles news and historical candles, where cancellation and retries matter.
                  </p>
                </div>
              </Reveal>
            </div>
          </section>

          {/* gallery */}
          <section className="pt-24 md:pt-32" aria-labelledby="mp-gal">
            <SectionHead idx="05" label="CHART WALL" title="Reference tape" />
            <h3 id="mp-gal" className="sr-only">Gallery</h3>
            <div className="grid gap-3 md:grid-cols-12">
              {shots.map((s, i) => (
                <Reveal key={s.src} delay={i * 0.06} className={`${s.cls} md:flex`}>
                  <figure className="mp-img relative w-full h-full overflow-hidden border" style={{ borderColor: GRID, background: BG2 }}>
                    <div className="absolute inset-0">
                      <Image src={s.src} alt={s.alt} fill sizes="(min-width: 768px) 46vw, 100vw" className="object-cover" loading="lazy" />
                    </div>
                    <figcaption className="absolute left-0 bottom-0 px-3 py-2 text-[12px] tracking-widest uppercase" style={{ ...MONO, background: BG, color: BULL }}>
                      {s.cap} ▲
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {more.map((s, i) => (
                <Reveal key={s.src} delay={i * 0.06}>
                  <figure className="mp-img relative w-full aspect-[16/10] sm:aspect-[4/3] overflow-hidden border" style={{ borderColor: GRID, background: BG2 }}>
                    <Image src={s.src} alt={s.alt} fill sizes="(min-width: 640px) 30vw, 100vw" className="object-cover" loading="lazy" />
                    <figcaption className="absolute left-0 bottom-0 px-3 py-2 text-[12px] tracking-widest uppercase" style={{ ...MONO, background: BG, color: BULL }}>
                      {s.cap} ▲
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
            <p className="mt-3 text-[11px] tracking-wider uppercase" style={{ ...MONO, color: DIM }}>
              Stock reference imagery for mood. Not screens from the app.
            </p>
          </section>

          {/* outcome */}
          <section className="pt-24 md:pt-32" aria-labelledby="mp-out">
            <SectionHead idx="06" label="POSITION" title="Outcome" />
            <h3 id="mp-out" className="sr-only">Outcome quote</h3>
            <Reveal>
              <div className="border p-6 sm:p-10 md:p-14" style={{ borderColor: BULL, background: BG2 }}>
                <p className="text-[12px] tracking-[0.2em] uppercase" style={{ ...MONO, color: BULL }}>
                  STATUS: WATCHING
                </p>
                <p className="mt-5 uppercase leading-[1.02] text-[1.9rem] sm:text-5xl lg:text-6xl" style={{ ...OSW, fontWeight: 600 }}>
                  {theme.outcomeQuote}
                  <span className="mp-blink" style={{ color: BULL }} aria-hidden> ▌</span>
                </p>
              </div>
            </Reveal>
          </section>
        </div>
      </div>

      <NextChapter currentSlug={theme.slug} accent={theme.palette.accent} />
      <SiteFooter />
    </div>
  );
}
