'use client';

// SpaceForge: ORBIT microsite. Deep-space navy, CSS starfield, concentric orbit rings with
// satellites, 3D-tilt payload cards (CSS transforms only) and a mission-log (T+) structure.
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

// ---- deterministic starfield (box-shadow lists, painted once, only transformed) -------------
function stars(n: number, seed: number, w: number, h: number, colors: string[]) {
  let s = seed;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: n }, (_, i) => `${Math.round(r() * w)}px ${Math.round(r() * h)}px ${colors[i % colors.length]}`).join(',');
}
const S1 = stars(240, 7, 1600, 1500, ['rgba(232,234,242,.75)', 'rgba(167,169,190,.7)']);
const S2 = stars(70, 13, 1600, 1500, ['#ffffff', 'rgba(232,234,242,.9)']);
const S3 = stars(26, 29, 1600, 1500, ['#00FFE0', '#B68CFF', '#ffffff']);

// ---- sourced content -------------------------------------------------------------------------
const STACK_MARQUEE = ['React 19', 'TypeScript', 'Vite', 'Tailwind v4', 'React-Three-Fiber', 'Three.js', 'Spline', 'Framer Motion 12', 'AOS'];

const LOG = [
  {
    t: '00:05', tag: 'KEPT', title: 'Spline for the centerpiece',
    body: 'A hand-rolled R3F scene gave more control over orbit and lighting, but doubled the bundle and needed a model there was no budget to commission. Spline went in for the hero. R3F stayed for the starfield, where full control of the buffer geometry mattered.',
  },
  {
    t: '00:07', tag: 'BUILT', title: 'A starfield that took three days',
    body: 'drei\'s Stars looked like every other R3F demo, so the field became custom: 3,000 points from a thick disc with a slight Y bias, colour-jittered from white to faint cyan, sized non-uniformly. The breakthrough was not animating each star. The whole Points object rotates slowly on Y.',
  },
  {
    t: '00:09', tag: 'FIXED', title: 'The seam between two motion systems',
    body: 'Framer Motion ran the hero and AOS ran the rest, and the fold felt abrupt because the easing differed. AOS was re-initialised with ease-out-cubic at 1200ms, the closest match to Framer\'s default ease-out at 0.8s. The seam disappeared.',
  },
  {
    t: '00:11', tag: 'CUT', title: 'The real camera dolly',
    body: 'A camera that physically moved forward with scroll worked, but dropped to about 38fps on a mid-range laptop and had no graceful reduced-motion fallback. It was shelved. The shipped version fakes it: the starfield rotates and scales subtly with scroll, 90% of the feel at 5% of the cost.',
  },
];

const VOICES = [
  { face: 'Syne', job: 'hero hook', text: 'Launch Your Ideas Into the Cosmos', css: "var(--font-syne), system-ui, sans-serif", cls: 'text-[clamp(1.6rem,6vw,3.1rem)] font-bold leading-[1.08]', grad: true },
  { face: 'Orbitron', job: 'sub-copy', text: 'Sequenced, not simultaneous.', css: "var(--font-space), system-ui, sans-serif", cls: 'text-[clamp(1rem,3.4vw,1.5rem)] font-semibold uppercase tracking-[0.18em]', grad: false },
  { face: 'Antonio', job: 'manifesto', text: 'We Build the Rocket', css: "var(--font-oswald), Impact, sans-serif", cls: 'text-[clamp(1.7rem,6vw,3rem)] font-medium italic uppercase tracking-wide', grad: false },
];

const FRAMES = [
  { src: '/work/spaceforge/thumb.jpg', w: 4, h: 5, cap: 'Frame 00', alt: 'A stag silhouetted against a glowing orange sphere in a dark 3D-rendered forest', fit: '' },
  { src: '/work/spaceforge/gallery-3.jpg', w: 3, h: 2, cap: 'Frame 01', alt: 'A heavy-lift rocket lifting off beside a lake with clouds of exhaust', fit: '' },
  { src: '/work/spaceforge/gallery-5.jpg', w: 900, h: 1007, cap: 'Frame 02', alt: 'The Milky Way arching over rock formations in a night desert', fit: '' },
  { src: '/work/spaceforge/gallery-4.jpg', w: 16, h: 9, cap: 'Frame 03', alt: 'A glowing workstation with a monitor, phone and flowers on a desk', fit: '' },
  { src: '/work/spaceforge/gallery-6.jpg', w: 900, h: 572, cap: 'Frame 04', alt: 'A purple starry sky with a meteor trail above dark mountain ridges', fit: '' },
  { src: '/work/spaceforge/gallery-2.jpg', w: 1, h: 1, cap: 'Frame 05 / detail crop', alt: 'Close crop of the red planet surface with craters and dust bands', fit: 'scale-[1.35]' },
];

