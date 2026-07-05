import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { caseStudies } from "@/data/case-studies";
import { trades } from "@/data/trades";

export default function CaseStudyGrid() {
  return (
    <section className="relative z-10 px-6 py-20" data-animate-card data-tilt>
      <div className="max-w-6xl mx-auto bg-[rgba(11,13,16,0.82)] border border-white/[0.07] rounded-2xl p-10 sm:p-14">
        {/* Section header */}
        <div className="mb-12">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            — Results
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Real numbers from{" "}
            <span className="text-[#40E0FF]">real businesses</span>
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10" data-stagger-children>
          {caseStudies.map((study) => {
            const trade = trades.find((t) => t.slug === study.trade);
            const tradeName = trade?.pluralName ?? study.trade;
            const headlineStat = study.stats[0];

            return (
              <div
                key={study.slug}
                className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-6 flex flex-col"
              >
                {/* Trade badge */}
                <span className="inline-flex self-start items-center font-[family-name:var(--font-mono)] text-xs font-bold tracking-wider uppercase text-[#40E0FF] bg-[#40E0FF]/10 border border-[#40E0FF]/20 rounded-full px-3 py-1 mb-4">
                  {tradeName}
                </span>

                {/* Client name */}
                <p className="font-[family-name:var(--font-sora)] text-lg font-semibold text-white mb-2">
                  {study.clientName}
                </p>

                {/* Problem summary */}
                <p className="text-sm text-[#9AA3AF] leading-relaxed mb-6 flex-1">
                  {study.problem}
                </p>

                {/* Headline stat */}
                {headlineStat && (
                  <div className="border-t border-white/[0.07] pt-4">
                    <p className="font-[family-name:var(--font-sora)] text-2xl lg:text-3xl font-bold text-[#40E0FF] mb-1">
                      {headlineStat.value}
                    </p>
                    <p className="font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase text-[#6B7280]">
                      {headlineStat.label}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View all link */}
        <div className="text-center">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-[#40E0FF] hover:text-[#2BC4E0] font-[family-name:var(--font-sora)] font-semibold text-sm transition-colors"
          >
            View all case studies
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
