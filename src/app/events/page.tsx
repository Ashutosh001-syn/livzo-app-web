"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Ticket,
  Users,
  Sparkles,
  CheckCircle2,
  Share2,
  X,
  QrCode,
  Flame,
  Radio,
  Bell,
} from "lucide-react";
import { PageFrame } from "@/components/layout/page-frame";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EventItem {
  id: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  category: string;
  startDate: string;
  countdown: string;
  attendeesCount: number;
  bannerBg: string;
  ticketPrice: string;
  description: string;
}

const eventsData: EventItem[] = [
  {
    id: "evt-1",
    title: "LivZo CyberFest 2026: Synthwave & VR Live Stage 🎆",
    hostName: "DJ Neon & Friends",
    hostAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    category: "Mega Music Event",
    startDate: "Tomorrow at 8:00 PM EST",
    countdown: "18h 42m 10s",
    attendeesCount: 14200,
    bannerBg: "from-violet-900 via-purple-900 to-indigo-950",
    ticketPrice: "FREE VIP PASS",
    description: "Join 10+ top global electronic producers live on 3D spatial stages. Full interactive virtual gifting enabled!",
  },
  {
    id: "evt-2",
    title: "Apex Legends Pro Creator Showdown 🏆",
    hostName: "Aria Esports",
    hostAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    category: "eSports Tournament",
    startDate: "Saturday at 5:00 PM EST",
    countdown: "2d 11h 05m",
    attendeesCount: 8900,
    bannerBg: "from-cyan-950 via-blue-900 to-zinc-950",
    ticketPrice: "FREE PASS",
    description: "16 creator trios compete for $25,000 in creator pool rewards. Exclusive audience drop codes!",
  },
  {
    id: "evt-3",
    title: "Web3 & AI Creator Summit 🚀",
    hostName: "TechSam",
    hostAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    category: "Keynote & Panel",
    startDate: "Sunday at 3:00 PM EST",
    countdown: "3d 09h 15m",
    attendeesCount: 4500,
    bannerBg: "from-fuchsia-950 via-pink-900 to-purple-950",
    ticketPrice: "VIP TICKET",
    description: "Discover the future of interactive streaming, monetization models, and synthetic avatar streams.",
  },
];

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [rsvpEvents, setRsvpEvents] = useState<Record<string, boolean>>({});

  const handleRSVP = (evt: EventItem) => {
    setRsvpEvents((prev) => ({ ...prev, [evt.id]: true }));
    setSelectedEvent(evt);
  };

  return (
    <PageFrame>
      <main className="mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,48px)] py-10">
        {/* Header Title */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            <Calendar className="size-3.5" /> Scheduled Events & Concerts
          </div>
          <h1 className="mt-3 text-[clamp(28px,3vw,44px)] font-bold text-white">
            Upcoming <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Live Broadcasts & Festivals</span>
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-400 text-sm">
            RSVP for upcoming mega broadcasts, claim digital ticket passes, and set automatic reminders.
          </p>
        </div>

        {/* Featured Events Grid */}
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {eventsData.map((evt) => (
            <Card
              key={evt.id}
              className="group relative flex flex-col justify-between overflow-hidden border-white/15 bg-zinc-950 p-6 shadow-xl transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
            >
              <div className={`absolute -right-12 -top-12 size-40 rounded-full bg-gradient-to-br ${evt.bannerBg} blur-2xl opacity-60 group-hover:opacity-100 transition`} />

              <div>
                {/* Event Category & Ticket Tag */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-cyan-300">
                    {evt.category}
                  </span>
                  <span className="text-xs font-bold text-amber-300">{evt.ticketPrice}</span>
                </div>

                <h3 className="mt-4 text-xl font-bold text-white group-hover:text-cyan-300 transition leading-snug">
                  {evt.title}
                </h3>

                <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">{evt.description}</p>

                {/* Host Info */}
                <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                  <img src={evt.hostAvatar} alt={evt.hostName} className="size-9 rounded-full border border-cyan-400 object-cover" />
                  <div>
                    <span className="text-xs text-zinc-400">Hosted by</span>
                    <p className="text-xs font-semibold text-white">{evt.hostName}</p>
                  </div>
                </div>

                {/* Countdown & Attendees */}
                <div className="mt-4 space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs">
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="flex items-center gap-1.5 text-zinc-400">
                      <Clock className="size-3.5 text-cyan-400" /> Countdown:
                    </span>
                    <span className="font-mono font-bold text-cyan-300">{evt.countdown}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="flex items-center gap-1.5 text-zinc-400">
                      <Users className="size-3.5 text-purple-400" /> Attendees:
                    </span>
                    <span className="font-semibold text-white">{evt.attendeesCount.toLocaleString()} RSVPd</span>
                  </div>
                </div>
              </div>

              {/* RSVP Action */}
              <div className="mt-6">
                <Button
                  onClick={() => handleRSVP(evt)}
                  className={`w-full h-11 rounded-xl text-xs font-semibold transition ${
                    rsvpEvents[evt.id]
                      ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
                      : "bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:from-violet-500 hover:to-cyan-400 shadow-md"
                  }`}
                >
                  {rsvpEvents[evt.id] ? (
                    <>
                      <CheckCircle2 className="mr-2 size-4" /> Ticket Claimed!
                    </>
                  ) : (
                    <>
                      <Ticket className="mr-2 size-4" /> Get Free Digital Pass
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Digital Ticket Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-md overflow-hidden rounded-3xl border border-cyan-400/40 bg-zinc-950 p-6 shadow-[0_0_50px_rgba(34,211,238,0.3)]"
              >
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute right-4 top-4 text-zinc-400 hover:text-white"
                >
                  <X className="size-5" />
                </button>

                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="size-3.5" /> Official VIP Ticket Issued
                  </span>

                  <h3 className="mt-4 text-lg font-bold text-white">{selectedEvent.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{selectedEvent.startDate}</p>
                </div>

                {/* Ticket Pass Mockup Card */}
                <div className="mt-6 rounded-2xl border border-white/15 bg-gradient-to-br from-violet-950/60 to-zinc-950 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <p className="text-[10px] text-zinc-400">PASS HOLDER</p>
                      <p className="text-xs font-bold text-white">LivZo VIP Member</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-400">TICKET TYPE</p>
                      <p className="text-xs font-bold text-cyan-300">STAGE ACCESS PASS</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center py-2">
                    <div className="flex flex-col items-center rounded-xl bg-white p-3 text-zinc-950">
                      <QrCode className="size-24" />
                      <span className="mt-1 font-mono text-[10px] font-bold">LVZ-EVT-8920-2026</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    onClick={() => {
                      alert("Added to your device calendar! 📅");
                      setSelectedEvent(null);
                    }}
                    className="flex-1 h-10 rounded-xl bg-cyan-400 text-zinc-950 text-xs font-semibold hover:bg-cyan-300"
                  >
                    <Bell className="mr-1.5 size-4" /> Add Reminder
                  </Button>
                  <Button
                    onClick={() => setSelectedEvent(null)}
                    variant="secondary"
                    className="h-10 rounded-xl border-white/15 text-xs text-white"
                  >
                    Done
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </PageFrame>
  );
}
