'use client';

import { AnimatePresence, motion } from 'framer-motion';

type Props = { show: boolean };

export default function ContactShutdown({ show }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[120] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.96 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="relative text-center"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.5em] text-amber">
              Message queued
            </p>
            <p className="mt-6 font-display text-2xl tracking-wide text-paper md:text-4xl">
              JARVIS POWERING DOWN<span className="animate-pulse text-amber">...</span>
            </p>
            <motion.div
              className="mx-auto mt-10 h-[2px] w-48 bg-amber"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
              style={{ transformOrigin: 'left' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
