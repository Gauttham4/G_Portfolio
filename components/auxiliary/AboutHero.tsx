'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutHero() {
  return (
    <section className="relative h-[65vh] w-full overflow-hidden">
      <Image
        src="/about/portrait-2.jpg"
        alt="Gauttham R"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/20 to-ink" />
      <div className="absolute inset-0 flex flex-col items-start justify-end px-6 pb-16 md:px-12">
        <motion.p
          className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Dossier · Subject 001
        </motion.p>
        <motion.h1
          className="mt-4 font-display text-5xl leading-[0.95] tracking-tight text-paper md:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          About — <span className="italic text-amber">Gauttham R.</span>
        </motion.h1>
        <motion.p
          className="mt-4 max-w-xl font-sans text-base text-paper-dim md:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Engineer at THEELABS. Incoming MS in Cybersecurity + Forensic IT — University of Portsmouth.
        </motion.p>
      </div>
    </section>
  );
}
