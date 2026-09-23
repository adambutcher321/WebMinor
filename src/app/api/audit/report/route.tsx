import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import HealthReport from '@/lib/pdf/HealthReport';
import { verifyReport } from '@/lib/audit/run';
import { checkRateLimit } from '@/lib/audit/rateLimit';
import { sendReport } from '@/lib/email/sendReport';
import type { SiteReport } from '@/lib/audit/types';

export const maxDuration = 60;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* The browser posts back the report /api/audit gave it, so the site isn't
   crawled twice. It's signed on the way out and checked here: only a report
   our server produced, unaltered, gets rendered under the WebMinor name and
   emailed anywhere. */
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (!checkRateLimit(`audit-report:${ip}`, process.env.NODE_ENV === 'production' ? 8 : 1000, 60 * 60 * 1000).allowed) {
    return NextResponse.json({ error: 'Please try again shortly.' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const report = body?.report as SiteReport | undefined;
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 80) : '';

  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (!report || !verifyReport(report)) {
    return NextResponse.json({ error: 'That report has expired. Please run the check again.' }, { status: 400 });
  }

  const doc = <HealthReport report={report} />;
  try {
    const pdf = Buffer.from(await renderToBuffer(doc));
    const filename = `website-health-report-${report.domain.replace(/[^a-z0-9.-]/gi, '_')}.pdf`;
    const sent = await sendReport({ report, pdf, filename, email, name });

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Report-Emailed': sent ? '1' : '0',
      },
    });
  } catch (err) {
    console.error('Report PDF failed:', err);
    return NextResponse.json({ error: 'We couldn’t build the PDF. Please try again, or ring 01752 845258.' }, { status: 500 });
  }
}
