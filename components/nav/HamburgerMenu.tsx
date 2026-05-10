'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const LINKS: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/#acts-drilldown' },
  { label: 'About', href: '/about' },
  { label: 'Hackathons', href: '/hackathons' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Research', href: '/research' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
];

const SOCIAL: { label: string; href: string }[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'Instagram', href: 'https://instagram.com/' },
  { label: 'Email', href: 'mailto:gautthamrajasekar@gmail.com' },
];

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();

  const handleLinkClick = (href: string) => (e: React.MouseEvent) => {
    // Special handling for Work anchor: scroll to section if on home, else navigate.
    if (href === '/#acts-drilldown') {
      e.preventDefault();
      setOpen(false);
      if (pathname === '/') {
        // Defer to next frame so the menu close animation can begin.
        requestAnimationFrame(() => {
          document.getElementById('acts-drilldown')?.scrollIntoView({ behavior: 'smooth' });
        });
      } else {
        router.push('/#acts-drilldown');
      }
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* Hamburger trigger */}
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="group relative flex h-10 w-10 items-center justify-center"
      >
        <span className="flex flex-col gap-[6px]">
          <span className="block h-px w-7 bg-paper transition-colors group-hover:bg-amber" />
          <span className="block h-px w-7 bg-paper transition-colors group-hover:bg-amber" />
          <span className="block h-px w-5 bg-paper transition-colors group-hover:bg-amber" />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu-overlay"
            className="fixed inset-0 z-[90] bg-ink"
            initial={{ x: reduce ? 0 : '100%', opacity: reduce ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduce ? 0 : '100%', opacity: reduce ? 0 : 1 }}
            transition={{
              duration: reduce ? 0.15 : 0.6,
              ease: [0.83, 0, 0.17, 1],
            }}
          >
            {/* Close */}
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute right-6 top-6 flex items-center justify-center font-mono text-xs sm:text-sm uppercase tracking-[0.3em] text-paper hover:text-amber md:right-10 md:top-10"
            >
              × Close
            </button>

            {/* Logo echo */}
            <div className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.35em] text-amber md:left-10 md:top-10">
              Gauttham R · Studio
            </div>

            {/* Links list */}
            <nav
              aria-label="Primary"
              className="flex h-full flex-col items-start justify-center px-8 md:px-20"
            >
              <ul>
                {LINKS.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.15 + i * 0.06,
                    }}
                    className="py-2"
                  >
                    <Link
                      href={l.href}
                      onClick={handleLinkClick(l.href)}
                      className="font-display font-light text-paper transition-colors duration-300 hover:text-amber text-3xl md:text-5xl"
                      style={{ letterSpacing: '-0.01em', lineHeight: 1.05 }}
                    >
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Bottom-left socials */}
            <div className="absolute bottom-6 left-6 flex flex-wrap gap-4 sm:gap-6 md:bottom-10 md:left-10">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim transition-colors hover:text-amber"
                >
                  {s.label}
                </a>
              ))}
            </div>

            {/* Bottom-right copyright */}
            <div className="absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim md:bottom-10 md:right-10">
              ©2026 Gauttham R · Studio
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
