'use client';

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { JARVIS } from '@/lib/work-content';
import PullQuote from './shared/PullQuote';
import BigNumberWall from './shared/BigNumberWall';
import HeroSlideshow from './themed/HeroSlideshow';

const r3 = (n: number) => Math.round(n * 1000) / 1000;

const ease = {
  hud: [0.22, 0.61, 0.36, 1] as const,
  reactor: [0.16, 1, 0.3, 1] as const,
  scanline: [0.4, 0, 0.2, 1] as const,
  panelOpen: [0.83, 0, 0.17, 1] as const,
};

const palette = {
  bg: '#0A1620',
  bgDeep: '#060F1A',
  fog: '#0E1F2D',
  line: '#1F4257',
  text: '#CFEAF7',
  dim: '#5C7A8A',
  reactor: '#4FC3F7',
  reactorLo: '#1E88E5',
  reactorHi: '#B3E5FC',
  hotOrange: '#FF6A1A',
  hotAmber: '#FFB300',
};

// =====================================================================
// HEX-GRID — used as fixed bg pattern
// =====================================================================
export function HexGridBackdrop() {
  return (
    <svg
      aria-hidden
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.04, zIndex: 0 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="jarvis-hex-bg" width="56" height="48" patternUnits="userSpaceOnUse">
          <polygon
            points="14,0 42,0 56,24 42,48 14,48 0,24"
            fill="none"
            stroke={palette.reactor}
            strokeWidth="0.6"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#jarvis-hex-bg)" />
    </svg>
  );
}

// =====================================================================
// SECTION 1 — HERO
// =====================================================================

const BOOT_LINES = [
  '> SYS BOOT // ARC REACTOR ONLINE',
  '> CONTRACT LOADED',
  '> BRAIN  :5002 ONLINE',
  '> CHATBOT :5001 ONLINE',
  '> GUARDIAN STANDBY',
  '> READY.',
];

