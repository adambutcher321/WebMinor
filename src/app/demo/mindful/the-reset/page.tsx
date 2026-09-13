import type { Metadata } from "next";
import Image from "next/image";
import { Check, X } from "lucide-react";
import MindfulNav from "../Nav";
import MindfulFooter from "../Footer";
import { Reveal } from "../motion";
import { Button, Eyebrow, Faq, Quote, SectionHead } from "../ui";
import { BASE, IMG, RESET, TESTIMONIALS } from "../content";
import s from "../mindful.module.css";

export const metadata: Metadata = {
  title: { absolute: `${RESET.name} — an eight-week programme with Jessica | Mindful | WebMinor Concept` },
  description: RESET.promise,
};

const applyHref = `${BASE}/book?session=${encodeURIComponent(RESET.name)}`;

export default function ResetPage() {
  return (
    <main className={s.page}>
      <MindfulNav />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-12 sm:pt-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] min-h-[520px] sm:min-h-[640px] flex items-end">
            <Image src={RESET.image} alt={RESET.alt} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2b2a26]/90 via-[#2b2a26]/45 to-[#2b2a26]/5" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2b2a26]/50 to-transparent" />
            <div className="relative p-8 sm:p-14 text-white max-w-3xl">
              <p className={s.eyebrow} style={{ color: "#c9d6c2" }}>
                The signature programme · {RESET.places}
              </p>
              <h1 className={`${s.display} mt-4`}>{RESET.name}</h1>
              <p className={`${s.lede} mt-5`} style={{ color: "rgba(255,255,255,0.88)" }}>
                {RESET.strap}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button href={applyHref} variant="onInk" arrow>
                  Apply for the October intake
                </Button>
                <p className={s.small} style={{ color: "rgba(255,255,255,0.7)" }}>
                  {RESET.price}, {RESET.priceNote}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* The problem, in two paragraphs. */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Eyebrow>Why it exists</Eyebrow>
            <h2 className={`${s.h2} mt-4`}>
              The problem was never <span className={s.italic}>information.</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-7 lg:pt-3" delay={100}>
            <div className={s.prose}>
              {RESET.problem.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* For / not for */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal stagger className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-[2rem] bg-white border p-8 sm:p-10" style={{ borderColor: "var(--line)" }}>
            <Eyebrow>This is for you if</Eyebrow>
            <ul className="mt-6 space-y-4">
              {RESET.forWho.map((f) => (
                <li key={f} className={`${s.body} flex items-start gap-3`} style={{ color: "var(--ink)" }}>
                  <Check className="w-4 h-4 mt-1.5 shrink-0" style={{ color: "var(--sage)" }} aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] p-8 sm:p-10" style={{ background: "var(--cream-deep)" }}>
            <Eyebrow>And honestly not if</Eyebrow>
            <ul className="mt-6 space-y-4">
              {RESET.notFor.map((f) => (
                <li key={f} className={`${s.body} flex items-start gap-3`} style={{ color: "var(--ink)" }}>
                  <X className="w-4 h-4 mt-1.5 shrink-0" style={{ color: "var(--ink-mute)" }} aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <p className={`${s.body} mt-8`}>
              If you are not sure, book the free call and I will tell you straight.
              About a third of the people who ask are better off with a single
              private session, and I say so.
            </p>
          </div>
        </Reveal>
      </section>

      {/* The eight weeks */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHead
                eyebrow="Week by week"
                title="Eight weeks, in order."
                lede="One private hour with me each week. Ten minutes a day on your own. The first and last hours are the same hour, so you can see what changed."
              />
              <div className={`${s.frame} mt-10 aspect-[4/3] hidden lg:block`}>
                <Image src={`${IMG}/morning-ritual.webp`} alt="Jessica on a window seat at first light with tea and a journal" fill sizes="30vw" className="object-cover" />
              </div>
            </div>
          </Reveal>
          <Reveal stagger className="lg:col-span-8">
            {RESET.weeks.map((w) => (
              <div key={w.n} className={s.week}>
                <p className={s.weekNo}>{String(w.n).padStart(2, "0")}</p>
                <div>
                  <h3 className={s.h3}>{w.title}</h3>
                  <p className={`${s.body} mt-2 max-w-xl`}>{w.text}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Included + outcomes */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal>
          <div className={`${s.inkPanel} p-10 sm:p-14 grid grid-cols-1 lg:grid-cols-2 gap-12`}>
            <div>
              <p className={s.eyebrow} style={{ color: "#b9c9b1" }}>What you get</p>
              <ul className="mt-6 space-y-4">
                {RESET.includes.map((i) => (
                  <li key={i} className={`${s.body} flex items-start gap-3`} style={{ color: "rgba(255,255,255,0.88)" }}>
                    <Check className="w-4 h-4 mt-1.5 shrink-0" style={{ color: "#b9c9b1" }} aria-hidden="true" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className={s.eyebrow} style={{ color: "#b9c9b1" }}>Where you end up</p>
              <ul className="mt-6 space-y-4">
                {RESET.outcomes.map((o) => (
                  <li key={o} className={`${s.lede} flex items-start gap-4`} style={{ color: "#fff", fontSize: "1.2rem" }}>
                    <span aria-hidden="true" className="mt-3 inline-block w-6 h-px shrink-0" style={{ background: "#b9c9b1" }} />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Proof */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal stagger className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
          <Quote {...TESTIMONIALS[0]} />
          <Quote {...TESTIMONIALS[5]} />
        </Reveal>
      </section>

      {/* Price + apply */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="rounded-[2rem] bg-white border p-10 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center" style={{ borderColor: "var(--line)" }}>
            <div className="lg:col-span-7">
              <Eyebrow>The October intake</Eyebrow>
              <h2 className={`${s.h2} mt-4`}>{RESET.starts.replace("Next intake begins ", "Begins ")}</h2>
              <p className={`${s.body} mt-5 max-w-lg`}>
                {RESET.places}, so that every one of them gets the hour. Apply
                with the form and I will come back within a day to arrange the free
                call. Nothing is paid until we have spoken.
              </p>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <p>
                <span className={s.numeral}>{RESET.price}</span>
              </p>
              <p className={`${s.small} mt-1`}>{RESET.priceNote}</p>
              <Button href={applyHref} className="mt-6" arrow>
                Apply for a place
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHead eyebrow="Questions" title="Asked before every intake." />
          </Reveal>
          <Reveal className="lg:col-span-8" delay={100}>
            <Faq items={RESET.faq} />
          </Reveal>
        </div>
      </section>

      <MindfulFooter />
    </main>
  );
}
