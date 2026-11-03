'use client';

// CareerVisionX: MENTOR ROADMAP microsite. Violet-to-orange aurora (plain gradients), a phone-style
// mentor chat in the hero, quotes told as a conversation, a winding SVG roadmap whose milestones
// light up on scroll, and a tap-to-score radar. Motion is CSS + IntersectionObserver only.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

const INK = '#12082B';
const CARD = '#1B0F3F';
const CREAM = '#FFF8EE';
const SOFT = '#D4C9F0';
const VIOLET = '#8B5CF6';
const VIOLET_HI = '#C4B5FD';
const ORANGE = '#F97316';
const ORANGE_HI = '#FDBA74';
const SORA = "var(--font-sora), 'Sora', system-ui, sans-serif";
const MONO = "var(--font-plex), 'IBM Plex Mono', ui-monospace, monospace";
const AURORA = `linear-gradient(100deg, ${VIOLET} 0%, #D946EF 48%, ${ORANGE} 100%)`;

// Sourced from the product overview and features notes.
const PROMISES = ['Talk in your voice', 'Map your future', 'Track real skills', 'Celebrate every step'];
const STACK_TAGS = ['Flutter', 'Groq mentor', 'Firebase', 'Voice in, voice out'];
const CATS = ['Technical', 'Creative', 'Analytical', 'Social', 'Leadership'];
const LEVELS = [0.3, 0.6, 0.8, 0.95];
const GRADS = [
  `radial-gradient(120% 100% at 0% 0%, rgba(139,92,246,.45), transparent 60%), radial-gradient(90% 80% at 100% 100%, rgba(217,70,239,.18), transparent 60%), ${CARD}`,
  `radial-gradient(120% 100% at 0% 0%, rgba(168,85,247,.4), transparent 60%), radial-gradient(90% 80% at 100% 100%, rgba(244,114,182,.22), transparent 60%), ${CARD}`,
  `radial-gradient(120% 100% at 0% 0%, rgba(217,70,239,.34), transparent 60%), radial-gradient(90% 80% at 100% 100%, rgba(249,115,22,.22), transparent 60%), ${CARD}`,
  `radial-gradient(120% 100% at 0% 0%, rgba(244,114,182,.3), transparent 60%), radial-gradient(90% 80% at 100% 100%, rgba(249,115,22,.34), transparent 60%), ${CARD}`,
];
const CARD_BORDER = '1px solid rgba(196,181,253,.2)';

