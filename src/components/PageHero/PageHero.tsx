import { ASSETS } from "../../data/site";
import "./PageHero.css";

type Props = {
  title: string;
  breadcrumb?: string;
  bannerAlt?: string;
  /** Heading level — certificates section uses h2 */
  as?: "h1" | "h2";
  /** object-position for banner crop */
  objectPosition?: string;
  className?: string;
};

export function PageHero({
  title,
  breadcrumb,
  bannerAlt = "הקסם של נומרולוגיה",
  as = "h1",
  objectPosition = "50% 70%",
  className = "",
}: Props) {
  const Heading = as;

  return (
    <section className={`page-hero ${className}`.trim()} aria-label={title}>
      {breadcrumb && (
        <p className="page-hero__crumb container">
          <span aria-hidden="true">⌂</span>
          <span aria-hidden="true"> › </span>
          <span>{breadcrumb}</span>
        </p>
      )}
      <div className="page-hero__band">
        <img
          className="page-hero__bg"
          src={ASSETS.bannerMagic}
          alt={bannerAlt}
          style={{ objectPosition }}
        />
        <Heading className="page-hero__title">{title}</Heading>
      </div>
    </section>
  );
}
