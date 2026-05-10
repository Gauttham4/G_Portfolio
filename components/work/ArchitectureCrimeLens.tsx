'use client';

import ArchitectureBlock from './ArchitectureBlock';
import { CRIMELENS } from '@/lib/work-content';

export default function ArchitectureCrimeLens() {
  return (
    <ArchitectureBlock
      kicker="Chain of custody"
      title="Architecture"
      blocks={CRIMELENS.architecture}
      outcomes={CRIMELENS.outcomes}
      accent="#D8C089"
    />
  );
}
