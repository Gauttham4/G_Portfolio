'use client';

import { motion, useReducedMotion } from 'framer-motion';

export interface ReactorLoaderProps {
  size?: number;
  label?: string;
}

/**
 * Indefinite radial loader. Three concentric rings + pulsing core.
 */
export default function ReactorLoader({ size = 88, label }: ReactorLoaderProps) {
  const reduce = useReducedMotion();
  const cx = 50;
  const cy = 50;

  // Inner crimson dashed arc — drawn as a near-full circle with dashes.
  const innerR = 20;
  const innerC = 2 * Math.PI * innerR;

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        style={{ overflow: 'visible' }}
      >
        {/* Outer ring — gold dashed, rotating CW */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={44}
          stroke="#FFB347"
          strokeWidth={1.2}
          strokeDasharray="6 4"
          strokeOpacity={0.85}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={
            reduce ? undefined : { duration: 4, ease: 'linear', repeat: Infinity }
          }
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* Middle ring — nano-blue solid arc with 180° gap, CCW */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={32}
          stroke="#4FC3F7"
          strokeWidth={1.6}
          strokeDasharray={`${Math.PI * 32} ${Math.PI * 32}`}
          strokeLinecap="round"
          animate={reduce ? undefined : { rotate: -360 }}
          transition={
            reduce ? undefined : { duration: 2.4, ease: 'easeInOut', repeat: Infinity }
          }
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* Inner ring — crimson dashed, CW */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={innerR}
          stroke="#C8102E"
          strokeWidth={1.4}
          strokeDasharray="3 3"
          strokeOpacity={0.9}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={
            reduce ? undefined : { duration: 1.6, ease: 'linear', repeat: Infinity }
          }
          style={{ transformOrigin: '50px 50px', strokeDashoffset: innerC * 0 }}
        />

        {/* Core — nano blue pulsing */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={6}
          fill="#4FC3F7"
          animate={reduce ? undefined : { scale: [0.85, 1.15, 0.85] }}
          transition={
            reduce ? undefined : { duration: 0.9, ease: 'easeInOut', repeat: Infinity }
          }
          style={{ transformOrigin: '50px 50px', filter: 'drop-shadow(0 0 6px #4FC3F7)' }}
        />
      </motion.svg>

      {label ? (
        <span
          className="font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{ color: 'rgba(255,179,71,0.6)' }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}
