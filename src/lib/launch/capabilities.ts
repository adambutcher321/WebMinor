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
