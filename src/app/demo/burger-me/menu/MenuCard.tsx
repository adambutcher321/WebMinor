"use client";

import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import ExplodedBurger from "../engine/ExplodedBurger";
import { formatPrice, type Burger } from "../engine/burgers";
import { INGREDIENTS } from "../engine/ingredients";
import { recordFlip } from "../flip";
import s from "../burger-me.module.css";

/* Hover is mouse-only: on touch the card is just a link. The VIEW pill rides
   the cursor through two CSS variables written relative to the card. */
function follow(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--vx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--vy", `${e.clientY - r.top}px`);
}

export default function MenuCard({ burger, index }: { burger: Burger; index: number }) {
  const [hover, setHover] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  return (
    <Link
      href={`/demo/burger-me/menu/${burger.slug}`}
      className={s.card}
      data-hover={hover}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") { follow(e); setHover(true); } }}
      onPointerMove={(e) => e.pointerType === "mouse" && follow(e)}
      onPointerLeave={() => setHover(false)}
      onClick={() => stage.current && recordFlip(burger.slug, stage.current)}
    >
      <span className={s.cardNum}>{String(index + 1).padStart(2, "0")}</span>
      <div ref={stage} className={s.cardStage}>
        <ExplodedBurger burger={burger} explode={hover ? 0.12 : 0} compact />
      </div>
      <div className={s.cardBody}>
        <h2 className={`${s.display} ${s.cardName}`}>{burger.name}</h2>
        <p className={s.cardTag}>{burger.tagline}</p>
        {burger.adds.length > 0 && <p className={s.adds}>+ {burger.adds.map((t) => INGREDIENTS[t].label).join(" + ")}</p>}
        <p className={`${s.price} ${s.cardPrice}`}>{formatPrice(burger.price)}</p>
      </div>
      <span className={s.viewPill} aria-hidden="true">View</span>
    </Link>
  );
}
