import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://livzo.com"),
  title: {
    default: "LivZo | Live, together",
    template: "%s | LivZo",
  },
  description: "A premium live streaming platform for creators and communities.",
  applicationName: "LivZo",
  keywords: ["live streaming", "creators", "community", "LivZo"],
  openGraph: {
    type: "website",
    siteName: "LivZo",
    title: "LivZo | Live, together",
    description: "A premium live streaming platform for creators and communities.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
