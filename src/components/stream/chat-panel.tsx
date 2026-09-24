"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Heart, Send, Sparkles, Users, Zap, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";
import { useSocket } from "@/components/providers/socket-provider";

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

export function ChatPanel({ isOverlay, roomId = "global" }: { isOverlay?: boolean, roomId?: string }) {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [floatingGifts, setFloatingGifts] = useState<{ id: number; label: string }[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit("join_room", roomId);

    const handleMessage = (data: any) => {
      setChatMessages(prev => [...prev, { id: data.id, message: data.message, from: { identity: data.user } }]);
    };

    const handleGift = (data: any) => {
      setChatMessages(prev => [...prev, { id: data.id, message: `[GIFT] ${data.gift}`, from: { identity: data.user } }]);
    };

    socket.on("receive_message", handleMessage);
    socket.on("receive_gift", handleGift);

    return () => {
      socket.off("receive_message", handleMessage);
      socket.off("receive_gift", handleGift);
    };
  }, [socket, isConnected, roomId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("Please log in to chat.");
      return;
    }
    if (!inputText.trim()) return;

    if (socket && isConnected) {
      socket.emit("send_message", { roomId, message: inputText, user: user.handle });
    }
    setInputText("");
  };

  const handleSendGift = (gift: (typeof giftOptions)[number]) => {
    if (!user) {
      showToast("Please log in to send gifts.");
      return;
    }
    const giftId = Date.now();
    setFloatingGifts((prev) => [...prev, { id: giftId, label: gift.label }]);

    if (socket && isConnected) {
      socket.emit("send_gift", { roomId, gift: gift.id, user: user.handle });
    }

    setIsGiftModalOpen(false);
    setTimeout(() => {
      setFloatingGifts((prev) => prev.filter((g) => g.id !== giftId));
    }, 3000);
  };

  return (
    <aside className={`relative flex flex-col overflow-hidden ${isOverlay ? 'h-full justify-end bg-transparent pb-4' : 'h-[580px] rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-xl'}`}>
      {/* Custom Error Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-200 backdrop-blur-xl shadow-2xl"
          >
            <AlertCircle className="size-4 text-rose-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

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
      {!isOverlay && (
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
      )}

      {/* Messages list */}
      <div ref={scrollRef} className={`flex-1 overflow-y-auto space-y-3 ${isOverlay ? 'p-4 mask-image-top' : 'p-4'} text-xs`} style={{ maskImage: isOverlay ? 'linear-gradient(to top, black 80%, transparent 100%)' : 'none', WebkitMaskImage: isOverlay ? 'linear-gradient(to top, black 80%, transparent 100%)' : 'none' }}>
        {chatMessages.map((msg) => {
          const isGift = msg.message.startsWith("[GIFT]");
          const displayMsg = isGift ? `Sent a gift!` : msg.message;
          return (
            <div
              key={msg.id}
              className={`rounded-xl p-2.5 transition-colors ${
                isGift
                  ? "border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200"
                  : "bg-white/[0.025] text-zinc-200"
              }`}
            >
              <div className="flex items-center gap-1.5 font-medium">
                <span className="font-semibold text-white">@{msg.from?.identity ?? "User"}</span>
              </div>
              <p className="mt-1 leading-relaxed text-zinc-300">{displayMsg}</p>
            </div>
          );
        })}
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
      <form onSubmit={handleSendMessage} className={`flex gap-2 p-3 ${isOverlay ? '' : 'border-t border-white/10'}`}>
        <div className="flex flex-1 gap-2">
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
        {isOverlay && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsGiftModalOpen(true)}
            className="h-10 w-10 shrink-0 rounded-full border-fuchsia-500/30 bg-fuchsia-500/20 p-0 text-fuchsia-300 hover:bg-fuchsia-500/30"
          >
            <Gift className="size-5" />
          </Button>
        )}
      </form>
    </aside>
  );
}
