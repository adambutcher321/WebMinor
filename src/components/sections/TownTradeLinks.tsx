import Link from "next/link";
import { trades } from "@/data/trades";
import { towns } from "@/data/towns";

export default function TownTradeLinks() {
  return (
    <section className="relative z-10 px-6 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            — Local
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Web design for trades across the{" "}
            <span className="text-[#40E0FF]">South West</span>
          </h2>
        </div>

        {/* Links grouped by trade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trades.map((trade) => (
            <div key={trade.slug}>
              <h3 className="font-[family-name:var(--font-sora)] text-sm font-bold text-white uppercase tracking-wider mb-3">
                {trade.pluralName}
              </h3>
              <ul className="space-y-1.5">
                {towns.map((town) => (
                  <li key={`${trade.slug}-${town.slug}`}>
                    <Link
                      href={`/web-design/${town.slug}/${trade.slug}`}
                      className="text-xs text-[#9AA3AF] hover:text-[#40E0FF] transition-colors leading-snug"
                    >
                      Web Design for {trade.pluralName} in {town.displayName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
