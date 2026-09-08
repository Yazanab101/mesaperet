import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, "..", "public", "assets", "images", "testimonial-cats");
const videoDir = path.join(__dirname, "..", "public", "assets", "videos");
fs.mkdirSync(assetsDir, { recursive: true });
fs.mkdirSync(videoDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: "he-IL" });

for (let i = 0; i < 4; i++) {
  await page.goto("https://www.me-saperet.com/%D7%94%D7%9E%D7%9C%D7%A6%D7%95%D7%AA", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.waitForTimeout(6000);
  if ((await page.locator("h1").first().innerText().catch(() => "")).includes("המלצות")) break;
}

await page.evaluate(() => window.scrollTo(0, 350));
await page.waitForTimeout(1000);

// Extract tab SVGs
const tabs = await page.evaluate(() => {
  const roots = [...document.querySelectorAll('[id^="comp-mrtn37ce5__item"]')];
  return roots.map((el) => {
    const svg = el.querySelector("svg");
    const label = (el.innerText || "").replace(/\s+/g, " ").trim() ||
      document.querySelector(`#${CSS.escape(el.id.replace("mrtn37ce5", "mrtn37dz"))}`)?.innerText?.trim();
    return {
      id: el.id,
      label,
      svg: svg?.outerHTML || null,
      fills: [...(svg?.querySelectorAll("[fill]") || [])].map((n) => n.getAttribute("fill")).slice(0, 5),
    };
  });
});

const map = { סדנאות: "workshops", "מפגשים אישיים": "personal" };
for (const t of tabs) {
  const key = map[t.label] || t.id;
  if (t.svg) {
    let s = t.svg
      .replace(/fill="#010101"/g, 'fill="#5AB8B8"')
      .replace(/<defs>[\s\S]*?<\/defs>/, "")
      .replace(/\s+data-bbox="[^"]*"/, "")
      .replace(/\s+data-type="[^"]*"/, "")
      .replace(/\s+height="200"/, "")
      .replace(/\s+width="200"/, "");
    fs.writeFileSync(path.join(assetsDir, `${key}.svg`), s);
    console.log("saved svg", key);
  }
}

// Check videos in top gallery + scripts
const videoMeta = await page.evaluate(() => {
  const scripts = [...document.querySelectorAll("script")].map((s) => s.textContent || "").join("\n");
  const count = (scripts.match(/"type":"video"/g) || []).length;
  const hits = [];
  const re = /"type":"video"[\s\S]{0,500}?"name":"([^"]+)"[\s\S]{0,300}?"mediaUrl":"([^"]+)"/g;
  let m;
  while ((m = re.exec(scripts))) hits.push({ name: m[1], mediaUrl: m[2] });
  // also mediaUrl then nearby video for db1995 poster
  const idx = scripts.indexOf("db1995abdaf845de9c5a03702bc83e4af003");
  const snippet = idx >= 0 ? scripts.slice(Math.max(0, idx - 400), idx + 600) : null;
  const topVideos = [...document.querySelectorAll("#comp-lups18qc .gallery-item-video, #pro-gallery-comp-lups2l2d .video-item")].length;
  return { count, hits, snippet, topVideos };
});

console.log("videoMeta", JSON.stringify(videoMeta, null, 2));

// If video found with mediaUrl, download
for (const h of videoMeta.hits || []) {
  const id = h.mediaUrl.replace(/~mv2.*$/, "").replace(/\.(jpe?g|png)$/i, "");
  // try common patterns
  const candidates = [
    `https://video.wixstatic.com/video/${h.mediaUrl}/480p/mp4/file.mp4`,
    `https://video.wixstatic.com/video/${id}/480p/mp4/file.mp4`,
  ];
  for (const u of candidates) {
    try {
      const res = await fetch(u);
      console.log("try", u, res.status);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        const dest = path.join(videoDir, "testimonial-featured.mp4");
        fs.writeFileSync(dest, buf);
        console.log("saved video", dest, buf.length, "from", h.name);
        break;
      }
    } catch (e) {
      console.log("fail", u, e.message);
    }
  }
}

// Also search snippet for mediaUrl of first item
if (videoMeta.snippet) {
  const m = videoMeta.snippet.match(/"mediaUrl":"([^"]+)"/);
  const type = videoMeta.snippet.match(/"type":"([^"]+)"/);
  console.log("snippet media", m?.[1], "type", type?.[1]);
  if (m && /video|141ac5|db1995/i.test(videoMeta.snippet)) {
    const mediaUrl = m[1];
    // if type video in wider window
  }
}

fs.writeFileSync(
  path.join(__dirname, "..", "measurement", "testimonials-extract.json"),
  JSON.stringify({ tabs: tabs.map(({ svg, ...r }) => r), videoMeta }, null, 2),
);

await browser.close();
