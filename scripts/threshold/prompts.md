# Threshold — Higgsfield image generation record

Model: `flux_2`, `--resolution 2k --variant pro`. Cut-out: `image_background_remover`.
Generated 2026-09-17. Helper: `scripts/threshold/gen.sh`.

## Style suffix

Appended verbatim to every prompt (referred to below as `$STYLE`):

```
Editorial sports photography, dark industrial gym floor, two coloured lights only: hard magenta light from camera left and electric cyan-blue light from camera right, low floor haze, deep shadows, no warm light, no orange, no amber, no text, no signage, no watermark, no captions, photoreal, 85mm, shallow depth of field.
```

## Upload ids (references)

| purpose | upload id |
| --- | --- |
| hero athlete (`hero-3.png`) — reference for all programme shots and the cover | `9aec7b28-3689-4531-990a-272ff25631a6` |
| coach Inês portrait | `1a072873-50b5-4f8b-8add-f813cbec18e4` |
| coach Kofi portrait | `1926a236-8d4a-47f5-96a5-63febcd70056` |
| coach Sana portrait | `744bb001-6da3-4f69-8fa6-c007fdb3b300` |
| coach Marek portrait | `f1867b62-f256-47e5-a5b4-f01405ab8024` |

## Hero — candidate 3 chosen

Four candidates generated from one prompt, 16:9:

```
A single athlete in a sprinter's set position on a dark concrete gym floor, full body visible from the side and slightly in front, wearing a plain dark fitted training top and dark shorts, chalked hands on the floor, looking down the lane, muscles tensed, hair short. Framed with clear empty space above and to the left of the athlete for display type. $STYLE
```

- **hero-1** — strong light, but the body sits large in frame and the rear leg runs to the right edge; less room for display type.
- **hero-2** — rejected: rear leg and foot cropped by the right edge.
- **hero-3** — **CHOSEN**. Whole body inside the frame including both bare feet, magenta pool on the floor camera left and cyan haze camera right, the left two-thirds of the frame empty for the display word.
- **hero-4** — rejected: a Nike swoosh is rendered on the shorts.

`hero-cutout` was made from `hero-3.png` via `image_background_remover` (foreground call, `</dev/null`). Checked composited over `#111114` and over white: clean edge, no halo, toes intact, no floor fragments.

## Programme shots (4:3, `--image-references <hero id>`)

Each prompt ends with `Same rendering style as the reference image. $STYLE`.

**prog-strength** (final = roll 2):
```
The same athlete as the reference, same face, same build, wearing a plain unbranded black training top with a completely blank chest, now standing under a loaded barbell at the top of a back squat on a matte black rubber lifting platform, bare dark concrete wall behind him, completely blank empty background.
```

**prog-conditioning** (final = roll 1):
```
The same athlete as the reference, same face, same build, same dark training top, now driving a weighted sled across the floor, low body angle, arms locked.
```

**prog-mobility** (final = roll 2):
```
The same athlete as the reference, same face, same build, same plain unbranded black training top with a blank chest, now in a deep low lunge on a dark rubber floor, one arm reaching up, calm, bare dark concrete wall behind him, completely blank empty background.
```

**prog-open** (final = roll 2):
```
The same athlete as the reference, same face, same build, same plain unbranded black training top with a blank chest, now chalking his hands beside a black steel rig, looking down at the bar, bare dark concrete wall behind him, completely blank empty background.
```

## Coaches — portraits (3:4, no reference)

```
ines:  Portrait of a woman in her mid thirties, Portuguese, dark hair tied back, strong shoulders, plain black coach's t-shirt, standing in front of a dark steel rig, looking straight at camera, composed. $STYLE
kofi:  Portrait of a tall Black man in his late thirties, close-cropped hair, short beard, plain black coach's t-shirt, standing beside a rowing machine, looking straight at camera, relaxed. $STYLE
sana:  Portrait of a South Asian woman in her early forties, hair in a low bun, plain black coach's t-shirt, standing on a dark mobility floor with foam rollers behind, looking straight at camera, warm expression. $STYLE
marek: Portrait of a Polish man in his late forties, grey at the temples, weathered hands, plain black coach's t-shirt, standing in the doorway of an industrial unit, looking straight at camera, steady. $STYLE
```

