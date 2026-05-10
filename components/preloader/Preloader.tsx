'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

const PRELOAD_FLAG = '__studio2026_preloaded';

function shouldShowPreloader(): boolean {
  if (typeof window === 'undefined') return false;

  let navType: string | undefined;
  try {
    const navEntries = performance.getEntriesByType(
      'navigation'
    ) as PerformanceNavigationTiming[];
    navType = navEntries[0]?.type;
  } catch {
    // ignore
  }

  // ALWAYS show on hard reload (Ctrl+R / refresh) — ignore session flag.
  if (navType === 'reload') return true;

  // NEVER show on browser back/forward.
  if (navType === 'back_forward') return false;

  // For internal Next.js client-side nav, the layout's Preloader doesn't actually
  // re-mount (it lives in app/layout.tsx). But if it does on some path, the
  // session flag prevents re-running.
  try {
    if (window.sessionStorage.getItem(PRELOAD_FLAG)) return false;
  } catch {
    // sessionStorage blocked — fall through
  }

  // First navigate to the site, or unknown navType: show.
  if (navType === 'navigate') return true;

  // Final fallback for older browsers: show only if there's no referrer
  // pointing back to this host.
  return !document.referrer || !document.referrer.includes(window.location.host);
}

const STATUS_LINES: Array<{ at: number; label: string }> = [
  { at: 35, label: 'ASSETS LOADED' },
  { at: 65, label: 'MOTIONS COMPILED' },
  { at: 95, label: 'STUDIO ONLINE' },
];

const BOOT_LINES = [
  '> studio.gauttham.r — boot',
  '> 28 projects indexed',
  '> 5 hackathons logged',
  '> IJIRE paper · verified',
  '> THEELABS · engineer · 2026',
  '> Portsmouth · MS · incoming',
  '> ready.',
];

const NAME = 'GAUTTHAM R';

const MARQUEE_TAGS = ['ENGINEER', 'BUILDER', 'RESEARCHER', 'STUDIO 2026'];

const COLLAGE_PORTRAITS = [
  '/about/portrait-hero.jpg',
  '/about/portrait-pool.jpg',
  '/about/portrait-cafe.jpg',
];
const COLLAGE_INTERVAL_MS = 1200;

