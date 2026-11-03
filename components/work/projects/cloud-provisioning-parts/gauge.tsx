// Hand-rolled SVG storage gauge (no chart library), echoing the project's own gauge.
// pathLength=100 makes every arc a simple percentage; the draw animation is stroke-dashoffset.
type Props = { pct: number; proj?: number; value: string; sub: string; label: string };

export default function Gauge({ pct, proj, value, sub, label }: Props) {
  const arc = (p: number, stroke: string, w: number, op = 1) => (
    <circle
      cx="100" cy="100" r="80" fill="none" stroke={stroke} strokeWidth={w} strokeLinecap="round"
      pathLength={100} strokeDasharray="100" strokeDashoffset={100 - p} opacity={op}
      transform="rotate(-90 100 100)" className="cd-arc"
    />
  );
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} className="mx-auto block h-auto w-full max-w-[260px]">
      <defs>
        <linearGradient id="cd-gg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0B5FFF" />
          <stop offset="1" stopColor="#22E3FF" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(148,170,210,.16)" strokeWidth="14" />
      <circle cx="100" cy="100" r="62" fill="none" stroke="rgba(148,170,210,.35)" strokeWidth="1.5" strokeDasharray="2 7" className="cd-spinring" />
      {proj ? arc(proj, '#22E3FF', 14, 0.3) : null}
      {arc(pct, '#0B5FFF', 24, 0.22)}
      {arc(pct, 'url(#cd-gg)', 14)}
      <text x="100" y="98" textAnchor="middle" fill="#E9F1FF" fontSize="27" fontWeight="700" style={{ fontFamily: 'var(--space), system-ui, sans-serif' }}>
        {value}
      </text>
      <text x="100" y="120" textAnchor="middle" fill="#9FB0CE" fontSize="11" style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}>
        {sub}
      </text>
    </svg>
  );
}
