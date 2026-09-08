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
  await page.goto("https://www.me-saperet.com/%D7%94%D7%9E%D7%9C%D7%A6%D7%95%D7%AA", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.waitForTimeout(6000);
  if ((await page.locator("h1").first().innerText().catch(() => "")).includes("המלצות")) break;
}

await page.evaluate(() => window.scrollTo(0, 350));
await page.waitForTimeout(2000);

const info = await page.evaluate(() => {
  const sec = document.getElementById("comp-lups18qc");
  const r = sec?.getBoundingClientRect();
  const imgs = [...(sec?.querySelectorAll("img") || [])].map((img) => {
    const ir = img.getBoundingClientRect();
    return {
      alt: img.alt,
      file: (img.currentSrc || img.src).match(/([^/?#]+\.(?:jpe?g|png|webp))/i)?.[1],
      x: Math.round(ir.x),
      y: Math.round(ir.y + scrollY),
      w: Math.round(ir.width),
      h: Math.round(ir.height),
    };
  });

  // look for slider structure / pro gallery
  const galleries = [...document.querySelectorAll("[id*=gallery], [class*=gallery], [data-hook*=gallery]")]
    .slice(0, 15)
    .map((el) => {
      const b = el.getBoundingClientRect();
      return {
        id: el.id,
        cls: String(el.className).slice(0, 80),
        y: Math.round(b.y + scrollY),
        w: Math.round(b.width),
        h: Math.round(b.height),
        imgCount: el.querySelectorAll("img").length,
      };
    });

  const tabs = document.getElementById("comp-mrtn37by");
  const tabChildren = tabs
    ? [...tabs.querySelectorAll("*")]
        .filter((el) => {
          const t = (el.innerText || "").trim();
          return t === "סדנאות" || t === "מפגשים אישיים";
        })
        .map((el) => {
          const b = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return {
            tag: el.tagName,
            id: el.id,
            text: el.innerText.trim(),
            x: Math.round(b.x),
            y: Math.round(b.y + scrollY),
            w: Math.round(b.width),
            h: Math.round(b.height),
            fontSize: cs.fontSize,
            fontFamily: cs.fontFamily,
            color: cs.color,
            bg: cs.backgroundColor,
            borderRadius: cs.borderRadius,
            textAlign: cs.textAlign,
            href: el.getAttribute?.("href"),
          };
        })
    : [];

  // names under slides
  const nameEls = [...(sec?.querySelectorAll("p, span, h2, h3, h4, a") || [])]
    .map((el) => {
      const t = (el.innerText || "").trim();
      const b = el.getBoundingClientRect();
      if (!t || t.length > 30 || b.width < 20) return null;
      return {
        text: t,
        x: Math.round(b.x),
        y: Math.round(b.y + scrollY),
        w: Math.round(b.width),
        h: Math.round(b.height),
        fontSize: getComputedStyle(el).fontSize,
        color: getComputedStyle(el).color,
      };
    })
    .filter(Boolean)
    .slice(0, 50);

  // personal gallery container width
  const personal = document.getElementById("comp-lullf7l9");
  const pr = personal?.getBoundingClientRect();
  const personalImgs = [...(personal?.querySelectorAll("img") || [])].slice(0, 5).map((img) => {
    const ir = img.getBoundingClientRect();
    const parent = img.closest("[id^=item], .gallery-item-container, [data-hook]");
    return {
      file: (img.currentSrc || img.src).match(/([^/?#]+\.(?:jpe?g|png|webp))/i)?.[1],
      x: Math.round(ir.x),
      w: Math.round(ir.width),
      h: Math.round(ir.height),
      objectFit: getComputedStyle(img).objectFit,
      parentW: parent ? Math.round(parent.getBoundingClientRect().width) : null,
    };
  });

  return {
    section: r ? { y: r.y + scrollY, h: r.height, w: r.width } : null,
    imgCount: imgs.length,
    imgsInView: imgs.filter((i) => i.x > -50 && i.x < 1500 && i.w > 80),
    imgsAll: imgs.slice(0, 30),
    galleries,
    tabChildren,
    nameEls,
    personal: pr ? { y: pr.y + scrollY, h: pr.height, w: pr.width, x: pr.x } : null,
    personalImgs,
  };
});

// scroll through top section to capture slide sizes
await page.evaluate(async () => {
  for (let y = 300; y < 7500; y += 400) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 80));
  }
});
await page.waitForTimeout(1000);

const afterScroll = await page.evaluate(() => {
  const sec = document.getElementById("comp-lups18qc");
  return [...(sec?.querySelectorAll("img") || [])].map((img) => {
    const ir = img.getBoundingClientRect();
    return {
      alt: img.alt,
      file: (img.currentSrc || img.src).match(/([^/?#]+\.(?:jpe?g|png|webp))/i)?.[1],
      x: Math.round(ir.x),
      y: Math.round(ir.y + scrollY),
      w: Math.round(ir.width),
      h: Math.round(ir.height),
    };
  });
});

fs.writeFileSync(
  path.join(out, "source-testimonials-top.json"),
  JSON.stringify({ info, afterScroll }, null, 2),
);
console.log(JSON.stringify({ info, afterScrollCount: afterScroll.length, afterScroll: afterScroll.slice(0, 25) }, null, 2));
await browser.close();
