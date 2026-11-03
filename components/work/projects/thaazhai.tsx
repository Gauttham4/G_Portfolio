'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

// Deterministic torn-paper edge, built once at module load.
function tornEdge(n: number, amp: number, bottom: boolean) {
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const y = ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
    const px = (y * amp).toFixed(1);
    pts.push(`${((i / n) * 100).toFixed(2)}% ${bottom ? `calc(100% - ${px}px)` : `${px}px`}`);
  }
  return bottom ? `polygon(0 0, 100% 0, ${pts.reverse().join(', ')})` : `polygon(0 100%, ${pts.join(', ')}, 100% 100%)`;
}
const TORN_TOP = tornEdge(48, 12, false);
const TORN_BOTTOM = tornEdge(26, 9, true);

function useOnce(ref: RefObject<HTMLElement | null>, fn: () => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      fn();
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          fn();
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useOnce(ref, () => ref.current?.setAttribute('data-in', '1'));
  return (
    <div ref={ref} className={`thz-rv ${className}`} style={{ '--d': `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  useOnce(ref, () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(to);
      return;
    }
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1100);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  return <span ref={ref}>{v}</span>;
}

/* Hand-drawn vine divider that draws itself when it enters the viewport */
function Vine() {
  const leaves = [
    'M92 30 C80 14 66 12 58 18 C64 32 80 38 92 30Z',
    'M228 30 C240 46 256 48 264 42 C258 28 242 22 228 30Z',
    'M362 30 C350 14 336 12 328 18 C334 32 350 38 362 30Z',
    'M498 30 C510 46 526 48 534 42 C528 28 512 22 498 30Z',
  ];
  return (
    <Reveal className="thz-draw my-10 md:my-14">
      <svg viewBox="0 0 600 64" className="mx-auto block h-auto w-full max-w-[560px]" aria-hidden="true" focusable="false">
        <path
          className="dp"
          pathLength={1}
          d="M4 32 C60 8 110 56 170 32 S280 8 340 32 S450 56 520 32 S580 22 596 32"
          fill="none"
          stroke="#3F6B2F"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {leaves.map((d, i) => (
          <path key={i} className="lf" style={{ transitionDelay: `${0.6 + i * 0.25}s` }} d={d} fill={i % 2 ? '#6E8F4E' : '#3F6B2F'} />
        ))}
      </svg>
    </Reveal>
  );
}

function Entry({ n, title, note }: { n: string; title: string; note: string }) {
  return (
    <Reveal className="mb-8 md:mb-10">
      <p className="thz-cv text-2xl" style={{ color: 'var(--rust)' }}>
        Entry {n}
      </p>
      <h2 className="thz-pf mt-1 text-[clamp(1.9rem,6vw,3.25rem)] font-bold leading-[1.08]" style={{ color: 'var(--ink)' }}>
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-base leading-relaxed" style={{ color: 'var(--ink2)' }}>
        {note}
      </p>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Hero sprout                                                         */
/* ------------------------------------------------------------------ */

function Sprout() {
  const roots = [
    'M200 420 C196 444 176 456 150 478',
    'M200 420 C204 446 226 458 252 480',
    'M200 420 C200 450 194 470 196 494',
    'M176 446 C164 450 152 448 138 440',
    'M228 452 C242 450 254 444 266 434',
  ];
  return (
    <svg viewBox="0 0 400 500" role="img" aria-label="A green sprout growing out of dark soil at sunrise" className="block h-auto w-full">
      <circle className="thz-sun" cx="296" cy="168" r="88" fill="#E2A93B" opacity="0.14" />
      <circle className="thz-sun" cx="296" cy="168" r="52" fill="#E2A93B" opacity="0.26" />
      <path d="M0 500 C70 478 130 422 200 418 C270 422 330 478 400 500Z" fill="#4A3420" />
      <g fill="none" stroke="#C9A05C" strokeWidth="2.5" strokeLinecap="round" opacity="0.65">
        {roots.map((d, i) => (
          <path key={i} className="thz-root" pathLength={1} d={d} style={{ animationDelay: `${1.2 + i * 0.25}s` }} />
        ))}
      </g>
      <ellipse className="thz-seed" cx="200" cy="446" rx="11" ry="7" fill="#9A6B3A" />
      <path className="thz-stem" pathLength={1} d="M200 420 C200 352 190 282 204 202 C208 172 202 152 198 128" fill="none" stroke="#9CAF88" strokeWidth="7" strokeLinecap="round" />
      {/* lower left leaf */}
      <g className="thz-sway thz-o-br" style={{ animationDelay: '3s' }}>
        <g className="thz-pop thz-o-br" style={{ animationDelay: '1.1s' }}>
          <path d="M199 290 C148 282 98 240 76 176 C138 176 188 218 199 290Z" fill="#6E8F4E" />
          <path d="M196 284 C160 250 122 214 92 184" fill="none" stroke="#2F5224" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
      {/* right leaf */}
      <g className="thz-sway thz-o-bl" style={{ animationDelay: '3.4s' }}>
        <g className="thz-pop thz-o-bl" style={{ animationDelay: '1.5s' }}>
          <path d="M205 236 C254 228 304 190 330 128 C266 128 214 168 205 236Z" fill="#9CAF88" />
          <path d="M208 230 C246 196 282 160 312 136" fill="none" stroke="#3F6B2F" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
      {/* top pair */}
      <g className="thz-sway thz-o-br" style={{ animationDelay: '3.8s' }}>
        <g className="thz-pop thz-o-br" style={{ animationDelay: '1.9s' }}>
          <path d="M197 130 C168 114 156 84 164 56 C188 64 204 96 197 130Z" fill="#7FA05A" />
        </g>
      </g>
      <g className="thz-sway thz-o-bl" style={{ animationDelay: '4.2s' }}>
        <g className="thz-pop thz-o-bl" style={{ animationDelay: '2.1s' }}>
          <path d="M197 130 C228 114 242 86 238 58 C212 64 196 96 197 130Z" fill="#E2A93B" />
        </g>
      </g>
      {[
        [110, 330, 0],
        [300, 300, 1.4],
        [70, 250, 2.6],
        [340, 220, 0.8],
        [250, 360, 2],
      ].map(([x, y, d], i) => (
        <circle key={i} className="thz-pollen" cx={x} cy={y} r="3" fill="#E2A93B" style={{ animationDelay: `${d}s` }} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Interactive bits                                                    */
/* ------------------------------------------------------------------ */

const ROLES = [
  {
    key: 'customer',
    label: 'Customer',
    lines: ['Browses produce by category', 'Requests a farm visit', 'Leaves a star rating after delivery'],
    note: 'buys onions on Wednesday',
  },
  {
    key: 'farmer',
    label: 'Farmer',
    lines: [
      'Lists what is in the field: quantity, unit, organic flag',
      'Product CRUD on a dedicated dashboard',
      'Visit-request inbox and a notifications panel',
    ],
    note: 'sells brinjal on Monday',
  },
  {
    key: 'admin',
    label: 'Admin',
    lines: ['Curates the categories', 'Moderates reviews', 'Steps in when content is reported'],
    note: 'keeps the marketplace honest',
  },
];

function Roles() {
  const [i, setI] = useState(1);
  const r = ROLES[i];
  return (
    <div className="rounded-sm border p-4 md:p-6" style={{ background: 'var(--card)', borderColor: '#D9C7A0' }}>
      <h3 className="thz-pf text-2xl font-bold" style={{ color: 'var(--ink)' }}>
        One table, three hats
      </h3>
      <p className="mt-1 text-sm" style={{ color: 'var(--ink2)' }}>
        <code className="font-mono">users.user_type</code> is an enum. Pick a role.
      </p>
      <div role="tablist" aria-label="User roles" className="mt-4 grid grid-cols-3 gap-2">
        {ROLES.map((x, k) => (
          <button
            key={x.key}
            role="tab"
            id={`thz-tab-${x.key}`}
            aria-selected={k === i}
            aria-controls="thz-role-panel"
            onClick={() => setI(k)}
            className="thz-tab min-h-11 rounded-sm px-2 text-base font-semibold"
          >
            {x.label}
          </button>
        ))}
      </div>
      <div key={r.key} id="thz-role-panel" role="tabpanel" aria-labelledby={`thz-tab-${r.key}`} className="thz-swap mt-4">
        <p className="font-mono text-sm" style={{ color: 'var(--leaf)' }}>
          user_type = &apos;{r.key}&apos;
        </p>
        <ul className="mt-3 space-y-2">
          {r.lines.map((l) => (
            <li key={l} className="flex gap-2 text-base leading-snug" style={{ color: 'var(--ink)' }}>
              <span aria-hidden="true" style={{ color: 'var(--leaf)' }}>
                &#10022;
              </span>
              {l}
            </li>
          ))}
        </ul>
        <p className="thz-cv mt-4 text-2xl leading-tight" style={{ color: 'var(--rust)' }}>
          &ldquo;…{r.note}.&rdquo;
        </p>
      </div>
    </div>
  );
}

const STEPS = [
  { k: 'Request', who: 'Buyer', t: 'Picks a date and time, and how many are coming.' },
  { k: 'Confirm', who: 'Farmer', t: 'Confirms or rejects the visit, with an optional message.' },
  { k: 'Complete', who: 'Farmer', t: 'Marks the visit as completed once the buyer has been.' },
  { k: 'Review', who: 'Buyer', t: 'Leaves a 1-to-5 rating, enforced by a CHECK constraint.' },
];

function VisitFlow() {
  const [s, setS] = useState(0);
  return (
    <div className="rounded-sm border p-4 md:p-6" style={{ background: 'var(--card)', borderColor: '#D9C7A0' }}>
      <h3 className="thz-pf text-2xl font-bold" style={{ color: 'var(--ink)' }}>
        A farm visit, step by step
      </h3>
      <div className="relative mt-5">
        <div className="absolute left-[12.5%] right-[12.5%] top-[19px] h-[3px] rounded" style={{ background: '#D9C7A0' }} aria-hidden="true" />
        <div
          className="thz-prog absolute left-[12.5%] top-[19px] h-[3px] w-[75%] rounded"
          style={{ background: 'var(--leaf)', transform: `scaleX(${s / 3})` }}
          aria-hidden="true"
        />
        <ol className="relative grid grid-cols-4 gap-1">
          {STEPS.map((x, k) => (
            <li key={x.k}>
              <button
                onClick={() => setS(k)}
                aria-current={k === s ? 'step' : undefined}
                className="thz-step flex min-h-11 w-full flex-col items-center gap-2 text-sm font-semibold"
                data-on={k <= s ? '1' : '0'}
              >
                <span className="thz-dot grid h-10 w-10 place-items-center rounded-full border-2 font-mono text-sm">{k + 1}</span>
                {x.k}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div key={s} className="thz-swap mt-5 min-h-[5.5rem]" aria-live="polite">
        <p className="thz-cv text-2xl" style={{ color: 'var(--rust)' }}>
          {STEPS[s].who} →
        </p>
        <p className="mt-1 text-base leading-snug" style={{ color: 'var(--ink)' }}>
          {STEPS[s].t}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const TABLES = ['users', 'farmer_details', 'categories', 'products', 'farm_visits', 'notifications', 'reviews'];
const STRATA = [
  { bg: '#8FA672', fg: '#1F160C', sub: '#33401F' },
  { bg: '#8A5E34', fg: '#FAF4E8', sub: '#F0D9AE' },
  { bg: '#6B4526', fg: '#FAF4E8', sub: '#EBCF9C' },
  { bg: '#4A3018', fg: '#FAF4E8', sub: '#E6C88F' },
];
const GALLERY = [
  { src: '/work/thaazhai/gallery-4.jpg', alt: 'A hand holding a small green sprout growing from a handful of soil', cap: 'soil to sprout', pos: '55% 50%', rot: -2.2 },
  { src: '/work/thaazhai/gallery-6.jpg', alt: 'A bright green leaf lit from behind', cap: 'one leaf, pressed', pos: '50% 50%', rot: 1.6 },
  { src: '/work/thaazhai/gallery-1.jpg', alt: 'The Thaazhai logo: a gold circular emblem of two farmers and a wheat stalk on black', cap: 'the mark', pos: '50% 50%', rot: -1.2 },
];

export default function Page({ theme }: { theme: ProjectTheme }) {
  const { quotes } = theme.story;
  const tilt = [-1.4, 1.1, -0.8];

  return (
    <div className="thz font-sans">
      <style>{`
        .thz{--soil:#2C1F12;--soil2:#4A3420;--paper:#F4EAD3;--card:#FBF4E2;--ink:#2B1E12;--ink2:#5E4429;--leaf:#3F6B2F;--rust:#8A3B1E;background:var(--soil);color:#FAF4E8;overflow-x:clip}
        .thz-pf{font-family:var(--font-playfair),'Playfair Display',Georgia,serif}
        .thz-cv{font-family:var(--font-caveat),'Segoe Script','Comic Sans MS',cursive;font-weight:600}
        .thz :focus-visible{outline:3px solid #E2A93B;outline-offset:2px;box-shadow:0 0 0 5px #2B1E12}
        .thz-page{--m:1.1rem;background-color:var(--paper);color:var(--ink);background-image:linear-gradient(90deg,transparent calc(var(--m) - 1px),rgba(184,64,44,.4) calc(var(--m) - 1px),rgba(184,64,44,.4) calc(var(--m) + 1px),transparent calc(var(--m) + 1px)),repeating-linear-gradient(180deg,transparent 0 31px,rgba(86,120,84,.22) 31px 32px)}
        @media(min-width:768px){.thz-page{--m:2.75rem}}
        @media(min-width:1280px){.thz-page{--m:3.5rem;padding-left:7rem !important}}
        /* hero load animations */
        .thz-stem{stroke-dasharray:1;stroke-dashoffset:1;animation:thz-draw 2.2s cubic-bezier(.5,.1,.2,1) .5s forwards}
        .thz-root{stroke-dasharray:1;stroke-dashoffset:1;animation:thz-draw 1.4s ease-out forwards}
        .thz-pop{transform-box:fill-box;transform:scale(0);animation:thz-pop 1s cubic-bezier(.3,1.4,.5,1) forwards}
        .thz-sway{transform-box:fill-box;animation:thz-sway 5s ease-in-out infinite alternate}
        .thz-o-br{transform-origin:100% 100%}.thz-o-bl{transform-origin:0% 100%}
        .thz-sun{animation:thz-sun 3s ease-out both}
        .thz-seed{animation:thz-seed 1s ease-in .4s forwards}
        .thz-pollen{opacity:0;animation:thz-float 6s ease-in-out infinite}
        .thz-rise{opacity:0;transform:translateY(22px);animation:thz-rise .9s cubic-bezier(.2,.7,.2,1) forwards;animation-delay:var(--d,0s)}
        .thz-band-track{display:flex;width:max-content;animation:thz-marq 48s linear infinite}
        @keyframes thz-draw{to{stroke-dashoffset:0}}
        @keyframes thz-pop{to{transform:scale(1)}}
        @keyframes thz-sway{from{transform:rotate(-2.2deg)}to{transform:rotate(2.2deg)}}
        @keyframes thz-sun{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
        @keyframes thz-seed{to{opacity:0;transform:scale(.4)}}
        @keyframes thz-float{0%{opacity:0;transform:translateY(0)}30%{opacity:.8}100%{opacity:0;transform:translateY(-46px)}}
        @keyframes thz-rise{to{opacity:1;transform:none}}
        @keyframes thz-marq{to{transform:translateX(-50%)}}
        @keyframes thz-swap{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        /* scroll reveals */
        .thz-rv{opacity:0;transform:translateY(22px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.7,.2,1);transition-delay:var(--d,0ms)}
        .thz-rv[data-in='1']{opacity:1;transform:none}
        .thz-draw .dp{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.8s ease-in-out}
        .thz-draw[data-in='1'] .dp{stroke-dashoffset:0}
        .thz-draw .lf{transform-box:fill-box;transform-origin:50% 100%;transform:scale(0);transition:transform .7s cubic-bezier(.3,1.4,.5,1)}
        .thz-draw[data-in='1'] .lf{transform:scale(1)}
        .thz-bar{transform:scaleX(0);transform-origin:left;transition:transform 1.3s cubic-bezier(.3,.7,.2,1) .2s}
        [data-in='1'] .thz-bar{transform:scaleX(1)}
        .thz-chk{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .9s ease .9s}
        [data-in='1'] .thz-chk{stroke-dashoffset:0}
        /* micro-interactions */
        .thz-swap{animation:thz-swap .35s ease both}
        .thz-tab{background:#EFE2C2;color:var(--ink);border:2px solid transparent;cursor:pointer;transition:background .2s,color .2s}
        .thz-tab:hover{background:#E4D2A6}
        .thz-tab[aria-selected='true']{background:var(--leaf);color:#FBF4E2}
        .thz-prog{transform-origin:left;transition:transform .45s ease}
        .thz-step{color:var(--ink2);cursor:pointer}
        .thz-step[data-on='1']{color:var(--ink)}
        .thz-dot{background:var(--card);border-color:#C9B58B;transition:background .3s,border-color .3s,color .3s,transform .2s}
        .thz-step[data-on='1'] .thz-dot{background:var(--leaf);border-color:var(--leaf);color:#FBF4E2}
        .thz-step:hover .thz-dot{transform:translateY(-3px)}
        .thz-feat{position:relative;overflow:hidden;transition:transform .25s ease,box-shadow .25s ease}
        .thz-feat::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--leaf);transform:scaleY(0);transform-origin:bottom;transition:transform .35s ease}
        .thz-feat:hover{transform:translateY(-3px);box-shadow:0 10px 18px -12px rgba(43,30,18,.55)}
        .thz-feat:hover::before{transform:scaleY(1)}
        .thz-layer{transition:transform .25s ease}
        .thz-layer:hover{transform:translateX(6px)}
        .thz-polaroid{transition:transform .35s ease}
        .thz-polaroid:hover{transform:rotate(0deg) translateY(-6px) !important}
        .thz-tag{transition:transform .2s ease,background .2s}
        .thz-tag:hover{transform:translateY(-2px);background:rgba(226,169,59,.22)}
        @media(prefers-reduced-motion:reduce){
          .thz *,.thz *::before,.thz *::after{animation:none !important;transition:none !important}
          .thz-stem,.thz-root,.thz-draw .dp,.thz-chk{stroke-dashoffset:0 !important}
          .thz-pop,.thz-draw .lf,.thz-bar{transform:none !important}
          .thz-rise,.thz-rv{opacity:1 !important;transform:none !important}
          .thz-seed,.thz-pollen{opacity:0}
          .thz-band-track{transform:none}
        }
      `}</style>

      <main>
        {/* ============================ HERO ============================ */}
        <header className="relative overflow-hidden pt-24 md:pt-36" style={{ background: 'radial-gradient(120% 70% at 78% 40%, #5A3F22 0%, #3D2D1B 45%, #2C1F12 100%)' }}>
          <div className="mx-auto grid max-w-6xl items-end gap-4 px-5 md:grid-cols-[1.1fr_1fr] md:gap-10 md:px-10">
            <div className="pb-2 md:pb-24">
              <p className="thz-rise font-mono text-xs uppercase tracking-[0.2em] md:text-sm" style={{ color: '#C9A05C', ['--d' as string]: '.1s' } as CSSProperties}>
                {theme.kicker}
              </p>
              <h1
                className="thz-pf thz-rise mt-3 text-[clamp(3.1rem,15vw,8.75rem)] font-black md:text-[clamp(4rem,10vw,8.75rem)] leading-[0.9] tracking-tight"
                style={{ color: '#FAF4E8', ['--d' as string]: '.25s' } as CSSProperties}
              >
                {theme.title}
              </h1>
              <p className="thz-rise mt-5 max-w-md text-lg leading-snug md:text-2xl" style={{ color: '#EADFC8', ['--d' as string]: '.45s' } as CSSProperties}>
                {theme.subtitle}
              </p>
              <div className="hidden md:block">
              <ul className="thz-rise mt-5 flex flex-wrap gap-2" style={{ ['--d' as string]: '.65s' } as CSSProperties}>
                {['Farmers', 'Buyers', 'Agri-experts'].map((t) => (
                  <li key={t} className="thz-tag rounded-full border px-4 py-2 text-sm font-semibold" style={{ borderColor: '#C9A05C', color: '#F0DDB0' }}>
                    {t}
                  </li>
                ))}
              </ul>
              <p className="thz-cv thz-rise mt-6 max-w-sm text-2xl leading-tight" style={{ color: '#E2A93B', ['--d' as string]: '.85s' } as CSSProperties}>
                thaazhai (n.) the screw-pine, woven into market baskets &mdash; a plant that doesn&rsquo;t look like much until it carries weight.
              </p>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[340px] md:max-w-[520px]">
              <Sprout />
            </div>
          </div>
          {/* soil band with the schema scrolling past like strata */}
          <div className="relative overflow-hidden border-t-2 py-3" style={{ background: 'linear-gradient(#4A3420,#3A2916)', borderColor: '#6B4A28' }} aria-hidden="true">
            <div className="thz-band-track font-mono text-sm" style={{ color: '#D9B472' }}>
              {[0, 1].map((k) => (
                <div key={k} className="flex shrink-0">
                  {TABLES.map((t) => (
                    <span key={t + k} className="px-5">
                      {t} <span style={{ color: '#9CAF88' }}>&#10022;</span>
                    </span>
                  ))}
                  {TABLES.map((t) => (
                    <span key={t + k + 'b'} className="px-5">
                      {t} <span style={{ color: '#9CAF88' }}>&#10022;</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ============================ LEDGER PAGE ============================ */}
        <div className="mx-auto max-w-[1100px]">
          <div className="h-4" style={{ background: 'var(--paper)', clipPath: TORN_TOP }} aria-hidden="true" />
          <div className="thz-page pb-24 pl-9 pr-4 pt-10 md:pl-[4.5rem] md:pr-12 md:pt-16">
            {/* ---- Entry 01 ---- */}
            <p className="thz-cv mb-8 text-2xl leading-tight md:hidden" style={{ color: 'var(--rust)' }}>
              thaazhai (n.) the screw-pine, woven into market baskets &mdash; a plant that doesn&rsquo;t look like much until it carries weight.
            </p>
            <section>
              <Entry n="01" title="Twenty paise of every rupee" note={theme.story.quotes[0].context} />
              <Reveal>
                <p className="thz-cv text-2xl" style={{ color: 'var(--ink2)' }}>
                  of every ₹1 the buyer pays…
                </p>
                <div className="mt-2 flex h-12 overflow-hidden rounded-sm border-2" style={{ borderColor: 'var(--ink)' }}>
                  <div className="relative flex items-center justify-center font-mono text-sm font-bold" style={{ width: '20%', color: '#FBF4E2' }}>
                    <span className="thz-bar absolute inset-0" style={{ background: '#3F6B2F' }} />
                    <span className="relative">~20p</span>
                  </div>
                  <div className="relative flex items-center justify-center px-2 text-center font-mono text-sm leading-tight" style={{ width: '80%', color: '#2B1E12' }}>
                    <span className="thz-bar absolute inset-0" style={{ background: '#C9A874', transitionDelay: '.5s' }} />
                    <span className="relative">~80p stays along the chain</span>
                  </div>
                </div>
                <p className="thz-cv mt-2 text-2xl" style={{ color: 'var(--leaf)' }}>
                  &uarr; that thin green sliver is the farmer
                </p>
              </Reveal>

              <div className="mt-10 grid gap-8 md:grid-cols-2">
                <Reveal>
                  <div className="rounded-sm border p-4" style={{ background: 'var(--card)', borderColor: '#D9C7A0' }}>
                    <div className="thz-cv flex justify-between text-2xl" style={{ color: 'var(--ink2)' }}>
                      <span>field</span>
                      <span>plate</span>
                    </div>
                    <svg viewBox="0 0 600 70" className="block h-auto w-full" role="img" aria-label="A tomato changes hands four to six times between field and plate">
                      <g className="thz-draw" data-in="1">
                        <path d="M16 35 H584" stroke="#8A3B1E" strokeWidth="3" strokeDasharray="6 7" fill="none" />
                      </g>
                      <circle cx="16" cy="35" r="11" fill="#3F6B2F" />
                      <circle cx="584" cy="35" r="11" fill="#8A3B1E" />
                      {[110, 190, 270, 350].map((x) => (
                        <rect key={x} x={x - 12} y="23" width="24" height="24" rx="3" fill="#2B1E12" />
                      ))}
                      {[430, 510].map((x) => (
                        <rect key={x} x={x - 12} y="23" width="24" height="24" rx="3" fill="none" stroke="#2B1E12" strokeWidth="2.5" strokeDasharray="5 4" />
                      ))}
                    </svg>
                    <p className="mt-2 text-base" style={{ color: 'var(--ink)' }}>
                      <strong>Before:</strong> four to six hands between the field and the dinner plate.
                    </p>
                  </div>
                </Reveal>
                <Reveal delay={150}>
                  <div className="rounded-sm border p-4" style={{ background: 'var(--card)', borderColor: '#D9C7A0' }}>
                    <div className="thz-cv flex justify-between text-2xl" style={{ color: 'var(--ink2)' }}>
                      <span>farmer</span>
                      <span>buyer</span>
                    </div>
                    <svg viewBox="0 0 600 70" className="block h-auto w-full" role="img" aria-label="Farmer, agri-expert and buyer connected directly">
                      <g className="thz-draw" data-in="1">
                        <path d="M16 35 H584" stroke="#3F6B2F" strokeWidth="4" strokeLinecap="round" fill="none" />
                      </g>
                      <circle cx="16" cy="35" r="11" fill="#3F6B2F" />
                      <circle cx="300" cy="35" r="11" fill="#E2A93B" stroke="#2B1E12" strokeWidth="2" />
                      <circle cx="584" cy="35" r="11" fill="#8A3B1E" />
                    </svg>
                    <p className="mt-2 text-base" style={{ color: 'var(--ink)' }}>
                      <strong>With Thaazhai:</strong> farmer, buyer and visiting agri-expert in one web app.
                    </p>
                  </div>
                </Reveal>
              </div>
            </section>

            <Vine />

            {/* ---- Entry 02: torn notes ---- */}
            <section>
              <Entry n="02" title="Notes torn from the notebook" note="Three lines from the story behind the product, pinned in the order they were written." />
              <div className="grid gap-8 lg:grid-cols-3 lg:items-start lg:gap-6">
                {quotes.map((q, i) => (
                  <Reveal key={q.kicker} delay={i * 140} className={i === 1 ? 'lg:mt-12' : i === 2 ? 'lg:mt-4' : ''}>
                    <figure className={`relative ${i === 1 ? 'ml-3 lg:ml-0' : 'mr-3 lg:mr-0'}`} style={{ transform: `rotate(${tilt[i]}deg)` }}>
                      <span
                        aria-hidden="true"
                        className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-4deg]"
                        style={{ background: 'rgba(226,169,59,.7)' }}
                      />
                      <div className="px-5 pb-3 pt-7" style={{ background: '#FFF8E4', boxShadow: '0 8px 14px -10px rgba(43,30,18,.6)' }}>
                        <p className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--ink2)' }}>
                          {q.kicker}
                        </p>
                        <blockquote className="thz-pf mt-3 text-xl italic leading-snug" style={{ color: 'var(--ink)' }}>
                          &ldquo;{q.quote}&rdquo;
                        </blockquote>
                        <figcaption className="thz-cv mt-4 text-2xl leading-tight" style={{ color: 'var(--rust)' }}>
                          {q.context}
                        </figcaption>
                      </div>
                      <div className="h-3" style={{ background: '#FFF8E4', clipPath: TORN_BOTTOM }} aria-hidden="true" />
                    </figure>
                  </Reveal>
                ))}
              </div>
            </section>

            <Vine />

            {/* ---- Entry 03: totals ---- */}
            <section>
              <Entry n="03" title="Totals at the foot of the page" note="Accountants draw a double line under the final figure. So does this notebook." />
              <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
                {theme.bigNumbers.map((b, i) => (
                  <Reveal key={b.label} delay={i * 120}>
                    <div className="relative border-b-[6px] pb-2" style={{ borderBottomStyle: 'double', borderColor: 'var(--ink)' }}>
                      <p className="thz-pf text-[clamp(3.4rem,13vw,5.5rem)] font-black leading-none" style={{ color: i % 2 ? 'var(--rust)' : 'var(--leaf)' }}>
                        <Count to={parseInt(b.value, 10) || 0} />
                      </p>
                      {i === theme.bigNumbers.length - 1 && (
                        <svg viewBox="0 0 60 50" className="absolute right-0 top-1 h-10 w-10 md:h-12 md:w-12" aria-hidden="true">
                          <path className="thz-chk" pathLength={1} d="M6 28 L22 43 L54 6" fill="none" stroke="#8A3B1E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <p className="thz-cv mt-2 text-2xl leading-tight" style={{ color: 'var(--ink2)' }}>
                      {b.label}
                    </p>
                  </Reveal>
                ))}
              </div>
            </section>

            <Vine />

            {/* ---- Entry 04: features ---- */}
            <section>
              <Entry n="04" title="What the farmer can write down now" note="Every feature below is wired end to end in the MVP." />
              <ol className="grid gap-4 md:grid-cols-2">
                {theme.features.map((f, i) => (
                  <li key={f.title} className="h-full">
                    <Reveal className="h-full" delay={(i % 2) * 120}>
                      <div className="thz-feat h-full rounded-sm border p-5" style={{ background: 'var(--card)', borderColor: '#D9C7A0' }}>
                        <p className="font-mono text-sm" style={{ color: 'var(--rust)' }}>
                          {String(i + 1).padStart(2, '0')}
                        </p>
                        <h3 className="thz-pf mt-1 text-xl font-bold leading-tight" style={{ color: 'var(--ink)' }}>
                          {f.title}
                        </h3>
                        <p className="mt-2 text-base leading-relaxed" style={{ color: 'var(--ink2)' }}>
                          {f.desc}
                        </p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>
              <div className="mt-8 grid gap-4 md:grid-cols-2 md:items-start">
                <Reveal>
                  <Roles />
                </Reveal>
                <Reveal delay={150}>
                  <VisitFlow />
                </Reveal>
              </div>
              <Reveal className="mt-6">
                <p className="thz-cv text-2xl leading-tight" style={{ color: 'var(--rust)' }}>
                  &ldquo;People are not roles, they have roles, and sometimes they have several at once.&rdquo;
                </p>
              </Reveal>
            </section>

            <Vine />

            {/* ---- Entry 05: soil layers ---- */}
            <section>
              <Entry n="05" title="Four layers of soil" note="A classic LAMP stack that runs on any cPanel host a cooperative can already afford." />
              <ol className="space-y-2">
                {theme.architecture.map((a, i) => {
                  const c = STRATA[i % STRATA.length];
                  return (
                    <li key={a.layer}>
                      <Reveal delay={i * 130}>
                        <div className="thz-layer rounded-sm px-5 py-5 md:grid md:grid-cols-[11rem_1fr] md:gap-6" style={{ background: c.bg, color: c.fg, minHeight: `${5 + (i % 2)}rem` }}>
                          <div>
                            <p className="thz-cv text-xl" style={{ color: c.sub }}>
                              layer {i + 1}
                            </p>
                            <h3 className="thz-pf text-2xl font-bold">{a.layer}</h3>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <p className="text-base leading-relaxed">{a.details}</p>
                            {a.layer === 'Database' && (
                              <ul className="mt-3 flex flex-wrap gap-2">
                                {TABLES.map((t) => (
                                  <li key={t} className="rounded-full border px-3 py-1 font-mono text-sm" style={{ borderColor: c.sub, color: c.sub }}>
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </Reveal>
                    </li>
                  );
                })}
              </ol>
            </section>

            <Vine />

            {/* ---- Entry 06: pressed specimens ---- */}
            <section>
              <Entry n="06" title="Pressed between the pages" note="Soil, leaf and the mark the whole thing grows under." />
              <div className="grid gap-8 sm:grid-cols-3 sm:gap-5">
                {GALLERY.map((g, i) => (
                  <Reveal key={g.src} delay={i * 130}>
                    <figure className="thz-polaroid relative mx-auto max-w-[300px] p-3 pb-4 sm:max-w-none" style={{ background: '#FFFDF6', boxShadow: '0 10px 18px -12px rgba(43,30,18,.7)', transform: `rotate(${g.rot}deg)` }}>
                      <span aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rotate-3" style={{ background: 'rgba(226,169,59,.7)' }} />
                      <div className="relative aspect-square w-full overflow-hidden" style={{ background: '#2C1F12' }}>
                        <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1100px) 300px, (min-width: 640px) 30vw, 300px" className="object-cover" style={{ objectPosition: g.pos }} loading="lazy" />
                      </div>
                      <figcaption className="thz-cv mt-3 text-center text-2xl" style={{ color: 'var(--ink)' }}>
                        {g.cap}
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            </section>

            <Vine />

            {/* ---- Closing ---- */}
            <section aria-label="Outcome" className="text-center">
              <Reveal>
                <p className="thz-cv text-2xl" style={{ color: 'var(--rust)' }}>
                  last line in the ledger
                </p>
                <blockquote className="thz-pf mx-auto mt-3 max-w-3xl text-[clamp(1.7rem,5.4vw,3.2rem)] font-bold italic leading-[1.15]" style={{ color: 'var(--ink)' }}>
                  &ldquo;{theme.outcomeQuote}&rdquo;
                </blockquote>
                <svg viewBox="0 0 300 20" className="mx-auto mt-4 block h-5 w-64" aria-hidden="true">
                  <g className="thz-draw" data-in="1">
                    <path className="dp" pathLength={1} d="M4 12 C30 2 50 18 80 10 S130 2 160 11 S230 18 296 8" fill="none" stroke="#3F6B2F" strokeWidth="3" strokeLinecap="round" />
                  </g>
                </svg>
              </Reveal>
            </section>
          </div>
          <div className="h-4" style={{ background: 'var(--paper)', clipPath: TORN_BOTTOM }} aria-hidden="true" />
        </div>
      </main>

      <div className="pb-24">
        <NextChapter currentSlug="thaazhai" accent={theme.palette.accent} />
      </div>
      <SiteFooter />
    </div>
  );
}
