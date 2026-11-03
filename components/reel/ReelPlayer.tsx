'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { announceVideo } from '@/lib/media-events';

/**
 * The portfolio as a ~70s video, for visitors who would rather watch than scroll.
 *  - Picks the landscape or portrait cut to match the screen.
 *  - Autoplays muted (browsers allow that), native controls, "Replay" and "Continue" at the end.
 *  - The MP4 carries its own music; the "Sound on" button simply un-mutes it.
 */
export default function ReelPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [portrait, setPortrait] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait) and (max-width: 900px)');
    const apply = () => setPortrait(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onEnd = () => {
      setEnded(true);
      announceVideo(false);
    };
    const onPlay = () => {
      setEnded(false);
      announceVideo(true);
    };
    const onPause = () => announceVideo(false);
    const onVol = () => setMuted(v.muted);
    v.addEventListener('ended', onEnd);
    v.addEventListener('play', onPlay);
    v.addEventListener('volumechange', onVol);
    v.addEventListener('pause', onPause);
    return () => {
      announceVideo(false);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnd);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('volumechange', onVol);
    };
  }, [portrait]);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) {
      v.volume = 0.8;
      if (v.paused) void v.play();
    }
    setMuted(v.muted);
  };

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    void v.play();
    setEnded(false);
  };

  const base = portrait ? '/reel/portfolio-reel-portrait' : '/reel/portfolio-reel';

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 sm:px-6">
      <div
        className="relative w-full overflow-hidden border border-rule bg-black"
        style={{
          aspectRatio: portrait ? '9 / 16' : '16 / 9',
          maxWidth: portrait ? 'calc(78svh * 9 / 16)' : undefined,
        }}
      >
        <video
          key={base}
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-contain"
          src={`${base}.mp4`}
          poster={`${base}.jpg`}
          autoPlay
          muted
          playsInline
          controls
          preload="metadata"
          aria-label="Gauttham R, an introduction reel, about eighty seconds"
        />
        {ended && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/80 px-6 text-center">
            <p className="font-display text-3xl italic text-paper md:text-5xl">That&apos;s the reel.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={replay}
                className="border border-amber/60 bg-amber/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-amber transition-colors hover:bg-amber hover:text-ink"
              >
                ↺ Replay
              </button>
              <Link
                href="/"
                className="border border-paper-soft px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-paper-dim transition-colors hover:border-amber hover:text-amber"
              >
                Full portfolio →
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex w-full flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
          ABOUT 80 SECONDS · WHO · WORK · PROOF · NEXT
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            aria-pressed={!muted}
            className="border border-paper-soft px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-paper-dim transition-colors hover:border-amber/60 hover:text-amber"
          >
            {muted ? '♪ Sound on' : '♪ Sound off'}
          </button>
          <Link
            href="/"
            className="border border-amber/60 bg-amber/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-amber transition-colors hover:bg-amber hover:text-ink"
          >
            Skip to the full site →
          </Link>
        </div>
      </div>
    </div>
  );
}
