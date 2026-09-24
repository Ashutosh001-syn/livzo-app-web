"use client";

import { useState } from "react";
import { Coins, Phone, PhoneCall, PhoneOff, Video, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/components/providers/socket-provider";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export function CallsClient({ users, currentUserId }: { users: any[], currentUserId: string }) {
  const { socket, isConnected } = useSocket();
  const [callingUser, setCallingUser] = useState<any | null>(null);
  const [callStatus, setCallStatus] = useState<"ringing" | "connected">("ringing");

  const startCall = (user: any) => {
    setCallingUser(user);
    setCallStatus("ringing");
    
    // Simulate connection after 3 seconds
    setTimeout(() => {
      setCallStatus("connected");
    }, 3000);
  };

  const endCall = () => {
    setCallingUser(null);
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.map((user, index) => (
          <div key={user.id} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md transition-all hover:border-violet-500/50 hover:bg-white/5">
            {/* Top Rank Badge */}
            {index < 3 && (
              <div className="absolute right-0 top-0 rounded-bl-xl bg-gradient-to-br from-amber-400 to-orange-500 px-3 py-1 shadow-lg">
                <div className="flex items-center gap-1 text-xs font-bold text-white">
                  <Star className="size-3 fill-white" /> Top #{index + 1}
                </div>
              </div>
            )}

            <div className="flex flex-col items-center p-8 text-center">
              <Link href={`/${user.handle}`} className="group/profile flex flex-col items-center transition-transform hover:scale-105">
                <div className="relative mb-4 flex size-24 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-600 p-[3px] shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                  <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-black bg-zinc-900 text-3xl font-bold text-white transition-colors group-hover/profile:bg-zinc-800">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 size-5 rounded-full border-2 border-black bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>
                
                <h3 className="text-xl font-bold text-white group-hover/profile:text-violet-300 transition-colors">{user.displayName}</h3>
                <p className="text-sm font-medium text-zinc-400 group-hover/profile:text-zinc-300 transition-colors">@{user.handle}</p>
              </Link>
              
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400">
                  <Zap className="size-3.5" />
                  {user.callPrice} / min
                </div>
              </div>

              <div className="mt-6 flex w-full gap-3">
                <Button 
                  onClick={() => startCall(user)}
                  className="flex-1 gap-2 bg-white/10 text-white hover:bg-white/20"
                >
                  <Phone className="size-4" /> Call
                </Button>
                <Button 
                  onClick={() => startCall(user)}
                  className="flex-1 gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg hover:from-violet-500 hover:to-blue-500"
                >
                  <Video className="size-4" /> Video
                </Button>
              </div>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500">
            No other users found.
          </div>
        )}
      </div>

      {/* Fullscreen Calling Overlay */}
      <AnimatePresence>
        {callingUser && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
            
            <div className="relative z-10 flex flex-col items-center">
              <motion.div 
                animate={{ scale: callStatus === "ringing" ? [1, 1.1, 1] : 1 }}
                transition={{ repeat: callStatus === "ringing" ? Infinity : 0, duration: 1.5 }}
                className="mb-8 flex size-32 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-blue-600 p-[4px] shadow-[0_0_40px_rgba(139,92,246,0.5)]"
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900 text-5xl font-bold text-white">
                  {callingUser.displayName.charAt(0).toUpperCase()}
                </div>
              </motion.div>

              <h2 className="text-3xl font-bold text-white">{callingUser.displayName}</h2>
              <p className="mt-2 text-lg text-violet-300">
                {callStatus === "ringing" ? "Ringing..." : "Connected! 00:01"}
              </p>

              <div className="mt-16 flex items-center gap-6">
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="size-16 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <Video className="size-6" />
                </Button>
                <Button 
                  size="icon" 
                  onClick={endCall}
                  className="size-20 rounded-full bg-rose-600 text-white shadow-[0_0_30px_rgba(225,29,72,0.5)] hover:bg-rose-500"
                >
                  <PhoneOff className="size-8" />
                </Button>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="size-16 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <PhoneCall className="size-6" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
