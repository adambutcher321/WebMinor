export type Strategy = 'mobile' | 'desktop';

export type Band = 'good' | 'needs-improvement' | 'poor';

export type CheckStatus = 'pass' | 'warn' | 'fail';

export interface CategoryScores {
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  seo: number | null;
}

export interface CoreWebVital {
  id: 'fcp' | 'si' | 'lcp' | 'tbt' | 'cls';
  label: string;
  displayValue: string;
  numericValue: number;
  band: Band;
  thresholds: { good: number; poor: number };
}

export interface PriorityFix {
  id: string;
  title: string;
  plainEnglish: string;
  savingsMs: number;
}

export interface HealthCheckItem {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
  source: 'own' | 'lighthouse';
}

export interface AuditReport {
  domain: string;
  finalUrl: string;
  strategy: Strategy;
  fetchedAt: string;
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  verdict: string;
  categories: CategoryScores;
  coreWebVitals: CoreWebVital[];
  priorityFixes: PriorityFix[];
  healthChecks: HealthCheckItem[];
  // Extension point: a proprietary domain-authority-style score (e.g. Ahrefs/Moz)
  // would need a paid third-party API and commercial licence — intentionally not
  // implemented here. If added later, wire it in as an optional field, e.g.:
  // domainAuthority?: { provider: string; score: number };
}

export class AuditError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'AuditError';
  }
}
