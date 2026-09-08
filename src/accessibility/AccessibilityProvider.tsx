import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  clearPreferences,
  letterSpacingToEm,
  loadPreferences,
  savePreferences,
} from "./accessibilityStorage";
import { getTranslations } from "./accessibilityTranslations";
import {
  DEFAULT_PREFERENCES,
  SESSION_HIDDEN_KEY,
  type AccessibilityPreferences,
  type A11yLanguage,
  type TextAlignOption,
  isRtlLanguage,
} from "./accessibilityTypes";
import "./accessibility.css";

type PrefKey = keyof AccessibilityPreferences;

interface AccessibilityContextValue {
  prefs: AccessibilityPreferences;
  panelOpen: boolean;
  widgetHidden: boolean;
  t: ReturnType<typeof getTranslations>;
  isRtl: boolean;
  setPanelOpen: (open: boolean) => void;
  setLanguage: (lang: A11yLanguage) => void;
  setEnabled: (enabled: boolean) => void;
  toggle: (key: PrefKey) => void;
  setTextAlign: (align: TextAlignOption) => void;
  setNumeric: <K extends "fontScale" | "lineHeight" | "contentScale" | "letterSpacing">(
    key: K,
    value: AccessibilityPreferences[K],
  ) => void;
  reset: () => void;
  hideWidget: () => void;
  showWidget: () => void;
  announce: (message: string) => void;
  announcement: string;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(
  null,
);

const CLASS_MAP: Array<{
  key: keyof AccessibilityPreferences;
  className: string;
  when?: (p: AccessibilityPreferences) => boolean;
}> = [
  { key: "highContrast", className: "a11y-high-contrast" },
  { key: "readableFont", className: "a11y-readable-font" },
  { key: "hideImages", className: "a11y-hide-images" },
  { key: "highlightHeadings", className: "a11y-highlight-headings" },
  { key: "highlightLinks", className: "a11y-highlight-links" },
  { key: "grayscale", className: "a11y-grayscale" },
  { key: "stopAnimations", className: "a11y-stop-motion" },
  { key: "largeCursor", className: "a11y-large-cursor" },
];

function applyDomEffects(prefs: AccessibilityPreferences): () => void {
  const root = document.documentElement;
  const active = prefs.enabled;

  root.classList.toggle("a11y-enabled", active);

  for (const { key, className } of CLASS_MAP) {
    const on = active && Boolean(prefs[key]);
    root.classList.toggle(className, on);
  }

  root.classList.toggle("a11y-align-left", active && prefs.textAlign === "left");
  root.classList.toggle(
    "a11y-align-center",
    active && prefs.textAlign === "center",
  );
  root.classList.toggle(
    "a11y-align-right",
    active && prefs.textAlign === "right",
  );

  if (active) {
    root.style.setProperty("--a11y-font-scale", String(prefs.fontScale / 100));
    root.style.setProperty(
      "--a11y-line-height-mult",
      String(prefs.lineHeight / 100),
    );
    root.style.setProperty(
      "--a11y-content-scale",
      String(prefs.contentScale / 100),
    );
    root.style.setProperty(
      "--a11y-letter-spacing",
      letterSpacingToEm(prefs.letterSpacing),
    );
  } else {
    root.style.setProperty("--a11y-font-scale", "1");
    root.style.setProperty("--a11y-line-height-mult", "1");
    root.style.setProperty("--a11y-content-scale", "1");
    root.style.setProperty("--a11y-letter-spacing", "0em");
  }

  // One-shot image alt fallbacks when hide-images is on
  const added: HTMLElement[] = [];
  if (active && prefs.hideImages) {
    const images = document.querySelectorAll<HTMLImageElement>(
      ".page-main img:not([data-a11y-keep])",
    );
    images.forEach((img) => {
      const alt = (img.getAttribute("alt") || "").trim();
      if (!alt) return;
      if (img.dataset.a11yAltBound) return;
      img.dataset.a11yAltBound = "1";
      img.dataset.a11yAlt = alt;
      const fallback = document.createElement("span");
      fallback.className = "a11y-img-alt-fallback";
      fallback.textContent = alt;
      fallback.setAttribute("data-a11y-generated", "1");
      img.insertAdjacentElement("afterend", fallback);
      added.push(fallback);
    });

    document
      .querySelectorAll<HTMLElement>(".page-main [style*='background-image']")
      .forEach((el) => {
        el.setAttribute("data-a11y-bg-hidden", "1");
      });
  }

  return () => {
    added.forEach((el) => el.remove());
    document
      .querySelectorAll("[data-a11y-alt-bound]")
      .forEach((el) => {
        el.removeAttribute("data-a11y-alt-bound");
        el.removeAttribute("data-a11y-alt");
      });
    document
      .querySelectorAll("[data-a11y-bg-hidden]")
      .forEach((el) => el.removeAttribute("data-a11y-bg-hidden"));
    document
      .querySelectorAll("[data-a11y-generated]")
      .forEach((el) => el.remove());
  };
}

function readSessionHidden(): boolean {
  try {
    return sessionStorage.getItem(SESSION_HIDDEN_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSessionHidden(hidden: boolean): void {
  try {
    if (hidden) sessionStorage.setItem(SESSION_HIDDEN_KEY, "1");
    else sessionStorage.removeItem(SESSION_HIDDEN_KEY);
  } catch {
    // ignore
  }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<AccessibilityPreferences>(() =>
    loadPreferences(),
  );
  const [panelOpen, setPanelOpen] = useState(false);
  const [widgetHidden, setWidgetHidden] = useState(() => readSessionHidden());
  const [announcement, setAnnouncement] = useState("");
  const cleanupRef = useRef<(() => void) | null>(null);

  const announce = useCallback((message: string) => {
    setAnnouncement("");
    // Force live region refresh
    requestAnimationFrame(() => setAnnouncement(message));
  }, []);

  const updatePrefs = useCallback(
    (updater: (prev: AccessibilityPreferences) => AccessibilityPreferences) => {
      setPrefs((prev) => {
        const next = updater(prev);
        savePreferences(next);
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    cleanupRef.current?.();
    cleanupRef.current = applyDomEffects(prefs);
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [prefs]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "a" || e.key === "A" || e.code === "KeyA")) {
        e.preventDefault();
        setWidgetHidden(false);
        writeSessionHidden(false);
        setPanelOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const setLanguage = useCallback(
    (language: A11yLanguage) => {
      updatePrefs((p) => ({ ...p, language }));
    },
    [updatePrefs],
  );

  const setEnabled = useCallback(
    (enabled: boolean) => {
      updatePrefs((p) => ({ ...p, enabled }));
    },
    [updatePrefs],
  );

  const toggle = useCallback(
    (key: PrefKey) => {
      updatePrefs((p) => {
        const current = p[key];
        if (typeof current !== "boolean") return p;
        return { ...p, [key]: !current };
      });
    },
    [updatePrefs],
  );

  const setTextAlign = useCallback(
    (textAlign: TextAlignOption) => {
      updatePrefs((p) => ({
        ...p,
        textAlign: p.textAlign === textAlign ? "original" : textAlign,
      }));
    },
    [updatePrefs],
  );

  const setNumeric = useCallback(
    <K extends "fontScale" | "lineHeight" | "contentScale" | "letterSpacing">(
      key: K,
      value: AccessibilityPreferences[K],
    ) => {
      updatePrefs((p) => ({ ...p, [key]: value }));
    },
    [updatePrefs],
  );

  const reset = useCallback(() => {
    const next = { ...DEFAULT_PREFERENCES, language: prefs.language };
    clearPreferences();
    savePreferences(next);
    setPrefs(next);
    announce(getTranslations(prefs.language).reset);
  }, [announce, prefs.language]);

  const hideWidget = useCallback(() => {
    setPanelOpen(false);
    setWidgetHidden(true);
    writeSessionHidden(true);
  }, []);

  const showWidget = useCallback(() => {
    setWidgetHidden(false);
    writeSessionHidden(false);
    setPanelOpen(true);
  }, []);

  const t = useMemo(() => getTranslations(prefs.language), [prefs.language]);
  const isRtl = isRtlLanguage(prefs.language);

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      prefs,
      panelOpen,
      widgetHidden,
      t,
      isRtl,
      setPanelOpen,
      setLanguage,
      setEnabled,
      toggle,
      setTextAlign,
      setNumeric,
      reset,
      hideWidget,
      showWidget,
      announce,
      announcement,
    }),
    [
      prefs,
      panelOpen,
      widgetHidden,
      t,
      isRtl,
      setLanguage,
      setEnabled,
      toggle,
      setTextAlign,
      setNumeric,
      reset,
      hideWidget,
      showWidget,
      announce,
      announcement,
    ],
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return ctx;
}
