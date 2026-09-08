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
  const res = await page.goto("https://www.me-saperet.com/%D7%A1%D7%93%D7%A0%D7%90%D7%95%D7%AA", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  console.log("attempt", i, res?.status());
  await page.waitForTimeout(6000);
  const h1 = await page.locator("h1").first().innerText().catch(() => "");
  console.log("h1", h1);
  if (h1.includes("סדנאות")) break;
  await page.waitForTimeout(2000);
}

await page.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 100));
  }
});
await page.waitForTimeout(1500);
await page.screenshot({
  path: path.join(out, "source-workshops-desktop-1440.png"),
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

  const sections = [...document.querySelectorAll("section")].map((el) => ({
    ...measure(el),
    bgLayer: (() => {
      const bg = el.querySelector("[id^=bgLayers], .LNYVZi");
      return bg ? getComputedStyle(bg).backgroundColor : null;
    })(),
  }));

  const headings = [...document.querySelectorAll("h1,h2,h3,h4")].map(measure);

  const imgs = [...document.querySelectorAll("img")]
    .filter((img) => {
      const r = img.getBoundingClientRect();
      return r.width > 50 && r.height > 40;
    })
    .map((img) => ({
      ...measure(img),
      alt: img.alt,
      src: (img.currentSrc || img.src).split("?")[0],
      nw: img.naturalWidth,
      nh: img.naturalHeight,
    }));

  // category jump links / chips
  const chips = [...document.querySelectorAll("a,button,p,div,span")]
    .filter((el) => {
      const t = (el.innerText || "").trim();
      return [
        "בוקר אמהות",
        "מסיבת רווקות",
        "חוגי בית, ימי הולדת ומפגשי גיבוש",
        "ריטריטים",
        "ארועי חברה וסדנאות",
      ].includes(t);
    })
    .map((el) => ({
      ...measure(el),
      href: el.getAttribute?.("href"),
      tagName: el.tagName,
    }));

  // dedupe chips by text+y
  const chipUniq = [];
  for (const c of chips) {
    if (chipUniq.some((u) => u.text === c.text && Math.abs(u.absY - c.absY) < 8 && Math.abs(u.w - c.w) < 20))
      continue;
    chipUniq.push(c);
  }

  const paras = [...document.querySelectorAll("p")]
    .map(measure)
    .filter((p) => p && p.text && p.text.length > 40 && /gulash|almoni|Arial/i.test(p.fontFamily + p.text))
    .slice(0, 20);

  const wa = [...document.querySelectorAll("a")].filter((a) =>
    /ליצירת קשר עם מיטל/.test(a.innerText || a.getAttribute("aria-label") || ""),
  ).map(measure);

  // logo strip imgs
  const logos = imgs.filter((i) => /לוגו|תנובה|MEDASSIST|מנורה|ענבי|מכבי|אמן/i.test(i.alt || ""));

  return {
    scrollH: document.documentElement.scrollHeight,
    sections: sections.filter((s) => s && s.h > 50),
    headings,
    logos,
    imgs: imgs.filter((i) => !/לוגו|מיטל גוטמן שקד-|favicon/i.test(i.alt || "")),
    chips: chipUniq,
    paras,
    wa,
  };
});

fs.writeFileSync(path.join(out, "source-workshops-desktop-1440.json"), JSON.stringify(data, null, 2));
console.log(JSON.stringify({
  scrollH: data.scrollH,
  headings: data.headings,
  sections: data.sections.map((s) => ({ id: s.id, absY: s.absY, h: s.h, text: (s.text || "").slice(0, 100) })),
  logos: data.logos,
  chips: data.chips,
  paras: data.paras,
  wa: data.wa,
  imgCount: data.imgs.length,
  imgsSample: data.imgs.slice(0, 25).map((i) => ({ alt: i.alt, absY: i.absY, x: i.x, w: i.w, h: i.h })),
}, null, 2));

await browser.close();
