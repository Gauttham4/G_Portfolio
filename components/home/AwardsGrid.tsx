'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  animate,
  useInView,
  useMotionValueEvent,
} from 'framer-motion';
import OutlinedSVGText from '@/components/decoration/OutlinedSVGText';
import ShipsLeke from '@/components/leke/ShipsLeke';

type Stat = {
  num: number;
  l1: string;
  l2: string;
};

const STATS: Stat[] = [
  { num: 28, l1: 'Shipped', l2: 'Projects' },
  { num: 5, l1: 'Hackathons', l2: 'Attended' },
  { num: 1, l1: 'IJIRE', l2: 'Publication' },
  { num: 3, l1: 'Internships', l2: 'Completed' },
];

function CountUp({ to, reduce, inView }: { to: number; reduce: boolean; inView: boolean }) {
  const mv = useMotionValue(reduce ? to : 0);
  const [display, setDisplay] = useState(reduce ? to : 0);

  useMotionValueEvent(mv, 'change', (latest) => {
    setDisplay(Math.round(latest));
  });

  useEffect(() => {
    if (reduce) {
      setDisplay(to);
      return;
    }
    if (!inView) return;
    const controls = animate(mv, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, to, reduce, mv]);

  return <>{display}</>;
}

const containerV = {
  initial: {},
  animate: { transition: { staggerChildren: 0.12 } },
} as const;
const itemV = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function AwardsGrid() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const inView = useInView(listRef, { once: true, margin: '-15% 0px' });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-40, 40]);

  return (
    <section
      ref={ref}
      aria-label="By the numbers"
      className="relative w-full overflow-hidden bg-ink py-32 md:py-48"
    >
      <div className="pointer-events-none absolute inset-x-0 top-12 z-0 px-6 opacity-50 md:top-16 md:px-12">
        <OutlinedSVGText text="EVIDENCE" />
      </div>

      <motion.div
        className="pointer-events-none absolute right-6 top-10 z-10 hidden md:block"
        animate={reduce ? {} : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ShipsLeke size={150} />
      </motion.div>

      <motion.div
        style={{ y }}
        className="relative z-20 mx-auto max-w-[1500px] px-6 md:px-12"
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 font-mono text-[11px] uppercase tracking-[0.35em] text-amber/80 md:mb-24"
        >
          ◇  By the numbers  ·  2020 → 2026
        </motion.p>

        <motion.ul
          ref={listRef}
          variants={containerV}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-10% 0px' }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-16"
        >
          {STATS.map((s) => (
            <motion.li key={s.l1} variants={itemV} className="flex flex-col">
              <span
                className="font-display font-light leading-none text-amber tabular-nums"
                style={{ fontSize: 'clamp(3.5rem, 14vw, 9rem)' }}
              >
                <CountUp to={s.num} reduce={reduce} inView={inView} />
              </span>
              <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim md:text-xs">
                {s.l1}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim md:text-xs">
                {s.l2}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
