export type A11yLanguage = "he" | "ar" | "en" | "ru";

export type TextAlignOption = "original" | "left" | "center" | "right";

export const FONT_SCALE_STEPS = [
  80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200,
] as const;

export const LINE_HEIGHT_STEPS = [
  100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200,
] as const;

export const CONTENT_SCALE_STEPS = [
  80, 90, 100, 110, 120, 125, 130, 140, 150,
] as const;

export const LETTER_SPACING_STEPS = [
  100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200,
] as const;

export type FontScale = (typeof FONT_SCALE_STEPS)[number];
export type LineHeightScale = (typeof LINE_HEIGHT_STEPS)[number];
export type ContentScale = (typeof CONTENT_SCALE_STEPS)[number];
export type LetterSpacingScale = (typeof LETTER_SPACING_STEPS)[number];

export interface AccessibilityPreferences {
  enabled: boolean;
  language: A11yLanguage;
  highContrast: boolean;
  readingMask: boolean;
  fontScale: FontScale;
  lineHeight: LineHeightScale;
  contentScale: ContentScale;
  letterSpacing: LetterSpacingScale;
  readableFont: boolean;
  textAlign: TextAlignOption;
  textMagnifier: boolean;
  hideImages: boolean;
  highlightHeadings: boolean;
  highlightLinks: boolean;
  grayscale: boolean;
  stopAnimations: boolean;
  largeCursor: boolean;
}

export const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  enabled: true,
  language: "he",
  highContrast: false,
  readingMask: false,
  fontScale: 100,
  lineHeight: 100,
  contentScale: 100,
  letterSpacing: 100,
  readableFont: false,
  textAlign: "original",
  textMagnifier: false,
  hideImages: false,
  highlightHeadings: false,
  highlightLinks: false,
  grayscale: false,
  stopAnimations: false,
  largeCursor: false,
};

export const STORAGE_KEY = "site_accessibility_preferences_v1";
export const SESSION_HIDDEN_KEY = "site_accessibility_widget_hidden";

/** Route to the site Accessibility Statement page */
export const ACCESSIBILITY_STATEMENT_ROUTE = "/הצהרת-נגישות";

export const LANGUAGES: ReadonlyArray<{
  code: A11yLanguage;
  short: string;
  native: string;
  dir: "rtl" | "ltr";
}> = [
  { code: "he", short: "HE", native: "עברית", dir: "rtl" },
  { code: "ar", short: "AR", native: "العربية", dir: "rtl" },
  { code: "en", short: "EN", native: "English", dir: "ltr" },
  { code: "ru", short: "RU", native: "Русский", dir: "ltr" },
];

export function isRtlLanguage(lang: A11yLanguage): boolean {
  return lang === "he" || lang === "ar";
}
