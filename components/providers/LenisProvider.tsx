'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

/**
 * Wraps the app in a Lenis smooth-scroll instance.
 * Short-circuits when prefers-reduced-motion is set, so a11y users get native scroll.
 * Resets scroll to top on every route change so NextChapter clicks land at the new page's hero.
 */
export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll on route change — Lenis intercepts native scroll restoration,
  // so we must explicitly jump to top whenever the pathname changes.
  // Belt-and-braces: native scrollTo(0,0) immediately + Lenis scrollTo on next frame
  // so the new page mounts at scroll 0 even before Lenis has caught up.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    const lenis = lenisRef.current;
    if (lenis) {
      requestAnimationFrame(() => lenis.scrollTo(0, { immediate: true, force: true }));
    }
  }, [pathname]);

  return <>{children}</>;
}
