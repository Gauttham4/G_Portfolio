'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import HeroVideo from './HeroVideo';
import { REPLAY_HERO } from '@/lib/media-events';

/**
 * HERO: split layout. Big name + story on the left, the portrait in a sharp framed card on the right.
 * Nothing is ever laid over the face, and the photo is shown near its true size (crisp on every screen).
 *
 * Pick the photo: change DEFAULT_PHOTO below (one word), or preview any of them live with  /?photo=<key>
 */
const DEFAULT_PHOTO = 'uk';
const PHOTOS: Record<string, { src: string; pos: string; label: string }> = {
  uk: { src: '/hero/gauttham-uk.jpg', pos: '50% 18%', label: 'Bench portrait' },
  campus: { src: '/hero/gauttham-campus.jpg', pos: '50% 30%', label: 'Teesside campus' },
  sea: { src: '/hero/gauttham-sea.jpg', pos: '50% 36%', label: 'By the waves' },
  original: { src: '/hero/gauttham-portrait.jpg', pos: '70% 30%', label: 'Original hero' },
  hero: { src: '/about/portrait-hero.jpg', pos: '50% 25%', label: 'Studio' },
  pool: { src: '/about/portrait-pool.jpg', pos: '50% 30%', label: 'Poolside' },
  pool2: { src: '/about/portrait-pool-2.jpg', pos: '50% 30%', label: 'Poolside 2' },
  cafe: { src: '/about/portrait-cafe.jpg', pos: '50% 30%', label: 'Cafe' },
  editorial: { src: '/about/portrait-editorial.jpg', pos: '50% 25%', label: 'Editorial' },
  walking: { src: '/about/portrait-walking.jpg', pos: '50% 25%', label: 'Walking' },
};

export default function HeroSplit() {
  const reduced = useReducedMotion();
  const [photoKey, setPhotoKey] = useState(DEFAULT_PHOTO);

  // live preview helpers: /?photo=campus  and  /?hero=full
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const p = q.get('photo');
    if (p && PHOTOS[p]) setPhotoKey(p);
  }, []);

  const photo = PHOTOS[photoKey] ?? PHOTOS[DEFAULT_PHOTO];
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section data-hero className="relative w-full min-h-[100svh] overflow-hidden bg-ink">
      {/* quiet backdrop: soft colour pools + a faint grid (no blur filters, no blend modes) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 60% at 82% 38%, rgba(232,184,99,0.16), transparent 70%), radial-gradient(45% 50% at 8% 95%, rgba(122,157,207,0.12), transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(250,250,250,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(250,250,250,0.035) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse at 60% 40%, #000 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 60% 40%, #000 20%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto grid min-h-[100svh] w-full max-w-[1500px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-28 sm:px-8 md:grid-cols-[1.3fr_1fr] md:gap-8 md:px-12 md:pt-24 lg:gap-16">
        {/* ---------- text column ---------- */}
        <div className="order-2 md:order-1">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber/80"
          >
            § Portfolio · Puducherry → Middlesbrough · 2026
          </motion.p>

          <h1
            aria-label="Gauttham R."
            className="mt-5 whitespace-nowrap font-display font-normal leading-[0.9] tracking-[-0.04em] text-paper"
            style={{ fontSize: 'clamp(2.4rem, min(14vw, 17vh), 11rem)' }}
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
              transition={{ delay: 0.35 + 10 * 0.04, duration: 0.9, ease }}
            >
              .
            </motion.span>
          </h1>

          <p className="mt-6 font-display text-2xl italic leading-[1.1] text-paper md:text-4xl">
            {['Engineer.', 'Builder.', 'Researcher.'].map((word, i) => (
              <span key={word} className="mr-3 inline-block overflow-hidden align-bottom">
                <motion.span
                  className={`inline-block ${word === 'Researcher.' ? 'text-amber' : ''}`}
                  initial={reduced ? false : { y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ delay: 0.95 + i * 0.12, duration: 0.7, ease }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </p>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.7 }}
            className="mt-6 max-w-[34rem] font-sans text-sm leading-relaxed text-paper-dim md:text-base"
          >
            Head of Research at THEELABS. 31 shipped projects across AI, edtech, finance, safety, and field operations. MSc Digital Forensics, Teesside University.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-3"
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
              className="inline-flex items-center gap-2 border border-paper-soft px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-paper-dim transition-colors hover:border-amber/60 hover:text-amber"
            >
              Read the case file <span aria-hidden>→</span>
            </Link>
          </motion.div>

          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1, duration: 0.6 }}
            className="mt-10 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-amber/70 md:block"
          >
            ↓ Scroll to roll the reel
          </motion.p>
        </div>

        {/* ---------- portrait card ---------- */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 1, ease }}
          className="order-1 mx-auto w-[74vw] max-w-[440px] md:order-2 md:ml-auto md:mr-0 md:w-full md:max-w-[460px]"
        >
          <div className="relative">
            {/* slow rotating rings: pure CSS transform, cheap */}
            <div
              aria-hidden
              className="absolute -inset-[7%] rounded-full border border-amber/30"
              style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent', animation: 'heroRing 38s linear infinite' }}
            />
            <div
              aria-hidden
              className="absolute -inset-[13%] rounded-full border border-dashed border-paper/10"
              style={{ animation: 'heroRing 60s linear infinite reverse' }}
            />
            <div className="relative aspect-[4/5] overflow-hidden border border-amber/40 bg-ink shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
              <Image
                key={photo.src}
                src={photo.src}
                alt="Portrait of Gauttham R."
                fill
                priority
                sizes="(min-width: 768px) 460px, 74vw"
                className="object-cover"
                style={{ objectPosition: photo.pos }}
              />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink/70 to-transparent" />
              <span className="absolute bottom-3 left-4 font-mono text-[9px] uppercase tracking-[0.3em] text-paper">
                Subject: G · online
              </span>
            </div>
            {/* corner brackets */}
            {(
              [
                'left-[-6px] top-[-6px] border-l border-t',
                'right-[-6px] top-[-6px] border-r border-t',
                'left-[-6px] bottom-[-6px] border-l border-b',
                'right-[-6px] bottom-[-6px] border-r border-b',
              ] as const
            ).map((c) => (
              <span key={c} aria-hidden className={`absolute h-5 w-5 border-amber ${c}`} />
            ))}
          </div>
        </motion.div>
      </div>

      <HeroVideo />
    </section>
  );
}
