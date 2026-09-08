import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
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

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <>
      <div className={`page ${isHome ? "page--home" : ""}`}>
        <a className="skip-link" href="#main-content">
          דלג לתוכן המרכזי
        </a>
        <Header />
        <main id="main-content" className="page-main">
          <Outlet />
        </main>
        <Footer />
        {!isHome && <WhatsAppButton floating />}
      </div>
      <AccessibilityWidget />
    </>
  );
}
