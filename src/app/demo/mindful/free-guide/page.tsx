import type { Metadata } from "next";
import Image from "next/image";
import MindfulNav from "../Nav";
import MindfulFooter from "../Footer";
import { Reveal } from "../motion";
import { Button, Eyebrow, Quote } from "../ui";
import GuideForm from "./GuideForm";
import { BASE, GUIDE, IMG, TESTIMONIALS } from "../content";
import s from "../mindful.module.css";

export const metadata: Metadata = {
  title: { absolute: `${GUIDE.name}, a free week of ten-minute mornings — Mindful | WebMinor Concept Demo` },
  description: GUIDE.strap,
};

export default function FreeGuidePage() {
  return (
    <main className={s.page}>
      <MindfulNav />

      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <Eyebrow>Free, and the place to start</Eyebrow>
            <h1 className={`${s.display} mt-5`}>{GUIDE.name}</h1>
            <p className={`${s.lede} mt-6 max-w-xl`}>{GUIDE.strap}</p>
            <p className={`${s.body} mt-6 max-w-xl`}>{GUIDE.intro}</p>
            <div className={`${s.frame} mt-10 aspect-[4/3] max-w-xl`}>
              <Image src={GUIDE.image} alt={GUIDE.alt} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={120}>
            <div className="lg:sticky lg:top-28">
              <GuideForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal>
          <Eyebrow>The seven days</Eyebrow>
          <h2 className={`${s.h2} mt-4 max-w-2xl`}>Nothing in it you can get wrong.</h2>
        </Reveal>
        <Reveal stagger className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2">
          {GUIDE.days.map((d) => (
            <div key={d.n} className="py-6 border-t" style={{ borderColor: "var(--line)" }}>
              <p className={s.weekNo}>{String(d.n).padStart(2, "0")}</p>
              <h3 className={`${s.h3} mt-3`}>{d.title}</h3>
              <p className={`${s.body} mt-2`} style={{ fontSize: "15px" }}>{d.text}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <Reveal className="lg:col-span-5">
            <div className={`${s.frame} aspect-square`}>
              <Image src={`${IMG}/props.webp`} alt="A rolled mat, cork blocks, a strap and a candle on wooden boards" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={120}>
            <Quote {...TESTIMONIALS[0]} />
            <p className={`${s.body} mt-10`}>
              Seven Mornings is the first week of The Reset, given away. If day
              seven leaves you wanting the other seven weeks, that is where to go.
            </p>
            <Button href={`${BASE}/the-reset`} variant="ghost" className="mt-6">
              About The Reset
            </Button>
          </Reveal>
        </div>
      </section>

      <MindfulFooter />
    </main>
  );
}
