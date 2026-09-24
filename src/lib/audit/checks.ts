import type { CrawlResult, PageFacts } from './crawl';
import { timedFetch } from './crawl';
import type { Issue, Severity, CategoryId } from './types';

/* Every check reads the crawl and returns zero or one Issue. Wording rules:
   say what's wrong in words a shop owner uses, say what it costs them, say
   what to do. No "H1", "4XX" or "canonical" in a title without explaining it. */

const EXAMPLES = 6;
const BIG_IMAGE_BYTES = 400_000;
const BIG_SCRIPT_BYTES = 500_000;

type Found = { issues: Issue[]; passes: string[]; limits: string[] };

function issue(
  id: string,
  category: CategoryId,
  severity: Severity,
  title: string,
  why: string,
  fix: string,
  items: string[],
): Issue {
  return { id, category, severity, title, why, fix, count: items.length, examples: items.slice(0, EXAMPLES) };
}

const pathOf = (url: string) => {
  try {
    const u = new URL(url);
    return u.pathname + u.search || '/';
  } catch {
    return url;
  }
};

/** Group pages by a value and return the pages whose value is shared. */
function duplicates(pages: PageFacts[], key: (p: PageFacts) => string): string[] {
  const groups = new Map<string, Set<string>>();
  for (const p of pages) {
    const k = key(p).toLowerCase();
    if (!k) continue;
    groups.set(k, (groups.get(k) ?? new Set()).add(p.path));
  }
  return [...groups.values()].filter((g) => g.size > 1).flatMap((g) => [...g]);
}

/** HEAD first, GET if the server refuses HEAD. Returns status, 0 for no answer. */
// Ask the way a phone browser asks, so image services can send WebP/AVIF.
const ACCEPT = { Accept: 'image/avif,image/webp,image/*,text/html;q=0.9,*/*;q=0.8' };

async function probe(url: string): Promise<{ status: number; bytes: number | null }> {
  let res = await timedFetch(url, { method: 'HEAD', timeoutMs: 7_000, headers: ACCEPT });
  // Plenty of servers answer HEAD wrongly (Google's help pages say 404), so
  // anything but a clean success gets a second, real request.
  if (!res || res.status >= 400) {
    res = await timedFetch(url, { method: 'GET', timeoutMs: 7_000, headers: { ...ACCEPT, Range: 'bytes=0-0' } });
    await res?.body?.cancel().catch(() => {});
  }
  if (!res) return { status: 0, bytes: null };
  const range = res.headers.get('content-range');
  const len = range ? Number(range.split('/')[1]) : Number(res.headers.get('content-length'));
  return { status: res.status, bytes: Number.isFinite(len) && len > 0 ? len : null };
}

async function pool<T, R>(items: T[], n: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}

