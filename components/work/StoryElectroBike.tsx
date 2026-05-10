'use client';

import StoryBlock from './StoryBlock';
import { ELECTROBIKE } from '@/lib/work-content';

export default function StoryElectroBike() {
  return (
    <StoryBlock
      kicker="The ride"
      title={ELECTROBIKE.story.title}
      paragraphs={ELECTROBIKE.story.paragraphs}
      accent="#dd2222"
    />
  );
}
