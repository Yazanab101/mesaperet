import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "measurement");

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844, mobile: true },
];

const browser = await chromium.launch({ headless: true });

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.mobile ? 2 : 1,
    isMobile: !!vp.mobile,
    hasTouch: !!vp.mobile,
    locale: "he-IL",
    ...(vp.mobile
      ? {
          userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        }
      : {}),
  });
  const page = await context.newPage();
  await page.goto("https://www.me-saperet.com/אודות", {
    waitUntil: "load",
    timeout: 90000,
  });
  await page.waitForTimeout(4500);
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(out, `source-about-${vp.name}-${vp.width}.png`),
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
        cls: String(el.className || "").slice(0, 100),
        text: (el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 160),
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
        display: c.display,
        position: c.position,
        margin: c.margin,
        padding: c.padding,
        maxWidth: c.maxWidth,
        objectFit: c.objectFit,
        objectPosition: c.objectPosition,
        transform: c.transform,
      };
    };

    const sections = [...document.querySelectorAll("section, [data-testid=mesh-container-content]")]
      .map(measure)
      .filter((s) => s && s.h > 40 && s.w > 100);

    const headings = [...document.querySelectorAll("h1,h2,h3")].map(measure);
    const paras = [...document.querySelectorAll("p")]
      .map(measure)
      .filter((p) => p && p.text && p.h > 10)
      .slice(0, 40);

    const imgs = [...document.querySelectorAll("img")]
      .filter((img) => {
        const r = img.getBoundingClientRect();
        return r.width > 40 && r.height > 40;
      })
      .map((img) => ({
        ...measure(img),
        src: (img.currentSrc || img.src).split("?")[0],
        alt: img.alt,
        nw: img.naturalWidth,
        nh: img.naturalHeight,
      }));

    const links = [...document.querySelectorAll("a")]
      .filter((a) => {
        const r = a.getBoundingClientRect();
        return r.width > 20 && r.height > 20 && (a.innerText || "").trim().length > 0;
      })
      .map((a) => ({ ...measure(a), href: a.href }))
      .filter((a) => a.absY > 80)
      .slice(0, 30);

    const rich = [...document.querySelectorAll("[data-testid=richTextElement], .wixui-rich-text, [class*=rich-text]")]
      .map(measure)
      .filter((m) => m && m.text)
      .slice(0, 25);

    return {
      vw: window.innerWidth,
      scrollH: document.documentElement.scrollHeight,
      title: document.title,
      sections,
      headings,
      paras,
      imgs,
      links,
      rich,
      bodyBg: getComputedStyle(document.body).backgroundColor,
    };
  });

  fs.writeFileSync(
    path.join(out, `source-about-${vp.name}-${vp.width}.json`),
    JSON.stringify(data, null, 2),
  );
  console.log("\n====", vp.name, vp.width, "====");
  console.log(
    JSON.stringify(
      {
        scrollH: data.scrollH,
        headings: data.headings,
        imgs: data.imgs,
        sections: data.sections?.slice(0, 15),
        paras: data.paras?.slice(0, 15),
        rich: data.rich?.slice(0, 15),
      },
      null,
      2,
    ),
  );
  await context.close();
}

await browser.close();
