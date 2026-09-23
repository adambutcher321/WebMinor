/* The website health report: what the crawler found, scored and explained in
   plain English. Everything here is gathered for free — our own crawl of the
   site, Google's PageSpeed test and a public domain lookup. Backlink and
   "domain authority" figures need a paid data licence and are deliberately
   absent. */

export type Severity = 'error' | 'warning' | 'notice';

export type CategoryId = 'found' | 'pages' | 'speed' | 'links' | 'trust';

export interface Issue {
  id: string;
  category: CategoryId;
  severity: Severity;
  /** Plain-English name, e.g. "Pages sharing the same title". */
  title: string;
  /** One or two sentences on why it costs the business, not how Google works. */
  why: string;
  /** What to do about it. */
  fix: string;
  /** How many pages (or items) are affected. */
  count: number;
  /** Example paths or items, capped. */
  examples: string[];
}

export interface SpeedMetric {
  id: 'lcp' | 'cls' | 'tbt' | 'fcp' | 'si';
  label: string;
  /** What it means for a visitor. */
  plain: string;
  display: string;
  value: number;
  band: 'good' | 'ok' | 'poor';
  target: string;
}

export interface SpeedResult {
  /** Google's mobile performance score, 0–100. */
  score: number;
  metrics: SpeedMetric[];
}

export interface CategoryScore {
  id: CategoryId;
  label: string;
  score: number;
  /** False when we couldn't check this area (no speed test, or a JavaScript-only site). */
  tested: boolean;
  errors: number;
  warnings: number;
  notices: number;
}

export interface SiteReport {
  version: 2;
  domain: string;
  finalUrl: string;
  fetchedAt: string;
  score: number;
  band: 'strong' | 'fair' | 'weak' | 'poor';
  /** One sentence the owner can read and understand. */
  headline: string;
  pagesChecked: number;
  linksFound: number;
  counts: Record<Severity, number>;
  categories: CategoryScore[];
  issues: Issue[];
  /** Things that are right, so the report isn't all bad news. */
  passes: string[];
  /** Checks we couldn't run, and why — said plainly rather than guessed at. */
  limits: string[];
  speed: SpeedResult | null;
  domainInfo: { expires: string | null; registered: string | null; registrar: string | null };
  /** HMAC over the rest of the report, so the PDF route only renders reports
      our own server produced. */
  signature?: string;
}

export class AuditError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'AuditError';
  }
}
