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

      <section className="section about-page__intro">
        <div className="container about-page__grid">
          <ScrollReveal>
            <div className="about-page__portrait">
              <img
                src={ASSETS.aboutPortrait}
                alt="מיטל גוטמן שקד - נומרולוגיה קבלית"
                loading="lazy"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="prose about-page__copy">
              {aboutParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section about-page__certs">
        <div className="container">
          <ScrollReveal>
            <h2 className="section-subtitle">התעודות שלי</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <Gallery images={[...certificates]} variant="slider" />
          </ScrollReveal>
          <div className="about-page__cta">
            <WhatsAppButton />
          </div>
        </div>
      </section>
    </div>
  );
}
