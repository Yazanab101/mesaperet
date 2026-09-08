import { useEffect, useId, useRef, useState } from "react";
import { Languages } from "lucide-react";
import { useAccessibility } from "./AccessibilityProvider";
import { LANGUAGES, type A11yLanguage } from "./accessibilityTypes";

export function AccessibilityLanguageSelector() {
  const { prefs, setLanguage, t } = useAccessibility();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const current = LANGUAGES.find((l) => l.code === prefs.language) ?? LANGUAGES[0]!;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = (code: A11yLanguage) => {
    setLanguage(code);
    setOpen(false);
  };

  return (
    <div className="a11y-lang" ref={rootRef}>
      <button
        type="button"
        className="a11y-lang__btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t.language}
        onClick={() => setOpen((v) => !v)}
      >
        <Languages size={14} aria-hidden />
        <span>{current.short}</span>
      </button>
      {open && (
        <ul
          id={menuId}
          className="a11y-lang__menu"
          role="listbox"
          aria-label={t.language}
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code} role="presentation">
              <button
                type="button"
                className="a11y-lang__option"
                role="option"
                aria-selected={prefs.language === lang.code}
                onClick={() => select(lang.code)}
              >
                {lang.native}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
