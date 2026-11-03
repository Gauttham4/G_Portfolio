'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Reveal from '@/components/motion/Reveal';

/**
 * Home section: "Now". A bento dashboard: one study card plus four live-status project tiles.
 * Sits right after "Selected projects"; the full 31-project index lives on /work.
 */

const START = new Date('2026-09-21T00:00:00Z').getTime();
const END = new Date('2027-09-24T00:00:00Z').getTime();

function useStudyProgress() {
  const [p, setP] = useState<number | null>(null);
  useEffect(() => {
    const t = Date.now();
    setP(Math.min(1, Math.max(0, (t - START) / (END - START))));
  }, []);
  return p;
}

type Tile = {
  name: string;
  line: string;
  status: string;
  tone: string; // css colour
  href: string;
  visual: 'wave' | 'flow' | 'orb' | 'spark';
};

const TILES: Tile[] = [
  { name: 'ClinicVoice', line: 'An AI receptionist that answers clinic calls in Tamil and English and books the slot.', status: 'Live at a clinic', tone: '#5AC8FA', href: '/work/clinicvoice', visual: 'wave' },
  { name: 'SRC Task', line: 'A field-service app: the crew gets the job, the customer gets updates, the office gets paid.', status: 'Shipped', tone: '#E8B863', href: '/work/src-task', visual: 'flow' },
  { name: 'JARVIS', line: 'My own personal AI assistant. I talk to it and it runs my shell, files, web search and VS Code.', status: 'In daily use', tone: '#7C9CFF', href: '/work/jarvis', visual: 'orb' },
  { name: 'Market Pulse', line: 'Stock-market tooling I am working on alongside the rest.', status: 'In progress', tone: '#4ADE80', href: '/work/market-pulse', visual: 'spark' },
];

function Visual({ kind, tone }: { kind: Tile['visual']; tone: string }) {
  if (kind === 'wave')
    return (
      <div className="flex h-10 items-center gap-[5px]" aria-hidden>
        {Array.from({ length: 16 }, (_, i) => (
          <span
            key={i}
            className="w-[3px] rounded-full"
            style={{ height: '100%', background: tone, transformOrigin: 'center', animation: `eqbar ${0.7 + (i % 5) * 0.15}s ease-in-out ${(i % 7) * 0.08}s infinite alternate` }}
          />
        ))}
      </div>
    );
  if (kind === 'flow')
    return (
      <div className="flex items-center" aria-hidden>
        {['Call', 'Job', 'Crew', 'Paid'].map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ background: i === 3 ? '#4ADE80' : tone, boxShadow: `0 0 12px ${i === 3 ? '#4ADE80' : tone}66` }} />
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-paper-dim">{s}</span>
            </div>
            {i < 3 && <span className="mx-1.5 mb-4 h-px w-4 sm:w-6" style={{ background: `${tone}88` }} />}
          </div>
        ))}
      </div>
    );
  if (kind === 'orb')
    return (
      <div className="relative h-10 w-10" aria-hidden>
        <span className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, #BCD0FF, #3358D4 55%, #0A1230)', boxShadow: `0 0 26px ${tone}88` }} />
        <span className="absolute -inset-2 rounded-full border" style={{ borderColor: `${tone}55` }} />
      </div>
    );
  return (
    <svg viewBox="0 0 120 40" className="h-10 w-28" aria-hidden>
      <polyline points="0,32 14,28 28,30 42,20 56,24 70,12 84,16 98,6 120,10" fill="none" stroke={tone} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points="0,32 14,28 28,30 42,20 56,24 70,12 84,16 98,6 120,10 120,40 0,40" fill={`${tone}22`} stroke="none" />
    </svg>
  );
}

export default function NowBento() {
  const progress = useStudyProgress();
  const month = progress === null ? null : Math.min(12, Math.max(1, Math.ceil(progress * 12)));

  return (
    <section id="now" aria-label="What I am working on now" className="relative overflow-hidden bg-ink py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #3358D4, transparent 70%)' }} />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #E8B863, transparent 70%)' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-12">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-amber/80">
                <span className="relative flex h-2 w-2" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ADE80] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ADE80]" />
                </span>
                § Now · Autumn 2026
              </p>
              <h2 className="mt-4 font-display text-4xl tracking-tight text-paper md:text-7xl" style={{ lineHeight: 0.98 }}>
                What I&rsquo;m on
                <br />
                <span className="italic text-amber">right now.</span>
              </h2>
            </div>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 border border-amber/60 bg-amber/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-amber transition-colors hover:bg-amber hover:text-ink"
            >
              All 31 projects <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-12 md:gap-5">
          {/* study card */}
          <Reveal className="md:col-span-6 md:row-span-2">
            <div
              className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 p-6 md:p-8"
              style={{ background: 'linear-gradient(160deg, rgba(232,184,99,0.16), rgba(255,255,255,0.03) 55%)' }}
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-amber">Studying</p>
                <h3 className="mt-4 font-display text-3xl leading-tight text-paper md:text-4xl">
                  MSc Digital Forensics
                  <br />
                  <span className="italic text-amber">and Cyber Investigation</span>
                </h3>
                <p className="mt-3 font-sans text-sm text-paper-dim md:text-base">
                  Teesside University, Middlesbrough. Alongside my role as Head of Research at THEELABS.
                </p>
              </div>

              <div className="mt-10">
                <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
                  <span>Sep 2026</span>
                  <span className="text-amber">{month === null ? 'Year one' : `Month ${month} of 12`}</span>
                  <span>Sep 2027</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Progress through the MSc year" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((progress ?? 0) * 100)}>
                  <div className="h-full rounded-full bg-gradient-to-r from-amber to-[#F2C014] transition-[width] duration-1000" style={{ width: `${Math.max(3, (progress ?? 0) * 100)}%` }} />
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['Digital forensics', 'Incident response', 'Network forensics', 'Mobile forensics'].map((m) => (
                    <span key={m} className="rounded-full border border-white/15 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-paper-dim">
                      {m}
                    </span>
                  ))}
                </div>
                <Link href="/about" className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-amber">
                  The case file <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </Reveal>

          {/* project tiles */}
          {TILES.map((t, i) => (
            <Reveal key={t.name} className="md:col-span-3" delay={0.08 * (i + 1)}>
              <Link
                href={t.href}
                className="group relative flex h-full min-h-[210px] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 p-5 transition-transform duration-300 hover:-translate-y-1 md:p-6"
                style={{ background: `linear-gradient(150deg, ${t.tone}1f, rgba(255,255,255,0.025) 60%)` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em]" style={{ borderColor: `${t.tone}77`, color: t.tone }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.tone }} />
                    {t.status}
                  </span>
                  <span aria-hidden className="text-lg text-paper-dim transition-transform group-hover:translate-x-1 group-hover:text-amber">
                    →
                  </span>
                </div>
                <div className="mt-6">
                  <Visual kind={t.visual} tone={t.tone} />
                  <h3 className="mt-5 font-display text-2xl text-paper">{t.name}</h3>
                  <p className="mt-1.5 font-sans text-sm leading-snug text-paper-dim">{t.line}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
