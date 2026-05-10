'use client';

import ArchitectureBlock from './ArchitectureBlock';
import { ELECTROBIKE } from '@/lib/work-content';

export default function ArchitectureElectroBike() {
  return (
    <ArchitectureBlock
      kicker="Under the seat"
      title="Architecture"
      blocks={ELECTROBIKE.architecture}
      outcomes={ELECTROBIKE.outcomes}
      accent="#dd2222"
    />
  );
}
