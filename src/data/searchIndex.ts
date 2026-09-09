import { FOOTER_LEGAL, NAV_ITEMS, ROUTES } from "./site";
import { pageMeta } from "./content";

export type SearchEntry = {
  id: string;
  title: string;
  description: string;
  path: string;
  keywords: string[];
};

function entry(
  id: keyof typeof pageMeta,
  title: string,
  extraKeywords: string[] = [],
): SearchEntry {
  const meta = pageMeta[id];
  return {
    id,
    title,
    description: meta.description,
    path: meta.path,
    keywords: [title, meta.title, meta.description, ...extraKeywords],
  };
}

/** Pages + labels users can find from site search */
export const SEARCH_INDEX: SearchEntry[] = [
  entry("home", "בית", ["ראשי", "סלון", "נומרולוגיה", "מיטל"]),
  entry("about", "אודות", ["מיטל", "סיפור", "אודותיי"]),
  entry("workshops", "סדנאות", ["הרצאה", "ארועי חברה", "ריטריט", "מסיבת רווקות"]),
  entry("consultation", "ייעוץ וטיפול", ["ייעוץ", "טיפול", "מפה נומרולוגית"]),
  entry("gift", "שובר מתנה", ["מתנה", "שובר", "gift"]),
  entry("testimonials", "המלצות", ["ביקורות", "לקוחות"]),
  entry("contact", "צור קשר", ["טלפון", "וואטסאפ", "מייל"]),
  entry("accessibility", "הצהרת נגישות", ["נגישות", "accessibility"]),
  entry("privacy", "מדיניות פרטיות", ["פרטיות", "privacy"]),
];

export function searchSite(query: string): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return SEARCH_INDEX;

  return SEARCH_INDEX.filter((item) => {
    const hay = [item.title, item.description, item.path, ...item.keywords]
      .join(" ")
      .toLowerCase();
    return hay.includes(q) || q.split(/\s+/).every((part) => hay.includes(part));
  });
}

export const SEARCHABLE_ROUTES = [
  ROUTES.home,
  ROUTES.about,
  ROUTES.workshops,
  ROUTES.consultation,
  ROUTES.gift,
  ROUTES.testimonials,
  ROUTES.contact,
  ROUTES.accessibility,
  ROUTES.privacy,
] as const;

export const SEARCH_NAV_LABELS = NAV_ITEMS.map((i) => i.label);
export const SEARCH_LEGAL_LABELS = FOOTER_LEGAL.map((i) => i.label);
