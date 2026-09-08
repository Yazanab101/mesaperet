import { privacyContent } from "../../data/legal";
import { PageHero } from "../../components/PageHero/PageHero";
import { ScrollReveal } from "../../components/ScrollReveal/ScrollReveal";
import { WhatsAppButton } from "../../components/WhatsAppButton/WhatsAppButton";
import { usePageMeta } from "../../hooks/usePageMeta";
import "../Legal.css";

export function PrivacyPage() {
  usePageMeta("privacy");
  const c = privacyContent;

  return (
    <div className="legal-page">
      <PageHero title={c.title} breadcrumb={c.title} />
      <section className="section legal-page__body">
        <div className="container prose legal-page__content">
          <ScrollReveal>
            {c.sections.map((section, idx) => (
              <div key={section.heading ?? `s-${idx}`} className="legal-page__section">
                {section.heading && <h2>{section.heading}</h2>}
                {section.paragraphs?.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {section.list && (
                  <ul>
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
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
