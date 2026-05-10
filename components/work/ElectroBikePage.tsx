'use client';

import { useEffect } from 'react';
import HeroElectroBike, {
  GridBackdrop,
  ElectroBigNumbers,
  ElectroBootScrolly,
  ElectroStoryQuotes,
  ElectroArchitectureBlocks,
  ElectroBikeAssemble,
  ElectroBookingSite,
  ElectroGaugesPair,
  ElectroOutcomesQuote,
} from './HeroElectroBike';
import NextChapter from './NextChapter';
import SiteFooter from '@/components/global/SiteFooter';
import CinematicDivider from './shared/CinematicDivider';

const VARS: Record<string, string> = {
  '--page-bg': '#04081A',
  '--page-bg-mid': '#0A1230',
  '--page-blue': '#1E6BFF',
  '--page-blue-glow': '#5BA8FF',
  '--page-amber': '#FFB319',
  '--page-amber-hot': '#FF7A00',
  '--page-green': '#16D17A',
  '--page-text': '#E9F0FF',
  '--page-dim': '#7990B8',
  '--page-track': '#1E2A52',
};

export default function ElectroBikePage() {
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
      <GridBackdrop />
      <div className="relative z-10">
        <HeroElectroBike />
        <ElectroBigNumbers />
        <ElectroBootScrolly />
        <ElectroStoryQuotes />
        <CinematicDivider
          src="/reels/showreel-04.mp4"
          caption="§ Two deliverables, one database"
          captionColor={VARS['--page-amber']}
          height="40vh"
          opacity={0.22}
          overlay={`linear-gradient(180deg, ${VARS['--page-bg']}cc, ${VARS['--page-bg']}cc)`}
        />
        <ElectroArchitectureBlocks />
        <ElectroBikeAssemble />
        <ElectroBookingSite />
        <ElectroGaugesPair />
        <ElectroOutcomesQuote />
        <NextChapter currentSlug="electrobike" accent={VARS['--page-amber']} />
      </div>
      <SiteFooter />
    </main>
  );
}
