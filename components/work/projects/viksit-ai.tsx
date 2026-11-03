'use client';

// Viksit.AI: AI WORKSPACE IDE microsite. The page is an editor window: file tree, tabs,
// typing code, a command palette for the features, an SVG data-flow for the architecture.
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as KEvent, type ReactNode } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import type { ProjectTheme } from '@/lib/project-themes';
import NextChapter from '@/components/work/NextChapter';
import SiteFooter from '@/components/global/SiteFooter';

const SPACE = "var(--font-space), 'Space Grotesk', system-ui, sans-serif";
const MONO = "var(--font-plex), 'IBM Plex Mono', ui-monospace, monospace";

// ---------- tiny syntax highlighter (computed once at module load) ----------
type Seg = { t: string; c: string };
const C = { com: '#8190B5', str: '#67E8F9', key: '#C4B5FD', txt: '#E5E7EB' };
const TOKEN = /(\/\/.*|#.*)|("[^"]*"|'[^']*'|`[^`]*`)|\b(const|await|for|in|import|from)\b/g;
function hl(line: string): Seg[] {
  const out: Seg[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ t: line.slice(last, i), c: C.txt });
    out.push({ t: m[0], c: m[1] ? C.com : m[2] ? C.str : C.key });
    last = i + m[0].length;
  }
  if (last < line.length) out.push({ t: line.slice(last), c: C.txt });
  return out.length ? out : [{ t: '', c: C.txt }];
}

type FileDef = { name: string; dir: string; code: string[]; out: string };
const FILES: FileDef[] = [
  {
    name: 'chat.tsx', dir: 'pages',
    code: ['// Main: Groq chatbot', 'const res = await fetch("/api/query-repository/", {', '  method: "POST",', '  body: JSON.stringify({ query, context }),', '});', 'reveal(res); // typing reveal, 18ms per char'],
    out: 'first token under 300ms, answer types in like a person',
  },
  {
    name: 'editor.tsx', dir: 'pages',
    code: ['// Code Editor: Monaco + JDoodle', "const code = 'print(\"hello\")';", 'const run = await api.post("/api/execute-code/", { code });', 'terminal.print(run.output);'],
    out: 'hello',
  },
  {
    name: 'repo.ts', dir: 'github_app',
    code: ['// Repo Explorer', 'const { repos } = await api.get(`/api/repositories/${user}/`);', 'const tree = await api.get(`/api/repo-structure/${user}/${repo}/`);', 'ask(tree, "where do I start reading?");'],
    out: 'what it does / how it is organized / where to start reading',
  },
  {
    name: 'search.ts', dir: 'github_app',
    code: ['// Google CSE, summarized by Groq', 'const hits = await api.post("/api/google-search/", { q });', 'show(summary(hits)); // one paragraph + see also'],
    out: '10 raw results become one paragraph and a see-also list',
  },
  {
    name: 'voice.ts', dir: 'pages',
    code: ['// Sarvam voice channel', 'const lang = "hi"; // hindi, tamil, bengali, telugu...', 'mic.stream((chunk) => stt(chunk, lang));', 'speak(await groq(text), lang);'],
    out: 'speech in, Groq answer, speech out, in your language',
  },
  {
    name: 'operator.py', dir: 'streamlit',
    code: ['# Streamlit operator panel, port 8501', 'st.title("Reasoning inspector")', 'for p in prompts:', '    st.code(p.completion)'],
    out: 'model input and output side by side, no redeploy',
  },
];
const LINES = FILES.map((f) => f.code.map(hl));
const lineLen = (s: Seg[]) => s.reduce((a, x) => a + x.t.length, 0) + 1;

