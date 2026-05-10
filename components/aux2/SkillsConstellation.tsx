'use client';

import { motion, type Variants } from 'framer-motion';

type Skill = {
  name: string;
  primary?: boolean;
  incoming?: boolean;
};

type Cluster = {
  title: string;
  caption: string;
  skills: Skill[];
};

const CLUSTERS: Cluster[] = [
  {
    title: 'Languages',
    caption: '7 languages',
    skills: [
      { name: 'JavaScript / TypeScript', primary: true },
      { name: 'Python', primary: true },
      { name: 'Dart' },
      { name: 'PHP' },
      { name: 'Java' },
      { name: 'C / C++' },
      { name: 'SQL' },
    ],
  },
  {
    title: 'Web',
    caption: '9 frameworks',
    skills: [
      { name: 'Next.js', primary: true },
      { name: 'React', primary: true },
      { name: 'Flutter' },
      { name: 'FastAPI' },
      { name: 'LangGraph' },
      { name: 'Express' },
      { name: 'PHP / Laravel' },
      { name: 'Tailwind' },
      { name: 'Vite' },
    ],
  },
  {
    title: 'AI',
    caption: '8 stacks',
    skills: [
      { name: 'LangGraph', primary: true },
      { name: 'Pinecone' },
      { name: 'Groq' },
      { name: 'RAG' },
      { name: 'Multi-agent' },
      { name: 'Gemini' },
      { name: 'OpenAI' },
      { name: 'Embeddings' },
    ],
  },
  {
    title: '3D / Motion',
    caption: '7 tools',
    skills: [
      { name: 'Framer Motion', primary: true },
      { name: 'GSAP' },
      { name: 'R3F' },
      { name: 'Three.js' },
      { name: 'Lenis' },
      { name: 'Theatre.js' },
      { name: 'Spline' },
    ],
  },
  {
    title: 'Cybersecurity / Forensics',
    caption: 'Incoming MS focus · 7 areas',
    skills: [
      { name: 'Digital forensics', incoming: true },
      { name: 'Incident response', incoming: true },
      { name: 'AppSec' },
      { name: 'OWASP' },
      { name: 'Secure coding' },
      { name: 'AI security' },
      { name: 'Adversarial ML' },
    ],
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

const bubbleVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function SkillsConstellation() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">Toolbelt</p>
      <h2 className="mt-3 font-display text-3xl leading-[1.05] tracking-tight text-paper md:text-5xl">
        Skills.{' '}
        <span className="italic text-amber">A constellation, not a list.</span>
      </h2>

      <div className="mt-16 space-y-14">
        {CLUSTERS.map((c, idx) => (
          <motion.div
            key={c.title}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="border-t border-rule pt-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <motion.h3
                variants={bubbleVariants}
                className="font-display text-2xl italic text-amber md:text-3xl"
              >
                {c.title}
              </motion.h3>
              <motion.p
                variants={bubbleVariants}
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim"
              >
                {c.caption}
              </motion.p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {c.skills.map((s) => {
                const base =
                  'group relative inline-flex cursor-default items-center gap-2 rounded-full border px-4 py-2 font-sans text-sm transition-colors';
                const tone = s.primary
                  ? 'border-amber/50 bg-amber-soft text-paper'
                  : s.incoming
                    ? 'border-paper-soft bg-paper-soft/30 text-paper-dim'
                    : 'border-rule bg-paper-soft/15 text-paper-dim';
                return (
                  <motion.span
                    key={s.name}
                    variants={bubbleVariants}
                    whileHover={{
                      scale: 1.05,
                      rotate: idx % 2 === 0 ? 1.2 : -1.2,
                    }}
                    transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                    className={`${base} ${tone} hover:border-amber/70 hover:text-paper`}
                  >
                    {s.primary && (
                      <span className="h-1.5 w-1.5 rounded-full bg-amber shadow-[0_0_8px_var(--color-amber)]" />
                    )}
                    {s.name}
                    {s.incoming && (
                      <span className="rounded-sm border border-amber/40 px-1.5 py-px font-mono text-[8px] uppercase tracking-[0.25em] text-amber">
                        Incoming
                      </span>
                    )}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
