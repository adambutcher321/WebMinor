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