function FlipDigit({ value }: { value: string }) {
  return (
    <span className="relative inline-block w-[0.62em] overflow-hidden align-baseline">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="inline-block"
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Preloader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState<boolean | null>(null);
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [bootIdx, setBootIdx] = useState(0);
  const [bootChars, setBootChars] = useState(0);
  const [collageIdx, setCollageIdx] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Decide on mount (avoid SSR hydration mismatch)
  useEffect(() => {
    const next = shouldShowPreloader();
    setShow(next);
    if (next) {
      try {
        window.sessionStorage.setItem(PRELOAD_FLAG, '1');
      } catch {
        /* ignore */
      }
    }
  }, []);

  // Main timeline: progress, ready flash, curtain exit
  useEffect(() => {
    if (show !== true) return;
    if (typeof window === 'undefined') return;

    document.body.style.overflow = 'hidden';

    const COUNT_MS = reduce ? 0 : 2600;
    const READY_MS = reduce ? 0 : 280;
    const SPLIT_MS = reduce ? 200 : 700;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / Math.max(1, COUNT_MS));
      const eased = 1 - Math.pow(1 - t, 1.6);
      setPct(Math.round(eased * 100));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPct(100);
        setReady(true);
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => {
            document.body.style.overflow = '';
            setShow(false);
          }, SPLIT_MS);
        }, READY_MS);
      }
    };

    if (reduce) {
      setPct(100);
      setReady(true);
      setTimeout(() => {
        setExiting(true);
        setTimeout(() => {
          document.body.style.overflow = '';
          setShow(false);
        }, SPLIT_MS);
      }, READY_MS);
    } else {
      rafRef.current = requestAnimationFrame(tick);
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        setPct(100);
        setReady(true);
        setExiting(true);
        setTimeout(() => {
          document.body.style.overflow = '';
          setShow(false);
        }, 200);
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [show, reduce]);

  // Terminal boot sequencer — single RAF ticker, 25ms/char, 200ms gap between lines
  useEffect(() => {
    if (show !== true || reduce) return;

    const CHAR_MS = 25;
    const LINE_GAP_MS = 200;
    let raf = 0;
    let cancelled = false;
    const startTime = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - startTime;
      let consumed = 0;
      for (let i = 0; i < BOOT_LINES.length; i++) {
        const lineLen = BOOT_LINES[i].length;
        const lineEnd = consumed + lineLen * CHAR_MS;
        if (elapsed < lineEnd) {
          const charsTyped = Math.floor((elapsed - consumed) / CHAR_MS) + 1;
          setBootIdx(i);
          setBootChars(Math.min(lineLen, charsTyped));
          raf = requestAnimationFrame(tick);
          return;
        }
        consumed = lineEnd + LINE_GAP_MS;
      }
      // All lines done
      setBootIdx(BOOT_LINES.length - 1);
      setBootChars(BOOT_LINES[BOOT_LINES.length - 1].length);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [show, reduce]);

  // Portrait collage cycler
  useEffect(() => {
    if (show !== true || reduce) return;
    const id = setInterval(() => {
      setCollageIdx((i) => (i + 1) % COLLAGE_PORTRAITS.length);
    }, COLLAGE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [show, reduce]);

  const bootDone = bootIdx >= BOOT_LINES.length - 1 && bootChars >= BOOT_LINES[BOOT_LINES.length - 1].length;

  // Build name letter array memoised
  const nameLetters = useMemo(() => NAME.split(''), []);

  if (show === null || show === false) return null;

  // Reduced-motion path: a quick fade
  if (reduce) {
    return (
      <AnimatePresence>
        {show && (
          <motion.div
            key="preloader-reduce"
            className="fixed inset-0 z-[100] bg-ink"
            initial={{ opacity: 1 }}
            animate={{ opacity: exiting ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    );
  }

  const splitEase = [0.83, 0, 0.17, 1] as const;
  const tens = String(pct).padStart(2, '0').charAt(0);
  const ones = String(pct).padStart(2, '0').charAt(1);

  // Marquee strip — duplicated for seamless loop
  const marqueeStrip = (
    <span className="flex shrink-0 items-center gap-6 pr-6">
      {MARQUEE_TAGS.map((t) => (
        <span key={t} className="flex items-center gap-6">
          <span>{t}</span>
          <span className="text-amber">·</span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none"
      aria-hidden={exiting ? 'true' : undefined}
    >
      {/* === Backdrop layer (does NOT split — sits behind slabs) === */}
      <div className="absolute inset-0 overflow-hidden bg-ink">
        {/* Blurred portrait collage — cross-fades through 3 sources */}
        {reduce ? (
          <div className="absolute inset-0">
            <Image
              src={COLLAGE_PORTRAITS[0]}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ filter: 'blur(40px) brightness(0.7)', opacity: 0.18, transform: 'scale(1.1)' }}
              aria-hidden
            />
          </div>
        ) : (
          <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence mode="sync">
              <motion.div
                key={collageIdx}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 0.18, scale: 1.1 }}
                exit={{ opacity: 0, scale: 1.0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={COLLAGE_PORTRAITS[collageIdx]}
                  alt=""
                  fill
                  priority={collageIdx === 0}
                  sizes="100vw"
                  className="object-cover"
                  style={{ filter: 'blur(40px) brightness(0.7)' }}
                  aria-hidden
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.85)_85%)]" />
        {/* Grain */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.06] mix-blend-soft-light"
          aria-hidden
        >
          <filter id="preloader-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#preloader-noise)" />
        </svg>
      </div>

      {/* === Content layer (also covered by slabs on exit) === */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Right terminal boot lines */}
        <div className="hidden md:block absolute right-8 top-1/3 max-w-[300px]">
          <ul className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber/80 space-y-1.5">
            {BOOT_LINES.map((line, i) => {
              const isActive = i === bootIdx && !bootDone;
              const isPast = i < bootIdx || (i === bootIdx && bootChars >= line.length);
              const text =
                i < bootIdx ? line : i === bootIdx ? line.slice(0, bootChars) : '';
              return (
                <li
                  key={line}
                  style={{
                    opacity: bootDone ? 0.45 : isPast ? 0.85 : isActive ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <span className="whitespace-pre">{text}</span>
                  {isActive && (
                    <span className="ml-0.5 inline-block animate-pulse text-amber">_</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Centered identity stack */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          {/* Kicker */}
          <motion.div
            className="font-mono text-[10px] uppercase tracking-[0.4em] text-paper-dim"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            PORTFOLIO · 2026
          </motion.div>

          {/* G·R Monogram with portrait inside the circle */}
          <div className="relative my-6 h-32 w-32 md:h-36 md:w-36">
            {/* Circular portrait fill (HTML, sits beneath the SVG outline) */}
            <motion.div
              className="absolute inset-[6%] overflow-hidden rounded-full"
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/about/portrait-hero.jpg"
                alt="Gauttham R."
                fill
                priority
                sizes="144px"
                className="object-cover"
                style={{ filter: 'contrast(1.05) saturate(1.05)' }}
              />
              {/* Subtle inner ink veil so the amber outline pops */}
              <div className="absolute inset-0 bg-ink/15" />
            </motion.div>

            {/* SVG outline + drawing rings on top */}
            <svg viewBox="0 0 96 96" className="absolute inset-0 h-full w-full" aria-hidden>
              {/* Outer drawing ring (pathLength 0 → 1) */}
              <motion.circle
                cx="48"
                cy="48"
                r="46"
                fill="none"
                stroke="#E8B863"
                strokeWidth="0.9"
                pathLength={1}
                initial={{ pathLength: 0, opacity: 0.4 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Slow rotating tick marks */}
              <motion.g
                style={{ transformOrigin: '48px 48px' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const a = (i / 24) * Math.PI * 2;
                  const r1 = 41;
                  const r2 = i % 6 === 0 ? 36 : 39;
                  const x1 = Math.round((48 + Math.cos(a) * r1) * 100) / 100;
                  const y1 = Math.round((48 + Math.sin(a) * r1) * 100) / 100;
                  const x2 = Math.round((48 + Math.cos(a) * r2) * 100) / 100;
                  const y2 = Math.round((48 + Math.sin(a) * r2) * 100) / 100;
                  return (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(232,184,99,0.45)" strokeWidth="0.5" />
                  );
                })}
              </motion.g>
              {/* Pulse halo */}
              <motion.circle
                cx="48"
                cy="48"
                r="46"
                fill="none"
                stroke="#E8B863"
                strokeWidth="0.4"
                animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '48px 48px' }}
              />
            </svg>

            {/* Bottom amber dot */}
            <motion.span
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 block h-1 w-1 rounded-full bg-amber"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {/* Name cascade */}
          <h1
            className="flex justify-center"
            style={{
              fontFamily: 'var(--font-fraunces, Fraunces, serif)',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: '#FAFAFA',
            }}
          >
            {nameLetters.map((ch, i) => (
              <span
                key={`${ch}-${i}`}
                className="relative inline-block overflow-hidden"
                style={{ width: ch === ' ' ? '0.4em' : 'auto' }}
              >
                <motion.span
                  className="inline-block"
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {ch === ' ' ? ' ' : ch}
                </motion.span>
              </span>
            ))}
            <motion.span
              className="inline-block italic"
              style={{ color: '#E8B863' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + nameLetters.length * 0.04 + 0.1 }}
            >
              .
            </motion.span>
          </h1>

          {/* Marquee strip */}
          <motion.div
            className="mt-8 w-full max-w-2xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <motion.div
              className="flex font-mono text-[10px] uppercase tracking-[0.4em] text-paper-dim whitespace-nowrap"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            >
              {marqueeStrip}
              {marqueeStrip}
              {marqueeStrip}
              {marqueeStrip}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom — counter + progress bar + status */}
        <div className="absolute bottom-8 left-0 right-0 px-8 md:px-12">
          <div className="mx-auto flex max-w-6xl items-end justify-between">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
              Loading studio
            </div>
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-amber">
              {ready ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{
                    opacity: [0, 1, 1, 1],
                    scale: 1,
                    textShadow: [
                      '0 0 0px rgba(232,184,99,0)',
                      '0 0 18px rgba(232,184,99,0.8)',
                      '0 0 6px rgba(232,184,99,0.4)',
                      '0 0 18px rgba(232,184,99,0.8)',
                    ],
                  }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                >
                  READY.
                </motion.span>
              ) : (
                <span className="tabular-nums">
                  <FlipDigit value={tens} />
                  <FlipDigit value={ones} />
                  <span className="ml-1 text-paper-dim">/ 100</span>
                </span>
              )}
            </div>
          </div>

          <div className="mx-auto mt-3 max-w-6xl">
            <div className="relative h-1 w-full bg-paper-soft overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-1"
                style={{
                  width: `${pct}%`,
                  background:
                    'linear-gradient(90deg, rgba(232,184,99,0.3) 0%, #E8B863 60%, #FAFAFA 100%)',
                }}
              />
              {/* Glow tip */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-amber"
                style={{
                  left: `calc(${pct}% - 4px)`,
                  boxShadow: '0 0 10px 3px rgba(232,184,99,0.85)',
                }}
              />
            </div>

            {/* Status checks */}
            <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
              {STATUS_LINES.map((s) => {
                const visible = pct >= s.at;
                return (
                  <motion.li
                    key={s.label}
                    className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]"
                    initial={false}
                    animate={{
                      opacity: visible ? 1 : 0.22,
                      x: visible ? 0 : -4,
                      color: visible ? 'rgb(232, 184, 99)' : 'rgba(250,250,250,0.45)',
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="inline-block w-3 text-center">{visible ? '✓' : '·'}</span>
                    <span>{s.label}</span>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Esc hint */}
          <div className="mx-auto mt-4 max-w-6xl text-right">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-paper-dim">
              [esc] to skip
            </span>
          </div>
        </div>
      </motion.div>

      {/* === Curtain exit slabs — appear at exit time, slide away === */}
      {exiting && (
        <>
          <motion.div
            className="absolute left-0 right-0 top-0 h-1/2 bg-ink"
            initial={{ y: 0 }}
            animate={{ y: '-100%' }}
            transition={{ duration: 0.7, ease: splitEase }}
          />
          <motion.div
            className="absolute left-0 right-0 bottom-0 h-1/2 bg-ink"
            initial={{ y: 0 }}
            animate={{ y: '100%' }}
            transition={{ duration: 0.7, ease: splitEase }}
          />
        </>
      )}

      {/* Horizontal scan line during exit */}
      {exiting && (
        <motion.div
          className="absolute left-0 right-0 h-px bg-amber"
          style={{
            top: 0,
            boxShadow: '0 0 12px 2px rgba(232,184,99,0.9), 0 0 24px 6px rgba(232,184,99,0.4)',
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: '100vh', opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.7, ease: splitEase, times: [0, 0.1, 0.85, 1] }}
        />
      )}
    </div>
  );
}
