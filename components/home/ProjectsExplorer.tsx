'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import { ACTS, type Act } from '@/lib/projects-manifest';

// Project meta — title, short subtitle, and a 2-sentence pitch shown on the
// opposite side of each tile so the wide layout doesn't look empty.
const PROJECT_META: Record<string, { title: string; subtitle: string; description: string }> = {
  'jarvis':              { title: 'JARVIS',             subtitle: 'A personal AI assistant that teaches itself new skills',     description: 'A multi-agent AI that authors its own skills under a plan → implement → regression loop. The system rewrites itself while it runs — every gap-finder is a curriculum.' },
  'final-year-project':  { title: 'CrimeIntellX',       subtitle: "A detective's assistant for cases, evidence & call records", description: 'A forensics workspace (working name CrimeLens AI) fusing RAG over evidence, CDR analytics, and encrypted upload pipelines. Published in IJIRE — the detective’s co-pilot, before graduation.' },
  'electrobike':         { title: 'ElectroBike',        subtitle: 'A smart electric bike that thinks with you',                  description: 'Drowsiness detection, theft geofencing, and a voice-powered test-drive booking flow. Software does the thinking; the bike does the riding — zero physical hardware shipped.' },
  'spaceforge':          { title: 'SpaceForge',         subtitle: 'A cinematic 3D landing page for a tech startup',              description: 'A Spline-driven 3D landing page with manifesto-style scroll choreography. Built to push the visual ceiling for an early-stage startup that needed to look the part.' },
  'viksit-ai':           { title: 'Viksit.AI',          subtitle: 'An AI workspace that codes, searches & talks back',           description: 'A daily-use AI workspace with multi-agent orchestration, semantic search, and voice. Built around the idea that AI should fit into the editor, not the other way around.' },
  'dhanoos-excellence':  { title: 'Excellence Academy', subtitle: 'Student coaching & admissions, all in one place',             description: 'A coaching-institute platform for admissions, attendance, and progress tracking. One screen for the office, one app for parents — built for a real Puducherry institute.' },
  'thaazhai':            { title: 'THAAZHAI',           subtitle: 'Where farmers, buyers & agri-experts meet',                   description: 'A farmers-buyers-experts marketplace with Tamil-first UX and an SMS fallback for low-bandwidth users. Built for the people I see every day, not for a pitch deck.' },
  'alzhmeric':           { title: 'Alzhmeric',          subtitle: "A care companion for Alzheimer's patients & their families",  description: 'A care-companion app with memory aids, medication reminders, and emergency loops for caregivers. Designed by someone who has watched the disease take a relative.' },
  'agri-tech-website':   { title: 'Agri-Tech',          subtitle: 'A vanilla-HTML farmers marketplace',                          description: 'A vanilla-HTML farmers’ marketplace built when I was first learning to ship. Proof that working beats perfect — even on the simplest possible stack.' },
  'ea-tuition-app':      { title: 'EA Tuition',         subtitle: 'Tuition fee management — paper book to working app',          description: 'Tuition fee management for a coaching center stuck in a paper notebook. Fees, reminders, and receipts moved into a working pocket app over a single weekend.' },
  'mindora':             { title: 'Mindora',            subtitle: 'Mindfulness for the daily commute',                           description: 'A wellness journal with breath-paced micro-exercises. Built on the idea that calm shows up in two-minute increments, not in 30-minute meditations nobody actually does.' },
  'fee-management':      { title: 'FeeFlow',            subtitle: 'Fee management for coaching centers',                         description: 'Auto-reminder fee collection for schools and coaching centers. Removes the call-and-chase cycle without anyone having to learn new software.' },
  'voyagr':              { title: 'Voyagr',             subtitle: 'AI travel planner that books like a friend',                  description: 'A travel planner that takes plain-language requests and returns real bookings. No forms, no checkboxes — just the destination and the constraints, in a sentence.' },
  'student-portal':      { title: 'My Campus',          subtitle: 'Student portal for institutional life',                       description: 'A student portal for marks, records, and transcripts under one roof. One window into institutional life — no PDF chasing or front-office queues.' },
  'teacher-portal':      { title: 'TeachDesk',          subtitle: 'Teacher tools for classroom management',                      description: 'A teacher’s toolkit for attendance, grading, and parent communications. One app replaces seven tabs and a WhatsApp group nobody can find.' },
  'invoice-system':      { title: 'ApprovePay',         subtitle: '4-role finance approval pipeline',                            description: 'A multi-level invoice approval pipeline with audit trails. 4 roles, 1 source of truth, zero email chains and zero spreadsheets.' },
  'hotel-app':           { title: 'StayEasy',           subtitle: 'Hotel discovery, booking & billing',                          description: 'Discovery, walk-in check-in, and billing in one app for small hotels. Built for the operators who can’t afford OPERA but still need an audit trail.' },
  'jewelry-pos':         { title: 'GemPoint',           subtitle: 'Jewelry shop POS + audit logs',                               description: 'A smart billing counter for jewelry stores with live gold rates and audit-traced receipts. Designed alongside an actual shop owner — every field is one he asked for.' },
  'market-pulse':        { title: 'MarketPulse',        subtitle: 'Real-time market data dashboard',                             description: 'Live stock charts and price alerts in your pocket. Real-time data, simple thresholds, no broker upsells — built for the curious retail trader.' },
  'darkwatch':           { title: 'DarkWatch',          subtitle: 'Dark-web breach detection',                                   description: 'Tells you the moment your email or password shows up on a breach dump. A small, calm dashboard for a problem most people don’t learn about until it’s too late.' },
  'careervisionx':       { title: 'CareerVisionX',      subtitle: 'AI career mentor for students',                               description: 'An AI mentor that helps students pick the right career path. Personality and interests in, three honest paths out — not the same five jobs for everyone.' },
  'vkmg-landing':        { title: 'VKMG Landing',       subtitle: 'Cinematic IT consultancy site',                              description: 'A cinematic landing page for an IT consultancy that wanted to look the part. Color-block hero, kinetic type, and a pitch that closes itself.' },
  'vkmg-report-app':     { title: 'VKMG Reports',       subtitle: 'Offline-first field reporting',                              description: 'A field-team report logger that works without network. Reports queue locally and sync when signal returns — no lost data on the road.' },
  'zyntra':              { title: 'Zyntra',             subtitle: 'Digital agency that sells its vibe',                          description: 'A digital agency website that sells its own vibe before it sells anything else. Color blocks, kinetic type, and the project where I stopped reaching for React on reflex.' },
  'divyadrishti':        { title: 'DivyaDrishti',       subtitle: "Real-time safety platform for women",                         description: 'A women’s-safety app with live guardian routing, geofence triggers, and an SOS path that survives the worst-day signal. Mobile + web + Python AI, with offline emergency queueing.' },
  'cloud-provisioning':  { title: 'Cloud Provisioning', subtitle: 'Self-service cloud dashboard',                                description: 'A self-service dashboard to rent cloud resources without a Cloud Engineer. Spin up, set quotas, see costs — for teams that need infra, not platform expertise.' },
  'tvk':                 { title: 'TVK Connect',        subtitle: 'One-tap phone-number login',                                  description: 'One-tap phone-number authentication for mobile apps. Carrier-grade phone-number verification — no OTP screens, no waiting on SMS that never arrives.' },
  'medicine-search':     { title: 'MediFind',           subtitle: 'Search any medicine, know what it does',                      description: 'A pocket reference for medicines: generic name, side effects, alternatives, and pricing. Designed to fit a pharmacist’s workflow as much as a worried family member’s.' },
};

