'use client';

import FeaturesGrid from './FeaturesGrid';
import { ELECTROBIKE } from '@/lib/work-content';

export default function FeaturesElectroBike() {
  return (
    <FeaturesGrid
      kicker="What it does"
      title="Features"
      groups={ELECTROBIKE.features}
      accent="#dd2222"
      cardBg="#ffffff"
      cardBorder="#e5e5e5"
    />
  );
}
