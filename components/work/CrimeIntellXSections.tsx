'use client';

import { useState } from 'react';
import Link from 'next/link';
import Reveal from '@/components/motion/Reveal';

/**
 * CrimeIntellX: the sections after the story quotes.
 * Facts come from the published IJIRE paper (Vol 7, Issue 2, Mar-Apr 2026, pp. 254-261).
 * All demo data below is simulated, and each demo says so.
 */

const MANILA = 'var(--page-manila)';
const CRIMSON = 'var(--page-crimson-hi)';
const GREEN = 'var(--page-green)';
const DIM = 'var(--page-dim)';

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: MANILA }}>
      {children}
    </p>
  );
}

function Heading({ a, b }: { a: string; b: string }) {
  return (
    <h2 className="mt-4 font-display text-4xl tracking-tight md:text-6xl" style={{ lineHeight: 0.98, color: 'var(--page-paper)' }}>
      {a}
      <br />
      <span className="italic" style={{ color: MANILA }}>
        {b}
      </span>
    </h2>
  );
}

const card = {
  border: '1px solid rgba(216,192,137,0.3)',
  background: 'linear-gradient(135deg, rgba(216,192,137,0.07), rgba(216,192,137,0.015))',
} as const;

/* ------------------------------------------------------------------ 1 · How it's built */

const SPECS = [
  { big: '18', unit: 'screens', line: 'Flutter web app, Provider state', tag: 'Front' },
  { big: '83', unit: 'endpoints', line: 'FastAPI, Firebase sign-in and 8-hour JWT', tag: 'API' },
  { big: '12', unit: 'tables', line: 'SQLite for the build, Pinecone for case vectors', tag: 'Data' },
  { big: '<1', unit: 'ms', line: 'ArcFace + FAISS face match at 10,000 records', tag: 'Speed' },
];

const CHAIN = [
  { n: '01', t: 'Upload', d: 'An officer adds a file to the FIR.' },
  { n: '02', t: 'Hash', d: 'BLAKE3 fingerprints the exact bytes.' },
  { n: '03', t: 'Encrypt', d: 'AES-256-CBC locks the file.' },
  { n: '04', t: 'Seal', d: 'The hash joins a Merkle tree; the root is stored against the FIR.' },
];

