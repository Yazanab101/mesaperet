import { accessibilityContent } from "../../data/legal";
import { PageHero } from "../../components/PageHero/PageHero";
import { ScrollReveal } from "../../components/ScrollReveal/ScrollReveal";
import { WhatsAppButton } from "../../components/WhatsAppButton/WhatsAppButton";
import { usePageMeta } from "../../hooks/usePageMeta";
import "../Legal.css";

export function AccessibilityPage() {
  usePageMeta("accessibility");
  const c = accessibilityContent;

  return (
    <div className="legal-page">
      <PageHero title={c.title} breadcrumb={c.title} bannerAlt="הקסם של נומרלוגיה" />
      <section className="section legal-page__body">
        <div className="container prose legal-page__content">
          <ScrollReveal>
            {c.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>
              <strong>{c.adaptationsTitle}</strong>
            </p>
            <ul>
              {c.adaptations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {c.closing.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </ScrollReveal>
          <div className="legal-page__cta">
            <WhatsAppButton />
          </div>
        </div>
      </section>
    </div>
  );
}
