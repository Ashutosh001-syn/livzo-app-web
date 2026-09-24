"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff, Key, Lock, RefreshCw, Shield } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";

export default function SettingsPage() {
  const { user } = useAuth();

  const [streamKey, setStreamKey] = useState("live_sec_7x9a2kL90qWe1rTy4uIo");
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [giftAlerts, setGiftAlerts] = useState(true);

  const rtmpUrl = "rtmp://ingest.livzo.com/live";

  const copyToClipboard = async (text: string, type: "key" | "url") => {
    await navigator.clipboard.writeText(text);
    if (type === "key") {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const regenerateKey = () => {
    const random = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 36).toString(36)
    ).join("");
    setStreamKey(`live_sec_${random}`);
  };

  return (
    <div className="space-y-8">
      {/* Stream Keys & Ingest */}
      <Card className="p-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
            <Key className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Stream & Ingest Configuration</h3>
            <p className="text-xs text-zinc-400">
              Use these credentials in OBS Studio, Streamlabs, or vMix to broadcast to LivZo.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              RTMP / WHIP Ingest URL
            </label>
            <div className="mt-1.5 flex gap-2">
              <Input value={rtmpUrl} readOnly className="bg-white/[0.03] font-mono text-xs text-zinc-300" />
              <Button
                variant="secondary"
                onClick={() => copyToClipboard(rtmpUrl, "url")}
                className="shrink-0 border-white/15 text-xs text-white"
              >
                {copiedUrl ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                <span className="ml-1.5 hidden sm:inline">{copiedUrl ? "Copied" : "Copy"}</span>
              </Button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Primary Stream Key
              </label>
              <button
                type="button"
                onClick={regenerateKey}
                className="flex items-center gap-1 text-xs text-violet-300 hover:text-violet-200"
              >
                <RefreshCw className="size-3" />
                Reset key
              </button>
            </div>
            <div className="mt-1.5 flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showKey ? "text" : "password"}
                  value={streamKey}
                  readOnly
                  className="bg-white/[0.03] pr-10 font-mono text-xs text-zinc-300"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <Button
                variant="secondary"
                onClick={() => copyToClipboard(streamKey, "key")}
                className="shrink-0 border-white/15 text-xs text-white"
              >
                {copiedKey ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                <span className="ml-1.5 hidden sm:inline">{copiedKey ? "Copied" : "Copy"}</span>
              </Button>
            </div>
            <p className="mt-1.5 text-[11px] text-zinc-500">
              Never share your stream key with anyone. Anyone with this key can broadcast to your channel.
            </p>
          </div>
        </div>
      </Card>

      {/* Preferences & Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
            <Shield className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Broadcast Notifications</h3>
            <p className="text-xs text-zinc-400">Control when LivZo sends you activity summaries.</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-white">Live Broadcast Alerts</p>
              <p className="text-xs text-zinc-400">Notify followers by email and push when you go live.</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="size-4 rounded border-white/20 bg-white/5 accent-violet-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer border-t border-white/5 pt-4">
            <div>
              <p className="text-sm font-medium text-white">Gift & Tipping Receipts</p>
              <p className="text-xs text-zinc-400">Receive an email receipt whenever a viewer sends a virtual gift.</p>
            </div>
            <input
              type="checkbox"
              checked={giftAlerts}
              onChange={(e) => setGiftAlerts(e.target.checked)}
              className="size-4 rounded border-white/20 bg-white/5 accent-violet-500"
            />
          </label>
        </div>
      </Card>

      {/* Security Info */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-pink-500/15 text-pink-300">
              <Lock className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Account Security</h3>
              <p className="text-xs text-zinc-400">Account handle: @{user?.handle ?? "creator"}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => (window.location.href = "/forgot-password")}
            className="border-white/15 text-xs text-white"
          >
            Change Password
          </Button>
        </div>
      </Card>
    </div>
  );
}