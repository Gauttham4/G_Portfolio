'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ACTS } from '@/lib/projects-manifest';

type Props = {
  currentSlug: string;
  accent?: string;
};

function findNext(currentSlug: string) {
  const flat = ACTS.flatMap((a) =>
    a.projects.map((p) => ({ ...p, actName: a.name, actNumeral: a.numeral })),
  );
  const idx = flat.findIndex((p) => p.slug === currentSlug);
  if (idx === -1 || idx === flat.length - 1) return null;
  return flat[idx + 1];
}

export default function NextChapter({ currentSlug, accent }: Props) {
  const reduce = useReducedMotion();
  const next = findNext(currentSlug);

  if (!next) {
    return (
      <section className="border-t border-white/10 py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <p
            className="font-mono uppercase text-xs tracking-[0.3em] mb-6 opacity-60"
            style={{ color: accent ?? 'currentColor' }}
          >
            End of reel
          </p>
          <h2 className="font-display italic text-4xl md:text-6xl leading-[0.95]">
            End of reel — back to home.
          </h2>
          <Link
            href="/"
            className="inline-block mt-10 font-mono uppercase text-[11px] tracking-[0.25em] opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: accent ?? 'currentColor' }}
          >
            ← back to the index
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-white/10 py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <p
          className="font-mono uppercase text-xs tracking-[0.3em] mb-6 opacity-60"
          style={{ color: accent ?? 'currentColor' }}
        >
          Next chapter · {next.actName}
        </p>
        <Link href={`/work/${next.slug}`} className="group block">
          <motion.h2
            className="font-display italic text-5xl md:text-8xl leading-[0.95] transition-colors"
            whileHover={reduce ? undefined : { x: 12 }}
            transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {next.title}
            <span
              className="inline-block ml-6 not-italic font-sans align-middle text-3xl md:text-5xl opacity-50 group-hover:opacity-100 transition-opacity"
              style={{ color: accent ?? 'currentColor' }}
            >
              →
            </span>
          </motion.h2>
          <p className="mt-6 font-mono uppercase text-[10px] tracking-[0.25em] opacity-50">
            /work/{next.slug}
          </p>
        </Link>
      </div>
    </section>
  );
}
