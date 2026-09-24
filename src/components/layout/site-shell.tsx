import type { ReactNode } from "react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import { SocketProvider } from "@/components/providers/socket-provider";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SocketProvider>
        <MotionProvider>
          <LenisProvider />
          {children}
        </MotionProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
