'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal from '@/components/motion/Reveal';
import AnimatedHeading from '@/components/motion/AnimatedHeading';

const PdfPreview = dynamic(() => import('@/components/auxiliary/PdfPreview'), { ssr: false });

const ABSTRACT =
  'CrimeIntellX (CrimeLens AI) is an AI-augmented forensic case-management workspace that fuses RAG over heterogeneous evidence, encrypted ingestion pipelines, and call-detail-record analytics into a single investigator UI. Built as a final-year project, it processes 240 mock case files across PDF, image, audio, and structured CDR formats; surfaces semantic matches via Pinecone vector search; and renders cross-suspect tower-collocation patterns in under two seconds per query.';

const META = [
  ['Journal', 'IJIRE'],
  ['Volume', '7'],
  ['Issue', '3'],
  ['Year', '2025'],
  ['Pages', '8'],
  ['DOI', 'pending'],
  ['Language', 'English'],
  ['Peer-reviewed', 'Yes'],
];

const METHODOLOGY = [
  {
    kicker: 'Ingestion',
    body:
      'FastAPI bulk-hybrid uploader, 240 mock files, MIME detection, AES-256 encryption per case, MinIO object storage.',
  },
  {
    kicker: 'Indexing',
    body:
      'gemini-1.5-pro embeddings, Pinecone vector index, chunking @ 512 tokens with 64-token overlap.',
  },
  {
    kicker: 'CDR analytics',
    body:
      'pandas + networkx force-directed call graph, 5-minute tower-collocation buckets, cross-suspect pattern detection.',
  },
  {
    kicker: 'Investigator UX',
    body:
      'Flutter mobile + React web, magnifier-search overlay, IDENTIFIED-stamp entity resolution.',
  },
];

const FINDINGS = [
  {
    stat: '240',
    unit: 'files',
    body: 'Indexed in 2 minutes. Sub-2-second search latency end-to-end on commodity hardware.',
  },
  {
    stat: '92%',
    unit: 'recall',
    body: 'Cross-suspect pattern detection across 5-minute tower-collocation buckets on the mock dataset.',
  },
  {
    stat: '0',
    unit: 'leaks',
    body: 'Per-case encryption key with audit trail. Zero-leak invariant validated under teardown.',
  },
];

const CITATION =
  'Gauttham R. (2025). CrimeIntellX: An AI-Augmented Forensic Workspace for Case Files, Evidence and CDRs. International Journal of Innovative Research in Engineering, 7(3), pp. 1-8.';

