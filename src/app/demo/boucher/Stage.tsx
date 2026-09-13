"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, ArrowRight } from "lucide-react";
import { useCart } from "./CartProvider";
import { useTint } from "./Tint";
import Link from "next/link";
import { BASE, COLOURWAYS, SIZES, money, type Size } from "./shop";
import s from "./boucher.module.css";

/*
  The product stage. Five jackets are always in the DOM, absolutely stacked;
  only their data-state changes, so the swap is a pure CSS transition and the
  incoming image is already decoded. The tilt follows the cursor through two
  CSS variables written straight to the element, so it never re-renders React.
*/

function Social({ label, d }: { label: string; d: string }) {
  return (
    <a href="#" aria-label={label} className="opacity-70 hover:opacity-100 transition-opacity" onClick={(e) => e.preventDefault()}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={d} />
      </svg>
    </a>
  );
}

const SOCIALS = [
  { label: "Instagram", d: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM21 8.6c0-1.9-.5-3.5-1.9-4.8C17.8 2.5 16.2 2 14.4 2H9.6C7.8 2 6.2 2.5 4.9 3.8 3.5 5.1 3 6.7 3 8.6v6.8c0 1.9.5 3.5 1.9 4.8 1.3 1.3 2.9 1.8 4.7 1.8h4.8c1.8 0 3.4-.5 4.7-1.8 1.4-1.3 1.9-2.9 1.9-4.8V8.6zm-1.8 6.8c0 1.4-.4 2.5-1.3 3.4-.9.9-2 1.3-3.4 1.3H9.5c-1.4 0-2.5-.4-3.4-1.3-.9-.9-1.3-2-1.3-3.4V8.6c0-1.4.4-2.5 1.3-3.4.9-.9 2-1.3 3.4-1.3h5c1.4 0 2.5.4 3.4 1.3.9.9 1.3 2 1.3 3.4v6.8z" },
  { label: "Facebook", d: "M13.5 22v-8.2h2.8l.4-3.3h-3.2V8.4c0-.9.3-1.6 1.6-1.6h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4v3.3h2.8V22h3.3z" },
  { label: "Dribbble", d: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.6 4.6a8.5 8.5 0 0 1 1.9 5.3c-.3-.1-3.1-.6-5.9-.3-.1-.1-.1-.3-.2-.4-.2-.4-.4-.8-.6-1.2 3.1-1.3 4.5-3.1 4.8-3.4zM12 3.5c2.2 0 4.1.8 5.6 2.1-.2.3-1.5 2-4.5 3.1-1.4-2.5-2.9-4.6-3.1-4.9.6-.2 1.3-.3 2-.3zm-3.7.8c.2.3 1.7 2.4 3.1 4.9-3.9 1-7.4 1-7.8 1a8.6 8.6 0 0 1 4.7-5.9zM3.5 12v-.3c.4 0 4.5.1 8.7-1.2.2.5.5.9.7 1.4l-.3.1c-4.4 1.4-6.7 5.3-6.9 5.6A8.5 8.5 0 0 1 3.5 12zm8.5 8.5c-2 0-3.8-.7-5.3-1.8.2-.3 1.8-3.6 6.5-5.2h.1c1.2 3 1.6 5.5 1.8 6.3-1 .4-2 .7-3.1.7zm4.5-1.5c-.1-.6-.5-3-1.5-5.8 2.7-.4 5 .3 5.3.4a8.5 8.5 0 0 1-3.8 5.4z" },
  { label: "Behance", d: "M7.4 5.5c.7 0 1.3.1 1.9.2.6.1 1 .3 1.4.6.4.3.7.6.9 1.1.2.4.3 1 .3 1.6 0 .7-.2 1.3-.5 1.8s-.8.9-1.4 1.2c.9.2 1.5.7 1.9 1.3.4.6.6 1.4.6 2.2 0 .7-.1 1.3-.4 1.8-.3.5-.6.9-1.1 1.2-.4.3-1 .6-1.5.7-.6.1-1.2.2-1.8.2H2V5.5h5.4zm-.3 5.4c.6 0 1-.1 1.4-.4.4-.3.5-.7.5-1.3 0-.3-.1-.6-.2-.8-.1-.2-.3-.4-.5-.5-.2-.1-.4-.2-.7-.2-.3 0-.5-.1-.8-.1H4.9v3.3h2.2zm.2 5.7c.3 0 .6 0 .9-.1.3-.1.5-.2.7-.3.2-.2.4-.4.5-.6.1-.3.2-.6.2-1 0-.8-.2-1.3-.7-1.7-.4-.3-1-.5-1.7-.5H4.9v4.2h2.4zM16.4 16.5c.4.4 1 .6 1.7.6.5 0 1-.1 1.4-.4.4-.3.6-.6.7-.9h2.3c-.4 1.2-.9 2-1.7 2.5-.8.5-1.7.8-2.8.8-.8 0-1.5-.1-2.1-.4-.6-.2-1.1-.6-1.6-1-.4-.4-.8-1-1-1.6-.2-.6-.3-1.3-.3-2.1 0-.7.1-1.4.4-2 .2-.6.6-1.2 1-1.6.4-.5 1-.8 1.6-1.1.6-.3 1.3-.4 2-.4.8 0 1.5.2 2.1.5.6.3 1.1.7 1.5 1.3.4.5.7 1.1.8 1.8.2.7.2 1.4.2 2.1h-6.9c0 .8.3 1.5.7 1.9zm3-5c-.3-.3-.8-.5-1.5-.5-.4 0-.8.1-1.1.2-.3.1-.5.3-.7.5-.2.2-.3.4-.4.7-.1.2-.1.5-.1.7h4.5c-.1-.7-.3-1.2-.7-1.6zM15.5 6.6h5.6V8h-5.6V6.6z" },
];

export default function Stage() {
  const { index, active, prev, dir, next, back, go } = useTint();
  const { add, wishlist, toggleWish } = useCart();
  const [size, setSize] = useState<Size>("M");
  const tiltRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);

  const nextIndex = (index + 1) % COLOURWAYS.length;
  const upcoming = COLOURWAYS[nextIndex];
  const wished = wishlist.includes(active.slug);

  // Cursor tilt, written as CSS variables, never through state.
  const onMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = tiltRef.current;
    const host = stageRef.current;
    if (!el || !host || e.pointerType !== "mouse") return;
    const r = host.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${x * 14}deg`);
    el.style.setProperty("--rx", `${-y * 10}deg`);
  }, []);

  const onLeave = useCallback(() => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  }, []);

  // Arrow keys switch colourway.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, back]);

  const stateFor = (i: number): "active" | "leaving" | "idle" => (i === index ? "active" : i === prev ? "leaving" : "idle");
  // Where a jacket sits when not active: leaving goes the opposite way from the direction of travel.
  const sideFor = (i: number) => {
    if (i === prev) return dir === 1 ? "left" : "right";
    return dir === 1 ? "right" : "left";
  };

  return (
    <section
      ref={stageRef}
      className={s.stage}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label="Choose a colourway"
    >
      {/* Left: the pitch */}
      <div className="relative z-10 max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <button type="button" className={s.arrow} onClick={back} aria-label="Previous colourway">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button type="button" className={s.arrow} onClick={next} aria-label="Next colourway">
            <ChevronRight className="w-5 h-5" />
          </button>
          <span className={`${s.micro} ml-3`} aria-live="polite">
            {String(index + 1).padStart(2, "0")} / {String(COLOURWAYS.length).padStart(2, "0")} · {active.name}
          </span>
        </div>
        <h1 className={s.display}>
          Stand out
          <br />
          without trying
        </h1>
        <p className={`${s.body} mt-6 max-w-sm`}>
          It is not about staying warm. It is about stepping outside and feeling,
          instantly, like yourself. One jacket, cut short and filled deep, in
          colours that do not ask permission.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <button type="button" className={`${s.btn} ${s.btnFg}`} onClick={() => add(active.slug, size)}>
            Get the look <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`${s.iconBtn} w-12 h-12`}
            aria-pressed={wished}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            onClick={() => toggleWish(active.slug)}
          >
            <Heart className="w-5 h-5" fill={wished ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="mt-12 hidden lg:flex items-center gap-6">
          {SOCIALS.map((so) => (
            <Social key={so.label} {...so} />
          ))}
        </div>
      </div>

      {/* Centre: the jacket */}
      <div className={s.product}>
        <div className={s.shadow} aria-hidden="true" />
        <div className={s.floatWrap}>
          <div ref={tiltRef} className={s.tilt}>
            {COLOURWAYS.map((c, i) => (
              <div key={c.slug} className={s.jacket} data-state={stateFor(i)} data-side={sideFor(i)}>
                {/* Plain img: the cutouts are transparent PNGs and must not be re-encoded. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.cutout} alt={i === index ? c.alt : ""} draggable={false} loading={i === index ? "eager" : "lazy"} decoding="async" />
              </div>
            ))}
          </div>
        </div>
        <p key={active.slug} className={`${s.tagline} ${s.fresh} absolute inset-x-0 -bottom-6 lg:-bottom-8`}>
          {active.tagline}
        </p>
      </div>

      {/* Right: price, size, next */}
      <div className="relative z-10 flex flex-col lg:items-end gap-8">
        <div key={active.slug} className={`${s.fresh} lg:text-right`}>
          <p className={s.price}>{money(active.price)}</p>
          <p className={`${s.was} mt-1`}>{money(active.was)}</p>
          {active.limited && <p className={`${s.micro} mt-3`}>Limited run of 300</p>}
        </div>

        <div className="lg:text-right">
          <p className={`${s.micro} flex items-center gap-3 lg:justify-end`}>
            Choose your size
            <Link href={`${BASE}/size-guide?c=${active.slug}`} className="normal-case tracking-normal underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity" style={{ letterSpacing: 0 }}>
              Size guide
            </Link>
          </p>
          <div className="mt-4 flex flex-wrap gap-2 lg:justify-end" role="group" aria-label="Size">
            {SIZES.map((sz) => (
              <button key={sz} type="button" className={s.chip} aria-pressed={size === sz} onClick={() => setSize(sz)}>
                {sz}
              </button>
            ))}
          </div>
        </div>

        <div className={`${s.dots} lg:justify-end`} role="group" aria-label="Colourway">
          {COLOURWAYS.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              className={s.dot}
              aria-pressed={i === index}
              aria-label={c.name}
              onClick={() => go(i)}
              style={{ background: c.slug === "doodle" ? "conic-gradient(#ff5fa2, #ffd23f, #6ee7b7, #60a5fa, #c084fc, #ff5fa2)" : c.bg }}
            />
          ))}
        </div>

        <button type="button" className="group text-left lg:text-right lg:mt-auto" onClick={next} aria-label={`Next: ${upcoming.name}`}>
          <p className={`${s.micro} mb-3`}>
            Next · {upcoming.name}
          </p>
          <div className={`${s.thumb} lg:ml-auto`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={upcoming.cutout} alt="" draggable={false} />
          </div>
        </button>
      </div>
    </section>
  );
}
