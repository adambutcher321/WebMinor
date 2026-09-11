'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Figtree, Playfair_Display } from 'next/font/google';
import { useCart } from '../CartProvider';
import { deliveryCost, deliveryOptions, money } from '../shop';
import s from '../sections/cart.module.css';

const body = Figtree({ subsets: ['latin'], display: 'swap', weight: ['400', '500'] });
const display = Playfair_Display({ subsets: ['latin'], display: 'swap', weight: ['400', '500'] });

/*
  A real checkout for a concept storefront.

  It takes details, prices delivery against the basket, and confirms — but it
  never transmits anything and never asks for a card number. A demo that
  rendered a working-looking payment field would be teaching visitors to type
  card details into a page that is not a payment page, so the payment step
  names itself as a demo and collects nothing.
*/
export default function CheckoutPage() {
  const { detailed, subtotal, delivery, total, deliveryId, setDeliveryId, clear } = useCart();
  const [placed, setPlaced] = useState(false);
  const [ref] = useState(() => `CRK-${Math.floor(100000 + Math.random() * 899999)}`);

  const empty = detailed.length === 0;

  function placeOrder() {
    setPlaced(true);
    clear();
  }

  if (placed) {
    return (
      <div className={`${s.root} ${s.checkout} ${body.className}`}>
        <div className={s.checkoutWrap}>
          <div className={s.checkoutTop}>
            <Link href="/demo/crookeries" className={`${s.wordmark} ${display.className}`}>
              Crookeries
            </Link>
          </div>

          <div className={s.done}>
            <span className={s.doneMark}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h1 className={`${s.doneTitle} ${display.className}`}>Thank you. That&apos;s ordered.</h1>
            <p className={s.doneBody}>
              You&apos;ll get a confirmation by email, and a note from the workshop when it
              leaves us. Everything ships plastic free in board and paper tape.
            </p>
            <p className={s.doneRef}>Order {ref}</p>
            <p className={s.demoNote}>
              This is a concept store built by WebMinor. No order was placed and no
              payment was taken.
            </p>
            <Link href="/demo/crookeries" className={s.checkoutBtn} style={{ marginTop: 24 }}>
              Back to the shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${s.root} ${s.checkout} ${body.className}`}>
      <div className={s.checkoutWrap}>
        <div className={s.checkoutTop}>
          <Link href="/demo/crookeries" className={`${s.wordmark} ${display.className}`}>
            Crookeries
          </Link>
          <span className={s.secure}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 7V5a4 4 0 0 1 8 0v2M3 7h10v7H3V7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
            Secure checkout
          </span>
        </div>

        {empty ? (
          <div className={s.done}>
            <h1 className={`${s.doneTitle} ${display.className}`}>Your basket is empty.</h1>
            <p className={s.doneBody}>
              Nothing to check out yet. Have a look at the bestsellers and add something.
            </p>
            <Link href="/demo/crookeries#bestselling" className={s.checkoutBtn} style={{ marginTop: 24 }}>
              Back to the shop
            </Link>
          </div>
        ) : (
          <div className={s.checkoutGrid}>
            <div>
              <section className={s.panel}>
                <div className={s.panelHead}>
                  <span className={s.panelStep}>01</span>
                  <h2 className={`${s.panelTitle} ${display.className}`}>Where it&apos;s going</h2>
                </div>

                <div className={s.fieldGrid}>
                  <label className={s.field}>
                    <span className={s.fieldLabel}>First name</span>
                    <input className={s.input} type="text" autoComplete="given-name" placeholder="Ada" />
                  </label>
                  <label className={s.field}>
                    <span className={s.fieldLabel}>Last name</span>
                    <input className={s.input} type="text" autoComplete="family-name" placeholder="Trevithick" />
                  </label>
                  <label className={`${s.field} ${s.fieldWide}`}>
                    <span className={s.fieldLabel}>Email</span>
                    <input className={s.input} type="email" autoComplete="email" placeholder="you@example.com" />
                  </label>
                  <label className={`${s.field} ${s.fieldWide}`}>
                    <span className={s.fieldLabel}>Address</span>
                    <input className={s.input} type="text" autoComplete="address-line1" placeholder="12 Lemon Street" />
                  </label>
                  <label className={s.field}>
                    <span className={s.fieldLabel}>Town or city</span>
                    <input className={s.input} type="text" autoComplete="address-level2" placeholder="Truro" />
                  </label>
                  <label className={s.field}>
                    <span className={s.fieldLabel}>Postcode</span>
                    <input className={s.input} type="text" autoComplete="postal-code" placeholder="TR1 2NA" />
                  </label>
                </div>
              </section>

              <section className={s.panel}>
                <div className={s.panelHead}>
                  <span className={s.panelStep}>02</span>
                  <h2 className={`${s.panelTitle} ${display.className}`}>How it gets there</h2>
                </div>

                <div className={s.choices}>
                  {deliveryOptions.map((opt) => {
                    const on = opt.id === deliveryId;
                    const shown = deliveryCost(opt.id, subtotal);
                    return (
                      <label key={opt.id} className={`${s.choice} ${on ? s.choiceOn : ''}`}>
                        <input
                          type="radio"
                          name="delivery"
                          className={s.realInput}
                          checked={on}
                          onChange={() => setDeliveryId(opt.id)}
                        />
                        <span className={s.radio} aria-hidden="true" />
                        <span>
                          <span className={s.choiceName}>{opt.name}</span>
                          <span className={s.choiceNote} style={{ display: 'block' }}>{opt.note}</span>
                        </span>
                        <span className={s.choicePrice}>{money(shown)}</span>
                      </label>
                    );
                  })}
                </div>
              </section>

              <section className={s.panel}>
                <div className={s.panelHead}>
                  <span className={s.panelStep}>03</span>
                  <h2 className={`${s.panelTitle} ${display.className}`}>Payment</h2>
                </div>
                <p className={s.choiceNote} style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
                  This is a concept store, so there is no card step and nothing is
                  charged. On a live build this is where the payment provider&apos;s own
                  fields sit, which is what keeps card details off the shop&apos;s servers.
                </p>
              </section>
            </div>

            <aside className={s.summary}>
              <h2 className={`${s.summaryTitle} ${display.className}`}>Your order</h2>

              {detailed.map(({ product, qty, line }) => (
                <div key={product.slug} className={s.line}>
                  <span className={s.lineFrame}>
                    <Image src={`/demo/crookeries/${product.slug}.webp`} alt={product.alt} fill sizes="72px" />
                  </span>
                  <div>
                    <p className={s.lineName}>{product.name}</p>
                    <p className={s.lineUnit}>
                      {money(product.price)} × {qty}
                    </p>
                  </div>
                  <span className={s.linePrice}>{money(line)}</span>
                </div>
              ))}

              <div className={s.sum} style={{ marginTop: 18 }}>
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

              <button type="button" className={s.placeBtn} onClick={placeOrder}>
                Place order
              </button>
              <p className={s.demoNote}>
                Concept demo by WebMinor. Nothing is charged and no details are sent.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
