'use client';

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  animate,
  useInView,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ELECTROBIKE } from '@/lib/work-content';
import PullQuote from './shared/PullQuote';
import BigNumberWall from './shared/BigNumberWall';
import HeroSlideshow from './themed/HeroSlideshow';

const r3 = (n: number) => Math.round(n * 1000) / 1000;

const ease = {
  needleSweep: [0.65, 0, 0.35, 1] as const,
  throttle: [0.16, 1, 0.3, 1] as const,
  headlight: [0.83, 0, 0.17, 1] as const,
  bikeAssemble: [0.22, 0.61, 0.36, 1] as const,
};

const palette = {
  bg: '#04081A',
  bgMid: '#0A1230',
  blue: '#1E6BFF',
  blueGlow: '#5BA8FF',
  amber: '#FFB319',
  amberHot: '#FF7A00',
  green: '#16D17A',
  text: '#E9F0FF',
  dim: '#7990B8',
  track: '#1E2A52',
};

// =====================================================================
// 1px GRID BACKDROP
// =====================================================================
export function GridBackdrop() {
  return (
    <svg
      aria-hidden
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.04, zIndex: 0 }}
    >
      <defs>
        <pattern id="ebGrid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke={palette.track} strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ebGrid)" />
    </svg>
  );
}

// =====================================================================
// SECTION 1 — HERO ("Your Bike, But It Thinks With You")
// =====================================================================
export default function HeroElectroBike() {
  const reduce = useReducedMotion();
  return (
    <section
      className="relative min-h-[100svh] overflow-hidden"
      style={{ background: palette.bg, color: palette.text }}
    >
      <HeroSlideshow slug="electrobike" />
      {/* ambient cinematic loop */}
      {!reduce ? (
        <video
          src="/reels/cinematic-scrub.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.08 }}
        />
      ) : null}

      {/* Headlight cone reveal */}
      {!reduce ? (
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'linear-gradient(110deg, rgba(255,179,25,0.18), transparent 55%)',
            mixBlendMode: 'screen',
          }}
          initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
          animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          transition={{ duration: 1.1, ease: ease.headlight }}
        />
      ) : null}

      <div className="relative z-10 grid lg:grid-cols-2 items-center gap-10 min-h-[100svh] px-6 md:px-12 max-w-7xl mx-auto py-24">
        {/* LEFT */}
        <div>
          <motion.p
            className="font-mono uppercase text-[10px] md:text-xs tracking-[0.4em] mb-6"
            style={{ color: palette.amber }}
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: ease.throttle }}
          >
            § ACT IV · CINEMATIC · 23 / 28
          </motion.p>

          <motion.h1
            className="font-display tracking-tight"
            style={{
              color: palette.text,
              fontSize: 'clamp(2.25rem, 9vw, 7.5rem)',
              lineHeight: 0.92,
            }}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2, ease: ease.throttle }}
          >
            Your Bike,<br />
            But It Thinks
            <br />
            <span style={{ color: palette.amber, fontStyle: 'italic' }}>With You.</span>
          </motion.h1>

          <motion.p
            className="font-display italic mt-6 max-w-xl"
            style={{ color: palette.blueGlow, fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.45, ease: ease.throttle }}
          >
            A smart electric bike that thinks with you.
          </motion.p>

          <motion.div
            className="mt-10 flex gap-4"
            initial={reduce ? false : { opacity: 0, scaleX: 0.85 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 1.7, ease: ease.throttle }}
            style={{ transformOrigin: 'left' }}
          >
            <a
              href="#booking"
              className="font-mono uppercase text-xs tracking-[0.3em] px-6 py-3 rounded-sm"
              style={{
                background: palette.amber,
                color: palette.bg,
                boxShadow: `0 0 32px ${palette.amberHot}55`,
              }}
            >
              Book a test ride
            </a>
            <a
              href="#app"
              className="font-mono uppercase text-xs tracking-[0.3em] px-6 py-3 rounded-sm border"
              style={{ borderColor: palette.blue, color: palette.text }}
            >
              See the app
            </a>
          </motion.div>

          <BatteryDivider reduce={!!reduce} />
        </div>

        {/* RIGHT — Speedometer */}
        <div className="flex justify-center">
          <Speedometer />
        </div>
      </div>
    </section>
  );
}

