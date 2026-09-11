import { AuditError, Strategy } from './types';

const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

// Real Lighthouse runs can take 20-40s; give it plenty of room rather than
// aborting early and showing a false "failed" error.
const PSI_TIMEOUT_MS = 90_000;

export interface LighthouseAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: string;
  numericValue?: number;
  displayValue?: string;
  details?: {
    type?: string;
    overallSavingsMs?: number;
  };
}

export interface PsiResult {
  finalUrl: string;
  categories: {
    performance: number | null;
    accessibility: number | null;
    bestPractices: number | null;
    seo: number | null;
  };
  audits: Record<string, LighthouseAudit>;
  categoryAuditRefs: {
    accessibility: string[];
    bestPractices: string[];
    seo: string[];
  };
}

export async function fetchPageSpeedInsights(
  targetUrl: string,
  strategy: Strategy
): Promise<PsiResult> {
  const apiKey = process.env.PAGESPEED_API_KEY;

  const params = new URLSearchParams();
  params.set('url', targetUrl);
  params.set('strategy', strategy);
  for (const category of ['performance', 'accessibility', 'best-practices', 'seo']) {
    params.append('category', category);
  }
  if (apiKey) params.set('key', apiKey);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PSI_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${PSI_ENDPOINT}?${params.toString()}`, {
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new AuditError(
        'The audit took too long to run. Please try again in a moment.',
        504
      );
    }
    throw new AuditError(
      'Could not reach the audit engine. Please try again shortly.',
      502
    );
  } finally {
    clearTimeout(timeout);
  }

  if (res.status === 429) {
    throw new AuditError(
      "We're running a lot of audits right now — please try again in a minute.",
      429
    );
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const reason: string | undefined = body?.error?.errors?.[0]?.reason;
    if (reason === 'badRequest' || res.status === 400) {
      throw new AuditError(
        "We couldn't reach that website. Please check the address and that the site is online.",
        400
      );
    }
    throw new AuditError(
      'The audit engine returned an error. Please try again shortly.',
      502
    );
  }

  const json = await res.json();

  const lighthouseResult = json.lighthouseResult;
  if (!lighthouseResult) {
    throw new AuditError(
      "We couldn't reach that website. Please check the address and that the site is online.",
      400
    );
  }

  const categories = lighthouseResult.categories ?? {};
  const audits: Record<string, LighthouseAudit> = lighthouseResult.audits ?? {};

  const toRefs = (key: string): string[] =>
    (categories[key]?.auditRefs ?? [])
      .map((ref: { id: string }) => ref.id)
      .filter((id: string) => Boolean(audits[id]));

  return {
    finalUrl: lighthouseResult.finalUrl ?? targetUrl,
    categories: {
      performance:
        typeof categories.performance?.score === 'number'
          ? Math.round(categories.performance.score * 100)
          : null,
      accessibility:
        typeof categories.accessibility?.score === 'number'
          ? Math.round(categories.accessibility.score * 100)
          : null,
      bestPractices:
        typeof categories['best-practices']?.score === 'number'
          ? Math.round(categories['best-practices'].score * 100)
          : null,
      seo:
        typeof categories.seo?.score === 'number'
          ? Math.round(categories.seo.score * 100)
          : null,
    },
    audits,
    categoryAuditRefs: {
      accessibility: toRefs('accessibility'),
      bestPractices: toRefs('best-practices'),
      seo: toRefs('seo'),
    },
  };
}
