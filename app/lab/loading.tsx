import NanoAssemble from '@/components/loaders/NanoAssemble';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-bg-deep">
      <NanoAssemble />
      <span
        className="font-mono text-[10px] uppercase tracking-[0.4em]"
        style={{ color: 'rgba(255,179,71,0.6)' }}
      >
        ASSEMBLING COMPONENTS
      </span>
    </div>
  );
}
