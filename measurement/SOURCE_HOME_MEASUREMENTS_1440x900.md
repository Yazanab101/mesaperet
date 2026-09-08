# SOURCE OF TRUTH — Homepage measurements @ 1440×900

**Live URL:** https://www.me-saperet.com/  
**Viewport:** exactly `1440 × 900` (DPR 1)  
**Captured:** Playwright Chromium evaluating `getBoundingClientRect()` + `getComputedStyle()`  
**Note:** Browser MCP (`user-chrome` / `user-browser-mcp`) failed to connect (auth timeout / tools unavailable). Measurement used the same browser APIs the request specified.

Artifacts:
- `measurement/source-home-1440x900.png`
- `measurement/source-home-1440x900.json`
- `measurement/source-home-layout-model-1440x900.json`

---

## Page / container metrics

| Metric | Value |
| --- | --- |
| viewport | 1440 × 900 |
| document scrollWidth | 1440 |
| document scrollHeight | ~1438 |
| body width | 1440 |
| **hero section `#comp-kbgaghri`** | **x=0, y=0, w=1440, h=1062** |
| centered page x-offset | 0 (full bleed, no side gutters) |
| header sticky chrome | mobile vertical menu drawer exists at x=1140 (closed/off-canvas interaction); no classic top bar occupying hero |
| scene taller than viewport? | **YES** — section height **1062** > viewport **900** (chairs + logo extend below fold) |

---

## Wix layout model (verified, not assumed)

### What Wix is doing

1. Hero is a **`position: relative` section** sized **`1440px × 1062px`**.
2. Section `display: **grid**` with:
   - `grid-template-columns: 1440px`
   - `grid-template-rows: 1062px`
3. Every object wrapper uses **`grid-area: 1 / 1 / 2 / 2`** (all stacked in the **same single cell**).
4. Placement is done primarily with **pixel margins** on those wrappers, e.g.:
   - `ייעוץ` text: `margin: 321.51px 0 0 310.642px`
   - `שובר מתנה` label: `margin: 235.903px 348.101px 0 0`
5. Component boxes have explicit **px width/height**.
6. Background salon image sits in an **absolute** bg layer covering the section.
7. **No whole-canvas `scale()`** on the page ancestry (`transform: none` on section).
8. Some items use identity `matrix(1,0,0,1,0,0)` (animation leftover / motion system). Phone has slight `translateY` in matrix at times.
9. One decorative vector (`comp-mrtilwv4`) uses a **rotation matrix** (~24°):  
   `matrix(0.913545, 0.406737, -0.406737, 0.913545, 0, 0)`.

### What this means for our React rebuild

Reproduce as:

- One full-bleed scene container **`width: 100%` of viewport**, **`aspect-ratio: 1440 / 1062`** (or fixed height formula from width).
- Position each hotspot with **% of scene** derived from the table below (or absolute px scaled from 1440×1062).
- Do **not** invent a separate cropped “room stage” smaller than the viewport width.
- Background image: `object-fit: cover; object-position: 50% 50%;` filling the **1440×1062** scene.

---

## Measurement table (viewport coords @ 1440×900)

| Element | x | y | width | height | position | parent | transform | z-index |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| hero section `#comp-kbgaghri` | 0 | 0 | 1440 | 1062 | relative/grid | page sections | none | auto |
| salon background img | 0 | 0 | 1440 | 1062 | static (in abs bg layer) | `bgLayers_comp-kbgaghri` | none | auto |
| portrait (`תמונה`) | 533.78 | 146.47 | 372.44 | 350.81 | static → wrapper relative | `#comp-meepcjt5` in section | none | auto |
| plant (`עציץ`) | 232.38 | 189.78 | 204.45 | 170.75 | static → wrapper relative | `#comp-mebp2g7x` | matrix(1,0,0,1,0,0) | auto |
| text `ייעוץ` | 310.64 | 321.50 | 47.91 | 34.72 | relative | `#comp-mebrbatl` | none | auto |
| workshops frame (`סדנאות`) | 1125.28 | 251.08 | 117.84 | 111.72 | static → wrapper relative | `#comp-lzy6b7c6` | matrix(1,0,0,1,0,0) | auto |
| gift (`שובר מתנה` img) | 1015.27 | 275.34 | 99.92 | 99.84 | static → wrapper relative | `#comp-mrbsaffe` | matrix(1,0,0,1,0,0) | auto |
| text `שובר מתנה` | 967.06 | 235.89 | 124.84 | 15.19 | relative | `#comp-mrs7224f` | matrix(1,0,0,1,0,0) | auto |
| rotated vector `#comp-mrtilwv4` | 943.31 | 243.89 | 94.50 | 84.13 | relative | section | **rotate ~24° matrix** | auto |
| left chair | 30.17 | 321.91 | 488.25 | 606.77 | static → wrapper relative | `#comp-meepdva1` | none | auto |
| right chair | 906.27 | 338.66 | 488.25 | 606.77 | static → wrapper relative | `#comp-msvpjomp` | none | auto |
| phone (`צרו קשר`) | 486.11 | 483.11 | 233.88 | 155.83 | static → wrapper relative | `#comp-luod3uiz` | matrix(1,0,0,1,0,~0) | auto |
| books (`קישור להמלצות`) | 714.59 | 497.25 | 191.66 | 127.67 | static → wrapper relative | `#comp-luod25tu` | matrix(1,0,0,1,0,0) | auto |
| logo (scene bottom-left) | 0 | 893.70 | 168.30 | 168.30 | static → wrapper relative | `#comp-meepnv7a` | none | auto |
| Facebook (left rail) | 0 | 383.91 | 57.09 | 57.09 | static | link bar list | none | auto |
| WhatsApp (left rail) | 0 | 459.00 | 57.09 | 57.09 | static | link bar list | none | auto |
| accessibility FAB | ~20 | ~825 | ~55 | ~55 | fixed | a11y widget | none | high |
| H1 `מיטל גוטמן שקד נומרולוגית` | 448.05 | 1084.83 | 543.91 | 109.63 | static | below hero | none | auto |

