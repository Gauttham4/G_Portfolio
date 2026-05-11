'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ACTS, type Act } from '@/lib/projects-manifest';

const EASE = [0.22, 1, 0.36, 1] as const;

// Per-slug card metadata reused across the carousel.
const META: Record<string, { title: string; subtitle: string; thumb: string }> = {
  'jarvis':              { title: 'JARVIS',              subtitle: 'Self-evolving multi-agent AI',          thumb: '/work/jarvis/thumb.jpg' },
  'final-year-project':  { title: 'CrimeIntellX',        subtitle: 'Forensic case assistant · IJIRE paper', thumb: '/work/final-year-project/thumb.jpg' },
  'electrobike':         { title: 'ElectroBike',         subtitle: 'Smart EV · voice booking · telemetry',  thumb: '/work/electrobike/thumb.jpg' },
  'spaceforge':          { title: 'SpaceForge',          subtitle: 'Cinematic 3D landing for a studio',     thumb: '/work/spaceforge/thumb.jpg' },
  'viksit-ai':           { title: 'Viksit.AI',           subtitle: 'AI workspace · multi-agent · voice',    thumb: '/work/viksit-ai/thumb.jpg' },
  'dhanoos-excellence':  { title: 'Excellence Academy',  subtitle: 'Coaching admissions + attendance',      thumb: '/work/dhanoos-excellence/thumb.jpg' },
  'thaazhai':            { title: 'THAAZHAI',            subtitle: 'Tamil-first agri marketplace',          thumb: '/work/thaazhai/thumb.jpg' },
  'alzhmeric':           { title: 'Alzhmeric',           subtitle: 'Alzheimer care companion',              thumb: '/work/alzhmeric/thumb.jpg' },
  'agri-tech-website':   { title: 'Agri-Tech',           subtitle: 'Vanilla-HTML farmers marketplace',      thumb: '/work/agri-tech-website/thumb.jpg' },
  'ea-tuition-app':      { title: 'EA Tuition',          subtitle: 'Paper book → working fee app',          thumb: '/work/ea-tuition-app/thumb.jpg' },
  'mindora':             { title: 'Mindora',             subtitle: 'Two-minute mindfulness',                thumb: '/work/mindora/thumb.jpg' },
  'fee-management':      { title: 'FeeFlow',             subtitle: 'Auto-reminder fee collection',          thumb: '/work/fee-management/thumb.jpg' },
  'voyagr':              { title: 'Voyagr',              subtitle: 'AI travel planner that books',          thumb: '/work/voyagr/thumb.jpg' },
  'student-portal':      { title: 'My Campus',           subtitle: 'Student portal · one window',           thumb: '/work/student-portal/thumb.jpg' },
  'teacher-portal':      { title: 'TeachDesk',           subtitle: 'Teacher tools · attendance + grading',  thumb: '/work/teacher-portal/thumb.jpg' },
  'invoice-system':      { title: 'ApprovePay',          subtitle: '4-role finance approval pipeline',      thumb: '/work/invoice-system/thumb.jpg' },
  'hotel-app':           { title: 'StayEasy',            subtitle: 'Hotel discovery + check-in',            thumb: '/work/hotel-app/thumb.jpg' },
  'jewelry-pos':         { title: 'GemPoint',            subtitle: 'Jewelry POS · audit trail',             thumb: '/work/jewelry-pos/thumb.jpg' },
  'market-pulse':        { title: 'MarketPulse',         subtitle: 'Realtime market dashboard',             thumb: '/work/market-pulse/thumb.jpg' },
  'darkwatch':           { title: 'DarkWatch',           subtitle: 'Dark-web breach detection',             thumb: '/work/darkwatch/thumb.jpg' },
  'careervisionx':       { title: 'CareerVisionX',       subtitle: 'AI career mentor for students',         thumb: '/work/careervisionx/thumb.jpg' },
  'vkmg-landing':        { title: 'VKMG',                subtitle: 'Cinematic IT consultancy site',         thumb: '/work/vkmg-landing/thumb.jpg' },
  'vkmg-report-app':     { title: 'VKMG Reports',        subtitle: 'Offline-first field reporting',         thumb: '/work/vkmg-report-app/thumb.jpg' },
  'zyntra':              { title: 'Zyntra',              subtitle: 'Digital agency that sells its vibe',    thumb: '/work/zyntra/thumb.jpg' },
  'divyadrishti':        { title: 'DivyaDrishti',        subtitle: 'Crowd-safety + predictive assist',      thumb: '/work/divyadrishti/thumb.jpg' },
  'cloud-provisioning':  { title: 'Cloud Provisioning',  subtitle: 'Self-service cloud dashboard',          thumb: '/work/cloud-provisioning/thumb.jpg' },
  'tvk':                 { title: 'TVK Connect',         subtitle: 'One-tap phone-number login',            thumb: '/work/tvk/thumb.jpg' },
  'medicine-search':     { title: 'MediFind',            subtitle: 'Pocket medicine reference',             thumb: '/work/medicine-search/thumb.jpg' },
};