export default function HeroJarvis() {
  const reduce = useReducedMotion();
  return (
    <section
      className="relative min-h-[100svh] overflow-hidden"
      style={{ backgroundColor: palette.bg, color: palette.text }}
    >
      <HeroSlideshow slug="jarvis" />
      {/* Ambient cyan bloom */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 30% 50%, rgba(79,195,247,0.18), transparent 60%)',
        }}
      />

      {/* Top mono caption */}
      <motion.p
        className="absolute top-8 left-1/2 -translate-x-1/2 font-mono uppercase text-[10px] md:text-xs tracking-[0.4em] z-30"
        style={{ color: palette.hotAmber }}
        initial={reduce ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: ease.hud }}
      >
        § ACT III · FRONTIER · 09 / 28
      </motion.p>

      <div className="relative z-10 grid lg:grid-cols-2 items-center gap-12 lg:gap-6 min-h-[100svh] px-6 md:px-12 max-w-7xl mx-auto pt-24 pb-12">
        {/* LEFT — typewriter boot */}
        <BootTerminal lines={BOOT_LINES} />

        {/* RIGHT — Arc Reactor */}
        <div className="flex flex-col items-center lg:items-start">
          <ArcReactor />
          <motion.h1
            className="font-display tracking-tight mt-8"
            style={{
              color: palette.text,
              fontSize: 'clamp(4rem, 12vw, 11rem)',
              lineHeight: 0.9,
            }}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.8, ease: ease.reactor }}
          >
            JARVIS
            <span style={{ color: palette.hotOrange, fontStyle: 'italic' }}>.</span>
          </motion.h1>
          <motion.p
            className="font-display italic mt-4 max-w-md"
            style={{ color: palette.reactor, fontSize: 'clamp(1.25rem, 2.4vw, 2rem)' }}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2.0, ease: ease.reactor }}
          >
            An AI assistant that teaches itself.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function BootTerminal({ lines }: { lines: string[] }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(0); // active line index
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (reduce) {
      setPhase(lines.length);
      return;
    }
    let cancelled = false;
    let lineIdx = 0;
    let charIdx = 0;

    const tick = () => {
      if (cancelled) return;
      if (lineIdx >= lines.length) return;
      const line = lines[lineIdx];
      if (charIdx <= line.length) {
        setPhase(lineIdx);
        setChars(charIdx);
        charIdx += 1;
        setTimeout(tick, 28);
      } else {
        lineIdx += 1;
        charIdx = 0;
        setTimeout(tick, 80);
      }
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, [lines, reduce]);

  return (
    <div
      className="font-mono text-sm md:text-base leading-7 tracking-wide rounded-sm border p-6 md:p-8"
      style={{
        background: 'rgba(14, 31, 45, 0.65)',
        borderColor: palette.line,
        color: palette.text,
        minHeight: 280,
      }}
    >
      {lines.map((line, i) => {
        const visible =
          reduce
            ? line
            : i < phase
              ? line
              : i === phase
                ? line.slice(0, chars)
                : '';
        const isActive = !reduce && i === phase;
        return (
          <div key={i} className="whitespace-pre">
            <span style={{ color: i === lines.length - 1 ? palette.hotAmber : palette.reactor }}>
              {visible}
            </span>
            {isActive ? (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                style={{ color: palette.reactorHi }}
              >
                _
              </motion.span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function ArcReactor() {
  const reduce = useReducedMotion();
  const ticks = useMemo(() => {
    const out: { x1: number; y1: number; x2: number; y2: number; k: number }[] = [];
    for (let i = 0; i < 36; i += 1) {
      const a = (i / 36) * Math.PI * 2;
      out.push({
        x1: r3(160 + Math.cos(a) * 122),
        y1: r3(160 + Math.sin(a) * 122),
        x2: r3(160 + Math.cos(a) * 130),
        y2: r3(160 + Math.sin(a) * 130),
        k: i,
      });
    }
    return out;
  }, []);

  const accents = useMemo(
    () =>
      [0, 120, 240].map((deg) => {
        const a = (deg * Math.PI) / 180;
        return { x: r3(160 + Math.cos(a) * 88), y: r3(160 + Math.sin(a) * 88), k: deg };
      }),
    [],
  );

  return (
    <svg
      viewBox="0 0 320 320"
      className="w-[260px] h-[260px] md:w-[320px] md:h-[320px]"
      aria-hidden
    >
      <defs>
        <radialGradient id="reactorCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.reactorHi} stopOpacity="1" />
          <stop offset="60%" stopColor={palette.reactor} stopOpacity="0.85" />
          <stop offset="100%" stopColor={palette.reactorLo} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="reactorBloom" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.reactor} stopOpacity="0.5" />
          <stop offset="100%" stopColor={palette.reactor} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={160} cy={160} r={160} fill="url(#reactorBloom)" />

      {/* Outer ring r=148 */}
      <motion.circle
        cx={160}
        cy={160}
        r={148}
        stroke={palette.reactor}
        strokeWidth={1.2}
        fill="none"
        opacity={0.7}
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: ease.hud }}
      />

      {/* Tick marks ring */}
      <motion.g
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '160px 160px' }}
      >
        {ticks.map((t) => (
          <line
            key={t.k}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={palette.reactor}
            strokeWidth={t.k % 3 === 0 ? 1.4 : 0.6}
            opacity={t.k % 3 === 0 ? 0.7 : 0.3}
          />
        ))}
      </motion.g>

      {/* Pulse ring r=100 */}
      <motion.circle
        cx={160}
        cy={160}
        r={100}
        stroke={palette.reactor}
        strokeWidth={1}
        fill="none"
        animate={reduce ? undefined : { scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '160px 160px' }}
      />

      {/* Mid ring */}
      <circle
        cx={160}
        cy={160}
        r={72}
        stroke={palette.reactor}
        strokeWidth={1}
        fill="none"
        opacity={0.4}
        strokeDasharray="3 5"
      />

      {/* Inner core r=46 */}
      <motion.circle
        cx={160}
        cy={160}
        r={46}
        fill="url(#reactorCore)"
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.15, 1], opacity: [0, 1, 0.9] }}
        transition={{ duration: 0.6, delay: 1.0, ease: ease.reactor }}
        style={{ transformOrigin: '160px 160px' }}
      />

      <circle cx={160} cy={160} r={10} fill="#FFFFFF" opacity={0.95} />

      {accents.map((a) => (
        <circle key={a.k} cx={a.x} cy={a.y} r={3} fill={palette.hotOrange} opacity={0.85} />
      ))}
    </svg>
  );
}

