import { NavLink, useLocation } from "react-router-dom";
import {
  ASSETS,
  FACEBOOK_URL,
  NAV_ITEMS,
  SEGEV_URL,
  FOOTER_LEGAL,
  WHATSAPP_URL,
} from "../../data/site";
import "./Footer.css";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M15.5 15.5 21 21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Footer() {
  const { pathname } = useLocation();

  return (
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
                  className={({ isActive }) => (isActive || (item.to === "/" && pathname === "/") ? "is-active" : undefined)}
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

        <button type="button" className="site-footer__search" aria-label="Search" data-footer="search">
          <SearchIcon />
        </button>

        <div className="site-footer__social" aria-label="סרגל קישורים לרשתות חברתיות" data-footer="social">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Whatsapp" data-footer="wa">
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12.04 2c-5.5 0-9.96 4.45-9.96 9.93 0 1.75.46 3.45 1.34 4.95L2 22l5.27-1.38a9.96 9.96 0 0 0 4.77 1.24h.01c5.49 0 9.95-4.46 9.95-9.95C22 6.45 17.54 2 12.04 2zm5.79 14.2c-.24.68-1.4 1.25-1.93 1.33-.5.07-1.12.1-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.25-4.76-4.15-4.9-4.34-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.36.26-.28.57-.35.76-.35h.55c.17 0 .41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.1.19-.14.31-.28.48-.14.17-.3.37-.42.5-.14.14-.28.29-.12.56.16.28.71 1.17 1.53 1.9 1.05.93 1.94 1.22 2.21 1.36.28.14.44.12.6-.07.17-.19.7-.81.89-1.09.19-.28.38-.23.64-.14.26.1 1.66.78 1.94.92.28.14.47.21.54.33.07.11.07.66-.17 1.34z"
              />
            </svg>
          </a>
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook" data-footer="fb">
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
              <path
                fill="currentColor"
                d="M13.5 22v-8.1h2.7l.4-3.1h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.7V4.5c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4v3.1h2.7V22h3.4z"
              />
            </svg>
          </a>
        </div>

        <p className="site-footer__credit" data-footer="credit">
          <a href={SEGEV_URL} target="_blank" rel="noopener noreferrer">
            נבנה באהבה ע&quot;י שגב דיגיטל
          </a>
        </p>
      </div>
    </footer>
  );
}
