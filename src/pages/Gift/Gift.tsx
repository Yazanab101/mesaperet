import { giftCopy } from "../../data/content";
import { ASSETS } from "../../data/site";
import { PageHero } from "../../components/PageHero/PageHero";
import { ScrollReveal } from "../../components/ScrollReveal/ScrollReveal";
import { usePageMeta } from "../../hooks/usePageMeta";
import "./Gift.css";

export function GiftPage() {
  usePageMeta("gift");

  return (
    <div className="gift-page">
      <PageHero title="שובר מתנה" breadcrumb="שובר מתנה" bannerAlt="הדרכות נומרולוגיה" />

      <section className="gift-page__body" aria-label="שובר מתנה">
        <div className="gift-page__grid">
          <ScrollReveal>
            <div className="gift-page__copy">
              <p>{giftCopy}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <div className="gift-page__image">
              <img
                src={ASSETS.giftVoucher}
                alt="שובר הזמנה לייעוץ נומרולוגי חוויתי ומעצים"
                loading="eager"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
