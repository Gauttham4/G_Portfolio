'use client';

// 3 additional layout strategies for themed project pages.
//
// E · "Blueprint" — engineering spec sheet: graph-paper grid, mono labels, crop marks,
//                   spec table, layered stack diagram, gauge readouts.
// F · "Magazine"  — editorial print: huge serif title on a colour block, drop cap,
//                   pull-quotes, full-bleed image breaks, numbered list beside sticky image.
// G · "Showcase"  — gallery-first: native snap-scroll filmstrip, bento tiles,
//                   outlined numerals, tinted quote cards, chip-flow architecture.
//
// Performance rules (mobile): no useScroll, no backdrop-filter, no blend modes, no SVG noise,
// no pinned runways. Motion is limited to once-only whileInView fades.

import Image from 'next/image';
import { useRef, type CSSProperties, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { GalleryImage, ProjectTheme } from '@/lib/project-themes';
import NextChapter from '../NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

type Props = { theme: ProjectTheme };

const EASE = [0.22, 1, 0.36, 1] as const;

// --------------------------------------------------------------------------
// Shared helpers
// --------------------------------------------------------------------------

function parseColor(c: string): [number, number, number] | null {
  const s = c.trim();
  const hex = s.match(/^#([0-9a-f]{6}|[0-9a-f]{3})(?![0-9a-f])/i);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].split('').map((x) => x + x).join('') : hex[1];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  const rgb = s.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  return null;
}

/** Colour with alpha. Falls back to the original string if it can't be parsed. */
function alpha(c: string, a: number): string {
  const rgb = parseColor(c);
  return rgb ? `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})` : c;
}

/** Pick `dark` or `light` for readable text on top of `bg`. */
function readableOn(bg: string, dark: string, light: string): string {
  const rgb = parseColor(bg);
  if (!rgb) return light;
  const lum = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
  return lum > 0.55 ? dark : light;
}

function pageVars(theme: ProjectTheme): CSSProperties {
  const p = theme.palette;
  return {
    background: p.bg,
    color: p.text,
    ['--page-bg' as string]: p.bg,
    ['--page-bg-mid' as string]: p.bgMid,
    ['--page-text' as string]: p.text,
    ['--page-dim' as string]: p.dim,
    ['--page-accent' as string]: p.accent,
    ['--page-accent2' as string]: p.accent2 ?? p.accent,
  };
}

function getGallery(theme: ProjectTheme): GalleryImage[] {
  if (theme.gallery && theme.gallery.length > 0) return theme.gallery;
  return [{ src: theme.heroImage, caption: theme.title, alt: theme.title }];
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/** Once-only fade/translate on enter. Plain div under reduced motion. */
function Reveal({
  children,
  className,
  style,
  delay = 0,
  y = 22,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const WRAP = 'mx-auto w-full max-w-6xl px-5 sm:px-8 md:px-12';

// ==========================================================================
// E · BLUEPRINT
// ==========================================================================

function CropMarks({ color, inset = 8 }: { color: string; inset?: number }) {
  const base = 'pointer-events-none absolute h-3 w-3';
  const o = -inset;
  return (
    <>
      <span className={`${base} border-t border-l`} style={{ top: o, left: o, borderColor: color }} />
      <span className={`${base} border-t border-r`} style={{ top: o, right: o, borderColor: color }} />
      <span className={`${base} border-b border-l`} style={{ bottom: o, left: o, borderColor: color }} />
      <span className={`${base} border-b border-r`} style={{ bottom: o, right: o, borderColor: color }} />
    </>
  );
}

function BpHead({ n, label, title, theme }: { n: number; label: string; title: string; theme: ProjectTheme }) {
  const { accent, dim, text } = theme.palette;
  return (
    <div className="mb-8 md:mb-12">
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: accent }}>
        <span className="shrink-0">
          § {pad2(n)} {label}
        </span>
        <span className="h-px flex-1" style={{ background: alpha(accent, 0.45) }} />
        <span className="hidden shrink-0 sm:inline" style={{ color: dim }}>
          SHEET {n + 1}
        </span>
      </div>
      <h2
        className="mt-4 font-sans text-2xl font-semibold tracking-tight md:text-4xl"
        style={{ color: text }}
      >
        {title}
      </h2>
    </div>
  );
}

const GAUGE_FILL = [72, 88, 58, 94, 66, 80];

function gaugeTicks() {
  const out: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i <= 10; i++) {
    const a = Math.PI - (i * Math.PI) / 10;
    const r1 = i % 5 === 0 ? 36 : 40;
    const r2 = 45;
    out.push({
      x1: Number((60 + r1 * Math.cos(a)).toFixed(2)),
      y1: Number((60 - r1 * Math.sin(a)).toFixed(2)),
      x2: Number((60 + r2 * Math.cos(a)).toFixed(2)),
      y2: Number((60 - r2 * Math.sin(a)).toFixed(2)),
    });
  }
  return out;
}
const TICKS = gaugeTicks();

function Gauge({ value, label, pct, theme, idx }: { value: string; label: string; pct: number; theme: ProjectTheme; idx: number }) {
  const reduce = useReducedMotion();
  const { accent, dim, text } = theme.palette;
  const arc = 'M 10 60 A 50 50 0 0 1 110 60';
  return (
    <div
      className="relative p-4 sm:p-5"
      style={{ border: `1px solid ${alpha(accent, 0.35)}`, background: alpha(theme.palette.bgMid, 0.55) }}
    >
      <CropMarks color={accent} inset={4} />
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: dim }}>
        <span>CH {pad2(idx + 1)}</span>
        <span style={{ color: accent }}>● LIVE</span>
      </div>
      <svg viewBox="0 0 120 68" className="mx-auto mt-2 block w-full max-w-[200px]" aria-hidden>
        <path d={arc} fill="none" stroke={alpha(text, 0.14)} strokeWidth="6" strokeLinecap="butt" />
        {reduce ? (
          <path d={arc} fill="none" stroke={accent} strokeWidth="6" pathLength={100} strokeDasharray={`${pct} 100`} />
        ) : (
          <motion.path
            d={arc}
            fill="none"
            stroke={accent}
            strokeWidth="6"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: pct / 100 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE }}
          />
        )}
        {TICKS.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={alpha(text, 0.4)} strokeWidth="0.8" />
        ))}
        <text x="10" y="67" fontSize="6" fill={dim} fontFamily="monospace">0</text>
        <text x="110" y="67" fontSize="6" fill={dim} fontFamily="monospace" textAnchor="end">MAX</text>
      </svg>
      <p
        className="mt-1 break-words text-center font-mono text-3xl font-medium leading-none sm:text-4xl"
        style={{ color: text }}
      >
        {value}
      </p>
      <p className="mt-3 break-words text-center font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: dim }}>
        {label}
      </p>
    </div>
  );
}

