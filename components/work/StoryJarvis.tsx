'use client';

import StoryBlock from './StoryBlock';
import { JARVIS } from '@/lib/work-content';

export default function StoryJarvis() {
  return (
    <StoryBlock
      kicker="The pitch"
      title={JARVIS.story.title}
      paragraphs={JARVIS.story.paragraphs}
      accent="#4FC3F7"
    />
  );
}
