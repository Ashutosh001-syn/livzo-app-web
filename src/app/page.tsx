import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Apple,
  Download,
  Gift,
  Heart,
  QrCode,
  Radio,
  Sparkles,
  Smartphone,
  Zap,
} from "lucide-react";

import { featuredStreams } from "@/lib/data/streams";
import { PageFrame } from "@/components/layout/page-frame";
import { StreamGrid } from "@/components/stream/stream-grid";
import { HeroSection } from "@/components/sections/hero-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FeaturesSection = dynamic(() => import("@/components/sections/features-section").then((mod) => mod.FeaturesSection), {
  loading: () => <div className="h-96 w-full animate-pulse bg-white/[0.02]" />,
});

const StorytellingSection = dynamic(() => import("@/components/sections/storytelling-section").then((mod) => mod.StorytellingSection), {
  loading: () => <div className="h-[600px] w-full animate-pulse bg-white/[0.02]" />,
});

export default function Home() {
  return (
    <PageFrame>
      <main>
        <HeroSection />
        <FeaturesSection />
        <StorytellingSection />

        {/* Live Rooms Showcase */}
        <section className="mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,48px)] py-12 sm:py-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-violet-300">Happening now</p>
              <h2 className="mt-2 text-[clamp(24px,2.5vw,36px)] font-semibold text-white">
                Find your next room
              </h2>
            </div>
            <Link
              href="/discover"
              prefetch={true}
              className="shrink-0 text-sm text-zinc-400 hover:text-white focus-visible:outline-2 focus-visible:outline-violet-400"
            >
              View all
            </Link>
          </div>
          <StreamGrid streams={featuredStreams} />
        </section>

        {/* Virtual Gifting Section with id="gifts" */}
        <section id="gifts" className="scroll-mt-24 border-t border-white/[0.08] bg-[#0c0c11] py-16 sm:py-24">
          <div className="mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,48px)]">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-fuchsia-300">
                <Gift className="size-3.5" />
                Virtual Economy
              </span>
              <h2 className="mt-4 text-[clamp(32px,3vw,44px)] font-bold text-white">
                Turn support into momentum with{" "}
                <span className="bg-gradient-to-r from-fuchsia-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">
                  Virtual Gifts
                </span>
              </h2>
              <p className="mt-3 text-zinc-400 text-[clamp(14px,1vw,17px)]">
                Send animated reactions, trigger fireworks on stream, and directly reward your favorite creators in real time.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Super Heart", cost: "50 Coins", icon: Heart, color: "text-rose-400", bg: "from-rose-500/20 to-pink-500/5", desc: "Spawns floating 3D hearts across the creator's screen." },
                { name: "Neon Rocket", cost: "250 Coins", icon: Zap, color: "text-amber-300", bg: "from-amber-500/20 to-orange-500/5", desc: "Launches a sound effect and highlights you in chat." },
                { name: "Galaxy Crown", cost: "1,000 Coins", icon: Sparkles, color: "text-fuchsia-300", bg: "from-fuchsia-500/20 to-violet-500/5", desc: "Pinned banner with your avatar at the top of the room." },
                { name: "Studio Spotlight", cost: "2,500 Coins", icon: Radio, color: "text-cyan-300", bg: "from-cyan-500/20 to-blue-500/5", desc: "Full-stage visual takeover celebrating the broadcast." },
              ].map((item) => (
                <Card key={item.name} className="group relative overflow-hidden p-6 transition-all hover:border-white/20">
                  <div className={`absolute -right-8 -top-8 size-28 rounded-full bg-gradient-to-br ${item.bg} blur-xl`} />
                  <div className={`flex size-12 items-center justify-center rounded-2xl bg-white/[0.06] ${item.color}`}>
                    <item.icon className="size-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{item.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-violet-300">{item.cost}</p>
                  <p className="mt-3 text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Download App Section with id="download" */}
        <section id="download" className="scroll-mt-24 border-t border-white/[0.08] bg-[#09090e] py-16 sm:py-24">
          <div className="mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,48px)]">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/40 via-zinc-950 to-blue-950/30 p-8 sm:p-12 lg:p-16 shadow-2xl">
              <div className="absolute right-0 top-0 -z-0 size-[450px] rounded-full bg-gradient-to-br from-violet-600/20 to-cyan-500/10 blur-[120px]" />
              
              <div className="relative z-10 grid items-center gap-8 lg:grid-cols-2">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                    <Smartphone className="size-3.5" />
                    Mobile First
                  </span>
                  <h2 className="mt-4 text-[clamp(32px,3vw,48px)] font-bold tracking-tight text-white">
                    LivZo in your pocket.
                    <br />
                    <span className="bg-gradient-to-r from-violet-300 via-blue-300 to-cyan-200 bg-clip-text text-transparent">
                      Stream anywhere, anytime.
                    </span>
                  </h2>
                  <p className="mt-4 text-zinc-300 text-[clamp(14px,1vw,17px)] leading-relaxed">
                    Broadcast directly from your phone in 1080p60, join audio parties with friends, and get instant push alerts when your favorite creators go live.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <Button className="h-12 rounded-xl bg-white px-5 text-zinc-950 hover:bg-zinc-200">
                      <Apple className="mr-2 size-5" />
                      App Store
                    </Button>
                    <Button variant="secondary" className="h-12 rounded-xl border-white/20 bg-white/5 px-5 text-white hover:bg-white/10">
                      <Download className="mr-2 size-5" />
                      Google Play
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/40 p-8 text-center backdrop-blur-xl">
                  <div className="flex size-24 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-inner">
                    <QrCode className="size-16 text-cyan-300" />
                  </div>
                  <p className="mt-4 font-semibold text-white">Scan to install instant app</p>
                  <p className="mt-1 text-xs text-zinc-400">Compatible with iOS 16+ and Android 11+</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageFrame>
  );
}
