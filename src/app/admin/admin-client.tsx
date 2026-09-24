"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Gift, Plus, UserCircle, Edit2, Loader2, Check, Activity, ArrowRightLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminDashboardClient({ 
  initialUsers, 
  initialGifts,
  authLogs = [],
  giftLogs = []
}: { 
  initialUsers: any[]; 
  initialGifts: any[];
  authLogs?: any[];
  giftLogs?: any[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"users" | "gifts" | "logs">("users");

  const [editingCoins, setEditingCoins] = useState<string | null>(null);
  const [coinInput, setCoinInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [showAddGift, setShowAddGift] = useState(false);
  const [newGift, setNewGift] = useState({ name: "", cost: 100, icon: "Gift", color: "text-amber-400", bg: "from-amber-500/20 to-orange-500/5" });

  const handleUpdateCoins = async (userId: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/users/coins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, coins: parseInt(coinInput) || 0 }),
      });
      if (res.ok) {
        setEditingCoins(null);
        router.refresh();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddGift = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGift),
      });
      if (res.ok) {
        setShowAddGift(false);
        setNewGift({ name: "", cost: 100, icon: "Gift", color: "text-amber-400", bg: "from-amber-500/20 to-orange-500/5" });
        router.refresh();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all ${
            activeTab === "users" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <UserCircle className="size-5" />
          Users & Coins
        </button>
        <button
          onClick={() => setActiveTab("gifts")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all ${
            activeTab === "gifts" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Gift className="size-5" />
          Manage Gifts
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all ${
            activeTab === "logs" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Activity className="size-5" />
          Activity Logs
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {initialUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-lg font-bold text-white shadow-lg">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{user.displayName}</h3>
                  <p className="text-sm text-zinc-400">@{user.handle} • {user.phone || user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2 text-amber-400">
                  <Coins className="size-5" />
                  <span className="font-bold">{user.coins.toLocaleString()}</span>
                </div>
                
                {editingCoins === user.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={coinInput}
                      onChange={(e) => setCoinInput(e.target.value)}
                      className="w-24 rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-white outline-none focus:border-violet-500"
                      placeholder="New bal"
                    />
                    <Button
                      size="icon"
                      className="size-8 bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      onClick={() => handleUpdateCoins(user.id)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-zinc-400 hover:text-white"
                      onClick={() => setEditingCoins(null)}
                    >
                      X
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    className="gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-white"
                    onClick={() => {
                      setEditingCoins(user.id);
                      setCoinInput(user.coins.toString());
                    }}
                  >
                    <Edit2 className="size-4" /> Edit Coins
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gifts Tab */}
      {activeTab === "gifts" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Available Gifts</h2>
            <Button
              className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white"
              onClick={() => setShowAddGift(!showAddGift)}
            >
              <Plus className="size-4" /> Add New Gift
            </Button>
          </div>

          {showAddGift && (
            <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-6 backdrop-blur-md animate-in fade-in slide-in-from-top-4">
              <h3 className="mb-4 font-semibold text-white">Create New Gift</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Name</label>
                  <input
                    type="text"
                    value={newGift.name}
                    onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white outline-none focus:border-violet-500"
                    placeholder="e.g. Diamond"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Cost (Coins)</label>
                  <input
                    type="number"
                    value={newGift.cost}
                    onChange={(e) => setNewGift({ ...newGift, cost: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Tailwind Text Color</label>
                  <input
                    type="text"
                    value={newGift.color}
                    onChange={(e) => setNewGift({ ...newGift, color: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-white outline-none focus:border-violet-500"
                    placeholder="text-cyan-400"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    className="w-full bg-violet-600 text-white hover:bg-violet-500"
                    onClick={handleAddGift}
                    disabled={!newGift.name || isUpdating}
                  >
                    {isUpdating ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                    Save Gift
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {initialGifts.map((gift) => (
              <div key={gift.id} className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md">
                <div className={`absolute -right-8 -top-8 size-24 rounded-full bg-gradient-to-br ${gift.bg} blur-xl`} />
                <div className={`mb-4 flex size-12 items-center justify-center rounded-xl bg-white/5 ${gift.color}`}>
                  <Gift className="size-6" />
                </div>
                <h3 className="font-semibold text-white">{gift.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-amber-400">
                  <Coins className="size-4" /> {gift.cost} Coins
                </p>
              </div>
            ))}
            {initialGifts.length === 0 && (
              <p className="col-span-full py-8 text-center text-zinc-500">No gifts created yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">System Activity logs</h2>
          
          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden backdrop-blur-md">
            {[...authLogs.map(l => ({ ...l, _type: 'auth' })), ...giftLogs.map(l => ({ ...l, _type: 'gift' }))]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((log: any, i) => (
                <div key={`${log._type}-${log.id}`} className={`flex items-start gap-4 p-5 ${i !== 0 ? 'border-t border-white/5' : ''}`}>
                  
                  {log._type === 'auth' ? (
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-400">
                      <ShieldAlert className="size-5" />
                    </div>
                  ) : (
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
                      <ArrowRightLeft className="size-5" />
                    </div>
                  )}

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">
                        {log._type === 'auth' ? (
                          <>User <span className="text-violet-300">@{log.user?.handle || "Unknown"}</span> performed {log.eventType}</>
                        ) : (
                          <><span className="text-cyan-300">@{log.sender?.handle}</span> sent <span className="text-rose-400 font-bold">{log.giftName}</span> to <span className="text-violet-300">@{log.receiver?.handle}</span></>
                        )}
                      </p>
                      <span className="text-xs text-zinc-500">{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-zinc-400">
                      {log._type === 'auth' ? (
                        <>IP Hash: {log.ipHash || "N/A"} • OS: {log.userAgent?.split(' ')[1] || "Unknown"}</>
                      ) : (
                        <>Transaction Cost: {log.cost} Coins</>
                      )}
                    </p>
                  </div>

                </div>
              ))}
              
              {authLogs.length === 0 && giftLogs.length === 0 && (
                <p className="py-8 text-center text-zinc-500">No activity logs found.</p>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
