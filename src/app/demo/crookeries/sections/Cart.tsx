'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '../CartProvider';
import { FREE_DELIVERY_OVER, money } from '../shop';
import s from './cart.module.css';

/** The button on a product card. Was a `<button>` with no handler at all. */
export function AddToCart({ slug, label = 'Cart' }: { slug: string; label?: string }) {
  const { add, items } = useCart();
  const inCart = items.some((i) => i.slug === slug);

  return (
    <button
      type="button"
      onClick={() => add(slug)}
      className={`${s.add} ${inCart ? s.addOn : ''}`}
      aria-label={`Add to basket`}
    >
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {inCart ? 'Added' : label}
    </button>
  );
}

/** A basket button that only exists once there is something in the basket. */
export function CartButton() {
  const { count, setOpen, open } = useCart();
  if (count === 0 || open) return null;

  return (
    <button type="button" className={s.fab} onClick={() => setOpen(true)}>
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M3 6h14l-1.2 10.2a1.5 1.5 0 0 1-1.5 1.3H5.7a1.5 1.5 0 0 1-1.5-1.3L3 6Zm4 0a3 3 0 0 1 6 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Basket
      <span className={s.fabCount}>{count}</span>
    </button>
  );
}

export function CartDrawer() {
  const {
    detailed, subtotal, delivery, total, count,
    setQty, remove, open, setOpen, toFreeDelivery,
  } = useCart();

  // Escape closes it, and the page behind must not scroll while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, setOpen]);

  if (!open) return null;

  const earned = FREE_DELIVERY_OVER - toFreeDelivery;
  const pct = Math.min(100, Math.round((earned / FREE_DELIVERY_OVER) * 100));

  return (
    <>
      <button
        type="button"
        className={s.scrim}
        onClick={() => setOpen(false)}
        aria-label="Close basket"
      />
      <aside className={s.drawer} aria-label="Basket">
        <div className={s.drawerHead}>
          <h2 className={s.drawerTitle}>
            Basket {count > 0 && <span aria-hidden="true">({count})</span>}
          </h2>
          <button type="button" className={s.iconBtn} onClick={() => setOpen(false)} aria-label="Close basket">
            <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={s.drawerBody}>
          {detailed.length === 0 ? (
            <p className={s.empty}>
              Nothing in the basket yet.
              <br />
              Everything we make is built to outlast the kitchen you buy it for.
            </p>
          ) : (
            <>
              {detailed.map(({ product, qty, line }) => (
                <div key={product.slug} className={s.line}>
                  <span className={s.lineFrame}>
                    <Image
                      src={`/demo/crookeries/${product.slug}.webp`}
                      alt={product.alt}
                      fill
                      sizes="72px"
                    />
                  </span>

                  <div>
                    <p className={s.lineName}>{product.name}</p>
                    <p className={s.lineUnit}>{money(product.price)} each</p>
                    <div className={s.qty}>
                      <button
                        type="button"
                        className={s.qtyBtn}
                        onClick={() => setQty(product.slug, qty - 1)}
                        aria-label={`Fewer ${product.name}`}
                      >
                        −
                      </button>
                      <span className={s.qtyNum}>{qty}</span>
                      <button
                        type="button"
                        className={s.qtyBtn}
                        onClick={() => setQty(product.slug, qty + 1)}
                        aria-label={`More ${product.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className={s.linePrice}>{money(line)}</span>
                    <button type="button" className={s.lineRemove} onClick={() => remove(product.slug)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className={s.meter}>
                <p className={s.meterText}>
                  {toFreeDelivery === 0
                    ? 'Delivery is on us.'
                    : `${money(toFreeDelivery)} more for free delivery.`}
                </p>
                <div className={s.meterTrack}>
                  <div className={s.meterFill} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </>
          )}
        </div>

        {detailed.length > 0 && (
          <div className={s.drawerFoot}>
            <div className={s.sum}>
              <span>Subtotal</span>
              <span className={s.sumValue}>{money(subtotal)}</span>
            </div>
            <div className={s.sum}>
              <span>Delivery</span>
              <span className={s.sumValue}>{money(delivery)}</span>
            </div>
            <div className={s.sumTotal}>
              <span>Total</span>
              <span className={s.sumValue}>{money(total)}</span>
            </div>

            <Link href="/demo/crookeries/checkout" className={s.checkoutBtn} onClick={() => setOpen(false)}>
              Checkout
              <svg width="14" height="8" viewBox="0 0 16 9" fill="none" aria-hidden="true">
                <path d="M0 4.5h14M10.5 1l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </Link>
            <button type="button" className={s.keepShopping} onClick={() => setOpen(false)}>
              Keep shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
