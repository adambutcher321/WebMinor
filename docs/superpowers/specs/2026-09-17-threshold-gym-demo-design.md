# Threshold — ninth WebMinor concept build

**Date:** 2026-09-17
**Route:** `/demo/threshold` (scroll-world branch)
**Status:** approved in conversation; implementation plan to follow

## Why this build exists

The work index lists eight concept sites that all share one look: a dark stage,
one warm spotlight, amber on black, a single object in the middle. Threshold is
deliberately the odd one out. It is the only cold site in the row, the only one
built around a person rather than a product, and the only one with a fixed rail
navigation.

References supplied by Adam: the "Limitless" sports banner (athlete in a
sprinter's set position, dual magenta and cyan light, low haze, outline display
type behind the body, thin left rail with socials) and the "Fitness Club"
banner (photograph threaded through outline type, single pill button). The
CrossFit "Flexfit" reference is rejected for its template stat trio and three
identical programme cards.

## Positioning

Threshold is a boutique strength and conditioning studio: coached, timetabled
sessions in a converted industrial unit. Membership is a monthly allowance of
sessions per week. Booking a class and joining are both real flows, not
decoration. Coaches are part of the sell.

Copy rules follow the studio-wide ones: no bullet-list selling, no bolted-on
hooks, no filler reassurance, no lorem, no invented awards. Real-sounding
figures only where the studio would actually publish them (years open, coaches,
sessions a week).

## Visual identity

**Colour and light.** Cold dual light. Magenta (`#ff2d8a` family) from one
side and electric cyan-blue (`#2ee6ff` family) from the other. Hero and
footer sit on near-black navy (`#07090f`). The body of the site flips to
frost white (`#f4f6fa`) with the same two colours as the only accents. Nothing
amber, gold or orange anywhere. No single overhead beam.

**Type.** Display: Archivo (Google, variable) at its widest width setting and
heavy weight, so THRESHOLD reads as a sports wordmark. Outline type in the
hero, solid elsewhere. Body: Instrument Sans. Both loaded with
`next/font/google` and exposed as CSS variables scoped to the demo layout.

**Mark.** A wordmark only, no pictorial logo: THRESHOLD set wide with the
letters of "HOLD" one weight heavier. The favicon is a "T" cut by a
horizontal bar (the threshold line) in magenta on navy.

**Layout.** A fixed left rail, 56px wide from 1024px up, carrying the
section index (dots plus labels on hover), a live "next class in HH:MM"
countdown, and socials. On phones the rail collapses into a bottom bar
holding Book and Join. The main measure is asymmetric: display copy hugs the
left edge next to the rail, imagery bleeds right.

## Pages

| Route | Purpose |
|---|---|
| `/demo/threshold` | Home: hero, manifesto, programmes rail, this week, coaches, membership, the space, footer |
| `/demo/threshold/timetable` | Full week, all classes, day tabs, filters by programme |
| `/demo/threshold/membership` | Slider join flow (step 1 choose, step 2 details, step 3 confirmed) |
| `/demo/threshold/coaches` | Roster with one long-form profile each |
| `/demo/threshold/about` | The unit, the method, the founders |

Booking and joining are drawers or in-page steps, not extra routes. Every
page shares the rail, the nav and the footer via the demo layout.

## Home page, section by section

1. **Hero.** Full-bleed photograph, an athlete in the set position on a dark
   floor, magenta left, cyan right, haze on the floor. Two image layers: the
   full photograph at the back, a transparent cut-out of the athlete in front.
   Between them the word THRESHOLD in outline Archivo at roughly 22vw, so the
   body threads through the letters. Top nav: five links (Programmes, This
   week, Coaches, Membership, About) and one pill, "Try a session". Under the
   word, a one-line statement and a live strip: next class name, time, places
   left.
2. **Manifesto.** Short statement in three sentences, three figures counting
   up on arrival (years open, coaches, sessions a week). Frost white.
3. **Programmes rail.** Four programmes: Strength, Conditioning, Mobility,
   Open Floor. A pinned section where vertical scroll scrubs the rail
   horizontally. Each card: a photograph of the same athlete, name, one line,
   the days it runs.
4. **This week.** A typographic wall, not a table. Day tabs across the top.
   For the selected day each class is a row with the time as a giant figure,
   the programme name, the coach, places left, and a Book button. Rows
   stagger in when the day changes.
5. **Coaches.** Four coaches as a full-height roster. Each column: portrait,
   name set vertically along the edge, discipline. Hover cross-fades the
   portrait to an action shot of the same person.
6. **Membership.** One slider: sessions a week from 2 to Unlimited. The price
   updates live with a monthly or annual toggle, the annual figure showing
   the saving. One button, "Join at this level", opens the join flow.
