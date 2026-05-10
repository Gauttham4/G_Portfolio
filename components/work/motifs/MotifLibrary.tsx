'use client';

// Phase 6b v2 — Per-project motif library.
// Each motif is derived from a SKILL.md "Motif Catalogue" / "Signature beats"
// entry. GSAP/R3F/Lottie variants from the source spec are substituted with
// pure Framer Motion equivalents (noted on each component).

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { type ReactNode, type ReactElement } from 'react';
import type { ProjectTheme } from '@/lib/project-themes';

const EASE = [0.22, 0.61, 0.36, 1] as const;
const ORGANIC = [0.16, 0.84, 0.24, 1] as const;
const r3 = (n: number) => Math.round(n * 1000) / 1000;

// Pre-computed OTP digits for PhoneOTPHero — avoids per-render Math.floor.
const OTP_DIGITS = [0, 1, 2, 3, 4, 5].map((i) => Math.floor((i + 3) * 1.7) % 10);

// --------------------------------------------------------------------------
// Shared title / kicker scaffolding (used by every hero motif)
// --------------------------------------------------------------------------

export function MotifTitleStack({ theme, accentLetter }: { theme: ProjectTheme; accentLetter?: number }) {
  const reduce = useReducedMotion();
  const letters = theme.title.split('');
  return (
    <div className="relative z-10 flex flex-col justify-end min-h-[92vh] px-6 md:px-12 py-24 md:py-32 max-w-7xl mx-auto">
      <motion.p
        className="font-mono uppercase text-[10px] md:text-xs tracking-[0.35em] mb-8 opacity-80"
        style={{ color: theme.palette.accent }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 0.85, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
      >
        {theme.kicker}
      </motion.p>
      {accentLetter !== undefined ? (
        <h1 className="font-display leading-[0.92] tracking-tight" style={{ fontSize: 'clamp(3rem, 11vw, 9.5rem)' }} aria-label={theme.title}>
          {letters.map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="inline-block"
              style={{ color: i === accentLetter ? theme.palette.accent : 'inherit' }}
              initial={reduce ? false : { opacity: 0, y: 36, rotate: -2 }}
              animate={reduce ? undefined : { opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.55, delay: 0.18 + i * 0.035, ease: EASE }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </h1>
      ) : (
        <motion.h1
          className="font-display leading-[0.92] tracking-tight"
          style={{ fontSize: 'clamp(3rem, 11vw, 9.5rem)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: EASE }}
        >
          {theme.title}
        </motion.h1>
      )}
      <motion.p
        className="font-display italic mt-6 md:mt-8 max-w-3xl"
        style={{ color: theme.palette.text, fontSize: 'clamp(1.1rem, 2.2vw, 1.85rem)', opacity: 0.85 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 0.85, y: 0 }}
        transition={{ duration: 0.7, delay: 0.32, ease: EASE }}
      >
        {theme.subtitle}
      </motion.p>
    </div>
  );
}

function HeroFrame({ theme, children, fade = 0.7 }: { theme: ProjectTheme; children: ReactNode; fade?: number }) {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '92vh', background: theme.palette.bg, color: theme.palette.text }}>
      <div className="absolute inset-0 z-0" aria-hidden>{children}</div>
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: `linear-gradient(180deg, ${theme.palette.bg}99 0%, ${theme.palette.bg}${Math.round(fade * 255).toString(16).padStart(2, '0')} 60%, ${theme.palette.bg}f5 100%)` }}
      />
      <MotifTitleStack theme={theme} />
    </section>
  );
}

// --------------------------------------------------------------------------
// AGRI / NATURAL — Crop Row Reveal, Soil-to-Sprout, Leaf Fall
// --------------------------------------------------------------------------

// Soil-to-Sprout — SVG path morph (thaazhai, agri-tech-website)
export function SoilSproutHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <HeroFrame theme={theme}>
      <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.32 }} />
      <svg className="absolute right-[10%] top-[18%] w-[260px] h-[260px] md:w-[360px] md:h-[360px]" viewBox="0 0 100 100" aria-hidden>
        <motion.path
          d="M50 80 Q50 60 50 40 M50 60 Q40 50 30 45 M50 60 Q60 50 70 45 M50 40 Q42 32 36 28 M50 40 Q58 32 64 28"
          stroke={theme.palette.accent}
          strokeWidth={1.6}
          strokeLinecap="round"
          fill="none"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={reduce ? undefined : { pathLength: 1, opacity: 0.85 }}
          transition={{ duration: 1.8, ease: ORGANIC, delay: 0.4 }}
        />
        <motion.circle
          cx={50} cy={82} r={3.5}
          fill={theme.palette.accent2 ?? theme.palette.accent}
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
        />
      </svg>
    </HeroFrame>
  );
}

