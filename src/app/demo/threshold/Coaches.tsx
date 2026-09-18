"use client";

import { useState, type MouseEvent } from "react";
import { COACHES } from "./content";
import { Reveal } from "./motion";
import s from "./threshold.module.css";

/*
  Each column stacks a portrait under an action shot that fades in on hover
  or keyboard focus. Touch has neither, so a tap on a frame that isn't
  already previewed reveals the action shot instead of following the link
  straight away; tapping the same frame again (now previewed) follows it
  through to the coach's profile on /coaches. Desktop pointers ignore this
  entirely -- `matchMedia("(hover: none)")` only matches touch input, and
  it's read at click time rather than during render, so it never affects
  layout or hydration.
*/
export default function Coaches({ long = false }: { long?: boolean }) {
  const [previewed, setPreviewed] = useState<string | null>(null);

  const onFrameClick = (slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (previewed === slug) return;
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
      e.preventDefault();
      setPreviewed(slug);
    }
  };

  return (
    <section id="coaches" className={`${s.onNavy} ${s.coaches}`}>
      <header className={s.coachesHead}>
        <p className={s.eyebrow}>Coaches</p>
        <h2 className={`${s.display} ${s.h2}`}>Four people, no rota</h2>
      </header>
      <ul className={s.roster}>
        {COACHES.map((c, i) => (
          <Reveal as="li" key={c.slug} delay={i * 110} className={s.coach}>
            <a
              href={`/demo/threshold/coaches#${c.slug}`}
              className={s.coachFrame}
              tabIndex={long ? -1 : 0}
              data-previewed={previewed === c.slug}
              onClick={onFrameClick(c.slug)}
            >
              <img src={c.portrait} alt={`${c.name}, ${c.discipline} coach`} loading="lazy" decoding="async" />
              <img src={c.action} alt="" aria-hidden="true" data-testid="action" className={s.coachAction} loading="lazy" decoding="async" />
              <span className={`${s.display} ${s.coachVertical}`} aria-hidden="true">{c.name.split(" ")[0]}</span>
            </a>
            <div className={s.coachText} id={long ? c.slug : undefined}>
              <h3 className={s.coachName}>{c.name}</h3>
              <p className={s.coachDiscipline}>{c.discipline}</p>
              <p className={s.coachLine}>{c.line}</p>
              {long && <p className={s.coachBio}>{c.bio}</p>}
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
