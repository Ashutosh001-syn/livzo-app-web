import type { ReactNode } from "react";
import Link from "next/link";
import { Radio } from "lucide-react";

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  badgeIcon?: ReactNode;
  showBrandBadge?: boolean;
}

export function AuthCard({
  children,
  title,
  subtitle,
  badgeIcon,
  showBrandBadge = true,
}: AuthCardProps) {
  return (
    <div className="relative w-full max-w-[440px] mx-auto">
      {/* Dynamic behind-card ambient glow aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 rounded-[32px] bg-gradient-to-r from-violet-600/35 via-indigo-600/25 to-blue-600/35 opacity-70 blur-2xl transition duration-1000"
      />

      {/* Glassmorphic Auth Card Container */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0c081e]/80 p-6 sm:p-9 shadow-[0_0_60px_-10px_rgba(124,58,237,0.35),0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-all duration-300">
        {/* Top Specular Edge Highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent"
        />

        {/* Subtle internal gradient shine */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-48 rounded-full bg-violet-500/15 blur-3xl"
        />

        {/* Brand Badge / Apex Icon */}
        {showBrandBadge && (
          <div className="mb-6 flex flex-col items-center text-center">
            <Link
              href="/"
              className="group relative flex size-13 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500 p-[1.5px] shadow-[0_0_24px_rgba(139,92,246,0.55)] transition-transform duration-300 hover:scale-105"
            >
              {/* Pulsing subtle ambient halo behind badge */}
              <span
                aria-hidden="true"
                className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 opacity-40 blur-md transition-opacity duration-300 group-hover:opacity-75"
              />
              <span className="relative flex size-full items-center justify-center rounded-[14px] bg-[#0c081e]/90 backdrop-blur-sm transition-colors duration-200 group-hover:bg-[#0c081e]/70">
                {badgeIcon ?? <Radio className="size-6 text-violet-300 transition-transform duration-300 group-hover:rotate-12" />}
              </span>
            </Link>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 text-sm text-zinc-400">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {!showBrandBadge && (
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 text-sm text-zinc-400">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Card Body Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
