import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { buildFooterTemplate, buildReportHtml } from '@/lib/pdf/reportTemplate';
import { AuditReport } from '@/lib/audit/types';

const MAX_LIST_LENGTH = 30;

// The report is generated client-side from a prior /api/audit response and
// posted back here rather than re-fetched, so we don't spend a second
// PageSpeed Insights quota unit per PDF download. Since it's client-supplied,
// treat it as untrusted input: check shape and cap list lengths before it's
// interpolated into the HTML that Puppeteer renders.
function validateReport(body: unknown): AuditReport | null {
  if (!body || typeof body !== 'object') return null;
  const r = body as Record<string, unknown>;

  if (typeof r.domain !== 'string' || !r.domain) return null;
  if (typeof r.strategy !== 'string') return null;
  if (typeof r.fetchedAt !== 'string') return null;
  if (typeof r.overallScore !== 'number') return null;
  if (typeof r.grade !== 'string') return null;
  if (typeof r.verdict !== 'string') return null;
  if (!r.categories || typeof r.categories !== 'object') return null;
  if (!Array.isArray(r.coreWebVitals) || r.coreWebVitals.length > MAX_LIST_LENGTH) return null;
  if (!Array.isArray(r.priorityFixes) || r.priorityFixes.length > MAX_LIST_LENGTH) return null;
  if (!Array.isArray(r.healthChecks) || r.healthChecks.length > MAX_LIST_LENGTH) return null;

  return r as unknown as AuditReport;
}

export async function POST(request: NextRequest) {
  let browser;
  try {
    const body = await request.json().catch(() => null);
    const report = validateReport(body?.report);

    if (!report) {
      return NextResponse.json({ error: 'Invalid report data.' }, { status: 400 });
    }

    const html = buildReportHtml(report);

    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    /*
      `setContent` used to pass `waitUntil: 'networkidle0'`, which this version
      of Puppeteer no longer accepts — the build failed to type check on it. The
      wait existed because the report template pulls Sora, Space Mono and Inter
      from Google Fonts, and printing before they arrive produces a PDF set in
      fallback faces. Waiting on the font set itself is both valid and more
      precise than waiting for the network to fall quiet.
    */
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: buildFooterTemplate(report.domain),
      margin: { top: '0mm', bottom: '12mm', left: '0mm', right: '0mm' },
    });

    const safeDomain = report.domain.replace(/[^a-z0-9.-]/gi, '_');

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="webminor-launch-readiness-${safeDomain}.pdf"`,
      },
    });
  } catch (err) {
    console.error('PDF generation failed:', err);
    return NextResponse.json(
      { error: 'Could not generate the PDF report. Please try again.' },
      { status: 500 }
    );
  } finally {
    if (browser) await browser.close();
  }
}
