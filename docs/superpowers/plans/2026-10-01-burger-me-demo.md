# Burger Me Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/demo/burger-me`, the tenth WebMinor concept build: a burger restaurant site whose interface is one photographic burger that explodes, rebuilds and changes recipe in place.

**Architecture:** One Higgsfield "shoot" produces transparent ingredient layers that share lens, light and scale. A small engine (pure data + pure layout/diff/beat functions + one `ExplodedBurger` client component driving a rAF loop that writes transforms directly to the DOM) renders the burger everywhere: a scroll-pinned home story, a recipe-switching stage, menu cards and a detail page reached by a FLIP hand-off. A localStorage bag finishes the happy path.

**Tech Stack:** Next.js 16.2 App Router (scroll-world worktree), React 19, CSS Modules, `next/font/google` (Bricolage Grotesque), Vitest + jsdom, Puppeteer + real Chrome for visual checks, Higgsfield CLI (`flux_2`, `nano_banana_pro`, `image_background_remover`), Python 3 + Pillow + numpy, `cwebp`.

**Spec:** `docs/superpowers/specs/2026-10-01-burger-me-demo-design.md`

## Global Constraints

- Work only in `/Users/adambutcher/Desktop/webminor/.worktrees/scroll-world`. Commit there; never push.
- This is a showcase demo: award-tier visuals at 375 / 768 / 1440 and the happy path working. No exhaustive a11y patterns, edge-case state handling or multi-round review loops. Sensible basics only: labels, visible focus, Escape closes the drawer.
- Colours (verbatim): stage oxblood `#3a0c0a` → `#1c0605`; mustard `#f2b705`; ketchup `#d6261c`; cream `#f6eddc`; ink `#1a0f0c`.
- Display type: Bricolage Grotesque, heavy (800) and condensed (`wdth` 75). Body: Bricolage Grotesque at normal width, 400/500.
- Animate only `transform` and `opacity`. No animated `top/left/width/height/margin/padding`. No CSS `filter` on moving layers.
- Pointer lean only on `(hover: hover) and (pointer: fine)`; max whole-burger tilt 4°; per-ingredient rotation ≤ 3°.
- Respect `prefers-reduced-motion: reduce` (instant swaps, no lean, no scroll explode).
- Layout decisions in CSS media queries, not `useMediaQuery` state (hydration jumps). Use `useMediaQuery` from `src/app/demo/useClientEnv.ts` only to attach listeners.
- CSS-module gotcha: a module class that sets `display` beats Tailwind `hidden`; do responsive show/hide inside the module.
- Tailwind preflight caps `img { max-width:100% }`: layer images need `max-width: none`.
- Prices in sterling, copy in British English, no lorem ipsum.
- Every replaced image gets a new filename (next/image cache goes stale on replace).
- Pages are `robots: { index: false, follow: false }` like the other demos.

---

## File Structure

```
scripts/burger-me/
  gen.sh                 Higgsfield job → downloaded PNG (model + ref aware)
  slice.py               exploded cut-out → one trimmed PNG per band + manifest (units: bun width = 1000)
  export.sh              PNG layers → WebP with alpha
  prompts.md             the prompts actually used, for reruns
  shot.mjs               Puppeteer screenshot: url, width, scroll fraction → PNG

public/demo/burger-me/
  master.webp            assembled Original (QA + OG)
  layers/<type>.webp     one per ingredient type (12)

src/app/demo/burger-me/
  layout.tsx             fonts, metadata, BagProvider, Nav, Footer, BagDrawer
  burger-me.module.css   tokens + site chrome + section styles
  content.ts             all copy (hero statements, sourcing, locations, footer)
  Logo.tsx               chosen wordmark (Task 4 gate)
  Nav.tsx  Footer.tsx
  BagProvider.tsx  BagDrawer.tsx
  HeroStory.tsx          pinned scroll story
  BuiltDifferently.tsx   recipe-switching stage
  Sections.tsx           MenuTeaser, Sourcing, FindUs
  flip.ts                record/read the card rect for the hand-off
  page.tsx               home
  menu/page.tsx  menu/MenuCard.tsx
  menu/[slug]/page.tsx  menu/[slug]/Detail.tsx
  lab/page.tsx           QA bench (deleted in Task 10)
  engine/
    layers.generated.ts  written by slice.py (w, h, cx per type, in units)
    ingredients.ts       per-type feel: seat, depth, parallax, weight, enter, label
    burgers.ts           menu: five burgers with persistent-id stacks
    diff.ts  diff.test.ts
    layout.ts  layout.test.ts
    beats.ts  beats.test.ts
    motion.ts  motion.test.ts
    ExplodedBurger.tsx  explodedBurger.module.css

src/app/case-studies/work-entries.ts (+ .test.ts regex)   new first entry
src/app/case-studies/page.tsx                              COUNT_WORDS gains "Ten"
scripts/work-logos/capture.mjs                             burger-me brand entry
public/work/covers/burger-me.webp  public/work/logos/burger-me.webp
```

---

### Task 1: The shoot — master, exploded still, sliced layers

This task is run by the **controller**, not a subagent: every step needs a visual judgement on generated images. Budget: ~189 credits available; this task should spend ≤ 60.

**Files:**
- Create: `scripts/burger-me/gen.sh`, `scripts/burger-me/slice.py`, `scripts/burger-me/export.sh`, `scripts/burger-me/prompts.md`
- Create: `public/demo/burger-me/master.webp`, `public/demo/burger-me/layers/*.webp`
- Create: `src/app/demo/burger-me/engine/layers.generated.ts`
- Scratch (git-ignored, not committed): `.superpowers/burger-me/` for raw PNGs

**Interfaces:**
- Produces: `LAYERS: Record<IngredientType, { w: number; h: number; cx: number; src: string }>` in `layers.generated.ts`, units where the top bun's width = 1000. `IngredientType` is the union in Task 2; this file declares its own string keys and Task 2 types them.

- [ ] **Step 1: Write `scripts/burger-me/gen.sh`**

```bash
#!/usr/bin/env bash
# Usage: gen.sh <model> <out.png> <aspect> <prompt> [ref upload id ...]
# One Higgsfield image job, waits, downloads the result (not the input) to <out.png>.
set -euo pipefail
model="$1"; out="$2"; aspect="$3"; prompt="$4"; shift 4
args=(generate create "$model" --prompt "$prompt" --aspect_ratio "$aspect" --resolution 2k --wait --wait-timeout 10m --json)
if [ "$model" = "flux_2" ]; then args+=(--variant pro); fi
for ref in "$@"; do args+=(--image-references "$ref"); done
json="$(higgsfield "${args[@]}" </dev/null)"
url="$(printf '%s' "$json" | python3 -c 'import sys,json; d=json.load(sys.stdin); d=d[0] if isinstance(d,list) else d; print(d.get("result_url") or d["results"][0]["url"])')"
curl -sSL "$url" -o "$out"
[ -s "$out" ] || { echo "empty result for $out" >&2; exit 1; }
echo "$out"
```

Run: `chmod +x scripts/burger-me/gen.sh && mkdir -p .superpowers/burger-me && grep -q '^.superpowers' .gitignore && echo ignored`
Expected: `ignored` (the folder is already git-ignored; if not, add `.superpowers/` to `.gitignore`).

- [ ] **Step 2: Generate the master (assembled Original)**

Prompt (save verbatim into `prompts.md` under "master"):

```
Premium food advertising photograph of a single double smash burger on a deep oxblood red seamless studio backdrop. From top to bottom: glossy toasted brioche top bun with a few sesame seeds, crinkle-cut dill pickle slices, thin rings of red onion, a slice of melted American cheese draping over a dark crusted smash patty with lacy crispy edges, a second slice of melted American cheese over a second smash patty, a layer of orange burger sauce, toasted brioche bottom bun. Camera: three-quarter side view, lens about 15 degrees above the burger, 85mm, burger centred and filling 60 percent of the frame width, whole burger in frame with generous space above and below. Lighting: one hard warm key light from the top left, soft fill from the right, glossy highlights on the bun, crisp shadow falling to the lower right, rich saturated colour. Sharp focus across the whole burger, appetising, real food photography.
```

Run: `scripts/burger-me/gen.sh flux_2 .superpowers/burger-me/master-a.png 4:5 "<prompt>"`
Then look at it (Read the PNG). Accept when: all nine layers are visible and recognisable from the side, the burger is not cropped, the angle is a clear 3/4 from slightly above, background is plain oxblood. Otherwise rerun (max 3 tries; `4:5` is valid for flux_2? if the CLI rejects it use `3:4`).

- [ ] **Step 3: Upload the master as a reference**

Run: `higgsfield upload create .superpowers/burger-me/master-a.png --json`
Record the returned id as `MASTER_ID` in `prompts.md`. (PNG, not WebP: WebP uploads fail the signed PUT.)

- [ ] **Step 4: Generate the exploded still**

Prompt (save under "exploded"):

```
Turn this burger into a full exploded-view food advertising photograph. Keep exactly the same burger, same ingredients, same camera angle (three-quarter side view, 15 degrees above), same lens, same hard warm key light from the top left, same oxblood red seamless backdrop. Separate EVERY layer vertically along one straight vertical axis, evenly spaced, each layer floating level and centred above the one below, with a clear empty gap of backdrop between every layer so no two layers touch or overlap: top bun, pickles, red onion, cheese slice, smash patty, cheese slice, smash patty, burger sauce as its own thin round dollop layer, bottom bun. Every layer fully in frame, nothing cropped. Real food photography, sharp focus throughout.
```

Run: `scripts/burger-me/gen.sh nano_banana_pro .superpowers/burger-me/exploded-a.png 2:3 "<prompt>" $MASTER_ID`
Accept when: every layer is separated by visible backdrop (horizontal clear bands), all layers centred on one axis, same look as master. If two layers touch, rerun once with "much larger gaps" added; if still touching, accept and let slicing merge them (merged sauce+bottom bun is acceptable: drop `sauce` as a type and put its label on `bun-bottom`).

- [ ] **Step 5: Cut out the background**

Run in the foreground (it hangs from background scripts):
```bash
id=$(higgsfield upload create .superpowers/burger-me/exploded-a.png --json | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("id") or d[0]["id"])')
json=$(higgsfield generate create image_background_remover --image-references "$id" --wait --wait-timeout 10m --json </dev/null)
url=$(printf '%s' "$json" | python3 -c 'import sys,json; d=json.load(sys.stdin); d=d[0] if isinstance(d,list) else d; print(d.get("result_url") or d["results"][0]["url"])')
curl -sSL "$url" -o .superpowers/burger-me/exploded-a-cut.png && python3 -c "from PIL import Image; im=Image.open('.superpowers/burger-me/exploded-a-cut.png'); print(im.mode, im.size)"
```
Expected: `RGBA (w, h)`.

- [ ] **Step 6: Write `scripts/burger-me/slice.py`**

```python
#!/usr/bin/env python3
"""Slice an exploded cut-out into one trimmed PNG per layer.

Usage: slice.py <cut.png> <outdir> <name,name,...> [--manifest file.json] [--min-gap 6] [--min-h 12]

Bands are runs of rows that contain opaque pixels, separated by >= min-gap fully
transparent rows. Names are assigned top to bottom; the count must match.
Dimensions are written in units where the FIRST band's width = 1000, and cx is
the band's horizontal centre minus the first band's centre, in the same units.
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image

def bands(alpha, min_gap, min_h):
    rows = (alpha > 24).any(axis=1)
    out, start, gap = [], None, 0
    for y, on in enumerate(rows):
        if on:
            if start is None:
                start = y
            gap = 0
        elif start is not None:
            gap += 1
            if gap >= min_gap:
                end = y - gap + 1
                if end - start >= min_h:
                    out.append((start, end))
                start, gap = None, 0
    if start is not None and len(rows) - start >= min_h:
        out.append((start, len(rows)))
    return out

def main():
    args = sys.argv[1:]
    src, outdir, names = args[0], Path(args[1]), args[2].split(",")
    opt = lambda k, d: int(args[args.index(k) + 1]) if k in args else d
    manifest = args[args.index("--manifest") + 1] if "--manifest" in args else None
    im = Image.open(src).convert("RGBA")
    a = np.array(im)[:, :, 3]
    found = bands(a, opt("--min-gap", 6), opt("--min-h", 12))
    if len(found) != len(names):
        sys.exit(f"found {len(found)} bands, expected {len(names)}: {found}")
    outdir.mkdir(parents=True, exist_ok=True)
    info, ref_w, ref_c = {}, None, None
    for (y0, y1), name in zip(found, names):
        cols = np.where((a[y0:y1] > 24).any(axis=0))[0]
        x0, x1 = int(cols[0]), int(cols[-1]) + 1
        crop = im.crop((x0, y0, x1, y1))
        crop.save(outdir / f"{name}.png")
        w, h, c = x1 - x0, y1 - y0, (x0 + x1) / 2
        if ref_w is None:
            ref_w, ref_c = w, c
        k = 1000 / ref_w
        info[name] = {"w": round(w * k, 1), "h": round(h * k, 1), "cx": round((c - ref_c) * k, 1), "px": [w, h]}
        print(f"{name:14s} {w}x{h}px  -> w={info[name]['w']} h={info[name]['h']} cx={info[name]['cx']}")
    if manifest:
        Path(manifest).write_text(json.dumps(info, indent=2))

if __name__ == "__main__":
    main()
```

