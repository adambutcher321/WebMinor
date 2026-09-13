import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import MindfulNav from "../Nav";
import MindfulFooter from "../Footer";
import { Reveal } from "../motion";
import { Button, Eyebrow, Quote } from "../ui";
import { BASE, IMG, RETREATS, TESTIMONIALS } from "../content";
import s from "../mindful.module.css";

export const metadata: Metadata = {
  title: { absolute: "Retreats — Mindful | WebMinor Concept Demo" },
  description: "A meadow day in October and a winter weekend on the moor. Eight people at most.",
};

export default function RetreatsPage() {
  return (
    <main className={s.page}>
      <MindfulNav />

      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <Reveal className="lg:col-span-8">
            <Eyebrow>Retreats</Eyebrow>
            <h1 className={`${s.display} mt-5`}>
              A whole day, or a whole weekend, with <span className={s.italic}>nowhere to be after.</span>
            </h1>
          </Reveal>
          <Reveal className="lg:col-span-4" delay={120}>
            <p className={s.body}>
              Two a year, eight people at most, in places I know. They tend to fill
              from the last one, so the dates below are the dates.
            </p>
          </Reveal>
        </div>
      </section>

      {RETREATS.map((r, i) => (
        <section key={r.slug} id={r.slug} className="max-w-6xl mx-auto px-6 py-12 sm:py-16 scroll-mt-24">
          <Reveal>
            <div className={`${s.frame} aspect-[16/9] sm:aspect-[21/9]`}>
              <Image src={r.image} alt={r.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
            </div>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mt-12">
            <Reveal className="lg:col-span-5">
              <Eyebrow>{r.places}</Eyebrow>
              <h2 className={`${s.h2} mt-4`}>{r.name}</h2>
              <p className={`${s.lede} mt-4`}>{r.when}</p>
              <p className={`${s.body} mt-1`}>{r.where}</p>
              <p className={`${s.body} mt-6`}>{r.intro}</p>
              <ul className="mt-7 space-y-3">
                {r.includes.map((item) => (
                  <li key={item} className={`${s.body} flex items-start gap-3`} style={{ color: "var(--ink)" }}>
                    <Check className="w-4 h-4 mt-1.5 shrink-0" style={{ color: "var(--sage)" }} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <p>
                  <span className={s.numeral} style={{ fontSize: "2.4rem" }}>{r.price}</span>
                  <span className={s.small}> {r.priceNote}</span>
                </p>
                <Button href={`${BASE}/book?session=${encodeURIComponent(r.name)}`} arrow>
                  Hold a place
                </Button>
              </div>
            </Reveal>
            <Reveal className="lg:col-span-7" delay={120}>
              <div className="rounded-[2rem] bg-white border p-8 sm:p-10" style={{ borderColor: "var(--line)" }}>
                <Eyebrow>{r.itinerary.length > 4 ? "The day, hour by hour" : "The weekend"}</Eyebrow>
                <dl className="mt-6">
                  {r.itinerary.map((it) => (
                    <div key={it.time + it.what} className="grid grid-cols-[4.5rem_1fr] gap-4 py-4 border-t" style={{ borderColor: "var(--line)" }}>
                      <dt className={`${s.eyebrow} pt-1`} style={{ color: "var(--ink-mute)" }}>
                        {it.time}
                      </dt>
                      <dd className={s.lede} style={{ fontSize: "1.2rem" }}>
                        {it.what}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <Reveal className="lg:col-span-5">
            <div className={`${s.frame} aspect-[4/3]`}>
              <Image src={`${IMG}/country-walk.webp`} alt="Jessica walking a footpath above the river valley in morning mist" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={120}>
            <Quote {...TESTIMONIALS[3]} />
            <p className={`${s.body} mt-10`}>
              Wondering whether a whole day is too much? Book the free call and we
              will talk about it. Most people who worry about that fall asleep
              under the oak after lunch.
            </p>
            <Button href={`${BASE}/book`} variant="ghost" className="mt-6">
              Book the call
            </Button>
          </Reveal>
        </div>
      </section>

      <MindfulFooter />
    </main>
  );
}
