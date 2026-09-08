import { chromium, devices } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "measurement");

const browser = await chromium.launch({ headless: true });
const iPhone = devices["iPhone 13"];
const context = await browser.newContext({
  ...iPhone,
  locale: "he-IL",
});
const page = await context.newPage();

async function stableGoto() {
  for (let i = 0; i < 3; i++) {
    try {
      await page.goto("https://www.me-saperet.com/", {
        waitUntil: "load",
        timeout: 90000,
      });
      await page.waitForTimeout(5000);
      // stay on homepage
      if (!page.url().includes("me-saperet.com")) continue;
      return;
    } catch (e) {
      console.log("retry", i, e.message);
    }
  }
}

await stableGoto();

// scroll in steps to avoid weird redirects
for (let y = 0; y <= 4000; y += 400) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(200);
}
await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
await page.waitForTimeout(2000);

const vw = await page.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight, sh: document.documentElement.scrollHeight }));
console.log("viewport", vw);

await page.screenshot({ path: path.join(out, "source-footer-mobile-390.png"), fullPage: false });
await page.screenshot({ path: path.join(out, "source-home-full-mobile-390.png"), fullPage: true });

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
      textAlign: c.textAlign,
      display: c.display,
      position: c.position,
      margin: c.margin,
      padding: c.padding,
    };
  };

  const sections = [...document.querySelectorAll("section")].map((el) => ({
    ...measure(el),
    bgLayer: (() => {
      const bg = el.querySelector("[id^=bgLayers], .LNYVZi");
      return bg ? getComputedStyle(bg).backgroundColor : null;
    })(),
  }));

  const foot =
    [...document.querySelectorAll("section")].find((el) => {
      const t = (el.innerText || "");
      return t.includes("הצהרת נגישות") && t.includes("צור קשר") && t.includes("שגב");
    }) || [...document.querySelectorAll("section")].at(-1);

  const fr = foot.getBoundingClientRect();
  const title = document.querySelector("#comp-mkvjy95i") ||
    [...document.querySelectorAll("section")].find((el) => (el.innerText || "").includes("מיטל גוטמן שקד נומרולוגית") && el.querySelector("h1"));

  const items = [...foot.querySelectorAll("a, p, button, img")].map((el) => {
    const m = measure(el);
    if (!m || m.w < 4 || m.h < 4) return null;
    return {
      ...m,
      href: el.getAttribute("href"),
      aria: el.getAttribute("aria-label"),
      alt: el.getAttribute("alt"),
      relX: round(el.getBoundingClientRect().x - fr.x),
      relY: round(el.getBoundingClientRect().top - fr.top),
    };
  }).filter(Boolean);

  // dedupe
  const leaves = [];
  for (const m of items) {
    const dup = leaves.some(
      (o) =>
        o.text === m.text &&
        o.aria === m.aria &&
        o.alt === m.alt &&
        Math.abs(o.x - m.x) < 2 &&
        Math.abs(o.y - m.y) < 2,
    );
    if (!dup) leaves.push(m);
  }

  return {
    vw: window.innerWidth,
    vh: window.innerHeight,
    scrollH: document.documentElement.scrollHeight,
    sections: sections.filter((s) => s.absY > 200),
    title: measure(title),
    titleBg: title
      ? (() => {
          const bg = title.querySelector("[id^=bgLayers], .LNYVZi");
          return bg ? getComputedStyle(bg).backgroundColor : null;
        })()
      : null,
    h1: measure(document.querySelector("h1")),
    foot: {
      ...measure(foot),
      bgLayer: (() => {
        const bg = foot.querySelector("[id^=bgLayers], .LNYVZi");
        return bg ? getComputedStyle(bg).backgroundColor : null;
      })(),
    },
    leaves,
  };
});

fs.writeFileSync(path.join(out, "source-footer-mobile-390.json"), JSON.stringify(data, null, 2));
console.log(JSON.stringify(data, null, 2));
await browser.close();
