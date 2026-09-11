import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Flame, Sunrise, Wind, Home } from "lucide-react";
import FernhollowNav from "../Nav";
import FernhollowFooter from "../Footer";

export const metadata: Metadata = {
  // absolute: the root layout's "%s | WebMinor" template was doubling the suffix
  title: { absolute: "Experiences — Fernhollow Concept Demo | WebMinor" },
  description:
    "A concept short-stay booking site design by WebMinor, showing the kind of premium web design we can build for hospitality and travel businesses.",
};

const EXPERIENCES = [
  {
    name: "Fireside Evenings",
    icon: Flame,
    image: "/demo/fernhollow/room1.webp",
    description:
      "Every cabin comes with its own wood-burning stove, stocked and ready. Settle in as the light fades and the forest goes quiet.",
  },
  {
    name: "Lakeside Mornings",
    icon: Sunrise,
    image: "/demo/fernhollow/room2.webp",
    description:
      "Wake before the mist lifts. Coffee on the deck, the water still as glass, the whole valley to yourself.",
  },
  {
    name: "Golden Hour Trails",
    icon: Wind,
    image: "/demo/fernhollow/room3.webp",
    description:
      "Marked trails from every cabin door, best walked in the last hour of light when the woods turn amber.",
  },
  {
    name: "The Hollow Retreat",
    icon: Home,
    image: "/demo/fernhollow/hero.webp",
    description:
      "Our signature stay — a private hillside cabin with the deepest quiet we could find. Built for doing absolutely nothing.",
  },
];

export default function FernhollowExperiencesPage() {
  return (
    <main className="min-h-screen bg-[#0d1210] text-white">
      <FernhollowNav />

      {/* Heading */}
      <section className="px-6 sm:px-10 pt-16 pb-14 max-w-2xl">
        <p
          className="text-xs uppercase tracking-[0.25em] text-amber-300/90 mb-4"
          style={{ fontFamily: "var(--font-inter-fh)" }}
        >
          Experiences
        </p>
        <h1
          className="text-4xl sm:text-5xl leading-[1.05] mb-5"
          style={{ fontFamily: "var(--font-fraunces)", fontWeight: 500 }}
        >
          More than a place <span className="italic text-white/60">to sleep</span>
        </h1>
        <p
          className="text-white/60 leading-relaxed"
          style={{ fontFamily: "var(--font-inter-fh)" }}
        >
          Every Fernhollow stay is built around the small, quiet moments —
          the ones that are hard to find anywhere else.
        </p>
      </section>

      {/* Experience list */}
      <section className="px-6 sm:px-10 pb-16 space-y-20 sm:space-y-24">
        {EXPERIENCES.map((exp, i) => {
          const Icon = exp.icon;
          const reverse = i % 2 === 1;
          return (
            <div
              key={exp.name}
              className={`flex flex-col ${
                reverse ? "lg:flex-row-reverse" : "lg:flex-row"
              } items-center gap-10 lg:gap-20 max-w-5xl mx-auto`}
            >
              <div className="relative w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                <Image
                  src={exp.image}
                  alt={exp.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <div className="w-11 h-11 rounded-full bg-amber-300/10 border border-amber-300/20 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-amber-300" aria-hidden="true" />
                </div>
                <h2
                  className="text-2xl sm:text-3xl leading-tight mb-4"
                  style={{ fontFamily: "var(--font-fraunces)", fontWeight: 500 }}
                >
                  {exp.name}
                </h2>
                <p
                  className="text-white/60 leading-relaxed"
                  style={{ fontFamily: "var(--font-inter-fh)" }}
                >
                  {exp.description}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="px-6 sm:px-10 pb-24 text-center">
        <Link
          href="/demo/fernhollow/rooms"
          className="inline-block rounded-full bg-white text-[#0d1210] text-sm font-semibold px-8 py-3.5 hover:bg-amber-50 transition-colors shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
          style={{ fontFamily: "var(--font-inter-fh)" }}
        >
          Browse our cabins
        </Link>
      </section>

      <FernhollowFooter />
    </main>
  );
}