- [ ] **Step 7: Slice the Original's layers**

Run:
```bash
python3 scripts/burger-me/slice.py .superpowers/burger-me/exploded-a-cut.png .superpowers/burger-me/layers \
  bun-top,pickles,onion,cheese,patty,cheese-2,patty-2,sauce,bun-bottom --manifest .superpowers/burger-me/original.json
```
Expected: 9 lines of dimensions. If the band count is wrong, adjust `--min-gap`/`--min-h` (seeds or drips make tiny bands: raise `--min-h`); if two layers are merged, rename accordingly (see Step 4 fallback). Read 3–4 of the PNGs to confirm each is one clean ingredient. `cheese-2`/`patty-2` are kept only to compare with `cheese`/`patty`; the site reuses one file per type.

- [ ] **Step 8: Generate the five extra ingredients**

Upload the exploded still: `higgsfield upload create .superpowers/burger-me/exploded-a.png --json` → `EXPLODED_ID`. For each extra, one `nano_banana_pro` edit at `2:3` with refs `$EXPLODED_ID`, prompt template (save each under "extra-<type>"):

```
Edit this exploded burger photograph: add <INGREDIENT> as one more separate floating layer, placed <POSITION>. Keep every other layer, the camera angle, lens, light, scale, spacing and oxblood backdrop exactly the same. The new layer floats level on the same vertical axis with a clear gap of backdrop above and below it, touching nothing. Real food photography.
```

| type | INGREDIENT | POSITION |
|---|---|---|
| bacon | three rashers of crispy smoked streaky bacon, slightly curled | between the red onion and the first cheese slice |
| jalapenos | a scattered single layer of fresh green jalapeño slices | between the pickles and the red onion |
| lettuce | one ruffled leaf of crisp iceberg lettuce | between the pickles and the red onion |
| tomato | two thick slices of ripe red tomato side by side | between the pickles and the red onion |
| crispy-onions | a loose nest of golden crispy fried onions | between the pickles and the red onion |

Run all five with `gen.sh` (they may run in parallel as background jobs; check every output is non-empty). Then background-remove each in the foreground (Step 5 commands, one file at a time) and slice each with names in that image's top-to-bottom order, e.g. bacon:
`bun-top,pickles,onion,bacon,cheese,patty,cheese-2,patty-2,sauce,bun-bottom` → `--manifest .superpowers/burger-me/extra-bacon.json`, outdir `.superpowers/burger-me/extra-bacon/`.
Because slice.py normalises to the image's own top bun, the extra's w/h/cx are already in the shared unit. Keep only the new ingredient's PNG + manifest entry. Read each new PNG beside `patty.png` and confirm colour/light match. Fallback for one that drifts: generate the ingredient alone ("only the <INGREDIENT>, floating, same angle, light and backdrop as the reference") with both `$MASTER_ID` and `$EXPLODED_ID` as refs, cut, trim, and set its w by eye relative to the bun (bacon ≈ 0.95, jalapeños ≈ 0.85, lettuce ≈ 1.05, tomato ≈ 0.9, crispy onions ≈ 0.85 of the bun width).

- [ ] **Step 9: Export WebPs and write `layers.generated.ts`**

`scripts/burger-me/export.sh`:
```bash
#!/usr/bin/env bash
# Usage: export.sh <png> <out.webp>  — max 900px wide, alpha kept exactly
set -euo pipefail
python3 - "$1" /tmp/bm-resize.png <<'PY'
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert("RGBA")
if im.width > 900:
    im = im.resize((900, round(im.height * 900 / im.width)), Image.LANCZOS)
im.save(sys.argv[2])
PY
cwebp -quiet -q 84 -alpha_q 100 -exact /tmp/bm-resize.png -o "$2"
```

Export the 12 types (`bun-top, pickles, onion, cheese, patty, sauce, bun-bottom, bacon, jalapenos, lettuce, tomato, crispy-onions`) to `public/demo/burger-me/layers/<type>.webp`, and the master to `public/demo/burger-me/master.webp` (`cwebp -q 84`, max 1400 wide). Then write `src/app/demo/burger-me/engine/layers.generated.ts` from the manifests (by hand or a one-off python print), e.g.:

```ts
/* Written from scripts/burger-me/slice.py manifests. Units: top bun width = 1000.
   cx is the layer's centre offset from the top bun's centre. Do not hand-tune
   these; tune `seat` in ingredients.ts instead. */
export const LAYERS = {
  "bun-top": { w: 1000, h: 0, cx: 0, src: "/demo/burger-me/layers/bun-top.webp" },
  // …one entry per type, h/cx from the manifests
} as const;
```

Run: `du -ch public/demo/burger-me/layers/*.webp | tail -1`
Expected: total under ~2.5 MB.

- [ ] **Step 10: Commit**

```bash
git add scripts/burger-me public/demo/burger-me src/app/demo/burger-me/engine/layers.generated.ts
git commit -m "feat(burger-me): ingredient layer shoot — master, exploded slices, five extras"
```

---

### Task 2: Engine data and pure functions

**Files:**
- Create: `src/app/demo/burger-me/engine/ingredients.ts`, `burgers.ts`, `diff.ts`, `layout.ts`, `beats.ts`, `motion.ts`
- Test: `diff.test.ts`, `layout.test.ts`, `beats.test.ts`, `motion.test.ts` (same folder)

**Interfaces:**
- Consumes: `LAYERS` from `layers.generated.ts` (Task 1).
- Produces:
  - `type IngredientType = "bun-top"|"pickles"|"onion"|"cheese"|"patty"|"sauce"|"bun-bottom"|"bacon"|"jalapenos"|"lettuce"|"tomato"|"crispy-onions"`
  - `interface Ingredient { type; src; w; h; cx; seat; depth; parallax; weight; enter: "side"|"behind"|"under"|"above"; label: string }`
  - `INGREDIENTS: Record<IngredientType, Ingredient>`
  - `interface LayerSpec { id: string; type: IngredientType }`
  - `interface Burger { slug; name; price: number; tagline; description; allergens; stack: LayerSpec[] /* top→bottom */; adds: IngredientType[] }`
  - `BURGERS: Burger[]`, `bySlug(slug): Burger | undefined`, `formatPrice(n): string`
  - `type Change = "unchanged"|"entering"|"exiting"|"moved"`; `diffStacks(prev: LayerSpec[], next: LayerSpec[]): Map<string, Change>`
  - `interface Placed { id; type; index /*0 = bottom*/; x; y; z; rx; ry; rz; shadow }`; `interface LayoutOpts { gap: number; depth: number; maxRot: number }`; `layoutStack(stack, explode, opts, dims?): Placed[]`; `stackHeight(stack, explode, opts, dims?): number`
  - `interface Beat { explode; labels; scale; x; y }`; `heroBeat(p: number): Beat`
  - `approach(current, target, dt, rate): number`; `smoothstep(a, b, x): number`; `seeded(id: string, salt: string): number /* -1..1 */`

- [ ] **Step 1: Write the failing tests**

`motion.test.ts`
```ts
import { describe, it, expect } from "vitest";
import { approach, smoothstep, seeded } from "./motion";

describe("motion helpers", () => {
  it("approach moves toward the target and never overshoots", () => {
    const v = approach(0, 10, 1 / 60, 8);
    expect(v).toBeGreaterThan(0);
    expect(v).toBeLessThan(10);
    expect(approach(0, 10, 10, 8)).toBeCloseTo(10, 3);
  });
  it("approach snaps when rate is infinite", () => {
    expect(approach(3, 7, 1 / 60, Infinity)).toBe(7);
  });
  it("smoothstep clamps and eases", () => {
    expect(smoothstep(0, 1, -1)).toBe(0);
    expect(smoothstep(0, 1, 2)).toBe(1);
    expect(smoothstep(0, 1, 0.5)).toBeCloseTo(0.5);
  });
  it("seeded is deterministic and in range", () => {
    expect(seeded("patty-1", "rz")).toBe(seeded("patty-1", "rz"));
    for (const id of ["a", "b", "bun-top", "cheese-2"]) {
      const v = seeded(id, "rx");
      expect(v).toBeGreaterThanOrEqual(-1);
      expect(v).toBeLessThanOrEqual(1);
    }
    expect(seeded("a", "rz")).not.toBe(seeded("b", "rz"));
  });
});
```

`diff.test.ts`
```ts
import { describe, it, expect } from "vitest";
import { diffStacks } from "./diff";
import { bySlug } from "./burgers";

describe("diffStacks", () => {
  it("Original → Bacon Cheese adds only bacon", () => {
    const d = diffStacks(bySlug("the-original")!.stack, bySlug("bacon-cheese")!.stack);
    expect(d.get("bacon")).toBe("entering");
    expect([...d.values()].filter((c) => c !== "unchanged")).toEqual(["entering"]);
  });
  it("Original → Hot Honey swaps pickles for jalapeños", () => {
    const d = diffStacks(bySlug("the-original")!.stack, bySlug("hot-honey")!.stack);
    expect(d.get("pickles")).toBe("exiting");
    expect(d.get("jalapenos")).toBe("entering");
    expect(d.get("patty-1")).toBe("unchanged");
  });
  it("flags a reorder as moved", () => {
    const a = [{ id: "x", type: "onion" as const }, { id: "y", type: "pickles" as const }];
    const b = [{ id: "y", type: "pickles" as const }, { id: "x", type: "onion" as const }];
    const d = diffStacks(a, b);
    expect(new Set([d.get("x"), d.get("y")])).toContain("moved");
  });
  it("identical stacks are all unchanged", () => {
    const s = bySlug("smokehouse")!.stack;
    expect([...diffStacks(s, s).values()].every((c) => c === "unchanged")).toBe(true);
  });
});
```

`layout.test.ts`
```ts
import { describe, it, expect } from "vitest";
import { layoutStack, stackHeight } from "./layout";
import type { LayerSpec } from "./burgers";

const dims = {
  "bun-top": { h: 300, seat: 40, cx: 0, depth: 0.9 },
  cheese: { h: 60, seat: 20, cx: 5, depth: 0.5 },
  "bun-bottom": { h: 200, seat: 0, cx: 0, depth: 0.2 },
} as const;
const stack: LayerSpec[] = [
  { id: "bun-top", type: "bun-top" },
  { id: "cheese-1", type: "cheese" },
  { id: "bun-bottom", type: "bun-bottom" },
];
const opts = { gap: 100, depth: 80, maxRot: 3 };

describe("layoutStack", () => {
  it("assembles bottom-up, each layer seated into the one below", () => {
    const p = layoutStack(stack, 0, opts, dims as never);
    const by = Object.fromEntries(p.map((l) => [l.id, l]));
    expect(by["bun-bottom"].y).toBe(0);
    expect(by["cheese-1"].y).toBe(200 - 20);
    expect(by["bun-top"].y).toBe(180 + 60 - 40);
    expect(by["bun-bottom"].index).toBe(0);
    expect(by["bun-top"].index).toBe(2);
  });
  it("explode adds an even gap per layer from the bottom", () => {
    const p0 = layoutStack(stack, 0, opts, dims as never);
    const p1 = layoutStack(stack, 1, opts, dims as never);
    p1.forEach((l, i) => expect(l.y - p0[i].y).toBeCloseTo(l.index * 100));
  });
  it("is flat and fully shadowed when assembled", () => {
    for (const l of layoutStack(stack, 0, opts, dims as never)) {
      // toBeCloseTo, not toBe: a negative seed times zero is -0, and toBe(0) uses Object.is.
      expect(l.rx).toBeCloseTo(0); expect(l.ry).toBeCloseTo(0); expect(l.rz).toBeCloseTo(0); expect(l.z).toBeCloseTo(0);
      expect(l.shadow).toBe(1);
    }
  });
  it("keeps rotations within maxRot and fades contact shadows when apart", () => {
    for (const l of layoutStack(stack, 1, opts, dims as never)) {
      expect(Math.abs(l.rz)).toBeLessThanOrEqual(3);
      expect(Math.abs(l.rx)).toBeLessThanOrEqual(3);
      if (l.index > 0) expect(l.shadow).toBeLessThan(0.25);
    }
  });
  it("stackHeight grows with explode", () => {
    expect(stackHeight(stack, 1, opts, dims as never)).toBeGreaterThan(stackHeight(stack, 0, opts, dims as never));
  });
});
```

