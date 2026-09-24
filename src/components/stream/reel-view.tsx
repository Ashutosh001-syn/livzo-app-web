"use client";

import { LiveStream } from "@/types/stream";
import { VideoStage } from "./video-stage";
import { ChatPanel } from "./chat-panel";
import { useAuth } from "@/components/providers/auth-provider";

export function ReelView({ stream }: { stream: LiveStream }) {
  const { user } = useAuth();

  return (
    <div className="relative mx-auto flex h-[100dvh] w-full max-w-[480px] flex-col overflow-hidden bg-black sm:h-[85vh] sm:min-h-[800px] sm:rounded-3xl sm:border sm:border-white/10 sm:shadow-2xl">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
          <VideoStage stream={stream} isReelMode />
        </div>
        
        {/* Overlay Gradient for readability */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Overlay Content */}
        <div className="relative z-20 flex h-full flex-col justify-between">
          {/* Reel Header (Host Info) */}
          <div className="flex w-full items-start justify-between p-4 pt-12 sm:pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-fuchsia-600 to-violet-600 p-[2px] shadow-lg">
                <div className="h-full w-full rounded-full border-2 border-black bg-zinc-800" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white shadow-black drop-shadow-md">{stream.hostId.substring(0, 8)}</span>
                  <button className="rounded-full bg-transparent px-2 py-0.5 text-xs font-semibold text-white/90 ring-1 ring-white/30 backdrop-blur-md transition hover:bg-white/10 hover:text-white">
                    Follow
                  </button>
                </div>
                <span className="text-[11px] font-medium text-rose-400 drop-shadow-md">• LIVE</span>
              </div>
            </div>
          </div>

          {/* Chat and Controls */}
          <div className="h-1/2 w-full max-h-[500px]">
            <ChatPanel isOverlay roomId={stream.id} />
          </div>
        </div>
    </div>
  );
}
