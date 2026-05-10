'use client';

type Props = {
  text: string;
  className?: string;
  stroke?: string;
  strokeWidth?: number;
};

/**
 * Madebycat-style decorative outlined display text.
 * Stroke-only, no fill — sits as a giant typographic flourish.
 */
export default function OutlinedSVGText({
  text,
  className,
  stroke = 'rgba(250,250,250,0.18)',
  strokeWidth = 0.015,
}: Props) {
  // viewBox sized so a ~10-char word looks right at fontSize 3.
  const len = Math.max(text.length, 6);
  const vbW = Math.max(12, len * 1.6);
  return (
    <svg
      viewBox={`0 0 ${vbW} 3`}
      className={className}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: 'auto', display: 'block' }}
      aria-hidden
    >
      <text
        x={vbW / 2}
        y="2.4"
        textAnchor="middle"
        fontSize="3"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        fontFamily="var(--font-display), serif"
        fontWeight={400}
        letterSpacing="-0.03"
        style={{ textTransform: 'uppercase' }}
      >
        {text}
      </text>
    </svg>
  );
}
