import { useId } from "react";
import s from "./burger-me.module.css";

/* Client-approved wordmark (candidate 3, "bun cross-section"): BURGER, a round
   bun cross-section where an O would sit (sesame dome, smashed patty with a
   lacy edge, base), then ME in the accent. Size it with font-size; BURGER and
   the bun follow currentColor, ME and the patty follow --logo-accent
   (mustard by default). The gaps between the three layers are real negative
   space so the mark holds at 24px. */
const SEEDS: [number, number, number][] = [[34, 24, -30], [52, 17, 5], [68, 25, 35], [46, 33, 0], [60, 36, -20], [26, 38, -50]];

function BunMark() {
  const id = `${useId()}-seeds`;
  return (
    <svg className={s.logoMark} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <mask id={id}>
          <rect width="100" height="100" fill="#fff" />
          {SEEDS.map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx="3.4" ry="1.7" transform={`rotate(${r} ${x} ${y})`} fill="#000" />
          ))}
        </mask>
      </defs>
      <path mask={`url(#${id})`} fill="currentColor" d="M5 43C5 16 26 4 50 4s45 12 45 39z" />
      <path fill="var(--logo-accent, var(--bm-mustard))" d="M3 48h94v10l-3.5 2.5 1.2 3-4.2-1.6-2.8 3.4-3-3.2-4.6 2.3-3-3-4 2.6-3.2-3-5 2.2-3.4-2.6-4.4 2.4-3-3-4.8 2.6-3-2.6-4.6 2.2-3.4-3.2-4.2 2.4-2.6-3L3 62z" />
      <path fill="currentColor" d="M5 74h90c0 15-11 22-26 22H31C16 96 5 89 5 74z" />
    </svg>
  );
}

export default function Logo({ className }: { className?: string }) {
  return (
    <span className={`${s.logo}${className ? ` ${className}` : ""}`} role="img" aria-label="Burger Me">
      <span aria-hidden="true">Burger</span>
      <BunMark />
      <span aria-hidden="true" className={s.logoMe}>Me</span>
    </span>
  );
}
