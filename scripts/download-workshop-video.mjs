import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "assets", "videos");
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (let i = 0; i < 4; i++) {
  await page.goto("https://www.me-saperet.com/%D7%A1%D7%93%D7%A0%D7%90%D7%95%D7%AA", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.waitForTimeout(5000);
  const h1 = await page.locator("h1").first().innerText().catch(() => "");
  if (h1.includes("סדנאות")) break;
}

await page.evaluate(async () => {
  for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 80));
  }
});
await page.waitForTimeout(1500);

const meta = await page.evaluate(() => {
  const scripts = [...document.querySelectorAll("script")].map((s) => s.textContent || "");
  for (const t of scripts) {
    const idx = t.indexOf("VID-20240727-WA0070.mp4");
    if (idx < 0) continue;
    const snippet = t.slice(Math.max(0, idx - 800), idx + 1200);
    // mediaUrl
    const mediaUrl = snippet.match(/"mediaUrl":"([^"]+)"/)?.[1]
      || t.slice(idx - 800, idx + 1200).match(/mediaUrl":"([^"]+)"/)?.[1];
    // broader object via regex
    const block = t.slice(Math.max(0, idx - 1200), idx + 1500);
    return { snippet: block, mediaUrl };
  }
  // fallback search mediaUrl near 141ac5af
  for (const t of scripts) {
    if (!t.includes("141ac5afeb3a4d3d92207865cf6891d0")) continue;
    const m = t.match(/"mediaUrl":"(44c6b1_141ac5afeb3a4d3d92207865cf6891d0[^"]*)"/);
    if (m) return { mediaUrl: m[1], snippet: t.slice(t.indexOf(m[0]) - 200, t.indexOf(m[0]) + 400) };
  }
  return null;
});

console.log("meta", JSON.stringify(meta, null, 2));

const videoId = (meta?.mediaUrl || "44c6b1_141ac5afeb3a4d3d92207865cf6891d0").replace(/\/$/, "");
// Wix video CDN patterns
const candidates = [
  `https://video.wixstatic.com/video/${videoId}/480p/mp4/file.mp4`,
  `https://video.wixstatic.com/video/${videoId}/360p/mp4/file.mp4`,
  `https://video.wixstatic.com/video/${videoId}/720p/mp4/file.mp4`,
  `https://video.wixstatic.com/video/${videoId}/1080p/mp4/file.mp4`,
];

async function headOk(url) {
  const res = await fetch(url, { method: "HEAD" });
  return { url, status: res.status, type: res.headers.get("content-type"), len: res.headers.get("content-length") };
}

const checks = [];
for (const u of candidates) {
  try {
    checks.push(await headOk(u));
  } catch (e) {
    checks.push({ url: u, error: String(e) });
  }
}
console.log("checks", checks);

const good = checks.find((c) => c.status === 200);
if (good) {
  console.log("downloading", good.url);
  const res = await fetch(good.url);
  const buf = Buffer.from(await res.arrayBuffer());
  const dest = path.join(outDir, "workshop-home-circles.mp4");
  fs.writeFileSync(dest, buf);
  console.log("saved", dest, buf.length);
} else {
  // try GET on first anyway
  for (const u of candidates) {
    try {
      const res = await fetch(u);
      console.log("GET", u, res.status, res.headers.get("content-type"));
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        const dest = path.join(outDir, "workshop-home-circles.mp4");
        fs.writeFileSync(dest, buf);
        console.log("saved", dest, buf.length);
        break;
      }
    } catch (e) {
      console.log("fail", u, e.message);
    }
  }
}

fs.writeFileSync(
  path.join(__dirname, "..", "measurement", "workshop-video-meta.json"),
  JSON.stringify({ meta, checks, videoId }, null, 2),
);

await browser.close();
