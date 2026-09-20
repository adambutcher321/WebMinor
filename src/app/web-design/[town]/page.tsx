import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Wrench } from "lucide-react";
import { trades } from "@/data/trades";
import { towns, townPlace, townDescriptor } from "@/data/towns";
import { AreaServiceSchema, BreadcrumbSchema } from "@/components/seo/JsonLd";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

interface TownPageProps {
  params: Promise<{ town: string }>;
}

// Only the towns in the data file exist; anything else is a real 404.
export const dynamicParams = false;

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
    title: `Web Design in ${town.displayName}`,
    description: `Free website design for local businesses in ${townPlace(town)}. Hosting £50/mo + VAT, local SEO and Google Business Profile set-up from WebMinor${town.slug === "saltash" ? "" : " in Saltash"}.`,
    openGraph: {
      title: `Web Design in ${town.displayName} | WebMinor`,
      description: `Free website design for local businesses in ${town.displayName}. Hosting £50/mo + VAT.`,
      url: `https://www.webminor.co.uk/web-design/${town.slug}`,
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

  return (
    <main className="px-6 pt-28 pb-20">
      <AreaServiceSchema
        name={`Web design in ${town.displayName}`}
        description={`Website design, local SEO and Google Business Profile set-up for local businesses in ${townPlace(town)}`}
        path={`/web-design/${town.slug}`}
        city={town.displayName}
        county={town.county}
      />
      <BreadcrumbSchema
        trail={[
          { name: "Web Design", path: "/services/web-design" },
          { name: town.displayName, path: `/web-design/${town.slug}` },
        ]}
      />

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-[#40E0FF]/10 border border-[#40E0FF]/20 rounded-full px-4 py-1.5 mb-6">
          <MapPin className="w-4 h-4 text-[#40E0FF]" />
          <span className="font-[family-name:var(--font-mono)] text-xs font-bold tracking-wider uppercase text-[#40E0FF]">
            {townPlace(town)}
          </span>
        </div>
        <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl font-bold text-white mb-6">
          Web design in{" "}
          <span className="text-[#40E0FF]">{town.displayName}</span>
        </h1>
        <p className="text-lg text-[#9AA3AF] max-w-3xl mx-auto leading-relaxed">
          {town.displayName} is {townDescriptor(town)}. WebMinor designs
          websites free for businesses here, with hosting at £50 a month plus
          VAT, and your home page is sent to you as a private link before
          the rest is built.
        </p>
      </section>

      {/* Trade Cards */}
      <section className="max-w-5xl mx-auto mb-20">
        <div className="text-center mb-10">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            — Who it&apos;s for
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white">
            Websites for{" "}
            <span className="text-[#40E0FF]">{town.displayName}</span>{" "}
            businesses
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {trades.map((trade) => (
            <div
              key={trade.slug}
              className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-8"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-2xl bg-[#40E0FF]/10 border border-[#40E0FF]/20 text-[#40E0FF]">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-[family-name:var(--font-sora)] text-xl font-bold text-white mb-2">
                {trade.pluralName}
              </h3>
              <p className="text-[#9AA3AF] text-[16px] leading-relaxed">
                {trade.tagline}.
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-[#9AA3AF] text-[16px]">
          Not a trade? The same offer stands for shops, cafés, salons and
          anyone else in {town.displayName} with customers nearby.
        </p>
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
