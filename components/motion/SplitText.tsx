'use client';

import { motion, type Variants } from 'framer-motion';
import { easing } from '@/lib/motion-tokens';

type Props = {
  children: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
};

const containerVariants = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren: delay,
      staggerChildren: stagger,
    },
  },
});

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [...easing.suitEject] as [number, number, number, number] },
  },
};

export default function SplitText({
  children,
  className = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.04,
}: Props) {
  const words = children.split(/(\s+)/);
  return (
    <motion.span
      className={className}
      variants={containerVariants(stagger, delay)}
      initial="hidden"
      animate="visible"
      style={{ display: 'inline-block' }}
    >
      {words.map((w, i) =>
        /\s+/.test(w) ? (
          <span key={i}>{w}</span>
        ) : (
          <motion.span
            key={i}
            className={wordClassName}
            variants={wordVariants}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {w}
          </motion.span>
        )
      )}
    </motion.span>
  );
}
