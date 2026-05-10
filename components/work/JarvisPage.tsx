'use client';

import { useEffect } from 'react';
import HeroJarvis, {
  HexGridBackdrop,
  JarvisBigNumbers,
  JarvisBootScrolly,
  JarvisStoryQuotes,
  JarvisArchitectureGraph,
  JarvisFeaturesGrid,
  JarvisOutcomesQuote,
} from './HeroJarvis';
import NextChapter from './NextChapter';
import SiteFooter from '@/components/global/SiteFooter';
import CinematicDivider from './shared/CinematicDivider';

const VARS: Record<string, string> = {
  '--page-bg': '#0A1620',
  '--page-bg-deep': '#060F1A',
  '--page-fog': '#0E1F2D',
  '--page-line': '#1F4257',
  '--page-text': '#CFEAF7',
  '--page-dim': '#5C7A8A',
  '--page-reactor': '#4FC3F7',
  '--page-reactor-lo': '#1E88E5',
  '--page-reactor-hi': '#B3E5FC',
  '--page-hot-orange': '#FF6A1A',
  '--page-hot-amber': '#FFB300',
};

export default function JarvisPage() {
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
      <HexGridBackdrop />
      <div className="relative z-10">
        <HeroJarvis />
        <JarvisBigNumbers />
        <JarvisBootScrolly />
        <JarvisStoryQuotes />
        <CinematicDivider
          src="/reels/cinematic-scrub.mp4"
          caption="§ The architecture"
          captionColor="#CFEAF7"
          height="40vh"
          opacity={0.25}
          overlay="linear-gradient(180deg, rgba(10,22,32,0.7), rgba(10,22,32,0.7))"
        />
        <JarvisArchitectureGraph />
        <JarvisFeaturesGrid />
        <JarvisOutcomesQuote />
        <NextChapter currentSlug="jarvis" accent={VARS['--page-reactor']} />
      </div>
      <SiteFooter />
    </main>
  );
}
