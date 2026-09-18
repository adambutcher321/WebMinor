import type { Metadata } from "next";
import Space from "../Space";
import { COPY, FIGURES } from "../content";
import { Reveal, Counter } from "../motion";
import s from "../threshold.module.css";

export const metadata: Metadata = { title: { absolute: "About — Threshold | WebMinor Concept" } };

export default function AboutPage() {
  return (
    <main>
      <header className={`${s.onNavy} ${s.pageHead}`}>
        <p className={s.eyebrow}>About</p>
        <h1 className={`${s.display} ${s.pageTitle}`}>The line at the door</h1>
        <p className={s.pageLine}>{COPY.heroLine}</p>
      </header>
      <section className={`${s.onFrost} ${s.about}`}>
        <Reveal className={s.aboutBody}>
          <p className={`${s.display} ${s.manifestoLead}`}>{COPY.manifesto[0]}</p>
          <p className={s.manifestoLine}>{COPY.manifesto[1]}</p>
          <p className={s.manifestoLine}>{COPY.manifesto[2]}</p>
          <p className={s.manifestoLine}>Marek Nowak took the lease in 2016 with one rack and a plan for four members. The bar across the door came from the first rig he built; when he replaced it he set the old one in the floor. Everyone steps over it on the way in, which is where the name comes from.</p>
        </Reveal>
        <Reveal className={s.figures} delay={200}>
          <div><Counter value={FIGURES.years} className={s.figure} /><span>years open</span></div>
          <div><Counter value={FIGURES.coaches} className={s.figure} /><span>coaches</span></div>
          <div><Counter value={FIGURES.sessionsAWeek} className={s.figure} /><span>sessions a week</span></div>
        </Reveal>
      </section>
      <Space />
    </main>
  );
}