const DOMAIN_ACCENT: Record<string, string> = {
  I: '#E8B863',
  II: '#7A9DCF',
  III: '#C77DFF',
  IV: '#FF6B9D',
  V: '#5BD6B6',
};

export default function WorksByDomain() {
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <section
      id="acts-drilldown"
      className="relative overflow-hidden bg-ink py-24 md:py-32"
    >
      {/* Aurora glow background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute -top-32 left-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #E8B863 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 -right-32 h-96 w-96 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #C77DFF 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #5BD6B6 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-12">
        {/* Header */}
        <div className="mb-12 md:mb-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber/80">
            § Works · By domain
          </p>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-paper md:text-7xl" style={{ lineHeight: 0.95 }}>
            Five domains.<br />
            <span className="italic text-amber">Twenty-eight ships.</span>
          </h2>
          <p className="mt-5 max-w-xl font-sans text-base text-paper-dim md:text-lg">
            Pick a domain. The projects inside slide in. Click any card to open the full case.
          </p>
        </div>

        {/* Domain selector — vertical accordion of glass tiles */}
        <div className="space-y-4 md:space-y-5">
          {ACTS.map((act) => (
            <DomainTile
              key={act.id}
              act={act}
              expanded={active === act.id}
              onToggle={() => setActive((prev) => (prev === act.id ? null : act.id))}
              reduce={reduce ?? false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function DomainTile({
  act,
  expanded,
  onToggle,
  reduce,
}: {
  act: Act;
  expanded: boolean;
  onToggle: () => void;
  reduce: boolean;
}) {
  const accent = DOMAIN_ACCENT[act.id] ?? '#E8B863';

  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.55, ease: EASE } }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border: `1px solid ${expanded ? accent + '66' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: expanded
          ? `0 30px 80px -20px ${accent}33, inset 0 1px 0 rgba(255,255,255,0.08)`
          : '0 8px 30px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Subtle gradient sheen */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `linear-gradient(135deg, ${accent}15 0%, transparent 50%)`,
        }}
        aria-hidden
      />

      {/* HEADER — clickable */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="relative z-10 flex w-full items-center justify-between gap-6 px-6 py-7 text-left md:px-10 md:py-10"
      >
        <div className="flex flex-1 items-baseline gap-4 md:gap-8">
          <span
            className="font-display tabular-nums"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 0.9,
              color: accent,
              fontWeight: 300,
              letterSpacing: '-0.03em',
            }}
          >
            {act.numeral}
          </span>
          <div className="flex-1 min-w-0">
            <h3
              className="font-display tracking-tight"
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                lineHeight: 1,
                color: '#FAFAFA',
                fontWeight: 400,
              }}
            >
              {act.name}
            </h3>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim md:text-xs">
              {act.tagline} · {act.projects.length} projects
            </p>
          </div>
        </div>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
          style={{
            border: `1px solid ${accent}66`,
            background: `${accent}10`,
          }}
        >
          <span className="text-lg" style={{ color: accent }}>+</span>
        </motion.span>
      </button>

      {/* EXPANDED — horizontal carousel */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative z-10 overflow-hidden"
          >
            <div className="px-2 pb-8 pt-2 md:px-6 md:pb-12">
              {/* Pull quote band */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 0.15, duration: 0.5 }}
                className="mb-6 px-4 font-display italic text-paper-dim md:mb-8 md:px-4"
                style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)' }}
              >
                &ldquo;{act.pullQuote}&rdquo;
              </motion.p>

              <ProjectCarousel act={act} accent={accent} reduce={reduce} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProjectCarousel({ act, accent, reduce }: { act: Act; accent: string; reduce: boolean }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [paused, setPaused] = useState(false);

  const updateNav = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateNav();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav);
    return () => {
      el.removeEventListener('scroll', updateNav);
      window.removeEventListener('resize', updateNav);
    };
  }, []);

  // Auto-scroll loop — left-to-right, loops back to start at the end.
  // Pauses on hover/touch/focus so user can read without fighting the motion.
  useEffect(() => {
    if (reduce) return;
    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;
    let last = performance.now();
    const SPEED = 32; // pixels per second — gentle drift

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused && el.scrollWidth > el.clientWidth + 4) {
        const max = el.scrollWidth - el.clientWidth;
        const next = el.scrollLeft + SPEED * dt;
        if (next >= max - 0.5) {
          // Snap back to start so the loop is seamless rather than jumpy at the end.
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollLeft = next;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, reduce]);

  const slide = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLAnchorElement>('a.carousel-card');
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir * 1.2, behavior: 'smooth' });
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Edge fade masks */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 md:w-20"
        style={{ background: 'linear-gradient(to right, rgba(13,13,13,0.95), transparent)' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 md:w-20"
        style={{ background: 'linear-gradient(to left, rgba(13,13,13,0.95), transparent)' }}
        aria-hidden
      />

      {/* Prev/Next */}
      <button
        type="button"
        onClick={() => slide(-1)}
        aria-label="Previous"
        disabled={!canPrev}
        className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-lg backdrop-blur-md transition-all hover:scale-110 disabled:opacity-0 md:left-4"
        style={{
          background: 'rgba(0,0,0,0.5)',
          border: `1px solid ${accent}66`,
          color: accent,
        }}
      >
        ←
      </button>
      <button
        type="button"
        onClick={() => slide(1)}
        aria-label="Next"
        disabled={!canNext}
        className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-lg backdrop-blur-md transition-all hover:scale-110 disabled:opacity-0 md:right-4"
        style={{
          background: 'rgba(0,0,0,0.5)',
          border: `1px solid ${accent}66`,
          color: accent,
        }}
      >
        →
      </button>

      {/* Scroll-snap track */}
      <div
        ref={scrollerRef}
        className="carousel-track flex gap-5 overflow-x-auto px-4 pb-6 md:gap-6 md:px-6"
        style={{
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
        }}
      >
        <style jsx>{`
          .carousel-track::-webkit-scrollbar { display: none; }
        `}</style>

        {act.projects.map((p, i) => {
          const m = META[p.slug] ?? { title: p.title, subtitle: '', thumb: `/work/${p.slug}/thumb.jpg` };
          return (
            <ProjectCard
              key={p.slug}
              slug={p.slug}
              title={m.title}
              subtitle={m.subtitle}
              thumb={m.thumb}
              accent={accent}
              index={i}
              reduce={reduce}
            />
          );
        })}
      </div>
    </div>
  );
}

function ProjectCard({
  slug,
  title,
  subtitle,
  thumb,
  accent,
  index,
  reduce,
}: {
  slug: string;
  title: string;
  subtitle: string;
  thumb: string;
  accent: string;
  index: number;
  reduce: boolean;
}) {
  const targetSlug = slug === 'final-year-project' ? 'final-year-project' : slug;
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
      className="flex-shrink-0"
      style={{ scrollSnapAlign: 'start' }}
    >
      <Link
        href={`/work/${targetSlug}`}
        className="carousel-card group relative block aspect-[3/4] w-[78vw] max-w-[340px] overflow-hidden rounded-2xl transition-transform duration-500 hover:-translate-y-2 sm:w-[320px] md:w-[360px]"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(16px) saturate(160%)',
          WebkitBackdropFilter: 'blur(16px) saturate(160%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: `0 20px 60px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        {/* Image */}
        <Image
          src={thumb}
          alt={title}
          fill
          sizes="(min-width: 768px) 360px, 80vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/about/portrait-pool.jpg'; }}
        />

        {/* Constant dim layer for legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.88) 100%)',
          }}
        />

        {/* Accent ring on hover */}
        <span
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
          style={{ boxShadow: `inset 0 0 0 1.5px ${accent}` }}
        />

        {/* Top — index pill */}
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
          <span
            className="rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.3em] backdrop-blur-md"
            style={{
              background: 'rgba(0,0,0,0.45)',
              color: accent,
              border: `1px solid ${accent}55`,
            }}
          >
            N° {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Bottom — title + subtitle + CTA */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
          <h4
            className="font-display tracking-tight text-paper transition-colors duration-300 group-hover:text-amber"
            style={{
              fontSize: 'clamp(1.4rem, 2.4vw, 1.8rem)',
              lineHeight: 1.05,
              fontWeight: 500,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h4>
          <p className="mt-1.5 line-clamp-2 font-sans text-sm text-paper-dim md:text-[15px]">
            {subtitle}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>
              Open case →
            </span>
            <span
              className="h-px flex-1 ml-3 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
              style={{ background: accent }}
              aria-hidden
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