export async function runChecks(crawl: CrawlResult): Promise<Found> {
  const issues: Issue[] = [];
  const passes: string[] = [];
  const limits: string[] = [];
  const add = (i: Issue | null) => i && i.count > 0 && issues.push(i);

  const html = crawl.pages.filter((p) => p.ok && p.isHtml);
  const indexable = html.filter((p) => !p.noindex);
  const home = html[0];
  const origin = crawl.origin;
  const host = new URL(origin).hostname.replace(/^www\./, '');

  /* A site built entirely in JavaScript sends an empty shell and fills it in
     the browser. We read what arrives, as most search engines and every link
     preview do, so on such a site anything about page content would be a
     guess. Say so once, loudly, and skip those checks. */
  const words = html.map((p) => p.words).sort((a, b) => a - b);
  const medianWords = words[Math.floor(words.length / 2)] ?? 0;
  const avgLinks = html.reduce((t, p) => t + p.internalLinks.length, 0) / Math.max(html.length, 1);
  const shell = medianWords < 30 && avgLinks < 2;
  if (shell) {
    add(issue('js-only', 'found', 'error', 'Your pages are blank until code runs in the browser',
      'The site sends an empty page and builds it with JavaScript afterwards. Google can usually cope, but slowly and not always; Bing, AI assistants like ChatGPT, and Facebook or WhatsApp link previews mostly see a blank page.',
      'Have the site render its pages on the server ("server-side rendering" or "static generation"), so the words arrive with the page.',
      html.slice(0, 1).map((p) => `${p.path} (${p.words} words in the page as sent)`)));
    limits.push('Your pages arrive empty and are filled in by JavaScript, so we couldn’t check headings, wording, phone links, contact forms or links between pages. The issues below are the ones we could see.');
  }

  // ── Can people and Google reach it ───────────────────────────────────────

  const [httpRes, altHostRes, missingRes] = await Promise.all([
    timedFetch(`http://${new URL(origin).hostname}/`, { timeoutMs: 8_000 }),
    timedFetch(
      `https://${new URL(origin).hostname.startsWith('www.') ? host : `www.${host}`}/`,
      { timeoutMs: 8_000 },
    ),
    timedFetch(`${origin}/this-page-should-not-exist-${Date.now().toString(36)}`, { timeoutMs: 8_000 }),
  ]);
  for (const r of [httpRes, altHostRes, missingRes]) await r?.body?.cancel().catch(() => {});

  if (!origin.startsWith('https:')) {
    add(issue('https', 'trust', 'error', 'Your site isn’t secure (no padlock)',
      'Chrome labels the site "Not secure" in the address bar, which puts people off before they’ve read a word, and Google ranks secure sites above it.',
      'Install an SSL certificate — most hosts include one free — and send every visitor to the https:// address.',
      ['/']));
  } else {
    passes.push('The site is secure: it loads over https with a padlock.');
    if (httpRes && !httpRes.url.startsWith('https:')) {
      add(issue('http-redirect', 'trust', 'warning', 'The insecure address doesn’t redirect to the secure one',
        'Anyone who types or follows the old http:// address gets the "Not secure" version of your site.',
        'Add a permanent (301) redirect from http:// to https://.',
        [`http://${new URL(origin).hostname}/`]));
    }
  }

  if (!altHostRes || !altHostRes.ok) {
    const alt = new URL(origin).hostname.startsWith('www.') ? host : `www.${host}`;
    const status = altHostRes ? altHostRes.status : 0;
    add(issue('alt-host', 'found', status >= 500 || status === 0 ? 'error' : 'warning', `${alt} shows an error`,
      `Some people type the address with "www." and some without. Anyone who types ${alt} currently gets ${status ? `an error page (code ${status})` : 'nothing at all'} instead of your website.`,
      `Fix ${alt} so it redirects to the working address — usually a DNS or SSL setting with your host.`,
      [`${alt}${status ? ` (${status})` : ''}`]));
  }

  if (missingRes && missingRes.status === 200) {
    add(issue('soft-404', 'found', 'notice', 'Missing pages don’t say they’re missing',
      'A mistyped or deleted address shows a normal page instead of "not found", so Google can end up listing pages that don’t really exist.',
      'Make the server return a proper 404 "page not found" status for addresses that don’t exist.',
      ['/any-address-that-does-not-exist']));
  }

  if (!crawl.robotsFound) {
    add(issue('robots', 'found', 'notice', 'No robots.txt file',
      'It’s the file search engines read first to learn how to crawl the site. Without it they manage, but you lose the chance to point them at your sitemap.',
      'Add a short robots.txt at the root of the site that allows everything and names your sitemap.',
      ['/robots.txt']));
  } else if (crawl.robotsBlocksAll) {
    add(issue('robots-block', 'found', 'error', 'robots.txt tells Google to stay away',
      'The site is asking every search engine not to read any page. That alone can keep you out of Google entirely.',
      'Remove the "Disallow: /" line for all user agents — it’s usually left over from when the site was being built.',
      ['/robots.txt']));
  } else {
    passes.push('A robots.txt file is in place.');
  }

  if (!crawl.sitemapFound) {
    add(issue('sitemap', 'found', 'warning', 'No sitemap',
      'A sitemap is the list of pages you want Google to know about. Without one, new or deeply-linked pages can take much longer to show up in search.',
      'Generate an XML sitemap (most website builders have a switch for it) and submit it in Google Search Console.',
      ['/sitemap.xml']));
  } else {
    passes.push(`A sitemap lists ${crawl.sitemapUrls.length} page${crawl.sitemapUrls.length === 1 ? '' : 's'} for Google.`);
  }

  add(issue('noindex', 'found', 'warning', 'Pages hidden from Google',
    'These pages carry a "noindex" tag, which tells Google not to show them in search. That’s right for a thank-you page, wrong for a service page.',
    'Check each one: if you want it found, remove the noindex tag.',
    html.filter((p) => p.noindex).map((p) => p.path)));

  const brokenPages = crawl.pages.filter((p) => p.status >= 400 || p.status === 0);
  const brokenInternal = brokenPages.map((p) => {
    const from = [...(crawl.inbound.get(p.url) ?? [])].map(pathOf);
    return `${p.path}${p.status ? ` (${p.status})` : ' (no answer)'}${from.length ? ` — linked from ${from[0]}` : ''}`;
  });
  add(issue('broken-internal', 'links', 'error', 'Links to your own pages that go nowhere',
    'A visitor clicks, gets an error page and usually leaves. Google also reads broken links as a sign the site isn’t looked after.',
    'Fix each link to point at the right page, or redirect the old address to its replacement.',
    brokenInternal));

  // ── Page by page: what shows in Google ───────────────────────────────────

  if (!shell) {
  add(issue('title-missing', 'pages', 'error', 'Pages with no title',
    'The title is the blue headline in Google’s results. Without one, Google invents something, and it’s rarely what you’d choose.',
    'Give every page a title saying what it is and where, e.g. "Roller blinds in Saltash | Your Business".',
    indexable.filter((p) => !p.title).map((p) => p.path)));

  add(issue('title-duplicate', 'pages', 'error', 'Pages sharing the same title',
    'When several pages have the same headline in Google, it can’t tell which one to show, so often it shows none of them well.',
    'Write a different title for each page that names what’s on it.',
    duplicates(indexable, (p) => p.title)));

  add(issue('title-long', 'pages', 'notice', 'Titles too long for Google',
    'Google cuts titles off at around 60 characters, so the end of these — often your business name or town — never gets seen.',
    'Trim each to about 55–60 characters, with the important words first.',
    indexable.filter((p) => p.title.length > 65).map((p) => `${p.path} (${p.title.length} characters)`)));

  add(issue('title-short', 'pages', 'notice', 'Titles too short to say much',
    'A title like "Home" or "Services" wastes the most valuable line you get in Google.',
    'Say what the page offers and where: "Emergency plumber in Plymouth" beats "Services".',
    indexable.filter((p) => p.title && p.title.length < 20).map((p) => `${p.path} ("${p.title}")`)));

  add(issue('desc-missing', 'pages', 'warning', 'Pages with no description',
    'The description is the two lines of grey text under your headline in Google. Without one, Google grabs a random bit of the page.',
    'Write one or two sentences per page that say what you do and give people a reason to click.',
    indexable.filter((p) => !p.description).map((p) => p.path)));

  add(issue('desc-duplicate', 'pages', 'warning', 'Pages sharing the same description',
    'Identical snippets make your pages look interchangeable in search results.',
    'Give each page its own description.',
    duplicates(indexable, (p) => p.description)));

  add(issue('desc-long', 'pages', 'notice', 'Descriptions that get cut off',
    'Google shows roughly 155 characters; anything after that is replaced with "…".',
    'Keep descriptions to about 150 characters.',
    indexable.filter((p) => p.description.length > 165).map((p) => `${p.path} (${p.description.length} characters)`)));

  add(issue('h1-missing', 'pages', 'warning', 'Pages with no main heading',
    'The main heading (the "H1") is how both visitors and Google work out what a page is about at a glance.',
    'Give every page one clear main heading that matches what people search for.',
    indexable.filter((p) => p.h1s.length === 0).map((p) => p.path)));

  add(issue('h1-multiple', 'pages', 'notice', 'Pages with more than one main heading',
    'Several main headings blur what the page is about.',
    'Keep one main heading per page and make the others sub-headings.',
    indexable.filter((p) => p.h1s.length > 1).map((p) => `${p.path} (${p.h1s.length})`)));

  add(issue('thin', 'pages', 'warning', 'Pages with very little on them',
    'Pages with under 150 words rarely rank: there isn’t enough for Google to understand, or for a customer to be convinced by.',
    'Add what a customer would ask: what’s included, prices or a guide, areas covered, photos of real jobs.',
    indexable
      .filter((p) => p.words < 150 && !/contact|thank|privacy|cookie|terms|login|cart|basket|checkout/i.test(p.path))
      .map((p) => `${p.path} (${p.words} words)`)));

  }

  // ── Links ────────────────────────────────────────────────────────────────

  const inboundCount = (u: string) => crawl.inbound.get(u)?.size ?? 0;
  if (!shell && html.length >= 8) {
    add(issue('orphan', 'links', 'notice', 'Pages that are hard to find from the rest of the site',
      'These pages are linked from only one other page, so few visitors find them and Google treats them as unimportant.',
      'Link to them from the menu, the footer or related pages.',
      html.filter((p) => p !== home && Math.max(inboundCount(p.url), inboundCount(p.landed)) <= 1).map((p) => p.path)));
  }

  const externals = [...new Set(html.flatMap((p) => p.externalLinks))]
    .filter((u) => !/(facebook|instagram|twitter|x\.com|linkedin|youtube|tiktok|google\.[a-z.]+\/maps|goo\.gl|wa\.me|whatsapp)/i.test(u))
    .slice(0, 40);
  const externalStatus = await pool(externals, 8, (u) => probe(u));
  add(issue('broken-external', 'links', 'warning', 'Links to other websites that no longer work',
    'Dead links to suppliers, accreditations or partners make the site look abandoned.',
    'Update or remove them.',
    externals.filter((_, i) => [404, 410].includes(externalStatus[i].status)).map((u) => {
      const from = html.find((p) => p.externalLinks.includes(u));
      return `${u}${from ? ` — on ${from.path}` : ''}`;
    })));

  // ── Speed-related things we can see ourselves ────────────────────────────

  const images = [...new Map(html.flatMap((p) => p.images.map((i) => [i.src, { ...i, page: p.path }]))).values()];
  const imageSizes = await pool(images.slice(0, 80), 10, (i) => probe(i.src));
  const bigImages = images
    .slice(0, 80)
    .map((img, i) => ({ img, bytes: imageSizes[i].bytes }))
    .filter((x) => (x.bytes ?? 0) > BIG_IMAGE_BYTES)
    .sort((a, b) => (b.bytes ?? 0) - (a.bytes ?? 0));
  add(issue('big-images', 'speed', 'warning', 'Images that are too heavy',
    'Each of these is over 400 KB. On a phone signal that’s seconds of waiting, and most people won’t wait.',
    'Resize images to the size they’re shown at and save them as WebP. They usually shrink to a fraction of the size with no visible difference.',
    bigImages.map((x) => `${x.img.name} (${x.bytes! >= 1_000_000 ? `${(x.bytes! / 1_000_000).toFixed(1)} MB` : `${Math.round(x.bytes! / 1000)} KB`}) — on ${x.img.page}`)));

  const oldFormats = images.filter((i) => /\.(jpe?g|png)$/i.test(i.name) && !/[?&]url=/.test(i.src));
  if (images.length >= 5 && oldFormats.length / images.length > 0.6) {
    add(issue('image-format', 'speed', 'notice', 'Images in older, heavier formats',
      'Most images are JPEG or PNG. Modern formats like WebP or AVIF look the same at a fraction of the size.',
      'Convert images to WebP, or use a site platform that does it automatically.',
      oldFormats.map((i) => i.name)));
  }

  add(issue('alt-missing', 'pages', 'notice', 'Images with no description',
    'Screen readers used by blind visitors read these out as nothing, and Google Images can’t tell what they show.',
    'Add a short description ("alt text") to each: "Oak shutters fitted in a bay window in Saltash". Purely decorative images should say alt="" instead.',
    // Only a missing alt attribute counts: alt="" is the correct way to mark a
    // decorative image (a background still, a divider) and must not be flagged.
    [...new Set(html.flatMap((p) => p.images.filter((i) => i.alt === null).map(() => p.path)))]
      .map((path) => {
        const n = html.find((p) => p.path === path)!.images.filter((i) => i.alt === null).length;
        return `${path} (${n} image${n === 1 ? '' : 's'})`;
      })));

  add(issue('uncompressed', 'speed', 'notice', 'Pages sent without compression',
    'The server sends pages at full size instead of zipped, so they take longer to arrive.',
    'Turn on gzip or Brotli compression on the server — usually a single setting.',
    html.filter((p) => !p.compressed && p.bytes > 20_000).map((p) => p.path)));

  add(issue('slow-server', 'speed', 'warning', 'Pages slow to start loading',
    'These took over two seconds just for the server to answer, before anything had appeared on screen.',
    'Usually a sign of slow or overloaded hosting, or a site doing too much work per page.',
    html.filter((p) => p.ms > 2_000).map((p) => `${p.path} (${(p.ms / 1000).toFixed(1)}s)`)));

  const scripts = [...new Set(html.flatMap((p) => p.scripts))].filter((s) => new URL(s).hostname.replace(/^www\./, '') === host).slice(0, 30);
  const scriptSizes = await pool(scripts, 8, (s) => probe(s));
  add(issue('big-scripts', 'speed', 'notice', 'Heavy code files',
    'These scripts are over 500 KB each. The phone has to download and run them before the page responds to taps.',
    'Remove plugins you don’t use, and ask your developer to split or trim the rest.',
    scripts.filter((_, i) => (scriptSizes[i].bytes ?? 0) > BIG_SCRIPT_BYTES).map((s, i) => `${pathOf(s).split('/').pop()} (${((scriptSizes[i].bytes ?? 0) / 1_000_000).toFixed(1)} MB)`)));

  // ── Trust: the things that make a local customer pick up the phone ──────

  if (home) {
    if (!home.viewport) {
      add(issue('viewport', 'trust', 'error', 'Not set up for phones',
        'Without a mobile viewport setting, phones show a shrunk-down desktop page that people have to pinch and zoom. Most of your visitors are on a phone.',
        'Add the standard viewport tag, or move to a platform built for mobile.',
        ['/']));
    } else {
      passes.push('The site is set up for phones.');
    }

    const anyTel = html.some((p) => p.telLinks > 0);
    if (shell) {
      // Content checks skipped; see limits.
    } else if (!anyTel) {
      add(issue('tel', 'trust', 'warning', 'Your phone number isn’t tappable',
        'On a phone, people expect to tap a number to ring it. If they have to copy it out, some won’t bother.',
        'Make every phone number a "tel:" link, and put one at the top of each page.',
        ['/']));
    } else if (home.telLinks === 0) {
      add(issue('tel-home', 'trust', 'notice', 'No tappable phone number on the homepage',
        'Your homepage gets the most visitors, and it’s the page where a quick call is most likely.',
        'Put a tap-to-call number near the top of the homepage.',
        ['/']));
    } else {
      passes.push('Your phone number is one tap away on a phone.');
    }

    if (!shell && !html.some((p) => p.forms > 0) && !html.some((p) => p.mailtoLinks > 0)) {
      add(issue('contact', 'trust', 'warning', 'No way to get in touch except by phone',
        'Plenty of people would rather send a message in the evening than ring during the day. Without a form or email address, they go elsewhere.',
        'Add a short enquiry form (name, number, what they need) to your contact page.',
        ['/contact']));
    }

    if (!html.some((p) => p.localBusinessSchema)) {
      add(issue('schema', 'trust', 'warning', 'Google isn’t told this is a local business',
        'A small piece of hidden "structured data" tells Google your business name, address, phone number and opening hours, which helps you show up in local searches and on Maps.',
        'Add LocalBusiness structured data to the homepage. It’s invisible to visitors.',
        ['/']));
    } else {
      passes.push('Google is told your business details in structured data.');
    }

    if (!shell && !html.some((p) => p.privacyLink)) {
      add(issue('privacy', 'trust', 'warning', 'No privacy policy',
        'If the site collects names, emails or uses cookies, UK GDPR expects a privacy notice, and customers look for one before filling in a form.',
        'Add a privacy policy page and link it from the footer.',
        ['/privacy']));
    }

    const year = new Date().getFullYear();
    if (home.copyrightYear && home.copyrightYear < year - 1) {
      add(issue('copyright', 'trust', 'notice', `The footer says © ${home.copyrightYear}`,
        'Customers notice an old year and wonder whether the business is still trading.',
        'Update the year, or have it fill in automatically.',
        ['/']));
    }

    const mixed = html.filter((p) => p.mixedContent > 0);
    add(issue('mixed', 'trust', 'warning', 'Secure pages loading insecure files',
      'These pages pull images or scripts over plain http, which can remove the padlock or stop parts of the page loading.',
      'Change those file addresses to https://.',
      mixed.map((p) => `${p.path} (${p.mixedContent})`)));

    if (!home.ogImage) {
      add(issue('og', 'trust', 'notice', 'No preview image when the site is shared',
        'When someone shares your site on Facebook or WhatsApp, it shows as a plain link with no picture.',
        'Add a sharing image (an "og:image") — a photo of your work or your logo.',
        ['/']));
    }

    add(issue('lang', 'pages', 'notice', 'Language not set',
      'Browsers and screen readers aren’t told the site is in English.',
      'Add lang="en-GB" to the page.',
      home.lang ? [] : ['/']));
  }

  return { issues, passes, limits };
}
