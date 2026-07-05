import { Monitor, Search, MapPin, TrendingUp } from "lucide-react";
import { services } from "@/data/services";

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  Monitor,
  Search,
  MapPin,
  TrendingUp,
};

export default function ServiceCards() {
  return (
    <section className="relative z-10 py-24 px-6" data-animate-card data-tilt>
      <div className="max-w-5xl mx-auto bg-[rgba(11,13,16,0.82)] border border-white/[0.07] rounded-2xl p-10 sm:p-14">
        {/* Header */}
        <div className="mb-14" data-float="1.2">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-3">
            &mdash; What We Offer
          </p>
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Everything you need to{" "}
            <span className="text-[#40E0FF]">launch your brand</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" data-stagger-children>
          {services.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <div
                key={service.slug}
                className="group bg-[rgba(11,13,16,0.82)] border border-white/[0.07] rounded-2xl p-8 transition-all duration-300 hover:border-[#40E0FF]/50 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#40E0FF]/10 flex items-center justify-center mb-5">
                  {Icon && (
                    <Icon className="w-6 h-6 text-[#40E0FF]" />
                  )}
                </div>

                {/* Name */}
                <h3 className="font-[family-name:var(--font-sora)] text-lg font-bold text-white mb-2">
                  {service.name}
                </h3>

                {/* Description */}
                <p className="font-[family-name:var(--font-inter)] text-sm text-[#9AA3AF] leading-relaxed">
                  {service.shortDescription}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
