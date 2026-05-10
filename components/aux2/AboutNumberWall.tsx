'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, animate } from 'framer-motion';

const stats = [
  { value: 28, label: 'Projects shipped' },
  { value: 5, label: 'Hackathons' },
  { value: 1, label: 'IJIRE paper' },
  { value: 3, label: 'Internships' },
];

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, reduce]);

  return <span ref={ref}>{n}</span>;
}

export default function AboutNumberWall() {
  return (
    <section className="mx-auto max-w-7xl border-y border-rule px-6 py-20 md:py-28">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
        The ledger
      </p>

      <div className="mt-10 grid grid-cols-2 gap-px bg-rule lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            className="bg-ink p-6 md:p-10"
          >
            <p className="font-display text-6xl leading-none tracking-tight text-paper md:text-7xl lg:text-[8rem]">
              <Counter to={s.value} />
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
