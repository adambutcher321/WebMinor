import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LeadMagnet() {
  return (
    <section className="relative z-10 px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="relative bg-[#0B0D10]/80 border border-[#40E0FF]/20 rounded-2xl p-8 sm:p-12 text-center shadow-[0_0_60px_rgba(64,224,255,0.06)]">
          {/* Headline */}
          <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-4">
            Not sure if your website is costing you customers?
          </h2>

          {/* Subtext */}
          <p className="text-[#9AA3AF] text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
            Get a free, no-obligation review of your current website.
            We&apos;ll show you exactly what&apos;s working and what&apos;s
            losing you leads.
          </p>

          {/* CTA button */}
          <Link
            href="/free-website-review"
            className="inline-flex items-center gap-2 bg-[#40E0FF] hover:bg-[#2BC4E0] text-[#0B0D10] font-[family-name:var(--font-sora)] font-bold text-base px-8 py-4 rounded-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(64,224,255,0.4)]"
          >
            Get my free website review
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* Secondary reassurance */}
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-wider text-[#6B7280] mt-6">
            Takes 2 minutes &middot; No obligation &middot; Results within 24
            hours
          </p>
        </div>
      </div>
    </section>
  );
}
