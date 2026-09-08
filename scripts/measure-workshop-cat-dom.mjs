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

await page.evaluate(() => window.scrollTo(0, 850));
await page.waitForTimeout(2500);

const data = await page.evaluate(() => {
  const section = document.getElementById("comp-mrdu197u");
  if (!section) return { error: "no section", ids: [...document.querySelectorAll("[id*=mrdu]")].map((e) => e.id).slice(0, 40) };

  const walk = (el, depth = 0) => {
    if (depth > 6) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const bg = cs.backgroundImage;
    const kids = [...el.children].map((c) => walk(c, depth + 1)).filter(Boolean);
    const info = {
      tag: el.tagName,
      id: el.id || undefined,
      cls: (el.className && String(el.className).slice?.(0, 80)) || undefined,
      text: (el.innerText || "").replace(/\s+/g, " ").trim().slice(0, 60) || undefined,
      x: Math.round(r.x),
      y: Math.round(r.y + scrollY),
      w: Math.round(r.width),
      h: Math.round(r.height),
      bgImg: bg && bg !== "none" ? bg.slice(0, 180) : undefined,
      imgSrc: el.tagName === "IMG" ? (el.currentSrc || el.src).slice(0, 200) : undefined,
    };
    if (!info.bgImg && !info.imgSrc && kids.length === 0 && !info.text) return null;
    return kids.length ? { ...info, kids } : info;
  };

  // image containers
  const media = [...section.querySelectorAll("img, [data-testid='imageX'], wow-image, [style*='background']")].map((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName,
      id: el.id,
      alt: el.alt,
      src: el.currentSrc || el.src || null,
      bg: cs.backgroundImage?.slice(0, 220),
      x: Math.round(r.x),
      y: Math.round(r.y + scrollY),
      w: Math.round(r.width),
      h: Math.round(r.height),
    };
  });

  // also look at mrduui0i items
  const imageItems = [...document.querySelectorAll('[id^="comp-mrduui0i__item"]')].map((el) => {
    const r = el.getBoundingClientRect();
    const img = el.querySelector("img");
    const cs = getComputedStyle(el);
    const bgEl = el.querySelector("[data-testid='linkElement'], [style*='background'], div");
    let bg = cs.backgroundImage;
    if ((!bg || bg === "none") && bgEl) bg = getComputedStyle(bgEl).backgroundImage;
    // deep search background
    let deepBg = null;
    let deepSrc = null;
    el.querySelectorAll("*").forEach((n) => {
      const b = getComputedStyle(n).backgroundImage;
      if (b && b !== "none" && !deepBg) deepBg = b;
      if (n.tagName === "IMG" && !deepSrc) deepSrc = n.currentSrc || n.src;
    });
    return {
      id: el.id,
      text: el.innerText.replace(/\s+/g, " ").trim().slice(0, 40),
      x: Math.round(r.x),
      y: Math.round(r.y + scrollY),
      w: Math.round(r.width),
      h: Math.round(r.height),
      img: img ? (img.currentSrc || img.src) : null,
      deepSrc,
      deepBg: deepBg?.slice(0, 250),
      html: el.innerHTML.slice(0, 400),
    };
  });

  return {
    sectionHtmlHead: section.innerHTML.slice(0, 500),
    media,
    imageItems,
    tree: walk(section),
  };
});

fs.writeFileSync(path.join(out, "source-workshops-cat-dom.json"), JSON.stringify(data, null, 2));
console.log(JSON.stringify({ media: data.media, imageItems: data.imageItems }, null, 2));
await browser.close();
