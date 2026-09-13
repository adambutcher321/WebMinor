import type { Metadata } from "next";
import { TintProvider } from "../Tint";
import Nav from "../Nav";
import CartDrawer from "../CartDrawer";
import Footer from "../Footer";
import ShopGrid from "./ShopGrid";
import s from "../boucher.module.css";

export const metadata: Metadata = {
  title: { absolute: "All Products — Boucher Tailored | WebMinor Concept" },
  description: "The Puffer in Onyx, Ember, Acid Lime, Cobalt and the Doodle Edition.",
};

export default function ShopPage() {
  return (
    <TintProvider initialSlug="onyx" autoplay={false}>
      <main className={s.screen}>
        <Nav />
        <ShopGrid />
        <Footer />
      </main>
      <CartDrawer />
    </TintProvider>
  );
}