// =====================================================================
// SECTION 2 — BIG NUMBER WALL
// =====================================================================
export function JarvisBigNumbers() {
  return (
    <BigNumberWall
      stats={[
        { value: 10, suffix: '+', label: 'SKILLS' },
        { value: 12, label: 'SCENARIOS' },
        { value: 3, label: 'CHILDREN' },
        { value: 1, label: 'BUILDER' },
      ]}
      numberColor={palette.reactor}
      labelColor={palette.dim}
      borderColor={palette.line}
      flashColor={palette.hotOrange}
    />
  );
}

// =====================================================================
// SECTION 3 — BOOT SCROLLY (pinned, 6 beats)
// =====================================================================

const BEATS = [
  { line: '> CONTRACT LOADED', detail: 'hex tile pulses' },
  { line: '> BRAIN :5002 ONLINE', detail: 'brain node draws' },
  { line: '> CHATBOT :5001 ONLINE', detail: 'edge with packet' },
  { line: '> GUARDIAN STANDBY', detail: 'three nodes, three packets' },
  { line: '> 12 SCENARIOS GREEN', detail: 'check-marks tick' },
  { line: '> READY.', detail: 'graph blooms; scanline sweeps' },
];

export function JarvisBootScrolly() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  if (reduce) {
    return (
      <section className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
        <h2 className="font-mono uppercase text-xs tracking-[0.4em] mb-12" style={{ color: palette.dim }}>
          Boot sequence
        </h2>
        <ul className="space-y-3 font-mono text-sm" style={{ color: palette.text }}>
          {BEATS.map((b, i) => (
            <li key={i}>
              <span style={{ color: palette.reactor }}>{b.line}</span>{' '}
              <span style={{ color: palette.dim }}>// {b.detail}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative" style={{ height: '450vh' }}>
      <div
        className="sticky top-0 h-[100svh] flex items-center justify-center overflow-hidden"
        style={{ background: palette.bgDeep }}
      >
        <BootScrollyStage progress={scrollYProgress} />
      </div>
    </section>
  );
}

function BootScrollyStage({ progress }: { progress: MotionValue<number> }) {
  // 6 beats spread across the scroll. Each beat owns ~16.6%.
  const segments = 6;
  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 800 500"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <pattern id="boot-hex" width="40" height="34" patternUnits="userSpaceOnUse">
            <polygon
              points="10,0 30,0 40,17 30,34 10,34 0,17"
              fill="none"
              stroke={palette.line}
              strokeWidth="0.5"
            />
          </pattern>
          <linearGradient id="scanlineGrad" x1="0" x2="1">
            <stop offset="0" stopColor={palette.reactor} stopOpacity="0" />
            <stop offset="0.5" stopColor={palette.reactor} stopOpacity="0.6" />
            <stop offset="1" stopColor={palette.reactor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill="url(#boot-hex)" opacity={0.4} />

        {/* Beat 1 — single hex pulse */}
        <BeatHex progress={progress} segment={0} segments={segments} />

        {/* Brain node — beat 2 onward */}
        <Node progress={progress} segment={1} segments={segments} cx={250} cy={250} label="BRAIN" />
        {/* Chatbot — beat 3 */}
        <Node progress={progress} segment={2} segments={segments} cx={550} cy={170} label="CHATBOT" />
        {/* Guardian — beat 4 */}
        <Node progress={progress} segment={3} segments={segments} cx={550} cy={330} label="GUARDIAN" />

        {/* Edges */}
        <Edge progress={progress} fromSeg={2} segments={segments} x1={290} y1={245} x2={510} y2={175} />
        <Edge progress={progress} fromSeg={3} segments={segments} x1={290} y1={255} x2={510} y2={325} />
        <Edge progress={progress} fromSeg={3} segments={segments} x1={555} y1={195} x2={555} y2={310} />

        {/* Beat 5 — checkmarks */}
        <Checkmarks progress={progress} segment={4} segments={segments} />

        {/* Beat 6 — scanline */}
        <Scanline progress={progress} segment={5} segments={segments} />
      </svg>

      {/* Overlay text — current beat line */}
      <BeatTicker progress={progress} />
    </div>
  );
}

function useSegmentOpacity(p: MotionValue<number>, segment: number, segments: number) {
  const ramp = useMemo(() => {
    const start = segment / segments;
    const end = (segment + 1) / segments;
    const a = Math.max(0, start - 0.01);
    const b = start;
    const c = Math.max(b, end);
    const d = Math.min(1, Math.max(c, end + 0.001));
    return [a, b, c, d];
  }, [segment, segments]);
  return useTransform(p, ramp, [0, 1, 1, 1]);
}

function BeatHex({
  progress,
  segment,
  segments,
}: {
  progress: MotionValue<number>;
  segment: number;
  segments: number;
}) {
  const o = useSegmentOpacity(progress, segment, segments);
  const scale = useTransform(o, (v) => 0.8 + v * 0.5);
  return (
    <motion.polygon
      points="380,230 420,230 440,260 420,290 380,290 360,260"
      fill={palette.reactor}
      fillOpacity={0.15}
      stroke={palette.reactor}
      strokeWidth={1.5}
      style={{ opacity: o, scale, transformOrigin: '400px 260px', transformBox: 'fill-box' }}
    />
  );
}

function Node({
  progress,
  segment,
  segments,
  cx,
  cy,
  label,
}: {
  progress: MotionValue<number>;
  segment: number;
  segments: number;
  cx: number;
  cy: number;
  label: string;
}) {
  const o = useSegmentOpacity(progress, segment, segments);
  return (
    <motion.g style={{ opacity: o }}>
      <circle cx={cx} cy={cy} r={42} fill={palette.fog} stroke={palette.reactor} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={48} fill="none" stroke={palette.reactor} strokeWidth={0.5} opacity={0.4} />
      <text
        x={cx}
        y={cy + 4}
        fontFamily="ui-monospace, monospace"
        fontSize={11}
        fill={palette.text}
        textAnchor="middle"
        letterSpacing="0.2em"
      >
        {label}
      </text>
    </motion.g>
  );
}

function Edge({
  progress,
  fromSeg,
  segments,
  x1,
  y1,
  x2,
  y2,
}: {
  progress: MotionValue<number>;
  fromSeg: number;
  segments: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  const o = useSegmentOpacity(progress, fromSeg, segments);
  const t = useTransform(progress, [fromSeg / segments, (fromSeg + 1) / segments], [0, 1]);
  const px = useTransform(t, (v) => r3(x1 + (x2 - x1) * v));
  const py = useTransform(t, (v) => r3(y1 + (y2 - y1) * v));
  return (
    <motion.g style={{ opacity: o }}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={palette.reactor} strokeWidth={1} strokeDasharray="6 8" />
      <motion.circle cx={px} cy={py} r={4} fill={palette.reactorHi} />
    </motion.g>
  );
}

function Checkmarks({
  progress,
  segment,
  segments,
}: {
  progress: MotionValue<number>;
  segment: number;
  segments: number;
}) {
  const o = useSegmentOpacity(progress, segment, segments);
  return (
    <motion.g style={{ opacity: o }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = 80 + col * 26;
        const y = 420 + row * 22;
        return (
          <g key={i}>
            <rect x={x - 9} y={y - 9} width={18} height={18} fill="none" stroke={palette.line} strokeWidth={0.8} />
            <path
              d={`M ${x - 5} ${y} L ${x - 1} ${y + 4} L ${x + 6} ${y - 5}`}
              stroke="#16D17A"
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      })}
    </motion.g>
  );
}

function Scanline({
  progress,
  segment,
  segments,
}: {
  progress: MotionValue<number>;
  segment: number;
  segments: number;
}) {
  const o = useSegmentOpacity(progress, segment, segments);
  const local = useTransform(progress, [segment / segments, (segment + 1) / segments], [0, 1]);
  const x = useTransform(local, (v) => r3(-50 + v * 900));
  return (
    <motion.rect
      x={x}
      y={0}
      width={50}
      height={500}
      fill="url(#scanlineGrad)"
      style={{ opacity: o, mixBlendMode: 'screen' }}
    />
  );
}

function BeatTicker({ progress }: { progress: MotionValue<number> }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    return progress.on('change', (v) => {
      const i = Math.min(BEATS.length - 1, Math.max(0, Math.floor(v * BEATS.length)));
      setIdx(i);
    });
  }, [progress]);
  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-sm md:text-lg tracking-wide pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: ease.hud }}
          style={{ color: palette.reactor }}
        >
          {BEATS[idx].line}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// =====================================================================
