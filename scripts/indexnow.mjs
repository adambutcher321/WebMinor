#!/usr/bin/env node
/*
  Tells Bing (and the other IndexNow engines, which share submissions) which
  pages exist or have changed. Run it after a deploy has gone live:

    node scripts/indexnow.mjs                 # every URL in the live sitemap
    node scripts/indexnow.mjs /pricing /about # just these paths

  The key file public/18b975f71fa6663a9f0dd52096414bf3.txt proves the site is
  ours; it must stay deployed for submissions to be accepted.
  Docs: https://www.indexnow.org/documentation
*/

const HOST = 'www.webminor.co.uk';
const SITE = `https://${HOST}`;
const KEY = '18b975f71fa6663a9f0dd52096414bf3';

const paths = process.argv.slice(2);
let urlList;
if (paths.length) {
  urlList = paths.map((p) => `${SITE}${p.startsWith('/') ? p : `/${p}`}`);
} else {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});

// 200 and 202 both mean accepted; 403 means the key file isn't live yet.
console.log(`IndexNow: ${res.status} for ${urlList.length} URLs`);
if (!res.ok && res.status !== 202) process.exit(1);