function BatteryDivider({ reduce }: { reduce: boolean }) {
  return (
    <div className="mt-10 flex items-center gap-2 max-w-md">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.span
          key={i}
          className="h-3 flex-1 rounded-sm"
          style={{ background: palette.track }}
          initial={reduce ? false : { background: palette.track }}
          animate={
            reduce
              ? { background: palette.amber }
              : i === 5
                ? { background: [palette.track, palette.amber, palette.amberHot, palette.amber] }
                : { background: palette.amber }
          }
          transition={{
            duration: i === 5 ? 1.2 : 0.4,
            delay: 1.9 + i * 0.12,
            ease: ease.throttle,
            repeat: i === 5 ? Infinity : 0,
            repeatType: 'reverse',
          }}
        />
      ))}
      <span className="font-mono uppercase text-[9px] tracking-[0.3em] ml-2" style={{ color: palette.dim }}>
        100%
      </span>
    </div>
  );
}

function Speedometer() {
  const reduce = useReducedMotion();
  const ticks = useMemo(() => {
    const arr: { x1: number; y1: number; x2: number; y2: number; major: boolean; k: number }[] = [];
    for (let i = 0; i <= 24; i += 1) {
      // -120deg to 120deg
      const angDeg = -210 + (i / 24) * 240;
      const ang = (angDeg * Math.PI) / 180;
      const major = i % 4 === 0;
      arr.push({
        x1: r3(150 + Math.cos(ang) * (major ? 116 : 122)),
        y1: r3(150 + Math.sin(ang) * (major ? 116 : 122)),
        x2: r3(150 + Math.cos(ang) * 130),
        y2: r3(150 + Math.sin(ang) * 130),
        major,
        k: i,
      });
    }
    return arr;
  }, []);

  // needle target ~80 km/h => 80% of arc
  const needleAngle = useMotionValue(-210);
  useEffect(() => {
    if (reduce) {
      needleAngle.set(-210 + (80 / 100) * 240);
      return;
    }
    const c = animate(needleAngle, -210 + (80 / 100) * 240, {
      duration: 1.8,
      delay: 0.7,
      ease: ease.needleSweep,
    });
    return () => c.stop();
  }, [needleAngle, reduce]);

  const needleTransform = useTransform(needleAngle, (v) => `rotate(${r3(v)} 150 150)`);

  return (
    <svg viewBox="0 0 300 300" className="w-[260px] h-[260px] md:w-[300px] md:h-[300px]" aria-hidden>
      <defs>
        <radialGradient id="speedoGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={palette.blueGlow} stopOpacity="0.4" />
          <stop offset="1" stopColor={palette.blueGlow} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={150} cy={150} r={150} fill="url(#speedoGlow)" />

      {/* track ring */}
      <circle cx={150} cy={150} r={130} fill="none" stroke={palette.track} strokeWidth={2} />

      {/* outer arc draws clockwise */}
      <motion.path
        d="M 50.7 215.9 A 130 130 0 1 1 249.3 215.9"
        fill="none"
        stroke={palette.blue}
        strokeWidth={3}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: ease.needleSweep }}
      />

      {ticks.map((t) => (
        <line
          key={t.k}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={t.major ? palette.text : palette.dim}
          strokeWidth={t.major ? 1.4 : 0.7}
          opacity={t.major ? 0.9 : 0.5}
        />
      ))}

      {/* needle */}
      <motion.g style={{ transform: needleTransform, transformOrigin: '150px 150px' }}>
        <line x1={150} y1={150} x2={150} y2={42} stroke={palette.amber} strokeWidth={3} strokeLinecap="round" />
        <circle cx={150} cy={150} r={8} fill={palette.amber} />
        <circle cx={150} cy={150} r={3} fill={palette.bg} />
      </motion.g>

      {/* center digital readout */}
      <text x={150} y={196} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={32} fontWeight={700} fill={palette.text} letterSpacing="0.05em">
        80
      </text>
      <text x={150} y={216} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={9} letterSpacing="0.4em" fill={palette.dim}>
        KM / H
      </text>
    </svg>
  );
}

