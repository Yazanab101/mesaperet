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
  const res = await page.goto("https://www.me-saperet.com/%D7%99%D7%99%D7%A2%D7%95%D7%A5", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  console.log("attempt", i, res?.status());
  await page.waitForTimeout(6000);
  const h1 = await page.locator("h1").first().innerText().catch(() => "");
  console.log("h1", h1);
  if (/ייעוץ|טיפול/.test(h1)) break;
}

await page.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 450) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 90));
  }
});
await page.waitForTimeout(2000);

await page.screenshot({
  path: path.join(out, "source-consultation-desktop-1440.png"),
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
      text: (el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 260),
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
    .filter((s) => s && s.h > 40)
    .map((s) => ({ id: s.id, absY: s.absY, h: s.h, w: s.w, text: (s.text || "").slice(0, 160) }));

  const headings = [...document.querySelectorAll("h1,h2,h3,h4")].map(measure);

  const paras = [...document.querySelectorAll("p")]
    .map(measure)
    .filter((p) => p && p.text && p.text.length > 25 && p.w > 100)
    .slice(0, 40);

  const imgs = [...document.querySelectorAll("img")]
    .filter((img) => {
      const r = img.getBoundingClientRect();
      return r.width > 60 && r.height > 40;
    })
    .map((img) => ({
      ...measure(img),
      alt: img.alt,
      src: (img.currentSrc || img.src).split("?")[0],
      file: ((img.currentSrc || img.src).match(/([^/?#]+\.(?:jpe?g|png|webp|gif))/i) || [])[1] || null,
    }))
    .filter((i) => i.x > -200 && i.x < 1600 && !/favicon|לוגו מיטל גוטמן שקד-|Skynet/i.test(i.alt || ""));

  const wa = [...document.querySelectorAll("a")]
    .filter((a) => /ליצירת קשר עם מיטל/.test(a.innerText || a.getAttribute("aria-label") || ""))
    .map(measure);

  const links = [...document.querySelectorAll("a")]
    .map((a) => ({ ...measure(a), href: a.getAttribute("href") }))
    .filter((a) => a && a.text && a.w > 40 && a.h > 20 && a.absY > 150 && a.absY < 8000)
    .slice(0, 40);

  // videos
  const scripts = [...document.querySelectorAll("script")].map((s) => s.textContent || "").join("\n");
  const videoCount = (scripts.match(/"type":"video"/g) || []).length;
  const videoHits = [];
  const re = /"type":"video"[\s\S]{0,250}?"name":"([^"]+\.mp4)"[\s\S]{0,450}?"mediaUrl":"(44c6b1_[a-f0-9]+)"/g;
  let m;
  while ((m = re.exec(scripts))) videoHits.push({ name: m[1], mediaUrl: m[2] });

  return {
    scrollH: document.documentElement.scrollHeight,
    sections,
    headings,
    paras,
    wa,
    links,
    videoCount,
    videoHits,
    imgs: imgs.filter((i) => !/מיטל גוטמן שקד- מספרת/.test(i.alt || "")),
  };
});

fs.writeFileSync(path.join(out, "source-consultation-desktop-1440.json"), JSON.stringify(data, null, 2));
console.log(
  JSON.stringify(
    {
      scrollH: data.scrollH,
      headings: data.headings,
      sections: data.sections,
      paras: data.paras,
      wa: data.wa,
      videoCount: data.videoCount,
      videoHits: data.videoHits,
      imgCount: data.imgs.length,
      imgs: data.imgs.map((i) => ({
        alt: i.alt,
        absY: i.absY,
        x: i.x,
        w: i.w,
        h: i.h,
        file: i.file,
        objectPosition: i.objectPosition,
      })),
    },
    null,
    2,
  ),
);

await browser.close();
