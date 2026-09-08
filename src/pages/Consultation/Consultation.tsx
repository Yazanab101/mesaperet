import { consultationCopy } from "../../data/content";
import { ASSETS } from "../../data/site";
import { PageHero } from "../../components/PageHero/PageHero";
import { ScrollReveal } from "../../components/ScrollReveal/ScrollReveal";
import { Gallery } from "../../components/Gallery/Gallery";
import { WhatsAppButton } from "../../components/WhatsAppButton/WhatsAppButton";
import { usePageMeta } from "../../hooks/usePageMeta";
import "./Consultation.css";

export function ConsultationPage() {
  usePageMeta("consultation");
  const { paragraphs, gallery, pastLife } = consultationCopy;

  return (
    <div className="consultation-page">
      <PageHero title="ייעוץ וטיפול" breadcrumb="ייעוץ וטיפול" bannerAlt="הקסם של נומרולוגיה" />

      <section className="consultation-page__intro" aria-label="ייעוץ נומרולוגי">
        <div className="consultation-page__intro-grid">
          <ScrollReveal>
            <div className="consultation-page__portrait">
              <img
                src={ASSETS.consultationMain}
                alt="מיטל בטיפול נומרולוגי"
                loading="eager"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <div className="consultation-page__copy">
              {paragraphs.map((p) => (
                <p key={p} className={p === "וגם-" ? "consultation-page__also" : undefined}>
                  {p}
                </p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="consultation-page__gallery" aria-label="תמונות מהמפגשים">
        <Gallery images={[...gallery]} variant="consult" />
      </section>

      <PageHero
        title={pastLife.title}
        as="h2"
        titleSize="md"
        bannerAlt="הקסם של נומרולוגיה"
      />

      <section className="consultation-page__past" aria-label={pastLife.title}>
        <div className="consultation-page__past-grid">
          <ScrollReveal>
            <div className="consultation-page__past-media">
              <img
                src={pastLife.image.src}
                alt={pastLife.image.alt}
                loading="lazy"
                style={{ objectPosition: pastLife.image.objectPosition }}
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <div className="consultation-page__past-copy">
              <p className="consultation-page__lead">{pastLife.lead}</p>
              {pastLife.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="consultation-page__cta-band" aria-label="יצירת קשר">
        <div className="consultation-page__cta-band-inner">
          <img
            className="consultation-page__cta-bg"
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
