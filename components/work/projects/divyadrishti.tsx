'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';
import type { ProjectTheme } from '@/lib/project-themes';

/* ------------------------------------------------------------------ */
/* Data + helpers                                                      */
/* ------------------------------------------------------------------ */

type Lv = 0 | 1 | 2; // 0 ok, 1 warn, 2 crit
const LV_COLOR = ['var(--dd-teal)', 'var(--dd-amber)', 'var(--dd-red)'];
const LV_NAME = ['OK', 'WARN', 'CRIT'];

const LEVELS = [
  {
    key: 'nominal', label: 'NOMINAL', sectors: [0, 0, 0, 0, 0, 0] as Lv[],
    msg: 'Density steady across every sector. Concertgoers see the live heatmap, nothing else.',
  },
  {
    key: 'watch', label: 'WATCH', sectors: [0, 0, 1, 0, 1, 0] as Lv[],
    msg: 'Density deltas rising. A predicted hotspot is flagged to officers about 90 seconds ahead of the crush.',
  },
  {
    key: 'surge', label: 'SURGE', sectors: [0, 1, 2, 0, 1, 2] as Lv[],
    msg: 'Customers get a quiet least-dense-gate card. Officers get per-sector density and a one-tap reroute broadcast.',
  },
  {
    key: 'sos', label: 'SOS', sectors: [0, 1, 2, 0, 1, 2] as Lv[],
    msg: 'Hold-to-confirm SOS fired. The pipeline runs, and the offline queue plus mesh relay cover saturated towers.',
  },
];

const SECTOR_IDS = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'];

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const DOTS = (() => {
  const r = lcg(41);
  return Array.from({ length: 44 }, () => {
    const x = 6 + r() * 88;
    const y = 6 + r() * 88;
    const sector = (y < 50 ? 0 : 3) + Math.min(2, Math.floor(x / 33.34));
    return {
      x, y, sector,
      dx: Math.round((r() - 0.5) * 34),
      dy: Math.round((r() - 0.5) * 26),
      d: +(4 + r() * 5).toFixed(2),
      delay: +(-r() * 6).toFixed(2),
    };
  });
})();

const EVENT_META: { tag: Lv; code: string }[] = [
  { tag: 0, code: 'GRID' },
  { tag: 1, code: 'T-90s' },
  { tag: 1, code: 'NUDGE' },
  { tag: 0, code: 'OPS' },
  { tag: 2, code: 'SOS' },
  { tag: 1, code: 'MESH' },
];

const SOS_STEPS = [
  { t: 'Hold 1.2s', d: 'Long press arms, release fires. Visual ring, zero misfires.' },
  { t: 'Location fix', d: 'Current GPS, with a short timeout fallback to last known.' },
  { t: 'Alert written', d: 'An alert record goes live with status active.' },
  { t: 'Push fan-out', d: 'Notifications reach trusted contacts and officers.' },
  { t: 'Offline + mesh', d: 'Hive queue holds it; BLE peers relay when towers saturate.' },
];

const FLOW = ['Customer beacon', 'Density tiles', 'Prediction', 'Officer console', 'Push + mesh'];

/* ------------------------------------------------------------------ */
/* Small shared bits                                                   */
/* ------------------------------------------------------------------ */

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setOn(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`dd-rv ${on ? 'dd-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Led({ c = 'var(--dd-teal)', blink = false, size = 8 }: { c?: string; blink?: boolean; size?: number }) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 rounded-full ${blink ? 'dd-blink' : ''}`}
      style={{ width: size, height: size, background: c, boxShadow: `0 0 8px ${c}` }}
    />
  );
}

function SecHead({ code, title, sub }: { code: string; title: string; sub?: string }) {
  return (
    <Reveal className="mb-8 md:mb-12">
      <p className="dd-mono flex items-center gap-3 text-xs md:text-sm tracking-[0.22em] uppercase" style={{ color: 'var(--dd-amber)' }}>
        <span className="h-px w-8" style={{ background: 'var(--dd-amber)' }} />
        {code}
      </p>
      <h2 className="dd-disp mt-3 text-3xl sm:text-4xl md:text-5xl font-bold uppercase leading-[1.02] tracking-tight">{title}</h2>
      {sub && <p className="mt-3 max-w-2xl text-base md:text-lg" style={{ color: 'var(--dd-dim)' }}>{sub}</p>}
    </Reveal>
  );
}

function unit(label: string) {
  const m = label.match(/^s (.+)$/);
  return m ? { u: "s", l: m[1] } : { u: "", l: label };
}

