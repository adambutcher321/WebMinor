import { Resend } from 'resend';

const TO = process.env.ENQUIRY_TO ?? 'hello@webminor.co.uk';
// The sending domain has to be verified in Resend (DNS records on webminor.co.uk).
const FROM = process.env.ENQUIRY_FROM ?? 'WebMinor Website <website@webminor.co.uk>';

export interface Enquiry {
  subject: string;
  /** Label/value pairs, rendered one per line. Empty values are skipped. */
  fields: [label: string, value: string | number | null | undefined][];
  /** The visitor's address, so hitting Reply answers them rather than the website. */
  replyTo?: string;
}

/**
 * Emails a form submission to the WebMinor inbox. Returns false when the email
 * could not be sent, so the route can tell the visitor to phone instead of
 * showing a success message for an enquiry nobody will ever read.
 */
export async function sendEnquiry({ subject, fields, replyTo }: Enquiry): Promise<boolean> {
  const text = fields
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Local development without a key: show the enquiry in the terminal.
    console.log(`=== ${subject} ===\n${text}\n`);
    return process.env.NODE_ENV !== 'production';
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM,
      to: [TO],
      subject,
      text,
      ...(replyTo ? { replyTo } : {}),
    });
    if (error) {
      console.error('Enquiry email failed:', error.name, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Enquiry email failed:', err);
    return false;
  }
}
