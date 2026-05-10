'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const GALLERY_INDICES = [1, 2, 3, 4, 5, 6];

/**
 * Scroll-driven cinematic slideshow for project hero sections.
 *
 * - Cycles through `thumb.jpg` + `gallery-1..6.jpg` for the slug, cross-fading every interval.
 * - As the parent scrolls past, the whole slideshow scales 1 -> 1.12, drifts -8% Y, fades to 0.5.
 *   (Same scroll-video feel as the main HeroStatement portrait.)
 * - Reduced-motion: holds the first frame, no auto-advance, no scroll transforms.
 */
export default function HeroSlideshow({
  slug,
  thumb = true,
  intervalMs = 4500,
  className = '',
}: {
  slug: string;
  thumb?: boolean;
  intervalMs?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const sources = [
    ...(thumb ? [`/work/${slug}/thumb.jpg`] : []),
    ...GALLERY_INDICES.map((n) => `/work/${slug}/gallery-${n}.jpg`),
  ];

  // Scroll progress measured against this slideshow's parent (hero section).
  // We attach the ref to the slideshow container which fills its hero parent (absolute inset-0),
  // so its scroll offset matches the hero's bounds.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Mirror the homepage HeroStatement scroll behaviour: zoom + drift + fade as user scrolls past.
  const photoScale   = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.12]);
  const photoY       = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-8%']);
  const photoOpacity = useTransform(scrollYProgress, [0, 0.7, 1], reduce ? [1, 1, 1] : [1, 0.85, 0.45]);

  // Auto-advance frames on a timer.
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % sources.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [reduce, intervalMs, sources.length]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {/* Cross-fading slideshow with scroll-driven cinematic transform on the wrapper */}
      <motion.div
        style={{ scale: photoScale, y: photoY, opacity: photoOpacity }}
        className="absolute inset-0 will-change-transform"
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1.0 }}
            exit={{ opacity: 0, scale: 1.0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={sources[idx]}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              priority={idx === 0}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Dimming overlays for legibility — these stay fixed, not scroll-tied.
          Tuned so the underlying photos stay visible behind type. */}
      <div className="absolute inset-0 bg-[var(--page-bg,_#0A0A0A)]/30" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.25) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, transparent 45%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Subtle film grain over the slideshow — keeps it cinematic */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.97 0 0 0 0 0.97 0 0 0 0 0.97 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Frame indicator: tiny dots showing which slide is active (top-right) */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-1.5 z-10">
        {sources.map((_, i) => (
          <span
            key={i}
            className="block h-[2px] w-6 transition-colors duration-500"
            style={{ backgroundColor: i === idx ? 'var(--page-accent, #E8B863)' : 'rgba(255,255,255,0.18)' }}
          />
        ))}
      </div>
    </div>
  );
}
