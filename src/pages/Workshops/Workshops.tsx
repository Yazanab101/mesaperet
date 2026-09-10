import { clientLogos, workshopCategories, workshopsIntro } from "../../data/content";
import { ASSETS } from "../../data/site";
import { PageHero } from "../../components/PageHero/PageHero";
import { ScrollReveal } from "../../components/ScrollReveal/ScrollReveal";
import { Gallery } from "../../components/Gallery/Gallery";
import { WhatsAppButton } from "../../components/WhatsAppButton/WhatsAppButton";
import { usePageMeta } from "../../hooks/usePageMeta";
import "./Workshops.css";

export function WorkshopsPage() {
  usePageMeta("workshops");

  return (
    <div className="workshops-page">
      <PageHero title="סדנאות והרצאות" breadcrumb="סדנאות" bannerAlt="הדרכות נומרולוגיה" />

      <section className="workshops-page__clients" aria-label="בין לקוחותי">
        <ScrollReveal>
          <h2 className="workshops-page__clients-title">בין לקוחותי</h2>
        </ScrollReveal>

        <div className="workshops-page__logos" aria-label="לוגואים של לקוחות">
          <div className="workshops-page__logos-track">
            {[...clientLogos, ...clientLogos, ...clientLogos].map((logo, i) => (
              <div className="workshops-page__logo" key={`${logo.src}-${i}`}>
                <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>

        <ScrollReveal delay={80}>
          <div className="workshops-page__intro">
            {workshopsIntro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {workshopCategories.map((cat) => (
        <section key={cat.id} className="workshops-page__category">
          <PageHero
            id={cat.id}
            title={cat.title}
            as="h2"
            band={cat.band}
            bannerAlt="הדרכות נומרולוגיה"
            className="workshops-page__cat-hero"
          />
          <div className="workshops-page__gallery-wrap">
            <ScrollReveal>
              <Gallery
                images={[...cat.images]}
                variant={
                  "gallery" in cat && cat.gallery === "compact"
                    ? "workshops-sm"
                    : "workshops"
                }
              />
            </ScrollReveal>
          </div>
        </section>
      ))}

      <section className="workshops-page__cta-band" aria-label="יצירת קשר">
        <div className="workshops-page__cta-band-inner">
          <img
            className="workshops-page__cta-bg"
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
