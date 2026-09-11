import { CategoryScores, CoreWebVital } from '@/lib/audit/types';
import { SCORE_COLORS, scoreColor } from '@/lib/audit/grade';

// The PDF template renders these strings via Puppeteer's page.setContent() —
// unlike JSX, nothing here is auto-escaped. Every piece of dynamic text
// (domains, PageSpeed audit titles/descriptions, etc.) MUST pass through this
// before being interpolated into any HTML/SVG string.
export function escapeHtml(value: string | number): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function bandColor(band: CoreWebVital['band']): string {
  if (band === 'good') return SCORE_COLORS.good;
  if (band === 'needs-improvement') return SCORE_COLORS.amber;
  return SCORE_COLORS.poor;
}

export function radialGauge(score: number, grade: string, size = 300): string {
  const stroke = size * 0.075;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const dash = c * pct;
  const color = scoreColor(score);
  const center = size / 2;

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${center}" cy="${center}" r="${r}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="${stroke}" />
    <circle
      cx="${center}" cy="${center}" r="${r}" fill="none"
      stroke="${color}" stroke-width="${stroke}" stroke-linecap="round"
      stroke-dasharray="${dash} ${c - dash}"
      transform="rotate(-90 ${center} ${center})"
    />
    <text x="${center}" y="${center - size * 0.02}" text-anchor="middle" dominant-baseline="middle" font-family="Sora, sans-serif" font-weight="700" font-size="${size * 0.32}" fill="#F5F7FA">${escapeHtml(grade)}</text>
    <text x="${center}" y="${center + size * 0.19}" text-anchor="middle" dominant-baseline="middle" font-family="'Space Mono', monospace" font-size="${size * 0.075}" fill="#9AA3AF">${score}/100</text>
  </svg>`;
}

export function radarChart(categories: CategoryScores, size = 360): string {
  const labels = ['Performance', 'Accessibility', 'Best Practices', 'SEO'];
  const values = [
    categories.performance ?? 0,
    categories.accessibility ?? 0,
    categories.bestPractices ?? 0,
    categories.seo ?? 0,
  ];
  const center = size / 2;
  const radius = size * 0.28;
  const angles = [-90, 0, 90, 180].map((d) => (d * Math.PI) / 180);
  const rings = [25, 50, 75, 100];

  const pt = (angle: number, value: number): [number, number] => {
    const rr = radius * (value / 100);
    return [center + rr * Math.cos(angle), center + rr * Math.sin(angle)];
  };

  const gridPolys = rings
    .map((ringVal) => {
      const pts = angles.map((a) => pt(a, ringVal).join(',')).join(' ');
      return `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
    })
    .join('');

  const axisLines = angles
    .map((a) => {
      const [x, y] = pt(a, 100);
      return `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;
    })
    .join('');

  const dataPts = angles.map((a, i) => pt(a, values[i]));
  const dataPolyPts = dataPts.map((p) => p.join(',')).join(' ');
  const dots = dataPts
    .map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="6" fill="${scoreColor(values[i])}" stroke="#0B0D10" stroke-width="2"/>`)
    .join('');

  const labelPts = angles
    .map((a, i) => {
      const [x, y] = pt(a, 132);
      return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="'Space Mono', monospace" font-size="13" fill="#9AA3AF">${escapeHtml(labels[i])}</text>`;
    })
    .join('');

  const valuePts = angles
    .map((a, i) => {
      const [x, y] = pt(a, 108);
      return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="Sora, sans-serif" font-weight="700" font-size="15" fill="${scoreColor(values[i])}">${Math.round(values[i])}</text>`;
    })
    .join('');

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${gridPolys}${axisLines}
    <polygon points="${dataPolyPts}" fill="#40E0FF" fill-opacity="0.16" stroke="#40E0FF" stroke-width="2.5"/>
    ${dots}${labelPts}${valuePts}
  </svg>`;
}

export function cwvBar(cwv: CoreWebVital, width = 500, height = 56): string {
  const scaleMax = cwv.id === 'cls' ? cwv.thresholds.poor * 1.6 : cwv.thresholds.poor * 1.5;
  const goodFrac = cwv.thresholds.good / scaleMax;
  const okFrac = cwv.thresholds.poor / scaleMax - goodFrac;
  const barY = height * 0.58;
  const barH = 16;
  const goodW = width * goodFrac;
  const okW = width * okFrac;
  const poorW = width - goodW - okW;
  const posFrac = Math.max(0.01, Math.min(0.99, cwv.numericValue / scaleMax));
  const markerX = width * posFrac;
  const color = bandColor(cwv.band);

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <text x="0" y="14" font-family="Sora, sans-serif" font-size="14" font-weight="600" fill="#F5F7FA">${escapeHtml(cwv.label)}</text>
    <text x="${width}" y="14" text-anchor="end" font-family="'Space Mono', monospace" font-size="14" font-weight="700" fill="${color}">${escapeHtml(cwv.displayValue)}</text>
    <rect x="0" y="${barY}" width="${goodW}" height="${barH}" rx="3" fill="${SCORE_COLORS.good}" fill-opacity="0.3"/>
    <rect x="${goodW}" y="${barY}" width="${okW}" height="${barH}" fill="${SCORE_COLORS.amber}" fill-opacity="0.3"/>
    <rect x="${goodW + okW}" y="${barY}" width="${poorW}" height="${barH}" rx="3" fill="${SCORE_COLORS.poor}" fill-opacity="0.3"/>
    <rect x="${markerX - 2.5}" y="${barY - 5}" width="5" height="${barH + 10}" rx="2.5" fill="#F5F7FA"/>
  </svg>`;
}

