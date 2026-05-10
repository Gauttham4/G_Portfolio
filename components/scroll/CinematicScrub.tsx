'use client';
import { useEffect, useRef } from 'react';
import { useScroll, useReducedMotion } from 'framer-motion';

export default function CinematicScrub() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    if (reduced) return;
    const v = videoRef.current;
    if (!v) return;
    let raf = 0;
    let target = 0;
    let current = 0;

    const onMeta = () => {
      try { v.currentTime = 0; } catch {}
    };
    v.addEventListener('loadedmetadata', onMeta);

    const tick = () => {
      // smooth interpolation toward target so scrubbing doesn't stutter
      current += (target - current) * 0.18;
      if (v.duration && Number.isFinite(v.duration)) {
        try {
          v.currentTime = Math.max(0, Math.min(v.duration - 0.001, v.duration * current));
        } catch {}
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const unsub = scrollYProgress.on('change', (latest) => { target = latest; });
    return () => {
      cancelAnimationFrame(raf);
      unsub();
      v.removeEventListener('loadedmetadata', onMeta);
    };
  }, [scrollYProgress, reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-ink"
      style={{ height: '350vh' }}
      aria-label="Scrub-driven cinematic"
    >
      {/* sticky pinned video for entire 350vh */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {reduced ? (
          <video
            src="/reels/cinematic-scrub.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden
          />
        ) : (
          <video
            ref={videoRef}
            src="/reels/cinematic-scrub.mp4"
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden
          />
        )}
        {/* Cinematic vignette + bottom legibility gradient */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-ink)_88%)]" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-ink/40 via-transparent to-ink/70" />
        {/* Foreground typography */}
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <p className="font-mono uppercase text-amber/70 text-[10px] tracking-[0.3em] mb-8">§ THE REEL — SCROLL TO PLAY</p>
          <h2 className="font-display text-paper text-[clamp(3rem,9vw,9rem)] leading-[0.92] tracking-tight">
            Every project,<br />
            <span className="italic text-amber">in motion.</span>
          </h2>
          <p className="font-sans text-paper-dim text-base md:text-lg mt-8 max-w-xl mx-auto">
            Twenty-eight ships, one scroll. Drive the reel with your wheel.
          </p>
        </div>
      </div>
    </section>
  );
}