function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const m = value.match(/^([\d.]+)(.*)$/);
    if (!m) return;
    const target = parseFloat(m[1]);
    const dec = m[1].includes('.') ? m[1].split('.')[1].length : 0;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / 1200);
        const v = target * (1 - Math.pow(1 - p, 3));
        el.textContent = v.toFixed(dec) + m[2];
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      el.textContent = (0).toFixed(dec) + m[2];
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);
  return <span ref={ref}>{value}</span>;
}

function Uptime() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setS((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return <span>SESSION {mm}:{ss}</span>;
}

/* ------------------------------------------------------------------ */
/* Hero map                                                            */
/* ------------------------------------------------------------------ */

function GridMap({ lvl }: { lvl: number }) {
  const L = LEVELS[lvl];
  const spd = lvl >= 2 ? 0.5 : lvl === 1 ? 0.8 : 1;
  return (
    <div
      className="dd-map relative w-full overflow-hidden rounded-xl border aspect-[4/3.4] sm:aspect-[16/11] lg:aspect-[4/3.6]"
      style={{ borderColor: 'var(--dd-line)', background: '#041a20', ['--spd' as string]: spd }}
      role="img"
      aria-label={`Top-down venue grid, alert level ${L.label}. Moving dots are crowd density beacons.`}
    >
      <div className="absolute inset-0 dd-gridbg" />
      <div className="dd-sweep" aria-hidden />
      {/* stage */}
      <div className="absolute left-1/4 top-[3.5%] flex h-[9%] w-1/2 items-center justify-center rounded-b-lg border dd-mono text-[11px] tracking-[0.3em]" style={{ borderColor: 'var(--dd-line)', color: 'var(--dd-dim)', background: 'rgba(45,212,191,0.06)' }}>
        STAGE
      </div>
      {/* sectors + dots area */}
      <div className="absolute inset-x-[4%] top-[17%] bottom-[14%]">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-[2.5%]">
          {SECTOR_IDS.map((id, i) => {
            const c = LV_COLOR[L.sectors[i]];
            return (
              <div
                key={id}
                className="relative rounded-md border transition-colors duration-700"
                style={{ borderColor: c, background: `color-mix(in srgb, ${c} 14%, transparent)` }}
              >
                <span className="dd-mono absolute left-1.5 top-1 text-[11px] font-semibold" style={{ color: c }}>{id}</span>
                {L.sectors[i] === 2 && <span className="dd-mono absolute right-1.5 top-1 text-[11px] font-semibold" style={{ color: c }}>CRIT</span>}
              </div>
            );
          })}
        </div>
        {DOTS.map((d, i) => (
          <span
            key={i}
            className="dd-dot absolute rounded-full transition-colors duration-700"
            style={{
              left: `${d.x}%`, top: `${d.y}%`,
              background: LV_COLOR[L.sectors[d.sector]],
              ['--dx' as string]: `${d.dx}px`, ['--dy' as string]: `${d.dy}px`,
              ['--d' as string]: `${d.d}s`, animationDelay: `${d.delay}s`,
            }}
          />
        ))}
        {lvl === 1 && (
          <div className="absolute flex items-center justify-center" style={{ left: '50%', top: '78%', width: 0, height: 0 }}>
            <span className="dd-hot absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed" style={{ borderColor: 'var(--dd-amber)' }} />
            <span className="dd-mono absolute top-5 -translate-x-1/2 whitespace-nowrap rounded px-1.5 text-[11px] font-bold" style={{ background: 'var(--dd-amber)', color: '#041a20' }}>T-90s</span>
          </div>
        )}
        {lvl === 3 && (
          <div className="absolute" style={{ left: '83%', top: '78%', width: 0, height: 0 }}>
            <span className="dd-ping absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2" style={{ borderColor: 'var(--dd-red)' }} />
            <span className="dd-ping dd-ping2 absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2" style={{ borderColor: 'var(--dd-red)' }} />
            <span className="dd-mono absolute -top-1.5 left-0 -translate-x-1/2 -translate-y-full rounded px-1.5 text-[11px] font-bold" style={{ background: 'var(--dd-red)', color: '#fff' }}>SOS</span>
          </div>
        )}
      </div>
      {/* gates */}
      <div className="absolute inset-x-[4%] bottom-[3%] flex justify-between">
        {['G1', 'G2', 'G3', 'G4'].map((g, i) => {
          const safe = i === 0 && lvl >= 2;
          return (
            <span key={g} className="dd-mono inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-semibold transition-colors duration-700" style={{ borderColor: safe ? 'var(--dd-teal)' : 'var(--dd-line)', color: safe ? '#041a20' : 'var(--dd-dim)', background: safe ? 'var(--dd-teal)' : 'transparent' }}>
              {g}{safe && ' EXIT'}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function Hero({ theme }: { theme: ProjectTheme }) {
  const [lvl, setLvl] = useState(0);
  const L = LEVELS[lvl];
  const critCount = L.sectors.filter((s) => s === 2).length;
  const warnCount = L.sectors.filter((s) => s === 1).length;
  return (
    <section className="relative isolate overflow-hidden px-4 sm:px-6 lg:px-10 pt-24 md:pt-36 pb-14 md:pb-20">
      <div className="absolute inset-0 -z-10" aria-hidden>
        <Image src={theme.heroImage} alt="" fill priority unoptimized sizes="100vw" className="object-cover opacity-[0.16]" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(4,20,26,0.4) 0%, var(--dd-bg) 92%)' }} />
      </div>
      <div className="mx-auto max-w-7xl">
        <div className="dd-mono mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border px-3 py-2 text-xs tracking-[0.14em] uppercase" style={{ borderColor: 'var(--dd-line)', background: 'var(--dd-panel)', color: 'var(--dd-dim)' }}>
          <span className="flex items-center gap-2"><Led blink /> Ops online</span>
          <span className="flex items-center gap-2"><Led c="var(--dd-amber)" /> Mesh</span>
          <span className="flex items-center gap-2"><Led c="var(--dd-red)" blink /> SOS armed</span>
          <span className="ml-auto hidden sm:inline"><Uptime /></span>
        </div>
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          <div>
            <p className="dd-mono text-xs md:text-sm tracking-[0.2em] uppercase" style={{ color: 'var(--dd-amber)' }}>{theme.kicker}</p>
            <h1 className="dd-disp mt-4 font-bold uppercase leading-[0.92] tracking-tight text-[clamp(2.2rem,9.2vw,5rem)]">
              <span className="dd-glitch">{theme.title}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg md:text-xl leading-relaxed" style={{ color: 'var(--dd-text)' }}>{theme.subtitle}</p>
            <p className="dd-mono mt-8 mb-3 text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--dd-dim)' }}>Simulate alert level</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Alert level">
              {LEVELS.map((l, i) => {
                const c = i === 3 ? 'var(--dd-red)' : i === 0 ? 'var(--dd-teal)' : 'var(--dd-amber)';
                const on = i === lvl;
                return (
                  <button
                    key={l.key} type="button" aria-pressed={on} onClick={() => setLvl(i)}
                    className="dd-mono min-h-11 rounded-md border px-3 text-xs font-bold tracking-[0.14em] transition-colors"
                    style={{ borderColor: c, background: on ? c : 'transparent', color: on ? '#041a20' : c }}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 rounded-lg border p-4" style={{ borderColor: 'var(--dd-line)', background: 'var(--dd-panel)' }} aria-live="polite">
              <p className="dd-mono mb-2 flex items-center gap-2 text-xs tracking-[0.18em] uppercase" style={{ color: 'var(--dd-dim)' }}>
                <Led c={lvl === 3 ? 'var(--dd-red)' : lvl === 0 ? 'var(--dd-teal)' : 'var(--dd-amber)'} blink={lvl > 0} />
                {L.label} / crit {critCount} / warn {warnCount}
              </p>
              <p className="text-base leading-relaxed">{L.msg}</p>
            </div>
          </div>
          <div>
            <div className="dd-mono mb-2 flex items-center justify-between text-xs tracking-[0.16em] uppercase" style={{ color: 'var(--dd-dim)' }}>
              <span>Top-down venue grid</span>
              <span className="flex items-center gap-3">
                {[0, 1, 2].map((n) => (
                  <span key={n} className="flex items-center gap-1.5"><Led c={LV_COLOR[n]} size={7} />{LV_NAME[n]}</span>
                ))}
              </span>
            </div>
            <GridMap lvl={lvl} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function Telemetry({ theme }: { theme: ProjectTheme }) {
  return (
    <section className="border-y px-4 sm:px-6 lg:px-10 py-12 md:py-16" style={{ borderColor: 'var(--dd-line)', background: 'var(--dd-panel)' }}>
      <div className="mx-auto max-w-7xl">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {theme.bigNumbers.map((b, i) => (
            <li key={b.label}>
              <Reveal delay={i * 90} className="relative flex flex-col items-center rounded-xl border p-4 md:p-6 text-center" >
                <svg viewBox="0 0 120 120" className="h-28 w-28 md:h-36 md:w-36" aria-hidden>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--dd-line)" strokeWidth="3" strokeDasharray="2 5" />
                  <circle className="dd-ring" cx="60" cy="60" r="52" fill="none" stroke={i % 2 ? 'var(--dd-amber)' : 'var(--dd-teal)'} strokeWidth="4" strokeLinecap="round" transform="rotate(-90 60 60)" />
                </svg>
                <div className="absolute inset-x-0 top-4 md:top-6 flex h-28 md:h-36 items-center justify-center">
                  <span className="dd-disp text-4xl md:text-5xl font-bold"><Counter value={b.value + unit(b.label).u} /></span>
                </div>
                <p className="dd-mono mt-3 text-xs md:text-sm tracking-[0.12em] uppercase" style={{ color: 'var(--dd-dim)' }}>{unit(b.label).l}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Briefings({ theme }: { theme: ProjectTheme }) {
  const cols = ['var(--dd-amber)', 'var(--dd-teal)', 'var(--dd-red)'];
  return (
    <section className="px-4 sm:px-6 lg:px-10 pt-20 md:pt-28">
      <div className="mx-auto max-w-7xl">
        <SecHead code="01 / Briefings" title="Why it exists" sub="Three lines from the design notes that shaped every screen." />
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          {theme.story.quotes.map((q, i) => (
            <Reveal key={q.kicker} delay={i * 110}>
              <figure className="relative h-full overflow-hidden rounded-xl border p-5 md:p-7" style={{ borderColor: 'var(--dd-line)', background: 'var(--dd-panel)' }}>
                <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: cols[i % 3] }} />
                <figcaption className="dd-mono mb-4 flex items-center gap-2 text-xs tracking-[0.2em] uppercase" style={{ color: cols[i % 3] }}>
                  <Led c={cols[i % 3]} /> BRF-0{i + 1}
                </figcaption>
                <blockquote className="dd-disp text-xl md:text-2xl font-medium leading-snug">&ldquo;{q.quote}&rdquo;</blockquote>
                <p className="dd-mono mt-5 border-t pt-4 text-sm leading-relaxed" style={{ borderColor: 'var(--dd-line)', color: 'var(--dd-dim)' }}>{q.context}</p>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function IncidentLog({ theme }: { theme: ProjectTheme }) {
  const rows = useMemo(
    () => theme.features.map((f, i) => ({ ...f, ...EVENT_META[i % EVENT_META.length], id: `EVT-${String(i + 1).padStart(2, '0')}` })),
    [theme.features],
  );
  const [filter, setFilter] = useState<number>(-1);
  const [active, setActive] = useState(0);
  const shown = rows.filter((r) => filter < 0 || r.tag === filter);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setActive((a) => a + 1), 2800);
    return () => clearInterval(id);
  }, []);
  const cur = shown.length ? active % shown.length : 0;
  const chips = [{ k: -1, l: 'ALL', n: rows.length }, ...[0, 1, 2].map((k) => ({ k, l: LV_NAME[k], n: rows.filter((r) => r.tag === k).length }))];
  return (
    <section className="px-4 sm:px-6 lg:px-10 pt-20 md:pt-28">
      <div className="mx-auto max-w-7xl">
        <SecHead code="02 / Incident log" title="What the system does" sub="Every capability, written as an event the control room would see." />
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter events">
          {chips.map((c) => {
            const on = filter === c.k;
            const col = c.k < 0 ? 'var(--dd-text)' : LV_COLOR[c.k];
            return (
              <button key={c.k} type="button" aria-pressed={on} onClick={() => { setFilter(c.k); setActive(0); }}
                className="dd-mono min-h-11 rounded-md border px-4 text-xs font-bold tracking-[0.14em]"
                style={{ borderColor: col, background: on ? col : 'transparent', color: on ? '#041a20' : col }}>
                {c.l} <span className="opacity-80">{c.n}</span>
              </button>
            );
          })}
        </div>
        <ol className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--dd-line)', background: 'var(--dd-panel)' }}>
          {shown.map((r, i) => {
            const c = LV_COLOR[r.tag];
            const on = i === cur;
            return (
              <li key={r.id} className="dd-rowin border-b last:border-b-0" style={{ borderColor: 'var(--dd-line)', animationDelay: `${i * 70}ms` }}
                onMouseEnter={() => setActive(i)}>
                <div className="relative grid gap-x-5 gap-y-2 p-4 md:grid-cols-[150px_1fr_auto] md:items-center md:p-5 transition-colors duration-500"
                  style={{ background: on ? `color-mix(in srgb, ${c} 10%, transparent)` : 'transparent' }}>
                  <span aria-hidden className="absolute inset-y-0 left-0 w-1 transition-opacity duration-500" style={{ background: c, opacity: on ? 1 : 0.35 }} />
                  <div className="dd-mono flex items-center gap-3 pl-2 text-xs tracking-[0.14em]" style={{ color: 'var(--dd-dim)' }}>
                    <Led c={c} blink={on} /> {r.id}
                  </div>
                  <div>
                    <h3 className="dd-disp text-lg md:text-xl font-semibold">{r.title}</h3>
                    <p className="mt-1 text-base leading-relaxed" style={{ color: 'var(--dd-dim)' }}>{r.desc}</p>
                  </div>
                  <div className="dd-mono flex items-center gap-2 text-xs font-bold tracking-[0.12em]">
                    <span className="rounded px-2 py-1" style={{ background: c, color: '#041a20' }}>{LV_NAME[r.tag]}</span>
                    <span style={{ color: c }}>{r.code}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function SosPipeline() {
  const [phase, setPhase] = useState<'idle' | 'holding' | 'running' | 'done'>('idle');
  const [step, setStep] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clearAll, []);

  const fire = () => {
    clearAll();
    setPhase('running'); setStep(1);
    for (let n = 2; n <= SOS_STEPS.length; n++) {
      timers.current.push(setTimeout(() => setStep(n), (n - 1) * 450));
    }
    timers.current.push(setTimeout(() => setPhase('done'), SOS_STEPS.length * 450));
  };
  const down = () => {
    if (phase !== 'idle') return;
    setPhase('holding');
    timers.current.push(setTimeout(fire, 1200));
  };
  const up = () => {
    if (phase === 'holding') { clearAll(); setPhase('idle'); }
  };
  const reset = () => { clearAll(); setPhase('idle'); setStep(0); };
  const C = 2 * Math.PI * 54;
  const holding = phase === 'holding';
  const armed = phase === 'running' || phase === 'done';

  return (
    <section className="px-4 sm:px-6 lg:px-10 pt-20 md:pt-28">
      <div className="mx-auto max-w-7xl">
        <SecHead code="03 / SOS pipeline" title="Prediction can fail. SOS can't." sub="Press and hold the button for 1.2 seconds to run a demo of the pipeline. Let go early and nothing fires." />
        <div className="grid gap-6 rounded-xl border p-5 md:p-8 lg:grid-cols-[260px_1fr] lg:gap-12" style={{ borderColor: 'var(--dd-line)', background: 'var(--dd-panel)' }}>
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              aria-label="Hold to confirm SOS for 1.2 seconds (demo)"
              onPointerDown={down} onPointerUp={up} onPointerLeave={up} onPointerCancel={up}
              onKeyDown={(e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); down(); } }}
              onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') up(); }}
              onContextMenu={(e) => e.preventDefault()}
              className="dd-sosbtn relative grid h-40 w-40 place-items-center rounded-full select-none"
              style={{ touchAction: 'manipulation', WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
            >
              {armed && <span aria-hidden className="dd-ping absolute inset-2 rounded-full border-2" style={{ borderColor: 'var(--dd-red)' }} />}
              <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden>
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--dd-line)" strokeWidth="5" />
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--dd-red)" strokeWidth="5" strokeLinecap="round"
                  transform="rotate(-90 60 60)" strokeDasharray={C}
                  style={{ strokeDashoffset: holding || armed ? 0 : C, transition: holding ? 'stroke-dashoffset 1.2s linear' : 'stroke-dashoffset .25s ease' }} />
              </svg>
              <span className="dd-disp relative grid h-28 w-28 place-items-center rounded-full text-2xl font-bold tracking-wider transition-colors"
                style={{ background: armed ? 'var(--dd-red)' : holding ? 'rgba(255,84,104,0.35)' : 'rgba(255,84,104,0.14)', color: armed ? '#fff' : 'var(--dd-red)', border: '2px solid var(--dd-red)' }}>
                SOS
              </span>
            </button>
            <p className="dd-mono text-center text-xs tracking-[0.16em] uppercase" style={{ color: 'var(--dd-dim)' }} aria-live="polite">
              {phase === 'idle' && 'Hold to arm'}{holding && 'Keep holding...'}{phase === 'running' && 'Pipeline running'}{phase === 'done' && 'Delivered (demo)'}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={fire} disabled={phase === 'running'} className="dd-mono min-h-11 rounded-md border px-3 text-xs font-bold tracking-[0.12em] disabled:opacity-40" style={{ borderColor: 'var(--dd-teal)', color: 'var(--dd-teal)' }}>RUN</button>
              <button type="button" onClick={reset} className="dd-mono min-h-11 rounded-md border px-3 text-xs font-bold tracking-[0.12em]" style={{ borderColor: 'var(--dd-line)', color: 'var(--dd-dim)' }}>RESET</button>
            </div>
          </div>

          <div>
            <ol className="relative">
              {SOS_STEPS.map((s, i) => {
                const done = i < step;
                const cur = i === step && phase === 'running';
                const c = done ? 'var(--dd-teal)' : cur ? 'var(--dd-amber)' : 'var(--dd-dim)';
                return (
                  <li key={s.t} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < SOS_STEPS.length - 1 && (
                      <span aria-hidden className="absolute left-[19px] top-10 bottom-0 w-0.5 overflow-hidden" style={{ background: 'var(--dd-line)' }}>
                        <span className="absolute inset-0 origin-top transition-transform duration-500" style={{ background: 'var(--dd-teal)', transform: `scaleY(${i < step - 1 ? 1 : 0})` }} />
                      </span>
                    )}
                    <span className="dd-mono grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 text-sm font-bold transition-colors duration-500"
                      style={{ borderColor: c, background: done ? c : 'transparent', color: done ? '#041a20' : c }}>
                      {done ? '✓' : i + 1}
                    </span>
                    <div className="pt-1">
                      <h3 className="dd-disp text-lg font-semibold transition-colors duration-500" style={{ color: done || cur ? 'var(--dd-text)' : 'var(--dd-dim)' }}>{s.t}</h3>
                      <p className="mt-0.5 text-base leading-relaxed" style={{ color: 'var(--dd-dim)' }}>{s.d}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6">
              <div className="dd-mono mb-2 flex justify-between text-xs tracking-[0.14em] uppercase" style={{ color: 'var(--dd-dim)' }}>
                <span>End-to-end budget</span><span style={{ color: 'var(--dd-amber)' }}>under 3s</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full" style={{ background: 'var(--dd-line)' }}>
                <div className="h-full w-full origin-left rounded-full" style={{ background: 'linear-gradient(90deg, var(--dd-teal), var(--dd-amber))', transform: `scaleX(${step / SOS_STEPS.length})`, transition: 'transform .45s linear' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Architecture({ theme }: { theme: ProjectTheme }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="px-4 sm:px-6 lg:px-10 pt-20 md:pt-28">
      <div className="mx-auto max-w-7xl">
        <SecHead code="04 / Signal path" title="How a beacon becomes a decision" sub="Pick a layer to read its details. The strip shows the route a density signal travels." />
        <Reveal className="mb-6">
          <ol className="flex flex-wrap items-center gap-2" aria-label="Signal route">
            {FLOW.map((f, i) => (
              <li key={f} className="flex items-center gap-2">
                <span className="dd-chip dd-mono relative rounded-md border px-3 py-2 text-xs font-semibold tracking-[0.1em] uppercase" style={{ borderColor: 'var(--dd-line)', background: 'var(--dd-panel)', animationDelay: `${i * 1.1}s` }}>{f}</span>
                {i < FLOW.length - 1 && <span aria-hidden style={{ color: 'var(--dd-amber)' }}>&rarr;</span>}
              </li>
            ))}
          </ol>
        </Reveal>
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <div role="tablist" aria-label="Architecture layers" className="grid gap-2">
            {theme.architecture.map((a, i) => {
              const on = i === open;
              return (
                <button key={a.layer} type="button" role="tab" aria-selected={on} onClick={() => setOpen(i)}
                  className="dd-mono flex min-h-12 items-center gap-3 rounded-lg border px-4 text-left text-sm font-semibold tracking-[0.08em] uppercase transition-colors"
                  style={{ borderColor: on ? 'var(--dd-amber)' : 'var(--dd-line)', background: on ? 'rgba(251,191,36,0.1)' : 'var(--dd-panel)', color: on ? 'var(--dd-amber)' : 'var(--dd-text)' }}>
                  <span style={{ color: on ? 'var(--dd-amber)' : 'var(--dd-dim)' }}>L{i + 1}</span>
                  {a.layer}
                </button>
              );
            })}
          </div>
          <div role="tabpanel" className="relative overflow-hidden rounded-xl border p-6 md:p-8" style={{ borderColor: 'var(--dd-line)', background: 'var(--dd-panel)' }}>
            <div key={open} className="dd-rowin">
              <p className="dd-mono flex items-center gap-2 text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--dd-teal)' }}><Led blink /> Layer L{open + 1} online</p>
              <h3 className="dd-disp mt-3 text-3xl md:text-4xl font-bold uppercase">{theme.architecture[open].layer}</h3>
              <p className="mt-4 text-lg md:text-xl leading-relaxed">{theme.architecture[open].details}</p>
            </div>
            <div className="mt-8 grid grid-cols-5 gap-1.5" aria-hidden>
              {theme.architecture.map((_, i) => (
                <span key={i} className="h-1.5 rounded-full transition-colors duration-500" style={{ background: i <= open ? 'var(--dd-amber)' : 'var(--dd-line)' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const BLOBS = [
  { l: '52%', t: '66%' }, { l: '72%', t: '72%' }, { l: '34%', t: '70%' },
  { l: '60%', t: '62%' }, { l: '42%', t: '74%' }, { l: '68%', t: '68%' },
];

function Feeds({ theme }: { theme: ProjectTheme }) {
  const feeds = (theme.gallery ?? []).map((g, i) => ({
    src: g.src,
    id: `CAM ${String(i + 1).padStart(2, '0')}`,
    cap: g.caption ?? `Feed ${i + 1}`,
    alt: `Illustrative crowd photo, ${(g.caption ?? `feed ${i + 1}`).toLowerCase()}`,
    blob: BLOBS[i % BLOBS.length],
  }));
  return (
    <section className="px-4 sm:px-6 lg:px-10 pt-20 md:pt-28">
      <div className="mx-auto max-w-7xl">
        <SecHead code="05 / Camera wall" title="The crowd it is built for" sub="Illustrative venue photos with a density overlay. Forty thousand people, one signal." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
          {feeds.map((f, i) => (
            <Reveal key={f.id} delay={(i % 3) * 120}>
              <figure className="relative aspect-[4/3] overflow-hidden rounded-xl border" style={{ borderColor: 'var(--dd-line)' }}>
                <Image src={f.src} alt={f.alt} fill unoptimized loading={i < 3 ? "eager" : "lazy"} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(4,26,32,0.45), rgba(4,26,32,0.1) 40%, rgba(4,26,32,0.8))' }} />
                <div className="dd-scan absolute inset-0" aria-hidden />
                <span aria-hidden className="dd-heat absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: f.blob.l, top: f.blob.t, background: 'radial-gradient(circle, rgba(255,84,104,0.65), rgba(251,191,36,0.3) 55%, transparent 72%)', animationDelay: `${i * 0.7}s` }} />
                <div className="dd-mono absolute left-3 top-3 flex items-center gap-2 rounded px-2 py-1 text-xs font-bold tracking-[0.14em]" style={{ background: 'rgba(4,26,32,0.85)', color: 'var(--dd-text)' }}>
                  <Led c="var(--dd-red)" blink /> REC {f.id}
                </div>
                <figcaption className="dd-mono absolute inset-x-3 bottom-3 text-xs tracking-[0.1em] uppercase" style={{ color: 'var(--dd-text)' }}>
                  <span className="rounded px-2 py-1" style={{ background: 'rgba(4,26,32,0.85)' }}>{f.cap}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Outcome({ theme }: { theme: ProjectTheme }) {
  return (
    <section className="px-4 sm:px-6 lg:px-10 pt-20 md:pt-28 pb-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-xl border p-6 md:p-12" style={{ borderColor: 'var(--dd-teal)', background: 'var(--dd-panel)' }}>
            <p className="dd-mono flex items-center gap-3 text-xs md:text-sm tracking-[0.22em] uppercase" style={{ color: 'var(--dd-teal)' }}>
              <Led blink size={10} /> Status: all clear
            </p>
            <p className="dd-disp mt-6 text-2xl sm:text-3xl md:text-5xl font-bold leading-[1.15]">
              <span style={{ color: 'var(--dd-amber)' }}>&gt; </span>{theme.outcomeQuote}<span className="dd-cursor" aria-hidden>_</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const CSS = `
.dd-root{--dd-bg:#04141a;--dd-panel:#08222a;--dd-line:rgba(94,234,212,.2);--dd-text:#e6fbf8;--dd-dim:#9bbdbb;--dd-teal:#2dd4bf;--dd-amber:#fbbf24;--dd-red:#ff5468;
  background:var(--dd-bg);color:var(--dd-text);font-family:var(--font-sans),Inter,system-ui,sans-serif;overflow-x:clip}
.dd-root .dd-mono{font-family:var(--font-plex),'IBM Plex Mono',ui-monospace,monospace}
.dd-root .dd-disp{font-family:var(--font-space),'Space Grotesk',system-ui,sans-serif}
.dd-root button:focus-visible{outline:2px solid var(--dd-amber);outline-offset:3px}
.dd-gridbg{background-image:linear-gradient(var(--dd-line) 1px,transparent 1px),linear-gradient(90deg,var(--dd-line) 1px,transparent 1px);background-size:28px 28px;opacity:.55}
.dd-sweep{position:absolute;left:50%;top:50%;width:170%;aspect-ratio:1;margin:-85% 0 0 -85%;border-radius:50%;
  background:conic-gradient(from 0deg,transparent 0 300deg,rgba(45,212,191,.2) 358deg,rgba(45,212,191,.5) 360deg);animation:dd-spin 7s linear infinite;pointer-events:none;will-change:transform}
.dd-dot{width:7px;height:7px;margin:-3px 0 0 -3px;box-shadow:0 0 6px currentColor;animation:dd-drift calc(var(--d) * var(--spd,1)) ease-in-out infinite alternate}
@media (min-width:768px){.dd-dot{width:9px;height:9px;margin:-4px 0 0 -4px}}
.dd-hot{animation:dd-pulse 1.6s ease-in-out infinite}
.dd-ping{animation:dd-ping 1.8s ease-out infinite}
.dd-ping2{animation-delay:.9s}
.dd-blink{animation:dd-blink 1.4s steps(2,jump-none) infinite}
.dd-cursor{animation:dd-blink 1s steps(2,jump-none) infinite;color:var(--dd-teal)}
.dd-rv{opacity:0;transform:translateY(16px);transition:opacity .65s ease,transform .65s ease}
.dd-rv.dd-in{opacity:1;transform:none}
.dd-ring{stroke-dasharray:327;stroke-dashoffset:327;transition:stroke-dashoffset 1.4s cubic-bezier(.2,.7,.2,1) .2s}
.dd-in .dd-ring{stroke-dashoffset:0}
.dd-rowin{animation:dd-rowin .5s ease both}
.dd-chip::after{content:"";position:absolute;inset:0;border-radius:inherit;background:var(--dd-amber);opacity:0;animation:dd-chip 5.5s ease-in-out infinite;animation-delay:inherit;pointer-events:none}
.dd-scan{background:repeating-linear-gradient(0deg,rgba(0,0,0,.22) 0 1px,transparent 1px 4px);pointer-events:none}
.dd-heat{animation:dd-pulse 2.6s ease-in-out infinite}
.dd-sosbtn{background:transparent;cursor:pointer}
.dd-glitch{display:inline-block;animation:dd-glitch 7s steps(1,end) infinite}
@keyframes dd-spin{to{transform:rotate(360deg)}}
@keyframes dd-drift{from{transform:translate(0,0)}to{transform:translate(var(--dx),var(--dy))}}
@keyframes dd-pulse{0%,100%{transform:translate(-50%,-50%) scale(.85);opacity:.6}50%{transform:translate(-50%,-50%) scale(1.15);opacity:1}}
@keyframes dd-ping{0%{transform:translate(-50%,-50%) scale(.3);opacity:.9}100%{transform:translate(-50%,-50%) scale(2.2);opacity:0}}
@keyframes dd-blink{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes dd-rowin{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes dd-chip{0%,16%,100%{opacity:0}6%{opacity:.28}}
@keyframes dd-glitch{0%,93%,100%{transform:translate(0)}94%{transform:translate(-3px,0)}96%{transform:translate(3px,0)}98%{transform:translate(-1px,0)}}
.dd-sosbtn .dd-ping{animation-name:dd-ping2b}
@keyframes dd-ping2b{0%{transform:scale(.8);opacity:.9}100%{transform:scale(1.35);opacity:0}}
@media (prefers-reduced-motion: reduce){
  .dd-root *,.dd-root *::before,.dd-root *::after{animation:none!important;transition:none!important}
  .dd-rv{opacity:1;transform:none}
  .dd-ring{stroke-dashoffset:0}
}
`;

export default function Page({ theme }: { theme: ProjectTheme }) {
  return (
    <div className="dd-root min-h-[100svh]">
      <style>{CSS}</style>
      <main>
        <Hero theme={theme} />
        <Telemetry theme={theme} />
        <Briefings theme={theme} />
        <IncidentLog theme={theme} />
        <SosPipeline />
        <Architecture theme={theme} />
        <Feeds theme={theme} />
        <Outcome theme={theme} />
      </main>
      <NextChapter currentSlug={theme.slug} accent={theme.palette.accent} />
      <SiteFooter />
    </div>
  );
}
