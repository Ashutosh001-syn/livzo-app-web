import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function PageFrame({ children, hideFooter = false, hideHeader = false }: { children: ReactNode, hideFooter?: boolean, hideHeader?: boolean }) {
  return <div className="flex min-h-screen flex-col">{!hideHeader && <SiteHeader />}<div className="flex-1">{children}</div>{!hideFooter && <SiteFooter />}</div>;
}
