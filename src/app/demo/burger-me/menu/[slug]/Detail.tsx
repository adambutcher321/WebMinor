"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ExplodedBurger, { burgerScale } from "../../engine/ExplodedBurger";
import { BURGERS, bySlug, formatPrice, type Burger } from "../../engine/burgers";
import { INGREDIENTS } from "../../engine/ingredients";
import { takeFlip } from "../../flip";
import { useBag } from "../../BagProvider";
import s from "../../burger-me.module.css";

const REST = 0.62;
const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

export default function Detail({ initial }: { initial: string }) {
  const start = bySlug(initial)!;
  const [burger, setBurger] = useState<Burger>(start);
  const [copy, setCopy] = useState<Burger>(start);
  const [explode, setExplode] = useState(0);
  const [infoIn, setInfoIn] = useState(false);
  const [labels, setLabels] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const flip = useRef<DOMRect | null | undefined>(undefined);
  const urlSlug = useRef(initial);
  const bag = useBag();

  // The hand-off. Everything is measured from the stage's untransformed layout box before any transform goes on.
  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => { setExplode(REST); setInfoIn(true); });
      return;
    }
    if (flip.current === undefined) flip.current = takeFlip(initial); // read once: dev StrictMode runs this twice
    const card = flip.current;
    const timers: number[] = [];
    const anims: Animation[] = [];
    let from = "translate(0, 2%) scale(0.92)";
    let origin = "50% 60%";
    if (card) {
      // Land the card's closed burger on the stage's closed burger: bottom-centre to bottom-centre, scaled by the
      // ratio of the two burgers' own sizes (the layers sit 6% up from the bottom of their stage).
      const me = el.getBoundingClientRect();
      const kCard = burgerScale(card.width, card.height, true, 1);
      const kMe = burgerScale(el.offsetWidth, el.offsetHeight, false, REST);
      const sc = kCard / kMe;
      const dx = card.left + card.width / 2 - (me.left + me.width / 2);
      // Next resets scroll to the top once this page mounts, so place the stage by its document position, not its
      // position under the menu's leftover scroll offset. The card rect is where the user saw it in the viewport.
      const meBottom = me.bottom + window.scrollY;
      const dy = card.bottom - 0.06 * card.height - (meBottom - 0.06 * me.height * sc);
      from = `translate(${dx}px, ${dy}px) scale(${sc})`;
      origin = "50% 100%";
    }
    el.style.transformOrigin = origin;
    anims.push(el.animate(
      [{ transform: from, opacity: card ? 1 : 0 }, { transform: "none", opacity: 1 }],
      { duration: card ? 700 : 500, easing: EASE, fill: "backwards" },
    ));
    if (veil.current) anims.push(veil.current.animate([{ opacity: 0 }, { opacity: 0.45 }], { duration: 700, fill: "forwards" }));
    timers.push(window.setTimeout(() => setExplode(REST), card ? 700 : 450));
    timers.push(window.setTimeout(() => setInfoIn(true), card ? 950 : 700));
    return () => { timers.forEach(clearTimeout); anims.forEach((a) => a.cancel()); };
  }, [initial]);

  // Once the stack has opened the tags come up to full strength (the engine's own ramp only reaches ~40% at rest).
  useEffect(() => {
    if (!explode) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { queueMicrotask(() => setLabels(1)); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 600);
      setLabels(1 - (1 - p) ** 3);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [explode]);

  // Recipe chips: the URL follows, Next's router stays out of it.
  useEffect(() => {
    if (burger.slug === urlSlug.current) return;
    urlSlug.current = burger.slug;
    history.replaceState(null, "", `/demo/burger-me/menu/${burger.slug}`);
  }, [burger.slug]);

  const rows = burger.stack.reduce<{ label: string; n: number }[]>((acc, l) => {
    const label = INGREDIENTS[l.type].label;
    const hit = acc.find((r) => r.label === label);
    if (hit) hit.n++;
    else acc.push({ label, n: 1 });
    return acc;
  }, []);
  const num = BURGERS.findIndex((b) => b.slug === copy.slug) + 1;

  return (
    <main className={`${s.detail} ${s.stageGround}`}>
      <div ref={veil} className={s.veil} aria-hidden="true" />
      <div className={s.detailStage}>
        <div ref={wrap} className={s.detailBurger}>
          <ExplodedBurger burger={burger} explode={explode} labels={labels} fit={REST} interactive onSwap={setCopy} />
        </div>
      </div>
      <div className={s.detailInfo} data-in={infoIn}>
        <Link href="/demo/burger-me/menu" className={s.back}>← All burgers</Link>
        <p className={s.kicker}>The menu · {String(num).padStart(2, "0")}</p>
        <div key={copy.slug} className={s.swapIn}>
          <h1 className={`${s.display} ${s.detailName}`}>{copy.name}</h1>
          <p className={s.tagline}>{copy.tagline}</p>
          <p className={s.desc}>{copy.description}</p>
          <ul className={s.inIt}>
            {rows.map((r) => <li key={r.label}>{r.label}{r.n > 1 ? ` ×${r.n}` : ""}</li>)}
          </ul>
          <p className={s.allergens}>{copy.allergens}</p>
          <p className={`${s.price} ${s.builtPrice}`}>{formatPrice(copy.price)}</p>
        </div>
        <button className={s.btn} onClick={() => { bag.add(copy.slug); bag.setOpen(true); }}>Add to bag</button>
        <p className={s.kicker} style={{ marginTop: 32 }}>Try another</p>
        <div className={s.chips}>
          {BURGERS.filter((b) => b.slug !== burger.slug).map((b) => (
            <button key={b.slug} className={s.chip} onClick={() => setBurger(b)}>{b.name}</button>
          ))}
        </div>
      </div>
    </main>
  );
}
