'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { ProjectTheme } from '@/lib/project-themes';

type Props = { theme: ProjectTheme };

const EASE = [0.22, 0.61, 0.36, 1] as const;

export default function HeroThemed({ theme }: Props) {
  const motif = theme.signatureMotif;
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '92vh',
        background: theme.palette.bg,
        color: theme.palette.text,
      }}
    >
      {motif === 'parallax-photo' && <ParallaxPhotoBackdrop theme={theme} />}
      {motif === 'horizontal-reveal' && <HorizontalRevealBackdrop theme={theme} />}
      {motif === 'pulse-glow' && <PulseGlowBackdrop theme={theme} />}
      {motif === 'scroll-zoom' && <ScrollZoomBackdrop theme={theme} />}
      {motif === 'image-stack' && <ImageStackBackdrop theme={theme} />}
      {/* word-stagger has no backdrop; the staggered title carries it */}

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

        {motif === 'word-stagger' ? (
          <StaggeredTitle title={theme.title} accent={theme.palette.accent} />
        ) : (
          <motion.h1
            className="font-display leading-[0.92] tracking-tight"
            style={{
              fontSize: 'clamp(3rem, 11vw, 9.5rem)',
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.18, ease: EASE }}
          >
            {theme.title}
          </motion.h1>
        )}

        <motion.p
          className="font-display italic mt-6 md:mt-8 max-w-3xl"
          style={{
            color: theme.palette.text,
            fontSize: 'clamp(1.1rem, 2.2vw, 1.85rem)',
            opacity: 0.85,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: EASE }}
        >
          {theme.subtitle}
        </motion.p>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------
// Word stagger title
// ----------------------------------------------------------------

function StaggeredTitle({ title, accent }: { title: string; accent: string }) {
  const reduce = useReducedMotion();
  const letters = title.split('');
  return (
    <h1
      className="font-display leading-[0.92] tracking-tight"
      style={{ fontSize: 'clamp(3rem, 11vw, 9.5rem)' }}
      aria-label={title}
    >
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          style={{ color: i % 7 === 3 ? accent : 'inherit' }}
          initial={reduce ? false : { opacity: 0, y: 32, rotate: -3 }}
          animate={reduce ? undefined : { opacity: 1, y: 0, rotate: 0 }}
          transition={{
            duration: 0.55,
            delay: 0.18 + i * 0.035,
            ease: EASE,
          }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </h1>
  );
}

// ----------------------------------------------------------------
// Parallax photo
// ----------------------------------------------------------------

function ParallaxPhotoBackdrop({ theme }: { theme: ProjectTheme }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 220]);

  return (
    <div ref={ref} className="absolute inset-0 z-0" aria-hidden>
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y }}
      >
        <Image
          src={theme.heroImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ opacity: 0.45 }}
        />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${theme.palette.bg}cc 0%, ${theme.palette.bg}66 40%, ${theme.palette.bg}f0 100%)`,
        }}
      />
    </div>
  );
}

// ----------------------------------------------------------------
// Horizontal reveal — clip-path side photo
// ----------------------------------------------------------------

function HorizontalRevealBackdrop({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <div className="absolute inset-0 z-0" aria-hidden>
      <motion.div
        className="absolute inset-y-0 right-0 w-full md:w-[58%]"
        initial={reduce ? false : { clipPath: 'inset(0 0 0 100%)' }}
        animate={reduce ? undefined : { clipPath: 'inset(0 0 0 0%)' }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
      >
        <Image
          src={theme.heroImage}
          alt=""
          fill
          sizes="(min-width: 768px) 58vw, 100vw"
          className="object-cover"
          style={{ opacity: 0.55 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${theme.palette.bg} 0%, ${theme.palette.bg}00 35%, ${theme.palette.bg}00 65%, ${theme.palette.bg}cc 100%)`,
          }}
        />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${theme.palette.bg}80 0%, ${theme.palette.bg}cc 100%)`,
        }}
      />
    </div>
  );
}

// ----------------------------------------------------------------
// Pulse glow — central radial bloom that pulses
// ----------------------------------------------------------------

function PulseGlowBackdrop({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <Image
        src={theme.heroImage}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{ opacity: 0.18 }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 w-[80vw] h-[80vw] max-w-[1100px] max-h-[1100px]"
        style={{
          translateX: '-50%',
          translateY: '-50%',
          background: `radial-gradient(circle, ${theme.palette.accent}55 0%, ${theme.palette.accent}11 35%, transparent 65%)`,
          mixBlendMode: 'screen',
        }}
        initial={reduce ? false : { opacity: 0.55, scale: 0.92 }}
        animate={reduce ? undefined : { opacity: [0.45, 0.75, 0.45], scale: [0.92, 1.04, 0.92] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {theme.palette.accent2 ? (
        <motion.div
          className="absolute left-[60%] top-[35%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px]"
          style={{
            background: `radial-gradient(circle, ${theme.palette.accent2}33 0%, transparent 60%)`,
            mixBlendMode: 'screen',
          }}
          initial={reduce ? false : { opacity: 0.4, scale: 1 }}
          animate={reduce ? undefined : { opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        />
      ) : null}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${theme.palette.bg}88 0%, ${theme.palette.bg}f0 100%)`,
        }}
      />
    </div>
  );
}

// ----------------------------------------------------------------
// Scroll zoom — image starts small, scales to full
// ----------------------------------------------------------------

function ScrollZoomBackdrop({ theme }: { theme: ProjectTheme }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.25, 0.5, 0.2]);

  return (
    <div ref={ref} className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute inset-0"
        style={reduce ? { opacity: 0.4 } : { scale, opacity }}
      >
        <Image
          src={theme.heroImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${theme.palette.bg}cc 0%, ${theme.palette.bg}99 40%, ${theme.palette.bg}f0 100%)`,
        }}
      />
    </div>
  );
}

// ----------------------------------------------------------------
// Image stack
// ----------------------------------------------------------------

function ImageStackBackdrop({ theme }: { theme: ProjectTheme }) {
  const reduce = useReducedMotion();
  const offsets = [
    { x: '-12%', y: '6%', rot: -6 },
    { x: '0%', y: '-2%', rot: 0 },
    { x: '12%', y: '4%', rot: 5 },
  ];
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${theme.palette.bgMid} 0%, ${theme.palette.bg} 100%)`,
        }}
      />
      <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[55%] hidden md:block">
        {offsets.map((o, i) => (
          <motion.div
            key={i}
            className="absolute top-0 left-0 w-full aspect-[4/3] rounded-md overflow-hidden border"
            style={{
              borderColor: `${theme.palette.accent}55`,
              transform: `translate(${o.x}, ${o.y}) rotate(${o.rot}deg)`,
            }}
            initial={reduce ? false : { opacity: 0, y: 60, rotate: 0 }}
            animate={reduce ? undefined : { opacity: 1, y: 0, rotate: o.rot }}
            transition={{ duration: 0.85, delay: 0.15 + i * 0.18, ease: EASE }}
          >
            <Image
              src={theme.heroImage}
              alt=""
              fill
              sizes="55vw"
              className="object-cover"
              style={{ opacity: 0.7 }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
