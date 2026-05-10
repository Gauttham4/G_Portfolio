'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode, CSSProperties } from 'react';

export interface HoloShimmerProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  children?: ReactNode;
}

/**
 * Skeleton placeholder with a horizontal gold sweep.
 */
export default function HoloShimmer({
  width = '100%',
  height = 120,
  className,
  children,
}: HoloShimmerProps) {
  const reduce = useReducedMotion();

  const containerStyle: CSSProperties = {
    width,
    height,
    border: '1px solid rgba(255,179,71,0.18)',
    background: 'rgba(7,9,12,0.6)',
  };

  return (
    <div
      className={`relative overflow-hidden ${className ?? ''}`}
      style={containerStyle}
    >
      {children ? (
        <div className="relative z-[1] h-full w-full">{children}</div>
      ) : null}

      {!reduce ? (
        <motion.div
          className="pointer-events-none absolute inset-y-0"
          style={{
            width: '30%',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,179,71,0.15) 50%, transparent 100%)',
          }}
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 1.6, ease: 'easeOut', repeat: Infinity }}
        />
      ) : null}
    </div>
  );
}