// SECTION 4 — STORY PULL-QUOTES
// =====================================================================
export function JarvisStoryQuotes() {
  const quotes = [
    {
      ex: 'EXHIBIT 01',
      q: 'I shipped the smallest tool that solves the real problem.',
      ctx: 'Eleven Claude tabs, three terminals, one sticky note. The contract.json was the smallest knife that cut through it.',
    },
    {
      ex: 'EXHIBIT 02',
      q: 'Every regression is a teacher; every gap-finder is a curriculum.',
      ctx: 'Twelve scenarios green on every evolve. The thirteenth gets written by the system itself.',
    },
    {
      ex: 'EXHIBIT 03',
      q: "It rewrites itself. So I don't have to.",
      ctx: 'Plan, implement, regress, gap-find. The Claude Code session is the meta-runtime.',
    },
  ];
  return (
    <section className="px-6 md:px-12 py-32 max-w-7xl mx-auto">
      <p className="font-mono uppercase text-xs tracking-[0.4em] mb-12" style={{ color: palette.dim }}>
        § The story
      </p>
      <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
        {quotes.map((q, i) => (
          <PullQuote
            key={i}
            exhibit={q.ex}
            quote={q.q}
            context={q.ctx}
            surface={palette.fog}
            border={palette.line}
            text={palette.text}
            accent={palette.reactor}
            delay={i * 0.1}
          />
        ))}
      </div>
    </section>
  );
}

