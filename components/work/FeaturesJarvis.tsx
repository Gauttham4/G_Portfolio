'use client';

import FeaturesGrid from './FeaturesGrid';
import { JARVIS } from '@/lib/work-content';

export default function FeaturesJarvis() {
  return (
    <FeaturesGrid
      kicker="What it does"
      title="Features"
      groups={JARVIS.features}
      accent="#4FC3F7"
      cardBg="#0A1620"
      cardBorder="rgba(79,195,247,0.18)"
    />
  );
}
