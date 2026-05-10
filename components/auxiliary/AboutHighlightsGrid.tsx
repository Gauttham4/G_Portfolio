'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const items = [
  { title: '28 shipped projects', body: 'Domains span web, AI, Flutter, finance, safety.', href: '/work', tag: 'Portfolio' },
  { title: 'Published research', body: 'CrimeIntellX — IJIRE journal.', href: '/research', tag: 'Research' },
  { title: '5 hackathons', body: 'Beyond Hack, Hack Summit, Threx, Kroolo, Participants.', href: '/hackathons', tag: 'Events' },
  { title: '3 internships', body: 'Real teams, real shipping cycles.', href: '/certificates', tag: 'Internships' },
  { title: '4 personal certificates', body: 'Receipts from independent learning.', href: '/certificates', tag: 'Certificates' },
  { title: 'Portsmouth offer', body: 'MS Cybersecurity + Forensic IT — confirmed.', href: '/resume', tag: 'Next' },
];

export default function AboutHighlightsGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">Evidence wall</p>
      <h2 className="mt-3 font-display text-3xl leading-[1.05] tracking-tight text-paper md:text-5xl">
        Highlights.
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-px bg-rule md:grid-cols-2 lg:grid-cols-3">
        {items.map((it, idx) => (
          <motion.div
            key={it.title}
            className="bg-ink"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={it.href}
              className="group flex h-full flex-col justify-between gap-8 p-8 transition-colors hover:bg-paper-soft"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-paper-dim">
                {it.tag}
              </p>
              <div>
                <h3 className="font-display text-2xl leading-tight text-paper group-hover:text-amber md:text-3xl">
                  {it.title}
                </h3>
                <p className="mt-3 font-sans text-sm text-paper-dim md:text-base">{it.body}</p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
                View →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
