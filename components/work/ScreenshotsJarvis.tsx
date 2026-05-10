'use client';

import ScreenshotsBlock from './ScreenshotsBlock';

export default function ScreenshotsJarvis() {
  return (
    <ScreenshotsBlock
      kicker="Evidence"
      title="The system, running."
      accent="#4FC3F7"
      images={[
        { src: '/work/jarvis/thumb.jpg', alt: 'JARVIS — live system view' },
      ]}
    />
  );
}
