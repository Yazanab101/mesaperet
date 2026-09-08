# Interaction Audit

WhatsApp target (from source): `https://wa.me/+972527500098`  
Facebook: `https://www.facebook.com/meytal.guttmanshaked`  
Email: `mailto:kitkatmm@gmail.com`  
Credit: `https://www.segevdigital.co.il`

| Interaction | Location | Behavior | Status |
| --- | --- | --- | --- |
| Logo → home | Header + Footer | React Router `NavLink` to `/` | OK |
| Nav: בית | Header / Footer / Mobile | `/` | OK |
| Nav: אודות | Header / Footer / Mobile | `/אודות` | OK |
| Nav: סדנאות | Header / Footer / Mobile | `/סדנאות` | OK |
| Nav: ייעוץ וטיפול | Header / Footer / Mobile | `/ייעוץ` | OK |
| Nav: שובר מתנה | Header / Footer / Mobile | `/gift` | OK |
| Nav: המלצות | Header / Footer / Mobile | `/המלצות` | OK |
| Nav: צור קשר | Header / Footer / Mobile | `/צור-קשר` | OK |
| Legal: הצהרת נגישות | Footer | `/הצהרת-נגישות` | OK |
| Legal: מדיניות פרטיות | Footer | `/מדיניות-פרטיות` | OK |
| Hamburger open/close | Header ≤980px | `aria-expanded`, Escape, backdrop, body scroll lock, `pointer-events: none` when closed | OK |
| Skip to content | All pages | `#main-content` | OK |
| Home CTA ייעוץ | Home | `/ייעוץ` | OK |
| Home CTA שובר מתנה | Home | `/gift` | OK |
| Home floater סדנאות | Home | `/סדנאות` | OK |
| Home floater המלצות | Home | `/המלצות` | OK |
| Home floater צרו קשר | Home | `/צור-קשר` | OK |
| Floating WhatsApp | All pages | `wa.me/+972527500098` new tab | OK |
| Inline WhatsApp CTA | About, Workshops, Consultation, Gift, Testimonials, Contact, Legal | same URL | OK |
| Facebook icon | Footer | external | OK |
| WhatsApp icon | Footer | external | OK |
| Segev Digital credit | Footer | external | OK |
| Workshop category anchors | Workshops | `#company` `#retreats` `#home-circles` `#bachelorette` `#mothers` | OK |
| Client logo strip | Workshops | horizontal scroll | OK |
| Gallery open lightbox | Workshops / About certs / Consultation / Testimonials | click image | OK |
| Lightbox prev/next/close | Lightbox | buttons + Escape + arrows | OK |
| Gallery slider arrows | Slider galleries | scroll track | OK |
| Testimonials tabs | Testimonials | `#personal` `#workshops-recs` | OK |
| Contact form validation | Contact | required name/phone/email + email format | OK |
| Contact form submit | Contact | `submitContactForm()` service (success/error states) | OK |
| Contact email link | Contact | `mailto:kitkatmm@gmail.com` | OK |
| Contact phone/WhatsApp link | Contact | `wa.me/+972527500098` | OK |
| Browser back/forward | App-wide | React Router history | OK |
| Direct URL / refresh | Hebrew routes | SPA + `public/_redirects` for static hosts | OK |
| Reduced motion | Global CSS | disables nonessential motion | OK |

## Manual QA checklist

- [x] every navigation item
- [x] logo/home navigation
- [x] hamburger menu
- [x] mobile navigation
- [x] every CTA
- [x] every WhatsApp button
- [x] every gallery arrow
- [x] swipe/scroll galleries
- [x] lightboxes
- [x] contact form
- [x] footer links
- [x] accessibility statement
- [x] privacy policy
- [x] internal anchors
- [x] external links
- [x] browser back button (routing architecture)
- [x] browser forward button (routing architecture)
- [x] direct URL access (routes defined)
- [x] page refresh on internal route (`_redirects`)
- [x] mobile scrolling / no stale overlays (`pointer-events: none` when menu closed)
- [x] production build (`npm run build`)
