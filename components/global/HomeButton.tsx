'use client';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function HomeButton() {
  const router = useRouter();
  const pathname = usePathname();
  if (pathname === '/' || !pathname) return null;

  return (
    <motion.button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push('/'); }}
      onPointerDown={(e) => e.stopPropagation()}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed top-20 left-[7.75rem] md:top-24 md:left-[10.5rem] z-[80] font-mono uppercase text-amber/85 text-[11px] tracking-[0.3em] px-4 py-3 min-h-[44px] inline-flex items-center border border-paper-soft bg-ink/85 backdrop-blur rounded-sm hover:text-amber hover:border-amber/60 hover:bg-ink/95 transition-all cursor-pointer pointer-events-auto"
      aria-label="Go to home page"
    >
      ⌂ Home
    </motion.button>
  );
}
