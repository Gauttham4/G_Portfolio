'use client';

import { motion } from 'framer-motion';
import { WorkSection } from './Section';
import type { FeatureGroup } from '@/lib/work-content';

type Props = {
  kicker?: string;
  title: string;
  groups: FeatureGroup[];
  accent?: string;
  cardBg?: string;
  cardBorder?: string;
};

export default function FeaturesGrid({
  kicker,
  title,
  groups,
  accent,
  cardBg,
  cardBorder,
}: Props) {
  return (
    <WorkSection kicker={kicker} title={title} accent={accent}>
      <div className="space-y-20">
        {groups.map((group, gi) => (
          <div key={gi}>
            <motion.h3
              className="font-mono uppercase text-xs tracking-[0.3em] mb-8 opacity-70"
              style={{ color: accent ?? 'currentColor' }}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 0.7, x: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5 }}
            >
              {group.heading}
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
              style={{ background: cardBorder ?? 'rgba(255,255,255,0.08)' }}
            >
              {group.items.map((item, i) => (
                <motion.div
                  key={i}
                  className="p-8 md:p-10"
                  style={{ background: cardBg ?? 'transparent' }}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-8%' }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.05,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                >
                  <div
                    className="w-6 h-px mb-5"
                    style={{ background: accent ?? 'currentColor', opacity: 0.7 }}
                  />
                  <h4 className="font-display text-xl md:text-2xl mb-3 leading-tight">
                    {item.title}
                  </h4>
                  <p className="font-sans text-sm md:text-base leading-relaxed opacity-70">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </WorkSection>
  );
}
