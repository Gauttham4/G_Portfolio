'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { WorkSection } from './Section';

type Props = {
  kicker?: string;
  title: string;
  images: { src: string; alt: string }[];
  accent?: string;
};

export default function ScreenshotsBlock({ kicker, title, images, accent }: Props) {
  return (
    <WorkSection kicker={kicker} title={title} accent={accent}>
      <div className="grid grid-cols-1 gap-6">
        {images.map((img, i) => (
          <motion.div
            key={i}
            className="relative w-full aspect-[16/9] overflow-hidden"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 100vw, 1280px"
              className="object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, transparent 70%, rgba(0,0,0,0.35) 100%)',
              }}
            />
          </motion.div>
        ))}
      </div>
    </WorkSection>
  );
}
