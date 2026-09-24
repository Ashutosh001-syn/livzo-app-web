"use client";

import { memo, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Gift, Heart, Radio, Sparkles, UsersRound, Video } from "lucide-react";

const slides = [
  {
    eyebrow: "01 / Go live",
    title: "Go Live Instantly",
    description: "One tap takes you from a quiet moment to a room full of energy. No setup, no waiting, just your story in motion.",
    icon: Radio,
    accent: "from-violet-500 to-fuchsia-500",
    screen: "from-violet-950 via-fuchsia-950 to-[#161126]",
    stat: "12.8k watching",
    label: "Midnight Studio",
  },
  {
    eyebrow: "02 / Connect",
    title: "Meet New Viewers",
    description: "Find the people who are curious about what you love. Every live room is a chance to make a connection that lasts.",
    icon: UsersRound,
    accent: "from-blue-500 to-cyan-400",
    screen: "from-blue-950 via-cyan-950 to-[#101a2d]",
    stat: "24 new connections",
    label: "People are joining",
  },
  {
    eyebrow: "03 / Reward",
    title: "Earn Through Gifts",
    description: "Let your community show up for you. Virtual gifts turn support into momentum, so your creativity can keep going.",
    icon: Gift,
    accent: "from-fuchsia-500 to-rose-400",
    screen: "from-fuchsia-950 via-rose-950 to-[#20111d]",
    stat: "+ $248.00 today",
    label: "Gift balance",
  },
  {
    eyebrow: "04 / Grow",
    title: "Grow Your Audience",
    description: "Your best moments keep moving. Build a following around your voice, your rhythm, and the community you create.",
    icon: Sparkles,
    accent: "from-cyan-400 to-blue-500",
    screen: "from-cyan-950 via-blue-950 to-[#101b2b]",
    stat: "+32% this week",
    label: "Audience growth",
  },
] as const;

const AppScreenshot = memo(function AppScreenshot({ activeIndex }: { activeIndex: number }) {
  const slide = slides[activeIndex];
  const Icon = slide.icon;

  return (
    <div aria-hidden="true" className={`relative aspect-[9/17.5] overflow-hidden rounded-[2.2rem] bg-gradient-to-b ${slide.screen} transition-colors duration-700`}>
      <div className="absolute left-1/2 top-3 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.14),transparent_35%)]" />
      <div className="relative flex h-full flex-col justify-between p-5 pt-11 text-white">
        <div className="flex items-center justify-between text-[9px] text-white/60"><span>9:41</span><span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-emerald-300" /> LIVE</span></div>
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className={`relative flex size-28 items-center justify-center rounded-full bg-gradient-to-br ${slide.accent} shadow-[0_0_55px_rgba(139,92,246,0.45)]`}><div className="absolute inset-2 rounded-full border border-white/30" /><Icon className="relative size-9 text-white" /></div>
          <p className="mt-5 text-center text-sm font-medium">{slide.label}</p>
          <p className="mt-1 text-[10px] text-white/55">{slide.stat}</p>
        </div>
        <div className="space-y-3"><div className="flex items-center justify-between text-[10px] text-white/60"><span className="flex items-center gap-1"><Heart className="size-3 fill-rose-300 text-rose-300" /> 4.2k</span><span className="flex items-center gap-1"><Video className="size-3" /> HD</span></div><div className="h-1 overflow-hidden rounded-full bg-white/15"><div className={`h-full w-2/3 rounded-full bg-gradient-to-r ${slide.accent}`} /></div><div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 p-2 backdrop-blur-md"><span className="size-6 rounded-full bg-gradient-to-br from-amber-300 to-rose-500" /><span className="text-[9px] text-white/60">Your moment is live</span><ArrowUpRight className="ml-auto size-3 text-white/60" /></div></div>
      </div>
    </div>
  );
});

export function StorytellingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;
        ScrollTrigger.create({
          trigger: slide,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveIndex(index);
            }
          },
          fastScrollEnd: true,
        });
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative border-y border-white/[0.07] bg-[#0d0d12]" aria-labelledby="story-title">
      <div className="mx-auto grid w-full max-w-[1280px] gap-8 px-[clamp(16px,4vw,48px)] py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-24">
        <div className="relative hidden h-fit lg:sticky lg:top-28 lg:block">
          <div className="absolute left-1/2 top-1/2 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/15 blur-[110px]" />
          <div className="relative mx-auto w-[min(25vw,300px)] min-w-[250px] rounded-[3rem] border-[7px] border-zinc-700/90 bg-zinc-950 p-2 shadow-[0_30px_80px_rgba(0,0,0,0.7)]"><AppScreenshot activeIndex={activeIndex} /></div>
          <div className="mt-7 flex items-center justify-center gap-2" role="status" aria-live="polite" aria-label={`Story step ${activeIndex + 1} of ${slides.length}`}><span className="text-xs text-zinc-500">Scroll through the experience</span><span className="flex gap-1" aria-hidden="true">{slides.map((slide, index) => <span key={slide.title} className={`h-1 rounded-full transition-all duration-500 ${index === activeIndex ? "w-6 bg-violet-300" : "w-1.5 bg-white/20"}`} />)}</span></div>
        </div>

        <div>
          <div className="mb-12 max-w-xl sm:mb-16"><p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">Your world, in motion</p><h2 id="story-title" className="mt-4 text-[clamp(32px,3vw,48px)] font-semibold tracking-tight text-white">Make every moment <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">count.</span></h2><p className="mt-4 text-[clamp(14px,1vw,18px)] leading-7 text-zinc-400">LivZo gives your voice a place to travel, connect, and grow.</p></div>
          <div className="space-y-8 sm:space-y-12">
            {slides.map(({ eyebrow, title, description, icon: Icon, accent }, index) => <div key={title} ref={(element) => { slideRefs.current[index] = element; }} className="story-slide relative scroll-mt-32 py-8 sm:py-12"><div className={`mb-6 flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}><Icon className="size-5" /></div><p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">{eyebrow}</p><h3 className="mt-3 max-w-lg text-[clamp(28px,3vw,48px)] font-semibold tracking-tight text-white">{title}</h3><p className="mt-4 max-w-md text-[clamp(14px,1vw,18px)] leading-7 text-zinc-400">{description}</p><div className="mt-6 flex items-center gap-2 text-sm text-zinc-500"><span className={`size-2 rounded-full bg-gradient-to-r ${accent}`} />LivZo makes it feel effortless</div><div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-2 shadow-inner lg:hidden"><div className="mx-auto max-w-[220px] rounded-[1.7rem] border-[5px] border-zinc-700 bg-zinc-950 p-1"><AppScreenshot activeIndex={index} /></div></div></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
