'use client';

import { motion } from 'framer-motion';

const cols = [
  {
    title: 'Languages',
    items: ['JavaScript / TypeScript', 'Python', 'Dart', 'PHP', 'Java', 'C / C++'],
  },
  {
    title: 'Web',
    items: ['Next.js', 'React', 'Flutter', 'FastAPI', 'LangGraph', 'Express', 'PHP / Laravel'],
  },
  {
    title: 'AI',
    items: ['LangGraph', 'Pinecone', 'Groq', 'RAG', 'Multi-agent orchestration'],
  },
  {
    title: '3D / Motion',
    items: ['Framer Motion', 'GSAP', 'R3F', 'Three.js', 'Lenis', 'Theatre.js'],
  },
  {
    title: 'Cybersecurity',
    items: [
      'Digital forensics & IR',
      'AppSec / OWASP / secure coding',
      'AI security & adversarial ML',
      'Incoming MS focus',
    ],
  },
];

export default function AboutSkillsGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">Toolbelt</p>
      <h2 className="mt-3 font-display text-3xl leading-[1.05] tracking-tight text-paper md:text-5xl">
        Skills.
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
        {cols.map((c, idx) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: idx * 0.08 }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
              {c.title}
            </p>
            <ul className="mt-5 space-y-2 border-t border-rule pt-5 font-sans text-sm text-paper md:text-base">
              {c.items.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 + i * 0.04 }}
                  className="text-paper-dim"
                >
                  {s}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
