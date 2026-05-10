'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

export default function HeroStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

  // Photo subtly zooms + drifts up as user scrolls past
  const photoScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1, 1.12]);
  const photoY     = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['0%', '-8%']);
  const photoOpacity = useTransform(scrollYProgress, [0, 0.8, 1], reduced ? [1, 1, 1] : [1, 0.85, 0.5]);
  const titleY    = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['0%', '-30%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7, 1], reduced ? [1, 1, 1] : [1, 0.85, 0.2]);

  return (
    <section ref={sectionRef} className="relative w-full h-screen min-h-[640px] bg-ink overflow-hidden">
      {/* Full-bleed portrait */}
      <motion.div
        style={{ scale: photoScale, y: photoY, opacity: photoOpacity }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src="/hero/gauttham-portrait.jpg"
          alt="Gauttham R."
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          style={{ filter: 'contrast(1.08) saturate(1.05) brightness(1.0)' }}
        />
      </motion.div>

      {/* Cinematic overlay treatments */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-ink/60 via-transparent to-ink/20" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-ink/70 via-transparent to-ink/30" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_30%_60%,transparent_0%,var(--color-ink)_95%)]" />
      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.97 0 0 0 0 0.97 0 0 0 0 0.97 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Top-right: caption pill (over the photo, not in header bar) */}
      <div className="absolute top-6 right-6 md:top-8 md:right-12 z-10">
        <p className="font-mono uppercase text-paper-dim text-[10px] tracking-[0.3em] bg-ink/40 backdrop-blur-sm px-3 py-1 border border-paper-soft rounded-sm">
          PUDUCHERRY · 2026
        </p>
      </div>

      {/* Top-left: small kicker (NOT logo — site header has the logo) */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute top-24 left-6 md:top-28 md:left-12 z-10 max-w-[12rem]"
      >
        <p className="font-mono uppercase text-amber/80 text-[10px] tracking-[0.3em] mb-2">§ PORTFOLIO</p>
        <p className="font-display italic text-paper-dim text-base md:text-lg leading-snug">A solo studio in Puducherry.</p>
      </motion.div>

      {/* MASSIVE name overlay — bottom-anchored, left-aligned */}
      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="absolute inset-0 flex items-end pb-16 md:pb-24 px-6 md:px-12 z-10"
      >
        <div className="w-full max-w-[1700px]">
          <h1
            aria-label="Gauttham R."
            className="font-display font-normal text-paper leading-[0.84] tracking-[-0.04em] mb-6 md:mb-8"
            style={{ fontSize: 'clamp(4rem, 16vw, 18rem)' }}
          >
            {Array.from('Gauttham R').map((c, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={reduced ? false : { y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.04, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block', whiteSpace: 'pre' }}
              >
                {c}
              </motion.span>
            ))}
            <motion.span
              className="inline-block italic text-amber"
              initial={reduced ? false : { y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ delay: 0.5 + 10 * 0.04, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              .
            </motion.span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end max-w-[1700px]">
            <p className="md:col-span-6 font-display italic text-paper text-xl md:text-3xl lg:text-4xl leading-[1.1]">
              {['Engineer.', 'Builder.', 'Researcher.'].map((word, i) => (
                <span key={word} className="inline-block overflow-hidden align-bottom mr-3">
                  <motion.span
                    className={`inline-block ${word === 'Researcher.' ? 'text-amber' : ''}`}
                    initial={reduced ? false : { y: '110%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{ delay: 1.1 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </p>

            <p className="md:col-span-5 md:col-start-8 font-sans text-paper-dim text-sm md:text-base leading-relaxed">
              {'Engineering at THEELABS. 28 shipped projects across AI, edtech, finance, safety, and field operations. Incoming MS — University of Portsmouth.'.split(/(\s+)/).map((tok, i) => {
                if (/^\s+$/.test(tok)) return <span key={i}>{tok}</span>;
                return (
                  <span key={i} className="inline-block overflow-hidden align-bottom">
                    <motion.span
                      className="inline-block"
                      initial={reduced ? false : { y: '110%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      transition={{ delay: 1.4 + i * 0.018, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {tok}
                    </motion.span>
                  </span>
                );
              })}
            </p>
          </div>

          {/* Scroll cue — letter cascade */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1, duration: 0.5 }}
            className="mt-8 md:mt-12 flex items-center gap-3"
          >
            <span className="font-mono uppercase text-amber/80 text-[10px] tracking-[0.3em] inline-flex">
              {Array.from('↓ ROLL THE REEL').map((c, i) => (
                <motion.span
                  key={i}
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2 + i * 0.025, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'inline-block', whiteSpace: 'pre' }}
                >
                  {c}
                </motion.span>
              ))}
            </span>
            <motion.span
              className="h-px w-12 bg-amber/50 origin-left"
              initial={reduced ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 2.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
