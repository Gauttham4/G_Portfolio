'use client';

import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  src: string;
  caption?: string;
  captionColor?: string;
  height?: string;
  opacity?: number;
  overlay?: string; // overlay gradient/color CSS
};

export default function CinematicDivider({
  src,
  caption,
  captionColor = '#ffffff',
  height = '50vh',
  opacity = 0.3,
  overlay = 'linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0.5))',
}: Props) {
  const reduce = useReducedMotion();
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height }}
      aria-hidden={!caption}
    >
      {!reduce ? (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity }}
        />
      ) : null}
      <div className="absolute inset-0" style={{ background: overlay }} />
      {caption ? (
        <motion.p
          className="relative z-10 h-full flex items-center justify-center font-mono uppercase tracking-[0.4em] text-xs md:text-sm text-center px-6"
          style={{ color: captionColor }}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {caption}
        </motion.p>
      ) : null}
    </section>
  );
}
