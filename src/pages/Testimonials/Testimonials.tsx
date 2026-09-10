import { useState } from "react";
import {
  featuredVideoTestimonials,
  personalTestimonials,
  testimonialNavCards,
  workshopTestimonials,
} from "../../data/testimonials";
import { ASSETS } from "../../data/site";
import { PageHero } from "../../components/PageHero/PageHero";
import { ScrollReveal } from "../../components/ScrollReveal/ScrollReveal";
import { Gallery } from "../../components/Gallery/Gallery";
import { Lightbox } from "../../components/Lightbox/Lightbox";
import { WhatsAppButton } from "../../components/WhatsAppButton/WhatsAppButton";
import { usePageMeta } from "../../hooks/usePageMeta";
import "./Testimonials.css";

export function TestimonialsPage() {
  usePageMeta("testimonials");
  const [videoIndex, setVideoIndex] = useState<number | null>(null);

  const videoLightboxItems = featuredVideoTestimonials.map((v) => ({
    src: v.poster,
    alt: `המלצה מ${v.name}`,
    video: v.video,
  }));

  return (
    <div className="testimonials-page">
      <PageHero title="המלצות" breadcrumb="המלצות" band="hero-short" />

      <section className="testimonials-page__featured" aria-label="המלצות מצולמות">
        <div className="testimonials-page__stack">
          {featuredVideoTestimonials.map((item, i) => (
            <ScrollReveal key={item.name} delay={i * 40}>
              <figure className="testimonials-page__video-card">
                <button
                  type="button"
                  className="testimonials-page__video-btn"
                  onClick={() => setVideoIndex(i)}
                  aria-label={`נגן המלצה של ${item.name}`}
                >
                  <img src={item.poster} alt="" loading={i < 2 ? "eager" : "lazy"} />
                  <span className="testimonials-page__play" aria-hidden="true">
                    <svg viewBox="0 0 60 60" width="60" height="60">
                      <circle cx="30" cy="30" r="30" fill="currentColor" opacity="0.72" />
                      <path d="M41.5 30l-17 10V20L41.5 30z" fill="#fff" />
                    </svg>
                  </span>
                </button>
                <figcaption>{item.name}</figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <PageHero
        title="איך היה?"
        as="h2"
        band="bleed"
        titleSize="md"
        className="testimonials-page__how-was"
      />

      <nav className="testimonials-page__cats" aria-label="סוגי המלצות">
        {testimonialNavCards.map((cat) => (
          <a key={cat.id} className="testimonials-page__cat" href={`#${cat.id}`}>
            <span className="testimonials-page__cat-icon" aria-hidden="true">
              <img src={cat.icon} alt="" />
            </span>
            <span className="testimonials-page__cat-label">{cat.title}</span>
          </a>
        ))}
      </nav>

      <PageHero
        id="personal"
        title="איך היה במפגשים האישיים?"
        as="h3"
        band="bleed"
        titleSize="sm"
        className="testimonials-page__anchor testimonials-page__anchor--personal"
      />

      <section className="testimonials-page__block" aria-label="המלצות ממפגשים אישיים">
        <div className="testimonials-page__stack testimonials-page__stack--screens">
          <Gallery images={[...personalTestimonials]} variant="stack" />
        </div>
      </section>

      <PageHero
        id="workshops-recs"
        title="איך היה בסדנאות?"
        as="h3"
        band="bleed"
        titleSize="sm"
        className="testimonials-page__anchor testimonials-page__anchor--workshops"
      />

      <section className="testimonials-page__block" aria-label="המלצות מסדנאות">
        <div className="testimonials-page__stack testimonials-page__stack--screens">
          <Gallery images={[...workshopTestimonials]} variant="stack" />
        </div>
      </section>

      <section className="testimonials-page__cta-band" aria-label="יצירת קשר">
        <div className="testimonials-page__cta-band-inner">
          <img
            className="testimonials-page__cta-bg"
            src={ASSETS.bannerMagic}
            alt=""
            aria-hidden="true"
          />
          <WhatsAppButton className="whatsapp-btn--site" />
        </div>
      </section>

      <Lightbox
        items={videoLightboxItems}
        index={videoIndex}
        onClose={() => setVideoIndex(null)}
        onPrev={() =>
          setVideoIndex((i) =>
            i === null ? i : (i + featuredVideoTestimonials.length - 1) % featuredVideoTestimonials.length,
          )
        }
        onNext={() =>
          setVideoIndex((i) =>
            i === null ? i : (i + 1) % featuredVideoTestimonials.length,
          )
        }
      />
    </div>
  );
}
