import Image from 'next/image';
import Link from 'next/link';
import SiteHeader from '@/components/nav/SiteHeader';
import HomeFooter from '@/components/home/HomeFooter';
import AboutCinematicHero from '@/components/auxiliary/AboutCinematicHero';
import AboutCaseFile from '@/components/auxiliary/AboutCaseFile';
import AboutOriginPinned from '@/components/auxiliary/AboutOriginPinned';
import AboutHowIWork from '@/components/auxiliary/AboutHowIWork';
import AboutNumberWall from '@/components/auxiliary/AboutNumberWall';
import AboutPortsmouth from '@/components/auxiliary/AboutPortsmouth';
import AboutOffCodeChips from '@/components/auxiliary/AboutOffCodeChips';
import AboutHighlightsGrid from '@/components/auxiliary/AboutHighlightsGrid';
import SkillsConstellation from '@/components/auxiliary/SkillsConstellation';
import Reveal from '@/components/motion/Reveal';

export const metadata = {
  title: 'About — Gauttham R.',
  description:
    'Engineer at THEELABS. Incoming MS Cybersecurity + Forensic IT, University of Portsmouth. Twenty-eight ships across AI, edtech, finance, safety, and field operations.',
};

export default function AboutPage() {
  return (
    <main className="bg-ink text-paper">
      <SiteHeader />

      {/* 1 — Cinematic hero */}
      <AboutCinematicHero />

      {/* 2 — Cold open: the case file */}
      <AboutCaseFile />

      <div className="border-t border-rule" />

      {/* 3 — Origin (sticky pinned columns) */}
      <AboutOriginPinned />

      {/* Portrait band between Acts */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-12 md:grid-cols-2">
        <Reveal dir="left">
          <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-rule">
            <Image
              src="/about/portrait-3.jpg"
              alt="Gauttham R off-code"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal dir="right" delay={0.1}>
          <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-rule">
            <Image
              src="/about/portrait-4.jpg"
              alt="Gauttham R on the road"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      {/* 4 — How I work */}
      <AboutHowIWork />

      {/* 5 — Big number wall */}
      <AboutNumberWall />

      {/* 6 — Now: THEELABS */}
      <section className="mx-auto max-w-3xl px-6 py-28 text-center md:py-36">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
            Act III · Now
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 font-display text-3xl italic leading-[1.1] tracking-tight text-paper md:text-5xl lg:text-6xl">
            Engineering at <span className="not-italic text-amber">THEELABS</span> — building products
            that ship.
          </h2>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="mx-auto mt-8 max-w-xl font-sans text-base leading-relaxed text-paper-dim md:text-lg">
            A US-based startup. Full-stack plus AI. The kind of place where the brief is{' '}
            <em>&ldquo;ship the thing&rdquo;</em> and the rest is up to you.
          </p>
        </Reveal>
      </section>

      {/* 7 — Portsmouth incoming */}
      <AboutPortsmouth />

      {/* 8 — Off-code chips */}
      <AboutOffCodeChips />

      {/* 9 — Solo-builder credo callout */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <div className="rounded-md border border-amber/40 bg-amber-soft px-8 py-12 md:px-14 md:py-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
              The credo
            </p>
            <p className="mt-5 font-display text-2xl italic leading-snug text-paper md:text-4xl">
              &ldquo;One builder. One workshop. Hard problems solved.&rdquo;
            </p>
            <p className="mt-5 font-sans text-base text-paper-dim md:text-lg">
              The solo builder who actually ships. That&apos;s the bar.
            </p>
          </div>
        </Reveal>
      </section>

      {/* 10 — Highlights bento */}
      <AboutHighlightsGrid />

      {/* 11 — Skills */}
      <SkillsConstellation />

      {/* 12 — Closing CTA */}
      <section className="mx-auto max-w-4xl px-6 py-28 text-center md:py-36">
        <Reveal>
          <p className="font-display text-3xl italic leading-[1.15] text-paper md:text-5xl lg:text-6xl">
            Open to the thing nobody else wants to ship.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/resume"
              className="inline-flex items-center justify-center rounded-md bg-amber px-7 py-3.5 font-mono text-xs uppercase tracking-[0.3em] text-ink transition-colors hover:bg-paper"
            >
              Read the resume →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-rule px-7 py-3.5 font-mono text-xs uppercase tracking-[0.3em] text-paper transition-colors hover:border-amber hover:text-amber"
            >
              Open a conversation →
            </Link>
          </div>
        </Reveal>
      </section>

      <HomeFooter />
    </main>
  );
}
