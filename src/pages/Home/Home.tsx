import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { ASSETS, FACEBOOK_URL, ROUTES, WHATSAPP_URL } from "../../data/site";
import { usePageMeta } from "../../hooks/usePageMeta";
import "./Home.css";

/** Wix Motions cubicInOut */
const WIX_EASE = [0.645, 0.045, 0.355, 1] as const;

type MotionPreset = "fadeUp" | "slideLeft" | "slideRight" | "revealTop" | "bounceTop";

function Item({
  className,
  delay = 0,
  preset = "fadeUp",
  children,
}: {
  className: string;
  delay?: number;
  preset?: MotionPreset;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const props = reduceMotion ? {} : motionProps(preset, delay);

  return (
    <div className={`home-item ${className}`} data-home-item={className.replace("home-item--", "")}>
      <motion.div className="home-item__motion" {...(props as object)}>
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Live me-saperet.com entrance (thunderbolt motion):
 * chairs SlideIn L/R 3s · portrait RevealIn top 1.2s · phone BounceIn top @ 3.4s
 * Animates transform/opacity/clip-path only — layout boxes stay identical.
 */
function motionProps(preset: MotionPreset, delay: number) {
  switch (preset) {
    case "slideLeft":
      return {
        initial: { x: "-100%" },
        animate: { x: "0%" },
        transition: { duration: 3, delay, ease: WIX_EASE },
      };
    case "slideRight":
      return {
        initial: { x: "100%" },
        animate: { x: "0%" },
        transition: { duration: 3, delay, ease: WIX_EASE },
      };
    case "revealTop":
      return {
        initial: { clipPath: "inset(0 0 100% 0)" },
        animate: { clipPath: "inset(0 0 0% 0)" },
        transition: { duration: 1.2, delay, ease: WIX_EASE },
      };
    case "bounceTop":
      return {
        initial: { y: "-100%", opacity: 0 },
        animate: { y: ["-100%", "12%", "-4%", "0%"], opacity: [0, 1, 1, 1] },
        transition: { duration: 1.2, delay, ease: WIX_EASE, times: [0, 0.55, 0.78, 1] },
      };
    default:
      return {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
      };
  }
}

/** Decorative Wix vector “חץ למטה” near gift — rotate ~24° */
function GiftArrow() {
  return (
    <div className="home-item home-item--gift-arrow" data-home-item="gift-arrow" aria-hidden="true">
      <svg
        className="home-gift-arrow"
        viewBox="8 40.006 183.999 119.59"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
      >
        <path
          fill="rgb(76, 51, 35)"
          d="M178.236 95.052a2 2 0 0 0-1.439-2.435l-17.434-4.48a2 2 0 1 0-.995 3.874l15.496 3.982-3.982 15.497a2 2 0 1 0 3.874.995zM38.664 40.175c-7.162 3.208-12.485 8.942-15.761 14.044l3.366 2.161c2.994-4.663 7.779-9.754 14.03-12.555zM22.903 54.219c-4.627 7.205-9.41 16.204-12.27 25.645-2.854 9.425-3.847 19.478-.639 28.656l3.776-1.32c-2.823-8.076-2.03-17.191.692-26.177 2.717-8.97 7.3-17.625 11.807-24.643zM9.994 108.52c2.677 7.657 7.98 12.101 14.51 14.003 6.425 1.871 13.917 1.256 21.165-.843 7.272-2.105 14.473-5.751 20.407-10.16 5.904-4.388 10.722-9.658 12.995-15.095l-3.69-1.543c-1.891 4.523-6.096 9.27-11.69 13.427-5.565 4.135-12.338 7.562-19.134 9.529-6.82 1.974-13.489 2.43-18.935.844-5.341-1.555-9.62-5.097-11.852-11.482zm69.077-12.095c1.398-3.344 1.568-6.278.316-8.656-1.232-2.34-3.565-3.607-5.96-4.274-4.753-1.324-11.096-.68-15.373.278l.874 3.903c4.049-.906 9.62-1.388 13.425-.328 1.885.526 2.992 1.33 3.495 2.284.483.918.681 2.502-.468 5.25zM58.054 83.773c-17.001 3.806-31.76 19.346-29.976 37.851l3.982-.383c-1.545-16.027 11.336-30.088 26.868-33.565zm-29.976 37.851c1.549 16.071 12.4 25.609 25.579 31.049 13.132 5.422 28.882 6.937 41.118 6.923l-.005-4c-12.002.013-27.152-1.486-39.587-6.62-12.387-5.114-21.768-13.671-23.123-27.735zm66.697 37.972c20.497-.022 40.461-4.643 59.246-12.356l-1.519-3.7c-18.387 7.549-37.836 12.034-57.732 12.056zm59.246-12.356c13.564-5.569 24.862-13.543 36.997-20.715l-2.036-3.444c-12.489 7.382-23.272 15.036-36.48 20.459z"
        />
      </svg>
    </div>
  );
}

export function HomePage() {
  usePageMeta("home");

  return (
    <div className="home">
      <div className="home-scene" aria-label="סלון מיטל">
        <img
          className="home-scene__bg"
          src={ASSETS.salon}
          alt="הסלון של מיטל נומרולוגית"
          fetchPriority="high"
          data-home-item="bg"
        />

        <Item className="home-item--portrait" preset="revealTop">
          <Link to={ROUTES.about} aria-label="אודות" className="home-hotspot">
            <img src={ASSETS.portraitHome} alt="תמונה" />
          </Link>
        </Item>

        <Item className="home-item--chair-l" preset="slideLeft">
          <img src={ASSETS.chairLeft} alt="" aria-hidden="true" className="decorative-overlay" />
        </Item>
        <Item className="home-item--chair-r" preset="slideRight">
          <img src={ASSETS.chairRight} alt="" aria-hidden="true" className="decorative-overlay" />
        </Item>

        <Item className="home-item--plant" delay={0.2}>
          <Link to={ROUTES.consultation} className="home-hotspot" aria-label="ייעוץ">
            <img src={ASSETS.plant} alt="עציץ" />
          </Link>
        </Item>

        <Link to={ROUTES.consultation} className="home-label home-label--consult" data-home-item="consult-label">
          ייעוץ
        </Link>

        <p className="home-label home-label--gift" data-home-item="gift-label">
          שובר מתנה
        </p>

        <GiftArrow />

        <Item className="home-item--gift" delay={0.26}>
          <Link to={ROUTES.gift} className="home-hotspot" aria-label="שובר מתנה">
            <img src={ASSETS.giftCardHome} alt="שובר מתנה" />
          </Link>
        </Item>

        <Item className="home-item--workshops" delay={0.3}>
          <Link to={ROUTES.workshops} className="home-hotspot">
            <img src={ASSETS.workshopsCircle} alt="סדנאות" />
          </Link>
        </Item>

        <Item className="home-item--phone" preset="bounceTop" delay={3.4}>
          <Link to={ROUTES.contact} className="home-hotspot">
            <img src={ASSETS.contactOrb} alt="צרו קשר" />
          </Link>
        </Item>

        <Item className="home-item--books" delay={0.4}>
          <Link to={ROUTES.testimonials} className="home-hotspot">
            <img src={ASSETS.bookRecs} alt="קישור להמלצות" />
          </Link>
        </Item>

        <Item className="home-item--logo" delay={0.45}>
          <Link to={ROUTES.home} className="home-hotspot" aria-label="מיטל גוטמן שקד - עמוד הבית">
            <img src={ASSETS.logo} alt="מיטל גוטמן שקד- מספרת נומרולוגיה לוגו" />
          </Link>
        </Item>
      </div>

      <section className="home-title-band" data-home-item="title-band" aria-label="כותרת">
        <h1 className="home-title" data-home-item="title">
          מיטל גוטמן שקד נומרולוגית
        </h1>
      </section>

      <aside className="home-social" aria-label="רשתות חברתיות">
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="home-social__fb"
          data-home-item="facebook"
        >
          <img src={ASSETS.socialFacebook} alt="" width={57} height={57} decoding="async" />
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Whatsapp"
          className="home-social__wa"
          data-home-item="whatsapp"
        >
          <img src={ASSETS.socialWhatsapp} alt="" width={57} height={57} decoding="async" />
        </a>
      </aside>
    </div>
  );
}
