'use client';

import { motion, useReducedMotion } from 'framer-motion';
import ReactorLoader from './ReactorLoader';
import RepulsorProgress from './RepulsorProgress';

export interface HUDScanProps {
  progress?: number;
  label?: string;
}

type BracketPos = 'tl' | 'tr' | 'bl' | 'br';

const BRACKET_PATH: Record<BracketPos, string> = {
  tl: 'M 2 10 L 2 2 L 10 2',
  tr: 'M 14 2 L 22 2 L 22 10',
  bl: 'M 2 14 L 2 22 L 10 22',
  br: 'M 14 22 L 22 22 L 22 14',
};

const BRACKET_POS: Record<BracketPos, string> = {
  tl: 'top-6 left-6',
  tr: 'top-6 right-6',
  bl: 'bottom-6 left-6',
  br: 'bottom-6 right-6',
};

function Bracket({ pos }: { pos: BracketPos }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      className={`pointer-events-none absolute h-6 w-6 ${BRACKET_POS[pos]}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FFB347"
      strokeWidth={1.5}
      animate={reduce ? undefined : { opacity: [0.4, 1, 0.4] }}
      transition={
        reduce ? undefined : { duration: 1.2, ease: 'easeInOut', repeat: Infinity }
      }
    >
      <path d={BRACKET_PATH[pos]} strokeLinecap="square" />
    </motion.svg>
  );
}

/**
 * Full-bleed JARVIS-style scanning loader. Used as Suspense fallback.
 */
export default function HUDScan({ progress, label = 'INITIALISING' }: HUDScanProps) {
  const reduce = useReducedMotion();
  const showProgress = typeof progress === 'number';

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Bracket pos="tl" />
      <Bracket pos="tr" />
      <Bracket pos="bl" />
      <Bracket pos="br" />

      {/* Scan-line top→bottom */}
      {!reduce ? (
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,179,71,0.85) 50%, transparent 100%)',
            boxShadow: '0 0 8px rgba(255,179,71,0.6)',
          }}
          initial={{ top: '0%' }}
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 1.8, ease: 'linear', repeat: Infinity }}
        />
      ) : null}

      {/* Center stack */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex w-72 max-w-[80%] flex-col items-center gap-6">
          <ReactorLoader label={label} />
          {showProgress ? (
            <div className="w-full">
              <RepulsorProgress value={progress!} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