export function savingsBarChart(
  fixes: { title: string; savingsMs: number }[],
  width = 500
): string {
  const rowH = 40;
  const maxSavings = Math.max(...fixes.map((f) => f.savingsMs), 1);

  const rows = fixes
    .map((f, i) => {
      const y = i * rowH;
      const barW = Math.max(8, (f.savingsMs / maxSavings) * width);
      const savingsLabel = f.savingsMs >= 1000 ? `${(f.savingsMs / 1000).toFixed(1)}s saved` : `${f.savingsMs}ms saved`;
      return `
      <text x="0" y="${y + 13}" font-family="Sora, sans-serif" font-size="13" font-weight="600" fill="#F5F7FA">${escapeHtml(f.title)}</text>
      <text x="${width}" y="${y + 13}" text-anchor="end" font-family="'Space Mono', monospace" font-size="12" fill="#40E0FF">${escapeHtml(savingsLabel)}</text>
      <rect x="0" y="${y + 20}" width="${width}" height="10" rx="5" fill="rgba(255,255,255,0.06)"/>
      <rect x="0" y="${y + 20}" width="${barW}" height="10" rx="5" fill="#40E0FF"/>
      `;
    })
    .join('');

  const totalH = fixes.length * rowH;
  return `<svg width="${width}" height="${totalH}" viewBox="0 0 ${width} ${totalH}">${rows}</svg>`;
}

export function donutChart(pass: number, warn: number, fail: number, size = 240): string {
  const total = pass + warn + fail || 1;
  const stroke = size * 0.13;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const center = size / 2;

  const segments = [
    { value: pass, color: SCORE_COLORS.good },
    { value: warn, color: SCORE_COLORS.amber },
    { value: fail, color: SCORE_COLORS.poor },
  ].filter((s) => s.value > 0);

  let offsetFrac = 0;
  const arcs = segments
    .map((seg) => {
      const frac = seg.value / total;
      const dash = c * frac;
      const gap = c - dash;
      const rotateDeg = -90 + offsetFrac * 360;
      offsetFrac += frac;
      return `<circle cx="${center}" cy="${center}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="${stroke}" stroke-dasharray="${dash} ${gap}" transform="rotate(${rotateDeg} ${center} ${center})"/>`;
    })
    .join('');

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${center}" cy="${center}" r="${r}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${stroke}"/>
    ${arcs}
    <text x="${center}" y="${center - size * 0.03}" text-anchor="middle" dominant-baseline="middle" font-family="Sora, sans-serif" font-size="${size * 0.17}" font-weight="700" fill="#F5F7FA">${total}</text>
    <text x="${center}" y="${center + size * 0.14}" text-anchor="middle" dominant-baseline="middle" font-family="'Space Mono', monospace" font-size="${size * 0.055}" letter-spacing="1" fill="#9AA3AF">CHECKS</text>
  </svg>`;
}
