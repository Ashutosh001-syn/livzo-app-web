"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Heart, Send, Sparkles, Users, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";

interface ChatItem {
  id: string;
  sender: string;
  role?: "host" | "mod" | "vip" | "user";
  text: string;
  isGift?: boolean;
  giftIcon?: "heart" | "zap" | "sparkles";
}

const initialMessages: ChatItem[] = [
  { id: "1", sender: "kai_sound", role: "vip", text: "Bass drop in this track is wild 🔥" },
  { id: "2", sender: "maya_art", role: "mod", text: "Welcome everyone to midnight room!" },
  { id: "3", sender: "liam_22", role: "user", text: "Greetings from Tokyo! 🗼" },
];

const giftOptions = [
  { id: "heart", label: "Super Heart", cost: "50", icon: Heart, color: "text-rose-400" },
  { id: "zap", label: "Neon Rocket", cost: "250", icon: Zap, color: "text-amber-300" },
  { id: "sparkles", label: "Galaxy Crown", cost: "1,000", icon: Sparkles, color: "text-fuchsia-300" },
];

export function ChatPanel() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatItem[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [floatingGifts, setFloatingGifts] = useState<{ id: number; label: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Occasional simulated audience chatter
  useEffect(() => {
    const audiencePool = [
      { sender: "neon_rider", text: "Audio visualizer looks insane 🎧" },
      { sender: "clara_sky", text: "Loving this set so much!" },
      { sender: "stream_fan99", text: "Drop the playlist link please!" },
    ];
    let index = 0;

    const interval = setInterval(() => {
      const sample = audiencePool[index % audiencePool.length];
      index++;
      setMessages((prev) => [
        ...prev,
        {
          id: `aud-${Date.now()}`,
          sender: sample.sender,
          role: "user",
          text: sample.text,
        },
      ]);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `usr-${Date.now()}`,
        sender: user?.handle ?? "guest_viewer",
        role: (user?.role as "host" | "mod" | "user") ?? "user",
        text: inputText,
      },
    ]);
    setInputText("");
  };

  const handleSendGift = (gift: (typeof giftOptions)[number]) => {
    const giftId = Date.now();
    setFloatingGifts((prev) => [...prev, { id: giftId, label: gift.label }]);

    setMessages((prev) => [
      ...prev,
      {
        id: `gft-${giftId}`,
        sender: user?.handle ?? "generous_fan",
        role: "vip",
        text: `Sent a ${gift.label}! 🎉`,
        isGift: true,
        giftIcon: gift.id as "heart" | "zap" | "sparkles",
      },
    ]);

    setIsGiftModalOpen(false);
    setTimeout(() => {
      setFloatingGifts((prev) => prev.filter((g) => g.id !== giftId));
    }, 3000);
  };

  return (
    <aside className="relative flex h-[580px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-xl">
      {/* Floating gift screen animation */}
      <AnimatePresence>
        {floatingGifts.map((gift) => (
          <motion.div
            key={gift.id}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: -80, scale: 1.2 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center"
          >
            <div className="flex items-center gap-2 rounded-full border border-fuchsia-400/40 bg-gradient-to-r from-fuchsia-600/90 to-violet-600/90 px-4 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-md">
              <Sparkles className="size-4 animate-spin text-amber-300" />
              <span>{gift.label} Sent!</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Users className="size-4 text-violet-300" />
          Live Room Chat
        </div>
        <Button
          variant="secondary"
          onClick={() => setIsGiftModalOpen(true)}
          className="h-8 rounded-lg border-fuchsia-500/30 bg-fuchsia-500/15 px-2.5 text-xs text-fuchsia-300 hover:bg-fuchsia-500/25"
        >
          <Gift className="mr-1.5 size-3.5" />
          Send Gift
        </Button>
      </div>

      {/* Messages list */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-xl p-2.5 transition-colors ${
              msg.isGift
                ? "border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200"
                : "bg-white/[0.025] text-zinc-200"
            }`}
          >
            <div className="flex items-center gap-1.5 font-medium">
              <span className="font-semibold text-white">@{msg.sender}</span>
              {msg.role === "host" && (
                <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-rose-300">
                  Host
                </span>
              )}
              {msg.role === "mod" && (
                <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-cyan-300">
                  Mod
                </span>
              )}
              {msg.role === "vip" && (
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-300">
                  VIP
                </span>
              )}
            </div>
            <p className="mt-1 leading-relaxed text-zinc-300">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Gift drawer popup */}
      <AnimatePresence>
        {isGiftModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute inset-x-0 bottom-16 z-30 border-t border-white/10 bg-zinc-950/95 p-3.5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between pb-2 text-xs font-semibold text-white">
              <span>Choose a Virtual Gift</span>
              <button
                type="button"
                onClick={() => setIsGiftModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {giftOptions.map((gift) => (
                <button
                  key={gift.id}
                  type="button"
                  onClick={() => handleSendGift(gift)}
                  className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 p-2 text-center transition-colors hover:border-fuchsia-400 hover:bg-white/10"
                >
                  <gift.icon className={`size-5 ${gift.color}`} />
                  <span className="mt-1 text-[11px] font-medium text-white">{gift.label}</span>
                  <span className="text-[10px] text-fuchsia-300">{gift.cost} coins</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="border-t border-white/10 p-3">
        <div className="flex gap-2">
          <Input
            placeholder="Send a live message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="h-10 text-xs"
          />
          <Button
            type="submit"
            className="h-10 px-3.5 bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:from-violet-400 hover:to-blue-400"
            aria-label="Send message"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </form>
    </aside>
  );
}
