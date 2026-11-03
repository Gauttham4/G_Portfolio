'use client';

import StickerBase from './StickerBase';

export default function ShipsLeke({
  size = 160,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const text = ' 31 SHIPS  ·  ONE BUILDER  ·  2026  ·  STUDIO  · ';
  return (
    <StickerBase
      text={text}
      size={size}
      duration={36}
      innerGlyph="31"
      className={className}
      ariaLabel="31 ships, one builder, 2026"
    />
  );
}
