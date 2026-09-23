import * as cheerio from 'cheerio';

/* A small, polite site crawler. It starts at the homepage, adds anything the
   sitemap lists, and follows internal links breadth-first until it has seen
   MAX_PAGES pages or runs out of time. Each page is reduced to the handful of
   facts the checks need; the HTML itself is thrown away. */

export const USER_AGENT =
  'Mozilla/5.0 (compatible; WebMinorHealthCheck/2.0; +https://www.webminor.co.uk/free-website-review)';

const MAX_PAGES = 60;
const CONCURRENCY = 6;
const PAGE_TIMEOUT_MS = 9_000;
const CRAWL_BUDGET_MS = 50_000;
const MAX_HTML_BYTES = 3_000_000;

const SKIP_EXT = /\.(pdf|jpe?g|png|gif|webp|avif|svg|ico|zip|docx?|xlsx?|pptx?|mp4|mov|mp3|webm|css|js|xml|txt|json)$/i;

export interface PageFacts {
  url: string;
  path: string;
  status: number;
  ok: boolean;
  isHtml: boolean;
  ms: number;
  bytes: number;
  compressed: boolean;
  title: string;
  description: string;
  h1s: string[];
  canonical: string | null;
  noindex: boolean;
  viewport: boolean;
  lang: boolean;
  ogImage: boolean;
  words: number;
  /** src is the file a phone would actually download; name is for people. */
  images: { src: string; name: string; alt: string | null }[];
  internalLinks: string[];
  externalLinks: string[];
  scripts: string[];
  telLinks: number;
  mailtoLinks: number;
  forms: number;
  localBusinessSchema: boolean;
  mixedContent: number;
  copyrightYear: number | null;
  privacyLink: boolean;
}

export interface CrawlResult {
  origin: string;
  finalUrl: string;
  pages: PageFacts[];
  /** Every internal URL seen in a link, crawled or not. */
  discovered: Set<string>;
  /** Internal link target → pages that link to it. */
  inbound: Map<string, Set<string>>;
  sitemapUrls: string[];
  sitemapFound: boolean;
  robotsFound: boolean;
  robotsBlocksAll: boolean;
  timedOut: boolean;
}

export async function timedFetch(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), init.timeoutMs ?? PAGE_TIMEOUT_MS);
  try {
    return await fetch(url, {
      redirect: 'follow',
      ...init,
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT, 'Accept-Encoding': 'gzip, br', ...(init.headers ?? {}) },
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Same page for our purposes: no hash, no trailing slash (except root), same host. */
export function normalise(href: string, base: string): string | null {
  try {
    const u = new URL(href, base);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    u.hash = '';
    // Tracking parameters make the same page look like many.
    for (const k of [...u.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|mc_)/i.test(k)) u.searchParams.delete(k);
    }
    if (u.pathname.length > 1 && u.pathname.endsWith('/')) u.pathname = u.pathname.slice(0, -1);
    return u.toString();
  } catch {
    return null;
  }
}

const sameSite = (a: URL, host: string) => a.hostname.replace(/^www\./, '') === host.replace(/^www\./, '');

async function readCapped(res: Response): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done || !value) break;
    chunks.push(value);
    total += value.byteLength;
    if (total > MAX_HTML_BYTES) {
      await reader.cancel();
      break;
    }
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

/* A phone picks from srcset; measuring the plain src (often the largest
   size) would blame the site for a file nobody downloads. Take the smallest
   candidate at least 750px wide — a phone screen at 2x — else the largest. */
function phoneCandidate(srcset: string): string | null {
  const c = srcset
    .split(/,\s+(?=\S)/)
    .map((part) => {
      const [u, d] = part.trim().split(/\s+/);
      const w = d?.endsWith('w') ? parseInt(d) : d?.endsWith('x') ? parseFloat(d) * 400 : 0;
      return { u, w };
    })
    .filter((x) => x.u);
  if (!c.length) return null;
  const big = c.filter((x) => x.w >= 750).sort((a, b) => a.w - b.w);
  return (big[0] ?? c.sort((a, b) => b.w - a.w)[0]).u;
}

/** "apex-shaped-roof.png", not "/_next/image?url=%2Fimages%2Fapex-shaped-roof.png&w=3840". */
function imageName(src: string): string {
  try {
    const u = new URL(src, 'https://x.invalid');
    const inner = u.searchParams.get('url');
    const path = inner ? decodeURIComponent(inner) : u.pathname;
    return path.split('/').filter(Boolean).pop() ?? src;
  } catch {
    return src;
  }
}

