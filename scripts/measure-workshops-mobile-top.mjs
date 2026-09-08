import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "measurement");
fs.mkdirSync(out, { recursive: true });

const VIEWPORT = { width: 390, height: 844 };
const SOURCE_URL = "https://www.me-saperet.com/%D7%A1%D7%93%D7%A0%D7%90%D7%95%D7%AA";
const LOCAL_URL = "http://127.0.0.1:5173/%D7%A1%D7%93%D7%A0%D7%90%D7%95%D7%AA";

const browser = await chromium.launch({ headless: true });

async function measurePage(label, url, screenshotName) {
  const page = await browser.newPage({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    locale: "he-IL",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
  });

  let loaded = false;
  let loadError = null;
  for (let i = 0; i < 4; i++) {
    try {
      const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
      console.log(label, "attempt", i, "status", res?.status(), "url", page.url());
      await page.waitForTimeout(4500);
      const h1 = await page.locator("h1").first().innerText().catch(() => "");
      console.log(label, "h1", h1);
      if (h1.includes("סדנאות") || res?.ok()) {
        loaded = true;
        break;
      }
    } catch (e) {
      loadError = e.message;
      console.log(label, "retry", i, e.message);
      await page.waitForTimeout(1500);
    }
  }

  if (!loaded) {
    await page.close();
    return { loaded: false, error: loadError || "failed to load", url };
  }

  // Settle images near top
  await page.evaluate(async () => {
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
  });
  await page.waitForTimeout(1200);

  await page.screenshot({
    path: path.join(out, screenshotName),
    fullPage: false,
  });

  const data = await page.evaluate(() => {
    const round = (n) => Math.round(n * 100) / 100;
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const c = getComputedStyle(el);
      return {
        tag: el.tagName,
        id: el.id || null,
        className: (typeof el.className === "string" ? el.className : "").slice(0, 120),
        text: (el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 160),
        x: round(r.x),
        y: round(r.y),
        w: round(r.width),
        h: round(r.height),
        absY: round(r.top + window.scrollY),
        absBottom: round(r.bottom + window.scrollY),
        zIndex: c.zIndex,
        position: c.position,
        color: c.color,
        bg: c.backgroundColor,
        fontSize: c.fontSize,
        fontWeight: c.fontWeight,
        lineHeight: c.lineHeight,
        textAlign: c.textAlign,
        display: c.display,
        objectFit: c.objectFit,
        objectPosition: c.objectPosition,
        overflow: c.overflow,
        opacity: c.opacity,
      };
    };

    const overlaps = (a, b) => {
      if (!a || !b) return false;
      return !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
    };

    const h1 =
      [...document.querySelectorAll("h1")].find((el) =>
        (el.innerText || "").includes("סדנאות"),
      ) || document.querySelector("h1");

    const clientsTitle =
      [...document.querySelectorAll("h2,h3,p,div,span")].find((el) => {
        const t = (el.innerText || "").trim().replace(/\s+/g, " ");
        return t === "בין לקוחותי" || t === "בין הלקוחות שלי";
      }) || null;

    // Hero / banner: large image near top, or section with background image under H1
    const candidates = [];
    for (const img of document.querySelectorAll("img, picture img, video")) {
      const r = img.getBoundingClientRect();
      if (r.width < 200 || r.height < 80) continue;
      if (r.top > 700) continue;
      candidates.push({
        kind: "img",
        ...box(img),
        src: (img.currentSrc || img.src || "").split("?")[0].slice(-80),
        nw: img.naturalWidth,
        nh: img.naturalHeight,
      });
    }

    // Background-image layers near top
    for (const el of document.querySelectorAll("div, section, header, main")) {
      const r = el.getBoundingClientRect();
      if (r.width < 250 || r.height < 100 || r.height > 900) continue;
      if (r.top > 500) continue;
      const c = getComputedStyle(el);
      const hasBg =
        (c.backgroundImage && c.backgroundImage !== "none") ||
        (el.querySelector &&
          [...el.querySelectorAll("*")].some((child) => {
            const cs = getComputedStyle(child);
            return cs.backgroundImage && cs.backgroundImage !== "none";
          }));
      if (!hasBg) continue;
      const bgChild = [...el.querySelectorAll("*")].find((child) => {
        const cs = getComputedStyle(child);
        return cs.backgroundImage && cs.backgroundImage !== "none";
      });
      candidates.push({
        kind: "bg",
        ...box(el),
        bgImage: (c.backgroundImage !== "none"
          ? c.backgroundImage
          : bgChild
            ? getComputedStyle(bgChild).backgroundImage
            : ""
        ).slice(0, 180),
      });
    }

    candidates.sort((a, b) => a.absY - b.absY || b.h - a.h);

    const h1Box = box(h1);
    // Prefer candidate that overlaps H1 or sits just under header
    let hero =
      candidates.find((c) => h1Box && overlaps(c, h1Box) && c.h >= 120) ||
      candidates.find((c) => c.absY < 200 && c.h >= 150 && c.w >= 300) ||
      candidates[0] ||
      null;

    // If H1's nearest section has a tall media child, prefer that
    if (h1) {
      const section = h1.closest("section") || h1.parentElement;
      if (section) {
        const media =
          section.querySelector("img") ||
          [...section.querySelectorAll("div")].find((d) => {
            const cs = getComputedStyle(d);
            return cs.backgroundImage && cs.backgroundImage !== "none";
          });
        if (media) {
          const mb = box(media);
          if (mb && mb.w >= 200 && mb.h >= 80) {
            hero = {
              kind: media.tagName === "IMG" ? "img" : "bg",
              ...mb,
              src: media.tagName === "IMG" ? (media.currentSrc || media.src || "").split("?")[0].slice(-80) : undefined,
              bgImage:
                media.tagName !== "IMG"
                  ? getComputedStyle(media).backgroundImage.slice(0, 180)
                  : undefined,
            };
          }
        }
      }
    }

    // Client logos strip: images near clients title, or horizontal strip of logos
    const logoImgs = [];
    const scanRoot = clientsTitle
      ? clientsTitle.closest("section") ||
        clientsTitle.parentElement?.parentElement ||
        document.body
      : document.body;

    const titleY = clientsTitle ? clientsTitle.getBoundingClientRect().top + window.scrollY : 0;
    for (const img of scanRoot.querySelectorAll("img")) {
      const r = img.getBoundingClientRect();
      const absY = r.top + window.scrollY;
      if (r.width < 20 || r.height < 12) continue;
      if (clientsTitle && (absY < titleY - 40 || absY > titleY + 420)) continue;
      if (!clientsTitle && (absY < 200 || absY > 900)) continue;
      logoImgs.push({
        ...box(img),
        alt: img.alt || "",
        src: (img.currentSrc || img.src || "").split("/").pop()?.slice(0, 60),
        nw: img.naturalWidth,
        nh: img.naturalHeight,
        broken: !img.complete || img.naturalWidth === 0,
      });
    }

    // Also look for SVG logos
    for (const svg of scanRoot.querySelectorAll("svg")) {
      const r = svg.getBoundingClientRect();
      const absY = r.top + window.scrollY;
      if (r.width < 24 || r.height < 16) continue;
      if (clientsTitle && (absY < titleY - 40 || absY > titleY + 420)) continue;
      logoImgs.push({
        ...box(svg),
        alt: "svg",
        src: "svg",
        broken: false,
      });
    }

    let logoStrip = null;
    if (logoImgs.length) {
      const minX = Math.min(...logoImgs.map((l) => l.x));
      const maxX = Math.max(...logoImgs.map((l) => l.x + l.w));
      const minY = Math.min(...logoImgs.map((l) => l.y));
      const maxY = Math.max(...logoImgs.map((l) => l.y + l.h));
      const minAbsY = Math.min(...logoImgs.map((l) => l.absY));
      logoStrip = {
        x: round(minX),
        y: round(minY),
        w: round(maxX - minX),
        h: round(maxY - minY),
        absY: round(minAbsY),
        logoCount: logoImgs.length,
        visibleLogos: logoImgs.filter((l) => l.y < window.innerHeight && l.y + l.h > 0 && !l.broken),
        brokenCount: logoImgs.filter((l) => l.broken).length,
        logos: logoImgs,
      };
    }

    // Header / menu for overlap diagnosis
    const header =
      document.querySelector("header") ||
      document.querySelector('[data-testid="header"]') ||
      document.querySelector("#SITE_HEADER") ||
      [...document.querySelectorAll("div,nav")].find((el) => {
        const r = el.getBoundingClientRect();
        const t = (el.innerText || "").replace(/\s+/g, " ");
        return (
          r.top <= 5 &&
          r.height > 40 &&
          r.height < 120 &&
          r.width > 300 &&
          (t.includes("אודות") || t.includes("סדנאות") || el.querySelector("nav"))
        );
      });

    const headerBox = box(header);
    const menuBtn =
      document.querySelector('button[aria-label*="menu" i], button[aria-label*="תפריט"], .hamburger, [class*="burger"], [class*="menu-toggle"]') ||
      [...document.querySelectorAll("button, a")].find((el) => {
        const r = el.getBoundingClientRect();
        return r.top < 80 && r.right > window.innerWidth - 80 && r.width < 80 && r.height < 80;
      });

    const notes = [];
    if (h1Box && hero) {
      const h1OnBanner = overlaps(h1Box, hero);
      notes.push(
        h1OnBanner
          ? "H1 overlaps/sits on hero/banner box"
          : "H1 does NOT overlap hero/banner (title separate from banner image)",
      );
      if (h1Box.absY + 8 < hero.absY) notes.push("H1 starts above hero top");
      if (hero.absY + 20 < h1Box.absY && !overlaps(h1Box, hero))
        notes.push("Hero sits above H1 without overlap");
      if (Math.abs(h1Box.absY - hero.absBottom) < 40)
        notes.push("H1 sits just below banner bottom");
    } else if (!hero) {
      notes.push("No clear hero/banner media found near top");
    }

    if (headerBox && h1Box && overlaps(headerBox, h1Box)) {
      notes.push("H1 overlaps header/menu");
    }
    if (headerBox && hero && overlaps(headerBox, hero)) {
      notes.push("Header overlaps hero/banner");
    }

    if (logoStrip) {
      if (logoStrip.brokenCount > 0) notes.push(`${logoStrip.brokenCount} broken logo image(s)`);
      if (logoStrip.h < 24) notes.push("Logo strip unusually short/collapsed");
      if (logoStrip.h > 220) notes.push("Logo strip unusually tall (may be wrapping/broken layout)");
      const rows = new Set(logoStrip.logos.map((l) => Math.round(l.absY / 12)));
      if (rows.size > 2) notes.push(`Logos span ${rows.size} vertical bands (may look broken/wrapping)`);
    } else {
      notes.push("No logo strip detected near clients title");
    }

    return {
      viewport: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio },
      scrollY: window.scrollY,
      pageTitle: document.title,
      h1: h1Box,
      heroBanner: hero,
      clientsTitle: box(clientsTitle),
      logoStripHeight: logoStrip ? logoStrip.h : null,
      logoStrip,
      header: headerBox,
      menuButton: box(menuBtn),
      h1OnBanner: !!(h1Box && hero && overlaps(h1Box, hero)),
      h1OverlapsHeader: !!(h1Box && headerBox && overlaps(h1Box, headerBox)),
      notes,
      topCandidates: candidates.slice(0, 8),
    };
  });

  await page.close();
  return { loaded: true, url, screenshot: screenshotName, ...data };
}

