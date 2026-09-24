"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Radio,
  Users,
  Volume2,
  Hand,
  Sparkles,
  Music,
  Crown,
  Headphones,
  Plus,
  Send,
  Flame,
} from "lucide-react";
import { PageFrame } from "@/components/layout/page-frame";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Speaker {
  id: string;
  name: string;
  avatar: string;
  isHost?: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
}

interface AudioRoom {
  id: string;
  title: string;
  category: string;
  hostName: string;
  listenersCount: number;
  speakers: Speaker[];
}

const audioRoomsData: AudioRoom[] = [
  {
    id: "ar-1",
    title: "Synthwave & Cyberpunk Chill Lounge 🎧✨",
    category: "Music & Beats",
    hostName: "DJ Neon",
    listenersCount: 1420,
    speakers: [
      {
        id: "s1",
        name: "DJ Neon",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        isHost: true,
        isMuted: false,
        isSpeaking: true,
      },
      {
        id: "s2",
        name: "Aria Beats",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        isMuted: true,
        isSpeaking: false,
      },
      {
        id: "s3",
        name: "Kairo Synth",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        isMuted: false,
        isSpeaking: true,
      },
      {
        id: "s4",
        name: "Luna Acoustic",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        isMuted: true,
        isSpeaking: false,
      },
    ],
  },
  {
    id: "ar-2",
    title: "Web3 & AI Creator Roundtable 🚀",
    category: "Tech & Future",
    hostName: "TechSam",
    listenersCount: 890,
    speakers: [
      {
        id: "s5",
        name: "TechSam",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        isHost: true,
        isMuted: false,
        isSpeaking: true,
      },
      {
        id: "s6",
        name: "Elena_AI",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        isMuted: false,
        isSpeaking: false,
      },
    ],
  },
];

