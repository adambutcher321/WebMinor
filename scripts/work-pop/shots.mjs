import puppeteer from "puppeteer";
const w = Number(process.argv[2] || 1440), mobile = process.argv.includes("--mobile");
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: w, height: mobile ? 812 : 900, isMobile: mobile, hasTouch: mobile });
await page.goto("http://localhost:3000/case-studies", { waitUntil: "networkidle2", timeout: 90000 });
const n = await page.$$eval("[data-reveal='frame']", (els) => els.length);
for (let i = 0; i < n; i++) {
  await page.evaluate((i) => { const el = document.querySelectorAll("[data-reveal='frame']")[i]; const r = el.getBoundingClientRect(); window.scrollBy(0, r.top + r.height / 2 - innerHeight / 2); }, i);
  await new Promise((r) => setTimeout(r, 1800));
  await page.screenshot({ path: `/tmp/pop-${w}-${i}.png` });
}
console.log(n, await page.evaluate(() => [innerWidth, document.documentElement.scrollWidth]));
await browser.close();
