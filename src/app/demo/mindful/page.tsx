import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Leaf, HeartHandshake, Sparkles } from "lucide-react";
import InteractiveHero from "./InteractiveHero";
import MindfulFooter from "./Footer";

export const metadata: Metadata = {
  // absolute: the root layout's "%s | WebMinor" template was doubling the suffix
  title: { absolute: "Mindful — Concept Demo | WebMinor" },
  description:
    "A concept yoga-coaching site design by WebMinor, showing the kind of playful, interactive web design we can build for wellness businesses.",
};

const PILLARS = [
  {
    icon: Leaf,
    title: "Private & personal",
    text: "Every session is built around you — your body, your pace, your goals.",
  },
  {
    icon: HeartHandshake,
    title: "Warm, unhurried teaching",
    text: "No judgement, no rush. Just a calm space to move and breathe.",
  },
  {
    icon: Sparkles,
    title: "Real, visible progress",
    text: "Simple plans you can actually keep, session after session.",
  },
];

export default function MindfulHomePage() {
  return (
    <main className="min-h-screen bg-[#faf6f0] text-[#2b2a26]">
      <InteractiveHero />

      {/* Intro / pillars */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-2xl">
          <p
            className="text-sm uppercase tracking-[0.2em] text-[#5b7052]"
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 600 }}
          >
            About the studio
          </p>
          <h2
            className="mt-4 text-4xl sm:text-5xl leading-tight"
            style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}
          >
            A quieter way to move,
            <br />
            wherever you are.
          </h2>
          <p
            className="mt-5 text-[#2b2a26]/70 leading-relaxed"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Mindful is a small private yoga practice — sessions arranged
            around your schedule, taught with patience, and designed to
            actually fit into a busy life.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {PILLARS.map((p) => (
            <div key={p.title}>
              <p.icon className="w-6 h-6 text-[#5b7052]" aria-hidden="true" />
              <p
                className="mt-4 text-xl"
                style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}
              >
                {p.title}
              </p>
              <p
                className="mt-2 text-sm text-[#2b2a26]/60 leading-relaxed"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Split image/CTA band */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="relative rounded-[2rem] overflow-hidden min-h-[320px]">
          <Image
            src="/demo/mindful/lotus.webp"
            alt="Jessica meditating in a lotus pose in a sunlit meadow"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="rounded-[2rem] bg-[#2b2a26] text-white p-10 sm:p-12 flex flex-col justify-center">
          <p
            className="text-3xl sm:text-4xl leading-snug"
            style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}
          >
            &ldquo;Ready to find your focus?&rdquo;
          </p>
          <p
            className="mt-4 text-white/70 leading-relaxed"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Arrange a private session, join a small group flow, or book a
            full retreat day — whatever fits where you are right now.
          </p>
          <Link
            href="/demo/mindful/book"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white text-[#2b2a26] text-sm font-semibold px-6 py-3.5 hover:bg-[#faf6f0] transition-colors"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Book a Session
          </Link>
        </div>
      </section>

      <MindfulFooter />
    </main>
  );
}
