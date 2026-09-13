import type { Metadata } from "next";
import { Suspense } from "react";
import { TintFromQuery } from "./Tint";
import Nav from "./Nav";
import Stage from "./Stage";
import CartDrawer from "./CartDrawer";
import Footer from "./Footer";
import { Details, DoodleStory, Editorial, Range, Reviews } from "./Sections";
import s from "./boucher.module.css";

export const metadata: Metadata = {
  title: { absolute: "Boucher Tailored — The Puffer, in five colours | WebMinor Concept" },
  description:
    "A concept outerwear brand by WebMinor: one cropped puffer in five colourways, a page that tints with the jacket, and a working basket.",
};

/*
  The page is a server component; the tint, stage and basket are client
  islands beneath it. TintFromQuery reads ?c= so a shop card can land the
  visitor on its colourway, which is why it needs the Suspense boundary.
*/
export default function BoucherHome() {
  return (
    <Suspense fallback={<div className={s.tint} style={{ minHeight: "100vh" }} />}>
      <TintFromQuery>
        <main className={s.screen}>
          <Nav />
          <Stage />
          <Range />
          <DoodleStory />
          <Details />
          <Editorial />
          <Reviews />
          <Footer />
        </main>
        <CartDrawer />
      </TintFromQuery>
    </Suspense>
  );
}
