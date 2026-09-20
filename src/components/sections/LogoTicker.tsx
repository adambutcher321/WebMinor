import { MapPin, History, PenTool, Server, Rocket, CalendarX, Phone } from 'lucide-react';

// What a local customer needs to know at a glance. This strip used to list the
// build stack (Next.js, GSAP...), which meant nothing to the people it was for.
const tools = [
  { name: 'Saltash, Cornwall', icon: MapPin },
  { name: 'Designing since 1999', icon: History },
  { name: 'Free website design', icon: PenTool },
  { name: 'Hosting \u00a350 a month + VAT', icon: Server },
  { name: 'Free sites live in seven working days', icon: Rocket },
  { name: 'Cancel with 30 days\u2019 notice', icon: CalendarX },
  { name: '01752 845258', icon: Phone },
];

export default function LogoTicker() {
  const doubled = [...tools, ...tools];

  return (
    <section className="relative z-10 w-full py-8 overflow-hidden border-y border-white/[0.04]">
      <div className="flex animate-scroll-ticker gap-12 whitespace-nowrap">
        {doubled.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <div
              key={`${tool.name}-${i}`}
              className="flex items-center gap-3 shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-[#40E0FF]/[0.06] border border-[#40E0FF]/[0.1] flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#40E0FF]/60" />
              </div>
              <span className="font-[family-name:var(--font-mono)] text-sm font-bold tracking-wider uppercase text-white/30">
                {tool.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