`beats.test.ts`
```ts
import { describe, it, expect } from "vitest";
import { heroBeat } from "./beats";

describe("heroBeat", () => {
  it("holds assembled for the first 15%", () => {
    expect(heroBeat(0).explode).toBe(0);
    expect(heroBeat(0.14).explode).toBe(0);
  });
  it("is fully apart through the label window", () => {
    expect(heroBeat(0.5).explode).toBeCloseTo(1);
    expect(heroBeat(0.55).labels).toBeCloseTo(1);
  });
  it("hides labels outside 45–65%", () => {
    expect(heroBeat(0.3).labels).toBe(0);
    expect(heroBeat(0.8).labels).toBe(0);
  });
  it("is rebuilt from 85%", () => {
    expect(heroBeat(0.86).explode).toBe(0);
    expect(heroBeat(1).explode).toBe(0);
  });
  it("never zooms aggressively", () => {
    for (let p = 0; p <= 1; p += 0.05) {
      const b = heroBeat(p);
      expect(b.scale).toBeGreaterThanOrEqual(1);
      expect(b.scale).toBeLessThanOrEqual(1.08);
    }
  });
});
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `npx vitest run src/app/demo/burger-me/engine`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement `motion.ts`**

```ts
/* Frame-rate independent easing toward a target. rate is 1/seconds; a
   heavier ingredient gets a lower rate and so arrives later. */
export function approach(current: number, target: number, dt: number, rate: number): number {
  if (!Number.isFinite(rate)) return target;
  return target + (current - target) * Math.exp(-rate * dt);
}

export function smoothstep(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/* A stable pseudo-random number in -1..1 per layer id, so each ingredient's
   tiny tilt is the same on every render and on server and client. */
export function seeded(id: string, salt: string): number {
  let h = 2166136261;
  for (const ch of `${id}:${salt}`) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) / 4294967295) * 2 - 1;
}
```

- [ ] **Step 4: Implement `ingredients.ts`**

`seat` values below are starting points; Task 3 tunes them against the master. `depth`, `parallax`, `weight` and `enter` are design values, keep them.

```ts
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
```

If Task 1 dropped `sauce` (merged into the bottom bun), remove `sauce` from the union, `FEEL` and every stack, and set `bun-bottom.label` to `"House sauce on toasted brioche"`.

- [ ] **Step 5: Implement `burgers.ts`**

```ts
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
```

- [ ] **Step 6: Implement `diff.ts`**

```ts
import type { LayerSpec } from "./burgers";

export type Change = "unchanged" | "entering" | "exiting" | "moved";

/* Compare two recipes by persistent layer id. Shared ids keep their DOM node
   and only glide to their new height; "moved" means their order relative to
   the other shared layers changed. */
export function diffStacks(prev: LayerSpec[], next: LayerSpec[]): Map<string, Change> {
  const out = new Map<string, Change>();
  const prevIds = prev.map((l) => l.id);
  const nextIds = next.map((l) => l.id);
  const shared = new Set(prevIds.filter((id) => nextIds.includes(id)));
  const prevOrder = prevIds.filter((id) => shared.has(id));
  const nextOrder = nextIds.filter((id) => shared.has(id));
  for (const id of nextIds) {
    if (!shared.has(id)) out.set(id, "entering");
    else out.set(id, prevOrder.indexOf(id) === nextOrder.indexOf(id) ? "unchanged" : "moved");
  }
  for (const id of prevIds) if (!shared.has(id)) out.set(id, "exiting");
  return out;
}
```

- [ ] **Step 7: Implement `layout.ts`**

```ts
import { INGREDIENTS, type IngredientType } from "./ingredients";
import type { LayerSpec } from "./burgers";
import { seeded, smoothstep } from "./motion";

export interface Placed {
  id: string; type: IngredientType;
  /** 0 = bottom layer. */
  index: number;
  /** Units (top bun width = 1000). y is the layer's bottom edge, upward from the base. */
  x: number; y: number; z: number;
  /** Degrees. */
  rx: number; ry: number; rz: number;
  /** Contact-shadow strength 0–1 under this layer. */
  shadow: number;
}

export interface LayoutOpts {
  /** Extra space added between neighbours when fully exploded (units). */
  gap: number;
  /** Max depth travel toward/away from camera when exploded (units). */
  depth: number;
  /** Max per-ingredient rotation when exploded (degrees). */
  maxRot: number;
}

type Dims = Record<string, { h: number; seat: number; cx: number; depth: number }>;

export function layoutStack(stack: LayerSpec[], explode: number, opts: LayoutOpts, dims: Dims = INGREDIENTS): Placed[] {
  const e = Math.min(1, Math.max(0, explode));
  const bottomUp = [...stack].reverse();
  const out: Placed[] = [];
  let y = 0;
  bottomUp.forEach((layer, index) => {
    const d = dims[layer.type];
    if (index > 0) {
      const below = dims[bottomUp[index - 1].type];
      y = y + below.h - d.seat;
    }
    const lift = index * opts.gap * e;
    out.push({
      id: layer.id, type: layer.type, index,
      x: d.cx,
      y: y + lift,
      z: (d.depth - 0.5) * 2 * opts.depth * e,
      rx: seeded(layer.id, "rx") * opts.maxRot * 0.6 * e,
      ry: seeded(layer.id, "ry") * opts.maxRot * 0.6 * e,
      rz: seeded(layer.id, "rz") * opts.maxRot * e,
      shadow: index === 0 ? 1 : 1 - smoothstep(0, 0.6, e),
    });
  });
  return out.reverse();
}

/** Height of the whole stack (units), for fitting it into a stage. */
export function stackHeight(stack: LayerSpec[], explode: number, opts: LayoutOpts, dims: Dims = INGREDIENTS): number {
  const placed = layoutStack(stack, explode, opts, dims);
  return Math.max(...placed.map((p) => p.y + dims[p.type].h));
}
```

Note: `layoutStack` returns top → bottom, same order as `stack`, with `index` counted from the bottom.

- [ ] **Step 8: Implement `beats.ts`**

```ts
import { smoothstep } from "./motion";

export interface Beat {
  explode: number;
  labels: number;
  /** Camera: scale ≥ 1, x/y in % of the stage. */
  scale: number; x: number; y: number;
}

/* The home story. 0–15 assembled · 15–45 separating · 45–65 labels ·
   65–85 coming back together · 85–100 rebuilt and handing off. */
