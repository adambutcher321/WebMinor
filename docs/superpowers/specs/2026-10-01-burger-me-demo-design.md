# Burger Me — tenth WebMinor concept build

Date: 2026-10-01. Route: `/demo/burger-me` on `scroll-world`. Status: approved design, not built.

## Why this build exists

A showcase for the work page (`/case-studies`), built to Adam's "Signature Burger Motion System"
brief: the exploded burger is the interface. One physical burger exists throughout the site; it
separates, rebuilds and changes recipe in place rather than swapping photographs.

Showcase rules apply (see memory `demo-builds-are-showcases-not-products`): award-tier visuals,
correct at 375 / 768 / 1440, the happy path of each feature working. No production-depth
engineering, exhaustive a11y patterns or multi-round review loops.

## Decisions taken in brainstorming

- Concept brand, invented here (name, menu, prices, copy).
- Scope: home + menu + per-burger detail + bag. No custom builder.
- Burger technique: photographic transparent layers from one Higgsfield "shoot", animated in
  2.5D with CSS transforms. Not real 3D, not scrubbed video.
- Look: sauce-red stage (below). Deliberately unlike the eight warm-amber-on-black demos and
  cold Threshold.
- Card → detail hand-off is a hand-rolled FLIP, not Next's `experimental.viewTransition`
  (that flag is site-wide and would crossfade every WebMinor navigation).

## Visual identity

- Stage: oxblood `#3a0c0a` fading to `#1c0605`, one hard warm key light from top-left behind
  the burger (radial glow), subtle grain.
- Accents: mustard `#f2b705` (prices, highlights), ketchup `#d6261c` (actions), cream
  `#f6eddc` light sections with ink `#1a0f0c` type.
- Type: Bricolage Grotesque via `next/font/google`, heavy and condensed (`wdth` ~75, weight
  800) for display; a plain sans for body. Neither is used by another demo.
- Logo: chunky BURGER ME wordmark. Several vector candidates are shown to Adam on the real
  stage before one is chosen; nothing is locked until he picks.

## Menu (data)

Five burgers, prices in sterling, top → bottom stacks with persistent instance ids:

| Burger | Price | Differs from The Original |
|---|---|---|
| The Original | £11.50 | — (bun-top, pickles, onion, cheese-1, patty-1, cheese-2, patty-2, sauce, bun-bottom) |
| Bacon Cheese | £13.00 | + bacon (between onion and cheese-1) |
| Hot Honey | £12.50 | + jalapeños, − pickles |
| The Deluxe | £12.50 | + lettuce, + tomato, − onion |
| Smokehouse | £13.50 | + bacon, + crispy onions, − pickles |

Each burger also carries a one-line description, an allergens line and quality labels keyed to
ingredient types. All copy lives in one `content.ts`.

## Imagery (Higgsfield)

One pipeline, in order, so every layer comes from the same "shoot":

1. **Master**: The Original fully assembled, `flux_2` 2k, 3/4 side view ~15° above, 85mm, hard
   key light from top-left, oxblood seamless. This fixes lens, light and scale.
2. **Exploded still**: `nano_banana_pro` with the master as `--image-references`, edit-style
   prompt: same burger, every layer separated vertically on one axis, same camera, no layer
   touching another.
3. **Slice**: background remover once on the exploded still, then split into one transparent
   WebP per ingredient along the fully transparent rows between layers (script, trimmed to
   content). Duplicates (second patty, second cheese) reuse the same file.
4. **Extras**: bacon, jalapeños, lettuce, tomato, crispy onions — each a `nano_banana_pro` edit
   of the same exploded still adding that ingredient as its own layer; cut out only that layer.
   Fallback if one drifts in look: generate it alone against the same reference and
   colour-match.
5. **QA**: stack layers in code beside the master photo and tune each ingredient's `seat`
   (overlap) until the rebuilt burger matches.
6. **Cover**: 16:9 cinematic still of the burger mid-explode on the red stage →
   `public/work/covers/burger-me.webp`.

Known gotchas from earlier builds apply: upload references as PNG/JPG with
`higgsfield upload create`; run `image_background_remover` in a foreground call with
`</dev/null`; check each output file is non-empty. Budget ~60–100 credits.

Assets: `public/demo/burger-me/` (`master.webp`, `layers/<type>.webp`, cover in
`public/work/covers/`).

## Engine

Under `src/app/demo/burger-me/engine/`.

**Data**
- `ingredients.ts`: per type — `src`, intrinsic `w`/`h`, `seat` (px it sinks into the layer
  below when assembled), `depth` (0–1), `parallax` (0–1), `weight` (drives lag/easing:
  patty heavy, onion light, bacon light with extra twist), `label`.
- `burgers.ts`: menu entries; `stack` is a top → bottom array of `{ id, type }`.

