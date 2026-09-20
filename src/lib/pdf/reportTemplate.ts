import { AuditReport } from '@/lib/audit/types';
import { SCORE_COLORS, scoreColor } from '@/lib/audit/grade';
import { cwvBar, donutChart, escapeHtml, radarChart, radialGauge, savingsBarChart } from './charts';
import { LOGO_BASE64 } from './logoBase64';

const CONTACT = {
  phone: '01752 845258',
  phoneHref: 'tel:01752845258',
  whatsapp: '07894 331253',
  email: 'hello@webminor.com',
  web: 'webminor.co.uk',
  address: 'Unit 3, Gwel Avon Business Park, Gilston Road, Saltash, Cornwall PL12 6TW',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function logoMark(size = 40): string {
  return `<img src="data:image/png;base64,${LOGO_BASE64}" width="${size}" height="${size}" style="display:block;" alt="" />`;
}

function wordmark(fontSize = 18): string {
  return `<span style="font-family:'Sora',sans-serif;font-weight:700;font-size:${fontSize}px;color:#F5F7FA;">Web<span style="color:#40E0FF;">Minor</span></span>`;
}

function brandHeader(): string {
  return `
  <div style="display:flex;align-items:center;gap:2px;">
    ${logoMark(44)}
    <div style="margin-left:-10px;">${wordmark(17)}</div>
  </div>`;
}

function statusBadge(status: 'pass' | 'warn' | 'fail'): string {
  const color = status === 'pass' ? SCORE_COLORS.good : status === 'warn' ? SCORE_COLORS.amber : SCORE_COLORS.poor;
  const symbol = status === 'pass' ? '&#10003;' : status === 'warn' ? '!' : '&#10005;';
  return `<span style="display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:${color};color:#0B0D10;font-size:10px;font-weight:700;flex-shrink:0;">${symbol}</span>`;
}

export function buildReportHtml(report: AuditReport): string {
  const { domain, strategy, fetchedAt, overallScore, grade, verdict, categories, coreWebVitals, priorityFixes, healthChecks } = report;

  const passCount = healthChecks.filter((h) => h.status === 'pass').length;
  const warnCount = healthChecks.filter((h) => h.status === 'warn').length;
  const failCount = healthChecks.filter((h) => h.status === 'fail').length;

  const half = Math.ceil(healthChecks.length / 2);
  const colA = healthChecks.slice(0, half);
  const colB = healthChecks.slice(half);

  const checklistColumn = (items: typeof healthChecks) =>
    items
      .map(
        (item) => `
      <div style="display:flex;gap:8px;margin-bottom:10px;align-items:flex-start;">
        ${statusBadge(item.status)}
        <div>
          <div style="font-family:'Sora',sans-serif;font-weight:600;font-size:11.5px;color:#F5F7FA;line-height:1.3;">${escapeHtml(item.label)}</div>
          <div style="font-size:10px;color:#9AA3AF;line-height:1.35;margin-top:1px;">${escapeHtml(item.detail)}</div>
        </div>
      </div>`
      )
      .join('');

  const fixesListHtml = priorityFixes.length
    ? priorityFixes
        .map(
          (fix, i) => `
      <div style="display:flex;gap:12px;margin-bottom:14px;">
        <div style="font-family:'Space Mono',monospace;font-size:13px;font-weight:700;color:#40E0FF;width:20px;flex-shrink:0;">${i + 1}</div>
        <div>
          <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:13px;color:#F5F7FA;">${escapeHtml(fix.title)}</div>
          <div style="font-size:11.5px;color:#9AA3AF;line-height:1.45;margin-top:2px;">${escapeHtml(fix.plainEnglish)}</div>
        </div>
      </div>`
        )
        .join('')
    : `<p style="color:#9AA3AF;font-size:13px;">No major opportunities found — nice work, the essentials are already in place.</p>`;

  const categoryRows = [
    { label: 'Performance', value: categories.performance },
    { label: 'Accessibility', value: categories.accessibility },
    { label: 'Best Practices', value: categories.bestPractices },
    { label: 'SEO', value: categories.seo },
  ]
    .map(
      (c) => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="width:10px;height:10px;border-radius:50%;background:${scoreColor(c.value ?? 0)};display:inline-block;"></span>
        <span style="font-family:'Sora',sans-serif;font-weight:600;font-size:13px;color:#F5F7FA;">${c.label}</span>
      </div>
      <span style="font-family:'Space Mono',monospace;font-weight:700;font-size:14px;color:${scoreColor(c.value ?? 0)};">${c.value ?? '—'}</span>
    </div>`
    )
    .join('');

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; background: #0B0D10; }
  body { font-family: 'Inter', sans-serif; color: #F5F7FA; }
  .page {
    width: 210mm;
    height: 297mm;
    padding: 16mm 18mm;
    background: #0B0D10;
    position: relative;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .page:last-child { page-break-after: auto; }
  .eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #40E0FF;
    margin: 0 0 10px 0;
  }
  .h1 { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 27px; color: #fff; margin: 0 0 6px 0; }
  .muted { color: #9AA3AF; }
  .card {
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 22px 24px;
    background: rgba(255,255,255,0.02);
  }
</style>
</head>
<body>

<!-- PAGE 1: COVER -->
<div class="page" style="align-items:center;justify-content:center;text-align:center;">
  <div style="position:absolute;top:16mm;left:18mm;">${brandHeader()}</div>
  <div style="position:absolute;top:16mm;right:18mm;text-align:right;">
    <div class="eyebrow" style="margin:0;">Pre-Flight Check</div>
  </div>

  ${radialGauge(overallScore, grade, 300)}

  <h1 class="h1" style="font-size:34px;margin-top:18px;">Launch Readiness Report</h1>
  <p class="muted" style="font-size:15px;max-width:120mm;line-height:1.5;">${escapeHtml(verdict)}</p>

  <div style="margin-top:28px;display:flex;gap:36px;">
    <div>
      <div class="eyebrow" style="margin-bottom:4px;">Domain</div>
      <div style="font-family:'Space Mono',monospace;font-size:14px;color:#F5F7FA;">${escapeHtml(domain)}</div>
    </div>
    <div>
      <div class="eyebrow" style="margin-bottom:4px;">Device</div>
      <div style="font-family:'Space Mono',monospace;font-size:14px;color:#F5F7FA;text-transform:capitalize;">${escapeHtml(strategy)}</div>
    </div>
    <div>
      <div class="eyebrow" style="margin-bottom:4px;">Date</div>
      <div style="font-family:'Space Mono',monospace;font-size:14px;color:#F5F7FA;">${escapeHtml(formatDate(fetchedAt))}</div>
    </div>
  </div>
</div>

<!-- PAGE 2: CATEGORY SCORES -->
<div class="page">
  <div class="eyebrow">02 — Category Scores</div>
  <h1 class="h1">How each area of your site scored</h1>
  <p class="muted" style="font-size:13px;max-width:150mm;">Performance, Accessibility, Best Practices and SEO — the same four categories Google's own Lighthouse tool measures.</p>

  <div style="flex:1;display:flex;align-items:center;justify-content:center;gap:40px;margin-top:10px;">
    ${radarChart(categories, 340)}
    <div style="width:170px;">
      ${categoryRows}
    </div>
  </div>
</div>

<!-- PAGE 3: CORE WEB VITALS -->
<div class="page">
  <div class="eyebrow">03 — Core Web Vitals</div>
  <h1 class="h1">How fast your site feels to real visitors</h1>
  <p class="muted" style="font-size:13px;max-width:155mm;">These are the exact metrics Google uses to judge real-world speed. Each bar shows the good / needs-work / poor bands, with a marker for where your site lands.</p>

  <div style="margin-top:8px;display:flex;flex-direction:column;gap:22px;">
    ${coreWebVitals.map((cwv) => cwvBar(cwv, 480)).join('')}
  </div>

  <div style="margin-top:auto;display:flex;gap:22px;font-size:11px;">
    <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${SCORE_COLORS.good};display:inline-block;"></span>Good</span>
    <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${SCORE_COLORS.amber};display:inline-block;"></span>Needs work</span>
    <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${SCORE_COLORS.poor};display:inline-block;"></span>Poor</span>
  </div>
</div>

<!-- PAGE 4: PRIORITY FIXES -->
<div class="page">
  <div class="eyebrow">04 — Priority Fixes</div>
  <h1 class="h1">Where to focus first</h1>
  <p class="muted" style="font-size:13px;max-width:155mm;">Ranked by how much loading time each fix could save — biggest wins first.</p>

  <div style="margin-top:14px;">
    ${priorityFixes.length ? savingsBarChart(priorityFixes.map((f) => ({ title: f.title, savingsMs: f.savingsMs })), 480) : ''}
  </div>

  <div style="margin-top:20px;">
    ${fixesListHtml}
  </div>
</div>

<!-- PAGE 5: HEALTH CHECKS -->
<div class="page">
  <div class="eyebrow">05 — Health Checks</div>
  <h1 class="h1">The essentials, checked</h1>
  <p class="muted" style="font-size:13px;max-width:155mm;">Basic technical and SEO checks, plus anything flagged by Google's own audit.</p>

  <div style="display:flex;align-items:center;gap:28px;margin:14px 0 20px 0;">
    ${donutChart(passCount, warnCount, failCount, 150)}
    <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;">
      <span style="display:flex;align-items:center;gap:8px;">${statusBadge('pass')} ${passCount} passed</span>
      <span style="display:flex;align-items:center;gap:8px;">${statusBadge('warn')} ${warnCount} need attention</span>
      <span style="display:flex;align-items:center;gap:8px;">${statusBadge('fail')} ${failCount} failing</span>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 28px;flex:1;overflow:hidden;">
    <div>${checklistColumn(colA)}</div>
    <div>${checklistColumn(colB)}</div>
  </div>
</div>

<!-- PAGE 6: CLOSING CTA -->
<div class="page" style="align-items:center;justify-content:center;text-align:center;">
  <div style="position:absolute;top:16mm;left:18mm;">${brandHeader()}</div>

  <div class="eyebrow">Ready for lift-off?</div>
  <h1 class="h1" style="font-size:30px;max-width:150mm;">Let us fix all of this — and get you more enquiries.</h1>
  <p class="muted" style="font-size:14px;max-width:130mm;line-height:1.5;">
    We build fast, conversion-focused websites for trades businesses across the South West.
    Get in touch and we'll walk you through exactly what this report means for your business.
  </p>

  <div class="card" style="margin-top:26px;text-align:left;min-width:130mm;">
    <div style="display:flex;flex-direction:column;gap:10px;font-family:'Space Mono',monospace;font-size:13px;">
      <div>&#9742;&nbsp;&nbsp;${CONTACT.phone}</div>
      <div>&#128172;&nbsp;&nbsp;WhatsApp ${CONTACT.whatsapp}</div>
      <div>&#9993;&nbsp;&nbsp;${CONTACT.email}</div>
      <div>&#127760;&nbsp;&nbsp;${CONTACT.web}</div>
      <div style="color:#9AA3AF;">&#128205;&nbsp;&nbsp;${escapeHtml(CONTACT.address)}</div>
    </div>
  </div>

  <p style="margin-top:24px;font-size:10.5px;color:#6B7280;max-width:130mm;">
    This report is a snapshot in time based on Google PageSpeed Insights (Lighthouse). Re-run it anytime at ${CONTACT.web}/pre-flight-check.
  </p>
</div>

</body>
</html>`;
}

export function buildFooterTemplate(domain: string): string {
  return `
  <div style="width:100%;font-size:9px;font-family:'Space Mono',monospace;color:#6B7280;background:#0B0D10;padding:6px 18mm 0 18mm;display:flex;justify-content:space-between;-webkit-print-color-adjust:exact;">
    <span>WebMinor — Launch Readiness Report — ${escapeHtml(domain)}</span>
    <span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span>
  </div>`;
}
