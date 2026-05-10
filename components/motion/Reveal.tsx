'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

type Direction = 'left' | 'right' | 'top' | 'bottom';

type Props = {
  children: ReactNode;
  dir?: Direction;
  duration?: number;
  delay?: number;
  className?: string;
  as?: 'div' | 'span' | 'section' | 'p' | 'h2' | 'h3' | 'li';
} & Omit<HTMLMotionProps<'div'>, 'children'>;

export default function Reveal({
  children,
  dir = 'bottom',
  duration = 0.9,
  delay = 0,
  className,
  as = 'div',
  ...rest
}: Props) {
  const reduce = useReducedMotion();

  const xFrom = reduce ? 0 : dir === 'left' ? -120 : dir === 'right' ? 120 : 0;
  const yFrom = reduce ? 0 : dir === 'top' ? -60 : dir === 'bottom' ? 60 : 0;

  const Cmp = (motion[as] as typeof motion.div);

  return (
    <Cmp
      initial={{ opacity: 0, x: xFrom, y: yFrom }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{
        duration: reduce ? 0 : duration,
        ease: [0.22, 1, 0.36, 1],
        delay: reduce ? 0 : delay,
      }}
      className={className}
      {...rest}
    >
      {children}
    </Cmp>
  );
}
