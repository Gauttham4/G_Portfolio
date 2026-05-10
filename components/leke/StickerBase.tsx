'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  text: string;          // text to wrap around the perimeter
  size?: number;         // px diameter
  duration?: number;     // rotation duration in seconds
  reverse?: boolean;     // counter-rotate
  innerGlyph?: ReactNode; // small thing in the centre (e.g. "→")
  className?: string;
  ariaLabel?: string;
};

/**
 * Circular text-on-circle sticker primitive (madebycat-style "leke").
 * Slowly rotates; respects reduced motion.
 */
export default function StickerBase({
  text,
  size = 160,
  duration = 24,
  reverse = false,
  innerGlyph,
  className,
  ariaLabel,
}: Props) {
  const reduce = useReducedMotion();
  const id = `path-${Math.abs(hash(text))}`;
  const r = 50; // inside viewBox 0..120

  return (
    <motion.div
      aria-label={ariaLabel ?? text}
      role="img"
      className={className}
      style={{ width: size, height: size }}
      animate={reduce ? undefined : { rotate: reverse ? -360 : 360 }}
      transition={
        reduce
          ? undefined
          : { duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }
      }
    >
      <svg
        viewBox="0 0 120 120"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id={id}
            d={`M 60,60 m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`}
            fill="none"
          />
        </defs>
        <circle
          cx="60"
          cy="60"
          r={r + 6}
          fill="none"
          stroke="rgba(232,184,99,0.35)"
          strokeWidth="0.5"
        />
        <circle
          cx="60"
          cy="60"
          r={r - 8}
          fill="none"
          stroke="rgba(232,184,99,0.18)"
          strokeWidth="0.5"
        />
        <text
          fill="#E8B863"
          style={{
            fontFamily: 'var(--font-mono), ui-monospace, monospace',
            fontSize: '8px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          <textPath href={`#${id}`} startOffset="0">
            {text}
          </textPath>
        </text>
        {innerGlyph !== undefined && (
          <g transform="translate(60 64)" style={{ fill: '#E8B863' }}>
            <text
              textAnchor="middle"
              style={{
                fontFamily: 'var(--font-mono), ui-monospace, monospace',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {innerGlyph}
            </text>
          </g>
        )}
      </svg>
    </motion.div>
  );
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}
