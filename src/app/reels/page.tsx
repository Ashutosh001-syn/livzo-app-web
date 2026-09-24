"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  Gift,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music,
  Plus,
  Sparkles,
  ChevronUp,
  ChevronDown,
  X,
  Send,
  Zap,
} from "lucide-react";
import { PageFrame } from "@/components/layout/page-frame";
import { Button } from "@/components/ui/button";

interface Reel {
  id: string;
  creator: {
    name: string;
    handle: string;
    avatar: string;
    isFollowing: boolean;
  };
  caption: string;
  songName: string;
  likes: number;
  commentsCount: number;
  giftsReceived: number;
  videoBg: string;
  tags: string[];
}

const reelsData: Reel[] = [
  {
    id: "reel-1",
    creator: {
      name: "Cyber DJ Kai",
      handle: "kaivibes",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      isFollowing: false,
    },
    caption: "Dropping my new cyberpunk synthwave set live tonight! 🚀 Will you be there?",
    songName: "Kai - Neon Dreams (Original Mix)",
    likes: 42800,
    commentsCount: 1420,
    giftsReceived: 890,
    videoBg: "from-violet-950 via-purple-900 to-indigo-950",
    tags: ["#synthwave", "#cyberpunk", "#liveset"],
  },
  {
    id: "reel-2",
    creator: {
      name: "Aria Streamer",
      handle: "aria_live",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      isFollowing: true,
    },
    caption: "Rank 1 clutch moment in apex tournament! Watch until the end 😱🔥",
    songName: "Aria - Victory Theme",
    likes: 89300,
    commentsCount: 3100,
    giftsReceived: 2400,
    videoBg: "from-cyan-950 via-blue-900 to-zinc-950",
    tags: ["#gaming", "#clutch", "#apex"],
  },
  {
    id: "reel-3",
    creator: {
      name: "Luna Acoustic",
      handle: "lunalive",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      isFollowing: false,
    },
    caption: "Late night acoustic session request! Leave your favorite song in comments 🎸✨",
    songName: "Luna - Starlight Cover",
    likes: 23400,
    commentsCount: 890,
    giftsReceived: 560,
    videoBg: "from-fuchsia-950 via-pink-900 to-purple-950",
    tags: ["#music", "#cover", "#acoustic"],
  },
];

