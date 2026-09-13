import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import MindfulNav from "../Nav";
import MindfulFooter from "../Footer";
import { Reveal } from "../motion";
import { Button, Eyebrow, Faq, Quote, SectionHead } from "../ui";
import { BASE, FAQ, RESET, TESTIMONIALS, WAYS } from "../content";
import s from "../mindful.module.css";

export const metadata: Metadata = {
  title: { absolute: "Work with me — Mindful | WebMinor Concept Demo" },
  description: "Private sessions, small group flow, workplace sessions and retreat days with Jessica.",
};

export default function WorkWithMePage() {
  return (
    <main className={s.page}>
      <MindfulNav />

      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-16">
        <Reveal>
          <Eyebrow>Work with me</Eyebrow>
          <h1 className={`${s.display} mt-5 max-w-3xl`}>
            Pick the pace that fits <span className={s.italic}>your</span> week.
          </h1>
          <p className={`${s.lede} mt-8 max-w-2xl`} style={{ color: "var(--ink-soft)" }}>
            Four ways to work with me, and one thing they share: I will build it
            around the body you have and the week you are having, not the ones a
            class plan assumes.
          </p>
          <nav aria-label="Jump to" className="mt-10 flex flex-wrap gap-2">
            {WAYS.map((w) => (
              <a
                key={w.slug}
                href={`#${w.slug}`}
                className={`${s.btn} ${s.btnLight}`}
                style={{ padding: "0.7rem 1.2rem" }}
              >
                {w.name}
              </a>
            ))}
            <a href="#reset" className={`${s.btn} ${s.btnLight}`} style={{ padding: "0.7rem 1.2rem" }}>
              {RESET.name}
            </a>
          </nav>
        </Reveal>
      </section>

      {WAYS.map((w, i) => (
        <section key={w.slug} id={w.slug} className="max-w-6xl mx-auto px-6 py-14 sm:py-20 scroll-mt-24">
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <Reveal className="lg:col-span-6">
              <div className={`${s.frame} aspect-[4/3]`}>
                <Image src={w.image} alt={w.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
            </Reveal>
            <Reveal className="lg:col-span-6" delay={120}>
              <Eyebrow>{w.eyebrow}</Eyebrow>
              <h2 className={`${s.h2} mt-4`}>{w.name}</h2>
              <p className={`${s.lede} mt-5`}>{w.promise}</p>
              <p className={`${s.body} mt-5`}>{w.detail}</p>
              <ul className="mt-7 space-y-3">
                {w.includes.map((item) => (
                  <li key={item} className={`${s.body} flex items-start gap-3`} style={{ color: "var(--ink)" }}>
                    <Check className="w-4 h-4 mt-1.5 shrink-0" style={{ color: "var(--sage)" }} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <p>
                  <span className={s.numeral} style={{ fontSize: "2.4rem" }}>{w.price}</span>
                  <span className={s.small}> {w.unit}</span>
                </p>
                <Button href={`${BASE}/book?session=${encodeURIComponent(w.bookAs)}`} arrow>
                  Book {w.name.toLowerCase()}
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      {/* The Reset, as the fifth thing on this page. */}
      <section id="reset" className="max-w-6xl mx-auto px-6 py-14 sm:py-20 scroll-mt-24">
        <Reveal>
          <div className={`${s.inkPanel} p-10 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center`}>
            <div className="lg:col-span-7">
              <p className={s.eyebrow} style={{ color: "#b9c9b1" }}>
                Or the whole thing, in eight weeks
              </p>
              <h2 className={`${s.h2} mt-4`}>{RESET.name}</h2>
              <p className={`${s.lede} mt-5`} style={{ color: "rgba(255,255,255,0.85)" }}>
                {RESET.strap}
              </p>
              <p className={`${s.body} mt-4`} style={{ color: "rgba(255,255,255,0.65)" }}>
                {RESET.promise}
              </p>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <p>
                <span className={s.numeral}>{RESET.price}</span>
                <span className={s.small} style={{ color: "rgba(255,255,255,0.55)" }}> {RESET.priceNote}</span>
              </p>
              <p className={`${s.small} mt-2`} style={{ color: "rgba(255,255,255,0.55)" }}>{RESET.starts}</p>
              <Button href={`${BASE}/the-reset`} variant="onInk" className="mt-6" arrow>
                See the eight weeks
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
        <Reveal stagger className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
          <Quote {...TESTIMONIALS[1]} />
          <Quote {...TESTIMONIALS[4]} />
        </Reveal>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHead eyebrow="Before you book" title="Things people ask first." />
          </Reveal>
          <Reveal className="lg:col-span-8" delay={100}>
            <Faq items={FAQ} />
          </Reveal>
        </div>
      </section>

      <MindfulFooter />
    </main>
  );
}
