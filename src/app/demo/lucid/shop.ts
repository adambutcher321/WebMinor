/**
 * LUCID's configurator.
 *
 * Prices are pence so every total is integer arithmetic — a headset plus three
 * options in floating point is exactly where a storefront starts showing
 * £2,889.9999999.
 */

export interface Choice {
  id: string;
  name: string;
  note: string;
  price: number;
}

export interface OptionGroup {
  id: string;
  label: string;
  /** Shown as the group's technical caption. */
  caption: string;
  choices: Choice[];
}

export const BASE_PRICE = 289000;

export const groups: OptionGroup[] = [
  {
    id: 'storage',
    label: 'Storage',
    caption: 'On-device capture and passthrough recording',
    choices: [
      { id: '256', name: '256 GB', note: 'About four hours of spatial capture', price: 0 },
      { id: '512', name: '512 GB', note: 'About nine hours', price: 20000 },
      { id: '1tb', name: '1 TB', note: 'About eighteen hours', price: 40000 },
    ],
  },
  {
    id: 'band',
    label: 'Halo band',
    caption: 'Swappable, sold separately later',
    choices: [
      { id: 'titanium', name: 'Titanium', note: 'The original. 61 g, brushed.', price: 0 },
      { id: 'woven', name: 'Woven', note: 'Softer against the head for long sessions.', price: 9000 },
      { id: 'carbon', name: 'Carbon', note: '38 g. The lightest we make.', price: 24000 },
    ],
  },
  {
    id: 'lenses',
    label: 'Optical inserts',
    caption: 'Bonded to your prescription at the factory',
    choices: [
      { id: 'none', name: 'Not needed', note: 'Standard optics, no insert.', price: 0 },
      { id: 'single', name: 'Single vision', note: 'Send your prescription after ordering.', price: 14900 },
      { id: 'vari', name: 'Varifocal', note: 'Adds about a week to delivery.', price: 24900 },
    ],
  },
];

export interface Extra {
  id: string;
  name: string;
  note: string;
  price: number;
}

export const extras: Extra[] = [
  { id: 'case', name: 'Travel case', note: 'Machined shell, magnetic lid, fits the band assembled.', price: 19900 },
  { id: 'dock', name: 'Charging dock', note: 'Sits it at eye level and charges through the frame.', price: 12900 },
  { id: 'care', name: 'Lucid Care, 2 years', note: 'Two accidental damage claims, no questions asked.', price: 29900 },
];

export function money(pence: number): string {
  if (pence === 0) return 'Included';
  const pounds = pence / 100;
  return pounds % 1 === 0
    ? `£${pounds.toLocaleString('en-GB')}`
    : `£${pounds.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
}

/** Plain price with no "Included" substitution, for the running total. */
export function plain(pence: number): string {
  const pounds = pence / 100;
  return pounds % 1 === 0
    ? `£${pounds.toLocaleString('en-GB')}`
    : `£${pounds.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
}
