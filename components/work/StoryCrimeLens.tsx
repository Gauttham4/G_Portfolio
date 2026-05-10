'use client';

import StoryBlock from './StoryBlock';
import { CRIMELENS } from '@/lib/work-content';

export default function StoryCrimeLens() {
  return (
    <StoryBlock
      kicker="The case"
      title={CRIMELENS.story.title}
      paragraphs={CRIMELENS.story.paragraphs}
      accent="#D8C089"
    />
  );
}
