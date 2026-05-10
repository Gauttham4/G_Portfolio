'use client';

import Link from 'next/link';
import StickerBase from './StickerBase';

export default function SeeMoreLeke({
  size = 150,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const text = ' SEE MORE PROJECTS  ·  CASE FILES  ·  ALL 28 SHIPS  · ';
  return (
    <Link
      href="/work"
      aria-label="See more projects"
      className={className}
      style={{ display: 'inline-block' }}
    >
      <StickerBase
        text={text}
        size={size}
        duration={32}
        reverse
        innerGlyph="↗"
        ariaLabel="See more projects"
      />
    </Link>
  );
}
