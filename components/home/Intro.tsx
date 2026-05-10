'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import Image from 'next/image';

const EASE = [0.22, 1, 0.36, 1] as const;

const PARA_1 =
  "Twenty-eight projects across AI, edtech, finance, safety, and field operations. From a paper-and-pen tuition fee book turned into a four-role finance approval pipeline, to a self-evolving multi-agent AI that teaches itself new skills, to a women's-safety platform with offline emergency queueing across mobile, web, and Python AI.";

const PARA_2 =
  "Each one started the same way — somebody I knew had a problem nobody else was going to solve. Pick the smallest tool that fixes it. Ship the working product. Move on.";

const STATS: { value: number; suffix?: string; label: string }[] = [
  { value: 28, label: 'SHIPPED PROJECTS' },
  { value: 5,  label: 'HACKATHONS' },
  { value: 1,  label: 'IJIRE PAPER' },
  { value: 3,  label: 'INTERNSHIPS' },
];

/* ---------- Character-mask paragraph driven by scroll ---------- */
function ScrollParagraph({
  text,
  progress,
  start,
  end,
  className = '',
}: {
  text: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  className?: string;
}) {
  const words = useMemo(() => text.split(/(\s+)/), [text]);
  const totalChars = text.length;
  let charIndex = 0;
  return (
    <p className={className}>
      {words.map((w, i) => (
        <span key={i} className={w.match(/\s/) ? '' : 'inline-block'}>
          {Array.from(w).map((c) => {
            const t = charIndex / totalChars;
            const ramp = start + (end - start) * t;
            charIndex++;
            return (
              <Char
                key={`${i}-${charIndex}`}
                ch={c}
                progress={progress}
                from={Math.max(0, ramp - 0.02)}
                to={Math.min(1, ramp + 0.04)}
              />
            );
          })}
        </span>
      ))}
    </p>
  );
}

function Char({ ch, progress, from, to }: { ch: string; progress: MotionValue<number>; from: number; to: number }) {
  const opacity = useTransform(progress, [from, to], [0.18, 1]);
  return (
    <motion.span style={{ opacity }}>{ch}</motion.span>
  );
}

/* ---------- Count-up numeral (rolls when in view) ---------- */
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (reduce) {
      setVal(to);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let started = false;
    let raf = 0;

    const start = () => {
      if (started) return;
      started = true;
      const startTime = performance.now();
      const duration = 1400;
      const tick = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        setVal(Math.round(eased * to));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            start();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(el);

    // Safety: if observer never fires (e.g. element already in viewport at mount), kick after 800ms
    const fallback = setTimeout(() => start(), 800);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
    };
  }, [to, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {val}
      {suffix}
    </span>
  );
}

/* ---------- Component ---------- */
export default function Intro() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Map scroll over the section to (0..1) with our two paragraphs splitting the middle 65%.
  const headlineY = useTransform(scrollYProgress, [0, 0.4], reduce ? ['0%', '0%'] : ['10%', '0%']);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.18, 0.85, 1], [0, 1, 1, 0.6]);

  // Right-column portraits parallax (different speeds)
  const photoYa = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-18%']);
  const photoYb = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-8%']);
  const photoYc = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-26%']);

  return (
    <section
      ref={sectionRef}
      aria-label="Intro"
      className="relative w-full bg-ink overflow-hidden py-32 md:py-44"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Top kicker + headline */}
        <motion.div
          style={{ y: headlineY, opacity: headlineOpacity }}
          className="will-change-transform"
        >
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-amber">
            §  INTRO — WHO I AM
          </p>
          <h2
            className="mb-10 max-w-4xl font-display text-paper text-4xl md:text-6xl lg:text-7xl"
            style={{ lineHeight: 1.04, letterSpacing: '-0.025em', fontWeight: 400 }}
          >
            A builder who <span className="italic text-amber">finishes</span> what he starts.
          </h2>
        </motion.div>

        {/* Stats strip — count-up numerals on inView */}
        <div className="mb-16 grid grid-cols-2 gap-y-8 sm:grid-cols-4 md:gap-x-10 border-t border-rule pt-10">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <span
                className="font-display text-amber"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 0.9, letterSpacing: '-0.03em' }}
              >
                <CountUp to={s.value} suffix={s.suffix} />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Two-column main */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          {/* Left: character-mask paragraphs + tagline */}
          <div className="md:col-span-7">
            <ScrollParagraph
              text={PARA_1}
              progress={scrollYProgress}
              start={0.15}
              end={0.55}
              className="mb-8 font-sans text-lg leading-relaxed text-paper-dim md:text-2xl"
            />
            <ScrollParagraph
              text={PARA_2}
              progress={scrollYProgress}
              start={0.55}
              end={0.85}
              className="mb-12 font-sans text-lg leading-relaxed text-paper-dim md:text-2xl"
            />

            {/* Tagline — fades in late */}
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="font-display italic text-amber"
              style={{ fontSize: 'clamp(1.75rem, 3.6vw, 3rem)', lineHeight: 1.15 }}
            >
              Range. Ship rate. Real problems. — That&apos;s the work.
            </motion.p>

            {/* CTA row */}
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a
                href="/about"
                className="inline-flex items-center gap-2 border border-amber/60 bg-amber/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-amber transition-colors hover:bg-amber hover:text-ink"
              >
                Read the full case file <span aria-hidden>→</span>
              </a>
              <a
                href="#acts-drilldown"
                className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper-dim transition-colors hover:text-amber"
              >
                Or jump to the work ↓
              </a>
            </motion.div>
          </div>

          {/* Right: parallax portrait stack */}
          <div className="md:col-span-5 relative h-[440px] md:h-[640px]">
            <motion.div
              style={{ y: photoYa, rotate: -3 }}
              className="absolute right-2 top-0 w-[58%] aspect-[3/4] overflow-hidden border border-rule will-change-transform"
            >
              <Image
                src="/about/portrait-editorial.jpg"
                alt="Gauttham R."
                fill
                sizes="(min-width:768px) 25vw, 60vw"
                className="object-cover"
                style={{ filter: 'grayscale(0.15) brightness(0.92)' }}
              />
            </motion.div>
            <motion.div
              style={{ y: photoYb, rotate: 2 }}
              className="absolute left-0 top-28 w-[52%] aspect-[3/4] overflow-hidden border border-rule will-change-transform shadow-2xl"
            >
              <Image
                src="/about/portrait-pool.jpg"
                alt="Gauttham R."
                fill
                sizes="(min-width:768px) 22vw, 55vw"
                className="object-cover"
              />
            </motion.div>
            <motion.div
              style={{ y: photoYc, rotate: -1 }}
              className="absolute right-0 bottom-0 w-[48%] aspect-[4/5] overflow-hidden border border-rule will-change-transform"
            >
              <Image
                src="/about/portrait-cafe.jpg"
                alt="Gauttham R."
                fill
                sizes="(min-width:768px) 20vw, 50vw"
                className="object-cover"
              />
            </motion.div>

            {/* Stamp */}
            <div className="absolute bottom-2 left-2 z-10 flex flex-col gap-1 bg-ink/85 backdrop-blur px-3 py-2 border border-paper-soft">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-amber">GAUTTHAM R</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-paper-dim">PUDUCHERRY · 2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
