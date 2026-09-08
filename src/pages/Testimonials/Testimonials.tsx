import {
  personalTestimonials,
  testimonialScreenshots,
  workshopTestimonials,
} from "../../data/testimonials";
import { PageHero } from "../../components/PageHero/PageHero";
import { ScrollReveal } from "../../components/ScrollReveal/ScrollReveal";
import { Gallery } from "../../components/Gallery/Gallery";
import { WhatsAppButton } from "../../components/WhatsAppButton/WhatsAppButton";
import { usePageMeta } from "../../hooks/usePageMeta";
import "./Testimonials.css";

export function TestimonialsPage() {
  usePageMeta("testimonials");

  return (
    <div className="testimonials-page">
      <PageHero title="המלצות" breadcrumb="המלצות" />

      <section className="section testimonials-page__top">
        <div className="container">
          <ScrollReveal>
            <h2 className="section-subtitle">איך היה?</h2>
          </ScrollReveal>
          <nav className="testimonials-page__tabs" aria-label="סוגי המלצות">
            <a href="#personal">מפגשים אישיים</a>
            <a href="#workshops-recs">סדנאות</a>
          </nav>
          <ScrollReveal delay={80}>
            <Gallery images={[...testimonialScreenshots]} variant="slider" />
          </ScrollReveal>
        </div>
      </section>

      <section id="personal" className="section testimonials-page__block">
        <div className="container">
          <ScrollReveal>
            <h3 className="testimonials-page__h3">איך היה במפגשים האישיים?</h3>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <Gallery images={[...personalTestimonials]} variant="masonry" />
          </ScrollReveal>
        </div>
      </section>

      <section id="workshops-recs" className="section testimonials-page__block testimonials-page__block--alt">
        <div className="container">
          <ScrollReveal>
            <h3 className="testimonials-page__h3">איך היה בסדנאות?</h3>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <Gallery images={[...workshopTestimonials]} variant="masonry" />
          </ScrollReveal>
          <div className="testimonials-page__cta">
            <WhatsAppButton />
          </div>
        </div>
      </section>
    </div>
  );
}