7. **The space.** Three photographs of the unit with slow parallax, and one
   line about the building.
8. **Footer.** Address, hours, the wordmark large, links.

## Working flows

**Book.** The Book button opens a drawer: class, day, time, coach, places
left, then name and email, then Confirm. On confirm the class's places
decrement, the drawer shows a confirmation, and the booking is stored under
`threshold.bookings` in localStorage. Rows show "Booked" for classes the
visitor holds. Full classes show "Waitlist" and take the same details.

**Join.** From the slider or the membership page: step 1 confirms the level
and billing period, step 2 takes name, email and a start date, step 3 is a
confirmation with the first session suggested from the timetable. Stored under
`threshold.membership`. The rail countdown and the hero strip both read from
the same timetable data so they never disagree.

## Motion

All motion is CSS variables and small client components, no new dependencies.
The pattern of Reveal, Counter and media-query hooks from Mindful is reused in
spirit but written fresh for this site so nothing is shared across demos.

- Hero: letters of THRESHOLD settle in one at a time on load; the athlete
  cut-out, the haze and the type move on cursor at three depths; on scroll the
  type scales away and fades while the athlete holds, then the hero hands off.
- Rail countdown ticks every second from the next class time.
- Programmes rail scrubs horizontally with vertical scroll while pinned.
- Timetable rows stagger in on day change; the giant time figures roll.
- Coach portraits cross-fade on hover; the vertical names slide on entry.
- Membership price counts between values when the slider moves.
- Buttons are magnetic within 40px; the pill has a light sweep on hover.
- Gallery images parallax at two depths.
- Everything respects `prefers-reduced-motion` by settling to the final
  state without animation.

## Imagery (Higgsfield)

All generated, nothing stock. One athlete throughout for consistency.

1. **Hero athlete.** `flux_2`, 2k, landscape 16:9. Set position, dark
   industrial floor, magenta light from camera left, cyan from camera right,
   low haze on the floor, no text, no signage. Pick one of four candidates.
   Upload the PNG, then `image_background_remover` on a foreground Bash call
   (never background) for the cut-out; save as WebP with alpha.
2. **Programme shots.** Four, same athlete, hero as `--image-references`,
   same light, one per programme (barbell, rower, mobility floor, open
   floor).
3. **Coaches.** Four people, each a portrait and an action shot generated as
   a pair from one reference so the person holds. Same dual light.
4. **The space.** Three shots of the unit: the floor, the rig, the entrance
   with the threshold bar.
5. **Work cover.** 16:9, the athlete cut through the outline word, cold light.
   Saved to `public/work/covers/threshold.webp`. This is the one place the
   convention "one hard light, deep shadow" is broken on purpose, and the
   cover should still read as a cinematic still.

Assets live in `public/demo/threshold/`. Every asset gets a final filename on
first save; replacements get a new name (next/image caches by filename).

## Build structure

```
src/app/demo/threshold/
  layout.tsx            fonts, metadata (noindex), BookingProvider, Rail, Nav, Footer
  page.tsx              home
  timetable/page.tsx
  membership/page.tsx
  coaches/page.tsx
  about/page.tsx
  content.ts            all copy, programmes, coaches, pricing
  timetable.ts          the week's classes and a nextClass() helper
  BookingProvider.tsx   bookings + membership state, localStorage
  Rail.tsx              fixed rail, countdown, section index
  Nav.tsx / Footer.tsx
  Hero.tsx              layered hero, letter reveal, cursor depth, scroll handoff
  ProgrammesRail.tsx    pinned horizontal scrub
  Week.tsx              typographic timetable + BookDrawer
  Coaches.tsx
  Membership.tsx        slider + JoinFlow
  Space.tsx
  motion.tsx            Reveal, Counter, Magnetic, useReducedMotion
  threshold.module.css  tokens and every section's styles
```

Case-studies entry: added to `conceptBuilds` in `src/app/case-studies/page.tsx`
with disciplines "Fitness · Strength studio", summary, cover, alt text in the
"Threshold cover — …" form, and the standard spec pair.

## Testing

- Vitest: `timetable.ts` (nextClass wraps across the week, places decrement,
  full class becomes waitlist), pricing function (every slider step, both
  billing periods, annual saving), BookingProvider reducer.
- Lint clean for the new folder (no `set-state-in-effect`, no hydration
  nondeterminism: dates and randomness minted on interaction, not render).
- Browser pass at 390, 768, 1280 and 1600 wide, light only (the demo sets
  its own colour scheme), plus a reduced-motion pass.
- Award-tier visual check: screenshots of every section reviewed against the
  two references before it is called done. Puppeteer with real Chrome for
  anything the browser pane cannot capture.

## Out of scope

Payments, real auth, email confirmation, a CMS, and a blog. Instructors'
individual booking. Any warm colour.
