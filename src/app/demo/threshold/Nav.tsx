"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "./Logo";
import s from "./threshold.module.css";

const LINKS = [
  { href: "/demo/threshold#programmes", label: "Programmes" },
  { href: "/demo/threshold/timetable", label: "This week" },
  { href: "/demo/threshold/coaches", label: "Coaches" },
  { href: "/demo/threshold/membership", label: "Membership" },
  { href: "/demo/threshold/about", label: "About" },
];

/* Transparent over the hero, so it reads as part of the photograph. Below
   900px the links collapse into a full-screen overlay toggled by the
   burger; opening it raises the whole nav above the fixed bottom bar. */
export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header className={s.nav} data-open={open}>
      <Link href="/demo/threshold" className={s.navBrand} onClick={() => setOpen(false)}>
        <Wordmark />
      </Link>
      <nav className={s.navLinks} aria-label="Primary">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} data-active={path === l.href.split("#")[0]} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
      </nav>
      <Link href="/demo/threshold/timetable" className={`${s.pill} ${s.navPill}`}>Try a session</Link>
      <button
        type="button"
        className={s.navBurger}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <i /><i />
      </button>
    </header>
  );
}
