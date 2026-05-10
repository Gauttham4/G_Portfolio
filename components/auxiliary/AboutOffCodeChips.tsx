'use client';

import { motion } from 'framer-motion';

const chips = [
  'Sports',
  'Fitness',
  'Outdoor',
  'Explorer',
  'Hometown-first',
  'Teaching',
  'Time-management',
];

export default function AboutOffCodeChips() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 md:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
        Off-code
      </p>
      <h2 className="mt-3 font-display text-2xl text-paper md:text-3xl">
        Where the rest of me lives.
      </h2>

      <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
        {chips.map((c, i) => (
          <motion.span
            key={c}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            whileHover={{ rotate: i % 2 === 0 ? 2 : -2, scale: 1.04 }}
            className="cursor-default rounded-full border border-rule bg-paper-soft px-5 py-2 font-mono text-xs uppercase tracking-[0.22em] text-paper transition-colors hover:border-amber hover:text-amber"
          >
            {c}
          </motion.span>
        ))}
      </div>
    </section>
  );
}
