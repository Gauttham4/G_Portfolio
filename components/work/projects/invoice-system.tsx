'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

// ApprovePay microsite: finance-ledger identity. Navy + paper, emerald for
// approval, audit-red held back for rejection only.
const GREEN = '#3FBF94';
const GREEN_LT = '#6FE0B8';
const GREEN_INK = '#0E7556';
const RED = '#C0392B';
const RED_LT = '#F29A91';
const PAPER = '#FBF8F1';
const INK = '#14203D';
const INK_DIM = '#4A5878';
const SOFT = '#C5CEE3';

const ROLES = [
  { name: 'Clerk', verb: 'Submit', job: 'Transcribes the invoice.', detail: 'Creates invoices and attaches the supporting documents. Can edit only before the first approval.' },
  { name: 'Finance', verb: 'Review', job: 'Verifies the math.', detail: 'First approver. Can return an invoice to the clerk with a note.' },
  { name: 'Auditor', verb: 'Audit', job: 'Checks the paperwork against the PO.', detail: 'Second approver. Can flag an invoice for compliance review.' },
  { name: 'Admin', verb: 'Sign off', job: 'Signs off.', detail: 'Final approver. Also manages users, vendors and approval policy.' },
];
const STATUS = ['Draft', 'Pending Finance', 'Pending Auditor', 'Pending Admin', 'Approved'];
const NOTES = ['', 'math verified', 'matched to PO', 'final sign-off'];

type Entry = { n: number; role: string; action: string; from: string; to: string; note: string };
const SEED: Entry[] = [{ n: 1, role: 'Clerk', action: 'created', from: 'new', to: 'Pending Finance', note: 'invoice and document filed' }];

// gallery-3.jpg is a byte-identical copy of gallery-2.jpg, so it is shown once.
const VAULT = [
  { src: '/work/invoice-system/gallery-1.jpg', cap: 'Signing · ink', alt: 'A hand signing a paper document with a pen', cls: 'lg:col-span-3', ar: 'aspect-[4/3] lg:aspect-[16/10]' },
  { src: '/work/invoice-system/gallery-2.jpg', cap: 'Calculator · forms', alt: 'Tax forms, a phone calculator and a pen laid out on a table', cls: 'lg:col-span-3', ar: 'aspect-[4/3] lg:aspect-[16/10]' },
  { src: '/work/invoice-system/gallery-4.jpg', cap: 'Dashboard · data', alt: 'A laptop showing a revenue dashboard with bar charts', cls: 'lg:col-span-2', ar: 'aspect-[4/3]' },
  { src: '/work/invoice-system/gallery-5.jpg', cap: 'Team · review', alt: 'A team meeting in a brick office with a presenter at a screen', cls: 'lg:col-span-2', ar: 'aspect-[4/3]' },
  { src: '/work/invoice-system/gallery-6.jpg', cap: 'Paperwork · desk', alt: 'Printed forms, a calculator and a coffee cup on a dark desk', cls: 'sm:col-span-2 lg:col-span-2', ar: 'aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3]' },
];

const MARQUEE = ['Audit log · append-only', 'Pending Finance', 'Pending Auditor', 'Pending Admin', 'Approved', 'Rejected'];

function inline(s: string): ReactNode[] {
  return s.split('`').map((p, i) =>
    i % 2 ? (
      <code key={i} className="ap-mono rounded px-1.5 py-0.5 text-[0.9em]" style={{ background: 'rgba(63,191,148,.14)', color: GREEN_LT }}>
        {p}
      </code>
    ) : (
      p
    ),
  );
}

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / 1100);
          el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return <span ref={ref}>{to}</span>;
}

function Head({ n, kicker, title, dark = true }: { n: string; kicker: string; title: string; dark?: boolean }) {
  return (
    <div className="ap-rv mb-10 md:mb-14">
      <p className="ap-mono text-xs uppercase tracking-[0.22em]" style={{ color: dark ? GREEN_LT : RED }}>
        § {n} · {kicker}
      </p>
      <h2 className="font-display mt-3 text-[2rem] leading-[1.05] md:text-5xl" style={{ color: dark ? PAPER : INK }}>
        {title}
      </h2>
    </div>
  );
}

