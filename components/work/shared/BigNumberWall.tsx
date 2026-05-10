'use client';

import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef } from 'react';

type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  /** if not numeric (e.g. "IJIRE PAPER"), set raw */
  raw?: string;
};

type Props = {
  stats: Stat[];
  numberColor?: string;
  labelColor?: string;
  borderColor?: string;
  flashColor?: string;
};

export default function BigNumberWall({
  stats,
  numberColor = 'currentColor',
  labelColor = 'currentColor',
  borderColor = 'rgba(255,255,255,0.1)',
  flashColor = 'transparent',
}: Props) {
  return (
    <section
      className="relative px-6 md:px-12 py-32"
      style={{ borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
        {stats.map((s, i) => (
          <Cell
            key={i}
            stat={s}
            index={i}
            numberColor={numberColor}
            labelColor={labelColor}
            borderColor={borderColor}
            flashColor={flashColor}
          />
        ))}
      </div>
    </section>
  );
}

function Cell({
  stat,
  index,
  numberColor,
  labelColor,
  borderColor,
  flashColor,
}: {
  stat: Stat;
  index: number;
  numberColor: string;
  labelColor: string;
  borderColor: string;
  flashColor: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => Math.round(v).toString());
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView || stat.raw) return;
    if (reduce) {
      mv.set(stat.value);
      return;
    }
    const controls = animate(mv, stat.value, {
      duration: 1.6,
      delay: 0.08 * index,
      ease: [0.22, 0.61, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, mv, stat.value, stat.raw, index, reduce]);

  useEffect(() => {
    return display.on('change', (v) => {
      if (textRef.current) textRef.current.textContent = v;
    });
  }, [display]);

  return (
    <div
      ref={ref}
      className="relative px-3 md:px-4 py-2 md:py-3 transition-colors"
      style={{
        borderLeft: `1px solid ${inView ? flashColor : borderColor}`,
        transition: 'border-color 600ms cubic-bezier(0.22,0.61,0.36,1)',
      }}
    >
      <div
        className="font-display leading-[0.85] tracking-tight"
        style={{
          color: numberColor,
          fontSize: 'clamp(2.6rem, 8vw, 6rem)',
        }}
      >
        {stat.raw ? (
          <span>{stat.raw}</span>
        ) : (
          <>
            {stat.prefix ?? ''}
            <span ref={textRef}>0</span>
            {stat.suffix ?? ''}
          </>
        )}
      </div>
      <div
        className="mt-3 font-mono uppercase tracking-[0.25em] text-[10px] md:text-xs opacity-80"
        style={{ color: labelColor }}
      >
        {stat.label}
      </div>
    </div>
  );
}
