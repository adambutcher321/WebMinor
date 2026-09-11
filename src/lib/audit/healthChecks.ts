import * as cheerio from 'cheerio';
import { HealthCheckItem } from './types';

const FETCH_TIMEOUT_MS = 10_000;
const USER_AGENT =
  'Mozilla/5.0 (compatible; WebMinorAuditBot/1.0; +https://webminor.com) AppleWebKit/537.36';

async function safeFetch(url: string): Promise<Response | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': USER_AGENT },
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function runOwnHealthChecks(
  targetUrl: string
): Promise<HealthCheckItem[]> {
  const url = new URL(targetUrl);
  const origin = url.origin;

  const [pageRes, robotsRes, sitemapRes] = await Promise.all([
    safeFetch(targetUrl),
    safeFetch(`${origin}/robots.txt`),
    safeFetch(`${origin}/sitemap.xml`),
  ]);

  const checks: HealthCheckItem[] = [];

  checks.push({
    id: 'https',
    label: 'Served over HTTPS',
    source: 'own',
    ...(url.protocol === 'https:' && pageRes && pageRes.ok
      ? { status: 'pass' as const, detail: 'Your site loads securely over HTTPS.' }
      : url.protocol !== 'https:'
        ? {
            status: 'fail' as const,
            detail: 'Your site is not using HTTPS — this hurts trust and Google rankings.',
          }
        : {
            status: 'warn' as const,
            detail: "We couldn't confirm the page loads reliably over HTTPS.",
          }),
  });

  if (!pageRes || !pageRes.ok) {
    checks.push({
      id: 'reachable',
      label: 'Homepage reachable',
      status: 'fail',
      detail: pageRes
        ? `The homepage responded with a ${pageRes.status} status.`
        : "We couldn't load the homepage to check its content.",
      source: 'own',
    });
    checks.push(...robotsSitemapChecks(robotsRes, sitemapRes));
    return checks;
  }

  const html = await pageRes.text();
  const $ = cheerio.load(html);

  const title = $('title').first().text().trim();
  if (!title) {
    checks.push({
      id: 'title',
      label: 'Page title',
      status: 'fail',
      detail: 'No <title> tag was found — this is a basic SEO essential.',
      source: 'own',
    });
  } else if (title.length < 10 || title.length > 65) {
    checks.push({
      id: 'title',
      label: 'Page title',
      status: 'warn',
      detail: `Your title is ${title.length} characters — aim for roughly 10–65 so it doesn't get cut off in search results.`,
      source: 'own',
    });
  } else {
    checks.push({
      id: 'title',
      label: 'Page title',
      status: 'pass',
      detail: `"${title}" — a sensible length for search results.`,
      source: 'own',
    });
  }

  const metaDescription = $('meta[name="description"]').attr('content')?.trim();
  checks.push({
    id: 'meta-description',
    label: 'Meta description',
    status: metaDescription ? 'pass' : 'fail',
    detail: metaDescription
      ? 'A meta description is present for search snippets.'
      : 'No meta description found — Google will guess one from your page instead.',
    source: 'own',
  });

  const viewport = $('meta[name="viewport"]').attr('content');
  checks.push({
    id: 'viewport',
    label: 'Mobile viewport tag',
    status: viewport ? 'pass' : 'fail',
    detail: viewport
      ? 'A viewport tag is set, so mobile browsers scale the page correctly.'
      : 'No viewport meta tag found — the site may not display correctly on phones.',
    source: 'own',
  });

  const h1Count = $('h1').length;
  checks.push({
    id: 'h1',
    label: 'Single H1 heading',
    status: h1Count === 1 ? 'pass' : h1Count === 0 ? 'fail' : 'warn',
    detail:
      h1Count === 1
        ? 'Exactly one H1 heading — good for SEO structure.'
        : h1Count === 0
          ? 'No H1 heading found — search engines rely on this to understand the page.'
          : `${h1Count} H1 headings found — ideally there should be exactly one per page.`,
    source: 'own',
  });

  const images = $('img');
  const totalImages = images.length;
  const missingAlt = images.filter((_, el) => !$(el).attr('alt')?.trim()).length;
  const missingRatio = totalImages > 0 ? missingAlt / totalImages : 0;
  checks.push({
    id: 'image-alt',
    label: 'Images have alt text',
    status:
      totalImages === 0 || missingRatio === 0
        ? 'pass'
        : missingRatio < 0.2
          ? 'warn'
          : 'fail',
    detail:
      totalImages === 0
        ? 'No images found on the homepage.'
        : missingAlt === 0
          ? `All ${totalImages} images have alt text.`
          : `${missingAlt} of ${totalImages} images are missing alt text — this hurts accessibility and image SEO.`,
    source: 'own',
  });

  checks.push(...robotsSitemapChecks(robotsRes, sitemapRes));

  return checks;
}

function robotsSitemapChecks(
  robotsRes: Response | null,
  sitemapRes: Response | null
): HealthCheckItem[] {
  return [
    {
      id: 'robots-txt',
      label: 'robots.txt present',
      status: robotsRes && robotsRes.ok ? 'pass' : 'warn',
      detail:
        robotsRes && robotsRes.ok
          ? 'robots.txt was found.'
          : 'No robots.txt found at the site root — not critical, but recommended.',
      source: 'own',
    },
    {
      id: 'sitemap-xml',
      label: 'sitemap.xml present',
      status: sitemapRes && sitemapRes.ok ? 'pass' : 'warn',
      detail:
        sitemapRes && sitemapRes.ok
          ? 'sitemap.xml was found.'
          : 'No sitemap.xml found at the site root — this helps search engines find all your pages.',
      source: 'own',
    },
  ];
}
