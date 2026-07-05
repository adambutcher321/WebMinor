import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import HeroLetterFall from "@/components/sections/HeroLetterFall";
import ProofStrip from "@/components/sections/ProofStrip";
import ServiceCards from "@/components/sections/ServiceCards";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import PricingTeaser from "@/components/sections/PricingTeaser";
import CaseStudyGrid from "@/components/sections/CaseStudyGrid";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import TestimonialCards from "@/components/sections/TestimonialCards";
import FAQ from "@/components/sections/FAQ";
import LeadMagnet from "@/components/sections/LeadMagnet";
import TownTradeLinks from "@/components/sections/TownTradeLinks";
import LogoTicker from "@/components/sections/LogoTicker";
import { OrganizationSchema, SpeakableSchema } from "@/components/seo/JsonLd";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Proof badge */}
          <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-full px-4 py-1.5 mb-8">
            <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
            <span className="font-[family-name:var(--font-mono)] text-xs font-bold tracking-wider uppercase text-[#F59E0B]">
              25+ Years Experience
            </span>
          </div>

          {/* Headline with letter-fall on scroll */}
          <HeroLetterFall
            lines={[
              { text: "Websites that get", className: "text-white" },
              { text: "South West tradespeople", className: "text-white" },
              { text: "more local jobs", className: "text-[#40E0FF]" },
            ]}
          />

          {/* Subhead */}
          <p className="text-lg sm:text-xl text-[#9AA3AF] max-w-2xl mx-auto mb-10 leading-relaxed">
            Fast, conversion-focused websites for plumbers, electricians, roofers and builders.
            Transparent pricing. Delivered in days, not months.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/free-website-review"
              className="inline-flex items-center gap-2 bg-[#40E0FF] hover:bg-[#2BC4E0] text-[#0B0D10] font-[family-name:var(--font-sora)] font-bold text-base px-8 py-4 rounded-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(64,224,255,0.4)]"
            >
              Get my free website review
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-[family-name:var(--font-sora)] font-bold text-base px-8 py-4 rounded-lg transition-all hover:bg-white/5"
            >
              See pricing
            </Link>
          </div>

          {/* Proof stats */}
          <div className="flex justify-center gap-8 sm:gap-12 mt-16 pt-8 border-t border-white/5">
            <div className="text-center">
              <div className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-[#40E0FF]">[EDIT: 50]+</div>
              <div className="font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase text-[#6B7280] mt-1">Sites Built</div>
            </div>
            <div className="text-center">
              <div className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-[#40E0FF]">5★</div>
              <div className="font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase text-[#6B7280] mt-1">Rated</div>
            </div>
            <div className="text-center">
              <div className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-[#40E0FF]">5 Day</div>
              <div className="font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase text-[#6B7280] mt-1">Delivery</div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] uppercase text-[#40E0FF]/40">
            Scroll to explore
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-[#40E0FF]/50 to-transparent animate-bounce" />
        </div>
      </section>

      {/* SEO: Organization + Speakable schema */}
      <OrganizationSchema />
      <SpeakableSchema url="https://webminor.com" cssSelectors={['h1', '.hero-sub']} />

      {/* Proof Strip */}
      <ProofStrip />

      {/* Tech Logo Ticker */}
      <LogoTicker />

      {/* Content sections */}
      <div className="relative z-10 space-y-16 px-6 py-20">

        {/* Services */}
        <ServiceCards />

        {/* Why Choose Us */}
        <section className="max-w-5xl mx-auto">
          <WhyChooseUs />
        </section>

        {/* Pricing Teaser */}
        <PricingTeaser />

        {/* Case Studies */}
        <CaseStudyGrid />

        {/* Lead Magnet CTA */}
        <section data-animate-card data-tilt className="max-w-4xl mx-auto bg-[#0B0D10]/80 border border-[#40E0FF]/20 rounded-2xl p-10 sm:p-14 shadow-[0_0_60px_rgba(64,224,255,0.06)]">
          <div className="text-center mb-8">
            <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
              — Free Website Review
            </p>
            <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold text-white mb-4">
              Not sure if your website is{' '}
              <span className="text-[#40E0FF]">costing you customers?</span>
            </h2>
            <p className="text-[#9AA3AF] max-w-xl mx-auto">
              Get a free, no-obligation review of your current website. We&apos;ll show you exactly
              what&apos;s working and what&apos;s losing you leads.
            </p>
          </div>
          <LeadCaptureForm />
          <p className="text-center text-[#6B7280] text-sm mt-4">
            Takes 2 minutes · No obligation · Results within 24 hours
          </p>
        </section>

        {/* Testimonials */}
        <TestimonialCards />

        {/* Town × Trade SEO Links */}
        <TownTradeLinks />

        {/* FAQ */}
        <FAQ />

        {/* Final CTA */}
        <LeadMagnet />

      </div>
    </main>
  );
}