// =====================================================================
// SECTION 5 — ARCHITECTURE GRAPH (sticky-side)
// =====================================================================
export function JarvisArchitectureGraph() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const blocks = JARVIS.architecture.slice(0, 3);

  return (
    <section ref={ref} className="relative" style={{ minHeight: '300vh', background: palette.bg }}>
      <div className="sticky top-0 h-[100svh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-10 px-6 md:px-12 max-w-7xl mx-auto w-full items-center">
          <ArchTextStack progress={scrollYProgress} blocks={blocks} />
          <ArchDiagram progress={scrollYProgress} reduce={!!reduce} />
        </div>
      </div>
    </section>
  );
}

function ArchTextStack({
  progress,
  blocks,
}: {
  progress: MotionValue<number>;
  blocks: typeof JARVIS.architecture;
}) {
  return (
    <div className="space-y-12">
      <p className="font-mono uppercase text-xs tracking-[0.4em]" style={{ color: palette.dim }}>
        § Architecture
      </p>
      {blocks.map((b, i) => {
        const start = i / blocks.length;
        const end = (i + 1) / blocks.length;
        return <ArchPara key={i} block={b} progress={progress} start={start} end={end} />;
      })}
    </div>
  );
}

function ArchPara({
  block,
  progress,
  start,
  end,
}: {
  block: { label: string; body: string };
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const ramp = useMemo(() => {
    const a = Math.max(0, start - 0.05);
    const b = start;
    const c = Math.max(b, end - 0.02);
    const d = Math.min(1, Math.max(c, end + 0.05));
    return [a, b, c, d];
  }, [start, end]);
  const opacity = useTransform(progress, ramp, [0.35, 1, 1, 0.35]);
  return (
    <motion.div style={{ opacity }}>
      <h3 className="font-display text-2xl md:text-3xl tracking-tight" style={{ color: palette.reactor }}>
        {block.label}
      </h3>
      <p className="mt-3 font-sans leading-relaxed max-w-prose" style={{ color: palette.text }}>
        {block.body}
      </p>
    </motion.div>
  );
}

function ArchDiagram({ progress, reduce }: { progress: MotionValue<number>; reduce: boolean }) {
  // 3 nodes: BRAIN (200,160), CHATBOT (60,80), GUARDIAN (60,240)
  const active1 = useTransform(progress, [0, 0.05, 0.33], [0, 1, 1]);
  const active2 = useTransform(progress, [0.33, 0.4, 0.66], [0, 1, 1]);
  const active3 = useTransform(progress, [0.66, 0.72, 1], [0, 1, 1]);

  return (
    <div className="aspect-square relative">
      <svg viewBox="0 0 320 320" className="w-full h-full" aria-hidden>
        <defs>
          <linearGradient id="scanlineGrad2" x1="0" x2="1">
            <stop offset="0" stopColor={palette.reactor} stopOpacity="0" />
            <stop offset="0.5" stopColor={palette.reactor} stopOpacity="0.5" />
            <stop offset="1" stopColor={palette.reactor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* edges */}
        <DashedEdge x1={200} y1={160} x2={80} y2={90} active={active1} />
        <DashedEdge x1={200} y1={160} x2={80} y2={230} active={active1} />

        <DiagramNode cx={200} cy={160} r={40} label="BRAIN" sub=":5002" active={active1} />
        <DiagramNode cx={70} cy={90} r={28} label="CHATBOT" sub=":5001" active={active2} />
        <DiagramNode cx={70} cy={230} r={28} label="GUARDIAN" sub="HEADLESS" active={active3} />

        {!reduce ? (
          <PacketAlongLine
            progress={progress}
            from={[200, 160]}
            to={[80, 90]}
            opacity={active2}
          />
        ) : null}
        {!reduce ? (
          <PacketAlongLine
            progress={progress}
            from={[200, 160]}
            to={[80, 230]}
            opacity={active3}
          />
        ) : null}
      </svg>
    </div>
  );
}

function DashedEdge({
  x1,
  y1,
  x2,
  y2,
  active,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: MotionValue<number>;
}) {
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={palette.reactor}
      strokeWidth={1}
      strokeDasharray="6 8"
      style={{ opacity: useTransform(active, (v) => 0.25 + v * 0.55) }}
    />
  );
}

