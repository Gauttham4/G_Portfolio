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
import { CRIMELENS } from '@/lib/work-content';
import PullQuote from './shared/PullQuote';
import BigNumberWall from './shared/BigNumberWall';
import HeroSlideshow from './themed/HeroSlideshow';

const r3 = (n: number) => Math.round(n * 1000) / 1000;

const ease = {
  envelope: [0.65, 0, 0.35, 1] as const,
  stamp: [0.34, 1.56, 0.64, 1] as const,
  scan: [0.4, 0, 0.2, 1] as const,
  redString: [0.83, 0, 0.17, 1] as const,
};

const palette = {
  bg: '#060F1F',
  bgMid: '#0B1A2E',
  text: '#E8E2CF',
  dim: '#7A6E50',
  manila: '#D8C089',
  manilaDk: '#A88B4D',
  paper: '#F2EAD3',
  crimson: '#B81E2A',
  crimsonHi: '#E04050',
  caution: '#F2C014',
  green: '#1FA37A',
};

// =====================================================================
// PAPER GRAIN BACKDROP
// =====================================================================
export function PaperGrainBackdrop() {
  return (
    <svg
      aria-hidden
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.04, zIndex: 0 }}
    >
      <defs>
        <filter id="paperGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" />
          <feColorMatrix values="0 0 0 0 0.85  0 0 0 0 0.78  0 0 0 0 0.62  0 0 0 1 0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#paperGrain)" />
    </svg>
  );
}

// =====================================================================
// SECTION 1 — HERO (case-file unsealing)
// =====================================================================
export default function HeroCrimeLens() {
  const reduce = useReducedMotion();
  return (
    <section
      className="relative min-h-[100svh] overflow-hidden flex items-center justify-center"
      style={{ background: `linear-gradient(180deg, ${palette.bg}, ${palette.bgMid})`, color: palette.text }}
    >
      <HeroSlideshow slug="final-year-project" />
      {/* CCTV scanline single sweep */}
      {!reduce ? (
        <motion.div
          aria-hidden
          className="absolute inset-x-0 h-32 pointer-events-none z-0"
          style={{
            background: `linear-gradient(180deg, transparent, ${palette.caution}33, transparent)`,
          }}
          initial={{ y: '-50%', opacity: 0.7 }}
          animate={{ y: '120vh', opacity: 0 }}
          transition={{ duration: 0.7, ease: ease.scan }}
        />
      ) : null}

      {/* Top ribbon (typewriter) */}
      <motion.div
        className="absolute top-0 inset-x-0 h-8 overflow-hidden font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase whitespace-nowrap z-30"
        style={{ background: palette.crimson, color: palette.paper, lineHeight: '2rem' }}
      >
        <motion.span
          className="inline-block px-4"
          animate={reduce ? undefined : { x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 8 })
            .map(() => 'CASE FILE // CLASSIFIED // FOR OFFICIAL USE ONLY //')
            .join(' ')}
        </motion.span>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-12 max-w-5xl pt-10">
        <Envelope />

        <motion.h1
          className="font-display tracking-tight mt-12"
          style={{ color: palette.text, fontSize: 'clamp(3.5rem, 11vw, 9rem)', lineHeight: 0.92 }}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2, ease: ease.envelope }}
        >
          CrimeIntellX
          <span style={{ color: palette.crimson }}>.</span>
        </motion.h1>

        <motion.p
          className="font-display italic mt-4 max-w-2xl"
          style={{ color: palette.manila, fontSize: 'clamp(1.1rem, 2vw, 1.6rem)' }}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.5, ease: ease.envelope }}
        >
          A detective&rsquo;s assistant for cases, evidence &amp; call records.
        </motion.p>

        {/* CLASSIFIED stamp */}
        <motion.div
          className="absolute top-[35%] right-4 md:right-12 z-20 pointer-events-none"
          initial={reduce ? false : { scale: 2, rotate: -22, opacity: 0 }}
          animate={{ scale: 1, rotate: -12, opacity: 0.85 }}
          transition={{ type: 'spring', stiffness: 420, damping: 16, mass: 0.4, delay: 1.7 }}
          style={{
            border: `4px solid ${palette.crimson}`,
            color: palette.crimson,
            padding: '8px 18px',
            fontFamily: 'ui-monospace, monospace',
            fontSize: 18,
            letterSpacing: '0.3em',
            fontWeight: 700,
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          CLASSIFIED
        </motion.div>
      </div>
    </section>
  );
}