export function heroBeat(p: number): Beat {
  const apart = smoothstep(0.15, 0.45, p);
  const together = smoothstep(0.65, 0.85, p);
  const explode = p >= 0.85 ? 0 : apart * (1 - together);
  const labels = p < 0.45 || p > 0.65 ? 0 : smoothstep(0.45, 0.5, p) * (1 - smoothstep(0.6, 0.65, p));
  const push = smoothstep(0, 0.55, p) * (1 - smoothstep(0.7, 1, p) * 0.7);
  return {
    explode,
    labels,
    scale: 1 + 0.08 * push,
    x: -1.5 + 3 * smoothstep(0, 1, p),
    y: -2 * smoothstep(0.1, 0.6, p) + 2 * smoothstep(0.7, 1, p),
  };
}
```

- [ ] **Step 9: Run the tests to see them pass**

Run: `npx vitest run src/app/demo/burger-me/engine`
Expected: PASS (all four files). If `heroBeat(0.5).explode` is not ≈ 1 adjust nothing else: smoothstep(0.15,0.45,0.5) = 1.

- [ ] **Step 10: Lint and commit**

Run: `npx eslint src/app/demo/burger-me/engine`
Expected: no errors.
```bash
git add src/app/demo/burger-me/engine
git commit -m "feat(burger-me): engine data, recipe diff, stack layout and hero beats"
```

---

### Task 3: `ExplodedBurger` and the QA bench

**Files:**
- Create: `src/app/demo/burger-me/engine/ExplodedBurger.tsx`, `engine/explodedBurger.module.css`
- Create: `src/app/demo/burger-me/lab/page.tsx` (temporary QA bench; deleted in Task 10)
- Create: `scripts/burger-me/shot.mjs`
- Modify: `engine/ingredients.ts` (`seat` values only, after QA)

**Interfaces:**
- Consumes: everything Task 2 produces.
- Produces: `export default function ExplodedBurger(props: ExplodedBurgerProps)` where
  ```ts
  interface ExplodedBurgerProps {
    burger: Burger;
    explode?: number;        // rest explode 0–1 (default 0)
    labels?: number;         // tag opacity 0–1; default smoothstep(0.45, 0.8, explode)
    interactive?: boolean;   // pointer lean on fine pointers (default false)
    compact?: boolean;       // menu cards: smaller gap, no depth, no tags
    onSwap?: (b: Burger) => void; // fired mid-swap: change name/price now
    className?: string;
  }
  ```
  The component fills its parent box (parent sets width and height) and anchors the burger bottom-centre.
- Produces: `scripts/burger-me/shot.mjs <path> <width> [scrollFraction] [out.png]`.

- [ ] **Step 1: Write `explodedBurger.module.css`**

```css
.stage { position: relative; width: 100%; height: 100%; perspective: 1400px; perspective-origin: 50% 35%; }
.rig { position: absolute; inset: 0; transform-style: preserve-3d; will-change: transform; }
.floor {
  position: absolute; left: 50%; bottom: 3%; width: 70%; height: 9%;
  transform: translateX(-50%);
  background: radial-gradient(closest-side, rgb(0 0 0 / 0.55), transparent);
  pointer-events: none;
}
.layer { position: absolute; left: 50%; bottom: 6%; transform-origin: 50% 70%; pointer-events: none; }
.layer img { display: block; width: 100%; height: auto; max-width: none; user-select: none; -webkit-user-drag: none; }
.contact {
  position: absolute; left: 50%; bottom: 6%; pointer-events: none;
  background: radial-gradient(closest-side, rgb(20 4 2 / 0.6), transparent 75%);
}
.tag {
  position: absolute; left: 50%; bottom: 6%; display: flex; align-items: center; gap: 10px;
  white-space: nowrap; pointer-events: none; opacity: 0;
  font: 800 13px/1 var(--bm-display, system-ui); letter-spacing: 0.14em; text-transform: uppercase; color: #f6eddc;
  font-variation-settings: "wdth" 75;
}
.tag::before { content: ""; width: 44px; height: 1px; background: #f2b705; }
.tag b { color: #f2b705; font-weight: 800; }
@media (max-width: 767px) { .tag { display: none; } }
```

- [ ] **Step 2: Write `ExplodedBurger.tsx`**

```tsx
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { INGREDIENTS } from "./ingredients";
import { BURGERS, type Burger, type LayerSpec } from "./burgers";
import { diffStacks } from "./diff";
import { layoutStack, stackHeight, type LayoutOpts } from "./layout";
import { approach, smoothstep } from "./motion";
import s from "./explodedBurger.module.css";

/*
  One physical burger. Every layer is an <img> keyed by its persistent id, so
  a recipe change keeps shared layers' DOM nodes and only moves them. A single
  rAF loop eases each layer toward the layout for the current explode amount,
  heavier ingredients more slowly, and writes transforms straight to the DOM.
  The loop sleeps when the burger is off-screen or the tab is hidden.
*/

export interface ExplodedBurgerProps {
  burger: Burger;
  explode?: number;
  labels?: number;
  interactive?: boolean;
  compact?: boolean;
  onSwap?: (b: Burger) => void;
  className?: string;
}

type Status = "stay" | "enter" | "exit";
interface Shown { spec: LayerSpec; status: Status; born: number }
interface State { x: number; y: number; z: number; rx: number; ry: number; rz: number; o: number; sh: number; sq: number }

const BASE_RATE = 7;
const OPEN_MS = 380, MID_MS = 520, CLOSE_MS = 900, DONE_MS = 1500;

export default function ExplodedBurger({
  burger, explode = 0, labels, interactive = false, compact = false, onSwap, className = "",
}: ExplodedBurgerProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const els = useRef(new Map<string, { layer: HTMLDivElement | null; contact: HTMLDivElement | null; tag: HTMLDivElement | null }>());
  const state = useRef(new Map<string, State>());
  const [shown, setShown] = useState<Shown[]>(() => burger.stack.map((spec) => ({ spec, status: "stay", born: 0 })));
  const shownRef = useRef(shown);
  shownRef.current = shown;
  const current = useRef(burger);
  const swapAt = useRef<number | null>(null);
  const swapped = useRef(true);
  const props = useRef({ explode, labels, compact, onSwap });
  props.current = { explode, labels, compact, onSwap };

  // Recipe change: keep shared layers, add entering, keep exiting until they've drifted off.
  useLayoutEffect(() => {
    const prev = current.current;
    if (prev.slug === burger.slug) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const diff = diffStacks(prev.stack, burger.stack);
    current.current = burger;
    const now = performance.now();
    if (reduced) {
      setShown(burger.stack.map((spec) => ({ spec, status: "stay", born: 0 })));
      props.current.onSwap?.(burger);
      return;
    }
    const exiting = prev.stack.filter((l) => diff.get(l.id) === "exiting").map((spec) => ({ spec, status: "exit" as const, born: now }));
    setShown([
      ...burger.stack.map((spec) => ({ spec, status: (diff.get(spec.id) === "entering" ? "enter" : "stay") as Status, born: now })),
      ...exiting,
    ]);
    swapAt.current = now;
    swapped.current = false;
  }, [burger]);

  useEffect(() => {
    const stage = stageRef.current;
    const rig = rigRef.current;
    if (!stage || !rig) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    let visible = true, raf = 0, last = performance.now();
    let k = 1, wPx = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let prevTopGap = 0, settleAt = -1;

    const measure = () => {
      const r = stage.getBoundingClientRect();
      wPx = r.width;
      const opts = optsFor(props.current.compact, r.width);
      // Fit the TALLEST recipe, so the burger keeps one size across every swap.
      const tallest = Math.max(...BURGERS.map((b) => stackHeight(b.stack, 1, opts)));
      k = Math.min((r.width * (props.current.compact ? 0.86 : 0.62)) / 1000, (r.height * 0.86) / tallest);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); }, { rootMargin: "200px" });
    io.observe(stage);
    const onVis = () => { if (!document.hidden) kick(); };
    document.addEventListener("visibilitychange", onVis);
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      pointer.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      pointer.ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    };
    const lean = interactive && fine && !reduced;
    if (lean) window.addEventListener("pointermove", onMove, { passive: true });

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { explode: rest, labels: labelProp, compact: cmp, onSwap: swapCb } = props.current;
      const opts = optsFor(cmp, wPx);

      // Swap timeline: open → mid (copy changes) → close → done.
      let boost = 0, t = Infinity;
      if (swapAt.current !== null) {
        t = now - swapAt.current;
        boost = t < CLOSE_MS ? smoothstep(0, OPEN_MS, t) : 1 - smoothstep(CLOSE_MS, DONE_MS, t);
        if (!swapped.current && t >= MID_MS) { swapped.current = true; swapCb?.(current.current); }
        if (t >= DONE_MS + 300) {
          swapAt.current = null;
          setShown((list) => list.filter((l) => l.status !== "exit").map((l) => ({ ...l, status: "stay" })));
        }
      }
      const e = Math.max(rest, (cmp ? 0.35 : 0.6) * boost);
      const closing = swapAt.current !== null && t >= CLOSE_MS;
      const placed = layoutStack(current.current.stack, e, opts);
      const n = placed.length;
      const labelAmt = labelProp ?? smoothstep(0.45, 0.8, e);

      pointer.x = approach(pointer.x, lean ? pointer.tx : 0, dt, 4);
      pointer.y = approach(pointer.y, lean ? pointer.ty : 0, dt, 4);
      rig.style.transform = `rotateX(${(-pointer.y * 3).toFixed(2)}deg) rotateY(${(pointer.x * 4).toFixed(2)}deg)`;

      // Top-bun landing: a 220ms settle the moment the stack closes.
      const top = placed[0];
      const topGap = top ? top.y - layoutStack(current.current.stack, 0, opts)[0].y : 0;
      if (prevTopGap > 6 && topGap <= 6 && e < 0.05) settleAt = now;
      prevTopGap = topGap;
      const settle = settleAt > 0 && now - settleAt < 220 ? Math.sin(Math.PI * ((now - settleAt) / 220)) : 0;

      for (const item of shownRef.current) {
        const ing = INGREDIENTS[item.spec.type];
        const p = placed.find((q) => q.id === item.spec.id);
        let st = state.current.get(item.spec.id);
        const target = p
          ? { x: p.x, y: p.y, z: p.z, rx: p.rx, ry: p.ry, rz: p.rz, o: 1, sh: p.shadow }
          : null;
        if (!st) {
          // Entering layers start offset by their entrance, invisible.
          const base = target ?? { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, o: 0, sh: 0 };
          const from = entrance(ing.enter, item.spec.id);
          st = { ...base, x: base.x + from.x, y: base.y + from.y, z: base.z + from.z, rz: base.rz + from.rz, o: item.status === "enter" ? 0 : 1, sq: 0 };
          if (item.status !== "enter") Object.assign(st, base, { o: 1 });
          state.current.set(item.spec.id, st);
        }
        const exitT = { x: st.x + (seededSide(item.spec.id) * 900), y: st.y + 40, z: st.z - 120, rx: st.rx, ry: st.ry, rz: st.rz + seededSide(item.spec.id) * 6, o: 0, sh: 0 };
        const tg = item.status === "exit" ? exitT : target!;
        if (!tg) continue;
        const idx = p ? p.index : 0;
        let rate = reduced ? Infinity : BASE_RATE / ing.weight;
        if (closing) rate *= 1 + 0.9 * (1 - idx / Math.max(1, n - 1)); // bottom settles first
        if (item.status === "enter" && t < OPEN_MS) rate = 0; // wait until the stack has opened
        if (item.status === "exit") rate = reduced ? Infinity : 5;
        st.x = approach(st.x, tg.x, dt, rate);
        st.y = approach(st.y, tg.y, dt, rate);
        st.z = approach(st.z, tg.z, dt, rate);
        st.rx = approach(st.rx, tg.rx, dt, rate);
        st.ry = approach(st.ry, tg.ry, dt, rate);
        st.rz = approach(st.rz, tg.rz, dt, rate);
        st.o = approach(st.o, tg.o, dt, item.status === "exit" ? 9 : rate * 1.4);
        st.sh = approach(st.sh, tg.sh, dt, rate);

        const nodes = els.current.get(item.spec.id);
        if (!nodes?.layer) continue;
        const px = pointer.x * ing.parallax * 18;
        const py = pointer.y * ing.parallax * 9;
        const isTop = p?.index === n - 1;
        const sq = isTop ? 1 - 0.03 * settle : 1 - 0.008 * settle;
        nodes.layer.style.width = `${ing.w * k}px`;
        nodes.layer.style.transform =
          `translate3d(calc(-50% + ${((st.x + px) * k).toFixed(1)}px), ${(-(st.y + py) * k).toFixed(1)}px, ${(st.z * k).toFixed(1)}px)` +
          ` rotateX(${st.rx.toFixed(2)}deg) rotateY(${st.ry.toFixed(2)}deg) rotateZ(${st.rz.toFixed(2)}deg) scaleY(${sq.toFixed(3)})`;
        nodes.layer.style.opacity = st.o.toFixed(3);
        nodes.layer.style.zIndex = String(10 + idx * 2);
        if (nodes.contact) {
          nodes.contact.style.width = `${ing.w * 0.92 * k}px`;
          nodes.contact.style.height = `${ing.w * 0.12 * k}px`;
          nodes.contact.style.transform = `translate3d(calc(-50% + ${(st.x * k).toFixed(1)}px), ${(-(st.y - ing.w * 0.03) * k).toFixed(1)}px, ${(st.z * k).toFixed(1)}px)`;
          nodes.contact.style.opacity = (st.sh * st.o * (idx === 0 ? 0.5 : 0.9)).toFixed(3);
          nodes.contact.style.zIndex = String(9 + idx * 2);
        }
        if (nodes.tag) {
          const firstOfType = current.current.stack.find((l) => l.type === item.spec.type)?.id === item.spec.id;
          nodes.tag.style.transform = `translate3d(${(((st.x + ing.w / 2) * k) + 18).toFixed(1)}px, ${(-(st.y + ing.h * 0.55) * k).toFixed(1)}px, ${(st.z * k).toFixed(1)}px)`;
          nodes.tag.style.opacity = (firstOfType && !cmp ? labelAmt * st.o : 0).toFixed(3);
        }
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
      else raf = 0;
    }
    function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    kick();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, [interactive]);

  return (
    <div ref={stageRef} className={`${s.stage} ${className}`}>
      <div ref={rigRef} className={s.rig}>
        <div className={s.floor} aria-hidden="true" />
        {shown.map(({ spec }) => {
          const ing = INGREDIENTS[spec.type];
          const set = (key: "layer" | "contact" | "tag") => (el: HTMLDivElement | null) => {
            const cur = els.current.get(spec.id) ?? { layer: null, contact: null, tag: null };
            cur[key] = el;
            els.current.set(spec.id, cur);
          };
          return (
            <div key={spec.id} style={{ display: "contents" }}>
              <div ref={set("contact")} className={s.contact} aria-hidden="true" />
              <div ref={set("layer")} className={s.layer}>
                {/* eslint-disable-next-line @next/next/no-img-element -- layered cut-outs, sized by the engine */}
                <img src={ing.src} alt="" draggable={false} />
              </div>
              <div ref={set("tag")} className={s.tag} aria-hidden="true">{ing.label}</div>
            </div>
          );
        })}
      </div>
      <span className="sr-only">{burger.name}: {burger.stack.map((l) => INGREDIENTS[l.type].label).join(", ")}</span>
    </div>
  );
}

function optsFor(compact: boolean, widthPx: number): LayoutOpts {
  const phone = widthPx > 0 && widthPx < 520;
  if (compact) return { gap: 26, depth: 0, maxRot: 1.5 };
  return phone ? { gap: 70, depth: 40, maxRot: 2 } : { gap: 120, depth: 110, maxRot: 3 };
}

function seededSide(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0;
  return h & 1 ? 1 : -1;
}

function entrance(kind: "side" | "behind" | "under" | "above", id: string) {
  switch (kind) {
    case "side": return { x: seededSide(id) * 760, y: 30, z: 0, rz: seededSide(id) * 8 };
    case "behind": return { x: 0, y: -60, z: -260, rz: 0 };
    case "under": return { x: 0, y: -110, z: -40, rz: 0 };
    case "above": return { x: 0, y: 260, z: 0, rz: 0 };
  }
}
```

Notes for the implementer:
- `shownRef` mirrors `shown` every render so the loop always reads the current list without restarting.
- The scale `k` is fitted to the tallest burger on the menu, so every recipe is drawn at the same size.
- If `sr-only` is not a global utility here, use Tailwind's `sr-only` class (it is: Tailwind is installed).

- [ ] **Step 3: Write the QA bench `lab/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import ExplodedBurger from "../engine/ExplodedBurger";
import { BURGERS } from "../engine/burgers";

/* Temporary bench: master photo beside the layer stack, an explode slider and
   recipe buttons. Deleted in Task 10. */
