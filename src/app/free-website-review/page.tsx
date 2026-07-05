import type { Metadata } from "next";
import { Shield, Clock, Zap, Star } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

export const metadata: Metadata = {
  title: "Free Website Review",
  description:
    "Get a free, no-obligation review of your trades website. Find out what's costing you customers and how to fix it. Results within 24 hours.",
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
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="font-[family-name:var(--font-sora)] font-semibold text-white text-[15px]">
                No obligation
              </p>
              <p className="text-[#9AA3AF] text-sm">
                Completely free, no strings attached
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-[#40E0FF]/10 border border-[#40E0FF]/20 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-[#40E0FF]" />
            </div>
            <div>
              <p className="font-[family-name:var(--font-sora)] font-semibold text-white text-[15px]">
                Takes 2 minutes
              </p>
              <p className="text-[#9AA3AF] text-sm">
                Fill in the form and we do the rest
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <div>
              <p className="font-[family-name:var(--font-sora)] font-semibold text-white text-[15px]">
                Results within 24 hours
              </p>
              <p className="text-[#9AA3AF] text-sm">
                Actionable recommendations, fast
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="bg-[#0B0D10]/80 border border-[#40E0FF]/20 rounded-2xl p-10 sm:p-14 shadow-[0_0_60px_rgba(64,224,255,0.06)] mb-16">
          <div className="text-center mb-8">
            <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white mb-3">
              Get your free review
            </h2>
            <p className="text-[#9AA3AF] max-w-lg mx-auto">
              Tell us about your business and we&apos;ll send you a personalised
              report on how your website is performing.
            </p>
          </div>
          <LeadCaptureForm />
        </section>

        {/* Social Proof Strip */}
        <section className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#40E0FF]/30 to-[#40E0FF]/10 border-2 border-[#0B0D10] flex items-center justify-center"
                  >
                    <span className="text-[#40E0FF] text-xs font-bold">
                      {["JM", "KL", "DP", "RS"][i - 1]}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-[family-name:var(--font-sora)] font-semibold text-sm">
                  Trusted by tradespeople across the South West
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]"
                    />
                  ))}
                  <span className="text-[#9AA3AF] text-xs ml-1">
                    5.0 average rating
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-8 text-center">
              <div>
                <div className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#40E0FF]">
                  50+
                </div>
                <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider uppercase text-[#6B7280]">
                  Reviews done
                </div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#40E0FF]">
                  24hrs
                </div>
                <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider uppercase text-[#6B7280]">
                  Avg. turnaround
                </div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#40E0FF]">
                  100%
                </div>
                <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider uppercase text-[#6B7280]">
                  Free, always
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
