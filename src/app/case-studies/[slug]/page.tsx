import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies } from "@/data/case-studies";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) return {};

  const tradeLabel = cs.trade.charAt(0).toUpperCase() + cs.trade.slice(1);
  const townLabel = cs.town.charAt(0).toUpperCase() + cs.town.slice(1);

  return {
    title: `${cs.clientName} — ${tradeLabel} in ${townLabel} | Case Study`,
    description: cs.problem.slice(0, 160),
  };
}

const tradeBadgeColours: Record<string, string> = {
  plumbers: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  electricians: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  builders: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  roofers: "bg-red-500/10 text-red-400 border-red-500/20",
  landscapers: "bg-green-500/10 text-green-400 border-green-500/20",
};

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) notFound();

  const tradeLabel = cs.trade.charAt(0).toUpperCase() + cs.trade.slice(1);
  const townLabel = cs.town.charAt(0).toUpperCase() + cs.town.slice(1);
  const badgeColours =
    tradeBadgeColours[cs.trade] ?? "bg-white/5 text-white/60 border-white/10";

  return (
    <main className="px-6 pt-28 pb-20">
      {/* Hero */}
      <section className="max-w-4xl mx-auto mb-16">
        <span
          className={`inline-block font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border mb-6 ${badgeColours}`}
        >
          {tradeLabel}
        </span>
        <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl font-bold text-white mb-4">
          {cs.clientName}
        </h1>
        <p className="text-lg text-[#9AA3AF] leading-relaxed">
          {tradeLabel} in {townLabel}
        </p>
      </section>

      {/* Image placeholder */}
      <section className="max-w-4xl mx-auto mb-16">
        <div className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl aspect-video flex items-center justify-center">
          <p className="text-[#9AA3AF] text-sm font-[family-name:var(--font-mono)] tracking-wider uppercase">
            [EDIT: add hero image]
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="max-w-4xl mx-auto mb-16">
        <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
          — The Problem
        </p>
        <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white mb-6">
          Where they were <span className="text-[#40E0FF]">before</span>
        </h2>
        <div className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-8">
          <p className="text-[#9AA3AF] text-[16px] leading-relaxed">
            {cs.problem}
          </p>
        </div>
      </section>

      {/* Solution */}
      <section className="max-w-4xl mx-auto mb-16">
        <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
          — The Solution
        </p>
        <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white mb-6">
          What we <span className="text-[#40E0FF]">did</span>
        </h2>
        <div className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-8">
          <p className="text-[#9AA3AF] text-[16px] leading-relaxed">
            {cs.solution}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto mb-16">
        <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
          — The Results
        </p>
        <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white mb-8">
          Numbers that <span className="text-[#40E0FF]">matter</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cs.stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-8 text-center"
            >
              <p className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold text-[#40E0FF] mb-2">
                {stat.value}
              </p>
              <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-wider uppercase text-white/50">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery placeholders */}
      <section className="max-w-4xl mx-auto mb-24">
        <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
          — Gallery
        </p>
        <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white mb-8">
          Before &amp; <span className="text-[#40E0FF]">after</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl aspect-video flex items-center justify-center">
            <p className="text-[#9AA3AF] text-sm font-[family-name:var(--font-mono)] tracking-wider uppercase">
              [EDIT: before screenshot]
            </p>
          </div>
          <div className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl aspect-video flex items-center justify-center">
            <p className="text-[#9AA3AF] text-sm font-[family-name:var(--font-mono)] tracking-wider uppercase">
              [EDIT: after screenshot]
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto bg-[#0B0D10]/80 border border-[#40E0FF]/20 rounded-2xl p-10 sm:p-14 shadow-[0_0_60px_rgba(64,224,255,0.06)]">
        <div className="text-center mb-8">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            — Your Turn
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold text-white mb-4">
            Want results like{" "}
            <span className="text-[#40E0FF]">these?</span>
          </h2>
          <p className="text-[#9AA3AF] max-w-xl mx-auto">
            Get a free website review and find out how we can help your trades
            business get more local work.
          </p>
        </div>
        <LeadCaptureForm prefilledTrade={cs.trade} prefilledTown={cs.town} />
      </section>
    </main>
  );
}
