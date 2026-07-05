# Cinematic 3D Launch Hero — Design Spec (Phase 1)
**Date:** 2026-07-05
**Status:** Approved for implementation

---

## Overview

WebMinor's homepage is being rebuilt into an award-worthy, cinematic "digital experience" per a master creative brief (rocket/launch/space theme, luxury dark-mode aesthetic in the style of Apple/Tesla/SpaceX product reveals). The full brief covers the entire site (hero, about, services, six interactive portfolio demos, pricing, process, testimonials, contact) and is too large for one implementation pass.

**This spec covers Phase 1 only: the 3D hero and its scroll-triggered rocket-launch transition into a single follow-on section.** Later phases (existing content integration, six interactive portfolio demos) are separate, future specs.

Full context: see `WebMinor_Fable5_Master_Prompt.md` (user-provided creative brief) for the complete multi-phase vision this spec is scoped out of.

---

## Scope

**In scope:**
- New route `/launch` in the existing Next.js app (this repo)
- Fixed navbar (restyled from current site's navbar)
- Full-viewport 3D hero: starfield, nebula, drifting particles, distant planet, rotating chrome rocket, mouse-parallax
- Real WebMinor headline/subhead/CTA copy in a DOM layer above the canvas
- Scroll-triggered launch sequence (ignition → smoke/heat distortion → launch → camera follow) transitioning into one follow-on section: About, framed as "entering orbit," with Earth visible
- Lenis smooth scroll wired in site-wide for this route
- Mobile fallback: static hero image + CSS-only parallax instead of live WebGL
- Reduced-motion fallback

**Out of scope (future phases):**
- Services floating modules, six interactive portfolio demos, builder-demo timeline, pricing cards, process countdown, testimonials, contact section
- Integrating this hero into the real homepage (`src/app/page.tsx`) — this phase only builds `/launch` as a preview route
- The 60 existing SEO town×trade pages, blog, pricing page — untouched by this phase

**Rollout:** Built at `/launch`, current homepage at `/` is untouched. Reviewed in-browser before any decision to swap it in as the real homepage.

---

## Codebase

Built inside the existing Next.js app at `/Users/adambutcher/Desktop/webminor/` (Next.js 16, React 19, TypeScript, Tailwind v4, shadcn/ui, GSAP already installed). Chosen over a fresh project because this repo already holds the SEO pages, pricing, blog, and contact form that later phases need to integrate with, and its stack already matches the brief's requirements.

Note: this repo has pre-existing uncommitted local changes (`package.json`, `globals.css`, `layout.tsx`, `page.tsx` modified; several untracked dirs including `src/app/about/`, `public/frames/`). This spec's implementation should not assume a clean working tree and should avoid clobbering that in-progress work — check with the user before touching files outside the new `/launch` route if overlap is discovered.

---

## The 3D Hero Scene

**Environment:**
- Starfield: instanced point cloud (~1,500–2,000 points), slow rotation, subtle per-point twinkle via shader-driven opacity variation
- Nebula: 2–3 large soft-edged sprite planes with a nebula texture (violet/deep-blue), additive blending, slow independent drift
- Distant planet: textured sphere (Earth-like), lower-frame placement, slow self-rotation
- Particle field: ~200–300 smaller drifting motes, gentle upward/lateral float, brighten near the cursor

**The rocket:**
- Free CC0 GLTF model (Sketchfab/Poly Haven or equivalent, license verified before use)
- Materials swapped to premium brushed-chrome PBR (high metalness, low roughness, HDRI environment map for reflections) — explicitly NOT a cartoon/illustrated style, and NOT a red/orange body (that palette is reserved for the launch flame only)
- Slow idle rotation + gentle vertical bob pre-launch
- Camera-relative mouse parallax: rocket and camera rig lerp toward cursor position, capped to a small offset ("premium drift," not obvious tracking)

**Lighting:** one cool blue-white key light, one electric-blue rim light, HDRI environment map for reflections. No more than 2–3 real-time lights; additional "glow" comes from emissive materials + bloom post-processing.

**Palette:** near-black/deep-navy background, electric-blue/purple/cyan accents (per existing approved site palette). Warm orange/red is permitted only as the launch-flame/smoke accent, not as a base scene color.

**Copy overlay:** headline/subhead/CTAs live in a DOM layer above the canvas (not scene geometry), keeping text sharp, accessible, and crawlable — consistent with how the current static prototype already separates DOM content from its canvas background.

---

## Scroll Choreography (launch sequence)

One continuous GSAP ScrollTrigger timeline, pinned on the hero (not multiple scroll-jacked sections), so it stays scrubbable in both directions:

1. **Idle (0% scroll):** rocket floats/rotates gently, camera static, full copy overlay visible
2. **Pre-launch:** copy fades/parallaxes away faster than the background; camera slowly pushes in toward the rocket base
3. **Ignition:** emissive glow ramps at engine nozzles; smoke sprite particles spawn and billow outward (warm-orange flame/smoke as the deliberate accent color); heat distortion via a cheap faked approach (warped/blurred smoke plane) unless a real screen-space distortion shader proves affordable in profiling
4. **Launch:** rocket accelerates upward along a scripted path; camera follows/tilts to track it; starfield streaks slightly to sell speed; engine trail lengthens
5. **Handoff:** as the rocket exits frame, camera settles into the About section's framing — Earth rises into view establishing "orbit" — pinned scroll releases into normal document flow

Composition reference for the ignition/launch beat (rocket bursting through billowing smoke) came from user-provided images, but the color palette and photorealistic-chrome style follow the approved site palette, not those references' warm illustrated look.

---

## Mobile, Performance, Accessibility

**Mobile fallback:** below a viewport/capability threshold (no WebGL2, low `navigator.hardwareConcurrency`, or a phone-width breakpoint), skip the R3F canvas entirely. Serve a single static hero image (same chrome-rocket-in-space look as the desktop 3D scene) with the copy overlay and CSS-only parallax/fade on scroll. (Revised during planning: the existing `public/frames/` sequence is the *current* homepage's unrelated flyover footage, not a rocket-launch asset, so it isn't reused here. A static image was chosen over recording the live 3D scene to video, to avoid standing up a separate capture/encoding pipeline for one asset.)

**Reduced motion:** `prefers-reduced-motion` disables the pinned scroll-jack and smoke/parallax; rocket and copy appear in final state with a simple fade-in, no forced scrubbing.

**Performance budget (desktop 3D path):**
- GLTF compressed with Draco/Meshopt; textures compressed (KTX2/Basis), capped at 2K
- `<Suspense>` with a lightweight loading state (not a blank canvas) while assets stream
- Device pixel ratio capped at 2 (`Math.min(devicePixelRatio, 2)`)
- Bloom/post-processing limited to a single pass; particle counts tuned against real mid-range hardware
- Lenis synced to ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` to avoid smooth-scroll/pin conflicts

**Accessibility:** canvas marked `aria-hidden`; real `<h1>` in the DOM copy layer (not char-split spans); color contrast checked against the dark background; CTA buttons keyboard-focusable with visible focus states.

---

## New Dependencies

Add to `webminor/package.json`: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `lenis`, `framer-motion`.

GSAP is already installed. Not adding Motion One or Spline — redundant with Framer Motion/R3F for this phase's needs.

---

## Testing / Validation

- `npm run dev`, visually verify `/launch` in-browser: idle state, scroll-scrub forward and backward, mobile viewport (fallback video triggers), `prefers-reduced-motion` (via OS/dev-tools emulation)
- Lighthouse run against `/launch` on both a throttled mobile profile and desktop, targeting 95+ where feasible for a WebGL-heavy page — flag to the user if the live 3D path can't hit that target so trade-offs can be made consciously
- Confirm GLTF model license permits commercial use before shipping
