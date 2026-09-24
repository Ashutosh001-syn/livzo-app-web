"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
} from "lucide-react";

import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Reset token is missing from the link. Please request a new link.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data?.error?.message ?? "Invalid or expired reset token.");
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch {
      setError("Network error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="space-y-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-6 text-center shadow-[0_0_30px_rgba(244,63,94,0.15)] animate-in fade-in duration-200">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-300">
          <AlertCircle className="size-6 text-rose-400" />
        </div>
        <h2 className="text-base font-bold text-rose-300">Invalid Reset Link</h2>
        <p className="text-xs text-zinc-300 leading-relaxed">
          This password reset link is missing a verification token or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-medium text-white transition-all hover:border-white/30 hover:bg-white/10"
        >
          Request new reset link
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="space-y-4 rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-emerald-500/10 to-transparent p-6 text-center shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-in fade-in zoom-in-95 duration-300">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <CheckCircle2 className="size-6 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Password Updated!</h2>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Your password has been changed successfully. Redirecting you to sign in...
        </p>
        <Link
          href="/login"
          className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
        >
          <span>Sign in now</span>
          <ArrowRight className="ml-2 size-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-in fade-in zoom-in-95 duration-200">
          <AlertCircle className="size-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* New Password Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-300">
          New password
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
            autoComplete="new-password"
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
        <span className="block text-[11px] text-zinc-500">
          Must be at least 8 characters.
        </span>
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-300">
          Confirm new password
        </label>
        <div className="group relative flex items-center rounded-xl border border-white/10 bg-black/35 transition-all duration-200 focus-within:border-violet-400 focus-within:bg-black/60 focus-within:ring-2 focus-within:ring-violet-500/30 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.2)]">
          <span className="pointer-events-none pl-3.5 text-zinc-500 transition-colors duration-200 group-focus-within:text-violet-400">
            <Lock className="size-4" />
          </span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isSubmitting}
            autoComplete="new-password"
            className="h-11 w-full rounded-xl bg-transparent px-3 pr-10 text-sm text-white placeholder:text-zinc-500 outline-none disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            className="absolute right-3 text-zinc-500 transition-colors hover:text-zinc-300 focus:outline-none"
          >
            {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {/* Submit Action Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative flex h-11 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-sm font-medium text-white shadow-[0_0_25px_rgba(124,58,237,0.35)] transition-all duration-300 hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 hover:shadow-[0_0_35px_rgba(124,58,237,0.6)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
          />

          {isSubmitting ? (
            <span className="relative flex items-center gap-2">
              <Loader2 className="size-4 animate-spin text-white" />
              <span>Updating password...</span>
            </span>
          ) : (
            <span className="relative flex items-center gap-2">
              <span>Update password</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          )}
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Create new password"
        subtitle="Please choose a strong password to secure your account"
        badgeIcon={<KeyRound className="size-6 text-violet-300 transition-transform duration-300 group-hover:rotate-12" />}
      >
        <Suspense fallback={<div className="py-8 text-center text-xs text-zinc-500">Loading form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </AuthCard>
    </AuthLayout>
  );
}
