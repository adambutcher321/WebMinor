/* The concept builds listed on the work page, newest first. Kept out of
   page.tsx so the list can be tested: a page file may only export what Next
   expects of it. */

export interface WorkEntry {
  name: string;
  href: string;
  external?: boolean;
  disciplines: string;
  summary: string;
  image: string;
  alt: string;
  /** The build's own nav wordmark in white, laid over the cover. Captured by
   *  scripts/work-logos/capture.mjs; width and height are the file's pixels. */
  logo?: { src: string; width: number; height: number };
  tag: string;
  spec: { term: string; value: string }[];
  cta: string;
}

export const conceptBuilds: WorkEntry[] = [
  {
    name: "Threshold",
    href: "/demo/threshold",
    external: true,
    disciplines: "Fitness · Strength studio",
    summary:
      "A coached strength studio in cold dual light: the athlete threads through the wordmark, the week is a wall of giant times you can book into, and membership is one slider that prices as it moves.",
    image: "/work/covers/threshold.webp",
    alt: "Threshold cover — the athlete sprinting out of the set position through magenta and cyan haze",
    logo: { src: "/work/logos/threshold.webp", width: 780, height: 144 },
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · UI · Motion · Booking" },
      { term: "Status", value: "Live demo" },
    ],
    cta: "View the build",
  },
  {
    name: "Boucher Tailored",
    href: "/demo/boucher",
    external: true,
    disciplines: "Outerwear · Ecommerce",
    summary:
      "One cropped puffer in five colourways: a product stage where the whole page tints with the jacket, a limited hand-drawn Doodle Edition, and a working basket and wishlist.",
    image: "/work/covers/boucher.webp",
    alt: "Boucher Tailored cover — the orange puffer floating in a beam of light",
    logo: { src: "/work/logos/boucher.webp", width: 834, height: 228 },
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · Logo · Product · Cart" },
      { term: "Colourways", value: "Five" },
    ],
    cta: "View the build",
  },
  {
    name: "Fernhollow",
    href: "/demo/fernhollow",
    external: true,
    disciplines: "Hospitality · Short-stay",
    summary:
      "A cabin rental brand: full-bleed photography, a booking widget that floats with the scroll, and a browsable rooms gallery.",
    image: "/work/covers/fernhollow.webp",
    alt: "Fernhollow cover — the A-frame cabin glowing on a misty lake at blue hour",
    logo: { src: "/work/logos/fernhollow.webp", width: 804, height: 168 },
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · UI · Booking" },
      { term: "Status", value: "Live demo" },
    ],
    cta: "View the build",
  },
  {
    name: "Mindful",
    href: "/demo/mindful",
    external: true,
    disciplines: "Wellness · Coaching",
    summary:
      "A private yoga and breath coach: an interactive hero, four ways to work together, an eight-week signature programme, dated retreats, a journal and a free guide, all routed through one booking flow.",
    image: "/work/covers/mindful.webp",
    alt: "Mindful cover — Jessica in tree pose on a hilltop at golden hour",
    logo: { src: "/work/logos/mindful.webp", width: 618, height: 192 },
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · Illustration · Copy · UI" },
      { term: "Pages", value: "Nine" },
    ],
    cta: "View the build",
  },
  {
    name: "ALTRIX",
    href: "/demo/altrix",
    external: true,
    disciplines: "Hardware · Outdoor",
    summary:
      "An expedition smartwatch: a dark cinematic stage, a single ember accent, and an altimeter that climbs as you scroll.",
    image: "/work/covers/altrix-dawn.webp",
    alt: "ALTRIX cover — the watch propped on a frosted granite ledge at dawn, peaks behind",
    logo: { src: "/work/logos/altrix.webp", width: 588, height: 96 },
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · Product · Motion" },
      { term: "Status", value: "Live demo" },
    ],
    cta: "View the build",
  },
  {
    name: "Voltiva Electrical",
    href: "/demo/voltiva",
    external: true,
    disciplines: "Trade · Electrical contractor",
    summary:
      "A working electrician's site built to a client-supplied layout in their own brand: an eight-service grid that overlaps the hero, and a quote form that carries the job type through.",
    image: "/work/covers/voltiva.webp",
    alt: "Voltiva cover — an electrician beside a glowing EV charger on a wet street at dusk",
    logo: { src: "/work/logos/voltiva.webp", width: 786, height: 192 },
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · UI · Copy" },
      { term: "Status", value: "Live demo" },
    ],
    cta: "View the build",
  },
  {
    name: "Crookeries",
    href: "/demo/crookeries",
    external: true,
    disciplines: "Ecommerce · Kitchenware",
    summary:
      "A sustainable kitchenware storefront: a long editorial scroll of generated photography, a four-up product grid, and a product page built from the same rules.",
    image: "/work/covers/crookeries.webp",
    alt: "Crookeries cover — enamel casseroles on dark oak, steam in a shaft of window light",
    logo: { src: "/work/logos/crookeries.webp", width: 720, height: 246 },
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · UI · Ecommerce" },
      { term: "Status", value: "Live demo" },
    ],
    cta: "View the build",
  },
  {
    name: "Lucid",
    href: "/demo/lucid",
    external: true,
    disciplines: "Hardware · Spatial computing",
    summary:
      "A spatial headset launch page: an oversized pale wordmark behind the product, technical callouts on leader lines, and a headset that tilts and lifts with the cursor on its own layer.",
    image: "/work/covers/lucid-one.webp",
    alt: "Lucid cover — the headset on wet slate, its amber optics glowing",
    logo: { src: "/work/logos/lucid.webp", width: 768, height: 168 },
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · Product · Motion" },
      { term: "Status", value: "Live demo" },
    ],
    cta: "View the build",
  },
  {
    name: "KLIK",
    href: "/demo/klik",
    external: true,
    disciplines: "Fintech · Consumer payments",
    summary:
      "A consumer payment app with attitude: oversized condensed type broken across the grid, a flocked brand character in oversized trainers, and payment flows that animate the product before the copy explains it.",
    image: "/work/covers/klik.webp",
    alt: "KLIK cover — the mascot mid-leap, flicking a glowing orange card",
    logo: { src: "/work/logos/klik.webp", width: 234, height: 234 },
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · UI · Motion" },
      { term: "Status", value: "Live demo" },
    ],
    cta: "View the build",
  },
];
