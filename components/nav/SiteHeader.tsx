'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import HamburgerMenu from './HamburgerMenu';
import EmailUsLeke from '@/components/leke/EmailUsLeke';

export default function SiteHeader() {
  const reduce = useReducedMotion();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 glass-nav">
      <div className="relative mx-auto flex max-w-[1600px] items-start justify-between px-6 pt-6 pb-4 md:px-10 md:pt-6 md:pb-4">
        {/* Logo (slide-left) */}
        <motion.div
          className="pointer-events-auto"
          initial={{ opacity: 0, x: reduce ? 0 : -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: reduce ? 0 : 0.9,
            ease: [0.22, 1, 0.36, 1],
            delay: reduce ? 0 : 0.1,
          }}
        >
          <Link
            href="/"
            className="block font-display text-xl font-light leading-none text-paper hover:text-amber md:text-2xl"
            aria-label="Gauttham R — home"
          >
            <span className="block">Gauttham R</span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.35em] text-amber">
              Studio · 2026
            </span>
          </Link>
        </motion.div>

        {/* Right cluster: floating email-us leke + hamburger */}
        <motion.div
          className="pointer-events-auto flex items-start gap-4 md:gap-8"
          initial={{ opacity: 0, x: reduce ? 0 : 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: reduce ? 0 : 0.9,
            ease: [0.22, 1, 0.36, 1],
            delay: reduce ? 0 : 0.1,
          }}
        >
          {/* Floating leke sticker — desktop only */}
          <div className="relative hidden md:block">
            <EmailUsLeke size={120} />
          </div>
          <HamburgerMenu />
        </motion.div>
      </div>
    </header>
  );
}