function extract(url: string, html: string, host: string): Omit<PageFacts, 'status' | 'ok' | 'isHtml' | 'ms' | 'bytes' | 'compressed' | 'url' | 'path'> {
  const $ = cheerio.load(html);
  const internal = new Set<string>();
  const external = new Set<string>();
  let tel = 0;
  let mailto = 0;
  let privacy = false;

  $('a[href]').each((_, el) => {
    const href = ($(el).attr('href') ?? '').trim();
    if (/^tel:/i.test(href)) return void tel++;
    if (/^mailto:/i.test(href)) return void mailto++;
    const text = `${$(el).text()} ${href}`.toLowerCase();
    if (text.includes('privacy')) privacy = true;
    const n = normalise(href, url);
    if (!n) return;
    const u = new URL(n);
    if (sameSite(u, host)) {
      if (!SKIP_EXT.test(u.pathname)) internal.add(n);
    } else {
      external.add(n);
    }
  });

  const isHttps = url.startsWith('https:');
  let mixed = 0;
  if (isHttps) {
    $('img[src], script[src], link[rel="stylesheet"][href], iframe[src]').each((_, el) => {
      const v = $(el).attr('src') ?? $(el).attr('href') ?? '';
      if (/^http:\/\//i.test(v)) mixed++;
    });
  }

  let localBusiness = false;
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text();
    if (/"@type"\s*:\s*\[?[^\]]*"(LocalBusiness|[A-Za-z]*(Business|Store|Contractor|Service|Plumber|Electrician|Roofer|Dentist|Restaurant|Shop|Agent|Organization))"/.test(raw)) {
      localBusiness = true;
    }
  });

  const bodyText = $('body').clone().find('script,style,noscript,svg').remove().end().text();
  const words = bodyText.split(/\s+/).filter((w) => /[a-z]/i.test(w)).length;

  const yearMatch = [...bodyText.matchAll(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(\d{4})/gi)].map((m) => Number(m[1]));
  const copyrightYear = yearMatch.length ? Math.max(...yearMatch) : null;

  const robots = ($('meta[name="robots"]').attr('content') ?? '').toLowerCase();

  return {
    title: $('head title').first().text().trim().replace(/\s+/g, ' '),
    description: ($('meta[name="description"]').attr('content') ?? '').trim(),
    h1s: $('h1').map((_, el) => $(el).text().trim().replace(/\s+/g, ' ')).get(),
    canonical: $('link[rel="canonical"]').attr('href') ?? null,
    noindex: robots.includes('noindex'),
    viewport: $('meta[name="viewport"]').length > 0,
    lang: Boolean($('html').attr('lang')),
    ogImage: $('meta[property="og:image"]').length > 0,
    words,
    images: $('img')
      .map((_, el) => {
        const src = $(el).attr('src') ?? $(el).attr('data-src') ?? '';
        const chosen = phoneCandidate($(el).attr('srcset') ?? $(el).attr('data-srcset') ?? '') ?? src;
        return { src: chosen, original: src, alt: $(el).attr('alt') ?? null };
      })
      .get()
      .filter((i) => i.src && !i.src.startsWith('data:'))
      .map((i) => ({ src: normalise(i.src, url) ?? i.src, name: imageName(i.original || i.src), alt: i.alt })),
    internalLinks: [...internal],
    externalLinks: [...external],
    scripts: $('script[src]')
      .map((_, el) => normalise($(el).attr('src') ?? '', url))
      .get()
      .filter(Boolean) as string[],
    telLinks: tel,
    mailtoLinks: mailto,
    forms: $('form').length,
    localBusinessSchema: localBusiness,
    mixedContent: mixed,
    copyrightYear,
    privacyLink: privacy,
  };
}

async function fetchPage(url: string, host: string): Promise<PageFacts> {
  const start = Date.now();
  const res = await timedFetch(url);
  const ms = Date.now() - start;
  const path = (() => {
    try {
      const u = new URL(url);
      return u.pathname + u.search;
    } catch {
      return url;
    }
  })();
  const empty = {
    title: '', description: '', h1s: [], canonical: null, noindex: false, viewport: false, lang: false,
    ogImage: false, words: 0, images: [], internalLinks: [], externalLinks: [], scripts: [], telLinks: 0,
    mailtoLinks: 0, forms: 0, localBusinessSchema: false, mixedContent: 0, copyrightYear: null, privacyLink: false,
  };
  if (!res) {
    return { url, path, status: 0, ok: false, isHtml: false, ms, bytes: 0, compressed: false, ...empty };
  }
  const type = res.headers.get('content-type') ?? '';
  const isHtml = type.includes('text/html');
  const compressed = /gzip|br|deflate|zstd/i.test(res.headers.get('content-encoding') ?? '');
  if (!res.ok || !isHtml) {
    await res.body?.cancel().catch(() => {});
    return { url, path, status: res.status, ok: res.ok, isHtml, ms, bytes: 0, compressed, ...empty };
  }
  const html = await readCapped(res);
  // The URL may have redirected; resolve links against where we landed.
  const landed = res.url || url;
  return {
    url,
    path,
    status: res.status,
    ok: true,
    isHtml: true,
    ms,
    bytes: Buffer.byteLength(html),
    compressed,
    ...extract(landed, html, host),
  };
}

