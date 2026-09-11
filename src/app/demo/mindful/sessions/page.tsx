import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import MindfulNav from "../Nav";
import MindfulFooter from "../Footer";

export const metadata: Metadata = {
  // absolute: the root layout's "%s | WebMinor" template was doubling the suffix
  title: { absolute: "Sessions — Mindful | WebMinor Concept Demo" },
  description: "Private, group, and retreat yoga sessions with Jessica.",
};

const SESSIONS = [
  {
    name: "1:1 Private Session",
    price: "£55",
    unit: "/ 60 min",
    image: "/demo/mindful/lotus.webp",
    blurb:
      "Fully personalised to your body, your goals, and whatever's going on for you this week.",
    includes: [
      "In-person or video call",
      "A short plan to practise between sessions",
      "Flexible rescheduling",
    ],
  },
  {
    name: "Group Flow Class",
    price: "£18",
    unit: "/ person",
    image: "/demo/mindful/warrior.webp",
    blurb:
      "Small groups of up to 6, moving through a guided flow at a shared, unhurried pace.",
    includes: [
      "Max. 6 people per class",
      "All levels welcome",
      "Mats and props provided",
    ],
    featured: true,
  },
  {
    name: "Retreat Day",
    price: "£140",
    unit: "/ day",
    image: "/demo/mindful/hero-wave-v2.webp",
    blurb:
      "A full day out in the meadow — movement, breathwork, food, and proper quiet.",
    includes: [
      "Three guided sessions",
      "Lunch included",
      "Small groups, max. 8",
    ],
  },
];

export default function SessionsPage() {
  return (
    <main className="min-h-screen bg-[#faf6f0] text-[#2b2a26]">
      <MindfulNav />

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <p
          className="text-sm uppercase tracking-[0.2em] text-[#5b7052]"
          style={{ fontFamily: "var(--font-manrope)", fontWeight: 600 }}
        >
          Sessions
        </p>
        <h1
          className="mt-4 text-4xl sm:text-6xl leading-tight max-w-2xl"
          style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}
        >
          Pick the pace that fits your week.
        </h1>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {SESSIONS.map((s) => (
          <div
            key={s.name}
            className={`rounded-[2rem] overflow-hidden border flex flex-col ${
              s.featured
                ? "border-[#5b7052] shadow-xl bg-white lg:-translate-y-3"
                : "border-black/5 bg-white"
            }`}
          >
            <div className="relative h-56">
              <Image
                src={s.image}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-7 flex flex-col flex-1">
              <p
                className="text-2xl"
                style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}
              >
                {s.name}
              </p>
              <p className="mt-2 flex items-baseline gap-1.5">
                <span
                  className="text-3xl"
                  style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}
                >
                  {s.price}
                </span>
                <span
                  className="text-sm text-[#2b2a26]/50"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {s.unit}
                </span>
              </p>
              <p
                className="mt-3 text-sm text-[#2b2a26]/70 leading-relaxed"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                {s.blurb}
              </p>
              <ul className="mt-5 space-y-2.5 flex-1">
                {s.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-[#2b2a26]/70"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    <Check className="w-4 h-4 text-[#5b7052] shrink-0 mt-0.5" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/demo/mindful/book?session=${encodeURIComponent(s.name)}`}
                aria-label={`Book the ${s.name}`}
                className={`mt-7 inline-flex items-center justify-center rounded-full text-sm font-semibold px-6 py-3.5 transition-colors ${
                  s.featured
                    ? "bg-[#2b2a26] text-white hover:bg-[#3d3b34]"
                    : "bg-[#faf6f0] text-[#2b2a26] hover:bg-[#efe9df]"
                }`}
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Book this
              </Link>
            </div>
          </div>
        ))}
      </section>

      <MindfulFooter />
    </main>
  );
}
