import { NextRequest, NextResponse } from 'next/server';
import { fetchPageSpeedInsights } from '@/lib/audit/pagespeed';
import { runOwnHealthChecks } from '@/lib/audit/healthChecks';
import { normalizeAndValidateUrl } from '@/lib/audit/normalizeUrl';
import { checkRateLimit } from '@/lib/audit/rateLimit';
import {
  buildCoreWebVitals,
  buildLighthouseHealthChecks,
  buildPriorityFixes,
  computeOverallScore,
  letterGrade,
  verdictFor,
} from '@/lib/audit/grade';
import { AuditError, AuditReport, Strategy } from '@/lib/audit/types';

const RATE_LIMIT = { max: 8, windowMs: 60 * 60 * 1000 }; // 8 audits/hour/IP

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const domainInput = typeof body?.domain === 'string' ? body.domain : '';
    const strategy: Strategy = body?.strategy === 'desktop' ? 'desktop' : 'mobile';

    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`audit:${ip}`, RATE_LIMIT.max, RATE_LIMIT.windowMs);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            "You've reached the limit of free audits for now — please try again later, or contact us for a manual review.",
        },
        {
          status: 429,
          headers: rateLimit.retryAfterSeconds
            ? { 'Retry-After': String(rateLimit.retryAfterSeconds) }
            : undefined,
        }
      );
    }

    const { url, domain } = normalizeAndValidateUrl(domainInput);

    const [psi, ownHealthChecks] = await Promise.all([
      fetchPageSpeedInsights(url.toString(), strategy),
      runOwnHealthChecks(url.toString()),
    ]);

    const categories = psi.categories;
    const overallScore = computeOverallScore(categories);
    const grade = letterGrade(overallScore);

    const report: AuditReport = {
      domain,
      finalUrl: psi.finalUrl,
      strategy,
      fetchedAt: new Date().toISOString(),
      overallScore,
      grade,
      verdict: verdictFor(grade),
      categories,
      coreWebVitals: buildCoreWebVitals(psi.audits),
      priorityFixes: buildPriorityFixes(psi.audits),
      healthChecks: [...ownHealthChecks, ...buildLighthouseHealthChecks(psi)],
    };

    return NextResponse.json(report);
  } catch (err) {
    if (err instanceof AuditError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('Audit failed:', err);
    return NextResponse.json(
      {
        error:
          "Something went wrong running your audit. Please try again, or contact us and we'll take a look manually.",
      },
      { status: 500 }
    );
  }
}
