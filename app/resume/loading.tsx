import HoloShimmer from '@/components/loaders/HoloShimmer';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-bg-deep p-8">
      <div className="w-full max-w-3xl">
        <HoloShimmer width="100%" height={600} />
      </div>
      <span
        className="font-mono text-[10px] uppercase tracking-[0.4em]"
        style={{ color: 'rgba(255,179,71,0.6)' }}
      >
        DOSSIER LOADING
      </span>
    </div>
  );
}