All four accepted on the first roll.

## Coaches — action shots (3:4, `--image-references <that coach's portrait>`)

Each ends with `Same rendering style as the reference image. $STYLE`.

**ines-action** (final = roll 1):
```
The same woman as the reference, same face, same hair, now coaching a lifter at a barbell, one hand indicating bar path, mid sentence.
```

**kofi-action** (final = roll 1):
```
The same man as the reference, same face, same beard, now standing over a row of rowing machines with a stopwatch, calling a time.
```

**sana-action** (final = roll 2):
```
The same woman as the reference, same face, same hair, kneeling upright on a dark rubber mobility floor beside a single foam roller, one hand flat on the floor and the other open in front of her demonstrating a hip position, alone in the frame, bare dark concrete wall completely blank behind her.
```

**marek-action** (final = roll 2):
```
The same man as the reference, same face, same grey temples, standing on the open floor holding a loaded barbell at his hips with both hands, steady and ready, wearing a plain unbranded black t-shirt and plain unbranded black shorts with a completely blank surface and no markings, bare dark concrete wall completely blank behind him.
```

## The space (16:9, no reference)

**space-floor** (final = roll 4):
```
Wide interior of a dark 1960s print works converted to a strength gym, deep shadows, steel roof trusses barely visible, four matte black rubber lifting platforms in a row on a dark polished concrete floor, black steel rig at the far end, smooth dark grey painted plaster walls, pristine and completely unmarked with nothing hanging on them, thick low haze, two beams of coloured light raking across the room, empty, no people. $STYLE
```

**space-rig** (final = roll 1):
```
A welded black steel twelve-station rig in a dark industrial unit, barbells racked, chalk on the floor, empty, no people. $STYLE
```

**space-door** (final = roll 3):
```
Seen from inside an industrial unit, a single polished steel bar bolted across the doorway threshold just above the floor at ankle height, low camera close to the dark concrete, a plain galvanised steel roller door half raised in the opening behind it, bare grey walls, empty, no people. $STYLE
```

## Work cover (16:9, `--image-references <hero id>`, roll 1)

```
The same athlete as the reference, same face, same build, same dark training top, sprinting out of the set position towards camera right, motion in the haze behind, wide cinematic framing with empty dark space on the left. Same rendering style as the reference image. $STYLE
```

## Rerolls and why

| asset | rolls | reason for each reroll |
| --- | --- | --- |
| hero | 4 candidates, no rerolls | hero-2 cropped the rear foot; hero-4 carried a Nike swoosh; hero-3 chosen |
| prog-strength | 3 | r1: Nike swoosh on the chest and a warm orange wooden platform. r3: the model held the bar out in front with straight arms, an implausible pose — r2 kept. |
| prog-mobility | 2 | r1: an amber cardboard box and paper notices in the background |
| prog-open | 2 | r1: partial white signage lettering at the right edge |
| space-floor | 4 | r1: warm orange wooden platforms and wall signage. r2: clean but flatly lit, no coloured beams. r3: a legible graffiti tag on the left wall. r4 kept. |
| space-door | 3 | r1: yellow/black hazard-striped bollards and a warm glow under the door. r2: the bar sat at waist height as a barrier rail, not the ankle-height threshold bar. |
| coach-sana-action | 2 | r1: wall lettering behind, and the second figure on the floor rendered with mangled anatomy |
| coach-marek-action | 2 | r1: a readable adidas wordmark and logo on the shorts |

## Output sizes

`cwebp` was run at the brief's quality settings. Source renders are 1920px on the long edge, so
the hero (`-resize 2400`) and the space shots (`-resize 2000`) were written at native 1920 rather
than upscaled; every other resize target was below the source width and was applied as written.

