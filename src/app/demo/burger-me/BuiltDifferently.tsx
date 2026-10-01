"use client";

import { useState } from "react";
import ExplodedBurger from "./engine/ExplodedBurger";
import { BURGERS, formatPrice } from "./engine/burgers";
import { INGREDIENTS } from "./engine/ingredients";
import { useBag } from "./BagProvider";
import s from "./burger-me.module.css";

export default function BuiltDifferently() {
  const [selected, setSelected] = useState(BURGERS[0]);
  const [copy, setCopy] = useState(BURGERS[0]);
  const bag = useBag();
  return (
    <section className={`${s.built} ${s.stageGround}`} aria-labelledby="built-title">
      <div className={s.builtCopy}>
        <p className={s.kicker}>Built differently</p>
        <div key={copy.slug} className={s.swapIn}>
          <h2 id="built-title" className={`${s.display} ${s.builtName}`}>{copy.name}</h2>
          {copy.adds.length > 0 && (
            <p className={s.adds}>Adds: {copy.adds.map((t) => INGREDIENTS[t].label).join(" + ")}</p>
          )}
          <p className={s.tagline}>{copy.tagline}</p>
          <p className={s.desc}>{copy.description}</p>
          <p className={`${s.price} ${s.builtPrice}`}>{formatPrice(copy.price)}</p>
        </div>
        <button className={s.btn} onClick={() => { bag.add(copy.slug); bag.setOpen(true); }}>Add to bag</button>
        <div className={s.chips} role="group" aria-label="Choose a burger">
          {BURGERS.map((b) => (
            <button key={b.slug} className={s.chip} data-on={b.slug === selected.slug} aria-pressed={b.slug === selected.slug} onClick={() => setSelected(b)}>
              {b.name}
            </button>
          ))}
        </div>
      </div>
      <div className={s.builtStage}>
        <ExplodedBurger burger={selected} interactive fit={0.6} labels={0} onSwap={setCopy} />
      </div>
    </section>
  );
}
