/* Fragments that fly off the burger as it comes apart: sauce droplets from the
   sauce, crumbs from the patties, seeds from the top bun, onion and lettuce
   near the top. Cut from one Higgsfield still lit like the layer shoot
   (scripts/burger-me/prompts.md, "debris sprites").

   Units match the layers (top bun width = 1000). `anchor` is a layer id in the
   stack; ox/oy is where the piece sits, relative to that layer's centre, when
   the burger is fully apart (y up). `front` pieces draw over the layers,
   the rest behind them, which gives the spray some depth. */

export interface DebrisPiece {
  src: string;
  /** Width in layer units. */
  w: number;
  anchor: string;
  ox: number;
  oy: number;
  /** Rotation in degrees when fully apart. */
  rot: number;
  front: boolean;
  /** Sits in the lane the ingredient tags use (right of the burger, mid-height);
      only shown below 1024px, where the tags are hidden. */
  tagLane: boolean;
}

const P = (name: string, w: number, anchor: string, ox: number, oy: number, rot: number, front = false, tagLane = false): DebrisPiece => ({
  src: `/demo/burger-me/debris/${name}.webp`, w, anchor, ox, oy, rot, front, tagLane,
});

export const DEBRIS: DebrisPiece[] = [
  // House sauce: the splash fans out on the left and drips below the base.
  P("sauce-1", 130, "sauce", -820, 40, -24, true),
  P("sauce-5", 104, "sauce", -640, -150, 12),
  P("sauce-3", 82, "sauce", -1020, 190, -40),
  P("sauce-7", 50, "sauce", -560, 240, 0, true),
  P("sauce-9", 40, "sauce", -1120, -40, 20, true),
  P("sauce-6", 56, "patty-2", -960, 260, 0, true),
  P("sauce-4", 120, "bun-bottom", 420, -250, 28),
  P("sauce-8", 44, "bun-bottom", 680, -210, 0, true),
  P("sauce-2", 96, "sauce", 760, 90, -18, true, true),
  // Beef crumbs knocked off the smashed edges.
  P("beef-1", 100, "patty-1", -760, 40, 15, true),
  P("beef-3", 104, "patty-2", -900, -40, 30),
  P("beef-5", 88, "patty-1", -1080, 150, -25),
  P("beef-4", 86, "bun-bottom", 160, -290, -10, true),
  P("beef-2", 92, "patty-1", 780, -60, -20, false, true),
  P("beef-6", 80, "patty-2", 860, 30, 40, true, true),
  // Onion slivers and lettuce scraps near the top.
  P("onion-2", 112, "onion", -960, 30, -15),
  P("lettuce-2", 140, "pickles", -820, 90, -30, true),
  P("lettuce-4", 100, "onion", -680, -110, 12),
  P("lettuce-5", 96, "bun-top", -760, 360, 18, true),
  P("onion-1", 70, "bun-top", 640, 420, 40, true),
  P("lettuce-3", 112, "onion", 820, 40, 22, false, true),
  // Sesame seeds shaken off the crown.
  P("seed-1", 18, "bun-top", -420, 360, 20, true),
  P("seed-2", 22, "bun-top", 380, 400, -10, true),
  P("seed-3", 20, "bun-top", -580, 270, 40, true),
  P("seed-4", 17, "bun-top", 300, 520, 0, true),
  P("seed-5", 18, "bun-top", -260, 470, -30, true),
  P("seed-6", 15, "bun-top", 120, 560, 10, true),
  P("seed-7", 14, "bun-top", -120, 600, 60, true),
];
