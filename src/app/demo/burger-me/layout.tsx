import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { BagProvider } from "./BagProvider";
import Nav from "./Nav";
import Footer from "./Footer";
import BagDrawer from "./BagDrawer";
import s from "./burger-me.module.css";

const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], axes: ["wdth", "opsz"], display: "swap" });

export const metadata: Metadata = {
  title: { absolute: "Burger Me — Smash burgers, built in front of you | WebMinor Concept" },
  description: "A concept smash-burger restaurant by WebMinor: one photographic burger that takes itself apart, rebuilds, and changes recipe in front of you.",
  robots: { index: false, follow: false },
};

export default function BurgerMeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bricolage.variable} ${s.site}`}>
      <BagProvider>
        <Nav />
        {children}
        <Footer />
        <BagDrawer />
      </BagProvider>
    </div>
  );
}
