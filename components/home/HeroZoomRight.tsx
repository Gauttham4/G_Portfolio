'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import HeroVideo from './HeroVideo';
import { REPLAY_HERO } from '@/lib/media-events';

/**
 * HERO "zoom right": the seafront bench photo, zoomed in on the left, all the words on the right.
 * The shading only touches the right side (where the text is), never the subject.
 * Tune the framing with ZOOM / ORIGIN / POS below.
 */
const ZOOM = 1.42;
const ORIGIN = '33% 53%'; // the point the zoom grows from: keep it on the subject
const POS = '50% 47%';

export default function HeroZoomRight() {
  const reduced = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  return (
    <section data-hero className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <Image
          src="/hero/gauttham-bench.jpg"
          alt="Gauttham R. sitting on a seafront bench"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="hz-img object-cover"
          style={{ objectPosition: POS, transform: `scale(${ZOOM})`, transformOrigin: ORIGIN }}
        />
      </div>
      {/* shade the TEXT side only (right + bottom), never the subject */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-l from-ink/92 via-ink/60 via-40% to-transparent md:from-ink/95" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/85 to-transparent md:hidden" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/55 to-transparent" />

      <div className="relative z-10 flex h-full items-end justify-start px-5 pb-20 sm:px-8 md:items-center md:justify-end md:px-12 md:pb-0">
        <div className="w-full text-left md:max-w-[46%] md:text-right">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber/85"
          >
            § Portfolio · Puducherry → Middlesbrough · 2026
          </motion.p>

          <h1
            aria-label="Gauttham R."
            className="mt-4 whitespace-nowrap font-display font-normal leading-[0.9] tracking-[-0.04em] text-paper [font-size:clamp(2.25rem,min(14.2vw,16vh),7rem)] md:[font-size:min(7.4vw,15vh)]"
          >
            {Array.from('Gauttham R').map((c, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={reduced ? false : { y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ delay: 0.35 + i * 0.04, duration: 0.9, ease }}
                style={{ whiteSpace: 'pre' }}
              >
                {c}
              </motion.span>
            ))}
            <motion.span
              className="inline-block italic text-amber"
              initial={reduced ? false : { y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.9, ease }}
            >
              .
            </motion.span>
          </h1>

          <p className="mt-5 font-display text-xl italic leading-[1.1] text-paper md:text-3xl">
            Researcher. Builder. <span className="text-amber">Engineer.</span>
          </p>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            className="mt-5 max-w-[30rem] font-sans text-sm leading-relaxed text-paper-dim md:ml-auto md:text-base"
          >
            Head of Research at THEELABS. 31 shipped projects across AI, edtech, finance, safety, and field operations. MSc Digital Forensics, Teesside University.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-7 flex flex-wrap items-center gap-3 md:justify-end"
          >
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(REPLAY_HERO))}
              className="inline-flex items-center gap-3 border border-amber/70 bg-amber/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-amber transition-colors hover:bg-amber hover:text-ink"
            >
              <span aria-hidden>▶</span> Watch the reel
            </button>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-paper-soft bg-ink/40 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-paper-dim transition-colors hover:border-amber/60 hover:text-amber"
            >
              Read the case file <span aria-hidden>→</span>
            </Link>
          </motion.div>
        </div>
      </div>

      <HeroVideo />
    </section>
  );
}
