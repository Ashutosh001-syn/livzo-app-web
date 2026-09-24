"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Flame,
  Sparkles,
  Trophy,
  CheckCircle2,
  Lock,
  Zap,
  Star,
  Coins,
  Shield,
} from "lucide-react";
import { PageFrame } from "@/components/layout/page-frame";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DailyDay {
  day: number;
  reward: number;
  isClaimed: boolean;
  isCurrent: boolean;
}

export default function RewardsPage() {
  const [coinBalance, setCoinBalance] = useState(1450);
  const [userXp, setUserXp] = useState(7800);
  const maxXp = 10000;
  const userLevel = 12;

  const [days, setDays] = useState<DailyDay[]>([
    { day: 1, reward: 50, isClaimed: true, isCurrent: false },
    { day: 2, reward: 100, isClaimed: true, isCurrent: false },
    { day: 3, reward: 150, isClaimed: false, isCurrent: true },
    { day: 4, reward: 200, isClaimed: false, isCurrent: false },
    { day: 5, reward: 300, isClaimed: false, isCurrent: false },
    { day: 6, reward: 500, isClaimed: false, isCurrent: false },
    { day: 7, reward: 1000, isClaimed: false, isCurrent: false },
  ]);

  const [quests, setQuests] = useState([
    { id: "q1", title: "Watch 15 mins of Live Stream", xp: 200, coins: 50, isDone: true, progress: "15/15m" },
    { id: "q2", title: "Join an Audio Lounge stage", xp: 350, coins: 100, isDone: false, progress: "0/1" },
    { id: "q3", title: "Send a Virtual Gift to any host", xp: 500, coins: 150, isDone: false, progress: "0/1" },
  ]);

  const claimDaily = (dayNum: number) => {
    setDays((prev) =>
      prev.map((d) => {
        if (d.day === dayNum && d.isCurrent && !d.isClaimed) {
          setCoinBalance((bal) => bal + d.reward);
          return { ...d, isClaimed: true, isCurrent: false };
        }
        return d;
      })
    );
  };

  const claimQuest = (id: string, coins: number, xp: number) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isDone: true } : q))
    );
    setCoinBalance((bal) => bal + coins);
    setUserXp((prevXp) => Math.min(maxXp, prevXp + xp));
  };

  return (
    <PageFrame>
      <main className="mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,48px)] py-10">
        {/* Top Header & Coin Counter */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300">
              <Gift className="size-3.5" /> Rewards & Creator Progression
            </div>
            <h1 className="mt-3 text-[clamp(28px,3vw,44px)] font-bold text-white">
              Claim Daily Bonuses & <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">Level Up</span>
            </h1>
          </div>

          {/* Wallet Coin Balance Display */}
          <div className="flex items-center gap-4 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-950/40 via-zinc-950 to-zinc-950 p-4 shadow-xl">
            <div className="flex size-12 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300">
              <Coins className="size-7" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Your Coin Balance</p>
              <p className="text-2xl font-bold text-amber-300">{coinBalance.toLocaleString()} Coins</p>
            </div>
          </div>
        </div>

        {/* Level XP Progress Wheel Banner */}
        <Card className="mt-8 relative overflow-hidden border-white/15 bg-gradient-to-r from-violet-950/60 via-purple-950/40 to-zinc-950 p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white font-bold text-2xl shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                Lvl {userLevel}
                <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-amber-400 text-zinc-950">
                  <Star className="size-3.5 fill-zinc-950" />
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">Apex Creator Rank</span>
                <h2 className="text-xl font-bold text-white">Level 12 - Digital Star</h2>
                <p className="text-xs text-zinc-400 mt-1">Next unlock: Special Galaxy Crown & Exclusive Host Badge at Level 13!</p>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="w-full md:w-80 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-300">XP Progress</span>
                <span className="text-cyan-300">{userXp} / {maxXp} XP</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/10 p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(userXp / maxXp) * 100}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 7-Day Login Streak Grid */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4 text-white font-bold text-lg">
            <Flame className="size-5 text-rose-400" /> 7-Day Daily Login Streak
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {days.map((d) => (
              <Card
                key={d.day}
                className={`relative flex flex-col items-center justify-between p-4 text-center border transition-all ${
                  d.isClaimed
                    ? "border-emerald-500/30 bg-emerald-500/5 opacity-70"
                    : d.isCurrent
                    ? "border-amber-400 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.3)] animate-pulse"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <span className="text-xs font-semibold text-zinc-400">Day {d.day}</span>

                <div className="my-3 flex size-12 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
                  <Coins className="size-6" />
                </div>

                <span className="font-bold text-amber-300 text-sm">+{d.reward}</span>

                <div className="mt-3 w-full">
                  {d.isClaimed ? (
                    <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400">
                      <CheckCircle2 className="mr-1 size-3" /> Claimed
                    </span>
                  ) : d.isCurrent ? (
                    <Button
                      onClick={() => claimDaily(d.day)}
                      size="sm"
                      className="w-full h-8 rounded-lg bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300"
                    >
                      Claim
                    </Button>
                  ) : (
                    <span className="inline-flex items-center text-[10px] text-zinc-500">
                      <Lock className="mr-1 size-3" /> Locked
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Daily Quests Section */}
        <div className="mt-12">
          <h2 className="text-lg font-bold text-white mb-4">Daily Quests & Challenges</h2>

          <div className="space-y-4">
            {quests.map((q) => (
              <Card key={q.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-white/10 bg-zinc-950/80 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400">
                    <Zap className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{q.title}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Reward: +{q.coins} Coins & +{q.xp} XP</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-cyan-300">{q.progress}</span>
                  <Button
                    disabled={q.isDone}
                    onClick={() => claimQuest(q.id, q.coins, q.xp)}
                    className={`h-9 rounded-xl px-4 text-xs font-semibold ${
                      q.isDone
                        ? "bg-white/10 text-zinc-400 border border-white/10"
                        : "bg-cyan-400 text-zinc-950 hover:bg-cyan-300"
                    }`}
                  >
                    {q.isDone ? "Completed" : "Claim Rewards"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </PageFrame>
  );
}
