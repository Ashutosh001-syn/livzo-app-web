"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Play, Radio, Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

const followedCreators = [
  { id: "c-1", handle: "luna", name: "Luna Vale", category: "Music", isLive: true, viewers: "12.8k", slug: "midnight-studio" },
  { id: "c-2", handle: "marc", name: "Marc Chen", category: "Creative", isLive: true, viewers: "6.4k", slug: "build-in-public" },
  { id: "c-3", handle: "nova", name: "Nova North", category: "Gaming", isLive: true, viewers: "3.1k", slug: "late-night-ranked" },
  { id: "c-4", handle: "elena", name: "Elena Rostova", category: "Talk", isLive: false, viewers: null, slug: "elena-talk" },
];

const savedRecordings = [
  { id: "v-1", title: "Midnight Acoustic Session #42", creator: "Luna Vale", date: "Sep 16, 2026", duration: "1h 45m", slug: "midnight-studio" },
  { id: "v-2", title: "Designing Mobile Interfaces in Figma", creator: "Marc Chen", date: "Sep 14, 2026", duration: "2h 10m", slug: "build-in-public" },
];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<"followed" | "saved">("followed");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Your Streaming Library</h2>
          <p className="text-xs text-zinc-400">Manage creators you follow and watch past broadcast archives.</p>
        </div>

        <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("followed")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "followed" ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Users className="size-3.5" />
            Followed ({followedCreators.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "saved" ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Bookmark className="size-3.5" />
            Saved Recordings ({savedRecordings.length})
          </button>
        </div>
      </div>

      {activeTab === "followed" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {followedCreators.map((creator) => (
            <Card key={creator.id} className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={creator.name} className="size-11" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white text-sm">{creator.name}</p>
                    {creator.isLive && (
                      <Badge className="border-rose-500/30 bg-rose-500/10 text-rose-300 text-[10px] py-0">
                        <Radio className="mr-1 size-2.5" />
                        LIVE
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400">@{creator.handle} · {creator.category}</p>
                  {creator.isLive && (
                    <p className="mt-1 text-[11px] text-violet-300 font-medium">{creator.viewers} watching</p>
                  )}
                </div>
              </div>

              {creator.isLive ? (
                <Link href={`/live/${creator.slug}`}>
                  <Button className="h-8 rounded-lg bg-violet-600 px-3 text-xs text-white hover:bg-violet-500">
                    Watch
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" className="h-8 rounded-lg border-white/10 px-3 text-xs text-zinc-400" disabled>
                  Offline
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      {activeTab === "saved" && (
        <div className="space-y-3">
          {savedRecordings.map((vod) => (
            <Card key={vod.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-violet-300">
                  <Play className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{vod.title}</p>
                  <p className="text-xs text-zinc-400">{vod.creator} · {vod.date} · {vod.duration}</p>
                </div>
              </div>

              <Link href={`/live/${vod.slug}`}>
                <Button variant="secondary" className="h-9 border-white/15 text-xs text-zinc-200 hover:text-white">
                  Play VOD
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}