| file | cwebp | final pixels |
| --- | --- | --- |
| `hero.webp` | `-q 86` | 1920×1088 |
| `hero-cutout.webp` | `-q 90 -exact -alpha_q 100` | 1920×1088 RGBA |
| `prog-*.webp` | `-q 84 -resize 1600 0` | 1600×1200 |
| `coach-*.webp` | `-q 84 -resize 1200 0` | 1200×1600 |
| `space-*.webp` | `-q 84` | 1920×1088 |
| `public/work/covers/threshold.webp` | `-q 86` | 1920×1088 |

---

## Fix round 1 — Strength card rerolled as a real lift

`prog-strength.webp` (kneeling pull-setup) was rejected in review: the Strength card must show the
athlete under load. Two candidates generated in parallel, 4:3, `--image-references 9aec7b28-3689-4531-990a-272ff25631a6`.

**lift-a — CHOSEN**, saved as `prog-strength-lift.webp`:
```
The same athlete as the reference, same face, same build, wearing the same plain unbranded black training top with a completely blank chest, photographed from the front at the very top of a heavy back squat: a loaded barbell with large black bumper plates rests horizontally across his upper back behind his neck, both hands gripping the bar wide, elbows down, chest up, knees almost locked, standing on a dark stained wooden lifting platform. Bare dark concrete wall behind him, completely blank empty background. Same rendering style as the reference image. $STYLE
```

**lift-b — not used** (deadlift lockout alternative):
```
The same athlete as the reference, same face, same build, wearing the same plain unbranded black training top with a completely blank chest, photographed from the front at deadlift lockout: standing tall and upright, shoulders back, arms hanging straight down, a loaded barbell with large black bumper plates held at his hips, bar resting against the top of his thighs, feet flat on a dark stained wooden lifting platform. Bare dark concrete wall behind him, completely blank empty background. Same rendering style as the reference image. $STYLE
```

Both were anatomically clean. lift-a was chosen because the load sits on the body, so the card reads
as strength at a glance; lift-b reads as a man standing holding a bar. `prog-strength.webp` was deleted
rather than overwritten so `next/image` cannot serve a stale cache entry.

| file | cwebp | final pixels |
| --- | --- | --- |
| `prog-strength-lift.webp` | `-q 84 -resize 1600 0` | 1600×1200 |

---

## Fix round 2 — Strength card, same athlete, no branding

`prog-strength-lift.webp` was rejected on two counts: a different athlete (fair, bearded, heavier,
smiling) and legible three-stripe logos on both shoes. Reference used throughout: the hero upload
`9aec7b28-3689-4531-990a-272ff25631a6` (the upload of `hero-3.png`, confirmed against the
background-remover job record that produced the shipping cut-out).

Every candidate below is barefoot, which removes the shoe-logo failure mode entirely and matches the
hero, cover and the other three programme shots, all of which are barefoot.

Three rounds were needed. The identity descriptors supplied in the review brief ("dark short hair,
olive skin") describe a different man from the one in `hero-3.png`, who is fair-skinned with short
cropped mid-brown hair buzzed at the temples. Carrying those words into the prompt overpowered the
image reference and produced a dark-haired bearded man three times over. Describing the reference as
it actually looks fixed it on the next round.

**sq3-b — CHOSEN**, saved as `prog-strength-squat.webp`:
```
The same athlete as the reference, same face, same short cropped mid-brown hair buzzed at the temples, clean-shaven with no beard and no moustache, same fair skin, same lean build, bare arms with clear unmarked skin and no tattoos, same plain unbranded dark training top with a completely blank chest and no logo, same dark shorts, mouth closed, jaw set, calm and focused, barefoot with bare feet clearly visible, at the bottom of a heavy back squat, thighs parallel to the floor, about to drive upward. The loaded barbell rests on his trapezius muscles BEHIND his neck with large black bumper plates on each end, both hands gripping the bar either side of his shoulders, elbows down, chest up, eyes forward, on a dark wooden lifting platform. Bare dark concrete wall behind him, completely blank empty background. Same rendering style as the reference image. $STYLE
```

| file | cwebp | final pixels |
| --- | --- | --- |
| `prog-strength-squat.webp` | `-q 84 -resize 1600 0` | 1600×1200 |
