import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <div className={cn("flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-xs font-semibold text-white", className)} aria-label={name}>
      <UserRound className="size-4" aria-hidden="true" />
    </div>
  );
}
