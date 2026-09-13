import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import MindfulNav from "../Nav";
import MindfulFooter from "../Footer";
import BookingForm from "./BookingForm";
import { Reveal } from "../motion";
import { Eyebrow } from "../ui";
import { IMG } from "../content";
import s from "../mindful.module.css";

export const metadata: Metadata = {
  title: { absolute: "Book — Mindful | WebMinor Concept Demo" },
  description: "Book a free call, a session, a place on The Reset or a retreat with Jessica.",
};

const STEPS = [
  { n: "01", title: "You send this", text: "Two minutes. Say what it is for and, if you like, what has not worked before." },
  { n: "02", title: "I call you", text: "Within a day, usually the same afternoon. Twenty minutes, no cost, and I will tell you straight where to start." },
  { n: "03", title: "We book it", text: "A session, an intake, or a place on a retreat. Or nothing, if a single call was what you needed." },
];

export default function BookPage() {
  return (
    <main className={s.page}>
      <MindfulNav />

      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <Reveal className="lg:col-span-6">
            <Eyebrow>Book</Eyebrow>
            <h1 className={`${s.display} mt-5`}>
              Start with a <span className={s.italic}>call.</span>
            </h1>
            <p className={`${s.lede} mt-7 max-w-lg`} style={{ color: "var(--ink-soft)" }}>
              Twenty minutes, free, on the phone. We talk about your week and your
              body and I tell you honestly which of these, if any, is the right
              place to start.
            </p>

            <ol className="mt-10">
              {STEPS.map((st) => (
                <li key={st.n} className={s.week} style={{ gridTemplateColumns: "3.5rem 1fr" }}>
                  <p className={s.weekNo} style={{ fontSize: "1.5rem", paddingTop: "0.2rem" }}>{st.n}</p>
                  <div>
                    <h2 className={s.h3} style={{ fontSize: "1.35rem" }}>{st.title}</h2>
                    <p className={`${s.body} mt-1.5 max-w-md`}>{st.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className={`${s.frame} mt-12 aspect-[4/3] max-w-md`}>
              <Image src={`${IMG}/private-session.webp`} alt="Jessica guiding one client through a supported pose in a sunlit living room" fill sizes="(max-width: 1024px) 100vw, 28rem" className="object-cover" />
            </div>
          </Reveal>

          <Reveal className="lg:col-span-6" delay={120}>
            <div className="lg:sticky lg:top-28">
              <Suspense fallback={<div className="rounded-[2rem] border bg-white min-h-[520px]" style={{ borderColor: "var(--line)" }} aria-hidden="true" />}>
                <BookingForm />
              </Suspense>
            </div>
          </Reveal>
        </div>
      </section>

      <MindfulFooter />
    </main>
  );
}