const CSS = `
.cvx-root{background:${INK};color:${CREAM};font-family:${SORA};overflow-x:clip}
.cvx-root *{box-sizing:border-box}
.cvx-root :focus-visible{outline:3px solid ${ORANGE_HI};outline-offset:3px;border-radius:12px}
.cvx-rv{opacity:0;transform:translateY(18px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1);transition-delay:var(--d,0ms)}
.cvx-rv.cvx-in{opacity:1;transform:none}
.cvx-aur{position:absolute;pointer-events:none;border-radius:9999px;animation:cvx-drift 16s ease-in-out infinite alternate}
@keyframes cvx-drift{from{transform:translate3d(-4%,-3%,0) scale(1)}to{transform:translate3d(5%,4%,0) scale(1.08)}}
@keyframes cvx-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes cvx-rise{from{transform:translateY(46px)}to{transform:translateY(0)}}
@keyframes cvx-bub{from{opacity:0;transform:translateY(12px) scale(.96)}to{opacity:1;transform:none}}
@keyframes cvx-type{0%,60%,100%{transform:translateY(0);opacity:.45}30%{transform:translateY(-4px);opacity:1}}
@keyframes cvx-ring{0%{transform:scale(.9);opacity:.6}100%{transform:scale(1.7);opacity:0}}
@keyframes cvx-marq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes cvx-burst{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(.4)}}
@keyframes cvx-pop{0%{transform:translate(-50%,-50%) scale(.6)}60%{transform:translate(-50%,-50%) scale(1.25)}100%{transform:translate(-50%,-50%) scale(1)}}
.cvx-sun{animation:cvx-rise 1.6s cubic-bezier(.16,1,.3,1) .2s both}
.cvx-hpath{stroke-dasharray:1;stroke-dashoffset:1;animation:cvx-draw 2.4s cubic-bezier(.25,.1,.25,1) .5s forwards}
.cvx-b1,.cvx-b2,.cvx-b3,.cvx-b4{opacity:0;animation:cvx-bub .6s cubic-bezier(.34,1.56,.64,1) forwards}
.cvx-b1{animation-delay:.9s}.cvx-b2{animation-delay:1.9s}.cvx-b3{animation-delay:3s}.cvx-b4{animation-delay:3.9s}
.cvx-dot{display:inline-block;width:7px;height:7px;border-radius:9999px;background:${VIOLET_HI};animation:cvx-type 1.2s ease-in-out infinite}
.cvx-dot:nth-child(2){animation-delay:.15s}.cvx-dot:nth-child(3){animation-delay:.3s}
.cvx-mic::before{content:'';position:absolute;inset:0;border-radius:9999px;background:${ORANGE};animation:cvx-ring 2s ease-out infinite}
.cvx-marq{display:flex;width:max-content;animation:cvx-marq 32s linear infinite}
.cvx-seg{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1s cubic-bezier(.25,.1,.25,1)}
.cvx-ms.cvx-on .cvx-seg{stroke-dashoffset:0}
.cvx-node{background:${INK};border-color:${VIOLET_HI};transition:background .4s,border-color .4s,box-shadow .4s}
.cvx-ms.cvx-on .cvx-node{background:${ORANGE};border-color:${ORANGE_HI};box-shadow:0 0 0 6px rgba(249,115,22,.22);animation:cvx-pop .55s cubic-bezier(.34,1.56,.64,1) both}
.cvx-mcard{opacity:.55;transform:translateY(10px);transition:opacity .6s,transform .6s,border-color .4s}
.cvx-ms.cvx-on .cvx-mcard{opacity:1;transform:none;border-color:rgba(253,186,116,.45)}
.cvx-conf{position:absolute;left:0;top:0;width:8px;height:8px;border-radius:2px;opacity:0}
.cvx-ms.cvx-on .cvx-conf{animation:cvx-burst 1.3s cubic-bezier(.16,1,.3,1) .35s both}
.cvx-lift{transition:transform .35s cubic-bezier(.16,1,.3,1),border-color .35s}
.cvx-lift:hover{transform:translateY(-6px);border-color:rgba(253,186,116,.5)}
.cvx-img{transition:transform .9s cubic-bezier(.16,1,.3,1)}
.cvx-fig:hover .cvx-img{transform:scale(1.05)}
.cvx-chip{transition:transform .2s,border-color .2s,background .2s}
.cvx-chip:hover{transform:translateY(-2px);border-color:${ORANGE_HI}}
.cvx-poly{transition:opacity .3s}
@media (prefers-reduced-motion: reduce){
  .cvx-aur,.cvx-marq,.cvx-dot,.cvx-mic::before,.cvx-sun{animation:none!important}
  .cvx-hpath,.cvx-seg{animation:none!important;stroke-dashoffset:0!important;transition:none!important}
  .cvx-b1,.cvx-b2,.cvx-b3,.cvx-b4{animation:none!important;opacity:1!important}
  .cvx-rv{opacity:1!important;transform:none!important;transition:none!important}
  .cvx-mcard{opacity:1!important;transform:none!important}
  .cvx-ms.cvx-on .cvx-node{animation:none!important}
  .cvx-ms.cvx-on .cvx-conf{animation:none!important}
  .cvx-lift:hover,.cvx-fig:hover .cvx-img,.cvx-chip:hover{transform:none}
}
`;

// Fires `onSeen` once when the element nears the viewport.
function useSeen<T extends HTMLElement>(margin = '0px 0px -12% 0px') {
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
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, seen] as const;
}

function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'figure' }) {
  const [ref, seen] = useSeen<HTMLElement>();
  const Comp = Tag as 'div';
  return (
    <Comp ref={ref as React.RefObject<HTMLDivElement>} className={`cvx-rv ${seen ? 'cvx-in' : ''} ${className}`} style={{ '--d': `${delay}ms` } as CSSProperties}>
      {children}
    </Comp>
  );
}

