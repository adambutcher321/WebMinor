# Cinematic 3D Launch Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a scroll-driven, 3D cinematic rocket-launch hero at a new `/launch` preview route in the existing `webminor` Next.js app, per `docs/superpowers/specs/2026-07-05-cinematic-launch-hero-design.md`.

**Architecture:** A React Three Fiber scene (starfield, nebula, planet, chrome rocket, engine glow, smoke) is driven entirely by one number — scroll progress (0–1) — computed by a pure function and applied imperatively inside a single `useFrame` loop. GSAP's `ScrollTrigger` (pinned, scrubbed) supplies that progress number and independently fades the DOM copy layer; Lenis smooths the scroll feel. Devices that can't handle live WebGL (or that prefer reduced motion) get a static image hero instead — same visual language, zero WebGL cost.

**Tech Stack:** Next.js 16 / React 19 / TypeScript (existing), adding: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `lenis`, `framer-motion` (GSAP already installed). Test tooling: `vitest`, `@testing-library/react`, `@react-three/test-renderer` (none of these exist in the repo yet).

## Global Constraints

- Route: new `/launch` only. The live homepage (`/`) is untouched by this plan.
- Codebase: `/Users/adambutcher/Desktop/webminor/`. This repo has pre-existing uncommitted local changes (`package.json`, `globals.css`, `layout.tsx`, `page.tsx` modified; several untracked directories). Do not touch any file outside what this plan explicitly lists.
- Palette: near-black/deep-navy background; electric-blue/purple/cyan accents. Warm orange/red is reserved only for the launch-flame/smoke accent, never the rocket body or base scene color.
- Rocket material: premium brushed-chrome PBR (metalness ≥ 0.9, roughness ≤ 0.2), explicitly not cartoon, not red/orange.
- Starfield: ~1,500–2,000 points. Particle motes: not built in this phase (see Task 12 note) — deferred, not required for the approved Phase 1 scope.
- No more than 2–3 real-time lights in the scene.
- Device pixel ratio capped at 2.
- Mobile/no-WebGL2/low-`hardwareConcurrency`/narrow-viewport/`prefers-reduced-motion` → static image fallback, no live WebGL canvas.
- Canvas is `aria-hidden`; a real `<h1>` lives in the DOM copy layer; CTAs are native, keyboard-focusable `<a>` elements.
- Lenis is synced to GSAP `ScrollTrigger` via a scroll-event listener that calls `ScrollTrigger.update()`.
- Follow the existing codebase convention (see `src/components/sections/ScrollAnimations.tsx`) of dynamically `import()`-ing `gsap` and `gsap/ScrollTrigger` inside `useEffect`, not at module top level, to avoid SSR evaluation issues.

## Implementation Notes / Deliberate Simplifications

These were decided while writing this plan (not re-litigated with the user per item, but disclosed here):
- **Planet** uses a lit procedural material (no Earth texture) for Phase 1 — avoids sourcing a second external asset beyond the rocket model; a texture can be swapped in later without changing the component's interface.
- **Rocket idle "bob"** (from the spec's "gentle vertical bob") is simplified to idle rotation only, no vertical bob — keeps the scroll-progress math (Task 3) the single source of truth for the rocket's Y position, rather than layering a second independent animation on the same axis.
- **Drifting particle motes** (~200–300, separate from the starfield) described in the spec are deferred out of this Phase 1 slice — the starfield alone establishes the environment; this is a smaller cut than a full subsystem and can be added later without restructuring anything built here.

## File Structure

```
webminor/
  package.json                                   [MODIFY] add deps + test script
  vitest.config.ts                                [NEW] test runner config
  vitest.setup.ts                                 [NEW] jest-dom matchers
  public/models/rocket.glb                        [NEW] sourced asset (manual)
  public/models/ATTRIBUTION.txt                   [NEW] CC-BY attribution text
  public/images/launch-fallback.jpg               [NEW] sourced/generated asset (manual)
  src/lib/launch/capabilities.ts                  [NEW] device/motion capability detection (pure)
  src/lib/launch/capabilities.test.ts             [NEW]
  src/lib/launch/launchState.ts                   [NEW] progress (0-1) -> scene state (pure)
  src/lib/launch/launchState.test.ts              [NEW]
  src/hooks/useLenisScrollTrigger.ts               [NEW] Lenis <-> ScrollTrigger wiring
  src/hooks/useLenisScrollTrigger.test.ts          [NEW]
  src/components/launch/CopyOverlay.tsx           [NEW] DOM headline/CTA layer
  src/components/launch/CopyOverlay.test.tsx      [NEW]
  src/components/launch/FallbackHero.tsx          [NEW] static-image mobile/reduced-motion hero
  src/components/launch/FallbackHero.test.tsx      [NEW]
  src/components/launch/scene/Starfield.tsx       [NEW]
  src/components/launch/scene/Starfield.test.tsx  [NEW]
  src/components/launch/scene/Nebula.tsx          [NEW]
  src/components/launch/scene/Nebula.test.tsx      [NEW]
  src/components/launch/scene/Planet.tsx          [NEW]
  src/components/launch/scene/Planet.test.tsx      [NEW]
  src/components/launch/scene/EngineGlow.tsx      [NEW]
  src/components/launch/scene/EngineGlow.test.tsx  [NEW]
  src/components/launch/scene/Smoke.tsx           [NEW]
  src/components/launch/scene/Smoke.test.tsx       [NEW]
  src/components/launch/scene/Rocket.tsx          [NEW]
  src/components/launch/scene/Rocket.test.tsx      [NEW]
  src/components/launch/SceneContents.tsx         [NEW] per-frame progress -> scene wiring
  src/components/launch/SceneContents.test.tsx    [NEW]
  src/components/launch/Scene.tsx                 [NEW] Canvas + postprocessing wrapper
  src/components/launch/Scene.test.tsx            [NEW]
  src/components/launch/LaunchHero.tsx            [NEW] orchestrator (fallback vs 3D, ScrollTrigger)
  src/components/launch/LaunchHero.test.tsx        [NEW]
  src/components/launch/LaunchNavbar.tsx          [NEW] restyled fixed navbar for the launch route
  src/components/launch/LaunchNavbar.test.tsx      [NEW]
  src/app/launch/page.tsx                         [NEW] route entry
  src/components/layout/Header.tsx                [MODIFY] hide on /launch
  src/components/sections/VideoBackground.tsx     [MODIFY] hide/skip preload on /launch
  src/components/layout/Footer.tsx                [MODIFY] hide on /launch
  src/components/layout/WhatsAppButton.tsx         [MODIFY] hide on /launch
```

---

### Task 1: Test tooling and new dependencies

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

**Interfaces:**
- Produces: a working `npm run test` command using Vitest + jsdom + Testing Library, available to every later task.

- [ ] **Step 1: Install runtime dependencies**

Run:
```bash
cd /Users/adambutcher/Desktop/webminor
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing lenis framer-motion
```
Expected: `package.json` "dependencies" gains these six packages, install completes with no errors.

- [ ] **Step 2: Install test tooling as dev dependencies**

Run:
```bash
cd /Users/adambutcher/Desktop/webminor
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @react-three/test-renderer
```
Expected: `package.json` "devDependencies" gains these six packages.

- [ ] **Step 3: Add the test script**

Modify `package.json`'s `"scripts"` block:
```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run"
  },
```

- [ ] **Step 4: Create the Vitest config**

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
});
```

- [ ] **Step 5: Create the test setup file**

Create `vitest.setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 6: Verify the harness loads with no test files yet**

Run: `npm run test`
Expected output: Vitest starts, reports something like `No test files found` (or `0 passed`), and exits without a config/plugin error. This confirms the config, alias, and jsdom environment are wired correctly before any real test is written.

- [ ] **Step 7: Commit**

