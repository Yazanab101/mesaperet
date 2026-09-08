import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const localUrl = process.argv[2] || "http://127.0.0.1:5173/";

const SRC = {
  titleBand: { w: 1440, h: 155.28 },
  title: { x: 448.05, y: 22.83, w: 543.91, h: 109.63 },
  footer: { w: 1440, h: 221.16 },
  logo: { x: 1161.44, y: 0, w: 197.08, h: 197.08 },
  nav: { x: 828.97, y: 0, w: 142, h: 221.16 },
  legal: { x: 441.56, y: 0, w: 196.34, h: 91.19 },
  search: { x: 518.73, y: 91.19, w: 42, h: 42 },
  wa: { x: 113.89, y: 53.64, w: 57.09, h: 57.09 },
  fb: { x: 188.98, y: 53.64, w: 57.09, h: 57.09 },
  credit: { x: 214.64, y: 179.97, w: 290.7, h: 25.59 },
};

const r2 = (n) => Math.round(n * 100) / 100;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.goto(localUrl, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(600);
await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(root, "measurement/local-home-bottom-1440x900.png") });

const local = await page.evaluate(() => {
  const band = document.querySelector('[data-home-item="title-band"]');
  const title = document.querySelector('[data-home-item="title"]');
  const foot = document.querySelector('[data-footer="canvas"]');
  const pick = (sel, root) => {
    const el = (root || document).querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const base = root ? root.getBoundingClientRect() : { x: 0, y: 0 };
    return { x: r.x - base.x, y: r.y - base.y, w: r.width, h: r.height, absY: r.top + window.scrollY };
  };
  return {
    scrollH: document.documentElement.scrollHeight,
    band: band ? { w: band.getBoundingClientRect().width, h: band.getBoundingClientRect().height } : null,
    title: pick('[data-home-item="title"]', band),
    footer: foot ? { w: foot.getBoundingClientRect().width, h: foot.getBoundingClientRect().height } : null,
    logo: pick('[data-footer="logo"]', foot),
    nav: pick('[data-footer="nav"]', foot),
    legal: pick('[data-footer="legal"]', foot),
    search: pick('[data-footer="search"]', foot),
    wa: pick('[data-footer="wa"]', foot),
    fb: pick('[data-footer="fb"]', foot),
    credit: pick('[data-footer="credit"]', foot),
    footBg: getComputedStyle(document.querySelector(".site-footer")).backgroundColor,
    bandBg: band ? getComputedStyle(band).backgroundColor : null,
  };
});

function cmp(name, src, loc, scaleX, scaleY) {
  if (!loc) return { name, missing: true };
  const nx = loc.x / scaleX;
  const ny = loc.y / scaleY;
  const nw = loc.w / scaleX;
  const nh = loc.h / scaleY;
  const d = { dx: r2(nx - src.x), dy: r2(ny - src.y), dw: r2(nw - src.w), dh: r2(nh - src.h) };
  const ok = Math.abs(d.dx) <= 3 && Math.abs(d.dy) <= 3 && Math.abs(d.dw) <= 3 && Math.abs(d.dh) <= 3;
  return { name, src, localNorm: { x: r2(nx), y: r2(ny), w: r2(nw), h: r2(nh) }, d, ok };
}

const sxF = local.footer.w / 1440;
const syF = local.footer.h / 221.16;
const sxT = local.band.w / 1440;
const syT = local.band.h / 155.28;

const rows = [
  {
    name: "titleBand",
    ok: Math.abs(local.band.h - SRC.titleBand.h) <= 3 && Math.abs(local.band.w - 1440) <= 1,
    d: { dw: r2(local.band.w - 1440), dh: r2(local.band.h - SRC.titleBand.h) },
  },
  cmp("title", SRC.title, local.title, sxT, syT),
  {
    name: "footer",
    ok: Math.abs(local.footer.h - SRC.footer.h) <= 3 && Math.abs(local.footer.w - 1440) <= 1,
    d: { dw: r2(local.footer.w - 1440), dh: r2(local.footer.h - SRC.footer.h) },
  },
  cmp("logo", SRC.logo, local.logo, sxF, syF),
  cmp("nav", SRC.nav, local.nav, sxF, syF),
  cmp("legal", { ...SRC.legal, h: 91.19 }, local.legal, sxF, syF),
  cmp("search", SRC.search, local.search, sxF, syF),
  cmp("wa", SRC.wa, local.wa, sxF, syF),
  cmp("fb", SRC.fb, local.fb, sxF, syF),
  cmp("credit", SRC.credit, local.credit, sxF, syF),
];

const out = { local, rows, pass: rows.filter((r) => r.ok).length, fail: rows.filter((r) => !r.ok).length };
fs.writeFileSync(path.join(root, "measurement/local-vs-source-footer-1440x900.json"), JSON.stringify(out, null, 2));

let md = `# Local vs Source — title + footer @ 1440×900\n\n`;
md += `scrollH local=${local.scrollH} (src 1438)\n`;
md += `bandBg=${local.bandBg} footBg=${local.footBg}\n\n`;
md += `| Element | OK | delta |\n| --- | --- | --- |\n`;
for (const r of rows) {
  md += `| ${r.name} | ${r.ok ? "✅" : "❌"} | ${JSON.stringify(r.d || r)} |\n`;
}
fs.writeFileSync(path.join(root, "measurement/LOCAL_VS_SOURCE_FOOTER_1440x900.md"), md);
console.log(md);
await browser.close();
