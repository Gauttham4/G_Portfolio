'use client';

import { useEffect, useState } from 'react';
import ReactorLoader from '@/components/loaders/ReactorLoader';
import RepulsorProgress from '@/components/loaders/RepulsorProgress';
import NanoAssemble from '@/components/loaders/NanoAssemble';
import HoloShimmer from '@/components/loaders/HoloShimmer';
import HUDScan from '@/components/loaders/HUDScan';

function Cell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-[280px] flex-col gap-4 p-6"
      style={{
        border: '1px solid rgba(255,179,71,0.18)',
        background: 'rgba(7,9,12,0.6)',
      }}
    >
      <span
        className="font-mono text-[10px] uppercase tracking-[0.3em]"
        style={{ color: 'rgba(255,179,71,0.6)' }}
      >
        {title}
      </span>
      <div className="flex flex-1 items-center justify-center">{children}</div>
    </div>
  );
}

export default function LoaderPreview() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setPct((p) => (p >= 100 ? 0 : p + 7));
    }, 600);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="min-h-screen bg-bg-deep p-8">
      <h1
        className="mb-6 font-mono text-sm uppercase tracking-[0.4em]"
        style={{ color: '#FFB347' }}
      >
        LOADER PACK · STORYBOOK
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Cell title="ReactorLoader">
          <ReactorLoader label="STANDBY" />
        </Cell>
        <Cell title="RepulsorProgress">
          <div className="w-full max-w-sm">
            <RepulsorProgress value={pct} label="CHARGING" />
          </div>
        </Cell>
        <Cell title="NanoAssemble">
          <NanoAssemble size={180} />
        </Cell>
        <Cell title="HoloShimmer">
          <HoloShimmer width="100%" height={140} />
        </Cell>
        <Cell title="HUDScan">
          <div className="relative h-[260px] w-full">
            <HUDScan progress={pct} label="LOADING ASSETS" />
          </div>
        </Cell>
      </div>
    </main>
  );
}
