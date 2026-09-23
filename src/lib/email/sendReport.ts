import { Resend } from 'resend';
import type { SiteReport } from '@/lib/audit/types';

const FROM = process.env.ENQUIRY_FROM ?? 'WebMinor Website <website@webminor.co.uk>';
const INBOX = process.env.ENQUIRY_TO ?? 'hello@webminor.co.uk';

/**
 * Sends the finished report twice: to the visitor who asked for it, and to the
 * WebMinor inbox as a lead with the same PDF attached. Returns whether the
 * visitor's copy went; the lead copy is best-effort.
 */
export async function sendReport(opts: {
  report: SiteReport;
  pdf: Buffer;
  filename: string;
  email: string;
  name?: string;
}): Promise<boolean> {
  const { report, pdf, filename, email, name } = opts;
  const first = name?.trim().split(/\s+/)[0];
  const top = report.issues.slice(0, 3).map((i, n) => `${n + 1}. ${i.title}`).join('\n');

  const visitorText = `${first ? `Hi ${first},` : 'Hello,'}

Your website health report for ${report.domain} is attached.

It scored ${report.score} out of 100. ${report.headline}
${top ? `\nThe three things we'd fix first:\n${top}\n` : ''}
Every item in the report says what to do about it, so you can pass it straight to whoever looks after your site. If that's nobody, reply to this email or ring 01752 845258 and we'll go through it with you.

WebMinor
Saltash, Cornwall
01752 845258 · webminor.co.uk`;

  const leadText = `Someone ran the free website health check and asked for the PDF.

Name: ${name?.trim() || '(not given)'}
Email: ${email}
Website: ${report.finalUrl}
Score: ${report.score}/100 (${report.band})
Findings: ${report.counts.error} fix now, ${report.counts.warning} fix soon, ${report.counts.notice} worth doing
Pages checked: ${report.pagesChecked}

Top issues:
${top || '(none)'}

Their report is attached. Hit reply to answer them.`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`=== Report email to ${email} (${filename}, ${pdf.length} bytes) ===\n${visitorText}\n\n=== Lead ===\n${leadText}\n`);
    return process.env.NODE_ENV !== 'production';
  }

  const resend = new Resend(apiKey);
  const attachments = [{ filename, content: pdf }];
  const [visitor] = await Promise.all([
    resend.emails.send({
      from: FROM,
      to: [email],
      replyTo: INBOX,
      subject: `Your website health report: ${report.domain} scored ${report.score}/100`,
      text: visitorText,
      attachments,
    }),
    resend.emails
      .send({
        from: FROM,
        to: [INBOX],
        replyTo: email,
        subject: `Health check lead: ${report.domain} (${report.score}/100)`,
        text: leadText,
        attachments,
      })
      .then(({ error }) => error && console.error('Lead email failed:', error.message))
      .catch((err) => console.error('Lead email failed:', err)),
  ]);
  if (visitor.error) {
    console.error('Report email failed:', visitor.error.name, visitor.error.message);
    return false;
  }
  return true;
}
