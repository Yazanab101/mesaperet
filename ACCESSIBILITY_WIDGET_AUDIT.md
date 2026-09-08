# Accessibility Widget Audit

This widget is an **additional user-control layer**. It does **not** replace proper semantic HTML, keyboard support, labels, alt text, heading hierarchy, or contrast work on the site itself. Installing the widget alone does **not** guarantee legal accessibility compliance.

## Feature matrix

| Feature | HE | AR | EN | RU | Functional | Persisted | Keyboard | Tested |
|---------|----|----|----|----|------------|-----------|----------|--------|
| Floating launcher | PASS | PASS | PASS | PASS | PASS | n/a | PASS | PASS |
| Panel open/close | PASS | PASS | PASS | PASS | PASS | n/a | PASS | PASS |
| Escape closes panel | PASS | PASS | PASS | PASS | PASS | n/a | PASS | PASS |
| Accessibility statement header | הצהרת נגישות | بيان إمكانية الوصول | Accessibility Statement | Заявление о доступности | PASS | n/a | PASS | PASS |
| Language selector | עברית | العربية | English | Русский | PASS | PASS | PASS | PASS |
| RTL (HE/AR) / LTR (EN/RU) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Master enable/disable | נגישות פעילה | إمكانية الوصول مفعّلة | Accessibility active | Доступность включена | PASS | PASS | PASS | PASS |
| High contrast | ניגודיות גבוהה | تباين عالٍ | High Contrast | Высокая контрастность | PASS | PASS | PASS | PASS |
| Reading mask | מסכת קריאה | قناع القراءة | Reading Mask | Маска чтения | PASS | PASS | PASS | PASS |
| Font size | גודל גופן | حجم الخط | Font Size | Размер шрифта | PASS | PASS | PASS | PASS |
| Line height | גובה קו | ارتفاع السطر | Line Height | Высота строки | PASS | PASS | PASS | PASS |
| Content scale | קנה מידה של תוכן | عرض / مقياس المحتوى | Content Scale | Масштаб содержимого | PASS | PASS | PASS | PASS |
| Letter spacing | ריווח אותיות | تباعد الأحرف | Letter Spacing | Межбуквенный интервал | PASS | PASS | PASS | PASS |
| Readable font | גופן קריא | خط مقروء | Readable Font | Читаемый шрифт | PASS | PASS | PASS | PASS |
| Align left | יישור שמאל | محاذاة لليسار | Align Left | По левому краю | PASS | PASS | PASS | PASS |
| Align center | יישור למרכז | محاذاة للوسط | Align Center | По центру | PASS | PASS | PASS | PASS |
| Align right | יישור ימין | محاذاة لليمين | Align Right | По правому краю | PASS | PASS | PASS | PASS |
| Text magnifier | זכוכית מגדלת טקסט | عدسة تكبير النص | Text Magnifier | Увеличитель текста | PASS | PASS | PASS | PASS |
| Hide images | הסתר תמונות | إخفاء الصور | Hide Images | Скрыть изображения | PASS | PASS | PASS | PASS |
| Highlight headings | הדגש כותרות | تمييز العناوين | Highlight Headings | Выделить заголовки | PASS | PASS | PASS | PASS |
| Highlight links | הדגש קישורים | تمييز الروابط | Highlight Links | Выделить ссылки | PASS | PASS | PASS | PASS |
| Grayscale | גווני אפור | تدرج رمادي | Grayscale | Оттенки серого | PASS | PASS | PASS | PASS |
| Stop animations | עצירת אנימציות | إيقاف الحركة | Stop Animations | Остановить анимацию | PASS | PASS | PASS | PASS |
| Large cursor | סמן גדול | مؤشر كبير | Large Cursor | Большой курсор | PASS | PASS | PASS | PASS |
| Hide widget + Alt+A restore | הסתר ווידג'ט | إخفاء أداة إمكانية الوصول | Hide Widget | Скрыть виджет | PASS | session | PASS | PASS |
| Reset | אתחול | إعادة ضبط | Reset | Сбросить | PASS | PASS | PASS | PASS |
| Corrupted localStorage safe | PASS | PASS | PASS | PASS | PASS | PASS | n/a | PASS |
| No click-blocking overlays | PASS | PASS | PASS | PASS | PASS | n/a | n/a | PASS |

## Architecture

- `src/accessibility/` — provider, widget, panel, language selector, CSS classes/variables, storage, translations, tests
- Mounted via `AccessibilityProvider` in `App.tsx` and `AccessibilityWidget` in `Layout` (global shell)
- Statement route: `/הצהרת-נגישות` (`ACCESSIBILITY_STATEMENT_ROUTE` / `ROUTES.accessibility`)
- Preferences key: `site_accessibility_preferences_v1`

## Verification commands

```bash
npm test
npm run build
npm run lint
```

Results (2026-09-08):

- `npm test` — 28/28 passed
- `npm run build` — success
- `npm run lint` — no errors in accessibility module (pre-existing script warnings only)
- Playwright smoke (Chromium): high contrast + font persist across About navigation / back / forward; EN=ltr, AR=rtl, RU=ltr; reading mask `pointer-events: none`; reset restores defaults
