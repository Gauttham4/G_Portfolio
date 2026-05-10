import SiteHeader from '@/components/nav/SiteHeader';
import HomeFooter from '@/components/home/HomeFooter';
import HackathonTile, { type HackathonItem } from '@/components/auxiliary/HackathonTile';
import Reveal from '@/components/motion/Reveal';
import AnimatedHeading from '@/components/motion/AnimatedHeading';

export const metadata = {
  title: 'Hackathons — Gauttham R.',
  description: 'Five events. Builders who came to argue.',
};

const items: HackathonItem[] = [
  {
    slug: 'beyond-hack-daa',
    title: 'Beyond Hack — DAA',
    context: 'SRM Chennai. Algorithm-design track. Long night, sharp benchmarks.',
    photoCount: 3,
    initial: 'B',
  },
  {
    slug: 'hack-summit-aarush',
    title: 'Hack Summit — Aarush',
    context: 'SRM Aarush flagship. Build-and-pitch in one weekend.',
    photoCount: 3,
    initial: 'H',
  },
  {
    slug: 'threx-srm',
    title: 'Threx — SRM',
    context: 'Threx event at SRM. Cross-track build sprint.',
    photoCount: 3,
    initial: 'T',
  },
  {
    slug: 'kroolo-future-of-work',
    title: 'Future of Work — Kroolo',
    context: 'Kroolo hackathon on the future of distributed work.',
    photoCount: 0,
    initial: 'K',
  },
  {
    slug: 'participants',
    title: 'Participation events',
    context: 'Smaller meets, workshops, builder rooms. Same lesson — show up and ship.',
    photoCount: 0,
    initial: 'P',
  },
];

export default function HackathonsPage() {
  return (
    <main className="min-h-screen bg-ink text-paper">
      <SiteHeader />

      {/* Hero band */}
      <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-40 md:pt-52">
        <div className="flex items-start justify-between gap-6">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
              § Hackathons
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-paper-dim">
              5 / 2024 — 2026
            </p>
          </Reveal>
        </div>
        <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-tight text-paper md:text-7xl lg:text-8xl">
          <AnimatedHeading
            as="span"
            mode="words"
            text="Five events. "
            delay={0.08}
            className="inline-block"
          />
          <AnimatedHeading
            as="span"
            mode="words"
            text="Builders who came to argue."
            delay={0.35}
            className="inline-block italic text-amber"
          />
        </h1>
        <AnimatedHeading
          as="p"
          mode="words"
          text="Builders who came to argue, ship, and stay up too late. Photos and certificates below."
          stagger={0.04}
          delay={0.6}
          className="mt-6 max-w-xl font-sans text-base text-paper-dim md:text-lg"
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.slug} delay={i * 0.08}>
              <HackathonTile item={it} />
            </Reveal>
          ))}
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
