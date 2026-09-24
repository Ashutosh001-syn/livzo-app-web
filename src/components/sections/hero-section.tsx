"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Download,
  Gift,
  Heart,
  MessageCircle,
  Play,
  Radio,
  Sparkles,
  Users,
} from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const floatingItems = [
  {
    icon: Gift,
    className: "left-[3%] top-[22%] text-fuchsia-300",
    delay: 0.1,
    size: "size-11",
  },
  {
    icon: Heart,
    className: "right-[5%] top-[17%] text-rose-300",
    delay: 0.35,
    size: "size-9",
  },
  {
    icon: Sparkles,
    className: "right-[1%] top-[52%] text-cyan-300",
    delay: 0.55,
    size: "size-10",
  },
  {
    icon: Heart,
    className: "left-[7%] bottom-[17%] text-pink-300",
    delay: 0.75,
    size: "size-8",
  },
] as const;

const avatars = [
  {
    initials: "LM",
    position: "left-[4%] top-[43%]",
    gradient: "from-pink-400 to-violet-500",
    delay: 0.2,
  },
  {
    initials: "AK",
    position: "right-[2%] top-[32%]",
    gradient: "from-cyan-400 to-blue-500",
    delay: 0.45,
  },
] as const;

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36, rotate: 4 }}
      animate={{ opacity: 1, y: 0, rotate: 3 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 w-[clamp(155px,15.5vw,205px)] drop-shadow-[0_24px_52px_rgba(95,64,220,0.42)]"
    >
      <div className="rounded-[2.35rem] border-[6px] border-zinc-700/90 bg-zinc-950 p-1.5 shadow-2xl shadow-black/80">
        <div className="relative aspect-[9/18.5] overflow-hidden rounded-[1.85rem] bg-gradient-to-b from-violet-950 via-[#171329] to-blue-950">
          <div className="absolute left-1/2 top-2.5 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(167,139,250,0.45),transparent_34%),radial-gradient(circle_at_18%_80%,rgba(34,211,238,0.24),transparent_30%)]" />
          <div className="relative flex h-full flex-col justify-between p-4 pt-10 text-white">
            <div className="flex items-center justify-between text-[9px] text-white/70">
              <span>9:41</span>
              <span className="flex items-center gap-1">
                <Radio className="size-2.5 text-rose-300" /> LIVE
              </span>
            </div>
            <div className="relative mx-auto flex w-full flex-1 items-center justify-center">
              <div className="absolute size-28 rounded-full bg-violet-400/20 blur-2xl" />
              <div className="relative flex size-20 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-fuchsia-300 via-violet-500 to-blue-600 shadow-[0_0_35px_rgba(139,92,246,0.7)]">
                <Users className="size-7" />
              </div>
              <span className="absolute right-0 top-1/4 rounded-full bg-white/10 px-1.5 py-1 text-[8px] text-white/80 backdrop-blur-md">
                12.8k watching
              </span>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-rose-500 text-[7px] font-bold">
                  LV
                </span>
                <div>
                  <p className="text-[9px] font-medium">Luna Vale</p>
                  <p className="text-[7px] text-white/50">Midnight Studio</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-1.5 backdrop-blur-md">
                <span className="text-[8px] text-white/50">
                  Say something...
                </span>
                <span className="flex size-5 items-center justify-center rounded-full bg-violet-500">
                  <ArrowRight className="size-2.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : -28],
  );
  const visualY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : 38],
  );

  return (
    <section
      ref={heroRef}
      className="hero-gradient relative isolate overflow-hidden pt-16 lg:h-[calc(100svh-64px)] lg:min-h-0"
      aria-labelledby="hero-title"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_55%_45%,rgba(124,58,237,0.18),transparent_48%),radial-gradient(ellipse_at_90%_10%,rgba(37,99,235,0.15),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#0d0d12] to-transparent" />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-5 py-[clamp(2rem,5vh,4.5rem)] sm:px-8 lg:h-full lg:min-h-0 lg:grid-cols-2 lg:gap-4 lg:py-[clamp(1.5rem,4vh,3.5rem)]">
        <motion.div
          style={{ y: copyY }}
          initial="hidden"
          animate="visible"
          className="relative z-20 w-full max-w-[620px]"
          variants={{
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.1 },
            },
          }}
        >
          <motion.div
            variants={reveal}
            className="mb-[clamp(1rem,2.5vh,1.75rem)] inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-[clamp(0.625rem,0.8vw,0.75rem)] font-medium uppercase tracking-[0.16em] text-violet-200"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-cyan-300" />
            The next generation of live
          </motion.div>
          <motion.h1
            id="hero-title"
            variants={reveal}
            className="max-w-[25ch] text-[clamp(32px,4.4vw,64px)] font-semibold leading-[0.94] tracking-[-0.055em] text-white md:text-[clamp(42px,5.2vw,64px)] lg:text-[clamp(48px,4.4vw,64px)]"
          >
            <span className="block whitespace-nowrap">Go Live.</span>
            <span className="block whitespace-nowrap">Meet New Friends.</span>
            <span className="block whitespace-nowrap bg-gradient-to-r from-violet-200 via-blue-300 to-cyan-200 bg-clip-text text-transparent">
              Earn Through Streaming.
            </span>
          </motion.h1>
          <motion.p
            variants={reveal}
            className="mt-[clamp(1rem,2.5vh,1.5rem)] max-w-[600px] text-[clamp(16px,1.35vw,22px)] leading-[1.45] text-zinc-300/80"
          >
            Connect with people worldwide through live streaming, video calls
            and virtual gifting.
          </motion.p>
          <motion.div
            variants={reveal}
            className="mt-[clamp(1.25rem,3vh,2rem)] flex flex-wrap gap-3"
          >
            <Link href="/reels">
              <Button className="h-11 rounded-xl bg-white px-4 text-sm text-zinc-950 shadow-[0_12px_35px_rgba(255,255,255,0.15)] hover:bg-zinc-200 sm:h-12 sm:px-5 sm:text-base">
                <Play className="mr-2 size-4" />
                Watch Live
              </Button>
            </Link>
            <Link href="/studio">
              <Button
                variant="secondary"
                className="h-11 rounded-xl border-white/20 bg-white/[0.07] px-4 text-sm backdrop-blur-md hover:bg-white/15 sm:h-12 sm:px-5 sm:text-base"
              >
                <Radio className="mr-2 size-4 text-violet-300" />
                Start Streaming
              </Button>
            </Link>
          </motion.div>
          <motion.div
            variants={reveal}
            className="mt-[clamp(1.25rem,3vh,2rem)] flex items-center gap-3 text-xs text-zinc-500"
          >
            <div className="flex -space-x-2">
              <span className="flex size-7 items-center justify-center rounded-full border-2 border-[#151127] bg-gradient-to-br from-pink-400 to-violet-500 text-[8px] text-white">
                M
              </span>
              <span className="flex size-7 items-center justify-center rounded-full border-2 border-[#151127] bg-gradient-to-br from-cyan-400 to-blue-500 text-[8px] text-white">
                A
              </span>
              <span className="flex size-7 items-center justify-center rounded-full border-2 border-[#151127] bg-gradient-to-br from-amber-300 to-rose-500 text-[8px] text-white">
                R
              </span>
            </div>
            <span>Join 2.4M+ people already live</span>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: visualY }}
          className="relative mx-auto flex h-[clamp(220px,34vh,390px)] w-full max-w-none min-w-0 items-center justify-center lg:max-w-full"
        >
          <div className="absolute h-[72%] w-[72%] rounded-full bg-violet-600/20 blur-[80px]" />
          <div className="absolute h-[45%] w-[45%] rounded-full bg-blue-500/20 blur-[60px]" />
          {floatingItems.map(({ icon: Icon, className, delay, size }) => (
            <motion.div
              key={`${className}-${delay}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: reduceMotion ? 0 : [0, -10, 0],
                rotate: reduceMotion ? 0 : [0, 6, -4, 0],
              }}
              transition={{
                opacity: { duration: 0.45, delay },
                scale: { duration: 0.45, delay },
                y: {
                  duration: 5 + delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay,
                },
                rotate: {
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay,
                },
              }}
              className={`absolute z-20 hidden items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-xl backdrop-blur-xl sm:flex ${size} ${className}`}
            >
              <Icon className="size-1/2" />
            </motion.div>
          ))}
          {avatars.map(({ initials, position, gradient, delay }) => (
            <motion.div
              key={initials}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: reduceMotion ? 0 : [0, -8, 0],
              }}
              transition={{
                opacity: { duration: 0.45, delay },
                scale: { duration: 0.45, delay },
                y: {
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay,
                },
              }}
              className={`absolute z-20 hidden size-10 items-center justify-center rounded-full border-2 border-white/30 bg-gradient-to-br text-[10px] font-semibold text-white shadow-lg sm:flex ${gradient} ${position}`}
              aria-hidden="true"
            >
              {initials}
            </motion.div>
          ))}
          <PhoneMockup />
          <motion.div
            animate={{ y: reduceMotion ? 0 : [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[5%] left-[3%] z-20 hidden items-center gap-2 rounded-full border border-white/10 bg-zinc-950/70 px-2.5 py-1.5 text-[10px] text-white/80 shadow-xl backdrop-blur-xl sm:flex"
          >
            <MessageCircle className="size-3 text-cyan-300" />
            New connection
          </motion.div>
          <motion.div
            animate={{ y: reduceMotion ? 0 : [0, 5, 0] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute right-[2%] top-[7%] z-20 hidden items-center gap-2 rounded-full border border-white/10 bg-zinc-950/70 px-2.5 py-1.5 text-[10px] text-white/80 shadow-xl backdrop-blur-xl sm:flex"
          >
            <Play className="size-3 fill-violet-300 text-violet-300" />
            Live now
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:flex">
        <span className="h-px w-8 bg-white/20" />
        Scroll to explore
        <span className="h-px w-8 bg-white/20" />
      </div>
    </section>
  );
}
