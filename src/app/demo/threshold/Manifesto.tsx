import { COPY, FIGURES } from "./content";
import { Reveal, Counter } from "./motion";
import s from "./threshold.module.css";

export default function Manifesto() {
  return (
    <section id="manifesto" className={`${s.onFrost} ${s.manifesto}`}>
      <Reveal>
        <p className={s.eyebrow}>The studio</p>
      </Reveal>
      <div className={s.manifestoBody}>
        {COPY.manifesto.map((line, i) => (
          <Reveal key={line} delay={i * 120}>
            <p className={i === 0 ? `${s.display} ${s.manifestoLead}` : s.manifestoLine}>{line}</p>
          </Reveal>
        ))}
      </div>
      <Reveal className={s.figures} delay={360}>
        <div><Counter value={FIGURES.years} className={s.figure} /><span>years open</span></div>
        <div><Counter value={FIGURES.coaches} className={s.figure} /><span>coaches</span></div>
        <div><Counter value={FIGURES.sessionsAWeek} className={s.figure} /><span>sessions a week</span></div>
      </Reveal>
    </section>
  );
}
