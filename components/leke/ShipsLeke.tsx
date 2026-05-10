'use client';

import StickerBase from './StickerBase';

export default function ShipsLeke({
  size = 160,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const text = ' 28 SHIPS  ·  ONE BUILDER  ·  2026  ·  STUDIO  · ';
  return (
    <StickerBase
      text={text}
      size={size}
      duration={36}
      innerGlyph="28"
      className={className}
      ariaLabel="28 ships, one builder, 2026"
    />
  );
}
