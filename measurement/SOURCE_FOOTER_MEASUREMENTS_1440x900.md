# SOURCE — Homepage title band + footer @ 1440×900

Live: https://www.me-saperet.com/  
Captured via Playwright `getBoundingClientRect` + `getComputedStyle`.

## Page structure (below hero)

| Section | absY | height | notes |
| --- | --- | --- | --- |
| Hero `#comp-kbgaghri` | 0 | 1062 | room scene |
| Title `#comp-mkvjy95i` | 1062 | **155.28** | teal bg layer `rgb(90, 184, 184)` |
| Footer `#comp-kbgakxmn_r_comp-kbgakgyt` | 1217.28 | **221.16** | teal bg `rgb(90, 184, 184)` |
| Document height | — | **1438** | |

Teal band is continuous: title + footer share `--color-18` / `rgb(90, 184, 184)`.

## H1 (title band)

| Prop | Value |
| --- | --- |
| text | מיטל גוטמן שקד נומרולוגית |
| x, y (doc) | 448.05, 1084.83 |
| size | 543.91 × 109.63 |
| font | `gulash-w26-regular` |
| font-size | **91.356px** |
| line-height | **109.627px** |
| weight | 400 |
| color | `#000` |
| align | center |
| offset in title section | top ≈ 22.83px |

## Footer elements (relative to footer top y=1217.28)

| Element | x | relY | w | h | font / notes |
| --- | --- | --- | --- | --- | --- |
| logo img | 1161.44 | 0 | 197.08 | 197.08 | object contain |
| nav item בית | 828.97 | 0 | 142 | 31.59 | Almoni 16px; active `#4c3323` |
| אודות | 828.97 | 31.59 | 142 | 31.59 | Almoni 16px black |
| סדנאות | 828.97 | 63.19 | 142 | 31.59 | |
| ייעוץ וטיפול | 828.97 | 94.78 | 142 | 31.59 | |
| שובר מתנה | 828.97 | 126.38 | 142 | 31.59 | |
| המלצות | 828.97 | 157.97 | 142 | 31.59 | |
| צור קשר | 828.97 | 189.56 | 142 | 31.59 | |
| הצהרת נגישות | 441.56 | 0 | 196.34 | 45.59 | Almoni 16px, pad 10px 0 |
| מדיניות פרטיות | 441.56 | 45.59 | 196.34 | 45.59 | |
| Search button | 518.73 | 91.19 | 42 | 42 | magnifier |
| WhatsApp | 113.89 | 53.64 | 57.09 | 57.09 | |
| Facebook | 188.98 | 53.64 | 57.09 | 57.09 | |
| credit | 214.64 | 179.97 | 290.7 | 25.59 | Almoni 16px center |

Nav/legal: `text-align: center`, `line-height: 25.6px`.
