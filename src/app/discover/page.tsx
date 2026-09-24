"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Compass, Radio, Search } from "lucide-react";

import { featuredStreams } from "@/lib/data/streams";
import { PageFrame } from "@/components/layout/page-frame";
import { StreamGrid } from "@/components/stream/stream-grid";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All Streams" },
  { id: "gaming", label: "Gaming" },
  { id: "music", label: "Music" },
  { id: "talk", label: "Talk" },
  { id: "creative", label: "Creative" },
  { id: "sports", label: "Sports" },
];

function DiscoverContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "all";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStreams = useMemo(() => {
    return featuredStreams.filter((stream) => {
      const matchesCategory =
        selectedCategory === "all" || stream.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stream.creator.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stream.creator.handle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const [aiVibe, setAiVibe] = useState("");
  const [aiMatchedStream, setAiMatchedStream] = useState<(typeof featuredStreams)[0] | null>(null);

  const handleAiMatch = (vibe: string) => {
    setAiVibe(vibe);
    // Simple matching algorithm based on vibe tags
    const match = featuredStreams.find(
      (s) => s.category.toLowerCase().includes(vibe.toLowerCase()) || s.title.toLowerCase().includes(vibe.toLowerCase())
    ) || featuredStreams[0];
    setAiMatchedStream(match);
  };

  return (
    <div className="space-y-8">
      {/* Smart AI Host Matcher Banner */}
      <div className="rounded-3xl border border-violet-500/30 bg-gradient-to-r from-purple-950/60 via-zinc-950 to-blue-950/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
            <Radio className="size-3.5 animate-pulse" /> AI Host Recommendation Engine
          </div>
          <h2 className="mt-3 text-xl font-bold text-white sm:text-2xl">
            What vibe are you looking for right now?
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {["Chill Beats", "Competitive Gaming", "Creative Art", "Late Night Talk"].map((vibe) => (
              <button
                key={vibe}
                onClick={() => handleAiMatch(vibe)}
                className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                  aiVibe === vibe
                    ? "border-cyan-400 bg-cyan-400 text-zinc-950 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                    : "border-white/15 bg-white/5 text-zinc-300 hover:bg-white/10"
                }`}
              >
                ✨ {vibe}
              </button>
            ))}
          </div>

          {aiMatchedStream && (
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-cyan-400/40 bg-black/60 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <img
                  src={aiMatchedStream.creator.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${aiMatchedStream.creator.handle}`}
                  alt={aiMatchedStream.creator.displayName}
                  className="size-11 rounded-full border-2 border-cyan-400 object-cover"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">98% AI Match Found</span>
                  <h3 className="text-sm font-bold text-white">{aiMatchedStream.title}</h3>
                  <p className="text-xs text-zinc-400">Host: {aiMatchedStream.creator.displayName}</p>
                </div>
              </div>
              <Link href={`/live/${aiMatchedStream.id}`}>
                <button className="rounded-xl bg-cyan-400 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-cyan-300">
                  Watch Match →
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Category filter pills & Search bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/10 pb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-medium transition-all",
                  isSelected
                    ? "bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-md shadow-violet-500/20"
                    : "border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms or creators..."
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Stream results */}
      {filteredStreams.length > 0 ? (
        <StreamGrid streams={filteredStreams} />
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
          <Radio className="mx-auto size-12 text-zinc-600" />
          <h3 className="mt-4 text-lg font-semibold text-white">No active rooms found</h3>
          <p className="mt-1 text-xs text-zinc-400">
            No live rooms match category &ldquo;{selectedCategory}&rdquo; with your search query.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="mt-5 text-xs font-semibold text-violet-400 hover:text-violet-300"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <PageFrame>
      <main className="mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,48px)] py-10 sm:py-14">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-medium text-violet-300 uppercase tracking-wider">
            <Compass className="size-4" />
            Live Discovery Directory
          </div>
          <h1 className="mt-2 text-[clamp(32px,3vw,48px)] font-bold text-white">
            Discover live streams
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl">
            Browse active broadcast rooms, connect with creators in real-time, and explore gaming, music, talk, and creative showcases.
          </p>
        </div>

        <Suspense fallback={<div className="text-zinc-500 text-sm">Loading streams...</div>}>
          <DiscoverContent />
        </Suspense>
      </main>
    </PageFrame>
  );
}
