"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Clock,
  Coins,
  Radio,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Live Viewers Peak", value: "1,420", change: "+14.2%", icon: Users, tone: "text-violet-400" },
  { label: "Total Watch Time", value: "48.5h", change: "+8.6%", icon: Clock, tone: "text-blue-400" },
  { label: "Gift Earnings", value: "$342.50", change: "+24.0%", icon: Coins, tone: "text-amber-300" },
  { label: "New Followers", value: "+280", change: "+19.1%", icon: TrendingUp, tone: "text-emerald-400" },
];

const pastBroadcasts = [
  { id: "b-1", title: "Late Night Lo-Fi Beats & Chat", date: "Yesterday, 9:30 PM", duration: "2h 15m", viewers: 1240, gifts: "$84.00" },
  { id: "b-2", title: "Building an Indie App Live", date: "Sep 15, 2026", duration: "3h 40m", viewers: 2180, gifts: "$145.50" },
  { id: "b-3", title: "Sunday Chill Q&A Session", date: "Sep 12, 2026", duration: "1h 50m", viewers: 940, gifts: "$52.00" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Studio Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/50 via-zinc-950 to-blue-950/40 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Badge className="border-rose-400/30 bg-rose-500/15 text-rose-300">
              <Radio className="mr-1.5 size-3 text-rose-400" />
              Ready to broadcast
            </Badge>
            <h2 className="mt-3 text-2xl font-bold text-white">Your room is waiting.</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Connect your camera or stream with OBS / WHIP directly into your channel.
            </p>
          </div>
          <Link href="/studio">
            <Button className="h-11 rounded-xl bg-white px-5 font-semibold text-zinc-950 hover:bg-zinc-200">
              <Video className="mr-2 size-4 text-violet-600" />
              Open Studio Cockpit
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, change, icon: Icon, tone }) => (
          <Card key={label} className="p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">{label}</span>
              <div className={`flex size-8 items-center justify-center rounded-lg bg-white/5 ${tone}`}>
                <Icon className="size-4" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-white">{value}</p>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
              <TrendingUp className="size-3" />
              <span>{change} this week</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Past Broadcast History */}
      <Card className="p-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="font-semibold text-white">Recent Broadcast Sessions</h3>
            <p className="text-xs text-zinc-400">Analytics and replays from your past streams.</p>
          </div>
          <Button variant="ghost" className="text-xs text-zinc-400 hover:text-white">
            View all logs
          </Button>
        </div>

        <div className="mt-4 divide-y divide-white/5">
          {pastBroadcasts.map((b) => (
            <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">
              <div>
                <p className="font-medium text-white">{b.title}</p>
                <p className="mt-1 text-xs text-zinc-500">{b.date} · Duration: {b.duration}</p>
              </div>

              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-zinc-500">Peak Viewers</span>
                  <p className="font-semibold text-zinc-200">{b.viewers.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Gifts Earned</span>
                  <p className="font-semibold text-amber-300">{b.gifts}</p>
                </div>
                <Link href={`/live/midnight-studio`} className="text-violet-300 hover:text-violet-200">
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
