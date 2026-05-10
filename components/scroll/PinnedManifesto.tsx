'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

const PHRASES = [
  { kicker: '§ I — THE WORK',  word: 'I build.',   sub: 'Twenty-eight projects shipped. Each one started with a real, named problem.' },
  { kicker: '§ II — THE WAY',  word: 'I finish.',  sub: 'No prototypes that die in a folder. The smallest tool that solves the real problem, all the way to working.' },
  { kicker: '§ III — THE RANGE', word: 'I switch.', sub: 'PHP for institutions, Flutter for the field, MERN where the app is the product, Python where the AI is.' },
  { kicker: '§ IV — THE NEXT',  word: 'I go on.',   sub: 'CrimeIntellX in IJIRE. Engineering at THEELABS. Forensic IT MS at Portsmouth, incoming.' },
];

export default function PinnedManifesto() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  // Phrase opacities (lifted to top to satisfy Hooks rules)
  const op0 = useTransform(scrollYProgress, [0.00, 0.05, 0.20, 0.25], [0, 1, 1, 0]);
  const op1 = useTransform(scrollYProgress, [0.25, 0.30, 0.45, 0.50], [0, 1, 1, 0]);
  const op2 = useTransform(scrollYProgress, [0.50, 0.55, 0.70, 0.75], [0, 1, 1, 0]);
  const op3 = useTransform(scrollYProgress, [0.75, 0.80, 0.95, 1.00], [0, 1, 1, 0]);

  const y0 = useTransform(scrollYProgress, [0.00, 0.05, 0.20, 0.25], [40, 0, 0, -40]);
  const y1 = useTransform(scrollYProgress, [0.25, 0.30, 0.45, 0.50], [40, 0, 0, -40]);
  const y2 = useTransform(scrollYProgress, [0.50, 0.55, 0.70, 0.75], [40, 0, 0, -40]);
  const y3 = useTransform(scrollYProgress, [0.75, 0.80, 0.95, 1.00], [40, 0, 0, -40]);

  // Progress dot widths
  const w0 = useTransform(scrollYProgress, [0.00, 0.25], ['0%', '100%']);
  const w1 = useTransform(scrollYProgress, [0.25, 0.50], ['0%', '100%']);
  const w2 = useTransform(scrollYProgress, [0.50, 0.75], ['0%', '100%']);
  const w3 = useTransform(scrollYProgress, [0.75, 1.00], ['0%', '100%']);

  const opacities = [op0, op1, op2, op3];
  const ys = [y0, y1, y2, y3];
  const widths = [w0, w1, w2, w3];

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-ink"
      style={{ height: reduced ? 'auto' : '400vh' }}
    >
      <div className={reduced ? 'py-24 px-6' : 'sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center px-6 md:px-12'}>
        <div className="max-w-5xl w-full mx-auto">
          {reduced ? (
            <div className="space-y-16">
              {PHRASES.map((p, i) => (
                <div key={i}>
                  <p className="font-mono uppercase text-amber/70 text-[10px] tracking-[0.3em] mb-4">{p.kicker}</p>
                  <h2 className="font-display text-paper text-5xl md:text-7xl tracking-tight mb-4">{p.word}</h2>
                  <p className="font-sans text-paper-dim text-base md:text-lg max-w-xl">{p.sub}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative h-[60vh]">
              {PHRASES.map((p, i) => (
                <motion.div
                  key={i}
                  style={{ opacity: opacities[i], y: ys[i] }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <p className="font-mono uppercase text-amber/70 text-[10px] tracking-[0.3em] mb-6">{p.kicker}</p>
                  <h2
                    className="font-display text-paper tracking-tight leading-[0.9] mb-6"
                    style={{ fontSize: 'clamp(3rem, 11vw, 11rem)' }}
                  >
                    {p.word.split('').map((char, j) =>
                      char === '.' ? (
                        <span key={j} className="italic text-amber">.</span>
                      ) : (
                        <span key={j}>{char}</span>
                      )
                    )}
                  </h2>
                  <p className="font-sans text-paper-dim text-base md:text-xl max-w-2xl leading-relaxed">{p.sub}</p>
                </motion.div>
              ))}
              {/* Progress dots */}
              <div className="absolute bottom-0 left-0 flex gap-2">
                {widths.map((w, i) => (
                  <div key={i} className="relative h-px w-12 bg-paper-soft overflow-hidden">
                    <motion.div className="absolute inset-y-0 left-0 bg-amber" style={{ width: w }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
