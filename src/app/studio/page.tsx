"use client";

import { useEffect, useState } from "react";
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

export default function StudioPage() {
  const { user } = useAuth();

  const [isLive, setIsLive] = useState(false);
  const [streamTime, setStreamTime] = useState(0);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);

  const [title, setTitle] = useState("Midnight Creative Coding & Beats");
  const [category, setCategory] = useState("creative");

  const [chatMessages, setChatMessages] = useState([
    { id: "m-1", user: "alex_beats", text: "Studio audio is super crisp today!", time: "just now" },
    { id: "m-2", user: "dev_sarah", text: "Excited for this session! 🚀", time: "just now" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        setStreamTime((prev) => prev + 1);
      }, 1000);
    } else {
      setStreamTime(0);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        user: user?.handle ?? "you (host)",
        text: chatInput,
        time: "just now",
      },
    ]);
    setChatInput("");
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
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-950/80 via-zinc-950 to-blue-950/60 shadow-2xl">
              {cameraEnabled ? (
                <div className="relative flex size-full items-center justify-center">
                  {/* Visual test pattern animation */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.2),transparent_60%)]" />
                  <div className="text-center">
                    <div className="relative mx-auto flex size-20 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-violet-500 to-blue-600 shadow-xl">
                      <Camera className="size-8 text-white" />
                    </div>
                    <p className="mt-4 font-semibold text-white">Camera Preview Active</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {isLive ? "Broadcasting live to LivZo network" : "Ready to transmit"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex size-full items-center justify-center text-center">
                  <div>
                    <VideoOff className="mx-auto size-12 text-zinc-600" />
                    <p className="mt-2 text-sm text-zinc-500">Camera preview is paused</p>
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
            <Card className="flex flex-col h-[460px] p-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 font-semibold text-white text-sm">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-violet-300" />
                  Room Chat
                </div>
                <span className="text-xs text-zinc-500">{chatMessages.length} messages</span>
              </div>

              {/* Chat messages */}
              <div className="flex-1 space-y-3 overflow-y-auto py-3 pr-1 text-xs">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="rounded-lg bg-white/[0.03] p-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-violet-300">@{msg.user}</span>
                      <span className="text-zinc-600">{msg.time}</span>
                    </div>
                    <p className="mt-1 text-zinc-200">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Host chat input */}
              <form onSubmit={handleSendMessage} className="mt-2 flex gap-2 pt-2 border-t border-white/10">
                <Input
                  className="h-10 text-xs"
                  placeholder="Chat with your room as host..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <Button type="submit" className="h-10 px-3 bg-violet-600 text-white hover:bg-violet-500">
                  <Send className="size-4" />
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </PageFrame>
  );
}
