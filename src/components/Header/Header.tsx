import { useEffect, useId, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ASSETS, NAV_ITEMS } from "../../data/site";
import "./Header.css";

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    if (open) {
      const t = window.setTimeout(() => closeBtnRef.current?.focus(), 50);
      return () => {
        window.clearTimeout(t);
        document.body.classList.remove("menu-open");
      };
    }
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isHome = location.pathname === "/";

  return (
    <header className={`site-header ${isHome ? "site-header--home" : ""}`}>
      <div className="site-header__bar">
        <NavLink to="/" className="site-header__logo" aria-label="מיטל גוטמן שקד - עמוד הבית">
          <img
            src={ASSETS.logo}
            alt="מיטל גוטמן שקד- מספרת נומרולוגיה לוגו"
            width={72}
            height={72}
          />
        </NavLink>

        <nav className="site-header__desktop" aria-label="תפריט ראשי">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === "/"}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={openBtnRef}
          type="button"
          className={`site-header__burger ${open ? "is-open" : ""}`}
          aria-label={open ? "סגור תפריט" : "פתח תפריט"}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        className={`mobile-menu ${open ? "is-open" : ""}`}
        id={menuId}
        aria-hidden={!open}
      >
        <button
          type="button"
          className="mobile-menu__backdrop"
          aria-label="סגור תפריט"
          tabIndex={-1}
          onClick={closeMenu}
        />
        <div className="mobile-menu__panel" role="dialog" aria-modal={open} aria-label="תפריט נייד">
          <button
            ref={closeBtnRef}
            type="button"
            className="mobile-menu__close"
            aria-label="סגור תפריט"
            onClick={closeMenu}
          >
            ×
          </button>
          <nav aria-label="תפריט נייד">
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.to === "/"} onClick={closeMenu}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