function DimH({ label, theme }: { label: string; theme: ProjectTheme }) {
  const c = alpha(theme.palette.accent, 0.8);
  return (
    <div className="relative flex h-5 items-center" aria-hidden>
      <span className="absolute inset-x-0 top-1/2 h-px" style={{ background: c }} />
      <span className="absolute left-0 top-0 h-full w-px" style={{ background: c }} />
      <span className="absolute right-0 top-0 h-full w-px" style={{ background: c }} />
      <span
        className="relative mx-auto px-2 font-mono text-[10px] uppercase tracking-[0.2em]"
        style={{ background: theme.palette.bg, color: theme.palette.accent }}
      >
        {label}
      </span>
    </div>
  );
}

function DimV({ label, theme }: { label: string; theme: ProjectTheme }) {
  const c = alpha(theme.palette.accent, 0.8);
  return (
    <div className="relative flex w-5 items-center justify-center" aria-hidden>
      <span className="absolute inset-y-0 left-1/2 w-px" style={{ background: c }} />
      <span className="absolute left-0 top-0 h-px w-full" style={{ background: c }} />
      <span className="absolute bottom-0 left-0 h-px w-full" style={{ background: c }} />
      <span
        className="relative py-2 font-mono text-[10px] uppercase tracking-[0.2em] [writing-mode:vertical-rl]"
        style={{ background: theme.palette.bg, color: theme.palette.accent }}
      >
        {label}
      </span>
    </div>
  );
}

