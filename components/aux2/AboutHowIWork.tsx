'use client';

import { motion } from 'framer-motion';

const cards = [
  {
    kicker: '01 · Pattern',
    headline: 'Problem solver before I’m anything else.',
    body: 'I see the pain. I sketch the fix. I open the editor. The shortest path from a real human friction to a working tool.',
  },
  {
    kicker: '02 · Payoff',
    headline: 'Visuals coming alive on screen — that’s the loop.',
    body: 'Coding past midnight is real. So is the satisfaction when a static idea suddenly moves and breathes on screen.',
  },
  {
    kicker: '03 · Practice',
    headline: 'Teach what I learn. Help without keeping score.',
    body: 'Time is precious — half my projects shipped because I respected the clock. The other half shipped because I helped first.',
  },
];

export default function AboutHowIWork() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 md:py-36">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
        Act II · How I work
      </p>
      <h2 className="mt-3 font-display text-3xl leading-[1.05] tracking-tight text-paper md:text-5xl lg:text-6xl">
        Three rules. Same person, every time.
      </h2>

      <div className="mt-14 grid grid-cols-1 gap-px bg-rule md:grid-cols-3">
        {cards.map((c, i) => (
          <motion.article
            key={c.kicker}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col gap-8 bg-ink p-8 transition-colors hover:bg-paper-soft md:p-12"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-paper-dim group-hover:text-amber">
              {c.kicker}
            </p>
            <p className="font-display text-2xl italic leading-[1.15] text-paper md:text-3xl lg:text-4xl">
              {c.headline}
            </p>
            <p className="mt-auto font-sans text-sm leading-relaxed text-paper-dim md:text-base">
              {c.body}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
