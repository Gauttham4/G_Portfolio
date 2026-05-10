import SiteHeader from '@/components/nav/SiteHeader';
import HomeFooter from '@/components/home/HomeFooter';
import CertificateTile from '@/components/auxiliary/CertificateTile';
import Reveal from '@/components/motion/Reveal';
import AnimatedHeading from '@/components/motion/AnimatedHeading';

export const metadata = {
  title: 'Certificates — Gauttham R.',
  description: 'Receipts from the road.',
};

const personal = [1, 2, 3, 4].map((n) => ({
  number: n,
  title: `Certificate ${n}`,
  subtitle: 'Personal · independent learning',
  src: `/certificates/personal/${n}.pdf`,
}));

const internship = [1, 2, 3].map((n) => ({
  number: `I${n}`,
  title: `Internship Certificate ${n}`,
  subtitle: 'Internship · industry placement',
  src: `/certificates/internship/${n}.pdf`,
}));

export default function CertificatesPage() {
  return (
    <main className="min-h-screen bg-ink text-paper">
      <SiteHeader />

      {/* Hero band */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-40 md:pt-52">
        <div className="flex items-start justify-between gap-6">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
              § Certificates
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-paper-dim">
              7 documents
            </p>
          </Reveal>
        </div>
        <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-tight text-paper md:text-7xl lg:text-8xl">
          <AnimatedHeading
            as="span"
            mode="words"
            text="Receipts "
            delay={0.08}
            className="inline-block"
          />
          <AnimatedHeading
            as="span"
            mode="words"
            text="from the road."
            delay={0.3}
            className="inline-block italic text-amber"
          />
        </h1>
        <AnimatedHeading
          as="p"
          mode="words"
          text="The courses, internships, and milestones that left a paper trail."
          stagger={0.04}
          delay={0.55}
          className="mt-6 max-w-xl font-sans text-base text-paper-dim md:text-lg"
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <Reveal>
          <div className="mb-8 flex items-baseline justify-between border-b border-rule pb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
              Block A · Personal
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
              04 documents
            </span>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {personal.map((c, i) => (
            <Reveal key={c.src} delay={i * 0.07}>
              <CertificateTile {...c} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32">
        <Reveal>
          <div className="mb-8 flex items-baseline justify-between border-b border-rule pb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
              Block B · Internships
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
              03 documents
            </span>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {internship.map((c, i) => (
            <Reveal key={c.src} delay={i * 0.07}>
              <CertificateTile {...c} />
            </Reveal>
          ))}
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