export default function ResearchClient() {
  const [pdfOpen, setPdfOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(CITATION);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      {/* Hero band */}
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-40 md:pt-52">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
            § Research · 2025
          </p>
        </Reveal>
        <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-tight text-paper md:text-7xl lg:text-8xl">
          <AnimatedHeading
            as="span"
            mode="letters"
            text="CrimeIntellX"
            delay={0.12}
            className="inline-block"
          />
          <AnimatedHeading
            as="span"
            mode="letters"
            text="."
            delay={0.7}
            className="inline-block italic text-amber"
          />
        </h1>
        <AnimatedHeading
          as="p"
          mode="words"
          text="Published in IJIRE Vol 7 Issue 3 — International Journal of Innovative Research in Engineering."
          stagger={0.04}
          delay={0.85}
          className="mt-6 max-w-2xl font-sans text-base italic text-paper-dim md:text-lg"
        />
      </section>

      {/* Meta strip */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <Reveal>
          <div className="flex flex-wrap gap-2 border-y border-rule py-4">
            {META.map(([k, v]) => (
              <span
                key={k}
                className="inline-flex items-center gap-2 rounded-sm border border-paper-soft bg-paper-soft/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-paper"
              >
                <span className="text-paper-dim">{k}</span>
                <span className="text-amber">·</span>
                <span>{v}</span>
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Authors */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">Authors</p>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-8 border-t border-rule pt-6 md:grid-cols-2">
          <Reveal dir="left">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
                Lead author
              </p>
              <p className="mt-2 font-display text-2xl text-paper md:text-3xl">Gauttham R.</p>
              <p className="mt-1 font-sans text-sm text-paper-dim">
                B.Tech in Information Technology, Puducherry Technological University
              </p>
            </div>
          </Reveal>
          <Reveal dir="right" delay={0.08}>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
                Affiliation
              </p>
              <p className="mt-2 font-display text-2xl text-paper md:text-3xl">Independent</p>
              <p className="mt-1 font-sans text-sm text-paper-dim">
                Final-year capstone — peer-reviewed by IJIRE editorial board.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Abstract */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">Abstract</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-3xl font-display text-2xl italic leading-[1.45] text-paper-dim md:text-3xl">
            {ABSTRACT}
          </p>
        </Reveal>
      </section>

      {/* Methodology */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
            Methodology
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight text-paper md:text-5xl">
            Four stages, one investigator UI.
          </h2>
        </Reveal>
        <ol className="mt-12 space-y-10 border-t border-rule pt-10">
          {METHODOLOGY.map((m, i) => (
            <Reveal key={m.kicker} delay={i * 0.08}>
              <li className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 md:grid-cols-[auto_auto_1fr] md:gap-x-10">
                <span className="font-mono text-xl text-amber md:text-3xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-2xl text-paper md:text-3xl">{m.kicker}</span>
                <p className="col-span-2 mt-3 max-w-2xl font-sans text-base text-paper-dim md:col-span-1 md:mt-0 md:text-lg">
                  {m.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Findings */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
            Key findings
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {FINDINGS.map((f, i) => (
            <Reveal key={f.stat} delay={i * 0.08}>
              <div className="rounded-md border border-rule bg-paper-soft/30 p-6 transition-colors hover:border-amber/40">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl text-amber md:text-6xl">{f.stat}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
                    {f.unit}
                  </span>
                </div>
                <p className="mt-4 font-sans text-sm text-paper-dim md:text-base">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Citation */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">Citation</p>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="mt-6 rounded-md border border-rule bg-ink p-6 md:p-8">
            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-paper-dim md:text-sm">
              {CITATION}
            </pre>
            <button
              type="button"
              onClick={onCopy}
              className="mt-6 inline-flex items-center gap-2 rounded-sm border border-paper-soft px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-amber transition-colors hover:border-amber/60 hover:text-paper"
            >
              {copied ? '✓ Copied' : 'Copy citation'}
            </button>
          </div>
        </Reveal>
      </section>

      {/* Actions */}
      <section className="mx-auto max-w-6xl px-6 pb-32">
        <Reveal>
          <div className="flex flex-wrap items-center gap-4 border-t border-rule pt-12">
            <a
              href="/research/crimeintellx-ijire.pdf"
              download
              className="inline-flex items-center justify-center rounded-md bg-amber px-7 py-4 font-mono text-xs uppercase tracking-[0.3em] text-ink transition-colors hover:bg-paper"
            >
              ↓ Download PDF
            </a>
            <button
              type="button"
              onClick={() => setPdfOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-paper-soft px-7 py-4 font-mono text-xs uppercase tracking-[0.3em] text-paper transition-colors hover:border-amber hover:text-amber"
            >
              View full PDF
            </button>
            <Link
              href="/work/final-year-project"
              className="inline-flex items-center font-mono text-xs uppercase tracking-[0.3em] text-amber hover:text-paper"
            >
              Read the case study →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* PDF modal */}
      <AnimatePresence>
        {pdfOpen && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/95 px-4 py-8 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setPdfOpen(false)}
          >
            <motion.div
              className="relative h-full w-full max-w-6xl overflow-hidden rounded-md border border-rule bg-ink shadow-2xl"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-rule px-5 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
                  CrimeIntellX — IJIRE 2025
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href="/research/crimeintellx-ijire.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber hover:text-paper"
                  >
                    Open in new tab
                  </a>
                  <button
                    type="button"
                    onClick={() => setPdfOpen(false)}
                    className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper-dim hover:text-amber"
                  >
                    Close ✕
                  </button>
                </div>
              </div>
              <div className="h-[calc(100%-44px)] overflow-y-auto bg-paper">
                <PdfPreview src="/research/crimeintellx-ijire.pdf" allPages />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
