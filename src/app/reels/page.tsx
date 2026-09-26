import { ReelView } from "@/components/stream/reel-view";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export default async function ReelsPage() {
  // Fetch active streams from the database
  const activeStreams = await prisma.stream.findMany({
    where: { isLive: true },
    include: {
      user: true,
    },
    orderBy: { viewerCount: "desc" },
  });

  // Map to the format expected by the frontend
  const streams = activeStreams.map((s) => ({
    id: s.id,
    slug: s.id,
    title: s.title,
    category: s.category as any,
    viewerCount: s.viewerCount,
    isLive: s.isLive,
    hostId: s.user.handle,
    tags: [],
    creator: {
      id: s.user.id,
      handle: s.user.handle,
      displayName: s.user.displayName,
    }
  }));

  // If there are no live streams, we can provide a dummy one for UI showcase
  if (streams.length === 0) {
    streams.push({
      id: "dummy-room",
      slug: "dummy-room",
      title: "Waiting for creators to go live...",
      category: "creative" as any,
      viewerCount: 0,
      isLive: true,
      hostId: "system",
      tags: [],
      creator: {
        id: "sys",
        handle: "system",
        displayName: "LivZo System",
      }
    });
  }

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
