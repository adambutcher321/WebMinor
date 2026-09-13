"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import Reveal from "../Reveal";
import { useCart } from "../CartProvider";
import { useTint } from "../Tint";
import { BASE, COLOURWAYS, SIZES, money, type Colourway, type Size } from "../shop";
import s from "../boucher.module.css";

function Card({ c }: { c: Colourway }) {
  const { add, wishlist, toggleWish } = useCart();
  const { go } = useTint();
  const [size, setSize] = useState<Size>("M");
  const [hover, setHover] = useState(false);
  const wished = wishlist.includes(c.slug);
  const i = COLOURWAYS.indexOf(c);

  return (
    <article
      className={`${s.card} flex flex-col`}
      style={{ background: c.bg, color: c.fg }}
      onPointerEnter={() => {
        setHover(true);
        go(i);
      }}
      onPointerLeave={() => setHover(false)}
    >
      <Link href={`${BASE}?c=${c.slug}`} className="relative block aspect-[4/5] overflow-hidden" aria-label={`${c.name} on the stage`}>
        <Image src={c.look} alt={c.lookAlt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-opacity duration-700" style={{ opacity: hover ? 0 : 1 }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.cutout} alt="" className="absolute inset-[12%] w-[76%] h-[76%] object-contain transition-all duration-700" style={{ opacity: hover ? 1 : 0, transform: hover ? "none" : "translateY(16px) scale(0.96)" }} loading="lazy" />
        {c.limited && <span className={`${s.micro} absolute top-4 left-4 px-3 py-1.5 rounded-full`} style={{ background: c.fg, color: c.bg }}>300 only</span>}
        <button
          type="button"
          className="absolute top-3 right-3 w-9 h-9 rounded-full inline-flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.25)", color: "#fff" }}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${c.name} from wishlist` : `Add ${c.name} to wishlist`}
          onClick={(e) => {
            e.preventDefault();
            toggleWish(c.slug);
          }}
        >
          <Heart className="w-4 h-4" fill={wished ? "currentColor" : "none"} />
        </button>
      </Link>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-semibold" style={{ fontFamily: "var(--display)" }}>
            The Puffer · {c.name}
          </h2>
          <p className="text-sm tabular-nums">
            {money(c.price)} <span className="opacity-60 line-through ml-1">{money(c.was)}</span>
          </p>
        </div>
        <p className="mt-2 text-sm opacity-75 leading-relaxed">{c.note}</p>
        <div className="mt-4 flex flex-wrap items-center gap-1.5" role="group" aria-label={`Size for ${c.name}`}>
          {SIZES.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setSize(sz)}
              aria-pressed={size === sz}
              className="w-9 h-9 rounded-full text-xs font-semibold transition-colors"
              style={size === sz ? { background: c.fg, color: c.bg } : { background: c.panel, color: c.fg }}
            >
              {sz}
            </button>
          ))}
          <Link href={`${BASE}/size-guide?c=${c.slug}`} className="ml-2 text-xs underline underline-offset-4 opacity-75 hover:opacity-100">
            Size guide
          </Link>
        </div>
        <button type="button" className={`${s.btn} mt-5 w-full justify-center`} style={{ background: c.fg, color: c.bg }} onClick={() => add(c.slug, size)}>
          Add {size} to basket
        </button>
      </div>
    </article>
  );
}

export default function ShopGrid() {
  const { wishlist } = useCart();
  const wished = COLOURWAYS.filter((c) => wishlist.includes(c.slug));
  return (
    <>
      <section className={`${s.section} pb-8`}>
        <Reveal>
          <p className={s.micro}>All products</p>
          <h1 className={`${s.display} mt-4 max-w-3xl`} style={{ fontSize: "clamp(2.2rem, 4.6vw, 4rem)" }}>
            One jacket. That is the whole shop.
          </h1>
          <p className={`${s.body} mt-6 max-w-lg`}>
            We make the puffer, in five colours, in five sizes. Hover a card and
            the page changes colour with it. When we make a second thing, it will
            go here.
          </p>
        </Reveal>
      </section>
      <section className={`${s.section} pt-4`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COLOURWAYS.map((c) => (
            <Reveal key={c.slug}>
              <Card c={c} />
            </Reveal>
          ))}
        </div>
      </section>
      <section id="wishlist" className={`${s.section} pt-0 scroll-mt-24`}>
        <Reveal>
          <div className={`${s.rule} pt-8`}>
            <p className={s.micro}>Wishlist</p>
            {wished.length === 0 ? (
              <p className={`${s.body} mt-3`}>Nothing saved yet. The heart on any card keeps it here.</p>
            ) : (
              <ul className="mt-4 flex flex-wrap gap-3">
                {wished.map((c) => (
                  <li key={c.slug}>
                    <Link href={`${BASE}?c=${c.slug}`} className={`${s.btn} ${s.btnPanel}`}>
                      <span className="w-3 h-3 rounded-full" style={{ background: c.bg, boxShadow: "0 0 0 1px rgba(255,255,255,0.4)" }} />
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </section>
    </>
  );
}