export default function AudioRoomsPage() {
  const [activeRoom, setActiveRoom] = useState<AudioRoom>(audioRoomsData[0]);
  const [isMicOn, setIsMicOn] = useState(false);
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const [sfxFeedback, setSfxFeedback] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState([
    { id: "m1", user: "CyberFan", text: "Loving this sound track! 🎶" },
    { id: "m2", user: "GamerGirl", text: "Can I request to speak next?" },
    { id: "m3", user: "DevDave", text: "Greetings everyone from Tokyo! 🗼" },
  ]);
  const [inputMsg, setInputMsg] = useState("");

  const triggerSfx = (name: string) => {
    setSfxFeedback(name);
    setTimeout(() => setSfxFeedback(null), 1800);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages((prev) => [...prev, { id: Date.now().toString(), user: "You", text: inputMsg.trim() }]);
    setInputMsg("");
  };

  return (
    <PageFrame>
      <main className="mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,48px)] py-10">
        {/* Header Title */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-purple-300">
              <Headphones className="size-3.5" /> Live Audio Lounge
            </div>
            <h1 className="mt-3 text-[clamp(28px,3vw,42px)] font-bold text-white">
              Hop into multi-seat <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">Audio Stages</span>
            </h1>
          </div>
          <Button className="h-11 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 text-sm font-semibold text-white shadow-lg hover:from-violet-500 hover:to-blue-500">
            <Plus className="mr-2 size-4" /> Start Audio Room
          </Button>
        </div>

        {/* Room Switcher Tabs */}
        <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
          {audioRoomsData.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room)}
              className={`flex shrink-0 items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${
                activeRoom.id === room.id
                  ? "border-cyan-400/50 bg-cyan-500/10 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                  : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-white"
              }`}
            >
              <Radio className={`size-4 ${activeRoom.id === room.id ? "text-cyan-400" : "text-zinc-500"}`} />
              <span>{room.title}</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-cyan-300">
                {room.listenersCount} tuning in
              </span>
            </button>
          ))}
        </div>

        {/* Active Audio Stage Cockpit */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Main Stage Panel (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="relative overflow-hidden border-white/15 bg-gradient-to-br from-zinc-950 via-purple-950/20 to-zinc-950 p-8 shadow-2xl">
              {/* SFX Feedback Notification */}
              {sfxFeedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute left-1/2 top-4 z-30 -translate-x-1/2 rounded-full border border-amber-400/40 bg-amber-500/20 px-4 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-xl"
                >
                  🎉 Played SFX: {sfxFeedback}
                </motion.div>
              )}

              {/* Stage Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">{activeRoom.category}</span>
                  <h2 className="text-xl font-bold text-white mt-0.5">{activeRoom.title}</h2>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  <span className="size-2 animate-ping rounded-full bg-emerald-400" />
                  Stage Live
                </div>
              </div>

              {/* Speaker Seats Grid (8 Seats) */}
              <div className="my-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
                {activeRoom.speakers.map((speaker) => (
                  <div key={speaker.id} className="flex flex-col items-center">
                    <div className="relative">
                      {/* Active Speaking Ring Animation */}
                      {speaker.isSpeaking && (
                        <motion.span
                          animate={{ scale: [1, 1.25, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="absolute inset-0 rounded-full border-2 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.6)]"
                        />
                      )}
                      <img
                        src={speaker.avatar}
                        alt={speaker.name}
                        className="relative z-10 size-20 rounded-full border-2 border-white/20 object-cover"
                      />
                      {speaker.isHost && (
                        <span className="absolute -top-2 -right-1 z-20 flex size-7 items-center justify-center rounded-full bg-amber-400 text-zinc-950 shadow-md">
                          <Crown className="size-4" />
                        </span>
                      )}
                      <span className="absolute bottom-0 right-0 z-20 flex size-6 items-center justify-center rounded-full border border-white/20 bg-zinc-900 text-white">
                        {speaker.isMuted ? <MicOff className="size-3 text-rose-400" /> : <Mic className="size-3 text-emerald-400" />}
                      </span>
                    </div>
                    <span className="mt-2 text-xs font-semibold text-white">{speaker.name}</span>
                    <span className="text-[10px] text-zinc-400">{speaker.isHost ? "Host" : "Speaker"}</span>
                  </div>
                ))}

                {/* Open Audience Seats (Placeholders) */}
                {[...Array(8 - activeRoom.speakers.length)].map((_, idx) => (
                  <div key={idx} className="flex flex-col items-center opacity-50 hover:opacity-100 transition cursor-pointer">
                    <div className="flex size-20 items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-white/5 text-zinc-400">
                      <Plus className="size-6" />
                    </div>
                    <span className="mt-2 text-xs text-zinc-400">Empty Seat</span>
                  </div>
                ))}
              </div>

              {/* Bottom Audio Stage Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setIsMicOn((prev) => !prev)}
                    className={`h-11 rounded-xl px-5 text-xs font-semibold transition ${
                      isMicOn
                        ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                        : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {isMicOn ? <Mic className="mr-2 size-4" /> : <MicOff className="mr-2 size-4" />}
                    {isMicOn ? "Mic Active" : "Unmute Mic"}
                  </Button>

                  <Button
                    onClick={() => setHasRaisedHand((prev) => !prev)}
                    variant="secondary"
                    className={`h-11 rounded-xl border-white/15 px-4 text-xs font-semibold transition ${
                      hasRaisedHand ? "bg-amber-400/20 border-amber-400/40 text-amber-300" : "bg-white/5 text-white"
                    }`}
                  >
                    <Hand className="mr-2 size-4 text-amber-400" />
                    {hasRaisedHand ? "Hand Raised" : "Request Seat"}
                  </Button>
                </div>

                {/* Soundboard Shortcuts */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 mr-1">Soundboard:</span>
                  {[
                    { label: "👏 Clap", name: "Applause" },
                    { label: "🔥 Fire", name: "Hype Airhorn" },
                    { label: "✨ Cheers", name: "Crowd Cheer" },
                  ].map((sfx) => (
                    <button
                      key={sfx.name}
                      onClick={() => triggerSfx(sfx.name)}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-cyan-400 hover:text-white"
                    >
                      {sfx.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Side Room Chat & Listeners Grid */}
          <div className="space-y-6">
            <Card className="flex h-[520px] flex-col justify-between border-white/15 bg-zinc-950/90 p-5 shadow-xl backdrop-blur-xl">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Users className="size-4 text-purple-400" /> Audio Room Chat
                  </div>
                  <span className="text-xs text-zinc-400">{activeRoom.listenersCount} listening</span>
                </div>

                <div className="mt-3 space-y-3 overflow-y-auto max-h-[380px] pr-1 text-xs">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                      <span className="font-semibold text-cyan-300">{msg.user}: </span>
                      <span className="text-zinc-200">{msg.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-white/10">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Chat with audio lounge..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="flex size-9 items-center justify-center rounded-xl bg-purple-600 text-white hover:bg-purple-500"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </PageFrame>
  );
}
