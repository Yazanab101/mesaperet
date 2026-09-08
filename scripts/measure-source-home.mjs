/**
 * Live measurement of https://www.me-saperet.com/ at 1440x900
 * Source of truth: getBoundingClientRect + getComputedStyle
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve("measurement");
const VIEWPORT = { width: 1440, height: 900 };

function round(n) {
  return Math.round(n * 100) / 100;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    locale: "he-IL",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  console.log("Navigating to live site...");
  await page.goto("https://www.me-saperet.com/", {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
  // Wix keeps network busy; wait for homepage images instead of networkidle
  try {
    await page.waitForSelector("img", { timeout: 60000 });
  } catch {}
  await page.waitForTimeout(8000);

  // Dismiss cookie banners / overlays if present
  await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll("button, [role='button'], a"));
    for (const el of candidates) {
      const t = (el.textContent || "").trim();
      if (/סגור|accept|agree|אישור|הבנתי|x/i.test(t) && el.getBoundingClientRect().width < 200) {
        try {
          el.click();
        } catch {}
      }
    }
  });
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: path.join(OUT_DIR, "source-home-1440x900.png"),
    fullPage: false,
  });

  const report = await page.evaluate(() => {
    const round = (n) => Math.round(n * 100) / 100;

    const measure = (el, label, extra = {}) => {
      if (!el) return { label, missing: true };
      const rect = el.getBoundingClientRect();
      const css = getComputedStyle(el);
      const parent = el.parentElement;
      const parentRect = parent ? parent.getBoundingClientRect() : null;
      const parentCss = parent ? getComputedStyle(parent) : null;

      let imgMeta = null;
      if (el.tagName === "IMG") {
        imgMeta = {
          src: el.currentSrc || el.src,
          alt: el.alt,
          naturalWidth: el.naturalWidth,
          naturalHeight: el.naturalHeight,
        };
      }

      const bg = css.backgroundImage;
      const bgUrl =
        bg && bg !== "none" ? (bg.match(/url\(["']?(.*?)["']?\)/) || [])[1] || bg : null;

      return {
        label,
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        className: (el.className && String(el.className).slice(0, 180)) || null,
        text: (el.innerText || "").trim().slice(0, 80) || null,
        rect: {
          x: round(rect.x),
          y: round(rect.y),
          width: round(rect.width),
          height: round(rect.height),
          top: round(rect.top),
          left: round(rect.left),
          right: round(rect.right),
          bottom: round(rect.bottom),
        },
        css: {
          position: css.position,
          display: css.display,
          width: css.width,
          height: css.height,
          top: css.top,
          left: css.left,
          right: css.right,
          bottom: css.bottom,
          margin: css.margin,
          padding: css.padding,
          transform: css.transform,
          transformOrigin: css.transformOrigin,
          zIndex: css.zIndex,
          opacity: css.opacity,
          objectFit: css.objectFit,
          objectPosition: css.objectPosition,
          backgroundSize: css.backgroundSize,
          backgroundPosition: css.backgroundPosition,
          backgroundImage: bgUrl,
          fontFamily: css.fontFamily,
          fontSize: css.fontSize,
          fontWeight: css.fontWeight,
          lineHeight: css.lineHeight,
          letterSpacing: css.letterSpacing,
          animationName: css.animationName,
          animationDuration: css.animationDuration,
          animationDelay: css.animationDelay,
          animationTimingFunction: css.animationTimingFunction,
          transition: css.transition,
          overflow: css.overflow,
          maxWidth: css.maxWidth,
          minWidth: css.minWidth,
          maxHeight: css.maxHeight,
          minHeight: css.minHeight,
        },
        parent: parent
          ? {
              tag: parent.tagName.toLowerCase(),
              id: parent.id || null,
              className: (parent.className && String(parent.className).slice(0, 180)) || null,
              rect: parentRect
                ? {
                    x: round(parentRect.x),
                    y: round(parentRect.y),
                    width: round(parentRect.width),
                    height: round(parentRect.height),
                  }
                : null,
              position: parentCss?.position,
              transform: parentCss?.transform,
              width: parentCss?.width,
              height: parentCss?.height,
            }
          : null,
        ancestry: (() => {
          const chain = [];
          let cur = el;
          for (let i = 0; i < 8 && cur; i++) {
            const r = cur.getBoundingClientRect();
            const c = getComputedStyle(cur);
            chain.push({
              depth: i,
              tag: cur.tagName.toLowerCase(),
              id: cur.id || null,
              className: (cur.className && String(cur.className).slice(0, 120)) || null,
              position: c.position,
              transform: c.transform,
              width: c.width,
              height: c.height,
              rect: { x: round(r.x), y: round(r.y), w: round(r.width), h: round(r.height) },
            });
            cur = cur.parentElement;
          }
          return chain;
        })(),
        imgMeta,
        ...extra,
      };
    };

    // Collect all meaningful images on homepage viewport
    const imgs = Array.from(document.querySelectorAll("img")).filter((img) => {
      const r = img.getBoundingClientRect();
      return r.width > 5 && r.height > 5 && r.bottom > 0 && r.top < window.innerHeight + 50;
    });

    const byAlt = (re) => imgs.find((i) => re.test(i.alt || "") || re.test(i.src || ""));
    const allByAlt = (re) => imgs.filter((i) => re.test(i.alt || "") || re.test(i.src || ""));

    const elements = [];

    // Page / containers
    const siteRoot =
      document.getElementById("SITE_CONTAINER") ||
      document.getElementById("SITE_PAGES") ||
      document.querySelector("[data-main-page]") ||
      document.body;
    const masterPage = document.getElementById("masterPage") || document.getElementById("SITE_PAGES");
    const pageSection =
      document.querySelector('[data-testid="page-bg"]') ||
      document.querySelector("main") ||
      document.querySelector("#SITE_PAGES");

    elements.push(
      measure(document.documentElement, "html"),
      measure(document.body, "body"),
      measure(siteRoot, "siteRoot"),
      measure(masterPage, "masterPage/SITE_PAGES"),
      measure(pageSection, "pageSection/main"),
    );

    // Header / nav
    const header =
      document.querySelector("header") ||
      document.querySelector('[data-testid="mesh-container-content"]') ||
      document.querySelector("#SITE_HEADER");
    elements.push(measure(header, "header"));

    const navLinks = Array.from(document.querySelectorAll("a, [role='link']")).filter((a) => {
      const t = (a.textContent || "").trim();
      return ["בית", "אודות", "סדנאות", "ייעוץ וטיפול", "שובר מתנה", "המלצות", "צור קשר"].includes(t);
    });
    // Prefer unique top nav
    const seen = new Set();
    for (const a of navLinks) {
      const t = (a.textContent || "").trim();
      const r = a.getBoundingClientRect();
      if (seen.has(t) || r.width < 2 || r.y > 120) continue;
      seen.add(t);
      elements.push(measure(a, `nav:${t}`));
    }

    // Images by alt heuristics from known homepage
    const mappings = [
      ["logo", /לוגו|logo/i],
      ["salon/background", /סלון|salon/i],
      ["portrait", /תמונה|portrait|אודות/i],
      ["chair", /כורס/i],
      ["plant", /עציץ|plant/i],
      ["workshops", /סדנאות/i],
      ["gift", /שובר|מתנה|gift/i],
      ["books", /המלצות|ספר/i],
      ["phone/contact", /צרו קשר|contact|טלפון/i],
    ];

    for (const [name, re] of mappings) {
      const matches = allByAlt(re);
      matches.forEach((el, idx) => {
        elements.push(measure(el, matches.length > 1 ? `${name}#${idx + 1}` : name));
      });
    }

    // Any remaining visible imgs
    imgs.forEach((img, i) => {
      const already = elements.some((e) => e.imgMeta && e.imgMeta.src === (img.currentSrc || img.src));
      if (!already) elements.push(measure(img, `img-unclassified#${i + 1}`));
    });

    // Social / floating buttons
    const social = Array.from(document.querySelectorAll("a, button")).filter((el) => {
      const label = `${el.getAttribute("aria-label") || ""} ${el.getAttribute("title") || ""} ${el.href || ""}`;
      return /facebook|whatsapp|wa\.me|נגישות|accessibility/i.test(label);
    });
    social.forEach((el, i) => {
      const label = el.getAttribute("aria-label") || el.href || `social#${i + 1}`;
      elements.push(measure(el, `social:${String(label).slice(0, 60)}`));
    });

    // Detect scale transforms in ancestry of portrait or salon
    const portrait = byAlt(/תמונה|portrait/i) || imgs[0];
    let scaleInfo = null;
    if (portrait) {
      let cur = portrait;
      const scales = [];
      while (cur) {
        const t = getComputedStyle(cur).transform;
        if (t && t !== "none") {
          const m = t.match(/matrix\(([^)]+)\)/);
          if (m) {
            const parts = m[1].split(",").map(Number);
            scales.push({
              el: cur.tagName + (cur.id ? `#${cur.id}` : ""),
              className: String(cur.className || "").slice(0, 100),
              transform: t,
              a: parts[0],
              d: parts[3],
            });
          }
        }
        cur = cur.parentElement;
      }
      scaleInfo = scales;
    }

    // Sections / responsive containers
    const sections = Array.from(
      document.querySelectorAll('[data-testid="section"], section, [id*="comp-"]'),
    ).slice(0, 30);
    const sectionMeasures = sections
      .map((s, i) => measure(s, `section#${i}:${s.id || s.getAttribute("data-testid") || s.tagName}`))
      .filter((s) => !s.missing && s.rect && s.rect.width > 100 && s.rect.height > 50);

    return {
      viewport: { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio },
      page: {
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        bodyWidth: document.body.getBoundingClientRect().width,
        bodyHeight: document.body.getBoundingClientRect().height,
      },
      scaleInfo,
      elements,
      sections: sectionMeasures.slice(0, 20),
      imageCount: imgs.length,
    };
  });

  // Write full JSON
  const jsonPath = path.join(OUT_DIR, "source-home-1440x900.json");
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  // Build markdown table
  const rows = report.elements
    .filter((e) => !e.missing && e.rect)
    .map((e) => {
      const p = e.parent
        ? `${e.parent.tag}${e.parent.id ? "#" + e.parent.id : ""}`
        : "";
      return `| ${e.label.replace(/\|/g, "/")} | ${e.rect.x} | ${e.rect.y} | ${e.rect.width} | ${e.rect.height} | ${e.css.position} | ${p} | ${e.css.transform} | ${e.css.zIndex} |`;
    });

  const md = `# Live Homepage Measurement — 1440×900

Source: https://www.me-saperet.com/  
Captured: ${new Date().toISOString()}  
Tool: Playwright Chromium (Browser MCP unavailable; same getBoundingClientRect + getComputedStyle)

## Viewport / Page

| Metric | Value |
| --- | --- |
| viewport | ${report.viewport.width}×${report.viewport.height} |
| dpr | ${report.viewport.dpr} |
| scrollWidth | ${report.page.scrollWidth} |
| scrollHeight | ${report.page.scrollHeight} |
| body width | ${report.page.bodyWidth} |
| body height | ${report.page.bodyHeight} |

## Scale / Transform Ancestry (from portrait)

\`\`\`json
${JSON.stringify(report.scaleInfo, null, 2)}
\`\`\`

## Element Measurement Table

| Element | x | y | width | height | position | parent | transform | z-index |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${rows.join("\n")}

## Notes

Full computed styles + ancestry (8 levels) for every element:
\`${jsonPath}\`

Screenshot:
\`measurement/source-home-1440x900.png\`
`;

  fs.writeFileSync(path.join(OUT_DIR, "SOURCE_HOME_MEASUREMENTS_1440x900.md"), md);

  console.log("Wrote:", jsonPath);
  console.log("Wrote: measurement/SOURCE_HOME_MEASUREMENTS_1440x900.md");
  console.log("Elements measured:", report.elements.length);
  console.log("Viewport:", report.viewport);
  console.log("Scale info:", JSON.stringify(report.scaleInfo, null, 2));

  // Print compact table to stdout
  console.log("\nTABLE:");
  for (const e of report.elements.filter((x) => !x.missing && x.rect)) {
    console.log(
      `${e.label.padEnd(28)} x=${String(e.rect.x).padStart(7)} y=${String(e.rect.y).padStart(7)} w=${String(e.rect.width).padStart(7)} h=${String(e.rect.height).padStart(7)} pos=${e.css.position} transform=${e.css.transform}`,
    );
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
