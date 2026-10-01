"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useBag } from "./BagProvider";
import s from "./burger-me.module.css";

export default function Nav() {
  const bag = useBag();
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <nav className={s.nav} data-solid={solid} aria-label="Main">
      <Link href="/demo/burger-me" className={s.brand}><Logo /></Link>
      <div className={s.navRight}>
        <div className={s.navLinks}>
          <Link href="/demo/burger-me/menu">Menu</Link>
          <Link href="/demo/burger-me#beef">Our beef</Link>
          <Link href="/demo/burger-me#find-us">Find us</Link>
        </div>
        <Link href="/demo/burger-me/menu" className={s.navMenuOnly}>Menu</Link>
        <button
          key={bag.lastAdded}
          className={s.bagBtn}
          data-pulse={bag.lastAdded ? "1" : "0"}
          onClick={() => bag.setOpen(true)}
          aria-label={`Open bag, ${bag.count} ${bag.count === 1 ? "item" : "items"}`}
        >
          Bag <b>{bag.count}</b>
        </button>
      </div>
    </nav>
  );
}
