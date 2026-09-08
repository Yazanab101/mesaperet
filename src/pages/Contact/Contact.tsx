import { EMAIL, WHATSAPP_DISPLAY, WHATSAPP_URL } from "../../data/site";
import { PageHero } from "../../components/PageHero/PageHero";
import { ContactForm } from "../../components/ContactForm/ContactForm";
import { ScrollReveal } from "../../components/ScrollReveal/ScrollReveal";
import { WhatsAppButton } from "../../components/WhatsAppButton/WhatsAppButton";
import { usePageMeta } from "../../hooks/usePageMeta";
import "./Contact.css";

export function ContactPage() {
  usePageMeta("contact");

  return (
    <div className="contact-page">
      <PageHero title="צרו קשר" breadcrumb="צור קשר" />
      <section className="section contact-page__body">
        <div className="container contact-page__grid">
          <ScrollReveal>
            <div className="contact-page__info">
              <h2 className="section-subtitle" style={{ textAlign: "start" }}>
                מעניין אותי לשמוע עוד
              </h2>
              <h2 className="contact-page__sub">צרו קשר</h2>
              <ul className="contact-page__details">
                <li>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    וואטסאפ / טלפון: {WHATSAPP_DISPLAY}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </li>
                <li>נתניה, ישראל</li>
              </ul>
              <WhatsAppButton />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