function Envelope() {
  const reduce = useReducedMotion();
  return (
    <div className="relative" style={{ width: 'min(520px, 80vw)', aspectRatio: '5 / 3' }}>
      {/* Envelope body */}
      <motion.div
        className="absolute inset-0 rounded-sm shadow-2xl"
        style={{
          background: `linear-gradient(160deg, ${palette.manila}, ${palette.manilaDk})`,
          border: `1px solid ${palette.manilaDk}`,
        }}
        initial={reduce ? false : { y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24, mass: 1, delay: 0.4 }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center font-mono uppercase tracking-[0.4em] text-xs md:text-sm"
          style={{ color: palette.manilaDk, opacity: 0.7 }}
        >
          CASE FILE · GR-01-2026
        </div>

        {/* Cards fanning out */}
        {['FIR', 'EVIDENCE', 'CDR', 'SUSPECTS'].map((label, i) => {
          const fanRot = -18 + i * 12;
          return (
            <motion.div
              key={label}
              className="absolute top-1/2 left-1/2 rounded-sm"
              style={{
                width: '38%',
                aspectRatio: '3 / 4',
                background: palette.paper,
                border: `1px solid ${palette.manilaDk}`,
                transformOrigin: 'center bottom',
                color: palette.crimson,
                fontFamily: 'ui-monospace, monospace',
                fontSize: 10,
                letterSpacing: '0.3em',
                padding: 6,
                boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
              }}
              initial={reduce ? false : { x: '-50%', y: '-50%', rotate: 0, opacity: 0 }}
              animate={{
                x: `calc(-50% + ${(-1.5 + i) * 14}%)`,
                y: '-58%',
                rotate: fanRot,
                opacity: 1,
              }}
              transition={{ duration: 0.7, delay: 1.0 + i * 0.07, ease: ease.envelope }}
            >
              <span className="block">{label}</span>
              <span
                className="absolute bottom-3 right-3 text-[8px]"
                style={{ color: palette.dim, letterSpacing: '0.2em' }}
              >
                EX/{i + 1}
              </span>
            </motion.div>
          );
        })}

        {/* Wax seal */}
        <motion.div
          className="absolute top-1/2 left-1/2 rounded-full"
          style={{
            width: 56,
            height: 56,
            background: `radial-gradient(circle at 35% 30%, ${palette.crimsonHi}, ${palette.crimson})`,
            border: `1px solid ${palette.crimson}`,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.5) inset',
          }}
          initial={reduce ? false : { scale: 1, opacity: 1 }}
          animate={{ scale: [1, 1.2, 0.6], opacity: [1, 1, 0] }}
          transition={{ duration: 0.6, delay: 0.85, ease: ease.envelope }}
        />

        {/* Flap opening */}
        <motion.div
          className="absolute inset-x-0 top-0"
          style={{
            height: '55%',
            background: `linear-gradient(180deg, ${palette.manilaDk}, ${palette.manila})`,
            transformOrigin: 'top center',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          }}
          initial={reduce ? false : { rotateX: 0 }}
          animate={{ rotateX: -160 }}
          transition={{ duration: 1.0, delay: 0.9, ease: ease.envelope }}
        />
      </motion.div>
    </div>
  );
}

