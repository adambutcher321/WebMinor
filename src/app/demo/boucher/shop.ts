/*
  Boucher Tailored. One jacket, five ways.

  A concept outerwear brand for the WebMinor work section. The site is built
  around the reference mechanism: a single product stage where changing the
  colourway tints the whole page. Everything the pages show comes from here.
*/

export const BASE = "/demo/boucher";
export const IMG = "/demo/boucher";

export type Colourway = {
  slug: string;
  name: string;
  /** The line under the jacket. */
  tagline: string;
  /** Pence. */
  price: number;
  was: number;
  /** The page tint and the ink that sits on it. */
  bg: string;
  bgDeep: string;
  fg: string;
  fgSoft: string;
  /** For the nav pill and the size chips. */
  panel: string;
  /** Cutout product render, transparent. */
  cutout: string;
  /** Editorial shot for the range grid and product page. */
  look: string;
  alt: string;
  lookAlt: string;
  note: string;
  limited?: boolean;
};

export const COLOURWAYS: Colourway[] = [
  {
    slug: "onyx",
    name: "Onyx",
    tagline: "Confidence, wrapped in warmth.",
    price: 16900,
    was: 21900,
    bg: "#232323",
    bgDeep: "#141414",
    fg: "#ffffff",
    fgSoft: "rgba(255,255,255,0.68)",
    panel: "rgba(255,255,255,0.08)",
    cutout: `${IMG}/onyx.webp`,
    look: `${IMG}/macro-quilt.webp`,
    alt: "The Boucher Tailored puffer in glossy black, floating front-on",
    lookAlt: "Water beading on the black high-shine quilting",
    note: "The original. Wet-look black that reads as liquid under street light.",
  },
  {
    slug: "ember",
    name: "Ember",
    tagline: "Stand out, without trying.",
    price: 16900,
    was: 21900,
    bg: "#E2640F",
    bgDeep: "#B94E08",
    fg: "#ffffff",
    fgSoft: "rgba(255,255,255,0.72)",
    panel: "rgba(0,0,0,0.14)",
    cutout: `${IMG}/ember.webp`,
    look: `${IMG}/look-ember.webp`,
    alt: "The puffer in glossy tangerine orange, floating front-on",
    lookAlt: "The orange puffer on a rain-wet city street at night",
    note: "Tangerine, saturated all the way through. The one people ask about.",
  },
  {
    slug: "lime",
    name: "Acid Lime",
    tagline: "Loud on purpose.",
    price: 16900,
    was: 21900,
    bg: "#B9E23A",
    bgDeep: "#8FBA1E",
    fg: "#141a08",
    fgSoft: "rgba(20,26,8,0.66)",
    panel: "rgba(0,0,0,0.1)",
    cutout: `${IMG}/lime.webp`,
    look: `${IMG}/look-lime.webp`,
    alt: "The puffer in glossy acid lime, floating front-on",
    lookAlt: "The lime puffer in deep snow at the edge of a pine forest",
    note: "A lime that does not apologise. Made for grey days and white ones.",
  },
  {
    slug: "cobalt",
    name: "Cobalt",
    tagline: "Deep water, dry inside.",
    price: 16900,
    was: 21900,
    bg: "#1F4FD8",
    bgDeep: "#153AA6",
    fg: "#ffffff",
    fgSoft: "rgba(255,255,255,0.72)",
    panel: "rgba(0,0,0,0.16)",
    cutout: `${IMG}/cobalt.webp`,
    look: `${IMG}/look-cobalt.webp`,
    alt: "The puffer in glossy deep cobalt blue, floating front-on",
    lookAlt: "The cobalt puffer photographed against a cobalt studio backdrop",
    note: "A true cobalt, matched to the pantone of a winter sky an hour after sunset.",
  },
  {
    slug: "doodle",
    name: "Doodle Edition",
    tagline: "Every monster drawn by hand.",
    price: 25900,
    was: 29900,
    bg: "#5B2ED9",
    bgDeep: "#3F1DA6",
    fg: "#ffffff",
    fgSoft: "rgba(255,255,255,0.72)",
    panel: "rgba(0,0,0,0.18)",
    cutout: `${IMG}/doodle.webp`,
    look: `${IMG}/look-doodle.webp`,
    alt: "The puffer in cream covered with colourful hand-drawn doodle monsters",
    lookAlt: "The Doodle Edition in the studio against a lilac backdrop",
    note: "Forty-one characters drawn by illustrator Mia Okafor, printed edge to edge. A run of 300.",
    limited: true,
  },
];

