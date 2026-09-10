import { ASSETS } from "../../data/site";
import "./PageHero.css";

type Props = {
  title: string;
  /** Soft break after this prefix on small screens only (workshops long titles) */
  mobileBreakAfter?: string;
  breadcrumb?: string;
  bannerAlt?: string;
  /** Heading level — certificates / workshop / testimonial sections */
  as?: "h1" | "h2" | "h3";
  /**
   * Band height variant (measured @ 1440):
   * - hero: ~240px page title
   * - hero-short: ~140px (testimonials H1)
   * - section: ~211–213px inset (workshops categories)
   * - section-short: ~146px inset
   * - bleed: ~211px full-bleed (testimonials section titles)
   */
  band?: "hero" | "hero-short" | "section" | "section-short" | "bleed";
  /** Smaller title for H3-style section banners */
  titleSize?: "lg" | "md" | "sm";
  /** object-position for banner crop */
  objectPosition?: string;
  className?: string;
  id?: string;
};

function TitleText({ title, mobileBreakAfter }: { title: string; mobileBreakAfter?: string }) {
  if (!mobileBreakAfter || !title.startsWith(mobileBreakAfter)) {
    return <>{title}</>;
  }
  const rest = title.slice(mobileBreakAfter.length).replace(/^\s+/, "");
  return (
    <>
      {mobileBreakAfter}
      <span className="page-hero__mbreak" aria-hidden="true" />{" "}
      {rest}
    </>
  );
}

export function PageHero({
  title,
  mobileBreakAfter,
  breadcrumb,
  bannerAlt = "הקסם של נומרולוגיה",
  as = "h1",
  band = "hero",
  titleSize,
  objectPosition,
  className = "",
  id,
}: Props) {
  const Heading = as;
  const bandClass =
    band === "hero-short"
      ? "page-hero--hero-short"
      : band === "section"
        ? "page-hero--section"
        : band === "section-short"
          ? "page-hero--section-short"
          : band === "bleed"
            ? "page-hero--bleed"
            : "";
  const titleClass =
    titleSize === "sm"
      ? "page-hero__title page-hero__title--sm"
      : titleSize === "md"
        ? "page-hero__title page-hero__title--md"
        : "page-hero__title";

  /* Live Wix: page H1 uses fp_0.50_0.70; category/section bands use fp_0.50_0.13 */
  const resolvedPosition =
    objectPosition ??
    (band === "section" || band === "section-short" || band === "bleed"
      ? "50% 13%"
      : "50% 70%");

  return (
    <section
      id={id}
      className={`page-hero ${bandClass} ${className}`.trim()}
      aria-label={title}
    >
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
          style={{ objectPosition: resolvedPosition }}
        />
        <Heading className={titleClass}>
          <TitleText title={title} mobileBreakAfter={mobileBreakAfter} />
        </Heading>
      </div>
    </section>
  );
}
