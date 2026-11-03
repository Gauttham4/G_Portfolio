'use client';

import ScreenshotsBlock from './ScreenshotsBlock';

export default function ScreenshotsJarvis() {
  return (
    <ScreenshotsBlock
      kicker="Evidence"
      title="The assistant I use every day."
      accent="#4FC3F7"
      images={[
        { src: '/work/jarvis/gallery-1.jpg', alt: 'JARVIS dashboard: inbox, GitHub, calendar, to-dos and study coach (sample data)' },
        { src: '/work/jarvis/gallery-2.jpg', alt: 'JARVIS voice screen: ask for your day and change a to-do by speaking (sample data)' },
        { src: '/work/jarvis/gallery-3.jpg', alt: 'How JARVIS connects: wake word, WhatsApp, Slack and phone in, inbox, calendar, to-dos and GitHub out' },
      ]}
    />
  );
}
