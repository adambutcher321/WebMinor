import type { Metadata } from "next";
import { Suspense } from "react";
import { TintFromQuery } from "../Tint";
import Nav from "../Nav";
import CartDrawer from "../CartDrawer";
import Footer from "../Footer";
import Reveal from "../Reveal";
import SizeFinder from "./SizeFinder";
import { FIT_NOTES } from "../shop";
import s from "../boucher.module.css";

export const metadata: Metadata = {
  title: { absolute: "Size guide — Boucher Tailored | WebMinor Concept" },
  description: "Two sliders and one honest answer. Chest and length for every size of the puffer.",
};

/* Reads ?c= so the diagram shows the colourway you came from. */
export default function SizeGuidePage() {
  return (
    <Suspense fallback={<div className={s.tint} style={{ minHeight: "100vh" }} />}>
      <TintFromQuery autoplay={false}>
        <main className={s.screen}>
          <Nav />
          <section className={`${s.section} pb-8`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <Reveal className="lg:col-span-8">
                <p className={s.micro}>Size guide</p>
                <h1 className={`${s.display} mt-4`}>Two sliders. One honest answer.</h1>
              </Reveal>
              <Reveal className="lg:col-span-4">
                <p className={s.body}>
                  The jacket comes in five sizes and we would rather you got it right
                  first time than posted it back. Chest decides, height nudges, and
                  if you want a jumper under it we go up one.
                </p>
              </Reveal>
            </div>
          </section>
          <section className={`${s.section} pt-6`}>
            <Reveal>
              <SizeFinder />
            </Reveal>
          </section>
          <section className={`${s.section} pt-0`}>
            <Reveal>
              <div className={`${s.card} p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8`}>
                {FIT_NOTES.map((n) => (
                  <div key={n.k}>
                    <p className={s.micro}>{n.k}</p>
                    <p className="mt-2 text-[15px] leading-relaxed">{n.v}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>
          <Footer />
        </main>
        <CartDrawer />
      </TintFromQuery>
    </Suspense>
  );
}
