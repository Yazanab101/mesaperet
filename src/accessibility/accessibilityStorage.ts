import {
  CONTENT_SCALE_STEPS,
  DEFAULT_PREFERENCES,
  FONT_SCALE_STEPS,
  LETTER_SPACING_STEPS,
  LINE_HEIGHT_STEPS,
  STORAGE_KEY,
  type AccessibilityPreferences,
  type A11yLanguage,
  type ContentScale,
  type FontScale,
  type LetterSpacingScale,
  type LineHeightScale,
  type TextAlignOption,
} from "./accessibilityTypes";

const LANGUAGES = new Set<A11yLanguage>(["he", "ar", "en", "ru"]);
const ALIGNS = new Set<TextAlignOption>(["original", "left", "center", "right"]);

function isStep<T extends number>(value: unknown, steps: readonly T[]): value is T {
  return typeof value === "number" && (steps as readonly number[]).includes(value);
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function validatePreferences(raw: unknown): AccessibilityPreferences {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_PREFERENCES };
  }

  const data = raw as Partial<AccessibilityPreferences>;
  const language: A11yLanguage = LANGUAGES.has(data.language as A11yLanguage)
    ? (data.language as A11yLanguage)
    : DEFAULT_PREFERENCES.language;

  const textAlign: TextAlignOption = ALIGNS.has(data.textAlign as TextAlignOption)
    ? (data.textAlign as TextAlignOption)
    : DEFAULT_PREFERENCES.textAlign;

  const fontScale: FontScale = isStep(data.fontScale, FONT_SCALE_STEPS)
    ? data.fontScale
    : DEFAULT_PREFERENCES.fontScale;

  const lineHeight: LineHeightScale = isStep(data.lineHeight, LINE_HEIGHT_STEPS)
    ? data.lineHeight
    : DEFAULT_PREFERENCES.lineHeight;

  const contentScale: ContentScale = isStep(data.contentScale, CONTENT_SCALE_STEPS)
    ? data.contentScale
    : DEFAULT_PREFERENCES.contentScale;

  const letterSpacing: LetterSpacingScale = isStep(
    data.letterSpacing,
    LETTER_SPACING_STEPS,
  )
    ? data.letterSpacing
    : DEFAULT_PREFERENCES.letterSpacing;

  return {
    enabled: asBoolean(data.enabled, DEFAULT_PREFERENCES.enabled),
    language,
    highContrast: asBoolean(data.highContrast, false),
    readingMask: asBoolean(data.readingMask, false),
    fontScale,
    lineHeight,
    contentScale,
    letterSpacing,
    readableFont: asBoolean(data.readableFont, false),
    textAlign,
    textMagnifier: asBoolean(data.textMagnifier, false),
    hideImages: asBoolean(data.hideImages, false),
    highlightHeadings: asBoolean(data.highlightHeadings, false),
    highlightLinks: asBoolean(data.highlightLinks, false),
    grayscale: asBoolean(data.grayscale, false),
    stopAnimations: asBoolean(data.stopAnimations, false),
    largeCursor: asBoolean(data.largeCursor, false),
  };
}

export function loadPreferences(): AccessibilityPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PREFERENCES };
    return validatePreferences(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function savePreferences(prefs: AccessibilityPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Quota / private mode — ignore
  }
}

export function clearPreferences(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function stepIndex<T extends number>(
  steps: readonly T[],
  value: T,
): number {
  const idx = steps.indexOf(value);
  return idx < 0 ? steps.indexOf(100 as T) : idx;
}

export function stepNext<T extends number>(steps: readonly T[], value: T): T {
  const idx = stepIndex(steps, value);
  return steps[Math.min(steps.length - 1, idx + 1)]!;
}

export function stepPrev<T extends number>(steps: readonly T[], value: T): T {
  const idx = stepIndex(steps, value);
  return steps[Math.max(0, idx - 1)]!;
}

/** Map letter-spacing percent (100–200) to em */
export function letterSpacingToEm(percent: number): string {
  if (percent <= 100) return "0em";
  return `${((percent - 100) / 100) * 0.12}em`;
}