export default function Lab() {
  const [e, setE] = useState(0);
  const [b, setB] = useState(BURGERS[0]);
  return (
    <main style={{ minHeight: "100svh", background: "#2a0806", color: "#f6eddc", padding: 24, fontFamily: "system-ui" }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        {BURGERS.map((x) => (
          <button key={x.slug} onClick={() => setB(x)} style={{ padding: "6px 10px", background: x.slug === b.slug ? "#f2b705" : "#3a0c0a", color: x.slug === b.slug ? "#1a0f0c" : "#f6eddc" }}>
            {x.name}
          </button>
        ))}
        <label>explode <input type="range" min={0} max={1} step={0.01} value={e} onChange={(ev) => setE(+ev.target.value)} /> {e.toFixed(2)}</label>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, height: "78svh" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/demo/burger-me/master.webp" alt="master" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        <ExplodedBurger burger={b} explode={e} interactive />
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Write `scripts/burger-me/shot.mjs`**

```js
// Usage: node scripts/burger-me/shot.mjs <path> <width> [scrollFraction=0] [out.png] [--mobile]
// Real Chrome (the Browser pane drops layers and misreads scroll). Dev server on :3000.
import puppeteer from "puppeteer";
const [path = "/demo/burger-me", width = "1440", frac = "0", out = "/tmp/bm-shot.png"] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const mobile = process.argv.includes("--mobile");
const w = Number(width);
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
});
const page = await browser.newPage();
await page.setViewport({ width: w, height: mobile ? 812 : 900, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
await page.goto(`${process.env.BASE_URL || "http://localhost:3000"}${path}`, { waitUntil: "networkidle2", timeout: 90000 });
await page.evaluate((f) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * f), Number(frac));
await new Promise((r) => setTimeout(r, 1600));
const info = await page.evaluate(() => ({ innerWidth, scrollWidth: document.documentElement.scrollWidth }));
await page.screenshot({ path: out });
console.log(out, JSON.stringify(info));
await browser.close();
```

- [ ] **Step 5: Tune seats against the master**

Start the dev server (preview_start `scroll-world-dev`). Run:
`node scripts/burger-me/shot.mjs /demo/burger-me/lab 1440 0 /tmp/bm-lab.png` and Read it.
At explode 0 the stack (right) must read as the same burger as the master (left): no visible gaps between layers, no layer floating, cheese drape over patty edges, overall height within ~5% of the master's proportion. Adjust `seat` in `ingredients.ts` (bigger seat = sinks deeper) and re-shoot until it matches. Then set the slider to 0.6 and 1 (edit the initial `useState(0)` temporarily, or add `?e=` handling) and check the exploded view looks like a physical deconstruction: even spacing, tiny tilts, no layer clipped by the stage.

- [ ] **Step 6: Check a recipe swap**

In the Browser pane on `/demo/burger-me/lab`, click Original → Bacon Cheese → Hot Honey → The Deluxe → Smokehouse. Confirm: shared layers stay, the new ingredient arrives from its entrance direction, removed ones drift away, the stack rebuilds bottom-first and the top bun lands last. (A screenshot can't show motion; use `javascript_tool` to sample a layer's `style.transform` at 0/400/900/1500 ms if needed.)

- [ ] **Step 7: Lint and commit**

Run: `npx eslint src/app/demo/burger-me && npx vitest run src/app/demo/burger-me`
Expected: clean, tests pass.
```bash
git add src/app/demo/burger-me scripts/burger-me/shot.mjs
git commit -m "feat(burger-me): ExplodedBurger component with recipe morph, pointer lean and QA bench"
```

---

### Task 4: Brand shell — fonts, tokens, logo (Adam picks), nav, footer, bag

**Files:**
- Create: `src/app/demo/burger-me/layout.tsx`, `burger-me.module.css`, `content.ts`, `Logo.tsx`, `Nav.tsx`, `Footer.tsx`, `BagProvider.tsx`, `BagDrawer.tsx`
- Create (temporary): `src/app/demo/burger-me/lab/logos/page.tsx` (deleted in Task 10)

**Interfaces:**
- Consumes: `BURGERS`, `bySlug`, `formatPrice`, `Burger` (Task 2).
- Produces:
  - `useBag(): { lines: { slug: string; qty: number }[]; count: number; total: number; add(slug: string): void; setQty(slug: string, qty: number): void; open: boolean; setOpen(v: boolean): void; ordered: boolean; placeOrder(): void; reset(): void; lastAdded: number }`
  - `<Logo className? />` (the chosen wordmark, `currentColor`)
  - CSS variables on `.site`: `--bm-stage-1:#3a0c0a; --bm-stage-2:#1c0605; --bm-mustard:#f2b705; --bm-ketchup:#d6261c; --bm-cream:#f6eddc; --bm-ink:#1a0f0c; --bm-display: var(--font-bricolage)`
  - `content.ts` exports: `STATEMENTS: { type: IngredientType; text: string }[]`, `SOURCING`, `LOCATIONS`, `HOURS`, `FOOTER`

- [ ] **Step 1: `content.ts`**

```ts
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
```

If `sauce` was dropped in Task 1, change the sauce statement's type to `"bun-bottom"`.

- [ ] **Step 2: Logo candidates (CONTROLLER GATE — Adam picks)**

Create `lab/logos/page.tsx` rendering six SVG/type wordmark candidates on the oxblood stage at 64px and 24px, and on cream. Candidates (each a small component in the page file):
1. BURGER ME set in Bricolage 800 wdth 75, ME in mustard, tight tracking.
2. Stacked BURGER over ME, ME inside a mustard bun-shaped pill.
3. Wordmark with the O of BURGER drawn as a bun-cross-section (three stacked arcs).
4. Lowercase "burger me" in a rounded heavy cut, ketchup-red dot after "me".
5. BURGER ME on a slight upward slant, underline drawn as a smash-patty lacy edge.
6. Monogram "BM" stacked like layers (B over M with a cheese-drip line between) beside the wordmark.

Controller: screenshot the page (`shot.mjs /demo/burger-me/lab/logos 1440`), show Adam, and wait for his pick. Implement the chosen one in `Logo.tsx` (inline SVG or styled text with `currentColor`, `aria-label="Burger Me"`).

- [ ] **Step 3: `burger-me.module.css` (tokens and chrome)**

```css
.site {
  --bm-stage-1: #3a0c0a; --bm-stage-2: #1c0605; --bm-mustard: #f2b705; --bm-ketchup: #d6261c;
  --bm-cream: #f6eddc; --bm-ink: #1a0f0c; --bm-display: var(--font-bricolage), system-ui, sans-serif;
  background: var(--bm-stage-2); color: var(--bm-cream);
  font-family: var(--font-bricolage), system-ui, sans-serif; font-size: 16px; line-height: 1.55;
  overflow-x: clip;
}
.display { font-family: var(--bm-display); font-weight: 800; font-variation-settings: "wdth" 75; line-height: 0.9; letter-spacing: -0.01em; text-transform: uppercase; }
.stageGround { background: radial-gradient(60% 55% at 38% 30%, #7a1d14 0%, var(--bm-stage-1) 45%, var(--bm-stage-2) 100%); }
.grain::after { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.08; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }

.nav { position: fixed; inset: 0 0 auto 0; z-index: 50; display: flex; align-items: center; justify-content: space-between; padding: 18px clamp(16px, 4vw, 48px); }
.navLinks { display: flex; gap: 28px; font-weight: 600; font-size: 15px; }
.navLinks a { opacity: 0.85; } .navLinks a:hover { opacity: 1; color: var(--bm-mustard); }
@media (max-width: 767px) { .navLinks { display: none; } }
.bagBtn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 999px; background: var(--bm-ketchup); color: var(--bm-cream); font-weight: 700; }
.bagBtn b { background: var(--bm-mustard); color: var(--bm-ink); border-radius: 999px; min-width: 22px; text-align: center; font-size: 13px; padding: 1px 6px; }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 16px 26px; border-radius: 999px; background: var(--bm-ketchup); color: var(--bm-cream); font-weight: 800; letter-spacing: 0.02em; transition: transform 0.2s ease; }
.btn:hover { transform: translateY(-2px); } .btn:active { transform: scale(0.97); }
.btnGhost { background: transparent; box-shadow: inset 0 0 0 1.5px rgb(246 237 220 / 0.4); }
.price { color: var(--bm-mustard); font-family: var(--bm-display); font-weight: 800; font-variation-settings: "wdth" 75; }

.drawerScrim { position: fixed; inset: 0; z-index: 80; background: rgb(10 2 1 / 0.6); opacity: 0; pointer-events: none; transition: opacity 0.3s; }
.drawerScrim[data-open="true"] { opacity: 1; pointer-events: auto; }
.drawer { position: fixed; inset: 0 0 0 auto; z-index: 81; width: min(420px, 100vw); background: var(--bm-cream); color: var(--bm-ink); transform: translateX(100%); transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1); display: flex; flex-direction: column; }
.drawer[data-open="true"] { transform: none; }

.footer { position: relative; padding: clamp(64px, 10vw, 120px) clamp(16px, 4vw, 48px) 40px; background: var(--bm-stage-2); }
.footerWord { font-size: clamp(72px, 19vw, 300px); color: var(--bm-mustard); }
```

- [ ] **Step 4: `BagProvider.tsx`**

```tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { bySlug } from "./engine/burgers";

/* The bag. Lives in the layout so it survives navigation; written to
   localStorage after hydration so server and first client render agree. */

interface Line { slug: string; qty: number }
interface Bag {
  lines: Line[]; count: number; total: number;
  add(slug: string): void; setQty(slug: string, qty: number): void;
  open: boolean; setOpen(v: boolean): void;
  ordered: boolean; placeOrder(): void; reset(): void;
  lastAdded: number;
}

const Ctx = createContext<Bag | null>(null);
const KEY = "burger-me.bag";

export function BagProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [lastAdded, setLastAdded] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let saved: Line[] = [];
    try { saved = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { /* private mode */ }
    queueMicrotask(() => { setLines(saved); setReady(true); });
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* private mode */ }
  }, [lines, ready]);

  const add = useCallback((slug: string) => {
    setLines((prev) => {
      const hit = prev.find((l) => l.slug === slug);
      return hit ? prev.map((l) => (l.slug === slug ? { ...l, qty: l.qty + 1 } : l)) : [...prev, { slug, qty: 1 }];
    });
    setOrdered(false);
    setLastAdded(Date.now());
  }, []);
  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.slug !== slug) : prev.map((l) => (l.slug === slug ? { ...l, qty } : l))));
  }, []);
  const placeOrder = useCallback(() => { setOrdered(true); setLines([]); }, []);
  const reset = useCallback(() => setOrdered(false), []);

  const value = useMemo<Bag>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const total = lines.reduce((n, l) => n + (bySlug(l.slug)?.price ?? 0) * l.qty, 0);
    return { lines, count, total, add, setQty, open, setOpen, ordered, placeOrder, reset, lastAdded };
  }, [lines, add, setQty, open, ordered, placeOrder, reset, lastAdded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBag() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBag outside BagProvider");
  return v;
}
```

- [ ] **Step 5: `BagDrawer.tsx`**

A right-hand cream drawer: header "Your bag" + close (×) button; one row per line (burger name, `formatPrice(price)`, − qty + buttons via `setQty`); total; ketchup button "Order for collection — {formatPrice(total)}" calling `placeOrder()`; when `ordered` show a confirmation panel ("Order in. Ready in 15 minutes at Barbican." with a mustard tick, and "Back to the menu" closing the drawer and calling `reset()`); empty state "Nothing in the bag yet" with a link to `/demo/burger-me/menu`. Escape closes (keydown listener while open). Scrim click closes. Use `.drawer`, `.drawerScrim` with `data-open`.

```tsx
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useBag } from "./BagProvider";
import { bySlug, formatPrice } from "./engine/burgers";
import s from "./burger-me.module.css";

export default function BagDrawer() {
  const bag = useBag();
  useEffect(() => {
    if (!bag.open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && bag.setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bag]);
  const close = () => { bag.setOpen(false); bag.reset(); };
  return (
    <>
      <div className={s.drawerScrim} data-open={bag.open} onClick={close} />
      <aside className={s.drawer} data-open={bag.open} aria-label="Your bag" aria-hidden={!bag.open}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 24px 12px" }}>
          <h2 className={s.display} style={{ fontSize: 40 }}>Your bag</h2>
          <button onClick={close} aria-label="Close bag" style={{ fontSize: 28, lineHeight: 1 }}>×</button>
        </header>
        <div style={{ flex: 1, overflow: "auto", padding: "0 24px" }}>
          {bag.ordered ? (
            <div style={{ paddingTop: 40 }}>
              <p className={s.display} style={{ fontSize: 56, color: "var(--bm-ketchup)" }}>Order in.</p>
              <p style={{ marginTop: 12, fontSize: 18 }}>Ready in 15 minutes at Barbican. We&apos;ll smash yours the moment you walk in.</p>
              <button className={s.btn} style={{ marginTop: 28 }} onClick={close}>Back to the menu</button>
            </div>
          ) : bag.lines.length === 0 ? (
            <p style={{ paddingTop: 40, fontSize: 18 }}>
              Nothing in the bag yet. <Link href="/demo/burger-me/menu" onClick={close} style={{ color: "var(--bm-ketchup)", fontWeight: 700 }}>See the menu</Link>
            </p>
          ) : (
            <ul>
              {bag.lines.map((l) => {
                const b = bySlug(l.slug)!;
                return (
                  <li key={l.slug} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgb(26 15 12 / 0.12)" }}>
                    <div>
                      <p style={{ fontWeight: 800 }}>{b.name}</p>
                      <p style={{ opacity: 0.7 }}>{formatPrice(b.price)}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <button aria-label={`One fewer ${b.name}`} onClick={() => bag.setQty(l.slug, l.qty - 1)}>−</button>
                      <span>{l.qty}</span>
                      <button aria-label={`One more ${b.name}`} onClick={() => bag.setQty(l.slug, l.qty + 1)}>+</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {!bag.ordered && bag.lines.length > 0 && (
          <footer style={{ padding: 24 }}>
            <button className={s.btn} style={{ width: "100%" }} onClick={bag.placeOrder}>
              Order for collection — {formatPrice(bag.total)}
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
```

- [ ] **Step 6: `Nav.tsx`, `Footer.tsx`, `layout.tsx`**

`Nav.tsx`: client component; `<nav className={s.nav}>` with `<Link href="/demo/burger-me"><Logo /></Link>`, links Menu (`/demo/burger-me/menu`), Our beef (`/demo/burger-me#beef`), Find us (`/demo/burger-me#find-us`), and the bag button (`.bagBtn`, text "Bag", `<b>{count}</b>`, `onClick={() => bag.setOpen(true)}`), which pulses (CSS keyframe scale 1→1.12→1 on a `data-pulse` keyed by `lastAdded`). Nav background transparent over the stage; after 40px scroll add `background: rgb(28 6 5 / 0.85); backdrop-filter: blur(10px)` via a `data-solid` attribute set by one passive scroll listener.

`Footer.tsx`: `.footer` with the giant mustard `BURGER ME` (`.display .footerWord`), `FOOTER.line`, the two `LOCATIONS`, `HOURS`, and `FOOTER.small`. On phones the giant word must not overflow (`overflow: hidden` on the footer; `font-size` capped by vw).

`layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { BagProvider } from "./BagProvider";
import Nav from "./Nav";
import Footer from "./Footer";
import BagDrawer from "./BagDrawer";
import s from "./burger-me.module.css";

const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], axes: ["wdth", "opsz"], display: "swap" });

export const metadata: Metadata = {
  title: { absolute: "Burger Me — Smash burgers, built in front of you | WebMinor Concept" },
  description: "A concept smash-burger restaurant by WebMinor: one photographic burger that takes itself apart, rebuilds, and changes recipe in front of you.",
  robots: { index: false, follow: false },
};

export default function BurgerMeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bricolage.variable} ${s.site}`}>
      <BagProvider>
        <Nav />
        {children}
        <Footer />
        <BagDrawer />
      </BagProvider>
    </div>
  );
}
```
If `Bricolage_Grotesque` rejects `axes: ["wdth"]` (check `node_modules/next/dist/compiled/@next/font/dist/google/font-data.json` for its axes), drop `wdth` and fake the condensed display with `transform: scaleX(0.82)` on display headings only.

- [ ] **Step 7: Verify and commit**

Add a placeholder `page.tsx` (`export default function Page() { return <main style={{ minHeight: "100svh" }} />; }`) so the layout renders. Shoot `/demo/burger-me` at 1440 and 375 (`--mobile`): nav, logo, bag count, footer visible; open the bag in the Browser pane (add via the lab page isn't wired yet — call `localStorage.setItem('burger-me.bag', '[{"slug":"the-original","qty":2}]')` then reload) and check the drawer, totals (£23.00) and the order confirmation. `npx eslint src/app/demo/burger-me`.
```bash
git add src/app/demo/burger-me
git commit -m "feat(burger-me): brand shell — fonts, tokens, logo, nav, footer and bag"
```

---

### Task 5: Home hero story (pinned scroll)

**Files:**
- Create: `src/app/demo/burger-me/HeroStory.tsx`
- Modify: `src/app/demo/burger-me/burger-me.module.css` (hero block), `page.tsx`

**Interfaces:**
- Consumes: `ExplodedBurger`, `heroBeat`, `bySlug`, `STATEMENTS`, `smoothstep`.
- Produces: `<HeroStory />` (no props).

- [ ] **Step 1: Hero CSS**

```css
.hero { position: relative; height: 420svh; }
@media (max-width: 767px) { .hero { height: 300svh; } }
.heroPin { position: sticky; top: 0; height: 100svh; overflow: hidden; display: grid; place-items: center; }
.heroCam { position: absolute; inset: 8svh 0 0 0; will-change: transform; }
.heroBurger { position: absolute; left: 50%; bottom: 4svh; width: min(78vw, 980px); height: 86svh; transform: translateX(-50%); }
@media (max-width: 767px) { .heroBurger { width: 100vw; height: 70svh; bottom: 14svh; } }
.heroTitle { position: absolute; left: clamp(16px, 5vw, 72px); top: 18svh; z-index: 5; font-size: clamp(64px, 12vw, 200px); max-width: 7ch; }
.heroTitle em { font-style: normal; color: var(--bm-mustard); }
.heroLede { position: absolute; left: clamp(16px, 5vw, 72px); bottom: 8svh; z-index: 5; max-width: 32ch; font-size: 18px; opacity: 0.9; }
.heroCaption { position: absolute; left: 0; right: 0; bottom: 6svh; text-align: center; z-index: 6; display: none; }
@media (max-width: 767px) {
  .heroTitle { top: 12svh; font-size: clamp(56px, 17vw, 96px); }
  .heroLede { display: none; }
  .heroCaption { display: block; }
}
.statement { position: absolute; right: clamp(16px, 5vw, 72px); top: 50%; z-index: 5; font-size: clamp(28px, 4vw, 64px); text-align: right; max-width: 12ch; }
@media (max-width: 767px) { .statement { display: none; } }
.scrollCue { position: absolute; left: 50%; bottom: 2.5svh; transform: translateX(-50%); font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.7; z-index: 6; }
```

- [ ] **Step 2: `HeroStory.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import ExplodedBurger from "./engine/ExplodedBurger";
import { bySlug } from "./engine/burgers";
import { heroBeat } from "./engine/beats";
import { STATEMENTS } from "./content";
import s from "./burger-me.module.css";