function Count({ value }: { value: string }) {
  const [ref, seen] = useSeen<HTMLSpanElement>();
  const target = parseInt(value, 10);
  const [n, setN] = useState(target);
  useEffect(() => {
    if (!seen || Number.isNaN(target) || target < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const t0 = performance.now();
    setN(0);
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1300);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, target]);
  return <span ref={ref}>{Number.isNaN(target) ? value : n}</span>;
}

function SectionHead({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <Reveal className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: ORANGE_HI, fontFamily: MONO }}>{kicker}</p>
      <h2 className="mt-3 text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl" style={{ letterSpacing: '-0.02em' }}>{title}</h2>
      {children ? <p className="mt-4 text-base leading-relaxed md:text-lg" style={{ color: SOFT }}>{children}</p> : null}
    </Reveal>
  );
}

// ---------------------------------------------------------------- hero
function Hero({ theme }: { theme: ProjectTheme }) {
  return (
    <header className="relative isolate overflow-hidden">
      <div className="cvx-aur" style={{ left: '-18%', top: '-12%', width: '70%', aspectRatio: '1', background: 'radial-gradient(circle, rgba(139,92,246,.55), transparent 65%)' }} aria-hidden />
      <div className="cvx-aur" style={{ right: '-20%', bottom: '-18%', width: '75%', aspectRatio: '1', background: 'radial-gradient(circle, rgba(249,115,22,.42), transparent 65%)', animationDelay: '-6s' }} aria-hidden />
      <div className="cvx-aur" style={{ right: '10%', top: '-20%', width: '45%', aspectRatio: '1', background: 'radial-gradient(circle, rgba(217,70,239,.3), transparent 65%)', animationDelay: '-11s' }} aria-hidden />
      <div className="relative mx-auto grid min-h-[88svh] max-w-6xl items-center gap-12 px-5 pb-16 pt-24 md:px-10 md:pb-24 md:pt-36 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: ORANGE_HI, fontFamily: MONO }}>{theme.kicker}</p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold" style={{ background: 'rgba(255,255,255,.08)', border: CARD_BORDER }}>
            <span className="h-2 w-2 rounded-full" style={{ background: AURORA }} aria-hidden />
            {theme.title}
          </p>
          <h1 className="mt-6 text-[2.5rem] font-extrabold leading-[1.04] sm:text-6xl lg:text-[4.4rem]" style={{ letterSpacing: '-0.03em' }}>
            You&apos;re allowed to ask{' '}
            <span style={{ background: AURORA, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>&ldquo;what then?&rdquo;</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed md:text-xl" style={{ color: SOFT }}>
            {theme.subtitle} It listens in your voice, then draws you a map: a tree of paths, each with the next step you can take this week.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {STACK_TAGS.map((t) => (
              <li key={t} className="rounded-full px-4 py-2 text-sm font-medium" style={{ background: 'rgba(139,92,246,.2)', border: CARD_BORDER, color: CREAM }}>{t}</li>
            ))}
          </ul>
        </div>

        {/* phone-style mentor card */}
        <figure className="mx-auto w-full max-w-[340px]" aria-label="Illustrative mentor conversation">
          <div className="overflow-hidden rounded-[2rem]" style={{ background: CARD, border: '1px solid rgba(196,181,253,.28)', boxShadow: '0 30px 80px -30px rgba(139,92,246,.7)' }}>
            <div className="relative h-[170px] overflow-hidden" style={{ background: 'linear-gradient(180deg,#3B1B8F 0%,#B4338A 55%,#F97316 100%)' }}>
              <svg viewBox="0 0 340 170" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
                <g className="cvx-sun"><circle cx="232" cy="118" r="34" fill="#FFE2B8" /><circle cx="232" cy="118" r="52" fill="#FFE2B8" opacity=".18" /></g>
                <path d="M0 150 C60 140 110 160 170 150 S290 138 340 148 V170 H0Z" fill="#2A1466" />
                <path pathLength={1} className="cvx-hpath" d="M20 166 C90 150 40 120 120 112 S220 120 196 92 S262 76 300 60" fill="none" stroke="#FFF8EE" strokeWidth="3" strokeLinecap="round" strokeDasharray="1" />
                <circle cx="300" cy="60" r="5" fill="#FFF8EE" />
              </svg>
              <p className="absolute left-4 top-3 text-xs font-semibold uppercase tracking-widest" style={{ color: CREAM, fontFamily: MONO }}>Mentor</p>
            </div>
            <div className="space-y-3 p-4" style={{ minHeight: 250 }}>
              <div className="cvx-b1 ml-auto max-w-[86%] rounded-2xl rounded-br-md px-4 py-3 text-sm leading-snug" style={{ background: AURORA, color: '#1A0B33', fontWeight: 600 }}>
                What would I actually be good at?
              </div>
              <div className="cvx-b2 max-w-[90%] rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-snug" style={{ background: 'rgba(255,255,255,.1)', border: CARD_BORDER }}>
                I&apos;m listening. Then I&apos;ll draw you a map, with a next step you can take this week.
              </div>
              <div className="cvx-b3 ml-auto max-w-[86%] rounded-2xl rounded-br-md px-4 py-3 text-sm leading-snug" style={{ background: AURORA, color: '#1A0B33', fontWeight: 600 }}>
                And what does it feel like in five years?
              </div>
              <div className="cvx-b4 inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md px-4 py-3" style={{ background: 'rgba(255,255,255,.1)', border: CARD_BORDER }} aria-label="Mentor is typing">
                <span className="cvx-dot" /><span className="cvx-dot" /><span className="cvx-dot" />
              </div>
            </div>
            <div className="flex items-center gap-3 border-t px-4 py-3" style={{ borderColor: 'rgba(196,181,253,.18)' }}>
              <div className="flex-1 rounded-full px-4 py-2.5 text-sm" style={{ background: 'rgba(255,255,255,.07)', color: SOFT }}>Speak or type</div>
              <span className="cvx-mic relative flex h-11 w-11 items-center justify-center rounded-full" style={{ background: ORANGE }} aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A0B33" strokeWidth="2.4" strokeLinecap="round" className="relative"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
              </span>
            </div>
          </div>
        </figure>
      </div>
    </header>
  );
}

function Marquee() {
  const row = [...PROMISES, ...PROMISES, ...PROMISES, ...PROMISES];
  return (
    <div className="overflow-hidden border-y py-4" style={{ borderColor: 'rgba(196,181,253,.18)', background: 'rgba(139,92,246,.1)' }} aria-label={PROMISES.join(', ')}>
      <div className="cvx-marq" aria-hidden>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {row.map((p, i) => (
              <span key={`${k}-${i}`} className="flex items-center whitespace-nowrap px-5 text-base font-semibold md:text-lg">
                {p}
                <span className="ml-10 h-2 w-2 rounded-full" style={{ background: i % 2 ? ORANGE : VIOLET_HI }} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- conversation (quotes)
function Conversation({ theme }: { theme: ProjectTheme }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28" aria-label="Conversation">
      <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <SectionHead kicker="The brief" title="Told as a conversation.">
            One Class 10 classroom, one question: what do you want to be? The answers decided the product.
          </SectionHead>
        </div>
        <ol className="space-y-10">
          {theme.story.quotes.map((q, i) => (
            <li key={q.kicker} className="space-y-3">
              <Reveal className="flex items-end gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-extrabold" style={{ background: AURORA, color: '#1A0B33' }} aria-hidden>CV</span>
                <div className="max-w-[92%] rounded-3xl rounded-bl-md px-5 py-4 md:px-6 md:py-5" style={{ background: GRADS[i % 4], border: CARD_BORDER }}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ORANGE_HI, fontFamily: MONO }}>{q.kicker}</p>
                  <blockquote className="mt-2 text-lg font-semibold leading-snug md:text-2xl" style={{ letterSpacing: '-0.01em' }}>&ldquo;{q.quote}&rdquo;</blockquote>
                </div>
              </Reveal>
              <Reveal delay={260} className="flex justify-end">
                <p className="max-w-[88%] rounded-3xl rounded-br-md px-5 py-3.5 text-sm leading-relaxed md:text-base" style={{ background: AURORA, color: '#1A0B33', fontWeight: 600 }}>{q.context}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Numbers({ theme }: { theme: ProjectTheme }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 md:px-10 md:pb-28" aria-label="Key numbers">
      <ul className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
        {theme.bigNumbers.map((b, i) => (
          <li key={b.label}>
            <Reveal delay={i * 90} className="h-full">
              <div className="cvx-lift h-full rounded-3xl p-5 md:p-7" style={{ background: GRADS[i % 4], border: CARD_BORDER }}>
                <p className="text-5xl font-extrabold leading-none md:text-6xl" style={{ background: AURORA, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                  <Count value={b.value} />
                </p>
                <p className="mt-3 text-sm font-medium leading-snug md:text-base" style={{ color: SOFT }}>{b.label}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------- roadmap (features)
const XS = [14, 46];

function Milestone({ f, i, last }: { f: { title: string; desc: string }; i: number; last: boolean }) {
  const [ref, on] = useSeen<HTMLLIElement>('0px 0px -28% 0px');
  const x = XS[i % 2];
  const nx = XS[(i + 1) % 2];
  const conf = Array.from({ length: 12 }, (_, k) => {
    const a = (k / 12) * Math.PI * 2;
    const r = 46 + (k % 3) * 14;
    return { x: Math.round(Math.cos(a) * r), y: Math.round(Math.sin(a) * r), c: [ORANGE, VIOLET_HI, '#F472B6', ORANGE_HI][k % 4] };
  });
  return (
    <li ref={ref} className={`cvx-ms relative pb-9 pl-[78px] md:pb-12 ${on ? 'cvx-on' : ''}`}>
      {!last && (
        <svg className="absolute left-0 w-[60px]" style={{ top: 28, height: '100%' }} viewBox="0 0 60 100" preserveAspectRatio="none" aria-hidden>
          <path d={`M${x} 0 C${x} 55, ${nx} 45, ${nx} 100`} fill="none" stroke="rgba(196,181,253,.28)" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" />
          <path pathLength={1} className="cvx-seg" d={`M${x} 0 C${x} 55, ${nx} 45, ${nx} 100`} fill="none" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" />
        </svg>
      )}
      <span className="cvx-node absolute z-10 h-[22px] w-[22px] rounded-full border-[3px]" style={{ left: x, top: 28, transform: 'translate(-50%,-50%)' }} aria-hidden>
        {last && conf.map((c, k) => (
          <span key={k} className="cvx-conf" style={{ background: c.c, '--x': `${c.x}px`, '--y': `${c.y}px` } as CSSProperties} />
        ))}
      </span>
      <div className="cvx-mcard rounded-3xl p-5 md:p-7" style={{ background: GRADS[i % 4], border: CARD_BORDER }}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: ORANGE_HI, fontFamily: MONO }}>Milestone {String(i + 1).padStart(2, '0')}</p>
        <h3 className="mt-2 text-xl font-bold md:text-2xl">{f.title}</h3>
        <p className="mt-2 text-base leading-relaxed" style={{ color: SOFT }}>{f.desc}</p>
      </div>
    </li>
  );
}

function Roadmap({ theme }: { theme: ProjectTheme }) {
  return (
    <section className="relative border-t py-20 md:py-28" style={{ borderColor: 'rgba(196,181,253,.14)', background: 'linear-gradient(180deg,#12082B 0%,#1A0C3A 50%,#12082B 100%)' }} aria-labelledby="cvx-road">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:px-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: ORANGE_HI, fontFamily: MONO }}>The path on screen one</p>
            <h2 id="cvx-road" className="mt-3 text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl" style={{ letterSpacing: '-0.02em' }}>A map, not a top&#8209;3 list.</h2>
            <p className="mt-4 text-base leading-relaxed md:text-lg" style={{ color: SOFT }}>
              Scroll the line. Every milestone below lights up as the path reaches it, the way the roadmap in the app draws itself segment by segment.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-8 hidden overflow-hidden rounded-3xl lg:block">
            <div className="relative aspect-[4/5]" style={{ border: CARD_BORDER, borderRadius: 24, overflow: 'hidden' }}>
              <Image src={theme.heroImage} alt={`${theme.title} preview`} fill sizes="(min-width:1024px) 400px, 0px" className="object-cover" loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(18,8,43,.1) 30%, rgba(124,58,237,.55) 100%)' }} />
              <p className="absolute bottom-4 left-4 right-4 text-sm font-semibold" style={{ fontFamily: MONO, color: CREAM }}>FIRST · STEP</p>
            </div>
          </Reveal>
        </div>
        <ol className="pt-2">
          {theme.features.map((f, i) => (
            <Milestone key={f.title} f={f} i={i} last={i === theme.features.length - 1} />
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- scorer radar
function Scorer() {
  const [scores, setScores] = useState([0.8, 0.6, 0.4, 0.75, 0.3]);
  const R = 105;
  const C = 150;
  const pt = (i: number, s: number) => {
    const a = (-90 + 72 * i) * (Math.PI / 180);
    return [Math.round((C + R * s * Math.cos(a)) * 10) / 10, Math.round((C + R * s * Math.sin(a)) * 10) / 10] as const;
  };
  const ring = (s: number) => CATS.map((_, i) => pt(i, s).join(',')).join(' ');
  const poly = scores.map((s, i) => pt(i, s).join(',')).join(' ');
  const verdict = (s: number) => (s >= 0.7 ? 'Strength' : s < 0.5 ? 'Improvement area' : 'In between');
  const strengths = scores.filter((s) => s >= 0.7).length;
  const weak = scores.filter((s) => s < 0.5).length;
  const bump = (i: number) => setScores((p) => p.map((v, k) => (k === i ? LEVELS[(LEVELS.indexOf(v) + 1) % LEVELS.length] : v)));

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28" aria-labelledby="cvx-score">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: ORANGE_HI, fontFamily: MONO }}>Categorical scorer</p>
            <h2 id="cvx-score" className="mt-3 text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl" style={{ letterSpacing: '-0.02em' }}>Five categories. Scores from 0 to 1.</h2>
            <p className="mt-4 text-base leading-relaxed md:text-lg" style={{ color: SOFT }}>
              At 0.7 or above a category becomes a strength. Below 0.5 it becomes an improvement area. Tap a category to try it.
            </p>
          </Reveal>
          <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
            {CATS.map((c, i) => {
              const s = scores[i];
              const v = verdict(s);
              return (
                <li key={c} className={i === 4 ? 'sm:col-span-2' : ''}>
                  <button
                    type="button"
                    onClick={() => bump(i)}
                    aria-label={`${c}, score ${s}, ${v}. Tap to change.`}
                    className="cvx-chip flex min-h-[52px] w-full items-center gap-3 rounded-2xl px-4 py-2 text-left"
                    style={{ background: 'rgba(255,255,255,.06)', border: CARD_BORDER, color: CREAM }}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold" style={{ background: AURORA, color: '#1A0B33' }}>{i + 1}</span>
                    <span className="flex-1 text-sm font-semibold">{c}<span className="block text-xs font-medium" style={{ color: s >= 0.7 ? ORANGE_HI : s < 0.5 ? VIOLET_HI : SOFT }}>{v}</span></span>
                    <span className="text-base font-bold" style={{ fontFamily: MONO }}>{s.toFixed(2)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-sm" style={{ color: SOFT }} aria-live="polite">{strengths} strengths, {weak} improvement areas.</p>
        </div>
        <Reveal className="mx-auto w-full max-w-[440px]">
          <div className="rounded-[2rem] p-4 md:p-6" style={{ background: GRADS[2], border: CARD_BORDER }}>
            <svg viewBox="0 0 300 300" className="block h-auto w-full" role="img" aria-label={`Radar chart of five categories: ${CATS.map((c, i) => `${c} ${scores[i]}`).join(', ')}`}>
              <defs>
                <linearGradient id="cvx-rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={VIOLET} stopOpacity=".85" /><stop offset="1" stopColor={ORANGE} stopOpacity=".8" /></linearGradient>
              </defs>
              <polygon points={ring(1)} fill="none" stroke="rgba(196,181,253,.25)" />
              <polygon points={ring(0.7)} fill="none" stroke={ORANGE_HI} strokeDasharray="4 4" opacity=".8" />
              <polygon points={ring(0.5)} fill="none" stroke={VIOLET_HI} strokeDasharray="2 5" opacity=".8" />
              {CATS.map((_, i) => <line key={i} x1={C} y1={C} x2={pt(i, 1)[0]} y2={pt(i, 1)[1]} stroke="rgba(196,181,253,.2)" />)}
              <polygon className="cvx-poly" points={poly} fill="url(#cvx-rg)" stroke={CREAM} strokeWidth="2" strokeLinejoin="round" />
              {scores.map((s, i) => {
                const [x, y] = pt(i, 1.2);
                const [px, py] = pt(i, s);
                return (
                  <g key={i}>
                    <circle cx={px} cy={py} r="5" fill={CREAM} />
                    <text x={x} y={y + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill={CREAM} fontFamily="monospace">{i + 1}</text>
                  </g>
                );
              })}
            </svg>
            <p className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs" style={{ color: SOFT, fontFamily: MONO }}>
              <span style={{ color: ORANGE_HI }}>- - 0.7 strength</span>
              <span style={{ color: VIOLET_HI }}>· · 0.5 improvement</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- stack
function Stack({ theme }: { theme: ProjectTheme }) {
  return (
    <section className="border-t py-20 md:py-28" style={{ borderColor: 'rgba(196,181,253,.14)', background: '#160A33' }} aria-labelledby="cvx-stack">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: ORANGE_HI, fontFamily: MONO }}>Under the path</p>
          <h2 id="cvx-stack" className="mt-3 text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl" style={{ letterSpacing: '-0.02em' }}>Four layers, one budget phone.</h2>
        </Reveal>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {theme.architecture.map((a, i) => (
            <li key={a.layer}>
              <Reveal delay={i * 100} className="h-full">
                <div className="cvx-lift h-full rounded-3xl p-6" style={{ background: GRADS[i % 4], border: CARD_BORDER }}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold" style={{ background: AURORA, color: '#1A0B33' }}>{i + 1}</span>
                  <h3 className="mt-5 text-xl font-bold">{a.layer}</h3>
                  <p className="mt-2 text-base leading-relaxed" style={{ color: SOFT }}>{a.details}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- gallery + outcome
function Gallery({ theme }: { theme: ProjectTheme }) {
  const picks = theme.gallery ?? [];
  if (!picks.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
      <SectionHead kicker="Moodboard" title="Where the path starts." />
      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {picks.map((g, i) => (
          <li key={g.src}>
            <Reveal as="figure" delay={(i % 2) * 100} className="cvx-fig">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl" style={{ border: CARD_BORDER, background: CARD }}>
                <Image src={g.src} alt={g.alt} fill sizes="(min-width:1152px) 380px, (min-width:768px) 45vw, 92vw" className="cvx-img object-cover" loading="eager" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(18,8,43,.9) 100%)' }} />
                <p className="absolute bottom-4 left-5 right-5 text-sm font-semibold" style={{ fontFamily: MONO }}>{g.caption}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Outcome({ theme }: { theme: ProjectTheme }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 md:px-10" aria-label="Outcome">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] px-6 py-14 text-center md:px-16 md:py-24" style={{ background: 'linear-gradient(160deg,#3B1B8F 0%,#8B2F9E 52%,#E8631A 100%)' }}>
          <div className="cvx-aur" style={{ left: '-10%', top: '-30%', width: '60%', aspectRatio: '1', background: 'radial-gradient(circle, rgba(255,226,184,.35), transparent 65%)' }} aria-hidden />
          <p className="relative text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: '#FFE2B8', fontFamily: MONO }}>The outcome</p>
          <blockquote className="relative mx-auto mt-5 max-w-3xl text-2xl font-bold leading-snug sm:text-3xl md:text-5xl" style={{ letterSpacing: '-0.02em', textShadow: '0 2px 24px rgba(18,8,43,.35)' }}>
            &ldquo;{theme.outcomeQuote}&rdquo;
          </blockquote>
        </div>
      </Reveal>
    </section>
  );
}

export default function Page({ theme }: { theme: ProjectTheme }) {
  return (
    <main className="cvx-root">
      <style>{CSS}</style>
      <Hero theme={theme} />
      <Marquee />
      <Conversation theme={theme} />
      <Numbers theme={theme} />
      <Roadmap theme={theme} />
      <Scorer />
      <Stack theme={theme} />
      <Gallery theme={theme} />
      <Outcome theme={theme} />
      <NextChapter currentSlug={theme.slug} accent={ORANGE} />
      <SiteFooter />
    </main>
  );
}
