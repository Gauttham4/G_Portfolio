'use client';

type Props = {
  text: string;
  className?: string;
};

export default function CaptionPill({ text, className = '' }: Props) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 font-mono text-xs tracking-[0.2em] uppercase ${className}`}
      style={{
        borderColor: 'rgba(255,179,71,0.5)',
        color: 'rgba(255,179,71,0.7)',
        backgroundColor: 'rgba(7,9,12,0.4)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {text}
    </span>
  );
}
