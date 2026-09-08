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

// Prevent accidental navigations away from homepage after first load
let ready = false;
await page.route("**/*", async (route) => {
  const req = route.request();
  if (ready && req.isNavigationRequest() && req.frame() === page.mainFrame()) {
    const url = req.url();
    if (!url.includes("me-saperet.com/?") && url !== "https://www.me-saperet.com/" && !url.endsWith("me-saperet.com/")) {
      // allow same-page hash only
      if (!url.startsWith("https://www.me-saperet.com/#")) {
        await route.abort();
        return;
      }
    }
  }
  await route.continue();
});

await page.goto("https://www.me-saperet.com/", { waitUntil: "domcontentloaded", timeout: 90000 });
await page.waitForTimeout(5000);
ready = true;

await page.evaluate(() => {
  window.scrollTo(0, document.documentElement.scrollHeight);
});
await page.waitForTimeout(2000);

await page.screenshot({ path: path.join(out, "source-footer-viewport-1440.png") });

const data = await page.evaluate(() => {
  const round = (n) => Math.round(n * 100) / 100;
  const measure = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const c = getComputedStyle(el);
    return {
      id: el.id || null,
      tag: el.tagName,
      text: (el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 100),
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
      letterSpacing: c.letterSpacing,
      textAlign: c.textAlign,
      margin: c.margin,
      padding: c.padding,
      position: c.position,
      display: c.display,
      transform: c.transform,
    };
  };

  const gulash = [...document.querySelectorAll("h1,h2,h3,p,span,div,a")]
    .filter((el) => /gulash/i.test(getComputedStyle(el).fontFamily))
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 30 && r.height > 10;
    })
    .map(measure);

  const foot =
    document.querySelector("#comp-kbgakxmn_r_comp-kbgakgyt") ||
    [...document.querySelectorAll("section")].at(-1);
  const fr = foot.getBoundingClientRect();

  const comps = [...foot.querySelectorAll("[id^=comp-]")].map((el) => {
    const m = measure(el);
    return {
      ...m,
      relX: round(el.getBoundingClientRect().x - fr.x),
      relY: round(el.getBoundingClientRect().top - fr.top),
    };
  });

  // leaf text nodes with almoni in footer
  const leaves = [...foot.querySelectorAll("a,p,span,h1,h2,h3,button")]
    .map(measure)
    .filter((m) => m && m.text && m.h < 80 && m.w < 400);

  const h1 = measure(document.querySelector("h1"));
  const title = measure(document.querySelector("#comp-mkvjy95i"));
  const logo = measure(
    [...foot.querySelectorAll("img")].find((i) => /לוגו|logo/i.test(i.alt || "")),
  );
  const search = measure(foot.querySelector('[aria-label="Search"], .wixui-search-button'));

  // bg layers
  const titleBg = document.querySelector("#bgLayers_comp-mkvjy95i, #comp-mkvjy95i [id^=bgLayers]");
  const footBg = foot.querySelector("[id^=bgLayers], .LNYVZi");

  return {
    scrollY: window.scrollY,
    scrollH: document.documentElement.scrollHeight,
    gulash,
    h1,
    title,
    titleBg: titleBg ? getComputedStyle(titleBg).backgroundColor : null,
    foot: {
      id: foot.id,
      absY: round(fr.top + window.scrollY),
      h: round(fr.height),
      bg: footBg ? getComputedStyle(footBg).backgroundColor : getComputedStyle(foot).backgroundColor,
    },
    logo,
    search,
    comps,
    leaves,
  };
});

fs.writeFileSync(path.join(out, "source-footer-deep.json"), JSON.stringify(data, null, 2));
console.log(JSON.stringify(data, null, 2));
await browser.close();
