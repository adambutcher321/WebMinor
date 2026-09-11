'use client';

import Link from 'next/link';
import { useState } from 'react';
import s from './cart.module.css';

/*
  The site used to end on a statement paragraph and a one-line credit strip.
  A storefront's footer is load-bearing — it is where returns, delivery and
  contact live, and a shop without them reads as a shop that has not opened —
  so this carries the things a buyer looks for after they have decided.
*/

const SHOP = ['Cookware', 'Drinkware', 'Utensils', 'Storage', 'Gift cards'];
const HELP = ['Delivery & returns', 'Care & repair', 'Track an order', 'Contact us', 'Our materials'];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [signed, setSigned] = useState(false);

  return (
    <footer className={`${s.root} ${s.footer}`}>
      <div className={s.footerWrap}>
        <div className={s.footerTop}>
          <div className={s.footerBrand}>
            <p className={s.footerMark}>Crookeries</p>
            <p className={s.footerBlurb}>
              Small-batch stoneware, cookware and utensils, made in Cornwall from
              materials that give back more than they take.
            </p>
          </div>

          <div>
            <p className={s.footerColTitle}>Shop</p>
            <ul className={s.footerList}>
              {SHOP.map((item) => (
                <li key={item}>
                  <Link className={s.footerLink} href="/demo/crookeries#bestselling">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={s.footerColTitle}>Help</p>
            <ul className={s.footerList}>
              {HELP.map((item) => (
                <li key={item}>
                  <Link className={s.footerLink} href="/demo/crookeries#gallery">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={s.footerColTitle}>The slow post</p>
            <p className={s.footerBlurb}>
              One email a month: what came out of the kiln, and what to cook in it.
            </p>

            {signed ? (
              <p className={s.signupDone}>Thank you. First one lands at the end of the month.</p>
            ) : (
              <form
                className={s.signup}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setSigned(true);
                }}
              >
                <input
                  className={s.signupInput}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-label="Email address"
                />
                <button className={s.signupBtn} type="submit">
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className={s.footerBottom}>
          <p className={s.footerFine}>
            Crookeries is a concept brand created by{' '}
            <Link href="/case-studies">WebMinor</Link> to demonstrate design and build
            work. © 2026
          </p>
          <div className={s.pay} aria-label="Accepted payment methods">
            <span className={s.payChip}>VISA</span>
            <span className={s.payChip}>MASTERCARD</span>
            <span className={s.payChip}>AMEX</span>
            <span className={s.payChip}>APPLE PAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
