'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { easing } from '@/lib/motion-tokens';

type Props = {
  index: number;        // 1-based slot in the act
  total: number;        // act size
  slug: string;
  title: string;
  category: string;
  actNumeral: string;
  isLast: boolean;
};

export default function ProjectRow({
  index,
  slug,
  title,
  category,
  actNumeral,
  isLast,
}: Props) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement | null>(null);

  // Cursor-tracking magnetic preview
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 30, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 220, damping: 30, mass: 0.7 });

  // Velocity-derived tilt (±6°)
  const lastRef = useRef<{ x: number; y: number; t: number }>({ x: 0, y: 0, t: 0 });
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const sTiltX = useSpring(tiltX, { stiffness: 180, damping: 20 });
  const sTiltY = useSpring(tiltY, { stiffness: 180, damping: 20 });
  const rotate = useTransform(sTiltX, (v) => v); // expose for clarity
  const rotateY = useTransform(sTiltY, (v) => v);

  // Sibling dim: toggle data-attr on parent <ul>/<section>
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const list = el.closest('[data-act-list]') as HTMLElement | null;
    if (!list) return;
    if (hovered) {
      list.setAttribute('data-row-hovered', 'true');
      el.setAttribute('data-active', 'true');
    } else {
      list.removeAttribute('data-row-hovered');
      el.removeAttribute('data-active');
    }
  }, [hovered]);

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    x.set(cx);
    y.set(cy);

    // velocity for tilt
    const now = performance.now();
    const last = lastRef.current;
    const dt = Math.max(1, now - last.t);
    const vx = (cx - last.x) / dt; // px / ms
    const vy = (cy - last.y) / dt;
    lastRef.current = { x: cx, y: cy, t: now };
    // Map velocity to rotation, clamp ±6
    const rotZ = Math.max(-6, Math.min(6, vx * 8));
    const rotXVal = Math.max(-6, Math.min(6, vy * 6));
    tiltX.set(rotZ);
    tiltY.set(rotXVal);
  };

  const slot = String(index).padStart(2, '0');
  const meta = `${category} · ${actNumeral}.${slot}`;
  const firstLetter = title.trim().charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: reduce ? 0 : 0.6,
        ease: easing.suitEject,
        delay: reduce ? 0 : index * 0.06,
      }}
      className="project-row-wrap"
    >
      <Link
        ref={ref}
        href={`/work/${slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={onMove}
        className="project-row row-tilt-host group relative block border-t border-rule py-10 transition-all duration-300 hover:border-amber/40 md:py-14"
        style={{ perspective: '1000px' }}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 md:px-8">
          <span className="w-16 shrink-0 font-mono text-xs uppercase tracking-[0.3em] text-paper-dim">
            {slot}
          </span>

          <h3
            className="row-tilt flex-1 break-words font-display font-light leading-[1.05] tracking-tight text-paper transition-all duration-300 group-hover:text-amber text-3xl md:text-5xl lg:text-6xl"
          >
            {title}
          </h3>

          <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim md:inline">
            {meta}
          </span>

          <span
            aria-hidden
            className="shrink-0 font-mono text-amber/80 transition-all duration-300 group-hover:translate-x-3"
          >
            <span className="inline-block group-hover:hidden">→</span>
            <span className="hidden group-hover:inline-block">↗</span>
          </span>
        </div>

        {/* Magnetic 480x320 typographic preview */}
        {!reduce && (
          <motion.div
            aria-hidden
            style={{
              x: sx,
              y: sy,
              opacity: hovered ? 1 : 0,
            }}
            transition={{ opacity: { duration: 0.25 } }}
            className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
          >
            <motion.div
              style={{
                width: 480,
                height: 320,
                rotate,
                rotateY,
                transformOrigin: 'center',
              }}
              className="-translate-x-1/2 -translate-y-1/2"
            >
              <div
                className="relative flex h-full w-full items-center justify-center overflow-hidden border border-amber/40 bg-ink/85 backdrop-blur"
                style={{
                  boxShadow:
                    '0 30px 60px -20px rgba(232,184,99,0.35), 0 0 0 1px rgba(232,184,99,0.18)',
                }}
              >
                <span
                  className="font-display font-light text-amber"
                  style={{ fontSize: 240, lineHeight: 1 }}
                >
                  {firstLetter}
                </span>
                <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
                  {meta}
                </span>
                <span className="absolute right-3 top-3 font-mono text-[10px] uppercase tracking-[0.3em] text-amber">
                  {slot} / Preview
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </Link>

      {isLast && <div className="border-b border-rule" />}

      {/* Sibling dim styles — scoped via data-attrs */}
      <style jsx>{`
        :global([data-act-list][data-row-hovered='true'] .project-row-wrap .project-row) {
          opacity: 0.35;
          transition: opacity 0.3s ease;
        }
        :global([data-act-list][data-row-hovered='true']
            .project-row-wrap
            .project-row[data-active='true']) {
          opacity: 1;
        }
      `}</style>
    </motion.div>
  );
}
