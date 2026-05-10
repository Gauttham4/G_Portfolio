'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type SectionProps = {
  kicker?: string;
  title?: string;
  children: ReactNode;
  className?: string;
  accent?: string;
};

export function WorkSection({ kicker, title, children, className, accent }: SectionProps) {
  return (
    <section className={`py-24 md:py-32 px-6 md:px-12 ${className ?? ''}`}>
      <div className="max-w-7xl mx-auto">
        {(kicker || title) && (
          <header className="mb-16 md:mb-20">
            {kicker && (
              <motion.p
                className="font-mono uppercase text-[10px] md:text-xs tracking-[0.35em] mb-4 opacity-80"
                style={{ color: accent ?? 'currentColor' }}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 0.8, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
              >
                {kicker}
              </motion.p>
            )}
            {title && (
              <motion.h2
                className="font-display text-4xl md:text-7xl leading-[0.95] tracking-tight max-w-4xl"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {title}
              </motion.h2>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
