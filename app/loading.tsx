import HUDScan from '@/components/loaders/HUDScan';

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-40 animate-[fadein_180ms_ease-out_forwards] bg-bg-deep"
      style={{
        // Inline keyframes for fade-in (180ms)
        animation: 'fadein 180ms ease-out forwards',
      }}
    >
      <style>{`@keyframes fadein { from { opacity: 0 } to { opacity: 1 } }`}</style>
      <HUDScan label="LOADING SECTION" />
    </div>
  );
}