// =====================================================================
// SECTION 2 — BOOT SCROLLY (pinned, 6 beats)
// =====================================================================
const CL_BEATS = [
  { line: 'FIR registered', detail: 'typed witness lines highlight' },
  { line: 'Suspects loaded', detail: 'three mugshot cards drop in' },
  { line: 'Evidence vault', detail: 'manila grid materializes' },
  { line: 'CDR ingested', detail: 'phone bill flips, collapses to rows' },
  { line: 'Vector index', detail: 'rows fly into a glowing column' },
  { line: 'Investigator', detail: 'magnifier sweeps; IDENTIFIED stamps' },
];

export function CrimeLensBootScrolly() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  if (reduce) {
    return (
      <section className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
        <h2 className="font-mono uppercase text-xs tracking-[0.4em] mb-12" style={{ color: palette.dim }}>
          § What&rsquo;s in a case
        </h2>
        <ul className="space-y-3 font-mono text-sm" style={{ color: palette.text }}>
          {CL_BEATS.map((b, i) => (
            <li key={i}>
              <span style={{ color: palette.manila }}>{b.line}</span>{' '}
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
        style={{ background: palette.bg }}
      >
        <CLBootStage progress={scrollYProgress} />
      </div>
    </section>
  );
}

function CLBootStage({ progress }: { progress: MotionValue<number> }) {
  const segments = 6;
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    return progress.on('change', (v) =>
      setIdx(Math.min(CL_BEATS.length - 1, Math.max(0, Math.floor(v * CL_BEATS.length)))),
    );
  }, [progress]);
  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 800 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <defs>
          <linearGradient id="scanBarGradBoot">
            <stop offset="0" stopColor={palette.caution} stopOpacity="0" />
            <stop offset="0.5" stopColor={palette.caution} stopOpacity="0.6" />
            <stop offset="1" stopColor={palette.caution} stopOpacity="0" />
          </linearGradient>
        </defs>
        <FIRPanel progress={progress} segment={0} segments={segments} />
        <SuspectCards progress={progress} segment={1} segments={segments} />
        <EvidenceGrid progress={progress} segment={2} segments={segments} />
        <CDRRows progress={progress} segment={3} segments={segments} />
        <VectorColumn progress={progress} segment={4} segments={segments} />
        <Magnifier progress={progress} segment={5} segments={segments} />
      </svg>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono uppercase text-xs md:text-sm tracking-[0.4em] text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: ease.envelope }}
            style={{ color: palette.manila }}
          >
            {CL_BEATS[idx].line}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function useSeg(p: MotionValue<number>, s: number, segs: number) {
  const ramp = useMemo(() => {
    const b = s / segs;
    const c = (s + 1) / segs;
    const a = Math.max(0, b - 0.02);
    const d = Math.min(1, Math.max(c, c + 0.05));
    return [a, b, c, d];
  }, [s, segs]);
  return useTransform(p, ramp, [0, 1, 1, 0.4]);
}

function FIRPanel({ progress, segment, segments }: { progress: MotionValue<number>; segment: number; segments: number }) {
  const o = useSeg(progress, segment, segments);
  return (
    <motion.g style={{ opacity: o }}>
      <rect x={120} y={80} width={260} height={340} fill={palette.paper} stroke={palette.manilaDk} strokeWidth={1} />
      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={i}
          x1={140}
          y1={120 + i * 30}
          x2={360}
          y2={120 + i * 30}
          stroke={i === 4 ? palette.crimson : palette.manilaDk}
          strokeWidth={i === 4 ? 2 : 0.6}
          opacity={i === 4 ? 0.9 : 0.5}
        />
      ))}
      <text x={250} y={108} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={10} letterSpacing="0.3em" fill={palette.crimson}>
        FIR · GR-01-2026
      </text>
    </motion.g>
  );
}

