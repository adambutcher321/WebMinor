import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { pricingTiers } from "@/data/pricing";

export default function PricingTeaser() {
  return (
    <section className="relative z-10 py-24 px-6" data-animate-card data-tilt>
      <div className="max-w-5xl mx-auto bg-[rgba(11,13,16,0.82)] border border-white/[0.07] rounded-2xl p-10 sm:p-14">
        {/* Header */}
        <div className="mb-14">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            &mdash; Pricing
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Transparent pricing,{" "}
            <span className="text-[#40E0FF]">no surprises</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-stagger-children>
          {pricingTiers.map((tier) => (
            <div
              key={tier.slug}
              className={`relative bg-[rgba(11,13,16,0.82)] rounded-2xl p-8 flex flex-col ${
                tier.highlighted
                  ? "border-2 border-[#40E0FF]/60"
                  : "border border-white/[0.07]"
              }`}
            >
              {/* Most Popular badge */}
              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-[#40E0FF] text-[#0B0D10] font-[family-name:var(--font-mono)] text-[10px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier name */}
              <h3 className="font-[family-name:var(--font-mono)] text-xs font-bold tracking-wider uppercase text-[#9AA3AF] mb-4">
                {tier.name}
              </h3>

              {/* Price */}
              <div className="mb-1">
                <span className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl font-bold text-white">
                  &pound;{tier.monthlyFee}
                </span>
                <span className="text-[#6B7280] text-sm ml-1">/mo</span>
              </div>

              {/* Setup fee */}
              <p className="text-sm text-[#6B7280] mb-6">
                {tier.setupFee === 0
                  ? "No setup fee"
                  : `£${tier.setupFee} one-off setup`}
              </p>

              {/* Features (top 4) */}
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#40E0FF] mt-0.5 shrink-0" />
                    <span className="font-[family-name:var(--font-inter)] text-sm text-[#9AA3AF] leading-snug">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <Link
                href="/pricing"
                className={`inline-flex items-center justify-center gap-2 font-[family-name:var(--font-sora)] font-bold text-sm px-6 py-3.5 rounded-lg transition-all ${
                  tier.highlighted
                    ? "bg-[#40E0FF] hover:bg-[#2BC4E0] text-[#0B0D10] hover:scale-105 hover:shadow-[0_0_40px_rgba(64,224,255,0.4)]"
                    : "border border-white/20 hover:border-white/40 text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                {tier.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Full pricing link */}
        <div className="text-center mt-10">
          <Link
            href="/pricing"
            className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] hover:text-[#2BC4E0] tracking-wider uppercase transition-colors inline-flex items-center gap-2"
          >
            View full pricing details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