function DiagramNode({
  cx,
  cy,
  r,
  label,
  sub,
  active,
}: {
  cx: number;
  cy: number;
  r: number;
  label: string;
  sub: string;
  active: MotionValue<number>;
}) {
  const fill = useTransform(active, (v) => `rgba(79,195,247,${0.04 + v * 0.14})`);
  const stroke = useTransform(active, (v) =>
    v > 0.5 ? palette.reactor : palette.line,
  );
  const scale = useTransform(active, [0, 1], [1, 1.04]);
  return (
    <motion.g style={{ scale, transformOrigin: `${cx}px ${cy}px` }}>
      <motion.circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={1.5} />
      <text x={cx} y={cy - 2} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={9} fill={palette.text} letterSpacing="0.2em">
        {label}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={7} fill={palette.dim} letterSpacing="0.2em">
        {sub}
      </text>
    </motion.g>
  );
}

function PacketAlongLine({
  progress,
  from,
  to,
  opacity,
}: {
  progress: MotionValue<number>;
  from: [number, number];
  to: [number, number];
  opacity: MotionValue<number>;
}) {
  // simple looping motion based on progress fractional component
  const t = useTransform(progress, (v) => (v * 3) % 1);
  const cx = useTransform(t, (v) => r3(from[0] + (to[0] - from[0]) * v));
  const cy = useTransform(t, (v) => r3(from[1] + (to[1] - from[1]) * v));
  return <motion.circle cx={cx} cy={cy} r={3.5} fill={palette.reactorHi} style={{ opacity }} />;
}

// =====================================================================
// SECTION 6 — SELF-EVOLVE LOOP (5 panels)
// =====================================================================
const PANELS = [
  {
    title: 'PLAN',
    body: ['> /self-evolve "add a VS Code skill"', '… reading repo context', '… 3 capability gaps found', '… plan ready'],
  },
  {
    title: 'SPEC',
    body: ['nodes/chatbot/skills/vscode.json', '{', '  "intent": "vscode",', '  "tools": ["open", "task"]', '}'],
  },
  {
    title: 'IMPLEMENT',
    body: ['+ chatbot/server.py: 12 lines', '+ chatbot/skills/vscode.py: NEW', '~ contract.json: bumped'],
  },
  {
    title: 'REGRESSION',
    body: ['jarvis_shell.md       PASS', 'jarvis_file.md        PASS', 'jarvis_safety.md      PASS', 'jarvis_vscode.md      PASS', '12 / 12 GREEN'],
  },
  {
    title: 'GAP-FINDER',
    body: ['! missing edge: open workspace folder', '+ generated jarvis_vscode_workspace.md', '✓ runs/2026-05-09T1822.md saved'],
  },
];

