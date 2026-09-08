import { ASSETS } from "../../data/site";
import { ScrollReveal } from "../ScrollReveal/ScrollReveal";
import "./PageHero.css";

type Props = {
  title: string;
  breadcrumb?: string;
  bannerAlt?: string;
};

export function PageHero({
  title,
  breadcrumb,
  bannerAlt = "הקסם של נומרולוגיה",
}: Props) {
  return (
    <section className="page-hero">
      <div className="page-hero__banner decorative-overlay" aria-hidden="true">
        <img src={ASSETS.bannerMagic} alt="" />
      </div>
      <div className="container page-hero__content">
        {breadcrumb && (
          <p className="page-hero__crumb">
            <span>{breadcrumb}</span>
            <span aria-hidden="true"> ›</span>
          </p>
        )}
        <ScrollReveal>
          <h1 className="section-title">{title}</h1>
        </ScrollReveal>
        <img className="page-hero__ornament" src={ASSETS.bannerMagic} alt={bannerAlt} />
      </div>
    </section>
  );
}
