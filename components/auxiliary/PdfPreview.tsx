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

export default function PdfPreview({ src }: { src: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(400);
  const [errored, setErrored] = useState(false);

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
      <div className="absolute inset-0 flex items-center justify-center bg-paper-soft">
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-paper-dim">
          Preview unavailable
        </span>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="absolute inset-0 flex items-start justify-center overflow-hidden bg-paper">
      <Document
        file={src}
        loading={
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-paper-dim/70">
              Rendering…
            </span>
          </div>
        }
        error={
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-paper-dim">
              Preview unavailable
            </span>
          </div>
        }
        onLoadError={() => setErrored(true)}
        onSourceError={() => setErrored(true)}
      >
        <Page
          pageNumber={1}
          width={width}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
}