// =====================================================================
// SECTION 2 — BIG NUMBERS
// =====================================================================
export function ElectroBigNumbers() {
  return (
    <BigNumberWall
      stats={[
        { value: 0, label: 'HARDWARE' },
        { value: 4, label: 'PLATFORMS' },
        { value: 1, label: 'VOICE AGENT' },
        { value: 100, suffix: '%', label: 'OFFLINE-CAPABLE' },
      ]}
      numberColor={palette.amber}
      labelColor={palette.dim}
      borderColor={palette.track}
      flashColor={palette.amberHot}
    />
  );
}

// =====================================================================
// SECTION 3 — BOOT SCROLLY (pinned, 6 beats)
// =====================================================================
const APP_BEATS = [
  { t: 'Damage Check', d: 'Photo a scratch. LLaMA Vision 90B returns severity, parts, INR estimate.' },
  { t: 'Drowsiness', d: 'Accel + gyro + GPS scored. Wobble + reaction-lag triggers a loud alert.' },
  { t: 'Theft + Geofence', d: 'GPS, safe-zone polygons, vibration-based unauthorised-movement.' },
  { t: 'Predictive', d: 'Per-component health: battery, tyres, brakes, chain, motor.' },
  { t: 'Eco Coach', d: 'A live 0-100 eco-score with CO2-saved counter.' },
  { t: 'Tilt Control', d: 'Lean angle within 18° envelope. Outside it, the bike snaps you straight.' },
];

export function ElectroBootScrolly() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const idx = useTransform(scrollYProgress, (v) => Math.min(APP_BEATS.length - 1, Math.floor(v * APP_BEATS.length)));

  if (reduce) {
    return (
      <section className="px-6 md:px-12 py-24 max-w-6xl mx-auto">
        <h2 className="font-mono uppercase text-xs tracking-[0.4em] mb-10" style={{ color: palette.dim }}>
          § What&rsquo;s in the app
        </h2>
        <ul className="grid md:grid-cols-2 gap-6">
          {APP_BEATS.map((b, i) => (
            <li key={i} className="border rounded-sm p-6" style={{ borderColor: palette.track, background: palette.bgMid }}>
              <p className="font-mono uppercase text-xs tracking-[0.3em]" style={{ color: palette.amber }}>
                {b.t}
              </p>
              <p className="mt-3 font-sans text-sm leading-relaxed" style={{ color: palette.text }}>
                {b.d}
              </p>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-[100svh] flex items-center justify-center" style={{ background: palette.bg }}>
        <PhoneStage idx={idx} />
      </div>
    </section>
  );
}

function PhoneStage({ idx }: { idx: MotionValue<number> }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    return idx.on('change', (v) => setI(Math.round(v)));
  }, [idx]);
  const beat = APP_BEATS[i] ?? APP_BEATS[0];
  return (
    <div className="relative w-full max-w-3xl px-6 md:px-12 grid md:grid-cols-2 gap-10 items-center">
      {/* Phone mock */}
      <div className="flex justify-center">
        <div
          className="relative rounded-[36px] border p-3"
          style={{
            width: 240,
            aspectRatio: '9 / 19',
            borderColor: palette.track,
            background: palette.bgMid,
            boxShadow: `0 0 40px ${palette.blue}33`,
          }}
        >
          <div
            className="w-full h-full rounded-[28px] overflow-hidden relative"
            style={{ background: 'linear-gradient(180deg, #0c1840, #050b22)' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.45, ease: ease.throttle }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
              >
                <div
                  className="font-mono text-[9px] tracking-[0.3em] mb-3 px-2 py-1 rounded-sm"
                  style={{ background: palette.amberHot, color: palette.bg }}
                >
                  ALERT · {i + 1}/{APP_BEATS.length}
                </div>
                <p className="font-display tracking-tight" style={{ color: palette.text, fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', lineHeight: 1.05 }}>
                  {beat.t}
                </p>
                <p className="mt-3 font-sans text-[11px] leading-relaxed" style={{ color: palette.dim }}>
                  {beat.d}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div>
        <p className="font-mono uppercase text-xs tracking-[0.4em] mb-3" style={{ color: palette.dim }}>
          § Beat {i + 1} / {APP_BEATS.length}
        </p>
        <h3 className="font-display tracking-tight" style={{ color: palette.amber, fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1 }}>
          {beat.t}
        </h3>
        <p className="mt-4 font-sans text-base leading-relaxed max-w-prose" style={{ color: palette.text }}>
          {beat.d}
        </p>
      </div>
    </div>
  );
}

// =====================================================================
// SECTION 4 — STORY PULL-QUOTES
// =====================================================================
export function ElectroStoryQuotes() {
  const quotes = [
    { ex: 'QUOTE 01', q: "A drowsy friend almost crashed. I built the app.", ctx: '11pm flyover, 25-minute commute. The phone in his pocket was the missing DMS.' },
    { ex: 'QUOTE 02', q: "Saturdays at my cousin's bike shop became the spec.", ctx: 'Three showrooms, four Saturdays. He bought a petrol scooter. The booking site fixes that.' },
    { ex: 'QUOTE 03', q: 'Hardware-free, but not vibe-free.', ctx: 'Camera, accelerometer, gyro, GPS. Every rider already carries the kit.' },
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
            surface={palette.bgMid}
            border={palette.track}
            text={palette.text}
            accent={palette.amber}
            delay={i * 0.1}
          />
        ))}
      </div>
    </section>
  );
}

// =====================================================================
// SECTION 5 — ARCHITECTURE BLOCKS (sticky-side)
// =====================================================================
export function ElectroArchitectureBlocks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const blocks = ELECTROBIKE.architecture.slice(0, 3);

  return (
    <section ref={ref} className="relative" style={{ minHeight: '300vh' }}>
      <div className="sticky top-0 h-[100svh] flex items-center" style={{ background: palette.bgMid }}>
        <div className="grid lg:grid-cols-2 gap-10 px-6 md:px-12 max-w-7xl mx-auto w-full items-center">
          <div className="space-y-12">
            <p className="font-mono uppercase text-xs tracking-[0.4em]" style={{ color: palette.dim }}>
              § Two deliverables, one database
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
          <ArchBlocksDiagram progress={scrollYProgress} />
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
      <h3 className="font-display text-2xl md:text-3xl tracking-tight" style={{ color: palette.amber }}>
        {block.label}
      </h3>
      <p className="mt-3 font-sans leading-relaxed max-w-prose" style={{ color: palette.text }}>
        {block.body}
      </p>
    </motion.div>
  );
}

