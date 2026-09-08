import { aboutParagraphs, certificates } from "../../data/content";
import { ASSETS } from "../../data/site";
import { PageHero } from "../../components/PageHero/PageHero";
import { ScrollReveal } from "../../components/ScrollReveal/ScrollReveal";
import { WhatsAppButton } from "../../components/WhatsAppButton/WhatsAppButton";
import { Gallery } from "../../components/Gallery/Gallery";
import { usePageMeta } from "../../hooks/usePageMeta";
import "./About.css";

export function AboutPage() {
  usePageMeta("about");

  return (
    <div className="about-page">
      <PageHero title="אודות" breadcrumb="אודות" bannerAlt="הקסם של נומרולוגיה" />

      <section className="about-page__intro" aria-label="אודות מיטל">
        <div className="about-page__grid">
          <ScrollReveal>
            <div className="about-page__portrait">
              <img
                src={ASSETS.aboutPortrait}
                alt="מיטל גוטמן שקד - נומרולוגיה קבלית"
                loading="lazy"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="about-page__copy">
              {aboutParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <PageHero title="התעודות שלי" as="h2" bannerAlt="הקסם של נומרולוגיה" />

      <section className="about-page__certs" aria-label="התעודות שלי">
        <ScrollReveal>
          <Gallery images={[...certificates]} variant="certs" />
        </ScrollReveal>
      </section>

      <section className="about-page__cta-band" aria-label="יצירת קשר">
        <div className="about-page__cta-band-inner">
          <img
            className="about-page__cta-bg"
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
