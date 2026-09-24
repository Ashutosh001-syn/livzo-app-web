import type { ReactNode } from "react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { MotionProvider } from "@/components/providers/motion-provider";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <MotionProvider>
        <LenisProvider />
        {children}
      </MotionProvider>
    </AuthProvider>
  );
}
