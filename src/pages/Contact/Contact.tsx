import { ASSETS, EMAIL, WHATSAPP_DISPLAY, WHATSAPP_URL, asset } from "../../data/site";
import { PageHero } from "../../components/PageHero/PageHero";
import { ContactForm } from "../../components/ContactForm/ContactForm";
import { WhatsAppButton } from "../../components/WhatsAppButton/WhatsAppButton";
import { usePageMeta } from "../../hooks/usePageMeta";
import "./Contact.css";

const PHONE_ICON = asset("contact/phone.svg");
const EMAIL_ICON = asset("contact/email.svg");

/** Exact Wix Google Map pin (comp-luofhmdk / dataItem-luofhmdo) */
const MAP = {
  lat: 32.391037,
  lng: 34.910917,
  zoom: 14,
  title: "מיטל גוטמן שקד",
  description: "נומרולוגית",
  linkTitle: "מיטל גוטמן שקד - מספרת נומרולוגיה",
  linkHref: "https://www.me-saperet.com",
  address: "Kfar Haroeh, Israel",
} as const;

const MAP_EMBED = `https://maps.google.com/maps?q=${MAP.lat},${MAP.lng}&hl=he&z=${MAP.zoom}&output=embed`;

/**
 * Exact DOM layout from me-saperet.com/צור-קשר @ 1440×900
 * (absolute stage matching Wix coordinates).
 */
export function ContactPage() {
  usePageMeta("contact");

  return (
    <div className="contact-page">
      <PageHero title="צרו קשר" breadcrumb="צור קשר" />

      <section className="contact-page__main" aria-label="יצירת קשר">
        <div className="contact-page__stage">
          <div className="contact-page__form-box">
            <ContactForm />
          </div>

          <h2 className="contact-page__interest">מעניין אותי לשמוע עוד</h2>

          <p className="contact-page__phone">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              {WHATSAPP_DISPLAY}
            </a>
          </p>
          <img
            className="contact-page__icon contact-page__icon--phone"
            src={PHONE_ICON}
            alt=""
            aria-hidden="true"
          />

          <p className="contact-page__email">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
          <img
            className="contact-page__icon contact-page__icon--email"
            src={EMAIL_ICON}
            alt=""
            aria-hidden="true"
          />

          <img
            className="contact-page__deco"
            src={ASSETS.logo}
            alt="לוגו מיטל גוטמן שקד - מספרת נומרולוגיה"
          />
        </div>
      </section>

      <section className="contact-page__map" aria-label="מפה">
        <iframe
          className="contact-page__map-frame"
          title="Google Maps"
          src={MAP_EMBED}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <div className="contact-page__map-pin" aria-hidden="true">
          <div className="contact-page__map-card">
            <p className="contact-page__map-card-title">{MAP.title}</p>
            <p className="contact-page__map-card-desc">{MAP.description}</p>
            <a
              className="contact-page__map-card-link"
              href={MAP.linkHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {MAP.linkTitle}
            </a>
          </div>
        </div>
      </section>

      <section className="contact-page__cta-band" aria-label="וואטסאפ">
        <div className="contact-page__cta-band-inner">
          <img
            className="contact-page__cta-bg"
            src={ASSETS.bannerMagic}
            alt=""
            aria-hidden="true"
          />
          <WhatsAppButton className="whatsapp-btn--site" />
        </div>
      </section>
    </div>
  );
}
