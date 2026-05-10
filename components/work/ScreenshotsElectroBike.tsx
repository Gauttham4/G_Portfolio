'use client';

import ScreenshotsBlock from './ScreenshotsBlock';

export default function ScreenshotsElectroBike() {
  return (
    <ScreenshotsBlock
      kicker="The product"
      title="Both halves of the umbrella."
      accent="#dd2222"
      images={[
        { src: '/work/electrobike/thumb.jpg', alt: 'ElectroBike — the smart riding app' },
      ]}
    />
  );
}
