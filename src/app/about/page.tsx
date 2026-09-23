import type { Metadata } from "next";
import Image from "next/image";
import { Clock, Layers, MapPin } from "lucide-react";
import { PersonSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "About WebMinor — Adam Butcher, Designer & Developer",
  description:
    "Meet Adam Butcher — 25+ years in graphic design and web development. WebMinor delivers agency-quality websites for tradespeople without the agency price tag.",
};

const highlights = [
  {
    icon: Clock,
    label: "25+ Years Experience",
    description:
      "From Photoshop in 1999 to modern full-stack development — over two decades of making things look right and work properly.",
  },
  {
    icon: Layers,
    label: "Full Stack Creative",
    description:
      "Design and development under one roof. No handoffs, no miscommunication — just one person who understands both sides.",
  },
  {
    icon: MapPin,
    label: "Based in Saltash",
    description:
      "Working from Gwel Avon Business Park in Saltash, Cornwall — serving trades businesses across the South West and beyond.",
  },
];

export default function AboutPage() {
  return (
    <main className="pb-20">
      <PersonSchema />
      {/* Hero */}
      <section className="relative overflow-hidden mb-16">
        <div className="relative h-[46vh] min-h-[340px] max-h-[560px] w-full">
          <Image
            src="/world/about-hero.webp"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/60 to-[#0B0D10]/10" />
        </div>
        <div className="relative -mt-24 px-6 text-center max-w-5xl mx-auto">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#40E0FF] tracking-wider uppercase mb-4">
            — About
          </p>
          <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl font-bold text-white mb-6">
            The person behind{" "}
            <span className="text-[#40E0FF]">every pixel</span>
          </h1>
          <p className="text-lg text-[#9AA3AF] max-w-2xl mx-auto leading-relaxed">
            I&apos;m Adam Butcher — designer, developer, and the person behind
            every pixel at WebMinor.
          </p>
        </div>
      </section>

      {/* Story — single measure until a portrait is supplied; see the
          hero artwork above for the page's visual. */}
      <section className="px-6 max-w-3xl mx-auto mb-24">
        <div className="space-y-6">
          <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-white">
            25 years of making things{" "}
            <span className="text-[#40E0FF]">look right</span> and{" "}
            <span className="text-[#40E0FF]">work properly</span>
          </h2>

          <p className="text-[#9AA3AF] text-[16px] leading-relaxed">
            I got my start in graphic design back in 1999 — teaching myself
            Photoshop, building layouts, figuring out how to make things look
            professional. That turned into a career that&apos;s spanned print
            design, branding, and eventually web development. Over 25 years
            later, I&apos;ve worked with businesses of all sizes, from one-man
            operations to established companies, and the thing that hasn&apos;t
            changed is the part I enjoy most: taking something that isn&apos;t
            working and making it brilliant.
          </p>

          <p className="text-[#9AA3AF] text-[16px] leading-relaxed">
            WebMinor exists because I kept seeing the same problem. Tradespeople
            — plumbers, electricians, builders, roofers — doing incredible work
            but getting let down by terrible websites. Either they&apos;d paid
            someone a fortune for something that looked generic, or they&apos;d
            tried to do it themselves and knew it wasn&apos;t right. I thought:
            what if I could give these businesses the same quality of design and
            development that big brands get, but at a price that actually makes
            sense?
          </p>

          <p className="text-[#9AA3AF] text-[16px] leading-relaxed">
            That&apos;s what makes WebMinor different. There&apos;s no agency
            here — no account managers, no bloated teams, no mark-ups. It&apos;s
            me. I design it, I build it, I optimise it, and I make sure it
            brings in work. When you call, you get me. When something needs
            changing, I change it. No tickets, no waiting.
          </p>

          <blockquote className="border-l-2 border-[#40E0FF] pl-6 py-2">
            <p className="text-white text-[17px] leading-relaxed font-[family-name:var(--font-sora)] italic">
              &ldquo;You deserve the same quality of web design as a brand with
              a six-figure budget. I just figured out how to deliver it faster,
              leaner, and without the agency markup.&rdquo;
            </p>
          </blockquote>
        </div>
      </section>

      {/* Highlight Cards */}
      <section className="px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {highlights.map((item) => (
          <div
            key={item.label}
            className="bg-[#0B0D10]/80 border border-white/[0.07] rounded-2xl p-8"
          >
            <item.icon className="w-10 h-10 text-[#40E0FF] mb-5" />
            <h3 className="font-[family-name:var(--font-sora)] text-lg font-bold text-white mb-2">
              {item.label}
            </h3>
            <p className="text-[#9AA3AF] text-base leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
