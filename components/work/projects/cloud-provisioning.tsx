'use client';

// CloudDesk: CLOUD CONSOLE microsite. Slate + electric blue, resource cards that go from spinner to
// "running", a typed provisioning log, a pulsing region map, tabbed tier dashboards.
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import Image from 'next/image';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';
import { CSS } from './cloud-provisioning-parts/styles';
import Gauge from './cloud-provisioning-parts/gauge';
import RegionMap, { REGIONS } from './cloud-provisioning-parts/map';

const SPACE = "var(--font-space), 'Space Grotesk', system-ui, sans-serif";
const MONO = 'var(--font-jetbrains), ui-monospace, monospace';
const wrap = 'mx-auto w-full max-w-6xl px-4 sm:px-6';
const d = (ms: number) => ({ ['--d' as string]: `${ms}ms` }) as CSSProperties;

// ---- provisioning log (hero) ------------------------------------------------
type Line = { t: string; res?: number };
const SCRIPT: Line[] = [
  { t: '$ clouddesk provision --all' },
  { t: '▸ provision index.html', res: 0 },
  { t: '▸ provision admin.html', res: 1 },
  { t: '▸ provision dashboard-free.html', res: 2 },
  { t: '▸ provision dashboard-vip.html', res: 3 },
  { t: '✓ 4 pages · 0 frameworks · no bundler' },
  { t: '# open it in DevTools. it is just HTML.' },
];
const OK = ' ✓ ok';

const PAGES = [
  { file: 'index.html', name: 'Landing', note: 'Particle hero, three plans, login modal.', w: 0.9 },
  { file: 'admin.html', name: 'Admin console', note: 'Users, SLA breaches, audit log.', w: 0.75 },
  { file: 'dashboard-free.html', name: 'Free tier', note: 'Storage gauge, upload widget, Best Effort SLA.', w: 0.64 },
  { file: 'dashboard-vip.html', name: 'VIP tier', note: 'Predictive arc, regions, priority queue.', w: 0.82 },
];

const STACK = ['Vanilla HTML', 'CSS custom properties', 'JavaScript ES2017+', 'Bootstrap 5.3', 'Chart.js', 'particles.js', 'localStorage', 'No build step'];

const TABS = [
  {
    id: 'free', label: 'Free tier', file: 'dashboard-free.html',
    items: ['Storage gauge shows used against the cap.', 'Drag-and-drop upload widget with client-side preview.', 'Recent uploads list.', 'Upgrade to Pro card opens the same modal flow as the landing page.'],
  },
  {
    id: 'vip', label: 'VIP tier', file: 'dashboard-vip.html',
    items: ['A second arc projects the next 7 days from a simple moving average.', 'Multi-region availability indicator, read and write per region (mocked).', 'SLA panel: uptime, average latency, last incident, monthly credit accrual.', 'Priority queue: high-priority jobs jump the line.', 'CSV and JSON export, generated client-side.'],
  },
  {
    id: 'admin', label: 'Admin', file: 'admin.html',
    items: ['User table: search, filter, edit role, suspend, allocate quota.', 'Chart.js line and doughnut charts for aggregate usage.', 'Append-only audit log persisted to localStorage.', 'Confirm modals so one click cannot nuke a user.'],
  },
];

const TENANTS = [
  { label: 'Within SLA', c: 'var(--ok)' },
  { label: 'Warning', c: 'var(--warn)' },
  { label: 'Breach', c: 'var(--bad)' },
];

const SNAPS = [
  { src: '/work/cloud-provisioning/gallery-1.jpg', cap: 'snapshot_01 · server racks', alt: 'Server racks with colourful cabling in a dark data hall', cls: 'col-span-2 aspect-[16/10] md:aspect-auto md:h-[320px] lg:h-[300px]' },
  { src: '/work/cloud-provisioning/gallery-2.jpg', cap: 'snapshot_02 · review room', alt: 'A team around a long wooden table with laptops in a bright meeting room', cls: 'col-span-2 aspect-[16/10] md:aspect-auto md:h-[320px] lg:h-[300px]' },
  { src: '/work/cloud-provisioning/gallery-3.jpg', cap: 'snapshot_03 · source', alt: 'Source code on a dark editor, slightly angled', cls: 'aspect-[4/5] md:aspect-auto md:h-[340px] lg:h-[320px]' },
  { src: '/work/cloud-provisioning/gallery-4.jpg', cap: 'snapshot_04 · hardware', alt: 'Close view of a circuit board with chips and capacitors', cls: 'aspect-[4/5] md:aspect-auto md:h-[340px] lg:h-[320px]' },
  { src: '/work/cloud-provisioning/gallery-5.jpg', cap: 'snapshot_05 · daylight desk', alt: 'A silver laptop and monitor on a wooden desk beside a bright window', cls: 'col-span-2 aspect-[16/10] md:aspect-auto md:h-[340px] lg:h-[320px]' },
  { src: '/work/cloud-provisioning/gallery-6.jpg', cap: 'snapshot_06 · workstation', alt: 'A monitor on a desk lit by a purple and orange wall glow', cls: 'col-span-2 md:col-span-4 aspect-[16/9] md:aspect-[21/8] lg:aspect-[21/7]' },
];

