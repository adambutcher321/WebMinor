import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, ArrowRight } from "lucide-react";
import FernhollowNav from "../Nav";
import FernhollowFooter from "../Footer";

export const metadata: Metadata = {
  // absolute: the root layout's "%s | WebMinor" template was doubling the suffix
  title: { absolute: "Rooms — Fernhollow Concept Demo | WebMinor" },
  description:
    "A concept short-stay booking site design by WebMinor, showing the kind of premium web design we can build for hospitality and travel businesses.",
};

const CABINS = [
  {
    name: "Alderwood Lake Cabin",
    location: "Highland Lochs",
    image: "/demo/fernhollow/room2.webp",
    price: 289,
    rating: 4.9,
    guests: "2–4 guests",
    tag: "Lakefront",
  },
  {
    name: "The Firwatch Retreat",
    location: "Pinehaven Ridge",
    image: "/demo/fernhollow/room1.webp",
    price: 219,
    rating: 4.8,
    guests: "2–3 guests",
    tag: "Forest view",
  },
  {
    name: "Meadowlight Cottage",
    location: "Amberfall Valley",
    image: "/demo/fernhollow/room3.webp",
    price: 175,
    rating: 4.7,
    guests: "2–5 guests",
    tag: "Meadow clearing",
  },
  {
    name: "The Hollow House",
    location: "Fernhollow Woods",
    image: "/demo/fernhollow/hero.webp",
    price: 249,
    rating: 5.0,
    guests: "2–4 guests",
    tag: "Signature stay",
  },
];

export default function FernhollowRoomsPage() {
  return (
    <main className="min-h-screen bg-[#0d1210] text-white">
      {/* Hero banner */}
      <div className="relative h-[42vh] min-h-[320px]">
        <Image
          src="/demo/fernhollow/room3.webp"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-[#0d1210]" />
        <div className="absolute inset-0 flex flex-col">
          <FernhollowNav transparent />
          <div className="flex-1 flex flex-col justify-end px-6 sm:px-10 pb-12 max-w-2xl">
            <p
              className="text-xs uppercase tracking-[0.25em] text-amber-300/90 mb-4"
              style={{ fontFamily: "var(--font-inter-fh)" }}
            >
              Our Cabins
            </p>
            <h1
              className="text-5xl sm:text-6xl leading-[1.05] mb-5"
              style={{ fontFamily: "var(--font-fraunces)", fontWeight: 500 }}
            >
              Find your
              <br />
              <span className="italic text-white/60">quiet corner</span>
            </h1>
            <p
              className="text-white/70 leading-relaxed max-w-md"
              style={{ fontFamily: "var(--font-inter-fh)" }}
            >
              Every Fernhollow stay is handpicked for its setting — lakefront,
              forest, or meadow — and finished to the same quiet standard.
            </p>
          </div>
        </div>
      </div>

      {/* Cabin grid */}
      <section className="px-6 sm:px-10 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 max-w-7xl mx-auto">
        {CABINS.map((cabin) => (
          <Link
            key={cabin.name}
            href="/demo/fernhollow/contact"
            aria-label={`Enquire about ${cabin.name}`}
            className="group block rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.08] hover:border-amber-200/25 transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={cabin.image}
                alt={`${cabin.name}, ${cabin.location}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span
                className="absolute top-3 left-3 rounded-full bg-black/55 backdrop-blur-md text-[10px] tracking-wider uppercase px-3 py-1.5 text-white/90"
                style={{ fontFamily: "var(--font-inter-fh)" }}
              >
                {cabin.tag}
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-1.5">
                <h2
                  className="text-lg leading-tight pr-2"
                  style={{ fontFamily: "var(--font-fraunces)", fontWeight: 500 }}
                >
                  {cabin.name}
                </h2>
                <span
                  className="flex items-center gap-1 text-xs text-white/70 shrink-0 mt-1"
                  style={{ fontFamily: "var(--font-inter-fh)" }}
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {cabin.rating.toFixed(1)}
                </span>
              </div>
              <p
                className="flex items-center gap-1 text-xs text-white/45 mb-4"
                style={{ fontFamily: "var(--font-inter-fh)" }}
              >
                <MapPin className="w-3 h-3" aria-hidden="true" />
                {cabin.location}
              </p>
              <div
                className="flex items-center justify-between pt-3 border-t border-white/[0.08]"
                style={{ fontFamily: "var(--font-inter-fh)" }}
              >
                <span className="text-xs text-white/45">{cabin.guests}</span>
                <span className="text-base font-semibold">
                  £{cabin.price}
                  <span className="text-xs font-normal text-white/45">/night</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Closing CTA band */}
      <section className="relative overflow-hidden border-t border-white/10">
        <Image
          src="/demo/fernhollow/room2.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1210] via-[#0d1210]/85 to-[#0d1210]/40" />
        <div className="relative px-6 sm:px-10 py-24 max-w-2xl">
          <h2
            className="text-3xl sm:text-4xl leading-tight mb-5"
            style={{ fontFamily: "var(--font-fraunces)", fontWeight: 500 }}
          >
            Can&apos;t decide?{" "}
            <span className="italic text-white/60">Let us help.</span>
          </h2>
          <p
            className="text-white/65 leading-relaxed mb-8"
            style={{ fontFamily: "var(--font-inter-fh)" }}
          >
            Tell us what you&apos;re after and we&apos;ll match you with the
            right setting — quiet forest, still water, or open meadow.
          </p>
          <Link
            href="/demo/fernhollow/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white text-[#0d1210] text-sm font-semibold px-7 py-3.5 hover:bg-amber-50 transition-colors"
            style={{ fontFamily: "var(--font-inter-fh)" }}
          >
            Get in touch <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <FernhollowFooter />
    </main>
  );
}
