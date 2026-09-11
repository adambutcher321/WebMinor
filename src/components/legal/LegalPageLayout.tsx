import type { ReactNode } from "react";

export interface LegalSection {
  title: string;
  body: ReactNode;
}

interface LegalPageLayoutProps {
  eyebrow: string;
  title: string;
  titleAccent: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export default function LegalPageLayout({
  eyebrow,
  title,
  titleAccent,
  intro,
  lastUpdated,
  sections,
}: LegalPageLayoutProps) {
  return (
    <main className="px-6 pt-28 pb-20">
      <section className="max-w-3xl mx-auto text-center mb-4">
        <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-4">
          — {eyebrow}
        </p>
        <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl font-bold text-white mb-6">
          {title} <span className="text-[#40E0FF]">{titleAccent}</span>
        </h1>
        <p className="text-lg text-[#9AA3AF] max-w-2xl mx-auto leading-relaxed">
          {intro}
        </p>
      </section>

      <p className="text-center text-xs font-[family-name:var(--font-mono)] text-white/30 tracking-wider uppercase mb-16">
        Last updated: {lastUpdated}
      </p>

      <section className="max-w-3xl mx-auto space-y-6">
        {sections.map((s) => (
          <div
            key={s.title}
            className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-8"
          >
            <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold text-white mb-3">
              {s.title}
            </h2>
            <div className="text-[#9AA3AF] text-[16px] leading-relaxed space-y-3">
              {s.body}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
