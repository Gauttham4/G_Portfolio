'use client';

import StickerBase from './StickerBase';

export default function TeessideLeke({
  size = 150,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const text = ' MSC DIGITAL FORENSICS  ·  TEESSIDE UNIVERSITY  ·  2026  · ';
  return (
    <StickerBase
      text={text}
      size={size}
      duration={34}
      reverse
      innerGlyph="UK"
      className={className}
      ariaLabel="MSc Digital Forensics and Cyber Investigation, Teesside University"
    />
  );
}
