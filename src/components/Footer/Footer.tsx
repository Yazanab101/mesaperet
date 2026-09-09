import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ASSETS,
  FACEBOOK_URL,
  NAV_ITEMS,
  SEGEV_URL,
  FOOTER_LEGAL,
  WHATSAPP_URL,
} from "../../data/site";
import { SiteSearch, WixSearchIcon } from "../SiteSearch/SiteSearch";
import "./Footer.css";

export function Footer() {
  const { pathname } = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <footer className="site-footer" data-footer="root">
        <div className="site-footer__canvas" data-footer="canvas">
          <NavLink to="/" className="site-footer__logo" aria-label="מיטל גוטמן שקד - עמוד הבית" data-footer="logo">
            <img
              src={ASSETS.logo}
              alt="מיטל גוטמן שקד - מספרת נומרולוגיה לוגו"
              width={197}
              height={197}
            />
          </NavLink>

          <nav className="site-footer__nav" aria-label="ניווט תחתון" data-footer="nav">
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      isActive || (item.to === "/" && pathname === "/") ? "is-active" : undefined
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="site-footer__legal" aria-label="מידע משפטי" data-footer="legal">
            <ul>
              {FOOTER_LEGAL.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to}>{item.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="site-footer__search"
            aria-label="חיפוש"
            aria-expanded={searchOpen}
            aria-haspopup="dialog"
            data-footer="search"
            onClick={() => setSearchOpen(true)}
          >
            <WixSearchIcon />
          </button>

          <div className="site-footer__social" aria-label="סרגל קישורים לרשתות חברתיות" data-footer="social">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Whatsapp" data-footer="wa">
              <img src={ASSETS.socialWhatsapp} alt="" width={57} height={57} decoding="async" />
            </a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook" data-footer="fb">
              <img src={ASSETS.socialFacebook} alt="" width={57} height={57} decoding="async" />
            </a>
          </div>

          <p className="site-footer__credit" data-footer="credit">
            <a href={SEGEV_URL} target="_blank" rel="noopener noreferrer">
              נבנה באהבה ע&quot;י שגב דיגיטל
            </a>
          </p>
        </div>
      </footer>

      <SiteSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
