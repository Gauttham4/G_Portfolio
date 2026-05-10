'use client';

import Link from 'next/link';
import Reveal from '@/components/motion/Reveal';
import SeeMoreLeke from '@/components/leke/SeeMoreLeke';
import OutlinedSVGText from '@/components/decoration/OutlinedSVGText';

const ABOUT_PARAGRAPH = `I'm a problem solver before I'm anything else. I find the smallest tool that solves the real problem and ship it — RAG when retrieval is the bottleneck, a static page when nothing else is. I write the README first, the API second, and the UI last. I keep the loop tight: smallest reproducible failure, smallest fix that proves the fix, smallest interface that's honest about scope. I don't chase trends; I chase named problems with named users. Twenty-eight projects in, the rule still holds.`;

export default function AboutSplit() {
  return (
    <section
      aria-label="About"
      className="relative w-full overflow-hidden bg-ink py-32 md:py-48"
    >
      {/* Background outlined word */}
      <div className="pointer-events-none absolute inset-x-0 top-8 z-0 px-6 opacity-40 md:top-12 md:px-12">
        <OutlinedSVGText text="GAUTTHAM" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1500px] grid-cols-1 gap-16 px-6 md:grid-cols-12 md:gap-12 md:px-12">
        {/* Left column — small label + decorative block */}
        <div className="md:col-span-5 lg:col-span-4">
          <Reveal dir="left" className="mb-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-amber/80">
              ◇  About  ·  Act II
            </span>
          </Reveal>
          <Reveal dir="bottom" delay={0.1}>
            <h3
              className="font-display font-light text-paper"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 0.95, letterSpacing: '-0.015em' }}
            >
              How <span className="text-amber italic">I work.</span>
            </h3>
          </Reveal>
        </div>

        {/* Right column — paragraph + see-more leke */}
        <div className="relative md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
          <Reveal dir="bottom">
            <p className="font-sans text-lg leading-relaxed text-paper-dim md:text-xl">
              {ABOUT_PARAGRAPH}
            </p>
          </Reveal>

          <div className="mt-12 flex items-center justify-between gap-8">
            <Reveal dir="bottom" delay={0.15}>
              <Link
                href="/about"
                className="group inline-flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-paper transition-colors hover:text-amber"
              >
                Read full bio
                <span className="text-amber transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>

            <div className="hidden md:block">
              <SeeMoreLeke size={130} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
