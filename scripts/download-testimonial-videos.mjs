import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const videoDir = path.join(__dirname, "..", "public", "assets", "videos");
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

await page.evaluate(async () => {
  for (let y = 0; y < 8000; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 80));
  }
});

const items = await page.evaluate(() => {
  const scripts = [...document.querySelectorAll("script")].map((s) => s.textContent || "").join("\n");
  // Find gallery items near featured screenshots
  const out = [];
  const re =
    /"title":"([^"]*)"[\s\S]{0,80}?"type":"video"[\s\S]{0,400}?"name":"([^"]+\.mp4)"[\s\S]{0,500}?"mediaUrl":"(44c6b1_[a-f0-9]+)"/g;
  let m;
  while ((m = re.exec(scripts))) {
    out.push({ title: m[1], name: m[2], mediaUrl: m[3] });
  }
  // also reverse order type first
  const re2 =
    /"type":"video"[\s\S]{0,200}?"name":"([^"]+\.mp4)"[\s\S]{0,400}?"mediaUrl":"(44c6b1_[a-f0-9]+)"[\s\S]{0,200}?"title":"([^"]*)"/g;
  while ((m = re2.exec(scripts))) {
    if (!out.some((o) => o.mediaUrl === m[2])) out.push({ title: m[3], name: m[1], mediaUrl: m[2] });
  }
  // poster-based for known files
  const posters = [
    "db1995abdaf845de9c5a03702bc83e4a",
    "756cff09dd6740a6acdf6ffcaac3ca7d",
    "322109697fc549f384911d07406caad7",
    "2c5da40fb42246c7af08cb3354edfcb9",
    "adf9111900f144a9ae949782a1db12fb",
    "3a1d1f1c2f5b4fb5a1a63bfe32e9628e",
    "1fbce7c58dd743d0a12cbc1022fc4f7a",
    "b59d2965507647c8aa9721778c6ce7fa",
  ];
  for (const p of posters) {
    const idx = scripts.indexOf(p);
    if (idx < 0) continue;
    const snip = scripts.slice(Math.max(0, idx - 200), idx + 900);
    const mediaUrl = snip.match(/"mediaUrl":"(44c6b1_[a-f0-9]+)"/)?.[1];
    const name = snip.match(/"name":"([^"]+\.mp4)"/)?.[1];
    const title = snip.match(/"title":"([^"]*)"/)?.[1];
    if (mediaUrl && !out.some((o) => o.mediaUrl === mediaUrl || o.posterKey === p)) {
      out.push({ title, name, mediaUrl, posterKey: p });
    }
  }
  return out;
});

console.log("items", JSON.stringify(items, null, 2));

const names = ["yael", "miriam", "chana", "rafael", "liat", "sheli", "neti", "yanti"];
const results = [];

for (let i = 0; i < items.length; i++) {
  const item = items[i];
  const file = `testimonial-${names[i] || i}.mp4`;
  const url = `https://video.wixstatic.com/video/${item.mediaUrl}/480p/mp4/file.mp4`;
  try {
    const res = await fetch(url);
    console.log(i, item.title, item.mediaUrl, res.status);
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(path.join(videoDir, file), buf);
      results.push({ ...item, file, bytes: buf.length, ok: true });
      console.log("saved", file, buf.length);
    } else {
      results.push({ ...item, file, ok: false, status: res.status });
    }
  } catch (e) {
    results.push({ ...item, file, ok: false, error: e.message });
  }
}

fs.writeFileSync(
  path.join(__dirname, "..", "measurement", "testimonials-videos.json"),
  JSON.stringify({ items, results }, null, 2),
);
console.log("done", results.filter((r) => r.ok).length, "/", results.length);
await browser.close();
