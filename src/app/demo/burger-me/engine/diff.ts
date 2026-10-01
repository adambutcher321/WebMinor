import type { LayerSpec } from "./burgers";

export type Change = "unchanged" | "entering" | "exiting" | "moved";

/* Compare two recipes by persistent layer id. Shared ids keep their DOM node
   and only glide to their new height; "moved" means their order relative to
   the other shared layers changed. */
export function diffStacks(prev: LayerSpec[], next: LayerSpec[]): Map<string, Change> {
  const out = new Map<string, Change>();
  const prevIds = prev.map((l) => l.id);
  const nextIds = next.map((l) => l.id);
  const shared = new Set(prevIds.filter((id) => nextIds.includes(id)));
  const prevOrder = prevIds.filter((id) => shared.has(id));
  const nextOrder = nextIds.filter((id) => shared.has(id));
  for (const id of nextIds) {
    if (!shared.has(id)) out.set(id, "entering");
    else out.set(id, prevOrder.indexOf(id) === nextOrder.indexOf(id) ? "unchanged" : "moved");
  }
  for (const id of prevIds) if (!shared.has(id)) out.set(id, "exiting");
  return out;
}
