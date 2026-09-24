import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { PageFrame } from "@/components/layout/page-frame";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Review the rules, creator agreements, and conditions for using the LivZo live streaming platform.",
};

export default function TermsPage() {
  return (
    <PageFrame>
      <main className="mx-auto w-full max-w-4xl px-[clamp(16px,4vw,48px)] py-12 sm:py-16">
        <div className="flex items-center gap-3 text-cyan-300">
          <FileText className="size-5" />
          <span className="text-sm font-medium uppercase tracking-wider">User Agreement</span>
        </div>
        <h1 className="mt-3 text-[clamp(32px,3vw,48px)] font-bold tracking-tight text-white">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-zinc-400">Last updated: September 2026</p>

        <div className="mt-10 space-y-8 text-zinc-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p className="text-zinc-400">
              By accessing or using LivZo, you agree to comply with and be bound by these Terms of Service.
              If you do not agree to these terms, please do not access or use our platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. Creator Conduct & Community Guidelines</h2>
            <p className="text-zinc-400">
              Creators must maintain respectful and safe live rooms. Unlawful conduct, harassment, hate speech,
              copyright infringement, and non-consensual content are strictly prohibited and will result in
              immediate suspension or permanent termination of your broadcast privileges.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Virtual Gifting & Creator Earnings</h2>
            <p className="text-zinc-400">
              Virtual gifts purchased and sent within LivZo live rooms represent discretionary digital appreciation.
              All transactions are final, non-refundable, and subject to platform revenue splits as detailed in the
              Creator Monetization Policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Account Termination</h2>
            <p className="text-zinc-400">
              LivZo reserves the right to suspend or terminate accounts that violate our security policies or
              attempt unauthorized penetration, token manipulation, or abuse of the streaming infrastructure.
            </p>
          </section>
        </div>
      </main>
    </PageFrame>
  );
}