// Frames dealt into balanced columns per breakpoint (indices into FRAMES), so no column ends short.
const DEAL: number[][][] = [
  [[0, 1, 2, 3, 4, 5]],
  [[0, 1, 4], [2, 3, 5]],
  [[0, 3], [2, 4], [1, 5]],
];

function useCols() {
  const [n, setN] = useState(1);
  useEffect(() => {
    const m2 = window.matchMedia('(min-width:640px)');
    const m3 = window.matchMedia('(min-width:1024px)');
    const f = () => setN(m3.matches ? 3 : m2.matches ? 2 : 1);
    f();
    m2.addEventListener('change', f);
    m3.addEventListener('change', f);
    return () => { m2.removeEventListener('change', f); m3.removeEventListener('change', f); };
  }, []);
  return n;
}

// ---- small client parts ------------------------------------------------------------------------
function Clock() {
  const [s, setS] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setS((v) => (v + 1) % 5999), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return <span className="tabular-nums">T+{mm}:{ss}</span>;
}

function CountUp({ to, ms = 1600 }: { to: number; ms?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    setV(0);
    let raf = 0;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / ms);
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, ms]);
  return <span ref={ref} className="tabular-nums">{v.toLocaleString('en-US')}</span>;
}

function Tilt({ children, className = '', max = 9 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${((0.5 - py) * max * 2).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((px - 0.5) * max * 2).toFixed(2)}deg`);
    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };
  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`sf-tilt ${className}`}>
      {children}
    </div>
  );
}

function SecHead({ t, tag, title, sub }: { t: string; tag: string; title: string; sub?: string }) {
  return (
    <header className="sf-rv mb-10 md:mb-14 max-w-3xl">
      <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.22em] flex items-center gap-3" style={{ color: 'var(--sf-c)' }}>
        <span className="sf-dot" aria-hidden />
        T+{t} <span style={{ color: 'var(--sf-dim)' }}>/ {tag}</span>
      </p>
      <h2 className="sf-h mt-4 text-[clamp(1.65rem,5.6vw,3.2rem)] leading-[1.08]">{title}</h2>
      {sub && <p className="mt-4 text-base md:text-lg leading-relaxed" style={{ color: 'var(--sf-dim)' }}>{sub}</p>}
    </header>
  );
}

// ---- page ----------------------------------------------------------------------------------------
export default function Page({ theme }: { theme: ProjectTheme }) {
  const rootRef = useRef<HTMLElement>(null);
  const [tab, setTab] = useState(0);
  const [layer, setLayer] = useState(0);
  const [seq, setSeq] = useState(0);
  const cols = useCols();
  const p = theme.palette;
  const quotes = theme.story.quotes;
  const cssVars = {
    '--sf-bg': p.bg, '--sf-mid': p.bgMid, '--sf-text': p.text, '--sf-dim': p.dim,
    '--sf-p': p.accent, '--sf-c': p.accent2 ?? '#00FFE0', '--sf-pl': '#B68CFF',
  } as React.CSSProperties;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add('sf-ready');
    const els = root.querySelectorAll('.sf-rv');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  const ringR = [62, 100, 138, 176];

  return (
    <main ref={rootRef} className="sf-root relative overflow-x-clip" style={{ ...cssVars, background: p.bg, color: p.text }}>
      <style>{CSS}</style>

      {/* ============ T+00:00 LAUNCH ============ */}
      <section className="relative overflow-hidden pt-24 md:pt-40 pb-16 md:pb-24 min-h-[88svh]" style={{ background: `radial-gradient(120% 70% at 75% 30%, ${p.bgMid} 0%, ${p.bg} 62%)` }}>
        <div className="sf-layer sf-drift-a" aria-hidden><i className="sf-star" style={{ width: 1, height: 1, boxShadow: S1 }} /></div>
        <div className="sf-layer sf-drift-b" aria-hidden><i className="sf-star sf-twinkle" style={{ width: 2, height: 2, borderRadius: 2, boxShadow: S2 }} /></div>
        <div className="sf-layer sf-drift-c" aria-hidden><i className="sf-star" style={{ width: 3, height: 3, borderRadius: 3, boxShadow: S3 }} /></div>
        <i className="sf-streak" style={{ top: '14%', left: '6%', animationDelay: '1.2s' }} aria-hidden />
        <i className="sf-streak" style={{ top: '46%', left: '-4%', animationDelay: '6.5s', animationDuration: '9s' }} aria-hidden />

        <div className="relative max-w-7xl mx-auto px-5 md:px-12 grid grid-cols-[minmax(0,1fr)] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-10 xl:gap-6 items-center">
          {/* orbit system */}
          <div className="xl:order-2">
            <div className="sf-orbit" role="img" aria-label="Animated orbit system: three rings with satellites circling a red planet">
              <div className="sf-ticks" aria-hidden />
              <div className="sf-cross" aria-hidden />
              <div className="sf-ring" style={{ inset: 0, borderColor: 'rgba(0,255,224,.3)', ['--d' as string]: '64s' }}>
                <span className="sf-sat" style={{ width: 18, height: 18, margin: '-9px 0 0 -9px', background: 'radial-gradient(circle at 32% 30%, #D9BFFF, var(--sf-p) 55%, #2B0066)', boxShadow: '0 0 18px rgba(110,0,255,.8)' }} />
              </div>
              <div className="sf-ring sf-rev" style={{ inset: '13%', borderStyle: 'dashed', borderColor: 'rgba(167,169,190,.4)', ['--d' as string]: '40s' }}>
                <span className="sf-sat" style={{ width: 11, height: 11, margin: '-5.5px 0 0 -5.5px', background: 'var(--sf-c)', boxShadow: '0 0 14px var(--sf-c)' }} />
              </div>
              <div className="sf-ring" style={{ inset: '26%', borderColor: 'rgba(110,0,255,.65)', ['--d' as string]: '23s' }}>
                <span className="sf-sat sf-ship" style={{ width: 16, height: 18, margin: '-9px 0 0 -8px' }} />
              </div>
              <div className="sf-planet">
                <Image src="/work/spaceforge/gallery-1.jpg" alt="" fill priority sizes="(min-width:1024px) 160px, 100px" className="object-cover scale-[1.55]" />
                <span className="sf-shade" />
              </div>
            </div>
          </div>

          {/* copy */}
          <div className="xl:order-1">
            <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] flex flex-wrap items-center gap-x-4 gap-y-2" style={{ color: 'var(--sf-c)' }}>
              <span className="inline-flex items-center gap-2"><span className="sf-dot" aria-hidden /><Clock /></span>
              <span style={{ color: 'var(--sf-dim)' }}>{theme.kicker}</span>
            </p>
            <h1 aria-label={theme.title} className="sf-h sf-title sf-grad mt-5 text-[clamp(3rem,16.5vw,7.4rem)] leading-[0.92]">
              <span className="block" aria-hidden>Space</span><span className="block" aria-hidden>Forge</span>
            </h1>
            <p className="mt-5 text-lg md:text-2xl leading-snug max-w-xl" style={{ color: p.text }}>{theme.subtitle}</p>
            <p className="mt-6 max-w-xl border-l-2 pl-4 text-base md:text-lg italic leading-relaxed" style={{ borderColor: 'var(--sf-p)', color: 'var(--sf-dim)' }}>
              {quotes[0]?.quote}
            </p>
            <nav aria-label="Mission log sections" className="mt-8 flex flex-wrap gap-3">
              {[['#sf-brief', 'Transmissions'], ['#sf-payload', 'Payload'], ['#sf-stack', 'Orbital stack']].map(([h, l], i) => (
                <a key={h} href={h} className="sf-chip inline-flex items-center min-h-11 px-5 rounded-full font-mono text-xs uppercase tracking-[0.16em]" style={i === 0 ? { background: 'linear-gradient(90deg, var(--sf-p), #3B00A8)', color: '#fff', borderColor: 'transparent' } : undefined}>
                  {l} <span aria-hidden className="ml-2">↓</span>
                </a>
              ))}
            </nav>
            <ul className="mt-8 max-w-xl grid grid-cols-3 gap-3 font-mono text-[10.5px] md:text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--sf-dim)' }}>
              {[['Ring 01', 'Starfield', 'var(--sf-pl)'], ['Ring 02', 'Hero scene', 'var(--sf-c)'], ['Ring 03', 'One camera move', '#fff']].map(([a, b, c]) => (
                <li key={a} className="border-t pt-2" style={{ borderColor: c }}>
                  <span className="block" style={{ color: c }}>{a}</span>{b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ T+00:02 TELEMETRY ============ */}
      <div className="sf-dust">
        <section className="relative px-5 md:px-12 py-14 md:py-20 max-w-7xl mx-auto" aria-label="Telemetry">
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
            {theme.bigNumbers.map((n, i) => (
              <li key={n.label} className="sf-rv flex flex-col items-center text-center" style={{ ['--i' as string]: i }}>
                <div className="relative w-[7.5rem] h-[7.5rem] md:w-36 md:h-36">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
                    <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(167,169,190,.22)" strokeWidth="1.5" />
                    <circle className="sf-arc" cx="50" cy="50" r="44" fill="none" stroke={i % 2 ? 'var(--sf-pl)' : 'var(--sf-c)'} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="276.5" strokeDashoffset="276.5" />
                  </svg>
                  <div className={`sf-ring ${i % 2 ? 'sf-rev' : ''}`} style={{ inset: -9, border: 0, ['--d' as string]: `${14 + i * 5}s` }} aria-hidden>
                    <span className="sf-sat" style={{ width: 7, height: 7, margin: '-3.5px 0 0 -3.5px', background: i % 2 ? 'var(--sf-pl)' : 'var(--sf-c)', boxShadow: '0 0 10px currentColor' }} />
                  </div>
                  <div className="absolute inset-0 grid place-items-center sf-num text-[1.6rem] md:text-[2.1rem]">
                    <CountUp to={parseInt(n.value, 10)} />
                  </div>
                </div>
                <p className="mt-4 font-mono text-[11px] md:text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--sf-dim)' }}>{n.label}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ============ T+00:04 TRANSMISSIONS ============ */}
        <section id="sf-brief" className="px-5 md:px-12 py-16 md:py-24 max-w-7xl mx-auto scroll-mt-24">
          <SecHead t="00:04" tag="Transmissions" title="Three lines from the flight deck" sub="The pitch in the head before a line of JSX, and the calls that protected it." />
          <div className="sf-rv grid lg:grid-cols-[17rem_1fr] gap-6 lg:gap-10">
            <div role="tablist" aria-label="Transmissions" className="flex lg:flex-col gap-2">
              {quotes.map((q, i) => (
                <button key={q.kicker} role="tab" id={`sf-tab-${i}`} aria-selected={tab === i} aria-controls="sf-panel" onClick={() => setTab(i)}
                  className="sf-tab flex-1 lg:flex-none text-left min-h-12 px-3 md:px-4 py-3 rounded-xl font-mono text-[11px] md:text-xs uppercase tracking-[0.14em]">
                  <span className="block" style={{ color: tab === i ? 'var(--sf-c)' : 'var(--sf-dim)' }}>0{i + 1}</span>
                  <span className="hidden sm:block mt-1">{q.kicker}</span>
                </button>
              ))}
            </div>
            <div id="sf-panel" role="tabpanel" aria-labelledby={`sf-tab-${tab}`} className="sf-panel relative rounded-3xl p-6 md:p-12 overflow-hidden">
              <div className="sf-ring" style={{ width: 340, height: 340, right: -150, top: -150, borderColor: 'rgba(110,0,255,.35)', ['--d' as string]: '50s' }} aria-hidden />
              <div key={tab} className="sf-swap relative">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--sf-c)' }}>Transmission {String(tab + 1).padStart(2, '0')} / {String(quotes.length).padStart(2, '0')}</p>
                <blockquote className="sf-h mt-5 text-[clamp(1.35rem,4.2vw,2.6rem)] leading-[1.15]">&ldquo;{quotes[tab].quote}&rdquo;</blockquote>
                <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed" style={{ color: 'var(--sf-dim)' }}>{quotes[tab].context}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ T+00:05+ DECISION LOG ============ */}
        <section className="px-5 md:px-12 py-16 md:py-24 max-w-7xl mx-auto">
          <SecHead t="00:05" tag="Flight log" title="Maneuvers kept, fixed and cut" sub="Four calls from the build, each logged the way they happened." />
          <ol className="sf-trail relative pl-8 md:pl-12 max-w-4xl">
            {LOG.map((e) => (
              <li key={e.t} className="sf-rv relative pb-10 last:pb-0">
                <span className="sf-node" aria-hidden />
                <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] flex flex-wrap items-center gap-3">
                  <span style={{ color: 'var(--sf-c)' }}>T+{e.t}</span>
                  <span className="px-2 py-0.5 rounded border" style={{ borderColor: e.tag === 'CUT' ? '#FF8FA3' : 'var(--sf-pl)', color: e.tag === 'CUT' ? '#FF8FA3' : 'var(--sf-pl)' }}>{e.tag}</span>
                </p>
                <h3 className="sf-h mt-3 text-xl md:text-3xl leading-tight">{e.title}</h3>
                <p className="mt-3 text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: 'var(--sf-dim)' }}>{e.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ============ T+00:12 PAYLOAD ============ */}
        <section id="sf-payload" className="px-5 md:px-12 py-16 md:py-24 max-w-7xl mx-auto scroll-mt-24">
          <SecHead t="00:12" tag="Payload" title="Six modules on board" sub="Hover a module and it banks toward you. Touch screens get it flat." />
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6" style={{ perspective: 1200 }}>
            {theme.features.map((f, i) => (
              <li key={f.title} className="sf-rv" style={{ ['--i' as string]: i % 3 }}>
                <Tilt className="sf-card h-full rounded-2xl p-6 md:p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tracking-[0.2em]" style={{ color: 'var(--sf-c)', transform: 'translateZ(30px)' }}>MOD-0{i + 1}</span>
                    <span className="sf-mini" aria-hidden><i style={{ animationDuration: `${6 + i * 2}s` }} /></span>
                  </div>
                  <h3 className="sf-h mt-6 text-xl md:text-2xl leading-tight" style={{ transform: 'translateZ(24px)' }}>{f.title}</h3>
                  <p className="mt-3 text-[15px] md:text-base leading-relaxed" style={{ color: 'var(--sf-dim)' }}>{f.desc}</p>
                </Tilt>
              </li>
            ))}
          </ul>

          {/* title sequence */}
          <div className="sf-rv sf-ts mt-14 md:mt-20 rounded-3xl p-6 md:p-12" style={{ background: 'linear-gradient(135deg, rgba(110,0,255,.16), rgba(0,255,224,.05))', border: '1px solid rgba(167,169,190,.2)' }}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--sf-c)' }}>Title sequence · three voices, one after another</p>
              <button onClick={() => setSeq((s) => s + 1)} className="sf-chip min-h-11 px-5 rounded-full font-mono text-xs uppercase tracking-[0.16em]">Replay ↻</button>
            </div>
            <div key={seq} className="mt-8 space-y-6">
              {VOICES.map((v, i) => (
                <div key={v.face} className="sf-tl" style={{ ['--k' as string]: i }}>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--sf-dim)' }}>{v.face} · {v.job}</p>
                  <p className={`${v.cls} ${v.grad ? 'sf-grad' : ''}`} style={{ fontFamily: v.css }}>{v.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 font-mono text-[10.5px] tracking-wide" style={{ color: 'var(--sf-dim)' }}>Specimen uses stand-in faces on this page.</p>
          </div>
        </section>

        {/* ============ T+00:14 ORBITAL STACK ============ */}
        <section id="sf-stack" className="px-5 md:px-12 py-16 md:py-24 max-w-7xl mx-auto scroll-mt-24">
          <SecHead t="00:14" tag="Orbital stack" title="Four layers, one flight path" sub="Pick a layer. Its ring lights up and the satellite speeds through." />
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-center">
            <div className="sf-rv mx-auto w-full max-w-[26rem]">
              <svg viewBox="0 0 400 400" className="w-full h-auto" role="img" aria-label={`Orbital diagram, ${theme.architecture[layer]?.layer} layer highlighted`}>
                <defs>
                  <radialGradient id="sf-core" cx="35%" cy="30%"><stop offset="0" stopColor="#D9BFFF" /><stop offset="0.55" stopColor="#6E00FF" /><stop offset="1" stopColor="#1A0044" /></radialGradient>
                </defs>
                {theme.architecture.map((a, i) => {
                  const on = i === layer;
                  const r = ringR[i] ?? 180;
                  return (
                    <g key={a.layer}>
                      <circle cx="200" cy="200" r={r} fill="none" stroke={on ? 'var(--sf-c)' : 'rgba(167,169,190,.28)'} strokeWidth={on ? 2.5 : 1} strokeDasharray={on ? undefined : '3 6'} style={{ transition: 'stroke .3s, stroke-width .3s' }} />
                      <g className={`sf-svgspin ${i % 2 ? 'sf-rev' : ''}`} style={{ animationDuration: `${on ? 4 : 18 + i * 6}s` }}>
                        <circle cx="200" cy={200 - r} r={on ? 7 : 4.5} fill={on ? 'var(--sf-c)' : 'var(--sf-pl)'} />
                      </g>
                      <g transform={`translate(${200 + r * 0.7071} ${200 + r * 0.7071})`}>
                        <circle r="11" fill={p.bg} stroke={on ? 'var(--sf-c)' : 'rgba(167,169,190,.5)'} />
                        <text textAnchor="middle" dy="4" fontSize="11" fontFamily="ui-monospace, monospace" fill={on ? 'var(--sf-c)' : 'var(--sf-dim)'}>{i + 1}</text>
                      </g>
                    </g>
                  );
                })}
                <circle cx="200" cy="200" r="34" fill="url(#sf-core)" />
              </svg>
            </div>
            <div className="sf-rv grid gap-3" role="group" aria-label="Architecture layers">
              {theme.architecture.map((a, i) => (
                <button key={a.layer} onClick={() => setLayer(i)} aria-pressed={layer === i} className="sf-layerbtn text-left rounded-2xl p-4 md:p-5 min-h-14">
                  <span className="flex items-center gap-3 font-mono text-[11px] md:text-xs uppercase tracking-[0.18em]" style={{ color: layer === i ? 'var(--sf-c)' : 'var(--sf-dim)' }}>
                    <span aria-hidden>L{i + 1}</span><span className="sf-h text-lg md:text-xl normal-case tracking-normal" style={{ color: p.text }}>{a.layer}</span>
                  </span>
                  <span className="block mt-2 text-[15px] md:text-base leading-relaxed" style={{ color: 'var(--sf-dim)' }}>{a.details}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sf-rv mt-14 sf-marq-wrap" aria-label="Technology on board">
            <div className="sf-marq" aria-hidden>
              {[...STACK_MARQUEE, ...STACK_MARQUEE].map((w, i) => (
                <span key={i} className="font-mono text-sm md:text-base uppercase tracking-[0.18em] px-6 py-3 mx-2 rounded-full border whitespace-nowrap" style={{ borderColor: 'rgba(167,169,190,.25)', color: 'var(--sf-dim)' }}>{w}</span>
              ))}
            </div>
            <p className="sr-only">{STACK_MARQUEE.join(', ')}</p>
          </div>
        </section>

        {/* ============ T+00:16 FLIGHT RECORDER ============ */}
        <section className="px-5 md:px-12 py-16 md:py-24 max-w-7xl mx-auto">
          <SecHead t="00:16" tag="Flight recorder" title="Reference frames" sub="The mood the page was tuned against: dark, committed, a little strange." />
          <div className="flex gap-5 md:gap-6 items-start">
            {DEAL[cols - 1].map((col, ci) => (
              <div key={`${cols}-${ci}`} className="flex-1 min-w-0 flex flex-col gap-5 md:gap-6">
                {col.map((fi) => {
                  const f = FRAMES[fi];
                  return (
                    <figure key={f.src} className="sf-frame rounded-2xl overflow-hidden relative">
                      <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${f.w} / ${f.h}` }}>
                        <Image src={f.src} alt={f.alt} fill loading="lazy" sizes="(min-width:1024px) 400px, (min-width:640px) 50vw, 92vw" className={`object-cover ${f.fit}`} />
                      </div>
                      <figcaption className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] flex justify-between" style={{ background: p.bgMid, color: 'var(--sf-dim)' }}>
                        <span>{f.cap}</span><span aria-hidden>0{fi + 1}/06</span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* ============ T+00:18 TOUCHDOWN ============ */}
        <section className="relative overflow-hidden px-5 md:px-12 pt-20 md:pt-32 pb-24 md:pb-32 text-center">
          <div className="sf-ring" style={{ width: 'min(120vw, 760px)', height: 'min(120vw, 760px)', left: '50%', top: '50%', marginLeft: 'calc(min(120vw, 760px) / -2)', marginTop: 'calc(min(120vw, 760px) / -2)', borderStyle: 'dashed', borderColor: 'rgba(110,0,255,.35)', ['--d' as string]: '90s' }} aria-hidden />
          <div className="sf-ring sf-rev" style={{ width: 'min(86vw, 520px)', height: 'min(86vw, 520px)', left: '50%', top: '50%', marginLeft: 'calc(min(86vw, 520px) / -2)', marginTop: 'calc(min(86vw, 520px) / -2)', borderColor: 'rgba(0,255,224,.22)', ['--d' as string]: '55s' }} aria-hidden>
            <span className="sf-sat" style={{ width: 10, height: 10, margin: '-5px 0 0 -5px', background: 'var(--sf-c)', boxShadow: '0 0 14px var(--sf-c)' }} />
          </div>
          <div className="sf-rv relative max-w-3xl mx-auto">
            <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.22em] inline-flex items-center gap-3" style={{ color: 'var(--sf-c)' }}><span className="sf-dot" aria-hidden />T+00:18 / Touchdown</p>
            <p className="sf-h sf-grad mt-6 text-[clamp(1.9rem,6.6vw,4rem)] leading-[1.08]">{theme.outcomeQuote}</p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--sf-dim)' }}>Mission log closed · reduced-motion safe</p>
          </div>
        </section>
      </div>

      <NextChapter currentSlug={theme.slug} accent={p.accent2} />
      <SiteFooter />
    </main>
  );
}