export const SIZES = ["XS", "S", "M", "L", "XL"] as const;
export type Size = (typeof SIZES)[number];

export const bySlug = (slug: string) => COLOURWAYS.find((c) => c.slug === slug);

export const money = (pence: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(pence / 100);

export const FREE_DELIVERY_OVER = 20000;
export const DELIVERY = 695;

/* Below the stage. */
export const DETAILS = [
  { k: "Fill", v: "700 fill-power RDS-certified down, 90/10" },
  { k: "Shell", v: "20-denier high-shine nylon, PFC-free water repellent" },
  { k: "Baffles", v: "Six horizontal, stitched through, 9 cm" },
  { k: "Zip", v: "Two-way YKK Vislon, gunmetal pull" },
  { k: "Hem and cuffs", v: "Elasticated, bound in the shell fabric" },
  { k: "Weight", v: "540 g in a size M" },
  { k: "Packs to", v: "The size of a loaf, into its own left pocket" },
  { k: "Made in", v: "Porto, Portugal" },
];

export const REVIEWS = [
  { name: "Isla M.", colour: "Ember", stars: 5, text: "I bought the orange to be seen on the bike. Three people have stopped me to ask where it is from, and one of them was a bus driver." },
  { name: "Theo K.", colour: "Onyx", stars: 5, text: "Warm at minus six on a Berlin platform with a t-shirt underneath. The shine is a lot in photos and exactly right in person." },
  { name: "Priya D.", colour: "Doodle Edition", stars: 5, text: "Number 118 of 300. My daughter has named every monster on it. The print has not cracked or faded after a winter of daily wear." },
  { name: "Sam R.", colour: "Acid Lime", stars: 4, text: "Louder than I expected and I love it. Would take a slightly longer cut, but that is the point of a cropped jacket, so ignore me." },
];

export const NAV = [
  { label: "Puffer Jacket", href: `${BASE}` },
  { label: "All Products", href: `${BASE}/shop` },
  { label: "About Us", href: `${BASE}/about` },
  { label: "Contact", href: `${BASE}/contact` },
];

/* Sizing. Centimetres; the guide converts. A cropped jacket, so the lengths
   are short on purpose and the chest carries the fit. */
export type SizeRow = {
  size: Size;
  chest: number;
  length: number;
  sleeve: number;
  fitsChest: [number, number];
  fitsHeight: [number, number];
};

export const SIZE_CHART: SizeRow[] = [
  { size: "XS", chest: 92, length: 54, sleeve: 60, fitsChest: [80, 88], fitsHeight: [152, 165] },
  { size: "S", chest: 98, length: 56, sleeve: 61.5, fitsChest: [88, 96], fitsHeight: [160, 172] },
  { size: "M", chest: 104, length: 58, sleeve: 63, fitsChest: [96, 104], fitsHeight: [168, 180] },
  { size: "L", chest: 110, length: 60, sleeve: 64.5, fitsChest: [104, 112], fitsHeight: [176, 188] },
  { size: "XL", chest: 116, length: 62, sleeve: 66, fitsChest: [112, 120], fitsHeight: [184, 198] },
];

export const FIT_NOTES = [
  { k: "The cut", v: "Cropped, to the top of the hip. It is meant to sit above a belt line, not over it." },
  { k: "Through the body", v: "Boxy, with 12 cm of room over your chest measurement in every size. A jumper fits under it without going up." },
  { k: "Sleeves", v: "Long, ending past the wrist bone, with an elasticated cuff that keeps the wind out." },
  { k: "Between sizes", v: "Take the smaller one if you want it fitted and the larger if you want to layer. The finder below does that sum for you." },
];
