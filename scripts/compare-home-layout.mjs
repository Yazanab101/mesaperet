/**
 * Compare local homepage vs source measurements at 1440×900.
 * Usage: node scripts/compare-home-layout.mjs [localUrl]
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const sourcePath = path.join(root, "measurement/source-home-layout-model-1440x900.json");
const localUrl = process.argv[2] || "http://127.0.0.1:5173/";

const SOURCE_TARGETS = {
  bg: { id: null, label: "salon bg", x: 0, y: 0, w: 1440, h: 1062 },
  portrait: { x: 533.78, y: 146.47, w: 372.44, h: 350.81 },
  plant: { x: 232.38, y: 189.78, w: 204.45, h: 170.75 },
  "consult-label": { x: 310.64, y: 321.5, w: 47.91, h: 34.72 },
  workshops: { x: 1125.28, y: 251.08, w: 117.84, h: 111.72 },
  gift: { x: 1015.27, y: 275.34, w: 99.92, h: 99.84 },
  "gift-label": { x: 967.06, y: 235.89, w: 124.84, h: 15.19 },
  "chair-l": { x: 30.17, y: 321.91, w: 488.25, h: 606.77 },
  "chair-r": { x: 906.27, y: 338.66, w: 488.25, h: 606.77 },
  phone: { x: 486.11, y: 483.11, w: 233.88, h: 155.83 },
  books: { x: 714.59, y: 497.25, w: 191.66, h: 127.67 },
  logo: { x: 0, y: 893.7, w: 168.3, h: 168.3 },
  facebook: { x: 0, y: 383.91, w: 57.09, h: 57.09 },
  whatsapp: { x: 0, y: 459, w: 57.09, h: 57.09 },
};

function r2(n) {
  return Math.round(n * 100) / 100;
}

async function measureLocal(page) {
  return page.evaluate(() => {
    const scene = document.querySelector(".home-scene");
    const sceneRect = scene.getBoundingClientRect();
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.x,
        y: r.y,
        w: r.width,
        h: r.height,
        // scene-relative for scene children
        sx: r.x - sceneRect.x,
        sy: r.y - sceneRect.y,
      };
    };
    return {
      scene: { x: sceneRect.x, y: sceneRect.y, w: sceneRect.width, h: sceneRect.height },
      viewport: { w: window.innerWidth, h: window.innerHeight },
      items: {
        bg: pick('[data-home-item="bg"]'),
        portrait: pick('[data-home-item="portrait"]'),
        plant: pick('[data-home-item="plant"]'),
        "consult-label": pick('[data-home-item="consult-label"]'),
        workshops: pick('[data-home-item="workshops"]'),
        gift: pick('[data-home-item="gift"]'),
        "gift-label": pick('[data-home-item="gift-label"]'),
        "chair-l": pick('[data-home-item="chair-l"]'),
        "chair-r": pick('[data-home-item="chair-r"]'),
        phone: pick('[data-home-item="phone"]'),
        books: pick('[data-home-item="books"]'),
        logo: pick('[data-home-item="logo"]'),
        facebook: pick('[data-home-item="facebook"]'),
        whatsapp: pick('[data-home-item="whatsapp"]'),
        a11y: pick('[data-home-item="a11y"]'),
        title: pick('[data-home-item="title"]'),
      },
    };
  });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.goto(localUrl, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(800);
const local = await measureLocal(page);
await page.screenshot({ path: path.join(root, "measurement/local-home-1440x900.png"), fullPage: false });
await browser.close();

const scaleX = local.scene.w / 1440;
const scaleY = local.scene.h / 1062;

const rows = [];
for (const [key, src] of Object.entries(SOURCE_TARGETS)) {
  const loc = local.items[key];
  if (!loc) {
    rows.push({ key, missing: true });
    continue;
  }
  const isFixed = key === "facebook" || key === "whatsapp";
  const lx = isFixed ? loc.x : loc.sx;
  const ly = isFixed ? loc.y : loc.sy;
  // Compare in source coordinate space (scale local scene coords up to 1440×1062)
  const normX = isFixed ? loc.x : loc.sx / scaleX;
  const normY = isFixed ? loc.y : loc.sy / scaleY;
  const normW = isFixed ? loc.w : loc.w / scaleX;
  const normH = isFixed ? loc.h : loc.h / scaleY;

  const dx = r2(normX - src.x);
  const dy = r2(normY - src.y);
  const dw = r2(normW - src.w);
  const dh = r2(normH - src.h);
  const ok = Math.abs(dx) <= 3 && Math.abs(dy) <= 3 && Math.abs(dw) <= 3 && Math.abs(dh) <= 3;
  rows.push({
    key,
    source: src,
    localRaw: { x: r2(lx), y: r2(ly), w: r2(loc.w), h: r2(loc.h) },
    localNorm: { x: r2(normX), y: r2(normY), w: r2(normW), h: r2(normH) },
    delta: { dx, dy, dw, dh },
    ok,
  });
}

const out = {
  localUrl,
  scene: local.scene,
  scale: { x: scaleX, y: scaleY },
  rows,
  passCount: rows.filter((r) => r.ok).length,
  failCount: rows.filter((r) => !r.ok && !r.missing).length,
};

fs.writeFileSync(path.join(root, "measurement/local-vs-source-1440x900.json"), JSON.stringify(out, null, 2));

let md = `# Local vs Source @ 1440×900\n\n`;
md += `Scene: ${r2(local.scene.w)}×${r2(local.scene.h)} (expect 1440×1062)\n\n`;
md += `| Element | src x,y,w,h | localNorm x,y,w,h | Δx Δy Δw Δh | OK |\n| --- | --- | --- | --- | --- |\n`;
for (const r of rows) {
  if (r.missing) {
    md += `| ${r.key} | — | MISSING | — | ❌ |\n`;
    continue;
  }
  const s = r.source;
  const n = r.localNorm;
  const d = r.delta;
  md += `| ${r.key} | ${s.x}, ${s.y}, ${s.w}×${s.h} | ${n.x}, ${n.y}, ${n.w}×${n.h} | ${d.dx}, ${d.dy}, ${d.dw}, ${d.dh} | ${r.ok ? "✅" : "❌"} |\n`;
}
md += `\n**Pass:** ${out.passCount} / **Fail:** ${out.failCount}\n`;
fs.writeFileSync(path.join(root, "measurement/LOCAL_VS_SOURCE_1440x900.md"), md);
console.log(md);