const VERBS = ['ask', 'run', 'repo', 'search', 'speak', 'inspect'];
const STACK = ['Groq', 'JDoodle', 'GitHub', 'Sarvam', 'Google CSE', 'Firebase', 'Monaco', 'Streamlit'];
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------- hooks ----------
function useInView<T extends Element>(margin = '0px 0px -8% 0px') {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: margin, threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, on] as const;
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, on] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`va-rv ${on ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Count({ to, on, reduce }: { to: number; on: boolean; reduce: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!on) return;
    if (reduce) { setV(to); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1300);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, to, reduce]);
  return <>{v}</>;
}

// ---------- code view ----------
function CodeLines({ lines, count }: { lines: Seg[][]; count: number }) {
  let left = count;
  const rows: ReactNode[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (left <= 0 && i > 0) break;
    const len = lineLen(lines[i]);
    const current = left < len && left >= 0 && count !== Infinity;
    let l = left;
    const parts = lines[i].map((s, j) => {
      const take = Math.max(0, Math.min(s.t.length, l));
      l -= s.t.length;
      return take ? <span key={j} style={{ color: s.c, fontStyle: s.c === C.com ? 'italic' : undefined }}>{s.t.slice(0, take)}</span> : null;
    });
    rows.push(
      <div key={i} className="va-ln">
        <span className="va-num" aria-hidden>{i + 1}</span>
        <span>{parts}{current && <span className="va-caret" />}{'​'}</span>
      </div>,
    );
    left -= len;
  }
  return <>{rows}</>;
}

function Typer({ idx, reduce }: { idx: number; reduce: boolean }) {
  const lines = LINES[idx];
  const total = lines.reduce((s, l) => s + lineLen(l), 0);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduce) { setN(total); return; }
    let id = 0;
    const t = window.setTimeout(() => {
      id = window.setInterval(() => setN((v) => (v >= total ? v : v + 2)), 30);
    }, 300);
    return () => { window.clearTimeout(t); window.clearInterval(id); };
  }, [reduce, total]);
  const done = n >= total;
  return (
    <div>
      <p className="sr-only">{FILES[idx].code.join('\n')}</p>
      <div className="grid text-[12.5px] leading-[1.75] sm:text-[13.5px]" style={{ fontFamily: MONO }} aria-hidden>
        <div style={{ gridArea: '1/1', visibility: 'hidden' }}><CodeLines lines={lines} count={Infinity} /></div>
        <div style={{ gridArea: '1/1' }}><CodeLines lines={lines} count={n} /></div>
      </div>
      <div className="mt-3 border-t border-[#1C2640] pt-3 text-[12.5px] leading-6 sm:text-[13px]" style={{ fontFamily: MONO, visibility: done ? 'visible' : 'hidden' }}>
        <div style={{ color: '#8E98B3' }}>$ viksit run {FILES[idx].name}</div>
        <div className="va-out" style={{ color: '#5EEAD4' }}>
          <span aria-hidden>&gt; </span>{FILES[idx].out}
        </div>
      </div>
    </div>
  );
}

// ---------- section head ----------
function Head({ file, title, id }: { file: string; title: string; id?: string }) {
  return (
    <div className="mb-6 md:mb-12" id={id}>
      <p className="mb-3 flex items-center gap-2 text-[12px] uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: '#8E98B3' }}>
        <span className="inline-block h-2 w-2 rounded-sm" style={{ background: 'var(--va-b)' }} />
        {file}
      </p>
      <h2 className="text-[clamp(1.9rem,6vw,3.4rem)] font-bold leading-[1.05] tracking-tight" style={{ fontFamily: SPACE, color: '#F3F4F6' }}>
        {title}
      </h2>
    </div>
  );
}

// ---------- page ----------
export default function Page({ theme }: { theme: ProjectTheme }) {
  const reduce = !!useReducedMotion();
  const [open, setOpen] = useState<number[]>([0, 1]);
  const [active, setActive] = useState(0);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const [ran, setRan] = useState<number | null>(null);
  const [runKey, setRunKey] = useState(0);
  const run = (i: number) => { setRan(i); setRunKey((k) => k + 1); };
  const [shot, setShot] = useState(0);
  const [archRef, archOn] = useInView<HTMLDivElement>();
  const [numRef, numOn] = useInView<HTMLDivElement>();

  const gallery = theme.gallery && theme.gallery.length
    ? theme.gallery
    : Array.from({ length: 6 }, (_, i) => ({ src: `/work/viksit-ai/gallery-${i + 1}.jpg`, caption: `FRAME ${i + 1}`, alt: `Viksit.AI visual reference ${i + 1}` }));

  const openFile = (i: number) => {
    setOpen((o) => (o.includes(i) ? o : [...o.slice(-2), i]));
    setActive(i);
  };

  const needle = q.trim().toLowerCase();
  const matches = theme.features.map((f, i) => i).filter((i) => {
    const f = theme.features[i];
    return !needle || `${VERBS[i]} ${f.title} ${f.desc}`.toLowerCase().includes(needle);
  });
  const cur = matches.includes(sel) ? sel : matches[0];
  const choose = (i: number) => { setSel(i); setRan(null); };
  const onKey = (e: KEvent) => {
    if (!matches.length) return;
    const p = matches.indexOf(cur);
    if (e.key === 'ArrowDown') { e.preventDefault(); choose(matches[(p + 1) % matches.length]); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); choose(matches[(p - 1 + matches.length) % matches.length]); }
    else if (e.key === 'Enter') { e.preventDefault(); run(cur); }
  };

  const svc = ['Groq', 'JDoodle', 'GitHub', 'Sarvam', 'Google CSE'];
  const draw = (d: number): CSSProperties => ({ transitionDelay: `${d}ms` });

  return (
    <div
      className="va-root relative min-h-svh overflow-x-clip"
      style={{ '--va-a': theme.palette.accent, '--va-b': theme.palette.accent2 ?? '#3B82F6', '--va-cy': '#22D3EE', background: '#070A12', color: theme.palette.text, fontFamily: SPACE } as CSSProperties}
    >
      <style>{`
        .va-root *{box-sizing:border-box}
        .va-root ::selection{background:#8B5CF655}
        .va-f:focus-visible,.va-root a:focus-visible,.va-root input:focus-visible,.va-root button:focus-visible{outline:2px solid #22D3EE;outline-offset:2px}
        .va-grid{background-image:linear-gradient(rgba(139,92,246,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.07) 1px,transparent 1px);background-size:44px 44px;-webkit-mask-image:linear-gradient(#000 0,transparent 720px);mask-image:linear-gradient(#000 0,transparent 720px)}
        .va-ln{display:grid;grid-template-columns:2ch 1fr;gap:1.1em;white-space:pre-wrap;overflow-wrap:anywhere}
        .va-num{color:#5B6788;text-align:right;user-select:none}
        .va-caret{display:inline-block;width:.55em;height:1.1em;margin-left:1px;vertical-align:text-bottom;background:#22D3EE;animation:va-blink 1s steps(2,start) infinite}
        .va-out{animation:va-fade .5s .1s both}
        .va-rv{opacity:0;transform:translateY(16px);transition:opacity .6s ease,transform .6s ease}
        .va-rv.in{opacity:1;transform:none}
        .va-marq{display:flex;width:max-content;animation:va-marq 32s linear infinite}
        .va-fade{animation:va-fade .5s both}
        .va-sweep{transform-origin:left;animation:va-sweep .9s ease-out both}
        .va-ln-draw{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.1s ease}
        .in .va-ln-draw{stroke-dashoffset:0}
        .va-flow{stroke-dasharray:2 10;animation:va-flow 1.4s linear infinite;opacity:0;transition:opacity .6s 1.2s}
        .in .va-flow{opacity:1}
        .va-box{opacity:0;transition:opacity .6s}
        .in .va-box{opacity:1}
        .va-tab{transition:transform .15s ease,background-color .2s,border-color .2s}
        .va-tab:hover{transform:translateY(-2px)}
        .va-chip{transition:transform .7s cubic-bezier(.2,.8,.2,1),opacity .7s}
        .in .va-chip:not(.va-keep){opacity:.32;transform:translateY(8px) scale(.9)}
        .va-card{transition:transform .2s ease,border-color .2s ease}
        .va-card:hover{transform:translateY(-3px);border-color:#8B5CF6}
        @keyframes va-blink{to{visibility:hidden}}
        @keyframes va-marq{to{transform:translateX(-50%)}}
        @keyframes va-fade{from{opacity:0}to{opacity:1}}
        @keyframes va-sweep{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        @keyframes va-flow{to{stroke-dashoffset:-24}}
        @media (prefers-reduced-motion:reduce){
          .va-caret,.va-marq,.va-flow,.va-sweep,.va-out,.va-fade{animation:none!important}
          .va-rv{opacity:1;transform:none;transition:none}
          .va-ln-draw{stroke-dashoffset:0;transition:none}
          .va-box{opacity:1;transition:none}
          .va-chip,.va-tab,.va-card{transition:none}
          .va-flow{opacity:1;transition:none}
        }
      `}</style>
      <div className="va-grid pointer-events-none absolute inset-x-0 top-0 h-[720px]" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px]" aria-hidden style={{ background: 'radial-gradient(ellipse 60% 60% at 15% 0%, rgba(139,92,246,.22), transparent 70%), radial-gradient(ellipse 50% 50% at 90% 10%, rgba(34,211,238,.12), transparent 70%)' }} />

      <main className="relative mx-auto w-full max-w-6xl px-4 pb-28 pt-24 md:px-8 md:pb-32 md:pt-36 xl:max-w-[88rem] xl:pl-[17.5rem] xl:pr-12">
        {/* ============ HERO ============ */}
        <header>
          <p className="mb-5 text-[12px] uppercase tracking-[0.16em] md:text-[13px]" style={{ fontFamily: MONO, color: '#A5B0CC' }}>
            {theme.kicker}
          </p>
          <div className="grid items-end gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
            <h1 className="text-[clamp(3.2rem,14vw,8.5rem)] font-bold leading-[0.92] tracking-[-0.04em]">
              <span style={{ background: 'linear-gradient(100deg,#F5F3FF 10%,#C4B5FD 45%,#22D3EE 95%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                {theme.title}
              </span>
              <span className="va-caret" aria-hidden style={{ height: '.72em', width: '.34em', marginLeft: '.08em', verticalAlign: 'baseline' }} />
            </h1>
            <div>
              <p className="text-[clamp(1.15rem,3.4vw,1.6rem)] font-medium leading-snug" style={{ color: '#E5E7EB' }}>{theme.subtitle}</p>
              <p className="mt-3 text-[15px] leading-relaxed" style={{ color: '#A5B0CC' }}>
                Stop tab-switching. Start shipping. One workspace where the assistant codes, searches and talks in your language.
              </p>
              <a href="#va-commands" className="va-f mt-5 inline-flex min-h-[44px] items-center gap-3 rounded-lg border border-[#2A3558] bg-[#0B1120] px-4 text-[14px] transition-colors hover:border-[#8B5CF6]" style={{ color: '#E5E7EB' }}>
                <span style={{ fontFamily: MONO, color: '#22D3EE' }}>&gt;</span>
                Open the command palette
                <kbd className="rounded border border-[#2A3558] px-1.5 py-0.5 text-[11px]" style={{ fontFamily: MONO, color: '#A5B0CC' }}>Ctrl K</kbd>
              </a>
            </div>
          </div>

          {/* IDE window */}
          <div className="mt-10 overflow-hidden rounded-xl border border-[#243052] bg-[#0A0F1A] shadow-[0_30px_80px_-30px_rgba(139,92,246,.45)] md:mt-14">
            <div className="flex items-center gap-2 border-b border-[#1C2640] bg-[#0D1424] px-3 py-2.5">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" /><span className="h-3 w-3 rounded-full bg-[#FEBC2E]" /><span className="h-3 w-3 rounded-full bg-[#28C840]" />
              <span className="ml-2 min-w-0 flex-1 truncate text-center text-[12px]" style={{ fontFamily: MONO, color: '#8E98B3' }}>viksit-ai / workspace</span>
              <span className="hidden text-[12px] sm:inline" style={{ fontFamily: MONO, color: '#5EEAD4' }}>● one tab</span>
            </div>
            <div className="grid md:grid-cols-[190px_1fr]">
              <nav aria-label="Workspace files" className="border-b border-[#1C2640] bg-[#0B1120] p-2 md:border-b-0 md:border-r">
                <p className="px-2 pb-1 pt-1 text-[11px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: '#8E98B3' }}>Explorer</p>
                <div className="grid grid-cols-2 gap-1 md:grid-cols-1">
                  {FILES.map((f, i) => (
                    <button key={f.name} onClick={() => openFile(i)} aria-current={active === i} className="va-f flex min-h-[40px] items-center gap-2 rounded-md px-2 text-left text-[13px] transition-colors hover:bg-[#151D33]" style={{ fontFamily: MONO, color: active === i ? '#F3F4F6' : '#A5B0CC', background: active === i ? '#1A2340' : undefined }}>
                      <span aria-hidden style={{ color: i === 5 ? '#FBBF24' : '#22D3EE' }}>{i === 5 ? '◇' : '▪'}</span>
                      <span className="truncate">{f.name}</span>
                    </button>
                  ))}
                </div>
              </nav>
              <div className="min-w-0">
                <div className="flex overflow-x-auto border-b border-[#1C2640] bg-[#0D1424]" role="tablist">
                  {open.map((i) => (
                    <button key={i} role="tab" aria-selected={active === i} onClick={() => setActive(i)} className="va-f min-h-[42px] shrink-0 border-r border-[#1C2640] px-4 text-[13px]" style={{ fontFamily: MONO, color: active === i ? '#F3F4F6' : '#8E98B3', background: active === i ? '#0A0F1A' : 'transparent', boxShadow: active === i ? 'inset 0 2px 0 #8B5CF6' : undefined }}>
                      {FILES[i].name}
                    </button>
                  ))}
                </div>
                <div className="grid gap-0 lg:grid-cols-[1fr_300px]">
                  <div className="min-w-0 p-4 md:p-5">
                    <Typer key={active} idx={active} reduce={reduce} />
                  </div>
                  <div className="border-t border-[#1C2640] p-4 lg:border-l lg:border-t-0">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: '#8E98B3' }}>Preview</p>
                    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border border-[#243052]">
                      <Image src={theme.heroImage} alt="Viksit.AI workspace preview" fill priority sizes="(min-width:1024px) 300px, 90vw" className="object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#1C2640] bg-[#1E1B4B] px-3 py-2 text-[12px]" style={{ fontFamily: MONO, color: '#E0E7FF' }}>
              <span>main</span><span>Firebase auth</span><span>8 pages</span><span className="ml-auto" style={{ color: '#A5F3FC' }}>UTF-8</span>
            </div>
          </div>

          <div className="mt-6 overflow-hidden border-y border-[#1C2640] py-3" aria-label={`Built with ${STACK.join(', ')}`}>
            <div className="va-marq" aria-hidden>
              {[0, 1].map((k) => (
                <div key={k} className="flex shrink-0 items-center">
                  {STACK.map((s) => (
                    <span key={s + k} className="mx-5 text-[13px] uppercase tracking-[0.2em]" style={{ fontFamily: MONO, color: '#8E98B3' }}>
                      <span style={{ color: '#8B5CF6' }}>+ </span>{s}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ============ STORY ============ */}
        <section className="pt-24 md:pt-24" aria-labelledby="va-story">
          <Head file="story.md" title="One tab instead of eleven." id="va-story" />
          <div className="grid gap-4 md:grid-cols-2">
            {theme.story.quotes.map((qt, i) => (
              <Reveal key={qt.kicker} delay={i * 90} className={i === 0 ? 'md:col-span-2' : ''}>
                <figure className="h-full rounded-xl border border-[#243052] bg-[#0B1120] p-5 md:p-8" style={{ borderLeft: `3px solid ${i === 1 ? '#22D3EE' : '#8B5CF6'}` }}>
                  <figcaption className="mb-4 flex items-center gap-3 text-[12px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: '#8E98B3' }}>
                    <span style={{ color: '#C4B5FD' }}>{String(i + 1).padStart(2, '0')}</span>{qt.kicker}
                  </figcaption>
                  <blockquote className={`font-semibold leading-[1.15] tracking-tight ${i === 0 ? 'text-[clamp(1.7rem,5.4vw,3.2rem)]' : 'text-[clamp(1.3rem,3.4vw,1.8rem)]'}`} style={{ color: '#F3F4F6' }}>
                    {qt.quote}
                  </blockquote>
                  <p className="mt-4 text-[13.5px] leading-relaxed" style={{ fontFamily: MONO, color: '#8190B5' }}>// {qt.context}</p>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============ COMMANDS ============ */}
        <section className="pt-24 md:pt-24" aria-labelledby="va-commands-h">
          <Head file="command-palette" title="Every feature is a command." id="va-commands" />
          <h3 id="va-commands-h" className="sr-only">Feature command palette</h3>
          <Reveal>
            <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
              <div className="overflow-hidden rounded-xl border border-[#3B2F6B] bg-[#0B1120] shadow-[0_24px_70px_-30px_rgba(139,92,246,.5)]">
                <div className="flex items-center gap-3 border-b border-[#1C2640] px-4">
                  <span aria-hidden style={{ fontFamily: MONO, color: '#22D3EE' }}>&gt;</span>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={onKey}
                    placeholder="Type a command or search"
                    aria-label="Search commands"
                    role="combobox"
                    aria-expanded="true"
                    aria-controls="va-list"
                    aria-activedescendant={cur !== undefined ? `va-opt-${cur}` : undefined}
                    className="min-h-[52px] w-full bg-transparent text-[15px] placeholder:text-[#7B85A0]"
                    style={{ fontFamily: MONO, color: '#F3F4F6', outline: 'none' }}
                  />
                  <kbd className="hidden rounded border border-[#2A3558] px-1.5 py-0.5 text-[11px] sm:block" style={{ fontFamily: MONO, color: '#8E98B3' }}>esc</kbd>
                </div>
                <ul id="va-list" role="listbox" aria-label="Commands" className="p-2">
                  {matches.map((i) => {
                    const on = i === cur;
                    return (
                      <li key={i} id={`va-opt-${i}`} role="option" aria-selected={on} onClick={() => choose(i)} onDoubleClick={() => run(i)} className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-[#151D33]" style={{ background: on ? '#1E1B4B' : undefined, boxShadow: on ? 'inset 2px 0 0 #8B5CF6' : undefined }}>
                        <span className="w-[4.6rem] shrink-0 text-[12px]" style={{ fontFamily: MONO, color: on ? '#67E8F9' : '#8E98B3' }}>/{VERBS[i]}</span>
                        <span className="min-w-0 flex-1 truncate text-[15px] font-medium" style={{ color: on ? '#F3F4F6' : '#D1D5DB' }}>{theme.features[i].title}</span>
                        <span aria-hidden className="text-[12px]" style={{ fontFamily: MONO, color: on ? '#C4B5FD' : '#5B6788' }}>{on ? '↵' : `0${i + 1}`}</span>
                      </li>
                    );
                  })}
                  {!matches.length && <li className="px-3 py-6 text-[14px]" style={{ fontFamily: MONO, color: '#8E98B3' }}>No command matches &quot;{q}&quot;</li>}
                </ul>
                <p className="border-t border-[#1C2640] px-4 py-2.5 text-[12px]" style={{ fontFamily: MONO, color: '#8E98B3' }}>↑↓ to move, ↵ to run, or tap a command</p>
              </div>

              <div className="flex min-h-[260px] flex-col rounded-xl border border-[#243052] bg-[#0A0F1A] p-5 md:p-6" aria-live="polite">
                {cur !== undefined ? (
                  <>
                    <p className="text-[12px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: '#8E98B3' }}>/{VERBS[cur]}</p>
                    <h3 key={cur} className="va-fade mt-2 text-[1.6rem] font-bold leading-tight" style={{ color: '#F3F4F6' }}>{theme.features[cur].title}</h3>
                    <p key={`d${cur}`} className="va-fade mt-3 text-[15.5px] leading-relaxed" style={{ color: '#C7CEE0' }}>{theme.features[cur].desc}</p>
                    <div className="mt-auto pt-6">
                      <button onClick={() => run(cur)} className="va-f inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#8B5CF6] px-4 text-[14px] transition-colors hover:bg-[#1E1B4B]" style={{ fontFamily: MONO, color: '#E9E4FF' }}>
                        <span aria-hidden>▶</span> run command
                      </button>
                      {ran === cur && (
                        <div key={`r${runKey}`} className="mt-4 rounded-lg border border-[#1C2640] bg-[#070A12] p-3 text-[12.5px] leading-6" style={{ fontFamily: MONO }}>
                          <div style={{ color: '#8E98B3' }}>$ viksit {slugify(theme.features[cur].title)}</div>
                          <div className="my-1 h-[3px] w-full overflow-hidden rounded bg-[#1C2640]"><div className="va-sweep h-full w-full" style={{ background: 'linear-gradient(90deg,#8B5CF6,#22D3EE)' }} /></div>
                          <div className="va-out" style={{ color: '#5EEAD4' }}>✓ {FILES[cur].out}</div>
                        </div>
                      )}
                    </div>
                  </>
                ) : <p style={{ fontFamily: MONO, color: '#8E98B3' }}>Nothing here yet. Try &quot;run&quot; or &quot;voice&quot;.</p>}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ============ ARCHITECTURE ============ */}
        <section className="pt-24 md:pt-24" aria-labelledby="va-arch">
          <Head file="architecture/" title="Under the hood." id="va-arch" />
          <div ref={archRef} className={`grid items-start gap-8 lg:grid-cols-[1fr_minmax(0,420px)] ${archOn ? 'in' : ''}`}>
            <ol className="space-y-3">
              {theme.architecture.map((a, i) => (
                <li key={a.layer} className="va-card rounded-xl border border-[#243052] bg-[#0B1120] p-4 md:p-5">
                  <p className="flex items-center gap-2 text-[14px]" style={{ fontFamily: MONO, color: '#C4B5FD' }}>
                    <span aria-hidden style={{ color: '#5B6788' }}>{String(i + 1).padStart(2, '0')}</span>
                    <span aria-hidden>▾</span>{a.layer}/
                  </p>
                  <p className="mt-2 text-[15.5px] leading-relaxed" style={{ color: '#D1D5DB' }}>{a.details}</p>
                </li>
              ))}
              <li className="px-1 pt-2 text-[13.5px] leading-relaxed" style={{ fontFamily: MONO, color: '#8190B5' }}>
                // ten Django endpoints expose every external service, so the frontend never holds a third-party API key
              </li>
            </ol>
            <svg viewBox="0 0 340 330" role="img" aria-label="Data flow: React and Monaco frontend calls the Django DRF API, which reaches Groq, JDoodle, GitHub, Sarvam and Google CSE. A Streamlit operator panel sits beside the API." className="mx-auto w-full max-w-[420px] rounded-xl border border-[#243052] bg-[#0A0F1A] p-2">
              {[30, 92, 154, 216, 278].map((cy, i) => (
                <g key={cy}>
                  <path d={`M120 165 C165 165 165 ${cy} 210 ${cy}`} pathLength={1} className="va-ln-draw" style={draw(300 + i * 120)} fill="none" stroke="#8B5CF6" strokeWidth="1.6" />
                  <path d={`M120 165 C165 165 165 ${cy} 210 ${cy}`} className="va-flow" fill="none" stroke="#22D3EE" strokeWidth="1.6" strokeLinecap="round" />
                  <g className="va-box" style={draw(700 + i * 120)}>
                    <rect x="210" y={cy - 20} width="124" height="40" rx="8" fill="#0F1626" stroke="#3B4A78" />
                    <text x="272" y={cy + 5} textAnchor="middle" fontSize="13" fill="#E5E7EB" fontFamily="monospace">{svc[i]}</text>
                  </g>
                </g>
              ))}
              <path d="M65 70 L65 130" pathLength={1} className="va-ln-draw" fill="none" stroke="#22D3EE" strokeWidth="1.6" />
              <path d="M65 200 L65 262" pathLength={1} className="va-ln-draw" style={draw(500)} fill="none" stroke="#FBBF24" strokeWidth="1.4" strokeDasharray="0" />
              <rect x="6" y="20" width="118" height="50" rx="8" fill="#0F1626" stroke="#22D3EE" />
              <text x="65" y="42" textAnchor="middle" fontSize="13" fill="#F3F4F6" fontFamily="monospace">React + Monaco</text>
              <text x="65" y="59" textAnchor="middle" fontSize="11" fill="#8E98B3" fontFamily="monospace">browser</text>
              <rect x="6" y="130" width="118" height="70" rx="8" fill="#1E1B4B" stroke="#8B5CF6" strokeWidth="1.6" />
              <text x="65" y="158" textAnchor="middle" fontSize="13" fill="#F3F4F6" fontFamily="monospace">Django + DRF</text>
              <text x="65" y="176" textAnchor="middle" fontSize="11" fill="#C4B5FD" fontFamily="monospace">/api/ ten verbs</text>
              <text x="65" y="190" textAnchor="middle" fontSize="11" fill="#8E98B3" fontFamily="monospace">github_app</text>
              <rect x="6" y="262" width="118" height="50" rx="8" fill="#0F1626" stroke="#FBBF24" />
              <text x="65" y="284" textAnchor="middle" fontSize="13" fill="#F3F4F6" fontFamily="monospace">Streamlit</text>
              <text x="65" y="301" textAnchor="middle" fontSize="11" fill="#8E98B3" fontFamily="monospace">operator :8501</text>
            </svg>
          </div>
        </section>

        {/* ============ NUMBERS ============ */}
        <section className="pt-24 md:pt-24" aria-labelledby="va-num">
          <Head file="diff --stat" title="The tab count, before and after." id="va-num" />
          <div ref={numRef} className={`${numOn ? 'in' : ''}`}>
            <div className="rounded-xl border border-[#243052] bg-[#0B1120] p-4 md:p-6" aria-label="Eleven browser tabs collapse into one">
              <div className="flex flex-wrap gap-2" aria-hidden>
                {Array.from({ length: 11 }, (_, i) => (
                  <span key={i} className={`va-chip ${i === 0 ? 'va-keep' : ''} rounded-md border px-3 py-2 text-[12px]`} style={{ fontFamily: MONO, transitionDelay: `${i * 70}ms`, color: i === 0 ? '#F3F4F6' : '#A5B0CC', borderColor: i === 0 ? '#8B5CF6' : '#2A3558', background: i === 0 ? '#1E1B4B' : '#0F1626' }}>
                    {i === 0 ? 'viksit.ai' : `tab ${i + 1}`}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[13.5px]" style={{ fontFamily: MONO }}>
                <span style={{ color: '#FB7185' }}>- 11 tabs</span> <span style={{ color: '#5EEAD4' }}>+ 1 tab, one identity</span>
              </p>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {theme.bigNumbers.map((b, i) => (
                <div key={b.label} className="va-card rounded-xl border border-[#243052] bg-[#0A0F1A] p-4 md:p-5">
                  <dd className="order-first text-[clamp(2.6rem,9vw,4.4rem)] font-bold leading-none tracking-tight" style={{ color: i % 2 ? '#67E8F9' : '#C4B5FD' }}>
                    <Count to={Number(b.value) || 0} on={numOn} reduce={reduce} />
                  </dd>
                  <dt className="mt-3 text-[12.5px] uppercase tracking-[0.14em]" style={{ fontFamily: MONO, color: '#A5B0CC' }}>{b.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ============ DEPENDENCIES ============ */}
        <section className="pt-10 md:pt-20" aria-label="Stack">
          <Reveal>
            <div className="rounded-xl border border-[#243052] bg-[#0B1120] p-5 md:p-6">
              <p className="mb-4 text-[13px]" style={{ fontFamily: MONO, color: '#8190B5' }}>// dependencies, welded into one tab</p>
              <ul className="flex flex-wrap gap-2">
                {STACK.map((s, i) => (
                  <li key={s} className="va-card rounded-md border border-[#2A3558] bg-[#0F1626] px-3 py-2 text-[13px]" style={{ fontFamily: MONO, color: i % 2 ? '#67E8F9' : '#C4B5FD' }}>{s}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        {/* ============ GALLERY ============ */}
        <section className="pt-24 md:pt-24" aria-labelledby="va-assets">
          <Head file="assets/" title="Visual references." id="va-assets" />
          <Reveal>
            <div className="overflow-hidden rounded-xl border border-[#243052] bg-[#0A0F1A]">
              <div className="relative aspect-[3/2] w-full sm:aspect-[16/9]">
                <Image key={shot} src={gallery[shot].src} alt={gallery[shot].alt} fill sizes="(min-width:1280px) 1100px, 100vw" className="va-fade object-cover" />
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-[#1C2640] bg-[#0D1424] px-4 py-3 text-[12px]" style={{ fontFamily: MONO, color: '#A5B0CC' }}>
                <span className="truncate">{gallery[shot].caption}</span>
                <span style={{ color: '#8E98B3' }}>gallery-{shot + 1}.jpg</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-[#1C2640] p-2 md:grid-cols-6">
                {gallery.map((g, i) => (
                  <button key={g.src} onClick={() => setShot(i)} aria-label={`Show ${g.caption}`} aria-pressed={shot === i} className="va-tab va-f relative aspect-[3/2] overflow-hidden rounded-md border-2" style={{ borderColor: shot === i ? '#8B5CF6' : '#1C2640', opacity: shot === i ? 1 : 0.7 }}>
                    <Image src={g.src} alt="" fill sizes="(min-width:768px) 170px, 30vw" className="object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ============ OUTCOME ============ */}
        <section className="pt-24 md:pt-24" aria-labelledby="va-out">
          <Reveal>
            <div className="overflow-hidden rounded-xl border border-[#3B2F6B] bg-[#0B1120]">
              <div className="flex items-center gap-2 border-b border-[#1C2640] bg-[#0D1424] px-4 py-2.5 text-[12px]" style={{ fontFamily: MONO, color: '#8E98B3' }}>
                <span style={{ color: '#5EEAD4' }}>●</span> terminal, exit 0
              </div>
              <div className="p-5 md:p-10">
                <h2 id="va-out" className="mb-4 text-[12px] font-normal uppercase tracking-[0.18em]" style={{ fontFamily: MONO, color: '#8E98B3' }}>$ viksit --outcome</h2>
                <p className="text-[clamp(1.8rem,6vw,3.6rem)] font-bold leading-[1.08] tracking-tight" style={{ color: '#F3F4F6' }}>
                  <span style={{ color: '#22D3EE' }} aria-hidden>&gt; </span>{theme.outcomeQuote}
                </p>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <NextChapter currentSlug={theme.slug} accent={theme.palette.accent} />
      <SiteFooter />
    </div>
  );
}
