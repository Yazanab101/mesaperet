/**
 * Measure homepage bottom + footer from live Wix @ 1440×900
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "measurement");

function round(n) {
  return Math.round(n * 100) / 100;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
await page.goto("https://www.me-saperet.com/", {
  waitUntil: "networkidle",
  timeout: 90000,
});
await page.waitForTimeout(800);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1200);
await page.screenshot({
  path: path.join(outDir, "source-home-bottom-1440x900.png"),
  fullPage: false,
});
await page.screenshot({
  path: path.join(outDir, "source-home-fullpage-1440.png"),
  fullPage: true,
});

const data = await page.evaluate(() => {
  const round = (n) => Math.round(n * 100) / 100;
  const measure = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const c = getComputedStyle(el);
    return {
      tag: el.tagName,
      id: el.id || null,
      className: String(el.className || "").slice(0, 160),
      text: (el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 100),
      absY: round(r.top + window.scrollY),
      x: round(r.x),
      y: round(r.y),
      w: round(r.width),
      h: round(r.height),
      position: c.position,
      display: c.display,
      transform: c.transform,
      margin: c.margin,
      padding: c.padding,
      zIndex: c.zIndex,
      bg: c.backgroundColor,
      color: c.color,
      fontFamily: c.fontFamily,
      fontSize: c.fontSize,
      fontWeight: c.fontWeight,
      lineHeight: c.lineHeight,
      letterSpacing: c.letterSpacing,
      textAlign: c.textAlign,
      justifyContent: c.justifyContent,
      alignItems: c.alignItems,
      flexDirection: c.flexDirection,
      gap: c.gap,
      gridTemplateColumns: c.gridTemplateColumns,
      gridTemplateRows: c.gridTemplateRows,
    };
  };

  const scrollY = window.scrollY;
  const scrollH = document.documentElement.scrollHeight;

  // H1
  const h1s = [...document.querySelectorAll("h1")].map(measure);

  // Find footer / teal band by scanning large sections near bottom
  const candidates = [...document.querySelectorAll("section, footer, [id^=comp-], [data-testid]")];
  const bottomBlocks = candidates
    .map((el) => {
      const r = el.getBoundingClientRect();
      const absY = r.top + window.scrollY;
      if (r.height < 40 || r.width < 200) return null;
      if (absY < 900) return null;
      return { el, absY, ...measure(el) };
    })
    .filter(Boolean)
    .sort((a, b) => a.absY - b.absY);

  // Teal footer: background with high G/B
  const teal = candidates
    .map((el) => {
      const bg = getComputedStyle(el).backgroundColor;
      const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return null;
      const r = +m[1];
      const g = +m[2];
      const b = +m[3];
      const rect = el.getBoundingClientRect();
      if (g < 150 || b < 130 || r > 130) return null;
      if (rect.height < 120 || rect.width < 400) return null;
      return { el, bg, ...measure(el) };
    })
    .filter(Boolean)
    .sort((a, b) => b.h - a.h);

  const footerRoot = teal[0]?.el || document.querySelector("#SITE_FOOTER, footer");

  // Children of footer with text/images
  let footerChildren = [];
  if (footerRoot) {
    const kids = [...footerRoot.querySelectorAll("a, p, h1, h2, h3, h4, span, img, nav, ul, li, svg")];
    footerChildren = kids
      .map((el) => {
        const r = el.getBoundingClientRect();
        if (r.width < 8 || r.height < 8) return null;
        const t = (el.innerText || el.getAttribute("alt") || el.getAttribute("aria-label") || "").trim();
        if (!t && el.tagName !== "IMG" && el.tagName !== "SVG") return null;
        return measure(el);
      })
      .filter(Boolean)
      .filter((m, i, arr) => {
        // dedupe near-identical
        return !arr.slice(0, i).some(
          (o) =>
            o.text === m.text &&
            Math.abs(o.x - m.x) < 2 &&
            Math.abs(o.y - m.y) < 2 &&
            Math.abs(o.w - m.w) < 2,
        );
      })
      .slice(0, 80);
  }

  // Rich text near title section (between hero and footer)
  const titleSection = [...document.querySelectorAll("[id^=comp-]")].find((el) => {
    const t = (el.innerText || "").trim();
    return t.includes("מיטל גוטמן שקד נומרולוגית") && el.querySelector("h1,h2,p");
  });

  // Search icon
  const searchish = [...document.querySelectorAll("a,button,[role=button],svg")].filter((el) => {
    const label = (el.getAttribute("aria-label") || el.innerText || "").toLowerCase();
    return /search|חיפוש|magnif/i.test(label) || (el.tagName === "SVG" && el.closest("a"));
  });

  return {
    scrollY,
    scrollH,
    h1s,
    bottomBlocks: bottomBlocks.slice(0, 25).map(({ el, ...rest }) => rest),
    teal: teal.slice(0, 5).map(({ el, ...rest }) => rest),
    footerRoot: measure(footerRoot),
    footerChildren,
    titleSection: measure(titleSection),
    searchLabels: searchish.slice(0, 15).map((el) => ({
      label: el.getAttribute("aria-label"),
      text: (el.innerText || "").slice(0, 40),
      ...measure(el),
    })),
  };
});

fs.writeFileSync(path.join(outDir, "source-home-bottom-1440x900.json"), JSON.stringify(data, null, 2));
console.log(
  JSON.stringify(
    {
      scrollH: data.scrollH,
      h1s: data.h1s,
      teal: data.teal,
      footerRoot: data.footerRoot,
      titleSection: data.titleSection,
      childCount: data.footerChildren.length,
      children: data.footerChildren.slice(0, 40),
    },
    null,
    2,
  ),
);

await browser.close();
