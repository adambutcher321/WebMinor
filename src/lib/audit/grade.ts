import { LighthouseAudit, PsiResult } from './pagespeed';
import { CategoryScores, CoreWebVital, HealthCheckItem, PriorityFix } from './types';

// Lighthouse's own score-colour convention — reused throughout the on-page
// report and the PDF so a "90" always means the same colour everywhere.
export const SCORE_COLORS = {
  good: '#34D399', // emerald-400 — matches the site's existing "no obligation" check icon
  amber: '#F59E0B', // matches the site's existing star-rating accent
  poor: '#F87171', // matches the site's existing form error-text red
} as const;

export function scoreColor(score: number): string {
  if (score >= 90) return SCORE_COLORS.good;
  if (score >= 50) return SCORE_COLORS.amber;
  return SCORE_COLORS.poor;
}

export function letterGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

const VERDICTS: Record<'A' | 'B' | 'C' | 'D' | 'F', string> = {
  A: 'Excellent — your site is in great shape and ready for take-off.',
  B: 'Solid, but there are a few quick wins that would help you convert more visitors.',
  C: 'Average — competitors with faster, more complete sites are likely winning enquiries you should be getting.',
  D: 'Underperforming — slow load times and gaps are likely costing you leads every day.',
  F: 'Struggling — significant issues are actively turning visitors away before they ever call you.',
};

export function verdictFor(grade: 'A' | 'B' | 'C' | 'D' | 'F'): string {
  return VERDICTS[grade];
}

export function computeOverallScore(categories: CategoryScores): number {
  const values = [
    categories.performance,
    categories.accessibility,
    categories.bestPractices,
    categories.seo,
  ].filter((v): v is number => typeof v === 'number');

  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
}

function stripMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
}

interface CwvDef {
  id: CoreWebVital['id'];
  auditId: string;
  label: string;
  thresholds: { good: number; poor: number };
}

const CWV_DEFS: CwvDef[] = [
  { id: 'fcp', auditId: 'first-contentful-paint', label: 'First Contentful Paint', thresholds: { good: 1800, poor: 3000 } },
  { id: 'si', auditId: 'speed-index', label: 'Speed Index', thresholds: { good: 3400, poor: 5800 } },
  { id: 'lcp', auditId: 'largest-contentful-paint', label: 'Largest Contentful Paint', thresholds: { good: 2500, poor: 4000 } },
  { id: 'tbt', auditId: 'total-blocking-time', label: 'Total Blocking Time', thresholds: { good: 200, poor: 600 } },
  { id: 'cls', auditId: 'cumulative-layout-shift', label: 'Cumulative Layout Shift', thresholds: { good: 0.1, poor: 0.25 } },
];

function bandFor(value: number, thresholds: { good: number; poor: number }): CoreWebVital['band'] {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

export function buildCoreWebVitals(audits: Record<string, LighthouseAudit>): CoreWebVital[] {
  return CWV_DEFS.filter((def) => audits[def.auditId]).map((def) => {
    const audit = audits[def.auditId];
    const numericValue = audit.numericValue ?? 0;
    return {
      id: def.id,
      label: def.label,
      displayValue: audit.displayValue ?? String(numericValue),
      numericValue,
      band: bandFor(numericValue, def.thresholds),
      thresholds: def.thresholds,
    };
  });
}

// Plain-English translations for the most common Lighthouse "opportunity"
// audits. Anything not in this map falls back to the audit's own title.
const OPPORTUNITY_COPY: Record<string, string> = {
  'render-blocking-resources':
    'Some files are delaying your page from showing anything at all — visitors see a blank screen for longer than they should.',
  'unused-css-rules':
    "Your site is loading style rules it doesn't actually use on this page, slowing things down.",
  'unused-javascript':
    "Your site is loading code it doesn't need for this page, slowing things down for visitors.",
  'unminified-css': "Your stylesheets aren't compressed as much as they could be.",
  'unminified-javascript': "Your scripts aren't compressed as much as they could be.",
  'modern-image-formats':
    'Your images could be served in modern formats that load faster without losing quality.',
  'uses-optimized-images': 'Some images are larger than they need to be, slowing down your page.',
  'uses-responsive-images':
    "Some images are bigger than the space they're shown in, wasting load time on mobile.",
  'offscreen-images':
    'Images below the fold are loading immediately instead of waiting until visitors scroll to them.',
  'uses-text-compression':
    "Your server isn't compressing files before sending them, so pages take longer to arrive.",
  'efficient-animated-content':
    "An animated file (like a GIF) is being used where a smaller video format would load much faster.",
  'uses-rel-preconnect':
    'Your page could establish early connections to services it depends on, shaving off load time.',
  'server-response-time':
    'Your server itself is slow to start responding — this delays everything else on the page.',
  redirects: 'Visitors are being bounced through extra redirects before reaching the real page, adding delay.',
  'uses-long-cache-ttl':
    "Returning visitors are re-downloading files that could be cached, so the site feels slow every time.",
  'dom-size':
    'The page has an unusually large amount of content on it, which can slow down rendering and interactions.',
  'critical-request-chains':
    'Key resources are loading in a long dependent chain, delaying the page.',
  'legacy-javascript':
    "Older browser-compatibility code is being sent to every visitor, even those who don't need it.",
  'duplicated-javascript':
    'The same JavaScript is being loaded more than once, wasting time and bandwidth.',
  'font-display':
    'Custom fonts can briefly leave text invisible while they load, which feels like a flash of nothing.',
  'total-byte-weight': 'The page is transferring a large amount of data, which is slow on mobile connections.',
};

export function buildPriorityFixes(
  audits: Record<string, LighthouseAudit>,
  maxCount = 6
): PriorityFix[] {
  return Object.values(audits)
    .filter(
      (audit) =>
        audit.details?.type === 'opportunity' &&
        (audit.details.overallSavingsMs ?? 0) > 0
    )
    .sort((a, b) => (b.details?.overallSavingsMs ?? 0) - (a.details?.overallSavingsMs ?? 0))
    .slice(0, maxCount)
    .map((audit) => ({
      id: audit.id,
      title: audit.title,
      plainEnglish: OPPORTUNITY_COPY[audit.id] ?? stripMarkdownLinks(audit.description),
      savingsMs: Math.round(audit.details?.overallSavingsMs ?? 0),
    }));
}

export function buildLighthouseHealthChecks(
  psi: PsiResult,
  maxCount = 12
): HealthCheckItem[] {
  const ids = [
    ...psi.categoryAuditRefs.accessibility,
    ...psi.categoryAuditRefs.bestPractices,
    ...psi.categoryAuditRefs.seo,
  ];

  const seen = new Set<string>();
  const items: HealthCheckItem[] = [];

  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);

    const audit = psi.audits[id];
    if (!audit || typeof audit.score !== 'number') continue;
    if (audit.scoreDisplayMode !== 'binary' && audit.scoreDisplayMode !== 'numeric') continue;
    if (audit.score === 1) continue; // only surface things that need attention

    items.push({
      id: audit.id,
      label: audit.title,
      status: audit.score === 0 ? 'fail' : 'warn',
      detail: stripMarkdownLinks(audit.description),
      source: 'lighthouse',
    });
  }

  return items
    .sort((a, b) => (a.status === b.status ? 0 : a.status === 'fail' ? -1 : 1))
    .slice(0, maxCount);
}
