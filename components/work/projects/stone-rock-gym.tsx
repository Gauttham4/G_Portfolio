'use client';

// Stone Rock Gym: IRON microsite. Charcoal + molten orange, slashed section cuts, a door-lock
// + fingerprint hero that toggles unpaid/paid, barbell-plate stats, rubber-mat texture.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

const BEBAS = "var(--font-bebas), 'Bebas Neue', Impact, 'Arial Narrow', sans-serif";
const OSW = "var(--font-oswald), Oswald, 'Arial Narrow', Impact, sans-serif";

const MARQUEE = ['ONE FOLDER', 'NO INTERNET', 'NO INSTALL', 'NO DATABASE SERVER', 'ON A PEN DRIVE', '3,700+ MEMBERS', 'UNPAID? THE DOOR SAYS NO'];
const FLOW = [
  { k: 'DESK PC', s: 'SQLite, the source of truth' },
  { k: 'OUTBOX', s: 'A trigger writes every change' },
  { k: 'POLLER', s: 'Mirrors it cheaply' },
  { k: 'FIRESTORE', s: 'Free tier cloud' },
  { k: "OWNER'S PHONE", s: 'Marks paid, ~5 s back' },
];
const PLATE_COLORS = ['#E5532D', '#F2B84B', '#D9D2C7', '#7C8794'];

const css = `
.srg-root{--cut:clamp(18px,3.6vw,56px);--o:#E5532D;--g:#F2B84B;--ink:#121110;--mid:#1d1a18;--tx:#F5EFE8;--dim:#B7A99A;position:relative;background:var(--ink);color:var(--tx);overflow-x:clip;font-family:var(--font-inter),Inter,system-ui,sans-serif}
.srg-mat{background-image:radial-gradient(circle at center,rgba(255,255,255,.07) 1.2px,transparent 1.9px),radial-gradient(circle at center,rgba(0,0,0,.4) 3px,transparent 3.6px);background-size:12px 12px;background-position:0 0,6px 6px}
.srg-hazard{background-image:repeating-linear-gradient(-45deg,var(--g) 0 14px,var(--ink) 14px 28px)}
.srg-stroke-text{-webkit-text-stroke:2px var(--tx);color:transparent}
.srg-rise{animation:srg-rise .8s cubic-bezier(.2,.7,.2,1) both;animation-delay:var(--d,0ms)}
@keyframes srg-rise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
.srg-marq{display:flex;width:max-content;animation:srg-marq 34s linear infinite}
@keyframes srg-marq{to{transform:translateX(-50%)}}
.srg-lock{color:var(--o);cursor:pointer;display:block;width:100%;background:none;border:0;padding:0;border-radius:16px}
.srg-lock.is-open{color:var(--g)}
.srg-lock:focus-visible,.srg-btn:focus-visible,.srg-tab:focus-visible{outline:3px solid var(--g);outline-offset:4px}
.srg-frame{stroke:currentColor;transition:stroke .4s}
.srg-shackle{transform-box:fill-box;transform-origin:0% 100%;transition:transform .55s cubic-bezier(.3,1.5,.5,1)}
.srg-lock.is-open .srg-shackle{transform:translateY(-18px) rotate(-34deg)}
.srg-arc{stroke-dasharray:1;stroke-dashoffset:0}
.srg-lock.is-locked .srg-arc{animation:srg-draw-a .9s ease both}
.srg-lock.is-open .srg-arc{animation:srg-draw-b .9s ease both}
@keyframes srg-draw-a{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes srg-draw-b{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
.srg-scan{animation:srg-scan 2.2s ease-in-out infinite alternate}
.srg-lock.is-open .srg-scan{animation:none;opacity:0}
@keyframes srg-scan{from{transform:translateY(0)}to{transform:translateY(62px)}}
.srg-led{animation:srg-led 1.2s ease-in-out infinite}
.srg-lock.is-open .srg-led{animation:none}
@keyframes srg-led{50%{opacity:.25}}
.srg-btn{min-height:44px;min-width:44px;cursor:pointer;transition:transform .2s,background-color .2s,color .2s}
.srg-btn:hover{transform:translateY(-2px)}
.srg-plate{position:relative;aspect-ratio:1;border-radius:50%;background:repeating-conic-gradient(from 0deg,var(--pc) 0 5deg,color-mix(in srgb,var(--pc) 70%,#000) 5deg 10deg);transition:transform .6s cubic-bezier(.3,1.3,.5,1)}
.srg-plate:hover{transform:rotate(40deg)}
.srg-plate-in{position:absolute;inset:12%;border-radius:50%;background:#151311;display:grid;place-items:center;box-shadow:0 0 0 4px var(--pc),inset 0 0 0 2px rgba(255,255,255,.06)}
.srg-card{position:relative;background:var(--mid);clip-path:polygon(0 0,calc(100% - 26px) 0,100% 26px,100% 100%,0 100%);transition:transform .25s}
.srg-card::before{content:"";position:absolute;left:0;top:0;bottom:0;width:5px;background:var(--o);transition:background-color .25s,width .25s}
.srg-card:hover{transform:translateY(-4px)}
.srg-card:hover::before{background:var(--g);width:9px}
.srg-wire{position:relative;flex:none;width:3px;height:30px;margin:0 auto;background:#3a332d;overflow:hidden}
.srg-wire i{position:absolute;inset:0;background:var(--o);transform-origin:top;animation:srg-chY 2.4s ease-in-out infinite;animation-delay:var(--d,0ms)}
@keyframes srg-chY{0%{transform:scaleY(0);opacity:1}60%{transform:scaleY(1);opacity:1}100%{transform:scaleY(1);opacity:0}}
@keyframes srg-chX{0%{transform:scaleX(0);opacity:1}60%{transform:scaleX(1);opacity:1}100%{transform:scaleX(1);opacity:0}}
@media (min-width:1024px){.srg-wire{width:auto;height:3px;margin:0;flex:1;min-width:28px;align-self:center}.srg-wire i{transform-origin:left;animation-name:srg-chX}}
.srg-tab{min-height:48px;cursor:pointer;transition:background-color .2s,color .2s}
.srg-rack-line{transform-origin:top;transition:transform 1.1s cubic-bezier(.2,.7,.2,1)}
@media (prefers-reduced-motion:reduce){
.srg-root *{animation:none !important;transition:none !important}
.srg-marq{transform:none}
}
`;

