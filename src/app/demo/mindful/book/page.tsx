import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import MindfulNav from "../Nav";
import BookingForm from "./BookingForm";
import MindfulFooter from "../Footer";

export const metadata: Metadata = {
  // absolute: the root layout's "%s | WebMinor" template was doubling the suffix
  title: { absolute: "Book a Session — Mindful | WebMinor Concept Demo" },
  description: "Book a private, group, or retreat yoga session with Jessica.",
};

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[#faf6f0] text-[#2b2a26]">
      <MindfulNav />

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <p
            className="text-sm uppercase tracking-[0.2em] text-[#5b7052]"
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 600 }}
          >
            Book
          </p>
          <h1
            className="mt-4 text-4xl sm:text-5xl leading-tight"
            style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}
          >
            Let&rsquo;s find your slot.
          </h1>
          <p
            className="mt-5 text-[#2b2a26]/70 leading-relaxed max-w-md"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Tell Jessica a bit about you and pick a session type — she&rsquo;ll
            confirm the details and get you booked in.
          </p>

          <div className="relative mt-10 rounded-[2rem] overflow-hidden aspect-[4/3] max-w-md">
            <Image
              src="/demo/mindful/warrior.webp"
              alt="Jessica in a yoga pose at sunset"
              fill
              sizes="(max-width: 1024px) 100vw, 28rem"
              className="object-cover"
            />
          </div>
        </div>

        <Suspense
          fallback={
            <div
              className="rounded-[2rem] border border-black/5 bg-white p-6 sm:p-10 min-h-[420px]"
              aria-hidden="true"
            />
          }
        >
          <BookingForm />
        </Suspense>
      </section>

      <MindfulFooter />
    </main>
  );
}
