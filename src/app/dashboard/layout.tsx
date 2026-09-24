"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bookmark,
  Compass,
  Radio,
  Settings,
  User,
  Video,
} from "lucide-react";
import type { ReactNode } from "react";

import { PageFrame } from "@/components/layout/page-frame";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

const dashboardNav = [
  { label: "Overview", href: "/dashboard", icon: BarChart3 },
  { label: "Your Library", href: "/dashboard/library", icon: Bookmark },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <PageFrame>
      <div className="mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,48px)] py-8 sm:py-12">
        {/* Creator header banner */}
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-400 text-lg font-bold text-white shadow-md">
              {user?.displayName ? user.displayName.slice(0, 1).toUpperCase() : <User />}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white sm:text-2xl">
                {user?.displayName ? `${user.displayName}'s Studio` : "Creator Dashboard"}
              </h1>
              <p className="text-xs text-zinc-400">
                @{user?.handle ?? "creator"} · Role: <span className="uppercase text-violet-300">{user?.role ?? "USER"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/discover">
              <Button variant="secondary" className="h-10 border-white/15 text-xs text-zinc-300">
                <Compass className="mr-1.5 size-3.5" />
                Browse Rooms
              </Button>
            </Link>
            <Link href="/studio">
              <Button className="h-10 bg-gradient-to-r from-violet-500 to-blue-500 px-4 text-xs font-semibold text-white shadow-lg hover:from-violet-400 hover:to-blue-400">
                <Radio className="mr-1.5 size-3.5 text-rose-300" />
                Go Live
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard tabs / sidebar grid */}
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="h-fit space-y-1 rounded-2xl border border-white/10 bg-white/[0.02] p-2">
            {dashboardNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-violet-600/20 text-violet-200 border border-violet-500/30"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className={cn("size-4", isActive ? "text-violet-300" : "text-zinc-500")} />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-white/10 mt-2">
              <Link
                href="/studio"
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-cyan-300 hover:bg-cyan-500/10 transition-colors"
              >
                <Video className="size-4 text-cyan-300" />
                Broadcast Studio
              </Link>
            </div>
          </aside>

          <section className="min-w-0">{children}</section>
        </div>
      </div>
    </PageFrame>
  );
}
