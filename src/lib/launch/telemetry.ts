export interface Telemetry {
  clock: string;
  altitude: string;
  velocity: string;
}

const FILM_DURATION_S = 10.6;
const MAX_ALTITUDE_KM = 100;
const MAX_VELOCITY_KMH = 3600;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function computeTelemetry(progress: number): Telemetry {
  const p = clamp01(progress);
  const seconds = Math.round(p * FILM_DURATION_S);
  // Altitude accelerates like a real ascent — slow off the pad, fast up top.
  const altitudeKm = Math.round(p * p * MAX_ALTITUDE_KM);
  const velocityKmh = Math.round(p * MAX_VELOCITY_KMH);

  return {
    clock: `T+ 00:${String(seconds).padStart(2, '0')}`,
    altitude: `ALT ${String(altitudeKm).padStart(3, '0')} KM`,
    velocity: `VEL ${String(velocityKmh).padStart(4, '0')} KM/H`,
  };
}
