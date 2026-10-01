import { LAYERS } from "./layers.generated";

export type IngredientType =
  | "bun-top" | "pickles" | "onion" | "cheese" | "patty" | "sauce" | "bun-bottom"
  | "bacon" | "jalapenos" | "lettuce" | "tomato" | "crispy-onions";

export interface Ingredient {
  type: IngredientType;
  src: string;
  /** Units: top bun width = 1000. */
  w: number;
  h: number;
  cx: number;
  /** How far this layer sinks into the one below when assembled (units). */
  seat: number;
  /** 0 = far from camera, 1 = near. Drives z and parallax. */
  depth: number;
  /** Pointer parallax strength 0–1. */
  parallax: number;
  /** >1 heavy and slow (patty), <1 light (onion). */
  weight: number;
  /** Where it comes from when it enters a recipe. */
  enter: "side" | "behind" | "under" | "above";
  label: string;
}

type Feel = Omit<Ingredient, "type" | "src" | "w" | "h" | "cx">;

const FEEL: Record<IngredientType, Feel> = {
  "bun-top":       { seat: 70, depth: 0.9,  parallax: 1.0,  weight: 0.9, enter: "above",  label: "Toasted brioche" },
  pickles:         { seat: 30, depth: 0.8,  parallax: 0.85, weight: 0.7, enter: "side",   label: "Dill pickles" },
  jalapenos:       { seat: 30, depth: 0.8,  parallax: 0.85, weight: 0.7, enter: "behind", label: "Fresh jalapeños" },
  lettuce:         { seat: 40, depth: 0.78, parallax: 0.8,  weight: 0.6, enter: "side",   label: "Iceberg" },
  tomato:          { seat: 30, depth: 0.74, parallax: 0.78, weight: 0.9, enter: "side",   label: "Vine tomato" },
  "crispy-onions": { seat: 35, depth: 0.76, parallax: 0.8,  weight: 0.6, enter: "behind", label: "Crispy onions" },
  onion:           { seat: 25, depth: 0.7,  parallax: 0.75, weight: 0.6, enter: "side",   label: "Red onion" },
  bacon:           { seat: 30, depth: 0.66, parallax: 0.7,  weight: 0.8, enter: "side",   label: "Crispy smoked bacon" },
  cheese:          { seat: 35, depth: 0.55, parallax: 0.6,  weight: 1.0, enter: "under",  label: "American cheese" },
  patty:           { seat: 30, depth: 0.45, parallax: 0.5,  weight: 1.4, enter: "side",   label: "British beef, smashed to order" },
  sauce:           { seat: 15, depth: 0.3,  parallax: 0.4,  weight: 1.0, enter: "under",  label: "House sauce" },
  "bun-bottom":    { seat: 0,  depth: 0.2,  parallax: 0.35, weight: 1.1, enter: "under",  label: "Toasted brioche" },
};

export const INGREDIENTS = Object.fromEntries(
  (Object.keys(FEEL) as IngredientType[]).map((type) => [type, { type, ...LAYERS[type], ...FEEL[type] }]),
) as Record<IngredientType, Ingredient>;
