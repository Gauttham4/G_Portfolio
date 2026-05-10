'use client';

import { motion } from 'framer-motion';
import { WorkSection } from './Section';

type Props = {
  kicker?: string;
  title: string;
  paragraphs: string[];
  accent?: string;
  italic?: boolean;
};

export default function StoryBlock({ kicker, title, paragraphs, accent, italic }: Props) {
  return (
    <WorkSection kicker={kicker} title={title} accent={accent}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-6">
        <div className="md:col-span-2">
          <div
            className="hidden md:block w-px h-32 ml-auto opacity-30"
            style={{ background: accent ?? 'currentColor' }}
          />
        </div>
        <div className="md:col-span-9 lg:col-span-8">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              className={`font-display ${italic ? 'italic' : ''} text-xl md:text-3xl leading-[1.45] mb-8 last:mb-0 ${
                i === 0 ? 'opacity-100' : 'opacity-90'
              }`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: i === 0 ? 1 : 0.9, y: 0 }}
              viewport={{ once: true, margin: '-12%' }}
              transition={{ duration: 0.7, delay: Math.min(i * 0.06, 0.3), ease: [0.16, 1, 0.3, 1] }}
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </WorkSection>
  );
}
