"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2, MailCheck, Send, XCircle } from "lucide-react";

import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    token ? "verifying" : "error"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(
    token ? null : "Verification token is missing from the link."
  );
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    const verify = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        if (!isMounted) return;

        if (response.ok && !data?.error) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(data?.error?.message ?? "Invalid or expired verification token.");
        }
      } catch {
        if (isMounted) {
          setStatus("error");
          setErrorMessage("Network error occurred. Please try again.");
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;
    setIsResending(true);
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      setResendSuccess(true);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-4">
      {status === "verifying" && (
        <div className="space-y-4 rounded-2xl border border-violet-500/25 bg-gradient-to-b from-violet-500/10 to-transparent p-8 text-center shadow-[0_0_30px_rgba(139,92,246,0.15)] animate-in fade-in duration-300">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300 shadow-[0_0_25px_rgba(139,92,246,0.35)]">
            <Loader2 className="size-7 animate-spin text-violet-400" />
          </div>
          <h2 className="text-lg font-bold text-white">Verifying your email...</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Please hold on while we securely confirm your account credentials.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-5 rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-emerald-500/10 to-transparent p-7 text-center shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.35)]">
            <CheckCircle2 className="size-7 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Email Verified!</h2>
            <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
              Your LivZo account is now authenticated and ready. You can sign in and start streaming or exploring.
            </p>
          </div>
          <Link
            href="/login"
            className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 py-3 text-sm font-medium text-white shadow-[0_0_25px_rgba(124,58,237,0.35)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(124,58,237,0.65)] active:scale-[0.98]"
          >
            <span>Continue to Sign in</span>
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-5 rounded-2xl border border-rose-500/25 bg-gradient-to-b from-rose-500/10 to-transparent p-6 text-center shadow-[0_0_30px_rgba(244,63,94,0.15)] animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
            <XCircle className="size-6 text-rose-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Verification Failed</h2>
            <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed">
              {errorMessage ?? "This email verification link is invalid or has expired."}
            </p>
          </div>

          {/* Resend Verification Link Card */}
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-left">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Request a new link
            </span>

            {resendSuccess ? (
              <p className="mt-2 text-xs text-emerald-400">
                A new verification email has been sent if an account was found.
              </p>
            ) : (
              <form onSubmit={handleResend} className="mt-2.5 flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  required
                  className="h-10 flex-1 rounded-lg border border-white/10 bg-black/50 px-3 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                />
                <button
                  type="submit"
                  disabled={isResending}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-white/10 px-3.5 text-xs font-medium text-white transition-colors hover:bg-white/20 disabled:opacity-50"
                >
                  {isResending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Send className="size-3.5" />
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="flex gap-2.5 pt-1">
            <Link
              href="/register"
              className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2.5 text-center text-xs font-medium text-white transition-colors hover:bg-white/10"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="flex-1 rounded-xl bg-white py-2.5 text-center text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Email Verification"
        subtitle="Confirming your address secures and activates your LivZo profile"
        badgeIcon={<MailCheck className="size-6 text-cyan-300 transition-transform duration-300 group-hover:scale-110" />}
      >
        <Suspense fallback={<div className="py-8 text-center text-xs text-zinc-500">Loading verification...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </AuthCard>
    </AuthLayout>
  );
}
