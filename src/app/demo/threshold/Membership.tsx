"use client";

import { useEffect, useState } from "react";
import { LEVELS, priceFor, type Billing } from "./content";
import { useBooking } from "./BookingProvider";
import { useMediaQuery } from "../useClientEnv";
import { REDUCED, Reveal, Magnetic } from "./motion";
import s from "./threshold.module.css";

/* The level the visitor last chose; JoinFlow reads it when it opens. */
export const chosen: { levelIndex: number; billing: Billing } = { levelIndex: 2, billing: "monthly" };

/** Tweens towards `target` over `ms`; jumps under reduced motion. */
export function useTween(target: number, ms = 500): number {
  const reduced = useMediaQuery(REDUCED);
  const [v, setV] = useState(target);
  useEffect(() => {
    if (reduced) { const id = requestAnimationFrame(() => setV(target)); return () => cancelAnimationFrame(id); }
    let raf = 0;
    const from = v;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(from + (target - from) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, ms, reduced]);
  return v;
}

export default function Membership({ standalone = false }: { standalone?: boolean }) {
  const [levelIndex, setLevel] = useState(chosen.levelIndex);
  const [billing, setBilling] = useState<Billing>(chosen.billing);
  const { setJoinOpen, membership } = useBooking();
  const price = priceFor(levelIndex, billing);
  const shown = useTween(price.perMonth);

  const pick = (i: number) => { setLevel(i); chosen.levelIndex = i; };
  const bill = (b: Billing) => { setBilling(b); chosen.billing = b; };

  return (
    <section id="membership" className={`${s.onFrost} ${s.membership}`} data-standalone={standalone}>
      <Reveal>
        <p className={s.eyebrow}>Membership</p>
        <h2 className={`${s.display} ${s.h2}`}>Pick how often</h2>
        <p className={s.memberLine}>One price, no joining fee, cancel with a month&apos;s notice. Move the slider and the number moves with it.</p>
      </Reveal>

      <Reveal className={s.sliderCard} delay={120}>
        <div className={s.billing} role="group" aria-label="Billing">
          <button type="button" data-on={billing === "monthly"} onClick={() => bill("monthly")}>Monthly</button>
          <button type="button" data-on={billing === "annual"} onClick={() => bill("annual")}>Annual</button>
        </div>

        <p className={`${s.display} ${s.price}`}>
          <span data-testid="price">£{shown}</span>
          <small>a month</small>
        </p>
        <p className={s.levelLabel}>{LEVELS[levelIndex].label}</p>

        <input
          type="range" min={0} max={LEVELS.length - 1} step={1} value={levelIndex}
          aria-label="Sessions a week" aria-valuetext={LEVELS[levelIndex].label}
          onChange={(e) => pick(Number(e.target.value))} className={s.range}
          style={{ "--v": levelIndex / (LEVELS.length - 1) } as React.CSSProperties}
        />
        <div className={s.ticks} aria-hidden="true">
          {LEVELS.map((l, i) => <span key={l.label} data-on={i <= levelIndex}>{l.sessions === "unlimited" ? "∞" : l.sessions}</span>)}
        </div>

        <p className={s.saving} data-testid="saving">
          {billing === "annual" ? `£${price.perYear} a year, saving £${price.saving}` : `£${price.perYear} over a year. Annual saves two months.`}
        </p>

        <Magnetic>
          <button type="button" className={s.pill} onClick={() => setJoinOpen(true)}>
            {membership ? "Change my level" : "Join at this level"}
          </button>
        </Magnetic>
      </Reveal>
    </section>
  );
}
