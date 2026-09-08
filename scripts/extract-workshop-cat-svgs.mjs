import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "measurement");
const assetsDir = path.join(__dirname, "..", "public", "assets", "images", "workshop-cats");
fs.mkdirSync(assetsDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  locale: "he-IL",
});

for (let i = 0; i < 4; i++) {
  await page.goto("https://www.me-saperet.com/%D7%A1%D7%93%D7%A0%D7%90%D7%95%D7%AA", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.waitForTimeout(6000);
  const h1 = await page.locator("h1").first().innerText().catch(() => "");
  if (h1.includes("סדנאות")) break;
}

await page.evaluate(() => window.scrollTo(0, 850));
await page.waitForTimeout(2000);

const data = await page.evaluate(() => {
  const items = [...document.querySelectorAll('[id^="comp-mrduui0i__item"]')];
  return items.map((el) => {
    const svg = el.querySelector("svg");
    const a = el.querySelector("a");
    const label =
      document.querySelector(`#${CSS.escape(el.id.replace("mrduui0i", "mrdusfmn"))}`)?.innerText?.trim() ||
      a?.getAttribute("aria-label") ||
      el.innerText.replace(/\s+/g, " ").trim();
    const r = el.getBoundingClientRect();
    const svgR = svg?.getBoundingClientRect();
    // try to get fill colors from paths
    const fills = [...(svg?.querySelectorAll("[fill]") || [])]
      .map((n) => n.getAttribute("fill"))
      .filter((f) => f && f !== "none" && !f.startsWith("url"))
      .slice(0, 8);
    return {
      id: el.id,
      label,
      href: a?.getAttribute("href"),
      anchor: a?.getAttribute("data-anchor"),
      box: { w: r.width, h: r.height, x: r.x },
      svgBox: svgR ? { w: svgR.width, h: svgR.height } : null,
      fills,
      svgOuter: svg ? svg.outerHTML : null,
      viewBox: svg?.getAttribute("viewBox"),
    };
  });
});

const map = {
  "בוקר אמהות": "mothers",
  "מסיבת רווקות": "bachelorette",
  "חוגי בית, ימי הולדת ומפגשי גיבוש": "home-circles",
  ריטריטים: "retreats",
  "ארועי חברה וסדנאות": "company",
};

const saved = [];
for (const item of data) {
  const key = map[item.label] || item.id;
  if (item.svgOuter) {
    const file = path.join(assetsDir, `${key}.svg`);
    fs.writeFileSync(file, item.svgOuter);
    saved.push({ key, label: item.label, file: `workshop-cats/${key}.svg`, bytes: item.svgOuter.length, fills: item.fills, box: item.box, svgBox: item.svgBox, anchor: item.anchor });
  } else {
    saved.push({ key, label: item.label, missing: true });
  }
}

fs.writeFileSync(path.join(out, "source-workshops-cat-svgs.json"), JSON.stringify({ saved, data: data.map(({ svgOuter, ...rest }) => rest) }, null, 2));
console.log(JSON.stringify(saved, null, 2));
await browser.close();
