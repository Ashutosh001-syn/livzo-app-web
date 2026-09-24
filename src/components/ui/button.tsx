import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function Button({ className, variant = "primary", size = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-white text-zinc-950 hover:bg-zinc-200",
        variant === "secondary" && "border border-white/15 bg-white/5 text-white hover:bg-white/10",
        variant === "ghost" && "text-zinc-400 hover:bg-white/5 hover:text-white",
        size === "sm" && "min-h-8 px-3 text-xs",
        size === "lg" && "min-h-12 px-6 text-base",
        size === "icon" && "size-9 p-0",
        className,
      )}
      {...props}
    />
  );
}