// Leaf-Fall ambient (mid section divider for agri projects)
export function LeafFallDivider({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  if (reduce) return <SectionRule theme={theme} label="GROWTH" />;
  return (
    <section className="relative h-[280px] overflow-hidden" style={{ background: theme.palette.bgMid }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute block w-3 h-4 rounded-[40%_60%_50%_50%]"
          style={{ left: `${r3(8 + i * 11)}%`, background: i % 2 ? theme.palette.accent : theme.palette.accent2 ?? theme.palette.accent, opacity: 0.55 }}
          initial={{ y: -40, rotate: 0 }}
          animate={{ y: 320, rotate: 360 }}
          transition={{ duration: r3(6 + (i % 4) * 1.4), delay: r3(i * 0.7), repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <div className="relative z-10 flex items-center justify-center h-full">
        <span className="font-mono uppercase text-[10px] tracking-[0.35em]" style={{ color: theme.palette.accent }}>§ GROWTH · IN MOTION</span>
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// EDUCATION — Chalk Stroke, Books Stack, Page Turn
// --------------------------------------------------------------------------

// Chalk-stroke title (student-portal, teacher-portal)
export function ChalkStrokeHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <HeroFrame theme={theme}>
      <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.22, filter: 'grayscale(0.5)' }} />
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
        {[20, 50, 78].map((y, i) => (
          <motion.line
            key={i}
            x1={5} x2={95} y1={y} y2={y + (i === 1 ? -2 : 1)}
            stroke={theme.palette.accent}
            strokeWidth={0.18}
            strokeOpacity={0.45}
            initial={reduce ? false : { pathLength: 0 }}
            animate={reduce ? undefined : { pathLength: 1 }}
            transition={{ duration: 1.4, delay: 0.3 + i * 0.18, ease: EASE }}
          />
        ))}
      </svg>
    </HeroFrame>
  );
}

// Receipt-printer roll (ea-tuition-app, fee-management mid)
export function ReceiptRollDivider({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <section className="relative py-20 overflow-hidden" style={{ background: theme.palette.bgMid }}>
      <div className="max-w-md mx-auto px-6">
        <motion.div
          className="bg-white text-black font-mono text-xs p-6 rounded-sm shadow-2xl"
          style={{ originY: 0 }}
          initial={reduce ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.2, ease: ORGANIC }}
        >
          <p className="uppercase tracking-[0.2em] text-[10px] mb-3 text-center border-b border-black/30 pb-2">{theme.title} · Receipt</p>
          <p>Status ............... PAID</p>
          <p>Method ............... Local UPI</p>
          <p>Reference ............ #{theme.slug.slice(0, 6).toUpperCase()}-04</p>
          <p className="border-t border-dashed border-black/40 mt-3 pt-3 text-center">— thank you —</p>
        </motion.div>
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// WELLNESS — Breathing Glow, Watercolor, Exhale Fade
// --------------------------------------------------------------------------

// Breathing gradient hero (mindora, alzhmeric calm variant)
export function BreathingGlowHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <HeroFrame theme={theme}>
      <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.18 }} />
      <motion.div
        className="absolute left-1/2 top-1/2 w-[80vw] h-[80vw] max-w-[1100px] max-h-[1100px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: `radial-gradient(circle, ${theme.palette.accent}55 0%, ${theme.palette.accent}0c 35%, transparent 65%)`,
          mixBlendMode: 'screen',
        }}
        initial={reduce ? false : { opacity: 0.45, scale: 0.92 }}
        animate={reduce ? undefined : { opacity: [0.4, 0.75, 0.4], scale: [0.92, 1.05, 0.92] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {theme.palette.accent2 ? (
        <motion.div
          className="absolute left-[55%] top-[40%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px]"
          style={{ background: `radial-gradient(circle, ${theme.palette.accent2}33 0%, transparent 60%)`, mixBlendMode: 'screen' }}
          animate={reduce ? undefined : { opacity: [0.3, 0.6, 0.3], scale: [1, 1.12, 1] }}
          transition={{ duration: 7.4, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
        />
      ) : null}
    </HeroFrame>
  );
}

// Watercolor brushstroke divider (mindora mid)
export function WatercolorDivider({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <section className="relative h-[200px] overflow-hidden flex items-center" style={{ background: theme.palette.bgMid }}>
      <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden>
        <motion.path
          d="M0 100 Q200 40 500 100 T1000 100"
          stroke={theme.palette.accent}
          strokeWidth={28}
          strokeLinecap="round"
          fill="none"
          opacity={0.45}
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 2.4, ease: ORGANIC }}
        />
      </svg>
    </section>
  );
}

