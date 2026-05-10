'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface NanoAssembleProps {
  size?: number;
}

const COUNT = 24;

/**
 * Particle build-in loader. 24 small triangles assemble into a
 * reactor-style ring pattern.
 */
export default function NanoAssemble({ size = 200 }: NanoAssembleProps) {
  const reduce = useReducedMotion();

  const particles = useMemo(() => {
    // Pre-computed reactor-triangle ring: 24 triangles arranged on two
    // concentric rings of 12 each (outer + inner), evenly spaced.
    return Array.from({ length: COUNT }, (_, i) => {
      const ring = i < 12 ? 0 : 1;
      const idx = i % 12;
      const ringR = ring === 0 ? size * 0.36 : size * 0.22;
      const angle = (idx / 12) * Math.PI * 2 + (ring === 1 ? Math.PI / 12 : 0);
      const targetX = Math.cos(angle) * ringR;
      const targetY = Math.sin(angle) * ringR;

      // Random outward start position
      const startAngle = Math.random() * Math.PI * 2;
      const startDist = ringR + 80;
      const startX = Math.cos(startAngle) * startDist;
      const startY = Math.sin(startAngle) * startDist;

      const color = i % 2 === 0 ? '#FFB347' : '#C8102E';
      const rot = (angle * 180) / Math.PI;
      return { i, targetX, targetY, startX, startY, color, rot };
    });
  }, [size]);

  // Loop timing: assemble 1.6s, hold 0.4s, disperse 0.6s = 2.6s total
  const ASSEMBLE = 1.6;
  const HOLD = 0.4;
  const DISPERSE = 0.6;
  const TOTAL = ASSEMBLE + HOLD + DISPERSE;

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      aria-label="loading"
    >
      <svg
        width={size}
        height={size}
        viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
        style={{ overflow: 'visible' }}
      >
        {particles.map((p) => {
          const triPath = 'M 0 -3 L 2.6 1.5 L -2.6 1.5 Z';

          if (reduce) {
            return (
              <path
                key={p.i}
                d={triPath}
                fill={p.color}
                transform={`translate(${p.targetX} ${p.targetY}) rotate(${p.rot})`}
                opacity={0.9}
              />
            );
          }

          // Keyframes: 0 -> ASSEMBLE/TOTAL = arrived; HOLD; then disperse back.
          const tAssembleEnd = ASSEMBLE / TOTAL;
          const tHoldEnd = (ASSEMBLE + HOLD) / TOTAL;

          return (
            <motion.path
              key={p.i}
              d={triPath}
              fill={p.color}
              animate={{
                x: [p.startX, p.targetX, p.targetX, p.startX],
                y: [p.startY, p.targetY, p.targetY, p.startY],
                opacity: [0, 1, 1, 0],
                rotate: [0, p.rot, p.rot, 0],
              }}
              transition={{
                duration: TOTAL,
                times: [0, tAssembleEnd, tHoldEnd, 1],
                ease: 'easeOut',
                repeat: Infinity,
                delay: (p.i % 12) * 0.04,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
