'use client';

import ArchitectureBlock from './ArchitectureBlock';
import { JARVIS } from '@/lib/work-content';

export default function ArchitectureJarvis() {
  return (
    <ArchitectureBlock
      kicker="The shape of the system"
      title="Architecture"
      blocks={JARVIS.architecture}
      outcomes={JARVIS.outcomes}
      accent="#4FC3F7"
    />
  );
}
