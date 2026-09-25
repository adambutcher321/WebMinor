/*
  Where a visitor came from, recorded once per browser tab on the first page
  they land on, so an enquiry can say "arrived from chatgpt.com on
  /services/web-design" without an analytics tool. Session storage only: it
  dies with the tab and never leaves the browser except inside a form the
  visitor chooses to send.
*/

const KEY = 'wm-first-touch';

export type FirstTouch = {
  /** Referring host, e.g. "chatgpt.com"; empty for direct visits. */
  referrer: string;
  /** The first path seen on this site, e.g. "/pricing". */
  landing: string;
  /** utm_source, which ChatGPT adds to the links it cites. */
  utm: string;
};

export function recordFirstTouch() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    let referrer = '';
    try {
      const host = new URL(document.referrer).hostname;
      if (host !== location.hostname) referrer = host;
    } catch {}
    const utm = new URLSearchParams(location.search).get('utm_source') ?? '';
    const touch: FirstTouch = { referrer, landing: location.pathname, utm };
    sessionStorage.setItem(KEY, JSON.stringify(touch));
  } catch {}
}

export function readFirstTouch(): FirstTouch | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as FirstTouch) : null;
  } catch {
    return null;
  }
}
