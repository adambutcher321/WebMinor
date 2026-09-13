"use client";

import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import Reveal from "./Reveal";
import { useTint } from "./Tint";
import { useCart } from "./CartProvider";
import { COLOURWAYS, DETAILS, IMG, REVIEWS, money } from "./shop";
import s from "./boucher.module.css";

/* Everything under the stage. Each section reads the tint, so the page stays
   one colour top to bottom, and the range strip can switch it. */

export function Range() {
  const { index, go } = useTint();
  const { add } = useCart();
  const jump = (i: number) => {
    go(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <section className={s.section} id="range">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className={s.micro}>The range</p>
          <h2 className={`${s.h2} mt-3`}>One jacket, five ways.</h2>
        </div>
        <p className={`${s.body} max-w-sm`}>
          Same cut, same fill, same zip. The only decision is the colour, and we
          have made that one hard on purpose.
        </p>
      </Reveal>
      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {COLOURWAYS.map((c, i) => (
          <Reveal key={c.slug}>
            <div className={`${s.card} group`} style={{ background: c.bg, color: c.fg }}>
              <button type="button" onClick={() => jump(i)} className="block w-full aspect-[4/5] relative" aria-label={`View ${c.name}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.cutout} alt={c.alt} className={`${s.cardImg} absolute inset-[10%] w-[80%] h-[80%] object-contain`} loading="lazy" />
                {i === index && <span className={`${s.micro} absolute top-4 left-4`} style={{ color: c.fg }}>Showing</span>}
                {c.limited && <span className={`${s.micro} absolute top-4 right-4`} style={{ color: c.fg }}>300 only</span>}
              </button>
              <div className="px-4 pb-4 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold" style={{ fontFamily: "var(--display)" }}>{c.name}</p>
                  <p className="text-xs opacity-70 tabular-nums">{money(c.price)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => add(c.slug, "M")}
                  className="w-9 h-9 rounded-full inline-flex items-center justify-center transition-transform hover:scale-110"
                  style={{ background: c.fg, color: c.bg }}
                  aria-label={`Add ${c.name} in M to basket`}
                >
                  +
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function DoodleStory() {
  const { go } = useTint();
  const doodle = COLOURWAYS.find((c) => c.slug === "doodle")!;
  return (
    <section className={s.section}>
      <Reveal>
        <div className={`${s.card} grid grid-cols-1 lg:grid-cols-12 !rounded-[32px]`}>
          <div className="relative lg:col-span-6 min-h-[360px] lg:min-h-[620px]">
            <Image src={doodle.look} alt={doodle.lookAlt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="lg:col-span-6 p-8 sm:p-14 flex flex-col justify-center">
            <p className={s.micro}>The Doodle Edition</p>
            <h2 className={`${s.h2} mt-3`}>Forty-one monsters. Three hundred jackets. No two people pick the same favourite.</h2>
            <p className={`${s.body} mt-6 max-w-lg`}>
              Illustrator Mia Okafor drew the print by hand over eleven weeks, one
              character a day, on the back of a delivery menu, a train ticket and,
              at one point, a ceiling. We scanned every sheet, stitched them edge
              to edge and printed the whole thing onto a matte cream shell so the
              black outlines stay black after a winter of rain.
            </p>
            <p className={`${s.body} mt-4 max-w-lg`}>
              Each jacket is numbered inside the collar. When the three hundred
              are gone, the screens are cleaned and the print is retired.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <p>
                <span className={s.price} style={{ fontSize: "2rem" }}>{money(doodle.price)}</span>
                <span className={`${s.was} ml-3`} style={{ fontSize: "1.3rem" }}>{money(doodle.was)}</span>
              </p>
              <button
                type="button"
                className={`${s.btn} ${s.btnFg}`}
                onClick={() => {
                  go(COLOURWAYS.indexOf(doodle));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                See it on the stage <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Details() {
  return (
    <section className={s.section}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <p className={s.micro}>Built, not styled</p>
          <h2 className={`${s.h2} mt-3`}>The shine is the last thing we chose.</h2>
          <p className={`${s.body} mt-6`}>
            Seven hundred fill-power down in six stitched-through baffles, under
            a twenty-denier shell that beads water and does not crackle in the
            cold. It packs into its own pocket and weighs about as much as a
            paperback. The high gloss came last, once everything underneath was
            right.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className={`${s.card} relative aspect-square`}>
              <Image src={`${IMG}/macro-quilt.webp`} alt="Water beading on the black quilting" fill sizes="25vw" className={`${s.cardImg} object-cover`} />
            </div>
            <div className={`${s.card} relative aspect-square`}>
              <Image src={`${IMG}/macro-zip.webp`} alt="The gunmetal two-way zip pull" fill sizes="25vw" className={`${s.cardImg} object-cover`} />
            </div>
          </div>
        </Reveal>
        <Reveal className="lg:col-span-7 lg:pt-2">
          <dl>
            {DETAILS.map((d) => (
              <div key={d.k} className={`${s.rule} grid grid-cols-[9rem_1fr] sm:grid-cols-[12rem_1fr] gap-4 py-4`}>
                <dt className={`${s.micro} pt-1`}>{d.k}</dt>
                <dd className="text-[15px] leading-relaxed">{d.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

export function Editorial() {
  const shots = COLOURWAYS.filter((c) => ["ember", "lime", "cobalt"].includes(c.slug));
  const { go } = useTint();
  return (
    <section className={`${s.section} pt-0`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shots.map((c) => (
          <Reveal key={c.slug}>
            <button
              type="button"
              className={`${s.card} relative aspect-[3/4] w-full text-left`}
              onClick={() => {
                go(COLOURWAYS.indexOf(c));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              aria-label={`Show ${c.name} on the stage`}
            >
              <Image src={c.look} alt={c.lookAlt} fill sizes="(max-width: 768px) 100vw, 33vw" className={`${s.cardImg} object-cover`} />
              <span className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/60 to-transparent text-white">
                <span className={s.micro} style={{ color: "rgba(255,255,255,0.7)" }}>{c.name}</span>
                <span className="block text-sm mt-1">{c.note}</span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Reviews() {
  return (
    <section className={`${s.section} pt-0`}>
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className={s.micro}>Worn, then written about</p>
          <h2 className={`${s.h2} mt-3`}>4.9 from 1,240 winters.</h2>
        </div>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {REVIEWS.map((r) => (
          <Reveal key={r.name}>
            <figure className={`${s.card} p-6 h-full flex flex-col`}>
              <div className="flex gap-0.5" aria-label={`${r.stars} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5" fill={i < r.stars ? "currentColor" : "none"} style={{ opacity: i < r.stars ? 1 : 0.35 }} />
                ))}
              </div>
              <blockquote className="mt-4 text-[15px] leading-relaxed flex-1">{r.text}</blockquote>
              <figcaption className={`${s.micro} mt-5`}>
                {r.name} · {r.colour}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
