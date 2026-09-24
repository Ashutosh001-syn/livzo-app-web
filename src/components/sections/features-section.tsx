"use client";

import { motion, type Variants } from "framer-motion";
import {
  ArrowUpRight,
  Gift,
  Headphones,
  Radio,
  Sparkles,
  UsersRound,
} from "lucide-react";

const features = [
  {
    title: "Live Streaming",
    description:
      "Turn your everyday moments into a room full of people who get you.",
    icon: Radio,
    tone: "from-violet-500/25 to-blue-500/5",
    iconTone: "text-violet-200",
    size: "lg:col-span-2",
  },
  {
    title: "Video Calls",
    description:
      "Make every conversation feel closer with crystal-clear, face-to-face connection.",
    icon: Headphones,
    tone: "from-blue-500/25 to-cyan-500/5",
    iconTone: "text-cyan-200",
    size: "",
  },
  {
    title: "Virtual Gifts",
    description:
      "Send a little magic across the room and support the creators you love.",
    icon: Gift,
    tone: "from-fuchsia-500/20 to-violet-500/5",
    iconTone: "text-fuchsia-200",
    size: "",
  },
  {
    title: "Party Rooms",
    description:
      "Bring your people together for spontaneous nights that become memories.",
    icon: UsersRound,
    tone: "from-cyan-500/20 to-blue-500/5",
    iconTone: "text-blue-200",
    size: "",
  },
  {
    title: "Moments Feed",
    description:
      "Catch the best of LivZo in one endlessly inspiring, personal feed.",
    icon: Sparkles,
    tone: "from-amber-400/20 to-pink-500/5",
    iconTone: "text-amber-200",
    size: "lg:col-span-2",
  },
] as const;

const reveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden border-y border-white/[0.07] bg-[#0d0d12] py-16 sm:py-24"
      aria-labelledby="features-title"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/4 -z-0 size-[420px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[130px]" />
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,48px)]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={reveal}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300">
            More than a stream
          </p>
          <h2
            id="features-title"
            className="mt-4 text-[clamp(32px,3vw,48px)] font-semibold tracking-tight text-white"
          >
            A place for every kind of{" "}
            <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
              connection.
            </span>
          </h2>
          <p className="mt-4 text-[clamp(14px,1vw,18px)] leading-7 text-zinc-400">
            Everything you need to be seen, heard, and part of something real.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          transition={{ staggerChildren: 0.1 }}
          className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-14 lg:grid-cols-4"
        >
          {features.map(
            ({ title, description, icon: Icon, tone, iconTone, size }) => (
              <motion.article
                key={title}
                variants={reveal}
                whileHover={{ y: -5, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className={`group relative min-h-[220px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:p-6 ${size}`}
              >
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-gradient-to-br ${tone} opacity-80 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="relative flex h-full flex-col justify-between">
                  <div
                    className={`flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] ${iconTone}`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="mt-10">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-medium text-white">
                        {title}
                      </h3>
                      <ArrowUpRight className="size-5 text-zinc-600 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
                    </div>
                    <p className="mt-2 max-w-md text-[clamp(14px,1vw,16px)] leading-6 text-zinc-400">
                      {description}
                    </p>
                  </div>
                </div>
              </motion.article>
            ),
          )}
        </motion.div>
      </div>
    </section>
  );
}
