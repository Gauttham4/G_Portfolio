'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { VIDEO_EVENT } from '@/lib/media-events';

/**
 * Site-wide background music.
 *  - Plays by default, and keeps playing while visitors scroll and move between pages
 *    (this component lives in the root layout, so it is never remounted on navigation).
 *  - Browsers refuse to play sound before the visitor has interacted with the page. So we try
 *    immediately, and if that is blocked we start on the very first tap / click / key press.
 *  - A small button lets people stop or restart it. The choice is remembered.
 *  - It pauses on /reel (the video there has its own soundtrack) and when the tab is hidden.
 *
 * Track: royalty-free "Portfolio Harmony" supplied by the site owner (public/audio/hero-theme.mp3).
 */
const SRC = '/audio/hero-theme.mp3';
const VOLUME = 0.32;
// v2: older "off" choices (made while testing) are ignored so the music is ON by default for everyone.
const KEY = 'bgm_off_v2';
const ENABLED = process.env.NEXT_PUBLIC_HERO_AUDIO === '1';

export default function BackgroundMusic() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wantsRef = useRef(true); // the visitor has not switched it off
  const hiddenRef = useRef(false);
  const videoRef = useRef(false); // a portfolio video is currently playing
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [wants, setWants] = useState(true);
  const [ready, setReady] = useState(false);

  const fadeTo = useCallback((target: number, done?: () => void) => {
    const a = audioRef.current;
    if (!a) return;
    if (fadeRef.current) clearInterval(fadeRef.current);
    fadeRef.current = setInterval(() => {
      const step = target > a.volume ? 0.02 : -0.04;
      const next = Math.min(1, Math.max(0, a.volume + step));
      a.volume = next;
      if (Math.abs(next - target) <= 0.03) {
        a.volume = target;
        if (fadeRef.current) clearInterval(fadeRef.current);
        done?.();
      }
    }, 50);
  }, []);

  const tryPlay = useCallback(async () => {
    const a = audioRef.current;
    if (!a || !wantsRef.current || hiddenRef.current || videoRef.current) return;
    try {
      await a.play();
      setPlaying(true);
      setBlocked(false);
      fadeTo(VOLUME);
    } catch {
      setPlaying(false);
      setBlocked(true); // autoplay blocked: wait for the first gesture
    }
  }, [fadeTo]);

  const stop = useCallback(() => {
    setPlaying(false);
    fadeTo(0, () => audioRef.current?.pause());
  }, [fadeTo]);

  // create the audio element once and read the saved choice
  useEffect(() => {
    if (!ENABLED) return;
    let off = false;
    try {
      off = localStorage.getItem(KEY) === '1';
    } catch {
      /* ignore */
    }
    wantsRef.current = !off;
    setWants(!off);
    const a = new Audio(SRC);
    a.loop = true;
    a.preload = 'auto';
    a.volume = 0;
    audioRef.current = a;
    setReady(true);
    if (!off && window.location.pathname !== '/reel') void tryPlay();
    return () => {
      if (fadeRef.current) clearInterval(fadeRef.current);
      a.pause();
      audioRef.current = null;
    };
  }, [tryPlay]);

  // if autoplay was blocked, start on the first real interaction (tap, click or key)
  useEffect(() => {
    if (!ENABLED || !blocked || !wants) return;
    const go = () => {
      if (pathname === '/reel') return;
      void tryPlay();
    };
    // any real gesture counts: the first one that the browser accepts starts the music
    const evs: Array<keyof WindowEventMap> = ['pointerdown', 'pointerup', 'mousedown', 'click', 'touchstart', 'touchend', 'keydown'];
    evs.forEach((e) => window.addEventListener(e, go, { capture: true }));
    return () => evs.forEach((e) => window.removeEventListener(e, go, { capture: true }));
  }, [blocked, wants, tryPlay, pathname]);

  // /reel has its own soundtrack: pause here, resume on other pages
  useEffect(() => {
    if (!ENABLED || !ready) return;
    if (pathname === '/reel') {
      const a = audioRef.current;
      if (a && !a.paused) {
        a.pause();
        setPlaying(false);
      }
    } else if (wantsRef.current) {
      void tryPlay();
    }
  }, [pathname, ready, tryPlay]);

  // a portfolio video started -> fade the music out; it stopped/ended/was skipped -> bring the music back
  useEffect(() => {
    if (!ENABLED) return;
    const onVideo = (e: Event) => {
      const playingNow = !!(e as CustomEvent<{ playing: boolean }>).detail?.playing;
      videoRef.current = playingNow;
      if (playingNow) {
        const a = audioRef.current;
        if (a && !a.paused) {
          setPlaying(false);
          fadeTo(0, () => a.pause());
        }
      } else if (wantsRef.current && window.location.pathname !== '/reel') {
        void tryPlay();
      }
    };
    window.addEventListener(VIDEO_EVENT, onVideo);
    return () => window.removeEventListener(VIDEO_EVENT, onVideo);
  }, [fadeTo, tryPlay]);

  // pause while the tab is hidden
  useEffect(() => {
    if (!ENABLED) return;
    const onVis = () => {
      hiddenRef.current = document.hidden;
      const a = audioRef.current;
      if (!a) return;
      if (document.hidden) {
        a.pause();
      } else if (wantsRef.current && window.location.pathname !== '/reel' && playing) {
        void a.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [playing]);

  if (!ENABLED || pathname === '/reel') return null;

  const toggle = () => {
    if (playing) {
      wantsRef.current = false;
      setWants(false);
      try {
        localStorage.setItem(KEY, '1');
      } catch {
        /* ignore */
      }
      stop();
    } else {
      wantsRef.current = true;
      setWants(true);
      try {
        localStorage.removeItem(KEY);
      } catch {
        /* ignore */
      }
      void tryPlay();
    }
  };

  const label = playing ? 'Music on' : blocked && wants ? 'Tap for music' : 'Music off';
  // bottom-right on every page (the Back/Home buttons own the bottom-left on inner pages).
  const pos = 'bottom-4 right-3 md:bottom-8 md:right-8';

  return (
    <div className={`fixed z-[70] ${pos}`}>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Turn the background music off' : 'Turn the background music on'}
        className="inline-flex items-center gap-3 border border-paper-soft bg-ink/85 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-paper-dim transition-colors hover:border-amber/60 hover:text-amber"
      >
        <span className="flex h-3 items-end gap-[2px]" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[2px] bg-amber"
              style={{
                height: '100%',
                transform: playing ? undefined : 'scaleY(0.3)',
                transformOrigin: 'bottom',
                animation: playing ? `eqbar 0.9s ease-in-out ${i * 0.18}s infinite` : 'none',
              }}
            />
          ))}
        </span>
        {label}
      </button>
    </div>
  );
}