/** True when the rules for all user agents ("*") include a bare "Disallow: /". */
function blocksEverything(robots: string): boolean {
  let inStar = false;
  let sawRule = false;
  for (const raw of robots.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    const m = line.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const [, key, value] = m;
    if (/^user-agent$/i.test(key)) {
      if (sawRule) inStar = false;
      sawRule = false;
      if (value.trim() === '*') inStar = true;
    } else {
      sawRule = true;
      if (inStar && /^disallow$/i.test(key) && value.trim() === '/') return true;
    }
  }
  return false;
}

async function readSitemap(origin: string, robotsText: string | null): Promise<{ found: boolean; urls: string[] }> {
  const candidates = new Set<string>([`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`]);
  for (const m of robotsText?.matchAll(/^\s*sitemap:\s*(\S+)/gim) ?? []) candidates.add(m[1]);

  const urls = new Set<string>();
  let found = false;
  const seenMaps = new Set<string>();

  async function read(mapUrl: string, depth: number) {
    if (seenMaps.has(mapUrl) || seenMaps.size > 6) return;
    seenMaps.add(mapUrl);
    const res = await timedFetch(mapUrl, { timeoutMs: 6_000 });
    if (!res || !res.ok) return;
    const xml = await res.text();
    if (!/<(urlset|sitemapindex)/i.test(xml)) return;
    found = true;
    const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1].replace(/&amp;/g, '&'));
    if (/<sitemapindex/i.test(xml) && depth < 1) {
      for (const loc of locs.slice(0, 4)) await read(loc, depth + 1);
    } else {
      for (const loc of locs) if (urls.size < 500) urls.add(loc);
    }
  }

  for (const c of candidates) {
    await read(c, 0);
    if (found) break;
  }
  return { found, urls: [...urls] };
}

export async function crawlSite(startUrl: string): Promise<CrawlResult> {
  const deadline = Date.now() + CRAWL_BUDGET_MS;

  // Land on the real homepage first — http→https and bare→www redirects
  // decide which host counts as "this site".
  let first = await timedFetch(startUrl, { timeoutMs: 12_000 });
  // If the address as typed is broken, try the www / non-www twin before
  // giving up — the checks report the broken one separately.
  if (!first || first.status >= 500) {
    await first?.body?.cancel().catch(() => {});
    const u = new URL(startUrl);
    u.hostname = u.hostname.startsWith('www.') ? u.hostname.slice(4) : `www.${u.hostname}`;
    const twin = await timedFetch(u.toString(), { timeoutMs: 12_000 });
    if (twin && twin.ok) first = twin;
    else await twin?.body?.cancel().catch(() => {});
  }
  if (!first) throw new Error('unreachable');
  await first.body?.cancel().catch(() => {});
  const finalUrl = first.url || startUrl;
  const origin = new URL(finalUrl).origin;
  const host = new URL(finalUrl).hostname;

  const robotsRes = await timedFetch(`${origin}/robots.txt`, { timeoutMs: 6_000 });
  const robotsText = robotsRes && robotsRes.ok && (robotsRes.headers.get('content-type') ?? '').includes('text') ? await robotsRes.text() : null;
  if (robotsRes && !robotsText) await robotsRes.body?.cancel().catch(() => {});
  const robotsBlocksAll = robotsText ? blocksEverything(robotsText) : false;

  const sitemap = await readSitemap(origin, robotsText);

  const home = normalise(finalUrl, finalUrl)!;
  const queue: string[] = [home];
  const queued = new Set<string>([home]);
  for (const u of sitemap.urls) {
    const n = normalise(u, origin);
    if (n && sameSite(new URL(n), host) && !queued.has(n)) {
      queue.push(n);
      queued.add(n);
    }
  }

  const pages: PageFacts[] = [];
  const discovered = new Set<string>(queued);
  const inbound = new Map<string, Set<string>>();
  let timedOut = false;

  async function worker() {
    while (queue.length && pages.length < MAX_PAGES) {
      if (Date.now() > deadline) {
        timedOut = true;
        return;
      }
      const next = queue.shift()!;
      const facts = await fetchPage(next, host);
      if (pages.length >= MAX_PAGES) return;
      pages.push(facts);
      for (const link of facts.internalLinks) {
        discovered.add(link);
        if (!inbound.has(link)) inbound.set(link, new Set());
        inbound.get(link)!.add(facts.url);
        if (!queued.has(link)) {
          queued.add(link);
          queue.push(link);
        }
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // Workers finish in any order; the checks treat pages[0] as the homepage.
  pages.sort((a, b) => (a.url === home ? -1 : b.url === home ? 1 : 0));

  return {
    origin,
    finalUrl,
    pages,
    discovered,
    inbound,
    sitemapUrls: sitemap.urls,
    sitemapFound: sitemap.found,
    robotsFound: Boolean(robotsText),
    robotsBlocksAll,
    timedOut,
  };
}
