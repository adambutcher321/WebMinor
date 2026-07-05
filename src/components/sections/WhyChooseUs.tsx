import { BadgePoundSterling, FileX2, MapPin, Target } from "lucide-react";

const items = [
  {
    icon: BadgePoundSterling,
    title: "Transparent Pricing",
    description: "No hidden fees — ever",
  },
  {
    icon: FileX2,
    title: "No Long Contracts",
    description: "Cancel anytime",
  },
  {
    icon: MapPin,
    title: "Local Team",
    description: "Saltash, Cornwall",
  },
  {
    icon: Target,
    title: "ROI Focused",
    description: "Sites that generate leads",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative z-10 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="text-center sm:text-left">
                <div className="flex justify-center sm:justify-start mb-4">
                  <Icon className="w-7 h-7 text-[#40E0FF]" />
                </div>
                <h3 className="font-[family-name:var(--font-sora)] text-base font-bold text-white mb-1">
                  {item.title}
                </h3>
                <p className="font-[family-name:var(--font-inter)] text-sm text-[#9AA3AF]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
