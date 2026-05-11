'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const PdfPreview = dynamic(() => import('@/components/auxiliary/PdfPreview'), { ssr: false });
import SiteHeader from '@/components/nav/SiteHeader';
import HomeFooter from '@/components/home/HomeFooter';
import Reveal from '@/components/motion/Reveal';
import AnimatedHeading from '@/components/motion/AnimatedHeading';

const meta = ['PDF', 'A4', 'UPDATED 2026', 'ENGLISH'];

const links = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/gauttham-r-816ab32b4' },
  { label: 'GitHub', href: 'https://github.com/Gauttham4' },
  { label: 'Email', href: 'mailto:gautthamrajasekar@gmail.com' },
];

const stats = [
  { v: '28', label: 'Shipped projects' },
  { v: '5', label: 'Hackathons' },
  { v: '1', label: 'IJIRE paper' },
  { v: '3', label: 'Internships' },
  { v: '4', label: 'Language stacks' },
  { v: '6+', label: 'Frameworks' },
];

const education = [
  {
    kicker: 'MS · Incoming · 2025',
    title: 'Cybersecurity with Forensic Information Technology',
    school: 'University of Portsmouth, UK',
    body: 'Confirmed offer. Thesis interest: AI-augmented digital forensics — building on the CrimeIntellX work.',
  },
  {
    kicker: 'B.Tech · Completed',
    title: 'Information Technology',
    school: 'Puducherry Technological University',
    body: 'Final-year project: CrimeLens AI / CrimeIntellX — published in IJIRE Vol 7 Issue 3 (2025).',
  },
  {
    kicker: 'Higher Secondary',
    title: '12th Standard',
    school: 'Sri Sankara Vidyalaya Hr. Sec. School, Lawspet, Puducherry',
    body: 'Computer Science stream. Built first shipped Flutter app in 12th.',
  },
];

const experience = [
  {
    role: 'Engineer',
    org: 'THEELABS',
    when: 'Current',
    body: 'Building shipped products end-to-end — AI agent systems, full-stack apps, edtech tools, field-ops platforms. 28 projects across the org.',
  },
  {
    role: '3 Internships',
    org: 'Various',
    when: '2023 — 2024',
    body: 'See Internship Certificates section for full details. Hands-on across full-stack web, AI/ML, and product engineering.',
  },
];

const selectedWork = [
  {
    slug: 'jarvis',
    name: 'JARVIS',
    tag: 'AI · Multi-agent',
    blurb: 'Self-evolving multi-agent system. Talk to it, it grows new skills.',
  },
  {
    slug: 'final-year-project',
    name: 'CrimeIntellX',
    tag: 'Forensics · IJIRE',
    blurb: 'Forensic case workspace. Published in IJIRE Vol 7 Issue 3.',
  },
  {
    slug: 'electrobike',
    name: 'ElectroBike',
    tag: 'IoT · Voice',
    blurb: 'Smart EV with voice booking and live telemetry.',
  },
  {
    slug: 'divyadrishti',
    name: 'DivyaDrishti',
    tag: 'Crowd-safety · Predictive',
    blurb: 'Crowd-safety platform for concerts & police — 90s surge prediction + SOS pipeline.',
  },
];

const skills = [
  {
    group: 'Languages',
    items: ['TypeScript', 'Python', 'Dart', 'PHP', 'Java', 'C / C++', 'SQL'],
  },
  {
    group: 'Frameworks',
    items: ['Next.js', 'React', 'Flutter', 'FastAPI', 'LangGraph', 'Tailwind'],
  },
  {
    group: 'AI · Data',
    items: ['Pinecone', 'Groq', 'Gemini', 'RAG', 'Multi-agent', 'Embeddings'],
  },
  {
    group: 'Cyber · Forensics (incoming MS)',
    items: ['Digital Forensics', 'Incident Response', 'AppSec', 'AI Security'],
  },
];

const awards = [
  {
    kicker: 'Publication',
    text: 'IJIRE Vol 7 · Issue 3 · 2025 — CrimeIntellX (forensic AI workspace).',
  },
  {
    kicker: 'Hackathons',
    text: 'Beyond Hack (DAA), Hack Summit (Aarush), Threx, Future of Work (kroolo), Participants.',
  },
  {
    kicker: 'Admission',
    text: 'University of Portsmouth — MS Cybersecurity with Forensic IT — confirmed offer.',
  },
];

