'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Tiny fixed-position dot that follows the cursor with spring damping.
 * Grows into an outlined ring on hover over interactive elements.
 * Hidden on touch / coarse-pointer devices.
 */
export default function MagneticCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 360, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 360, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (coarse) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      const interactive = !!target?.closest?.('a, button, [role="button"], input, textarea, select, label');
      setHovering(interactive);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [x, y]);

  if (!enabled || reduced) return null;

  const size = hovering ? 24 : 8;

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 z-[70] pointer-events-none rounded-full"
      style={{
        x: sx,
        y: sy,
        width: size,
        height: size,
        translateX: '-50%',
        translateY: '-50%',
        backgroundColor: hovering ? 'transparent' : 'var(--color-amber)',
        border: hovering ? '1.5px solid var(--color-amber)' : 'none',
        mixBlendMode: 'difference',
        transition: 'width 180ms ease, height 180ms ease, background-color 180ms ease, border 180ms ease',
      }}
    />
  );
}
