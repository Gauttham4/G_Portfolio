'use client';

import Image from 'next/image';
import Reveal from '@/components/motion/Reveal';
import { REPLAY_HERO } from '@/lib/media-events';

/**
 * The reel section, placed right before "Selected projects".
 * The poster opens the same full-screen reel the hero button opens (event channel), so there is one player.
 */
export default function ReelSection() {
  return (
    <section id="reel" aria-label="The reel" className="relative bg-ink py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-12">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber/80">§ The reel · 80 seconds</p>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-paper md:text-7xl" style={{ lineHeight: 0.98 }}>
            Hi, I&rsquo;m Gauttham.
            <br />
            <span className="italic text-amber">The short version, in 80 seconds.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(REPLAY_HERO))}
            aria-label="Play the 80 second introduction reel"
            className="group relative mt-10 block aspect-video w-full overflow-hidden border border-rule bg-black text-left"
          >
            <Image
              src="/reel/reel-poster-l.jpg"
              alt="Gauttham R sitting on a seafront bench"
              fill
              sizes="(min-width: 1152px) 1056px, 92vw"
              className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden />
            <span className="absolute bottom-3 right-3 flex items-center gap-2 border border-amber/80 bg-ink/75 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-amber transition-colors group-hover:bg-amber group-hover:text-ink md:bottom-6 md:right-6 md:px-5 md:py-3 md:text-[11px]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7 4.5v15l13-7.5z" />
              </svg>
              Play the reel
            </span>
            <span className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-paper md:bottom-6 md:left-6">
              Who · Work · Proof · Next
            </span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
