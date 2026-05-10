'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ACTS } from '@/lib/projects-manifest';
import { easing } from '@/lib/motion-tokens';

/**
 * Fixed bottom-left chip — updates as the user scrolls into a new act.
 * Observes [data-act] sticky sections.
 */
export default function NowPlayingChip() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>('[data-act]')
    );
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const id = (visible[0].target as HTMLElement).dataset.act ?? null;
          setActiveId(id);
        }
      },
      { threshold: [0.2, 0.5, 0.8] }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  let label = 'Currently — Cold Open';
  if (activeId === 'REEL') {
    label = 'Currently — The Reel';
  } else if (activeId) {
    const act = ACTS.find((a) => a.id === activeId);
    if (act) {
      const cleanName = act.name.replace(/\.$/, '');
      label = `Currently — Act ${act.numeral} · ${cleanName}`;
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-30 md:bottom-8 md:left-8">
      <AnimatePresence mode="wait">
        <motion.span
          key={label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.18, ease: easing.suitEject }}
          className="inline-flex items-center border border-paper-soft bg-ink/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-paper-dim backdrop-blur"
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
