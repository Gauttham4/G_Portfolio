'use client';

import { useEffect } from 'react';
import HeroCrimeLens, {
  PaperGrainBackdrop,
  CrimeLensBootScrolly,
  CrimeLensStoryQuotes,
  CrimeLensArchitectureLayers,
  CrimeLensEvidencePipeline,
  CrimeLensCDRGraph,
  CrimeLensPineconeFlow,
  CrimeLensBigNumbers,
  CrimeLensOutcomesQuote,
} from './HeroCrimeLens';
import NextChapter from './NextChapter';
import SiteFooter from '@/components/global/SiteFooter';
import CinematicDivider from './shared/CinematicDivider';

const VARS: Record<string, string> = {
  '--page-bg': '#060F1F',
  '--page-bg-mid': '#0B1A2E',
  '--page-text': '#E8E2CF',
  '--page-dim': '#7A6E50',
  '--page-manila': '#D8C089',
  '--page-manila-dk': '#A88B4D',
  '--page-paper': '#F2EAD3',
  '--page-crimson': '#B81E2A',
  '--page-crimson-hi': '#E04050',
  '--page-caution': '#F2C014',
  '--page-green': '#1FA37A',
};

export default function CrimeLensPage() {
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(VARS).forEach(([k, v]) => root.style.setProperty(k, v));
    return () => {
      Object.keys(VARS).forEach((k) => root.style.removeProperty(k));
    };
  }, []);

  return (
    <main
      className="relative min-h-screen"
      style={{ background: VARS['--page-bg'], color: VARS['--page-text'] }}
    >
      <PaperGrainBackdrop />
      <div className="relative z-10">
        <HeroCrimeLens />
        <CrimeLensBootScrolly />
        <CrimeLensStoryQuotes />
        <CinematicDivider
          src="/reels/showreel-02.mp4"
          caption="§ Architecture"
          captionColor={VARS['--page-manila']}
          height="40vh"
          opacity={0.22}
          overlay={`linear-gradient(180deg, ${VARS['--page-bg']}cc, ${VARS['--page-bg']}cc)`}
        />
        <CrimeLensArchitectureLayers />
        <CrimeLensEvidencePipeline />
        <CrimeLensCDRGraph />
        <CrimeLensPineconeFlow />
        <CrimeLensBigNumbers />
        <CrimeLensOutcomesQuote />
        <NextChapter currentSlug="final-year-project" accent={VARS['--page-manila']} />
      </div>
      <SiteFooter />
    </main>
  );
}
