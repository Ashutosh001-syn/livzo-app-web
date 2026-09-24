import type { Metadata } from "next";
import { Shield } from "lucide-react";
import { PageFrame } from "@/components/layout/page-frame";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how LivZo collects, protects, and manages your personal information and streaming data.",
};

export default function PrivacyPage() {
  return (
    <PageFrame>
      <main className="mx-auto w-full max-w-4xl px-[clamp(16px,4vw,48px)] py-12 sm:py-16">
        <div className="flex items-center gap-3 text-violet-300">
          <Shield className="size-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Legal & Trust</span>
        </div>
        <h1 className="mt-3 text-[clamp(32px,3vw,48px)] font-bold tracking-tight text-white">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-zinc-400">Last updated: September 2026</p>

        <div className="mt-10 space-y-8 text-zinc-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
            <p className="text-zinc-400">
              When you create an account on LivZo, we collect your email address, chosen handle,
              and display name. For creators, we also process broadcast metadata, stream analytics,
              and session statistics necessary to deliver low-latency live experiences.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. How We Protect Your Data</h2>
            <p className="text-zinc-400">
              Authentication credentials are protected using industry-standard hashing algorithms
              (bcrypt / Argon2id). Session authentication tokens are signed with cryptographic keys
              and delivered exclusively via HttpOnly, Secure cookies to guard against unauthorized access and XSS exploits.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Cookies & Session Storage</h2>
            <p className="text-zinc-400">
              LivZo uses strict essential cookies to authenticate your identity across pages and maintain
              your live session. We do not sell your personal data or user activity to third-party data brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Your Rights</h2>
            <p className="text-zinc-400">
              You have the right to access, update, or request deletion of your account at any time.
              You can modify your profile details directly from your LivZo account settings or contact our
              privacy team at <span className="text-violet-300">privacy@livzo.com</span>.
            </p>
          </section>
        </div>
      </main>
    </PageFrame>
  );
}
