// Scroll an element's centre to the viewport's centre, wait, screenshot.
// Usage: node scripts/work-pop/center.mjs <path> <selector> <out.png> [width] [--mobile] [--hover]
import puppeteer from "puppeteer";
const [path, sel, out, width = "1440"] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const mobile = process.argv.includes("--mobile");
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new" });
const p = await b.newPage();
await p.setViewport({ width: Number(width), height: mobile ? 812 : 900, isMobile: mobile, hasTouch: mobile });
await p.goto((process.env.BASE_URL || "http://localhost:3000") + path, { waitUntil: "networkidle2", timeout: 90000 });
for (let i = 0; i < 3; i++) {
  await p.evaluate((s) => { const el = document.querySelector(s); const r = el.getBoundingClientRect(); window.scrollBy(0, r.top + r.height / 2 - innerHeight / 2); }, sel);
  await new Promise((r) => setTimeout(r, 900));
}
if (process.argv.includes("--hover")) await p.hover(sel);
await new Promise((r) => setTimeout(r, 1600));
await p.screenshot({ path: out });
console.log(out, JSON.stringify(await p.evaluate(() => [innerWidth, document.documentElement.scrollWidth, document.querySelector("[data-colourway]")?.getAttribute("data-colourway")])));
await b.close();