> Table / rug / wall shelves / stars / floor are **not separate DOM nodes** — they are painted inside the salon background image (`object-fit: cover` on a 1440×1062 layer). Intrinsic media served: **940×693**.

---

## Same objects as % of section 1440×1062

| Element | x% | y% | w% | h% |
| --- | --- | --- | --- | --- |
| portrait | 37.07 | 13.79 | 25.86 | 33.03 |
| plant | 16.14 | 17.87 | 14.20 | 16.08 |
| ייעוץ text | 21.57 | 30.27 | 3.33 | 3.27 |
| workshops | 78.14 | 23.64 | 8.18 | 10.52 |
| gift | 70.50 | 25.93 | 6.94 | 9.40 |
| שובר מתנה text | 67.16 | 22.21 | 8.67 | 1.43 |
| rotated vector | 65.51 | 22.97 | 6.56 | 7.92 |
| left chair | 2.10 | 30.31 | 33.91 | 57.13 |
| right chair | 62.94 | 31.89 | 33.91 | 57.13 |
| phone | 33.76 | 45.49 | 16.24 | 14.67 |
| books | 49.62 | 46.82 | 13.31 | 12.02 |
| logo | 0.00 | 84.15 | 11.69 | 15.85 |

---

## Image assets (live served)

| Element | naturalWidth×Height | object-fit | object-position | notes |
| --- | --- | --- | --- | --- |
| salon bg | 940×693 | cover | 50% 50% | displayed 1440×1062 |
| portrait | 372×351 | cover | **50% 43%** | focus point important |
| plant | 204×171 | cover | 50% 50% | |
| workshops | 118×112 | cover | 50% 50% | |
| gift | 100×100 | cover | 50% 50% | |
| left/right chairs | 488×607 | cover | 50% 50% | cropped from source PNG |
| phone | 234×156 | cover | 50% 50% | |
| books | 192×128 | cover | 50% 50% | |
| logo | 168×168 | cover | 50% 50% | |

---

## Typography (computed)

| Text | font-family | font-size | font-weight | line-height | color |
| --- | --- | --- | --- | --- | --- |
| `ייעוץ` | `almoni-dl-aaa-400, sans-serif` | **21.70px** | 400 | 34.72px | `rgb(255,255,255)` |
| H1 title (below fold) | `gulash-w26-regular, cursive` | **91.36px** | 400 | 109.63px | `rgb(0,0,0)` |
| `שובר מתנה` label near gift | rich text wrapper | ~15px box height | 400 | — | (label above gift) |

---

## Animations (computed at rest)

| Element | animationName | duration | delay | transition |
| --- | --- | --- | --- | --- |
| most image comps | none | 0s | 0s | `ease-in-out, visibility` (or `all` on ייעוץ) |
| phone wrapper | none | 0s | 0s | has identity/near-identity matrix (possible entrance already finished) |

Entrance motion appears to complete before/during load; resting state is static. Hover/click not measured in this pass (next pass if needed).

---

## Critical deltas vs our current local model

These are measurement findings only (no code changes in this step):

1. **Scene must be full viewport width 1440 with height 1062** (ratio **1440/1062 ≈ 1.3559**), not a letterboxed smaller stage.
2. **Chairs are huge** (~488×607) and start mid-scene (~y 322 / 339), extending **below the 900 viewport**.
3. **Portrait ~372×351** at ~(534,146)** — much larger/higher than a small centered card.
4. **Phone ~234×156** and **books ~192×128** sit on the painted table area.
5. **Gift ~100×100** + workshops ~118×112** on right shelf zone; plus separate `שובר מתנה` text and a **rotated vector**.
6. **Logo is bottom-left of scene**, not a top header hero logo.
7. **H1 is below the hero section**, not overlaid on the portrait.
8. Left **Facebook/WhatsApp** rail at **x=0**, y≈384 / 459.

---

## Status

✅ Measurement complete  
⏳ Implementation corrections **not started** (per your instruction: do not implement until table is complete)

Next step when you approve: rewrite homepage CSS to a **1440×1062 full-bleed absolute/% scene** using these coordinates, then re-measure local vs source with ≤3px tolerance.
