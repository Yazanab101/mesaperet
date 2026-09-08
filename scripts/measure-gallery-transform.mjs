import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

for (let i = 0; i < 4; i++) {
  await page.goto("https://www.me-saperet.com/%D7%A1%D7%93%D7%A0%D7%90%D7%95%D7%AA", { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(5000);
  const h1 = await page.locator("h1").first().innerText().catch(() => "");
  if (h1.includes("סדנאות")) break;
}

await page.evaluate(async () => {
  window.scrollTo(0, 1400);
  await new Promise((r) => setTimeout(r, 800));
});

const info = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll("img")].filter((img) => {
    const r = img.getBoundingClientRect();
    return r.y + scrollY > 1350 && r.y + scrollY < 1500 && r.width > 200;
  });
  return imgs.map((img) => {
    let el = img;
    const chain = [];
    for (let i = 0; i < 8 && el; i++) {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      chain.push({
        tag: el.tagName,
        id: el.id?.slice(0, 40),
        transform: cs.transform,
        w: Math.round(r.width),
        h: Math.round(r.height),
        x: Math.round(r.x),
        overflow: cs.overflow,
      });
      el = el.parentElement;
    }
    return { alt: img.alt?.slice(0, 40), chain };
  });
});

console.log(JSON.stringify(info, null, 2));
await browser.close();
