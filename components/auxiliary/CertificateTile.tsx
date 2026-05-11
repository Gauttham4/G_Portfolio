'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import PdfModal from './PdfModal';

// Dynamically load react-pdf only on the client (no SSR) to avoid DOMMatrix / canvas
// issues during prerender. This component renders the first page of each certificate
// PDF as a preview inside the card.
const PdfPreview = dynamic(() => import('./PdfPreview'), {
  ssr: false,
  loading: () => <PreviewSkeleton state="loading" />,
});

function PreviewSkeleton({ state }: { state: 'loading' | 'error' }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-paper-soft">
      <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-paper-dim">
        {state === 'loading' ? 'Rendering…' : 'Preview unavailable'}
      </span>
    </div>
  );
}

type Props = {
  title: string;
  subtitle: string;
  src: string;
  number: number | string;
};

export default function CertificateTile({ title, subtitle, src, number }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <motion.article
        className="group relative flex flex-col overflow-hidden rounded-xl glass glass-hover"
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* PDF first-page preview */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative aspect-[3/4] w-full overflow-hidden border-b border-rule bg-paper-soft text-left"
          aria-label={`Open ${title}`}
        >
          {mounted ? (
            <PdfPreview src={src} />
          ) : (
            <PreviewSkeleton state="loading" />
          )}
          {/* HUD corner ticks (over preview) */}
          <span className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l border-t border-amber/60" />
          <span className="pointer-events-none absolute right-2 top-2 h-4 w-4 border-r border-t border-amber/60" />
          <span className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 border-b border-l border-amber/60" />
          <span className="pointer-events-none absolute bottom-2 right-2 h-4 w-4 border-b border-r border-amber/60" />
          <span className="pointer-events-none absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.4em] text-amber">
            N° {String(number).padStart(2, '0')}
          </span>
        </button>

        <div className="flex flex-1 flex-col gap-3 p-6">
          <h3 className="font-display text-xl leading-tight text-paper group-hover:text-amber group-active:text-amber">
            {title}
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
            {subtitle}
          </p>
          <div className="mt-auto flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber hover:text-paper active:text-paper"
            >
              View →
            </button>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim hover:text-amber active:text-amber"
            >
              PDF ↗
            </a>
          </div>
        </div>
      </motion.article>
      <PdfModal open={open} src={src} title={title} onClose={() => setOpen(false)} />
    </>
  );
}
