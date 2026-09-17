"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "./Logo";
import s from "./threshold.module.css";

const LINKS = [
  { href: "/demo/threshold#programmes", label: "Programmes" },
  { href: "/demo/threshold/timetable", label: "This week" },
  { href: "/demo/threshold/coaches", label: "Coaches" },
  { href: "/demo/threshold/membership", label: "Membership" },
  { href: "/demo/threshold/about", label: "About" },
];

/* Transparent over the hero, so it reads as part of the photograph; the
   colour of the text follows the section under it via .onNavy/.onFrost. */
export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className={s.nav}>
      <Link href="/demo/threshold" className={s.navBrand} onClick={() => setOpen(false)}>
        <Wordmark />
      </Link>
      <nav className={s.navLinks} data-open={open} aria-label="Primary">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} data-active={path === l.href.split("#")[0]} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
      </nav>
      <Link href="/demo/threshold/timetable" className={`${s.pill} ${s.navPill}`}>Try a session</Link>
      <button type="button" className={s.navBurger} aria-expanded={open} aria-label="Menu" onClick={() => setOpen((v) => !v)}>
        <i /><i />
      </button>
    </header>
  );
}