```bash
cd /Users/adambutcher/Desktop/webminor
git add package.json package-lock.json vitest.config.ts vitest.setup.ts
git commit -m "Add Vitest test tooling and R3F/GSAP/Lenis dependencies for launch hero"
```

---

### Task 2: Capability detection (`capabilities.ts`)

**Files:**
- Create: `src/lib/launch/capabilities.ts`
- Test: `src/lib/launch/capabilities.test.ts`

**Interfaces:**
- Produces: `shouldUseFallback(inputs: CapabilityInputs): boolean`, `detectCapabilities(): CapabilityInputs`, and the exported `CapabilityInputs` type — consumed by `LaunchHero.tsx` (Task 14).

- [ ] **Step 1: Write the failing tests**

Create `src/lib/launch/capabilities.test.ts`:
```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { shouldUseFallback, detectCapabilities, type CapabilityInputs } from './capabilities';

describe('shouldUseFallback', () => {
  const baseline: CapabilityInputs = {
    viewportWidth: 1440,
    hasWebGL2: true,
    hardwareConcurrency: 8,
    prefersReducedMotion: false,
  };

  it('returns false when the device is capable and motion is allowed', () => {
    expect(shouldUseFallback(baseline)).toBe(false);
  });

  it('returns true when the user prefers reduced motion, regardless of capability', () => {
    expect(shouldUseFallback({ ...baseline, prefersReducedMotion: true })).toBe(true);
  });

  it('returns true when WebGL2 is unavailable', () => {
    expect(shouldUseFallback({ ...baseline, hasWebGL2: false })).toBe(true);
  });

  it('returns true below the mobile breakpoint', () => {
    expect(shouldUseFallback({ ...baseline, viewportWidth: 480 })).toBe(true);
  });

  it('returns true when hardwareConcurrency is low but reported', () => {
    expect(shouldUseFallback({ ...baseline, hardwareConcurrency: 2 })).toBe(true);
  });

  it('does not penalise a hardwareConcurrency of 0 (unreported by the browser)', () => {
    expect(shouldUseFallback({ ...baseline, hardwareConcurrency: 0 })).toBe(false);
  });
});

describe('detectCapabilities', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      writable: true,
      configurable: true,
      value: 8,
    });
  });

  it('reads viewport width, hardware concurrency, and reduced-motion preference from the browser', () => {
    const capabilities = detectCapabilities();

    expect(capabilities.viewportWidth).toBe(window.innerWidth);
    expect(capabilities.hardwareConcurrency).toBe(8);
    expect(capabilities.prefersReducedMotion).toBe(false);
  });

  it('reports hasWebGL2 as false under jsdom, which has no WebGL support', () => {
    expect(detectCapabilities().hasWebGL2).toBe(false);
  });
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npx vitest run src/lib/launch/capabilities.test.ts`
Expected: FAIL — `Cannot find module './capabilities'` (the file doesn't exist yet).

- [ ] **Step 3: Implement `capabilities.ts`**

Create `src/lib/launch/capabilities.ts`:
```ts
export interface CapabilityInputs {
  viewportWidth: number;
  hasWebGL2: boolean;
  hardwareConcurrency: number;
  prefersReducedMotion: boolean;
}

const MOBILE_BREAKPOINT_PX = 768;
const MIN_HARDWARE_CONCURRENCY = 4;

export function shouldUseFallback(inputs: CapabilityInputs): boolean {
  if (inputs.prefersReducedMotion) return true;
  if (!inputs.hasWebGL2) return true;
  if (inputs.viewportWidth < MOBILE_BREAKPOINT_PX) return true;
  if (inputs.hardwareConcurrency > 0 && inputs.hardwareConcurrency < MIN_HARDWARE_CONCURRENCY) {
    return true;
  }
  return false;
}

function detectWebGL2Support(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!canvas.getContext('webgl2');
  } catch {
    return false;
  }
}

export function detectCapabilities(): CapabilityInputs {
  return {
    viewportWidth: window.innerWidth,
    hasWebGL2: detectWebGL2Support(),
    hardwareConcurrency: navigator.hardwareConcurrency ?? 0,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `npx vitest run src/lib/launch/capabilities.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/launch/capabilities.ts src/lib/launch/capabilities.test.ts
git commit -m "Add device/motion capability detection for launch hero fallback"
```

---

### Task 3: Launch progress state (`launchState.ts`)

**Files:**
- Create: `src/lib/launch/launchState.ts`
- Test: `src/lib/launch/launchState.test.ts`

**Interfaces:**
- Produces: `computeLaunchState(progress: number): LaunchState` and the `LaunchState` type — consumed by `SceneContents.tsx` (Task 12) and referenced as the test oracle in `SceneContents.test.tsx`.
- `LaunchState` shape: `{ rocketOffsetY: number; cameraOffsetY: number; cameraOffsetZ: number; engineGlowIntensity: number; smokeOpacity: number; smokeScale: number; starfieldStreak: number }`.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/launch/launchState.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { computeLaunchState } from './launchState';

describe('computeLaunchState', () => {
  it('is fully idle at progress 0: no rocket motion, no glow, no smoke', () => {
    const state = computeLaunchState(0);

    expect(state.rocketOffsetY).toBe(0);
    expect(state.engineGlowIntensity).toBe(0);
    expect(state.smokeOpacity).toBe(0);
    expect(state.starfieldStreak).toBe(0);
  });

  it('stays idle just before ignition begins', () => {
    const state = computeLaunchState(0.2);

    expect(state.rocketOffsetY).toBe(0);
    expect(state.engineGlowIntensity).toBe(0);
    expect(state.smokeOpacity).toBe(0);
  });

  it('ramps up engine glow and smoke during the ignition band, before liftoff', () => {
    const state = computeLaunchState(0.45);

    expect(state.engineGlowIntensity).toBeGreaterThan(0);
    expect(state.smokeOpacity).toBeGreaterThan(0);
    expect(state.rocketOffsetY).toBe(0);
  });

  it('moves the rocket and camera once past the launch threshold', () => {
    const state = computeLaunchState(0.7);

    expect(state.rocketOffsetY).toBeGreaterThan(0);
    expect(state.cameraOffsetY).toBeGreaterThan(0);
    expect(state.starfieldStreak).toBeGreaterThan(0);
  });

  it('reaches maximum offsets and full engine glow at progress 1', () => {
    const state = computeLaunchState(1);

    expect(state.rocketOffsetY).toBeCloseTo(14);
    expect(state.engineGlowIntensity).toBeCloseTo(3);
    expect(state.starfieldStreak).toBeCloseTo(1);
  });

  it('clamps out-of-range progress values into [0, 1]', () => {
    expect(computeLaunchState(-1)).toEqual(computeLaunchState(0));
    expect(computeLaunchState(2)).toEqual(computeLaunchState(1));
  });
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npx vitest run src/lib/launch/launchState.test.ts`
Expected: FAIL — `Cannot find module './launchState'`.

- [ ] **Step 3: Implement `launchState.ts`**

Create `src/lib/launch/launchState.ts`:
```ts
export interface LaunchState {
  rocketOffsetY: number;
  cameraOffsetY: number;
  cameraOffsetZ: number;
  engineGlowIntensity: number;
  smokeOpacity: number;
  smokeScale: number;
  starfieldStreak: number;
}

const IGNITION_START = 0.35;
const IGNITION_END = 0.55;
const LAUNCH_START = 0.55;

const MAX_ROCKET_OFFSET_Y = 14;
const MAX_CAMERA_OFFSET_Y = 6;
const MAX_CAMERA_OFFSET_Z = -4;
const MAX_ENGINE_GLOW_INTENSITY = 3;
const IDLE_SMOKE_SCALE = 0.5;
const MAX_SMOKE_SCALE_GAIN = 0.9;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function progressWithin(progress: number, start: number, end: number): number {
  if (end <= start) return progress >= end ? 1 : 0;
  return clamp01((progress - start) / (end - start));
}

export function computeLaunchState(progress: number): LaunchState {
  const p = clamp01(progress);
  const ignition = progressWithin(p, IGNITION_START, IGNITION_END);
  const launch = progressWithin(p, LAUNCH_START, 1);

  return {
    rocketOffsetY: launch * MAX_ROCKET_OFFSET_Y,
    cameraOffsetY: launch * MAX_CAMERA_OFFSET_Y,
    cameraOffsetZ: launch * MAX_CAMERA_OFFSET_Z,
    engineGlowIntensity: ignition * MAX_ENGINE_GLOW_INTENSITY,
    smokeOpacity: ignition,
    smokeScale: IDLE_SMOKE_SCALE + ignition * MAX_SMOKE_SCALE_GAIN,
    starfieldStreak: launch,
  };
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `npx vitest run src/lib/launch/launchState.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/launch/launchState.ts src/lib/launch/launchState.test.ts
git commit -m "Add pure scroll-progress-to-scene-state function for launch hero"
```

---

### Task 4: Lenis / ScrollTrigger sync hook

**Files:**
- Create: `src/hooks/useLenisScrollTrigger.ts`
- Test: `src/hooks/useLenisScrollTrigger.test.ts`

**Interfaces:**
- Produces: `useLenisScrollTrigger({ enabled: boolean }): void` and the exported, independently-testable `wireLenisToScrollTrigger(drivers: LenisScrollTriggerDrivers): () => void` — consumed by `LaunchHero.tsx` (Task 14).

- [ ] **Step 1: Write the failing tests**

Create `src/hooks/useLenisScrollTrigger.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest';
import { wireLenisToScrollTrigger } from './useLenisScrollTrigger';

function createFakeLenis() {
  return {
    on: vi.fn(),
    raf: vi.fn(),
    destroy: vi.fn(),
  };
}

describe('wireLenisToScrollTrigger', () => {
  it('subscribes the ScrollTrigger update callback to the Lenis scroll event', () => {
    const lenis = createFakeLenis();
    const onScrollTriggerUpdate = vi.fn();

    wireLenisToScrollTrigger({
      lenis,
      onScrollTriggerUpdate,
      requestFrame: () => 1,
      cancelFrame: vi.fn(),
    });

    expect(lenis.on).toHaveBeenCalledWith('scroll', onScrollTriggerUpdate);
  });

  it('drives the Lenis raf loop via the injected frame scheduler', () => {
    const lenis = createFakeLenis();
    let scheduled: ((time: number) => void) | undefined;
    const requestFrame = vi.fn((cb: (time: number) => void) => {
      scheduled = cb;
      return 42;
    });

    wireLenisToScrollTrigger({
      lenis,
      onScrollTriggerUpdate: vi.fn(),
      requestFrame,
      cancelFrame: vi.fn(),
    });

    expect(requestFrame).toHaveBeenCalledTimes(1);
    scheduled?.(16);
    expect(lenis.raf).toHaveBeenCalledWith(16);
    expect(requestFrame).toHaveBeenCalledTimes(2);
  });

  it('returns a cleanup function that cancels the frame and destroys Lenis', () => {
    const lenis = createFakeLenis();
    const cancelFrame = vi.fn();

    const cleanup = wireLenisToScrollTrigger({
      lenis,
      onScrollTriggerUpdate: vi.fn(),
      requestFrame: () => 7,
      cancelFrame,
    });

    cleanup();

    expect(cancelFrame).toHaveBeenCalledWith(7);
    expect(lenis.destroy).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npx vitest run src/hooks/useLenisScrollTrigger.test.ts`
Expected: FAIL — `Cannot find module './useLenisScrollTrigger'`.

- [ ] **Step 3: Implement `useLenisScrollTrigger.ts`**

Create `src/hooks/useLenisScrollTrigger.ts`:
```ts
import { useEffect } from 'react';

export interface LenisLike {
  on: (event: 'scroll', callback: () => void) => void;
  raf: (time: number) => void;
  destroy: () => void;
}

export interface LenisScrollTriggerDrivers {
  lenis: LenisLike;
  onScrollTriggerUpdate: () => void;
  requestFrame: (callback: (time: number) => void) => number;
  cancelFrame: (handle: number) => void;
}

export function wireLenisToScrollTrigger(drivers: LenisScrollTriggerDrivers): () => void {
  const { lenis, onScrollTriggerUpdate, requestFrame, cancelFrame } = drivers;

  lenis.on('scroll', onScrollTriggerUpdate);

  let rafId = requestFrame(function raf(time) {
    lenis.raf(time);
    rafId = requestFrame(raf);
  });

  return () => {
    cancelFrame(rafId);
    lenis.destroy();
  };
}

export interface UseLenisScrollTriggerOptions {
  enabled: boolean;
}

export function useLenisScrollTrigger({ enabled }: UseLenisScrollTriggerOptions): void {
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const { default: Lenis } = await import('lenis');
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;

      cleanup = wireLenisToScrollTrigger({
        lenis: new Lenis(),
        onScrollTriggerUpdate: () => ScrollTrigger.update(),
        requestFrame: (cb) => requestAnimationFrame(cb),
        cancelFrame: (id) => cancelAnimationFrame(id),
      });
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [enabled]);
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `npx vitest run src/hooks/useLenisScrollTrigger.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useLenisScrollTrigger.ts src/hooks/useLenisScrollTrigger.test.ts
git commit -m "Add Lenis/ScrollTrigger sync hook for launch hero"
```

---

### Task 5: `CopyOverlay` component

**Files:**
- Create: `src/components/launch/CopyOverlay.tsx`
- Test: `src/components/launch/CopyOverlay.test.tsx`

**Interfaces:**
- Produces: `<CopyOverlay className?: string, ...divProps />` (default export) — a DOM layer with a real `<h1>` and two keyboard-focusable CTA links. Consumed by `FallbackHero.tsx` (Task 6) and `LaunchHero.tsx` (Task 14).

- [ ] **Step 1: Write the failing test**

Create `src/components/launch/CopyOverlay.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CopyOverlay from './CopyOverlay';

describe('CopyOverlay', () => {
  it('renders a real h1 headline', () => {
    render(<CopyOverlay />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/we don't build websites/i);
    expect(heading).toHaveTextContent(/we launch businesses/i);
  });

  it('renders two keyboard-focusable CTA links', () => {
    render(<CopyOverlay />);
    const primary = screen.getByRole('link', { name: /launch your project/i });
    const secondary = screen.getByRole('link', { name: /view our work/i });

    expect(primary.tagName).toBe('A');
    expect(secondary.tagName).toBe('A');
    expect(primary).toHaveAttribute('href', '/contact');
  });

  it('forwards extra props (e.g. data attributes) to the root element', () => {
    render(<CopyOverlay data-launch-copy="" />);
    expect(document.querySelector('[data-launch-copy]')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npx vitest run src/components/launch/CopyOverlay.test.tsx`
Expected: FAIL — `Cannot find module './CopyOverlay'`.

- [ ] **Step 3: Implement `CopyOverlay.tsx`**

Create `src/components/launch/CopyOverlay.tsx`:
```tsx
import type { HTMLAttributes } from 'react';

type CopyOverlayProps = HTMLAttributes<HTMLDivElement>;

export default function CopyOverlay({ className, ...rest }: CopyOverlayProps) {
  return (
    <div
      className={`relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 text-center ${className ?? ''}`}
      {...rest}
    >
      <h1 className="font-[family-name:var(--font-sora)] text-4xl font-bold uppercase tracking-tight text-white sm:text-6xl">
        We don&apos;t build websites.
        <br />
        We launch businesses.
      </h1>
      <p className="max-w-xl text-lg text-white/70">
        Luxury digital experiences engineered for ambitious South West businesses.
      </p>
      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-4">
        <a
          href="/contact"
          className="rounded-full bg-[#40E0FF] px-8 py-3 font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-wide text-[#0B0D10] transition-transform hover:scale-105"
        >
          Launch Your Project
        </a>
        <a
          href="#about"
          className="rounded-full border border-white/20 px-8 py-3 font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-wide text-white transition-colors hover:border-[#40E0FF] hover:text-[#40E0FF]"
        >
          View Our Work
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npx vitest run src/components/launch/CopyOverlay.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/launch/CopyOverlay.tsx src/components/launch/CopyOverlay.test.tsx
git commit -m "Add CopyOverlay DOM headline/CTA layer for launch hero"
```

---

### Task 6: `FallbackHero` component

**Files:**
- Create: `src/components/launch/FallbackHero.tsx`
- Test: `src/components/launch/FallbackHero.test.tsx`

**Interfaces:**
- Consumes: `CopyOverlay` (Task 5).
- Produces: `<FallbackHero imageSrc: string />` (default export), rendering a `data-testid="fallback-hero"` section — consumed by `LaunchHero.tsx` (Task 14).

- [ ] **Step 1: Write the failing test**

Create `src/components/launch/FallbackHero.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FallbackHero from './FallbackHero';

describe('FallbackHero', () => {
  it('renders the hero section with a decorative background image', () => {
    render(<FallbackHero imageSrc="/images/launch-fallback.jpg" />);

    const section = screen.getByTestId('fallback-hero');
    expect(section).toBeInTheDocument();

    const img = section.querySelector('img');
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute('alt', '');
  });

  it('renders the CopyOverlay headline on top of the image', () => {
    render(<FallbackHero imageSrc="/images/launch-fallback.jpg" />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npx vitest run src/components/launch/FallbackHero.test.tsx`
Expected: FAIL — `Cannot find module './FallbackHero'`.

- [ ] **Step 3: Implement `FallbackHero.tsx`**

Create `src/components/launch/FallbackHero.tsx`:
```tsx
import Image from 'next/image';
import CopyOverlay from './CopyOverlay';

interface FallbackHeroProps {
  imageSrc: string;
}

export default function FallbackHero({ imageSrc }: FallbackHeroProps) {
  return (
    <section
      data-testid="fallback-hero"
      className="relative h-[100svh] w-full overflow-hidden bg-[#0B0D10]"
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B0D10]" />
      <CopyOverlay className="absolute inset-0" />
    </section>
  );
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npx vitest run src/components/launch/FallbackHero.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/launch/FallbackHero.tsx src/components/launch/FallbackHero.test.tsx
git commit -m "Add static-image FallbackHero for mobile and reduced-motion users"
```

---

### Task 7: `Starfield` scene component

**Files:**
- Create: `src/components/launch/scene/Starfield.tsx`
- Test: `src/components/launch/scene/Starfield.test.tsx`

**Interfaces:**
- Produces: `<Starfield />` (default export) and `STAR_COUNT` constant — consumed by `SceneContents.tsx` (Task 12).

- [ ] **Step 1: Write the failing test**

Create `src/components/launch/scene/Starfield.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import Starfield, { STAR_COUNT } from './Starfield';

describe('Starfield', () => {
  it('renders a points object with STAR_COUNT star positions', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Starfield />);
    const points = renderer.scene.findByProps({ name: 'starfield' });

    expect(points.instance.geometry.attributes.position.count).toBe(STAR_COUNT);
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npx vitest run src/components/launch/scene/Starfield.test.tsx`
Expected: FAIL — `Cannot find module './Starfield'`.

- [ ] **Step 3: Implement `Starfield.tsx`**

Create `src/components/launch/scene/Starfield.tsx`:
```tsx
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Points } from 'three';

export const STAR_COUNT = 1800;

function generateStarPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = 30 + Math.random() * 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  return positions;
}

export default function Starfield() {
  const pointsRef = useRef<Points>(null);
  const positions = useMemo(() => generateStarPositions(STAR_COUNT), []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.005;
    }
  });

  return (
    <points ref={pointsRef} name="starfield">
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={STAR_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#F5F7FA" sizeAttenuation transparent opacity={0.85} />
    </points>
  );
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npx vitest run src/components/launch/scene/Starfield.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/launch/scene/Starfield.tsx src/components/launch/scene/Starfield.test.tsx
git commit -m "Add Starfield scene component for launch hero"
```

---

### Task 8: `Nebula` scene component

**Files:**
- Create: `src/components/launch/scene/Nebula.tsx`
- Test: `src/components/launch/scene/Nebula.test.tsx`

**Interfaces:**
- Produces: `<Nebula />` (default export) and `NEBULA_LAYERS` constant — consumed by `SceneContents.tsx` (Task 12).

- [ ] **Step 1: Write the failing test**

Create `src/components/launch/scene/Nebula.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import Nebula, { NEBULA_LAYERS } from './Nebula';

describe('Nebula', () => {
  it('renders one sprite per configured nebula layer', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Nebula />);
    const group = renderer.scene.findByProps({ name: 'nebula' });

    expect(group.children).toHaveLength(NEBULA_LAYERS.length);
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npx vitest run src/components/launch/scene/Nebula.test.tsx`
Expected: FAIL — `Cannot find module './Nebula'`.

- [ ] **Step 3: Implement `Nebula.tsx`**

Create `src/components/launch/scene/Nebula.tsx`:
```tsx
import * as THREE from 'three';

interface NebulaLayerConfig {
  position: [number, number, number];
  scale: number;
  color: string;
  opacity: number;
}

export const NEBULA_LAYERS: NebulaLayerConfig[] = [
  { position: [-8, 2, -20], scale: 14, color: '#5B3DF0', opacity: 0.18 },
  { position: [10, -4, -25], scale: 18, color: '#2563EB', opacity: 0.14 },
  { position: [0, 6, -30], scale: 16, color: '#40E0FF', opacity: 0.1 },
];

export default function Nebula() {
  return (
    <group name="nebula">
      {NEBULA_LAYERS.map((layer, i) => (
        <sprite key={i} position={layer.position} scale={[layer.scale, layer.scale, 1]}>
          <spriteMaterial
            color={layer.color}
            opacity={layer.opacity}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npx vitest run src/components/launch/scene/Nebula.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/launch/scene/Nebula.tsx src/components/launch/scene/Nebula.test.tsx
git commit -m "Add Nebula scene component for launch hero"
```

---

### Task 9: `Planet` scene component

**Files:**
- Create: `src/components/launch/scene/Planet.tsx`
- Test: `src/components/launch/scene/Planet.test.tsx`

**Interfaces:**
- Produces: `<Planet />` (default export) — consumed by `SceneContents.tsx` (Task 12).

- [ ] **Step 1: Write the failing test**

Create `src/components/launch/scene/Planet.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import Planet from './Planet';

describe('Planet', () => {
  it('renders a sphere mesh named "planet"', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Planet />);
    const planet = renderer.scene.findByProps({ name: 'planet' });

    expect(planet.instance.geometry.type).toBe('SphereGeometry');
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npx vitest run src/components/launch/scene/Planet.test.tsx`
Expected: FAIL — `Cannot find module './Planet'`.

- [ ] **Step 3: Implement `Planet.tsx`**

Create `src/components/launch/scene/Planet.tsx`:
```tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

export default function Planet() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} name="planet" position={[0, -14, -18]}>
      <sphereGeometry args={[6, 48, 48]} />
      <meshStandardMaterial color="#1B2A4A" roughness={0.8} metalness={0.1} />
    </mesh>
  );
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npx vitest run src/components/launch/scene/Planet.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/launch/scene/Planet.tsx src/components/launch/scene/Planet.test.tsx
git commit -m "Add Planet scene component for launch hero"
```

---

### Task 10: `EngineGlow` and `Smoke` scene components

**Files:**
- Create: `src/components/launch/scene/EngineGlow.tsx`
- Create: `src/components/launch/scene/Smoke.tsx`
- Test: `src/components/launch/scene/EngineGlow.test.tsx`
- Test: `src/components/launch/scene/Smoke.test.tsx`

**Interfaces:**
- Produces: `<EngineGlow ref />` (forwardRef to a `PointLight`) and `<Smoke ref />` (forwardRef to a `Group`) — both consumed by `SceneContents.tsx` (Task 12), which mutates their `.intensity` / `.scale` / sprite `.material.opacity` every frame via `computeLaunchState` (Task 3).
- Both start in the idle state (`computeLaunchState(0)`): glow intensity `0`, smoke scale `0.5`, smoke opacity `0` — these initial values must match `launchState.ts`'s constants exactly, since `SceneContents.test.tsx` checks both against the same oracle.

- [ ] **Step 1: Write the failing tests**

Create `src/components/launch/scene/EngineGlow.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import * as React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import EngineGlow from './EngineGlow';

describe('EngineGlow', () => {
  it('renders a point light named "engine-glow" starting at zero intensity', async () => {
    const ref = React.createRef<import('three').PointLight>();
    const renderer = await ReactThreeTestRenderer.create(<EngineGlow ref={ref} />);
    const glow = renderer.scene.findByProps({ name: 'engine-glow' });

    expect(glow.instance.intensity).toBe(0);
    expect(ref.current).toBe(glow.instance);
  });
});
```

Create `src/components/launch/scene/Smoke.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import * as React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import Smoke from './Smoke';

describe('Smoke', () => {
  it('renders a group named "smoke" with two sprite plumes, starting hidden', async () => {
    const ref = React.createRef<import('three').Group>();
    const renderer = await ReactThreeTestRenderer.create(<Smoke ref={ref} />);
    const smoke = renderer.scene.findByProps({ name: 'smoke' });

    expect(smoke.children).toHaveLength(2);
    expect(smoke.instance.scale.x).toBeCloseTo(0.5);
    expect(ref.current).toBe(smoke.instance);

    for (const child of smoke.children) {
      const material = (child.instance as unknown as { material: { opacity: number } }).material;
      expect(material.opacity).toBe(0);
    }
  });
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npx vitest run src/components/launch/scene/EngineGlow.test.tsx src/components/launch/scene/Smoke.test.tsx`
Expected: FAIL — `Cannot find module './EngineGlow'` / `Cannot find module './Smoke'`.

- [ ] **Step 3: Implement `EngineGlow.tsx`**

Create `src/components/launch/scene/EngineGlow.tsx`:
```tsx
import { forwardRef } from 'react';
import type { PointLight } from 'three';

const EngineGlow = forwardRef<PointLight>(function EngineGlow(_props, ref) {
  return (
    <pointLight
      ref={ref}
      name="engine-glow"
      position={[0, -3.4, 0]}
      color="#FF8A3D"
      intensity={0}
      distance={6}
    />
  );
});

export default EngineGlow;
```

- [ ] **Step 4: Implement `Smoke.tsx`**

Create `src/components/launch/scene/Smoke.tsx`:
```tsx
import { forwardRef } from 'react';
import type { Group } from 'three';

const Smoke = forwardRef<Group>(function Smoke(_props, ref) {
  return (
    <group ref={ref} name="smoke" position={[0, -4, 0]} scale={0.5}>
      <sprite scale={[3, 3, 1]}>
        <spriteMaterial color="#FF8A3D" opacity={0} transparent depthWrite={false} />
      </sprite>
      <sprite position={[1, -0.4, 0]} scale={[2.2, 2.2, 1]}>
        <spriteMaterial color="#FFC98A" opacity={0} transparent depthWrite={false} />
      </sprite>
    </group>
  );
});

export default Smoke;
```

- [ ] **Step 5: Run the tests and confirm they pass**

Run: `npx vitest run src/components/launch/scene/EngineGlow.test.tsx src/components/launch/scene/Smoke.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/launch/scene/EngineGlow.tsx src/components/launch/scene/EngineGlow.test.tsx src/components/launch/scene/Smoke.tsx src/components/launch/scene/Smoke.test.tsx
git commit -m "Add EngineGlow and Smoke scene components for launch hero"
```

---

### Task 11: `Rocket` scene component

**Files:**
- Create: `src/components/launch/scene/Rocket.tsx`
- Test: `src/components/launch/scene/Rocket.test.tsx`

**Interfaces:**
- Produces: `<Rocket ref />` (default export, forwardRef to a `Group`), `applyChromeMaterial(root: Object3D): void`, and `ROCKET_MODEL_PATH` constant — consumed by `SceneContents.tsx` (Task 12).
- Consumes: `public/models/rocket.glb`, sourced in Task 17 (not required to exist for this task's tests — `useGLTF` is mocked here).

- [ ] **Step 1: Write the failing tests**

Create `src/components/launch/scene/Rocket.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';
import * as THREE from 'three';
import ReactThreeTestRenderer from '@react-three/test-renderer';

function createFakeGltfScene(): THREE.Group {
  const group = new THREE.Group();
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
  group.add(mesh);
  return group;
}

const fakeGltfScene = createFakeGltfScene();

vi.mock('@react-three/drei', () => ({
  useGLTF: Object.assign(vi.fn(() => ({ scene: fakeGltfScene })), { preload: vi.fn() }),
}));

const { default: Rocket, applyChromeMaterial } = await import('./Rocket');

describe('applyChromeMaterial', () => {
  it('replaces every mesh material with a high-metalness, low-roughness standard material', () => {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: 'red' }));
    group.add(mesh);

    applyChromeMaterial(group);

    const material = mesh.material as THREE.MeshStandardMaterial;
    expect(material).toBeInstanceOf(THREE.MeshStandardMaterial);
    expect(material.metalness).toBeGreaterThanOrEqual(0.9);
    expect(material.roughness).toBeLessThanOrEqual(0.2);
  });
});

describe('Rocket', () => {
  it('applies the chrome material to the loaded GLTF scene and forwards its ref', async () => {
    const ref = React.createRef<THREE.Group>();
    await ReactThreeTestRenderer.create(<Rocket ref={ref} />);

    expect(ref.current).toBe(fakeGltfScene);
    const mesh = fakeGltfScene.children[0] as THREE.Mesh;
    expect(mesh.material).toBeInstanceOf(THREE.MeshStandardMaterial);
  });
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npx vitest run src/components/launch/scene/Rocket.test.tsx`
Expected: FAIL — `Cannot find module './Rocket'`.

- [ ] **Step 3: Implement `Rocket.tsx`**

Create `src/components/launch/scene/Rocket.tsx`:
```tsx
import { forwardRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const ROCKET_MODEL_PATH = '/models/rocket.glb';

export function applyChromeMaterial(root: THREE.Object3D): void {
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: '#C9D3DC',
        metalness: 0.9,
        roughness: 0.2,
        envMapIntensity: 1.2,
      });
    }
  });
}

interface RocketProps {
  modelPath?: string;
}

const Rocket = forwardRef<THREE.Group, RocketProps>(function Rocket(
  { modelPath = ROCKET_MODEL_PATH },
  ref
) {
  const { scene } = useGLTF(modelPath) as unknown as { scene: THREE.Group };

  useEffect(() => {
    applyChromeMaterial(scene);
  }, [scene]);

  return <primitive ref={ref} object={scene} name="rocket" />;
});

export default Rocket;

useGLTF.preload(ROCKET_MODEL_PATH);
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `npx vitest run src/components/launch/scene/Rocket.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/launch/scene/Rocket.tsx src/components/launch/scene/Rocket.test.tsx
git commit -m "Add Rocket scene component with chrome material override"
```

---

### Task 12: `SceneContents` composition

**Files:**
- Create: `src/components/launch/SceneContents.tsx`
- Test: `src/components/launch/SceneContents.test.tsx`

**Interfaces:**
- Consumes: `Starfield` (Task 7), `Nebula` (Task 8), `Planet` (Task 9), `EngineGlow`/`Smoke` (Task 10), `Rocket` (Task 11), `computeLaunchState` (Task 3).
- Produces: `<SceneContents progressRef: RefObject<{ value: number }> />` (default export) and `BASE_CAMERA_Z` constant — consumed by `Scene.tsx` (Task 13).

- [ ] **Step 1: Write the failing test**

Create `src/components/launch/SceneContents.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { computeLaunchState } from '@/lib/launch/launchState';

vi.mock('./scene/Rocket', () => ({
  default: React.forwardRef(function RocketStub(_props: unknown, ref: React.Ref<import('three').Group>) {
    return <group ref={ref} name="rocket" />;
  }),
}));

const { default: SceneContents } = await import('./SceneContents');

describe('SceneContents', () => {
  it('drives rocket position, engine glow intensity, and smoke scale from progressRef via computeLaunchState', async () => {
    const progressRef = { current: { value: 0 } };
    const renderer = await ReactThreeTestRenderer.create(<SceneContents progressRef={progressRef} />);

    progressRef.current.value = 1;
    await renderer.advanceFrames(2, 1);

    const expected = computeLaunchState(1);

    const rocket = renderer.scene.findByProps({ name: 'rocket' });
    expect(rocket.instance.position.y).toBeCloseTo(expected.rocketOffsetY);

    const engineGlow = renderer.scene.findByProps({ name: 'engine-glow' });
    expect(engineGlow.instance.intensity).toBeCloseTo(expected.engineGlowIntensity);

    const smoke = renderer.scene.findByProps({ name: 'smoke' });
    expect(smoke.instance.scale.x).toBeCloseTo(expected.smokeScale);
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npx vitest run src/components/launch/SceneContents.test.tsx`
Expected: FAIL — `Cannot find module './SceneContents'`.

- [ ] **Step 3: Implement `SceneContents.tsx`**

Create `src/components/launch/SceneContents.tsx`:
```tsx
import { useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { Group, PointLight, Sprite, SpriteMaterial } from 'three';
import { computeLaunchState } from '@/lib/launch/launchState';
import Starfield from './scene/Starfield';
import Nebula from './scene/Nebula';
import Planet from './scene/Planet';
import EngineGlow from './scene/EngineGlow';
import Smoke from './scene/Smoke';
import Rocket from './scene/Rocket';

export const BASE_CAMERA_Z = 12;

interface SceneContentsProps {
  progressRef: RefObject<{ value: number }>;
}

export default function SceneContents({ progressRef }: SceneContentsProps) {
  const { camera } = useThree();
  const rocketRef = useRef<Group>(null);
  const engineGlowRef = useRef<PointLight>(null);
  const smokeRef = useRef<Group>(null);

  useFrame((_, delta) => {
    const state = computeLaunchState(progressRef.current?.value ?? 0);

    if (rocketRef.current) {
      rocketRef.current.rotation.y += delta * 0.1;
      rocketRef.current.position.y = state.rocketOffsetY;
    }

    if (engineGlowRef.current) {
      engineGlowRef.current.intensity = state.engineGlowIntensity;
    }

    if (smokeRef.current) {
      smokeRef.current.scale.setScalar(state.smokeScale);
      for (const child of smokeRef.current.children) {
        const sprite = child as Sprite;
        const material = sprite.material as SpriteMaterial;
        material.opacity = state.smokeOpacity;
      }
    }

    camera.position.y = state.cameraOffsetY;
    camera.position.z = BASE_CAMERA_Z + state.cameraOffsetZ;
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} color="#DCEBFF" />
      <Starfield />
      <Nebula />
      <Planet />
      <EngineGlow ref={engineGlowRef} />
      <Smoke ref={smokeRef} />
      <Rocket ref={rocketRef} />
    </>
  );
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npx vitest run src/components/launch/SceneContents.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/launch/SceneContents.tsx src/components/launch/SceneContents.test.tsx
git commit -m "Add SceneContents composition driving the scene from launch progress"
```

---

### Task 13: `Scene` Canvas wrapper

**Files:**
- Create: `src/components/launch/Scene.tsx`
- Test: `src/components/launch/Scene.test.tsx`

**Interfaces:**
- Consumes: `SceneContents` (Task 12).
- Produces: `<Scene progressRef: RefObject<{ value: number }> />` (default export) — consumed by `LaunchHero.tsx` (Task 14).

- [ ] **Step 1: Write the failing test**

Create `src/components/launch/Scene.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';

vi.mock('@react-three/postprocessing', () => ({
  EffectComposer: ({ children }: { children?: ReactNode }) => <>{children}</>,
  Bloom: () => null,
}));

const sceneContentsSpy = vi.fn(() => null);
vi.mock('./SceneContents', () => ({
  default: (props: unknown) => sceneContentsSpy(props),
}));

const { default: Scene } = await import('./Scene');

describe('Scene', () => {
  it('renders SceneContents inside the Canvas with the given progressRef', async () => {
    const progressRef = { current: { value: 0 } };
    await ReactThreeTestRenderer.create(<Scene progressRef={progressRef} />);

    expect(sceneContentsSpy).toHaveBeenCalledWith(expect.objectContaining({ progressRef }));
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npx vitest run src/components/launch/Scene.test.tsx`
Expected: FAIL — `Cannot find module './Scene'`.

- [ ] **Step 3: Implement `Scene.tsx`**

Create `src/components/launch/Scene.tsx`:
```tsx
import { Suspense, type RefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import SceneContents, { BASE_CAMERA_Z } from './SceneContents';

export const MAX_DPR = 2;

interface SceneProps {
  progressRef: RefObject<{ value: number }>;
}

export default function Scene({ progressRef }: SceneProps) {
  return (
    <Canvas
      dpr={[1, MAX_DPR]}
      camera={{ position: [0, 0, BASE_CAMERA_Z], fov: 45 }}
      gl={{ antialias: true }}
    >
      <Suspense fallback={null}>
        <SceneContents progressRef={progressRef} />
      </Suspense>
      <EffectComposer>
        <Bloom intensity={0.6} luminanceThreshold={0.4} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npx vitest run src/components/launch/Scene.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/launch/Scene.tsx src/components/launch/Scene.test.tsx
git commit -m "Add Scene Canvas wrapper with bloom postprocessing"
```

---

### Task 14: `LaunchHero` orchestrator

**Files:**
- Create: `src/components/launch/LaunchHero.tsx`
- Test: `src/components/launch/LaunchHero.test.tsx`

**Interfaces:**
- Consumes: `detectCapabilities`/`shouldUseFallback` (Task 2), `useLenisScrollTrigger` (Task 4), `CopyOverlay` (Task 5), `FallbackHero` (Task 6), `Scene` (Task 13).
- Produces: `<LaunchHero />` (default export, no props) and `FALLBACK_IMAGE_SRC` constant — consumed by `src/app/launch/page.tsx` (Task 18).

- [ ] **Step 1: Write the failing tests**

Create `src/components/launch/LaunchHero.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const mockShouldUseFallback = vi.fn();
vi.mock('@/lib/launch/capabilities', () => ({
  detectCapabilities: () => ({
    viewportWidth: 1440,
    hasWebGL2: true,
    hardwareConcurrency: 8,
    prefersReducedMotion: false,
  }),
  shouldUseFallback: (...args: unknown[]) => mockShouldUseFallback(...args),
}));

vi.mock('./Scene', () => ({
  default: () => <div data-testid="scene-stub" />,
}));

vi.mock('@/hooks/useLenisScrollTrigger', () => ({
  useLenisScrollTrigger: vi.fn(),
}));

const mockScrollTriggerCreate = vi.fn(() => ({ kill: vi.fn() }));
const mockGsapTo = vi.fn(() => ({ kill: vi.fn(), scrollTrigger: null }));
vi.mock('gsap', () => ({
  gsap: { registerPlugin: vi.fn(), to: mockGsapTo },
}));
vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { create: mockScrollTriggerCreate },
}));

const { default: LaunchHero } = await import('./LaunchHero');
const { useLenisScrollTrigger } = await import('@/hooks/useLenisScrollTrigger');

describe('LaunchHero', () => {
  beforeEach(() => {
    mockShouldUseFallback.mockReset();
    mockScrollTriggerCreate.mockClear();
  });

  it('renders the FallbackHero and skips ScrollTrigger when shouldUseFallback is true', async () => {
    mockShouldUseFallback.mockReturnValue(true);
    render(<LaunchHero />);

    await waitFor(() => {
      expect(screen.getByTestId('fallback-hero')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('scene-stub')).not.toBeInTheDocument();
    expect(useLenisScrollTrigger).toHaveBeenCalledWith({ enabled: false });
    expect(mockScrollTriggerCreate).not.toHaveBeenCalled();
  });

  it('renders the 3D Scene and wires a pinned, scrubbed ScrollTrigger when shouldUseFallback is false', async () => {
    mockShouldUseFallback.mockReturnValue(false);
    render(<LaunchHero />);

    await waitFor(() => {
      expect(screen.getByTestId('scene-stub')).toBeInTheDocument();
    });
    expect(useLenisScrollTrigger).toHaveBeenCalledWith({ enabled: true });
    await waitFor(() => {
      expect(mockScrollTriggerCreate).toHaveBeenCalledWith(
        expect.objectContaining({ pin: true, scrub: true })
      );
    });
  });
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npx vitest run src/components/launch/LaunchHero.test.tsx`
Expected: FAIL — `Cannot find module './LaunchHero'`.

- [ ] **Step 3: Implement `LaunchHero.tsx`**

Create `src/components/launch/LaunchHero.tsx`:
```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Scene from './Scene';
import FallbackHero from './FallbackHero';
import CopyOverlay from './CopyOverlay';
import { detectCapabilities, shouldUseFallback } from '@/lib/launch/capabilities';
import { useLenisScrollTrigger } from '@/hooks/useLenisScrollTrigger';

export const FALLBACK_IMAGE_SRC = '/images/launch-fallback.jpg';

interface Killable {
  kill: () => void;
}

export default function LaunchHero() {
  const [useFallback, setUseFallback] = useState<boolean | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef({ value: 0 });

  useEffect(() => {
    setUseFallback(shouldUseFallback(detectCapabilities()));
  }, []);

  useLenisScrollTrigger({ enabled: useFallback === false });

  useEffect(() => {
    if (useFallback !== false || !sectionRef.current) return;

    let cancelled = false;
    let scrollTrigger: Killable | undefined;
    let copyTween: (Killable & { scrollTrigger?: Killable | null }) | undefined;

    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled || !sectionRef.current) return;

      scrollTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: true,
        onUpdate: (self: { progress: number }) => {
          progressRef.current.value = self.progress;
        },
      });

      copyTween = gsap.to('[data-launch-copy]', {
        opacity: 0,
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '35% top',
          scrub: true,
        },
      });
    })();

    return () => {
      cancelled = true;
      scrollTrigger?.kill();
      copyTween?.scrollTrigger?.kill();
      copyTween?.kill();
    };
  }, [useFallback]);

  if (useFallback === null) {
    return null;
  }

  if (useFallback) {
    return <FallbackHero imageSrc={FALLBACK_IMAGE_SRC} />;
  }

  return (
    <section ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden bg-[#0B0D10]">
      <Scene progressRef={progressRef} />
      <CopyOverlay className="pointer-events-none absolute inset-0" data-launch-copy="" />
    </section>
  );
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `npx vitest run src/components/launch/LaunchHero.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Run the full test suite**

Run: `npm run test`
Expected: All test files pass (Tasks 2–14's suites).

- [ ] **Step 6: Commit**

```bash
git add src/components/launch/LaunchHero.tsx src/components/launch/LaunchHero.test.tsx
git commit -m "Add LaunchHero orchestrator wiring fallback detection and ScrollTrigger"
```

---

### Task 15: `LaunchNavbar` component

**Files:**
- Create: `src/components/launch/LaunchNavbar.tsx`
- Test: `src/components/launch/LaunchNavbar.test.tsx`

**Interfaces:**
- Produces: `<LaunchNavbar />` (default export, no props) — consumed by `src/app/launch/page.tsx` (Task 18). Replaces the current site's `Header` on the `/launch` route (which Task 16 hides), per the spec's "Fixed navbar (restyled from current site's navbar)" requirement.

- [ ] **Step 1: Write the failing test**

Create `src/components/launch/LaunchNavbar.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LaunchNavbar from './LaunchNavbar';

describe('LaunchNavbar', () => {
  it('renders the WebMinor logo link and a contact CTA', () => {
    render(<LaunchNavbar />);

    expect(screen.getByRole('link', { name: /webminor/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute('href', '/contact');
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npx vitest run src/components/launch/LaunchNavbar.test.tsx`
Expected: FAIL — `Cannot find module './LaunchNavbar'`.

- [ ] **Step 3: Implement `LaunchNavbar.tsx`**

Create `src/components/launch/LaunchNavbar.tsx`:
```tsx
import Link from 'next/link';

export default function LaunchNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10">
      <Link href="/" className="font-[family-name:var(--font-sora)] text-lg font-bold text-white">
        Web<span className="text-[#40E0FF]">Minor</span>
      </Link>
      <Link
        href="/contact"
        className="rounded-full border border-white/20 px-5 py-2 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-wide text-white transition-colors hover:border-[#40E0FF] hover:text-[#40E0FF]"
      >
        Get In Touch
      </Link>
    </nav>
  );
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `npx vitest run src/components/launch/LaunchNavbar.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/launch/LaunchNavbar.tsx src/components/launch/LaunchNavbar.test.tsx
git commit -m "Add restyled fixed navbar for the launch route"
```

---

### Task 16: Hide shared site chrome on `/launch`

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/sections/VideoBackground.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/layout/WhatsAppButton.tsx`

**Interfaces:**
- No new exports. Each component gains a `usePathname()`-based guard so it renders nothing on `/launch`, since `LaunchHero` (Task 14) needs the full viewport and its own navbar/visuals without the current homepage's header, video background, footer, or WhatsApp button behind it.

This task is small mechanical edits to existing files, verified manually (no unit test — these are route-level rendering decisions best confirmed visually in Task 18's manual QA pass).

- [ ] **Step 1: Guard `Header.tsx`**

Modify `src/components/layout/Header.tsx` — add the import and the guard, right after existing imports and right before the final `return`:
```tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Phone, Menu } from 'lucide-react';
import MobileNav from './MobileNav';
```
And inside `export default function Header() { ... }`, add `const pathname = usePathname();` as the first line of the function body, and immediately before the existing `return (` statement add:
```tsx
  if (pathname?.startsWith('/launch')) {
    return null;
  }

  return (
```

- [ ] **Step 2: Guard `VideoBackground.tsx`**

Modify `src/components/sections/VideoBackground.tsx` — add the import, call the hook, and skip both the effect's work and the render when on `/launch` (this also avoids wastefully preloading its 240 frame images on the preview route):
```tsx
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
```
Inside `export default function VideoBackground() { ... }`, add `const pathname = usePathname();` as the first line, change the effect to bail out early:
```tsx
  useEffect(() => {
    if (pathname?.startsWith('/launch')) return;
    const canvas = canvasRef.current;
```
(the rest of the effect body is unchanged), and immediately before the existing `return (` statement add:
```tsx
  if (pathname?.startsWith('/launch')) {
    return null;
  }

  return (
```

- [ ] **Step 3: Guard `Footer.tsx`**

Modify `src/components/layout/Footer.tsx` — this file is currently a server component; convert it to a client component so it can read the pathname:
```tsx
'use client';

import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
```
Change:
```tsx
export default function Footer() {
  return (
```
to:
```tsx
export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/launch')) {
    return null;
  }

  return (
```

- [ ] **Step 4: Guard `WhatsAppButton.tsx`**

Modify `src/components/layout/WhatsAppButton.tsx`:
```tsx
'use client';

import { usePathname } from 'next/navigation';

export default function WhatsAppButton() {
  const pathname = usePathname();

  if (pathname?.startsWith('/launch')) {
    return null;
  }

  return (
    <a
```
(the rest of the file is unchanged).

- [ ] **Step 5: Run the full test suite to confirm nothing broke**

Run: `npm run test`
Expected: All existing tests still pass (these four files have no dedicated tests, so this confirms no import/syntax errors were introduced).

- [ ] **Step 6: Run the linter**

Run: `npm run lint`
Expected: No new errors in the four modified files.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/Header.tsx src/components/sections/VideoBackground.tsx src/components/layout/Footer.tsx src/components/layout/WhatsAppButton.tsx
git commit -m "Hide shared header, footer, video background, and WhatsApp button on /launch"
```

---

### Task 17: Rocket asset, fallback image, and the `/launch` route

**Files:**
- Create: `public/models/rocket.glb` (manual download)
- Create: `public/models/ATTRIBUTION.txt`
- Create: `public/images/launch-fallback.jpg` (manual/AI-generated)
- Create: `src/app/launch/page.tsx`

**Interfaces:**
- Consumes: `LaunchHero` (Task 14), `LaunchNavbar` (Task 15), `ROCKET_MODEL_PATH` (Task 11, must match where the file is saved), `FALLBACK_IMAGE_SRC` (Task 14, must match where the image is saved).

- [ ] **Step 1: Source the rocket model**

Go to `https://poly.pizza/m/bdMY5H0ds2T` ("SpaceX Falcon Heavy" by Carwyn Pelley, licensed CC-BY 3.0). Click Download, choose the GLB/GLTF format, and save the file as:
```
/Users/adambutcher/Desktop/webminor/public/models/rocket.glb
```
Verify the path matches `ROCKET_MODEL_PATH` in `src/components/launch/scene/Rocket.tsx` (`/models/rocket.glb`) exactly.

- [ ] **Step 2: Record the attribution**

Create `public/models/ATTRIBUTION.txt`:
```
rocket.glb
"SpaceX Falcon Heavy" by Carwyn Pelley
Source: https://poly.pizza/m/bdMY5H0ds2T
License: CC-BY 3.0 (https://creativecommons.org/licenses/by/3.0/)
Used in the WebMinor cinematic launch hero (docs/superpowers/specs/2026-07-05-cinematic-launch-hero-design.md).
```

- [ ] **Step 3: Source the fallback hero image**

Generate (or otherwise source, license-clear) a single hero image matching the desktop 3D scene's look, using this prompt (from the master creative brief's own image-placeholder guidance):

> Ultra-realistic chrome rocket in deep space with cinematic lighting, near-black background with deep navy and electric blue and violet nebula clouds, brushed metal chrome rocket body catching a cool blue rim light, no red or orange tones except a small warm engine glow at the base, photorealistic 8K quality, dramatic lighting, luxury premium aesthetic, portrait or landscape orientation suitable for a full-viewport mobile hero background.

Save the result as:
```
/Users/adambutcher/Desktop/webminor/public/images/launch-fallback.jpg
```
Verify the path matches `FALLBACK_IMAGE_SRC` in `src/components/launch/LaunchHero.tsx` (`/images/launch-fallback.jpg`) exactly. Keep the file under ~300KB (compress/resize as needed) since this is the mobile-performance-critical path.

- [ ] **Step 4: Create the `/launch` page**

Create `src/app/launch/page.tsx`:
```tsx
import type { Metadata } from 'next';
import LaunchNavbar from '@/components/launch/LaunchNavbar';
import LaunchHero from '@/components/launch/LaunchHero';

export const metadata: Metadata = {
  title: 'Launch Preview',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LaunchPage() {
  return (
    <main>
      <LaunchNavbar />
      <LaunchHero />
      <section
        id="about"
        className="flex min-h-[60vh] items-center justify-center bg-[#0B0D10] px-6 text-center text-white"
      >
        <p className="max-w-xl text-lg text-white/70">
          Orbit / About section placeholder — full content arrives in a later phase.
        </p>
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Commit**

```bash
cd /Users/adambutcher/Desktop/webminor
git add public/models/rocket.glb public/models/ATTRIBUTION.txt public/images/launch-fallback.jpg src/app/launch/page.tsx
git commit -m "Add rocket model, fallback hero image, and /launch route"
```

---

### Task 18: Manual verification and Lighthouse pass

**Files:** none (verification only).

**Interfaces:** N/A — this task confirms the assembled feature behaves as designed end-to-end, in ways the unit tests in Tasks 2–14 cannot (they test units in isolation with mocked GLTF/DOM/GSAP; this task exercises the real, integrated browser experience).

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: Server starts on `http://localhost:3000` with no build errors.

- [ ] **Step 2: Verify the idle hero**

Open `http://localhost:3000/launch` in a desktop browser window. Expected: full-viewport dark scene with visible starfield, nebula glow, a chrome rocket, and the "We don't build websites. We launch businesses." headline with two CTA buttons. No current-site header, footer, or WhatsApp button should be visible.

- [ ] **Step 3: Verify the scroll-scrub launch sequence**

Scroll down slowly. Expected: copy fades out first, then (roughly a third of the way through the pinned scroll range) the engine glow and smoke ramp up, then the rocket and camera move together as if launching, and scrolling back up reverses the whole sequence smoothly. The page should release from the pin and continue to the "Orbit / About section placeholder" text afterward.

- [ ] **Step 4: Verify the mobile fallback**

Open Chrome DevTools, toggle device toolbar to a phone-width viewport (e.g. 390×844), reload `/launch`. Expected: the static fallback image renders (no WebGL canvas), with the same headline/CTA copy on top, and no console errors.

- [ ] **Step 5: Verify reduced motion**

In DevTools, open the Rendering tab and set "Emulate CSS media feature prefers-reduced-motion" to `reduce`, reload `/launch` at a desktop viewport width. Expected: the static fallback image renders instead of the live 3D scene (per `shouldUseFallback`'s reduced-motion check), with no forced scroll-jacking.

- [ ] **Step 6: Run Lighthouse**

In DevTools, run a Lighthouse report against `/launch` for both "Desktop" and "Mobile" device modes. Record the Performance score for each. If the live-3D desktop path scores meaningfully below 95, note the gap and flag it back for a conscious trade-off decision (e.g. reducing bloom quality or star count) rather than silently shipping a worse score than the spec's target.

- [ ] **Step 7: Confirm the existing homepage is unaffected**

Open `http://localhost:3000/` and confirm the current homepage (header, video background, footer, WhatsApp button, existing sections) still renders exactly as before — this route was never touched by this plan.

- [ ] **Step 8: Report results**

Summarize, in plain language: what worked, what (if anything) looked wrong, and the actual Lighthouse scores from Step 6 — so a decision can be made about moving this from `/launch` to the real homepage in a later phase.
