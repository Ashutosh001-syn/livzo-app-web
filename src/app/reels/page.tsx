import { ReelView } from "@/components/stream/reel-view";

export default function ReelsPage() {
  // Generate a list of mock streams
  const streams = Array.from({ length: 10 }).map((_, i) => ({
    id: `live-room-${i}`,
    hostId: ["dj_neon_vibes", "luna_x", "zfox_live", "mia_b", "jcarter", "aria_w"][i % 6] + (i > 5 ? `_${i}` : ""),
    title: `Amazing Live Stream ${i + 1}`,
    viewerCount: Math.floor(Math.random() * 5000) + 100, // Random viewers between 100 and 5100
    status: "LIVE" as const,
    startedAt: new Date(Date.now() - Math.random() * 10000000).toISOString(),
  }));

  // Sort streams by viewer count (highest to lowest)
  streams.sort((a, b) => b.viewerCount - a.viewerCount);

  return (
    <main className="fixed inset-0 w-full bg-black overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar touch-pan-y">
      {streams.map((stream) => (
        <div key={stream.id} className="h-[100dvh] w-full snap-start snap-always flex items-center justify-center sm:p-6 shrink-0">
          {/* @ts-ignore */}
          <ReelView stream={stream} />
        </div>
      ))}
    </main>
  );
}
