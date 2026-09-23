import { NextRequest, NextResponse } from 'next/server';
import { normalizeAndValidateUrl } from '@/lib/audit/normalizeUrl';
import { checkRateLimit } from '@/lib/audit/rateLimit';
import { runAudit } from '@/lib/audit/run';
import { AuditError } from '@/lib/audit/types';

// The crawl gets 50s and Google's speed test up to 75s, run side by side.
export const maxDuration = 120;

const RATE_LIMIT = { max: process.env.NODE_ENV === 'production' ? 6 : 1000, windowMs: 60 * 60 * 1000 };

function clientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? request.headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(request: NextRequest) {
  const limit = checkRateLimit(`audit:${clientIp(request)}`, RATE_LIMIT.max, RATE_LIMIT.windowMs);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'That’s the limit of free reports for now. Try again in an hour, or ring 01752 845258 and we’ll run one for you.' },
      { status: 429 },
    );
  }

  try {
    const body = await request.json().catch(() => null);
    const { url } = normalizeAndValidateUrl(typeof body?.domain === 'string' ? body.domain : '');
    const report = await runAudit(url);
    return NextResponse.json(report);
  } catch (err) {
    if (err instanceof AuditError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('Audit failed:', err);
    return NextResponse.json(
      { error: 'Something went wrong running the check. Please try again, or ring 01752 845258.' },
      { status: 500 },
    );
  }
}
