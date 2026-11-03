'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionTemplate,
  type MotionValue,
} from 'framer-motion';
import Reveal from '@/components/motion/Reveal';

type Featured = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  tone: string;
};

const FEATURED: Featured[] = [
  { slug: 'jarvis',             title: 'JARVIS',             subtitle: 'My personal AI assistant, built for me',                       category: 'AI · ASSISTANT',        tone: '#7C9CFF' },
  { slug: 'final-year-project', title: 'CrimeIntellX',       subtitle: "A detective's assistant for cases, evidence & call records",   category: 'AI · FORENSICS',        tone: '#E04050' },
  { slug: 'src-task',           title: 'SRC Task',           subtitle: 'A field-service app, from the first call to payment',          category: 'FIELD SERVICE · MOBILE', tone: '#E8B863' },
  { slug: 'electrobike',        title: 'ElectroBike',        subtitle: 'A smart electric bike that thinks with you',                   category: 'PRODUCT · IoT',         tone: '#4ADE80' },
  { slug: 'spaceforge',         title: 'SpaceForge',         subtitle: 'A cinematic 3D landing page for a tech startup',               category: 'CINEMATIC · 3D',        tone: '#C77DFF' },
  { slug: 'viksit-ai',          title: 'Viksit.AI',          subtitle: 'An AI workspace that codes, searches & talks back',            category: 'AI · WORKSPACE',        tone: '#5AC8FA' },
  { slug: 'dhanoos-excellence', title: 'Excellence Academy', subtitle: 'Student coaching & admissions, all in one place',              category: 'PLATFORM · EDU',        tone: '#E8B863' },
  { slug: 'thaazhai',           title: 'THAAZHAI',           subtitle: 'Where farmers, buyers & agri-experts meet',                    category: 'COMMUNITY · AGRI',      tone: '#4ADE80' },
  { slug: 'alzhmeric',          title: 'Alzhmeric',          subtitle: "A care companion for Alzheimer's patients & their families",   category: 'COMMUNITY · CARE',      tone: '#FF8FA3' },
];

// The red string between pins: one swooping curve per card, repeated along the row.
const STRING_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='30' viewBox='0 0 100 30' preserveAspectRatio='none'><path d='M0 5 Q50 29 100 5' fill='none' stroke='%23E04050' stroke-width='1.7' stroke-linecap='round' stroke-opacity='0.85'/></svg>\")";

const pad = (n: number) => String(n + 1).padStart(2, '0');

/**
 * Perf: the pinned "scroll-to-slide" version is a 400vh sticky section driven by scroll maths.
 * That is great with a mouse wheel but janky on phones (URL-bar resize, momentum scroll,
 * every image loading at once). So:
 *   - desktop with a fine pointer  -> pinned rail, cards tilt and light up as they pass the centre
 *   - phones / touch / reduced motion -> a native horizontal swipe row with snap (same pins and string, CSS only)
 * The SSR/first-paint default is the lightweight swipe row; desktop upgrades after mount.
 */
