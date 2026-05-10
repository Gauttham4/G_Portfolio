'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import AnimatedHeading from '@/components/motion/AnimatedHeading';

export default function AboutCinematicHero() {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 140]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.06, 1.18]);

  return (
    <section
      ref={ref}
      data-hero
      className="relative h-[92vh] min-h-[600px] w-full overflow-hidden bg-ink"
    >
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <Image
          src="/about/portrait-hero.jpg"
          alt="Gauttham R."
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: '50% 22%' }}
        />
      </motion.div>

      {/* Ink gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/45 to-ink" />

      {/* Subtle grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
        }}
      />

      {/* Foreground */}
      <div className="absolute inset-0 flex flex-col items-start justify-end px-4 sm:px-6 pb-16 sm:pb-20 md:px-12 md:pb-24">
        <motion.p
          className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          § About — The case file
        </motion.p>

        <AnimatedHeading
          as="h1"
          mode="letters"
          text="I'm Gauttham R."
          delay={0.3}
          className="mt-5 font-display text-4xl sm:text-5xl leading-[0.95] tracking-tight text-paper md:text-7xl lg:text-[8.5rem]"
        />

        <AnimatedHeading
          as="h2"
          mode="words"
          text="An engineer who finishes."
          delay={0.6}
          className="mt-2 font-display text-3xl sm:text-4xl italic leading-[1.0] tracking-tight text-amber md:text-6xl lg:text-7xl"
        />

        <motion.p
          className="mt-7 max-w-2xl font-display text-lg italic leading-relaxed text-paper-dim md:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
        >
          From a paper-and-pen tuition fee book to a self-evolving multi-agent AI — twenty-eight ships
          across AI, edtech, finance, safety, and field operations.
        </motion.p>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="pointer-events-none absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-[0.4em] text-paper-dim md:right-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        scroll · the case opens ↓
      </motion.div>
    </section>
  );
}
