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

  it('reaches peak glow at the exact boundary where ignition ends and launch begins', () => {
    const state = computeLaunchState(0.55);

    expect(state.engineGlowIntensity).toBeCloseTo(3);
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
