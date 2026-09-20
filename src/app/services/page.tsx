import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Monitor, Search, MapPin, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";
import { services } from "@/data/services";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web design, local SEO, Google Business Profile setup and lead generation services for tradespeople across the South West. Everything you need to get found and win more local jobs.",
};

const iconMap: Record<string, React.ReactNode> = {
  Monitor: <Monitor className="w-8 h-8" />,
  Search: <Search className="w-8 h-8" />,
  MapPin: <MapPin className="w-8 h-8" />,
  TrendingUp: <TrendingUp className="w-8 h-8" />,
};

const slugToRoute: Record<string, string> = {
  "web-design-for-trades": "web-design",
  "local-seo": "local-seo",
  "google-business-profile": "google-business-profile",
  "lead-generation-ppc": "lead-generation",
};

export default function ServicesPage() {
  return (
    <main className="pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden mb-20">
        <div className="relative h-[46vh] min-h-[340px] max-h-[560px] w-full">
          <Image
            src="/world/services-hero.webp"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/60 to-[#0B0D10]/10" />
        </div>
        <div className="relative -mt-24 px-6 text-center max-w-6xl mx-auto">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-4">
            — Our Services
          </p>
          <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white mb-6 whitespace-normal lg:whitespace-nowrap">
            A website, and the{" "}
            <span className="text-[#40E0FF]">customers to go with it</span>
          </h1>
          <p className="text-lg text-[#9AA3AF] max-w-2xl mx-auto leading-relaxed">
            The website design is free. Local SEO, a Google Business Profile
            and Google Ads are there for when you want more people in
            Cornwall and Devon to find it.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {services.map((service) => (
          <div
            key={service.slug}
            className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-8 flex flex-col"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#40E0FF]/10 border border-[#40E0FF]/20 flex items-center justify-center text-[#40E0FF] mb-6">
              {iconMap[service.icon]}
            </div>

            <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-white mb-3">
              {service.name}
            </h2>

            <p className="text-[#9AA3AF] text-[16px] leading-relaxed mb-6">
              {service.shortDescription}
            </p>

            <ul className="space-y-3 mb-8 flex-1">
              {service.features.slice(0, 4).map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#40E0FF] shrink-0 mt-0.5" />
                  <span className="text-[#9AA3AF] text-sm leading-relaxed">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={`/services/${slugToRoute[service.slug]}`}
              className="inline-flex items-center gap-2 text-[#40E0FF] font-[family-name:var(--font-sora)] font-semibold text-sm hover:gap-3 transition-all"
            >
              Learn more
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </section>

      {/* Lead Capture */}
      <section className="px-6 max-w-4xl mx-auto bg-[#0B0D10]/80 border border-[#40E0FF]/20 rounded-2xl p-10 sm:p-14 shadow-[0_0_60px_rgba(64,224,255,0.06)]">
        <div className="text-center mb-8">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            — Free Website Review
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold text-white mb-4">
            Not sure where to start?{" "}
            <span className="text-[#40E0FF]">Let us take a look.</span>
          </h2>
          <p className="text-[#9AA3AF] max-w-xl mx-auto">
            Tell us a bit about your business and we&apos;ll send you a free,
            no-obligation review with clear recommendations.
          </p>
        </div>
        <LeadCaptureForm />
      </section>
    </main>
  );
}
