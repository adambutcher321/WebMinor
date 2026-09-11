/**
 * Crookeries' catalogue.
 *
 * Prices are sterling. They used to be US dollars carrying converted-looking
 * cents ($43.85, $26.27) on a British concept brand sold from a Cornish studio,
 * next to two other demos quoting pounds — so they read as a currency nobody
 * had chosen. These are round UK retail prices instead.
 */

export interface Product {
  slug: string;
  badge: string;
  title: string;
  /** Short name for the basket, where the full marketing title is too long. */
  name: string;
  /** Pence, so every total is integer arithmetic. */
  price: number;
  was?: number;
  alt: string;
  swatches: string[];
}

export const products: Product[] = [
  {
    slug: 'p-bottle',
    badge: 'Promotion',
    title: 'Reusable drinkware for a greener lifestyle.',
    name: 'NatureSip bottle',
    price: 3400,
    was: 4200,
    alt: 'A deep green insulated drinks bottle with a moulded carry loop',
    swatches: ['#B9D6E4', '#6E7F8C', '#2C4A3B'],
  },
  {
    slug: 'p-cookware',
    badge: 'New',
    title: 'Non-toxic cookware for sustainable cooking.',
    name: 'OasiCook pan set',
    price: 6800,
    alt: 'A chartreuse enamel stockpot beside a terracotta saucepan with a glass lid',
    swatches: ['#C7CE3E', '#7C8794', '#C4612F'],
  },
  {
    slug: 'p-kettle',
    badge: 'Customer favourite',
    title: 'Kettle and toaster for eco-friendly meals.',
    name: 'Morning set, kettle & toaster',
    price: 12900,
    was: 15500,
    alt: 'A sage green ribbed electric kettle on a pale ash wood base',
    swatches: ['#C4A882', '#7C8794', '#7E8C6E'],
  },
  {
    slug: 'p-crock',
    badge: 'New',
    title: 'Bamboo made utensil holder.',
    name: 'Bamboo utensil crock',
    price: 2200,
    alt: 'A mustard yellow ceramic crock holding wooden spoons and spatulas',
    swatches: ['#8B8A85', '#7E8C6E', '#D9B441'],
  },
];

/** Free over this, which is the line the basket nudges towards. */
export const FREE_DELIVERY_OVER = 5000;

export interface DeliveryOption {
  id: string;
  name: string;
  note: string;
  price: number;
}

export const deliveryOptions: DeliveryOption[] = [
  { id: 'standard', name: 'Standard', note: '3 to 5 working days, carbon neutral', price: 395 },
  { id: 'named', name: 'Named day', note: 'Choose your day at checkout', price: 695 },
  { id: 'collect', name: 'Collect in store', note: 'Truro and Falmouth, ready in 2 hours', price: 0 },
];

/**
 * What this delivery option costs on this basket.
 *
 * Collection is always free, and spending over the threshold waives the
 * *standard* charge only. An earlier version zeroed every paid option once the
 * basket crossed the line, which quietly upgraded the £6.95 named-day service
 * to free — a promise the shop would have had to honour.
 */
export function deliveryCost(optionId: string, subtotal: number): number {
  const option = deliveryOptions.find((d) => d.id === optionId) ?? deliveryOptions[0];
  if (option.id === 'collect') return 0;
  if (option.id === 'standard' && subtotal >= FREE_DELIVERY_OVER) return 0;
  return option.price;
}

export function productBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** Pence to a displayed price. Whole pounds lose the trailing `.00`. */
export function money(pence: number): string {
  if (pence === 0) return 'Free';
  const pounds = pence / 100;
  return pounds % 1 === 0
    ? `£${pounds.toLocaleString('en-GB')}`
    : `£${pounds.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
}
