'use client';

import { useEffect, useState } from 'react';
import HeroZoomRight from './HeroZoomRight';
import HeroStatementFull from './HeroStatementFull';
import HeroSplit from './HeroSplit';

/**
 * Which hero to show.
 *   Computers / tablets (>= 768px):  the bench photo zoomed in, words on the right   ("zoom")
 *   Phones:                          the ORIGINAL full-bleed hero (photo 6)            ("full")
 * Force one for every screen with  FORCE  below, or preview live:
 *   /?hero=zoom    /?hero=full    /?hero=split (framed card; add &photo=campus|sea|uk|...)
 */
type Kind = 'zoom' | 'full' | 'split';
const FORCE: Kind | null = null;

export default function HeroStatement() {
  const [kind, setKind] = useState<Kind | null>(null);
  useEffect(() => {
    const h = new URLSearchParams(window.location.search).get('hero');
    if (h === 'zoom' || h === 'full' || h === 'split') return setKind(h);
    if (FORCE) return setKind(FORCE);
    setKind(window.matchMedia('(min-width: 768px)').matches ? 'zoom' : 'full');
  }, []);

  if (kind === null) return <section data-hero aria-hidden className="relative h-[100svh] min-h-[620px] w-full bg-ink" />;
  if (kind === 'full') return <HeroStatementFull />;
  if (kind === 'split') return <HeroSplit />;
  return <HeroZoomRight />;
}
