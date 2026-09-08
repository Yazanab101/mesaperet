import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "measurement");

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  locale: "he-IL",
});
const page = await context.newPage();
page.setDefaultNavigationTimeout(90000);

await page.goto("https://www.me-saperet.com/", { waitUntil: "load" });
await page.waitForTimeout(4000);
// dismiss overlays without clicking links
await page.keyboard.press("Escape");
await page.waitForTimeout(500);

await page.evaluate(() => window.scrollTo(0, 5000));
await page.waitForTimeout(2000);
await page.screenshot({ path: path.join(out, "source-home-bottom-1440x900.png") });

const data = await page.evaluate(() => {
  const round = (n) => Math.round(n * 100) / 100;
  const measure = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const c = getComputedStyle(el);
    return {
      id: el.id || null,
      tag: el.tagName,
      cls: String(el.className || "").slice(0, 120),
      text: (el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 140),
      absY: round(r.top + window.scrollY),
      x: round(r.x),
      y: round(r.y),
      w: round(r.width),
      h: round(r.height),
      bg: c.backgroundColor,
      color: c.color,
      fontFamily: c.fontFamily,
      fontSize: c.fontSize,
      fontWeight: c.fontWeight,
      lineHeight: c.lineHeight,
      letterSpacing: c.letterSpacing,
      textAlign: c.textAlign,
      position: c.position,
      display: c.display,
      margin: c.margin,
      padding: c.padding,
      transform: c.transform,
      zIndex: c.zIndex,
      gap: c.gap,
      flexDirection: c.flexDirection,
      justifyContent: c.justifyContent,
      alignItems: c.alignItems,
      gridTemplateColumns: c.gridTemplateColumns,
      gridTemplateRows: c.gridTemplateRows,
    };
  };

  const sections = [...document.querySelectorAll("section")].map(measure);

  // Footer band: last section
  const lastSection = [...document.querySelectorAll("section")].at(-1);
  const titleSection = document.querySelector("#comp-mkvjy95i");

  const nodesUnder = (root) => {
    if (!root) return [];
    return [...root.querySelectorAll("[id^=comp-], a, h1, h2, h3, p, img, svg")]
      .map((el) => {
        const m = measure(el);
        if (!m || m.w < 6 || m.h < 6) return null;
        const href = el.getAttribute?.("href") || null;
        const aria = el.getAttribute?.("aria-label") || null;
        const img =
          el.tagName === "IMG"
            ? {
                src: el.currentSrc || el.src,
                nw: el.naturalWidth,
                nh: el.naturalHeight,
                alt: el.alt,
                objectFit: getComputedStyle(el).objectFit,
                objectPosition: getComputedStyle(el).objectPosition,
              }
            : null;
        return { ...m, href, aria, img };
      })
      .filter(Boolean);
  };

  // Exact text matches for footer links
  const want = [
    "בית",
    "אודות",
    "סדנאות",
    "ייעוץ וטיפול",
    "שובר מתנה",
    "המלצות",
    "צור קשר",
    "הצהרת נגישות",
    "מדיניות פרטיות",
    "מיטל גוטמן שקד נומרולוגית",
    "מיטל גוטמן שקד נומרולוגיה",
    'נבנה באהבה ע"י שגב דיגיטל',
  ];
  const byText = [];
  for (const t of want) {
    const el = [...document.querySelectorAll("a,p,h1,h2,h3,span,div")].find((e) => {
      const tx = (e.innerText || "").trim().replace(/\s+/g, " ");
      return tx === t;
    });
    if (el) byText.push({ needle: t, href: el.getAttribute("href"), ...measure(el) });
  }

  const socials = [...document.querySelectorAll("a")]
    .filter((a) => {
      const absY = a.getBoundingClientRect().top + window.scrollY;
      if (absY < 1150) return false;
      return /facebook|wa\.me|whatsapp/i.test(a.href || "");
    })
    .map((a) => ({ href: a.href, aria: a.getAttribute("aria-label"), ...measure(a) }));

  const imgs = [...document.querySelectorAll("img")]
    .filter((img) => img.getBoundingClientRect().top + window.scrollY > 1000)
    .map((img) => ({
      ...measure(img),
      src: img.currentSrc || img.src,
      nw: img.naturalWidth,
      nh: img.naturalHeight,
      alt: img.alt,
    }));

  // search icon
  const search = [...document.querySelectorAll("a,button,[aria-label]")]
    .filter((el) => /search|חיפוש/i.test(el.getAttribute("aria-label") || el.innerText || ""))
    .map((el) => ({ aria: el.getAttribute("aria-label"), ...measure(el) }));

  return {
    scrollH: document.documentElement.scrollHeight,
    sections,
    lastSection: measure(lastSection),
    titleSection: measure(titleSection),
    titleKids: nodesUnder(titleSection),
    footerKids: nodesUnder(lastSection),
    byText,
    socials,
    imgs,
    search,
  };
});

fs.writeFileSync(path.join(out, "source-home-footer-detail.json"), JSON.stringify(data, null, 2));
console.log(JSON.stringify(data, null, 2));
await browser.close();