function Reveal({ children, delay = 0, className = '', style }: { children: ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} style={style}>{children}</div>;
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Slab({ z, bg, mat, first, last, children, label, dark, tight }: { z: number; bg: string; mat?: boolean; first?: boolean; last?: boolean; children: ReactNode; label: string; dark?: boolean; tight?: boolean }) {
  return (
    <section
      aria-label={label}
      className={`relative ${mat ? 'srg-mat' : ''} ${first ? 'pt-24 md:pt-36' : ''}`}
      style={{
        zIndex: z,
        backgroundColor: bg,
        color: dark ? '#121110' : undefined,
        marginTop: first ? 0 : 'calc(var(--cut) * -1)',
        paddingTop: first ? undefined : tight ? 'calc(var(--cut) + 1.25rem)' : 'calc(var(--cut) + clamp(3rem,7vw,5.5rem))',
        paddingBottom: last ? 'clamp(6rem,9vw,8rem)' : tight ? 'calc(var(--cut) + 1.25rem)' : 'calc(var(--cut) + clamp(3rem,7vw,5rem))',
        clipPath: last ? undefined : 'polygon(0 0,100% 0,100% calc(100% - var(--cut)),0 100%)',
      }}
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8">{children}</div>
    </section>
  );
}

function Eyebrow({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.28em] mb-3" style={{ color: color ?? 'var(--o)' }}>
      {children}
    </p>
  );
}

function H2({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <h2 className="uppercase leading-[0.92] mb-8 md:mb-12" style={{ fontFamily: BEBAS, fontSize: 'clamp(2.75rem,8vw,5.5rem)', color }}>
      {children}
    </h2>
  );
}

