import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/audit/rateLimit';
import { sendEnquiry } from '@/lib/email/sendEnquiry';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`audit-lead:${ip}`, 20, 60 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Please try again shortly.' }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const domain = typeof body?.domain === 'string' ? body.domain : '';
    const grade = typeof body?.grade === 'string' ? body.grade : '';
    const score = typeof body?.score === 'number' ? body.score : null;
    const strategy = typeof body?.strategy === 'string' ? body.strategy : '';

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!domain) {
      return NextResponse.json({ error: 'Missing domain.' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    // A failed notification must not block the visitor's PDF, so this one is
    // best-effort: the failure is logged by sendEnquiry and the report still unlocks.
    await sendEnquiry({
      subject: `Website report requested: ${domain}`,
      replyTo: email,
      fields: [
        ['Email', email],
        ['Website checked', domain],
        ['Grade', grade ? `${grade} (${score ?? 'n/a'}/100)` : ''],
        ['Strategy', strategy],
        ['Time', timestamp],
      ],
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
