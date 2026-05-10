'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { easing } from '@/lib/motion-tokens';

const CLIPS = [
  '/reels/showreel-01.mp4',
  '/reels/showreel-02.mp4',
  '/reels/showreel-03.mp4',
  '/reels/showreel-04.mp4',
];
const TOTAL = CLIPS.length;

export default function ShowreelBand() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const advance = () => setIndex((i) => (i + 1) % TOTAL);
  const counter = `${String(index + 1).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}`;

  return (
    <section
      data-act="REEL"
      aria-label="Showreel"
      className="relative h-screen w-full overflow-hidden bg-ink"
    >
      {/* Video / poster crossfade layer */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easing.suitEject }}
            className="absolute inset-0"
          >
            {reduce ? (
              <div
                className="absolute inset-0 bg-ink"
                aria-hidden
                style={{
                  backgroundImage: `url(${CLIPS[index].replace('.mp4', '-poster.jpg')})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.6,
                }}
              />
            ) : (
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover opacity-60"
                src={CLIPS[index]}
                autoPlay
                muted
                loop={false}
                playsInline
                preload="metadata"
                onEnded={advance}
                aria-hidden
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* top-down depth gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, var(--color-ink) 0%, rgba(10,10,10,0.3) 50%, var(--color-ink) 100%)',
        }}
      />

      {/* Top-left: amber rule + counter */}
      <div className="absolute left-8 top-8 z-10 flex flex-col gap-2">
        <div className="h-px w-16 bg-amber" />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
          {counter}
        </span>
      </div>

      {/* Top-right: now playing */}
      <div className="absolute right-8 top-8 z-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
          ▶ Now playing — Tunnel · 04:21
        </span>
      </div>

      {/* Center stack */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center px-8 text-center md:px-20">
        <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-amber">
          REEL · 2026 · Selected work
        </p>
        <h2
          className="font-display text-paper"
          style={{
            fontSize: 'clamp(3rem, 9vw, 9rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            fontWeight: 400,
            textShadow: '0 2px 24px rgba(0,0,0,0.55)',
          }}
        >
          The reel.
        </h2>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-paper-dim">
          Five acts · Twenty-eight projects · One builder
        </p>
      </div>

      {/* Bottom-left: continue cue */}
      <div className="absolute bottom-8 left-8 z-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
          (↓) Continue to Act 01
        </span>
      </div>

      {/* Bottom-right: next fragment */}
      {!reduce && (
        <div className="absolute bottom-8 right-8 z-10">
          <button
            type="button"
            onClick={advance}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber transition-opacity hover:opacity-70"
          >
            ↻ Next fragment
          </button>
        </div>
      )}
    </section>
  );
}
