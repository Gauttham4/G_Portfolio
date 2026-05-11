'use client';

import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const PdfPreview = dynamic(() => import('./PdfPreview'), { ssr: false });

type Props = {
  open: boolean;
  slug: string;
  title: string;
  photoCount: number;
  onClose: () => void;
};

export default function HackathonModal({ open, slug, title, photoCount, onClose }: Props) {
  const [active, setActive] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setActive(0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setActive((a) => Math.min(photoCount - 1, a + 1));
      if (e.key === 'ArrowLeft') setActive((a) => Math.max(0, a - 1));
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, photoCount]);

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

  const certPath = `/hackathons/${slug}/cert.pdf`;
  const photos = Array.from({ length: photoCount }).map(
    (_, i) => `/hackathons/${slug}/photo-${i + 1}.jpg`,
  );

  const hasPhotos = photoCount > 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 px-2 py-4 sm:px-4 sm:py-8 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            className="relative h-full w-full max-w-7xl overflow-hidden rounded-md border border-rule bg-ink shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-rule px-5 py-3">
              <p className="font-display text-base text-paper md:text-lg">{title}</p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-2 font-mono text-[11px] uppercase tracking-[0.3em] text-paper-dim hover:text-amber"
              >
                Close ✕
              </button>
            </div>

            <div
              className={
                hasPhotos
                  ? 'grid h-[calc(100%-50px)] grid-cols-1 gap-6 overflow-y-auto p-5 md:grid-cols-3'
                  : 'h-[calc(100%-50px)] overflow-y-auto p-5'
              }
            >
              {/* LEFT — gallery (col-span-2) — only when photos exist */}
              {hasPhotos && (
                <div className="md:col-span-2">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-rule bg-paper-soft/30">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={photos[active]}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={photos[active]}
                          alt={`${title} photo ${active + 1}`}
                          fill
                          sizes="(min-width: 768px) 60vw, 100vw"
                          className="object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {photoCount > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setActive((a) => Math.max(0, a - 1))}
                          disabled={active === 0}
                          className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper-soft bg-ink/70 font-mono text-base text-paper backdrop-blur transition-colors hover:border-amber hover:text-amber disabled:opacity-30"
                          aria-label="Previous photo"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setActive((a) => Math.min(photoCount - 1, a + 1))
                          }
                          disabled={active === photoCount - 1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper-soft bg-ink/70 font-mono text-base text-paper backdrop-blur transition-colors hover:border-amber hover:text-amber disabled:opacity-30"
                          aria-label="Next photo"
                        >
                          →
                        </button>
                      </>
                    )}

                    <div className="absolute right-3 top-3 rounded-sm border border-paper-soft bg-ink/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-paper backdrop-blur">
                      {active + 1} / {photoCount}
                    </div>
                  </div>

                  {photoCount > 1 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {photos.map((p, i) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setActive(i)}
                          className={`relative h-14 w-20 overflow-hidden rounded-sm border transition-colors ${
                            i === active
                              ? 'border-amber'
                              : 'border-rule hover:border-paper-soft'
                          }`}
                          aria-label={`Show photo ${i + 1}`}
                        >
                          <Image
                            src={p}
                            alt={`thumb ${i + 1}`}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* RIGHT — cert. With photos: col-span-1 sidebar. Without: centered, larger. */}
              <div
                className={
                  hasPhotos
                    ? 'md:col-span-1'
                    : 'mx-auto max-w-4xl'
                }
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
                  Certificate
                </p>
                <div
                  className={
                    hasPhotos
                      ? 'mt-3 aspect-[4/3] w-full overflow-hidden rounded-md border border-rule bg-paper'
                      : 'mt-3 aspect-[4/3] w-full overflow-hidden rounded-md border border-rule bg-paper'
                  }
                >
                  <div className="relative h-full w-full">
                    <PdfPreview src={certPath} />
                  </div>
                </div>
                <a
                  href={certPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center font-mono text-[10px] uppercase tracking-[0.3em] text-amber hover:text-paper"
                >
                  Open full size →
                </a>

                {!hasPhotos && (
                  <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
                    Event photos · not available
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
