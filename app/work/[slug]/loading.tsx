import HUDScan from '@/components/loaders/HUDScan';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-40 bg-bg-deep">
      <HUDScan label="OPENING CASE FILE" />
    </div>
  );
}
