'use client';

import { useRef, useEffect, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'framer-motion';

const TEXT = 'GAUTTHAM ⚡ ';

export default function ScrollVelocityBand() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [isFast, setIsFast] = useState(false);

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVel = useSpring(velocity, { damping: 50, stiffness: 400 });
  const x = useTransform(smoothVel, (v) => `${(v ?? 0) * -0.05}px`);
  // baseline drift: handled by CSS animation when velocity ~ 0

  useMotionValueEvent(smoothVel, 'change', (latest) => {
    setIsFast(Math.abs(latest) > 800);
  });

  // CSS keyframe drift baseline
  useEffect(() => {
    if (reduce) return;
    if (!ref.current) return;
  }, [reduce]);

  if (reduce) {
    return (
      <section aria-hidden className="relative w-full overflow-hidden bg-ink py-12">
        <div className="font-display text-center uppercase text-paper" style={{ fontSize: 'clamp(3rem, 10vw, 9rem)', letterSpacing: '-0.02em', lineHeight: 0.95 }}>
          {TEXT.repeat(2)}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      aria-hidden
      className="relative w-full overflow-hidden bg-ink"
      style={{ height: '50vh', display: 'flex', alignItems: 'center', borderTop: '1px solid var(--color-rule)', borderBottom: '1px solid var(--color-rule)' }}
    >
      <motion.div
        style={{
          x,
          color: isFast ? 'var(--color-amber)' : 'var(--color-paper)',
          transition: 'color 0.4s ease',
          whiteSpace: 'nowrap',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          fontSize: 'clamp(4rem, 16vw, 14rem)',
        }}
        className="font-display uppercase will-change-transform"
      >
        {TEXT.repeat(8)}
      </motion.div>
    </section>
  );
}
