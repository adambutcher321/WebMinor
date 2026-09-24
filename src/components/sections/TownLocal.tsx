import type { TownContent } from "@/data/townContent";

/* The researched, town-specific part of a /web-design/<town> page. */
export function TownLocal({ content }: { content: TownContent }) {
  return (
    <section className="max-w-5xl mx-auto mb-20 grid gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
          — The local picture
        </p>
        <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white mb-6 leading-tight">
          {content.localHeading}
        </h2>
        {content.local.map((p, i) => (
          <p key={i} className="text-[#9AA3AF] text-[16px] leading-relaxed mb-4">{p}</p>
        ))}
      </div>
      <div className="lg:pt-[3.25rem]">
        <div className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-8 sm:p-10">
          <h2 className="font-[family-name:var(--font-sora)] text-xl sm:text-2xl font-bold text-white mb-5 leading-tight">
            {content.approachHeading}
          </h2>
          {content.approach.map((p, i) => (
            <p key={i} className="text-[#9AA3AF] text-[16px] leading-relaxed mb-4 last:mb-0">{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TownFaqs({ content, townName }: { content: TownContent; townName: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <section className="max-w-3xl mx-auto mb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="text-center mb-8">
        <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
          — Common questions
        </p>
        <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white">
          Asked by <span className="text-[#40E0FF]">{townName}</span> businesses
        </h2>
      </div>
      <div className="space-y-3">
        {content.faqs.map((f) => (
          <details
            key={f.q}
            className="group bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl open:border-[#40E0FF]/25 transition-colors"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-[family-name:var(--font-sora)] text-base sm:text-lg font-semibold text-white [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden className="text-2xl font-light leading-none text-[#40E0FF] transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="px-6 pb-6 -mt-1 text-[#9AA3AF] text-[16px] leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
