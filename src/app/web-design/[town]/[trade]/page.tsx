import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { trades } from "@/data/trades";
import { towns, townPlace } from "@/data/towns";
import { AreaServiceSchema, BreadcrumbSchema, FAQPageSchema } from "@/components/seo/JsonLd";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

interface TradeTownPageProps {
  params: Promise<{ town: string; trade: string }>;
}

export async function generateStaticParams() {
  const params: { town: string; trade: string }[] = [];
  for (const town of towns) {
    for (const trade of trades) {
      params.push({ town: town.slug, trade: trade.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: TradeTownPageProps): Promise<Metadata> {
  const { town: townSlug, trade: tradeSlug } = await params;
  const town = towns.find((t) => t.slug === townSlug);
  const trade = trades.find((t) => t.slug === tradeSlug);
  if (!town || !trade) return {};

  return {
    title: `Web Design for ${trade.pluralName} in ${town.displayName}`,
    description: `Professional websites for ${trade.pluralName.toLowerCase()} in ${townPlace(town)}. Get found on Google, win more local ${trade.displayName.toLowerCase()} jobs. Free website design, hosting £50/mo + VAT.`,
    openGraph: {
      title: `Web Design for ${trade.pluralName} in ${town.displayName} | WebMinor`,
      description: `Get a website that brings in ${trade.displayName.toLowerCase()} work in ${town.displayName}. Rank on Google. Win more local jobs.`,
      url: `https://www.webminor.co.uk/web-design/${town.slug}/${trade.slug}`,
    },
    other: {
      "geo.region": `GB-${town.region}`,
      "geo.placename": town.displayName,
    },
  };
}

export default async function TradeTownPage({ params }: TradeTownPageProps) {
  const { town: townSlug, trade: tradeSlug } = await params;
  const town = towns.find((t) => t.slug === townSlug);
  const trade = trades.find((t) => t.slug === tradeSlug);
  if (!town || !trade) return null;

  const introText = trade.introTemplate
    .replace(/{town}/g, town.displayName)
    .replace(/{trade}/g, trade.pluralName.toLowerCase());

  const nearbyTownData = town.nearbyTowns
    .map((slug) => towns.find((t) => t.slug === slug))
    .filter(Boolean);

  const otherTrades = trades.filter((t) => t.slug !== trade.slug);

  return (
    <main className="px-6 pt-28 pb-20">
      <AreaServiceSchema
        name={`Web design for ${trade.pluralName.toLowerCase()} in ${town.displayName}`}
        description={`Web design for ${trade.pluralName.toLowerCase()} in ${townPlace(town)}`}
        path={`/web-design/${town.slug}/${trade.slug}`}
        city={town.displayName}
        county={town.county}
      />
      <FAQPageSchema faqs={trade.faq} />
      <BreadcrumbSchema
        trail={[
          { name: "Web Design", path: "/services/web-design" },
          { name: town.displayName, path: `/web-design/${town.slug}` },
          { name: trade.pluralName, path: `/web-design/${town.slug}/${trade.slug}` },
        ]}
      />

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-[#40E0FF]/10 border border-[#40E0FF]/20 rounded-full px-4 py-1.5 mb-6">
          <MapPin className="w-4 h-4 text-[#40E0FF]" />
          <span className="font-[family-name:var(--font-mono)] text-xs font-bold tracking-wider uppercase text-[#40E0FF]">
            {trade.pluralName} in {townPlace(town)}
          </span>
        </div>
        <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl font-bold text-white mb-6">
          Web Design for{" "}
          <span className="text-[#40E0FF]">{trade.pluralName}</span> in{" "}
          {town.displayName}
        </h1>
        <p className="text-lg text-[#9AA3AF] max-w-3xl mx-auto leading-relaxed">
          {introText}
        </p>
      </section>

      {/* Pain Points */}
      <section className="max-w-4xl mx-auto mb-20">
        <div className="text-center mb-10">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            — Sound Familiar?
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white">
            Problems {trade.pluralName.toLowerCase()} in{" "}
            {town.displayName}{" "}
            <span className="text-[#40E0FF]">keep telling us about</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trade.painPoints.map((point, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-6"
            >
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-[#9AA3AF] text-[16px] leading-relaxed">
                {point}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Outcomes */}
      <section className="max-w-4xl mx-auto mb-20">
        <div className="text-center mb-10">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            — What We Deliver
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white">
            What your website will{" "}
            <span className="text-[#40E0FF]">actually do</span> for you
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trade.outcomes.map((outcome, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-6"
            >
              <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-[#9AA3AF] text-[16px] leading-relaxed">
                {outcome}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Lead Capture */}
      <section className="max-w-4xl mx-auto bg-[#0B0D10]/80 border border-[#40E0FF]/20 rounded-2xl p-10 sm:p-14 shadow-[0_0_60px_rgba(64,224,255,0.06)] mb-20">
        <div className="text-center mb-8">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            — Get Started
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready for a website that{" "}
            <span className="text-[#40E0FF]">actually works?</span>
          </h2>
          <p className="text-[#9AA3AF] max-w-xl mx-auto">
            Get a free review of your current site and find out how we
            can help you win more {trade.displayName.toLowerCase()} work
            in {town.displayName}.
          </p>
        </div>
        <LeadCaptureForm
          prefilledTrade={trade.slug}
          prefilledTown={town.slug}
        />
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto mb-20">
        <div className="text-center mb-10">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            — FAQ
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white">
            Common questions from{" "}
            <span className="text-[#40E0FF]">
              {trade.pluralName.toLowerCase()}
            </span>
          </h2>
        </div>
        <div className="space-y-3">
          {trade.faq.map((item, i) => (
            <details
              key={i}
              className="group bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl overflow-hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer p-6 list-none">
                <span className="font-[family-name:var(--font-sora)] text-[16px] font-semibold text-white pr-4">
                  {item.question}
                </span>
                <ChevronDown className="w-5 h-5 text-[#9AA3AF] shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-6">
                <p className="text-[#9AA3AF] text-[16px] leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Internal Links — Other Trades */}
      <section className="max-w-4xl mx-auto mb-16">
        <div className="text-center mb-8">
          <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white">
            Other trades in{" "}
            <span className="text-[#40E0FF]">{town.displayName}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {otherTrades.map((otherTrade) => (
            <Link
              key={otherTrade.slug}
              href={`/web-design/${town.slug}/${otherTrade.slug}`}
              className="group flex items-center justify-between bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-5 transition-all hover:border-[#40E0FF]/30"
            >
              <span className="font-[family-name:var(--font-sora)] text-[16px] font-medium text-white group-hover:text-[#40E0FF] transition-colors">
                {otherTrade.pluralName} in {town.displayName}
              </span>
              <ArrowRight className="w-4 h-4 text-[#9AA3AF] group-hover:text-[#40E0FF] transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* Internal Links — Same Trade, Nearby Towns */}
      {nearbyTownData.length > 0 && (
        <section className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white">
              {trade.pluralName} in{" "}
              <span className="text-[#40E0FF]">nearby towns</span>
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {nearbyTownData.map(
              (nearbyTown) =>
                nearbyTown && (
                  <Link
                    key={nearbyTown.slug}
                    href={`/web-design/${nearbyTown.slug}/${trade.slug}`}
                    className="inline-flex items-center gap-2 bg-[#0B0D10]/80 border border-white/[0.07] rounded-full px-5 py-2.5 text-[#9AA3AF] hover:text-[#40E0FF] hover:border-[#40E0FF]/30 transition-all"
                  >
                    <MapPin className="w-4 h-4" />
                    <span className="font-[family-name:var(--font-sora)] text-sm font-medium">
                      {trade.pluralName} in {nearbyTown.displayName}
                    </span>
                  </Link>
                )
            )}
          </div>
        </section>
      )}
    </main>
  );
}
