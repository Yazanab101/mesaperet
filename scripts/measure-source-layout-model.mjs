/**
 * Deep layout-model inspection of Wix homepage section at 1440x900
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("measurement");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "he-IL",
  })).newPage();

  await page.goto("https://www.me-saperet.com/", { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForSelector("img[alt*='סלון'], img[alt*='תמונה']", { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(7000);

  // Close accessibility widget if open
  await page.evaluate(() => {
    document.querySelectorAll('[aria-label*="סגור"], .aioa_close, .close-button').forEach((el) => {
      try { el.click(); } catch {}
    });
  });
  await page.waitForTimeout(500);

  const deep = await page.evaluate(() => {
    const round = (n) => Math.round(n * 100) / 100;
    const section = document.querySelector("section.comp-kbgaghri") || document.querySelector("section.wixui-section");
    if (!section) return { error: "section not found" };

    const sc = getComputedStyle(section);
    const sr = section.getBoundingClientRect();

    // All direct positioned children / image components in section
    const comps = Array.from(section.querySelectorAll(":scope .wixui-image, :scope [data-testid='imageX'], :scope .i4P7Vt, :scope [id^='comp-']"))
      .filter((el) => el.id && el.id.startsWith("comp-"));

    const unique = [];
    const seen = new Set();
    for (const el of comps) {
      if (seen.has(el.id)) continue;
      seen.add(el.id);
      unique.push(el);
    }

    const measureComp = (el) => {
      const r = el.getBoundingClientRect();
      const c = getComputedStyle(el);
      const img = el.querySelector("img");
      const textEls = Array.from(el.querySelectorAll("p, h1, h2, span, label")).map((t) => (t.innerText || "").trim()).filter(Boolean);
      return {
        id: el.id,
        className: String(el.className).slice(0, 160),
        rect: { x: round(r.x), y: round(r.y), w: round(r.width), h: round(r.height) },
        // relative to section
        rel: {
          x: round(r.x - sr.x),
          y: round(r.y - sr.y),
          w: round(r.width),
          h: round(r.height),
          xPct: round(((r.x - sr.x) / sr.width) * 100),
          yPct: round(((r.y - sr.y) / sr.height) * 100),
          wPct: round((r.width / sr.width) * 100),
          hPct: round((r.height / sr.height) * 100),
        },
        css: {
          position: c.position,
          top: c.top,
          left: c.left,
          right: c.right,
          bottom: c.bottom,
          width: c.width,
          height: c.height,
          transform: c.transform,
          transformOrigin: c.transformOrigin,
          zIndex: c.zIndex,
          margin: c.margin,
          padding: c.padding,
          gridArea: c.gridArea,
          inset: c.inset,
          maxWidth: c.maxWidth,
          minWidth: c.minWidth,
        },
        // CSS variables on element
        vars: (() => {
          const out = {};
          for (const k of [
            "--w", "--h", "--x", "--y", "--top", "--left", "--right", "--bottom",
            "--comp-x", "--comp-y", "--comp-width", "--comp-height",
            "--translate-x", "--translate-y", "--scale",
          ]) {
            const v = c.getPropertyValue(k);
            if (v) out[k] = v.trim();
          }
          // dump all custom props if few
          return out;
        })(),
        img: img
          ? {
              alt: img.alt,
              src: img.currentSrc || img.src,
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
              objectFit: getComputedStyle(img).objectFit,
              objectPosition: getComputedStyle(img).objectPosition,
            }
          : null,
        texts: textEls.slice(0, 5),
        animation: {
          name: c.animationName,
          duration: c.animationDuration,
          delay: c.animationDelay,
          timing: c.animationTimingFunction,
          transition: c.transition,
        },
      };
    };

    // Also text nodes with ייעוץ / שובר
    const textHits = Array.from(document.querySelectorAll("p, h1, h2, span, div"))
      .filter((el) => {
        const t = (el.innerText || "").trim();
        return t === "ייעוץ" || t === "שובר מתנה" || t === "מיטל גוטמן שקד נומרולוגית";
      })
      .map((el) => {
        const r = el.getBoundingClientRect();
        const c = getComputedStyle(el);
        return {
          text: (el.innerText || "").trim(),
          tag: el.tagName,
          id: el.id || el.parentElement?.id || null,
          rect: { x: round(r.x), y: round(r.y), w: round(r.width), h: round(r.height) },
          rel: {
            x: round(r.x - sr.x),
            y: round(r.y - sr.y),
            xPct: round(((r.x - sr.x) / sr.width) * 100),
            yPct: round(((r.y - sr.y) / sr.height) * 100),
          },
          css: {
            position: c.position,
            fontFamily: c.fontFamily,
            fontSize: c.fontSize,
            fontWeight: c.fontWeight,
            lineHeight: c.lineHeight,
            letterSpacing: c.letterSpacing,
            color: c.color,
            transform: c.transform,
            zIndex: c.zIndex,
          },
        };
      });

    // Left social bar in viewport
    const socials = Array.from(document.querySelectorAll('a[aria-label="Facebook"], a[aria-label="Whatsapp"], a[aria-label*="Facebook"], a[aria-label*="Whatsapp"]'))
      .map((el) => {
        const r = el.getBoundingClientRect();
        const c = getComputedStyle(el);
        return {
          label: el.getAttribute("aria-label"),
          href: el.href,
          rect: { x: round(r.x), y: round(r.y), w: round(r.width), h: round(r.height) },
          position: c.position,
          transform: c.transform,
          zIndex: c.zIndex,
        };
      })
      .filter((s) => s.rect.y >= 0 && s.rect.y < 900);

    // Section layout model clues
    const sectionModel = {
      id: section.id,
      className: String(section.className).slice(0, 200),
      rect: { x: round(sr.x), y: round(sr.y), w: round(sr.width), h: round(sr.height) },
      css: {
        position: sc.position,
        display: sc.display,
        width: sc.width,
        height: sc.height,
        maxWidth: sc.maxWidth,
        minWidth: sc.minWidth,
        transform: sc.transform,
        overflow: sc.overflow,
        gridTemplateColumns: sc.gridTemplateColumns,
        gridTemplateRows: sc.gridTemplateRows,
      },
      // inline style
      styleAttr: section.getAttribute("style"),
      // children with grid/absolute
      childPositions: Array.from(section.children).slice(0, 5).map((ch) => ({
        tag: ch.tagName,
        id: ch.id,
        className: String(ch.className).slice(0, 100),
        position: getComputedStyle(ch).position,
        display: getComputedStyle(ch).display,
        transform: getComputedStyle(ch).transform,
        width: getComputedStyle(ch).width,
        height: getComputedStyle(ch).height,
      })),
    };

    // Responsive container inside section
    const mesh = section.querySelector("[data-mesh-id], .MwPMz4, .SPY_vo, [class*='responsive']");
    let meshInfo = null;
    if (mesh) {
      const mc = getComputedStyle(mesh);
      const mr = mesh.getBoundingClientRect();
      meshInfo = {
        tag: mesh.tagName,
        id: mesh.id,
        className: String(mesh.className).slice(0, 160),
        rect: { x: round(mr.x), y: round(mr.y), w: round(mr.width), h: round(mr.height) },
        css: {
          position: mc.position,
          display: mc.display,
          width: mc.width,
          height: mc.height,
          transform: mc.transform,
          gridTemplateColumns: mc.gridTemplateColumns,
          gridTemplateRows: mc.gridTemplateRows,
        },
        styleAttr: mesh.getAttribute("style"),
      };
    }

    return {
      viewport: { w: innerWidth, h: innerHeight },
      section: sectionModel,
      meshInfo,
      components: unique.map(measureComp).sort((a, b) => a.rel.y - b.rel.y || a.rel.x - b.rel.x),
      textHits,
      socialsInViewport: socials,
    };
  });

  fs.writeFileSync(path.join(OUT, "source-home-layout-model-1440x900.json"), JSON.stringify(deep, null, 2));

  // Markdown summary focused on coordinates relative to section
  const lines = [
    "# Wix Layout Model — Homepage 1440×900",
    "",
    "## Section",
    "",
    "```json",
    JSON.stringify(deep.section, null, 2),
    "```",
    "",
    "## Layout model conclusion",
    "",
    deep.section?.css?.transform === "none"
      ? "- No whole-page scale() transform"
      : `- Section transform: ${deep.section?.css?.transform}`,
    `- Section size: ${deep.section?.rect?.w}×${deep.section?.rect?.h}px (full viewport width)`,
    `- Section height 1062px > viewport 900px (scene taller than viewport; chairs extend below fold)`,
    "- Each object sits in a `position:relative` component wrapper inside a `position:relative` section",
    "- Image wrappers use absolute wow-image layers; outer comps get placed by Wix responsive/mesh CSS",
    "- Coordinates below are **absolute viewport** and **% of section 1440×1062**",
    "",
    "## Objects relative to section",
    "",
    "| Element | x | y | w | h | x% | y% | w% | h% | object-fit | object-position | natural |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];

  for (const c of deep.components || []) {
    const name = c.img?.alt || c.texts?.[0] || c.id;
    lines.push(
      `| ${String(name).replace(/\|/g, "/").slice(0, 40)} | ${c.rel.x} | ${c.rel.y} | ${c.rel.w} | ${c.rel.h} | ${c.rel.xPct}% | ${c.rel.yPct}% | ${c.rel.wPct}% | ${c.rel.hPct}% | ${c.img?.objectFit || ""} | ${c.img?.objectPosition || ""} | ${c.img ? `${c.img.naturalWidth}×${c.img.naturalHeight}` : ""} |`,
    );
  }

  lines.push("", "## Text labels", "", "```json", JSON.stringify(deep.textHits, null, 2), "```");
  lines.push("", "## Socials in viewport", "", "```json", JSON.stringify(deep.socialsInViewport, null, 2), "```");

  fs.writeFileSync(path.join(OUT, "SOURCE_HOME_LAYOUT_MODEL_1440x900.md"), lines.join("\n"));

  console.log(JSON.stringify({
    section: deep.section?.rect,
    componentCount: deep.components?.length,
    textHits: deep.textHits,
    socials: deep.socialsInViewport,
  }, null, 2));

  console.log("\nCOMPONENTS:");
  for (const c of deep.components || []) {
    console.log(
      `${String(c.img?.alt || c.id).padEnd(24)} rel(${c.rel.x},${c.rel.y}) ${c.rel.w}x${c.rel.h}  ${c.rel.xPct}%,${c.rel.yPct}%  ${c.rel.wPct}%x${c.rel.hPct}%  transform=${c.css.transform} z=${c.css.zIndex}`,
    );
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