export function JarvisSelfEvolveLoop() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const idx = useTransform(scrollYProgress, (v) => Math.min(PANELS.length - 1, Math.floor(v * PANELS.length)));

  if (reduce) {
    return (
      <section className="px-6 md:px-12 py-24 max-w-6xl mx-auto">
        <h2 className="font-mono uppercase text-xs tracking-[0.4em] mb-10" style={{ color: palette.dim }}>
          § Self-evolve loop
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {PANELS.map((p, i) => (
            <div key={i} className="border rounded-sm p-6" style={{ borderColor: palette.line, background: palette.fog }}>
              <p className="font-mono text-xs tracking-[0.3em]" style={{ color: palette.reactor }}>
                {i + 1}. {p.title}
              </p>
              <pre className="mt-4 font-mono text-xs leading-6 whitespace-pre-wrap" style={{ color: palette.text }}>
                {p.body.join('\n')}
              </pre>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-[100svh] flex items-center justify-center" style={{ background: palette.bgDeep }}>
        <div className="w-full max-w-3xl px-6 md:px-12">
          <p className="font-mono uppercase text-xs tracking-[0.4em] mb-8 text-center" style={{ color: palette.dim }}>
            § Self-evolve loop
          </p>
          <Panel idx={idx} />
        </div>
      </div>
    </section>
  );
}

function Panel({ idx }: { idx: MotionValue<number> }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    return idx.on('change', (v) => setI(Math.round(v)));
  }, [idx]);
  const p = PANELS[i] ?? PANELS[0];
  return (
    <div className="relative h-[420px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          className="absolute inset-0 rounded-sm border p-8 md:p-10"
          style={{
            borderColor: palette.line,
            background: 'rgba(14, 31, 45, 0.85)',
            transformOrigin: 'top',
          }}
          initial={{ rotateX: 80, scaleY: 0.6, opacity: 0 }}
          animate={{ rotateX: 0, scaleY: 1, opacity: 1 }}
          exit={{ rotateX: -40, scaleY: 0.7, opacity: 0 }}
          transition={{ duration: 0.65, ease: ease.panelOpen }}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono uppercase text-[10px] tracking-[0.4em]" style={{ color: palette.hotAmber }}>
              {i + 1} / {PANELS.length}
            </span>
            <span className="font-mono uppercase text-xs tracking-[0.4em]" style={{ color: palette.reactor }}>
              {p.title}
            </span>
          </div>
          <pre className="font-mono text-sm md:text-base leading-7 whitespace-pre-wrap" style={{ color: palette.text }}>
            {p.body.join('\n')}
          </pre>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// =====================================================================
// SECTION 7 — FEATURES GRID (mark-suit assemble)
// =====================================================================
const FEATURES = [
  { t: 'Conversational front door', d: 'Flask UI at :5001 — single command surface for the system.' },
  { t: 'Intent routing', d: 'Shell, file, web, vscode, system, conversation, plan, parallel.' },
  { t: 'Self-evolve loop', d: 'Plan → spec → implement → regress → gap-find → report.' },
  { t: 'Cytoscape Studio', d: 'Live in-browser graph, HITL approval, time-travel via /checkpoints.' },
  { t: 'Regression as judge', d: 'Twelve scenarios. judge.py renders structured pass/fail per case.' },
  { t: 'Contract-first', d: 'One contract.json. HTTP only. Children evolve independently.' },
];

export function JarvisFeaturesGrid() {
  const reduce = useReducedMotion();
  return (
    <section className="px-6 md:px-12 py-32 max-w-7xl mx-auto">
      <p className="font-mono uppercase text-xs tracking-[0.4em] mb-10" style={{ color: palette.dim }}>
        § Features
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f, i) => (
          <motion.div
            key={i}
            className="relative rounded-sm border p-6 md:p-8"
            style={{ borderColor: palette.line, background: palette.fog, color: palette.text }}
            initial={reduce ? false : { opacity: 0, y: 20, scale: 0.96 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: ease.hud }}
          >
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-sm pointer-events-none"
              initial={reduce ? false : { boxShadow: `inset 0 0 0 1px ${palette.hotOrange}` }}
              whileInView={reduce ? undefined : { boxShadow: `inset 0 0 0 1px ${palette.line}` }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: ease.hud }}
            />
            <h3 className="relative font-display text-xl md:text-2xl tracking-tight" style={{ color: palette.reactor }}>
              {f.t}
            </h3>
            <p className="relative mt-3 font-sans text-sm md:text-base leading-relaxed">
              {f.d}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// =====================================================================
// SECTION 8 — OUTCOMES QUOTE
// =====================================================================
export function JarvisOutcomesQuote() {
  return (
    <section className="px-6 md:px-12 py-40 max-w-5xl mx-auto text-center">
      <p
        className="font-display italic tracking-tight leading-[1.05]"
        style={{ color: palette.reactorHi, fontSize: 'clamp(2rem, 6vw, 5rem)' }}
      >
        &ldquo;It rewrites itself. So I don&rsquo;t have to.&rdquo;
      </p>
    </section>
  );
}
