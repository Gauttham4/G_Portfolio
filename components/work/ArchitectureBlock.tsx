'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkSection } from './Section';
import type { ArchitectureBlock as ABlock } from '@/lib/work-content';

type Props = {
  kicker?: string;
  title: string;
  blocks: ABlock[];
  outcomes?: string[];
  accent?: string;
};

export default function ArchitectureBlock({ kicker, title, blocks, outcomes, accent }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <WorkSection kicker={kicker} title={title} accent={accent}>
      {outcomes && outcomes.length > 0 && (
        <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
          {outcomes.map((o, i) => (
            <motion.div
              key={i}
              className="flex gap-4 items-start"
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <span
                className="font-mono text-xs mt-1.5 shrink-0"
                style={{ color: accent ?? 'currentColor' }}
              >
                ▶
              </span>
              <p className="font-sans text-base md:text-lg leading-relaxed opacity-80">{o}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="border-t border-white/10">
        {blocks.map((block, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="border-b border-white/10">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-6 py-6 md:py-8 text-left group"
              >
                <span className="font-display text-xl md:text-3xl leading-tight">
                  {block.label}
                </span>
                <motion.span
                  className="font-mono text-2xl md:text-3xl shrink-0"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                  style={{ color: accent ?? 'currentColor' }}
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="pb-8 pr-12 font-sans text-base md:text-lg leading-relaxed opacity-75 max-w-3xl">
                      {block.body}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </WorkSection>
  );
}