function ArchBlocksDiagram({ progress }: { progress: MotionValue<number> }) {
  const a1 = useTransform(progress, [0, 0.05, 0.33], [0, 1, 1]);
  const a2 = useTransform(progress, [0.33, 0.4, 0.66], [0, 1, 1]);
  const a3 = useTransform(progress, [0.66, 0.72, 1], [0, 1, 1]);
  return (
    <div className="aspect-square relative">
      <svg viewBox="0 0 320 320" className="w-full h-full" aria-hidden>
        <Block y={50} active={a1} label="MOBILE APP · Flutter" sub="iOS · Android · Win" />
        <Block y={140} active={a2} label="BOOKING SITE · React" sub="Vite + Tailwind 4" />
        <Block y={230} active={a3} label="EXPRESS + FIREBASE" sub="VAPI · Firestore" />

        {/* VAPI badge */}
        <motion.g style={{ opacity: a2 }}>
          <rect x={222} y={168} width={68} height={20} rx={3} fill={palette.amberHot} opacity={0.9} />
          <text x={256} y={182} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={9} fill={palette.bg} letterSpacing="0.3em" fontWeight={700}>
            VAPI
          </text>
          <motion.rect
            x={220}
            y={166}
            width={72}
            height={24}
            rx={3}
            fill="none"
            stroke={palette.amber}
            strokeWidth={1.5}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.1, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '256px 178px' }}
          />
        </motion.g>
      </svg>
    </div>
  );
}

function Block({ y, active, label, sub }: { y: number; active: MotionValue<number>; label: string; sub: string }) {
  const stroke = useTransform(active, (v) => (v > 0.5 ? palette.blue : palette.track));
  const fill = useTransform(active, (v) => `rgba(30,107,255,${0.05 + v * 0.18})`);
  return (
    <motion.g>
      <motion.rect x={40} y={y} width={240} height={64} fill={fill} stroke={stroke} strokeWidth={1.5} rx={4} />
      <text x={160} y={y + 28} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={11} letterSpacing="0.3em" fill={palette.text}>
        {label}
      </text>
      <text x={160} y={y + 46} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={8} letterSpacing="0.3em" fill={palette.dim}>
        {sub}
      </text>
    </motion.g>
  );
}

