import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "measurement");
fs.mkdirSync(out, { recursive: true });

const urls = [
  "https://www.me-saperet.com/gift",
  "https://www.me-saperet.com/%D7%A9%D7%95%D7%91%D7%A8",
  "https://www.me-saperet.com/%D7%A9%D7%95%D7%91%D7%A8-%D7%9E%D7%AA%D7%A0%D7%94",
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  locale: "he-IL",
});

let usedUrl = urls[0];
for (const u of urls) {
  const res = await page.goto(u, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(5000);
  const h1 = await page.locator("h1").first().innerText().catch(() => "");
  console.log("try", u, res?.status(), "h1=", h1, "final=", page.url());
  if (/שובר/.test(h1)) {
    usedUrl = page.url();
    break;
  }
}

await page.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 450) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 90));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(2000);

await page.screenshot({
  path: path.join(out, "source-gift-desktop-1440.png"),
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
      text: (el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 320),
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
      padding: c.padding,
      margin: c.margin,
    };
  };

  const sections = [...document.querySelectorAll("section")]
    .map(measure)
    .filter((s) => s && s.h > 40)
    .map((s) => ({ id: s.id, absY: s.absY, h: s.h, w: s.w, text: (s.text || "").slice(0, 180) }));

  const headings = [...document.querySelectorAll("h1,h2,h3,h4")].map(measure);

  const paras = [...document.querySelectorAll("p")]
    .map(measure)
    .filter((p) => p && p.text && p.text.length > 8 && p.w > 80)
    .slice(0, 50);

  const imgs = [...document.querySelectorAll("img")]
    .filter((img) => {
      const r = img.getBoundingClientRect();
      return r.width > 50 && r.height > 30;
    })
    .map((img) => ({
      ...measure(img),
      alt: img.alt,
      src: (img.currentSrc || img.src).split("?")[0],
      file: ((img.currentSrc || img.src).match(/([^/?#]+\.(?:jpe?g|png|webp|gif))/i) || [])[1] || null,
    }))
    .filter((i) => i.x > -200 && i.x < 1600 && !/favicon|לוגו מיטל גוטמן שקד-|Skynet/i.test(i.alt || ""));

  const wa = [...document.querySelectorAll("a")]
    .filter((a) => /ליצירת קשר עם מיטל|whatsapp|wa\.me/i.test(a.innerText || a.href || a.getAttribute("aria-label") || ""))
    .map((a) => ({ ...measure(a), href: a.getAttribute("href") }));

  const buttons = [...document.querySelectorAll("a,button")]
    .map((a) => ({ ...measure(a), href: a.getAttribute?.("href") || null }))
    .filter((a) => a && a.text && a.w > 40 && a.h > 24 && a.absY > 120 && a.absY < 5000)
    .slice(0, 40);

  // background colors of main content wrappers
  const bgCandidates = [...document.querySelectorAll("[data-testid], .wixui-section, section, [id^=comp-]")]
    .map((el) => {
      const m = measure(el);
      if (!m || m.h < 80) return null;
      return { id: m.id, absY: m.absY, h: m.h, w: m.w, bg: m.bg, text: (m.text || "").slice(0, 80) };
    })
    .filter(Boolean)
    .slice(0, 40);

  return {
    scrollH: document.documentElement.scrollHeight,
    title: document.title,
    sections,
    headings,
    paras,
    imgs,
    wa,
    buttons,
    bgCandidates,
  };
});

data.usedUrl = usedUrl;
fs.writeFileSync(path.join(out, "source-gift-desktop-1440.json"), JSON.stringify(data, null, 2));
console.log(
  JSON.stringify(
    {
      usedUrl,
      scrollH: data.scrollH,
      title: data.title,
      headings: data.headings?.map((h) => ({ tag: h.tag, text: h.text, fontSize: h.fontSize, w: h.w, h: h.h, absY: h.absY })),
      paras: data.paras?.map((p) => ({ text: p.text.slice(0, 100), fontSize: p.fontSize, w: p.w, h: p.h, x: p.x, absY: p.absY })),
      imgs: data.imgs?.map((i) => ({ alt: i.alt, file: i.file, w: i.w, h: i.h, x: i.x, absY: i.absY, objectPosition: i.objectPosition })),
      wa: data.wa,
    },
    null,
    2,
  ),
);

await browser.close();
