import { createHmac, timingSafeEqual } from 'node:crypto';
import { crawlSite } from './crawl';
import { runChecks } from './checks';
import { runSpeedTest } from './speed';
import { lookupDomain } from './domain';
import { AuditError, type CategoryId, type CategoryScore, type Issue, type SiteReport } from './types';

const WEIGHT = { error: 12, warning: 5, notice: 1.5 } as const;
const SEVERITY_ORDER = { error: 0, warning: 1, notice: 2 } as const;

/** Issues about the site as a whole rather than a share of its pages. */
const SITE_WIDE = new Set([
  'https', 'http-redirect', 'alt-host', 'psi', 'domain-expiry', 'js-only', 'soft-404', 'robots', 'robots-block', 'sitemap', 'viewport', 'tel',
  'tel-home', 'contact', 'schema', 'privacy', 'copyright', 'og', 'lang', 'image-format',
]);

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  found: 'Being found on Google',
  pages: 'How your pages show in search',
  speed: 'Speed on a phone',
  links: 'Links that work',
  trust: 'Trust and getting in touch',
};

function penalty(i: Issue, pages: number): number {
  const share = SITE_WIDE.has(i.id) ? 1 : Math.min(1, i.count / Math.max(pages, 1));
  return WEIGHT[i.severity] * (0.4 + 0.6 * share);
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function band(score: number): SiteReport['band'] {
  return score >= 85 ? 'strong' : score >= 70 ? 'fair' : score >= 50 ? 'weak' : 'poor';
}

function headline(score: number, issues: Issue[]): string {
  const errors = issues.filter((i) => i.severity === 'error').length;
  const top = issues[0];
  switch (band(score)) {
    case 'strong':
      return errors
        ? `A well-built site with ${errors === 1 ? 'one thing' : `${errors} things`} worth fixing soon.`
        : 'A well-built site. What’s left is polish, not problems.';
    case 'fair':
      return `A decent site that’s losing some customers it shouldn’t${top ? `, mostly through ${top.title.toLowerCase()}` : ''}.`;
    case 'weak':
      return 'The site is holding the business back. The fixes on the next page would make the biggest difference.';
    default:
      return 'The site is likely costing you work. It needs fixing or replacing before it’s worth spending on advertising.';
  }
}

function secret(): string {
  return process.env.AUDIT_SIGNING_SECRET ?? process.env.RESEND_API_KEY ?? 'webminor-dev-only';
}

function sign(report: Omit<SiteReport, 'signature'>): string {
  return createHmac('sha256', secret()).update(JSON.stringify(report)).digest('hex');
}

/** True if this report came from our own server, unchanged. */
export function verifyReport(report: SiteReport): boolean {
  if (!report || typeof report.signature !== 'string') return false;
  const { signature, ...rest } = report;
  const expected = Buffer.from(sign(rest), 'hex');
  const given = Buffer.from(signature, 'hex');
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export async function runAudit(url: URL): Promise<SiteReport> {
  const speedPromise = runSpeedTest(url.toString());
  const domainPromise = lookupDomain(url.hostname);

  let crawl;
  try {
    crawl = await crawlSite(url.toString());
  } catch {
    throw new AuditError(
      `We couldn’t reach ${url.hostname}. Check the address is right and the site is online.`,
      400,
    );
  }
  const html = crawl.pages.filter((p) => p.ok && p.isHtml);
  if (html.length === 0) {
    throw new AuditError(
      `${url.hostname} answered, but we couldn’t read any pages on it. It may be blocking automated checks.`,
      422,
    );
  }

  const [{ issues, passes, limits }, speed, domainInfo] = await Promise.all([runChecks(crawl), speedPromise, domainPromise]);

  // Speed findings from Google's test join the issue list.
  if (speed) {
    const poor = speed.metrics.filter((m) => m.band === 'poor');
    if (speed.score < 50 || poor.length) {
      issues.push({
        id: 'psi',
        category: 'speed',
        severity: speed.score < 50 ? 'error' : 'warning',
        title: `Slow on a phone: Google scores it ${speed.score} out of 100`,
        why: 'Google tested the homepage on a mid-range phone over mobile data. Every extra second of waiting on a phone loses people who were about to ring you.',
        fix: 'Start with the heaviest images and any plugins or chat widgets you don’t need. The speed table shows where the time goes.',
        count: 1,
        examples: poor.map((m) => `${m.label}: ${m.display} (Google wants ${m.target})`),
      });
    } else if (speed.score >= 90) {
      passes.push(`Fast on a phone: Google scores it ${speed.score} out of 100.`);
    }
  }

  if (domainInfo.expires) {
    const days = (new Date(domainInfo.expires).getTime() - Date.now()) / 86_400_000;
    if (days < 60) {
      issues.push({
        id: 'domain-expiry',
        category: 'trust',
        severity: days < 14 ? 'error' : 'warning',
        title: `Your web address expires in ${Math.max(0, Math.round(days))} days`,
        why: 'If it lapses, the website and any email on it stop working, and someone else can buy the name.',
        fix: 'Renew it now, and turn on auto-renew with whoever you registered it through.',
        count: 1,
        examples: [new Date(domainInfo.expires).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })],
      });
    }
  }

  issues.sort(
    (a, b) =>
      SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
      penalty(b, html.length) - penalty(a, html.length),
  );

  const technical = clamp(100 - issues.reduce((s, i) => s + penalty(i, html.length), 0));
  const score = speed ? clamp(technical * 0.7 + speed.score * 0.3) : technical;

  const shell = issues.some((i) => i.id === 'js-only');
  const untested = new Set<CategoryId>([...(speed ? [] : (['speed'] as const)), ...(shell ? (['pages', 'links'] as const) : [])]);
  const categories: CategoryScore[] = (Object.keys(CATEGORY_LABELS) as CategoryId[]).map((id) => {
    const own = issues.filter((i) => i.category === id);
    let s = clamp(100 - own.reduce((t, i) => t + penalty(i, html.length) * 1.6, 0));
    if (id === 'speed' && speed) s = clamp((s + speed.score) / 2);
    return {
      id,
      label: CATEGORY_LABELS[id],
      score: s,
      tested: !untested.has(id),
      errors: own.filter((i) => i.severity === 'error').length,
      warnings: own.filter((i) => i.severity === 'warning').length,
      notices: own.filter((i) => i.severity === 'notice').length,
    };
  });

  const report: Omit<SiteReport, 'signature'> = {
    version: 2,
    domain: new URL(crawl.finalUrl).hostname,
    finalUrl: crawl.finalUrl,
    fetchedAt: new Date().toISOString(),
    score,
    band: band(score),
    headline: headline(score, issues),
    pagesChecked: html.length,
    linksFound: crawl.discovered.size,
    counts: {
      error: issues.filter((i) => i.severity === 'error').length,
      warning: issues.filter((i) => i.severity === 'warning').length,
      notice: issues.filter((i) => i.severity === 'notice').length,
    },
    categories,
    issues,
    passes,
    limits,
    speed,
    domainInfo,
  };

  return { ...report, signature: sign(report) };
}
