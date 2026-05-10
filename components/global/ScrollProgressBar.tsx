'use client';

import { motion, useScroll, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * 2px amber bar fixed at top of viewport, scaled by document scroll progress.
 * Self-gates to /work/[slug] routes only.
 */
export default function ScrollProgressBar() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();

  if (!pathname?.startsWith('/work/')) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-amber origin-left z-[60] pointer-events-none"
      style={reduced ? { scaleX: 1 } : { scaleX: scrollYProgress }}
      aria-hidden
    />
  );
}