/* The pinned home story. One passive scroll listener turns the section's
   scroll position into 0–1 and writes the camera transform directly; the
   burger gets the beat's explode and label amounts as props (state updated
   only when they change by more than 0.005, so React renders at most a
   couple of times per frame's worth of change). */
export default function HeroStory() {
  const ref = useRef<HTMLElement>(null);
  const cam = useRef<HTMLDivElement>(null);
  const [beat, setBeat] = useState(() => heroBeat(0));
  const [p, setP] = useState(0);
  const original = bySlug("the-original")!;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - innerHeight;
      const prog = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      if (!Number.isFinite(prog)) return;
      const b = heroBeat(reduced ? 0 : prog);
      if (cam.current) cam.current.style.transform = `translate3d(${b.x}%, ${b.y}%, 0) scale(${b.scale.toFixed(4)})`;
      setBeat((prev) => (Math.abs(prev.explode - b.explode) > 0.005 || Math.abs(prev.labels - b.labels) > 0.01 ? b : prev));
      setP((prev) => (Math.abs(prev - prog) > 0.01 ? prog : prev));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // Phone caption: one statement at a time through the label window.
  const capIdx = Math.min(STATEMENTS.length - 1, Math.max(0, Math.floor(((p - 0.45) / 0.2) * STATEMENTS.length)));
  const intro = 1 - Math.min(1, Math.max(0, (p - 0.08) / 0.1));

  return (
    <section ref={ref} className={s.hero} aria-label="The Original, taken apart">
      <div className={`${s.heroPin} ${s.stageGround} ${s.grain}`}>
        <h1 className={`${s.display} ${s.heroTitle}`} style={{ opacity: intro }}>
          Built <em>in front</em> of you.
        </h1>
        <p className={s.heroLede} style={{ opacity: intro }}>
          Two British beef patties smashed to order, American cheese, house sauce, toasted brioche. Scroll and we&apos;ll show you how it&apos;s made.
        </p>
        <div ref={cam} className={s.heroCam}>
          <div className={s.heroBurger}>
            <ExplodedBurger burger={original} explode={beat.explode} labels={beat.labels} interactive />
          </div>
        </div>
        <p className={`${s.display} ${s.statement}`} style={{ opacity: Math.max(0, Math.min(1, (p - 0.66) / 0.06)) * (1 - Math.max(0, Math.min(1, (p - 0.86) / 0.06))) }}>
          Every one, <span style={{ color: "var(--bm-mustard)" }}>every time.</span>
        </p>
        <p className={`${s.display} ${s.heroCaption}`} style={{ opacity: beat.labels, fontSize: 30, color: "var(--bm-mustard)" }} aria-hidden="true">
          {STATEMENTS[capIdx].text}
        </p>
        <span className={s.scrollCue} style={{ opacity: intro * 0.7 }}>Scroll</span>
      </div>
    </section>
  );
}
```

Desktop tags come from `ExplodedBurger` (`labels` prop); hide the generic ingredient tags that aren't quality statements by passing the label text from `STATEMENTS`? Keep it simple: the engine shows each ingredient's own `label`, which already reads as the statements ("British beef, smashed to order", "American cheese", "House sauce", "Toasted brioche"); pickles/onion tags also show — that is fine and informative.

- [ ] **Step 3: Page**

`page.tsx`:
```tsx
import HeroStory from "./HeroStory";

export default function BurgerMeHome() {
  return (
    <main>
      <HeroStory />
    </main>
  );
}
```

- [ ] **Step 4: Visual check**

Shoot `/demo/burger-me` at 1440 and 375 (`--mobile`) at scroll fractions 0, 0.1, 0.3, 0.55, 0.75, 0.95 of the hero (the hero is most of the page now, so fractions of the page are close). Read each. Accept when: assembled hero reads as an appetising food ad with the headline; mid-explode is evenly spaced and never clipped by the viewport; tags sit right of their layers and are legible (desktop) / one mustard caption at a time (phone); rebuilt by the end; `scrollWidth === innerWidth` in the printed JSON at 375. Fix what is visibly wrong (stage sizes, tag offsets, camera ranges in `heroBeat` only if the tests still pass).

- [ ] **Step 5: Commit**

```bash
git add src/app/demo/burger-me
git commit -m "feat(burger-me): pinned hero story — explode, label, rebuild"
```

---

### Task 6: Home sections — "Built differently" stage, menu teaser, sourcing, find us

**Files:**
- Create: `src/app/demo/burger-me/BuiltDifferently.tsx`, `src/app/demo/burger-me/Sections.tsx`
- Modify: `burger-me.module.css`, `page.tsx`

**Interfaces:**
- Consumes: `ExplodedBurger`, `BURGERS`, `formatPrice`, `useBag`, `SOURCING`, `LOCATIONS`, `HOURS`, `INGREDIENTS`.
- Produces: `<BuiltDifferently />`, `<MenuTeaser />`, `<Sourcing />` (id `beef`), `<FindUs />` (id `find-us`).

- [ ] **Step 1: `BuiltDifferently.tsx`**

Layout (desktop): two columns on the oxblood stage. Left: kicker "Built differently", the burger name in giant display type, the tagline, description, price in mustard, "Add to bag" (`.btn`) and, under it, a row of five chips (one per burger; active chip filled mustard with ink text). Right: the stage (`ExplodedBurger` with `interactive`, `explode={0}`), height `min(78svh, 760px)`. Phone: stage on top (60svh), copy and chips below; chips scroll horizontally if needed (`overflow-x: auto`, no page overflow).

Behaviour: `selected` state (the burger shown in the stage) changes on chip click immediately; `copy` state (the burger whose name/price/description is shown) updates from `onSwap`, so text changes mid-morph, with a 250ms opacity/translateY fade on the copy block keyed by `copy.slug`. A small mustard line under the name reads "Adds: Crispy smoked bacon" when `copy.adds.length` (labels from `INGREDIENTS`). "Add to bag" calls `bag.add(copy.slug)` and `bag.setOpen(true)`.

```tsx
"use client";

import { useState } from "react";
import ExplodedBurger from "./engine/ExplodedBurger";
import { BURGERS, formatPrice } from "./engine/burgers";
import { INGREDIENTS } from "./engine/ingredients";
import { useBag } from "./BagProvider";
import s from "./burger-me.module.css";

