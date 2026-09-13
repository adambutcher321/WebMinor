"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "./CartProvider";
import { Wordmark } from "./Logo";
import { BASE, NAV } from "./shop";
import s from "./boucher.module.css";

export default function Nav() {
  const pathname = usePathname();
  const { count, setOpen, wishlist, lastAdded } = useCart();
  const [menu, setMenu] = useState(false);
  const current = (href: string) => (href === BASE ? pathname === BASE : pathname.startsWith(href));

  useEffect(() => {
    if (!menu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menu]);

  return (
    <>
      <header className="relative z-20 flex items-center justify-between gap-6 px-6 lg:px-14 py-6">
        <Link href={BASE} aria-label="Boucher Tailored home" className="shrink-0">
          <Wordmark />
        </Link>

        <nav className={`${s.pill} max-w-[560px]`} aria-label="Primary">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className={s.pillLink} aria-current={current(l.href) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" className={s.iconBtn} onClick={() => setOpen(true)} aria-label={`Basket, ${count} items`}>
            <ShoppingBag className="w-[18px] h-[18px]" />
            {count > 0 && (
              <span key={lastAdded} className={s.badge}>
                {count}
              </span>
            )}
          </button>
          <Link href={`${BASE}/shop#wishlist`} className={`${s.iconBtn} ${s.wishBtn}`} aria-label={`Wishlist, ${wishlist.length} items`}>
            <Heart className="w-[18px] h-[18px]" fill={wishlist.length ? "currentColor" : "none"} />
          </Link>
          <button type="button" className={`${s.iconBtn} ${s.menuBtn}`} onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col" style={{ background: "var(--bg)", color: "var(--fg)" }}>
          <div className="flex items-center justify-between px-6 py-6">
            <Wordmark />
            <button type="button" className={s.iconBtn} onClick={() => setMenu(false)} aria-label="Close menu" autoFocus>
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex flex-col px-6 pt-6" aria-label="Primary" style={{ fontFamily: "var(--display)" }}>
            {[...NAV, { label: "Size guide", href: `${BASE}/size-guide` }].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenu(false)}
                className="py-5 text-3xl font-semibold border-b"
                style={{ borderColor: "color-mix(in srgb, var(--fg) 14%, transparent)" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
