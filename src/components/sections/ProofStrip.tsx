import { Star } from "lucide-react";

export default function ProofStrip() {
  return (
    <section className="relative z-10 bg-[#0B0D10]/82 border-y border-white/[0.07] py-4">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-center gap-3 flex-wrap">
        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]"
            />
          ))}
        </div>

        <span className="font-[family-name:var(--font-mono)] text-xs font-bold tracking-wider uppercase text-[#F5F7FA]">
          [EDIT: X] 5-star Google reviews
        </span>

        {/* Separator */}
        <span className="text-[#6B7280] text-xs">&#x2022;</span>

        <span className="font-[family-name:var(--font-mono)] text-xs font-bold tracking-wider uppercase text-[#F5F7FA]">
          [EDIT: X]% average client growth
        </span>
      </div>
    </section>
  );
}