function useProvision() {
  const [s, setS] = useState({ i: 0, c: 0, ok: 0 });
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setS({ i: SCRIPT.length, c: 0, ok: 4 });
  }, []);
  useEffect(() => {
    if (s.i >= SCRIPT.length) return;
    const line = SCRIPT[s.i];
    const typing = s.c < line.t.length;
    const id = window.setTimeout(
      () => setS((p) => (typing ? { ...p, c: Math.min(p.c + 2, line.t.length) } : { i: p.i + 1, c: 0, ok: line.res !== undefined ? p.ok + 1 : p.ok })),
      typing ? 24 : line.res !== undefined ? 600 : 300,
    );
    return () => window.clearTimeout(id);
  }, [s]);
  return [s, () => setS({ i: 0, c: 0, ok: 0 })] as const;
}

const lineColor = (t: string) => (t[0] === '$' ? 'var(--aq)' : t[0] === '✓' ? 'var(--ok)' : t[0] === '#' ? 'var(--dim)' : 'var(--text)');

function Terminal({ s, onReplay }: { s: { i: number; c: number; ok: number }; onReplay: () => void }) {
  const done = s.i >= SCRIPT.length;
  const full = SCRIPT.map((l) => l.t + (l.res !== undefined ? OK : '')).join('\n') + '\n$ ';
  return (
    <div className="cd-panel overflow-hidden" style={{ background: '#0A1220' }}>
      <div className="flex items-center justify-between gap-3 border-b px-4" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-2">
          {['#F87171', '#FBBF24', '#34D399'].map((c) => <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />)}
          <span className="ml-2 text-[12px]" style={{ fontFamily: MONO, color: 'var(--dim)' }}>provision.log</span>
        </div>
        <button type="button" onClick={onReplay} className="min-h-11 px-2 text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ fontFamily: MONO, color: 'var(--aq)' }}>
          ↻ replay
        </button>
      </div>
      <div className="relative p-4">
        <pre aria-hidden className="cd-term invisible m-0">{full}</pre>
        <span className="sr-only">Provisioning log: index.html, admin.html, dashboard-free.html and dashboard-vip.html all running. 4 pages, 0 frameworks, no bundler.</span>
        <div aria-hidden className="cd-term absolute inset-4">
          {SCRIPT.map((l, idx) => {
            if (idx > s.i) return null;
            const txt = idx < s.i ? l.t : l.t.slice(0, s.c);
            return (
              <div key={idx} style={{ color: lineColor(l.t) }}>
                {txt}
                {idx < s.i && l.res !== undefined && s.ok > l.res ? <span style={{ color: 'var(--ok)' }}>{OK}</span> : null}
                {idx === s.i ? <span className="cd-cur" /> : null}
              </div>
            );
          })}
          {done ? <div style={{ color: 'var(--aq)' }}>$ <span className="cd-cur" /></div> : null}
        </div>
      </div>
    </div>
  );
}

function State({ label = 'running' }: { label?: string }) {
  return (
    <span className="cd-state" aria-label={label}>
      <span className="cd-pend"><i className="cd-spin" />provisioning</span>
      <span className="cd-ok"><i className="cd-dot" />{label}</span>
    </span>
  );
}

function Counter({ value }: { value: string }) {
  const to = parseInt(value, 10);
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || Number.isNaN(to)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(to); return; }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1100);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <span ref={ref}>{Number.isNaN(to) ? value : n}</span>;
}

