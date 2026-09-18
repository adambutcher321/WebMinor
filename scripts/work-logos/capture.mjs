// Captures each concept build's own nav wordmark (real font, real mark) as a
// transparent image for the work page covers. Needs the dev server running:
//   node scripts/work-logos/capture.mjs [outDir] [--variant=natural|white|both]
// Output: <outDir>/<slug>.png (white) and, with both, <slug>.natural.png
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const outDir = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "public/work/logos";
const variant = (process.argv.find((a) => a.startsWith("--variant=")) || "--variant=white").split("=")[1];
mkdirSync(outDir, { recursive: true });

const BRANDS = [
  { slug: "threshold", match: "^threshold$" },
  { slug: "boucher", match: "^boucher\\s*tailored$" },
  { slug: "fernhollow", match: "^fernhollow$" },
  { slug: "mindful", match: "^mindful$" },
  { slug: "altrix", match: "^altrix$" },
  { slug: "voltiva", match: "^voltiva\\s*electrical$" },
  { slug: "crookeries", match: "^crookeries$" },
  { slug: "lucid", match: "^lucid$" },
  { slug: "klik", match: "^klik$" },
];

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
});

for (const { slug, match } of BRANDS) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 6 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(`${BASE}/demo/${slug}`, { waitUntil: "networkidle2", timeout: 90000 });
  await new Promise((r) => setTimeout(r, 3000));

  // The outermost element near the top of the page whose whole text is the
  // brand name: that is the nav's brand link, mark included.
  const found = await page.evaluate((src) => {
    const re = new RegExp(src, "i");
    const hits = [...document.querySelectorAll("body *")].filter((e) => {
      const b = e.getBoundingClientRect();
      return b.top < 220 && b.width > 16 && b.width < 420 && b.height > 8 && b.height < 140 && re.test(e.textContent.replace(/\s+/g, " ").trim());
    });
    if (!hits.length) return false;
    const pick = hits.sort((a, b) => { const x = a.getBoundingClientRect(), y = b.getBoundingClientRect(); return y.width * y.height - x.width * x.height; })[0];
    pick.setAttribute("data-work-logo", "");
    return pick.tagName + " " + Math.round(pick.getBoundingClientRect().width) + "x" + Math.round(pick.getBoundingClientRect().height);
  }, match);
  if (!found) { console.log(slug, "NOT FOUND"); await page.close(); continue; }

  const isolate = `
    html, body { background: transparent !important; }
    html *, html *::before, html *::after { visibility: hidden !important; transition: none !important; animation: none !important; }
    [data-work-logo], [data-work-logo] * { visibility: visible !important; opacity: 1 !important; text-shadow: none !important; filter: none !important; mix-blend-mode: normal !important; }
    [data-work-logo] { background: transparent !important; transform: none !important; }
  `;
  await page.addStyleTag({ content: isolate });
  const el = await page.$("[data-work-logo]");

  if (variant === "natural" || variant === "both") {
    await el.screenshot({ path: `${outDir}/${slug}${variant === "both" ? ".natural" : ""}.png`, omitBackground: true });
  }
  if (variant === "white" || variant === "both") {
    await page.evaluate(() => {
      const root = document.querySelector("[data-work-logo]");
      for (const e of [root, ...root.querySelectorAll("*")]) {
        const cs = getComputedStyle(e);
        e.style.setProperty("color", "#fff", "important");
        e.style.setProperty("-webkit-text-fill-color", "#fff", "important");
        if (e instanceof SVGElement) {
          if (cs.fill && cs.fill !== "none") e.style.setProperty("fill", "#fff", "important");
          if (cs.stroke && cs.stroke !== "none") e.style.setProperty("stroke", "#fff", "important");
        } else if (cs.backgroundColor !== "rgba(0, 0, 0, 0)" && e !== root) {
          e.style.setProperty("background-color", "#fff", "important");
        }
        if (parseFloat(cs.borderTopWidth) > 0) e.style.setProperty("border-color", "#fff", "important");
      }
    });
    await el.screenshot({ path: `${outDir}/${slug}.png`, omitBackground: true });
  }
  console.log(slug, found);
  await page.close();
}
await browser.close();
