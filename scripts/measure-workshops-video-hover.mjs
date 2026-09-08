import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "measurement");

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

// scroll full page to load media
await page.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
});
await page.waitForTimeout(2000);

// hover a category icon and capture transform
await page.evaluate(() => window.scrollTo(0, 900));
await page.waitForTimeout(500);

const catSel = '[id^="comp-mrdupy2f__item"] svg, [id^="comp-mrduui0i__item"] svg';
const cat = page.locator(catSel).first();
const before = await cat.evaluate((el) => {
  const cs = getComputedStyle(el);
  const parent = el.closest("a,div");
  const pcs = parent ? getComputedStyle(parent) : null;
  return {
    transform: cs.transform,
    transition: cs.transition,
    parentTransform: pcs?.transform,
    parentTransition: pcs?.transition,
    parentClass: parent?.className?.toString?.().slice(0, 120),
  };
});

await cat.hover({ force: true }).catch(() => {});
await page.waitForTimeout(800);
const after = await cat.evaluate((el) => {
  const cs = getComputedStyle(el);
  const parent = el.closest("a,div");
  const pcs = parent ? getComputedStyle(parent) : null;
  // also check keyframes / animation
  return {
    transform: cs.transform,
    transition: cs.transition,
    animation: cs.animation,
    parentTransform: pcs?.transform,
    parentTransition: pcs?.transition,
    parentAnimation: pcs?.animation,
  };
});

// find ALL video / iframe / media players
const media = await page.evaluate(() => {
  const abs = (el) => {
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x * 100) / 100,
      y: Math.round((r.y + scrollY) * 100) / 100,
      w: Math.round(r.width * 100) / 100,
      h: Math.round(r.height * 100) / 100,
    };
  };

  const videos = [...document.querySelectorAll("video, iframe, [data-testid='videoPlayer'], [class*='video'], wix-video, [id*='video']")]
    .map((el) => {
      const v = el.tagName === "VIDEO" ? el : el.querySelector?.("video");
      const iframe = el.tagName === "IFRAME" ? el : el.querySelector?.("iframe");
      return {
        tag: el.tagName,
        id: el.id || null,
        ...abs(el),
        src: v?.currentSrc || v?.src || iframe?.src || el.getAttribute("src") || null,
        poster: v?.poster || null,
        aria: el.getAttribute("aria-label"),
        html: el.outerHTML.slice(0, 300),
      };
    })
    .filter((m) => m.w > 40 && m.h > 40);

  // also look for wix video containers by media URL patterns
  const mediaLinks = [...document.querySelectorAll("a[href*='video'], source, [data-video-url], [data-src*='mp4'], [data-src*='wixstatic']")]
    .slice(0, 30)
    .map((el) => ({
      tag: el.tagName,
      href: el.getAttribute("href") || el.getAttribute("src") || el.getAttribute("data-src") || el.getAttribute("data-video-url"),
      ...abs(el),
    }));

  // section order with media
  const sections = [...document.querySelectorAll("section")]
    .filter((s) => s.getBoundingClientRect().height > 80)
    .map((s) => ({
      id: s.id,
      text: (s.innerText || "").replace(/\s+/g, " ").trim().slice(0, 120),
      ...abs(s),
      hasVideo: !!s.querySelector("video, iframe, [class*='video']"),
      imgCount: s.querySelectorAll("img").length,
    }));

  // find elements between retreats and home-circles / company galleries
  const headings = [...document.querySelectorAll("h2")].map((h) => ({
    text: h.innerText.trim(),
    ...abs(h),
  }));

  return { videos, mediaLinks, sections, headings };
});

// try hover via evaluating mouseenter and reading computed style after transition
const hoverCss = await page.evaluate(async () => {
  const roots = [...document.querySelectorAll('[id^="comp-mrdupy2f__item"]')];
  const sample = roots[0];
  if (!sample) return null;
  const target = sample.querySelector("a, svg, div") || sample;
  const read = (el) => {
    const cs = getComputedStyle(el);
    return { transform: cs.transform, transition: cs.transition, animation: cs.animation, filter: cs.filter };
  };
  const before = read(target);
  // dispatch mouseenter up the tree
  sample.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
  sample.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 600));
  const mid = read(target);
  // check all descendants transforms
  const transforms = [...sample.querySelectorAll("*")].map((el) => {
    const cs = getComputedStyle(el);
    if (cs.transform !== "none" || (cs.animation && cs.animation !== "none")) {
      return { tag: el.tagName, id: el.id, cls: String(el.className).slice(0, 80), transform: cs.transform, animation: cs.animation, transition: cs.transition };
    }
    return null;
  }).filter(Boolean);
  return { before, mid, transforms, sampleId: sample.id, html: sample.innerHTML.slice(0, 500) };
});

fs.writeFileSync(
  path.join(out, "source-workshops-video-hover.json"),
  JSON.stringify({ before, after, hoverCss, media }, null, 2),
);
console.log(JSON.stringify({ before, after, hoverCss, mediaSummary: {
  videos: media.videos,
  headings: media.headings,
  sectionsWithVideo: media.sections.filter((s) => s.hasVideo),
  mediaLinks: media.mediaLinks.slice(0, 15),
}}, null, 2));

await browser.close();