const source = await measurePage("source", SOURCE_URL, "source-workshops-mobile-top.png");

let local;
try {
  const probe = await fetch(LOCAL_URL, { method: "GET" });
  if (!probe.ok && probe.status !== 200) {
    local = { loaded: false, error: `HTTP ${probe.status}`, url: LOCAL_URL };
  } else {
    local = await measurePage("local", LOCAL_URL, "local-workshops-mobile-top.png");
  }
} catch (e) {
  local = { loaded: false, error: e.message, url: LOCAL_URL };
}

function describeDiff(src, loc) {
  if (!src?.loaded) return "Source failed to load; cannot compare.";
  if (!loc?.loaded) return `Local failed to load (${loc?.error || "unknown"}).`;

  const issues = [];

  if (src.h1OnBanner && !loc.h1OnBanner) {
    issues.push(
      "Source: H1 sits ON the hero/banner image. Local: H1 does not sit on a banner — missing banner under/behind the title.",
    );
  } else if (!src.h1OnBanner && loc.h1OnBanner) {
    issues.push("Local places H1 on a banner unlike source (source keeps title separate from banner).");
  } else if (src.h1OnBanner && loc.h1OnBanner) {
    issues.push("Both place H1 on/overlapping the hero banner.");
  } else {
    issues.push("Neither places H1 on a banner image (title and banner are separate).");
  }

  if (loc.h1OverlapsHeader && !src.h1OverlapsHeader) {
    issues.push("Local: H1 overlaps the fixed header/menu; source does not.");
  } else if (loc.h1OverlapsHeader && src.h1OverlapsHeader) {
    issues.push("Both: H1 overlaps header/menu area.");
  }

  if (!loc.heroBanner && src.heroBanner) {
    issues.push("Local is missing a clear hero/banner media block present on source.");
  } else if (loc.heroBanner && src.heroBanner) {
    const sh = src.heroBanner.h;
    const lh = loc.heroBanner.h;
    if (Math.abs(sh - lh) > 80) {
      issues.push(`Hero/banner height differs: source ~${sh}px vs local ~${lh}px.`);
    }
  }

  const sLogos = src.logoStrip?.logoCount ?? 0;
  const lLogos = loc.logoStrip?.logoCount ?? 0;
  if (sLogos > 0 && lLogos === 0) {
    issues.push("Local missing client logo strip that source shows under 'בין לקוחותי'.");
  } else if (src.logoStrip && loc.logoStrip) {
    if (Math.abs(src.logoStrip.h - loc.logoStrip.h) > 40) {
      issues.push(
        `Logo strip height: source ${src.logoStrip.h}px vs local ${loc.logoStrip.h}px.`,
      );
    }
    if ((loc.logoStrip.brokenCount || 0) > 0) {
      issues.push(`Local has ${loc.logoStrip.brokenCount} broken logo image(s).`);
    }
    const sRows = new Set(src.logoStrip.logos.map((l) => Math.round(l.absY / 12))).size;
    const lRows = new Set(loc.logoStrip.logos.map((l) => Math.round(l.absY / 12))).size;
    if (lRows > sRows + 1) {
      issues.push(
        `Local logos wrap into more rows (${lRows}) than source (${sRows}) — strip may look broken.`,
      );
    }
    if (lLogos < sLogos - 1) {
      issues.push(`Fewer visible logos locally (${lLogos}) than source (${sLogos}).`);
    }
  }

  for (const n of loc.notes || []) {
    if (
      n.includes("overlap") ||
      n.includes("missing") ||
      n.includes("broken") ||
      n.includes("NOT") ||
      n.includes("collapsed") ||
      n.includes("unusually")
    ) {
      if (!issues.some((i) => i.includes(n.slice(0, 24)))) {
        // keep unique-ish
      }
    }
  }

  // Header/menu visual clash from notes
  for (const n of loc.notes || []) {
    if (n.includes("Header overlaps") || n.includes("H1 overlaps header")) {
      issues.push(`Local note: ${n}`);
    }
  }

  return [...new Set(issues)].join(" ");
}

