import type { Metadata } from "next";
import MenuCard from "./MenuCard";
import MenuNote from "./MenuNote";
import { BURGERS } from "../engine/burgers";
import s from "../burger-me.module.css";

export const metadata: Metadata = { title: { absolute: "Menu — Burger Me | WebMinor Concept" }, robots: { index: false, follow: false } };

export default function MenuPage() {
  return (
    <main className={`${s.menuPage} ${s.stageGround}`}>
      <p className={s.kicker}>The menu</p>
      <h1 className={`${s.display} ${s.menuTitle}`}>Five ways<br />to build it.</h1>
      <div className={s.menuGrid}>
        {BURGERS.map((b, i) => <MenuCard key={b.slug} burger={b} index={i} />)}
        <MenuNote />
      </div>
    </main>
  );
}
