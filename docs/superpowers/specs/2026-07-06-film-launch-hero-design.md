# Film Launch Hero — Design Spec (Phase 1 rework)
**Date:** 2026-07-06
**Status:** Approved direction from Adam ("i want a rocket launch but not like we have it… we have a video if you want to use it as reference adds.mov… create something very special"). Supersedes the WebGL hero of `2026-07-05-cinematic-launch-hero-design.md` as the visual approach for `/launch`; the scroll/fallback architecture from that spec is retained.

---

## Creative rationale

The reference footage (`~/Desktop/adds.mov`, 10.6s, 1200×720@30) is a cinematic render of a rocket ascending through glowing magenta cloud banks against a teal-and-navy galaxy. Real-time WebGL cannot match that density of volumetric cloud at any sane frame budget — the previous chrome-rocket scene proved the ceiling. So the film itself becomes the hero, scroll-scrubbed frame-by-frame (the Apple AirPods technique), and the "alive" feeling comes from interactive layers composited over it. The site's own homepage already ships this pattern (`VideoBackground` + `public/frames/`), so it is proven in this codebase.

## The experience

1. **Arrival:** near-black screen; poster frame (rocket nested in glowing clouds) paints immediately as the LCP image. Headline reveals with a staggered rise: "WE DON'T BUILD WEBSITES / WE LAUNCH BUSINESSES"; subhead "Luxury digital experiences engineered for ambitious companies."; CTAs "Launch Your Project" / "View Our Work". Fixed WebMinor navbar.
2. **Scroll (pinned ≈300vh, fully scrubbable both directions):** the film scrubs with scroll — the rocket climbs, clouds boil past, galaxy opens up. Copy fades/lifts out over the first 25–35% (driven by the same progress number as the frames — single source of truth, per the fixed architecture).
3. **Living layers over the film:** subtle film grain; vignette; mouse-parallax (canvas drifts a few px against the copy layer for depth); a mono-type telemetry HUD (T+ clock / ALTITUDE readout derived from scroll progress) as the mission-control signature detail.
4. **Handoff:** as the final frames reach open space, the hero unpins and crossfades into the dark "orbit" section (About placeholder until Phase 2).

## Assets & loading

- Re-extract frames from `adds.mov`: ~160 frames (every 2nd source frame), 1200×720 WebP q≈68, target ≤60KB avg. Poster = first frame, also used by the static fallback.
- Progressive loading: paint the poster instantly; stream every Nth frame first (coarse scrub available within ~1s), backfill the rest. Draw nearest-loaded frame until complete. Frames never block LCP.
- Mobile (<768px), no-WebGL2-not-required-anymore but low-capability, and `prefers-reduced-motion`: static poster hero (existing `FallbackHero`, image swapped to the poster) — no sequence download, no pin.

## Palette

The film defines the art: magenta/rose clouds, warm flame core, teal/navy galaxy, near-black frame. UI keeps near-black background, white type, cyan `#40E0FF` primary CTA (it sits naturally in the teal family of the footage); magenta appears only where the film provides it. Company name is **WebMinor** (brand fixed by Adam).

## Architecture (delta from previous spec)

- `LaunchHero` keeps: capability detection, Lenis+ScrollTrigger pin (`+=200%` → retuned to `+=300%`), progressRef, onUpdate-driven copy fade via `computeLaunchState`.
- `Scene`/R3F canvas is replaced in the route by `FilmCanvas` (2D canvas drawing the frame sequence from progress). R3F components remain in the tree/history but unused on `/launch`.
- New pure, unit-tested modules: `frameSequence.ts` (progress → frame index; nearest-loaded-frame selection; coarse-then-fine load order) so the scrub logic is testable without a browser.
- Telemetry HUD derives from the same progress number (pure function, tested).

## Performance & accessibility

- LCP: poster `<Image priority>` + real `<h1>` in DOM. Sequence lazy-streams after hydration.
- Canvas is `aria-hidden`; copy layer is real DOM; CTAs keyboard-focusable. Reduced-motion path has no pinning or scrubbing.
- Lighthouse target stays 95+ (fallback/mobile path is a static image page; desktop's sequence is post-LCP traffic).
