'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Home section after "Selected projects": an investigator's evidence board.
 * Six pinned cards (paper, results, role, degree, now) joined by red string, each linking to its own page.
 * Desktop: 3 x 2 board with SVG string. Phones: a single column with a string down the left edge.
 */

type Card = {
  tag: string;
  title: string;
  lines: string[];
  href: string;
  cta: string;
  stamp?: string;
  rot: number;
  now?: boolean;
};

const CARDS: Card[] = [
  {
    tag: 'Exhibit A · Research',
    title: 'Published paper',
    lines: ['IJIRE, Vol 7, Issue 2 (Mar - Apr 2026)', 'BLAKE3-Merkle framework for tamper-proof evidence, with RAG-powered AI.'],
    href: '/research',
    cta: 'Read the paper',
    stamp: 'PEER REVIEWED',
    rot: -1.6,
  },
  {
    tag: 'Exhibit B · Podiums',
    title: 'Hackathons',
    lines: ['HORIZON 25 (SRMIST): 2nd place', 'Hack Summit, Aaruush 25: Special mention', 'HackHazards 25: participant'],
    href: '/hackathons',
    cta: 'See the results',
    stamp: '2ND PLACE',
    rot: 1.4,
  },
  {
    tag: 'Exhibit C · Work',
    title: 'Head of Research, THEELABS',
    lines: ['Research direction for the voice and AI systems: evaluation, agent architecture, prototyping.', 'Joined as an intern, January 2026.'],
    href: '/about',
    cta: 'The case file',
    rot: -1.1,
  },
  {
    tag: 'Exhibit D · Degree',
    title: 'B.Tech Information Technology',
    lines: ['Puducherry Technological University', 'CGPA 9.20 / 10, 2022 - 2026'],
    href: '/resume',
    cta: 'See the resume',
    rot: 1.2,
  },
  {
    tag: 'Exhibit E · Proof',
    title: 'Internships and certificates',
    lines: ['Three internships completed, with the certificates to prove each one.'],
    href: '/certificates',
    cta: 'Open the certificates',
    rot: -1.3,
  },
  {
    tag: 'Open case · Now',
    title: 'MSc Digital Forensics and Cyber Investigation',
    lines: ['Teesside University, Middlesbrough. September 2026 to September 2027.'],
    href: '/about',
    cta: 'What I am studying',
    stamp: 'IN PROGRESS',
    rot: 1.6,
    now: true,
  },
];

// pin centres on the 3 x 2 board (percent of the board box)
const PIN = [
  [16.7, 1.5], [50, 1.5], [83.3, 1.5],
  [16.7, 57], [50, 57], [83.3, 57],
];
const link = (a: number, b: number, sag = 6) => {
  const [x1, y1] = PIN[a], [x2, y2] = PIN[b];
  return `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.max(y1, y2) + sag} ${x2} ${y2}`;
};
// strings arc above the cards between neighbouring pins (they never cross card text)
const STRINGS = [link(0, 1, -11), link(1, 2, -11), link(3, 4, -11), link(4, 5, -11)];

export default function EvidenceBoard() {
  const reduce = useReducedMotion();
  return (
    <section id="evidence" aria-label="Evidence board" className="relative overflow-hidden bg-ink py-20 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        aria-hidden
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(70% 60% at 50% 45%, #000, transparent)',
          WebkitMaskImage: 'radial-gradient(70% 60% at 50% 45%, #000, transparent)',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber/80">§ The evidence</p>
        <h2 className="mt-4 font-display text-4xl tracking-tight text-paper md:text-7xl" style={{ lineHeight: 0.98 }}>
          Everything on the record.
          <br />
          <span className="italic text-amber">Pinned, not claimed.</span>
        </h2>
        <p className="mt-5 max-w-xl font-sans text-base text-paper-dim md:text-lg">
          The paper, the podiums, the work and the degree, joined up in one place. Open any card for the full file.
        </p>

        <div className="relative mt-14 md:mt-20">
          {/* red string: desktop board */}
          <svg
            className="pointer-events-none absolute inset-0 z-20 hidden h-full w-full overflow-visible md:block"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {STRINGS.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                fill="none"
                stroke="#E04050"
                strokeWidth={1.6}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                strokeOpacity={0.9}
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.9, delay: 0.5 + i * 0.15, ease: 'easeOut' }}
              />
            ))}
          </svg>
          {/* red string: phone column */}
          <span aria-hidden className="absolute bottom-6 left-[14px] top-6 w-px bg-[#E04050]/60 md:hidden" />

          <ul className="relative grid grid-cols-1 gap-6 pl-8 md:grid-cols-3 md:auto-rows-fr md:gap-x-10 md:gap-y-16 md:pl-0">
            {CARDS.map((c, i) => (
              <motion.li
                key={c.title}
                className="relative list-none"
                initial={reduce ? false : { opacity: 0, y: 26, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: c.rot }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* pin */}
                <span
                  aria-hidden
                  className="absolute -left-[26px] top-6 z-10 h-3 w-3 rounded-full bg-[#E04050] shadow-[0_0_0_3px_rgba(224,64,80,0.25)] md:left-1/2 md:top-[-8px] md:-translate-x-1/2"
                />
                <Link
                  href={c.href}
                  className="group relative block h-full border p-5 transition-transform duration-300 hover:-translate-y-1 md:p-6"
                  style={{
                    borderColor: c.now ? 'rgba(232,184,99,0.7)' : 'rgba(216,192,137,0.3)',
                    backgroundColor: '#0e0e10',
                    backgroundImage: c.now
                      ? 'linear-gradient(135deg, rgba(232,184,99,0.16), rgba(232,184,99,0.04))'
                      : 'linear-gradient(135deg, rgba(216,192,137,0.09), rgba(216,192,137,0.02))',
                    boxShadow: '0 18px 40px rgba(0,0,0,0.45)',
                  }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber/80">{c.tag}</p>
                  {c.stamp && (
                    <span
                      className="absolute right-4 top-4 rotate-[7deg] border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.25em]"
                      style={{ borderColor: '#E04050', color: '#E04050' }}
                    >
                      {c.stamp}
                    </span>
                  )}
                  <h3 className="mt-3 max-w-[85%] font-display text-xl leading-tight text-paper md:text-2xl">{c.title}</h3>
                  <ul className="mt-3 space-y-1.5 font-sans text-sm text-paper-dim">
                    {c.lines.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                  <p className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-amber transition-all group-hover:gap-3">
                    {c.cta} <span aria-hidden>→</span>
                  </p>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
