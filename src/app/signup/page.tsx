import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create an Account | LivZo",
  description: "Join LivZo to broadcast live video, host audio spaces, and connect with your audience.",
};

export default function SignupPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Create your account"
        subtitle="Claim your handle and join the next generation of live streaming"
      >
        <AuthForm mode="signup" />

        <div className="mt-6 border-t border-white/[0.08] pt-5 text-center text-xs text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-violet-400 transition-colors hover:text-violet-300 hover:underline focus-visible:outline-none"
          >
            Sign in
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
