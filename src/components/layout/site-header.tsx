"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Compass,
  Crown,
  Download,
  Gift,
  Home,
  LogOut,
  Menu,
  Radio,
  Sparkles,
  User as UserIcon,
  Video,
  PhoneCall,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

const navigation = [
  { label: "Home", href: "/", icon: Home },
  { label: "Live", href: "/discover", icon: Radio },
  { label: "Video Calls", href: "/calls", icon: PhoneCall },
  { label: "Reels", href: "/reels", icon: Video },
  { label: "Audio", href: "/audio-rooms", icon: Sparkles },
  { label: "Events", href: "/events", icon: Compass },
  { label: "Rewards", href: "/rewards", icon: Gift },
  { label: "VIP", href: "/vip", icon: Crown },
] as const;

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 20);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Click outside to close profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 transform-gpu ${
        isScrolled
          ? "border-white/10 bg-[#0d0d12]/85 backdrop-blur-xl shadow-lg"
          : "border-transparent bg-transparent backdrop-blur-none"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-bold tracking-tight text-white transition-opacity hover:opacity-90"
        >
          <span className="relative flex size-8 items-center justify-center overflow-hidden rounded-[11px] bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-400 p-[1px] shadow-[0_0_18px_rgba(99,102,241,0.5)]">
            <span className="absolute inset-[1px] rounded-[9px] bg-zinc-950/20" />
            <Radio className="relative size-4 text-white" aria-hidden="true" />
          </span>
          <span className="text-[17px]">LivZo</span>
        </Link>

        <nav
          className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 lg:flex"
          aria-label="Main navigation"
        >
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                prefetch={true}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-white/10 text-white font-medium"
                    : "text-zinc-400 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {!isLoading && user ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="group flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 py-1 pl-1.5 pr-3 text-sm text-white transition-all hover:border-violet-500/40 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-violet-400"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500 text-xs font-semibold text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                  {user.displayName ? user.displayName.slice(0, 1).toUpperCase() : "U"}
                </span>
                <span className="max-w-[120px] truncate font-medium">{user.displayName}</span>
                <ChevronDown
                  className={`size-3.5 text-zinc-400 transition-transform duration-200 ${
                    isProfileMenuOpen ? "rotate-180 text-violet-300" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/12 bg-[#0d091e]/95 p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(124,58,237,0.15)] backdrop-blur-2xl"
                  >
                    <div className="border-b border-white/10 px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-semibold text-white">{user.displayName}</p>
                        <span className="rounded-md bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-violet-300">
                          {user.role === "host" ? "Creator" : user.role === "admin" ? "Admin" : "Member"}
                        </span>
                      </div>
                      <p className="truncate text-xs text-zinc-400">@{user.handle}</p>
                    </div>

                    <div className="py-1">
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <Crown className="size-4 text-emerald-400" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/studio"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <Video className="size-4 text-cyan-300" />
                        Creator Studio
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <UserIcon className="size-4 text-pink-300" />
                        Profile Settings
                      </Link>
                      <Link
                        href="/vip"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <Crown className="size-4 text-amber-300" />
                        VIP Membership
                      </Link>
                    </div>

                    <div className="border-t border-white/10 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                      >
                        <LogOut className="size-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <Link href="/signup">
                <Button className="h-9 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 text-sm text-white shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:from-violet-400 hover:to-blue-400">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="relative z-10 flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 lg:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/10 bg-zinc-950/95 lg:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col px-5 pb-6 pt-3 sm:px-8" aria-label="Mobile navigation">
              {navigation.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 border-b border-white/[0.07] py-3.5 text-base transition-colors ${
                      isActive
                        ? "text-white font-semibold"
                        : "text-zinc-300 hover:text-white"
                    }`}
                  >
                    <Icon className={`size-4 ${isActive ? "text-cyan-400" : "text-violet-300"}`} />
                    {label}
                  </Link>
                );
              })}

              {!isLoading && user ? (
                <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                  <div className="flex items-center gap-3 px-1 py-2">
                    <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500 font-semibold text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                      {user.displayName ? user.displayName.slice(0, 1).toUpperCase() : "U"}
                    </span>
                    <div>
                      <p className="font-medium text-white">{user.displayName}</p>
                      <p className="text-xs text-zinc-400">@{user.handle}</p>
                    </div>
                  </div>
                  <Link
                    href="/studio"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl py-2.5 text-sm text-zinc-300"
                  >
                    <Video className="size-4 text-cyan-300" />
                    Creator Studio
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl py-2.5 text-sm text-zinc-300"
                  >
                    <UserIcon className="size-4 text-pink-300" />
                    Profile Settings
                  </Link>
                  <Link
                    href="/vip"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl py-2.5 text-sm text-zinc-300"
                  >
                    <Crown className="size-4 text-amber-300" />
                    VIP Membership
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl py-2.5 text-sm text-rose-400"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="mt-5 flex flex-col gap-2.5">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="secondary" className="h-11 w-full border-white/15 text-white">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="h-11 w-full bg-gradient-to-r from-violet-500 to-blue-500 text-white">
                      Create account
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