function DoorLock({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const arcs = [10, 18, 26, 34, 42];
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={open}
      aria-label={open ? 'Door unlocked, member paid. Activate to mark unpaid.' : 'Door locked, member unpaid. Activate to mark paid.'}
      className={`srg-lock ${open ? 'is-open' : 'is-locked'}`}
    >
      <svg viewBox="0 0 320 400" className="block w-full h-auto" aria-hidden="true">
        <rect className="srg-frame" x="14" y="14" width="292" height="372" rx="10" fill="#1a1715" strokeWidth="4" />
        <rect x="34" y="34" width="252" height="332" rx="4" fill="none" stroke="#2e2924" strokeWidth="2" strokeDasharray="6 8" />
        {[[26, 26], [294, 26], [26, 374], [294, 374]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" fill="#3a332d" />
        ))}
        <g className="srg-shackle">
          <path d="M126 112 V84 a34 34 0 0 1 68 0 V112" fill="none" stroke="#B7A99A" strokeWidth="12" strokeLinecap="round" />
        </g>
        <rect x="108" y="108" width="104" height="78" rx="10" fill="currentColor" />
        <circle cx="160" cy="140" r="9" fill="#121110" />
        <rect x="155" y="144" width="10" height="24" rx="3" fill="#121110" />
        <rect x="92" y="206" width="136" height="164" rx="16" fill="#0e0d0c" stroke="#3a332d" strokeWidth="3" />
        <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none">
          {arcs.map((r, i) => (
            <path key={r} className="srg-arc" pathLength={1} style={{ animationDelay: `${i * 90}ms` }} d={`M${160 - r} 300 V278 A${r} ${r} 0 0 1 ${160 + r} 278 V300`} />
          ))}
        </g>
        <rect className="srg-scan" x="108" y="234" width="104" height="4" rx="2" fill="currentColor" />
        <circle className="srg-led" cx="160" cy="342" r="7" fill="currentColor" />
      </svg>
    </button>
  );
}

function useCountUp(target: number, reduce: boolean | null) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(target);
  useEffect(() => {
    const el = ref.current;
    if (reduce || target === 0 || !el) return;
    let raf = 0;
    setN(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1100);
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, reduce]);
  return [ref, n] as const;
}

function Plate({ value, label, color, index }: { value: string; label: string; color: string; index: number }) {
  const reduce = useReducedMotion();
  const m = value.match(/^(~?)([\d,]+)(.*)$/);
  const prefix = m ? m[1] : '';
  const target = m ? parseInt(m[2].replace(/,/g, ''), 10) : 0;
  const suffix = m ? m[3] : value;
  const [ref, n] = useCountUp(target, reduce);
  return (
    <Reveal delay={index * 0.08} className="flex flex-col items-center text-center">
      <div className="srg-plate w-full max-w-[210px]" style={{ ['--pc' as string]: color }}>
        <div className="srg-plate-in">
          <span ref={ref} className="leading-none" style={{ fontFamily: BEBAS, fontSize: 'clamp(2.1rem,7vw,3.6rem)', color: '#F5EFE8' }}>
            {prefix}{m ? n.toLocaleString('en-US') : ''}{suffix}
          </span>
        </div>
      </div>
      <p className="mt-4 uppercase tracking-wide text-base md:text-lg" style={{ fontFamily: OSW, color: 'var(--dim)' }}>{label}</p>
    </Reveal>
  );
}