export function CIXBuilt() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-20 md:px-12 md:py-28" aria-label="How CrimeIntellX is built">
      <Reveal>
        <Kicker>§ How it&rsquo;s built</Kicker>
        <Heading a="Three tiers." b="One chain of custody." />
        <p className="mt-5 max-w-2xl font-sans text-base md:text-lg" style={{ color: 'var(--page-text)', opacity: 0.8 }}>
          A Flutter app on top, a FastAPI server behind it, and a data layer under both. Every file that enters the system walks the same four steps.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {SPECS.map((s, i) => (
          <Reveal key={s.tag} delay={i * 0.06}>
            <div className="h-full p-4 md:p-6" style={card}>
              <p className="font-mono text-[9px] uppercase tracking-[0.35em]" style={{ color: DIM }}>
                {s.tag}
              </p>
              <p className="mt-3 font-display text-5xl leading-none md:text-6xl" style={{ color: MANILA }}>
                {s.big}
                <span className="ml-1 font-mono text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--page-paper)' }}>
                  {s.unit}
                </span>
              </p>
              <p className="mt-3 font-sans text-sm" style={{ color: 'var(--page-text)', opacity: 0.75 }}>
                {s.line}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <ol className="mt-10 grid gap-3 md:grid-cols-4 md:gap-4">
        {CHAIN.map((c, i) => (
          <Reveal key={c.n} delay={i * 0.08}>
            <li className="relative list-none p-5" style={{ ...card, borderColor: i === 3 ? MANILA : 'rgba(216,192,137,0.3)' }}>
              <span className="font-mono text-[11px] tracking-[0.3em]" style={{ color: MANILA }}>
                {c.n}
              </span>
              <p className="mt-2 font-display text-2xl" style={{ color: 'var(--page-paper)' }}>
                {c.t}
              </p>
              <p className="mt-1 font-sans text-sm" style={{ color: 'var(--page-text)', opacity: 0.75 }}>
                {c.d}
              </p>
              {i < CHAIN.length - 1 && (
                <span aria-hidden className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 text-lg md:-right-3 md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0" style={{ color: MANILA }}>
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:inline">→</span>
                </span>
              )}
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ 2 · The seal (interactive Merkle tree) */

const LEAVES = [90, 210, 330, 450];
const HASHES = [150, 390];
const ROOT = 270;

function Box({ cx, y, w, h, label, bad, strong }: { cx: number; y: number; w: number; h: number; label: string; bad?: boolean; strong?: boolean }) {
  return (
    <g>
      <rect
        x={cx - w / 2}
        y={y}
        width={w}
        height={h}
        rx={4}
        fill={bad ? '#2e1212' : strong ? 'rgba(216,192,137,0.2)' : 'rgba(216,192,137,0.08)'}
        stroke={bad ? 'var(--page-crimson-hi)' : 'var(--page-manila)'}
        strokeWidth={2.2}
        style={{ transition: 'all .35s ease' }}
      />
      <text
        x={cx}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fontSize={12}
        letterSpacing={2}
        fill={bad ? '#ff8a8a' : 'var(--page-paper)'}
        fontFamily="var(--font-mono, monospace)"
        style={{ transition: 'fill .35s ease' }}
      >
        {label}
      </text>
    </g>
  );
}

export function CIXSeal() {
  const [tampered, setTampered] = useState(false);
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-16 md:px-12 md:py-24" aria-label="Tamper detection demo">
      <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
        <Reveal className="md:col-span-5">
          <Kicker>§ The seal</Kicker>
          <Heading a="Change one byte." b="The root stops matching." />
          <p className="mt-5 font-sans text-base md:text-lg" style={{ color: 'var(--page-text)', opacity: 0.8 }}>
            Courts throw out files whose integrity can&rsquo;t be proven (BSA Section 65B). So each file gets a BLAKE3 hash, and the hashes are folded into a per-FIR Merkle tree. Try breaking it.
          </p>
          <button
            type="button"
            onClick={() => setTampered((v) => !v)}
            aria-pressed={tampered}
            className="mt-7 inline-flex items-center gap-3 border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em] transition-colors"
            style={{
              borderColor: tampered ? GREEN : CRIMSON,
              color: tampered ? GREEN : CRIMSON,
              background: tampered ? 'rgba(31,163,122,0.08)' : 'rgba(184,30,42,0.1)',
            }}
          >
            {tampered ? '↺ Restore File 3' : '✎ Tamper with File 3'}
          </button>
          <p
            role="status"
            aria-live="polite"
            className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em]"
            style={{ color: tampered ? CRIMSON : GREEN }}
          >
            {tampered ? '✕ Verification failed: root mismatch' : '✓ Verified: root matches the FIR'}
          </p>
        </Reveal>

        <Reveal className="md:col-span-7" delay={0.1}>
          <div className="p-3 md:p-6" style={card}>
            <svg viewBox="0 0 540 360" className="block h-auto w-full" role="img" aria-label="Merkle tree of four files, a hash layer and a root seal">
              <g stroke="var(--page-manila)" strokeWidth={2} fill="none" strokeOpacity={0.8}>
                {LEAVES.map((c, i) => (
                  <path key={c} d={`M${c} 276 V250 H${HASHES[i >> 1]} V232`} stroke={tampered && i === 2 ? 'var(--page-crimson-hi)' : undefined} style={{ transition: 'stroke .35s ease' }} />
                ))}
                {HASHES.map((h, i) => (
                  <path key={h} d={`M${h} 188 V150 H${ROOT} V122`} stroke={tampered && i === 1 ? 'var(--page-crimson-hi)' : undefined} style={{ transition: 'stroke .35s ease' }} />
                ))}
              </g>
              {LEAVES.map((c, i) => (
                <Box key={c} cx={c} y={276} w={92} h={44} label={tampered && i === 2 ? 'EDITED' : `FILE ${i + 1}`} bad={tampered && i === 2} />
              ))}
              {HASHES.map((h, i) => (
                <Box key={h} cx={h} y={188} w={92} h={44} label={tampered && i === 1 ? 'HASH ≠' : 'HASH'} bad={tampered && i === 1} />
              ))}
              <Box cx={ROOT} y={74} w={160} h={48} label={tampered ? 'ROOT ≠ SEAL' : 'ROOT SEAL'} bad={tampered} strong />
            </svg>
            <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: DIM }}>
              Demo with sample files
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 3 · Ask the case (RAG, simulated answers) */

const QA = [
  {
    q: 'Any repeat pattern with earlier burglaries in this area?',
    a: 'Two earlier FIRs from the last six months share the same method: night entry through a rear window. One known offender in the criminal database matches that pattern.',
    src: ['Similar FIRs · 2', 'Criminal database · 1'],
  },
  {
    q: 'Flag anything odd in the call records.',
    a: 'One number made 14 calls inside 40 minutes (burst calling). Another switched between two towers within five minutes (rapid tower-hopping).',
    src: ['CDR anomalies · 2'],
  },
  {
    q: 'What evidence is still missing for this case?',
    a: 'Witness statement not yet uploaded. Scene photos uploaded but not hashed. Lab report still pending.',
    src: ['Evidence-gap checklist · 3'],
  },
];

export function CIXAsk() {
  const [i, setI] = useState(0);
  const cur = QA[i];
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-16 md:px-12 md:py-24" aria-label="Ask the case demo">
      <Reveal>
        <Kicker>§ Ask the case</Kicker>
        <Heading a="Ask in plain words." b="Get a structured answer." />
        <p className="mt-5 max-w-2xl font-sans text-base md:text-lg" style={{ color: 'var(--page-text)', opacity: 0.8 }}>
          The query engine pulls similar FIRs from Pinecone, checks the criminal database, scans dark-web feeds and returns a structured report in about eight seconds. Pick a question.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-9 grid gap-4 md:grid-cols-12">
          <div className="flex flex-col gap-2 md:col-span-5" role="tablist" aria-label="Sample questions">
            {QA.map((x, k) => (
              <button
                key={x.q}
                type="button"
                role="tab"
                aria-selected={k === i}
                onClick={() => setI(k)}
                className="p-4 text-left font-sans text-sm transition-colors md:text-base"
                style={{
                  ...card,
                  borderColor: k === i ? MANILA : 'rgba(216,192,137,0.25)',
                  color: k === i ? 'var(--page-paper)' : 'var(--page-text)',
                  background: k === i ? 'rgba(216,192,137,0.14)' : card.background,
                }}
              >
                <span className="mr-2 font-mono text-[10px] tracking-[0.3em]" style={{ color: MANILA }}>
                  {`Q${k + 1}`}
                </span>
                {x.q}
              </button>
            ))}
          </div>

          <div className="p-5 md:col-span-7 md:p-7" style={card} role="tabpanel" aria-live="polite">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em]" style={{ color: DIM }}>
              Officer asks
            </p>
            <p className="mt-2 font-display text-xl md:text-2xl" style={{ color: 'var(--page-paper)' }}>
              &ldquo;{cur.q}&rdquo;
            </p>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.35em]" style={{ color: MANILA }}>
              CrimeIntellX answers
            </p>
            <p className="mt-2 font-sans text-base leading-relaxed md:text-lg" style={{ color: 'var(--page-text)' }}>
              {cur.a}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {cur.src.map((s) => (
                <span key={s} className="border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ borderColor: 'rgba(216,192,137,0.45)', color: MANILA }}>
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: DIM }}>
              Sample answers on simulated data · Llama 3.3 70B on Groq · five-level fallback
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ 4 · Call records */

const CONTACTS = [
  { id: 'A', calls: 14, note: '14 calls in 40 minutes. Flagged as burst calling.', hot: true, x: 270, y: 40 },
  { id: 'B', calls: 6, note: '6 calls, all at night.', x: 440, y: 105 },
  { id: 'C', calls: 9, note: 'Also appears in a second suspect’s records.', shared: true, x: 440, y: 255 },
  { id: 'D', calls: 3, note: '3 short calls.', x: 270, y: 320 },
  { id: 'E', calls: 5, note: 'Switched towers twice in five minutes.', hot: true, x: 100, y: 255 },
  { id: 'F', calls: 2, note: '2 calls, one day apart.', x: 100, y: 105 },
];

export function CIXCalls() {
  const [sel, setSel] = useState('A');
  const cur = CONTACTS.find((c) => c.id === sel)!;
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-16 md:px-12 md:py-24" aria-label="Call record graph demo">
      <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
        <Reveal className="md:order-2 md:col-span-5">
          <Kicker>§ Call records</Kicker>
          <Heading a="Spreadsheets in." b="A network out." />
          <p className="mt-5 font-sans text-base md:text-lg" style={{ color: 'var(--page-text)', opacity: 0.8 }}>
            Upload a call-detail spreadsheet and it becomes a graph. Thicker lines mean more calls, red marks burst calling or rapid tower-hopping, and a gold ring shows a contact shared with another suspect.
          </p>
          <div className="mt-6 p-4" style={card} aria-live="polite">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: MANILA }}>
              Contact {cur.id}
            </p>
            <p className="mt-2 font-sans text-sm md:text-base" style={{ color: 'var(--page-text)' }}>
              {cur.note}
            </p>
          </div>
        </Reveal>

        <Reveal className="md:order-1 md:col-span-7" delay={0.1}>
          <div className="p-3 md:p-6" style={card}>
            <svg viewBox="0 0 540 360" className="block h-auto w-full" role="img" aria-label="Call graph: one suspect in the centre with six contacts">
              {CONTACTS.map((c) => (
                <line
                  key={c.id}
                  x1={270}
                  y1={180}
                  x2={c.x}
                  y2={c.y}
                  stroke={c.hot ? 'var(--page-crimson-hi)' : 'var(--page-manila)'}
                  strokeOpacity={sel === c.id ? 1 : 0.55}
                  strokeWidth={Math.max(1.5, c.calls / 2.2)}
                  strokeLinecap="round"
                />
              ))}
              <circle cx={270} cy={180} r={36} fill="rgba(216,192,137,0.16)" stroke="var(--page-manila)" strokeWidth={2.4} />
              <text x={270} y={185} textAnchor="middle" fontSize={12} letterSpacing={2} fill="var(--page-paper)" fontFamily="var(--font-mono, monospace)">
                SUSPECT
              </text>
              {CONTACTS.map((c) => (
                <g key={c.id} onClick={() => setSel(c.id)} style={{ cursor: 'pointer' }} role="button" aria-label={`Contact ${c.id}`} tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel(c.id)}>
                  {c.shared && <circle cx={c.x} cy={c.y} r={30} fill="none" stroke="var(--page-manila)" strokeWidth={2} strokeDasharray="4 5" />}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={22}
                    fill={sel === c.id ? (c.hot ? 'rgba(184,30,42,0.45)' : 'rgba(216,192,137,0.3)') : '#0B1A2E'}
                    stroke={c.hot ? 'var(--page-crimson-hi)' : 'var(--page-manila)'}
                    strokeWidth={2}
                  />
                  <text x={c.x} y={c.y + 5} textAnchor="middle" fontSize={14} fill="var(--page-paper)" fontFamily="var(--font-mono, monospace)">
                    {c.id}
                  </text>
                </g>
              ))}
            </svg>
            <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: DIM }}>
              Simulated call records · tap a contact
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 5 · On the record */

