import type { ReactNode } from "react";
import { AuthParticlesBackground } from "@/components/auth/auth-particles-background";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-x-hidden bg-[#06040f] p-4 sm:p-6 lg:p-8 text-white selection:bg-violet-500/35 selection:text-violet-200">
      {/* Dynamic Animated Particles Canvas */}
      <AuthParticlesBackground />

      {/* Futuristic Deep Space Nebula Glow Layers */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Core Top-Center Violet Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-gradient-to-b from-violet-600/25 via-indigo-600/15 to-transparent blur-[120px]" />

        {/* Bottom-Right Electric Blue Nebula */}
        <div className="absolute -bottom-32 right-1/4 size-[500px] rounded-full bg-gradient-to-tr from-blue-600/20 via-cyan-500/10 to-transparent blur-[110px]" />

        {/* Center Card Backlight Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[520px] rounded-full bg-violet-600/15 blur-[140px]" />

        {/* Subtle Cyber Grid Matrix with Radial Vignette */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_65%,transparent_100%)] opacity-70" />
      </div>

      {/* Main Authentication Card - Centered Vertically & Horizontally */}
      <div className="relative z-10 flex w-full items-center justify-center py-6">
        {children}
      </div>
    </main>
  );
}
