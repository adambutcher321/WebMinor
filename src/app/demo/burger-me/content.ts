import type { IngredientType } from "./engine/ingredients";

export const STATEMENTS: { type: IngredientType; text: string }[] = [
  { type: "bun-top", text: "Toasted brioche" },
  { type: "cheese", text: "American cheese" },
  { type: "patty", text: "British beef · Smashed to order" },
  { type: "sauce", text: "House sauce" },
];

export const SOURCING = {
  kicker: "Our beef",
  title: "Chuck and brisket from one Devon farm, minced every morning.",
  body: "We buy whole cuts from Hollow Combe Farm outside Tavistock and grind them in the kitchen before we open. Every patty is a 90g ball, smashed on a 260°C plate the moment you order, so the edges go lacy and the middle stays juicy.",
  facts: [
    { k: "90g", v: "per patty, balled by hand" },
    { k: "260°C", v: "plate temperature" },
    { k: "0", v: "frozen anything" },
  ],
};

export const LOCATIONS = [
  { name: "Barbican", address: "14 Southside Street, Plymouth PL1 2LD" },
  { name: "Truro", address: "3 River Street, Truro TR1 2SQ" },
];

export const HOURS = [
  { d: "Mon – Thu", h: "12:00 – 21:30" },
  { d: "Fri – Sat", h: "12:00 – 23:00" },
  { d: "Sun", h: "12:00 – 20:00" },
];

export const FOOTER = {
  line: "Smashed to order in Plymouth and Truro.",
  small: "Burger Me is a concept brand designed and built by WebMinor. Not a real restaurant — yet.",
};
