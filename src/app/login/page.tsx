import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign in | LivZo",
  description: "Sign in to LivZo to manage your live streams, access creator studio, and join interactive rooms.",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to continue to your LivZo account"
      >
        <AuthForm mode="login" />

        <div className="mt-6 border-t border-white/[0.08] pt-5 text-center text-xs text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-violet-400 transition-colors hover:text-violet-300 hover:underline focus-visible:outline-none"
          >
            Create an account
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