// --------------------------------------------------------------------------
// TRAVEL / VOYAGR — Departure Board Flip, Route Path Draw
// --------------------------------------------------------------------------

export function DepartureBoardHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  const cells = ['VOY', 'AGR', '·', 'PLAN', 'AI', 'GO'];
  return (
    <HeroFrame theme={theme}>
      <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.25 }} />
      <div className="absolute right-[6%] top-[16%] hidden md:flex gap-1 font-mono text-2xl md:text-4xl" aria-hidden>
        {cells.map((c, i) => (
          <motion.span
            key={i}
            className="px-3 py-2 border"
            style={{ background: '#0a0a0a', color: theme.palette.accent, borderColor: `${theme.palette.accent}55` }}
            initial={reduce ? false : { rotateX: -90, opacity: 0 }}
            animate={reduce ? undefined : { rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.12, ease: EASE }}
          >
            {c}
          </motion.span>
        ))}
      </div>
    </HeroFrame>
  );
}

export function RouteDrawDivider({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <section className="relative h-[260px] overflow-hidden flex items-center" style={{ background: theme.palette.bgMid }}>
      <svg className="w-full h-full" viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden>
        <motion.path
          d="M40 200 C220 80 380 220 520 130 S820 60 960 150"
          stroke={theme.palette.accent}
          strokeWidth={2.4}
          strokeDasharray="6 8"
          fill="none"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.9 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 2, ease: EASE }}
        />
        {[40, 520, 960].map((cx, i) => (
          <motion.circle key={i} cx={cx} cy={i === 0 ? 200 : i === 1 ? 130 : 150} r={6} fill={theme.palette.accent}
            initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.5 }} />
        ))}
      </svg>
    </section>
  );
}

// --------------------------------------------------------------------------
// SECURITY / DARKWATCH / DIVYADRISHTI — Glitch, Scan Pulse, Radar Sweep
// --------------------------------------------------------------------------