**Pure functions (unit-tested)**
- `diffStacks(prev, next)` → per id: `unchanged | entering | exiting | moved`.
- `layoutStack(stack, explode, opts)` → per layer `{ y, z, rx, ry, rz, scale, shadow }`.
  Assembled `y` is the cumulative height minus seats; exploded adds an even spread scaled by
  `explode`. Rotations come from a per-id seeded value × `explode`, capped at 2–3°. `shadow`
  (contact-shadow strength) rises as the gap to the next layer closes.

**`<ExplodedBurger burger previous progress interactive labels compact />`**
- One absolutely positioned `<img>` per layer, keyed by instance id so persisting layers keep
  their DOM node across recipe changes. Transforms only (`translate3d`, `rotate`, `scale`),
  plus opacity. Contact shadows are blurred radial-gradient elements, not CSS filters.
- **Recipe change** (~1.4s): stack opens → exiting layers drift sideways and fade while
  entering ones arrive (bacon slides from the side, jalapeños rise from behind, extra cheese
  slips from under a patty) → name/copy/price swap → rebuild bottom-first with stagger, top bun
  last with a tiny settle. Per-ingredient easing from `weight`. No elastic overshoot.
- **Pointer** (fine pointers only): whole burger leans ≤4° toward the cursor; each layer offsets
  by `depth × parallax`. Disabled on touch.
- **Scroll mode**: driven by a `progress` prop (0–1).
- **Housekeeping**: one rAF loop per instance, paused when off-screen (IntersectionObserver) and
  in hidden tabs; `will-change` only while animating; respects `prefers-reduced-motion`
  (instant recipe swaps, no pointer lean, no scroll explode beyond a static exploded state).

## Pages

**Home (`/demo/burger-me`)**
1. Nav (logo, Menu, Our beef, Find us, bag button with count).
2. Hero story — pinned, ~400svh desktop, shorter on phones. Progress beats:
   0–15% assembled · 15–45% separates (slow push-in, slight drift/rise) · 45–65% quality labels
   pinned to their ingredients (BRITISH BEEF, SMASHED TO ORDER, AMERICAN CHEESE, HOUSE SAUCE,
   TOASTED BRIOCHE) · 65–85% moves back together · 85–100% rebuilt, hands off to the next
   section.
3. "Built differently" stage — five burger chips; picking one runs the recipe change; name,
   copy, price update; Add to bag.
4. Menu teaser — three cards linking to `/menu`.
5. Sourcing band (cream) and locations/hours strip.
6. Footer.

**Menu (`/demo/burger-me/menu`)** — five cards, each a `compact` live burger. Desktop hover:
card lifts, layers part a few px, light warms, title strengthens, cursor becomes a VIEW pill.
Click records the burger's rect for the hand-off.

**Detail (`/demo/burger-me/menu/[slug]`)** — FLIP intro: burger starts at the recorded card
rect (or centre if none), scales into the centre while the page darkens, separates, labels
appear, product info rises. Then: ingredient list, price, allergens, Add to bag, "try another"
chips that run the recipe change in place (URL updates with `replaceState`).

**Bag** — `localStorage`, slide-out drawer, quantities, "Order for collection" → confirmation
("ready in 15 minutes"). Happy path only.

## Responsive

- Desktop: full explode, pointer lean and parallax, tags pinned to ingredients.
- Tablet: reduced depth and explode distance; touch-friendly chips.
- Phone: explode kept with less distance and flatter perspective; no pointer tracking; labels
  shown as one readable caption at a time under the burger; shorter pinned story.
- Layout decisions in CSS media queries (not `useMediaQuery` state) to avoid hydration jumps.
- No horizontal scroll at 375, 768, 1440; checked in real Chrome via Puppeteer (the Browser
  pane drops video/canvas and misreads programmatic scroll).

## Work page

- New first entry in `src/app/case-studies/work-entries.ts` (card 01 / 10); `COUNT_WORDS`
  reaches "Ten".
- Cover `public/work/covers/burger-me.webp`; logo overlay captured with
  `scripts/work-logos/capture.mjs` into `public/work/logos/burger-me.webp`.
- Committed on `scroll-world`; pushed only when Adam says.

## Testing

- Unit tests for `diffStacks` and `layoutStack` only.
- `eslint` clean on new files, `next build` passes with the new routes.
- Visual checks at 1440 and 375 per task; final pass at 375 / 768 / 1440: hero story at each
  beat, a recipe change mid-flight, menu hover, card → detail hand-off, add to bag and order.

## Out of scope

Custom burger builder, real ordering/payments, accounts, CMS, WebGL, exhaustive keyboard and
screen-reader patterns beyond sensible basics (labels, visible focus, Escape closes the drawer).