export function BlueprintLayout({ theme }: Props) {
  const { bg, bgMid, text, dim, accent } = theme.palette;
  const gallery = getGallery(theme);
  const rule = alpha(accent, 0.28);
  const mono = 'font-mono uppercase tracking-[0.2em]';

  const gridBg: CSSProperties = {
    ...pageVars(theme),
    backgroundImage: [
      `linear-gradient(${alpha(accent, 0.1)} 1px, transparent 1px)`,
      `linear-gradient(90deg, ${alpha(accent, 0.1)} 1px, transparent 1px)`,
      `linear-gradient(${alpha(accent, 0.05)} 1px, transparent 1px)`,
      `linear-gradient(90deg, ${alpha(accent, 0.05)} 1px, transparent 1px)`,
    ].join(','),
    backgroundSize: '96px 96px, 96px 96px, 24px 24px, 24px 24px',
  };

  return (
    <main className="relative min-h-[100svh] overflow-x-clip" style={gridBg}>
      {/* HERO */}
      <section className="relative">
        <div className={`${WRAP} grid min-h-[88svh] items-center gap-10 pb-24 pt-24 md:pb-28 md:pt-44 lg:grid-cols-12 lg:gap-12`}>
          <div className="min-w-0 lg:col-span-6">
            <p className={`${mono} text-[10px]`} style={{ color: dim }}>
              DWG NO. {theme.slug.toUpperCase().slice(0, 18)} · REV A
            </p>
            <p className={`${mono} mt-3 text-[11px]`} style={{ color: accent }}>
              {theme.kicker}
            </p>
            <h1
              className="mt-6 break-words font-display tracking-tight"
              style={{ fontSize: 'clamp(2.5rem, 10vw, 6.5rem)', lineHeight: 0.95, color: text }}
            >
              {theme.title}
              <span style={{ color: accent }}>_</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed md:text-lg" style={{ color: dim }}>
              {theme.subtitle}
            </p>

            <dl
              className="mt-10 grid max-w-md grid-cols-[auto_1fr] font-mono text-[11px] uppercase tracking-[0.15em]"
              style={{ borderTop: `1px solid ${rule}` }}
            >
              {[
                ['Project', theme.title],
                ['Sheet', '1 of 1'],
                ['Scale', '1 : 1'],
                ['Status', 'Issued for review'],
              ].map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="py-2 pr-6" style={{ color: dim, borderBottom: `1px solid ${rule}` }}>
                    {k}
                  </dt>
                  <dd className="min-w-0 break-words py-2" style={{ color: text, borderBottom: `1px solid ${rule}` }}>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-2">
              <DimH label="1600 px · 4 : 3" theme={theme} />
              <span />
              <div className="relative p-2" style={{ border: `1px solid ${alpha(accent, 0.6)}`, background: alpha(bgMid, 0.6) }}>
                <CropMarks color={accent} inset={6} />
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={theme.heroImage}
                    alt={theme.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 560px, 92vw"
                    className="object-cover"
                  />
                  <span
                    className={`${mono} absolute bottom-0 left-0 px-2 py-1 text-[9px]`}
                    style={{ background: bg, color: accent }}
                  >
                    FIG. 00 · PRIMARY VIEW
                  </span>
                </div>
              </div>
              <DimV label="1200 px" theme={theme} />
            </div>
          </div>
        </div>
      </section>

      {/* § 01 READOUTS */}
      <section className="py-16 md:py-24">
        <div className={WRAP}>
          <BpHead n={1} label="READOUTS" title="Measured output" theme={theme} />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {theme.bigNumbers.slice(0, 4).map((b, i) => (
              <Reveal key={b.label} delay={i * 0.06}>
                <Gauge value={b.value} label={b.label} pct={GAUGE_FILL[i % GAUGE_FILL.length]} theme={theme} idx={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* § 02 NOTES */}
      <section className="py-16 md:py-24">
        <div className={WRAP}>
          <BpHead n={2} label="NOTES" title="Design notes" theme={theme} />
          <div className="grid gap-px md:grid-cols-3" style={{ background: rule, border: `1px solid ${rule}` }}>
            {theme.story.quotes.map((q, i) => (
              <Reveal key={i} delay={i * 0.06} className="p-6 md:p-8" style={{ background: bg }}>
                <p className={`${mono} text-[10px]`} style={{ color: accent }}>
                  NOTE {pad2(i + 1)} / {q.kicker}
                </p>
                <p className="mt-5 text-lg leading-relaxed md:text-xl" style={{ color: text }}>
                  {q.quote}
                </p>
                <p className="mt-5 border-t pt-4 font-mono text-[11px] leading-relaxed" style={{ color: dim, borderColor: rule }}>
                  {q.context}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* § 03 SPEC TABLE */}
      <section className="py-16 md:py-24">
        <div className={WRAP}>
          <BpHead n={3} label="SPEC" title="Specification" theme={theme} />
          <div style={{ borderTop: `2px solid ${accent}` }}>
            <div
              className={`${mono} hidden grid-cols-[64px_minmax(0,1fr)_minmax(0,1.6fr)] gap-6 py-3 text-[10px] md:grid`}
              style={{ color: dim, borderBottom: `1px solid ${rule}` }}
            >
              <span>ID</span>
              <span>Parameter</span>
              <span>Description</span>
            </div>
            {theme.features.map((f, i) => (
              <Reveal
                key={f.title}
                y={12}
                className="grid grid-cols-[44px_minmax(0,1fr)] gap-x-4 gap-y-1 py-5 md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1.6fr)] md:gap-x-6 md:py-6"
                style={{ borderBottom: `1px solid ${rule}` }}
              >
                <span className="font-mono text-xs" style={{ color: accent }}>
                  F-{pad2(i + 1)}
                </span>
                <h3 className="min-w-0 break-words font-sans text-base font-semibold md:text-lg" style={{ color: text }}>
                  {f.title}
                </h3>
                <p
                  className="col-start-2 min-w-0 text-sm leading-relaxed md:col-start-3 md:row-start-1"
                  style={{ color: dim }}
                >
                  {f.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* § 04 STACK DIAGRAM */}
      <section className="py-16 md:py-24">
        <div className={WRAP}>
          <BpHead n={4} label="ARCHITECTURE" title="System stack" theme={theme} />
          <div
            className="relative mx-auto max-w-3xl p-4 pt-8 sm:p-6 sm:pt-10"
            style={{ border: `1px dashed ${alpha(accent, 0.5)}` }}
          >
            <span
              className={`${mono} absolute -top-2 left-4 px-2 text-[10px]`}
              style={{ background: bg, color: accent }}
            >
              SYSTEM BOUNDARY
            </span>
            {theme.architecture.map((a, i) => (
              <div key={a.layer}>
                <Reveal y={10}>
                  <div
                    className="relative grid grid-cols-[48px_minmax(0,1fr)] sm:grid-cols-[64px_minmax(0,0.5fr)_minmax(0,1fr)]"
                    style={{ border: `1px solid ${accent}`, background: alpha(bgMid, 0.8) }}
                  >
                    <span
                      className="row-span-2 flex items-center justify-center font-mono text-xs font-semibold sm:row-span-1"
                      style={{ background: accent, color: readableOn(accent, '#111', '#fff') }}
                    >
                      L{pad2(theme.architecture.length - i)}
                    </span>
                    <h3
                      className="min-w-0 break-words px-4 pt-3 font-mono text-sm font-medium uppercase tracking-[0.12em] sm:py-4"
                      style={{ color: text }}
                    >
                      {a.layer}
                    </h3>
                    <p
                      className="col-start-2 min-w-0 px-4 pb-3 text-sm leading-relaxed sm:col-start-3 sm:row-start-1 sm:py-4 sm:pl-0"
                      style={{ color: dim }}
                    >
                      {a.details}
                    </p>
                  </div>
                </Reveal>
                {i < theme.architecture.length - 1 ? (
                  <div className="flex h-9 flex-col items-center" aria-hidden>
                    <span className="w-px flex-1" style={{ background: accent }} />
                    <svg width="10" height="7" viewBox="0 0 10 7">
                      <path d="M0 0 L10 0 L5 7 Z" fill={accent} />
                    </svg>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* § 05 EXHIBITS */}
      {gallery.length > 1 ? (
        <section className="py-16 md:py-24">
          <div className={WRAP}>
            <BpHead n={5} label="EXHIBITS" title="Reference figures" theme={theme} />
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.slice(0, 6).map((g, i) => (
                <figure key={g.src} className="min-w-0">
                  <div className="relative p-1.5" style={{ border: `1px solid ${rule}` }}>
                    <CropMarks color={accent} inset={5} />
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={g.src}
                        alt={g.alt}
                        fill
                        loading="lazy"
                        sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 92vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <figcaption className={`${mono} mt-3 text-[10px]`} style={{ color: dim }}>
                    <span style={{ color: accent }}>FIG. {pad2(i + 1)}</span> · {g.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* § 06 CONCLUSION */}
      <section className="py-16 md:py-24">
        <div className={WRAP}>
          <BpHead n={gallery.length > 1 ? 6 : 5} label="SIGN-OFF" title="Conclusion" theme={theme} />
          <Reveal>
            <div
              className="relative p-6 sm:p-10 md:p-14"
              style={{ border: `1px solid ${accent}`, background: alpha(bgMid, 0.7) }}
            >
              <CropMarks color={accent} inset={8} />
              <p
                className="max-w-3xl break-words font-display italic leading-snug"
                style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2.75rem)', color: text }}
              >
                {theme.outcomeQuote}
              </p>
              <span
                className={`${mono} mt-8 inline-block -rotate-3 px-3 py-1.5 text-xs font-semibold`}
                style={{ border: `2px solid ${accent}`, color: accent }}
              >
                Verified · Shipped
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <NextChapter currentSlug={theme.slug} accent={accent} />
      <SiteFooter />
    </main>
  );
}

// ==========================================================================
// F · MAGAZINE
// ==========================================================================

const smallCaps: CSSProperties = {
  fontVariantCaps: 'all-small-caps',
  letterSpacing: '0.14em',
};

export function MagazineLayout({ theme }: Props) {
  const { bgMid, text, dim, accent } = theme.palette;
  const accent2 = theme.palette.accent2 ?? accent;
  const gallery = getGallery(theme);
  const pick = (i: number) => gallery[i % gallery.length];
  const onAccent = readableOn(accent, '#14110d', '#fbf7ef');
  const rule = alpha(text, 0.22);
  const [lead, ...restQuotes] = theme.story.quotes;
  const breakA = pick(1);
  const breakB = pick(3);
  const stickyImg = pick(2);

  return (
    <main className="relative min-h-[100svh] overflow-x-clip" style={pageVars(theme)}>
      {/* HERO */}
      <header>
        <div className={`${WRAP} pt-24 md:pt-40`}>
          <div
            className="flex items-baseline justify-between gap-4 pb-3 text-xs md:text-sm"
            style={{ ...smallCaps, color: dim, borderBottom: `3px double ${rule}` }}
          >
            <span className="min-w-0 break-words">{theme.kicker}</span>
            <span className="shrink-0">Case study</span>
          </div>
        </div>
        <div className="relative mt-4 h-[52svh] w-full md:h-[52svh]">
          <Image
            src={theme.heroImage}
            alt={theme.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          className="relative z-10 -mt-16 mr-5 px-6 py-9 sm:mr-10 md:-mt-24 md:ml-12 md:mr-auto md:max-w-[88%] md:px-14 md:py-14"
          style={{ background: accent, color: onAccent }}
        >
          <p className="text-xs md:text-sm" style={{ ...smallCaps, opacity: 0.8 }}>
            Cover story
          </p>
          <h1
            className="mt-4 break-words font-display font-semibold tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 11vw, 9rem)', lineHeight: 0.9, hyphens: 'auto' }}
          >
            {theme.title}
          </h1>
          <p
            className="mt-6 max-w-2xl font-display italic leading-snug"
            style={{ fontSize: 'clamp(1.1rem, 2.6vw, 1.75rem)', opacity: 0.88 }}
          >
            {theme.subtitle}
          </p>
        </div>
      </header>

      {/* BY THE NUMBERS */}
      <section className="pt-16 md:pt-24">
        <div className={WRAP}>
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderTop: `1px solid ${rule}`, borderBottom: `1px solid ${rule}` }}>
            {theme.bigNumbers.slice(0, 4).map((b, i) => (
              <Reveal
                key={b.label}
                delay={i * 0.05}
                className="min-w-0 px-3 py-6 md:px-6 md:py-9"
                style={{
                  borderLeft: i % 2 === 1 ? `1px solid ${rule}` : undefined,
                  borderTop: i >= 2 ? `1px solid ${rule}` : undefined,
                }}
              >
                <p
                  className="break-words font-display leading-none"
                  style={{ fontSize: 'clamp(2.4rem, 8vw, 4.75rem)', color: accent2 === accent ? accent : accent2 }}
                >
                  {b.value}
                </p>
                <p className="mt-3 text-xs md:text-sm" style={{ ...smallCaps, color: dim }}>
                  {b.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD STORY: drop cap + two columns */}
      {lead ? (
        <section className="py-16 md:py-24">
          <div className={WRAP}>
            <Reveal className="grid gap-8 md:grid-cols-12 md:gap-12">
              <p className="text-xs md:col-span-3 md:pt-3" style={{ ...smallCaps, color: accent }}>
                {lead.kicker}
              </p>
              <div className="min-w-0 md:col-span-9">
                <p
                  className="font-display leading-[1.25] first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-[var(--page-accent)] first-letter:text-[5.5rem] md:first-letter:text-[7rem]"
                  style={{ fontSize: 'clamp(1.4rem, 3.4vw, 2.4rem)' }}
                >
                  {lead.quote}
                </p>
                <p
                  className="mt-8 border-t pt-5 text-sm leading-relaxed md:columns-2 md:gap-10 md:text-base"
                  style={{ color: dim, borderColor: rule }}
                >
                  {lead.context}
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* IMAGE BREAK A: bleeds off the right edge */}
      <section>
        <div className="grid items-end gap-4 md:grid-cols-12">
          <figcaption
            className="order-2 px-5 text-xs md:order-1 md:col-span-3 md:pl-12 md:pr-0"
            style={{ ...smallCaps, color: dim }}
          >
            <span style={{ color: accent }}>Plate I</span> &nbsp;{breakA.caption}
          </figcaption>
          <div className="relative order-1 aspect-[4/3] w-full md:order-2 md:col-span-9 md:aspect-[16/9]">
            <Image
              src={breakA.src}
              alt={breakA.alt}
              fill
              loading="lazy"
              sizes="(min-width: 768px) 75vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* PULL QUOTES */}
      {restQuotes.length > 0 ? (
        <section className="py-16 md:py-24">
          <div className={`${WRAP} grid gap-12 md:grid-cols-2 md:gap-16`}>
            {restQuotes.map((q, i) => (
              <Reveal key={i} delay={i * 0.08} className={i % 2 === 1 ? 'md:mt-20' : ''}>
                <div className="border-t-4 pt-5" style={{ borderColor: accent }}>
                  <p className="text-xs" style={{ ...smallCaps, color: accent }}>
                    {q.kicker}
                  </p>
                  <blockquote
                    className="mt-4 font-display italic leading-[1.2]"
                    style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.4rem)' }}
                  >
                    <span aria-hidden style={{ color: accent }}>
                      &ldquo;
                    </span>
                    {q.quote}
                    <span aria-hidden style={{ color: accent }}>
                      &rdquo;
                    </span>
                  </blockquote>
                  <p className="mt-5 text-sm leading-relaxed" style={{ color: dim }}>
                    {q.context}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* FEATURES: numbered list beside sticky image */}
      <section className="py-16 md:py-24" style={{ background: alpha(bgMid, 0.7) }}>
        <div className={`${WRAP} grid gap-10 lg:grid-cols-12 lg:gap-16`}>
          <div className="min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <p className="text-xs" style={{ ...smallCaps, color: accent }}>
                What is inside
              </p>
              <h2
                className="mt-3 font-display font-semibold leading-none tracking-tight"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
              >
                The features
              </h2>
              <div className="relative mt-8 aspect-[4/5] w-full max-w-sm overflow-hidden lg:max-w-none">
                <Image
                  src={stickyImg.src}
                  alt={stickyImg.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-xs" style={{ ...smallCaps, color: dim }}>
                {stickyImg.caption}
              </p>
            </div>
          </div>
          <ol className="min-w-0 lg:col-span-7">
            {theme.features.map((f, i) => (
              <Reveal
                key={f.title}
                y={14}
                className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-3 py-6 md:grid-cols-[4.5rem_minmax(0,1fr)] md:py-8"
                style={{ borderTop: i === 0 ? `2px solid ${text}` : `1px solid ${rule}` }}
              >
                <span
                  className="font-display leading-none"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: accent }}
                  aria-hidden
                >
                  {pad2(i + 1)}
                </span>
                <div className="min-w-0">
                  <h3 className="break-words font-display text-xl font-semibold md:text-2xl">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed md:text-base" style={{ color: dim }}>
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* IMAGE BREAK B: bleeds off the left edge */}
      <section className="pt-16 md:pt-24">
        <div className="grid items-end gap-4 md:grid-cols-12">
          <div className="relative aspect-[4/3] w-full md:col-span-8 md:aspect-[16/9]">
            <Image
              src={breakB.src}
              alt={breakB.alt}
              fill
              loading="lazy"
              sizes="(min-width: 768px) 66vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="px-5 text-xs md:col-span-4 md:pl-0 md:pr-12" style={{ ...smallCaps, color: dim }}>
            <span style={{ color: accent }}>Plate II</span> &nbsp;{breakB.caption}
          </figcaption>
        </div>
      </section>

      {/* ARCHITECTURE: definition list with leaders */}
      <section className="py-16 md:py-24">
        <div className={WRAP}>
          <div className="mb-8 flex items-baseline gap-4 md:mb-12">
            <h2
              className="font-display font-semibold tracking-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              Under the hood
            </h2>
            <span className="h-px flex-1" style={{ background: rule }} />
          </div>
          <dl className="grid gap-x-16 gap-y-8 md:grid-cols-2">
            {theme.architecture.map((a) => (
              <Reveal key={a.layer} y={12} className="min-w-0">
                <dt className="text-sm" style={{ ...smallCaps, color: accent }}>
                  {a.layer}
                </dt>
                <dd
                  className="mt-2 border-t pt-3 text-base leading-relaxed"
                  style={{ borderColor: rule, color: text }}
                >
                  {a.details}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* OUTCOME */}
      <section className="pb-16 md:pb-24">
        <Reveal
          className="mx-5 px-6 py-14 sm:mx-10 md:mx-12 md:px-16 md:py-24"
          style={{ background: bgMid, borderTop: `6px solid ${accent}` }}
        >
          <p className="text-xs" style={{ ...smallCaps, color: accent }}>
            Last word
          </p>
          <p
            className="mt-6 max-w-4xl break-words font-display italic leading-[1.1]"
            style={{ fontSize: 'clamp(1.75rem, 5.2vw, 4rem)', color: text }}
          >
            <span aria-hidden style={{ color: accent }}>
              &ldquo;
            </span>
            {theme.outcomeQuote}
            <span aria-hidden style={{ color: accent }}>
              &rdquo;
            </span>
          </p>
        </Reveal>
      </section>

      <NextChapter currentSlug={theme.slug} accent={accent} />
      <SiteFooter />
    </main>
  );
}

// ==========================================================================
// G · SHOWCASE
// ==========================================================================

const SPAN_CLASS: Record<number, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
};
const SPAN_CYCLE = [4, 2, 2, 2, 2, 2, 3, 3];

function numeralSize(v: string): string {
  if (v.length <= 2) return 'clamp(4.5rem, 20vw, 9rem)';
  if (v.length <= 4) return 'clamp(3.5rem, 15vw, 7rem)';
  return 'clamp(2.5rem, 10vw, 4.5rem)';
}

export function ShowcaseLayout({ theme }: Props) {
  const reduce = useReducedMotion();
  const { bg, bgMid, text, dim, accent } = theme.palette;
  const accent2 = theme.palette.accent2 ?? accent;
  const gallery = getGallery(theme);
  const stripRef = useRef<HTMLDivElement | null>(null);

  const scrollStrip = (dir: 1 | -1) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: reduce ? 'auto' : 'smooth' });
  };

  // Bento layout: compute spans so the last row can be topped up by an image tile.
  const spans = theme.features.map((_, i) => SPAN_CYCLE[i % SPAN_CYCLE.length]);
  const total = spans.reduce((a, b) => a + b, 0);
  const remainder = total % 6 === 0 ? 0 : 6 - (total % 6);
  const fillerImg = gallery[gallery.length > 2 ? 2 : 0];

  const tiles = [
    { bg: accent, fg: readableOn(accent, '#111', '#fff'), dim: 0.75, border: 'transparent' },
    { bg: bgMid, fg: text, dim: 1, border: alpha(accent, 0.35) },
    { bg: accent2, fg: readableOn(accent2, '#111', '#fff'), dim: 0.75, border: 'transparent' },
    { bg: 'transparent', fg: text, dim: 1, border: alpha(accent, 0.6) },
    { bg: alpha(accent, 0.16), fg: text, dim: 1, border: 'transparent' },
    { bg: bgMid, fg: text, dim: 1, border: alpha(accent2, 0.4) },
  ];

  const quoteTints = [alpha(accent, 0.14), alpha(accent2, 0.16), alpha(text, 0.07)];

  return (
    <main className="relative min-h-[100svh] overflow-x-clip" style={pageVars(theme)}>
      {/* HERO: title + native snap-scroll filmstrip */}
      <section className="pt-24 md:pt-40">
        <div className={WRAP}>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
            {theme.kicker}
          </p>
          <h1
            className="mt-5 break-words font-display font-semibold tracking-tight"
            style={{ fontSize: 'clamp(2.6rem, 10vw, 7.5rem)', lineHeight: 0.92 }}
          >
            {theme.title}
            <span style={{ color: accent }}>.</span>
          </h1>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <p className="max-w-2xl text-base leading-relaxed md:text-xl" style={{ color: dim }}>
              {theme.subtitle}
            </p>
            {gallery.length > 1 ? (
              <div className="hidden gap-2 sm:flex">
                {([-1, 1] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => scrollStrip(d)}
                    aria-label={d === -1 ? 'Previous images' : 'Next images'}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-lg"
                    style={{ border: `1px solid ${alpha(accent, 0.6)}`, color: accent }}
                  >
                    {d === -1 ? '←' : '→'}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div
          ref={stripRef}
          tabIndex={0}
          aria-label={`${theme.title} image filmstrip`}
          className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-pl-5 px-5 pb-4 sm:scroll-pl-8 sm:px-8 md:scroll-pl-12 md:px-12 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {gallery.map((g, i) => (
            <figure
              key={g.src}
              className="relative aspect-[4/5] w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl sm:aspect-[4/3] sm:w-[52%] lg:w-[38%]"
              style={{ background: bgMid }}
            >
              <Image
                src={g.src}
                alt={g.alt}
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : 'lazy'}
                sizes="(min-width: 1024px) 38vw, (min-width: 640px) 52vw, 78vw"
                className="object-cover"
              />
              <figcaption
                className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-4 pb-4 pt-12"
                style={{ background: `linear-gradient(to top, ${alpha(bg, 0.92)}, ${alpha(bg, 0)})` }}
              >
                <span className="min-w-0 break-words font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: text }}>
                  {g.caption}
                </span>
                <span className="shrink-0 font-mono text-[10px] tracking-widest" style={{ color: accent }}>
                  {pad2(i + 1)}/{pad2(gallery.length)}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        {gallery.length > 1 ? (
          <p className="px-5 font-mono text-[10px] uppercase tracking-[0.25em] sm:px-8 md:px-12" style={{ color: dim }}>
            Swipe or scroll sideways →
          </p>
        ) : null}
      </section>

      {/* OUTLINED NUMERALS */}
      <section className="py-20 md:py-28">
        <div className={WRAP}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8">
            {theme.bigNumbers.slice(0, 4).map((b, i) => (
              <Reveal key={b.label} delay={i * 0.05} className="min-w-0">
                <p
                  className="break-words font-display font-semibold leading-[0.95]"
                  style={{
                    fontSize: numeralSize(b.value),
                    color: 'transparent',
                    WebkitTextStroke: `2px ${i % 2 === 0 ? accent : accent2}`,
                  }}
                >
                  {b.value}
                </p>
                <p
                  className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: dim }}
                >
                  {b.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE CARDS */}
      <section className="pb-20 md:pb-28">
        <div className={`${WRAP} grid gap-4 md:grid-cols-3`}>
          {theme.story.quotes.map((q, i) => (
            <Reveal
              key={i}
              delay={i * 0.07}
              className={`flex min-w-0 flex-col rounded-3xl p-6 md:p-8 ${i === 1 ? 'md:mt-10' : ''}`}
              style={{ background: quoteTints[i % quoteTints.length], border: `1px solid ${alpha(text, 0.1)}` }}
            >
              <span
                aria-hidden
                className="font-display text-6xl leading-none"
                style={{ color: i % 2 === 0 ? accent : accent2 }}
              >
                &ldquo;
              </span>
              <p className="-mt-2 text-lg leading-relaxed md:text-xl" style={{ color: text }}>
                {q.quote}
              </p>
              <p className="mt-auto pt-6 text-sm leading-relaxed" style={{ color: dim }}>
                {q.context}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* BENTO FEATURES */}
      <section className="pb-20 md:pb-28">
        <div className={WRAP}>
          <h2
            className="mb-8 font-display font-semibold tracking-tight md:mb-12"
            style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}
          >
            What it does
          </h2>
          <div className="grid grid-flow-dense grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {theme.features.map((f, i) => {
              const t = tiles[i % tiles.length];
              return (
                <Reveal
                  key={f.title}
                  y={16}
                  delay={(i % 3) * 0.05}
                  className={`flex min-h-[200px] min-w-0 flex-col rounded-3xl p-6 md:p-7 ${i === 0 ? 'sm:col-span-2' : ''} ${SPAN_CLASS[spans[i]]}`}
                  style={{ background: t.bg, color: t.fg, border: `1px solid ${t.border}` }}
                >
                  <span className="font-mono text-xs tracking-widest" style={{ opacity: 0.7 }}>
                    {pad2(i + 1)}
                  </span>
                  <h3
                    className="mt-auto break-words pt-10 font-display font-semibold leading-tight"
                    style={{ fontSize: spans[i] >= 4 ? 'clamp(1.6rem, 3.6vw, 2.5rem)' : 'clamp(1.3rem, 2.4vw, 1.6rem)' }}
                  >
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ opacity: t.dim }}>
                    {f.desc}
                  </p>
                </Reveal>
              );
            })}
            {remainder > 0 ? (
              <div
                className={`relative min-h-[200px] overflow-hidden rounded-3xl sm:col-span-2 ${SPAN_CLASS[remainder]}`}
                style={{ background: bgMid }}
              >
                <Image
                  src={fillerImg.src}
                  alt={fillerImg.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 50vw, 92vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ARCHITECTURE: chip flow */}
      <section className="pb-20 md:pb-28">
        <div className={WRAP}>
          <h2
            className="mb-8 font-display font-semibold tracking-tight md:mb-12"
            style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}
          >
            How it fits together
          </h2>
          <div className="flex flex-wrap items-stretch gap-x-2 gap-y-3">
            {theme.architecture.map((a, i) => (
              <div key={a.layer} className="flex min-w-0 max-w-full items-center gap-2">
                <Reveal
                  y={10}
                  delay={i * 0.04}
                  className="flex min-w-0 max-w-full flex-col gap-2 rounded-3xl p-2 sm:flex-row sm:items-center sm:rounded-full sm:pr-5"
                  style={{ border: `1px solid ${alpha(accent, 0.45)}`, background: alpha(bgMid, 0.7) }}
                >
                  <span
                    className="shrink-0 rounded-full px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em]"
                    style={{ background: i % 2 === 0 ? accent : accent2, color: readableOn(i % 2 === 0 ? accent : accent2, '#111', '#fff') }}
                  >
                    {a.layer}
                  </span>
                  <span className="min-w-0 px-2 text-sm leading-snug sm:px-0" style={{ color: text }}>
                    {a.details}
                  </span>
                </Reveal>
                {i < theme.architecture.length - 1 ? (
                  <span aria-hidden className="hidden shrink-0 font-mono lg:inline" style={{ color: accent }}>
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUTCOME */}
      <section className="pb-20 md:pb-28">
        <div className={WRAP}>
          <Reveal
            className="rounded-[2rem] px-6 py-14 text-center md:px-16 md:py-24"
            style={{ background: `linear-gradient(135deg, ${alpha(accent, 0.28)}, ${alpha(accent2, 0.2)})`, border: `1px solid ${alpha(accent, 0.4)}` }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: accent }}>
              The result
            </p>
            <p
              className="mx-auto mt-6 max-w-3xl break-words font-display italic leading-tight"
              style={{ fontSize: 'clamp(1.6rem, 4.6vw, 3.25rem)', color: text }}
            >
              {theme.outcomeQuote}
            </p>
          </Reveal>
        </div>
      </section>

      <NextChapter currentSlug={theme.slug} accent={accent} />
      <SiteFooter />
    </main>
  );
}
