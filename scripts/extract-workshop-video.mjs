import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import http from "http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "measurement");
const mediaDir = path.join(__dirname, "..", "public", "assets", "videos");
fs.mkdirSync(mediaDir, { recursive: true });

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

await page.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 100));
  }
});
await page.waitForTimeout(2000);

// Scroll to video area and click play to reveal video src
await page.evaluate(() => window.scrollTo(0, 6000));
await page.waitForTimeout(1000);

const videoInfo = await page.evaluate(() => {
  const items = [...document.querySelectorAll(".gallery-item-video, [data-hook='image-item'].video-item, .video-item")];
  return items.map((el) => {
    const r = el.getBoundingClientRect();
    const img = el.querySelector("img");
    const video = el.querySelector("video");
    const sources = [...el.querySelectorAll("source")].map((s) => s.src || s.getAttribute("src"));
    // wix often stores video url in props / data attributes
    const attrs = {};
    for (const a of el.attributes) attrs[a.name] = a.value.slice(0, 200);
    const html = el.innerHTML;
    const mp4Match = html.match(/https?:[^"'\s]+\.mp4[^"'\s]*/i);
    const videoIdMatch = html.match(/video[_-]?id["':=\s]+["']?([a-zA-Z0-9_-]+)/i);
    const wixVideo = html.match(/static\.wixstatic\.com\/[^"'\s]+/g);
    return {
      x: r.x,
      y: r.y + scrollY,
      w: r.width,
      h: r.height,
      poster: img?.currentSrc || img?.src || null,
      videoSrc: video?.currentSrc || video?.src || null,
      sources,
      mp4Match,
      wixVideo: wixVideo?.slice(0, 10),
      attrs,
      className: el.className,
    };
  });
});

// Click play button to load video
const play = page.locator(".gallery-item-video [data-hook='play-triangle'], .gallery-item-video .play-triangle").first();
if (await play.count()) {
  await play.click({ force: true }).catch(() => {});
  await page.waitForTimeout(2500);
}

const afterClick = await page.evaluate(() => {
  const el = document.querySelector(".gallery-item-video, .video-item");
  if (!el) return null;
  const video = el.querySelector("video");
  const sources = [...document.querySelectorAll("video source, video")].map((n) => ({
    tag: n.tagName,
    src: n.currentSrc || n.src || n.getAttribute("src"),
    type: n.getAttribute?.("type"),
  }));
  // search whole page for mp4 near workshops
  const allMp4 = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  let node;
  while ((node = walker.nextNode())) {
    for (const a of node.attributes || []) {
      if (/mp4|video\//i.test(a.value)) allMp4.push({ tag: node.tagName, name: a.name, value: a.value.slice(0, 300) });
    }
  }
  // also performance resources
  return {
    videoSrc: video?.currentSrc || video?.src || null,
    sources,
    allMp4: allMp4.slice(0, 40),
  };
});

// Intercept network for mp4
const mp4Urls = [];
page.on("response", (res) => {
  const u = res.url();
  if (/\.mp4|video\//i.test(u)) mp4Urls.push(u);
});

// Try clicking again and waiting for network
await page.evaluate(() => window.scrollTo(0, 6100));
await page.waitForTimeout(500);
await play.click({ force: true }).catch(() => {});
await page.waitForTimeout(4000);

// Dump from performance API
const perf = await page.evaluate(() =>
  performance.getEntriesByType("resource")
    .map((e) => e.name)
    .filter((n) => /\.mp4|video|wixstatic\.com\/video|files\.wix/i.test(n)),
);

// Also try to read Wix pro-gallery store / window props
const wixData = await page.evaluate(() => {
  const scripts = [...document.querySelectorAll("script")]
    .map((s) => s.textContent || "")
    .filter((t) => /141ac5afeb3a4d3d|videoUrl|video\.mp4|galleryItemType.: .video/i.test(t));
  const hits = [];
  for (const t of scripts) {
    const urls = t.match(/https?:\\\/\\\/[^"']+\.mp4[^"']*|https?:\/\/[^"']+\.mp4[^"']*/g);
    if (urls) hits.push(...urls.map((u) => u.replace(/\\\//g, "/")));
    // poster id nearby video meta
    const idx = t.indexOf("141ac5af");
    if (idx >= 0) hits.push({ snippet: t.slice(Math.max(0, idx - 200), idx + 500) });
  }
  // try __VIEWER_DATA__ or similar
  const keys = Object.keys(window).filter((k) => /wix|viewer|warmup|santa/i.test(k)).slice(0, 30);
  return { hits: hits.slice(0, 20), keys };
});

fs.writeFileSync(
  path.join(out, "source-workshops-video-detail.json"),
  JSON.stringify({ videoInfo, afterClick, mp4Urls, perf, wixData }, null, 2),
);
console.log(JSON.stringify({ videoInfo, afterClick, mp4Urls, perf, wixData }, null, 2));
await browser.close();