const result = {
  viewport: VIEWPORT,
  source: source.loaded
    ? {
        url: source.url,
        screenshot: source.screenshot,
        h1: source.h1,
        heroBanner: source.heroBanner,
        clientsTitle: source.clientsTitle,
        logoStripHeight: source.logoStripHeight,
        visibleLogos: (source.logoStrip?.visibleLogos || []).map((l) => ({
          alt: l.alt,
          src: l.src,
          w: l.w,
          h: l.h,
          x: l.x,
          y: l.y,
        })),
        logoCount: source.logoStrip?.logoCount ?? 0,
        h1OnBanner: source.h1OnBanner,
        h1OverlapsHeader: source.h1OverlapsHeader,
        header: source.header,
        notes: source.notes,
      }
    : source,
  local: local.loaded
    ? {
        url: local.url,
        screenshot: local.screenshot,
        h1: local.h1,
        heroBanner: local.heroBanner,
        clientsTitle: local.clientsTitle,
        logoStripHeight: local.logoStripHeight,
        visibleLogos: (local.logoStrip?.visibleLogos || []).map((l) => ({
          alt: l.alt,
          src: l.src,
          w: l.w,
          h: l.h,
          x: l.x,
          y: l.y,
        })),
        logoCount: local.logoStrip?.logoCount ?? 0,
        h1OnBanner: local.h1OnBanner,
        h1OverlapsHeader: local.h1OverlapsHeader,
        header: local.header,
        notes: local.notes,
      }
    : local,
  whatLooksWrongOnLocalVsSource: describeDiff(source, local),
};

fs.writeFileSync(
  path.join(out, "workshops-mobile-top-390.json"),
  JSON.stringify(result, null, 2),
);
console.log(JSON.stringify(result, null, 2));

await browser.close();
