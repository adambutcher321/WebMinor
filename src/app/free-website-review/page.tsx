import type { Metadata } from "next";
import { Shield, Clock, Zap } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

export const metadata: Metadata = {
  title: "Free Website Review",
  description:
    "Get a free, no-obligation review of your trades website. Find out what's costing you customers and how to fix it. We'll come back to you within one working day.",
};

export default function FreeWebsiteReviewPage() {
  return (
    <main className="px-6 pt-28 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <section className="text-center mb-16">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-4">
            — Free Website Review
          </p>
          <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Find out why your competitors are getting the{" "}
            <span className="text-[#40E0FF]">calls you&apos;re missing</span>
          </h1>
          <p className="text-lg text-[#9AA3AF] max-w-2xl mx-auto leading-relaxed">
            We&apos;ll review your current website and tell you exactly
            what&apos;s working, what&apos;s not, and what you need to do to
            start getting more enquiries.
          </p>
        </section>

        {/* Trust Bullets */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="flex items-center gap-4 bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="font-[family-name:var(--font-sora)] font-semibold text-white text-[16px]">
                No obligation
              </p>
              <p className="text-[#9AA3AF] text-[16px]">
                Completely free, no strings attached
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-6">
            <div className="w-12 h-12 rounded-2xl bg-[#40E0FF]/10 border border-[#40E0FF]/20 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-[#40E0FF]" />
            </div>
            <div>
              <p className="font-[family-name:var(--font-sora)] font-semibold text-white text-[16px]">
                Takes 2 minutes
              </p>
              <p className="text-[#9AA3AF] text-[16px]">
                Six boxes, then we do the looking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-6">
            <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div>
              <p className="font-[family-name:var(--font-sora)] font-semibold text-white text-[16px]">
                Back within a working day
              </p>
              <p className="text-[#9AA3AF] text-[16px]">
                A call or email with what we&apos;d fix first
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="bg-[#0B0D10]/80 border border-[#40E0FF]/20 rounded-2xl p-6 sm:p-14 shadow-[0_0_60px_rgba(64,224,255,0.06)]">
          <div className="text-center mb-8">
            <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white mb-3">
              Get your free review
            </h2>
            <p className="text-[#9AA3AF] max-w-lg mx-auto">
              Tell us who you are and where your site lives. No website yet?
              Leave that box empty and we&apos;ll look at how you show up on
              Google instead.
            </p>
          </div>
          <LeadCaptureForm />
        </section>
      </div>
    </main>
  );
}
