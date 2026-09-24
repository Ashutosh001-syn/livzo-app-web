"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Sparkles,
  ShieldCheck,
  Zap,
  Check,
  Star,
  Award,
  Heart,
  Flame,
  Radio,
} from "lucide-react";
import { PageFrame } from "@/components/layout/page-frame";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VipTier {
  id: string;
  name: string;
  price: string;
  period: string;
  badgeColor: string;
  glowColor: string;
  popular?: boolean;
  perks: string[];
}

const vipTiers: VipTier[] = [
  {
    id: "bronze",
    name: "Bronze Fan Pass",
    price: "$4.99",
    period: "/month",
    badgeColor: "from-amber-700 to-amber-900",
    glowColor: "border-amber-700/30",
    perks: [
      "Custom Bronze Chat Badge",
      "Unlock 10+ Subscriber Emotes",
      "Ad-Free Stream Viewing",
      "5% Bonus Coin Rewards",
    ],
  },
  {
    id: "diamond",
    name: "Diamond VIP Supporter",
    price: "$14.99",
    period: "/month",
    badgeColor: "from-cyan-400 via-blue-500 to-indigo-600",
    glowColor: "border-cyan-400/50 shadow-[0_0_35px_rgba(34,211,238,0.25)]",
    popular: true,
    perks: [
      "Glowing Animated Diamond Badge",
      "Unlock ALL 50+ Custom Emotes",
      "Priority Seating in Audio Rooms",
      "Exclusive VIP Fan Lounge Access",
      "15% Bonus Coins on All Purchases",
      "Direct PM Access to Hosts",
    ],
  },
  {
    id: "apex",
    name: "Apex Host Club Pass",
    price: "$29.99",
    period: "/month",
    badgeColor: "from-fuchsia-500 via-purple-600 to-rose-500",
    glowColor: "border-fuchsia-500/50 shadow-[0_0_35px_rgba(217,70,239,0.25)]",
    perks: [
      "Ultra Golden Crown Badge",
      "Broadcast Takeover Fireworks",
      "Full Creator Studio Pro Tools",
      "Pinned Chat Message Highlights",
      "25% Bonus Coins on All Purchases",
      "Monthly 1,000 Coin Drop",
    ],
  },
];

export default function VipPage() {
  const [selectedTier, setSelectedTier] = useState<string>("diamond");

  return (
    <PageFrame>
      <main className="mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,48px)] py-10">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-fuchsia-300">
            <Crown className="size-3.5" /> VIP Memberships & Fan Clubs
          </div>
          <h1 className="mt-4 text-[clamp(32px,3.5vw,52px)] font-extrabold text-white">
            Elevate your presence with <span className="bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-amber-300 bg-clip-text text-transparent">VIP Privilege</span>
          </h1>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base">
            Stand out in chat with glowing badges, unlock exclusive creator emotes, priority stage seats, and monthly coin drops.
          </p>
        </div>

        {/* VIP Tiers Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {vipTiers.map((tier) => (
            <Card
              key={tier.id}
              className={`relative flex flex-col justify-between overflow-hidden border bg-zinc-950 p-8 shadow-2xl transition-all duration-300 ${tier.glowColor} ${
                selectedTier === tier.id ? "scale-[1.02] border-cyan-400" : "border-white/10"
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 rounded-bl-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-zinc-950">
                  Most Popular
                </div>
              )}

              <div>
                <div className={`inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tier.badgeColor} text-white shadow-lg`}>
                  <Crown className="size-7" />
                </div>

                <h3 className="mt-5 text-2xl font-bold text-white">{tier.name}</h3>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                  <span className="text-xs text-zinc-400">{tier.period}</span>
                </div>

                {/* Perk List */}
                <ul className="mt-8 space-y-3 border-t border-white/10 pt-6 text-xs text-zinc-300">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2.5">
                      <ShieldCheck className="size-4 shrink-0 text-cyan-400" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Button
                  onClick={() => {
                    setSelectedTier(tier.id);
                    alert(`Subscribed to ${tier.name}! 🎉`);
                  }}
                  className={`w-full h-12 rounded-xl text-sm font-bold shadow-lg transition ${
                    tier.popular
                      ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-zinc-950 hover:from-cyan-300 hover:to-blue-400"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/15"
                  }`}
                >
                  Join {tier.name}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Custom VIP Badge Preview Box */}
        <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-r from-purple-950/30 via-zinc-950 to-blue-950/30 p-8 shadow-2xl">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Badge Showcase</span>
              <h2 className="mt-2 text-2xl font-bold text-white">Preview your VIP Badge in Chat</h2>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                When you enter any live stream or audio room, your comment will feature a custom glowing badge next to your handle!
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/60 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-gradient-to-r from-amber-600 to-amber-800 px-2 py-0.5 text-[10px] font-bold text-white">
                  BRONZE FAN
                </span>
                <span className="font-semibold text-white">User102:</span>
                <span className="text-zinc-300">Great stream today! 👏</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-2 py-0.5 text-[10px] font-bold text-zinc-950 shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                  💎 DIAMOND VIP
                </span>
                <span className="font-semibold text-cyan-300">CyberQueen:</span>
                <span className="text-zinc-100">Sending galaxy crown gift right now!! 🚀</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageFrame>
  );
}