function SuspectCards({ progress, segment, segments }: { progress: MotionValue<number>; segment: number; segments: number }) {
  const o = useSeg(progress, segment, segments);
  return (
    <motion.g style={{ opacity: o }}>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${440 + i * 100}, ${110 + i * 12}) rotate(${-6 + i * 5})`}>
          <rect x={-40} y={-50} width={80} height={100} fill={palette.bgMid} stroke={palette.manila} strokeWidth={1} />
          <circle cx={0} cy={-12} r={20} fill={palette.dim} />
          <line x1={-30} y1={20} x2={30} y2={20} stroke={palette.manila} strokeWidth={0.6} />
          <line x1={-30} y1={28} x2={20} y2={28} stroke={palette.manila} strokeWidth={0.6} opacity={0.6} />
          <text x={0} y={42} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={7} fill={palette.manila} letterSpacing="0.3em">
            S/{i + 1}
          </text>
        </g>
      ))}
    </motion.g>
  );
}

function EvidenceGrid({ progress, segment, segments }: { progress: MotionValue<number>; segment: number; segments: number }) {
  const o = useSeg(progress, segment, segments);
  return (
    <motion.g style={{ opacity: o }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        return (
          <g key={i} transform={`translate(${130 + col * 60}, ${300 + row * 50})`}>
            <rect x={0} y={0} width={48} height={38} fill={palette.manila} stroke={palette.manilaDk} strokeWidth={0.6} opacity={0.85} />
            <circle cx={24} cy={19} r={5} fill={palette.crimson} opacity={0.6} />
          </g>
        );
      })}
    </motion.g>
  );
}

function CDRRows({ progress, segment, segments }: { progress: MotionValue<number>; segment: number; segments: number }) {
  const o = useSeg(progress, segment, segments);
  return (
    <motion.g style={{ opacity: o }}>
      <rect x={420} y={280} width={260} height={170} fill={palette.bgMid} stroke={palette.caution} strokeWidth={0.8} />
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={i}>
          <rect x={430} y={290 + i * 18} width={240} height={12} fill={palette.bg} stroke="none" />
          <text x={436} y={300 + i * 18} fontFamily="ui-monospace, monospace" fontSize={8} fill={palette.caution} letterSpacing="0.15em">
            +91 9{(82345670 + i * 11).toString().slice(0, 8)}  ·  03:1{i}AM
          </text>
        </g>
      ))}
    </motion.g>
  );
}

function VectorColumn({ progress, segment, segments }: { progress: MotionValue<number>; segment: number; segments: number }) {
  const o = useSeg(progress, segment, segments);
  return (
    <motion.g style={{ opacity: o }}>
      <rect x={370} y={60} width={70} height={380} fill="rgba(60,193,255,0.13)" stroke="#3CC1FF" strokeWidth={0.8} />
      {Array.from({ length: 24 }).map((_, i) => (
        <line key={i} x1={380} y1={70 + i * 15} x2={430} y2={70 + i * 15} stroke="#3CC1FF" strokeWidth={0.8} opacity={0.5 + (i % 3) * 0.2} />
      ))}
      <text x={405} y={50} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={9} fill="#3CC1FF" letterSpacing="0.3em">
        VECTORS
      </text>
    </motion.g>
  );
}

function Magnifier({ progress, segment, segments }: { progress: MotionValue<number>; segment: number; segments: number }) {
  const o = useSeg(progress, segment, segments);
  const local = useTransform(progress, [segment / segments, (segment + 1) / segments], [0, 1]);
  const cx = useTransform(local, (v) => r3(150 + v * 500));
  const handleX1 = useTransform(cx, (v) => r3(v + 35));
  const handleX2 = useTransform(cx, (v) => r3(v + 75));
  return (
    <motion.g style={{ opacity: o }}>
      <motion.circle cx={cx} cy={200} r={50} fill="rgba(255,255,255,0.05)" stroke={palette.caution} strokeWidth={2} />
      <motion.line x1={handleX1} y1={235} x2={handleX2} y2={275} stroke={palette.caution} strokeWidth={4} strokeLinecap="round" />
      {[200, 350, 500].map((x, i) => (
        <g key={i} transform={`translate(${x}, 380) rotate(-12)`}>
          <rect x={-40} y={-12} width={80} height={24} fill="none" stroke={palette.green} strokeWidth={2} />
          <text x={0} y={4} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={9} letterSpacing="0.3em" fill={palette.green}>
            IDENTIFIED
          </text>
        </g>
      ))}
    </motion.g>
  );
}

// =====================================================================
// SECTION 3 — STORY PULL-QUOTES
// =====================================================================
export function CrimeLensStoryQuotes() {
  const quotes = [
    { ex: 'EXHIBIT A', q: 'It started with a manila folder nobody could find.', ctx: 'A senior officer, fourteen years of memory, and a Bisleri box of CDs.' },
    { ex: 'EXHIBIT B', q: 'Every piece of evidence has a vector. The detective just needed a search bar.', ctx: '240 files. Two minutes. One query — "any mention of the white SUV."' },
    { ex: 'EXHIBIT C', q: "Published in IJIRE before I'd graduated.", ctx: 'Encrypted at rest. Fernet master key, never persisted plaintext. CDR graphs from raw CSV.' },
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
            surface={palette.manila}
            border={palette.manilaDk}
            text="#1c1305"
            accent={palette.crimson}
            rotate={i % 2 === 0 ? -1.2 : 1.5}
            pin
            delay={i * 0.1}
          />
        ))}
      </div>
    </section>
  );
}

// =====================================================================
// SECTION 4 — ARCHITECTURE LAYERS (sticky-side)
// =====================================================================
export function CrimeLensArchitectureLayers() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const blocks = CRIMELENS.architecture.slice(0, 3);

  return (
    <section ref={ref} className="relative" style={{ minHeight: '300vh' }}>
      <div className="sticky top-0 h-[100svh] flex items-center" style={{ background: palette.bgMid }}>
        <div className="grid lg:grid-cols-2 gap-10 px-6 md:px-12 max-w-7xl mx-auto w-full items-center">
          <div className="space-y-12">
            <p className="font-mono uppercase text-xs tracking-[0.4em]" style={{ color: palette.dim }}>
              § Architecture
            </p>
            {blocks.map((b, i) => (
              <ArchPara
                key={i}
                block={b}
                progress={scrollYProgress}
                start={i / blocks.length}
                end={(i + 1) / blocks.length}
              />
            ))}
          </div>
          <ArchLayersDiagram progress={scrollYProgress} />
        </div>
      </div>
    </section>
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
  const opacity = useTransform(progress, ramp, [0.3, 1, 1, 0.3]);
  return (
    <motion.div style={{ opacity }}>
      <h3 className="font-display text-2xl md:text-3xl tracking-tight" style={{ color: palette.manila }}>
        {block.label}
      </h3>
      <p className="mt-3 font-sans leading-relaxed max-w-prose" style={{ color: palette.text }}>
        {block.body}
      </p>
    </motion.div>
  );
}

function ArchLayersDiagram({ progress }: { progress: MotionValue<number> }) {
  const a1 = useTransform(progress, [0, 0.05, 0.33], [0, 1, 1]);
  const a2 = useTransform(progress, [0.33, 0.4, 0.66], [0, 1, 1]);
  const a3 = useTransform(progress, [0.66, 0.72, 1], [0, 1, 1]);
  return (
    <div className="aspect-square relative">
      <svg viewBox="0 0 320 320" className="w-full h-full" aria-hidden>
        <Layer y={50} active={a1} label="FRONTEND · Flutter" />
        <Layer y={140} active={a2} label="BACKEND · FastAPI + Celery" />
        <PineconeLayer y={230} active={a3} />
      </svg>
    </div>
  );
}

function Layer({ y, active, label }: { y: number; active: MotionValue<number>; label: string }) {
  const stroke = useTransform(active, (v) => (v > 0.5 ? palette.manila : palette.manilaDk));
  const fill = useTransform(active, (v) => `rgba(216,192,137,${0.05 + v * 0.18})`);
  return (
    <motion.g>
      <motion.rect x={40} y={y} width={240} height={64} fill={fill} stroke={stroke} strokeWidth={1.5} rx={4} />
      <text x={160} y={y + 38} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={11} letterSpacing="0.3em" fill={palette.text}>
        {label}
      </text>
    </motion.g>
  );
}

function PineconeLayer({ y, active }: { y: number; active: MotionValue<number> }) {
  const stroke = useTransform(active, (v) => (v > 0.5 ? '#3CC1FF' : palette.manilaDk));
  const opacity = useTransform(active, [0, 1], [0.4, 1]);
  return (
    <motion.g style={{ opacity }}>
      <motion.rect x={40} y={y} width={240} height={64} fill="rgba(60,193,255,0.08)" stroke={stroke} strokeWidth={1.5} rx={4} />
      <text x={160} y={y + 32} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={11} letterSpacing="0.3em" fill={palette.text}>
        STORAGE · Pinecone + MinIO
      </text>
      {/* key icon */}
      <g transform={`translate(252, ${y + 44})`}>
        <circle cx={0} cy={0} r={5} fill="none" stroke="#3CC1FF" strokeWidth={1.2} />
        <line x1={4} y1={0} x2={14} y2={0} stroke="#3CC1FF" strokeWidth={1.2} />
        <line x1={10} y1={0} x2={10} y2={4} stroke="#3CC1FF" strokeWidth={1.2} />
      </g>
    </motion.g>
  );
}

// =====================================================================
// SECTION 5 — EVIDENCE PIPELINE (4-beat pinned)
// =====================================================================
const EV_BEATS = [
  { t: 'DROP', body: 'A 240-file folder lands.' },
  { t: 'SNIFF', body: 'Type detection: PDF, DOCX, image, audio.' },
  { t: 'ENCRYPT + UPLOAD', body: 'Fernet ciphertext to MinIO.' },
  { t: 'INDEX', body: 'Embeddings upserted to Pinecone, case-scoped.' },
];

export function CrimeLensEvidencePipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const idx = useTransform(scrollYProgress, (v) => Math.min(EV_BEATS.length - 1, Math.floor(v * EV_BEATS.length)));

  if (reduce) {
    return (
      <section className="px-6 md:px-12 py-24 max-w-6xl mx-auto">
        <h2 className="font-mono uppercase text-xs tracking-[0.4em] mb-10" style={{ color: palette.dim }}>
          § Evidence pipeline
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {EV_BEATS.map((b, i) => (
            <div key={i} className="border rounded-sm p-6" style={{ borderColor: palette.manilaDk, background: palette.bgMid }}>
              <p className="font-mono text-xs tracking-[0.3em]" style={{ color: palette.caution }}>
                {i + 1}. {b.t}
              </p>
              <p className="mt-3 font-sans" style={{ color: palette.text }}>
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative" style={{ height: '400vh' }}>
      <div className="sticky top-0 h-[100svh] flex items-center justify-center" style={{ background: palette.bg }}>
        <EvidenceStage idx={idx} progress={scrollYProgress} />
      </div>
    </section>
  );
}

function EvidenceStage({ idx, progress }: { idx: MotionValue<number>; progress: MotionValue<number> }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    return idx.on('change', (v) => setI(Math.round(v)));
  }, [idx]);

  const scanX = useTransform(progress, (v) => `${(v * 4 % 1) * 100}%`);

  return (
    <div className="relative w-full max-w-5xl px-6 md:px-12">
      <motion.div
        className="absolute inset-x-0 top-0 h-1 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${palette.caution}, transparent)`,
          width: '40%',
          x: scanX,
          opacity: 0.7,
        }}
      />

      <p className="font-mono uppercase text-xs tracking-[0.4em] mb-8 text-center" style={{ color: palette.dim }}>
        § Evidence pipeline
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {EV_BEATS.map((b, j) => (
          <motion.div
            key={j}
            className="rounded-sm border p-4 md:p-6"
            style={{
              borderColor: j <= i ? palette.caution : palette.manilaDk,
              background: j === i ? 'rgba(242,192,20,0.08)' : palette.bgMid,
            }}
            animate={{ scale: j === i ? 1.04 : 1 }}
            transition={{ duration: 0.4, ease: ease.scan }}
          >
            <p className="font-mono uppercase text-[10px] tracking-[0.3em]" style={{ color: palette.caution }}>
              {j + 1} · {b.t}
            </p>
            <p className="mt-3 font-sans text-xs md:text-sm leading-relaxed" style={{ color: palette.text }}>
              {b.body}
            </p>
          </motion.div>
        ))}
      </div>

      <h3
        className="font-display italic mt-16 text-center tracking-tight"
        style={{ color: palette.manila, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
      >
        240 files. Two minutes. Searchable.
      </h3>
    </div>
  );
}

