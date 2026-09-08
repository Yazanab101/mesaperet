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
      <PageHero title="ייעוץ וטיפול" breadcrumb="ייעוץ וטיפול" />

      <section className="section consultation-page__main">
        <div className="container consultation-page__grid">
          <ScrollReveal>
            <div className="consultation-page__media">
              <img
                src={ASSETS.consultationMain}
                alt="מיטל בטיפול נומרולוגי"
                loading="eager"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="prose">
              {paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </ScrollReveal>
        </div>
        <div className="container" style={{ marginTop: "2rem" }}>
          <Gallery images={gallery} variant="slider" />
        </div>
      </section>

      <section className="section consultation-page__past">
        <div className="container consultation-page__grid">
          <ScrollReveal>
            <div>
              <h2 className="section-subtitle" style={{ textAlign: "start" }}>
                {pastLife.title}
              </h2>
              <div className="prose">
                {pastLife.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="consultation-page__media">
              <img src={pastLife.image.src} alt={pastLife.image.alt} loading="lazy" />
            </div>
          </ScrollReveal>
        </div>
        <div className="consultation-page__cta">
          <WhatsAppButton />
        </div>
      </section>
    </div>
  );
}
