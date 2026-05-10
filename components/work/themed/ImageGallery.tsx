'use client';
import { motion, useReducedMotion } from 'framer-motion';

export type GalleryImage = { src: string; caption: string; alt: string };

export default function ImageGallery({ images, accent }: { slug?: string; images: GalleryImage[]; accent: string }) {
  const reduced = useReducedMotion();
  if (!images || images.length === 0) return null;
  return (
    <section className="px-6 md:px-12 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono uppercase text-[10px] tracking-[0.3em] mb-6" style={{ color: accent + 'cc' }}>§ THE LOOK · MOOD BOARD</p>
        <h2 className="font-display text-3xl md:text-5xl mb-12 tracking-tight">In context.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {images.map((img, i) => (
            <motion.figure
              key={i}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/5] overflow-hidden border border-white/10 rounded-sm group"
            >
              <img
                src={img.src}
                alt={img.alt}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/about/portrait-pool.jpg'; }}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                style={{ filter: 'grayscale(0.3) brightness(0.85)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <figcaption className="absolute bottom-3 left-3 right-3 font-mono uppercase text-[10px] tracking-[0.25em] text-white/85">{img.caption}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
