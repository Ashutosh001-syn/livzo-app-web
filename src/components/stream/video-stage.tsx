"use client";

import { useEffect, useRef, useState } from "react";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Radio,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";

import type { LiveStream } from "@/types/stream";
import { Badge } from "@/components/ui/badge";

export function VideoStage({ stream, isReelMode }: { stream: LiveStream; isReelMode?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewers, setViewers] = useState(stream.viewerCount);
  const [showControls, setShowControls] = useState(true);

  // Gentle realistic viewer count variation
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = Math.floor(Math.random() * 7) - 3;
      setViewers((prev) => Math.max(1, prev + delta));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      className={`group relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-violet-950 via-[#0d0d14] to-blue-950 shadow-2xl ${
        isReelMode ? "h-full" : "aspect-video rounded-2xl border border-white/10"
      }`}
    >
      {/* Dynamic ambient stage glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(139,92,246,0.22),transparent_65%)]" />

      {/* Simulated Live Broadcast Graphic Animation */}
      <div className="relative flex flex-col items-center justify-center text-center select-none">
        <div
          onClick={() => setIsPlaying(!isPlaying)}
          className="relative flex size-24 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl transition-transform hover:scale-105"
        >
          {isPlaying ? (
            <div className="flex items-center gap-1">
              <span className="h-6 w-1 rounded-full bg-cyan-300 animate-pulse" />
              <span className="h-10 w-1 rounded-full bg-violet-400 animate-pulse [animation-delay:150ms]" />
              <span className="h-8 w-1 rounded-full bg-rose-400 animate-pulse [animation-delay:300ms]" />
              <span className="h-5 w-1 rounded-full bg-amber-300 animate-pulse [animation-delay:450ms]" />
            </div>
          ) : (
            <Play className="ml-1 size-9 fill-white text-white" />
          )}
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-white/80">
          {isPlaying ? "Live Broadcast Feed Active" : "Stream Paused"}
        </p>
        <p className="mt-0.5 text-[11px] text-zinc-400">1080p 60fps · Low Latency Engine</p>
      </div>

      {/* Top Left Live Badge - Hidden in ReelMode since ReelView handles it */}
      {!isReelMode && (
        <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
          <Badge className="border-rose-500/40 bg-rose-600/20 text-rose-200 backdrop-blur-md">
            <Radio className="mr-1.5 size-3 animate-pulse text-rose-400" />
            LIVE · {viewers.toLocaleString()} watching
          </Badge>
        </div>
      )}

      {/* Controls */}
      <div className={`absolute z-20 flex items-center gap-2 ${isReelMode ? "right-4 top-12 sm:top-6" : "right-4 top-4"}`}>
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className="flex size-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="size-5 text-rose-400" /> : <Volume2 className="size-5" />}
        </button>
      </div>
    </div>
  );
}
