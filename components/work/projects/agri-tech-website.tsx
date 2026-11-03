'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

const SLUG = 'agri-tech-website';
const INK = '#17330F';
const LIME = '#C6F04C';
const CREAM = '#FBF6E6';
const LEAF = '#2F6B1F';
const TOMATO = '#B8350F';

const DM = "var(--font-dmserif), 'DM Serif Display', Georgia, serif";
const MAN = "var(--font-manrope), Manrope, system-ui, sans-serif";

const CSS = `
.agri-root{background:${CREAM};color:${INK};font-family:${MAN};overflow-x:clip}
.agri-root *{box-sizing:border-box}
.agri-h{font-family:${DM};font-weight:400;letter-spacing:-0.01em}
.agri-sticker{border:2.5px solid ${INK};box-shadow:4px 4px 0 ${INK};border-radius:20px}
.agri-rv{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s cubic-bezier(.2,.7,.2,1)}
.agri-rv.agri-in{opacity:1;transform:none}
.agri-wob{transform:rotate(var(--r,0deg));transition:box-shadow .2s ease}
.agri-wob:hover,.agri-wob:focus-within{animation:agri-wobble .6s ease both;box-shadow:6px 6px 0 ${INK}}
@keyframes agri-wobble{0%{transform:rotate(var(--r,0deg))}25%{transform:rotate(calc(var(--r,0deg) - 3deg)) scale(1.02)}55%{transform:rotate(calc(var(--r,0deg) + 2.5deg)) scale(1.02)}100%{transform:rotate(var(--r,0deg)) scale(1)}}
.agri-marq{display:flex;width:max-content;animation:agri-scroll 38s linear infinite}
@keyframes agri-scroll{to{transform:translateX(-50%)}}
.agri-spin{animation:agri-spin 22s linear infinite}
@keyframes agri-spin{to{transform:rotate(360deg)}}
.agri-bob{animation:agri-bob 4s ease-in-out infinite}
@keyframes agri-bob{50%{transform:translateY(-6px) rotate(3deg)}}
.agri-pop{animation:agri-pop .45s cubic-bezier(.2,.8,.3,1.2) both}
@keyframes agri-pop{from{opacity:0;transform:scale(.92) translateY(10px)}to{opacity:1;transform:none}}
.agri-barcode{height:34px;background:repeating-linear-gradient(90deg,${INK} 0 2px,transparent 2px 4px,${INK} 4px 5px,transparent 5px 8px,${INK} 8px 11px,transparent 11px 13px)}
.agri-vine{position:absolute;left:23px;top:28px;bottom:28px;width:3px;transform-origin:top;transform:scaleY(0);transition:transform 1.4s ease .1s;background:repeating-linear-gradient(180deg,${LEAF} 0 8px,transparent 8px 14px)}
.agri-in .agri-vine{transform:scaleY(1)}
.agri-btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 22px;font-weight:800;font-size:15px;border:2.5px solid ${INK};border-radius:999px;box-shadow:3px 3px 0 ${INK};transition:transform .15s ease,box-shadow .15s ease;text-decoration:none}
.agri-btn:hover{transform:translate(-1px,-1px);box-shadow:5px 5px 0 ${INK}}
.agri-btn:active{transform:translate(2px,2px);box-shadow:1px 1px 0 ${INK}}
.agri-root a:focus-visible,.agri-root button:focus-visible{outline:3px solid ${TOMATO};outline-offset:3px}
.agri-tag::before{content:"";position:absolute;left:14px;top:14px;width:14px;height:14px;border-radius:50%;background:${CREAM};border:2.5px solid ${INK}}
@media (prefers-reduced-motion:reduce){
.agri-marq,.agri-spin,.agri-bob,.agri-wob:hover,.agri-wob:focus-within,.agri-pop{animation:none!important}
.agri-rv{opacity:1;transform:none;transition:none}
.agri-vine{transform:scaleY(1);transition:none}
}
`;

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`agri-rv ${seen ? 'agri-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Counter({ value }: { value: number }) {
  const [ref, seen] = useInView<HTMLSpanElement>();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || value === 0) {
      setN(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 700);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value]);
  return <span ref={ref}>{n}</span>;
}

function Pill({ children, bg = LIME, color = INK, style }: { children: ReactNode; bg?: string; color?: string; style?: CSSProperties }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.14em]"
      style={{ background: bg, color, border: `2px solid ${INK}`, ...style }}
    >
      {children}
    </span>
  );
}

const CATS = ['All', 'Storefront', 'Accounts', 'Craft'] as const;
const FEATURE_CAT = ['Storefront', 'Storefront', 'Accounts', 'Accounts', 'Accounts', 'Craft'];

const ROLES = {
  Farmer: {
    table: 'farm_details',
    blurb: 'Farmers sign up with their land, not a delivery slot.',
    fields: ['Farm name', 'Location', 'Farming type'],
    bg: LIME,
  },
  Customer: {
    table: 'customer_details',
    blurb: 'Customers sign up with where the produce should land.',
    fields: ['Delivery address', 'City', 'Pincode'],
    bg: '#FFD9A0',
  },
} as const;

const SHOTS = [
  { src: '/work/agri-tech-website/gallery-1.jpg', label: 'Dew on soil', alt: 'Water droplets resting on dark soil beside green grass blades', r: '-3deg', pos: '50% 50%' },
  { src: '/work/agri-tech-website/gallery-2.jpg', label: 'Fodder harvest', alt: 'A farmer in a green checked turban carrying cut fodder and a sickle', r: '2deg', pos: '30% 30%' },
  { src: '/work/agri-tech-website/gallery-3.jpg', label: 'Red apples', alt: 'Glossy red apples covered in water droplets', r: '-2.5deg', pos: '50% 50%' },
  { src: '/work/agri-tech-website/gallery-4.jpg', label: 'Carrot bunches', alt: 'Bunches of fresh carrots with green tops', r: '2.5deg', pos: '50% 50%' },
  { src: '/work/agri-tech-website/gallery-5.jpg', label: 'Beetroot', alt: 'Freshly pulled beetroots on soil with leaves', r: '-2deg', pos: '50% 50%' },
  { src: '/work/agri-tech-website/gallery-6.jpg', label: 'Brinjal harvest', alt: 'A smiling woman in a red sari holding fresh brinjals in a green field', r: '3deg', pos: '88% 30%' },
];

export default function Page({ theme }: { theme: ProjectTheme }) {
  const [cat, setCat] = useState<(typeof CATS)[number]>('All');
  const [role, setRole] = useState<keyof typeof ROLES>('Farmer');
  const [archRef, archSeen] = useInView<HTMLOListElement>();

  const features = theme.features.map((f, i) => ({ ...f, cat: FEATURE_CAT[i] ?? 'Craft', n: i + 1 }));
  const shown = features.filter((f) => cat === 'All' || f.cat === cat);
  const roleData = ROLES[role];
  const navWords = ['Services', 'Products', 'Farmers', 'About', 'Contact'];

  return (
    <div className="agri-root">
      <style>{CSS}</style>

      {/* ---------------- HERO ---------------- */}
      <header className="relative px-4 pt-24 pb-14 md:px-10 md:pt-36 md:pb-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-14">
          <div>
            <Pill bg="#fff">{theme.kicker}</Pill>
            <h1
              className="agri-h mt-5 text-[clamp(3.6rem,15vw,8.5rem)] leading-[0.9]"
              style={{ color: INK }}
            >
              {theme.title}
            </h1>
            <p className="mt-5 max-w-md text-lg font-semibold leading-snug md:text-xl" style={{ color: '#2B4A1E' }}>
              <span className="rounded-md px-1.5 py-0.5" style={{ background: LIME, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>
                {theme.subtitle}
              </span>
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="agri-sticker agri-wob px-4 py-2 text-lg font-extrabold" style={{ ['--r' as string]: '-3deg', background: LIME }}>
                Grow Smarter
              </div>
              <div className="agri-sticker agri-wob px-4 py-2 text-lg font-extrabold" style={{ ['--r' as string]: '2.5deg', background: LEAF, color: CREAM }}>
                Grow Greener
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#story" className="agri-btn" style={{ background: INK, color: CREAM }}>
                Read the story
              </a>
              <a href="#stack" className="agri-btn" style={{ background: '#fff', color: INK }}>
                See the stack
              </a>
            </div>
          </div>

          {/* label card */}
          <div className="relative mx-auto w-full max-w-md md:max-w-none">
            <div className="agri-sticker agri-wob relative overflow-hidden bg-white p-4 pb-5" style={{ ['--r' as string]: '1.5deg' }}>
              <div className="flex items-center justify-between gap-3">
                <p className="agri-h text-2xl leading-none">Farm Direct</p>
              </div>
              <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-xl border-2" style={{ borderColor: INK }}>
                <Image
                  src={theme.heroImage}
                  alt="A hand-shaped landscape of green forest holding a young sprout, held in an open palm above terraced fields"
                  fill
                  priority
                  sizes="(min-width: 768px) 460px, 90vw"
                  className="object-cover"
                />
              </div>
              <dl className="mt-4 divide-y-2 divide-dotted text-sm font-bold" style={{ borderColor: INK }}>
                {[
                  ['Packed with', 'HTML · CSS · JS'],
                  ['Pages', '8'],
                  ['Frameworks', '0'],
                  ['Database', 'MySQL'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-3 py-1.5" style={{ borderColor: `${INK}66` }}>
                    <dt className="text-[12px] font-extrabold uppercase tracking-[0.12em]" style={{ color: '#4A5B3F' }}>{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-3 flex items-end justify-between gap-4">
                <div className="agri-barcode w-32" aria-hidden />
                <p className="text-right text-[11px] font-extrabold uppercase leading-tight tracking-[0.12em]" style={{ color: TOMATO }}>
                  Best read
                  <br />
                  before shopping
                </p>
              </div>
            </div>
            {/* round stamp */}
            <div
              className="agri-bob absolute -right-1 -top-6 grid h-24 w-24 place-items-center rounded-full md:-right-5 md:h-28 md:w-28"
              style={{ background: LIME, border: `2.5px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}` }}
              aria-hidden
            >
              <svg viewBox="0 0 100 100" className="agri-spin absolute inset-0 h-full w-full">
                <defs>
                  <path id="agri-circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text fontSize="12" fontWeight="800" letterSpacing="1.2" fill={INK} fontFamily="Manrope, sans-serif">
                  <textPath href="#agri-circ">FARM-FRESH · FARM-FRESH ·</textPath>
                </text>
              </svg>
              <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21v-9" />
                <path d="M12 12C12 7 8 5 4 5c0 4 2 7 8 7Z" />
                <path d="M12 14c0-4 3-6 8-6 0 4-2 6-8 6Z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------- MARQUEE ---------------- */}
      <div aria-hidden className="overflow-hidden border-y-[3px] py-3" style={{ background: INK, borderColor: INK }}>
        <div className="agri-marq">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {[...navWords, ...navWords].map((w, i) => (
                <span key={`${k}-${i}`} className="agri-h flex items-center whitespace-nowrap text-3xl md:text-4xl" style={{ color: i % 2 ? LIME : CREAM }}>
                  <span className="px-5">{w}</span>
                  <span style={{ color: '#FFB347' }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- STORY ---------------- */}
      <section id="story" className="px-4 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Pill bg={LIME}>The rule of the house</Pill>
            <h2 className="agri-h mt-4 max-w-2xl text-4xl leading-[1.02] md:text-6xl">A homepage that reads before it sells.</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-7">
            {theme.story.quotes.map((q, i) => {
              const bgs = ['#fff', LIME, '#FFE7B8'];
              const rot = ['-1.5deg', '1.2deg', '-1deg'];
              return (
                <Reveal key={q.kicker} delay={i * 120}>
                  <figure className="agri-sticker agri-wob relative h-full p-6" style={{ background: bgs[i % 3], ['--r' as string]: rot[i % 3] }}>
                    <span className="agri-h absolute -top-5 left-4 text-7xl leading-none" style={{ color: LEAF }} aria-hidden>“</span>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.16em]" style={{ color: '#3B4F2F' }}>{q.kicker}</p>
                    <blockquote className="agri-h mt-3 text-[1.45rem] leading-[1.2]">{q.quote}</blockquote>
                    <figcaption className="mt-4 border-t-2 border-dashed pt-3 text-sm font-semibold leading-snug" style={{ borderColor: INK, color: '#33472A' }}>
                      {q.context}
                    </figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- FEATURES: PRICE TAGS ---------------- */}
      <section className="px-4 py-16 md:px-10 md:py-24" style={{ background: LIME, borderTop: `3px solid ${INK}`, borderBottom: `3px solid ${INK}` }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="agri-h text-4xl leading-[1.02] md:text-6xl">On the shelf</h2>
            <p className="mt-3 max-w-xl text-base font-semibold md:text-lg" style={{ color: '#233F17' }}>
              Every feature, priced like produce. Filter the shelf the way the catalogue does.
            </p>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter features">
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={cat === c}
                onClick={() => setCat(c)}
                className="min-h-[44px] rounded-full px-5 text-sm font-extrabold transition-transform hover:-translate-y-0.5"
                style={{
                  border: `2.5px solid ${INK}`,
                  background: cat === c ? INK : '#fff',
                  color: cat === c ? LIME : INK,
                  boxShadow: cat === c ? 'none' : `3px 3px 0 ${INK}`,
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((f, i) => (
              <li key={f.title} className="agri-pop" style={{ animationDelay: `${i * 60}ms` }}>
                <article
                  className="agri-sticker agri-wob agri-tag relative h-full bg-white pb-5 pl-6 pr-5 pt-12"
                  style={{ ['--r' as string]: `${i % 2 ? 1 : -1}deg` }}
                >
                  <span className="absolute left-12 top-[20px] h-[3px] w-10 rounded" style={{ background: INK }} aria-hidden />
                  <span
                    className="absolute right-4 top-3 rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em]"
                    style={{ background: i % 2 ? '#FFD9A0' : LIME, border: `2px solid ${INK}` }}
                  >
                    {f.cat}
                  </span>
                  <p className="font-mono text-[12px] font-bold" style={{ color: TOMATO }}>PLU-{String(f.n).padStart(2, '0')}</p>
                  <h3 className="agri-h mt-1 text-2xl leading-tight">{f.title}</h3>
                  <p className="mt-2 text-[15px] font-medium leading-relaxed" style={{ color: '#33472A' }}>{f.desc}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- ROLES ---------------- */}
      <section className="px-4 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-6xl items-start gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <Pill bg="#fff">One users table, two roles</Pill>
            <h2 className="agri-h mt-4 text-4xl leading-[1.02] md:text-6xl">Pick your side of the stall.</h2>
            <p className="mt-4 max-w-md text-base font-medium leading-relaxed md:text-lg" style={{ color: '#33472A' }}>
              Sign-up branches by role, and each role writes to its own profile table. Shop Now and Join as Farmer share the same space, as equals.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="agri-sticker bg-white p-4 md:p-6">
              <div className="grid grid-cols-2 gap-2 rounded-full p-1.5" style={{ background: CREAM, border: `2.5px solid ${INK}` }} role="group" aria-label="Choose a role">
                {(Object.keys(ROLES) as (keyof typeof ROLES)[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={role === r}
                    onClick={() => setRole(r)}
                    className="min-h-[44px] rounded-full text-sm font-extrabold transition-colors"
                    style={{ background: role === r ? INK : 'transparent', color: role === r ? LIME : INK }}
                  >
                    I’m a {r}
                  </button>
                ))}
              </div>
              <div key={role} className="agri-pop mt-5 rounded-2xl p-5" style={{ background: roleData.bg, border: `2.5px solid ${INK}` }}>
                <p className="font-mono text-sm font-bold" style={{ color: TOMATO }}>→ {roleData.table}</p>
                <p className="agri-h mt-1 text-2xl leading-tight">{roleData.blurb}</p>
                <ul className="mt-4 grid gap-2.5">
                  {roleData.fields.map((fl, i) => (
                    <li key={fl} className="flex min-h-[44px] items-center justify-between gap-3 rounded-xl bg-white px-4 text-[15px] font-bold" style={{ border: `2px solid ${INK}` }}>
                      <span>{fl}</span>
                      <span className="font-mono text-[11px]" style={{ color: '#4A5B3F' }}>field {i + 1}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- ARCHITECTURE ---------------- */}
      <section id="stack" className="px-4 pb-16 md:px-10 md:pb-24">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h2 className="agri-h text-4xl leading-[1.02] md:text-6xl">From soil to storefront</h2>
            <p className="mt-3 text-base font-medium md:text-lg" style={{ color: '#33472A' }}>The supply chain of the code, top to bottom.</p>
          </Reveal>
          <ol ref={archRef} className={`relative mt-10 grid gap-5 ${archSeen ? 'agri-in' : ''}`}>
            <span className="agri-vine" aria-hidden />
            {theme.architecture.map((a, i) => (
              <li key={a.layer} className="relative pl-14 md:pl-16">
                <span
                  className="agri-h absolute left-0 top-3 grid h-12 w-12 place-items-center rounded-full text-xl"
                  style={{ background: i % 2 ? '#FFD9A0' : LIME, border: `2.5px solid ${INK}`, boxShadow: `2px 2px 0 ${INK}` }}
                >
                  {i + 1}
                </span>
                <div className="agri-sticker agri-wob bg-white p-5" style={{ ['--r' as string]: `${i % 2 ? 0.6 : -0.6}deg` }}>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: TOMATO }}>Layer {String(i + 1).padStart(2, '0')}</p>
                  <h3 className="agri-h mt-0.5 text-2xl md:text-3xl">{a.layer}</h3>
                  <p className="mt-1.5 text-[15px] font-medium leading-relaxed md:text-base" style={{ color: '#33472A' }}>{a.details}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- GALLERY ---------------- */}
      <section className="px-4 py-16 md:px-10 md:py-24" style={{ background: '#EFE6C8', borderTop: `3px solid ${INK}` }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="agri-h text-4xl leading-[1.02] md:text-6xl">Fresh from the crate</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-7">
            {SHOTS.map((s, i) => (
              <Reveal key={s.src} delay={i * 90}>
                <figure className="agri-sticker agri-wob relative bg-white p-2 pb-3" style={{ ['--r' as string]: s.r }}>
                  <span className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rounded-sm" style={{ background: LIME, border: `2px solid ${INK}`, transform: 'translateX(-50%) rotate(-4deg)' }} aria-hidden />
                  <div className="relative aspect-square overflow-hidden rounded-xl">
                    <Image src={s.src} alt={s.alt} fill loading="lazy" sizes="(min-width: 768px) 380px, 45vw" className="object-cover" style={{ objectPosition: s.pos }} />
                  </div>
                  <figcaption className="agri-h mt-2.5 text-center text-lg leading-tight">{s.label}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- BIG NUMBERS ---------------- */}
      <section className="px-4 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="agri-h text-4xl leading-[1.02] md:text-6xl">The price list</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {theme.bigNumbers.map((b, i) => (
              <Reveal key={b.label} delay={i * 90}>
                <div
                  className="agri-sticker agri-wob relative flex h-full flex-col items-center justify-center px-3 py-7 text-center"
                  style={{ background: [LIME, '#fff', '#FFD9A0', LEAF][i % 4], color: i % 4 === 3 ? CREAM : INK, ['--r' as string]: `${i % 2 ? 1.5 : -1.5}deg` }}
                >
                  <span className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full" style={{ background: CREAM, border: `2px solid ${INK}` }} aria-hidden />
                  <p className="agri-h mt-2 text-6xl leading-none md:text-7xl">
                    <Counter value={Number.parseInt(b.value, 10) || 0} />
                    {/^\d+$/.test(b.value) ? '' : b.value.replace(/^\d+/, '')}
                  </p>
                  <p className="mt-2 text-[12px] font-extrabold uppercase tracking-[0.14em]">{b.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- OUTCOME ---------------- */}
      <section className="px-4 pb-24 md:px-10 md:pb-28">
        <Reveal className="mx-auto max-w-4xl">
          <div className="agri-sticker relative p-8 text-center md:p-14" style={{ background: INK, color: CREAM, boxShadow: `6px 6px 0 ${LIME}` }}>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.2em]" style={{ color: LIME }}>The verdict</p>
            <p className="agri-h mt-4 text-4xl leading-[1.1] md:text-6xl">“{theme.outcomeQuote}”</p>
          </div>
        </Reveal>
      </section>

      <div style={{ background: INK, color: CREAM }}>
        <NextChapter currentSlug={SLUG} accent={LIME} />
      </div>
      <div style={{ background: '#0A0A0A', paddingBottom: '3.5rem' }}>
        <SiteFooter />
      </div>
    </div>
  );
}
