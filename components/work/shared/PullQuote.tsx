'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties } from 'react';

type Props = {
  exhibit?: string;       // e.g. "EXHIBIT A" or "QUOTE 01"
  quote: string;
  context?: string;
  rotate?: number;        // small rotation for paper-card variants
  surface?: string;       // bg color
  border?: string;
  text?: string;
  accent?: string;
  font?: 'display' | 'mono';
  pin?: boolean;          // crimson corner pin
  delay?: number;
};

export default function PullQuote({
  exhibit,
  quote,
  context,
  rotate = 0,
  surface = 'transparent',
  border = 'rgba(255,255,255,0.12)',
  text = 'currentColor',
  accent = 'currentColor',
  pin = false,
  delay = 0,
}: Props) {
  const reduce = useReducedMotion();

  const style: CSSProperties = {
    background: surface,
    borderColor: border,
    color: text,
    transform: `rotate(${rotate}deg)`,
  };

  return (
    <motion.figure
      className="relative border rounded-sm p-8 md:p-12"
      style={style}
      initial={reduce ? false : { opacity: 0, y: 32, scale: 0.97 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {pin ? (
        <span
          aria-hidden
          className="absolute -top-2 -left-2 w-5 h-5 rounded-full shadow-md"
          style={{ background: '#B81E2A' }}
        />
      ) : null}
      {exhibit ? (
        <figcaption
          className="font-mono uppercase text-[10px] tracking-[0.35em] mb-6 opacity-70"
          style={{ color: accent }}
        >
          {exhibit}
        </figcaption>
      ) : null}
      <blockquote
        className="font-display italic leading-[1.05] tracking-tight"
        style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.6rem)' }}
      >
        &ldquo;{quote}&rdquo;
      </blockquote>
      {context ? (
        <p
          className="mt-6 font-sans text-sm md:text-base max-w-prose opacity-75 leading-relaxed"
          style={{ color: text }}
        >
          {context}
        </p>
      ) : null}
    </motion.figure>
  );
}
