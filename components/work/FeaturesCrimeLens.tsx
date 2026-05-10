'use client';

import FeaturesGrid from './FeaturesGrid';
import { CRIMELENS } from '@/lib/work-content';

export default function FeaturesCrimeLens() {
  return (
    <FeaturesGrid
      kicker="On the workbench"
      title="Features"
      groups={CRIMELENS.features}
      accent="#D8C089"
      cardBg="rgba(11,26,46,0.55)"
      cardBorder="rgba(216,192,137,0.16)"
    />
  );
}
