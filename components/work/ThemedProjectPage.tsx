'use client';

import HeroThemed from './themed/HeroThemed';
import BigNumbersThemed from './themed/BigNumbers';
import StoryQuotesThemed from './themed/StoryQuotes';
import FeaturesThemed from './themed/FeaturesThemed';
import ArchitectureThemed from './themed/ArchitectureThemed';
import OutcomeQuoteThemed from './themed/OutcomeQuote';
import ImageGallery from './themed/ImageGallery';
import NextChapter from './NextChapter';
import SiteFooter from '@/components/global/SiteFooter';
import { HeroMotif, MidMotif } from './motifs/MotifLibrary';
import {
  ProductLaunchLayout,
  CaseStudyLayout,
  EditorialLayout,
  HackerDossierLayout,
} from './themed/LayoutVariants';
import {
  TvkPoliticalLayout,
  VkmgWireframeLayout,
  DivyaCommandLayout,
} from './themed/BespokeProjectLayouts';
import SpaceForgeDenseLayout from './themed/SpaceForgeDenseLayout';
import type { ProjectTheme } from '@/lib/project-themes';

type Props = { theme: ProjectTheme };

export default function ThemedProjectPage({ theme }: Props) {
  // Bespoke per-slug layouts take priority.
  if (theme.slug === 'spaceforge') return <SpaceForgeDenseLayout theme={theme} />;
  if (theme.slug === 'tvk') return <TvkPoliticalLayout theme={theme} />;
  if (theme.slug === 'vkmg-landing') return <VkmgWireframeLayout theme={theme} />;
  if (theme.slug === 'divyadrishti') return <DivyaCommandLayout theme={theme} />;
  // Phase 9 — variant dispatch.
  if (theme.layout === 'A') return <ProductLaunchLayout theme={theme} />;
  if (theme.layout === 'B') return <CaseStudyLayout theme={theme} />;
  if (theme.layout === 'C') return <EditorialLayout theme={theme} />;
  if (theme.layout === 'D') return <HackerDossierLayout theme={theme} />;

  // Default — original same-shape composition.
  const heroMotif = theme.motifs?.hero;
  const midMotif = theme.motifs?.mid;
  return (
    <main
      className="relative min-h-screen"
      style={{
        background: theme.palette.bg,
        color: theme.palette.text,
        ['--page-bg' as string]: theme.palette.bg,
        ['--page-bg-mid' as string]: theme.palette.bgMid,
        ['--page-text' as string]: theme.palette.text,
        ['--page-dim' as string]: theme.palette.dim,
        ['--page-accent' as string]: theme.palette.accent,
        ['--page-accent2' as string]: theme.palette.accent2 ?? theme.palette.accent,
      }}
    >
      {heroMotif ? <HeroMotif motif={heroMotif} theme={theme} /> : <HeroThemed theme={theme} />}
      <BigNumbersThemed theme={theme} />
      {theme.gallery && theme.gallery.length > 0 ? (
        <ImageGallery images={theme.gallery} accent={theme.palette.accent} />
      ) : null}
      <StoryQuotesThemed theme={theme} />
      {midMotif ? <MidMotif motif={midMotif} theme={theme} /> : null}
      <FeaturesThemed theme={theme} />
      <ArchitectureThemed theme={theme} />
      <OutcomeQuoteThemed theme={theme} />
      <NextChapter currentSlug={theme.slug} accent={theme.palette.accent} />
      <SiteFooter />
    </main>
  );
}
