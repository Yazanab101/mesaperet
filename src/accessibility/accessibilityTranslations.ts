import type { A11yLanguage } from "./accessibilityTypes";

export interface AccessibilityTranslations {
  statement: string;
  openWidget: string;
  closePanel: string;
  accessibilityActive: string;
  language: string;
  highContrast: string;
  readingMask: string;
  fontSize: string;
  lineHeight: string;
  contentScale: string;
  letterSpacing: string;
  readableFont: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  textMagnifier: string;
  hideImages: string;
  highlightHeadings: string;
  highlightLinks: string;
  grayscale: string;
  stopAnimations: string;
  largeCursor: string;
  hideWidget: string;
  reset: string;
  restoreWidget: string;
  fontSizeAnnounced: (n: number) => string;
  lineHeightAnnounced: (n: number) => string;
  contentScaleAnnounced: (n: number) => string;
  letterSpacingAnnounced: (n: number) => string;
  decrease: string;
  increase: string;
  panelTitle: string;
}

const he: AccessibilityTranslations = {
  statement: "הצהרת נגישות",
  openWidget: "פתח תפריט נגישות",
  closePanel: "סגור תפריט נגישות",
  accessibilityActive: "נגישות פעילה",
  language: "שפה",
  highContrast: "ניגודיות גבוהה",
  readingMask: "מסכת קריאה",
  fontSize: "גודל גופן",
  lineHeight: "גובה קו",
  contentScale: "קנה מידה של תוכן",
  letterSpacing: "ריווח אותיות",
  readableFont: "גופן קריא",
  alignLeft: "יישור שמאל",
  alignCenter: "יישור למרכז",
  alignRight: "יישור ימין",
  textMagnifier: "זכוכית מגדלת טקסט",
  hideImages: "הסתר תמונות",
  highlightHeadings: "הדגש כותרות",
  highlightLinks: "הדגש קישורים",
  grayscale: "גווני אפור",
  stopAnimations: "עצירת אנימציות",
  largeCursor: "סמן גדול",
  hideWidget: "הסתר ווידג'ט",
  reset: "אתחול",
  restoreWidget: "הצג כפתור נגישות",
  fontSizeAnnounced: (n) => `גודל גופן: ${n} אחוז`,
  lineHeightAnnounced: (n) => `גובה קו: ${n} אחוז`,
  contentScaleAnnounced: (n) => `קנה מידה של תוכן: ${n} אחוז`,
  letterSpacingAnnounced: (n) => `ריווח אותיות: ${n} אחוז`,
  decrease: "הקטן",
  increase: "הגדל",
  panelTitle: "תפריט נגישות",
};

const ar: AccessibilityTranslations = {
  statement: "بيان إمكانية الوصول",
  openWidget: "فتح قائمة إمكانية الوصول",
  closePanel: "إغلاق قائمة إمكانية الوصول",
  accessibilityActive: "إمكانية الوصول مفعّلة",
  language: "اللغة",
  highContrast: "تباين عالٍ",
  readingMask: "قناع القراءة",
  fontSize: "حجم الخط",
  lineHeight: "ارتفاع السطر",
  contentScale: "عرض / مقياس المحتوى",
  letterSpacing: "تباعد الأحرف",
  readableFont: "خط مقروء",
  alignLeft: "محاذاة لليسار",
  alignCenter: "محاذاة للوسط",
  alignRight: "محاذاة لليمين",
  textMagnifier: "عدسة تكبير النص",
  hideImages: "إخفاء الصور",
  highlightHeadings: "تمييز العناوين",
  highlightLinks: "تمييز الروابط",
  grayscale: "تدرج رمادي",
  stopAnimations: "إيقاف الحركة",
  largeCursor: "مؤشر كبير",
  hideWidget: "إخفاء أداة إمكانية الوصول",
  reset: "إعادة ضبط",
  restoreWidget: "إظهار زر إمكانية الوصول",
  fontSizeAnnounced: (n) => `حجم الخط: ${n} بالمائة`,
  lineHeightAnnounced: (n) => `ارتفاع السطر: ${n} بالمائة`,
  contentScaleAnnounced: (n) => `مقياس المحتوى: ${n} بالمائة`,
  letterSpacingAnnounced: (n) => `تباعد الأحرف: ${n} بالمائة`,
  decrease: "تصغير",
  increase: "تكبير",
  panelTitle: "قائمة إمكانية الوصول",
};

const en: AccessibilityTranslations = {
  statement: "Accessibility Statement",
  openWidget: "Open accessibility menu",
  closePanel: "Close accessibility menu",
  accessibilityActive: "Accessibility active",
  language: "Language",
  highContrast: "High Contrast",
  readingMask: "Reading Mask",
  fontSize: "Font Size",
  lineHeight: "Line Height",
  contentScale: "Content Scale",
  letterSpacing: "Letter Spacing",
  readableFont: "Readable Font",
  alignLeft: "Align Left",
  alignCenter: "Align Center",
  alignRight: "Align Right",
  textMagnifier: "Text Magnifier",
  hideImages: "Hide Images",
  highlightHeadings: "Highlight Headings",
  highlightLinks: "Highlight Links",
  grayscale: "Grayscale",
  stopAnimations: "Stop Animations",
  largeCursor: "Large Cursor",
  hideWidget: "Hide Widget",
  reset: "Reset",
  restoreWidget: "Show accessibility button",
  fontSizeAnnounced: (n) => `Font size: ${n} percent`,
  lineHeightAnnounced: (n) => `Line height: ${n} percent`,
  contentScaleAnnounced: (n) => `Content scale: ${n} percent`,
  letterSpacingAnnounced: (n) => `Letter spacing: ${n} percent`,
  decrease: "Decrease",
  increase: "Increase",
  panelTitle: "Accessibility menu",
};

const ru: AccessibilityTranslations = {
  statement: "Заявление о доступности",
  openWidget: "Открыть меню доступности",
  closePanel: "Закрыть меню доступности",
  accessibilityActive: "Доступность включена",
  language: "Язык",
  highContrast: "Высокая контрастность",
  readingMask: "Маска чтения",
  fontSize: "Размер шрифта",
  lineHeight: "Высота строки",
  contentScale: "Масштаб содержимого",
  letterSpacing: "Межбуквенный интервал",
  readableFont: "Читаемый шрифт",
  alignLeft: "По левому краю",
  alignCenter: "По центру",
  alignRight: "По правому краю",
  textMagnifier: "Увеличитель текста",
  hideImages: "Скрыть изображения",
  highlightHeadings: "Выделить заголовки",
  highlightLinks: "Выделить ссылки",
  grayscale: "Оттенки серого",
  stopAnimations: "Остановить анимацию",
  largeCursor: "Большой курсор",
  hideWidget: "Скрыть виджет",
  reset: "Сбросить",
  restoreWidget: "Показать кнопку доступности",
  fontSizeAnnounced: (n) => `Размер шрифта: ${n} процентов`,
  lineHeightAnnounced: (n) => `Высота строки: ${n} процентов`,
  contentScaleAnnounced: (n) => `Масштаб содержимого: ${n} процентов`,
  letterSpacingAnnounced: (n) => `Межбуквенный интервал: ${n} процентов`,
  decrease: "Уменьшить",
  increase: "Увеличить",
  panelTitle: "Меню доступности",
};

export const TRANSLATIONS: Record<A11yLanguage, AccessibilityTranslations> = {
  he,
  ar,
  en,
  ru,
};

export function getTranslations(lang: A11yLanguage): AccessibilityTranslations {
  return TRANSLATIONS[lang] ?? TRANSLATIONS.he;
}
