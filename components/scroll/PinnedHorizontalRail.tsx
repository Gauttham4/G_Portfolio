'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Reveal from '@/components/motion/Reveal';

type Featured = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
};

const FEATURED: Featured[] = [
  { slug: 'jarvis',             title: 'JARVIS',             subtitle: 'A personal AI assistant that teaches itself new skills',     category: 'AI · MULTI-AGENT' },
  { slug: 'final-year-project', title: 'CrimeIntellX',       subtitle: "A detective's assistant for cases, evidence & call records", category: 'AI · FORENSICS' },
  { slug: 'electrobike',        title: 'ElectroBike',        subtitle: 'A smart electric bike that thinks with you',                 category: 'PRODUCT · IoT' },
  { slug: 'spaceforge',         title: 'SpaceForge',         subtitle: 'A cinematic 3D landing page for a tech startup',             category: 'CINEMATIC · 3D' },
  { slug: 'viksit-ai',          title: 'Viksit.AI',          subtitle: 'An AI workspace that codes, searches & talks back',          category: 'AI · WORKSPACE' },
  { slug: 'dhanoos-excellence', title: 'Excellence Academy', subtitle: 'Student coaching & admissions, all in one place',            category: 'PLATFORM · EDU' },
  { slug: 'thaazhai',           title: 'THAAZHAI',           subtitle: 'Where farmers, buyers & agri-experts meet',                  category: 'COMMUNITY · AGRI' },
  { slug: 'alzhmeric',          title: 'Alzhmeric',          subtitle: "A care companion for Alzheimer's patients & their families", category: 'COMMUNITY · CARE' },
];

export default function PinnedHorizontalRail() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [maxX, setMaxX] = useState(0);

  // Measure how far we need to translate
  useEffect(() => {
    const measure = () => {
      const row = rowRef.current;
      if (!row) return;
      const w = row.scrollWidth;
      const vw = window.innerWidth;
      setMaxX(Math.max(0, w - vw));
    };
    measure();
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 500);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Scrub from 0 → -maxX px linearly across the section's scroll
  const x = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -maxX]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-ink"
      style={{ height: reduced ? 'auto' : '500vh' }}
      aria-label="Selected work"
    >
      <div
        className={
          reduced
            ? 'py-20 px-6 md:px-12'
            : 'sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center'
        }
      >
        {/* Header */}
        <div className="px-6 md:px-12 max-w-7xl w-full mx-auto mb-8 md:mb-12">
          <Reveal dir="left" className="font-mono uppercase text-amber/70 text-[10px] tracking-[0.3em] mb-4">
            § THE WORK · 8 OF 28
          </Reveal>
          <Reveal
            dir="left"
            delay={0.1}
            className="font-display text-paper text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[0.95]"
          >
            Selected projects.
          </Reveal>
          <Reveal
            dir="left"
            delay={0.2}
            className="font-sans text-paper-dim text-sm md:text-base mt-3 max-w-md"
          >
            Scroll to slide.
          </Reveal>
        </div>

        {/* Rail */}
        {reduced ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-6 md:px-12 max-w-7xl mx-auto">
            {FEATURED.map((p) => (
              <Card key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <motion.div
            ref={rowRef}
            style={{ x }}
            className="flex gap-[2vw] pl-[6vw] pr-[6vw] will-change-transform"
          >
            {FEATURED.map((p) => (
              <div
                key={p.slug}
                className="shrink-0 w-[68vw] sm:w-[44vw] md:w-[30vw] lg:w-[26vw] xl:w-[24vw]"
              >
                <Card p={p} />
              </div>
            ))}
          </motion.div>
        )}

        {/* Scroll hint */}
        {!reduced && (
          <div className="px-6 md:px-12 max-w-7xl w-full mx-auto mt-8">
            <p className="font-mono uppercase text-paper-dim text-[10px] tracking-[0.3em]">
              ↓ KEEP SCROLLING — 8 PROJECTS ROLL PAST
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function Card({ p }: { p: Featured }) {
  return (
    <a
      href={`/work/${p.slug}`}
      className="group block relative aspect-[3/4] overflow-hidden border border-rule rounded-sm transition-transform duration-700 ease-out hover:scale-[1.02]"
    >
      <img
        src={`/work/${p.slug}/thumb.jpg`}
        alt={p.title}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/about/portrait-pool.jpg';
        }}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-active:scale-105"
        style={{ filter: 'grayscale(0.4) brightness(0.78)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent transition-opacity duration-500 group-hover:from-ink/95 group-active:from-ink/95" />
      <div className="absolute top-3 right-3 font-mono uppercase text-amber/80 text-[9px] tracking-[0.3em]">
        {p.category}
      </div>
      <div className="absolute bottom-5 left-5 right-5">
        <div className="h-px w-10 bg-amber/40 mb-2 transition-all duration-500 group-hover:w-16 group-active:w-16 group-hover:bg-amber group-active:bg-amber" />
        <h3 className="font-display text-paper text-xl md:text-2xl mb-1 group-hover:text-amber group-active:text-amber transition-colors duration-500">
          {p.title}
        </h3>
        <p className="font-sans text-paper-dim text-xs md:text-sm leading-snug max-w-[95%]">
          {p.subtitle}
        </p>
        <span className="font-mono uppercase text-paper-dim text-[9px] tracking-[0.3em] mt-3 inline-block opacity-0 group-hover:opacity-100 group-active:opacity-100 group-hover:text-amber group-active:text-amber transition-opacity duration-500">
          VIEW →
        </span>
      </div>
    </a>
  );
}
