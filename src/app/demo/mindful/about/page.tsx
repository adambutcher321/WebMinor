import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MindfulNav from "../Nav";
import MindfulFooter from "../Footer";

export const metadata: Metadata = {
  // absolute: the root layout's "%s | WebMinor" template was doubling the suffix
  title: { absolute: "About Jessica — Mindful | WebMinor Concept Demo" },
  description: "Meet Jessica, your yoga coach.",
};

const TIMELINE = [
  {
    year: "2016",
    text: "Trained and certified in Hatha and Vinyasa yoga.",
  },
  {
    year: "2019",
    text: "Started teaching small private sessions alongside a studio job.",
  },
  {
    year: "2022",
    text: "Went fully independent — one-to-one and small groups only.",
  },
  {
    year: "Today",
    text: "Runs private sessions, group flow classes, and seasonal retreat days.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#faf6f0] text-[#2b2a26]">
      <MindfulNav />

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3]">
          <Image
            src="/demo/mindful/portrait.webp"
            alt="Jessica, yoga coach"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p
            className="text-sm uppercase tracking-[0.2em] text-[#5b7052]"
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 600 }}
          >
            About
          </p>
          <h1
            className="mt-4 text-4xl sm:text-5xl leading-tight"
            style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}
          >
            Hey, I&rsquo;m Jessica.
          </h1>
          <p
            className="mt-5 text-[#2b2a26]/70 leading-relaxed"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            I teach private and small-group yoga sessions built around real
            life — busy schedules, stiff desks, and everything else. No
            performative flexibility, no judgement. Just a calm hour that
            actually helps.
          </p>
          <p
            className="mt-4 text-[#2b2a26]/70 leading-relaxed"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            I keep my client list small on purpose, so every session is
            properly tailored rather than a generic class script.
          </p>
          <Link
            href="/demo/mindful/book"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#2b2a26] text-white text-sm font-semibold px-6 py-3.5 hover:bg-[#3d3b34] transition-colors"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Book a Session
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2
          className="text-3xl sm:text-4xl"
          style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}
        >
          A short history
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-4 gap-8">
          {TIMELINE.map((t) => (
            <div key={t.year} className="border-t-2 border-[#5b7052] pt-4">
              <p
                className="text-xl"
                style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}
              >
                {t.year}
              </p>
              <p
                className="mt-2 text-sm text-[#2b2a26]/60 leading-relaxed"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                {t.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <MindfulFooter />
    </main>
  );
}
