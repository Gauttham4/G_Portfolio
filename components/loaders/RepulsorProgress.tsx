'use client';

import { motion } from 'framer-motion';
import { easing } from '@/lib/motion-tokens';

export interface RepulsorProgressProps {
  value: number; // 0..100
  label?: string;
  compact?: boolean;
}

/**
 * Bounded progress bar (0-100). Gold→nano gradient with leading glow tip.
 */
export default function RepulsorProgress({ value, label, compact }: RepulsorProgressProps) {
  const v = Math.max(0, Math.min(100, value));

  return (
    <div className="flex w-full flex-col gap-1.5">
      {!compact && (label || true) ? (
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.3em]">
          <span style={{ color: 'rgba(255,179,71,0.6)' }}>{label ?? ''}</span>
          <span style={{ color: 'rgba(255,179,71,0.85)' }}>{Math.round(v)}%</span>
        </div>
      ) : null}

      <div
        className="relative h-2 w-full overflow-hidden rounded-full"
        style={{ border: '1px solid rgba(255,179,71,0.3)' }}
      >
        <motion.div
          className="relative h-full"
          style={{
            background: 'linear-gradient(90deg, #FFB347 0%, #4FC3F7 100%)',
          }}
          initial={false}
          animate={{ width: `${v}%` }}
          transition={{ duration: 0.6, ease: easing.repulsorCharge }}
        >
          {/* leading glow tip */}
          <span
            className="pointer-events-none absolute right-0 top-0 h-full"
            style={{
              width: 4,
              background: '#4FC3F7',
              boxShadow: '0 0 8px 2px #4FC3F7',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
