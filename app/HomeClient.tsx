'use client';

import { useEffect } from 'react';
import Preloader from '@/components/preloader/Preloader';
import SiteHeader from '@/components/nav/SiteHeader';
import HeroStatement from '@/components/home/HeroStatement';
import Intro from '@/components/home/Intro';
import AwardsGrid from '@/components/home/AwardsGrid';
import HomeAboutTeaser from '@/components/home/HomeAboutTeaser';
import NowPlayingChip from '@/components/home/NowPlayingChip';
import HomeFooter from '@/components/home/HomeFooter';
import ProjectsExplorer from '@/components/home/ProjectsExplorer';
import PortsmouthLeke from '@/components/leke/PortsmouthLeke';
import MarqueeBand from '@/components/scroll/MarqueeBand';
import PinnedHorizontalRail from '@/components/scroll/PinnedHorizontalRail';

export default function HomeClient() {
  // Always start the home page at scroll 0 — guards against Back-button navigation
  // landing on a blank viewport because the previous page's scroll position lingered.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return (
    <>
      <Preloader />
      <SiteHeader />
      <main className="bg-ink text-paper">
        {/* Hero — gradient + noise + ghost photo backdrop */}
        <HeroStatement />

        {/* Infinite text strip */}
        <MarqueeBand />

        {/* Simple Reveal-based intro (replaces broken character-mask) */}
        <Intro />

        {/* Count-up numerals */}
        <AwardsGrid />

        {/* Home about teaser — visible intro + portraits */}
        <HomeAboutTeaser />

        {/* Featured projects — pinned horizontal rail (Framer Motion) */}
        <PinnedHorizontalRail />

        {/* All 28 — filterable explorer */}
        <ProjectsExplorer />

        {/* Floating Portsmouth sticker near footer */}
        <div className="pointer-events-none relative mx-auto flex w-full max-w-[1500px] justify-end px-6 md:px-12">
          <div className="pointer-events-auto -mb-12 hidden md:block">
            <PortsmouthLeke size={140} />
          </div>
        </div>

        <HomeFooter />
      </main>
      <NowPlayingChip />
    </>
  );
}
