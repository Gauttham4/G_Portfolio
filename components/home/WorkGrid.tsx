'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Reveal from '@/components/motion/Reveal';

type Tile = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
};

const FEATURED: Tile[] = [
  { slug: 'jarvis',             title: 'JARVIS',             subtitle: 'A personal AI assistant that teaches itself new skills',         category: 'AI · MULTI-AGENT', year: '2025' },
  { slug: 'final-year-project', title: 'CrimeIntellX',       subtitle: "A detective's assistant for cases, evidence & call records",     category: 'AI · FORENSICS',   year: '2025' },
  { slug: 'electrobike',        title: 'ElectroBike',        subtitle: 'A smart electric bike that thinks with you',                     category: 'PRODUCT · IoT',    year: '2025' },
  { slug: 'spaceforge',         title: 'SpaceForge',         subtitle: 'A cinematic 3D landing page for a tech startup',                 category: 'CINEMATIC · 3D',   year: '2025' },
  { slug: 'viksit-ai',          title: 'Viksit.AI',          subtitle: 'An AI workspace that codes, searches & talks back',              category: 'AI · WORKSPACE',   year: '2025' },
  { slug: 'dhanoos-excellence', title: 'Excellence Academy', subtitle: 'Student coaching & admissions, all in one place',                category: 'PLATFORM · EDU',   year: '2025' },
  { slug: 'thaazhai',           title: 'THAAZHAI',           subtitle: 'Where farmers, buyers & agri-experts meet',                      category: 'COMMUNITY · AGRI', year: '2025' },
  { slug: 'alzhmeric',          title: 'Alzhmeric',          subtitle: "A care companion for Alzheimer's patients & their families",     category: 'COMMUNITY · CARE', year: '2025' },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function WorkTile({ tile, index }: { tile: Tile; index: number }) {
  const reduce = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const handleEnter = () => {
    if (reduce) return;
    setIsHovered(true);
  };
  const handleLeave = () => setIsHovered(false);

  return (
    <motion.li
      initial={{ opacity: 0, y: reduce ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{
        duration: reduce ? 0 : 0.6,
        ease: EASE,
        delay: reduce ? 0 : (index % 4) * 0.06,
      }}
    >
      <motion.a
        href={`/work/${tile.slug}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
        className="group block"
        whileHover={reduce ? undefined : { scale: 1.02 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        <motion.div
          layoutId={`tile-${tile.slug}`}
          className="relative overflow-hidden rounded-sm border border-rule"
          style={{ aspectRatio: '2 / 3' }}
        >
          {/* Image — zoom + filter swap on hover */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/work/${tile.slug}/thumb.jpg`}
            alt={tile.title}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              filter: isHovered
                ? 'grayscale(0) brightness(1)'
                : 'grayscale(0.5) brightness(0.75)',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'filter 0.4s ease, transform 0.5s ease',
            }}
          />

          {/* Legibility gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/10" />

          {/* Top-right tag — switches to "VIEW →" on hover */}
          <span
            className="absolute right-3 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors duration-300"
            style={{ color: isHovered ? 'var(--color-amber)' : 'rgba(232,184,99,0.7)' }}
          >
            {isHovered ? 'VIEW →' : tile.category}
          </span>

          {/* Bottom-left title overlay */}
          <div className="absolute inset-x-4 bottom-4 z-10">
            <div className="mb-2 h-px w-12 bg-amber/40" />
            <h4
              className="font-display text-2xl md:text-3xl font-light transition-colors duration-300"
              style={{ color: isHovered ? 'var(--color-amber)' : 'var(--color-paper)' }}
            >
              {tile.title}
              {isHovered && (
                <span className="ml-2 inline-block text-base text-amber">↗</span>
              )}
            </h4>
            <p
              className="mt-1 max-w-[80%] text-sm transition-all duration-300"
              style={{
                color: isHovered ? 'var(--color-paper)' : 'var(--color-paper-dim)',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
              }}
            >
              {tile.subtitle}
            </p>
          </div>
        </motion.div>

        {/* Below-tile meta */}
        <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span>{tile.year}</span>
        </div>
      </motion.a>
    </motion.li>
  );
}

export default function WorkGrid() {
  return (
    <section aria-label="Featured work" className="relative w-full bg-ink py-32 md:py-48">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <Reveal dir="left">
          <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-amber/80">
            ◇  References  ·  Featured 8 of 28
          </span>
        </Reveal>
        <Reveal dir="bottom" delay={0.1} className="mt-4">
          <h3
            className="font-display font-light text-paper"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', lineHeight: 0.95, letterSpacing: '-0.015em' }}
          >
            Selected <span className="italic text-amber">work.</span>
          </h3>
        </Reveal>

        {/* Grid */}
        <ul className="mt-20 grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-x-8">
          {FEATURED.map((tile, i) => (
            <WorkTile key={tile.slug} tile={tile} index={i} />
          ))}
        </ul>

        {/* View all */}
        <Reveal dir="bottom" className="mt-24 flex justify-center">
          <Link
            href="#acts-drilldown"
            className="group inline-flex items-baseline gap-4 font-mono uppercase tracking-[0.35em] text-amber"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1rem)' }}
          >
            View all 28 projects
            <span className="transition-transform duration-300 group-hover:translate-x-2 group-active:translate-x-2">
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
