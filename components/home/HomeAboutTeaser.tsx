'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Reveal from '@/components/motion/Reveal';

/**
 * § FROM THE STUDIO — a single pull-quote with one portrait + CTA.
 *
 * Differentiated from <Intro /> (the showpiece identity statement with stats
 * + parallax portrait stack). This one is a quiet, memorable quote card.
 */
export default function HomeAboutTeaser() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-30, 30]);

  return (
    <section ref={ref} className="overflow-hidden bg-ink px-6 py-32 md:px-12">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
            § From the studio
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16">
          {/* LEFT — the quote */}
          <div className="md:col-span-8">
            <Reveal delay={0.1}>
              <p
                className="font-display italic leading-[1.05] tracking-tight text-paper"
                style={{ fontSize: 'clamp(2rem, 5vw, 4.25rem)' }}
              >
                &ldquo;I went from a paper-and-pen tuition fee book to a self-evolving
                multi-agent AI. Same builder. Same rule&nbsp;&mdash; ship something real.&rdquo;
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-paper-dim">
                &mdash; Gauttham R, on twenty-eight projects
              </p>
            </Reveal>

            <Reveal delay={0.35}>
              <div className="mt-12">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-amber transition-colors hover:text-paper"
                >
                  Read the full case file
                  <span aria-hidden>&rarr;</span>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — single portrait, slight rotation, parallax */}
          <div className="md:col-span-4">
            <motion.div
              style={{ y: portraitY, rotate: -3 }}
              initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto aspect-[3/4] w-full max-w-[360px] overflow-hidden rounded-md border border-paper-soft shadow-2xl"
            >
              <Image
                src="/about/portrait-cafe.jpg"
                alt="Gauttham R portrait"
                fill
                sizes="(min-width: 768px) 30vw, 80vw"
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
