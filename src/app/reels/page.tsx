import { ReelView } from "@/components/stream/reel-view";
import { PageFrame } from "@/components/layout/page-frame";

export default function ReelsPage() {
  // Mock data for the LiveStream
  // In a real app, this would be fetched from the database based on the active stream
  const mockStream = {
    id: "live-room-123",
    hostId: "dj_neon_vibes",
    title: "Midnight Synthwave Set",
    viewerCount: 1420,
    status: "LIVE",
    startedAt: new Date().toISOString(),
  };

  return (
    <PageFrame>
      <main className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-black sm:p-6">
        {/* 
          The ReelView component uses LiveKit for WebRTC and automatically handles responsive sizing:
          - Mobile: Full height, full width (Insta Live style)
          - Desktop: Mobile aspect ratio, centered
        */}
        {/* @ts-ignore - Mocking the stream type for demonstration */}
        <ReelView stream={mockStream} />
      </main>
    </PageFrame>
  );
}