function Heading({ eyebrow, children, sub }: { eyebrow: string; children: React.ReactNode; sub?: string }) {
  return (
    <div data-cd className="max-w-2xl">
      <p className="cd-eyebrow">{eyebrow}</p>
      <h2 className="cd-h2">{children}</h2>
      {sub ? <p className="mt-3 text-base leading-relaxed" style={{ color: 'var(--dim)' }}>{sub}</p> : null}
    </div>
  );
}

export default function Page({ theme }: { theme: ProjectTheme }) {
  const root = useRef<HTMLElement>(null);
  const [log, replay] = useProvision();
  const [tab, setTab] = useState(0);
  const [region, setRegion] = useState('region-4');
  const p = theme.palette;

  useEffect(() => {
    const els = Array.from(root.current?.querySelectorAll('[data-cd]') ?? []);
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const n = (tab + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length;
    setTab(n);
    (e.currentTarget.parentElement?.children[n] as HTMLElement | undefined)?.focus();
  };

  const vars = { '--bg': p.bgMid, '--panel': p.bg, '--text': p.text, '--blue': p.accent, '--aq': p.accent2 ?? '#22E3FF' } as CSSProperties;
  const T = TABS[tab];
  const sel = REGIONS.find((r) => r.id === region) ?? REGIONS[0];

  return (
    <main ref={root} className="cd-root" style={vars}>
      <style>{CSS}</style>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden pb-14 pt-24 md:pt-36" aria-labelledby="cd-title">
        <div className="absolute inset-0" aria-hidden>
          <Image src={theme.heroImage} alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
          <div className="cd-gridbg absolute inset-0 opacity-50" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(15,26,46,.55),var(--bg) 96%)' }} />
        </div>
        <div className={`${wrap} relative`}>
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-12">
            <div>
              <p className="cd-eyebrow break-words">{theme.kicker}</p>
              <h1 id="cd-title" className="mt-4 font-bold leading-[.95]" style={{ fontFamily: SPACE, fontSize: 'clamp(2.9rem,12vw,6.5rem)', letterSpacing: '-.035em', background: 'linear-gradient(90deg,#E9F1FF 20%,var(--aq) 62%,var(--blue))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                {theme.title}
              </h1>
              <p className="mt-4 max-w-md text-lg leading-snug sm:text-xl" style={{ color: 'var(--text)' }}>{theme.subtitle}</p>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed" style={{ color: 'var(--dim)' }}>
                A front-end prototype of a self-service cloud portal: four hand-written pages, no backend, no framework.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Stack">
                {STACK.slice(0, 5).map((t) => (
                  <li key={t} className="rounded-full border px-3 py-1.5 text-[12px]" style={{ fontFamily: MONO, borderColor: 'var(--line)', color: 'var(--dim)' }}>{t}</li>
                ))}
              </ul>
            </div>
            <Terminal s={log} onReplay={replay} />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="list" aria-label="Provisioned pages">
            {PAGES.map((r, i) => (
              <article key={r.file} role="listitem" className={`cd-rc cd-panel flex flex-col p-4 ${log.ok > i ? 'run' : ''}`} style={{ ['--w' as string]: r.w } as CSSProperties}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold">{r.name}</h3>
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: 'var(--blue)' }} />
                </div>
                <p className="mt-0.5 break-all text-[12px]" style={{ fontFamily: MONO, color: 'var(--aq)' }}>{r.file}</p>
                <p className="mt-2 text-[14px] leading-snug" style={{ color: 'var(--dim)' }}>{r.note}</p>
                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                  <State />
                </div>
                <div className="cd-bar mt-3" aria-hidden><i /></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* marquee */}
      <div className="overflow-hidden border-y py-3" style={{ borderColor: 'var(--line)', background: 'rgba(11,95,255,.08)' }} aria-hidden>
        <div className="cd-marq">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {STACK.map((t) => (
                <span key={t + k} className="flex items-center gap-4 pr-4 text-[13px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: 'var(--dim)' }}>
                  {t}<i className="cd-dot" style={{ width: 6, height: 6 }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============ RESOURCES ============ */}
      <section className={`${wrap} py-20 md:py-32 lg:py-24`} aria-labelledby="cd-res">
        <Heading eyebrow="01 / resources" sub="Every card below spins up when it scrolls into view and settles into a running state.">
          <span id="cd-res">What the console runs</span>
        </Heading>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {theme.features.map((f, i) => (
            <article key={f.title} data-cd style={{ ...d((i % 3) * 90), ['--w' as string]: 1 } as CSSProperties} className="cd-rc cd-auto cd-panel flex flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px]" style={{ fontFamily: MONO, color: 'var(--dim)' }}>res-{String(i + 1).padStart(2, '0')}</span>
                <State />
              </div>
              <h3 className="mt-5 text-xl font-semibold leading-tight">{f.title}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed" style={{ color: 'var(--dim)' }}>{f.desc}</p>
              <div className="cd-bar mt-5" aria-hidden><i /></div>
            </article>
          ))}
        </div>
      </section>

      {/* ============ DASHBOARDS ============ */}
      <section className="border-y py-20 md:py-32 lg:py-24" style={{ borderColor: 'var(--line)', background: 'rgba(0,0,0,.18)' }} aria-labelledby="cd-dash">
        <div className={wrap}>
          <Heading eyebrow="02 / dashboards" sub="Pick a tier. The role a user logs in with decides which page they land on.">
            <span id="cd-dash">Three roles, three consoles</span>
          </Heading>
          <div data-cd className="cd-panel mt-8 overflow-hidden">
            <div role="tablist" aria-label="Tier dashboards" className="flex border-b" style={{ borderColor: 'var(--line)' }}>
              {TABS.map((t, i) => (
                <button key={t.id} role="tab" id={`cd-tab-${t.id}`} aria-selected={tab === i} aria-controls="cd-panel" tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)} onKeyDown={onTabKey}
                  className="min-h-12 flex-1 px-2 text-[14px] font-semibold sm:text-base" style={{ color: tab === i ? 'var(--text)' : 'var(--dim)', borderBottom: `2px solid ${tab === i ? 'var(--aq)' : 'transparent'}`, background: tab === i ? 'rgba(11,95,255,.14)' : 'transparent' }}>
                  {t.label}
                </button>
              ))}
            </div>
            <div key={T.id} id="cd-panel" role="tabpanel" aria-labelledby={`cd-tab-${T.id}`} className="cd-tab-in grid gap-8 p-5 sm:p-8 md:min-h-[400px] md:grid-cols-[minmax(0,300px)_1fr] md:items-center">
              <div>
                {T.id === 'free' && (
                  <>
                    <Gauge pct={64} value="3.2 / 5 GB" sub="used / cap" label="Free tier storage gauge: 3.2 of 5 gigabytes used" />
                    <p className="mt-3 text-center"><span className="rounded-full border px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ fontFamily: MONO, borderColor: 'var(--line)', color: 'var(--dim)' }}>Best Effort</span></p>
                  </>
                )}
                {T.id === 'vip' && (
                  <>
                    <Gauge pct={64} proj={82} value="3.2 / 5 GB" sub="proj 4.1" label="VIP storage gauge: 3.2 of 5 gigabytes used, projected 4.1" />
                    <p className="mt-3 flex items-center justify-center gap-4 text-[12px]" style={{ fontFamily: MONO, color: 'var(--dim)' }}>
                      <span><i className="mr-1.5 inline-block h-2 w-4 rounded-full" style={{ background: 'var(--blue)' }} />history</span>
                      <span><i className="mr-1.5 inline-block h-2 w-4 rounded-full" style={{ background: 'var(--aq)', opacity: 0.5 }} />projected</span>
                    </p>
                  </>
                )}
                {T.id === 'admin' && (
                  <ul className="grid gap-2.5" aria-label="Per-tenant SLA badges">
                    {TENANTS.map((t, i) => (
                      <li key={t.label} className="flex min-h-12 items-center justify-between rounded-xl border px-4 py-3" style={{ borderColor: 'var(--line)', background: 'rgba(255,255,255,.03)' }}>
                        <span className="text-[14px]" style={{ fontFamily: MONO, color: 'var(--dim)' }}>tenant-{i + 1}</span>
                        <span className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: t.c }}><i className="h-2.5 w-2.5 rounded-full" style={{ background: t.c }} />{t.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <p className="text-[12px]" style={{ fontFamily: MONO, color: 'var(--aq)' }}>{T.file}</p>
                <ul className="mt-3 grid gap-3">
                  {T.items.map((it) => (
                    <li key={it} className="flex gap-3 text-[15px] leading-snug">
                      <span aria-hidden style={{ color: 'var(--ok)', fontFamily: MONO }}>✓</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ REGIONS ============ */}
      <section className={`${wrap} py-20 md:py-32 lg:py-24`} aria-labelledby="cd-reg">
        <Heading eyebrow="03 / regions" sub="The VIP dashboard shows read and write status per region. In the prototype the values are mocked, and one region is deliberately degraded.">
          <span id="cd-reg">Availability, at a glance</span>
        </Heading>
        <div data-cd className="mt-10 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <div className="cd-panel flex items-center p-3 sm:p-6"><div className="w-full"><RegionMap selected={region} onSelect={setRegion} /></div></div>
          <div className="grid content-start gap-2.5">
            {REGIONS.map((r) => (
              <button key={r.id} type="button" aria-pressed={region === r.id} onClick={() => setRegion(r.id)} className="cd-panel flex min-h-12 items-center justify-between gap-3 px-4 py-2.5 text-left" style={{ borderColor: region === r.id ? 'var(--aq)' : undefined }}>
                <span className="flex items-center gap-3 text-[14px]" style={{ fontFamily: MONO }}>
                  <i className="cd-dot" style={r.ok ? undefined : ({ '--dc': 'var(--warn)' } as CSSProperties)} />{r.id}
                </span>
                <span className="text-[12px]" style={{ fontFamily: MONO, color: r.ok ? 'var(--ok)' : 'var(--warn)' }}>{r.ok ? 'read · write ok' : 'degraded'}</span>
              </button>
            ))}
            <p className="mt-1 text-[13px] leading-snug" style={{ fontFamily: MONO, color: 'var(--dim)' }} aria-live="polite">
              {sel.id}: {sel.ok ? 'reads and writes healthy.' : 'running in a degraded state (mock).'}
            </p>
          </div>
        </div>
      </section>

      {/* ============ STORY ============ */}
      <section className="border-y py-20 md:py-32 lg:py-24" style={{ borderColor: 'var(--line)', background: 'rgba(0,0,0,.18)' }} aria-labelledby="cd-story">
        <div className={`${wrap} grid gap-10 lg:grid-cols-[1fr_1.5fr]`}>
          <Heading eyebrow="04 / activity" sub="Three lines from the build notes, in the order they were learned.">
            <span id="cd-story">Why no framework</span>
          </Heading>
          <ol className="relative ml-2 grid gap-5 border-l pl-6" style={{ borderColor: 'var(--line)' }}>
            {theme.story.quotes.map((q, i) => (
              <li key={q.kicker} data-cd style={d(i * 100)} className="relative">
                <span aria-hidden className="absolute -left-[31px] top-2 h-3 w-3 rounded-full" style={{ background: 'var(--aq)' }} />
                <p className="text-[12px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: 'var(--aq)' }}>{q.kicker}</p>
                <blockquote className="mt-2 text-[1.3rem] font-medium leading-snug sm:text-2xl">{q.quote}</blockquote>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: 'var(--dim)' }}>{q.context}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ ARCHITECTURE ============ */}
      <section className={`${wrap} py-20 md:py-32 lg:py-24`} aria-labelledby="cd-arch">
        <Heading eyebrow="05 / architecture" sub="A multi-page static front-end. State and routing live in the browser, through localStorage and real page loads.">
          <span id="cd-arch">How the pages connect</span>
        </Heading>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div data-cd className="cd-flow cd-panel p-5 sm:p-8" role="img" aria-label="Flow: index.html to auth.js, which routes to admin, VIP or free dashboards, all sharing localStorage">
            {[['index.html', 'landing + login modal'], ['auth.js', 'resolveRole(email)']].map(([a, b], i) => (
              <div key={a}>
                <div className="rounded-xl border px-4 py-3 text-center" style={{ borderColor: 'var(--aq)', background: 'rgba(11,95,255,.14)' }}>
                  <p className="text-[15px]" style={{ fontFamily: MONO }}>{a}</p>
                  <p className="text-[12px]" style={{ fontFamily: MONO, color: 'var(--dim)' }}>{b}</p>
                </div>
                <div className="cd-vl" style={d(300 + i * 400)} />
              </div>
            ))}
            <div className="cd-hl mx-[16.5%]" style={d(900)} />
            <div className="grid grid-cols-3 gap-2">
              {[['admin', 'admin.html'], ['vip', 'dashboard-vip.html'], ['free', 'dashboard-free.html']].map(([r, f], i) => (
                <div key={r}>
                  <div className="cd-vl" style={d(1100)} />
                  <div className="rounded-xl border px-1.5 py-3 text-center" style={{ borderColor: 'var(--line)', background: 'rgba(255,255,255,.03)' }}>
                    <p className="text-[13px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--aq)' }}>{r}</p>
                    <p className="mt-1 text-[11px] leading-tight" style={{ fontFamily: MONO, color: 'var(--dim)' }}>{f}</p>
                  </div>
                  <div className="cd-vl" style={d(1300 + i * 0)} />
                </div>
              ))}
            </div>
            <div className="cd-hl mx-[16.5%]" style={d(1500)} />
            <div className="cd-vl" style={d(1600)} />
            <div className="rounded-xl border px-4 py-3 text-center" style={{ borderColor: 'var(--ok)', background: 'rgba(52,211,153,.08)' }}>
              <p className="text-[14px]" style={{ fontFamily: MONO, color: 'var(--ok)' }}>localStorage · one namespaced key</p>
            </div>
          </div>
          <div className="grid content-start gap-3">
            {theme.architecture.map((a, i) => (
              <article key={a.layer} data-cd style={d(i * 90)} className="cd-panel p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{a.layer}</h3>
                  <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ fontFamily: MONO, color: 'var(--ok)' }}><i className="cd-dot" />running</span>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: 'var(--dim)' }}>{a.details}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ NUMBERS ============ */}
      <section className="border-y py-16 md:py-20" style={{ borderColor: 'var(--line)', background: 'rgba(11,95,255,.07)' }} aria-labelledby="cd-num">
        <div className={wrap}>
          <h2 id="cd-num" className="cd-eyebrow">06 / usage</h2>
          <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {theme.bigNumbers.map((b, i) => (
              <div key={b.label} data-cd style={d(i * 90)} className="cd-panel p-5">
                <dt className="font-bold leading-none" style={{ fontFamily: SPACE, fontSize: 'clamp(2.75rem,9vw,4.5rem)', letterSpacing: '-.03em', color: 'var(--aq)' }}>
                  <Counter value={b.value} />
                </dt>
                <dd className="m-0 mt-2 text-[14px] leading-snug" style={{ color: 'var(--dim)' }}>{b.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      <section className={`${wrap} py-20 md:py-32 lg:py-24`} aria-labelledby="cd-gal">
        <Heading eyebrow="07 / snapshots" sub="Stock imagery used as backdrops for the case study.">
          <span id="cd-gal">Behind the console</span>
        </Heading>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {SNAPS.map((g, i) => (
            <figure key={g.src} data-cd style={d(i * 80)} className={`cd-panel relative m-0 overflow-hidden ${g.cls}`}>
              <Image src={g.src} alt={g.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" loading="lazy" />
              <div className="absolute inset-0" aria-hidden style={{ background: 'linear-gradient(180deg,transparent 55%,rgba(10,18,32,.9))' }} />
              <figcaption className="absolute inset-x-0 bottom-0 p-3 text-[12px]" style={{ fontFamily: MONO, color: 'var(--text)' }}>{g.cap}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ============ OUTCOME ============ */}
      <section className={`${wrap} pb-6 pt-4 md:pb-56 lg:pb-40`} aria-labelledby="cd-out">
        <div data-cd className="cd-panel overflow-hidden" style={{ background: '#0A1220' }}>
          <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: 'var(--line)' }}>
            <i className="cd-dot" />
            <h2 id="cd-out" className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: 'var(--ok)' }}>deploy complete</h2>
          </div>
          <div className="p-6 sm:p-10">
            <p className="text-[13px]" style={{ fontFamily: MONO, color: 'var(--dim)' }}>$ cat outcome.txt</p>
            <p className="mt-4 max-w-3xl font-semibold leading-tight" style={{ fontSize: 'clamp(1.5rem,4.6vw,2.6rem)', letterSpacing: '-.02em' }}>
              {theme.outcomeQuote}
            </p>
            <p className="mt-6 text-[13px]" style={{ fontFamily: MONO, color: 'var(--ok)' }}>✓ 4 pages running · 0 frameworks</p>
          </div>
        </div>
      </section>

      <NextChapter currentSlug={theme.slug} accent={p.accent2 ?? p.accent} />
      <SiteFooter />
    </main>
  );
}
