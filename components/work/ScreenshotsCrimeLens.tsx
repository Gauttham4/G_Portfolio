'use client';

import ScreenshotsBlock from './ScreenshotsBlock';

export default function ScreenshotsCrimeLens() {
  return (
    <ScreenshotsBlock
      kicker="Evidence locker"
      title="The workbench."
      accent="#D8C089"
      images={[
        { src: '/work/final-year-project/thumb.jpg', alt: 'CrimeLens AI — case workspace' },
      ]}
    />
  );
}
