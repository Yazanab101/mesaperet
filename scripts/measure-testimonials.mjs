import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "measurement");
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  locale: "he-IL",
});

for (let i = 0; i < 4; i++) {
  const res = await page.goto("https://www.me-saperet.com/%D7%94%D7%9E%D7%9C%D7%A6%D7%95%D7%AA", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  console.log("attempt", i, res?.status());
  await page.waitForTimeout(6000);
  const h1 = await page.locator("h1").first().innerText().catch(() => "");
  console.log("h1", h1);
  if (h1.includes("המלצות")) break;
}

await page.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 100));
  }
});
await page.waitForTimeout(2000);

await page.screenshot({
  path: path.join(out, "source-testimonials-desktop-1440.png"),
  fullPage: true,
});

const data = await page.evaluate(() => {
  const round = (n) => Math.round(n * 100) / 100;
  const measure = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const c = getComputedStyle(el);
    return {
      id: el.id || null,
      tag: el.tagName,
      text: (el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 220),
      absY: round(r.top + window.scrollY),
      x: round(r.x),
      w: round(r.width),
      h: round(r.height),
      bg: c.backgroundColor,
      color: c.color,
      fontFamily: c.fontFamily,
      fontSize: c.fontSize,
      fontWeight: c.fontWeight,
      lineHeight: c.lineHeight,
      textAlign: c.textAlign,
      display: c.display,
      objectFit: c.objectFit,
      objectPosition: c.objectPosition,
      borderRadius: c.borderRadius,
    };
  };

  const sections = [...document.querySelectorAll("section")]
    .map(measure)
    .filter((s) => s && s.h > 40);

  const headings = [...document.querySelectorAll("h1,h2,h3,h4")].map(measure);

  const imgs = [...document.querySelectorAll("img")]
    .filter((img) => {
      const r = img.getBoundingClientRect();
      return r.width > 40 && r.height > 40;
    })
    .map((img) => ({
      ...measure(img),
      alt: img.alt,
      src: (img.currentSrc || img.src).split("?")[0],
      file: ((img.currentSrc || img.src).match(/([^/?#]+\.(?:jpe?g|png|webp|gif))/i) || [])[1] || null,
      nw: img.naturalWidth,
      nh: img.naturalHeight,
    }));

  const paras = [...document.querySelectorAll("p")]
    .map(measure)
    .filter((p) => p && p.text && p.text.length > 20)
    .slice(0, 30);

  const links = [...document.querySelectorAll("a")]
    .map((a) => ({
      ...measure(a),
      href: a.getAttribute("href"),
    }))
    .filter((a) => a && a.text && /המלצ|איך|סדנ|ייעוץ|קשר|מיטל|עוד/.test(a.text));

  const wa = [...document.querySelectorAll("a")].filter((a) =>
    /ליצירת קשר עם מיטל/.test(a.innerText || a.getAttribute("aria-label") || ""),
  ).map(measure);

  // group content images (not logos/header) by Y bands
  const contentImgs = imgs.filter(
    (i) =>
      i.x >= 0 &&
      i.x < 1440 &&
      i.w > 80 &&
      !/לוגו|מיטל גוטמן שקד-|favicon|Skynet/i.test(i.alt || ""),
  );

  return {
    scrollH: document.documentElement.scrollHeight,
    sections: sections.map((s) => ({
      id: s.id,
      absY: s.absY,
      h: s.h,
      text: (s.text || "").slice(0, 140),
    })),
    headings,
    paras,
    wa,
    links,
    imgCount: contentImgs.length,
    imgs: contentImgs,
  };
});

fs.writeFileSync(path.join(out, "source-testimonials-desktop-1440.json"), JSON.stringify(data, null, 2));
console.log(
  JSON.stringify(
    {
      scrollH: data.scrollH,
      headings: data.headings,
      sections: data.sections,
      paras: data.paras,
      wa: data.wa,
      links: data.links,
      imgCount: data.imgCount,
      imgsSample: data.imgs.slice(0, 40).map((i) => ({
        alt: i.alt,
        absY: i.absY,
        x: i.x,
        w: i.w,
        h: i.h,
        file: i.file,
      })),
    },
    null,
    2,
  ),
);

await browser.close();
