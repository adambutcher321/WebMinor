import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { caseStudies } from "@/data/case-studies";

export const metadata: Metadata = {
  title: "Case Studies — Real Results for Real Tradespeople",
  description:
    "See how WebMinor has helped plumbers, electricians, builders, and other tradespeople get more local work through better websites and local SEO.",
};

const tradeBadgeColours: Record<string, string> = {
  plumbers: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  electricians: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  builders: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  roofers: "bg-red-500/10 text-red-400 border-red-500/20",
  landscapers: "bg-green-500/10 text-green-400 border-green-500/20",
};

function tradeBadge(trade: string) {
  const colours = tradeBadgeColours[trade] ?? "bg-white/5 text-white/60 border-white/10";
  const label = trade.charAt(0).toUpperCase() + trade.slice(1);
  return (
    <span
      className={`inline-block font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border ${colours}`}
    >
      {label}
    </span>
  );
}

export default function CaseStudiesPage() {
  return (
    <main className="px-6 pt-28 pb-20">
      {/* Hero */}
      <section className="max-w-5xl mx-auto text-center mb-16">
        <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-4">
          — Case Studies
        </p>
        <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl font-bold text-white mb-6">
          Real results for{" "}
          <span className="text-[#40E0FF]">real tradespeople</span>
        </h1>
        <p className="text-lg text-[#9AA3AF] max-w-2xl mx-auto leading-relaxed">
          Don&apos;t just take our word for it. Here&apos;s what happened when
          tradespeople like you partnered with WebMinor.
        </p>
      </section>

      {/* Card Grid */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {caseStudies.map((cs) => (
          <Link
            key={cs.slug}
            href={`/case-studies/${cs.slug}`}
            className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-8 flex flex-col transition-colors hover:border-[#40E0FF]/30 group"
          >
            {/* Trade badge */}
            <div className="mb-4">{tradeBadge(cs.trade)}</div>

            {/* Client name */}
            <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold text-white mb-3">
              {cs.clientName}
            </h2>

            {/* Problem summary */}
            <p className="text-[#9AA3AF] text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
              {cs.problem}
            </p>

            {/* Headline stat */}
            {cs.stats[0] && (
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg p-4 mb-6">
                <p className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#40E0FF]">
                  {cs.stats[0].value}
                </p>
                <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-wider uppercase text-white/50 mt-1">
                  {cs.stats[0].label}
                </p>
              </div>
            )}

            {/* Read more */}
            <span className="flex items-center gap-2 text-[#40E0FF] text-sm font-[family-name:var(--font-sora)] font-semibold group-hover:gap-3 transition-all">
              Read more <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