export function TerminalBootHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  const lines = ['> initializing watch.daemon', '> 2,340 channels online', '> threat-radar: armed', '> last alert: 00:00:14 ago'];
  return (
    <HeroFrame theme={theme}>
      <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.22, filter: 'hue-rotate(330deg) saturate(0.7)' }} />
      <div className="absolute left-[6%] bottom-[12%] hidden md:block font-mono text-xs md:text-sm" style={{ color: theme.palette.accent }} aria-hidden>
        {lines.map((l, i) => (
          <motion.div key={i}
            initial={reduce ? false : { opacity: 0, x: -8 }}
            animate={reduce ? undefined : { opacity: 0.85, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.35, ease: 'linear' }}
          >{l}</motion.div>
        ))}
      </div>
      {/* scanline overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px)' }}
        animate={reduce ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
    </HeroFrame>
  );
}

export function ThreatRadarDivider({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <section className="relative h-[300px] overflow-hidden flex items-center justify-center" style={{ background: theme.palette.bgMid }}>
      <div className="relative w-[240px] h-[240px]">
        <div className="absolute inset-0 rounded-full border" style={{ borderColor: `${theme.palette.accent}33` }} />
        <div className="absolute inset-[18%] rounded-full border" style={{ borderColor: `${theme.palette.accent}33` }} />
        <div className="absolute inset-[36%] rounded-full border" style={{ borderColor: `${theme.palette.accent}33` }} />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: `conic-gradient(from 0deg, transparent 0deg, ${theme.palette.accent}66 30deg, transparent 60deg)` }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute left-1/2 top-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: theme.palette.accent }} />
      </div>
    </section>
  );
}

// Emergency pulse / SOS halo (divyadrishti)
export function GuardianHaloHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <HeroFrame theme={theme}>
      <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.28 }} />
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 w-[200px] h-[200px] md:w-[320px] md:h-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ border: `2px solid ${theme.palette.accent}`, opacity: 0.5 }}
          initial={reduce ? false : { scale: 0.6, opacity: 0.6 }}
          animate={reduce ? undefined : { scale: [0.6, 1.6, 0.6], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeOut', delay: i * 1.2 }}
        />
      ))}
    </HeroFrame>
  );
}

// --------------------------------------------------------------------------
// SPACE / SPACEFORGE — Star Constellation, Cosmic Rays
// --------------------------------------------------------------------------

export function StarConstellationHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  const stars = Array.from({ length: 28 }, (_, i) => ({
    cx: r3(50 + 40 * Math.cos((i / 28) * Math.PI * 2 + i)),
    cy: r3(50 + 30 * Math.sin((i / 28) * Math.PI * 2 + i * 1.3)),
    r: r3(0.5 + (i % 4) * 0.4),
  }));
  return (
    <HeroFrame theme={theme}>
      <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.35 }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden>
        {stars.map((s, i) => (
          <motion.circle
            key={i} cx={s.cx} cy={s.cy} r={s.r} fill={theme.palette.accent}
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 3 + (i % 5), delay: r3(i * 0.08), repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {stars.slice(0, 8).map((s, i) => {
          const next = stars[(i + 1) % 8];
          return (
            <motion.line
              key={`l${i}`} x1={s.cx} y1={s.cy} x2={next.cx} y2={next.cy}
              stroke={theme.palette.accent} strokeWidth={0.12} strokeOpacity={0.4}
              initial={reduce ? false : { pathLength: 0 }}
              animate={reduce ? undefined : { pathLength: 1 }}
              transition={{ duration: 1.6, delay: 0.5 + i * 0.18, ease: EASE }}
            />
          );
        })}
      </svg>
    </HeroFrame>
  );
}

export function CosmicRayDivider({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <section className="relative h-[260px] overflow-hidden" style={{ background: theme.palette.bgMid }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px"
          style={{ top: `${20 + i * 18}%`, left: 0, right: 0, background: `linear-gradient(90deg, transparent, ${theme.palette.accent}, transparent)` }}
          initial={reduce ? false : { x: '-30%', opacity: 0 }}
          whileInView={{ x: '30%', opacity: [0, 1, 0] }}
          viewport={{ once: false }}
          transition={{ duration: 3.2, delay: r3(i * 0.4), repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </section>
  );
}

// --------------------------------------------------------------------------
// AI / VIKSIT / CAREERVISIONX — Prompt-Typing, Chat Bubble, Path Branch
// --------------------------------------------------------------------------

export function PromptTypingHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  const text = '> generate a workspace where AI is a colleague_';
  return (
    <HeroFrame theme={theme}>
      <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.2 }} />
      <div className="absolute left-[6%] bottom-[16%] right-[6%] md:right-auto md:max-w-[640px] font-mono text-base md:text-xl" style={{ color: theme.palette.accent }}>
        {text.split('').map((ch, i) => (
          <motion.span
            key={i}
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            transition={{ duration: 0.01, delay: 0.6 + i * 0.04 }}
          >{ch}</motion.span>
        ))}
      </div>
    </HeroFrame>
  );
}

export function PathBranchHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <HeroFrame theme={theme}>
      <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.25 }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <motion.path d="M10 90 C 30 70 30 60 50 50 C 70 40 70 30 90 10"
          stroke={theme.palette.accent} strokeWidth={0.4} fill="none"
          initial={reduce ? false : { pathLength: 0 }}
          animate={reduce ? undefined : { pathLength: 1 }}
          transition={{ duration: 2, ease: EASE, delay: 0.3 }} />
        <motion.path d="M50 50 C 60 60 70 70 90 80"
          stroke={theme.palette.accent} strokeWidth={0.3} strokeDasharray="1.5 1.5" fill="none" opacity={0.7}
          initial={reduce ? false : { pathLength: 0 }}
          animate={reduce ? undefined : { pathLength: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 1.6 }} />
      </svg>
    </HeroFrame>
  );
}

export function ChatBubbleDivider({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  const bubbles = [
    { side: 'left', text: 'Here is your draft.' },
    { side: 'right', text: 'Tighten the second half?' },
    { side: 'left', text: 'On it.' },
  ];
  return (
    <section className="relative py-20 px-6" style={{ background: theme.palette.bgMid }}>
      <div className="max-w-2xl mx-auto space-y-3">
        {bubbles.map((b, i) => (
          <motion.div
            key={i}
            className={`max-w-[80%] px-5 py-3 rounded-2xl ${b.side === 'right' ? 'ml-auto' : ''}`}
            style={{ background: b.side === 'right' ? theme.palette.accent : `${theme.palette.text}11`, color: b.side === 'right' ? theme.palette.bg : theme.palette.text }}
            initial={reduce ? false : { opacity: 0, y: 12, x: b.side === 'right' ? 12 : -12 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.5, delay: i * 0.25 }}
          >{b.text}</motion.div>
        ))}
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// AGENCY / ZYNTRA / VKMG-LANDING — Color Block Stack, Marquee, Letter Wipe
// --------------------------------------------------------------------------

export function ColorBlockHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <HeroFrame theme={theme}>
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3" aria-hidden>
        {Array.from({ length: 9 }).map((_, i) => {
          const colors = [theme.palette.bg, theme.palette.bgMid, theme.palette.accent + '22', theme.palette.bg, theme.palette.accent + '11', theme.palette.bgMid, theme.palette.bg, theme.palette.bgMid, theme.palette.accent + '22'];
          return (
            <motion.div
              key={i}
              style={{ background: colors[i] }}
              initial={reduce ? false : { scaleY: 0, originY: i % 2 ? 1 : 0 }}
              animate={reduce ? undefined : { scaleY: 1 }}
              transition={{ duration: 0.7, delay: 0.1 + (i % 5) * 0.08, ease: EASE }}
            />
          );
        })}
      </div>
      <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.15, mixBlendMode: 'luminosity' }} />
    </HeroFrame>
  );
}

export function MarqueeStripDivider({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  const items = ['CRAFT', 'COLOR', 'CODE', 'CONCEPT', 'CRAFT', 'COLOR', 'CODE', 'CONCEPT'];
  return (
    <section className="relative py-12 overflow-hidden" style={{ background: theme.palette.accent, color: theme.palette.bg }}>
      <motion.div
        className="flex gap-12 whitespace-nowrap font-display text-4xl md:text-7xl tracking-tight"
        animate={reduce ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((it, i) => (
          <span key={i} className="inline-block">{it} <span style={{ opacity: 0.4 }}>·</span></span>
        ))}
      </motion.div>
    </section>
  );
}

// --------------------------------------------------------------------------
// JEWELRY / SHIMMER / LUXURY — Gold Sweep, Sparkle Edge
// --------------------------------------------------------------------------

export function GoldSweepHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <HeroFrame theme={theme}>
      <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.4 }} />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(110deg, transparent 30%, ${theme.palette.accent}55 50%, transparent 70%)` }}
        initial={reduce ? false : { x: '-100%' }}
        animate={reduce ? undefined : { x: '100%' }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
      />
    </HeroFrame>
  );
}

export function SparkleEdgeDivider({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  const dots = Array.from({ length: 24 }, (_, i) => ({ x: r3((i / 24) * 100), d: r3(i * 0.13) }));
  return (
    <section className="relative h-[160px] flex items-center" style={{ background: theme.palette.bgMid }}>
      <div className="relative w-full h-px" style={{ background: `${theme.palette.accent}44` }}>
        {dots.map((d, i) => (
          <motion.span
            key={i}
            className="absolute -top-1 w-2 h-2 rounded-full"
            style={{ left: `${d.x}%`, background: theme.palette.accent, boxShadow: `0 0 8px ${theme.palette.accent}` }}
            initial={reduce ? false : { opacity: 0, scale: 0 }}
            animate={reduce ? undefined : { opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{ duration: 1.6, delay: d.d, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// MARKETS / FINANCE — Candlestick Build, Ticker
// --------------------------------------------------------------------------

export function CandlestickHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  const bars = Array.from({ length: 18 }, (_, i) => ({
    h: r3(20 + Math.abs(Math.sin(i * 1.4)) * 60),
    up: i % 3 !== 0,
  }));
  return (
    <HeroFrame theme={theme}>
      <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.18 }} />
      <div className="absolute right-[5%] bottom-[18%] flex items-end gap-2 h-[200px] md:h-[320px]" aria-hidden>
        {bars.map((b, i) => (
          <motion.div
            key={i}
            className="w-2 md:w-3"
            style={{ background: b.up ? theme.palette.accent : (theme.palette.accent2 ?? theme.palette.accent), height: `${b.h}%` }}
            initial={reduce ? false : { scaleY: 0, originY: 1 }}
            animate={reduce ? undefined : { scaleY: 1 }}
            transition={{ duration: 0.45, delay: 0.3 + i * 0.05, ease: EASE }}
          />
        ))}
      </div>
    </HeroFrame>
  );
}

export function TickerStripDivider({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  const items = ['NIFTY +0.84%', 'SENSEX +1.12%', 'TCS +2.4%', 'INFY -0.6%', 'RELIANCE +0.9%', 'HDFC +1.8%'];
  return (
    <section className="relative py-4 overflow-hidden border-y" style={{ background: theme.palette.bgMid, borderColor: `${theme.palette.accent}33` }}>
      <motion.div
        className="flex gap-10 whitespace-nowrap font-mono text-sm"
        style={{ color: theme.palette.accent }}
        animate={reduce ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items, ...items].map((s, i) => <span key={i}>{s}</span>)}
      </motion.div>
    </section>
  );
}

// --------------------------------------------------------------------------
// ELDERCARE / ALZHMERIC — Memory Echo, Tactile Card
// --------------------------------------------------------------------------

export function MemoryEchoHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <HeroFrame theme={theme}>
      <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.3, filter: 'sepia(0.3) brightness(0.85)' }} />
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-[50%] w-[300px] h-[200px] md:w-[420px] md:h-[280px] -translate-x-1/2 -translate-y-1/2 border"
          style={{ borderColor: `${theme.palette.accent}55`, background: `${theme.palette.bg}33` }}
          initial={reduce ? false : { opacity: 0, x: -16 - i * 8, y: 6 + i * 4, rotate: -2 - i }}
          animate={reduce ? undefined : { opacity: 0.7 - i * 0.18, x: -16 - i * 8, y: 6 + i * 4, rotate: -2 - i }}
          transition={{ duration: 0.9, delay: 0.3 + i * 0.2 }}
        />
      ))}
    </HeroFrame>
  );
}

// --------------------------------------------------------------------------
// HOSPITALITY / HOTEL — Soft Reveal, Key-card flip
// --------------------------------------------------------------------------

export function SoftRevealHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <HeroFrame theme={theme}>
      <motion.div className="absolute inset-0"
        initial={reduce ? false : { clipPath: 'inset(20% 30% 20% 30%)' }}
        animate={reduce ? undefined : { clipPath: 'inset(0% 0% 0% 0%)' }}
        transition={{ duration: 1.6, ease: ORGANIC, delay: 0.1 }}
      >
        <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.55 }} />
      </motion.div>
    </HeroFrame>
  );
}

export function KeyCardDivider({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <section className="relative py-24 flex items-center justify-center" style={{ background: theme.palette.bgMid }}>
      <motion.div
        className="w-[280px] h-[170px] rounded-md shadow-xl flex flex-col justify-between p-5"
        style={{ background: `linear-gradient(135deg, ${theme.palette.accent}, ${theme.palette.accent2 ?? theme.palette.accent})`, color: theme.palette.bg }}
        initial={reduce ? false : { rotateY: 90, opacity: 0 }}
        whileInView={{ rotateY: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.9, ease: ORGANIC }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-80">Room Key</span>
        <span className="font-display text-2xl">{theme.title}</span>
        <span className="font-mono text-[10px] tracking-[0.2em]">VALID · 1 NIGHT</span>
      </motion.div>
    </section>
  );
}

// --------------------------------------------------------------------------
// CIVIC / TVK — Phone-in-hand, OTP
// --------------------------------------------------------------------------

export function PhoneOTPHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <HeroFrame theme={theme}>
      <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.2 }} />
      <div className="absolute right-[8%] top-[14%] hidden md:block w-[220px] h-[440px] rounded-[32px] border-2 p-3" style={{ borderColor: `${theme.palette.accent}66`, background: `${theme.palette.bg}cc` }} aria-hidden>
        <div className="w-full h-full rounded-[20px] flex items-center justify-center" style={{ background: theme.palette.bgMid }}>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.span key={i}
                className="w-7 h-10 rounded-md border flex items-center justify-center font-mono text-lg"
                style={{ borderColor: `${theme.palette.accent}88`, color: theme.palette.accent }}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.18 }}
              >{OTP_DIGITS[i]}</motion.span>
            ))}
          </div>
        </div>
      </div>
    </HeroFrame>
  );
}

// --------------------------------------------------------------------------
// CLOUD / INFRA — Provisioning Grid Reveal
// --------------------------------------------------------------------------

export function CloudGridHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  const cells = Array.from({ length: 24 }, (_, i) => i);
  return (
    <HeroFrame theme={theme}>
      <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.18 }} />
      <div className="absolute right-[5%] top-[14%] grid grid-cols-6 gap-1 hidden md:grid" aria-hidden>
        {cells.map((i) => (
          <motion.div
            key={i}
            className="w-7 h-7 border"
            style={{ borderColor: `${theme.palette.accent}55`, background: i % 5 === 0 ? theme.palette.accent : `${theme.palette.accent}11` }}
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            animate={reduce ? undefined : { opacity: [0, 1, 0.6, 1], scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + (i % 6) * 0.08 + Math.floor(i / 6) * 0.12 }}
          />
        ))}
      </div>
    </HeroFrame>
  );
}

// --------------------------------------------------------------------------
// FIELD REPORTS / VKMG — Site survey grid
// --------------------------------------------------------------------------

export function FieldGridHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <HeroFrame theme={theme}>
      <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.32 }} />
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
        {[20, 40, 60, 80].map((y, i) => (
          <motion.line key={`h${i}`} x1={0} x2={100} y1={y} y2={y}
            stroke={theme.palette.accent} strokeWidth={0.1} strokeOpacity={0.4}
            initial={reduce ? false : { pathLength: 0 }}
            animate={reduce ? undefined : { pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.2 + i * 0.15 }} />
        ))}
        {[20, 40, 60, 80].map((x, i) => (
          <motion.line key={`v${i}`} y1={0} y2={100} x1={x} x2={x}
            stroke={theme.palette.accent} strokeWidth={0.1} strokeOpacity={0.4}
            initial={reduce ? false : { pathLength: 0 }}
            animate={reduce ? undefined : { pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.4 + i * 0.15 }} />
        ))}
      </svg>
    </HeroFrame>
  );
}

// --------------------------------------------------------------------------
// MEDICINE — Capsule Search Pulse
// --------------------------------------------------------------------------

export function CapsulePulseHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <HeroFrame theme={theme}>
      <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.24 }} />
      <motion.div
        className="absolute right-[10%] top-[20%] w-[180px] h-[60px] md:w-[260px] md:h-[80px] rounded-full"
        style={{ background: `linear-gradient(90deg, ${theme.palette.accent} 0 50%, ${theme.palette.text} 50% 100%)`, opacity: 0.85 }}
        initial={reduce ? false : { rotate: -10, scale: 0.9, opacity: 0 }}
        animate={reduce ? undefined : { rotate: 0, scale: 1, opacity: 0.85 }}
        transition={{ duration: 1.1, ease: ORGANIC, delay: 0.4 }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 w-32 h-32 md:w-56 md:h-56 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(circle, ${theme.palette.accent}33 0%, transparent 70%)` }}
        animate={reduce ? undefined : { scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </HeroFrame>
  );
}

// --------------------------------------------------------------------------
// INVOICE / PAPERWORK — Stamp Drop
// --------------------------------------------------------------------------

export function StampDropHero({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <HeroFrame theme={theme}>
      <Image src={theme.heroImage} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.28 }} />
      <motion.div
        className="absolute right-[12%] top-[18%] w-[180px] h-[180px] md:w-[240px] md:h-[240px] rounded-full border-4 flex items-center justify-center font-mono uppercase tracking-[0.2em]"
        style={{ borderColor: theme.palette.accent, color: theme.palette.accent, transform: 'rotate(-12deg)' }}
        initial={reduce ? false : { scale: 2.6, opacity: 0 }}
        animate={reduce ? undefined : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: ORGANIC, delay: 0.4 }}
      >
        <span className="text-center text-sm md:text-base leading-tight">PAID<br/>IN FULL<br/>· 2026 ·</span>
      </motion.div>
    </HeroFrame>
  );
}

// --------------------------------------------------------------------------
// Generic section rule (used in reduced-motion fallback)
// --------------------------------------------------------------------------

export function SectionRule({ theme, label }: { theme: ProjectTheme; label: string }) {
  return (
    <section className="relative py-16 px-6" style={{ background: theme.palette.bgMid }}>
      <div className="max-w-7xl mx-auto flex items-center gap-6">
        <span className="font-mono uppercase text-[10px] tracking-[0.35em]" style={{ color: theme.palette.accent }}>§ {label}</span>
        <div className="flex-1 h-px" style={{ background: `${theme.palette.accent}44` }} />
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// Registry (slug-keyed accessor for ThemedProjectPage)
// --------------------------------------------------------------------------

type MotifKey =
  | 'soil-sprout' | 'leaf-fall'
  | 'chalk-stroke' | 'receipt-roll'
  | 'breathing-glow' | 'watercolor'
  | 'departure-board' | 'route-draw'
  | 'terminal-boot' | 'threat-radar' | 'guardian-halo'
  | 'star-constellation' | 'cosmic-ray'
  | 'prompt-typing' | 'path-branch' | 'chat-bubble'
  | 'color-block' | 'marquee-strip'
  | 'gold-sweep' | 'sparkle-edge'
  | 'candlestick' | 'ticker-strip'
  | 'memory-echo'
  | 'soft-reveal' | 'key-card'
  | 'phone-otp'
  | 'cloud-grid'
  | 'field-grid'
  | 'capsule-pulse'
  | 'stamp-drop';

export type { MotifKey };

const HERO_REGISTRY: Record<MotifKey, (p: { theme: ProjectTheme }) => ReactElement> = {
  'soil-sprout': SoilSproutHero,
  'leaf-fall': SoilSproutHero, // fallback hero variant
  'chalk-stroke': ChalkStrokeHero,
  'receipt-roll': ChalkStrokeHero,
  'breathing-glow': BreathingGlowHero,
  'watercolor': BreathingGlowHero,
  'departure-board': DepartureBoardHero,
  'route-draw': DepartureBoardHero,
  'terminal-boot': TerminalBootHero,
  'threat-radar': TerminalBootHero,
  'guardian-halo': GuardianHaloHero,
  'star-constellation': StarConstellationHero,
  'cosmic-ray': StarConstellationHero,
  'prompt-typing': PromptTypingHero,
  'path-branch': PathBranchHero,
  'chat-bubble': PromptTypingHero,
  'color-block': ColorBlockHero,
  'marquee-strip': ColorBlockHero,
  'gold-sweep': GoldSweepHero,
  'sparkle-edge': GoldSweepHero,
  'candlestick': CandlestickHero,
  'ticker-strip': CandlestickHero,
  'memory-echo': MemoryEchoHero,
  'soft-reveal': SoftRevealHero,
  'key-card': SoftRevealHero,
  'phone-otp': PhoneOTPHero,
  'cloud-grid': CloudGridHero,
  'field-grid': FieldGridHero,
  'capsule-pulse': CapsulePulseHero,
  'stamp-drop': StampDropHero,
};

const MID_REGISTRY: Record<MotifKey, (p: { theme: ProjectTheme }) => ReactElement> = {
  'soil-sprout': LeafFallDivider,
  'leaf-fall': LeafFallDivider,
  'chalk-stroke': (p) => <SectionRule theme={p.theme} label="LESSON" />,
  'receipt-roll': ReceiptRollDivider,
  'breathing-glow': WatercolorDivider,
  'watercolor': WatercolorDivider,
  'departure-board': RouteDrawDivider,
  'route-draw': RouteDrawDivider,
  'terminal-boot': ThreatRadarDivider,
  'threat-radar': ThreatRadarDivider,
  'guardian-halo': ThreatRadarDivider,
  'star-constellation': CosmicRayDivider,
  'cosmic-ray': CosmicRayDivider,
  'prompt-typing': ChatBubbleDivider,
  'path-branch': ChatBubbleDivider,
  'chat-bubble': ChatBubbleDivider,
  'color-block': MarqueeStripDivider,
  'marquee-strip': MarqueeStripDivider,
  'gold-sweep': SparkleEdgeDivider,
  'sparkle-edge': SparkleEdgeDivider,
  'candlestick': TickerStripDivider,
  'ticker-strip': TickerStripDivider,
  'memory-echo': (p) => <SectionRule theme={p.theme} label="REMEMBERING" />,
  'soft-reveal': KeyCardDivider,
  'key-card': KeyCardDivider,
  'phone-otp': (p) => <SectionRule theme={p.theme} label="VERIFY" />,
  'cloud-grid': (p) => <SectionRule theme={p.theme} label="PROVISION" />,
  'field-grid': (p) => <SectionRule theme={p.theme} label="SURVEY" />,
  'capsule-pulse': (p) => <SectionRule theme={p.theme} label="DOSE" />,
  'stamp-drop': (p) => <SectionRule theme={p.theme} label="FILED" />,
};

export function HeroMotif({ motif, theme }: { motif: MotifKey; theme: ProjectTheme }) {
  const Cmp = HERO_REGISTRY[motif] ?? SoilSproutHero;
  return <Cmp theme={theme} />;
}

export function MidMotif({ motif, theme }: { motif: MotifKey; theme: ProjectTheme }) {
  const Cmp = MID_REGISTRY[motif] ?? ((p: { theme: ProjectTheme }) => <SectionRule theme={p.theme} label="THE WORK" />);
  return <Cmp theme={theme} />;
}
