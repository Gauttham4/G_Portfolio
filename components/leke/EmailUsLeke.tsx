'use client';

import StickerBase from './StickerBase';

export default function EmailUsLeke({
  size = 140,
  className,
}: {
  size?: number;
  className?: string;
}) {
  // Repeat to fill the circle; spaces preserved.
  const text = ' EMAIL  ·  GAUTTHAMRAJASEKAR@GMAIL.COM  ·  GET IN TOUCH  · ';
  return (
    <a
      href="mailto:gautthamrajasekar@gmail.com"
      aria-label="Email Gauttham"
      className={className}
      style={{ display: 'inline-block' }}
    >
      <StickerBase
        text={text}
        size={size}
        duration={28}
        innerGlyph="→"
        ariaLabel="Email Gauttham"
      />
    </a>
  );
}
