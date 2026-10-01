import type { IngredientType } from "./ingredients";

export interface LayerSpec { id: string; type: IngredientType }

export interface Burger {
  slug: string;
  name: string;
  price: number;
  tagline: string;
  description: string;
  allergens: string;
  /** Top → bottom. Ids persist across recipes so shared layers stay put. */
  stack: LayerSpec[];
  /** What it adds over The Original, for menu copy. */
  adds: IngredientType[];
}

const L = (id: string, type: IngredientType = id as IngredientType): LayerSpec => ({ id, type });
const TOP = [L("bun-top")];
const BASE = [L("cheese-1", "cheese"), L("patty-1", "patty"), L("cheese-2", "cheese"), L("patty-2", "patty"), L("sauce"), L("bun-bottom")];
const ALLERGENS = "Contains gluten, milk, egg, mustard, sesame.";

export const BURGERS: Burger[] = [
  {
    slug: "the-original", name: "The Original", price: 11.5,
    tagline: "Two smashed patties. Nothing to hide behind.",
    description: "Two British beef patties smashed thin on a screaming-hot plate, American cheese melted into the crust, pickles, red onion and our house sauce in a toasted brioche bun.",
    allergens: ALLERGENS, adds: [],
    stack: [...TOP, L("pickles"), L("onion"), ...BASE],
  },
  {
    slug: "bacon-cheese", name: "Bacon Cheese", price: 13,
    tagline: "The Original, plus smoke.",
    description: "Everything in The Original with three rashers of crispy smoked streaky bacon laid over the cheese.",
    allergens: ALLERGENS, adds: ["bacon"],
    stack: [...TOP, L("pickles"), L("onion"), L("bacon"), ...BASE],
  },
  {
    slug: "hot-honey", name: "Hot Honey", price: 12.5,
    tagline: "Sweet heat, sharp bite.",
    description: "Fresh jalapeños in place of pickles, a drizzle of chilli-infused honey and red onion over two smashed patties and double American cheese.",
    allergens: ALLERGENS, adds: ["jalapenos"],
    stack: [...TOP, L("jalapenos"), L("onion"), ...BASE],
  },
  {
    slug: "the-deluxe", name: "The Deluxe", price: 12.5,
    tagline: "The garden came too.",
    description: "Crisp iceberg and thick-cut vine tomato with pickles, double cheese and two smashed patties. The fresh one.",
    allergens: ALLERGENS, adds: ["lettuce", "tomato"],
    stack: [...TOP, L("lettuce"), L("tomato"), L("pickles"), ...BASE],
  },
  {
    slug: "smokehouse", name: "Smokehouse", price: 13.5,
    tagline: "Onions two ways, bacon one way: crispy.",
    description: "Crispy fried onions, red onion and smoked streaky bacon over double cheese and two smashed patties.",
    allergens: ALLERGENS, adds: ["bacon", "crispy-onions"],
    stack: [...TOP, L("crispy-onions"), L("onion"), L("bacon"), ...BASE],
  },
];

export const bySlug = (slug: string) => BURGERS.find((b) => b.slug === slug);
export const formatPrice = (n: number) => `£${n.toFixed(2)}`;
