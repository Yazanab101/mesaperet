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
}

// scroll just enough to load category strip
await page.evaluate(() => window.scrollTo(0, 700));
await page.waitForTimeout(2000);

const data = await page.evaluate(() => {
  const abs = (el) => {
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x * 100) / 100,
      y: Math.round((r.y + window.scrollY) * 100) / 100,
      w: Math.round(r.width * 100) / 100,
      h: Math.round(r.height * 100) / 100,
    };
  };

  const cards = [...document.querySelectorAll('[id^="comp-mrdu20m1__item"]')].map((el) => {
    const img = el.querySelector("img");
    const a = el.querySelector("a");
    const src = img ? (img.currentSrc || img.src).split("?")[0] : null;
    return {
      text: (a?.innerText || el.innerText || "").replace(/\s+/g, " ").trim(),
      box: abs(el),
      href: a?.getAttribute("href"),
      img: img
        ? {
            ...abs(img),
            alt: img.alt,
            src,
            file: src?.match(/([^/]+\.(?:jpe?g|png|webp))/i)?.[1] || null,
            objectFit: getComputedStyle(img).objectFit,
            objectPosition: getComputedStyle(img).objectPosition,
          }
        : null,
    };
  });

  // logo strip — measure first few visible-ish imgs in logo section
  const logoSec = document.getElementById("comp-meaujksw");
  const logos = logoSec
    ? [...logoSec.querySelectorAll("img")].slice(0, 12).map((img) => ({
        alt: img.alt,
        ...abs(img),
        src: (img.currentSrc || img.src).split("?")[0],
        file: (img.currentSrc || img.src).match(/([^/?#]+\.(?:jpe?g|png|webp))/i)?.[1],
        objectFit: getComputedStyle(img).objectFit,
      }))
    : [];

  // measure logo carousel viewport / slides
  const logoViewport = logoSec?.querySelector("[data-testid='slidesWrapper'], .slick-list, [data-hook='responsive-container']") || logoSec;
  const logoBox = logoSec ? abs(logoSec) : null;

  // section banners with title overlay height variants
  const banners = ["comp-lzy343yo", "comp-m77cc1ic", "comp-lzy3oimr", "comp-lzy45fds", "comp-m5pe3rqd"]
    .map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const img = el.querySelector("img");
      const h = el.querySelector("h2");
      return {
        id,
        box: abs(el),
        title: h?.innerText?.trim(),
        titleBox: h ? abs(h) : null,
        img: img
          ? {
              ...abs(img),
              file: (img.currentSrc || img.src).match(/([^/?#]+\.(?:jpe?g|png|webp))/i)?.[1],
            }
          : null,
      };
    })
    .filter(Boolean);

  return { cards, logos, logoBox, banners };
});

fs.writeFileSync(path.join(out, "source-workshops-cats.json"), JSON.stringify(data, null, 2));
console.log(JSON.stringify(data, null, 2));
await browser.close();
