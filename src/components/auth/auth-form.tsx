"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  AtSign,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect");
  const redirectPath =
    rawRedirect && !rawRedirect.startsWith("/dashboard") ? rawRedirect : "/";

  const { login, signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGeneralError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const result = await login(email, password, rememberMe);
        if (!result.ok) {
          setGeneralError(result.error ?? "Invalid email or password.");
          setIsSubmitting(false);
          return;
        }
      } else {
        const result = await signup(displayName, handle, email, password);
        if (!result.ok) {
          if (result.fields) setFieldErrors(result.fields);
          setGeneralError(result.error ?? "Registration could not be completed.");
          setIsSubmitting(false);
          return;
        }

        if (result.requiresVerification) {
          setVerificationSent(true);
          setIsSubmitting(false);
          return;
        }
      }

      router.push(redirectPath);
      router.refresh();
    } catch {
      setGeneralError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="mt-4 rounded-2xl border border-cyan-500/25 bg-gradient-to-b from-cyan-500/10 to-transparent p-6 text-center shadow-[0_0_30px_rgba(34,211,238,0.15)]">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
          <CheckCircle2 className="size-6 text-cyan-400" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-white">Check your email</h2>
        <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
          We sent a verification link to <span className="font-semibold text-white">{email}</span>.
          Please click the link in your email to verify your account before signing in.
        </p>
        <Link
          href="/login"
          className="group relative mt-6 inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 py-3 text-sm font-medium text-white shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(124,58,237,0.65)] active:scale-[0.98]"
        >
          <span>Continue to Sign in</span>
          <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      {generalError && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-in fade-in zoom-in-95 duration-200">
          <AlertCircle className="size-4 shrink-0 text-rose-400" />
          <span>{generalError}</span>
        </div>
      )}

      {mode === "signup" && (
        <>
          {/* Display Name Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">
              Display name
            </label>
            <div className="group relative flex items-center rounded-xl border border-white/10 bg-black/35 transition-all duration-200 focus-within:border-violet-400 focus-within:bg-black/60 focus-within:ring-2 focus-within:ring-violet-500/30 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <span className="pointer-events-none pl-3.5 text-zinc-500 transition-colors duration-200 group-focus-within:text-violet-400">
                <User className="size-4" />
              </span>
              <input
                type="text"
                placeholder="Luna Vale"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl bg-transparent px-3 text-sm text-white placeholder:text-zinc-500 outline-none disabled:opacity-50"
              />
            </div>
            {fieldErrors.displayName && (
              <span className="mt-1 flex items-center gap-1 text-xs text-rose-400">
                <AlertCircle className="size-3" />
                {fieldErrors.displayName}
              </span>
            )}
          </div>

          {/* Username / Handle Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">
              Username
            </label>
            <div className="group relative flex items-center rounded-xl border border-white/10 bg-black/35 transition-all duration-200 focus-within:border-violet-400 focus-within:bg-black/60 focus-within:ring-2 focus-within:ring-violet-500/30 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <span className="pointer-events-none pl-3.5 text-zinc-500 transition-colors duration-200 group-focus-within:text-violet-400">
                <AtSign className="size-4" />
              </span>
              <input
                type="text"
                placeholder="lunavale"
                value={handle}
                onChange={(e) =>
                  setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
                }
                required
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl bg-transparent px-3 text-sm text-white placeholder:text-zinc-500 outline-none disabled:opacity-50"
              />
            </div>
            {fieldErrors.handle && (
              <span className="mt-1 flex items-center gap-1 text-xs text-rose-400">
                <AlertCircle className="size-3" />
                {fieldErrors.handle}
              </span>
            )}
          </div>
        </>
      )}

      {/* Email Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-300">
          Email address
        </label>
        <div className="group relative flex items-center rounded-xl border border-white/10 bg-black/35 transition-all duration-200 focus-within:border-violet-400 focus-within:bg-black/60 focus-within:ring-2 focus-within:ring-violet-500/30 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.2)]">
          <span className="pointer-events-none pl-3.5 text-zinc-500 transition-colors duration-200 group-focus-within:text-violet-400">
            <Mail className="size-4" />
          </span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
            autoComplete="email"
            className="h-11 w-full rounded-xl bg-transparent px-3 text-sm text-white placeholder:text-zinc-500 outline-none disabled:opacity-50"
          />
        </div>
        {fieldErrors.email && (
          <span className="mt-1 flex items-center gap-1 text-xs text-rose-400">
            <AlertCircle className="size-3" />
            {fieldErrors.email}
          </span>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-300">
          Password
        </label>
        <div className="group relative flex items-center rounded-xl border border-white/10 bg-black/35 transition-all duration-200 focus-within:border-violet-400 focus-within:bg-black/60 focus-within:ring-2 focus-within:ring-violet-500/30 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.2)]">
          <span className="pointer-events-none pl-3.5 text-zinc-500 transition-colors duration-200 group-focus-within:text-violet-400">
            <Lock className="size-4" />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="h-11 w-full rounded-xl bg-transparent px-3 pr-10 text-sm text-white placeholder:text-zinc-500 outline-none disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 text-zinc-500 transition-colors hover:text-zinc-300 focus:outline-none"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {fieldErrors.password && (
          <span className="mt-1 flex items-center gap-1 text-xs text-rose-400">
            <AlertCircle className="size-3" />
            {fieldErrors.password}
          </span>
        )}
      </div>

      {/* Remember Me & Forgot Password Links (Login Mode) */}
      {mode === "login" && (
        <div className="flex items-center justify-between pt-1 text-xs text-zinc-400">
          <label className="flex items-center gap-2.5 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="size-4 rounded border-white/20 bg-white/5 accent-violet-500 cursor-pointer transition-colors group-hover:border-violet-400"
            />
            <span className="group-hover:text-zinc-300 transition-colors">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-violet-400 transition-colors hover:text-violet-300 hover:underline focus-visible:outline-none"
          >
            Forgot password?
          </Link>
        </div>
      )}

      {/* Submit Action Button with Advanced Animation & Shimmer */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative flex h-11 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-sm font-medium text-white shadow-[0_0_25px_rgba(124,58,237,0.35)] transition-all duration-300 hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 hover:shadow-[0_0_35px_rgba(124,58,237,0.6)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {/* Button Hover Shimmer Sweep */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
          />

          {isSubmitting ? (
            <span className="relative flex items-center gap-2">
              <Loader2 className="size-4 animate-spin text-white" />
              <span>Please wait...</span>
            </span>
          ) : (
            <span className="relative flex items-center gap-2">
              <span>{mode === "login" ? "Sign in to LivZo" : "Create account"}</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
