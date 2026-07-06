import { describe, it, expect } from 'vitest';
import { computeTelemetry } from './telemetry';

describe('computeTelemetry', () => {
  it('starts at T-minus zero on the pad', () => {
    const t = computeTelemetry(0);

    expect(t.clock).toBe('T+ 00:00');
    expect(t.altitude).toBe('ALT 000 KM');
    expect(t.velocity).toBe('VEL 0000 KM/H');
  });

  it('reads mid-flight values halfway through the scrub', () => {
    const t = computeTelemetry(0.5);

    expect(t.clock).toBe('T+ 00:05');
    expect(t.altitude).toMatch(/^ALT \d{3} KM$/);
    expect(t.altitude).not.toBe('ALT 000 KM');
  });

  it('tops out at max-Q at progress 1', () => {
    const t = computeTelemetry(1);

    expect(t.clock).toBe('T+ 00:11');
    expect(t.altitude).toBe('ALT 100 KM');
    expect(t.velocity).toBe('VEL 3600 KM/H');
  });

  it('clamps out-of-range progress', () => {
    expect(computeTelemetry(-1)).toEqual(computeTelemetry(0));
    expect(computeTelemetry(2)).toEqual(computeTelemetry(1));
  });
});