export function CIXRecord() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-16 md:px-12 md:py-28" aria-label="Publication and next step">
      <Reveal>
        <Kicker>§ On the record</Kicker>
        <Heading a="Published." b="And honest about what's next." />
      </Reveal>

      <div className="mt-10 grid gap-4 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <div className="h-full p-6 md:p-8" style={card}>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em]" style={{ color: MANILA }}>
              IJIRE · Vol 7, Issue 2 · Mar - Apr 2026 · pp. 254-261
            </p>
            <p className="mt-4 font-display text-2xl leading-snug md:text-3xl" style={{ color: 'var(--page-paper)' }}>
              BLAKE3-Merkle Cryptographic Framework with RAG-Powered AI for Tamper-Proof Evidence Management in Criminal Investigation
            </p>
            <p className="mt-4 font-sans text-sm" style={{ color: 'var(--page-text)', opacity: 0.75 }}>
              Dr. Santhi Baskaran, Gauttham R, Thangamani K, Methishwaran V. Open access (CC BY 4.0).
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/research/crimeintellx-ijire.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em] transition-colors hover:bg-[var(--page-manila)] hover:text-[var(--page-bg)]"
                style={{ borderColor: MANILA, color: MANILA }}
              >
                Read the paper <span aria-hidden>↗</span>
              </a>
              <a
                href="https://www.doi.org/10.59256/ijire.20260702031"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em]"
                style={{ borderColor: 'rgba(216,192,137,0.4)', color: DIM }}
              >
                DOI
              </a>
              <Link href="/research" className="inline-flex items-center gap-2 px-2 py-3 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: DIM }}>
                Research page →
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal className="md:col-span-5" delay={0.1}>
          <div className="h-full p-6 md:p-8" style={{ ...card, borderColor: 'rgba(242,192,20,0.45)' }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em]" style={{ color: 'var(--page-caution)' }}>
              Where it stands
            </p>
            <ul className="mt-4 space-y-3 font-sans text-sm md:text-base" style={{ color: 'var(--page-text)' }}>
              <li>Tested on simulated Indian datasets: FIRs, face embeddings and call records.</li>
              <li>Checked against BSA Section 65B for electronic evidence.</li>
              <li>No field pilot yet. The next step is one or two police stations in Puducherry.</li>
            </ul>
          </div>
        </Reveal>
      </div>

    </section>
  );
}
