import { giftCopy } from "../../data/content";
import { ASSETS } from "../../data/site";
import { PageHero } from "../../components/PageHero/PageHero";
import { ScrollReveal } from "../../components/ScrollReveal/ScrollReveal";
import { WhatsAppButton } from "../../components/WhatsAppButton/WhatsAppButton";
import { usePageMeta } from "../../hooks/usePageMeta";
import "./Gift.css";

export function GiftPage() {
  usePageMeta("gift");

  return (
    <div className="gift-page">
      <PageHero title="שובר מתנה" breadcrumb="שובר מתנה" bannerAlt="הדרכות נומרולוגיה" />
      <section className="section gift-page__body">
        <div className="container gift-page__grid">
          <ScrollReveal>
            <div className="gift-page__image">
              <img
                src={ASSETS.giftVoucher}
                alt="שובר הזמנה לייעוץ נומרולוגי חוויתי ומעצים"
                loading="eager"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="prose">
              <p>{giftCopy}</p>
              <div className="gift-page__cta">
                <WhatsAppButton />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
