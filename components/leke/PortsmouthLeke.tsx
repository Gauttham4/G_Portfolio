'use client';

import StickerBase from './StickerBase';

export default function PortsmouthLeke({
  size = 150,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const text = ' INCOMING MS  ·  UNIVERSITY OF PORTSMOUTH  ·  2026  · ';
  return (
    <StickerBase
      text={text}
      size={size}
      duration={34}
      reverse
      innerGlyph="UK"
      className={className}
      ariaLabel="Incoming MS, University of Portsmouth"
    />
  );
}
