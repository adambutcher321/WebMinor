import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { services } from "@/data/services";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import { ServiceSchema } from "@/components/seo/JsonLd";

const service = services.find((s) => s.slug === "google-business-profile")!;

export const metadata: Metadata = {
  title: service.name,
  description: service.shortDescription,
};

export default function GoogleBusinessProfilePage() {
  return (
    <main className="pb-20">
      <ServiceSchema
        name={service.name}
        description={service.shortDescription}
        url="https://webminor.com/services/google-business-profile"
      />
      {/* Hero */}
      <section className="relative overflow-hidden mb-16">
        <div className="relative h-[42vh] min-h-[300px] max-h-[480px] w-full">
          <Image src="/world/svc-google-business-profile-hero.webp" alt="" fill priority className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/60 to-[#0B0D10]/10" />
        </div>
        <div className="relative -mt-20 px-6 text-center max-w-4xl mx-auto">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-4">
            — Our Services
          </p>
          <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl font-bold text-white mb-6">
            {service.name}
          </h1>
          <p className="text-lg text-[#9AA3AF] max-w-3xl mx-auto leading-relaxed">
            {service.shortDescription}
          </p>
        </div>
      </section>

      {/* Long Description */}
      <section className="px-6 max-w-4xl mx-auto mb-16">
        <div className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-8 sm:p-12">
          <p className="text-[#9AA3AF] text-[16px] leading-relaxed">
            {service.longDescription}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 max-w-4xl mx-auto mb-20">
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
              <span className="text-[#9AA3AF] text-[16px] leading-relaxed">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Lead Capture */}
      <section className="px-6 max-w-4xl mx-auto bg-[#0B0D10]/80 border border-[#40E0FF]/20 rounded-2xl p-10 sm:p-14 shadow-[0_0_60px_rgba(64,224,255,0.06)]">
        <div className="text-center mb-8">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            — Get Started
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold text-white mb-4">
            Get on the{" "}
            <span className="text-[#40E0FF]">map</span>
          </h2>
          <p className="text-[#9AA3AF] max-w-xl mx-auto">
            We&apos;ll set up and optimise your Google Business Profile so
            customers in your area can find you and call you directly.
          </p>
        </div>
        <LeadCaptureForm />
      </section>
    </main>
  );
}
