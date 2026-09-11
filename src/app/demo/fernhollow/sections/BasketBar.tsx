'use client';

import { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { useBasket } from '../BasketProvider';
import { cabinBySlug, money } from '../stay';
import s from './fernhollow-sections.module.css';

/**
 * A docked summary of the stay, open from the moment a cabin is chosen.
 *
 * It is deliberately always visible rather than hidden behind a cart icon.
 * The thing being demonstrated to a WebMinor visitor is that the total reacts,
 * and a total nobody can see demonstrates nothing. Collapsed it shows nights
 * and total; expanded it itemises every line, so the arithmetic is checkable.
 */
export default function BasketBar() {
  const { ready, nights, lines, total, cabin, checkIn, checkOut, guests } = useBasket();
  const [open, setOpen] = useState(false);

  // Nothing to summarise until the client has resolved the default dates.
  if (!ready || nights <= 0) return null;

  const c = cabinBySlug(cabin);
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  return (
    <div className={s.basketDock}>
      <div className={s.basket}>
        {open && (
          <ul className={s.basketLines}>
            {lines.map((l) => (
              <li key={l.id} className={s.basketLine}>
                <span className={s.basketLineName}>{l.name}</span>
                <span className={s.basketLineDetail}>{l.detail}</span>
                <span className={s.basketLineTotal}>{money(l.total)}</span>
              </li>
            ))}
          </ul>
        )}

        <div className={s.basketFoot}>
          <div className={s.basketWhat}>
            <p className={s.basketCabin}>{c.name}</p>
            <p className={s.basketMeta}>
              {fmt(checkIn)} – {fmt(checkOut)} · {nights}{' '}
              {nights === 1 ? 'night' : 'nights'} · {guests}{' '}
              {guests === 1 ? 'guest' : 'guests'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className={s.basketToggle}
          >
            {/* "3 items" read as three extras even before anything was added,
                because the stay and the cleaning fee are lines too. */}
            {open ? 'Hide' : 'Breakdown'}
            <ChevronUp
              width={14}
              height={14}
              strokeWidth={1.8}
              aria-hidden="true"
              className={open ? s.basketChevOpen : undefined}
            />
          </button>

          <div className={s.basketTotal}>
            <span className={s.basketTotalLabel}>Total</span>
            <span className={s.basketTotalValue}>{money(total)}</span>
          </div>

          <a href="#book" className={s.basketCta}>
            Reserve
          </a>
        </div>
      </div>
    </div>
  );
}