export default function BuiltDifferently() {
  const [selected, setSelected] = useState(BURGERS[0]);
  const [copy, setCopy] = useState(BURGERS[0]);
  const bag = useBag();
  return (
    <section className={`${s.built} ${s.stageGround}`} aria-labelledby="built-title">
      <div className={s.builtCopy}>
        <p className={s.kicker}>Built differently</p>
        <div key={copy.slug} className={s.swapIn}>
          <h2 id="built-title" className={`${s.display} ${s.builtName}`}>{copy.name}</h2>
          {copy.adds.length > 0 && (
            <p className={s.adds}>Adds: {copy.adds.map((t) => INGREDIENTS[t].label).join(" + ")}</p>
          )}
          <p className={s.tagline}>{copy.tagline}</p>
          <p className={s.desc}>{copy.description}</p>
          <p className={`${s.price} ${s.builtPrice}`}>{formatPrice(copy.price)}</p>
        </div>
        <button className={s.btn} onClick={() => { bag.add(copy.slug); bag.setOpen(true); }}>Add to bag</button>
        <div className={s.chips} role="group" aria-label="Choose a burger">
          {BURGERS.map((b) => (
            <button key={b.slug} className={s.chip} data-on={b.slug === selected.slug} aria-pressed={b.slug === selected.slug} onClick={() => setSelected(b)}>
              {b.name}
            </button>
          ))}
        </div>
      </div>
      <div className={s.builtStage}>
        <ExplodedBurger burger={selected} interactive onSwap={setCopy} />
      </div>
    </section>
  );
}
```

CSS to add:
```css
.built { position: relative; display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); align-items: center; gap: 24px; padding: clamp(80px, 12vw, 160px) clamp(16px, 5vw, 72px); min-height: 100svh; }
.builtStage { height: min(78svh, 760px); }
.kicker { font-size: 13px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--bm-mustard); font-weight: 700; }
.builtName { font-size: clamp(56px, 8vw, 128px); margin-top: 12px; }
.adds { margin-top: 10px; color: var(--bm-mustard); font-weight: 700; }
.tagline { margin-top: 16px; font-size: 22px; font-weight: 700; }
.desc { margin-top: 10px; max-width: 46ch; opacity: 0.85; }
.builtPrice { font-size: 48px; margin: 18px 0 22px; }
.chips { display: flex; gap: 8px; margin-top: 28px; flex-wrap: wrap; }
.chip { padding: 10px 16px; border-radius: 999px; box-shadow: inset 0 0 0 1.5px rgb(246 237 220 / 0.35); font-weight: 700; font-size: 14px; transition: background 0.2s, color 0.2s; }
.chip[data-on="true"] { background: var(--bm-mustard); color: var(--bm-ink); box-shadow: none; }
.swapIn { animation: swapIn 0.35s ease both; }
@keyframes swapIn { from { opacity: 0; transform: translateY(10px); } }
@media (max-width: 899px) {
  .built { grid-template-columns: 1fr; }
  .builtStage { order: -1; height: 60svh; }
  .chips { flex-wrap: nowrap; overflow-x: auto; margin-inline: calc(-1 * clamp(16px, 5vw, 72px)); padding-inline: clamp(16px, 5vw, 72px); scrollbar-width: none; }
  .chip { flex: none; }
}
@media (prefers-reduced-motion: reduce) { .swapIn { animation: none; } }
```

- [ ] **Step 2: `Sections.tsx`**

- `MenuTeaser`: cream section (`background: var(--bm-cream); color: var(--bm-ink)`), title "Five burgers. One way of building them." and three static cards (Original, Bacon Cheese, Smokehouse) each with a `compact` `ExplodedBurger` (`explode={0}`) on a small oxblood panel, name, price; whole card links to `/demo/burger-me/menu/<slug>`; a "See the full menu" `.btn` to `/demo/burger-me/menu`. Phone: cards stack (one column).
- `Sourcing` (`id="beef"`): cream continues; big display `SOURCING.title`, body, three facts as giant mustard-on-ink numbers in a row (stack on phone).
- `FindUs` (`id="find-us"`): oxblood; two location blocks (`LOCATIONS`) and the `HOURS` table; a ketchup "Order for collection" `.btn` opening the bag.

- [ ] **Step 3: Page**

```tsx
import HeroStory from "./HeroStory";
import BuiltDifferently from "./BuiltDifferently";
import { MenuTeaser, Sourcing, FindUs } from "./Sections";

export default function BurgerMeHome() {
  return (
    <main>
      <HeroStory />
      <BuiltDifferently />
      <MenuTeaser />
      <Sourcing />
      <FindUs />
    </main>
  );
}
```

- [ ] **Step 4: Visual check**

Shoot at 1440, 768 and 375 (`--mobile`) at fractions covering each section. Click through all five chips in the Browser pane and confirm copy changes mid-morph and the Adds line is right. Add to bag opens the drawer with the right burger. `scrollWidth === innerWidth` at 375.

- [ ] **Step 5: Commit**

```bash
git add src/app/demo/burger-me
git commit -m "feat(burger-me): built-differently stage, menu teaser, sourcing and find-us sections"
```

---

### Task 7: Menu page with hover cards and the FLIP record

**Files:**
- Create: `src/app/demo/burger-me/flip.ts`, `src/app/demo/burger-me/menu/page.tsx`, `src/app/demo/burger-me/menu/MenuCard.tsx`
- Modify: `burger-me.module.css`

**Interfaces:**
- Consumes: `ExplodedBurger`, `BURGERS`, `formatPrice`, `INGREDIENTS`.
- Produces: `recordFlip(slug: string, el: Element): void`, `takeFlip(slug: string): DOMRect | null` (reads once, then clears; ignores records older than 4s).

- [ ] **Step 1: `flip.ts`**

```ts
/* The menu card's burger rect, handed to the detail page so its burger can
   start exactly where the card's was. sessionStorage, read once. */
const KEY = "burger-me.flip";

export function recordFlip(slug: string, el: Element) {
  const r = el.getBoundingClientRect();
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ slug, at: Date.now(), x: r.left, y: r.top, w: r.width, h: r.height }));
  } catch { /* no storage: the detail page falls back to its own intro */ }
}

export function takeFlip(slug: string): DOMRect | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    if (!raw) return null;
    const f = JSON.parse(raw);
    if (f.slug !== slug || Date.now() - f.at > 4000) return null;
    return new DOMRect(f.x, f.y, f.w, f.h);
  } catch {
    return null;
  }
}
```

- [ ] **Step 2: `MenuCard.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import ExplodedBurger from "../engine/ExplodedBurger";
import { formatPrice, type Burger } from "../engine/burgers";
import { INGREDIENTS } from "../engine/ingredients";
import { recordFlip } from "../flip";
import s from "../burger-me.module.css";

