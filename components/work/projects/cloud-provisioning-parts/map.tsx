// Region map: a dot-matrix world (abstract landmasses as ellipses) with pulsing region nodes.
import { useMemo } from 'react';

export type Region = { id: string; col: number; row: number; ok: boolean };
export const REGIONS: Region[] = [
  { id: 'region-1', col: 13, row: 9, ok: true },
  { id: 'region-2', col: 22, row: 21, ok: true },
  { id: 'region-3', col: 33, row: 7, ok: true },
  { id: 'region-4', col: 34, row: 15, ok: false },
  { id: 'region-5', col: 45, row: 14, ok: true },
  { id: 'region-6', col: 53, row: 22, ok: true },
];

// [cx, cy, rx, ry] in grid cells
const LAND = [
  [14, 9, 9, 6], [17, 15, 4, 3], [22, 21, 3.6, 6], [33, 7, 4.2, 3], [34, 15, 4.6, 7],
  [46, 8, 11, 5.5], [45, 15, 2.6, 3], [53, 22, 4.2, 2.6],
];
const px = (n: number) => 5 + n * 10;

export default function RegionMap({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const d = useMemo(() => {
    let out = '';
    for (let r = 0; r < 30; r++)
      for (let c = 0; c < 64; c++)
        if (LAND.some(([cx, cy, rx, ry]) => ((c - cx) / rx) ** 2 + ((r - cy) / ry) ** 2 <= 1)) out += `M${px(c)} ${px(r)}h0`;
    return out;
  }, []);
  return (
    <svg viewBox="0 0 640 300" className="block h-auto w-full" role="img" aria-label="Dot map of six mocked regions, one degraded">
      <path d={d} stroke="rgba(159,176,206,.5)" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      {REGIONS.map((r, i) => {
        const x = px(r.col), y = px(r.row), col = r.ok ? '#34D399' : '#FBBF24', on = selected === r.id;
        return (
          <g key={r.id} onClick={() => onSelect(r.id)} style={{ cursor: 'pointer' }}>
            <circle cx={x} cy={y} r="7" fill={col} className="cd-ring" style={{ ['--d' as string]: `${i * 0.35}s` }} />
            <circle cx={x} cy={y} r={on ? 9 : 6} fill={col} stroke={on ? '#E9F1FF' : 'none'} strokeWidth="2.5" />
          </g>
        );
      })}
    </svg>
  );
}
