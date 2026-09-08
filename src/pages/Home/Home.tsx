import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ASSETS, FACEBOOK_URL, ROUTES, WHATSAPP_URL } from "../../data/site";
import { usePageMeta } from "../../hooks/usePageMeta";
import "./Home.css";

function Item({
  className,
  delay = 0,
  children,
}: {
  className: string;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <div className={`home-item ${className}`} data-home-item={className.replace("home-item--", "")}>
      <motion.div
        className="home-item__motion"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
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

        <Item className="home-item--portrait" delay={0.06}>
          <Link to={ROUTES.about} aria-label="אודות" className="home-hotspot">
            <img src={ASSETS.portraitHome} alt="תמונה" />
          </Link>
        </Item>

        <Item className="home-item--chair-l" delay={0.12}>
          <img src={ASSETS.chairLeft} alt="" aria-hidden="true" className="decorative-overlay" />
        </Item>
        <Item className="home-item--chair-r" delay={0.14}>
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

        <Item className="home-item--phone" delay={0.36}>
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
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
              fill="currentColor"
              d="M13.5 22v-8.1h2.7l.4-3.1h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.7V4.5c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4v3.1h2.7V22h3.4z"
            />
          </svg>
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Whatsapp"
          className="home-social__wa"
          data-home-item="whatsapp"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12.04 2c-5.5 0-9.96 4.45-9.96 9.93 0 1.75.46 3.45 1.34 4.95L2 22l5.27-1.38a9.96 9.96 0 0 0 4.77 1.24h.01c5.49 0 9.95-4.46 9.95-9.95C22 6.45 17.54 2 12.04 2zm5.79 14.2c-.24.68-1.4 1.25-1.93 1.33-.5.07-1.12.1-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.25-4.76-4.15-4.9-4.34-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.36.26-.28.57-.35.76-.35h.55c.17 0 .41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.1.19-.14.31-.28.48-.14.17-.3.37-.42.5-.14.14-.28.29-.12.56.16.28.71 1.17 1.53 1.9 1.05.93 1.94 1.22 2.21 1.36.28.14.44.12.6-.07.17-.19.7-.81.89-1.09.19-.28.38-.23.64-.14.26.1 1.66.78 1.94.92.28.14.47.21.54.33.07.11.07.66-.17 1.34z"
            />
          </svg>
        </a>
      </aside>

      <Link
        to={ROUTES.accessibility}
        aria-label="הצהרת נגישות"
        className="home-a11y"
        data-home-item="a11y"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <circle cx="12" cy="4" r="2" fill="currentColor" />
          <path
            fill="currentColor"
            d="M19 9h-4.5l-.7-2.1A2 2 0 0 0 12 5.5h0a2 2 0 0 0-1.8 1.4L9.5 9H5a1 1 0 0 0 0 2h3.2l-.4 1.3L5.5 18a1 1 0 1 0 1.9.6l2.1-5.1h2.9l2.1 5.1a1 1 0 1 0 1.9-.6l-2.3-5.7L15.8 11H19a1 1 0 0 0 0-2z"
          />
        </svg>
      </Link>
    </div>
  );
}
