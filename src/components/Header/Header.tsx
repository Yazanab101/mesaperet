import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";
import { ASSETS, NAV_ITEMS } from "../../data/site";
import { SiteSearch, WixSearchIcon } from "../SiteSearch/SiteSearch";
import "./Header.css";

/** Inner-pages only. Lives in .site-chrome, above #site-scroll — never scrolls. */
export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const menuId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const mobileMenu = (
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
  );

  return (
    <>
      <header className="site-header">
        <div className="site-header__bar">
          <NavLink to="/" className="site-header__logo" aria-label="מיטל גוטמן שקד - עמוד הבית">
            <img
              src={ASSETS.logo}
              alt="מיטל גוטמן שקד- מספרת נומרולוגיה לוגו"
              width={167}
              height={111}
            />
          </NavLink>

          <button
            type="button"
            className="site-header__search"
            aria-label="Search"
            aria-expanded={searchOpen}
            aria-haspopup="dialog"
            onClick={() => setSearchOpen(true)}
          >
            <WixSearchIcon />
          </button>

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
      </header>

      {mounted ? createPortal(mobileMenu, document.body) : null}
      <SiteSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
