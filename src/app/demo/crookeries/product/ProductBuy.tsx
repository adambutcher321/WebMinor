'use client';

import { useState } from 'react';
import { useCart } from '../CartProvider';
import page from '../crookeries.module.css';

/**
 * The buy row on the product page.
 *
 * The stepper and the add button were both `<button type="button">` with no
 * handler — a quantity you could press but not change, next to an add that
 * added nothing. The row owns the quantity and hands it to the basket.
 */
export default function ProductBuy({
  slug,
  styles,
}: {
  slug: string;
  styles: Record<string, string>;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className={styles.buyRow}>
      <div className={styles.qty}>
        <button
          className={styles.qtyBtn}
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
        >
          −
        </button>
        <span className={styles.qtyVal}>{qty}</span>
        <button
          className={styles.qtyBtn}
          type="button"
          aria-label="Increase quantity"
          onClick={() => setQty((q) => Math.min(20, q + 1))}
        >
          +
        </button>
      </div>

      <button
        className={`${page.btn} ${page.btnPrimary} ${styles.buy}`}
        type="button"
        onClick={() => add(slug, qty)}
      >
        Add to basket
        <svg width="14" height="8" viewBox="0 0 16 9" fill="none" aria-hidden="true">
          <path d="M0 4.5h14M10.5 1l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </button>
    </div>
  );
}