export default function ReelsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({
    "reel-1": 42800,
    "reel-2": 89300,
    "reel-3": 23400,
  });
  const [showComments, setShowComments] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [comments, setComments] = useState([
    { id: "c1", user: "NeonKnight", text: "This beat is straight fire! 🔥🔥", time: "2m ago" },
    { id: "c2", user: "CyberQueen", text: "Sending galaxy gifts right now! 🌌", time: "5m ago" },
    { id: "c3", user: "Alex_V", text: "Can't wait for the live room tonight!", time: "12m ago" },
  ]);
  const [newComment, setNewComment] = useState("");

  const currentReel = reelsData[currentIndex];

  const handleNext = () => {
    if (currentIndex < reelsData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const toggleLike = (id: string) => {
    setLikedReels((prev) => {
      const isLiked = !prev[id];
      setLikeCounts((counts) => ({
        ...counts,
        [id]: (counts[id] || 0) + (isLiked ? 1 : -1),
      }));
      return { ...prev, [id]: isLiked };
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now().toString(), user: "You", text: newComment.trim(), time: "Just now" },
    ]);
    setNewComment("");
  };

  return (
    <PageFrame>
      <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center py-6 px-4">
        {/* Swiper Controls */}
        <div className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-xl transition hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronUp className="size-6" />
          </button>
          <div className="flex flex-col items-center gap-1.5 py-2">
            {reelsData.map((_, idx) => (
              <span
                key={idx}
                className={`size-2 rounded-full transition-all ${
                  idx === currentIndex ? "h-6 bg-cyan-400" : "bg-white/30"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={currentIndex === reelsData.length - 1}
            className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-xl transition hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronDown className="size-6" />
          </button>
        </div>

        {/* Video Card Container */}
        <div className="relative mx-auto h-[780px] max-h-[85vh] w-full max-w-[420px] overflow-hidden rounded-3xl border border-white/15 bg-zinc-950 shadow-[0_0_50px_rgba(139,92,246,0.25)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentReel.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              className={`relative size-full bg-gradient-to-b ${currentReel.videoBg} flex flex-col justify-between p-6 select-none`}
            >
              {/* Animated Glow Background Visualizer Mockup */}
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute -left-20 top-1/4 size-72 rounded-full bg-cyan-500/30 blur-[90px] animate-pulse" />
                <div className="absolute -right-20 bottom-1/4 size-72 rounded-full bg-purple-600/40 blur-[90px] animate-pulse" />
              </div>

              {/* Top Bar Controls */}
              <div className="relative z-20 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-md">
                  <span className="size-2 animate-ping rounded-full bg-red-500" />
                  <span className="font-semibold uppercase tracking-wider text-cyan-300">LivZo Short</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted((prev) => !prev)}
                    className="flex size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                  </button>
                  <button
                    onClick={() => setIsPlaying((prev) => !prev)}
                    className="flex size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
                  </button>
                </div>
              </div>

              {/* Center Play Overlay Icon */}
              {!isPlaying && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <div className="flex size-16 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md">
                    <Play className="size-8 ml-1" />
                  </div>
                </div>
              )}

              {/* Right Sidebar Actions */}
              <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-5">
                {/* Like Button */}
                <div className="flex flex-col items-center gap-1">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => toggleLike(currentReel.id)}
                    className={`flex size-12 items-center justify-center rounded-full border border-white/10 backdrop-blur-md transition-all ${
                      likedReels[currentReel.id]
                        ? "bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)]"
                        : "bg-black/40 text-white hover:bg-white/20"
                    }`}
                  >
                    <Heart
                      className={`size-6 ${likedReels[currentReel.id] ? "fill-white" : ""}`}
                    />
                  </motion.button>
                  <span className="text-xs font-semibold text-white">
                    {(likeCounts[currentReel.id] || 0).toLocaleString()}
                  </span>
                </div>

                {/* Comments Button */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setShowComments(true)}
                    className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition hover:bg-white/20"
                  >
                    <MessageCircle className="size-6" />
                  </button>
                  <span className="text-xs font-semibold text-white">{currentReel.commentsCount}</span>
                </div>

                {/* Send Gift Button */}
                <div className="flex flex-col items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowGiftModal(true)}
                    className="flex size-12 items-center justify-center rounded-full border border-amber-400/40 bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                  >
                    <Gift className="size-6" />
                  </motion.button>
                  <span className="text-xs font-semibold text-amber-300">Gift</span>
                </div>

                {/* Share Button */}
                <button className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition hover:bg-white/20">
                  <Share2 className="size-6" />
                </button>
              </div>

              {/* Bottom Creator Info & Caption */}
              <div className="relative z-20 space-y-3 pr-16">
                <div className="flex items-center gap-3">
                  <img
                    src={currentReel.creator.avatar}
                    alt={currentReel.creator.name}
                    className="size-11 rounded-full border-2 border-cyan-400 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-white leading-tight">{currentReel.creator.name}</h3>
                    <p className="text-xs text-zinc-300">@{currentReel.creator.handle}</p>
                  </div>
                  <Button
                    size="sm"
                    className="h-7 rounded-full bg-cyan-400 px-3 text-xs font-semibold text-zinc-950 hover:bg-cyan-300 ml-1"
                  >
                    <Plus className="mr-1 size-3" /> Follow
                  </Button>
                </div>

                <p className="text-sm text-zinc-100 leading-snug">{currentReel.caption}</p>

                <div className="flex flex-wrap gap-1.5">
                  {currentReel.tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium text-cyan-300">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Song Marquee */}
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-zinc-300 backdrop-blur-md w-max max-w-full">
                  <Music className="size-3.5 animate-spin text-purple-400" />
                  <span className="truncate">{currentReel.songName}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Comment Drawer Modal */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.25 }}
                className="absolute inset-x-0 bottom-0 z-40 h-[60%] rounded-t-3xl border-t border-white/15 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h4 className="font-semibold text-white text-sm">Comments ({comments.length})</h4>
                    <button
                      onClick={() => setShowComments(false)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X className="size-5" />
                    </button>
                  </div>

                  <div className="mt-3 space-y-3 overflow-y-auto max-h-[260px] pr-1">
                    {comments.map((c) => (
                      <div key={c.id} className="flex gap-2.5 text-xs">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-600 font-semibold text-white">
                          {c.user[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{c.user}</span>
                            <span className="text-[10px] text-zinc-500">{c.time}</span>
                          </div>
                          <p className="mt-0.5 text-zinc-300">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-white/10">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="flex size-9 items-center justify-center rounded-full bg-cyan-400 text-zinc-950 hover:bg-cyan-300"
                  >
                    <Send className="size-4" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Virtual Gift Drawer Modal */}
          <AnimatePresence>
            {showGiftModal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-x-4 top-1/4 z-50 rounded-2xl border border-amber-400/30 bg-zinc-950/95 p-5 shadow-2xl backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                    <Sparkles className="size-4" /> Send Virtual Gift
                  </div>
                  <button onClick={() => setShowGiftModal(false)} className="text-zinc-400 hover:text-white">
                    <X className="size-5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 my-4">
                  {[
                    { name: "Super Heart", cost: 50, icon: Heart, color: "text-rose-400" },
                    { name: "Neon Rocket", cost: 250, icon: Zap, color: "text-amber-300" },
                    { name: "Galaxy Crown", cost: 1000, icon: Sparkles, color: "text-fuchsia-300" },
                  ].map((g) => (
                    <button
                      key={g.name}
                      onClick={() => {
                        setShowGiftModal(false);
                        alert(`Sent ${g.name} to ${currentReel.creator.name}! 🚀`);
                      }}
                      className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 p-3 hover:border-amber-400 hover:bg-white/10 transition"
                    >
                      <g.icon className={`size-6 ${g.color}`} />
                      <span className="mt-1 text-xs font-semibold text-white">{g.name}</span>
                      <span className="text-[10px] text-amber-300">{g.cost} Coins</span>
                    </button>
                  ))}
                </div>

                <p className="text-center text-[11px] text-zinc-400">Your Coin Balance: 1,450 Coins</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </PageFrame>
  );
}