// ---- styles (prefixed .sf-) ----------------------------------------------------------------------
const CSS = `
.sf-root{font-family:var(--font-inter),Inter,system-ui,sans-serif}
.sf-h{font-family:var(--font-syne),system-ui,sans-serif;font-weight:700;letter-spacing:-.02em}
.sf-title{font-weight:800}
.sf-num{font-family:var(--font-space),system-ui,sans-serif;font-weight:700;letter-spacing:-.02em}
.sf-grad{background:linear-gradient(95deg,#fff 0%,#C9A8FF 38%,var(--sf-c) 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.sf-root :focus-visible{outline:2px solid var(--sf-c);outline-offset:3px}
.sf-dust{background-image:
 radial-gradient(1px 1px at 22px 34px,rgba(232,234,242,.55),transparent),
 radial-gradient(1px 1px at 131px 88px,rgba(232,234,242,.4),transparent),
 radial-gradient(1.5px 1.5px at 214px 172px,rgba(0,255,224,.55),transparent),
 radial-gradient(1px 1px at 73px 231px,rgba(232,234,242,.45),transparent),
 radial-gradient(1.5px 1.5px at 296px 41px,rgba(182,140,255,.6),transparent),
 radial-gradient(1px 1px at 318px 266px,rgba(232,234,242,.4),transparent);
 background-size:340px 300px}

/* starfield */
.sf-layer{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.sf-star{position:absolute;top:0;left:0;display:block;background:transparent}
.sf-drift-a{animation:sf-drift 70s ease-in-out infinite alternate}
.sf-drift-b{animation:sf-drift 52s ease-in-out infinite alternate-reverse}
.sf-drift-c{animation:sf-drift 38s ease-in-out infinite alternate}
.sf-twinkle{animation:sf-tw 5s ease-in-out infinite}
.sf-streak{position:absolute;width:140px;height:1.5px;background:linear-gradient(90deg,transparent,#fff,var(--sf-c));opacity:0;transform:rotate(28deg);animation:sf-streak 11s ease-in infinite;pointer-events:none}
@keyframes sf-drift{from{transform:translate3d(0,0,0)}to{transform:translate3d(-26px,-120px,0)}}
@keyframes sf-tw{0%,100%{opacity:.45}50%{opacity:1}}
@keyframes sf-streak{0%{opacity:0;transform:rotate(28deg) translateX(0)}6%{opacity:1}22%{opacity:0;transform:rotate(28deg) translateX(560px)}100%{opacity:0;transform:rotate(28deg) translateX(560px)}}

/* orbit rings */
.sf-orbit{--sz:min(70vw,280px);position:relative;width:var(--sz);height:var(--sz);margin:0 auto}
@media(min-width:768px){.sf-orbit{--sz:400px}}
@media(min-width:1280px){.sf-orbit{--sz:min(38vw,520px)}}
.sf-ring{position:absolute;border-radius:50%;border:1px solid rgba(167,169,190,.3);animation:sf-spin var(--d,40s) linear infinite}
.sf-rev{animation-direction:reverse}
.sf-sat{position:absolute;left:50%;top:0;display:block;border-radius:50%}
.sf-ship{background:linear-gradient(180deg,#fff,var(--sf-c));clip-path:polygon(50% 0,100% 100%,50% 78%,0 100%)}
.sf-ticks{position:absolute;inset:-6%;border-radius:50%;background:repeating-conic-gradient(rgba(167,169,190,.5) 0 .6deg,transparent .6deg 6deg);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 7px),#000 calc(100% - 6px));mask:radial-gradient(farthest-side,transparent calc(100% - 7px),#000 calc(100% - 6px));animation:sf-spin 140s linear infinite reverse}
.sf-cross{position:absolute;inset:0;background:linear-gradient(rgba(167,169,190,.16),rgba(167,169,190,.16)) center/100% 1px no-repeat,linear-gradient(rgba(167,169,190,.16),rgba(167,169,190,.16)) center/1px 100% no-repeat}
.sf-planet{position:absolute;inset:36%;border-radius:50%;overflow:hidden;box-shadow:0 0 36px rgba(255,150,90,.35),0 0 80px rgba(110,0,255,.4)}
.sf-shade{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 32% 30%,transparent 38%,rgba(5,6,16,.7) 100%)}
.sf-svgspin{transform-box:view-box;transform-origin:50% 50%;animation:sf-spin 18s linear infinite}
@keyframes sf-spin{to{transform:rotate(360deg)}}

/* mission bits */
.sf-dot{width:8px;height:8px;border-radius:50%;background:var(--sf-c);display:inline-block;animation:sf-pulse 2s ease-in-out infinite;flex:none}
@keyframes sf-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:.45}}
.sf-chip{border:1px solid rgba(0,255,224,.4);color:var(--sf-c);transition:transform .2s,background .2s}
.sf-chip:hover{transform:translateY(-2px);background:rgba(0,255,224,.1)}
.sf-arc{transition:stroke-dashoffset 1.6s cubic-bezier(.22,.61,.36,1) .15s}
.in .sf-arc{stroke-dashoffset:0}

/* tabs + panel */
.sf-tab{background:rgba(19,24,42,.8);border:1px solid rgba(167,169,190,.2);color:var(--sf-text);transition:border-color .2s,background .2s}
.sf-tab:hover{border-color:rgba(0,255,224,.5)}
.sf-tab[aria-selected=true]{border-color:var(--sf-c);background:rgba(0,255,224,.08)}
.sf-panel{background:linear-gradient(145deg,var(--sf-mid),rgba(11,15,26,.9));border:1px solid rgba(167,169,190,.2);min-height:16rem}
.sf-swap{animation:sf-rise .6s cubic-bezier(.22,.61,.36,1) both}
@keyframes sf-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}

/* log trail */
.sf-trail:before{content:"";position:absolute;left:7px;top:6px;bottom:6px;width:1.5px;background:linear-gradient(var(--sf-c),var(--sf-p),transparent);opacity:.7}
.sf-node{position:absolute;left:-32px;top:4px;width:16px;height:16px;border-radius:50%;border:2px solid var(--sf-c);background:var(--sf-bg)}
@media(min-width:768px){.sf-node{left:-48px}.sf-trail:before{left:7px}}

/* payload cards */
.sf-tilt{position:relative;transform:perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transform-style:preserve-3d;transition:transform .25s ease-out}
.sf-card{background:linear-gradient(160deg,var(--sf-mid),rgba(11,15,26,.95));border:1px solid rgba(167,169,190,.2);overflow:hidden}
.sf-card:after{content:"";position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .25s;background:radial-gradient(240px circle at var(--mx,50%) var(--my,50%),rgba(0,255,224,.16),transparent 70%)}
.sf-card:hover{border-color:rgba(0,255,224,.55)}
.sf-card:hover:after{opacity:1}
.sf-mini{position:relative;width:34px;height:34px;border-radius:50%;border:1px dashed rgba(167,169,190,.45);display:block}
.sf-mini:before{content:"";position:absolute;inset:12px;border-radius:50%;background:var(--sf-p)}
.sf-mini i{position:absolute;inset:0;border-radius:50%;animation:sf-spin 8s linear infinite}
.sf-mini i:after{content:"";position:absolute;left:50%;top:-3px;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:var(--sf-c)}

/* title sequence */
.sf-tl{opacity:0}
.sf-ts.in .sf-tl{animation:sf-rise .9s cubic-bezier(.22,.61,.36,1) both;animation-delay:calc(var(--k) * .75s + .1s)}

/* stack */
.sf-layerbtn{background:rgba(19,24,42,.7);border:1px solid rgba(167,169,190,.2);transition:border-color .2s,transform .2s,background .2s}
.sf-layerbtn:hover{border-color:rgba(0,255,224,.5);transform:translateX(4px)}
.sf-layerbtn[aria-pressed=true]{border-color:var(--sf-c);background:rgba(0,255,224,.07)}
.sf-marq-wrap{overflow:hidden;-webkit-mask:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.sf-marq{display:flex;width:max-content;animation:sf-marq 38s linear infinite}
.sf-marq-wrap:hover .sf-marq{animation-play-state:paused}
@keyframes sf-marq{to{transform:translateX(-50%)}}

/* gallery */
.sf-frame{border:1px solid rgba(167,169,190,.2);animation:sf-fade .8s ease-out both}
@keyframes sf-fade{from{opacity:0}to{opacity:1}}
.sf-frame img{transition:transform .6s cubic-bezier(.22,.61,.36,1)}
.sf-frame:hover img{transform:scale(1.04)}

/* reveal (only hidden once JS is ready) */
.sf-ready .sf-rv{opacity:0;transform:translateY(26px);transition:opacity .8s cubic-bezier(.22,.61,.36,1),transform .8s cubic-bezier(.22,.61,.36,1);transition-delay:calc(var(--i,0) * .09s)}
.sf-ready .sf-rv.in{opacity:1;transform:none}

@media(prefers-reduced-motion:reduce){
 .sf-root *,.sf-root *:before,.sf-root *:after{animation:none!important;transition:none!important}
 .sf-ready .sf-rv{opacity:1!important;transform:none!important}
 .sf-tl{opacity:1!important}
 .sf-arc{stroke-dashoffset:0!important}
 .sf-tilt{transform:none!important}
 .sf-streak{display:none}
}
`;