export default function PinnedHorizontalRail() {
  const reduced = useReducedMotion();
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const apply = () => setPinned(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  if (pinned && !reduced) return <PinnedRail />;
  return <SwipeRail />;
}

function Header({ hint }: { hint: string }) {
  return (
    <div className="px-6 md:px-12 max-w-7xl w-full mx-auto mb-8 md:mb-12">
      <Reveal dir="left" className="font-mono uppercase text-amber/70 text-[10px] tracking-[0.3em] mb-4">
        § THE WORK · {FEATURED.length} OF 31
      </Reveal>
      <Reveal
        dir="left"
        delay={0.1}
        className="font-display text-paper text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[0.95]"
      >
        Selected projects.
      </Reveal>
      <Reveal dir="left" delay={0.2} className="font-sans text-paper-dim text-sm md:text-base mt-3 max-w-md">
        {hint}
      </Reveal>
    </div>
  );
}

/* ---------- Phones / touch: native swipe row (CSS only) ---------- */
function SwipeRail() {
  return (
    <section className="relative w-full bg-ink py-16 md:py-24" aria-label="Selected work">
      <Header hint="Swipe to browse." />
      <div
        className="overflow-x-auto snap-x snap-mandatory scroll-px-6 md:scroll-px-12 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorX: 'contain' }}
      >
        <div className="relative flex w-max gap-4 px-6 pt-6 [--px:1.5rem] [--w:72vw] sm:[--w:44vw] md:px-12 md:[--px:3rem] md:[--w:30vw]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[7px] h-[30px]"
            style={{
              backgroundImage: STRING_BG,
              backgroundRepeat: 'repeat-x',
              backgroundSize: 'calc(var(--w) + 1rem) 30px',
              backgroundPositionX: 'calc(var(--px) + var(--w) / 2)',
            }}
          />
          {FEATURED.map((p, i) => (
            <div key={p.slug} className="relative shrink-0 snap-start" style={{ width: 'var(--w)' }}>
              <Pin tone={p.tone} />
              <Card p={p} i={i} eager={i < 2} tilt={i % 2 ? 1.1 : -1.1} />
            </div>
          ))}
        </div>
      </div>
      <p className="px-6 md:px-12 mt-4 font-mono uppercase text-paper-dim text-[10px] tracking-[0.3em]">
        ← SWIPE — {FEATURED.length} PROJECTS →
      </p>
    </section>
  );
}

function Pin({ tone }: { tone: string }) {
  return (
    <span
      aria-hidden
      className="absolute -top-[14px] left-1/2 z-20 h-3 w-3 -translate-x-1/2 rounded-full"
      style={{ background: '#E04050', boxShadow: `0 0 0 3px rgba(224,64,80,0.25), 0 0 14px ${tone}66` }}
    />
  );
}

/* ---------- Desktop: pinned, scroll-scrubbed rail ---------- */
function PinnedRail() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [maxX, setMaxX] = useState(0);
  const [centers, setCenters] = useState<number[]>(() => FEATURED.map((_, i) => i / (FEATURED.length - 1)));

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    const measure = () => {
      const row = rowRef.current;
      if (!row) return;
      const mx = Math.max(0, row.scrollWidth - window.innerWidth);
      setMaxX(mx);
      if (mx > 0) {
        const cards = Array.from(row.querySelectorAll<HTMLElement>('[data-card]'));
        if (cards.length === FEATURED.length) {
          // progress at which each card's centre crosses the middle of the screen
          setCenters(cards.map((c) => Math.min(1.05, Math.max(-0.05, (c.offsetLeft + c.offsetWidth / 2 - window.innerWidth / 2) / mx))));
        }
      }
    };
    // debounced so resizing doesn't re-layout on every pixel
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(measure, 120);
    };
    measure();
    window.addEventListener('resize', onResize, { passive: true });
    const t2 = setTimeout(measure, 500);
    // images change the row width once they load
    const row = rowRef.current;
    const imgs = row ? Array.from(row.querySelectorAll('img')) : [];
    imgs.forEach((im) => im.addEventListener('load', measure, { once: true }));
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);

  return (
    <section ref={sectionRef} className="relative w-full bg-ink" style={{ height: '400vh' }} aria-label="Selected work">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-center">
        <Header hint="Scroll to slide." />
        <motion.div
          ref={rowRef}
          style={{ x }}
          className="relative flex w-max gap-[2vw] pl-[6vw] pr-[6vw] pt-6 will-change-transform [--w:30vw] lg:[--w:26vw] xl:[--w:24vw]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[7px] h-[30px]"
            style={{
              backgroundImage: STRING_BG,
              backgroundRepeat: 'repeat-x',
              backgroundSize: 'calc(var(--w) + 2vw) 30px',
              backgroundPositionX: 'calc(6vw + var(--w) / 2)',
            }}
          />
          {FEATURED.map((p, i) => (
            <PinnedCard key={p.slug} p={p} i={i} center={centers[i]} progress={scrollYProgress} />
          ))}
        </motion.div>
        <div className="px-6 md:px-12 max-w-7xl w-full mx-auto mt-8">
          <p className="font-mono uppercase text-paper-dim text-[10px] tracking-[0.3em]">
            ↓ KEEP SCROLLING — {FEATURED.length} PROJECTS ROLL PAST
          </p>
        </div>
      </div>
    </section>
  );
}

