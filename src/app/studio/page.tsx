"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Camera,
  Check,
  Copy,
  Mic,
  MicOff,
  Radio,
  Send,
  Settings2,
  Users,
  Video,
  VideoOff,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageFrame } from "@/components/layout/page-frame";
import { useAuth } from "@/components/providers/auth-provider";
import { ChatPanel } from "@/components/stream/chat-panel";
import { useHostWebRTC } from "@/hooks/use-host-webrtc";

export default function StudioPage() {
  const { user } = useAuth();

  const [isLive, setIsLive] = useState(false);
  const [streamTime, setStreamTime] = useState(0);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);

  const [title, setTitle] = useState("Midnight Creative Coding & Beats");
  const [category, setCategory] = useState("creative");
  const [copiedKey, setCopiedKey] = useState(false);
  const [streamId, setStreamId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize WebRTC P2P Host
  useHostWebRTC(isLive, streamId, streamRef.current);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        // Sync initial state
        stream.getVideoTracks().forEach(t => t.enabled = cameraEnabled);
        stream.getAudioTracks().forEach(t => t.enabled = micEnabled);
      } catch (err) {
        console.error("Failed to access camera", err);
      }
    }
    setupCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Run once on mount

  // Sync track states when toggles change
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(t => t.enabled = cameraEnabled);
    }
  }, [cameraEnabled]);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => t.enabled = micEnabled);
    }
  }, [micEnabled]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        setStreamTime((prev) => prev + 1);
      }, 1000);
      
      // Notify backend we are live
      fetch("/api/streams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, isLive: true })
      })
        .then(res => res.json())
        .then(data => {
          if (data.stream?.id) setStreamId(data.stream.id);
        })
        .catch(console.error);
      
    } else {
      setStreamTime(0);
      
      // Only end if we actually have user context (prevents firing on mount)
      if (user) {
        fetch("/api/streams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isLive: false })
        }).catch(console.error);
      }
    }
    return () => clearInterval(interval);
  }, [isLive, title, category, user]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <PageFrame>
      <main className="mx-auto w-full max-w-[1440px] px-[clamp(16px,4vw,48px)] py-6 sm:py-8">
        {/* Top studio status bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white sm:text-xl">Creator Studio Cockpit</h1>
                {isLive ? (
                  <Badge className="border-rose-500/30 bg-rose-500/15 text-rose-300 font-mono text-xs">
                    <Radio className="mr-1.5 size-3 animate-pulse text-rose-400" />
                    LIVE · {formatTime(streamTime)}
                  </Badge>
                ) : (
                  <Badge className="border-zinc-500/30 bg-zinc-500/15 text-zinc-400 text-xs">
                    OFFLINE
                  </Badge>
                )}
              </div>
              <p className="text-xs text-zinc-400">Channel: @{user?.handle ?? "creator"} · 1080p60 Ingest</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsLive(!isLive)}
              className={
                isLive
                  ? "bg-rose-600 px-5 text-white hover:bg-rose-500"
                  : "bg-gradient-to-r from-violet-500 to-blue-500 px-5 text-white hover:from-violet-400 hover:to-blue-400"
              }
            >
              <Radio className="mr-2 size-4" />
              {isLive ? "End Broadcast" : "Start Streaming Live"}
            </Button>
          </div>
        </div>

        {/* Main studio layout: Preview + Chat & Controls */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Left Column: Video stage & controls */}
          <div className="space-y-6">
            {/* Monitor Stage */}
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted // Always muted locally so the host doesn't hear themselves
                className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${cameraEnabled ? 'opacity-100' : 'opacity-0'}`}
              />
              
              {!cameraEnabled && (
                <div className="absolute inset-0 flex size-full items-center justify-center bg-gradient-to-br from-violet-950/80 via-zinc-950 to-blue-950/60 text-center">
                  <div>
                    <VideoOff className="mx-auto size-12 text-zinc-600" />
                    <p className="mt-2 text-sm text-zinc-500">Camera is off</p>
                  </div>
                </div>
              )}

              {/* Stage overlay controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/60 p-2.5 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setCameraEnabled(!cameraEnabled)}
                    className="size-9 p-0 border-white/10 text-white"
                  >
                    {cameraEnabled ? <Camera className="size-4 text-cyan-300" /> : <VideoOff className="size-4 text-zinc-500" />}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setMicEnabled(!micEnabled)}
                    className="size-9 p-0 border-white/10 text-white"
                  >
                    {micEnabled ? <Mic className="size-4 text-emerald-300" /> : <MicOff className="size-4 text-zinc-500" />}
                  </Button>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <span className={`size-2 rounded-full ${isLive ? "bg-emerald-400 animate-ping" : "bg-zinc-500"}`} />
                    {isLive ? "Stable 60 FPS" : "Ready"}
                  </span>
                  <span className="hidden sm:inline text-zinc-500">|</span>
                  <span className="hidden sm:inline">6,200 kbps</span>
                </div>
              </div>
            </div>

            {/* Broadcast Details Configuration */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white border-b border-white/10 pb-3">
                <Settings2 className="size-4 text-violet-300" />
                Stream Information & Metadata
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300">Stream Title</label>
                  <Input
                    className="mt-1.5"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter an engaging room title"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-violet-400"
                  >
                    <option value="creative" className="bg-zinc-900">Creative & Art</option>
                    <option value="gaming" className="bg-zinc-900">Gaming</option>
                    <option value="music" className="bg-zinc-900">Music & Audio</option>
                    <option value="talk" className="bg-zinc-900">Talk & Podcasts</option>
                    <option value="sports" className="bg-zinc-900">Sports & Fitness</option>
                  </select>
                </div>
              </div>

              {/* Stream key shortcut */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-zinc-400">Broadcasting with OBS or external hardware?</span>
                  <p className="text-zinc-200 font-mono text-[11px] mt-0.5">rtmp://ingest.livzo.com/live</p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText("rtmp://ingest.livzo.com/live");
                    setCopiedKey(true);
                    setTimeout(() => setCopiedKey(false), 2000);
                  }}
                  className="h-8 border-white/15 text-xs text-white"
                >
                  {copiedKey ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                  <span className="ml-1">{copiedKey ? "Copied" : "Copy Ingest"}</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Mini Studio Live Chat & Health */}
          <div className="space-y-6">
            {/* Stream Health & Goal Progress Monitor */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span className="flex items-center gap-1.5">
                  <Activity className="size-4 text-cyan-300" />
                  Stream Health & Goals
                </span>
                <span className="text-emerald-400 font-medium">Excellent</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-white/5 p-2">
                  <span className="text-zinc-500">Live Viewers</span>
                  <p className="mt-0.5 text-sm font-semibold text-white">{isLive ? "342" : "0"}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-2">
                  <span className="text-zinc-500">Bitrate</span>
                  <p className="mt-0.5 text-sm font-semibold text-white">{isLive ? "6,180 kbps" : "0 kbps"}</p>
                </div>
              </div>

              {/* Live Gift Goal Bar */}
              <div className="mt-2 border-t border-white/10 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-amber-300">🎯 Broadcast Goal</span>
                  <span className="text-white">650 / 1,000 Coins</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-amber-400 to-rose-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                </div>
              </div>
            </Card>

            {/* Live Chat Panel for Host */}
            <div className="h-[460px]">
              <ChatPanel roomId={streamId ?? "global"} />
            </div>
          </div>
        </div>
      </main>
    </PageFrame>
  );
}
