// Usage: node scripts/burger-me/shot.mjs <path> <width> [scrollFraction=0] [out.png] [--mobile] [--wait=ms] [--ls=<json object of localStorage keys>] [--click=<selector>[||<selector>...]]
// Real Chrome (the Browser pane drops layers and misreads scroll). Dev server on :3000.
import puppeteer from "puppeteer";
const [path = "/demo/burger-me", width = "1440", frac = "0", out = "/tmp/bm-shot.png"] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const mobile = process.argv.includes("--mobile");
const waitArg = process.argv.find((a) => a.startsWith("--wait="));
const wait = waitArg ? Number(waitArg.slice(7)) : 1600;
const lsArg = process.argv.find((a) => a.startsWith("--ls="));
const clickArg = process.argv.find((a) => a.startsWith("--click="));
const w = Number(width);
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
});
const page = await browser.newPage();
await page.setViewport({ width: w, height: mobile ? 812 : 900, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
if (lsArg) {
  const seed = JSON.parse(lsArg.slice(5));
  await page.evaluateOnNewDocument((kv) => { for (const k in kv) localStorage.setItem(k, kv[k]); }, seed);
}
await page.goto(`${process.env.BASE_URL || "http://localhost:3000"}${path}`, { waitUntil: "networkidle2", timeout: 90000 });
const t0 = Date.now();
await page.evaluate((f) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * f), Number(frac));
await new Promise((r) => setTimeout(r, Math.max(0, wait - (Date.now() - t0))));
for (const sel of clickArg ? clickArg.slice(8).split("||") : []) { await page.click(sel); await new Promise((r) => setTimeout(r, 900)); }
const info = await page.evaluate(() => ({ innerWidth, scrollWidth: document.documentElement.scrollWidth }));
await page.screenshot({ path: out });
console.log(out, JSON.stringify(info));
await browser.close();
