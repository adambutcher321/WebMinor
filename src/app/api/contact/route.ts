import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, phone, email, website, trade, town } = body;

    if (!name || !phone || !email || !trade || !town) {
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
    console.log(`Trade: ${trade}`);
    console.log(`Town: ${town}`);
    console.log('================');

    // TODO: Send email notification
    // await sendEmail({
    //   to: 'hello@webminor.com',
    //   subject: `New Lead — ${name} (${trade} in ${town})`,
    //   body: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nWebsite: ${website}\nTrade: ${trade}\nTown: ${town}`,
    // });

    // TODO: Track event for analytics
    // trackEvent('form_submission', { trade, town });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
