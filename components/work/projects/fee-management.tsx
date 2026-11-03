'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

/* ---------- tokens ---------- */
const MONO = 'var(--font-plex), "JetBrains Mono", ui-monospace, monospace';
const HEAD = 'var(--font-sora), Inter, system-ui, sans-serif';

const CSS = `
.ff-root{--ink:#1A2330;--dim:#4F5A6E;--blue:#2B6CB0;--teal:#0F766E;--green:#2F855A;--red:#B42323;--rule:#D7DCE2;--slate:#F4F6F8;--paper:#fff;
  background:var(--slate);color:var(--ink);font-family:Inter,system-ui,sans-serif;min-height:100svh;overflow-x:clip;
  background-image:linear-gradient(var(--rule) 1px,transparent 1px),linear-gradient(90deg,var(--rule) 1px,transparent 1px);background-size:48px 48px;background-position:-1px -1px}
.ff-root *{box-sizing:border-box}
.ff-root :focus-visible{outline:3px solid var(--blue);outline-offset:2px;border-radius:6px}
.ff-mono{font-family:${MONO};font-variant-numeric:tabular-nums}
.ff-card{background:var(--paper);border:1px solid var(--rule);border-radius:14px;box-shadow:0 1px 0 rgba(26,35,48,.04),0 8px 24px -16px rgba(26,35,48,.25)}
.ff-eyebrow{font-family:${MONO};font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--teal);font-weight:600}
.ff-rv{opacity:0;transform:translateY(16px);transition:opacity .6s cubic-bezier(.2,.7,.2,1),transform .6s cubic-bezier(.2,.7,.2,1)}
.ff-rv.in{opacity:1;transform:none}
.ff-bar{transform:scaleY(0);transform-origin:bottom;transition:transform .9s cubic-bezier(.2,.8,.2,1)}
.ff-in .ff-bar{transform:scaleY(1)}
.ff-ring{transition:stroke-dashoffset 1s cubic-bezier(.3,.7,.2,1)}
.ff-badge{min-height:40px;min-width:84px;padding:0 12px;border-radius:999px;font-family:${MONO};font-size:12px;font-weight:600;border:1px solid;cursor:pointer;transition:transform .15s,background .2s}
.ff-badge:active{transform:scale(.96)}
.ff-badge[data-s=paid]{background:#E6F4EC;color:#1D6B43;border-color:#9AD2B2}
.ff-badge[data-s=pending]{background:#FCE9E9;color:#9B1C1C;border-color:#F0B4B4}
.ff-btn{min-height:44px;padding:0 18px;border-radius:10px;background:var(--blue);color:#fff;font-weight:600;font-size:14px;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:transform .15s,background .2s}
.ff-btn:hover{background:#245a96;transform:translateY(-1px)}
.ff-btn.ghost{background:#fff;color:var(--blue);border:1px solid var(--blue)}
.ff-btn.ghost:hover{background:#EBF2FA}
.ff-lift{transition:transform .25s,box-shadow .25s,border-color .25s}
.ff-lift:hover{transform:translateY(-4px);border-color:var(--blue);box-shadow:0 18px 32px -20px rgba(43,108,176,.5)}
.ff-marq{display:flex;width:max-content;animation:ffMarq 38s linear infinite}
.ff-fly{animation:ffFly 2.6s cubic-bezier(.16,.84,.24,1) infinite}
.ff-feed{animation:ffFeed .9s cubic-bezier(.32,0,.16,1) both}
.ff-draw{stroke-dasharray:60;stroke-dashoffset:60;transition:stroke-dashoffset .7s ease}
.ff-in .ff-draw{stroke-dashoffset:0}
.ff-rail{transform:scaleY(0);transform-origin:top;transition:transform 1.6s cubic-bezier(.4,.1,.2,1)}
.ff-in .ff-rail{transform:scaleY(1)}
.ff-log{opacity:0;transform:translateX(-8px)}
.ff-in .ff-log{animation:ffLog .5s ease forwards}
.ff-dot{animation:ffDot 1.8s ease-in-out infinite}
.ff-nudge{animation:ffNudge 2.4s ease-in-out infinite}
.ff-root footer a{color:#B9C4D2}
.ff-root footer a:hover{color:#fff}
.ff-flowline{stroke-dasharray:4 6;animation:ffFlow 1.2s linear infinite}
.ff-pop{animation:ffPop .35s ease both}
@keyframes ffMarq{to{transform:translateX(-50%)}}
@keyframes ffFly{0%{transform:translate(0,0) rotate(0);opacity:0}15%{opacity:1}70%{opacity:1}100%{transform:translate(46px,-26px) rotate(-12deg);opacity:0}}
@keyframes ffFeed{from{transform:translateY(-92%)}to{transform:translateY(0)}}
@keyframes ffLog{to{opacity:1;transform:none}}
@media (max-width:389px){.ff-tail{padding-bottom:221px}}
@media (min-width:768px) and (max-width:1023px){.ff-tail{padding-bottom:421px}}
@keyframes ffNudge{0%,100%{transform:translate(0,0);opacity:.55}50%{transform:translate(6px,-4px);opacity:1}}
@keyframes ffDot{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes ffFlow{to{stroke-dashoffset:-20}}
@keyframes ffPop{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
  .ff-marq,.ff-fly,.ff-dot,.ff-nudge,.ff-flowline{animation:none}
  .ff-feed,.ff-pop{animation:none}
  .ff-rv{opacity:1;transform:none;transition:none}
  .ff-bar,.ff-rail{transform:none;transition:none}
  .ff-draw{stroke-dashoffset:0;transition:none}
  .ff-log{opacity:1;transform:none;animation:none}
  .ff-ring{transition:none}
}`;

