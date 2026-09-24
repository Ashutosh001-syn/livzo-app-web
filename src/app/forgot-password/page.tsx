"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Loader2, Mail } from "lucide-react";

import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok || data?.error) {
        setError(data?.error?.message ?? "Unable to send reset instructions.");
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("Network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Reset password"
        subtitle="Enter your email and we'll send a recovery link"
        badgeIcon={<KeyRound className="size-6 text-violet-300 transition-transform duration-300 group-hover:rotate-12" />}
      >
        {isSuccess ? (
          <div className="space-y-5 rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-emerald-500/10 to-transparent p-6 text-center shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="size-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Check your email</h2>
              <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                If an account exists for <span className="font-semibold text-white">{email}</span>, we have sent instructions to reset your password.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-medium text-white transition-all hover:border-white/30 hover:bg-white/10"
            >
              Return to sign in
            </Link>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-in fade-in zoom-in-95 duration-200">
                <AlertCircle className="size-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
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
                    <span>Sending instructions...</span>
                  </span>
                ) : (
                  <span className="relative flex items-center gap-2">
                    <span>Send reset instructions</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                )}
              </button>
            </div>

            <div className="pt-3 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