// =====================================================================
// SECTION 6 — CDR CALL GRAPH (static positions)
// =====================================================================
export function CrimeLensCDRGraph() {
  const reduce = useReducedMotion();
  const nodes = useMemo(() => {
    const arr: { id: number; x: number; y: number }[] = [];
    for (let i = 0; i < 12; i += 1) {
      const a = (i / 12) * Math.PI * 2;
      arr.push({
        id: i,
        x: r3(400 + Math.cos(a) * (160 + (i % 3) * 30)),
        y: r3(260 + Math.sin(a) * (140 + (i % 2) * 20)),
      });
    }
    return arr;
  }, []);

  const edges = useMemo(() => {
    const arr: { a: number; b: number }[] = [];
    for (let i = 0; i < nodes.length; i += 1) {
      arr.push({ a: i, b: (i + 1) % nodes.length });
      arr.push({ a: i, b: (i + 5) % nodes.length });
    }
    return arr;
  }, [nodes.length]);

  return (
    <section className="relative px-6 md:px-12 py-32" style={{ background: palette.bg }}>
      <div className="max-w-7xl mx-auto">
        <p className="font-mono uppercase text-xs tracking-[0.4em] mb-8" style={{ color: palette.dim }}>
          § CDR · call graph
        </p>
        <div className="relative w-full" style={{ aspectRatio: '8 / 5' }}>
          <svg viewBox="0 0 800 520" className="absolute inset-0 w-full h-full" aria-hidden>
            <defs>
              <linearGradient id="scanBarGrad">
                <stop offset="0" stopColor={palette.caution} stopOpacity="0" />
                <stop offset="0.5" stopColor={palette.caution} stopOpacity="0.6" />
                <stop offset="1" stopColor={palette.caution} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* tower-collocation rings */}
            <circle cx={nodes[0].x} cy={nodes[0].y} r={90} fill="none" stroke={palette.crimson} strokeWidth={0.8} strokeDasharray="3 5" opacity={0.5} />
            <circle cx={nodes[6].x} cy={nodes[6].y} r={110} fill="none" stroke={palette.crimson} strokeWidth={0.8} strokeDasharray="3 5" opacity={0.5} />

            {edges.map((e, i) => (
              <motion.line
                key={i}
                x1={nodes[e.a].x}
                y1={nodes[e.a].y}
                x2={nodes[e.b].x}
                y2={nodes[e.b].y}
                stroke={palette.manilaDk}
                strokeWidth={0.8}
                opacity={0.5}
                initial={reduce ? false : { pathLength: 0 }}
                whileInView={reduce ? undefined : { pathLength: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, delay: i * 0.04, ease: ease.envelope }}
              />
            ))}

            {nodes.map((n, i) => (
              <motion.g
                key={n.id}
                initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.04, ease: ease.envelope }}
              >
                <circle cx={n.x} cy={n.y} r={9} fill={palette.bgMid} stroke={palette.manila} strokeWidth={1.2} />
                <text x={n.x} y={n.y + 22} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={8} letterSpacing="0.2em" fill={palette.dim}>
                  +91-{(98000 + i * 137) % 100000}
                </text>
              </motion.g>
            ))}

            {!reduce ? (
              <motion.rect
                y={0}
                width={60}
                height={520}
                fill="url(#scanBarGrad)"
                initial={{ x: -60 }}
                whileInView={{ x: 800 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 2.4, delay: 1.2, ease: ease.scan }}
                style={{ mixBlendMode: 'screen' }}
              />
            ) : null}
          </svg>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// SECTION 7 — PINECONE FLOW
