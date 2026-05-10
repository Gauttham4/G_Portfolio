'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

type Props = {
  open: boolean;
  src: string;
  title: string;
  onClose: () => void;
};

export default function PdfModal({ open, src, title, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // Focus trap
  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement;

    const node = modalRef.current;
    if (!node) return;

    const focusables = node.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusables[0]?.focus();

    const onTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    node.addEventListener('keydown', onTabKey);
    return () => {
      node.removeEventListener('keydown', onTabKey);
      previousFocus.current?.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 px-4 py-8 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            className="relative h-full w-full max-w-5xl overflow-hidden rounded-md border border-rule bg-ink shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-rule px-5 py-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
                {title}
              </p>
              <div className="flex items-center gap-4">
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber hover:text-paper"
                >
                  Open in new tab
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper-dim hover:text-amber"
                >
                  Close ✕
                </button>
              </div>
            </div>
            <iframe
              src={src}
              title={title}
              sandbox="allow-same-origin allow-popups"
              className="h-[calc(100%-44px)] w-full bg-paper"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
