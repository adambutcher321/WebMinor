import { NextRequest, NextResponse } from 'next/server';

type LeadBody = {
  name?: string;
  phone?: string;
  email?: string;
  website?: string;
  business?: string;
  location?: string;
  /** Legacy field names from the trade-only form; still accepted. */
  trade?: string;
  town?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LeadBody;

    const name = body.name?.trim();
    const phone = body.phone?.trim();
    const email = body.email?.trim();
    const website = body.website?.trim();
    const business = (body.business ?? body.trade)?.trim();
    const location = (body.location ?? body.town)?.trim();

    if (!name || !phone || !email || !business) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Replace with your form provider (Resend, Formspark, etc.)
    // For now, log to console and return success
    console.log('=== NEW LEAD ===');
    console.log(`Name: ${name}`);
    console.log(`Phone: ${phone}`);
    console.log(`Email: ${email}`);
    console.log(`Website: ${website || 'Not provided'}`);
    console.log(`Business: ${business}`);
    console.log(`Location: ${location || 'Not provided'}`);
    console.log('================');

    // TODO: Send email notification
    // await sendEmail({
    //   to: 'hello@webminor.co.uk',
    //   subject: `New Lead — ${name} (${business}${location ? ` in ${location}` : ''})`,
    //   body: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nWebsite: ${website}\nBusiness: ${business}\nLocation: ${location}`,
    // });

    // TODO: Track event for analytics
    // trackEvent('form_submission', { business, location });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
