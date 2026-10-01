/* The menu card's burger rect, handed to the detail page so its burger can
   start exactly where the card's was. sessionStorage, read once. */
const KEY = "burger-me.flip";

export function recordFlip(slug: string, el: Element) {
  const r = el.getBoundingClientRect();
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ slug, at: Date.now(), x: r.left, y: r.top, w: r.width, h: r.height }));
  } catch { /* no storage: the detail page falls back to its own intro */ }
}

export function takeFlip(slug: string): DOMRect | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    if (!raw) return null;
    const f = JSON.parse(raw);
    if (f.slug !== slug || Date.now() - f.at > 4000) return null;
    return new DOMRect(f.x, f.y, f.w, f.h);
  } catch {
    return null;
  }
}
