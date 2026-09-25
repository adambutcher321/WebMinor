import { NextRequest, NextResponse } from 'next/server';
import { sendEnquiry } from '@/lib/email/sendEnquiry';
import { checkRateLimit } from '@/lib/audit/rateLimit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LeadBody = {
  name?: string;
  phone?: string;
  email?: string;
  website?: string;
  business?: string;
  location?: string;
  /** Which offer the form was selling, e.g. "Free website review". */
  offer?: string;
  /** Legacy field names from the trade-only form; still accepted. */
  trade?: string;
  town?: string;
  /** First-touch record from src/lib/firstTouch.ts; null when storage is blocked. */
  source?: { referrer?: string; landing?: string; utm?: string } | null;
};

/** Short, single-line text from an untrusted field. */
const clip = (v: unknown, n: number) =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, n) : '';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    if (!checkRateLimit(`contact:${ip}`, 10, 60 * 60 * 1000).allowed) {
      return NextResponse.json({ error: 'Please try again shortly.' }, { status: 429 });
    }

    const body = (await request.json()) as LeadBody;

    const name = body.name?.trim();
    const phone = body.phone?.trim();
    const email = body.email?.trim();
    const website = body.website?.trim();
    const business = (body.business ?? body.trade)?.trim();
    const location = (body.location ?? body.town)?.trim();
    const offer = body.offer?.trim().slice(0, 60) || 'New enquiry';
    const referrer = clip(body.source?.referrer, 80);
    const utm = clip(body.source?.utm, 80);
    const cameFrom = [referrer || (body.source ? 'Direct or unknown' : ''), utm && utm !== referrer ? `utm_source=${utm}` : '']
      .filter(Boolean)
      .join(', ');

    if (!name || !phone || !email || !business || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sent = await sendEnquiry({
      subject: `${offer}: ${name} (${business}${location ? `, ${location}` : ''})`,
      replyTo: email,
      fields: [
        ['Asked for', offer],
        ['Name', name],
        ['Phone', phone],
        ['Email', email],
        ['Business', business],
        ['Location', location],
        ['Current website', website],
        ['Came from', cameFrom],
        ['First page', clip(body.source?.landing, 120)],
      ],
    });
    if (!sent) {
      // The form shows its "call or email us" message on any non-OK response.
      return NextResponse.json({ error: 'Could not send enquiry' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
