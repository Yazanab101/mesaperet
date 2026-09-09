import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { searchSite } from "../../data/searchIndex";
import "./SiteSearch.css";

/** Exact magnifier path from live Wix search button */
export function WixSearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      width="200"
      height="200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M54.758 119.575c-8.658-8.658-13.425-20.167-13.425-32.408 0-12.234 4.767-23.742 13.425-32.4 8.659-8.659 20.167-13.434 32.409-13.434 12.241 0 23.75 4.775 32.408 13.434C128.233 63.425 133 74.933 133 87.167c0 12.241-4.767 23.75-13.425 32.408C110.917 128.233 99.408 133 87.167 133c-12.242 0-23.75-4.767-32.409-13.425Zm111.6 40.892-38.083-38.092c8.425-9.808 13.058-22.133 13.058-35.208 0-14.467-5.633-28.067-15.866-38.292C115.242 38.642 101.633 33 87.167 33 72.7 33 59.1 38.642 48.867 48.875 38.633 59.1 33 72.7 33 87.167c0 14.475 5.633 28.066 15.867 38.3C59.1 135.7 72.7 141.333 87.167 141.333c13.075 0 25.4-4.633 35.216-13.066l38.084 38.091 5.891-5.891Z"
      />
    </svg>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SiteSearch({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelId = useId();
  const results = useMemo(() => searchSite(query), [query]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 40);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("site-search-open");
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("site-search-open");
    };
  }, [open, onClose]);

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <div className="site-search" role="presentation">
      <button
        type="button"
        className="site-search__backdrop"
        aria-label="סגירה"
        onClick={handleClose}
      />

      <div
        className="site-search__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={panelId}
      >
        <div className="site-search__row" dir="rtl">
          <div className="site-search__bar">
            <label className="site-search__field" htmlFor={panelId}>
              <span className="site-search__icon" aria-hidden>
                <WixSearchIcon />
              </span>
              <span className="sr-only">חיפוש</span>
              <input
                ref={inputRef}
                id={panelId}
                className="site-search__input"
                type="search"
                placeholder="חיפוש"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                enterKeyHint="search"
              />
            </label>

            <button
              type="button"
              className="site-search__close"
              onClick={handleClose}
              aria-label="סגירה"
            >
              <span className="site-search__close-x" aria-hidden>
                ×
              </span>
            </button>
          </div>
          <button
            type="button"
            className="site-search__close-text"
            onClick={handleClose}
          >
            סגירה
          </button>
        </div>

        <ul className="site-search__results" role="listbox" aria-label="תוצאות חיפוש">
          {results.length === 0 ? (
            <li className="site-search__empty">לא נמצאו תוצאות</li>
          ) : (
            results.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className="site-search__result"
                  onClick={handleClose}
                >
                  <span className="site-search__result-title">{item.title}</span>
                  <span className="site-search__result-desc">{item.description}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
