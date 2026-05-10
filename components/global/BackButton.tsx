'use client';
import { usePathname } from 'next/navigation';
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BackButton() {
  const pathname = usePathname();
  const navigatingRef = useRef(false);

  // Reset navigation lock whenever pathname changes (new page loaded)
  useEffect(() => {
    navigatingRef.current = false;
  }, [pathname]);

  if (pathname === '/' || !pathname) return null;

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigatingRef.current) return;
    navigatingRef.current = true;

    if (typeof window === 'undefined') return;

    const hasInternalHistory =
      window.history.length > 1 &&
      document.referrer &&
      document.referrer.includes(window.location.host);

    if (hasInternalHistory) {
      // Use the browser's back. If it lands on home (/), force a hard reload
      // so the homepage mounts cleanly (avoids the rare blank-state bug after
      // a deep nav stack).
      window.history.back();
      window.setTimeout(() => {
        if (window.location.pathname === '/') {
          window.location.reload();
        } else {
          // Reset the lock so user can navigate further
          navigatingRef.current = false;
        }
      }, 550);
    } else {
      // No internal history → hard navigate to home (forces a full reload).
      window.location.href = '/';
    }
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="fixed top-20 left-3 md:top-24 md:left-8 z-[80] font-mono uppercase text-amber/85 text-[11px] tracking-[0.3em] px-4 py-3 min-h-[44px] inline-flex items-center border border-paper-soft bg-ink/85 backdrop-blur rounded-sm hover:text-amber hover:border-amber/60 hover:bg-ink/95 transition-all cursor-pointer pointer-events-auto"
    >
      ← Back
    </motion.button>
  );
}
