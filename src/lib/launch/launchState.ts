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
