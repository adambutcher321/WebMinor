/**
 * Fernhollow's inventory — the cabins and the things you can add to a stay.
 *
 * Kept as plain data so the basket, the cabin grid and the extras shelf all
 * price from the same numbers. Every figure here is invented for a concept
 * brand; nothing on this route describes a real business.
 */

export interface Cabin {
  slug: string;
  name: string;
  place: string;
  sleeps: number;
  /** Nightly rate in whole pounds. */
  rate: number;
  image: string;
  alt: string;
  /** The one sentence that sells this cabin rather than the next one. */
  line: string;
  features: string[];
}

export const cabins: Cabin[] = [
  {
    slug: "alderwood",
    name: "Alderwood",
    place: "Loch Vaar, Argyll",
    sleeps: 2,
    rate: 289,
    image: "/demo/fernhollow/cabin-alderwood.webp",
    alt: "A black timber A-frame cabin on the shore of a still loch at dusk, its glass gable lit from within",
    line: "A glass gable that puts the whole loch at the foot of the bed.",
    features: ["Wood burner", "Loch swimming", "Off-grid"],
  },
  {
    slug: "birchfell",
    name: "Birchfell",
    place: "Glen Muick, Aberdeenshire",
    sleeps: 4,
    rate: 245,
    image: "/demo/fernhollow/cabin-birchfell.webp",
    alt: "A low stone and larch bothy set into a heather hillside in morning mist, smoke rising from its chimney",
    line: "A shepherd's bothy rebuilt around one very good fire.",
    features: ["Sleeps four", "Dog friendly", "Drying room"],
  },
  {
    slug: "corrie",
    name: "Corrie",
    place: "Rothiemurchus, Cairngorms",
    sleeps: 2,
    rate: 325,
    image: "/demo/fernhollow/cabin-corrie.webp",
    alt: "A glass-fronted cabin raised on steel legs among tall pines in falling snow, warm light spilling onto the snow",
    line: "Raised into the pines, so the snow arrives at eye level.",
    features: ["Cedar hot tub", "Underfloor heat", "Winter ready"],
  },
  {
    slug: "duneholm",
    name: "Duneholm",
    place: "Sandwood, Sutherland",
    sleeps: 3,
    rate: 265,
    image: "/demo/fernhollow/cabin-duneholm.webp",
    alt: "A black timber cabin on marram grass dunes above a grey sea in low golden evening light",
    line: "Last building before the Atlantic, and it knows it.",
    features: ["Sea view", "Outdoor shower", "Boot room"],
  },
];

export interface Extra {
  id: string;
  name: string;
  /** Price in whole pounds. */
  price: number;
  /** How the charge is applied, and how the basket must total it. */
  unit: "stay" | "night";
  image: string;
  alt: string;
  line: string;
}

export const extras: Extra[] = [
  {
    id: "firewood",
    name: "Firewood bundle",
    price: 18,
    unit: "stay",
    image: "/demo/fernhollow/extra-firewood.webp",
    alt: "A bundle of split silver birch logs tied with twine on a weathered cabin porch",
    line: "Seasoned birch, split and stacked by the door before you arrive.",
  },
  {
    id: "hamper",
    name: "Highland hamper",
    price: 45,
    unit: "stay",
    image: "/demo/fernhollow/extra-hamper.webp",
    alt: "An open wicker hamper with sourdough, eggs, honey and butter on a scrubbed oak table",
    line: "Sourdough, eggs, heather honey and butter. Breakfast solved.",
  },
  {
    id: "hottub",
    name: "Hot tub, heated for arrival",
    price: 60,
    unit: "stay",
    image: "/demo/fernhollow/extra-hottub.webp",
    alt: "A round cedar hot tub steaming on a timber deck at dusk with pines behind",
    line: "Up to temperature by the time you put the handbrake on.",
  },
  {
    id: "dog",
    name: "Bring the dog",
    price: 25,
    unit: "stay",
    image: "/demo/fernhollow/extra-dog.webp",
    alt: "A wet border collie asleep on a sheepskin rug in front of a lit wood burner",
    line: "Towels, a bowl, a bed by the fire and no raised eyebrows.",
  },
];

/** Cleaning and linen, shown so the basket total is never a surprise. */
export const SERVICE_FEE = 35;

export function cabinBySlug(slug: string): Cabin {
  return cabins.find((c) => c.slug === slug) ?? cabins[0];
}

export function money(pounds: number): string {
  return `£${pounds.toLocaleString("en-GB")}`;
}
