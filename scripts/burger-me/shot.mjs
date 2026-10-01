// Usage: node scripts/burger-me/shot.mjs <path> <width> [scrollFraction=0] [out.png] [--mobile] [--y=<px absolute scroll>] [--wait=ms] [--after=ms settle after clicks] [--ls=<json object of localStorage keys>] [--click=<selector>[||<selector>...]] [--hover=<selector>] [--frames=<ms,ms,...> screenshots at those ms after the click, out-<ms>.png]
// Real Chrome (the Browser pane drops layers and misreads scroll). Dev server on :3000.
import puppeteer from "puppeteer";
const [path = "/demo/burger-me", width = "1440", frac = "0", out = "/tmp/bm-shot.png"] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const mobile = process.argv.includes("--mobile");
const waitArg = process.argv.find((a) => a.startsWith("--wait="));
const wait = waitArg ? Number(waitArg.slice(7)) : 1600;
const lsArg = process.argv.find((a) => a.startsWith("--ls="));
const yArg = process.argv.find((a) => a.startsWith("--y="));
const afterArg = process.argv.find((a) => a.startsWith("--after="));
const after = afterArg ? Number(afterArg.slice(8)) : 0;
const hoverArg = process.argv.find((a) => a.startsWith("--hover="));
const framesArg = process.argv.find((a) => a.startsWith("--frames="));
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
if (yArg) await page.evaluate((y) => window.scrollTo(0, y), Number(yArg.slice(4)));
else await page.evaluate((f) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * f), Number(frac));
await new Promise((r) => setTimeout(r, Math.max(0, wait - (Date.now() - t0))));
const frames = framesArg ? framesArg.slice(9).split(",").map(Number) : [];
for (const sel of clickArg ? clickArg.slice(8).split("||") : []) {
  await page.click(sel);
  if (frames.length) {
    // Capture at given ms after this click instead of the fixed 900ms settle.
    const c0 = Date.now();
    for (const f of frames) {
      await new Promise((r) => setTimeout(r, Math.max(0, f - (Date.now() - c0))));
      await page.screenshot({ path: out.replace(/\.png$/, `-${f}.png`) });
    }
  } else await new Promise((r) => setTimeout(r, 900));
}
if (hoverArg) { await page.hover(hoverArg.slice(8)); await new Promise((r) => setTimeout(r, 900)); }
if (after) await new Promise((r) => setTimeout(r, after));
const info = await page.evaluate(() => ({ innerWidth, scrollWidth: document.documentElement.scrollWidth }));
await page.screenshot({ path: out });
console.log(out, JSON.stringify(info));
await browser.close();
