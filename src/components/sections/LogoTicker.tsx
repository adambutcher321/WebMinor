import { Globe, Atom, Wind, Boxes, Box, Zap, Move, Waves, Terminal } from 'lucide-react';

const tools = [
  { name: 'Next.js', icon: Globe },
  { name: 'React', icon: Atom },
  { name: 'Tailwind', icon: Wind },
  { name: 'React Three Fiber', icon: Boxes },
  { name: 'Three.js', icon: Box },
  { name: 'GSAP', icon: Zap },
  { name: 'Framer Motion', icon: Move },
  { name: 'Lenis', icon: Waves },
  { name: 'TypeScript', icon: Terminal },
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
