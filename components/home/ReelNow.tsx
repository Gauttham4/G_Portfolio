'use client';

import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/motion/Reveal';
import { REPLAY_HERO } from '@/lib/media-events';

/**
 * Home section: "The reel" + "Now".
 * Replaces the second full project list that used to sit under the featured rail (that list now lives on /work).
 * The poster opens the same full-screen reel the hero button opens (event channel), so there is only one player.
 */
const BUILDING = [
  { name: 'ClinicVoice', line: 'An AI receptionist that answers clinic calls in Tamil and English and books the slot.', href: '/work/clinicvoice' },
  { name: 'SRC Task', line: 'A field-service app: the crew gets the job, the customer gets updates, the office gets paid.', href: '/work/src-task' },
  { name: 'JARVIS', line: 'My own personal AI assistant. I talk to it and it runs my shell, files, web search and VS Code.', href: '/work/jarvis' },
  { name: 'Market Pulse', line: 'Stock-market tooling I am working on alongside the rest.', href: '/work/market-pulse' },
];

export default function ReelNow() {
  return (
    <section id="reel-now" aria-label="The reel and what I am doing now" className="relative bg-ink py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-12 md:gap-12 md:px-12">
        {/* Reel poster */}
        <Reveal className="md:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber/80">§ The reel · 80 seconds</p>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-paper md:text-6xl" style={{ lineHeight: 0.98 }}>
            Hi, I&rsquo;m Gauttham.
            <br />
            <span className="italic text-amber">The short version, in 80 seconds.</span>
          </h2>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(REPLAY_HERO))}
            aria-label="Play the 80 second introduction reel"
            className="group relative mt-8 block aspect-video w-full overflow-hidden border border-rule bg-black text-left"
          >
            <Image
              src="/reel/portfolio-reel.jpg"
              alt="Gauttham R sitting on a bench by the sea"
              fill
              sizes="(min-width: 768px) 58vw, 92vw"
              className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden />
            <span className="absolute bottom-3 right-3 flex items-center gap-2 border border-amber/80 bg-ink/75 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-amber transition-colors group-hover:bg-amber group-hover:text-ink md:bottom-5 md:right-5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7 4.5v15l13-7.5z" />
              </svg>
              Play the reel
            </span>
            <span className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-paper md:bottom-5 md:left-6">
              Who · Work · Proof · Next
            </span>
          </button>
        </Reveal>

        {/* Now card */}
        <Reveal className="md:col-span-5" delay={0.1}>
          <div className="border border-rule bg-paper-soft p-6 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">Now · Autumn 2026</p>
            <h3 className="mt-3 font-display text-2xl leading-tight text-paper md:text-3xl">
              MSc Digital Forensics <span className="italic text-amber">and Cyber Investigation.</span>
            </h3>
            <p className="mt-2 font-sans text-sm text-paper-dim">Teesside University, Middlesbrough. Alongside my work at THEELABS.</p>

            <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.35em] text-paper-dim">Building right now</p>
            <ul className="mt-3 divide-y divide-rule">
              {BUILDING.map((b) => (
                <li key={b.name}>
                  <Link href={b.href} className="group flex items-baseline justify-between gap-4 py-3">
                    <span>
                      <span className="block font-display text-lg text-paper transition-colors group-hover:text-amber">{b.name}</span>
                      <span className="block font-sans text-sm text-paper-dim">{b.line}</span>
                    </span>
                    <span aria-hidden className="text-amber transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 border border-amber/60 bg-amber/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-amber transition-colors hover:bg-amber hover:text-ink"
              >
                All 31 projects <span aria-hidden>→</span>
              </Link>
              <Link href="/about" className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper-dim transition-colors hover:text-amber">
                The case file
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
