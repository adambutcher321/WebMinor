import { Monitor, PenLine, Code, Layers, Cpu, Globe, Zap, Palette, Terminal, Box, Sparkles, PenTool } from 'lucide-react';

const tools = [
  { name: 'Figma', icon: PenLine },
  { name: 'React', icon: Code },
  { name: 'Next.js', icon: Globe },
  { name: 'Tailwind', icon: Layers },
  { name: 'TypeScript', icon: Terminal },
  { name: 'GSAP', icon: Zap },
  { name: 'Three.js', icon: Box },
  { name: 'Photoshop', icon: Monitor },
  { name: 'Illustrator', icon: PenTool },
  { name: 'After Effects', icon: Sparkles },
  { name: 'Framer Motion', icon: Cpu },
  { name: 'WordPress', icon: Palette },
];

export default function LogoTicker() {
  const doubled = [...tools, ...tools];

  return (
    <section className="relative z-10 py-8 overflow-hidden border-y border-white/[0.04]">
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
