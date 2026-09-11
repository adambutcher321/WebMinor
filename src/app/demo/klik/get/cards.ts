/**
 * The four KLIK colourways.
 *
 * These are surfaces, not photographs: each one names a class in
 * klikcard.module.css so the card the visitor picks is the same DOM card that
 * tilts under the cursor everywhere else on the site. A rendered still would
 * be soft at size and could not respond.
 */

export interface Colourway {
  id: string;
  name: string;
  /** The line that sells this one rather than the next. */
  note: string;
  /** Swatch shown in the picker, matching the card's dominant tone. */
  swatch: string;
  /** True where the card face carries ink type instead of paper type. */
  darkType?: boolean;
  /** Metal costs money; the rest do not. */
  price: number;
}

export const colourways: Colourway[] = [
  {
    id: 'holo',
    name: 'Ember',
    note: 'The original. Orange into deep violet, and it shifts as you turn it.',
    swatch: '#ff4d1c',
    price: 0,
  },
  {
    id: 'black',
    name: 'Midnight',
    note: 'Flat soft-touch black. Fingerprints do not stand a chance.',
    swatch: '#1d1d1d',
    price: 0,
  },
  {
    id: 'lime',
    name: 'Acid',
    note: 'Loud on purpose. You will find it in any bag, in any light.',
    swatch: '#c8f031',
    darkType: true,
    price: 0,
  },
  {
    id: 'chrome',
    name: 'Chrome',
    note: 'Brushed stainless, 18 grams. Lands with a noise on the bar.',
    swatch: '#c3c7c2',
    darkType: true,
    price: 900,
  },
];

export const DELIVERY_FREE = 'Free, 3 working days';
export const DELIVERY_FAST = 995;

export function money(pence: number): string {
  if (pence === 0) return 'Free';
  const pounds = pence / 100;
  return pounds % 1 === 0
    ? `£${pounds}`
    : `£${pounds.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
}