// =====================================================================
export function CrimeLensPineconeFlow() {
  const reduce = useReducedMotion();
  const QUERY = '"any mention of the white SUV"';
  const [typed, setTyped] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (reduce) {
      setTyped(QUERY);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            let i = 0;
            const tick = () => {
              setTyped(QUERY.slice(0, i));
              if (i < QUERY.length) {
                i += 1;
                setTimeout(tick, 60);
              }
            };
            tick();
          }
        });
      },
      { rootMargin: '-100px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduce]);

  return (
    <section ref={ref} className="relative px-6 md:px-12 py-32" style={{ background: palette.bgMid }}>
      <div className="max-w-7xl mx-auto">
        <p className="font-mono uppercase text-xs tracking-[0.4em] mb-8" style={{ color: palette.dim }}>
          § Pinecone · ask anything
        </p>

        <div
          className="rounded-sm border p-4 md:p-6 font-mono text-base md:text-lg max-w-3xl"
          style={{ borderColor: '#3CC1FF', background: 'rgba(60,193,255,0.06)', color: palette.text }}
        >
          <span style={{ color: '#3CC1FF' }}>$&gt; </span>
          {typed}
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.9, repeat: Infinity }} style={{ color: '#3CC1FF' }}>
            _
          </motion.span>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { t: 'EXHIBIT 12', d: 'Frame at 02:47 — white SUV crossing intersection.' },
            { t: 'EXHIBIT 47', d: 'Witness statement, line 9 — "white-colored SUV".' },
            { t: 'EXHIBIT 88', d: 'Plate scan — TN-04-AB-1842, white Mahindra.' },
          ].map((c, i) => (
            <motion.div
              key={i}
              className="rounded-sm p-5"
              style={{ background: palette.manila, border: `1px solid ${palette.manilaDk}`, color: '#1c1305' }}
              initial={reduce ? false : { x: 60, opacity: 0 }}
              whileInView={reduce ? undefined : { x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: ease.envelope }}
            >
              <span
                className="inline-block px-2 py-1 mb-3 font-mono text-[9px] tracking-[0.3em]"
                style={{ background: palette.crimson, color: palette.paper }}
              >
                {c.t}
              </span>
              <p className="font-sans text-sm leading-relaxed">{c.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// SECTION 8 — BIG NUMBERS
// =====================================================================
export function CrimeLensBigNumbers() {
  return (
    <BigNumberWall
      stats={[
        { value: 8, label: 'PARAGRAPHS · IJIRE' },
        { raw: 'IJIRE', value: 0, label: 'PUBLISHED PAPER' },
        { value: 0, label: 'LEAKS' },
        { value: 1, label: 'DETECTIVE' },
      ]}
      numberColor={palette.manila}
      labelColor={palette.dim}
      borderColor={palette.manilaDk}
      flashColor={palette.crimson}
    />
  );
}

// =====================================================================
// SECTION 9 — OUTCOMES QUOTE
// =====================================================================
export function CrimeLensOutcomesQuote() {
  return (
    <section className="px-6 md:px-12 py-40 max-w-5xl mx-auto text-center">
      <p
        className="font-display italic tracking-tight leading-[1.05]"
        style={{ color: palette.manila, fontSize: 'clamp(2rem, 6vw, 5rem)' }}
      >
        &ldquo;The detective&rsquo;s co-pilot becomes the detective.&rdquo;
      </p>
    </section>
  );
}