// =====================================================================
// SECTION 6 — BIKE ASSEMBLE (pinned)
// =====================================================================
const BIKE_PARTS: { label: string; from: { x: number; y: number; rot: number }; final: string }[] = [
  { label: 'FRAME',   from: { x: -200, y: 100, rot: -25 }, final: 'M 110 200 L 230 200 L 280 250 L 90 250 Z' },
  { label: 'FORK',    from: { x: 200, y: -150, rot: 30 },  final: 'M 90 250 L 70 290' },
  { label: 'WHEEL-F', from: { x: -250, y: -200, rot: 60 }, final: 'circle:60,300,30' },
  { label: 'WHEEL-R', from: { x: 250, y: 200, rot: -45 },  final: 'circle:280,300,30' },
  { label: 'HEADLAMP',from: { x: 0, y: -260, rot: 0 },     final: 'M 100 200 L 70 195 L 78 215 Z' },
  { label: 'BATTERY', from: { x: 0, y: 250, rot: 0 },      final: 'M 150 215 L 220 215 L 220 240 L 150 240 Z' },
];

export function ElectroBikeAssemble() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  if (reduce) {
    return (
      <section className="px-6 md:px-12 py-24 max-w-6xl mx-auto" id="app">
        <h2 className="font-mono uppercase text-xs tracking-[0.4em] mb-10" style={{ color: palette.dim }}>
          § The app — assembled
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {BIKE_PARTS.map((p, i) => (
            <div key={i} className="border rounded-sm px-4 py-3 font-mono text-xs tracking-[0.3em]" style={{ borderColor: palette.track, color: palette.text }}>
              {p.label}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative" id="app" style={{ height: '350vh' }}>
      <div className="sticky top-0 h-[100svh] flex items-center justify-center" style={{ background: palette.bg }}>
        <BikeStage progress={scrollYProgress} />
      </div>
    </section>
  );
}

function BikeStage({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="relative w-full max-w-4xl px-6 md:px-12">
      <p className="font-mono uppercase text-xs tracking-[0.4em] mb-10 text-center" style={{ color: palette.dim }}>
        § The app — assembled from parts
      </p>
      <svg viewBox="0 0 360 360" className="w-full h-auto" aria-hidden>
        <defs>
          <linearGradient id="headlightCone" x1="0" x2="1">
            <stop offset="0" stopColor={palette.amber} stopOpacity="0.6" />
            <stop offset="1" stopColor={palette.amber} stopOpacity="0" />
          </linearGradient>
        </defs>

        {BIKE_PARTS.map((p, i) => (
          <BikePart key={i} part={p} index={i} progress={progress} total={BIKE_PARTS.length} />
        ))}

        {/* Headlight cone after final part */}
        <Headlight progress={progress} />
      </svg>
    </div>
  );
}

function BikePart({
  part,
  index,
  progress,
  total,
}: {
  part: { label: string; from: { x: number; y: number; rot: number }; final: string };
  index: number;
  progress: MotionValue<number>;
  total: number;
}) {
  const start = (index / total) * 0.85;
  const end = ((index + 1) / total) * 0.85;
  const local = useTransform(progress, [start, end], [0, 1]);
  const x = useTransform(local, (v) => r3(part.from.x * (1 - v)));
  const y = useTransform(local, (v) => r3(part.from.y * (1 - v)));
  const rot = useTransform(local, (v) => r3(part.from.rot * (1 - v)));
  const scale = useTransform(local, [0, 0.85, 1], [0.6, 1.08, 1]);
  const opacity = useTransform(local, [0, 0.1, 1], [0, 1, 1]);

  let shape: React.ReactNode;
  if (part.final.startsWith('circle:')) {
    const [, raw] = part.final.split(':');
    const [cx, cy, r] = raw.split(',').map(Number);
    shape = (
      <>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={palette.blue} strokeWidth={2.5} />
        <circle cx={cx} cy={cy} r={r * 0.4} fill="none" stroke={palette.blue} strokeWidth={1} opacity={0.6} />
      </>
    );
  } else {
    shape = <path d={part.final} fill="none" stroke={palette.blue} strokeWidth={2.5} strokeLinejoin="round" />;
  }

  return (
    <motion.g
      style={{ x, y, rotate: rot, scale, opacity, transformOrigin: '180px 250px' }}
    >
      {shape}
    </motion.g>
  );
}

function Headlight({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.85, 0.95, 1], [0, 1, 1]);
  return (
    <motion.polygon
      points="60,300 360,200 360,400"
      fill="url(#headlightCone)"
      style={{ opacity, mixBlendMode: 'screen' }}
    />
  );
}

// =====================================================================
// SECTION 7 — BOOKING SITE (4-beat pinned)
// =====================================================================
const BK_BEATS = [
  { t: 'BROWSE', body: 'Catalogue from Firestore. Range, top speed, motor, charging, weight.' },
  { t: 'PICK SLOT', body: 'Slot grid. Server cap of 5. One cell flashes amber-hot and locks.' },
  { t: 'CONFIRM', body: 'Booking ID minted. Email sent. Push to admin dashboard.' },
  { t: 'VAPI CALLS', body: 'AI dials the rider in English / Tamil / Hindi with bike specs preloaded.' },
];

export function ElectroBookingSite() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const idx = useTransform(scrollYProgress, (v) => Math.min(BK_BEATS.length - 1, Math.floor(v * BK_BEATS.length)));

  if (reduce) {
    return (
      <section id="booking" className="px-6 md:px-12 py-24 max-w-6xl mx-auto">
        <h2 className="font-mono uppercase text-xs tracking-[0.4em] mb-10" style={{ color: palette.dim }}>
          § Booking site
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {BK_BEATS.map((b, i) => (
            <div key={i} className="border rounded-sm p-6" style={{ borderColor: palette.track, background: palette.bgMid }}>
              <p className="font-mono text-xs tracking-[0.3em]" style={{ color: palette.amber }}>
                {i + 1}. {b.t}
              </p>
              <p className="mt-3 font-sans text-sm" style={{ color: palette.text }}>
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="booking" className="relative" style={{ height: '400vh' }}>
      <div className="sticky top-0 h-[100svh] flex items-center justify-center" style={{ background: palette.bgMid }}>
        <BookingStage idx={idx} />
      </div>
    </section>
  );
}

function BookingStage({ idx }: { idx: MotionValue<number> }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    return idx.on('change', (v) => setI(Math.round(v)));
  }, [idx]);

  return (
    <div className="relative w-full max-w-5xl px-6 md:px-12">
      <p className="font-mono uppercase text-xs tracking-[0.4em] mb-8 text-center" style={{ color: palette.dim }}>
        § Booking site · Beat {i + 1} / {BK_BEATS.length}
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Slot grid */}
        <div className="rounded-sm border p-6" style={{ borderColor: palette.track, background: palette.bg }}>
          <p className="font-mono uppercase text-[10px] tracking-[0.3em] mb-3" style={{ color: palette.amber }}>
            Pick slot · TUE
          </p>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 16 }).map((_, j) => {
              const isLocked = i >= 1 && j === 5;
              return (
                <motion.div
                  key={j}
                  className="aspect-square flex items-center justify-center font-mono text-[10px] tracking-[0.2em] rounded-sm"
                  style={{
                    background: isLocked ? palette.amberHot : 'rgba(30,107,255,0.18)',
                    color: isLocked ? palette.bg : palette.blueGlow,
                    border: `1px solid ${isLocked ? palette.amber : palette.blue}`,
                  }}
                  animate={isLocked ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 0.6, ease: ease.throttle }}
                >
                  {isLocked ? '5/5' : `${10 + (j % 8)}:00`}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Phone call panel */}
        <div className="rounded-sm border p-6 relative overflow-hidden" style={{ borderColor: palette.track, background: palette.bg }}>
          <p className="font-mono uppercase text-[10px] tracking-[0.3em] mb-3" style={{ color: palette.amber }}>
            VAPI · outbound
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: ease.throttle }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: i >= 3 ? palette.green : palette.track, color: palette.text }}
                  animate={i >= 3 ? { rotate: [-8, 8, -8] } : { rotate: 0 }}
                  transition={{ duration: 0.4, repeat: i >= 3 ? Infinity : 0, repeatType: 'reverse' }}
                >
                  ☎
                </motion.div>
                <span className="font-mono text-xs" style={{ color: palette.text }}>
                  {i >= 3 ? 'Connected · 00:42' : i >= 2 ? 'Dialing…' : 'Idle'}
                </span>
              </div>

              {/* waveform */}
              {i >= 3 ? (
                <div className="flex items-end gap-1 h-12">
                  {Array.from({ length: 24 }).map((_, w) => (
                    <motion.span
                      key={w}
                      className="w-1.5 rounded-sm"
                      style={{ background: palette.amber }}
                      animate={{ height: ['20%', `${30 + (w * 13) % 70}%`, '20%'] }}
                      transition={{ duration: 0.6 + (w % 5) * 0.1, repeat: Infinity, ease: 'easeInOut', delay: w * 0.04 }}
                    />
                  ))}
                </div>
              ) : null}

              {i >= 3 ? (
                <div className="rounded-sm p-3" style={{ background: palette.bgMid, color: palette.text }}>
                  <p className="font-sans text-xs leading-relaxed">
                    &ldquo;Hi, this is the test-ride desk. Tuesday at 4pm still works for the model you chose?&rdquo;
                  </p>
                </div>
              ) : null}

              <div className="flex gap-2 mt-2">
                {['EN · 1', 'TA · 2', 'HI · 3'].map((p) => (
                  <span
                    key={p}
                    className="font-mono text-[9px] tracking-[0.25em] px-2 py-1 rounded-sm"
                    style={{ background: palette.bgMid, color: palette.amber, border: `1px solid ${palette.track}` }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-8 font-mono uppercase text-xs tracking-[0.4em] text-center" style={{ color: palette.amber }}>
        {BK_BEATS[i].t} · {BK_BEATS[i].body}
      </p>
    </div>
  );
}

// =====================================================================
// SECTION 8 — GAUGES PAIR
// =====================================================================
export function ElectroGaugesPair() {
  return (
    <section className="px-6 md:px-12 py-32 max-w-6xl mx-auto">
      <p className="font-mono uppercase text-xs tracking-[0.4em] mb-12 text-center" style={{ color: palette.dim }}>
        § Eco-coach × predictive maintenance
      </p>
      <div className="grid md:grid-cols-2 gap-12">
        <Gauge label="Eco-score" value={84} color1={palette.green} color2={palette.amber} suffix="/100" />
        <Gauge label="Predictive health" value={71} color1={palette.amber} color2={palette.amberHot} suffix="%" />
      </div>
    </section>
  );
}

function Gauge({ label, value, color1, color2, suffix }: { label: string; value: number; color1: string; color2: string; suffix: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => Math.round(v).toString());
  const pathLength = useTransform(mv, (v) => v / 100);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      mv.set(value);
      return;
    }
    const c = animate(mv, value, { duration: 1.6, ease: ease.throttle });
    return () => c.stop();
  }, [inView, mv, value, reduce]);

  useEffect(() => display.on('change', (v) => {
    if (textRef.current) textRef.current.textContent = v;
  }), [display]);

  const gradId = `g-${label.replace(/\s+/g, '-')}`;

  return (
    <div ref={ref} className="rounded-sm border p-8" style={{ borderColor: palette.track, background: palette.bgMid }}>
      <p className="font-mono uppercase text-xs tracking-[0.4em] mb-6" style={{ color: palette.dim }}>
        {label}
      </p>
      <div className="relative w-full max-w-[320px] mx-auto">
        <svg viewBox="0 0 200 130" className="w-full" aria-hidden>
          <defs>
            <linearGradient id={gradId} x1="0" x2="1">
              <stop offset="0" stopColor={color1} />
              <stop offset="1" stopColor={color2} />
            </linearGradient>
          </defs>
          <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke={palette.track} strokeWidth={14} strokeLinecap="round" />
          <motion.path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={14}
            strokeLinecap="round"
            style={{ pathLength }}
          />
        </svg>
        <div className="text-center mt-3 font-display tracking-tight" style={{ color: palette.text, fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
          <span ref={textRef}>0</span>
          <span className="font-mono text-base ml-1" style={{ color: palette.dim }}>
            {suffix}
          </span>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// SECTION 9 — OUTCOMES QUOTE
// =====================================================================
export function ElectroOutcomesQuote() {
  return (
    <section className="px-6 md:px-12 py-40 max-w-5xl mx-auto text-center">
      <p
        className="font-display italic tracking-tight leading-[1.05]"
        style={{ color: palette.amber, fontSize: 'clamp(2rem, 6vw, 5rem)' }}
      >
        &ldquo;Software does the thinking. The bike does the riding.&rdquo;
      </p>
    </section>
  );
}
