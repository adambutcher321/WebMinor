import type { Metadata } from "next";
import { Search, CheckCircle } from "lucide-react";
import { services } from "@/data/services";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

const service = services.find((s) => s.slug === "local-seo")!;

export const metadata: Metadata = {
  title: service.name,
  description: service.shortDescription,
};

export default function LocalSeoPage() {
  return (
    <main className="px-6 pt-28 pb-20">
      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#40E0FF]/10 border border-[#40E0FF]/20 text-[#40E0FF] mb-6">
          <Search className="w-8 h-8" />
        </div>
        <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-4">
          — Our Services
        </p>
        <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl font-bold text-white mb-6">
          {service.name}
        </h1>
        <p className="text-lg text-[#9AA3AF] max-w-3xl mx-auto leading-relaxed">
          {service.shortDescription}
        </p>
      </section>

      {/* Long Description */}
      <section className="max-w-4xl mx-auto mb-16">
        <div className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-8 sm:p-12">
          <p className="text-[#9AA3AF] text-[16px] leading-relaxed">
            {service.longDescription}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto mb-20">
        <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
          What&apos;s <span className="text-[#40E0FF]">included</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {service.features.map((feature, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-6"
            >
              <CheckCircle className="w-6 h-6 text-[#40E0FF] shrink-0 mt-0.5" />
              <span className="text-[#9AA3AF] text-[15px] leading-relaxed">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Lead Capture */}
      <section className="max-w-4xl mx-auto bg-[#0B0D10]/80 border border-[#40E0FF]/20 rounded-2xl p-10 sm:p-14 shadow-[0_0_60px_rgba(64,224,255,0.06)]">
        <div className="text-center mb-8">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            — Get Started
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold text-white mb-4">
            Want to show up on{" "}
            <span className="text-[#40E0FF]">Google?</span>
          </h2>
          <p className="text-[#9AA3AF] max-w-xl mx-auto">
            Get a free review and we&apos;ll show you where you&apos;re ranking
            now and what it would take to get you to the top.
          </p>
        </div>
        <LeadCaptureForm />
      </section>
    </main>
  );
}