export default function MenuCard({ burger, index }: { burger: Burger; index: number }) {
  const [hover, setHover] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  return (
    <Link
      href={`/demo/burger-me/menu/${burger.slug}`}
      className={s.card}
      data-hover={hover}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={() => stage.current && recordFlip(burger.slug, stage.current)}
    >
      <span className={s.cardNum}>{String(index + 1).padStart(2, "0")}</span>
      <div ref={stage} className={s.cardStage}>
        <ExplodedBurger burger={burger} explode={hover ? 0.12 : 0} compact />
      </div>
      <div className={s.cardBody}>
        <h2 className={`${s.display} ${s.cardName}`}>{burger.name}</h2>
        <p className={s.cardTag}>{burger.tagline}</p>
        {burger.adds.length > 0 && <p className={s.adds}>+ {burger.adds.map((t) => INGREDIENTS[t].label).join(" + ")}</p>}
        <p className={`${s.price} ${s.cardPrice}`}>{formatPrice(burger.price)}</p>
      </div>
      <span className={s.viewPill} aria-hidden="true">View</span>
    </Link>
  );
}
```

CSS:
```css
.menuPage { padding: clamp(110px, 14vw, 170px) clamp(16px, 5vw, 72px) clamp(80px, 10vw, 140px); }
.menuTitle { font-size: clamp(64px, 12vw, 200px); }
.menuGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr)); gap: 20px; margin-top: 48px; }
.card { position: relative; display: flex; flex-direction: column; border-radius: 22px; overflow: hidden; background: radial-gradient(80% 60% at 40% 30%, #5a1610, var(--bm-stage-1) 60%, #240806); transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.45s; cursor: none; }
@media (hover: none), (pointer: coarse) { .card { cursor: pointer; } }
.card[data-hover="true"] { transform: translateY(-8px); box-shadow: 0 30px 60px -20px rgb(0 0 0 / 0.6), 0 0 0 1px rgb(242 183 5 / 0.25); }
.card::after { content: ""; position: absolute; inset: 0; background: radial-gradient(50% 40% at 40% 25%, rgb(255 170 90 / 0.18), transparent); opacity: 0; transition: opacity 0.45s; pointer-events: none; }
.card[data-hover="true"]::after { opacity: 1; }
.cardNum { position: absolute; top: 18px; left: 20px; font-size: 13px; letter-spacing: 0.2em; opacity: 0.6; }
.cardStage { height: 300px; margin-top: 18px; }
.cardBody { padding: 8px 24px 26px; }
.cardName { font-size: 44px; opacity: 0.88; transition: opacity 0.3s; }
.card[data-hover="true"] .cardName { opacity: 1; }
.cardTag { margin-top: 6px; font-weight: 600; }
.cardPrice { font-size: 30px; margin-top: 12px; }
.viewPill { position: absolute; top: 50%; left: 50%; padding: 12px 20px; border-radius: 999px; background: var(--bm-mustard); color: var(--bm-ink); font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; font-size: 13px; transform: translate(-50%, -50%) scale(0.6); opacity: 0; transition: opacity 0.25s, transform 0.25s; pointer-events: none; }
.card[data-hover="true"] .viewPill { opacity: 1; transform: translate(var(--vx, -50%), var(--vy, -50%)) scale(1); }
```

The VIEW pill follows the pointer: on `pointermove` inside the card set `--vx`/`--vy` to `calc(${x}px - 50%)` etc. relative to the card (add an `onPointerMove` handler writing `style.setProperty` on `e.currentTarget`; replace `left/top: 50%` with `left/top: 0` when following). Keep it simple: one handler.

- [ ] **Step 3: `menu/page.tsx`**

```tsx
import type { Metadata } from "next";
import MenuCard from "./MenuCard";
import { BURGERS } from "../engine/burgers";
import s from "../burger-me.module.css";

export const metadata: Metadata = { title: { absolute: "Menu — Burger Me | WebMinor Concept" }, robots: { index: false, follow: false } };

export default function MenuPage() {
  return (
    <main className={`${s.menuPage} ${s.stageGround}`}>
      <p className={s.kicker}>The menu</p>
      <h1 className={`${s.display} ${s.menuTitle}`}>Five ways<br />to build it.</h1>
      <div className={s.menuGrid}>
        {BURGERS.map((b, i) => <MenuCard key={b.slug} burger={b} index={i} />)}
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Visual check and commit**

Shoot `/demo/burger-me/menu` at 1440, 768, 375 (`--mobile`). Hover a card in the Browser pane: lift, layers part a few px, warmer light, VIEW pill follows the cursor. Five compact burgers is five rAF loops: confirm scrolling the page stays smooth (`read_console_messages` clean).
```bash
git add src/app/demo/burger-me
git commit -m "feat(burger-me): menu page with hover cards and FLIP hand-off record"
```

---

### Task 8: Detail page with the FLIP intro and in-place recipe switching

**Files:**
- Create: `src/app/demo/burger-me/menu/[slug]/page.tsx`, `src/app/demo/burger-me/menu/[slug]/Detail.tsx`
- Modify: `burger-me.module.css`

**Interfaces:**
- Consumes: `ExplodedBurger`, `BURGERS`, `bySlug`, `formatPrice`, `INGREDIENTS`, `takeFlip`, `useBag`.
- Produces: route `/demo/burger-me/menu/[slug]` for the five slugs (`generateStaticParams`), 404 otherwise.

- [ ] **Step 1: `page.tsx` (server)**

Read the Next 16 dynamic-route docs first: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md` (params is a Promise).

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BURGERS, bySlug } from "../../engine/burgers";
import Detail from "./Detail";

export function generateStaticParams() {
  return BURGERS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const b = bySlug((await params).slug);
  return { title: { absolute: `${b?.name ?? "Burger"} — Burger Me | WebMinor Concept` }, robots: { index: false, follow: false } };
}

export default async function BurgerPage({ params }: { params: Promise<{ slug: string }> }) {
  const b = bySlug((await params).slug);
  if (!b) notFound();
  return <Detail initial={b.slug} />;
}
```

- [ ] **Step 2: `Detail.tsx`**

Sequence on mount (total ≈ 1.6s, no artificial length):
1. `t=0`: read `takeFlip(slug)`. If a rect exists, compute the transform from the stage's own rect to the card rect (`translate(dx, dy) scale(card.w / stage.w)`, origin top-left) and apply it to the stage wrapper with no transition; page veil (`.veil`, black, opacity 0).
2. next frame: animate the wrapper to identity with WAAPI (`700ms`, `cubic-bezier(0.2, 0.8, 0.2, 1)`), veil to opacity 0.45 (darken), content hidden.
3. `t=700ms`: `setExplode(0.62)` (separates), labels follow via the engine default.
4. `t=950ms`: info block rises in (CSS class `data-in`).
No rect (direct visit / reduced motion): skip step 1–2, start the wrapper at scale 0.92 opacity 0 → identity in 500ms, then the same 3–4. Reduced motion: no animation, explode 0.62 immediately, info shown.

Content: left (desktop) / below (phone): kicker "The menu · 0N", name (display, ~120px desktop), tagline, description, "What's in it" list (one row per stack layer top → bottom, label from `INGREDIENTS`, duplicates shown once with ×2), allergens (small), price (mustard), "Add to bag" `.btn`, and "Try another" chips (the other four burgers). Clicking a chip: `setBurger(b)` (the engine morphs in place), copy updates via `onSwap`, URL updated with `history.replaceState(null, "", "/demo/burger-me/menu/" + b.slug)`. A "← All burgers" link back to the menu.

```tsx
"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ExplodedBurger from "../../engine/ExplodedBurger";
import { BURGERS, bySlug, formatPrice, type Burger } from "../../engine/burgers";
import { INGREDIENTS } from "../../engine/ingredients";
import { takeFlip } from "../../flip";
import { useBag } from "../../BagProvider";
import s from "../../burger-me.module.css";

export default function Detail({ initial }: { initial: string }) {
  const start = bySlug(initial)!;
  const [burger, setBurger] = useState<Burger>(start);
  const [copy, setCopy] = useState<Burger>(start);
  const [explode, setExplode] = useState(0);
  const [infoIn, setInfoIn] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const bag = useBag();

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    if (reduced) {
      queueMicrotask(() => { setExplode(0.62); setInfoIn(true); });
      return;
    }
    const card = takeFlip(initial);
    const me = el.getBoundingClientRect();
    const from = card
      ? `translate(${card.left - me.left}px, ${card.top - me.top}px) scale(${card.width / me.width})`
      : "translate(0, 2%) scale(0.92)";
    el.style.transformOrigin = card ? "0 0" : "50% 60%";
    el.animate([{ transform: from, opacity: card ? 1 : 0 }, { transform: "none", opacity: 1 }], { duration: card ? 700 : 500, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "backwards" });
    veil.current?.animate([{ opacity: 0 }, { opacity: 0.45 }], { duration: 700, fill: "forwards" });
    timers.push(window.setTimeout(() => setExplode(0.62), card ? 700 : 450));
    timers.push(window.setTimeout(() => setInfoIn(true), card ? 950 : 700));
    return () => timers.forEach(clearTimeout);
  }, [initial]);

  useEffect(() => {
    if (burger.slug !== initial || copy.slug !== burger.slug) history.replaceState(null, "", `/demo/burger-me/menu/${burger.slug}`);
  }, [burger, copy, initial]);

  const rows = burger.stack.reduce<{ label: string; n: number }[]>((acc, l) => {
    const label = INGREDIENTS[l.type].label;
    const hit = acc.find((r) => r.label === label);
    if (hit) hit.n++;
    else acc.push({ label, n: 1 });
    return acc;
  }, []);
  const num = BURGERS.findIndex((b) => b.slug === copy.slug) + 1;

  return (
    <main className={`${s.detail} ${s.stageGround}`}>
      <div ref={veil} className={s.veil} aria-hidden="true" />
      <div ref={wrap} className={s.detailStage}>
        <ExplodedBurger burger={burger} explode={explode} interactive onSwap={setCopy} />
      </div>
      <div className={s.detailInfo} data-in={infoIn}>
        <Link href="/demo/burger-me/menu" className={s.back}>← All burgers</Link>
        <p className={s.kicker}>The menu · {String(num).padStart(2, "0")}</p>
        <div key={copy.slug} className={s.swapIn}>
          <h1 className={`${s.display} ${s.detailName}`}>{copy.name}</h1>
          <p className={s.tagline}>{copy.tagline}</p>
          <p className={s.desc}>{copy.description}</p>
          <ul className={s.inIt}>
            {rows.map((r) => <li key={r.label}>{r.label}{r.n > 1 ? ` ×${r.n}` : ""}</li>)}
          </ul>
          <p className={s.allergens}>{copy.allergens}</p>
          <p className={`${s.price} ${s.builtPrice}`}>{formatPrice(copy.price)}</p>
        </div>
        <button className={s.btn} onClick={() => { bag.add(copy.slug); bag.setOpen(true); }}>Add to bag</button>
        <p className={s.kicker} style={{ marginTop: 32 }}>Try another</p>
        <div className={s.chips}>
          {BURGERS.filter((b) => b.slug !== burger.slug).map((b) => (
            <button key={b.slug} className={s.chip} onClick={() => setBurger(b)}>{b.name}</button>
          ))}
        </div>
      </div>
    </main>
  );
}
```

CSS:
```css
.detail { position: relative; min-height: 100svh; display: grid; grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr); align-items: center; gap: 24px; padding: 110px clamp(16px, 5vw, 72px) 80px; }
.veil { position: fixed; inset: 0; background: #000; opacity: 0; pointer-events: none; z-index: 0; }
.detailStage { position: relative; z-index: 1; order: 2; height: min(84svh, 860px); }
.detailInfo { position: relative; z-index: 2; opacity: 0; transform: translateY(18px); transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
.detailInfo[data-in="true"] { opacity: 1; transform: none; }
.detailName { font-size: clamp(56px, 8.5vw, 140px); margin-top: 10px; }
.inIt { margin-top: 18px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px 18px; font-weight: 600; }
.inIt li::before { content: "— "; color: var(--bm-mustard); }
.allergens { margin-top: 14px; font-size: 13px; opacity: 0.65; }
.back { display: inline-block; margin-bottom: 18px; font-weight: 700; opacity: 0.8; }
@media (max-width: 899px) {
  .detail { grid-template-columns: 1fr; padding-top: 90px; }
  .detailStage { order: 0; height: 62svh; }
}
```

- [ ] **Step 3: Visual check and commit**

In the Browser pane: from `/demo/burger-me/menu` click Bacon Cheese — the burger should fly from the card into the stage, the page darkens, the stack separates, labels appear, info rises. Direct-load `/demo/burger-me/menu/hot-honey` (fallback intro). Click each "Try another" chip: morph in place, copy updates mid-morph, URL updates. Shoot at 1440 and 375 (`--mobile`), `scrollWidth === innerWidth`. `npx eslint src/app/demo/burger-me`.
```bash
git add src/app/demo/burger-me
git commit -m "feat(burger-me): burger detail page with FLIP intro and in-place recipe switching"
```

---

### Task 9: Work-page card — cover, logo, entry, count

**Files:**
- Create: `public/work/covers/burger-me.webp`, `public/work/logos/burger-me.webp`
- Modify: `src/app/case-studies/work-entries.ts` (new first entry), `src/app/case-studies/work-entries.test.ts` (href regex allows hyphens), `src/app/case-studies/page.tsx` (`COUNT_WORDS` adds `"Ten"`), `scripts/work-logos/capture.mjs` (BRANDS entry)

**Interfaces:**
- Consumes: the live demo (dev server) and `public/demo/burger-me/master.webp`.

- [ ] **Step 1: Update the href test first**

In `work-entries.test.ts` change `toMatch(/^\/demo\/[a-z]+$/)` to `toMatch(/^\/demo\/[a-z-]+$/)`.

- [ ] **Step 2: Add the entry (it fails until the files exist)**

Prepend to `conceptBuilds`:
```ts
  {
    name: "Burger Me",
    href: "/demo/burger-me",
    external: true,
    disciplines: "Restaurant · Smash burgers",
    summary:
      "A smash-burger restaurant whose menu is one photographic burger: it takes itself apart as you scroll, rebuilds, and changes recipe in front of you — bacon slides in, pickles leave, the price follows.",
    image: "/work/covers/burger-me.webp",
    alt: "Burger Me cover — a double smash burger floating apart layer by layer on an oxblood stage",
    logo: { src: "/work/logos/burger-me.webp", width: 0, height: 0 },
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · Motion engine · Menu · Bag" },
      { term: "Burgers", value: "Five, one engine" },
    ],
    cta: "View the build",
  },
```
Run: `npx vitest run src/app/case-studies/work-entries.test.ts`
Expected: FAIL (cover/logo files missing, logo width 0).

- [ ] **Step 3: Cover (controller, Higgsfield)**

`nano_banana_pro` 16:9 with `$EXPLODED_ID` and `$MASTER_ID` as refs:
```
Cinematic 16:9 food advertising key visual: this exact burger floating apart into its layers along a vertical axis, slightly off-centre to the right, on a deep oxblood red stage with one hard warm key light from the top left and a soft glow behind the burger, rich saturated colour, deep shadows, generous empty space on the left. Same burger, same ingredients, same angle and light as the references. Real food photography.
```
Crop the bottom 10% if a caption strip appears. Export: `cwebp -q 82` at 1920 wide → `public/work/covers/burger-me.webp`. Read it beside two existing covers to confirm it belongs in the set (one hard light, deep shadow, rich colour).

- [ ] **Step 4: Logo capture**

Add to `BRANDS` in `scripts/work-logos/capture.mjs`: `{ slug: "burger-me", match: "^burger\\s*me$" }` (if the chosen logo's accessible text differs, match that; the script finds the nav brand link by its text — the Logo must render its name as text or `aria-label` on the link; check the script's matching and adapt the match). With the dev server up: `node scripts/work-logos/capture.mjs /tmp/bm-logos` (it captures all brands; copy only `burger-me.png`), convert to WebP like the others (`cwebp -q 90 -exact -alpha_q 100`) → `public/work/logos/burger-me.webp`, and set `logo.width/height` in the entry to its pixel size (`python3 -c "from PIL import Image; print(Image.open('public/work/logos/burger-me.webp').size)"`).

- [ ] **Step 5: Count word**

Append `"Ten",` to `COUNT_WORDS` in `src/app/case-studies/page.tsx`.

- [ ] **Step 6: Test, check, commit**

Run: `npx vitest run src/app/case-studies`
Expected: PASS.
Shoot `/case-studies` at 1440 and 375 (`--mobile`): Burger Me is card 01 / 10, cover and white logo sit like the others, the display statement says "Ten".
```bash
git add public/work src/app/case-studies scripts/work-logos/capture.mjs
git commit -m "feat(work): Burger Me as card 01 of ten"
```

---

### Task 10: Final pass

**Files:**
- Delete: `src/app/demo/burger-me/lab/` (bench and logo page)
- Modify: whatever the pass finds

- [ ] **Step 1: Remove the bench**

```bash
git rm -r src/app/demo/burger-me/lab
```

- [ ] **Step 2: Full checks**

Run: `npx vitest run && npx eslint src/app/demo/burger-me src/app/case-studies && npx next build`
Expected: tests pass, no lint errors in these paths, build succeeds with `/demo/burger-me`, `/demo/burger-me/menu` and the five `/demo/burger-me/menu/[slug]` pages.

- [ ] **Step 3: Visual pass at 375 / 768 / 1440**

With `shot.mjs` (real Chrome) for every route and every hero beat; Browser pane for interactions: hero at each beat, a recipe change mid-flight, menu hover, card → detail hand-off, add to bag, order confirmation, Escape closes the drawer. Every page: `scrollWidth === innerWidth` at 375, zero console errors. Fix anything visibly wrong; spend effort where a visitor sees it.

- [ ] **Step 4: Commit**

```bash
git add -A src/app/demo/burger-me
git commit -m "chore(burger-me): final pass — remove QA bench, fix visual defects"
```

Report to Adam: what's built, the commit range, and that nothing is pushed.