export default function ProjectsExplorer() {
  let runningIndex = 0;
  return (
    <section id="acts-drilldown" className="relative bg-ink py-24 md:py-32 overflow-hidden">
      {/* Section title */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto mb-16 md:mb-24">
        <p className="font-mono uppercase text-amber/70 text-[10px] tracking-[0.3em] mb-4">§ ALL 28 · INDEX</p>
        <h2 className="font-display text-paper text-4xl md:text-7xl tracking-tight leading-[0.95] mb-4">Five acts. Twenty-eight ships.</h2>
        <p className="font-sans text-paper-dim text-base md:text-lg max-w-xl">A scroll through every project, in narrative order.</p>
      </div>

      {ACTS.map((act) => {
        const startIndex = runningIndex;
        runningIndex += act.projects.length;
        return <ActSection key={act.id} act={act} startIndex={startIndex} />;
      })}
    </section>
  );
}

function ActSection({ act, startIndex }: { act: Act; startIndex: number }) {
  return (
    <>
      <ActDivider act={act} />
      <div className="space-y-24 md:space-y-32 mt-16 md:mt-24 px-6 md:px-12">
        {act.projects.map((p, i) => {
          const meta = PROJECT_META[p.slug];
          return (
            <ProjectTile
              key={p.slug}
              slug={p.slug}
              title={meta?.title ?? p.title}
              subtitle={meta?.subtitle ?? ''}
              description={meta?.description ?? ''}
              actNumeral={act.numeral}
              actName={act.name}
              side={i % 2 === 0 ? 'left' : 'right'}
              globalIndex={startIndex + i}
            />
          );
        })}
      </div>
    </>
  );
}

function ActDivider({ act }: { act: Act }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  return (
    <div ref={ref} className="relative w-full h-[40vh] md:h-[60vh] flex items-center overflow-hidden border-t border-rule mt-32">
      <motion.div style={{ x }} className="whitespace-nowrap will-change-transform">
        <span
          className="font-display text-paper-soft tracking-[-0.04em] leading-none"
          style={{ fontSize: 'clamp(6rem, 22vw, 22rem)' }}
        >
          {act.numeral}. {act.name.toUpperCase()} —
        </span>
        <span
          className="font-display text-paper-soft tracking-[-0.04em] leading-none ml-12"
          style={{ fontSize: 'clamp(6rem, 22vw, 22rem)' }}
        >
          {act.numeral}. {act.name.toUpperCase()} —
        </span>
      </motion.div>
      <div className="absolute left-6 md:left-12 bottom-6 md:bottom-12">
        <p className="font-mono uppercase text-amber text-xs tracking-[0.3em]">ACT {act.numeral}</p>
        <p className="font-sans text-paper-dim text-base md:text-lg mt-1 max-w-md italic">{act.label}</p>
      </div>
    </div>
  );
}

function ProjectTile({
  slug, title, subtitle, description, actNumeral, actName, side, globalIndex,
}: {
  slug: string; title: string; subtitle: string; description: string;
  actNumeral: string; actName: string;
  side: 'left' | 'right'; globalIndex: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { amount: 0.25, once: true });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-12%', '12%']);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], reduced ? [1, 1, 1] : [1.05, 1, 1.05]);

  const indexLabel = String(globalIndex + 1).padStart(2, '0');

  // Layout: 2-column grid that adapts to side. Tile content occupies one column,
  // descriptive text occupies the opposite — never empty wide-screen real estate.
  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-20 items-center"
    >
      {/* TILE — image + title */}
      <a
        href={`/work/${slug}`}
        className={`group block md:col-span-7 lg:col-span-7 ${
          side === 'right' ? 'md:order-2' : 'md:order-1'
        }`}
      >
        {/* Index + act caption */}
        <motion.div
          initial={reduced ? false : { opacity: 0, x: side === 'left' ? -20 : 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="font-mono uppercase text-amber/80 text-[10px] tracking-[0.3em]">{indexLabel}</span>
          <span className="h-px w-10 bg-amber/40" />
          <span className="font-mono uppercase text-paper-dim text-[10px] tracking-[0.3em]">ACT {actNumeral} · {actName.replace(/\.$/, '')}</span>
        </motion.div>

        {/* Image with clip-path reveal */}
        <motion.div
          initial={reduced ? false : { clipPath: side === 'left' ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' }}
          animate={inView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
          transition={{ duration: 1.0, ease: [0.83, 0, 0.17, 1] }}
          className="relative aspect-[4/5] md:aspect-[3/2] overflow-hidden border border-rule"
        >
          <motion.img
            src={`/work/${slug}/thumb.jpg`}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/about/portrait-pool.jpg'; }}
            alt={title}
            style={{ y: imgY, scale: imgScale }}
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent transition-opacity duration-500 group-hover:from-ink/95 group-active:from-ink/95" />
          <span className="absolute top-6 right-6 font-mono uppercase text-amber text-[10px] tracking-[0.3em] opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500">VIEW →</span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 md:mt-8"
        >
          <h3
            className="font-display text-paper tracking-tight leading-[0.95] group-hover:text-amber group-active:text-amber transition-colors duration-500"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 4.5rem)' }}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="font-sans text-paper-dim text-base md:text-lg mt-3 max-w-xl leading-snug">{subtitle}</p>
          )}
        </motion.div>
      </a>

      {/* OPPOSITE-SIDE DESCRIPTION — fills the empty wide space */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`md:col-span-5 lg:col-span-5 ${
          side === 'right' ? 'md:order-1' : 'md:order-2'
        }`}
      >
        <p className="font-mono uppercase text-amber/70 text-[10px] tracking-[0.3em] mb-4">§ DESCRIPTION</p>
        <p className="font-display italic text-paper text-xl md:text-2xl lg:text-3xl leading-[1.25] tracking-tight max-w-md">
          {description}
        </p>
        <a
          href={`/work/${slug}`}
          className="mt-8 inline-flex items-center gap-2 font-mono uppercase text-amber text-[11px] tracking-[0.3em] hover:underline underline-offset-4"
        >
          Read the case
          <span aria-hidden>↗</span>
        </a>
      </motion.div>
    </div>
  );
}
