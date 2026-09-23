import type { SpeedMetric, SpeedResult } from './types';

/* Google's PageSpeed test, mobile only (that's where local customers are),
   performance only. Free with an API key; without one Google's shared quota
   often refuses, and the report simply leaves the speed test out rather than
   failing. */

const ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

const DEFS: {
  id: SpeedMetric['id'];
  audit: string;
  label: string;
  plain: string;
  good: number;
  poor: number;
  target: string;
}[] = [
  { id: 'lcp', audit: 'largest-contentful-paint', label: 'Main content appears', plain: 'How long before the biggest thing on screen — usually the main photo or headline — has loaded.', good: 2500, poor: 4000, target: 'under 2.5s' },
  { id: 'fcp', audit: 'first-contentful-paint', label: 'Something appears', plain: 'How long a visitor stares at a blank screen.', good: 1800, poor: 3000, target: 'under 1.8s' },
  { id: 'tbt', audit: 'total-blocking-time', label: 'Page responds to taps', plain: 'How long the page is frozen while code runs, ignoring taps and scrolls.', good: 200, poor: 600, target: 'under 0.2s' },
  { id: 'cls', audit: 'cumulative-layout-shift', label: 'Page stays still', plain: 'How much things jump around while loading — the reason people tap the wrong button.', good: 0.1, poor: 0.25, target: 'under 0.1' },
  { id: 'si', audit: 'speed-index', label: 'Page looks finished', plain: 'How quickly the visible part of the page fills in.', good: 3400, poor: 5800, target: 'under 3.4s' },
];

export async function runSpeedTest(url: string): Promise<SpeedResult | null> {
  const params = new URLSearchParams({ url, strategy: 'mobile', category: 'performance' });
  // The reviews key (webminor-reviews) is also allowed PageSpeed, so one
  // Google key serves both; a dedicated PAGESPEED_API_KEY wins if set.
  const key = process.env.PAGESPEED_API_KEY ?? process.env.GOOGLE_PLACES_API_KEY;
  if (key) params.set('key', key);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 75_000);
  try {
    const res = await fetch(`${ENDPOINT}?${params}`, { signal: controller.signal });
    if (!res.ok) {
      console.warn('PageSpeed unavailable:', res.status);
      return null;
    }
    const json = await res.json();
    const lh = json.lighthouseResult;
    const score = lh?.categories?.performance?.score;
    if (typeof score !== 'number') return null;
    const audits = lh.audits ?? {};
    const metrics: SpeedMetric[] = DEFS.filter((d) => typeof audits[d.audit]?.numericValue === 'number').map((d) => {
      const value = audits[d.audit].numericValue as number;
      const display = d.id === 'cls' ? value.toFixed(2) : `${(value / 1000).toFixed(1)}s`;
      return {
        id: d.id,
        label: d.label,
        plain: d.plain,
        display,
        value,
        band: value <= d.good ? 'good' : value <= d.poor ? 'ok' : 'poor',
        target: d.target,
      };
    });
    return { score: Math.round(score * 100), metrics };
  } catch (err) {
    console.warn('PageSpeed failed:', err instanceof Error ? err.message : err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}