/* ---------- hooks / tiny parts ---------- */
function useSeen<T extends HTMLElement>(margin = '0px 0px -12% 0px') {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, seen] as const;
}

function Rv({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  return (
    <div ref={ref} className={`ff-rv ${seen ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Count({ to, ms = 1300 }: { to: number; ms?: number }) {
  const [ref, seen] = useSeen<HTMLSpanElement>('0px');
  useEffect(() => {
    const el = ref.current;
    if (!el || !seen) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = String(to); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      el.textContent = String(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, ms, ref]);
  return <span ref={ref}>{to}</span>;
}

function Ic({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const ICONS = {
  dash: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',
  users: 'M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 20v-1.5a3.5 3.5 0 0 0-2.5-3.3',
  doc: 'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5',
  bell: 'M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 21h4',
  sheet: 'M4 5h16v14H4zM4 10h16M4 15h16M10 5v14',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  check: 'M5 12.5l4.5 4.5L19 7.5',
};

/* ---------- data ---------- */
type Row = { id: string; cls: string; paid: boolean };
const ROWS0: Row[] = [
  { id: 'S-014', cls: 'Class 8 · Maths', paid: true },
  { id: 'S-027', cls: 'Class 6 · Science', paid: false },
  { id: 'S-031', cls: 'Class 9 · English', paid: true },
  { id: 'S-042', cls: 'Class 7 · Maths', paid: false },
  { id: 'S-058', cls: 'Class 10 · Physics', paid: true },
];
const BARS = [
  { m: 'Jan', v: 58 }, { m: 'Feb', v: 66 }, { m: 'Mar', v: 63 },
  { m: 'Apr', v: 79 }, { m: 'May', v: 85 }, { m: 'Jun', v: 94 },
];
const NAV: [string, string][] = [['Dashboard', ICONS.dash], ['Students', ICONS.users], ['Invoices', ICONS.doc], ['Reminders', ICONS.bell], ['Excel', ICONS.sheet]];
const PHOTOS = [
  { src: '/work/fee-management/gallery-1.jpg', alt: 'Tax paperwork, a phone calculator and a pen laid out on a white floor', w: 900, h: 516 },
  { src: '/work/fee-management/gallery-2.jpg', alt: 'A hand holding a pen over a signed document', w: 900, h: 601 },
  { src: '/work/fee-management/gallery-4.jpg', alt: 'A stack of books with an apple, coloured pencils and ABC blocks on a school desk', w: 900, h: 635 },
  { src: '/work/fee-management/gallery-5.jpg', alt: 'A lecture hall with a presenter beside a projected slide', w: 900, h: 675 },
  { src: '/work/fee-management/gallery-6.jpg', alt: 'Forms, a calculator and a coffee cup on a dark table', w: 900, h: 633 },
];
const FILE_NAMES = ['ledger-stamp.jpg', 'signed-copy.jpg', 'student-desk.jpg', 'class-row.jpg', 'paper-stack.jpg'];
const STEPS = [
  { n: '01', t: 'The cron wakes', d: 'The first of the month. node-cron runs on the Express server, so nobody has to log in.' },
  { n: '02', t: 'Firestore is read', d: 'Every student with pending dues this cycle is pulled from the managed data layer.' },
  { n: '03', t: 'The email is written', d: 'A plain-language body from the per-month template, signed with the centre’s name, not the platform.' },
  { n: '04', t: 'Nodemailer sends', d: 'Bulk reminders go out to the parents of every pending student in one run.' },
  { n: '05', t: 'The dashboard catches up', d: 'Payments get marked Paid, a branded PDF invoice is one click away, the roster exports to .xlsx.' },
];
const LOG = ['cron  monthly run started', 'firestore  pending dues read', 'pdfkit  invoices ready on demand', 'nodemailer  bulk reminders sent', 'done  run complete'];

/* ---------- feature glyphs ---------- */
function Glyph({ i }: { i: number }) {
  const s = { stroke: 'var(--blue)', strokeWidth: 2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  return (
    <svg viewBox="0 0 64 48" width="64" height="48" aria-hidden="true" {...s}>
      {i === 0 && <><rect x="8" y="26" width="9" height="14" fill="#DCEAF7" /><rect x="23" y="16" width="9" height="24" fill="#DCEAF7" /><rect x="38" y="8" width="9" height="32" fill="var(--blue)" /><path d="M6 42h52" /></>}
      {i === 1 && <><path d="M18 5h22l8 8v30H18z" fill="#fff" /><path d="M18 5h22l8 8H18z" fill="var(--blue)" /><path d="M24 24h18M24 31h18M24 38h10" /></>}
      {i === 2 && <><rect x="10" y="9" width="44" height="34" rx="4" fill="#fff" /><path d="M10 19h44M22 5v8M42 5v8" /><text x="32" y="39" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--teal)" stroke="none" fontFamily="monospace">1</text></>}
      {i === 3 && <><rect x="8" y="8" width="36" height="32" rx="3" fill="#fff" /><path d="M8 19h36M8 29h36M20 8v32M32 8v32" /><path d="M48 18l8 6-8 6" stroke="var(--teal)" /></>}
      {i === 4 && <><ellipse cx="32" cy="11" rx="18" ry="6" fill="#DCEAF7" /><path d="M14 11v24c0 3.3 8 6 18 6s18-2.700 18-6V11M14 23c0 3.300 8 6 18 6s18-2.700 18-6" /></>}
      {i === 5 && <><rect x="8" y="10" width="48" height="30" rx="4" fill="#fff" /><path d="M8 13l24 16 24-16" /><path d="M44 8l6-4" stroke="var(--teal)" /></>}
    </svg>
  );
}

/* ---------- hero app window ---------- */
function AppWindow({ theme }: { theme: ProjectTheme }) {
  const [rows, setRows] = useState(ROWS0);
  const [sending, setSending] = useState(false);
  const [wRef, seen] = useSeen<HTMLDivElement>('0px');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const paid = rows.filter((r) => r.paid).length;
  const pct = Math.round((paid / rows.length) * 100);
  const C = 2 * Math.PI * 38;
  const toggle = (id: string) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, paid: !r.paid } : r)));
  const send = () => {
    setSending(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSending(false), 3200);
  };
  const pending = rows.length - paid;

  return (
    <div ref={wRef} className={`ff-card overflow-hidden ${seen ? 'ff-in' : ''}`} style={{ borderRadius: 16, boxShadow: '0 40px 70px -40px rgba(26,35,48,.45)' }} role="group" aria-label="FeeFlow dashboard, interactive sample">
      <div className="flex items-center gap-3 border-b px-3 py-2.5 sm:px-4" style={{ borderColor: 'var(--rule)', background: '#EEF1F5' }}>
        <div className="flex gap-1.5" aria-hidden="true">{['#E5484D', '#F5B83D', '#3DB36B'].map((c) => <i key={c} className="block h-2.5 w-2.5 rounded-full" style={{ background: c }} />)}</div>
        <div className="ff-mono min-w-0 flex-1 truncate rounded-md bg-white px-3 py-1 text-xs" style={{ border: '1px solid var(--rule)', color: 'var(--dim)' }}>feeflow / dashboard</div>
        <span className="ff-mono hidden text-xs font-semibold sm:inline" style={{ color: 'var(--teal)' }}>SAMPLE DATA</span>
      </div>
      <div className="grid md:grid-cols-[180px_1fr]">
        <aside className="border-b p-2 md:border-b-0 md:border-r md:p-4" style={{ borderColor: 'var(--rule)', background: '#FAFBFC' }}>
          <div className="mb-4 hidden items-center gap-2 md:flex">
            <span className="grid h-8 w-8 place-items-center rounded-lg text-sm font-bold text-white" style={{ background: 'var(--blue)', fontFamily: HEAD }}>F</span>
            <span className="font-semibold" style={{ fontFamily: HEAD }}>{theme.title}</span>
          </div>
          <ul className="grid grid-cols-5 gap-1 md:grid-cols-1" aria-hidden="true">
            {NAV.map(([l, d], i) => (
              <li key={l} className="flex h-10 items-center justify-center gap-2.5 rounded-lg px-2 text-sm md:justify-start" style={i === 0 ? { background: '#E4EEF9', color: 'var(--blue)', fontWeight: 600 } : { color: 'var(--dim)' }}>
                <Ic d={d} /><span className="hidden md:inline">{l}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 hidden rounded-lg border p-3 md:block" style={{ borderColor: 'var(--rule)', background: '#fff' }}>
            <div className="ff-eyebrow" style={{ fontSize: 11 }}>Next run</div>
            <div className="mt-1 text-sm font-semibold">1st of the month</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs" style={{ color: 'var(--dim)' }}><i className="ff-dot block h-2 w-2 rounded-full" style={{ background: 'var(--green)' }} />cron armed</div>
          </div>
        </aside>

        <div className="min-w-0 p-3 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold" style={{ fontFamily: HEAD }}>This month&rsquo;s dues</div>
              <div className="text-sm" style={{ color: 'var(--dim)' }}>Tap a status to flip it. Sample students.</div>
            </div>
            <button type="button" className="ff-btn" onClick={send} disabled={sending}>
              <Ic d={ICONS.mail} />{sending ? 'Reminders queued' : 'Send reminders'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {theme.bigNumbers.map((b, i) => (
              <div key={b.label} className="rounded-xl border p-3" style={{ borderColor: 'var(--rule)', background: i === 3 ? '#E8F5F3' : '#fff' }}>
                <div className="ff-mono text-3xl font-semibold leading-none sm:text-4xl" style={{ color: i % 2 ? 'var(--teal)' : 'var(--blue)' }}><Count to={parseInt(b.value, 10)} /></div>
                <div className="mt-2 text-[13px] leading-snug" style={{ color: 'var(--dim)' }}>{b.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[1.35fr_1fr]">
            <div className="rounded-xl border" style={{ borderColor: 'var(--rule)' }}>
              <div className="ff-mono grid grid-cols-[64px_1fr_auto] gap-2 border-b px-3 py-2 text-[11px] uppercase tracking-wider sm:grid-cols-[72px_1fr_auto]" style={{ borderColor: 'var(--rule)', color: 'var(--dim)' }}>
                <span>ID</span><span>Class</span><span>Status</span>
              </div>
              <ul>
                {rows.map((r) => (
                  <li key={r.id} className="grid grid-cols-[64px_1fr_auto] items-center gap-2 border-b px-3 py-1.5 last:border-b-0 sm:grid-cols-[72px_1fr_auto]" style={{ borderColor: 'var(--rule)' }}>
                    <span className="ff-mono text-[13px] font-semibold">{r.id}</span>
                    <span className="flex min-w-0 items-center gap-2 text-sm"><span className="truncate">{r.cls}</span>
                      {sending && !r.paid && <span className="ff-fly shrink-0" style={{ color: 'var(--blue)' }}><Ic d={ICONS.mail} size={16} /></span>}
                    </span>
                    <button type="button" className="ff-badge" data-s={r.paid ? 'paid' : 'pending'} aria-pressed={r.paid} onClick={() => toggle(r.id)} aria-label={`${r.id} is ${r.paid ? 'paid' : 'pending'}. Toggle.`}>
                      {r.paid ? 'PAID' : 'PENDING'}
                    </button>
                  </li>
                ))}
              </ul>
              {sending && <div className="ff-pop ff-mono border-t px-3 py-2 text-xs" style={{ borderColor: 'var(--rule)', background: '#E6F4EC', color: '#1D6B43' }} role="status">Sample run: {pending} reminder{pending === 1 ? '' : 's'} queued</div>}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex items-center gap-4 rounded-xl border p-3" style={{ borderColor: 'var(--rule)' }}>
                <svg viewBox="0 0 90 90" width="84" height="84" className="shrink-0" role="img" aria-label={`${pct} percent of sample students paid`}>
                  <circle cx="45" cy="45" r="38" fill="none" stroke="#E3E8EE" strokeWidth="9" />
                  <circle className="ff-ring" cx="45" cy="45" r="38" fill="none" stroke="var(--blue)" strokeWidth="9" strokeLinecap="round" transform="rotate(-90 45 45)" strokeDasharray={C} strokeDashoffset={seen ? C * (1 - pct / 100) : C} />
                  <text x="45" y="51" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="19" fill="var(--ink)">{pct}%</text>
                </svg>
                <div><div className="text-sm font-semibold">Paid this cycle</div><div className="text-[13px]" style={{ color: 'var(--dim)' }}>{paid} of {rows.length} sample rows</div></div>
              </div>
              <div className="rounded-xl border p-3" style={{ borderColor: 'var(--rule)' }}>
                <div className="text-sm font-semibold">Collection by cycle</div>
                <div className="mt-3 flex h-24 items-end gap-2" role="img" aria-label="Bar chart of sample collection rate rising from January to June">
                  {BARS.map((b, i) => (
                    <div key={b.m} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                      <div className="w-full rounded-t-md" style={{ height: `${b.v}%`, background: i === BARS.length - 1 ? 'var(--teal)' : '#9DBFE3' }}>
                        <div className="ff-bar h-full w-full rounded-t-md" style={{ background: i === BARS.length - 1 ? 'var(--teal)' : 'var(--blue)', transitionDelay: `${i * 90}ms` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="ff-mono mt-1 flex gap-2 text-[11px]" style={{ color: 'var(--dim)' }}>{BARS.map((b) => <span key={b.m} className="flex-1 text-center">{b.m}</span>)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- story visuals ---------- */
function AsksVisual() {
  const [ref, seen] = useSeen<HTMLUListElement>();
  const asks = [['Tell me who hasn’t paid', 'Dashboard'], ['Send a proper invoice', 'PDF'], ['Even if I forget to log in', 'Cron']];
  return (
    <ul ref={ref} className={`ff-card divide-y p-2 ${seen ? 'ff-in' : ''}`} style={{ borderColor: 'var(--rule)' }}>
      {asks.map(([t, tag], i) => (
        <li key={t} className="flex items-center gap-3 px-3 py-4">
          <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true" className="shrink-0">
            <rect x="1.5" y="1.5" width="27" height="27" rx="7" fill="#fff" stroke="var(--rule)" strokeWidth="2" />
            <path className="ff-draw" d="M8 15.500l5 5 9-10.500" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transitionDelay: `${300 + i * 350}ms` }} />
          </svg>
          <span className="flex-1 text-[15px] font-medium">{t}</span>
          <span className="ff-mono rounded-md px-2 py-1 text-xs font-semibold" style={{ background: '#E4EEF9', color: '#1F5A94' }}>{i + 1} · {tag}</span>
        </li>
      ))}
    </ul>
  );
}

function InvoiceVisual() {
  const [run, setRun] = useState(0);
  return (
    <div className="mx-auto w-full max-w-[340px]">
      <div className="relative overflow-hidden rounded-xl border p-3" style={{ borderColor: 'var(--rule)', background: '#DDE3EA', aspectRatio: '4 / 4.1' }}>
        <div key={run} className="ff-feed ff-card flex h-full flex-col overflow-hidden" style={{ borderRadius: 4, boxShadow: '0 12px 24px -12px rgba(26,35,48,.5)' }}>
          <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: 'var(--blue)' }}>
            <span className="text-sm font-bold tracking-widest" style={{ fontFamily: HEAD }}>INVOICE</span>
            <span className="ff-mono text-xs">REF 0000</span>
          </div>
          <div className="px-4 pt-3 text-xs" style={{ color: 'var(--dim)' }}>Your centre&rsquo;s name goes in this band.</div>
          <div className="mt-3 flex-1 px-4">
            {[0, 1, 2, 3, 4].map((n) => (
              <div key={n} className="flex items-end justify-between border-b py-2.5" style={{ borderColor: '#C9D1DB' }}>
                <i className="block h-1.5 rounded" style={{ width: `${70 - n * 9}%`, background: '#D7DCE2' }} />
                <i className="block h-1.5 w-8 rounded" style={{ background: '#C9D1DB' }} />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t-2 px-4 py-3" style={{ borderColor: 'var(--ink)' }}>
            <span className="ff-mono text-xs font-semibold tracking-wider">TOTAL</span>
            <i className="block h-2.5 w-16 rounded" style={{ background: 'var(--ink)' }} />
          </div>
        </div>
      </div>
      <button type="button" className="ff-btn ghost mt-3 w-full justify-center" onClick={() => setRun((r) => r + 1)}><Ic d={ICONS.doc} />Print it again</button>
    </div>
  );
}

function EmailVisual() {
  return (
    <div className="ff-card relative mx-auto w-full max-w-[420px] overflow-hidden">
      <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: 'var(--rule)', background: '#FAFBFC' }}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ background: '#E4EEF9', color: 'var(--blue)' }}><Ic d={ICONS.mail} /></span>
        <div className="min-w-0 text-sm"><div className="font-semibold">From: your centre</div><div className="ff-mono text-xs" style={{ color: 'var(--dim)' }}>Subject: fee reminder</div></div>
        <span className="ff-nudge ml-auto" style={{ color: 'var(--blue)' }}><Ic d={ICONS.mail} size={20} /></span>
      </div>
      <div className="space-y-2.5 px-4 py-5">
        {[92, 100, 78, 96, 60].map((w, i) => <i key={i} className="block h-2 rounded" style={{ width: `${w}%`, background: '#E3E8EE' }} />)}
        <div className="pt-3 text-sm font-semibold">&mdash; The centre&rsquo;s name</div>
        <div className="text-xs" style={{ color: 'var(--dim)' }}>Signed by the centre, never by the platform.</div>
      </div>
    </div>
  );
}

/* ---------- page ---------- */
export default function Page({ theme }: { theme: ProjectTheme }) {
  const [shot, setShot] = useState(0);
  const [tlRef, tlSeen] = useSeen<HTMLDivElement>('0px 0px -15% 0px');
  const [logRef, logSeen] = useSeen<HTMLDivElement>();
  const quotes = theme.story.quotes;
  const visuals = [<AsksVisual key="a" />, <InvoiceVisual key="i" />, <EmailVisual key="e" />];
  const P = PHOTOS[shot];
  const mq = [...theme.features.map((f) => f.title), ...theme.features.map((f) => f.title)];
  const tp = (t: string) => t.replace(/'/g, '’');
  const sect: CSSProperties = { paddingTop: 'clamp(3.5rem,7vw,4.9rem)' };

  return (
    <div className="ff-root">
      <style>{CSS}</style>
      <main className="mx-auto w-full max-w-6xl px-4 pb-8 pt-24 sm:px-6 md:pt-36">
        {/* HERO */}
        <header>
          <div className="flex flex-wrap items-center gap-3">
            <span className="ff-eyebrow">{theme.kicker}</span>
            <span className="ff-mono inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-xs" style={{ borderColor: 'var(--rule)', color: 'var(--dim)' }}><i className="ff-dot block h-2 w-2 rounded-full" style={{ background: 'var(--green)' }} />Fee management</span>
          </div>
          <div className="mt-3 grid items-end gap-4 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
            <h1 className="font-semibold leading-[0.95] tracking-tight" style={{ fontFamily: HEAD, fontSize: 'clamp(3.2rem,11vw,7rem)' }}>
              Fee<span style={{ color: 'var(--blue)' }}>Flow</span><span style={{ color: 'var(--teal)' }}>.</span>
            </h1>
            <div>
              <p className="text-xl leading-snug sm:text-2xl" style={{ fontFamily: HEAD, fontWeight: 500 }}>{theme.subtitle}</p>
              <p className="ff-mono mt-2 text-[13px]" style={{ color: 'var(--dim)' }}>Dashboard first, PDF second, cron third.</p>
            </div>
          </div>
          <div className="mt-7"><AppWindow theme={theme} /></div>
        </header>

        {/* MARQUEE */}
        <div className="mt-10 overflow-hidden rounded-xl border bg-white py-3" style={{ borderColor: 'var(--rule)' }} aria-hidden="true">
          <div className="ff-marq">
            {mq.map((t, i) => (
              <span key={i} className="ff-mono flex shrink-0 items-center gap-6 pr-6 text-sm font-semibold" style={{ color: i % 2 ? 'var(--teal)' : 'var(--blue)' }}>{t}<i className="block h-1.5 w-1.5 rounded-full" style={{ background: 'var(--rule)' }} /></span>
            ))}
          </div>
        </div>

        {/* STORY */}
        <section aria-labelledby="ff-story" style={sect}>
          <Rv><p className="ff-eyebrow">The brief</p>
            <h2 id="ff-story" className="mt-2 text-3xl font-semibold leading-tight sm:text-5xl" style={{ fontFamily: HEAD }}>Three asks from one tuition centre.</h2></Rv>
          <div className="mt-8 space-y-6 md:space-y-8">
            {quotes.map((q, i) => (
              <Rv key={q.kicker}>
                <article className="ff-card grid items-center gap-6 p-5 sm:p-8 md:grid-cols-2 md:gap-10">
                  <div className={i % 2 ? 'md:order-2' : ''}>
                    <div className="flex items-center gap-3"><span className="ff-mono grid h-9 w-9 place-items-center rounded-lg text-sm font-bold text-white" style={{ background: i === 1 ? 'var(--teal)' : 'var(--blue)' }}>0{i + 1}</span><span className="ff-eyebrow" style={{ color: 'var(--dim)' }}>{q.kicker}</span></div>
                    <blockquote className="mt-4 text-[1.3rem] leading-snug tracking-tight sm:text-[1.6rem]" style={{ color: 'var(--ink)', fontFamily: HEAD, fontWeight: 500 }}>&ldquo;{tp(q.quote)}&rdquo;</blockquote>
                    <p className="ff-mono mt-4 border-l-4 pl-3 text-[13px] leading-relaxed" style={{ borderColor: 'var(--teal)', color: 'var(--dim)' }}>{tp(q.context)}</p>
                  </div>
                  <div className={i % 2 ? 'md:order-1' : ''}>{visuals[i]}</div>
                </article>
              </Rv>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section aria-labelledby="ff-feat" style={sect}>
          <Rv><p className="ff-eyebrow">Modules</p>
            <h2 id="ff-feat" className="mt-2 text-3xl font-semibold leading-tight sm:text-5xl" style={{ fontFamily: HEAD }}>Everything the office needed. Nothing it didn&rsquo;t.</h2></Rv>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {theme.features.map((f, i) => (
              <li key={f.title}>
                <Rv delay={(i % 3) * 80} className="h-full">
                  <div className="ff-card ff-lift h-full p-5">
                    <div className="flex items-center justify-between"><Glyph i={i} /><span className="ff-mono text-xs font-semibold" style={{ color: 'var(--dim)' }}>M-0{i + 1}</span></div>
                    <h3 className="mt-4 text-lg font-semibold" style={{ fontFamily: HEAD }}>{f.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed" style={{ color: 'var(--dim)' }}>{f.desc}</p>
                  </div>
                </Rv>
              </li>
            ))}
          </ul>
        </section>

        {/* TIMELINE */}
        <section aria-labelledby="ff-tl" style={sect}>
          <Rv><p className="ff-eyebrow">Reminder timeline</p>
            <h2 id="ff-tl" className="mt-2 text-3xl font-semibold leading-tight sm:text-5xl" style={{ fontFamily: HEAD }}>On the first, the cron just does the thing.</h2></Rv>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
            <div ref={tlRef} className={`relative ${tlSeen ? 'ff-in' : ''}`}>
              <div className="ff-rail absolute bottom-6 left-[19px] top-6 w-[3px] rounded" style={{ background: 'linear-gradient(var(--blue),var(--teal))' }} aria-hidden="true" />
              <ol className="space-y-4">
                {STEPS.map((s, i) => (
                  <li key={s.n} className="relative flex gap-4">
                    <span className="ff-mono relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 bg-white text-sm font-bold" style={{ borderColor: i === 4 ? 'var(--teal)' : 'var(--blue)', color: i === 4 ? 'var(--teal)' : 'var(--blue)' }}>{s.n}</span>
                    <div className="ff-card ff-lift min-w-0 flex-1 p-4">
                      <h3 className="text-base font-semibold" style={{ fontFamily: HEAD }}>{s.t}</h3>
                      <p className="mt-1 text-[15px] leading-relaxed" style={{ color: 'var(--dim)' }}>{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div ref={logRef} className={`self-start lg:sticky lg:top-28 ${logSeen ? 'ff-in' : ''}`}>
              <div className="overflow-hidden rounded-2xl" style={{ background: '#0F2438', color: '#DCE8F5', boxShadow: '0 30px 50px -30px rgba(15,36,56,.8)' }}>
                <div className="ff-mono flex items-center justify-between border-b px-4 py-3 text-xs" style={{ borderColor: '#27425E', color: '#9DB6CF' }}><span>cron / monthly-run</span><span>illustrative log</span></div>
                <ul className="ff-mono space-y-2.5 p-4 text-[13px] leading-relaxed">
                  {LOG.map((l, i) => {
                    const [k, ...rest] = l.split('  ');
                    return <li key={l} className="ff-log flex gap-3" style={{ animationDelay: `${i * 450}ms` }}><span style={{ color: i === LOG.length - 1 ? '#6EE7B7' : '#7DB4F0' }}>[{k}]</span><span>{rest.join(' ')}</span></li>;
                  })}
                </ul>
                <div className="flex items-center gap-3 border-t px-4 py-4" style={{ borderColor: '#27425E' }}>
                  <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="15" fill="none" stroke="#6EE7B7" strokeWidth="2.500" /><path className="ff-draw" d="M10 17.500l5 5 9-10" fill="none" stroke="#6EE7B7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transitionDelay: '2.2s' }} /></svg>
                  <span className="text-sm font-semibold">Run complete. No login needed.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ARCHITECTURE */}
        <section aria-labelledby="ff-arch" style={sect}>
          <Rv><p className="ff-eyebrow">System</p>
            <h2 id="ff-arch" className="mt-2 text-3xl font-semibold leading-tight sm:text-5xl" style={{ fontFamily: HEAD }}>Four layers, one small server.</h2></Rv>
          <ol className="mx-auto mt-8 max-w-3xl">
            {theme.architecture.map((a, i) => (
              <li key={a.layer}>
                <Rv>
                  <div className="ff-card ff-lift flex items-stretch overflow-hidden">
                    <div className="ff-mono grid w-14 shrink-0 place-items-center text-sm font-bold text-white sm:w-20" style={{ background: i % 2 ? 'var(--teal)' : 'var(--blue)' }}>L{i + 1}</div>
                    <div className="min-w-0 p-4 sm:p-5">
                      <h3 className="ff-mono text-sm font-semibold uppercase tracking-widest" style={{ color: i % 2 ? 'var(--teal)' : 'var(--blue)' }}>{a.layer}</h3>
                      <p className="mt-1 text-[15px] leading-relaxed">{a.details}</p>
                    </div>
                  </div>
                </Rv>
                {i < theme.architecture.length - 1 && (
                  <svg width="24" height="28" viewBox="0 0 24 28" className="mx-auto block" aria-hidden="true"><line className="ff-flowline" x1="12" y1="2" x2="12" y2="26" stroke="var(--blue)" strokeWidth="2.500" strokeLinecap="round" /></svg>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* ATTACHMENTS */}
        <section aria-labelledby="ff-att" style={sect}>
          <Rv><p className="ff-eyebrow">Attachments</p>
            <h2 id="ff-att" className="mt-2 text-3xl font-semibold leading-tight sm:text-5xl" style={{ fontFamily: HEAD }}>The paperwork it replaced.</h2></Rv>
          <Rv className="mt-8">
            <div className="ff-card overflow-hidden">
              <div className="ff-mono flex items-center justify-between gap-3 border-b px-4 py-2.5 text-xs" style={{ borderColor: 'var(--rule)', background: '#EEF1F5', color: 'var(--dim)' }}><span className="truncate">{FILE_NAMES[shot]}</span><span>{shot + 1} / {PHOTOS.length}</span></div>
              <div className="relative w-full" style={{ aspectRatio: '16 / 10', background: '#E3E8EE' }}>
                <Image key={P.src} src={P.src} alt={P.alt} fill sizes="(min-width:1152px) 1100px, 100vw" className="ff-pop object-cover" />
              </div>
              <div className="grid grid-cols-5 gap-2 p-2 sm:gap-3 sm:p-3">
                {PHOTOS.map((p, i) => (
                  <button key={p.src} type="button" onClick={() => setShot(i)} aria-label={`Show ${FILE_NAMES[i]}`} aria-pressed={shot === i} className="relative overflow-hidden rounded-lg" style={{ aspectRatio: '4 / 3', minHeight: 44, outline: shot === i ? '3px solid var(--blue)' : '1px solid var(--rule)', outlineOffset: shot === i ? 1 : -1, opacity: shot === i ? 1 : 0.75 }}>
                    <Image src={p.src} alt="" fill sizes="(min-width:1152px) 200px, 20vw" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </Rv>
        </section>

        {/* OUTCOME */}
        <section aria-labelledby="ff-out" style={sect}>
          <Rv>
            <div className="relative overflow-hidden rounded-3xl p-6 text-white sm:p-12" style={{ background: 'linear-gradient(135deg,#17406E,#0F5F5A)' }}>
              <p className="ff-eyebrow" style={{ color: '#9FE8DC' }}>Outcome</p>
              <h2 id="ff-out" className="sr-only">Outcome</h2>
              <blockquote className="mt-3 text-2xl leading-snug tracking-tight sm:text-4xl" style={{ maxWidth: '28ch', fontFamily: HEAD, fontWeight: 500 }}>&ldquo;{theme.outcomeQuote.replace(/"([^"]*)"/g, '‘$1’')}&rdquo;</blockquote>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {theme.bigNumbers.map((b) => (
                  <div key={b.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,.12)' }}>
                    <div className="ff-mono text-3xl font-semibold">{b.value}</div>
                    <div className="mt-1 text-[13px]" style={{ color: '#D6E6F5' }}>{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Rv>
        </section>
      </main>

      <div className="ff-tail pb-24">
        <NextChapter currentSlug={theme.slug} accent={theme.palette.accent} />
      </div>
      <SiteFooter />
    </div>
  );
}