const whyHire = [
  {
    kicker: '01',
    headline: 'I finish.',
    body: 'Twenty-eight projects ship-listed. Different stacks, same person, same rule — get it to working.',
  },
  {
    kicker: '02',
    headline: 'I pick the right small problem.',
    body: 'A real friction beats a clever idea. I scope down, then deliver fast, then iterate.',
  },
  {
    kicker: '03',
    headline: 'I write what I read.',
    body: 'Code, docs, post-mortems. The next engineer should not need a translator.',
  },
];

const contactCard = [
  { label: 'Email', value: 'gautthamrajasekar@gmail.com', href: 'mailto:gautthamrajasekar@gmail.com' },
  { label: 'LinkedIn', value: '/in/gauttham-r', href: 'https://www.linkedin.com/in/gauttham-r-816ab32b4' },
  { label: 'GitHub', value: '@Gauttham4', href: 'https://github.com/Gauttham4' },
  { label: 'Instagram', value: '@comicalhazard_415', href: 'https://instagram.com/comicalhazard_415' },
];

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-ink text-paper">
      <SiteHeader />

      {/* 1 — Hero band */}
      <section className="mx-auto max-w-5xl px-6 pb-10 pt-40 md:pt-52">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
            § Resume · 2026 · MS Application
          </p>
        </Reveal>
        <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-tight text-paper md:text-7xl">
          <AnimatedHeading
            as="span"
            mode="words"
            text="Resume — "
            delay={0.08}
            className="inline-block"
          />
          <AnimatedHeading
            as="span"
            mode="words"
            text="Gauttham R."
            delay={0.3}
            className="inline-block italic text-amber"
          />
        </h1>
        <AnimatedHeading
          as="p"
          mode="words"
          text="MS Cybersecurity + Forensic IT — University of Portsmouth, incoming."
          stagger={0.04}
          delay={0.55}
          className="mt-6 max-w-xl font-sans text-base text-paper-dim md:text-lg"
        />

        <Reveal delay={0.22}>
          <div className="mt-8 flex flex-wrap gap-2">
            {meta.map((m) => (
              <span
                key={m}
                className="rounded-full border border-rule bg-paper-soft px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim"
              >
                {m}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 2 — Quick stats strip */}
      <section className="mx-auto max-w-6xl border-t border-rule px-6 py-10">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-baseline gap-3 rounded-full border border-rule bg-paper-soft px-4 py-2"
              >
                <span className="font-display text-base text-amber md:text-lg">{s.v}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 3 — Profile summary */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
            Profile
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-6 font-display text-2xl italic leading-snug text-paper-dim md:text-3xl">
            Engineer at THEELABS. Builder of twenty-eight shipped products across AI, edtech,
            finance, safety, and field operations. Incoming MS Cybersecurity with Forensic IT —
            University of Portsmouth. CrimeIntellX (forensic AI workspace) published in IJIRE.
            Pick the smallest tool that solves the real problem; ship it all the way to a
            working product.
          </p>
        </Reveal>
      </section>

      {/* 4 — Education */}
      <section className="mx-auto max-w-6xl border-t border-rule px-6 py-20">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
            Education
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-px bg-rule md:grid-cols-3">
          {education.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.08}>
              <div className="h-full bg-ink p-8 md:p-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-paper-dim">
                  {e.kicker}
                </p>
                <p className="mt-5 font-display text-xl leading-tight text-paper md:text-2xl">
                  {e.title}
                </p>
                <p className="mt-2 font-sans text-sm text-amber">{e.school}</p>
                <p className="mt-4 font-sans text-sm leading-relaxed text-paper-dim">
                  {e.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5 — Experience */}
      <section className="mx-auto max-w-6xl border-t border-rule px-6 py-20">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
            Experience
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-px bg-rule md:grid-cols-2">
          {experience.map((x, i) => (
            <Reveal key={x.role} delay={i * 0.08}>
              <div className="h-full bg-ink p-8 md:p-10">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-display text-xl text-paper md:text-2xl">{x.role}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
                    {x.when}
                  </p>
                </div>
                <p className="mt-2 font-sans text-sm text-amber">{x.org}</p>
                <p className="mt-4 font-sans text-sm leading-relaxed text-paper-dim">
                  {x.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 6 — Selected Work */}
      <section className="mx-auto max-w-6xl border-t border-rule px-6 py-20">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
            Selected work
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {selectedWork.map((w, i) => (
            <Reveal key={w.slug} delay={i * 0.06}>
              <Link
                href={`/work/${w.slug}`}
                className="group block h-full rounded-md border border-rule bg-ink p-6 transition-colors hover:border-amber/50"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
                  {w.tag}
                </p>
                <p className="mt-4 font-display text-xl text-paper group-hover:text-amber md:text-2xl">
                  {w.name}
                </p>
                <p className="mt-3 font-sans text-sm leading-relaxed text-paper-dim">
                  {w.blurb}
                </p>
                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-amber">
                  Open case →
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 7 — Skills */}
      <section className="mx-auto max-w-6xl border-t border-rule px-6 py-20">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
            Skills
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {skills.map((s, i) => (
            <Reveal key={s.group} delay={i * 0.06}>
              <div>
                <p className="font-display text-base text-paper md:text-lg">{s.group}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.items.map((it) => (
                    <span
                      key={it}
                      className="rounded-sm border border-rule px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-dim"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 8 — Awards / Publications */}
      <section className="mx-auto max-w-6xl border-t border-rule px-6 py-20">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
            Awards · Publications
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-px bg-rule md:grid-cols-3">
          {awards.map((a, i) => (
            <Reveal key={a.kicker} delay={i * 0.06}>
              <div className="h-full bg-ink p-8 md:p-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-paper-dim">
                  {a.kicker}
                </p>
                <p className="mt-5 font-sans text-sm leading-relaxed text-paper md:text-base">
                  {a.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 9 — Why hire me */}
      <section className="mx-auto max-w-6xl border-t border-rule px-6 py-20">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
            Why hire me
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-px bg-rule md:grid-cols-3">
          {whyHire.map((h, i) => (
            <Reveal key={h.kicker} delay={i * 0.1}>
              <div className="h-full bg-ink p-8 md:p-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-paper-dim">
                  {h.kicker}
                </p>
                <p className="mt-5 font-display text-2xl italic leading-tight text-paper md:text-3xl">
                  {h.headline}
                </p>
                <p className="mt-4 font-sans text-sm leading-relaxed text-paper-dim md:text-base">
                  {h.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 10 — PDF preview, larger */}
      <section className="mx-auto max-w-5xl border-t border-rule px-6 py-20">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
            Full PDF
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="mt-8 overflow-hidden rounded-md border border-rule bg-paper-soft">
            <div className="w-full bg-paper">
              <PdfPreview src="/resume/gauttham-r-ms.pdf" allPages />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <motion.a
              href="/resume/gauttham-r-ms.pdf"
              download
              className="inline-flex items-center justify-center rounded-md bg-amber px-8 py-4 font-mono text-xs uppercase tracking-[0.3em] text-ink shadow-lg shadow-amber/20 transition-colors hover:bg-paper"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              ↓ Download Resume
            </motion.a>
            <motion.a
              href="/resume/gauttham-r-ms.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-paper-soft px-8 py-4 font-mono text-xs uppercase tracking-[0.3em] text-paper transition-colors hover:border-amber hover:text-amber"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              View full PDF ↗
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* 11 — Direct lines */}
      <section className="mx-auto max-w-4xl border-t border-rule px-6 py-20">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
            Direct lines
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-px bg-rule sm:grid-cols-2">
          {contactCard.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.05}>
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex h-full items-baseline justify-between gap-4 bg-ink p-6 transition-colors hover:bg-paper-soft"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-paper-dim">
                  {c.label}
                </span>
                <span className="font-display text-base text-paper group-hover:text-amber md:text-lg">
                  {c.value} →
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 12 — Or find me here */}
      <section className="mx-auto max-w-4xl border-t border-rule px-6 py-16">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.4em] text-paper-dim">
          Or find me here
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {links.map((l) => (
            <motion.a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="font-display text-2xl text-paper hover:text-amber md:text-3xl"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {l.label} →
            </motion.a>
          ))}
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