export default function Page({ theme }: { theme: ProjectTheme }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const slug = theme.slug;
  const pal = theme.palette;
  const gallery = theme.gallery && theme.gallery.length
    ? theme.gallery
    : ['THE DESK', 'THE DOOR', 'THE VAULT', 'THE PHONE', 'THE SYNC', 'THE MOVE'].map((caption, i) => ({ src: `/work/${slug}/gallery-${i + 1}.jpg`, caption, alt: `${caption} slide` }));
  const rootVars = { ['--o' as string]: pal.accent, ['--g' as string]: pal.accent2 ?? '#F2B84B', ['--ink' as string]: pal.bg, ['--mid' as string]: pal.bgMid, ['--tx' as string]: pal.text, ['--dim' as string]: pal.dim } as CSSProperties;
  const go = (d: number) => setIdx((i) => (i + d + gallery.length) % gallery.length);

  return (
    <main className="srg-root" style={rootVars}>
      <style>{css}</style>

      {/* HERO */}
      <Slab z={60} bg="var(--ink)" mat first label="Stone Rock Gym hero">
        <div className="grid gap-12 xl:grid-cols-[1.15fr_0.85fr] xl:items-center min-h-[calc(88svh-9rem)]">
          <div className="min-w-0">
            <p className="srg-rise font-mono text-xs uppercase tracking-[0.28em] mb-4" style={{ color: 'var(--o)', ['--d' as string]: '0ms' }}>
              {theme.kicker} / Member desk + fingerprint door
            </p>
            <h1 className="uppercase leading-[0.86] srg-rise" style={{ fontFamily: BEBAS, fontSize: 'clamp(4rem,19vw,8.5rem)', ['--d' as string]: '80ms' }}>
              Stone Rock
              <span className="block" style={{ color: 'var(--o)' }}>Gym<span style={{ color: 'var(--g)' }}>.</span></span>
            </h1>
            <p className="srg-rise mt-6 max-w-xl text-lg md:text-xl leading-snug" style={{ color: 'var(--dim)', ['--d' as string]: '220ms' }}>
              {theme.subtitle}
            </p>
            <div className="srg-rise mt-8 flex items-center gap-4" style={{ ['--d' as string]: '340ms' }}>
              <div className="relative w-[200px] md:w-[240px] aspect-[16/10] overflow-hidden" style={{ transform: 'rotate(-3deg)', border: '3px solid var(--g)', borderRadius: 8, background: 'var(--mid)' }}>
                <Image src={theme.heroImage} alt="Stone Rock Gym membership card: run a gym from one folder" fill priority sizes="240px" className="object-cover" />
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] max-w-[11rem]" style={{ color: 'var(--dim)' }}>
                Desk + door + phone, one folder
              </p>
            </div>
          </div>

          <div className="srg-rise mx-auto w-full max-w-[340px] xl:max-w-[380px]" style={{ ['--d' as string]: '300ms' }}>
            <DoorLock open={open} onToggle={() => setOpen((o) => !o)} />
            <div role="group" aria-label="Member fee status" className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setOpen(false)} aria-pressed={!open} className="srg-btn uppercase tracking-wider text-base" style={{ fontFamily: OSW, background: !open ? 'var(--o)' : 'var(--mid)', color: !open ? '#121110' : 'var(--tx)', border: '2px solid var(--o)' }}>
                Unpaid
              </button>
              <button type="button" onClick={() => setOpen(true)} aria-pressed={open} className="srg-btn uppercase tracking-wider text-base" style={{ fontFamily: OSW, background: open ? 'var(--g)' : 'var(--mid)', color: open ? '#121110' : 'var(--tx)', border: '2px solid var(--g)' }}>
                Paid
              </button>
            </div>
            <div aria-live="polite" className="mt-4 p-4" style={{ background: 'var(--mid)', borderLeft: `5px solid ${open ? 'var(--g)' : 'var(--o)'}` }}>
              <p className="uppercase text-2xl leading-none" style={{ fontFamily: BEBAS, color: open ? 'var(--g)' : 'var(--o)' }}>
                {open ? 'Paid: let in again' : 'Fees pending: refused'}
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--dim)' }}>
                {open
                  ? 'The moment they pay, the fingerprint is written straight back to the terminal.'
                  : 'Refusing deletes the fingerprint from the terminal. The vault and the cloud still hold a copy.'}
              </p>
            </div>
          </div>
        </div>
      </Slab>

      {/* MARQUEE */}
      <Slab z={50} bg="var(--o)" dark tight label="Key facts ticker">
        <div className="-mx-4 md:-mx-8 overflow-hidden" aria-hidden="true">
          <div className="srg-marq">
            {[0, 1].map((g) => (
              <div key={g} className="flex shrink-0 items-center">
                {MARQUEE.map((t) => (
                  <span key={`${g}-${t}`} className="flex items-center whitespace-nowrap uppercase" style={{ fontFamily: BEBAS, fontSize: 'clamp(1.75rem,4vw,2.75rem)' }}>
                    <span className="px-6">{t}</span>
                    <span className="inline-block h-3 w-3 rotate-45" style={{ background: '#121110' }} />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="sr-only">{MARQUEE.join('. ')}.</p>
      </Slab>

      {/* PLATES */}
      <Slab z={40} bg="var(--mid)" mat label="By the numbers">
        <Reveal><Eyebrow>Loaded on the bar</Eyebrow><H2>By the numbers</H2></Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-8">
          {theme.bigNumbers.map((b, i) => (
            <Plate key={b.label} value={b.value} label={b.label} color={PLATE_COLORS[i % PLATE_COLORS.length]} index={i} />
          ))}
        </div>
      </Slab>

      {/* QUOTES */}
      <Slab z={30} bg="var(--o)" dark label="House rules">
        <Reveal><Eyebrow color="#121110">The house rules</Eyebrow><H2>Three rules, no exceptions</H2></Reveal>
        <div className="flex flex-col">
          {theme.story.quotes.map((q, i) => (
            <Reveal key={q.kicker} delay={0.05} className="grid gap-3 py-8 md:grid-cols-[9rem_1fr] md:gap-8" style={{ borderTop: '4px solid #121110' }}>
              <div>
                <span className="block leading-none" style={{ fontFamily: BEBAS, fontSize: 'clamp(4rem,10vw,7rem)', WebkitTextStroke: '2px #121110', color: 'transparent' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.2em]">{q.kicker}</span>
              </div>
              <div>
                <blockquote className="uppercase leading-[1.05] font-semibold" style={{ fontFamily: OSW, fontSize: 'clamp(1.5rem,3.6vw,2.6rem)' }}>
                  {q.quote}
                </blockquote>
                <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: '#2a1408' }}>{q.context}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Slab>

      {/* FEATURES */}
      <Slab z={20} bg="var(--ink)" mat label="Features">
        <Reveal><Eyebrow>The workout board</Eyebrow><H2>What it lifts</H2></Reveal>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {theme.features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.07}>
              <article className="srg-card h-full p-6 pl-8">
                <p className="font-mono text-xs uppercase tracking-[0.24em] mb-3" style={{ color: 'var(--g)' }}>
                  Set {String(i + 1).padStart(2, '0')} / {String(theme.features.length).padStart(2, '0')}
                </p>
                <h3 className="uppercase leading-tight mb-3" style={{ fontFamily: OSW, fontSize: 'clamp(1.35rem,2.4vw,1.75rem)', fontWeight: 600 }}>{f.title}</h3>
                <p className="text-base leading-relaxed" style={{ color: 'var(--dim)' }}>{f.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Slab>

      {/* ARCHITECTURE */}
      <Slab z={10} bg="var(--mid)" mat label="Architecture">
        <Reveal><Eyebrow>The rack</Eyebrow><H2>Four plates, one bar</H2></Reveal>
        <div className="relative">
          <ArchRack items={theme.architecture} />
        </div>
        <Reveal className="mt-14">
          <h3 className="uppercase mb-5" style={{ fontFamily: OSW, fontSize: '1.5rem', fontWeight: 600 }}>The data route</h3>
          <ol className="flex flex-col lg:flex-row lg:items-stretch max-w-xl lg:max-w-none list-none p-0 m-0">
            {FLOW.map((n, i) => (
              <li key={n.k} className="contents">
                <div className="p-4 lg:flex-1 lg:min-w-0" style={{ background: 'var(--ink)', border: '2px solid #3a332d', borderTop: `4px solid ${i === 0 ? 'var(--g)' : 'var(--o)'}` }}>
                  <p className="uppercase leading-none mb-1 text-2xl" style={{ fontFamily: BEBAS }}>{n.k}</p>
                  <p className="text-sm leading-snug" style={{ color: 'var(--dim)' }}>{n.s}</p>
                </div>
                {i < FLOW.length - 1 && <span className="srg-wire" aria-hidden="true" style={{ ['--d' as string]: `${i * 380}ms` }}><i /></span>}
              </li>
            ))}
          </ol>
        </Reveal>
      </Slab>

      {/* GALLERY */}
      <Slab z={5} bg="var(--ink)" mat label="Slides">
        <Reveal><Eyebrow>The walkthrough</Eyebrow><H2>Six slides, one system</H2></Reveal>
        <Reveal>
          <div className="relative aspect-[16/10] w-full overflow-hidden" style={{ border: '4px solid var(--o)', background: 'var(--mid)', borderRadius: 6 }}>
            {gallery.map((g, i) => (
              <Image key={g.src} src={g.src} alt={i === idx ? g.alt : ''} aria-hidden={i !== idx} fill sizes="(min-width:1152px) 1100px, 100vw" loading="lazy" className="object-cover transition-opacity duration-300" style={{ opacity: i === idx ? 1 : 0 }} />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="uppercase text-xl md:text-2xl" style={{ fontFamily: OSW, fontWeight: 600 }} aria-live="polite">
              <span style={{ color: 'var(--o)' }}>{String(idx + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}</span> {gallery[idx].caption}
            </p>
            <div className="flex gap-2 shrink-0">
              <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="srg-btn text-xl" style={{ background: 'var(--mid)', border: '2px solid var(--o)', color: 'var(--tx)' }}>&larr;</button>
              <button type="button" onClick={() => go(1)} aria-label="Next slide" className="srg-btn text-xl" style={{ background: 'var(--o)', border: '2px solid var(--o)', color: '#121110' }}>&rarr;</button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" role="group" aria-label="Choose a slide">
            {gallery.map((g, i) => (
              <button key={g.caption} type="button" onClick={() => setIdx(i)} aria-pressed={i === idx} className="srg-tab px-3 text-left uppercase tracking-wide text-sm" style={{ fontFamily: OSW, background: i === idx ? 'var(--g)' : 'var(--mid)', color: i === idx ? '#121110' : 'var(--tx)', border: '2px solid #3a332d' }}>
                <span className="font-mono text-xs mr-2" style={{ color: i === idx ? '#121110' : 'var(--o)' }}>{String(i + 1).padStart(2, '0')}</span>{g.caption}
              </button>
            ))}
          </div>
        </Reveal>
      </Slab>

      {/* OUTCOME */}
      <Slab z={2} bg="var(--g)" dark last label="Outcome">
        <Reveal>
          <svg viewBox="0 0 400 40" className="mb-8 w-full max-w-md h-10" aria-hidden="true" fill="none" stroke="#121110" strokeWidth="5" strokeLinecap="round">
            <path d="M40 20 H360" />
            {[[28, 8, 24], [14, 2, 36], [372, 8, 24], [386, 2, 36]].map(([x, y, h]) => (
              <rect key={x} x={x - 4} y={y} width="8" height={h} rx="2" fill="#121110" stroke="none" />
            ))}
          </svg>
          <Eyebrow color="#121110">The outcome</Eyebrow>
          <blockquote className="uppercase leading-[0.95]" style={{ fontFamily: BEBAS, fontSize: 'clamp(2.75rem,9vw,6.5rem)' }}>
            {theme.outcomeQuote}
          </blockquote>
        </Reveal>
      </Slab>

      <NextChapter currentSlug={slug} accent={pal.accent} />
      <SiteFooter />
    </main>
  );
}

function ArchRack({ items }: { items: { layer: string; details: string }[] }) {
  return (
    <div className="relative">
      <span className="absolute left-[26px] top-2 bottom-2 w-1" style={{ background: '#3a332d' }} aria-hidden="true" />
      <ol className="flex flex-col gap-4 list-none p-0 m-0">
        {items.map((a, i) => (
          <li key={a.layer}>
            <Reveal delay={i * 0.08}>
              <div className="grid grid-cols-[56px_1fr] gap-4 sm:gap-6 items-center">
                <div className="flex justify-center" aria-hidden="true">
                  <span className="srg-plate block" style={{ width: 56, ['--pc' as string]: PLATE_COLORS[i % PLATE_COLORS.length] }}>
                    <span className="srg-plate-in" style={{ boxShadow: '0 0 0 2px var(--pc)' }}>
                      <span className="block h-2.5 w-2.5 rounded-full" style={{ background: 'var(--mid)' }} />
                    </span>
                  </span>
                </div>
                <div className="p-5" style={{ background: 'var(--ink)', border: '2px solid #3a332d' }}>
                  <h3 className="uppercase leading-none mb-2" style={{ fontFamily: BEBAS, fontSize: 'clamp(1.9rem,4vw,2.6rem)', color: 'var(--g)' }}>{a.layer}</h3>
                  <p className="text-base leading-relaxed" style={{ color: 'var(--tx)' }}>{a.details}</p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
