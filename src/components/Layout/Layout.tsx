import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { AccessibilityWidget } from "../../accessibility";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import { WhatsAppButton } from "../WhatsAppButton/WhatsAppButton";
import "../../components/ScrollReveal/ScrollReveal.css";
import "../../components/Gallery/Gallery.css";
import "../../components/Lightbox/Lightbox.css";
import "../../components/Header/Header.css";
import "../../components/Footer/Footer.css";
import "../../components/WhatsAppButton/WhatsAppButton.css";
import "../../components/PageHero/PageHero.css";
import "../../components/ContactForm/ContactForm.css";
import "../../components/SiteSearch/SiteSearch.css";

/**
 * Home: no navbar, normal document scroll.
 * Other pages: .site-chrome fixed to viewport; header outside #site-scroll.
 */
export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location.pathname, isHome]);

  if (isHome) {
    return (
      <>
        <div className="page page--home">
          <a className="skip-link" href="#main-content">
            דלג לתוכן המרכזי
          </a>
          <main id="main-content" className="page-main">
            <Outlet />
          </main>
          <Footer />
        </div>
        <AccessibilityWidget />
      </>
    );
  }

  return (
    <>
      <div className="site-chrome">
        <Header />
        <div ref={scrollRef} id="site-scroll" className="site-chrome__scroll">
          <div className="page">
            <a className="skip-link" href="#main-content">
              דלג לתוכן המרכזי
            </a>
            <main id="main-content" className="page-main">
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
      </div>
      <WhatsAppButton floating />
      <AccessibilityWidget />
    </>
  );
}
