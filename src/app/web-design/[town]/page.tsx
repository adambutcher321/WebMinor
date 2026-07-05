import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Wrench } from "lucide-react";
import { trades } from "@/data/trades";
import { towns } from "@/data/towns";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

interface TownPageProps {
  params: Promise<{ town: string }>;
}

export async function generateStaticParams() {
  return towns.map((town) => ({ town: town.slug }));
}

export async function generateMetadata({
  params,
}: TownPageProps): Promise<Metadata> {
  const { town: townSlug } = await params;
  const town = towns.find((t) => t.slug === townSlug);
  if (!town) return {};

  return {
    title: `Web Design for Trades in ${town.displayName}`,
    description: `Professional websites for plumbers, electricians, roofers and builders in ${town.displayName}, ${town.county}. Get found on Google and win more local work. From £49/mo.`,
    openGraph: {
      title: `Web Design for Trades in ${town.displayName} | WebMinor`,
      description: `Professional websites for tradespeople in ${town.displayName}. Get found on Google and win more local jobs.`,
      url: `https://webminor.com/web-design/${town.slug}`,
    },
  };
}

export default async function TownPage({ params }: TownPageProps) {
  const { town: townSlug } = await params;
  const town = towns.find((t) => t.slug === townSlug);
  if (!town) return null;

  const nearbyTownData = town.nearbyTowns
    .map((slug) => towns.find((t) => t.slug === slug))
    .filter(Boolean);

  const tradeIcons: Record<string, string> = {
    plumbers: "Droplets",
    electricians: "Zap",
    roofers: "Home",
    builders: "Hammer",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "WebMinor",
    description: `Web design services for tradespeople in ${town.displayName}, ${town.county}`,
    url: `https://webminor.com/web-design/${town.slug}`,
    areaServed: {
      "@type": "City",
      name: town.displayName,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: town.county,
      },
    },
    provider: {
      "@type": "Organization",
      name: "WebMinor",
      url: "https://webminor.com",
    },
  };

  return (
    <main className="px-6 pt-28 pb-20">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-[#40E0FF]/10 border border-[#40E0FF]/20 rounded-full px-4 py-1.5 mb-6">
          <MapPin className="w-4 h-4 text-[#40E0FF]" />
          <span className="font-[family-name:var(--font-mono)] text-xs font-bold tracking-wider uppercase text-[#40E0FF]">
            {town.displayName}, {town.county}
          </span>
        </div>
        <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl font-bold text-white mb-6">
          Web Design for Trades in{" "}
          <span className="text-[#40E0FF]">{town.displayName}</span>
        </h1>
        <p className="text-lg text-[#9AA3AF] max-w-3xl mx-auto leading-relaxed">
          {town.displayName} is {town.populationDescriptor} in{" "}
          {town.county} — and local tradespeople here need a website
          that works as hard as they do. We build fast, professional
          websites that help plumbers, electricians, roofers and builders
          in {town.displayName} get found on Google and win more local
          work.
        </p>
      </section>

      {/* Trade Cards */}
      <section className="max-w-5xl mx-auto mb-20">
        <div className="text-center mb-10">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            — Choose Your Trade
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white">
            Websites built for{" "}
            <span className="text-[#40E0FF]">{town.displayName}</span>{" "}
            tradespeople
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {trades.map((trade) => (
            <Link
              key={trade.slug}
              href={`/web-design/${town.slug}/${trade.slug}`}
              className="group bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-8 transition-all hover:border-[#40E0FF]/30 hover:shadow-[0_0_40px_rgba(64,224,255,0.06)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#40E0FF]/10 border border-[#40E0FF]/20 text-[#40E0FF]">
                  <Wrench className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-[#9AA3AF] group-hover:text-[#40E0FF] transition-colors" />
              </div>
              <h3 className="font-[family-name:var(--font-sora)] text-xl font-bold text-white mb-2">
                Web Design for {trade.pluralName}
              </h3>
              <p className="text-[#9AA3AF] text-[15px] leading-relaxed mb-4">
                {trade.tagline}. Get a professional website that helps{" "}
                {trade.pluralName.toLowerCase()} in {town.displayName}{" "}
                stand out on Google.
              </p>
              <span className="font-[family-name:var(--font-mono)] text-xs font-bold tracking-wider uppercase text-[#40E0FF] group-hover:underline">
                Learn more
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Nearby Towns */}
      {nearbyTownData.length > 0 && (
        <section className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-8">
            <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white">
              Also serving{" "}
              <span className="text-[#40E0FF]">nearby towns</span>
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {nearbyTownData.map(
              (nearbyTown) =>
                nearbyTown && (
                  <Link
                    key={nearbyTown.slug}
                    href={`/web-design/${nearbyTown.slug}`}
                    className="inline-flex items-center gap-2 bg-[#0B0D10]/80 border border-white/[0.07] rounded-full px-5 py-2.5 text-[#9AA3AF] hover:text-[#40E0FF] hover:border-[#40E0FF]/30 transition-all"
                  >
                    <MapPin className="w-4 h-4" />
                    <span className="font-[family-name:var(--font-sora)] text-sm font-medium">
                      Web Design in {nearbyTown.displayName}
                    </span>
                  </Link>
                )
            )}
          </div>
        </section>
      )}

      {/* Lead Capture */}
      <section className="max-w-4xl mx-auto bg-[#0B0D10]/80 border border-[#40E0FF]/20 rounded-2xl p-10 sm:p-14 shadow-[0_0_60px_rgba(64,224,255,0.06)]">
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
            can help you win more work in {town.displayName}.
          </p>
        </div>
        <LeadCaptureForm prefilledTown={town.slug} />
      </section>
    </main>
  );
}