/** A card that tilts in from the right, straightens at the centre of the screen, and lights up there. */
function PinnedCard({ p, i, center, progress }: { p: Featured; i: number; center: number; progress: MotionValue<number> }) {
  const win = 0.3;
  const rotate = useTransform(progress, [center - win, center, center + win], [5, 0, -5]);
  const y = useTransform(progress, [center - win, center, center + win], [30, 0, 30]);
  const scale = useTransform(progress, [center - win, center, center + win], [0.94, 1, 0.94]);
  const gray = useTransform(progress, [center - win, center, center + win], [0.7, 0, 0.7]);
  const bright = useTransform(progress, [center - win, center, center + win], [0.62, 0.98, 0.62]);
  const filter = useMotionTemplate`grayscale(${gray}) brightness(${bright})`;
  const glow = useTransform(progress, [center - 0.12, center, center + 0.12], [0, 1, 0]);
  const glowPx = useTransform(glow, (g) => g * 46);
  const shadow = useMotionTemplate`0 24px 60px rgba(0,0,0,0.55), 0 0 ${glowPx}px ${p.tone}55`;

  return (
    <motion.div data-card className="relative shrink-0" style={{ width: 'var(--w)', rotate, y, scale, boxShadow: shadow, transformOrigin: '50% 0%' }}>
      <Pin tone={p.tone} />
      <Card p={p} i={i} eager={i < 4} filter={filter} />
    </motion.div>
  );
}

function Card({
  p,
  i,
  eager = false,
  tilt = 0,
  filter,
}: {
  p: Featured;
  i: number;
  eager?: boolean;
  tilt?: number;
  filter?: MotionValue<string>;
}) {
  return (
    <Link
      href={`/work/${p.slug}`}
      className="group block relative aspect-[3/4] overflow-hidden rounded-2xl border transition-transform duration-500 ease-out hover:-translate-y-1.5"
      style={{
        borderColor: `${p.tone}55`,
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        background: `linear-gradient(160deg, ${p.tone}22, #0e0e10 60%)`,
      }}
    >
      <motion.img
        src={`/work/${p.slug}/thumb.jpg`}
        alt={p.title}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        width={600}
        height={800}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/about/portrait-pool.jpg';
        }}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-active:scale-105"
        style={filter ? { filter } : { filter: 'grayscale(0.35) brightness(0.8)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent transition-opacity duration-500 group-hover:from-ink/95 group-active:from-ink/95" />

      <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: p.tone }}>
          Case {pad(i)}
        </span>
        <span
          className="max-w-[70%] truncate rounded-full border px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] backdrop-blur-[2px]"
          style={{ borderColor: `${p.tone}77`, color: p.tone, background: 'rgba(10,10,10,0.55)' }}
        >
          {p.category}
        </span>
      </div>

      <div className="absolute bottom-5 left-5 right-5">
        <div className="h-px w-10 mb-2 transition-all duration-500 group-hover:w-16 group-active:w-16" style={{ background: p.tone }} />
        <h3 className="font-display text-paper text-xl md:text-2xl mb-1 group-hover:text-amber group-active:text-amber transition-colors duration-500">
          {p.title}
        </h3>
        <p className="font-sans text-paper-dim text-xs md:text-sm leading-snug max-w-[95%]">{p.subtitle}</p>
        <span className="font-mono uppercase text-paper-dim text-[9px] tracking-[0.3em] mt-3 inline-block opacity-0 group-hover:opacity-100 group-active:opacity-100 group-hover:text-amber group-active:text-amber transition-opacity duration-500">
          OPEN THE CASE →
        </span>
      </div>
    </Link>
  );
}
