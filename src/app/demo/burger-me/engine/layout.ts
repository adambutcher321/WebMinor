import { INGREDIENTS, type IngredientType } from "./ingredients";
import type { LayerSpec } from "./burgers";
import { seeded, smoothstep } from "./motion";

export interface Placed {
  id: string; type: IngredientType;
  /** 0 = bottom layer. */
  index: number;
  /** Units (top bun width = 1000). y is the layer's bottom edge, upward from the base. */
  x: number; y: number; z: number;
  /** Degrees. */
  rx: number; ry: number; rz: number;
  /** Contact-shadow strength 0–1 under this layer. */
  shadow: number;
}

export interface LayoutOpts {
  /** Extra space added between neighbours when fully exploded (units). */
  gap: number;
  /** Max depth travel toward/away from camera when exploded (units). */
  depth: number;
  /** Max per-ingredient rotation when exploded (degrees). */
  maxRot: number;
}

type Dims = Record<string, { h: number; seat: number; cx: number; depth: number }>;

export function layoutStack(stack: LayerSpec[], explode: number, opts: LayoutOpts, dims: Dims = INGREDIENTS): Placed[] {
  const e = Math.min(1, Math.max(0, explode));
  const bottomUp = [...stack].reverse();
  const out: Placed[] = [];
  let y = 0;
  bottomUp.forEach((layer, index) => {
    const d = dims[layer.type];
    if (index > 0) {
      const below = dims[bottomUp[index - 1].type];
      y = y + below.h - d.seat;
    }
    const lift = index * opts.gap * e;
    out.push({
      id: layer.id, type: layer.type, index,
      x: d.cx,
      y: y + lift,
      z: (d.depth - 0.5) * 2 * opts.depth * e,
      rx: seeded(layer.id, "rx") * opts.maxRot * 0.6 * e,
      ry: seeded(layer.id, "ry") * opts.maxRot * 0.6 * e,
      rz: seeded(layer.id, "rz") * opts.maxRot * e,
      shadow: index === 0 ? 1 : 1 - smoothstep(0, 0.6, e),
    });
  });
  return out.reverse();
}

/** Height of the whole stack (units), for fitting it into a stage. */
export function stackHeight(stack: LayerSpec[], explode: number, opts: LayoutOpts, dims: Dims = INGREDIENTS): number {
  const placed = layoutStack(stack, explode, opts, dims);
  return Math.max(...placed.map((p) => p.y + dims[p.type].h));
}
