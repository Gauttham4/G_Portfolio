'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { REPLAY_HERO, announceVideo } from '@/lib/media-events';

/**
 * The portfolio reel, playing in the hero.
 *  - Plays only when the visitor presses "Watch the reel" (never automatically). Skip it any time (button or Esc).
 *  - While it plays the page cannot scroll underneath. When it ENDS it fades out and glides down to the
 *    main portfolio. When it is SKIPPED it simply reveals the hero.
 *  - It tells the background music to stop while it plays, and to resume when it stops (see lib/media-events).
 *  - The "Watch the reel" button in the hero dispatches REPLAY_HERO to start it (with sound).
 */
const SEEN = 'reel_seen';
const LANDSCAPE = '/reel/portfolio-reel';
const PORTRAIT = '/reel/portfolio-reel-portrait';

export default function HeroVideo() {
  const vref = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(false);
  const [active, setActive] = useState(false); // overlay mounted
  const [shown, setShown] = useState(false); // faded in (first frame is on screen)
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const [hint, setHint] = useState(false);
  const [fit, setFit] = useState<'cover' | 'contain'>('cover');

  // pick the cut that fits the screen
  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait) and (max-width: 900px)');
    const apply = () => {
      setPortrait(mq.matches);
      const a = window.innerWidth / window.innerHeight;
      // Fill the screen only when it is close to the video's own shape (crop stays under ~10%), so faces never get cut off; any other shape shows the whole frame.
      setFit(mq.matches ? (a > 0.44 && a < 0.62 ? 'cover' : 'contain') : a > 1.6 && a < 2.05 ? 'cover' : 'contain');
    };
    apply();
    mq.addEventListener('change', apply);
    window.addEventListener('resize', apply);
    return () => {
      mq.removeEventListener('change', apply);
      window.removeEventListener('resize', apply);
    };
  }, []);

  // block scrolling underneath while the video is up
  useEffect(() => {
    if (!active) return;
    const stop = (e: Event) => e.preventDefault();
    const keys = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close('skip');
        return;
      }
      if ([' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'End', 'Home'].includes(e.key)) e.preventDefault();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('wheel', stop, { passive: false });
    window.addEventListener('touchmove', stop, { passive: false });
    window.addEventListener('keydown', keys);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
      window.removeEventListener('keydown', keys);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const close = useCallback((why: 'ended' | 'skip') => {
    if (!activeRef.current) return;
    activeRef.current = false;
    try {
      sessionStorage.setItem(SEEN, '1');
    } catch {
      /* ignore */
    }
    setShown(false); // fade out
    announceVideo(false); // music comes back
    window.setTimeout(() => {
      setActive(false);
      vref.current?.pause();
      if (why === 'ended') {
        // glide on to the main portfolio
        window.setTimeout(() => {
          document.querySelector('[aria-label="Intro"]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }, 750);
  }, []);

  const open = useCallback((withSound: boolean) => {
    if (activeRef.current) return;
    activeRef.current = true;
    window.scrollTo(0, 0);
    setMuted(!withSound);
    setPaused(false);
    setActive(true);
    setHint(!withSound);
    window.setTimeout(() => setHint(false), 5000);
  }, []);

  // The reel never starts by itself: it plays only when the visitor presses "Watch the reel" (REPLAY_HERO).
  useEffect(() => {
    const onPlay = () => open(true);
    window.addEventListener(REPLAY_HERO, onPlay);
    return () => window.removeEventListener(REPLAY_HERO, onPlay);
  }, [open]);

  // wire the <video> element once it exists
  useEffect(() => {
    const v = vref.current;
    if (!active || !v) return;
    v.muted = muted;
    v.currentTime = 0;
    const onPlaying = () => {
      setShown(true);
      setPaused(false);
      announceVideo(true); // music stops
    };
    const onPause = () => {
      if (v.ended || !activeRef.current) return;
      setPaused(true);
      announceVideo(false); // video stopped -> music back
    };
    const onEnded = () => close('ended');
    const onTime = () => {
      if (bar.current && v.duration) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
    };
    const onError = () => close('skip');
    v.addEventListener('playing', onPlaying);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnded);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('error', onError);
    void v.play().catch(() => {
      // autoplay refused: do not trap the visitor behind a stuck overlay
      if (!withSoundRef.current) close('skip');
    });
    return () => {
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('error', onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, portrait]);
  const withSoundRef = useRef(false);
  withSoundRef.current = !muted;

  const toggleSound = () => {
    const v = vref.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) v.volume = 0.85;
    setMuted(v.muted);
    setHint(false);
  };
  const togglePlay = () => {
    const v = vref.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  if (!active) return null;
  const base = portrait ? PORTRAIT : LANDSCAPE;

  return (
    <div
      className="fixed inset-0 z-[90] bg-black"
      style={{ opacity: shown ? 1 : 0, transition: 'opacity 700ms ease', pointerEvents: shown ? 'auto' : 'none' }}
      role="dialog"
      aria-label="Portfolio reel"
    >
      <video
        key={base}
        ref={vref}
        src={`${base}.mp4`}
        className={`absolute inset-0 h-full w-full cursor-pointer ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
        playsInline
        muted={muted}
        preload="auto"
        onClick={togglePlay}
      />

      {paused && (
        <button
          onClick={togglePlay}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-amber/70 bg-ink/70 px-8 py-5 font-mono text-xs uppercase tracking-[0.35em] text-amber"
        >
          ▶ Resume
        </button>
      )}

      {hint && (
        <div className="pointer-events-none absolute bottom-24 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-paper md:bottom-28 md:left-12">
          ↓ Tap the speaker for sound
        </div>
      )}

      {/* controls */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 pb-5 md:px-12 md:pb-8">
        <button
          onClick={toggleSound}
          aria-pressed={!muted}
          className="inline-flex items-center gap-2 border border-paper-soft bg-ink/70 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-paper hover:border-amber/60 hover:text-amber"
        >
          <span aria-hidden>{muted ? '🔇' : '🔊'}</span> {muted ? 'Sound on' : 'Sound off'}
        </button>
        <button
          onClick={() => close('skip')}
          className="inline-flex items-center gap-2 border border-amber/70 bg-ink/70 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-amber transition-colors hover:bg-amber hover:text-ink"
        >
          Skip <span aria-hidden>›</span>
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/15">
        <span ref={bar} className="block h-full origin-left bg-amber" style={{ transform: 'scaleX(0)' }} />
      </div>
    </div>
  );
}