function Chip({ state, label }: { state: string; label: string }) {
  return (
    <span className="ap-chip ap-mono inline-flex min-h-7 items-center rounded-full px-3 text-[11px] font-medium uppercase tracking-[0.14em]" data-s={state}>
      {label}
    </span>
  );
}

export default function Page({ theme }: { theme: ProjectTheme }) {
  const root = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [stage, setStage] = useState(1);
  const [rej, setRej] = useState<number | null>(null);
  const [focus, setFocus] = useState(1);
  const [log, setLog] = useState<Entry[]>(SEED);
  const p = theme.palette;

  useEffect(() => {
    const els = root.current?.querySelectorAll('.ap-rv');
    if (!els) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((e) => e.classList.add('ap-in'));
      return;
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('ap-in');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  const rState = (i: number) => (rej === i ? 'rejected' : i < stage ? 'done' : i === stage && rej === null ? 'active' : 'waiting');
  const label = (i: number) => {
    const s = rState(i);
    return s === 'done' ? (i === 0 ? 'Filed' : 'Approved') : s === 'active' ? 'Pending' : s === 'rejected' ? 'Rejected' : 'Waiting';
  };
  const canAct = rej === null && stage >= 1 && stage <= 3;
  const statusText = rej !== null ? 'Rejected' : STATUS[stage];

  const approve = () => {
    if (!canAct) return;
    setLog((l) => [...l, { n: l.length + 1, role: ROLES[stage].name, action: stage === 3 ? 'approved (final)' : 'approved', from: STATUS[stage], to: STATUS[stage + 1], note: NOTES[stage] }]);
    setStage(stage + 1);
    setFocus(Math.min(stage + 1, 3));
  };
  const reject = () => {
    if (!canAct) return;
    setLog((l) => [...l, { n: l.length + 1, role: ROLES[stage].name, action: 'rejected', from: STATUS[stage], to: 'Rejected', note: 'reason recorded' }]);
    setRej(stage);
  };
  const reset = () => {
    setStage(1);
    setRej(null);
    setFocus(1);
    setLog(SEED);
  };

  return (
    <div
      ref={root}
      className="ap-root relative overflow-x-clip"
      style={{
        background: p.bg,
        color: p.text,
        backgroundImage: 'linear-gradient(rgba(251,248,241,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(251,248,241,.04) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      <style>{CSS}</style>

      {/* ---------- HERO ---------- */}
      <header className="mx-auto grid min-h-[88svh] max-w-7xl items-center gap-12 px-5 pb-16 pt-24 md:px-10 md:pt-36 lg:grid-cols-[1.02fr_1fr] lg:gap-14">
        <div>
          <p className="ap-mono ap-up text-xs uppercase tracking-[0.2em]" style={{ color: GREEN_LT, ['--d' as string]: '0s' }}>
            {theme.kicker}
          </p>
          <h1 className="font-display ap-up mt-5 text-[clamp(3.1rem,13vw,6.25rem)] font-semibold leading-[0.9] tracking-tight" style={{ ['--d' as string]: '.1s' }}>
            Approve<span className="italic" style={{ color: GREEN }}>Pay</span>
          </h1>
          <p className="ap-up mt-6 max-w-md text-lg leading-relaxed md:text-xl" style={{ color: SOFT, ['--d' as string]: '.2s' }}>
            {theme.subtitle}
          </p>
          <ol className="ap-up ap-mono mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm uppercase tracking-[0.12em]" style={{ ['--d' as string]: '.3s' }} aria-label="Approval chain">
            {ROLES.map((r, i) => (
              <li key={r.name} className="flex items-center gap-3">
                <span style={{ color: PAPER }}>{r.name}</span>
                {i < 3 && <span aria-hidden style={{ color: GREEN }}>→</span>}
              </li>
            ))}
          </ol>
          <div className="ap-up mt-9 flex flex-wrap gap-3" style={{ ['--d' as string]: '.4s' }}>
            <a href="#chain" className="ap-btn ap-mono inline-flex min-h-12 items-center rounded-md px-6 text-sm font-medium uppercase tracking-[0.12em]" style={{ background: GREEN, color: p.bg }}>
              Run the chain
            </a>
            <button type="button" onClick={() => setRun((r) => r + 1)} className="ap-btn ap-mono inline-flex min-h-12 items-center rounded-md border px-6 text-sm uppercase tracking-[0.12em]" style={{ borderColor: 'rgba(251,248,241,.3)', color: PAPER }}>
              Re-stamp
            </button>
          </div>
        </div>

        {/* invoice document */}
        <div className="ap-up mx-auto w-full max-w-[34rem] lg:max-w-none" style={{ ['--d' as string]: '.25s' }}>
          <div key={run} className="ap-doc relative rounded-md p-5 shadow-[0_18px_40px_rgba(0,0,0,.35)] md:p-8" style={{ background: PAPER, color: INK }}>
            <div className="flex items-start justify-between gap-4 border-b-2 pb-4" style={{ borderColor: INK }}>
              <div>
                <p className="ap-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: INK_DIM }}>Invoice</p>
                <p className="ap-mono mt-1 text-xl font-semibold md:text-2xl">INV-0417</p>
              </div>
              <span className="ap-mono rounded border px-2 py-1 text-[11px] uppercase tracking-[0.14em]" style={{ borderColor: INK_DIM, color: INK_DIM }}>
                Sample record
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div><dt className="ap-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: INK_DIM }}>Vendor</dt><dd className="mt-0.5 font-medium">Sample Supplier Co.</dd></div>
              <div><dt className="ap-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: INK_DIM }}>PO number</dt><dd className="ap-mono mt-0.5 font-medium">PO-2291</dd></div>
            </dl>
            <div className="mt-5 grid grid-cols-4 gap-1.5 sm:gap-2" aria-label="Approval progress">
              {ROLES.map((r, i) => (
                <span key={r.name} className="ap-hchip ap-mono relative flex min-h-9 items-center justify-center rounded text-[10px] uppercase tracking-[0.06em] sm:text-[11px]" style={{ ['--i' as string]: i }}>
                  <span className="opacity-100" style={{ color: INK_DIM }}>{r.name}</span>
                  <span aria-hidden className="ap-chipon absolute inset-0 flex items-center justify-center rounded font-semibold" style={{ background: GREEN_INK, color: PAPER }}>
                    {r.name}
                  </span>
                </span>
              ))}
            </div>
            <div className="ap-mono mt-6 space-y-2 text-sm md:text-base">
              <div className="flex justify-between"><span style={{ color: INK_DIM }}>Line total</span><span>12,400.00</span></div>
              <div className="flex justify-between"><span style={{ color: INK_DIM }}>Tax</span><span>2,232.00</span></div>
              <div className="flex items-baseline justify-between border-t-[3px] border-double pt-3 text-xl font-semibold md:text-2xl" style={{ borderColor: INK }}>
                <span>Total</span><span>14,632.00</span>
              </div>
            </div>
            <div className="relative mt-5 flex min-h-[5.5rem] items-center justify-end pr-2 md:pr-6">
              <span aria-hidden className="ap-ring pointer-events-none absolute right-6 h-24 w-24 rounded-full border-2 md:right-12" style={{ borderColor: GREEN_INK }} />
              <div className="ap-stamp ap-arch pointer-events-none relative rounded-md border-4 border-double px-3 py-1.5 text-center" style={{ color: GREEN_INK, borderColor: GREEN_INK }}>
                <span className="block text-xl leading-none tracking-[0.08em] md:text-2xl">APPROVED</span>
                <span className="ap-mono mt-1 block text-[10px] tracking-[0.2em]">ADMIN SIGN-OFF</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 border-t pt-4" style={{ borderColor: 'rgba(20,32,61,.2)' }}>
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded">
                <Image src={theme.heroImage} alt="Scanned supporting document attached to the invoice" fill sizes="80px" priority className="object-cover" />
              </div>
              <div className="min-w-0 text-sm">
                <p className="ap-mono truncate font-medium">invoice_scan.jpg</p>
                <p style={{ color: INK_DIM }}>Document vault. Role re-checked on every download.</p>
              </div>
            </div>
          </div>
          <p className="ap-mono mt-4 text-center text-xs" style={{ color: p.dim }}>Illustrative sample data, not client records.</p>
        </div>
      </header>

      {/* ---------- MARQUEE ---------- */}
      <div className="overflow-hidden border-y py-3" style={{ borderColor: 'rgba(251,248,241,.14)', background: 'rgba(27,42,78,.6)' }} aria-hidden>
        <div className="ap-marq ap-mono flex w-max text-xs uppercase tracking-[0.2em]">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 gap-8 pr-8">
              {MARQUEE.map((m) => (
                <span key={m + k} className="flex items-center gap-8" style={{ color: m === 'Rejected' ? RED_LT : SOFT }}>
                  {m}
                  <span style={{ color: GREEN }}>◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- CHAIN CONSOLE ---------- */}
      <section id="chain" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 md:px-10 md:py-28" aria-labelledby="ap-chain">
        <Head n="01" kicker="The approval chain" title="Four roles, one chain. Run it yourself." />
        <span id="ap-chain" className="sr-only">Approval chain</span>
        <div className="ap-rv rounded-xl border p-5 md:p-8" style={{ background: p.bgMid, borderColor: 'rgba(251,248,241,.12)' }}>
          <ol className="grid gap-0 lg:grid-cols-4 lg:gap-4">
            {ROLES.map((r, i) => {
              const st = rState(i);
              return (
                <li key={r.name} className="relative pb-5 pl-[3.5rem] last:pb-0 lg:pb-0 lg:pl-0 lg:pt-[3.5rem]">
                  <span className="ap-dot ap-mono absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold" data-s={st} aria-hidden>
                    {st === 'done' ? '✓' : st === 'rejected' ? '×' : i + 1}
                  </span>
                  {i < 3 && (
                    <span className="ap-seg" aria-hidden>
                      <i style={{ ['--f' as string]: st === 'done' ? 1 : 0 }} />
                    </span>
                  )}
                  <button type="button" onClick={() => setFocus(i)} aria-pressed={focus === i} className="ap-role w-full rounded-lg border p-3 text-left md:p-4" data-on={focus === i}>
                    <span className="ap-mono block text-[11px] uppercase tracking-[0.18em]" style={{ color: p.dim }}>
                      0{i + 1} · {r.verb}
                    </span>
                    <span className="font-display mt-1 block text-2xl">{r.name}</span>
                    <span className="mt-2 block"><Chip key={st} state={st} label={label(i)} /></span>
                    <span className="mt-3 block text-sm leading-snug" style={{ color: SOFT }}>{r.job}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 flex flex-col gap-4 border-t pt-6 md:flex-row md:items-center md:justify-between" style={{ borderColor: 'rgba(251,248,241,.14)' }}>
            <p className="ap-mono text-sm uppercase tracking-[0.14em]" aria-live="polite" style={{ color: SOFT }}>
              Status{' '}
              <span key={statusText} className="ap-pop ml-2 inline-block text-lg font-semibold md:text-xl" style={{ color: rej !== null ? RED_LT : stage === 4 ? GREEN_LT : PAPER }}>
                {statusText}
              </span>
            </p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={approve} disabled={!canAct} className="ap-btn ap-mono min-h-11 rounded-md px-5 text-sm font-medium uppercase tracking-[0.1em]" style={{ background: GREEN, color: p.bg }}>
                {canAct ? `Approve as ${ROLES[stage].name}` : 'Approve'}
              </button>
              <button type="button" onClick={reject} disabled={!canAct} className="ap-btn ap-mono min-h-11 rounded-md border px-5 text-sm uppercase tracking-[0.1em]" style={{ borderColor: RED_LT, color: RED_LT }}>
                Reject
              </button>
              <button type="button" onClick={reset} className="ap-btn ap-mono min-h-11 rounded-md border px-5 text-sm uppercase tracking-[0.1em]" style={{ borderColor: 'rgba(251,248,241,.3)', color: PAPER }}>
                Reset
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_3fr] lg:gap-8">
            <div className="rounded-lg border p-5" style={{ borderColor: 'rgba(251,248,241,.12)', background: 'rgba(15,26,51,.5)' }}>
              <p className="ap-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: GREEN_LT }}>Role · {ROLES[focus].verb}</p>
              <h3 className="font-display mt-2 text-3xl">{ROLES[focus].name}</h3>
              <p className="mt-3 leading-relaxed" style={{ color: SOFT }}>{ROLES[focus].detail}</p>
              <p className="mt-4 border-t pt-4 text-sm leading-relaxed" style={{ color: p.dim, borderColor: 'rgba(251,248,241,.12)' }}>
                Each role can approve only the invoices currently at its step. Rejecting from any step ends the chain and records who and why.
              </p>
            </div>

            <div className="rounded-lg border p-5" style={{ borderColor: 'rgba(251,248,241,.12)', background: 'rgba(15,26,51,.5)' }}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="ap-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: GREEN_LT }}>audit_log</h3>
                <span className="ap-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: p.dim }}>append-only</span>
              </div>
              <ul className="mt-3">
                {log.map((e) => (
                  <li key={e.n} className="ap-row ap-mono grid grid-cols-[2.25rem_1fr] gap-x-3 gap-y-1 border-t py-3 text-[13px] md:grid-cols-[2.5rem_5.5rem_1fr_auto]" style={{ borderColor: 'rgba(251,248,241,.1)' }}>
                    <span style={{ color: p.dim }}>#{String(e.n).padStart(3, '0')}</span>
                    <span className="font-semibold" style={{ color: e.action === 'rejected' ? RED_LT : GREEN_LT }}>
                      {e.role}
                      <span className="ml-2 font-normal md:hidden" style={{ color: SOFT }}>{e.action}</span>
                    </span>
                    <span className="col-start-2 md:col-start-auto" style={{ color: SOFT }}>
                      <span className="hidden md:inline">{e.action} · </span>
                      {e.from} → <span style={{ color: e.to === 'Rejected' ? RED_LT : PAPER }}>{e.to}</span>
                      <span className="block text-[12px]" style={{ color: p.dim }}>{e.note}</span>
                    </span>
                    <span className="col-start-2 text-[11px] uppercase tracking-[0.12em] md:col-start-auto" style={{ color: p.dim }}>ip logged</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- LEDGER QUOTES (paper) ---------- */}
      <section className="ap-paper relative" style={{ background: PAPER, color: INK }} aria-labelledby="ap-quotes">
        <div className="mx-auto max-w-5xl px-5 py-20 pl-9 md:px-10 md:py-28 md:pl-24">
          <Head n="02" kicker="From the build notes" title="Entries from the ledger" dark={false} />
          <span id="ap-quotes" className="sr-only">Quotes</span>
          {theme.story.quotes.map((q, i) => (
            <article key={q.kicker} className="ap-rv grid gap-3 border-t py-8 md:grid-cols-[7rem_1fr] md:gap-10 md:py-10" style={{ borderColor: 'rgba(20,32,61,.2)', ['--d' as string]: `${i * 0.05}s` }}>
              <p className="ap-mono text-xs uppercase tracking-[0.18em]" style={{ color: RED }}>
                Nº {String(i + 1).padStart(2, '0')}
              </p>
              <div>
                <blockquote className="font-display text-[1.65rem] italic leading-snug md:text-4xl">&ldquo;{q.quote}&rdquo;</blockquote>
                <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: INK_DIM }}>{q.context}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- TOTALS ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28" aria-labelledby="ap-totals">
        <Head n="03" kicker="Totals" title="What the ledger adds up to" />
        <span id="ap-totals" className="sr-only">Key numbers</span>
        <dl className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
          {theme.bigNumbers.map((b, i) => (
            <div key={b.label} className="ap-rv" style={{ ['--d' as string]: `${i * 0.08}s` }}>
              <dd className="ap-mono border-b-4 border-double pb-2 text-[3.5rem] font-medium leading-none md:text-7xl" style={{ borderColor: 'rgba(251,248,241,.45)', color: i === 3 ? GREEN_LT : PAPER }}>
                <Counter to={parseInt(b.value, 10) || 0} />
              </dd>
              <dt className="ap-mono mt-3 text-xs uppercase leading-relaxed tracking-[0.14em] md:text-[13px]" style={{ color: SOFT }}>{b.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------- FEATURES: LINE ITEMS ---------- */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-10 md:pb-28" aria-labelledby="ap-feat">
        <Head n="04" kicker="Line items" title="Everything on the invoice" />
        <span id="ap-feat" className="sr-only">Features</span>
        <ul className="ap-rv border-b" style={{ borderColor: 'rgba(251,248,241,.14)' }}>
          {theme.features.map((f, i) => (
            <li key={f.title} className="ap-line relative grid gap-1 border-t px-3 py-5 md:grid-cols-[4.5rem_minmax(0,19rem)_1fr] md:items-baseline md:gap-6 md:px-4 md:py-6" style={{ borderColor: 'rgba(251,248,241,.14)' }}>
              <span className="ap-mono text-xs tracking-[0.14em]" style={{ color: GREEN_LT }}>L{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-display text-xl md:text-2xl">{f.title}</h3>
              <p className="leading-relaxed" style={{ color: SOFT }}>{inline(f.desc)}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- ARCHITECTURE ---------- */}
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 md:px-10 md:pb-28 lg:grid-cols-[1fr_1.4fr] lg:gap-16" aria-labelledby="ap-arch">
        <div>
          <Head n="05" kicker="The stack" title="A boring stack, on purpose" />
          <span id="ap-arch" className="sr-only">Architecture</span>
          <p className="ap-rv max-w-sm leading-relaxed" style={{ color: SOFT }}>
            One LAMP box, an auditor who reads the schema in a SQL client, and an IT person who did not have to learn Node.
          </p>
        </div>
        <div className="ap-rv relative pl-12">
          <span className="ap-rail absolute bottom-6 left-[19px] top-6 w-[2px]" aria-hidden style={{ background: `linear-gradient(${GREEN}, ${GREEN_LT})` }} />
          {theme.architecture.map((a, i) => (
            <div key={a.layer} className="relative pb-6 last:pb-0">
              <span className="ap-mono absolute -left-12 top-3 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold" style={{ background: p.bg, borderColor: GREEN, color: GREEN_LT }} aria-hidden>
                {i + 1}
              </span>
              <div className="ap-lift rounded-lg border p-4 md:p-5" style={{ background: p.bgMid, borderColor: 'rgba(251,248,241,.12)' }}>
                <h3 className="font-display text-2xl">{a.layer}</h3>
                <p className="ap-mono mt-2 text-[13px] leading-relaxed" style={{ color: SOFT }}>{a.details}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- DOCUMENT VAULT ---------- */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-10 md:pb-28" aria-labelledby="ap-vault">
        <Head n="06" kicker="Document vault" title="Attachments, kept outside the web root" />
        <span id="ap-vault" className="sr-only">Gallery</span>
        <div className="ap-rv mb-8 flex flex-wrap gap-2">
          {['PDF · JPG · PNG', '10 MB per file', '50 MB per invoice'].map((t) => (
            <span key={t} className="ap-mono rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.12em]" style={{ borderColor: 'rgba(63,191,148,.5)', color: GREEN_LT }}>{t}</span>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {VAULT.map((g, i) => (
            <figure key={g.src} className={`ap-rv ${g.cls}`} style={{ ['--d' as string]: `${i * 0.08}s` }}>
              <div className="ap-lift overflow-hidden rounded-lg border" style={{ background: p.bgMid, borderColor: 'rgba(251,248,241,.12)' }}>
              <div className={`relative w-full ${g.ar}`}>
                <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw" loading="lazy" className="object-cover" />
              </div>
              <figcaption className="ap-mono flex items-center justify-between gap-3 px-4 py-3 text-xs uppercase tracking-[0.12em]">
                <span style={{ color: SOFT }}>attachment_{String(i + 1).padStart(2, '0')}</span>
                <span style={{ color: p.dim }}>{g.cap}</span>
              </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- OUTCOME ---------- */}
      <section className="ap-rv mx-auto max-w-5xl px-5 pb-28 pt-4 text-center md:px-10 md:pb-32" aria-labelledby="ap-out">
        <p id="ap-out" className="ap-mono text-xs uppercase tracking-[0.22em]" style={{ color: GREEN_LT }}>§ 07 · Outcome</p>
        <blockquote className="font-display mx-auto mt-6 max-w-3xl text-[1.9rem] italic leading-snug md:text-5xl">&ldquo;{theme.outcomeQuote}&rdquo;</blockquote>
        <div className="relative mt-12 flex justify-center">
          <div className="ap-stampOut ap-arch rounded-md border-4 border-double px-6 py-3" style={{ color: GREEN_LT, borderColor: GREEN_LT }}>
            <span className="block text-3xl leading-none tracking-[0.1em] md:text-4xl">APPROVED</span>
            <span className="ap-mono mt-1 block text-[11px] tracking-[0.22em]">FILED · LOGGED · SIGNED</span>
          </div>
        </div>
      </section>

      <NextChapter currentSlug={theme.slug} accent={GREEN} />
      <SiteFooter />
    </div>
  );
}

const CSS = `
.ap-root{--g:${GREEN}}
.ap-root :focus-visible{outline:2px solid ${GREEN_LT};outline-offset:3px}
.ap-mono{font-family:var(--font-plex),'IBM Plex Mono',ui-monospace,monospace;font-variant-numeric:tabular-nums}
.ap-arch{font-family:var(--font-archivo),Impact,'Arial Black',sans-serif}
.ap-rv{opacity:0;transform:translate3d(0,18px,0);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.8,.2,1);transition-delay:var(--d,0s)}
.ap-rv.ap-in{opacity:1;transform:none}
.ap-up{animation:ap-up .8s cubic-bezier(.2,.8,.2,1) both;animation-delay:var(--d,0s)}
@keyframes ap-up{from{opacity:0;transform:translate3d(0,22px,0)}to{opacity:1;transform:none}}
.ap-btn{transition:transform .2s ease,opacity .2s ease}
.ap-btn:hover:not(:disabled){transform:translateY(-2px)}
.ap-btn:disabled{opacity:.4;cursor:not-allowed}
.ap-lift{transition:transform .3s ease}
.ap-lift:hover{transform:translateY(-4px)}
/* hero document */
.ap-doc{animation:ap-recoil .5s ease-out 2.6s both}
@keyframes ap-recoil{0%,100%{transform:translate3d(0,0,0)}40%{transform:translate3d(0,5px,0)}}
.ap-hchip{background:rgba(20,32,61,.08)}
.ap-chipon{animation:ap-chip .45s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(.6s + var(--i)*.5s)}
@keyframes ap-chip{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:none}}
.ap-stamp{transform:rotate(-8deg);transform-origin:center;opacity:.95;animation:ap-stamp .6s cubic-bezier(.55,0,.1,1) 2.3s both}
@keyframes ap-stamp{0%{opacity:0;transform:translate3d(0,-70px,0) rotate(-14deg) scale(1.7)}55%{opacity:1;transform:translate3d(0,0,0) rotate(-8deg) scale(.96)}78%{transform:rotate(-8deg) scale(1.03)}100%{opacity:.95;transform:rotate(-8deg) scale(1)}}
.ap-ring{animation:ap-ringo .8s ease-out 2.6s both}
@keyframes ap-ringo{from{opacity:.7;transform:scale(.6)}to{opacity:0;transform:scale(1.7)}}
.ap-stampOut{transform:rotate(-8deg)}
.ap-in .ap-stampOut,.ap-in.ap-stampOut{animation:ap-stamp .6s cubic-bezier(.55,0,.1,1) .6s both}
/* marquee */
.ap-marq{animation:ap-marq 40s linear infinite}
@keyframes ap-marq{to{transform:translate3d(-50%,0,0)}}
/* stepper */
.ap-dot{background:transparent;border:2px solid rgba(251,248,241,.35);color:${'#8A98B8'};transition:transform .3s ease}
.ap-dot[data-s=done]{background:${GREEN};border-color:${GREEN};color:#0F1A33}
.ap-dot[data-s=active]{background:${PAPER};border-color:${PAPER};color:#0F1A33}
.ap-dot[data-s=active]::after{content:'';position:absolute;inset:-2px;border-radius:9999px;border:2px solid ${PAPER};animation:ap-pulse 2s ease-out infinite}
.ap-dot[data-s=rejected]{background:${RED};border-color:${RED};color:#fff}
@keyframes ap-pulse{from{opacity:.7;transform:scale(1)}to{opacity:0;transform:scale(1.7)}}
.ap-seg{position:absolute;left:19px;top:44px;bottom:-2px;width:2px;background:rgba(251,248,241,.18);overflow:hidden}
.ap-seg i{position:absolute;inset:0;background:var(--g);transform:scaleY(var(--f,0));transform-origin:top;transition:transform .7s cubic-bezier(.2,.8,.2,1)}
@media(min-width:1024px){.ap-seg{left:48px;right:-.5rem;top:19px;bottom:auto;width:auto;height:2px}.ap-seg i{transform:scaleX(var(--f,0));transform-origin:left}}
.ap-role{border-color:rgba(251,248,241,.1);background:transparent;transition:background .25s ease,border-color .25s ease}
.ap-role:hover{background:rgba(251,248,241,.05)}
.ap-role[data-on=true]{border-color:${GREEN};background:rgba(63,191,148,.08)}
.ap-chip{border:1px solid transparent;animation:ap-pop .4s cubic-bezier(.2,.8,.2,1) both}
.ap-chip[data-s=done]{background:rgba(63,191,148,.16);color:${GREEN_LT};border-color:rgba(63,191,148,.5)}
.ap-chip[data-s=active]{background:${PAPER};color:#0F1A33}
.ap-chip[data-s=waiting]{color:#8A98B8;border-color:rgba(138,152,184,.5)}
.ap-chip[data-s=rejected]{background:rgba(192,57,43,.28);color:${RED_LT};border-color:${RED_LT}}
.ap-pop{animation:ap-pop .4s cubic-bezier(.2,.8,.2,1) both}
@keyframes ap-pop{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:none}}
.ap-row{animation:ap-rowin .5s cubic-bezier(.2,.8,.2,1) both}
@keyframes ap-rowin{from{opacity:0;transform:translate3d(-10px,0,0)}to{opacity:1;transform:none}}
/* paper margin */
.ap-paper::before{content:'';position:absolute;top:0;bottom:0;left:18px;width:5px;border-left:1px solid rgba(192,57,43,.55);border-right:1px solid rgba(192,57,43,.55)}
@media(min-width:768px){.ap-paper::before{left:64px}}
/* features */
.ap-line::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:${GREEN};transform:scaleY(0);transform-origin:top;transition:transform .3s ease}
.ap-line{transition:background .3s ease}
.ap-line:hover{background:rgba(63,191,148,.06)}
.ap-line:hover::before{transform:scaleY(1)}
/* architecture rail */
.ap-rail{transform:scaleY(0);transform-origin:top;transition:transform 1.4s cubic-bezier(.4,0,.2,1) .2s}
.ap-in .ap-rail{transform:scaleY(1)}
@media (prefers-reduced-motion:reduce){
  .ap-marq,.ap-ring,.ap-dot::after,.ap-doc,.ap-stamp,.ap-chipon,.ap-up,.ap-row,.ap-chip,.ap-pop,.ap-stampOut{animation:none!important}
  .ap-rv{opacity:1;transform:none;transition:none}
  .ap-rail{transform:scaleY(1);transition:none}
  .ap-seg i,.ap-btn,.ap-lift{transition:none}
}
`;
