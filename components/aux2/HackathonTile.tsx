'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import HackathonModal from './HackathonModal';

export type HackathonItem = {
  slug: string;
  title: string;
  context: string;
  photoCount: number;
  initial: string;
};

export default function HackathonTile({ item }: { item: HackathonItem }) {
  const [hover, setHover] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!hover || item.photoCount < 2) return;
    const id = setInterval(() => {
      setPhotoIdx((i) => (i + 1) % item.photoCount);
    }, 2400);
    return () => clearInterval(id);
  }, [hover, item.photoCount]);

  // Reset to first photo when leaving so re-entry starts clean
  useEffect(() => {
    if (!hover) setPhotoIdx(0);
  }, [hover]);

  const thumbPath = `/hackathons/${item.slug}/thumb.jpg`;

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setModalOpen(true)}
        className="group flex flex-col w-full text-left overflow-hidden rounded-md border border-rule bg-ink transition-all cursor-pointer"
        whileHover={{ y: -6, borderColor: 'rgba(232,184,99,0.4)' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-soft">
          {/* Default thumb (Unsplash hero) */}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: hover ? 1.04 : 1, filter: hover ? 'brightness(0.85)' : 'brightness(1)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={thumbPath}
              alt={`${item.title} thumbnail`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
              priority={false}
            />
          </motion.div>

          {/* Hover overlay: real event photos crossfade */}
          {item.photoCount > 0 && (
            <AnimatePresence mode="wait">
              {hover && (
                <motion.div
                  key={photoIdx}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.55 }}
                >
                  <Image
                    src={`/hackathons/${item.slug}/photo-${photoIdx + 1}.jpg`}
                    alt={`${item.title} photo ${photoIdx + 1}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}

          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/80 to-transparent" />
          {item.photoCount > 1 && hover && (
            <div className="absolute bottom-3 left-3 flex gap-1.5">
              {Array.from({ length: item.photoCount }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1 w-6 rounded-full transition-colors ${
                    i === photoIdx ? 'bg-amber' : 'bg-paper/30'
                  }`}
                />
              ))}
            </div>
          )}
          {item.photoCount === 0 && hover && (
            <div className="absolute bottom-3 left-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-amber">
                Certificate only
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <h3 className="font-display text-2xl leading-tight text-paper group-hover:text-amber group-active:text-amber">
            {item.title}
          </h3>
          <p className="font-sans text-sm text-paper-dim">{item.context}</p>
          <div className="mt-auto flex items-center justify-between border-t border-rule pt-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber group-hover:text-paper group-active:text-paper transition-colors">
              {item.photoCount > 0 ? 'View photos + cert' : 'View certificate'}
            </span>
            <span
              aria-hidden
              className="font-mono text-[14px] text-amber transition-transform group-hover:translate-x-1 group-active:translate-x-1"
            >
              →
            </span>
          </div>
        </div>
      </motion.button>

      <HackathonModal
        open={modalOpen}
        slug={item.slug}
        title={item.title}
        photoCount={item.photoCount}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
