'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

type Mode = 'words' | 'letters' | 'lines';
type AsTag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

const TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

type Props = {
  text: string;
  as?: AsTag;
  mode?: Mode;
  delay?: number;
  stagger?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function AnimatedHeading({
  text,
  as = 'h1',
  mode = 'words',
  delay = 0,
  stagger,
  className = '',
  style,
}: Props) {
  const reduce = useReducedMotion();
  const Tag = TAGS[as];

  // Split text deterministically (so SSR + client match).
  const tokens = useMemo(() => {
    if (mode === 'letters') return Array.from(text);
    if (mode === 'lines') return text.split(/\n/);
    // words: keep whitespace as separators between word atoms
    return text.split(/(\s+)/);
  }, [text, mode]);

  const stepDelay =
    stagger ?? (mode === 'letters' ? 0.04 : mode === 'words' ? 0.08 : 0.18);

  if (reduce) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }

  const containerV: Variants = {
    hidden: {},
    visible: {
      transition: { delayChildren: delay, staggerChildren: stepDelay },
    },
  };

  const itemV: Variants = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: { duration: 0.7, ease: [...EASE] as [number, number, number, number] },
    },
  };

  return (
    <Tag className={className} style={style}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
        variants={containerV}
        style={{ display: 'inline-block' }}
      >
        {tokens.map((tok, i) => {
          if (mode !== 'letters' && /^\s+$/.test(tok)) {
            return <span key={i}>{tok}</span>;
          }
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                verticalAlign: 'top',
              }}
            >
              <motion.span
                variants={itemV}
                style={{ display: 'inline-block', whiteSpace: 'pre' }}
              >
                {tok === '' ? ' ' : tok}
              </motion.span>
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
}
