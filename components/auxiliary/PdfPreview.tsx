'use client';

import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Worker config: bundled locally (copied from pdfjs-dist into public/).
// Keeps CSP tight — no external CDN dependency, no offline failure.
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

type Props = {
  src: string;
  /** When true, render all pages stacked vertically (modal viewer).
   *  When false/undefined, render only the first page (card preview). */
  allPages?: boolean;
};

export default function PdfPreview({ src, allPages = false }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(400);
  const [errored, setErrored] = useState(false);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0) setWidth(Math.round(w));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (errored) {
    return (
      <div className={allPages ? 'flex h-full w-full items-center justify-center bg-paper-soft' : 'absolute inset-0 flex items-center justify-center bg-paper-soft'}>
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-paper-dim">
          Preview unavailable
        </span>
      </div>
    );
  }

  const wrapClass = allPages
    ? 'flex w-full flex-col items-center gap-4 bg-paper py-4'
    : 'absolute inset-0 flex items-start justify-center overflow-hidden bg-paper';

  return (
    <div ref={wrapRef} className={wrapClass}>
      <Document
        file={src}
        onLoadSuccess={({ numPages: n }) => setNumPages(n)}
        loading={
          <div className="flex h-full w-full items-center justify-center py-12">
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-paper-dim/70">
              Rendering…
            </span>
          </div>
        }
        error={
          <div className="flex h-full w-full items-center justify-center py-12">
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-paper-dim">
              Preview unavailable
            </span>
          </div>
        }
        onLoadError={() => setErrored(true)}
        onSourceError={() => setErrored(true)}
      >
        {allPages && numPages > 0 ? (
          Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              width={width}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))
        ) : (
          <Page
            pageNumber={1}
            width={width}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        )}
      </Document>
    </div>
  );
}
