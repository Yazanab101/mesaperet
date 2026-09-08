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

      <section className="section workshops-page__clients">
        <div className="container">
          <ScrollReveal>
            <h2 className="section-subtitle">בין לקוחותי</h2>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <div className="workshops-page__logos" aria-label="לוגואים של לקוחות">
              {[...clientLogos, ...clientLogos].map((logo, i) => (
                <div className="workshops-page__logo" key={`${logo.src}-${i}`}>
                  <img src={logo.src} alt={logo.alt} loading="lazy" />
                </div>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="prose workshops-page__intro">
              {workshopsIntro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </ScrollReveal>
          <nav className="workshops-page__cats" aria-label="קטגוריות סדנאות">
            {workshopCategories.map((cat) => (
              <a key={cat.id} href={`#${cat.id}`}>
                {cat.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {workshopCategories.map((cat) => (
        <section key={cat.id} id={cat.id} className="section workshops-page__category">
          <div className="container">
            <div className="workshops-page__divider decorative-overlay" aria-hidden="true">
              <img src={ASSETS.bannerMagic} alt="" />
            </div>
            <ScrollReveal>
              <h2 className="section-subtitle">{cat.title}</h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <Gallery images={[...cat.images]} variant="grid" />
            </ScrollReveal>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="container" style={{ display: "flex", justifyContent: "center" }}>
          <WhatsAppButton />
        </div>
      </section>
    </div>
  );
}
